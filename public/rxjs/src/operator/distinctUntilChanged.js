"use strict";
const Subscriber_1 = require("../Subscriber");
const tryCatch_1 = require("../util/tryCatch");
const errorObject_1 = require("../util/errorObject");
/**
 * Returns an Observable that emits all items emitted by the source Observable that are distinct by comparison from the previous item.
 * If a comparator function is provided, then it will be called for each item to test for whether or not that value should be emitted.
 * If a comparator function is not provided, an equality check is used by default.
 * @param {function} [compare] optional comparison function called to test if an item is distinct from the previous item in the source.
 * @return {Observable} an Observable that emits items from the source Observable with distinct values.
 * @method distinctUntilChanged
 * @owner Observable
 */
function distinctUntilChanged(compare, keySelector) {
    return this.lift(new DistinctUntilChangedOperator(compare, keySelector));
}
exports.distinctUntilChanged = distinctUntilChanged;
class DistinctUntilChangedOperator {
    constructor(compare, keySelector) {
        this.compare = compare;
        this.keySelector = keySelector;
    }
    call(subscriber, source) {
        return source._subscribe(new DistinctUntilChangedSubscriber(subscriber, this.compare, this.keySelector));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class DistinctUntilChangedSubscriber extends Subscriber_1.Subscriber {
    constructor(destination, compare, keySelector) {
        super(destination);
        this.keySelector = keySelector;
        this.hasKey = false;
        if (typeof compare === 'function') {
            this.compare = compare;
        }
    }
    compare(x, y) {
        return x === y;
    }
    _next(value) {
        const keySelector = this.keySelector;
        let key = value;
        if (keySelector) {
            key = tryCatch_1.tryCatch(this.keySelector)(value);
            if (key === errorObject_1.errorObject) {
                return this.destination.error(errorObject_1.errorObject.e);
            }
        }
        let result = false;
        if (this.hasKey) {
            result = tryCatch_1.tryCatch(this.compare)(this.key, key);
            if (result === errorObject_1.errorObject) {
                return this.destination.error(errorObject_1.errorObject.e);
            }
        }
        else {
            this.hasKey = true;
        }
        if (Boolean(result) === false) {
            this.key = key;
            this.destination.next(value);
        }
    }
}
//# sourceMappingURL=distinctUntilChanged.js.map