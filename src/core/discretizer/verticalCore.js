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

Gridifier.Discretizer.VerticalCore = function(a, b, c) {
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

Gridifier.Discretizer.VerticalCore.prototype.discretizeGridWithDefaultAppend = function(a, b) {
    var c = [];
    var d = this._gridifier.getGridX2();
    var e = this._gridifier.getGridY2();
    var f = -1;
    var g = true;
    while (g) {
        var h = [];
        var i = d + 1;
        var j = true;
        while (j) {
            i -= a;
            if (i < 0) {
                j = false;
            } else {
                var k = {
                    x1: i,
                    x2: i + a - 1,
                    y1: f + 1,
                    y2: f + b
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
        f += b;
        if (f + b > e) g = false;
    }
    return c;
};

Gridifier.Discretizer.VerticalCore.prototype.discretizeGridWithReversedAppend = function(a, b) {
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
            i += a;
            if (i > d) {
                j = false;
            } else {
                var k = {
                    x1: i - a + 1,
                    x2: i,
                    y1: f + 1,
                    y2: f + b
                };
                k[Gridifier.Discretizer.IS_INTERSECTED_BY_ITEM] = false;
                var l = k.x2 - k.x1 + 1;
                var m = k.y2 - k.y1 + 1;
                k[Gridifier.Discretizer.CELL_CENTER_X] = k.x1 + l / 2;
                k[Gridifier.Discretizer.CELL_CENTER_Y] = k.y1 + m / 2;
                h.push(k);
            }
        }
        c.push(h);
        f += b;
        if (f + b > e) g = false;
    }
    return c;
};

Gridifier.Discretizer.VerticalCore.prototype.normalizeItemNewConnectionHorizontalCoords = function(a, b) {
    var c = b.x2 - b.x1 + 1;
    var d = this._sizesResolverManager.outerWidth(a, true);
    if (c < d) {
        if (this._settings.isDefaultAppend()) {
            b.x1 = b.x2 - d + 1;
        } else if (this._settings.isReversedAppend()) {
            b.x2 = b.x1 + d - 1;
        }
    }
    if (d < c) {
        if (this._settings.isDefaultAppend()) {
            b.x1 = b.x2 - d + 1;
        } else if (this._settings.isReversedAppend()) {
            b.x2 = b.x1 + d - 1;
        }
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

Gridifier.Discretizer.VerticalCore.prototype.normalizeItemNewConnectionVerticalCoords = function(a, b) {
    var c = b.y2 - b.y1 + 1;
    var d = this._sizesResolverManager.outerHeight(a, true);
    if (c < d) {
        b.y2 = b.y1 + d - 1;
    }
    if (d < c) {
        b.y2 = b.y1 + d - 1;
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