/* Gridifier v1.~.~ source file for custom build.
 * Async Responsive HTML Grids
 * http://gridifier.io
 * 
 * Gridifier is dual-licensed:
 *   GPLV3 per non-commercial usage; 
 *   Commercial license per commercial usage.
 * Read http://gridifier.io/license for details.
 * Copyright 2015 nTech
 */

var Prefixer = {
    prefixes: [ "Moz", "Webkit", "ms", "Ms", "Khtml", "O" ],
    init: function() {
    },
    get: function(a, b) {
        b = b || document.documentElement;
        var c = b.style;
        if (typeof c[a] === "string") {
            return a;
        }
        var a = a.charAt(0).toUpperCase() + a.slice(1);
        for (var d = 0; d < this.prefixes.length; d++) {
            var e = this.prefixes[d] + a;
            if (typeof c[e] === "string") return e;
        }
    },
    getForCSS: function(a, b) {
        b = b || document.documentElement;
        var c = b.style;
        if (typeof c[a] === "string") {
            return a;
        }
        var d = a;
        var a = a.charAt(0).toUpperCase() + a.slice(1);
        for (var e = 0; e < this.prefixes.length; e++) {
            var f = this.prefixes[e] + a;
            if (typeof c[f] === "string") return "-" + this.prefixes[e].toLowerCase() + "-" + d;
        }
    }
};