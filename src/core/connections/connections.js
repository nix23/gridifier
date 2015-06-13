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

Gridifier.Connections = function(a, b, c, d, e) {
    var f = this;
    this._gridifier = null;
    this._connections = null;
    this._guid = null;
    this._sizesTransformer = null;
    this._connectionsSorter = null;
    this._sizesResolverManager = null;
    this._connectedItemMarker = null;
    this._css = {};
    this._construct = function() {
        f._gridifier = a;
        f._connections = b;
        f._guid = c;
        f._connectionsSorter = d;
        f._sizesResolverManager = e;
        f._connectedItemMarker = new Gridifier.ConnectedItemMarker();
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        f._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.Connections.prototype.getMaxX2 = function() {
    var a = this._connections.get();
    if (a.length == 0) return 0;
    var b = 0;
    for (var c = 0; c < a.length; c++) {
        if (a[c].x2 > b) b = a[c].x2;
    }
    return b;
};

Gridifier.Connections.prototype.getMaxY2 = function() {
    var a = this._connections.get();
    if (a.length == 0) return 0;
    var b = 0;
    for (var c = 0; c < a.length; c++) {
        if (a[c].y2 > b) b = a[c].y2;
    }
    return b;
};

Gridifier.Connections.prototype.setSizesTransformerInstance = function(a) {
    this._sizesTransformer = a;
};

Gridifier.Connections.prototype.findConnectionByItem = function(a, b) {
    var c = this._connections.get();
    if (!b) {
        if (c.length == 0) new Gridifier.Error(Gridifier.Error.ERROR_TYPES.CONNECTIONS.NO_CONNECTIONS);
    }
    var d = this._guid.getItemGUID(a);
    var e = null;
    for (var f = 0; f < c.length; f++) {
        if (d == c[f].itemGUID) {
            e = c[f];
            break;
        }
    }
    if (e == null) {
        if (!this._sizesTransformer.isTransformerQueueEmpty()) {
            var g = this._sizesTransformer.getQueuedConnectionsPerTransform();
            for (var f = 0; f < g.length; f++) {
                if (d == g[f].itemGUID) {
                    e = g[f];
                    break;
                }
            }
        }
    }
    if (!b) {
        if (e == null) {
            new Gridifier.Error(Gridifier.Error.ERROR_TYPES.CONNECTIONS.CONNECTION_BY_ITEM_NOT_FOUND, {
                item: a,
                connections: c
            });
        }
    }
    return e;
};

Gridifier.Connections.prototype.remapAllItemGUIDS = function() {
    this._guid.reinit();
    var a = this._connectionsSorter.sortConnectionsPerReappend(this._connections.get());
    for (var b = 0; b < a.length; b++) {
        var c = this._guid.markNextAppendedItem(a[b].item);
        a[b].itemGUID = c;
    }
};

Gridifier.Connections.prototype.remapAllItemGUIDSInSortedConnections = function(a) {
    for (var b = 0; b < a.length; b++) {
        var c = this._guid.markNextAppendedItem(a[b].item);
        a[b].itemGUID = c;
    }
};

Gridifier.Connections.prototype.getConnectionsByItemGUIDS = function(a) {
    var b = this._connections.get();
    var c = [];
    for (var d = 0; d < b.length; d++) {
        for (var e = 0; e < a.length; e++) {
            if (b[d].itemGUID == a[e]) {
                c.push(b[d]);
                break;
            }
        }
    }
    return c;
};

Gridifier.Connections.prototype.createItemConnection = function(a, b) {
    var c = b;
    b.x1 = Dom.toFixed(b.x1, 2);
    b.x2 = Dom.toFixed(b.x2, 2);
    b.y1 = Dom.toFixed(b.y1, 2);
    b.y2 = Dom.toFixed(b.y2, 2);
    c.item = a;
    c.itemGUID = Dom.toInt(this._guid.getItemGUID(a));
    if (!c.hasOwnProperty("horizontalOffset")) c.horizontalOffset = 0;
    if (!c.hasOwnProperty("verticalOffset")) c.verticalOffset = 0;
    if (!c.hasOwnProperty(Gridifier.SizesTransformer.RESTRICT_CONNECTION_COLLECT)) c[Gridifier.SizesTransformer.RESTRICT_CONNECTION_COLLECT] = false;
    if (!this._connectedItemMarker.isItemConnected(a)) this._connectedItemMarker.markItemAsConnected(a);
    return c;
};

Gridifier.Connections.prototype.syncConnectionParams = function(a) {
    var b = this._connections.get();
    for (var c = 0; c < a.length; c++) {
        for (var d = 0; d < b.length; d++) {
            if (b[d].itemGUID == a[c].itemGUID) {
                var e = Gridifier.SizesTransformer.RESTRICT_CONNECTION_COLLECT;
                b[d][e] = a[c][e];
                b[d].verticalOffset = a[c].verticalOffset;
                b[d].horizontalOffset = a[c].horizontalOffset;
                b[d].x1 = a[c].x1;
                b[d].x2 = a[c].x2;
                b[d].y1 = a[c].y1;
                b[d].y2 = a[c].y2;
                break;
            }
        }
    }
};

Gridifier.Connections.prototype.getMinConnectionWidth = function() {
    var a = this._connections.get();
    if (a.length == 0) return 0;
    var b = this;
    var c = this._gridifier.getGridX2();
    var d = function(d) {
        if (a[d].x1 >= a[d].x2 || a[d].x1 < 0 || a[d].x2 > c) {
            var e = b._sizesResolverManager.outerWidth(a[d].item, true);
        } else {
            var e = a[d].x2 - a[d].x1 + 1;
        }
        return e;
    };
    var e = d(0);
    for (var f = 1; f < a.length; f++) {
        var g = d(f);
        if (g < e) e = g;
    }
    return e;
};

Gridifier.Connections.prototype.getMinConnectionHeight = function() {
    var a = this._connections.get();
    if (a.length == 0) return 0;
    var b = this;
    var c = this._gridifier.getGridY2();
    var d = function(d) {
        if (a[d].y1 >= a[d].y2 || a[d].y1 < 0 || a[d].y2 > c) {
            var e = b._sizesResolverManager.outerHeight(a[d].item, true);
        } else {
            var e = a[d].y2 - a[d].y1 + 1;
        }
        return e;
    };
    var e = d(0);
    for (var f = 1; f < a.length; f++) {
        var g = d(f);
        if (g < e) e = g;
    }
    return e;
};

Gridifier.Connections.prototype.isAnyConnectionItemGUIDSmallerThan = function(a, b) {
    var c = this._guid.getItemGUID(b);
    for (var d = 0; d < a.length; d++) {
        var e = this._guid.getItemGUID(a[d].item);
        if (e < c) return true;
    }
    return false;
};

Gridifier.Connections.prototype.isAnyConnectionItemGUIDBiggerThan = function(a, b) {
    var c = this._guid.getItemGUID(b);
    for (var d = 0; d < a.length; d++) {
        var e = this._guid.getItemGUID(a[d].item);
        if (e > c) return true;
    }
    return false;
};