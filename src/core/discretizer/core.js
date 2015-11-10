/* Gridifier v2.~.~ source file for custom build.
 * Async Responsive HTML Grids
 * http://gridifier.io
 * 
 * Gridifier is dual-licensed:
 *   Non-commercial license - https://creativecommons.org/licenses/by-nc-sa/4.0/.
 *   Commercial license - http://gridifier.io/license (Commercial license).
 * Read http://gridifier.io/license for details.
 * Copyright 2015 nTech
 */

DiscretizerCore = function() {};

proto(DiscretizerCore, {
    _rev: function(a) {
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
    },
    _coords: function(a) {
        a.isInt = false;
        a.centerX = a.x1 + (a.x2 - a.x1 + 1) / 2;
        a.centerY = a.y1 + (a.y2 - a.y1 + 1) / 2;
        return a;
    },
    _onDefAppend: function(a, b, c, d, e) {
        var f = [];
        var g = -1;
        var h = true;
        while (h) {
            var i = [];
            var j = -1;
            var k = true;
            while (k) {
                j += b;
                if (j > d) k = false; else i.push(this._coords(e(g, j, a, b)));
            }
            f.push(i);
            g += a;
            if (g + a > c) h = false;
        }
        return f;
    },
    _onRevAppend: function(a, b, c, d, e) {
        var f = [];
        var g = -1;
        var h = true;
        while (h) {
            var i = [];
            var j = c + 1;
            var k = true;
            while (k) {
                j -= b;
                if (j < 0) k = false; else i.unshift(this._coords(e(g, j, a, b)));
            }
            f.push(i);
            g += a;
            if (g + a > d) h = false;
        }
        return f;
    },
    discretizeOnDefAppend: function(a, b) {
        var c = {
            vg: function(a, b, c, d) {
                return {
                    x1: b - d + 1,
                    x2: b,
                    y1: a + 1,
                    y2: a + c
                };
            },
            hg: function(a, b, c, d) {
                return {
                    x1: a + 1,
                    x2: a + c,
                    y1: b - d + 1,
                    y2: b
                };
            }
        };
        if (settings.eq("grid", "vertical")) return this._onDefAppend(b, a, grid.y2(), grid.x2(), c.vg); else return this._rev(this._onDefAppend(a, b, grid.x2(), grid.y2(), c.hg));
    },
    discretizeOnRevAppend: function(a, b) {
        var c = {
            vg: function(a, b, c, d) {
                return {
                    x1: b,
                    x2: b + d - 1,
                    y1: a + 1,
                    y2: a + c
                };
            },
            hg: function(a, b, c, d) {
                return {
                    x1: a + 1,
                    x2: a + c,
                    y1: b,
                    y2: b + d - 1
                };
            }
        };
        if (settings.eq("grid", "vertical")) return this._onRevAppend(b, a, grid.x2(), grid.y2(), c.vg); else return this._rev(this._onRevAppend(a, b, grid.y2(), grid.x2(), c.hg));
    },
    _normalizeCnXYCoords: function(a, b, c, d, e, f, g) {
        var h = b[e] - b[d] + 1;
        var i = srManager["outer" + c](a, true);
        if (h < i || i < h) {
            if (g) {
                if (settings.eq("append", "default")) b[d] = b[e] - i + 1; else b[e] = b[d] + i - 1;
            } else b[e] = b[d] + i - 1;
        }
        if (b[d] < 0) {
            b[d] = 0;
            b[e] = i - 1;
        }
        if (b[e] > f) {
            b[e] = f;
            b[d] = b[e] - i + 1;
        }
        return b;
    },
    normalizeCnXCoords: function(a, b) {
        var c = [ a, b, "Width", "x1", "x2", grid.x2() ];
        c.push(settings.eq("grid", "vertical"));
        return this._normalizeCnXYCoords.apply(this, c);
    },
    normalizeCnYCoords: function(a, b) {
        var c = [ a, b, "Height", "y1", "y2", grid.y2() ];
        c.push(!settings.eq("grid", "vertical"));
        return this._normalizeCnXYCoords.apply(this, c);
    }
});