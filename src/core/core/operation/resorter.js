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

var Resorter = function() {};

proto(Resorter, {
    resort: function() {
        var a = collector.sort(collector.collectConnected());
        if (settings.eq("sortDispersion", true)) this._resortOnSD(a);
        guid.reinit();
        for (var b = 0; b < a.length; b++) guid.markForAppend(a[b]);
    },
    _resortOnSD: function(a) {
        if (settings.eq("grid", "vertical")) var b = {
            c1: "y",
            c2: "x"
        }; else var b = {
            c1: "x",
            c2: "y"
        };
        var c = 0;
        for (var d = 0; d < a.length; d++) {
            var e = cnsCore.find(a[d]);
            e[b.c1 + "1"] = c;
            e[b.c1 + "2"] = c;
            e[b.c2 + "1"] = 0;
            e[b.c2 + "2"] = 0;
            c++;
        }
    }
});