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

var RepositionData = function() {};

proto(RepositionData, {
    get: function(a, b) {
        var c = connections.get();
        var d = bind("eq", settings);
        for (var e = 0; e < c.length; e++) {
            if (c[e].restrictCollect) continue;
            if (d("sortDispersion", false) && d("intersections", true)) {
                if (c[e].itemGUID >= b.itemGUID) {
                    a.push(c[e]);
                    c.splice(e, 1);
                    e--;
                }
            } else if (d("intersections", false)) {
                if (d("grid", "vertical")) var f = c[e].y2 >= b.y1; else var f = c[e].x2 >= b.x1;
                if (f) {
                    a.push(c[e]);
                    c.splice(e, 1);
                    e--;
                }
            } else if (d("sortDispersion", true)) {
                if (this._getSDCond(c[e], b)) {
                    a.push(c[e]);
                    c.splice(e, 1);
                    e--;
                }
            }
        }
        var g = cnsSorter.sortForReappend(a);
        var h = [];
        for (var e = 0; e < g.length; e++) h.push(g[e].item);
        return {
            items: h,
            cns: a,
            firstCn: g[0]
        };
    },
    _getSDCond: function(a, b) {
        var c = bind("eq", settings);
        if (c("grid", "vertical")) {
            if (c("append", "default")) var d = a.y1 > b.y1 || a.y1 == b.y1 && a.x1 >= b.x1; else var d = a.y1 > b.y1 || a.y1 == b.y1 && a.x1 <= b.x2;
        } else {
            if (c("append", "default")) var d = a.x1 > b.x1 || a.x1 == b.x1 && a.y1 >= b.y1; else var d = a.x1 > b.x1 || a.x1 == b.x1 && a.y1 <= b.y2;
        }
        return d;
    },
    getForRepositionAll: function(a) {
        var b = [];
        var c = [];
        var d = [];
        this._findCns(a, b, c, d);
        var e = this._findFirstCnToRps(a, c);
        return {
            items: b,
            cns: d,
            firstCn: e
        };
    },
    _findCns: function(a, b, c, d) {
        for (var e = 0; e < a.length; e++) {
            if (!a[e].restrictCollect) {
                b.push(a[e].item);
                d.push(a[e]);
            } else c.push(a[e]);
        }
    },
    _findFirstCnToRps: function(a, b) {
        var c = null;
        if (b.length == 0) {
            c = a[0];
            a.splice(0, a.length);
        } else {
            for (var d = 0; d < a.length; d++) {
                var e = true;
                for (var f = 0; f < b.length; f++) {
                    if (b[f].itemGUID == a[d].itemGUID) {
                        e = false;
                        break;
                    }
                }
                if (e) {
                    c = a[d];
                    break;
                }
            }
            a.splice(0, a.length);
            for (var d = 0; d < b.length; d++) a.push(b[d]);
        }
        return c;
    }
});