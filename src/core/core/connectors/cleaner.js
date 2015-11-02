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

var CrsCleaner = function() {
    this._cleaner = null;
};

proto(CrsCleaner, {
    _updateCleaner: function() {
        var a = CRS.CLEANERS;
        this._cleaner = settings.eq("sortDispersion", false) ? a.INSIDE_OR_BEFORE : a.INSIDE;
    },
    _isInsideCleaner: function() {
        this._updateCleaner();
        return this._cleaner == CRS.CLEANERS.INSIDE;
    },
    _isMappedCrIntAnySideCn: function(a, b, c, d, e) {
        var f = connections.get();
        for (var g = 0; g < a.cnIndexes.length; g++) {
            for (var h = 0; h < a.cnIndexes[g].length; h++) {
                var i = f[a.cnIndexes[g][h]];
                crsRounder.roundCnPerCr(i, a);
                if (a[b] >= i[c] && a[b] <= i[d] && e.call(this, a, i)) {
                    crsRounder.unroundCnPerCr(i, a);
                    return true;
                }
                crsRounder.unroundCnPerCr(i, a);
            }
        }
        return false;
    },
    _isMappedCrIntAnyTopCn: function(a) {
        return this._isMappedCrIntAnySideCn(a, "x", "x1", "x2", function(a, b) {
            return this._isInsideCleaner() ? a.y >= b.y1 && a.y <= b.y2 : a.y >= b.y1;
        });
    },
    _isMappedCrIntAnyBottomCn: function(a) {
        return this._isMappedCrIntAnySideCn(a, "x", "x1", "x2", function(a, b) {
            return this._isInsideCleaner() ? a.y <= b.y2 && a.y >= b.y1 : a.y <= b.y2;
        });
    },
    _isMappedCrIntAnyLeftCn: function(a) {
        return this._isMappedCrIntAnySideCn(a, "y", "y1", "y2", function(a, b) {
            return this._isInsideCleaner() ? a.x >= b.x1 && a.x <= b.x2 : a.x >= b.x1;
        });
    },
    _isMappedCrIntAnyRightCn: function(a) {
        return this._isMappedCrIntAnySideCn(a, "y", "y1", "y2", function(a, b) {
            return this._isInsideCleaner() ? a.x <= b.x2 && a.x >= b.x1 : a.x <= b.x2;
        });
    },
    _rmIntFrom: function(a, b, c) {
        var d = connectors.get();
        var e = connectors.getClone();
        e.sort(function(a, d) {
            if (a[b] == d[b]) return 0; else if (c(a[b], d[b])) return -1; else return 1;
        });
        e = connections["mapAllIntAnd" + a + "Cns"](e);
        for (var f = 0; f < e.length; f++) {
            var g = "_isMappedCrIntAny" + a + "Cn";
            d[e[f].crIndex].isInt = this[g](e[f]);
        }
        for (var f = 0; f < d.length; f++) {
            if (d[f].isInt) {
                d.splice(f, 1);
                f--;
            }
        }
    },
    rmIntFromTop: function() {
        this._rmIntFrom("Top", "y", function(a, b) {
            return a.y > b.y;
        });
    },
    rmIntFromBottom: function() {
        this._rmIntFrom("Bottom", "y", function(a, b) {
            return a.y < b.y;
        });
    },
    rmIntFromLeft: function() {
        this._rmIntFrom("Left", "x", function(a, b) {
            return a.x > b.x;
        });
    },
    rmIntFromRight: function() {
        this._rmIntFrom("Right", "x", function(a, b) {
            return a.x < b.x;
        });
    },
    _rmAllTooFar: function(a, b) {
        var c = connectors.get();
        if (c.length == 0) return;
        var d = c[0];
        for (var e = 1; e < c.length; e++) {
            if (a(c[e], d)) d = c[e];
        }
        for (var e = 0; e < c.length; e++) {
            if (b(c[e], d, Dom.int(settings.get("insertRange")))) {
                c.splice(e, 1);
                e--;
            }
        }
    },
    _crSmCr: function(a) {
        return function(b, c) {
            return b[a] < c[a];
        };
    },
    _crBgCr: function(a) {
        return function(b, c) {
            return b[a] > c[a];
        };
    },
    _crSmValidC: function(a, b) {
        return function(c, d, e) {
            return c[a] < d[a] + e * b;
        };
    },
    _crBgValidC: function(a, b) {
        return function(c, d, e) {
            return c[a] > d[a] + e * b;
        };
    },
    rmAllTooBottomFromMostTop: function() {
        this._rmAllTooFar(this._crSmCr("y"), this._crBgValidC("y", 1));
    },
    rmAllTooTopFromMostBottom: function() {
        this._rmAllTooFar(this._crBgCr("y"), this._crSmValidC("y", -1));
    },
    rmAllTooRightFromMostLeft: function() {
        this._rmAllTooFar(this._crSmCr("x"), this._crBgValidC("x", 1));
    },
    rmAllTooLeftFromMostRight: function() {
        this._rmAllTooFar(this._crBgCr("x"), this._crSmValidC("x", -1));
    }
});