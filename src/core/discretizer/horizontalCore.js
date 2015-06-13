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

Gridifier.Discretizer.HorizontalCore = function(a, b, c) {
    var d = this;
    this._gridifier = null;
    this._settings = null;
    this._sizesResolverManager = null;
    this._css = {};
    this._construct = function() {
        d._gridifier = a;
        d._settings = b;
        d._sizesResolverManager = c;
        d._bindEvents();
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        d._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.Discretizer.HorizontalCore.prototype._transposeCells = function(a) {
    var b = [];
    var c = 0;
    for (var d = 0; d < a.length; d++) {
        if (a[d].length > c) c = a[d].length;
    }
    var e = 0;
    for (var f = 0; f < c; f++) {
        var g = [];
        for (var h = 0; h < a.length; h++) {
            if (typeof a[h][e] != "undefined") g.push(a[h][e]);
        }
        b.push(g);
        e++;
    }
    return b;
};

Gridifier.Discretizer.HorizontalCore.prototype.discretizeGridWithDefaultAppend = function(a, b) {
    var c = [];
    var d = this._gridifier.getGridX2();
    var e = this._gridifier.getGridY2();
    var f = -1;
    var g = true;
    while (g) {
        var h = [];
        var i = -1;
        var j = true;
        while (j) {
            i += b;
            var k = i - b + 1;
            if (i > e) {
                j = false;
            } else {
                var l = {
                    x1: f + 1,
                    x2: f + a,
                    y1: k,
                    y2: i
                };
                l[Gridifier.Discretizer.IS_INTERSECTED_BY_ITEM] = false;
                var m = l.x2 - l.x1 + 1;
                var n = l.y2 - l.y1 + 1;
                l[Gridifier.Discretizer.CELL_CENTER_X] = l.x1 + m / 2;
                l[Gridifier.Discretizer.CELL_CENTER_Y] = l.y1 + n / 2;
                h.push(l);
            }
        }
        c.push(h);
        f += a;
        if (f + a > d) g = false;
    }
    return this._transposeCells(c);
};

Gridifier.Discretizer.HorizontalCore.prototype.discretizeGridWithReversedAppend = function(a, b) {
    var c = [];
    var d = this._gridifier.getGridX2();
    var e = this._gridifier.getGridY2();
    var f = -1;
    var g = true;
    while (g) {
        var h = [];
        var i = e + 1;
        var j = true;
        while (j) {
            i -= b;
            if (i < 0) {
                j = false;
            } else {
                var k = {
                    x1: f + 1,
                    x2: f + a,
                    y1: i,
                    y2: i + b - 1
                };
                k[Gridifier.Discretizer.IS_INTERSECTED_BY_ITEM] = false;
                var l = k.x2 - k.x1 + 1;
                var m = k.y2 - k.y1 + 1;
                k[Gridifier.Discretizer.CELL_CENTER_X] = k.x1 + l / 2;
                k[Gridifier.Discretizer.CELL_CENTER_Y] = k.y1 + m / 2;
                h.unshift(k);
            }
        }
        c.push(h);
        f += a;
        if (f + a > d) g = false;
    }
    return this._transposeCells(c);
};

Gridifier.Discretizer.HorizontalCore.prototype.normalizeItemNewConnectionHorizontalCoords = function(a, b) {
    var c = b.x2 - b.x1 + 1;
    var d = this._sizesResolverManager.outerWidth(a, true);
    if (c < d) {
        b.x2 = b.x1 + d - 1;
    }
    if (d < c) {
        b.x2 = b.x1 + d - 1;
    }
    if (b.x1 < 0) {
        b.x1 = 0;
        b.x2 = d - 1;
    }
    if (b.x2 > this._gridifier.getGridX2()) {
        b.x2 = this._gridifier.getGridX2();
        b.x1 = b.x2 - d + 1;
    }
    return b;
};

Gridifier.Discretizer.HorizontalCore.prototype.normalizeItemNewConnectionVerticalCoords = function(a, b) {
    var c = b.y2 - b.y1 + 1;
    var d = this._sizesResolverManager.outerHeight(a, true);
    if (c < d) {
        if (this._settings.isDefaultAppend()) {
            b.y1 = b.y2 - d + 1;
        } else if (this._settings.isReversedAppend()) {
            b.y2 = b.y1 + d - 1;
        }
    }
    if (d < c) {
        if (this._settings.isDefaultAppend()) {
            b.y1 = b.y2 - d + 1;
        } else if (this._settings.isReversedAppend()) {
            b.y2 = b.y1 + d - 1;
        }
    }
    if (b.y1 < 0) {
        b.y1 = 0;
        b.y2 = d - 1;
    }
    if (b.y2 > this._gridifier.getGridY2()) {
        b.y2 = this._gridifier.getGridY2();
        b.y1 = b.y2 - d + 1;
    }
    return b;
};