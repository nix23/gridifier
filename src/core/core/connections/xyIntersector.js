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

var CnsXYIntersector = function() {
    this._lastXYExpandedCns = [];
};

proto(CnsXYIntersector, {
    _isBefore: function(a, b, c, d) {
        return a[c] < b[c] && a[d] < b[c];
    },
    _isAfter: function(a, b, c, d) {
        return a[c] > b[d] && a[d] > b[d];
    },
    getLastXYExpandedCns: function() {
        return this._lastXYExpandedCns;
    },
    isIntMoreThanOneCnXY: function(a, b, c) {
        var d = this;
        var e = connections.get();
        var f = [];
        var g = function(a) {
            if (f.length == 0) return false;
            for (var g = 0; g < f.length; g++) {
                var h = e[f[g]];
                var i = h[b];
                var j = h[c];
                h[b] = Math.ceil(h[b]);
                h[c] = Math.floor(h[c]);
                var k = d._isBefore(a, h, b, c);
                var l = d._isAfter(a, h, b, c);
                h[b] = i;
                h[c] = j;
                if (!k && !l) return true;
            }
            return false;
        };
        var h = 0;
        for (var i = 0; i < e.length; i++) {
            if (!d._isBefore(a, e[i], b, c) && !d._isAfter(a, e[i], b, c) && !g(e[i])) {
                f.push(i);
                h++;
            }
        }
        return h > 1;
    },
    getMostBigFromAllXYIntCns: function(a, b, c) {
        var d = connections.get();
        var e = null;
        for (var f = 0; f < d.length; f++) {
            if (!this._isBefore(a, d[f], b, c) && !this._isAfter(a, d[f], b, c)) {
                if (e == null) e = d[f]; else {
                    var g = Math.abs(d[f][c] - d[f][b]);
                    var h = Math.abs(e[c] - e[b]);
                    if (g > h) e = d[f];
                }
            }
        }
        return e;
    },
    getAllXYIntCns: function(a, b, c) {
        var d = connections.get();
        var e = [];
        for (var f = 0; f < d.length; f++) {
            if (!this._isBefore(a, d[f], b, c) && !this._isAfter(a, d[f], b, c)) e.push(d[f]);
        }
        return e;
    },
    expandXYAllCnsToMostBig: function(a, b, c, d, e) {
        var f = bind("eq", settings);
        var g = this.getMostBigFromAllXYIntCns(a, b, c);
        if (g == null) return;
        var h = this.getAllXYIntCns(a, b, c);
        var i = [];
        for (var j = 0; j < h.length; j++) {
            h[j][b] = g[b];
            h[j][c] = g[c];
            if (f("align", "left") || f("align", "top")) {
                if (h[j][d] != 0) i.push(h[j]);
                h[j][d] = 0;
            } else {
                var k = srManager["outer" + e](h[j].item, true);
                if (f("align", "center")) var l = Math.abs(h[j][c] - h[j][b] + 1) / 2 - k / 2; else var l = Math.abs(h[j][c] - h[j][b] + 1) - k;
                if (h[j][d] != l) {
                    h[j][d] = l;
                    i.push(h[j]);
                }
            }
        }
        this._lastXYExpandedCns = i;
    }
});