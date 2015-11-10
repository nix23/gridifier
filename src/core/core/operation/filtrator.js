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

var Filtrator = function() {};

proto(Filtrator, {
    filter: function() {
        var a = collector.collect();
        var b = collector.collectConnected();
        var c = collector.sort(collector.filter(a));
        var d = this._findConnItemsToHide(b);
        disconnector.disconnect(d);
        this._recreateGUIDS(c);
        this._recreateCns(c);
    },
    _findConnItemsToHide: function(a) {
        return Dom.filter(a, function(a) {
            return collector.filter([ a ]).length == 0;
        }, this);
    },
    _recreateGUIDS: function(a) {
        guid.reinit();
        for (var b = 0; b < a.length; b++) guid.markForAppend(a[b]);
    },
    _recreateCns: function(a) {
        var b = connections.get();
        b.splice(0, b.length);
        if (settings.eq("grid", "vertical")) var c = {
            c1: "y",
            c2: "x"
        }; else var c = {
            c1: "x",
            c2: "y"
        };
        var d = 0;
        for (var e = 0; e < a.length; e++) {
            var f = {};
            f[c.c1 + "1"] = d;
            f[c.c1 + "2"] = d;
            f[c.c2 + "1"] = 0;
            f[c.c2 + "2"] = 0;
            connections.add(a[e], f);
            d++;
        }
    }
});