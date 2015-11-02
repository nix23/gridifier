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

var CrsSorter = function() {
    this._crs = null;
};

proto(CrsSorter, {
    attach: function(a) {
        this._crs = a;
    },
    getSorted: function() {
        return this._crs;
    },
    _sortForVG: function(a, b) {
        this._crs.sort(function(c, d) {
            if (Dom.areRoundedOrCeiledEq(c.y, d.y)) {
                if (a) {
                    if (b) return c.x > d.x ? 1 : -1; else return c.x < d.x ? 1 : -1;
                } else {
                    if (b) return c.x > d.x ? 1 : -1; else return c.x < d.x ? 1 : -1;
                }
            } else {
                if (a) return c.y < d.y ? 1 : -1; else return c.y < d.y ? -1 : 1;
            }
        });
    },
    _sortForHG: function(a, b) {
        this._crs.sort(function(c, d) {
            if (Dom.areRoundedOrCeiledEq(c.x, d.x)) {
                if (a) {
                    if (b) return c.y < d.y ? 1 : -1; else return c.y > d.y ? 1 : -1;
                } else {
                    if (b) return c.y < d.y ? -1 : 1; else return c.y > d.y ? -1 : 1;
                }
            } else {
                if (a) return c.x < d.x ? 1 : -1; else return c.x < d.x ? -1 : 1;
            }
        });
    },
    sortForPrepend: function() {
        var a = settings.get("prepend") == "default";
        if (settings.eq("grid", "vertical")) this._sortForVG(true, a); else this._sortForHG(true, a);
    },
    sortForAppend: function() {
        var a = settings.get("append") == "default";
        if (settings.eq("grid", "vertical")) this._sortForVG(false, a); else this._sortForHG(false, a);
    }
});