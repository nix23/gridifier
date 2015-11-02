/* Gridifier v2.~.~ source file for custom build.
 * Async Responsive HTML Grids
 * http://gridifier.io
 * 
 * Gridifier is dual-licensed:
 *   GPLV3 per non-commercial usage; 
 *   Commercial license per commercial usage.
 * Read http://gridifier.io/license for details.
 * Copyright 2015 nTech
 */

var RepositionQueue = function() {
    this._queue = null;
    this._nextBatchTimeout = null;
    this._queueData = null;
    this._repositionStart = {
        gridX2: 0,
        gridY2: 0,
        vpWidth: null,
        vpHeight: null
    };
};

proto(RepositionQueue, {
    isEmpty: function() {
        return this._nextBatchTimeout == null;
    },
    init: function(a, b) {
        this._queue = [];
        this._queueData = [];
        for (var c = 0; c < b.length; c++) this._queue.push({
            item: a[c],
            cn: b[c]
        });
    },
    stop: function() {
        clearTimeout(this._nextBatchTimeout);
        this._nextBatchTimeout = null;
        return {
            queue: this._queue,
            queueData: this._queueData
        };
    },
    start: function() {
        this._repositionStart = {
            gridX2: grid.x2(),
            gridY2: grid.y2(),
            vpWidth: srManager.viewportWidth(),
            vpHeight: srManager.viewportHeight()
        };
        this._repositionNextBatch();
    },
    getQueued: function() {
        return this._queue;
    },
    _isSameRepositionProcess: function() {
        var a = true;
        if (settings.eq("grid", "vertical")) {
            if (this._repositionStart.gridX2 != grid.x2()) a = false;
            if (this._repositionStart.vpWidth != srManager.viewportWidth()) a = false;
        } else {
            if (this._repositionStart.gridY2 != grid.y2()) a = false;
            if (this._repositionStart.vpHeight != srManager.viewportHeight()) a = false;
        }
        return a;
    },
    _repositionNextBatch: function(a) {
        var b = settings.get("queueSize");
        if (b > this._queue.length) b = this._queue.length;
        srManager.startCachingTransaction();
        var c = a || false;
        if (c && !this._isSameRepositionProcess()) {
            srManager.stopCachingTransaction();
            return;
        }
        this._execNextBatchReposition(b);
        this._processQueue(b);
    },
    _execNextBatchReposition: function(a) {
        var b = [];
        for (var c = 0; c < a; c++) {
            this._repositionItem(this._queue[c].item);
            crsCleaner["rmIntFrom" + (settings.eq("grid", "vertical") ? "Bottom" : "Right")]();
            b.push(guid.get(this._queue[c].item));
        }
        srManager.stopCachingTransaction();
        var d = cnsCore.getByGUIDS(b);
        cssManager.emitEvents(d);
        renderer.renderRepositioned(d);
    },
    _processQueue: function(a) {
        this._queueData = this._queueData.concat(this._queue.splice(0, a));
        if (this._queue.length == 0) {
            ev.emitInternal(INT_EV.REPOSITION_END_FOR_DRAG);
            ev.emit(EV.REPOSITION_END);
            this._nextBatchTimeout = null;
            return;
        }
        this._scheduleNextBatchReposition();
    },
    _scheduleNextBatchReposition: function() {
        var a = this;
        this._nextBatchTimeout = setTimeout(function() {
            a._repositionNextBatch.call(a, true);
        }, settings.get("queueDelay"));
    },
    _repositionItem: function(a) {
        if (settings.eq("append", "reversed")) {
            reversedAppender.position(a);
        } else {
            appender.position(a);
        }
    }
});