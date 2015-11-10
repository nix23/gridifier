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

var Iterator = function() {
    var a = this;
    self(this, {
        first: function() {
            return a.get("first");
        },
        last: function() {
            return a.get("last");
        },
        next: function(b) {
            return a.get("next", b);
        },
        prev: function(b) {
            return a.get("prev", b);
        },
        all: function() {
            return a.get("all");
        }
    });
};

proto(Iterator, {
    get: function(a, b) {
        var c = connections.get();
        if (c.length == 0) return a == "all" ? [] : null;
        c = cnsSorter.sortForReappend(c);
        if (a == "first") return c[0].item; else if (a == "last") return c[c.length - 1].item;
        var d = function(a, b) {
            return guid.get(a) == guid.get(gridItem.toNative(b)[0]);
        };
        if (a == "next") {
            for (var e = 0; e < c.length; e++) {
                if (d(c[e].item, b)) return e + 1 > c.length - 1 ? null : c[e + 1].item;
            }
        } else if (a == "prev") {
            for (var e = c.length - 1; e >= 0; e--) {
                if (d(c[e].item, b)) return e - 1 < 0 ? null : c[e - 1].item;
            }
        } else if (a == "all") {
            var f = [];
            for (var e = 0; e < c.length; e++) f.push(c[e].item);
            return f;
        }
        return null;
    }
});