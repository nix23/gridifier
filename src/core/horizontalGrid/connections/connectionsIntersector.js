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

Gridifier.HorizontalGrid.ConnectionsIntersector = function(a) {
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

Gridifier.HorizontalGrid.ConnectionsIntersector.prototype.isIntersectingAnyConnection = function(a, b) {
    return this._intersectorCore.isIntersectingAnyConnection(a, b);
};

Gridifier.HorizontalGrid.ConnectionsIntersector.prototype.getAllConnectionsWithIntersectedCenter = function(a) {
    return this._intersectorCore.getAllConnectionsWithIntersectedCenter(a);
};

Gridifier.HorizontalGrid.ConnectionsIntersector.prototype.findAllMaybeIntersectableConnectionsOnAppend = function(a) {
    var b = this._connections.get();
    var c = [];
    for (var d = 0; d < b.length; d++) {
        if (a.x > b[d].x2) continue;
        c.push(b[d]);
    }
    return c;
};

Gridifier.HorizontalGrid.ConnectionsIntersector.prototype.findAllMaybeIntersectableConnectionsOnPrepend = function(a) {
    var b = this._connections.get();
    var c = [];
    for (var d = 0; d < b.length; d++) {
        if (a.x < b[d].x1) continue;
        c.push(b[d]);
    }
    return c;
};