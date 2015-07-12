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

Gridifier.VerticalGrid.ConnectionsIntersector = function(a) {
    var b = this;
    this._connections = null;
    this._intersectorCore = null;
    this._css = {};
    this._construct = function() {
        b._connections = a;
        b._intersectorCore = new Gridifier.ConnectionsIntersector(b._connections);
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        b._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.VerticalGrid.ConnectionsIntersector.prototype.isIntersectingAnyConnection = function(a, b) {
    return this._intersectorCore.isIntersectingAnyConnection(a, b);
};

Gridifier.VerticalGrid.ConnectionsIntersector.prototype.getAllConnectionsWithIntersectedCenter = function(a) {
    return this._intersectorCore.getAllConnectionsWithIntersectedCenter(a);
};

Gridifier.VerticalGrid.ConnectionsIntersector.prototype.findAllMaybeIntersectableConnectionsOnAppend = function(a) {
    var b = this._connections.get();
    var c = [];
    for (var d = 0; d < b.length; d++) {
        if (a.y > b[d].y2) continue;
        c.push(b[d]);
    }
    return c;
};

Gridifier.VerticalGrid.ConnectionsIntersector.prototype.findAllMaybeIntersectableConnectionsOnPrepend = function(a) {
    var b = this._connections.get();
    var c = [];
    for (var d = 0; d < b.length; d++) {
        if (a.y < b[d].y1) continue;
        c.push(b[d]);
    }
    return c;
};