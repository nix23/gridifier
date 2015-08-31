/* Gridifier v1.~.~ source file for custom build.
 * Async Responsive HTML Grids
 * http://gridifier.io
 * 
 * Gridifier is dual-licensed:
 *   GPLV3 per non-commercial usage; 
 *   Commercial license per commercial usage.
 * Read http://gridifier.io/license for details.
 * Copyright 2015 nTech
 */

Gridifier.Operations.Queue = function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
    var n = this;
    this._gridSizesUpdater = null;
    this._collector = null;
    this._connections = null;
    this._connectionsSorter = null;
    this._guid = null;
    this._settings = null;
    this._prepender = null;
    this._reversedPrepender = null;
    this._appender = null;
    this._reversedAppender = null;
    this._sizesTransformer = null;
    this._sizesResolverManager = null;
    this._eventEmitter = null;
    this._operationsQueue = null;
    this._queuedOperations = [];
    this._isWaitingForTransformerQueueRelease = false;
    this._prependOperation = null;
    this._appendOperation = null;
    this._css = {};
    this._construct = function() {
        n._gridSizesUpdater = a;
        n._collector = b;
        n._connections = c;
        n._connectionsSorter = d;
        n._guid = e;
        n._settings = f;
        n._prepender = g;
        n._reversedPrepender = h;
        n._appender = i;
        n._reversedAppender = j;
        n._sizesTransformer = k;
        n._sizesResolverManager = l;
        n._eventEmitter = m;
        n._prependOperation = new Gridifier.Operations.Prepend(n._gridSizesUpdater, n._collector, n._guid, n._settings, n._prepender, n._reversedPrepender, n._sizesResolverManager, n._eventEmitter);
        n._appendOperation = new Gridifier.Operations.Append(n._gridSizesUpdater, n._collector, n._connections, n._connectionsSorter, n._guid, n._settings, n._appender, n._reversedAppender, n._sizesTransformer, n._sizesResolverManager, n._eventEmitter);
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        n._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.Operations.Queue.QUEUED_OPERATION_TYPES = {
    PREPEND: 0,
    APPEND: 1,
    INSERT_BEFORE: 2,
    INSERT_AFTER: 3
};

Gridifier.Operations.Queue.PROCESS_QUEUED_OPERATIONS_TIMEOUT = 100;

Gridifier.Operations.Queue.DEFAULT_BATCH_TIMEOUT = 100;

Gridifier.Operations.Queue.prototype._scheduleOperation = function(a, b, c, d, e, f) {
    var g = this;
    var h = function(a, b) {
        setTimeout(function() {
            if (g._sizesTransformer.isTransformerQueueEmpty()) {
                e(a, b);
            } else {
                g._queuedOperations.push({
                    queuedOperationType: f,
                    items: a,
                    beforeItem: b,
                    afterItem: b
                });
                if (g._isWaitingForTransformerQueueRelease) return;
                setTimeout(function() {
                    g._isWaitingForTransformerQueueRelease = true;
                    g._processQueuedOperations.call(g);
                }, Gridifier.Operations.Queue.PROCESS_QUEUED_OPERATIONS_TIMEOUT);
            }
        }, 0);
    };
    if (typeof c == "undefined") {
        h.call(g, a, b);
        return;
    }
    var d = d || Gridifier.Operations.Queue.DEFAULT_BATCH_TIMEOUT;
    var i = this._packItemsToBatches(a, c);
    for (var j = 0; j < i.length; j++) {
        (function(a, c) {
            setTimeout(function() {
                h.call(g, a, b);
            }, d * c);
        })(i[j], j);
    }
};

Gridifier.Operations.Queue.prototype.schedulePrependOperation = function(a, b, c) {
    var d = this;
    this._scheduleOperation(a, null, b, c, function(a) {
        d._executePrependOperation.call(d, a);
    }, Gridifier.Operations.Queue.QUEUED_OPERATION_TYPES.PREPEND);
};

Gridifier.Operations.Queue.prototype.scheduleAppendOperation = function(a, b, c) {
    var d = this;
    this._scheduleOperation(a, null, b, c, function(a) {
        d._executeAppendOperation.call(d, a);
    }, Gridifier.Operations.Queue.QUEUED_OPERATION_TYPES.APPEND);
};

Gridifier.Operations.Queue.prototype.scheduleInsertBeforeOperation = function(a, b, c, d) {
    var e = this;
    this._scheduleOperation(a, b, c, d, function(a, b) {
        e._executeInsertBeforeOperation.call(e, a, b);
    }, Gridifier.Operations.Queue.QUEUED_OPERATION_TYPES.INSERT_BEFORE);
};

Gridifier.Operations.Queue.prototype.scheduleInsertAfterOperation = function(a, b, c, d) {
    var e = this;
    this._scheduleOperation(a, b, c, d, function(a, b) {
        e._executeInsertAfterOperation.call(e, a, b);
    }, Gridifier.Operations.Queue.QUEUED_OPERATION_TYPES.INSERT_AFTER);
};

Gridifier.Operations.Queue.prototype._packItemsToBatches = function(a, b) {
    var a = this._collector.toDOMCollection(a);
    return this.splitItemsToBatches(a, b);
};

Gridifier.Operations.Queue.prototype.splitItemsToBatches = function(a, b) {
    var c = [];
    var d = 0;
    var e = [];
    var f = false;
    for (var g = 0; g < a.length; g++) {
        e.push(a[g]);
        f = false;
        d++;
        if (d == b) {
            c.push(e);
            e = [];
            f = true;
            d = 0;
        }
    }
    if (!f) c.push(e);
    return c;
};

Gridifier.Operations.Queue.prototype._processQueuedOperations = function() {
    var a = this;
    var b = true;
    for (var c = 0; c < this._queuedOperations.length; c++) {
        if (!this._sizesTransformer.isTransformerQueueEmpty()) {
            setTimeout(function() {
                a._processQueuedOperations.call(a);
            }, Gridifier.Operations.Queue.PROCESS_QUEUED_OPERATIONS_TIMEOUT);
            b = false;
            break;
        }
        var d = Gridifier.Operations.Queue.QUEUED_OPERATION_TYPES;
        if (this._queuedOperations[c].queuedOperationType == d.APPEND) {
            this._executeAppendOperation(this._queuedOperations[c].items);
        } else if (this._queuedOperations[c].queuedOperationType == d.PREPEND) {
            this._executePrependOperation(this._queuedOperations[c].items);
        } else if (this._queuedOperations[c].queuedOperationType == d.INSERT_BEFORE) {
            this._executeInsertBeforeOperation(this._queuedOperations[c].items, this._queuedOperations[c].beforeItem);
        } else if (this._queuedOperations[c].queuedOperationType == d.INSERT_AFTER) {
            this._executeInsertAfterOperation(this._queuedOperations[c].items, this._queuedOperations[c].afterItem);
        } else {
            var e = this._queuedOperations[c].queuedOperationType;
            throw new Error("Unknown queued operation type = '" + e + "'");
        }
        this._queuedOperations.shift();
        c--;
    }
    if (b) this._isWaitingForTransformerQueueRelease = false;
};

Gridifier.Operations.Queue.prototype._executePrependOperation = function(a) {
    this._prependOperation.execute(a);
};

Gridifier.Operations.Queue.prototype._executeAppendOperation = function(a) {
    this._appendOperation.execute(a);
};

Gridifier.Operations.Queue.prototype._executeInsertBeforeOperation = function(a, b) {
    this._appendOperation.executeInsertBefore(a, b);
};

Gridifier.Operations.Queue.prototype._executeInsertAfterOperation = function(a, b) {
    this._appendOperation.executeInsertAfter(a, b);
};

Gridifier.Operations.Queue.prototype.scheduleAsyncFnExecutionByBatches = function(a, b, c, d) {
    var e = this.splitItemsToBatches(a, b);
    c = typeof c != "undefined" ? c : Gridifier.Operations.Queue.DEFAULT_BATCH_TIMEOUT;
    for (var f = 0; f < e.length; f++) {
        (function(a, b) {
            setTimeout(function() {
                d(a);
            }, c * b);
        })(e[f], f);
    }
};