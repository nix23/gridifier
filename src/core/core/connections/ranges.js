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

var CnsRanges = function() {
    this._ranges = null;
    if (settings.eq("grid", "vertical")) this.init("y1", "y2"); else this.init("x1", "x2");
};

proto(CnsRanges, {
    init: function(a, b) {
        var c = {
            cnIndexes: []
        };
        c[a] = -1;
        c[b] = C.RANGE_SIZE - 1;
        this._ranges = [ c ];
        this._attachAllCns(a, b);
    },
    incAllBy: function(a, b, c) {
        for (var d = 0; d < this._ranges.length; d++) {
            this._ranges[d][b] += a;
            this._ranges[d][c] += a;
        }
    },
    createPrepended: function(a, b, c, d) {
        var e = {
            cnIndexes: []
        };
        e[c] = -1;
        e[d] = b;
        this._ranges.unshift(e);
    },
    _createNext: function(a, b) {
        var c = this._ranges[this._ranges.length - 1][b] + 1;
        var d = {
            cnIndexes: []
        };
        d[a] = c;
        d[b] = c + C.RANGE_SIZE - 1;
        this._ranges.push(d);
    },
    attachCn: function(a, b, c, d) {
        while (a[d] + 1 > this._ranges[this._ranges.length - 1][d]) this._createNext(c, d);
        var e = false;
        for (var f = 0; f < this._ranges.length; f++) {
            var g = a[d] < this._ranges[f][c];
            var h = a[c] > this._ranges[f][d];
            if (!g && !h) {
                this._ranges[f].cnIndexes.push(b);
                e = true;
            }
        }
        if (!e) err("Range for cn NF");
    },
    _attachAllCns: function(a, b) {
        var c = connections.get();
        for (var d = 0; d < c.length; d++) this.attachCn(c[d], d, a, b);
    },
    mapAllIntAndSideCns: function(a, b, c, d, e, f, g, h) {
        var i = this._ranges;
        var j = e(i);
        var k = [];
        for (var l = 0; l < a.length; l++) {
            var m = false;
            var n = j != e(i);
            while (!m) {
                if (j > f(i) || j < 0) {
                    j = e(i);
                    break;
                }
                if (a[l][b] >= i[j][c] && a[l][b] <= i[j][d]) m = true; else {
                    j = h(j);
                    n = false;
                }
            }
            if (!n) k = g(j, i);
            a[l].cnIndexes = k;
        }
        return a;
    },
    firstRngIndexFn: function() {
        return function(a) {
            return 0;
        };
    },
    lastRngIndexFn: function() {
        return function(a) {
            return a.length - 1;
        };
    },
    lowerCrCnIndexesFn: function() {
        return function(a, b) {
            var c = [];
            for (var d = a; d >= 0; d--) c.push(b[d].cnIndexes);
            return c;
        };
    },
    upperCrCnIndexesFn: function() {
        return function(a, b) {
            var c = [];
            for (var d = a; d < b.length; d++) c.push(b[d].cnIndexes);
            return c;
        };
    },
    incFn: function() {
        return function(a) {
            return ++a;
        };
    },
    decFn: function() {
        return function(a) {
            return --a;
        };
    },
    getAllCnsFromIntRange: function(a, b, c) {
        var d = this._ranges;
        for (var e = 0; e < d.length; e++) {
            if (a >= d[e][b] && a <= d[e][c]) return d[e].cnIndexes;
        }
        var f = function(a, b) {
            for (var c = 0; c < a.length; c++) {
                if (a[c] == b) return true;
            }
            return false;
        };
        var g = [];
        for (var e = 0; e < d.length; e++) {
            for (var h = 0; h < d[e].cnIndexes.length; h++) {
                if (!f(g, d[e].cnIndexes[h])) g.push(d[e].cnIndexes[h]);
            }
        }
        return g;
    },
    getAllCnsFromIntAndTLSideRgs: function(a, b, c) {
        var d = this._ranges;
        var e = [];
        var f = null;
        for (var g = d.length - 1; g >= 0; g--) {
            if (a >= d[g][b] && a <= d[g][c]) {
                f = g;
                break;
            }
        }
        if (f == null) f = d.length - 1;
        for (var g = f; g >= 0; g--) e.push(d[g].cnIndexes);
        return e;
    },
    getAllCnsFromIntAndRBSideRgs: function(a, b, c) {
        var d = this._ranges;
        var e = [];
        var f = null;
        for (var g = 0; g < d.length; g++) {
            if (a >= d[g][b] && a <= d[g][c]) {
                f = g;
                break;
            }
        }
        if (f == null) f = 0;
        for (var g = f; g < d.length; g++) e.push(d[g].cnIndexes);
        return e;
    }
});