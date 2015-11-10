/* Gridifier v2.~.~ source file for custom build.
 * Async Responsive HTML Grids
 * http://gridifier.io
 * 
 * Gridifier is dual-licensed:
 *   Non-commercial license - https://creativecommons.org/licenses/by-nc-sa/4.0/.
 *   Commercial license - http://gridifier.io/license (Commercial license).
 * Read http://gridifier.io/license for details.
 * Copyright 2015 nTech
 */

var InsertQueue = function() {
    this._queue = [];
    this._isWaitingForRpsQueue = false;
};

proto(InsertQueue, {
    itemsToBatches: function(a, b, c) {
        var c = c || false;
        var a = c ? a : gridItem.toNative(a);
        var d = [];
        var e = 0;
        var f = [];
        var g = false;
        for (var h = 0; h < a.length; h++) {
            f.push(a[h]);
            g = false;
            e++;
            if (e == b) {
                d.push(f);
                f = [];
                g = true;
                e = 0;
            }
        }
        if (!g) d.push(f);
        return d;
    },
    schedule: function(a, b, c, d, e) {
        this._schedule(b, e, c, d, a, this._exec);
    },
    scheduleFnExec: function(a, b, c, d) {
        var c = c || C.INSERT_BATCH_DELAY;
        var e = this.itemsToBatches(a, b);
        for (var f = 0; f < e.length; f++) {
            (function(a, b) {
                setTimeout(function() {
                    d(a);
                }, c * b);
            })(e[f], f);
        }
    },
    _schedule: function(a, b, c, d, e, f) {
        var g = this;
        var h = function(a) {
            setTimeout(function() {
                g._execSchedule.call(g, a, b, e, f);
            }, 0);
        };
        if (typeof c == "undefined") {
            h(a);
            return;
        }
        this.scheduleFnExec(a, c, d, function(a) {
            h(a);
        });
    },
    _execSchedule: function(a, b, c, d) {
        var e = this;
        if (repositionQueue.isEmpty()) d(a, b, c); else {
            e._queue.push({
                op: c,
                items: a,
                targetItem: b
            });
            if (e._isWaitingForRpsQueue) return;
            setTimeout(function() {
                e._isWaitingForRpsQueue = true;
                e._process.call(e);
            }, C.INSERT_QUEUE_DELAY);
        }
    },
    _process: function() {
        var a = this;
        var b = true;
        for (var c = 0; c < this._queue.length; c++) {
            if (!repositionQueue.isEmpty()) {
                setTimeout(function() {
                    a._process.call(a);
                }, C.INSERT_QUEUE_DELAY);
                b = false;
                break;
            }
            var d = this._queue[c];
            this._exec(d.items, d.targetItem, d.op);
            this._queue.shift();
            c--;
        }
        if (b) this._isWaitingForRpsQueue = false;
    },
    _exec: function(a, b, c) {
        if (c == OPS.PREPEND) prependOp.exec(a); else if (c == OPS.APPEND) appendOp.exec(a); else if (c == OPS.INS_BEFORE) appendOp.execInsBefore(a, b); else if (c == OPS.INS_AFTER) appendOp.execInsAfter(a, b); else err("wrong op");
    }
});