"use strict";
const Observable_1 = require("../Observable");
const tryCatch_1 = require("../util/tryCatch");
const errorObject_1 = require("../util/errorObject");
const AsyncSubject_1 = require("../AsyncSubject");
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
class BoundNodeCallbackObservable extends Observable_1.Observable {
    constructor(callbackFunc, selector, args, scheduler) {
        super();
        this.callbackFunc = callbackFunc;
        this.selector = selector;
        this.args = args;
        this.scheduler = scheduler;
    }
    /* tslint:enable:max-line-length */
    /**
     * Converts a Node.js-style callback API to a function that returns an
     * Observable.
     *
     * <span class="informal">It's just like {@link bindCallback}, but the
     * callback is expected to be of type `callback(error, result)`.</span>
     *
     * `bindNodeCallback` is not an operator because its input and output are not
     * Observables. The input is a function `func` with some parameters, but the
     * last parameter must be a callback function that `func` calls when it is
     * done. The callback function is expected to follow Node.js conventions,
     * where the first argument to the callback is an error, while remaining
     * arguments are the callback result. The output of `bindNodeCallback` is a
     * function that takes the same parameters as `func`, except the last one (the
     * callback). When the output function is called with arguments, it will
     * return an Observable where the results will be delivered to.
     *
     * @example <caption>Read a file from the filesystem and get the data as an Observable</caption>
     * import * as fs from 'fs';
     * var readFileAsObservable = Rx.Observable.bindNodeCallback(fs.readFile);
     * var result = readFileAsObservable('./roadNames.txt', 'utf8');
     * result.subscribe(x => console.log(x), e => console.error(e));
     *
     * @see {@link bindCallback}
     * @see {@link from}
     * @see {@link fromPromise}
     *
     * @param {function} func Function with a callback as the last parameter.
     * @param {function} selector A function which takes the arguments from the
     * callback and maps those a value to emit on the output Observable.
     * @param {Scheduler} [scheduler] The scheduler on which to schedule the
     * callbacks.
     * @return {function(...params: *): Observable} A function which returns the
     * Observable that delivers the same values the Node.js callback would
     * deliver.
     * @static true
     * @name bindNodeCallback
     * @owner Observable
     */
    static create(func, selector = undefined, scheduler) {
        return (...args) => {
            return new BoundNodeCallbackObservable(func, selector, args, scheduler);
        };
    }
    _subscribe(subscriber) {
        const callbackFunc = this.callbackFunc;
        const args = this.args;
        const scheduler = this.scheduler;
        let subject = this.subject;
        if (!scheduler) {
            if (!subject) {
                subject = this.subject = new AsyncSubject_1.AsyncSubject();
                const handler = function handlerFn(...innerArgs) {
                    const source = handlerFn.source;
                    const { selector, subject } = source;
                    const err = innerArgs.shift();
                    if (err) {
                        subject.error(err);
                    }
                    else if (selector) {
                        const result = tryCatch_1.tryCatch(selector).apply(this, innerArgs);
                        if (result === errorObject_1.errorObject) {
                            subject.error(errorObject_1.errorObject.e);
                        }
                        else {
                            subject.next(result);
                            subject.complete();
                        }
                    }
                    else {
                        subject.next(innerArgs.length === 1 ? innerArgs[0] : innerArgs);
                        subject.complete();
                    }
                };
                // use named function instance to avoid closure.
                handler.source = this;
                const result = tryCatch_1.tryCatch(callbackFunc).apply(this, args.concat(handler));
                if (result === errorObject_1.errorObject) {
                    subject.error(errorObject_1.errorObject.e);
                }
            }
            return subject.subscribe(subscriber);
        }
        else {
            return scheduler.schedule(dispatch, 0, { source: this, subscriber });
        }
    }
}
exports.BoundNodeCallbackObservable = BoundNodeCallbackObservable;
function dispatch(state) {
    const self = this;
    const { source, subscriber } = state;
    // XXX: cast to `any` to access to the private field in `source`.
    const { callbackFunc, args, scheduler } = source;
    let subject = source.subject;
    if (!subject) {
        subject = source.subject = new AsyncSubject_1.AsyncSubject();
        const handler = function handlerFn(...innerArgs) {
            const source = handlerFn.source;
            const { selector, subject } = source;
            const err = innerArgs.shift();
            if (err) {
                subject.error(err);
            }
            else if (selector) {
                const result = tryCatch_1.tryCatch(selector).apply(this, innerArgs);
                if (result === errorObject_1.errorObject) {
                    self.add(scheduler.schedule(dispatchError, 0, { err: errorObject_1.errorObject.e, subject }));
                }
                else {
                    self.add(scheduler.schedule(dispatchNext, 0, { value: result, subject }));
                }
            }
            else {
                const value = innerArgs.length === 1 ? innerArgs[0] : innerArgs;
                self.add(scheduler.schedule(dispatchNext, 0, { value, subject }));
            }
        };
        // use named function to pass values in without closure
        handler.source = source;
        const result = tryCatch_1.tryCatch(callbackFunc).apply(this, args.concat(handler));
        if (result === errorObject_1.errorObject) {
            subject.error(errorObject_1.errorObject.e);
        }
    }
    self.add(subject.subscribe(subscriber));
}
function dispatchNext(arg) {
    const { value, subject } = arg;
    subject.next(value);
    subject.complete();
}
function dispatchError(arg) {
    const { err, subject } = arg;
    subject.error(err);
}
//# sourceMappingURL=BoundNodeCallbackObservable.js.map