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

var CnsSorter = function() {};

proto(CnsSorter, {
    _sortForReappend: function(a, b, c, d) {
        if (settings.eq("sortDispersion", false)) {
            a.sort(function(a, b) {
                return guid.get(a.item) > guid.get(b.item) ? 1 : -1;
            });
        } else {
            if (settings.eq("append", "default")) {
                a.sort(function(a, d) {
                    if (Dom.areRoundedOrFlooredEq(a[b], d[b])) return a[c] < d[c] ? -1 : 1; else return a[b] < d[b] ? -1 : 1;
                });
            } else {
                a.sort(function(a, c) {
                    if (Dom.areRoundedOrFlooredEq(a[b], c[b])) return a[d] > c[d] ? -1 : 1; else return a[b] < c[b] ? -1 : 1;
                });
            }
            var e = settings.getApi("rsort");
            a = e(a);
        }
        return a;
    },
    sortForReappend: function(a) {
        if (settings.eq("grid", "vertical")) return this._sortForReappend(a, "y1", "x1", "x2"); else return this._sortForReappend(a, "x1", "y2", "y1");
    }
});