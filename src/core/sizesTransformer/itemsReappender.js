/* Gridifier v1.0.0
 * Async Responsive HTML Grids
 * http://gridifier.io
 * 
 * Gridifier is dual-licensed:
 *   GPLV3 per non-commercial usage; 
 *   Commercial license per commercial usage.
 * Read http://gridifier.io/license for details.
 * Copyright 2015 nTech
 */

Gridifier.SizesTransformer.ItemsReappender = function(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
    var o = this;
    this._gridifier = null;
    this._appender = null;
    this._reversedAppender = null;
    this._connections = null;
    this._connectors = null;
    this._connectorsCleaner = null;
    this._connectorsSelector = null;
    this._transformerConnectors = null;
    this._settings = null;
    this._guid = null;
    this._transformedItemMarker = null;
    this._emptySpaceNormalizer = null;
    this._sizesResolverManager = null;
    this._eventEmitter = null;
    this._reappendQueue = null;
    this._reappendNextQueuedItemsBatchTimeout = null;
    this._reappendedQueueData = null;
    this._reappendStartGridX2 = 0;
    this._reappendStartGridY2 = 0;
    this._reappendStartViewportWidth = null;
    this._reappendStartViewportHeight = null;
    this._css = {};
    this._construct = function() {
        o._gridifier = a;
        o._appender = b;
        o._reversedAppender = c;
        o._connections = d;
        o._connectors = e;
        o._connectorsCleaner = f;
        o._connectorsSelector = g;
        o._transformerConnectors = h;
        o._settings = i;
        o._guid = j;
        o._transformedItemMarker = k;
        o._emptySpaceNormalizer = l;
        o._sizesResolverManager = m;
        o._eventEmitter = n;
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        o._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.SizesTransformer.ItemsReappender.prototype.isReversedAppendShouldBeUsedPerItemInsert = function(a) {
    if (this._settings.isDefaultAppend()) return false; else if (this._settings.isReversedAppend()) return true;
};

Gridifier.SizesTransformer.ItemsReappender.prototype.createReappendQueue = function(a, b) {
    this._reappendQueue = [];
    this._reappendedQueueData = [];
    for (var c = 0; c < b.length; c++) {
        this._reappendQueue.push({
            itemToReappend: a[c],
            connectionToReappend: b[c]
        });
    }
};

Gridifier.SizesTransformer.ItemsReappender.prototype.isReappendQueueEmpty = function() {
    return this._reappendNextQueuedItemsBatchTimeout == null ? true : false;
};

Gridifier.SizesTransformer.ItemsReappender.prototype.stopReappendingQueuedItems = function() {
    clearTimeout(this._reappendNextQueuedItemsBatchTimeout);
    this._reappendNextQueuedItemsBatchTimeout = null;
    return {
        reappendQueue: this._reappendQueue,
        reappendedQueueData: this._reappendedQueueData
    };
};

Gridifier.SizesTransformer.ItemsReappender.prototype.getQueuedConnectionsPerTransform = function() {
    var a = [];
    for (var b = 0; b < this._reappendQueue.length; b++) {
        a.push(this._reappendQueue[b].connectionToReappend);
    }
    return a;
};

Gridifier.SizesTransformer.ItemsReappender.prototype.startReappendingQueuedItems = function() {
    this._reappendStartGridX2 = this._gridifier.getGridX2();
    this._reappendStartGridY2 = this._gridifier.getGridY2();
    this._reappendStartViewportWidth = this._sizesResolverManager.viewportWidth();
    this._reappendStartViewportHeight = this._sizesResolverManager.viewportHeight();
    this._reappendNextQueuedItemsBatch();
};

Gridifier.SizesTransformer.ItemsReappender.prototype._reappendNextQueuedItemsBatch = function(a) {
    var b = this._settings.getRetransformQueueBatchSize();
    if (b > this._reappendQueue.length) b = this._reappendQueue.length;
    this._sizesResolverManager.startCachingTransaction();
    var c = a || false;
    var d = true;
    if (c) {
        if (this._settings.isVerticalGrid()) {
            if (this._reappendStartGridX2 != this._gridifier.getGridX2()) d = false;
            if (this._sizesResolverManager.viewportWidth() != this._reappendStartViewportWidth) d = false;
        } else if (this._settings.isHorizontalGrid()) {
            if (this._reappendStartGridY2 != this._gridifier.getGridY2()) {
                d = false;
            }
            if (this._sizesResolverManager.viewportHeight() != this._reappendStartViewportHeight) d = false;
        }
    }
    if (!d) {
        this._sizesResolverManager.stopCachingTransaction();
        return;
    }
    var e = [];
    for (var f = 0; f < b; f++) {
        var g = this._reappendQueue[f].itemToReappend;
        if (this.isReversedAppendShouldBeUsedPerItemInsert(g)) var h = Gridifier.APPEND_TYPES.REVERSED_APPEND; else var h = Gridifier.APPEND_TYPES.DEFAULT_APPEND;
        this._reappendItem(h, g);
        if (this._settings.isVerticalGrid()) this._connectorsCleaner.deleteAllIntersectedFromBottomConnectors(); else if (this._settings.isHorizontalGrid()) this._connectorsCleaner.deleteAllIntersectedFromRightConnectors();
        e.push(this._guid.getItemGUID(g));
    }
    this._sizesResolverManager.stopCachingTransaction();
    var i = this._connections.getConnectionsByItemGUIDS(e);
    this._gridifier.getResponsiveClassesManager().emitTransformEvents(i);
    this._gridifier.getRenderer().renderTransformedConnections(i);
    this._reappendedQueueData = this._reappendedQueueData.concat(this._reappendQueue.splice(0, b));
    if (this._reappendQueue.length == 0) {
        this._eventEmitter.emitItemsReappendExecutionEndPerDragifier();
        this._eventEmitter.emitGridRetransformEvent();
        this._reappendNextQueuedItemsBatchTimeout = null;
        return;
    }
    var j = this;
    var k = this._settings.getRetransformQueueBatchTimeout();
    this._reappendNextQueuedItemsBatchTimeout = setTimeout(function() {
        j._reappendNextQueuedItemsBatch.call(j, true);
    }, k);
};

Gridifier.SizesTransformer.ItemsReappender.prototype._reappendItem = function(a, b) {
    if (a == Gridifier.APPEND_TYPES.REVERSED_APPEND) {
        this._reversedAppender.reversedAppend(b);
    } else if (a == Gridifier.APPEND_TYPES.DEFAULT_APPEND) {
        this._appender.append(b);
    }
};