/* Gridifier v2.~.~ source file for custom build.
 * Async Responsive HTML Grids
 * http://gridifier.io
 * 
 * Gridifier is dual-licensed:
 *   GPLV3 per non-commercial usage; 
 *   Commercial license per commercial usage.
 * Read http://gridifier.io/license for details.
 * Copyright 2015 nTech
 */

var CrsIntersector = function() {};

proto(CrsIntersector, {
    _mostYClose: function(a, b, c, d, e, f) {
        var g = connections.get();
        var h = null;
        var i = settings.eq("grid", "vertical") ? e(a) : f(a);
        for (var j = 0; j < i.length; j++) {
            for (var k = 0; k < i[j].length; k++) {
                var l = g[i[j][k]];
                if ((a.x >= l.x1 && a.x <= l.x2 || b(a, l)) && c(a, l)) {
                    if (h == null) h = l; else {
                        if (d(l, h)) h = l;
                    }
                }
            }
        }
        return h;
    },
    _crXBgCnX2: function(a, b) {
        return a.x > b.x2;
    },
    _crXSmCnX1: function(a, b) {
        return a.x < b.x1;
    },
    _crYBgCnY2: function(a, b) {
        return a.y > b.y2;
    },
    _crYSmCnY1: function(a, b) {
        return a.y < b.y1;
    },
    _cnX1BgCnX2: function(a, b) {
        return a.x1 > b.x2;
    },
    _cnX1SmCnX1: function(a, b) {
        return a.x1 < b.x1;
    },
    _cnY2BgCnY2: function(a, b) {
        return a.y2 > b.y2;
    },
    _cnY1SmCnY1: function(a, b) {
        return a.y1 < b.y1;
    },
    _intXCns: function(a) {
        return connections.getAllIntXCns(a);
    },
    _intXAndUpperCns: function(a) {
        return connections.getAllIntXAndTopCns(a);
    },
    _intXAndLowerCns: function(a) {
        return connections.getAllIntXAndBottomCns(a);
    },
    _intYAndLeftCns: function(a) {
        return connections.getAllIntYAndLeftCns(a);
    },
    _intYAndRightCns: function(a) {
        return connections.getAllIntYAndRightCns(a);
    },
    mostBottomFromTopOrTopLeft: function(a) {
        var b = this;
        return this._mostYClose(a, b._crXBgCnX2, b._crYBgCnY2, b._cnY2BgCnY2, b._intXAndUpperCns, b._intYAndLeftCns);
    },
    mostBottomFromTopOrTopRight: function(a) {
        var b = this;
        return this._mostYClose(a, b._crXSmCnX1, b._crYBgCnY2, b._cnY2BgCnY2, b._intXAndUpperCns, b._intYAndRightCns);
    },
    mostTopFromBottomOrBottomLeft: function(a) {
        var b = this;
        return this._mostYClose(a, b._crXBgCnX2, b._crYSmCnY1, b._cnY1SmCnY1, b._intXAndLowerCns, b._intYAndLeftCns);
    },
    mostTopFromBottomOrBottomRight: function(a) {
        var b = this;
        return this._mostYClose(a, b._crXSmCnX1, b._crYSmCnY1, b._cnY1SmCnY1, b._intXAndLowerCns, b._intYAndRightCns);
    },
    _mostXClose: function(a, b, c, d, e) {
        var f = connections.get();
        var g = null;
        var h = function(d) {
            if (a.y >= d.y1 && a.y <= d.y2 && b(a, d)) {
                if (g == null) g = d; else {
                    if (c(d, g)) g = d;
                }
            }
        };
        if (settings.eq("grid", "vertical")) {
            var i = d(a);
            for (var j = 0; j < i.length; j++) h(f[i[j]]);
        } else {
            var i = e(a);
            for (var j = 0; j < i.length; j++) {
                for (var k = 0; k < i[j].length; k++) h(f[i[j][k]]);
            }
        }
        return g;
    },
    mostLeftFromRight: function(a) {
        var b = this;
        return this._mostXClose(a, b._crXSmCnX1, b._cnX1SmCnX1, b._intXCns, b._intYAndRightCns);
    },
    mostRightFromLeft: function(a) {
        var b = this;
        return this._mostXClose(a, b._crXBgCnX2, b._cnX1BgCnX2, b._intXCns, b._intYAndLeftCns);
    }
});