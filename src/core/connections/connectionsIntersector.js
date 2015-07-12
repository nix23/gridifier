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

Gridifier.ConnectionsIntersector = function(a) {
    var b = this;
    this._connections = null;
    this._css = {};
    this._construct = function() {
        b._connections = a;
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        b._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.ConnectionsIntersector.prototype.isIntersectingAnyConnection = function(a, b) {
    for (var c = 0; c < a.length; c++) {
        var d = a[c];
        var e = b.y1 < d.y1 && b.y2 < d.y1;
        var f = b.y1 > d.y2 && b.y2 > d.y2;
        var g = b.x1 < d.x1 && b.x2 < d.x1;
        var h = b.x1 > d.x2 && b.x2 > d.x2;
        if (!e && !f && !g && !h) return true;
    }
    return false;
};

Gridifier.ConnectionsIntersector.prototype.getAllConnectionsWithIntersectedCenter = function(a) {
    var b = this._connections.get();
    var c = [];
    for (var d = 0; d < b.length; d++) {
        var e = b[d].x2 - b[d].x1 + 1;
        var f = b[d].y2 - b[d].y1 + 1;
        var g = {
            x1: b[d].x1 + e / 2,
            x2: b[d].x1 + e / 2,
            y1: b[d].y1 + f / 2,
            y2: b[d].y1 + f / 2
        };
        if (this.isIntersectingAnyConnection([ g ], a)) {
            c.push(b[d]);
        }
    }
    return c;
};