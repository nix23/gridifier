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

Gridifier.HorizontalGrid.ConnectionsHorizontalIntersector = function(a, b, c) {
    var d = this;
    this._connections = null;
    this._settings = null;
    this._itemCoordsExtractor = null;
    this._lastColHorizontallyExpandedConnections = [];
    this._css = {};
    this._construct = function() {
        d._connections = a;
        d._settings = b;
        d._itemCoordsExtractor = c;
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        d._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.HorizontalGrid.ConnectionsHorizontalIntersector.prototype.getLastColHorizontallyExpandedConnections = function() {
    return this._lastColHorizontallyExpandedConnections;
};

Gridifier.HorizontalGrid.ConnectionsHorizontalIntersector.prototype.isIntersectingMoreThanOneConnectionItemHorizontally = function(a) {
    var b = this;
    var c = this._connections.get();
    var d = [];
    var e = function(a) {
        if (d.length == 0) return false;
        for (var b = 0; b < d.length; b++) {
            var e = c[d[b]];
            var f = e.x1;
            var g = e.x2;
            e.x1 = Math.ceil(e.x1);
            e.x2 = Math.floor(e.x2);
            var h = a.x1 < e.x1 && a.x2 < e.x1;
            var i = a.x1 > e.x2 && a.x2 > e.x2;
            e.x1 = f;
            e.x2 = g;
            if (!h && !i) return true;
        }
        return false;
    };
    var f = 0;
    for (var g = 0; g < c.length; g++) {
        var h = c[g];
        var i = a.x1 < h.x1 && a.x2 < h.x1;
        var j = a.x1 > h.x2 && a.x2 > h.x2;
        if (!i && !j && !e(h)) {
            d.push(g);
            f++;
        }
    }
    return f > 1;
};

Gridifier.HorizontalGrid.ConnectionsHorizontalIntersector.prototype.getMostWideFromAllHorizontallyIntersectedConnections = function(a) {
    var b = this;
    var c = this._connections.get();
    var d = null;
    for (var e = 0; e < c.length; e++) {
        var f = c[e];
        var g = a.x1 < f.x1 && a.x2 < f.x1;
        var h = a.x1 > f.x2 && a.x2 > f.x2;
        if (!g && !h) {
            if (d == null) d = f; else {
                var i = Math.abs(f.x2 - f.x1);
                var j = Math.abs(d.x2 - d.x1);
                if (i > j) d = f;
            }
        }
    }
    return d;
};

Gridifier.HorizontalGrid.ConnectionsHorizontalIntersector.prototype.getAllHorizontallyIntersectedConnections = function(a) {
    var b = this;
    var c = this._connections.get();
    var d = [];
    for (var e = 0; e < c.length; e++) {
        var f = c[e];
        var g = a.x1 < f.x1 && a.x2 < f.x1;
        var h = a.x1 > f.x2 && a.x2 > f.x2;
        if (!g && !h) d.push(f);
    }
    return d;
};

Gridifier.HorizontalGrid.ConnectionsHorizontalIntersector.prototype.expandHorizontallyAllColConnectionsToMostWide = function(a) {
    var b = this.getMostWideFromAllHorizontallyIntersectedConnections(a);
    if (b == null) return;
    var c = this.getAllHorizontallyIntersectedConnections(a);
    var d = [];
    for (var e = 0; e < c.length; e++) {
        c[e].x1 = b.x1;
        c[e].x2 = b.x2;
        if (this._settings.isHorizontalGridLeftAlignmentType()) {
            if (c[e].horizontalOffset != 0) d.push(c[e]);
            c[e].horizontalOffset = 0;
        } else if (this._settings.isHorizontalGridCenterAlignmentType()) {
            var f = c[e].x1;
            var g = c[e].x2;
            var h = this._itemCoordsExtractor.getItemTargetSizes(c[e].item);
            var i = h.targetWidth;
            var j = Math.abs(g - f + 1) / 2 - i / 2;
            if (c[e].horizontalOffset != j) {
                c[e].horizontalOffset = j;
                d.push(c[e]);
            }
        } else if (this._settings.isHorizontalGridRightAlignmentType()) {
            var f = c[e].x1;
            var g = c[e].x2;
            var h = this._itemCoordsExtractor.getItemTargetSizes(c[e].item);
            var i = h.targetWidth;
            var j = Math.abs(g - f + 1) - i;
            if (c[e].horizontalOffset != j) {
                c[e].horizontalOffset = j;
                d.push(c[e]);
            }
        }
    }
    this._lastColHorizontallyExpandedConnections = d;
};