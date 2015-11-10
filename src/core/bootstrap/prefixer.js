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

var Prefixer = {
    _prefixes: [ "Moz", "Webkit", "ms", "Ms", "Khtml", "O" ],
    _getter: function(a, b, c) {
        b = b || document.documentElement;
        var d = b.style;
        if (typeof d[a] === "string") return a;
        var e = a;
        var a = a.charAt(0).toUpperCase() + a.slice(1);
        for (var f = 0; f < this._prefixes.length; f++) {
            var g = this._prefixes[f] + a;
            if (typeof d[g] === "string") return c(g, e, f);
        }
    },
    get: function(a, b) {
        return this._getter(a, b, function(a) {
            return a;
        });
    },
    getForCss: function(a, b) {
        var c = this;
        return this._getter(a, b, function(a, b, d) {
            return "-" + c._prefixes[d].toLowerCase() + "-" + b;
        });
    }
};