"use strict";
const Immediate_1 = require("../util/Immediate");
const AsyncAction_1 = require("./AsyncAction");
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class AsapAction extends AsyncAction_1.AsyncAction {
    constructor(scheduler, work) {
        super(scheduler, work);
        this.scheduler = scheduler;
        this.work = work;
    }
    requestAsyncId(scheduler, id, delay = 0) {
        // If delay is greater than 0, request as an async action.
        if (delay !== null && delay > 0) {
            return super.requestAsyncId(scheduler, id, delay);
        }
        // Push the action to the end of the scheduler queue.
        scheduler.actions.push(this);
        // If a microtask has already been scheduled, don't schedule another
        // one. If a microtask hasn't been scheduled yet, schedule one now. Return
        // the current scheduled microtask id.
        return scheduler.scheduled || (scheduler.scheduled = Immediate_1.Immediate.setImmediate(scheduler.flush.bind(scheduler, null)));
    }
    recycleAsyncId(scheduler, id, delay = 0) {
        // If delay exists and is greater than 0, recycle as an async action.
        if (delay !== null && delay > 0) {
            return super.recycleAsyncId(scheduler, id, delay);
        }
        // If the scheduler queue is empty, cancel the requested microtask and
        // set the scheduled flag to undefined so the next AsapAction will schedule
        // its own.
        if (scheduler.actions.length === 0) {
            Immediate_1.Immediate.clearImmediate(id);
            scheduler.scheduled = undefined;
        }
        // Return undefined so the action knows to request a new async id if it's rescheduled.
        return undefined;
    }
}
exports.AsapAction = AsapAction;
//# sourceMappingURL=AsapAction.js.map