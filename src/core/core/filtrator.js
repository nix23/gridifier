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

Gridifier.Filtrator = function(a, b, c, d, e, f) {
    var g = this;
    this._gridifier = null;
    this._collector = null;
    this._connections = null;
    this._settings = null;
    this._guid = null;
    this._connectedItemMarker = null;
    this._disconnector = null;
    this._css = {};
    this._construct = function() {
        g._gridifier = a;
        g._collector = b;
        g._connections = c;
        g._settings = d;
        g._guid = e;
        g._connectedItemMarker = new Gridifier.ConnectedItemMarker();
        g._disconnector = f;
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        g._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.Filtrator.prototype.filter = function() {
    var a = this._collector.collect();
    var b = this._collector.collectAllConnectedItems();
    var c = this._collector.collectAllDisconnectedItems();
    var d = this._collector.sortCollection(this._collector.filterCollection(a));
    var e = this._collector.filterCollection(b);
    var f = this._collector.filterCollection(c);
    var g = this._findConnectedItemsToHide(b);
    this._disconnector.disconnect(g);
    this._recreateGUIDS(d);
    this._recreateConnections(d);
};

Gridifier.Filtrator.prototype._findConnectedItemsToHide = function(a) {
    var b = [];
    for (var c = 0; c < a.length; c++) {
        var d = this._collector.filterCollection([ a[c] ]);
        if (d.length == 0) b.push(a[c]);
    }
    return b;
};

Gridifier.Filtrator.prototype._recreateGUIDS = function(a) {
    this._guid.reinit();
    for (var b = 0; b < a.length; b++) {
        this._guid.markNextAppendedItem(a[b]);
    }
};

Gridifier.Filtrator.prototype._recreateConnections = function(a) {
    var b = this._connections.get();
    b.splice(0, b.length);
    if (this._settings.isHorizontalGrid()) {
        this._recreateAllHorizontalGridConnectionsPerReappend(a);
    } else if (this._settings.isVerticalGrid()) {
        this._recreateAllVerticalGridConnectionsPerReappend(a);
    }
};

Gridifier.Filtrator.prototype._recreateAllHorizontalGridConnectionsPerReappend = function(a) {
    var b = 0;
    for (var c = 0; c < a.length; c++) {
        var d = {};
        d.x1 = b;
        d.x2 = b;
        d.y1 = 0;
        d.y2 = 0;
        this._connections.add(a[c], d);
        b++;
    }
};

Gridifier.Filtrator.prototype._recreateAllVerticalGridConnectionsPerReappend = function(a) {
    var b = 0;
    for (var c = 0; c < a.length; c++) {
        var d = {};
        d.x1 = 0;
        d.x2 = 0;
        d.y1 = b;
        d.y2 = b;
        this._connections.add(a[c], d);
        b++;
    }
};