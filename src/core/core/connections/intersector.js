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

var CnsIntersector = function() {};

proto(CnsIntersector, {
    isIntersectingAny: function(a, b) {
        for (var c = 0; c < a.length; c++) {
            var d = a[c];
            var e = b.y1 < d.y1 && b.y2 < d.y1;
            var f = b.y1 > d.y2 && b.y2 > d.y2;
            var g = b.x1 < d.x1 && b.x2 < d.x1;
            var h = b.x1 > d.x2 && b.x2 > d.x2;
            if (!e && !f && !g && !h) return true;
        }
        return false;
    },
    getAllWithIntersectedCenter: function(a) {
        var b = connections.get();
        var c = [];
        for (var d = 0; d < b.length; d++) {
            var e = b[d].x2 - b[d].x1 + 1;
            var f = b[d].y2 - b[d].y1 + 1;
            var g = b[d].x1 + e / 2;
            var h = b[d].y1 + f / 2;
            var i = {
                x1: g,
                x2: g,
                y1: h,
                y2: h
            };
            if (this.isIntersectingAny([ i ], a)) c.push(b[d]);
        }
        return c;
    },
    _findAllMaybeIntCns: function(a, b) {
        var c = connections.get();
        var d = [];
        for (var e = 0; e < c.length; e++) {
            if (b(a, c[e])) continue;
            d.push(c[e]);
        }
        return d;
    },
    findAllMaybeIntOnVgAppend: function(a) {
        return this._findAllMaybeIntCns(a, function(a, b) {
            return a.y > b.y2;
        });
    },
    findAllMaybeIntOnVgPrepend: function(a) {
        return this._findAllMaybeIntCns(a, function(a, b) {
            return a.y < b.y1;
        });
    },
    findAllMaybeIntOnHgAppend: function(a) {
        return this._findAllMaybeIntCns(a, function(a, b) {
            return a.x > b.x2;
        });
    },
    findAllMaybeIntOnHgPrepend: function(a) {
        return this._findAllMaybeIntCns(a, function(a, b) {
            return a.x < b.x1;
        });
    }
});