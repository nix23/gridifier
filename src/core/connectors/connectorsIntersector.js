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

Gridifier.ConnectorsIntersector = function(a, b) {
    var c = this;
    this._connections = null;
    this._settings = null;
    this._css = {};
    this._construct = function() {
        c._connections = a;
        c._settings = b;
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        c._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.ConnectorsIntersector.prototype.getMostLeftFromIntersectedRightItems = function(a) {
    var b = this._connections.get();
    var c = null;
    var d = function(b) {
        if (a.y >= b.y1 && a.y <= b.y2 && a.x < b.x1) {
            if (c == null) c = b; else {
                if (b.x1 < c.x1) c = b;
            }
        }
    };
    if (this._settings.isVerticalGrid()) {
        var e = this._connections.getAllHorizontallyIntersectedConnections(a);
        for (var f = 0; f < e.length; f++) {
            d(b[e[f]]);
        }
    } else if (this._settings.isHorizontalGrid()) {
        var e = this._connections.getAllVerticallyIntersectedAndRightConnections(a);
        for (var f = 0; f < e.length; f++) {
            for (var g = 0; g < e[f].length; g++) {
                d(b[e[f][g]]);
            }
        }
    }
    return c;
};

Gridifier.ConnectorsIntersector.prototype.getMostBottomFromIntersectedTopOrTopLeftItems = function(a) {
    var b = this._connections.get();
    var c = null;
    if (this._settings.isVerticalGrid()) var d = this._connections.getAllHorizontallyIntersectedAndUpperConnections(a); else if (this._settings.isHorizontalGrid()) var d = this._connections.getAllVerticallyIntersectedAndLeftConnections(a);
    for (var e = 0; e < d.length; e++) {
        for (var f = 0; f < d[e].length; f++) {
            var g = b[d[e][f]];
            if ((a.x >= g.x1 && a.x <= g.x2 || a.x > g.x2) && a.y > g.y2) {
                if (c == null) c = g; else {
                    if (g.y2 > c.y2) c = g;
                }
            }
        }
    }
    return c;
};

Gridifier.ConnectorsIntersector.prototype.getMostBottomFromIntersectedTopOrTopRightItems = function(a) {
    var b = this._connections.get();
    var c = null;
    if (this._settings.isVerticalGrid()) var d = this._connections.getAllHorizontallyIntersectedAndUpperConnections(a); else if (this._settings.isHorizontalGrid()) var d = this._connections.getAllVerticallyIntersectedAndRightConnections(a);
    for (var e = 0; e < d.length; e++) {
        for (var f = 0; f < d[e].length; f++) {
            var g = b[d[e][f]];
            if ((a.x >= g.x1 && a.x <= g.x2 || a.x < g.x1) && a.y > g.y2) {
                if (c == null) c = g; else {
                    if (g.y2 > c.y2) c = g;
                }
            }
        }
    }
    return c;
};

Gridifier.ConnectorsIntersector.prototype.getMostRightFromIntersectedLeftItems = function(a) {
    var b = this._connections.get();
    var c = null;
    var d = function(b) {
        if (a.y >= b.y1 && a.y <= b.y2 && a.x > b.x2) {
            if (c == null) c = b; else {
                if (b.x1 > c.x2) c = b;
            }
        }
    };
    if (this._settings.isVerticalGrid()) {
        var e = this._connections.getAllHorizontallyIntersectedConnections(a);
        for (var f = 0; f < e.length; f++) {
            d(b[e[f]]);
        }
    } else if (this._settings.isHorizontalGrid()) {
        var e = this._connections.getAllVerticallyIntersectedAndLeftConnections(a);
        for (var f = 0; f < e.length; f++) {
            for (var g = 0; g < e[f].length; g++) {
                d(b[e[f][g]]);
            }
        }
    }
    return c;
};

Gridifier.ConnectorsIntersector.prototype.getMostTopFromIntersectedBottomOrBottomRightItems = function(a) {
    var b = this._connections.get();
    var c = null;
    if (this._settings.isVerticalGrid()) var d = this._connections.getAllHorizontallyIntersectedAndLowerConnections(a); else if (this._settings.isHorizontalGrid()) var d = this._connections.getAllVerticallyIntersectedAndRightConnections(a);
    for (var e = 0; e < d.length; e++) {
        for (var f = 0; f < d[e].length; f++) {
            var g = b[d[e][f]];
            if ((a.x >= g.x1 && a.x <= g.x2 || a.x < g.x1) && a.y < g.y1) {
                if (c == null) c = g; else {
                    if (g.y1 < c.y1) c = g;
                }
            }
        }
    }
    return c;
};

Gridifier.ConnectorsIntersector.prototype.getMostTopFromIntersectedBottomOrBottomLeftItems = function(a) {
    var b = this._connections.get();
    var c = null;
    if (this._settings.isVerticalGrid()) var d = this._connections.getAllHorizontallyIntersectedAndLowerConnections(a); else if (this._settings.isHorizontalGrid()) var d = this._connections.getAllVerticallyIntersectedAndLeftConnections(a);
    for (var e = 0; e < d.length; e++) {
        for (var f = 0; f < d[e].length; f++) {
            var g = b[d[e][f]];
            if ((a.x >= g.x1 && a.x <= g.x2 || a.x > g.x2) && a.y < g.y1) {
                if (c == null) c = g; else {
                    if (g.y1 < c.y1) c = g;
                }
            }
        }
    }
    return c;
};