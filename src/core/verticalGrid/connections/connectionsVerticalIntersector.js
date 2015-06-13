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

Gridifier.VerticalGrid.ConnectionsVerticalIntersector = function(a, b, c) {
    var d = this;
    this._connections = null;
    this._settings = null;
    this._itemCoordsExtractor = null;
    this._lastRowVerticallyExpandedConnections = [];
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

Gridifier.VerticalGrid.ConnectionsVerticalIntersector.prototype.getLastRowVerticallyExpandedConnections = function() {
    return this._lastRowVerticallyExpandedConnections;
};

Gridifier.VerticalGrid.ConnectionsVerticalIntersector.prototype.isIntersectingMoreThanOneConnectionItemVertically = function(a) {
    var b = this;
    var c = this._connections.get();
    var d = [];
    var e = function(a) {
        if (d.length == 0) return false;
        for (var b = 0; b < d.length; b++) {
            var e = c[d[b]];
            var f = e.y1;
            var g = e.y2;
            e.y1 = Math.ceil(e.y1);
            e.y2 = Math.floor(e.y2);
            var h = a.y1 < e.y1 && a.y2 < e.y1;
            var i = a.y1 > e.y1 && a.y2 > e.y2;
            e.y1 = f;
            e.y2 = g;
            if (!h && !i) return true;
        }
        return false;
    };
    var f = 0;
    for (var g = 0; g < c.length; g++) {
        var h = c[g];
        var i = a.y1 < h.y1 && a.y2 < h.y1;
        var j = a.y1 > h.y2 && a.y2 > h.y2;
        if (!i && !j && !e(h)) {
            d.push(g);
            f++;
        }
    }
    return f > 1;
};

Gridifier.VerticalGrid.ConnectionsVerticalIntersector.prototype.getMostTallFromAllVerticallyIntersectedConnections = function(a) {
    var b = this;
    var c = this._connections.get();
    var d = null;
    for (var e = 0; e < c.length; e++) {
        var f = c[e];
        var g = a.y1 < f.y1 && a.y2 < f.y1;
        var h = a.y1 > f.y2 && a.y2 > f.y2;
        if (!g && !h) {
            if (d == null) d = f; else {
                var i = Math.abs(f.y2 - f.y1);
                var j = Math.abs(d.y2 - d.y1);
                if (i > j) d = f;
            }
        }
    }
    return d;
};

Gridifier.VerticalGrid.ConnectionsVerticalIntersector.prototype.getAllVerticallyIntersectedConnections = function(a) {
    var b = this;
    var c = this._connections.get();
    var d = [];
    for (var e = 0; e < c.length; e++) {
        var f = c[e];
        var g = a.y1 < f.y1 && a.y2 < f.y1;
        var h = a.y1 > f.y2 && a.y2 > f.y2;
        if (!g && !h) d.push(f);
    }
    return d;
};

Gridifier.VerticalGrid.ConnectionsVerticalIntersector.prototype.expandVerticallyAllRowConnectionsToMostTall = function(a) {
    var b = this.getMostTallFromAllVerticallyIntersectedConnections(a);
    if (b == null) return;
    var c = this.getAllVerticallyIntersectedConnections(a);
    var d = [];
    for (var e = 0; e < c.length; e++) {
        c[e].y1 = b.y1;
        c[e].y2 = b.y2;
        if (this._settings.isVerticalGridTopAlignmentType()) {
            if (c[e].verticalOffset != 0) d.push(c[e]);
            c[e].verticalOffset = 0;
        } else if (this._settings.isVerticalGridCenterAlignmentType()) {
            var f = c[e].y1;
            var g = c[e].y2;
            var h = this._itemCoordsExtractor.getItemTargetSizes(c[e].item);
            var i = h.targetHeight;
            var j = Math.abs(g - f + 1) / 2 - i / 2;
            if (c[e].verticalOffset != j) {
                c[e].verticalOffset = j;
                d.push(c[e]);
            }
        } else if (this._settings.isVerticalGridBottomAlignmentType()) {
            var f = c[e].y1;
            var g = c[e].y2;
            var h = this._itemCoordsExtractor.getItemTargetSizes(c[e].item);
            var i = h.targetHeight;
            var j = Math.abs(g - f + 1) - i;
            if (c[e].verticalOffset != j) {
                c[e].verticalOffset = j;
                d.push(c[e]);
            }
        }
    }
    this._lastRowVerticallyExpandedConnections = d;
};