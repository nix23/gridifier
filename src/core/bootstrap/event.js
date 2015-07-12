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

var Event = function() {
    var a = 0;
    function b(a) {
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
    function c(a) {
        a = b(a);
        var c = this.events[a.type];
        for (var d in c) {
            var e = c[d].call(this, a);
            if (e === false) {
                a.preventDefault();
                a.stopPropagation();
            } else if (e !== undefined) {
                a.result = e;
            }
            if (a.stopNow) break;
        }
    }
    return {
        add: function(b, d, e) {
            if (b.setInterval && (b != window && !b.frameElement)) {
                b = window;
            }
            if (!e.guid) {
                e.guid = ++a;
            }
            if (!b.events) {
                b.events = {};
                b.handle = function(a) {
                    if (typeof Event !== "undefined") {
                        return c.call(b, a);
                    }
                };
            }
            if (!b.events[d]) {
                b.events[d] = {};
                if (b.addEventListener) b.addEventListener(d, b.handle, false); else if (b.attachEvent) b.attachEvent("on" + d, b.handle);
            }
            b.events[d][e.guid] = e;
        },
        remove: function(a, b, c) {
            var d = a.events && a.events[b];
            if (!d) return;
            if (!c) {
                for (var e in d) {
                    delete a.events[b][e];
                }
                return;
            } else {
                delete d[c.guid];
                for (var f in d) return;
            }
            if (a.removeEventListener) a.removeEventListener(b, a.handle, false); else if (a.detachEvent) a.detachEvent("on" + b, a.handle);
            delete a.events[b];
            for (var f in a.events) return;
            try {
                delete a.handle;
                delete a.events;
            } catch (g) {
                a.removeAttribute("handle");
                a.removeAttribute("events");
            }
        }
    };
}();