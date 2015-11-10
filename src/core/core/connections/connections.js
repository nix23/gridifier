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

var CnsCore = function() {};

proto(CnsCore, {
    find: function(a, b) {
        var b = b || false;
        var c = connections.get();
        if (!b && c.length == 0) err(E.NO_CNS);
        var d = guid.get(a);
        var e = null;
        for (var f = 0; f < c.length; f++) {
            if (d == c[f].itemGUID) {
                e = c[f];
                break;
            }
        }
        if (e == null) {
            if (!repositionQueue.isEmpty()) {
                var g = repositionQueue.getQueued();
                for (var f = 0; f < g.length; f++) {
                    if (d == g[f].cn.itemGUID) {
                        e = g[f].cn;
                        break;
                    }
                }
            }
        }
        if (!b && e == null) err(E.CANT_FIND_CN);
        return e;
    },
    create: function(a, b) {
        var c = [ "x1", "x2", "y1", "y2" ];
        for (var d = 0; d < c.length; d++) {
            var e = c[d];
            var f = b[e];
            b[e] = Dom.toFixed(b[e], 2);
            if (isNaN(b[e])) b[e] = f;
        }
        b.item = a;
        b.itemGUID = guid.get(a);
        b.hOffset = Dom.hasOwnProp(b, "hOffset") ? b.hOffset : 0;
        b.vOffset = Dom.hasOwnProp(b, "vOffset") ? b.vOffset : 0;
        b.restrictCollect = Dom.hasOwnProp(b, "restrictCollect") ? b.restrictCollect : false;
        if (!gridItem.isConnected(a)) gridItem.markAsConnected(a);
        return b;
    },
    rm: function(a, b) {
        for (var c = 0; c < a.length; c++) {
            if (guid.get(b.item) == guid.get(a[c].item)) {
                a.splice(c, 1);
                return;
            }
        }
    },
    _remapGUIDS: function(a) {
        for (var b = 0; b < a.length; b++) a[b].itemGUID = guid.markForAppend(a[b].item);
    },
    remapAllGUIDS: function() {
        guid.reinit();
        this._remapGUIDS(cnsSorter.sortForReappend(connections.get()));
    },
    remapGUIDSIn: function(a) {
        this._remapGUIDS(a);
    },
    getByGUIDS: function(a) {
        var b = connections.get();
        var c = [];
        for (var d = 0; d < b.length; d++) {
            for (var e = 0; e < a.length; e++) {
                if (b[d].itemGUID == a[e]) {
                    c.push(b[d]);
                    break;
                }
            }
        }
        return c;
    },
    syncParams: function(a) {
        var b = connections.get();
        var c = [ "x1", "x2", "y1", "y2", "hOffset", "vOffset", "restrictCollect" ];
        for (var d = 0; d < a.length; d++) {
            for (var e = 0; e < b.length; e++) {
                if (a[d].itemGUID == b[e].itemGUID) {
                    for (var f = 0; f < c.length; f++) b[e][c[f]] = a[d][c[f]];
                    break;
                }
            }
        }
    },
    _getMinSize: function(a, b, c, d) {
        var e = connections.get();
        if (e.length == 0) return 0;
        var f = function(f) {
            if (e[f][a] >= e[f][b] || e[f][a] < 0 || e[f][b] > c) return srManager["outer" + d](e[f].item, true); else return e[f][b] - e[f][a] + 1;
        };
        var g = f(0);
        for (var h = 1; h < e.length; h++) {
            var i = f(h);
            if (i < g) g = i;
        }
        return g;
    },
    getMinWidth: function() {
        return this._getMinSize("x1", "x2", grid.x2(), "Width");
    },
    getMinHeight: function() {
        return this._getMinSize("y1", "y2", grid.y2(), "Height");
    },
    _compareGUIDS: function(a, b, c) {
        var d = guid.get(b);
        for (var e = 0; e < a.length; e++) {
            if (c(guid.get(a[e].item), d)) return true;
        }
        return false;
    },
    isAnyGUIDSmallerThan: function(a, b) {
        return this._compareGUIDS(a, b, function(a, b) {
            return a < b;
        });
    },
    isAnyGUIDBiggerThan: function(a, b) {
        return this._compareGUIDS(a, b, function(a, b) {
            return a > b;
        });
    },
    getMaxY: function() {
        var a = connections.get();
        var b = 0;
        for (var c = 0; c < a.length; c++) {
            if (a[c].y2 > b) b = a[c].y2;
        }
        return b;
    },
    restoreOnSortDispersion: function(a, b, c) {
        var d = cnsSorter.sortForReappend(connections.get());
        var e = d[d.length - 1];
        var f = function(a, b, c) {
            a.x1 = b;
            a.x2 = b;
            a.y1 = c;
            a.y2 = c;
        };
        if (settings.eq("append", "default")) b(a, e, f); else c(a, e, f);
    },
    getAllBACoord: function(a, b) {
        var c = connections.get();
        var d = [];
        for (var e = 0; e < c.length; e++) {
            if (settings.eq("sortDispersion", false) && b(c[e], a)) d.push(c[e]);
        }
        return d;
    },
    fixAllXYPosAfterPrepend: function(a, b, c, d, e) {
        if (a[d] >= 0) return false;
        var f = Math.round(Math.abs(a[d]));
        a[e] = Math.abs(a[d] - a[e]);
        a[d] = 0;
        var g = connections.get();
        for (var h = 0; h < g.length; h++) {
            if (a.itemGUID == g[h].itemGUID) continue;
            g[h][d] += f;
            g[h][e] += f;
        }
        for (var h = 0; h < b.length; h++) b[h][c] += f;
        cnsRanges.incAllBy(f, d, e);
        cnsRanges.createPrepended(a[d], a[e], d, e);
        return true;
    }
});