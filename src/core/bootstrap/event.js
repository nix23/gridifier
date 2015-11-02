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

var Event = function() {
    var a = "gridifierEvents";
    var b = "gridifierHandle";
    var c = function() {
        var a = new Date().getTime();
        return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function(b) {
            var c = (a + Math.random() * 16) % 16 | 0;
            a = Math.floor(a / 16);
            return (b == "x" ? c : c & 3 | 8).toString(16);
        });
    };
    function d(a) {
        a = a || window.event;
        if (a.isFixed) {
            return a;
        }
        a.isFixed = true;
        a.preventDefault = a.preventDefault || function() {
            this.returnValue = false;
        };
        a.stopPropagation = a.stopPropagation || function() {
            this.cancelBubble = true;
        };
        if (!a.target) {
            a.target = a.srcElement;
        }
        if (!a.relatedTarget && a.fromElement) {
            a.relatedTarget = a.fromElement == a.target ? a.toElement : a.fromElement;
        }
        if (a.pageX == null && a.clientX != null) {
            var b = document.documentElement, c = document.body;
            a.pageX = a.clientX + (b && b.scrollLeft || c && c.scrollLeft || 0) - (b.clientLeft || 0);
            a.pageY = a.clientY + (b && b.scrollTop || c && c.scrollTop || 0) - (b.clientTop || 0);
        }
        if (!a.which && a.button) {
            a.which = a.button & 1 ? 1 : a.button & 2 ? 3 : a.button & 4 ? 2 : 0;
        }
        return a;
    }
    function e(b) {
        b = d(b);
        var c = this[a][b.type];
        for (var e in c) {
            var f = c[e].call(this, b);
            if (f === false) {
                b.preventDefault();
                b.stopPropagation();
            } else if (f !== undefined) {
                b.result = f;
            }
            if (b.stopNow) break;
        }
    }
    return {
        add: function(d, f, g) {
            if (d.setInterval && (d != window && !d.frameElement)) {
                d = window;
            }
            if (!g.guid) g.guid = c();
            if (!d[a]) {
                d[a] = {};
                d[b] = function(a) {
                    if (typeof Event !== "undefined") {
                        return e.call(d, a);
                    }
                };
            }
            if (!d[a][f]) {
                d[a][f] = {};
                if (d.addEventListener) d.addEventListener(f, d[b], false); else if (d.attachEvent) d.attachEvent("on" + f, d[b]);
            }
            d[a][f][g.guid] = g;
        },
        rm: function(c, d, e) {
            var f = c[a] && c[a][d];
            if (!f) return;
            if (!e) {
                for (var g in f) {
                    delete c[a][d][g];
                }
                return;
            } else {
                delete f[e.guid];
                for (var h in f) return;
            }
            if (c.removeEventListener) c.removeEventListener(d, c[b], false); else if (c.detachEvent) c.detachEvent("on" + d, c[b]);
            delete c[a][d];
            for (var h in c[a]) return;
            try {
                delete c[b];
                delete c[a];
            } catch (i) {
                c.removeAttribute(b);
                c.removeAttribute(a);
            }
        }
    };
}();