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

Gridifier.SizesTransformer.Core = function(a, b, c, d, e, f, g, h, i, j, k, l, m) {
    var n = this;
    this._gridifier = null;
    this._settings = null;
    this._collector = null;
    this._connectors = null;
    this._connections = null;
    this._connectionsSorter = null;
    this._guid = null;
    this._appender = null;
    this._reversedAppender = null;
    this._normalizer = null;
    this._operation = null;
    this._sizesResolverManager = null;
    this._eventEmitter = null;
    this._connectorsCleaner = null;
    this._connectorsSelector = null;
    this._transformerConnectors = null;
    this._transformedConnectionsSorter = null;
    this._itemNewPxSizesFinder = null;
    this._transformedItemMarker = null;
    this._itemsToReappendFinder = null;
    this._itemsReappender = null;
    this._emptySpaceNormalizer = null;
    this._css = {};
    this._construct = function() {
        n._gridifier = a;
        n._settings = b;
        n._collector = c;
        n._connectors = d;
        n._connections = e;
        n._connectionsSorter = f;
        n._guid = g;
        n._appender = h;
        n._reversedAppender = i;
        n._normalizer = j;
        n._operation = k;
        n._sizesResolverManager = l;
        n._eventEmitter = m;
        if (n._settings.isVerticalGrid()) {
            n._connectorsCleaner = new Gridifier.VerticalGrid.ConnectorsCleaner(n._connectors, n._connections, n._settings);
        } else if (n._settings.isHorizontalGrid()) {
            n._connectorsCleaner = new Gridifier.HorizontalGrid.ConnectorsCleaner(n._connectors, n._connections, n._settings);
        }
        n._connectorsSelector = new Gridifier.VerticalGrid.ConnectorsSelector(n._guid);
        n._transformedConnectionsSorter = new Gridifier.SizesTransformer.TransformedConnectionsSorter(n._connectionsSorter);
        n._itemNewPxSizesFinder = new Gridifier.SizesTransformer.ItemNewPxSizesFinder(n._gridifier, n._collector, n._connections, n._sizesResolverManager);
        n._transformedItemMarker = new Gridifier.SizesTransformer.TransformedItemMarker();
        n._itemsToReappendFinder = new Gridifier.SizesTransformer.ItemsToReappendFinder(n._connections, n._connectionsSorter, n._settings);
        n._transformerConnectors = new Gridifier.TransformerConnectors(n._gridifier, n._settings, n._connectors, n._connections, n._guid, n._appender, n._reversedAppender, n._normalizer, n, n._connectorsCleaner, n._transformedItemMarker, n._operation);
        n._emptySpaceNormalizer = new Gridifier.SizesTransformer.EmptySpaceNormalizer(n._connections, n._connectors, n._settings);
        n._itemsReappender = new Gridifier.SizesTransformer.ItemsReappender(n._gridifier, n._appender, n._reversedAppender, n._connections, n._connectors, n._connectorsCleaner, n._connectorsSelector, n._transformerConnectors, n._settings, n._guid, n._transformedItemMarker, n._emptySpaceNormalizer, n._sizesResolverManager, n._eventEmitter);
        n._transformerConnectors.setItemsReappenderInstance(n._itemsReappender);
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        n._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.SizesTransformer.RESTRICT_CONNECTION_COLLECT = "restrictConnectionCollect";

Gridifier.SizesTransformer.Core.prototype.isTransformerQueueEmpty = function() {
    return this._itemsReappender.isReappendQueueEmpty();
};

Gridifier.SizesTransformer.Core.prototype.getQueuedConnectionsPerTransform = function() {
    return this._itemsReappender.getQueuedConnectionsPerTransform();
};

Gridifier.SizesTransformer.Core.prototype.transformConnectionSizes = function(a) {
    a = this._transformedConnectionsSorter.sortTransformedConnections(a);
    a = this._itemNewPxSizesFinder.calculateNewPxSizesPerAllTransformedItems(a);
    var b = function() {
        this._guid.unmarkAllPrependedItems();
        this._transformedItemMarker.markEachConnectionItemWithTransformData(a);
        var b = [];
        if (!this._itemsReappender.isReappendQueueEmpty()) {
            var c = this._itemsReappender.stopReappendingQueuedItems();
            for (var d = 0; d < c.reappendQueue.length; d++) {
                var e = c.reappendQueue[d].connectionToReappend;
                if (e[Gridifier.SizesTransformer.RESTRICT_CONNECTION_COLLECT]) continue;
                b.push(e);
            }
        }
        var f = this._itemsToReappendFinder.findAllOnSizesTransform(b, a[0].connectionToTransform);
        var g = f.itemsToReappend;
        var b = f.connectionsToReappend;
        var h = f.firstConnectionToReappend;
        this._transformedItemMarker.markAllTransformDependedItems(g);
        this._transformerConnectors.recreateConnectorsPerFirstItemReappendOnTransform(g[0], h);
        this._itemsReappender.createReappendQueue(g, b);
        this._itemsReappender.startReappendingQueuedItems();
    };
    var c = this;
    setTimeout(function() {
        b.call(c);
    }, 0);
};

Gridifier.SizesTransformer.Core.prototype.stopRetransformAllConnectionsQueue = function() {
    var a = this._connections.get();
    if (!this._itemsReappender.isReappendQueueEmpty()) {
        var b = this._itemsReappender.stopReappendingQueuedItems();
        var c = [];
        for (var d = 0; d < b.reappendedQueueData.length; d++) c.push(b.reappendedQueueData[d].connectionToReappend);
        this._connections.syncConnectionParams(c);
        for (var d = 0; d < b.reappendQueue.length; d++) a.push(b.reappendQueue[d].connectionToReappend);
    }
};

Gridifier.SizesTransformer.Core.prototype.retransformAllConnections = function() {
    this.stopRetransformAllConnectionsQueue();
    var a = this;
    var b = this._connections.get();
    if (b.length == 0) return;
    var c = function() {
        b = this._connectionsSorter.sortConnectionsPerReappend(b);
        this._guid.unmarkAllPrependedItems();
        var a = [];
        var c = [];
        var d = [];
        for (var e = 0; e < b.length; e++) {
            if (!b[e][Gridifier.SizesTransformer.RESTRICT_CONNECTION_COLLECT]) {
                a.push(b[e].item);
                d.push(b[e]);
            } else {
                c.push(b[e]);
            }
        }
        var f = null;
        if (c.length == 0) {
            f = b[0];
            b.splice(0, b.length);
        } else {
            for (var e = 0; e < b.length; e++) {
                var g = true;
                for (var h = 0; h < c.length; h++) {
                    if (c[h].itemGUID == b[e].itemGUID) {
                        g = false;
                        break;
                    }
                }
                if (g) {
                    f = b[e];
                    break;
                }
            }
            b.splice(0, b.length);
            for (var e = 0; e < c.length; e++) b.push(c[e]);
        }
        this._transformedItemMarker.markAllTransformDependedItems(a);
        this._transformerConnectors.recreateConnectorsPerFirstItemReappendOnTransform(f.item, f);
        this._itemsReappender.createReappendQueue(a, d);
        this._itemsReappender.startReappendingQueuedItems();
    };
    var d = this._syncAllScheduledToTransformItemSizes(b);
    if (!d) {
        c.call(this);
    } else {
        var a = this;
        setTimeout(function() {
            c.call(a);
        }, 0);
    }
};

Gridifier.SizesTransformer.Core.prototype._syncAllScheduledToTransformItemSizes = function(a) {
    var b = [];
    for (var c = 0; c < a.length; c++) {
        if (this._transformedItemMarker.isTransformedItem(a[c].item)) {
            var d = this._transformedItemMarker.getTransformedItemTargetRawSizes(a[c].item);
            b.push({
                connectionToTransform: a[c],
                widthToTransform: d.targetRawWidth,
                heightToTransform: d.targetRawHeight
            });
        }
    }
    if (b.length == 0) return false;
    b = this._itemNewPxSizesFinder.calculateNewPxSizesPerAllTransformedItems(b);
    this._transformedItemMarker.markEachConnectionItemWithTransformData(b);
    return true;
};

Gridifier.SizesTransformer.Core.prototype.retransformFrom = function(a) {
    var b = [];
    if (!this._itemsReappender.isReappendQueueEmpty()) {
        var c = this._itemsReappender.stopReappendingQueuedItems();
        for (var d = 0; d < c.reappendQueue.length; d++) {
            var e = c.reappendQueue[d].connectionToReappend;
            if (e[Gridifier.SizesTransformer.RESTRICT_CONNECTION_COLLECT]) continue;
            b.push(e);
        }
    }
    this._guid.unmarkAllPrependedItems();
    var f = this._itemsToReappendFinder.findAllOnSizesTransform(b, a);
    var g = f.itemsToReappend;
    var b = f.connectionsToReappend;
    var h = f.firstConnectionToReappend;
    this._transformedItemMarker.markAllTransformDependedItems(g);
    this._transformerConnectors.recreateConnectorsPerFirstItemReappendOnTransform(g[0], h);
    this._itemsReappender.createReappendQueue(g, b);
    this._itemsReappender.startReappendingQueuedItems();
};

Gridifier.SizesTransformer.Core.prototype.retransformFromFirstSortedConnection = function(a) {
    var b = [];
    if (!this._itemsReappender.isReappendQueueEmpty()) {
        var c = this._itemsReappender.stopReappendingQueuedItems();
        for (var d = 0; d < c.reappendQueue.length; d++) {
            var e = c.reappendQueue[d].connectionToReappend;
            if (e[Gridifier.SizesTransformer.RESTRICT_CONNECTION_COLLECT]) continue;
            b.push(e);
        }
    }
    var f = this._connections.get();
    var g = [];
    for (var d = 0; d < a.length; d++) {
        for (var h = 0; h < f.length; h++) {
            if (this._guid.getItemGUID(f[h].item) == this._guid.getItemGUID(a[d])) {
                g.push(f[h]);
                continue;
            }
        }
        for (var h = 0; h < b.length; h++) {
            if (this._guid.getItemGUID(b[h].item) == this._guid.getItemGUID(a[d])) {
                g.push(b[h]);
                continue;
            }
        }
    }
    var i = this._connectionsSorter.sortConnectionsPerReappend(g);
    var j = i[0];
    this._guid.unmarkAllPrependedItems();
    var k = this._itemsToReappendFinder.findAllOnSizesTransform(b, j);
    var l = k.itemsToReappend;
    var b = k.connectionsToReappend;
    var m = k.firstConnectionToReappend;
    this._transformedItemMarker.markAllTransformDependedItems(l);
    this._transformerConnectors.recreateConnectorsPerFirstItemReappendOnTransform(l[0], m);
    this._itemsReappender.createReappendQueue(l, b);
    this._itemsReappender.startReappendingQueuedItems();
};