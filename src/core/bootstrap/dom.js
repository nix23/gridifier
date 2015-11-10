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

var Dom = {
    init: function() {
        this._createTrimFunction();
        this._createHasOwnPropFn();
        this._checkIfHasTransitions(Dom.div());
        this.browsers.init();
        this.css3.init();
    },
    _createTrimFunction: function() {
        if (typeof String.prototype.gridifierTrim !== "function") {
            String.prototype.gridifierTrim = function() {
                return this.replace(/^\s+|\s+$/g, "");
            };
        }
    },
    _createHasOwnPropFn: function() {
        var a = Dom.div();
        var b = document.body || document.documentElement;
        b.appendChild(a);
        if (Object.prototype.hasOwnProperty.call(a, "innerHTML")) {
            this._hasOwnPropFn = function(a, b) {
                return Object.prototype.hasOwnProperty.call(a, b);
            };
        } else {
            this._hasOwnPropFn = function(a, b) {
                for (var c in a) {
                    if (c == b) return true;
                }
                return false;
            };
        }
        b.removeChild(a);
    },
    _checkIfHasTransitions: function(a) {
        var b = [ "WebkitTransition", "MozTransition", "OTransition", "msTransition", "MsTransition", "transition" ];
        this._hasTransitions = false;
        for (var c = 0; c < b.length; c++) {
            if (a.style[b[c]] !== undefined) this._hasTransitions = true;
        }
    },
    get: function(a, b) {
        return a.getAttribute(b);
    },
    set: function(a, b, c) {
        if (this.isArray(b)) {
            for (var d = 0; d < b.length; d++) a.setAttribute(b[d][0], b[d][1]);
            return;
        }
        a.setAttribute(b, c);
    },
    rm: function(a, b) {
        a.removeAttribute(b);
    },
    rmIfHas: function(a, b) {
        if (this.isArray(b)) {
            for (var c in b) {
                if (this.has(a, b[c])) this.rm(a, b[c]);
            }
            return;
        }
        if (this.has(a, b)) this.rm(a, b);
    },
    has: function(a, b) {
        if (a.getAttribute(b) === null || a.getAttribute(b) === "") return false;
        return true;
    },
    "int": function(a) {
        return parseInt(a, 10);
    },
    isJquery: function(a) {
        if (typeof jQuery == "undefined") return false;
        return a && a instanceof jQuery;
    },
    isNative: function(a) {
        if (typeof a != "undefined" && typeof a.tagName != "undefined" && typeof a.nodeName != "undefined" && typeof a.ownerDocument != "undefined" && typeof a.removeAttribute != "undefined") return true; else return false;
    },
    isArray: function(a) {
        return Object.prototype.toString.call(a) == "[object Array]";
    },
    isObj: function(a) {
        return typeof a == "object" && a !== null;
    },
    isChildOf: function(a, b) {
        if (a == b) return false;
        var c = a.parentNode;
        while (c != undefined) {
            if (c == b) return true;
            if (c == document.body) break;
            c = c.parentNode;
        }
        return false;
    },
    hasTransitions: function() {
        return this._hasTransitions;
    },
    hasVal: function(a, b) {
        for (var c in a) {
            if (a[c] == b) return true;
        }
        return false;
    },
    hasOwnProp: function(a, b) {
        return this._hasOwnPropFn(a, b);
    },
    hasAnyProp: function(a, b) {
        for (var c = 0; c < b.length; c++) {
            if (this._hasOwnPropFn(a, b[c])) return true;
        }
        return false;
    },
    toFixed: function(a, b) {
        return parseFloat(+(Math.round(+(a.toString() + "e" + b)).toString() + "e" + -b));
    },
    areRoundedOrFlooredEq: function(a, b) {
        return Math.round(a) == Math.round(b) || Math.floor(a) == Math.floor(b);
    },
    areRoundedOrCeiledEq: function(a, b) {
        return Math.round(a) == Math.round(b) || Math.ceil(a) == Math.ceil(b);
    },
    filter: function(a, b, c) {
        var c = c || window;
        var d = [];
        for (var e = 0; e < a.length; e++) {
            if (b.call(c, a[e])) d.push(a[e]);
        }
        return d;
    },
    show: function(a) {
        a.style.visibility = "visible";
    },
    hide: function(a) {
        a.style.visibility = "hidden";
    },
    div: function() {
        return document.createElement("div");
    },
    browsers: {
        _navigator: null,
        init: function() {
            this._navigator = typeof navigator != "undefined" ? navigator.userAgent : "";
        },
        isAndroid: function() {
            return /android/i.test(this._navigator);
        },
        isAndroidFirefox: function() {
            if (!this.isAndroid()) return false;
            return /firefox|iceweasel/i.test(this._navigator);
        },
        isAndroidUC: function() {
            if (!this.isAndroid()) return false;
            return /UCBrowser/i.test(this._navigator);
        }
    },
    css: {
        set: function(a, b) {
            if (!Dom.isNative(a)) err("Error: not DOM.");
            for (var c in b) a.style[c] = b[c];
        },
        set4: function(a, b, c) {
            var d = [ "Left", "Right", "Top", "Bottom" ];
            for (var e = 0; e < d.length; e++) a.style[b + d[e]] = Dom.isObj(c) ? c[b + d[e]] : c;
        },
        hasClass: function(a, b) {
            var c = a.getAttribute("class");
            if (c == null || c.length == 0) return false;
            c = c.split(" ");
            for (var d = 0; d < c.length; d++) {
                c[d] = c[d].gridifierTrim();
                if (c[d] == b) return true;
            }
            return false;
        },
        addClass: function(a, b) {
            var c = a.getAttribute("class");
            if (c == null || c.length == 0) var d = b; else var d = c + " " + b;
            Dom.set(a, "class", d);
        },
        removeClass: function(a, b) {
            var c = a.getAttribute("class").split(" ");
            var d = "";
            for (var e = 0; e < c.length; e++) {
                if (c[e].gridifierTrim() != b) d += c[e] + " ";
            }
            d = d.substring(0, d.length - 1);
            Dom.set(a, "class", d);
        }
    },
    css3: {
        _opacityProps: [ "opacity" ],
        _perspectiveProps: [ "perspective" ],
        _transformStyleProps: [ "transformStyle" ],
        _backfaceVisibilityProps: [ "backfaceVisibility" ],
        _transformOriginProps: [ "transformOrigin" ],
        init: function() {
            var a = [ [ "Webkit", "Moz" ], [ "webkit", "moz", "o", "ms" ] ];
            for (var b = 0; b < a[0].length; b++) {
                var c = a[0][b];
                this._opacityProps.push(c + "Opacity");
                this._perspectiveProps.push(c + "Perspective");
                this._transformStyleProps.push(c + "TransformStyle");
                this._backfaceVisibilityProps.push(c + "BackfaceVisibility");
            }
            for (var b = 0; b < a[1].length; b++) {
                this._transformOriginProps.push(a[1][b] + "TransformOrigin");
            }
        },
        transition: function(a, b) {
            a.style[Prefixer.get("transition", a)] = b;
        },
        transitionProperty: function(a, b) {
            var c = a.style[Prefixer.get("transition", a)];
            if (c.length == 0) {
                a.style[Prefixer.get("transition", a)] = b;
                return;
            }
            var d = function(a) {
                return a.replace(/cubic-bezier\([^\)]+/g, function(a) {
                    return a.replace(/,/g, ";");
                });
            };
            var e = function(a) {
                return a.replace(/cubic-bezier\([^\)]+/g, function(a) {
                    return a.replace(/;/g, ",");
                });
            };
            var f = d(b);
            c = d(c);
            var g = c.split(",");
            for (var h = 0; h < g.length; h++) {
                var i = g[h].gridifierTrim();
                if (i.length == 0) continue;
                var j = i.split(" ");
                var k = j[0];
                if (f.search(k) === -1) f += ", " + i;
            }
            a.style[Prefixer.get("transition", a)] = e(f).gridifierTrim();
        },
        transform: function(a, b) {
            a.style[Prefixer.get("transform", a)] = b;
        },
        transformProperty: function(a, b, c) {
            var d = a.style[Prefixer.get("transform", a)];
            if (d.length == 0) {
                a.style[Prefixer.get("transform", a)] = b + "(" + c + ")";
                return;
            }
            var e = "";
            var f = d.split(/\)/);
            var g = false;
            for (var h = 0; h < f.length; h++) {
                var i = f[h].gridifierTrim();
                if (i.length == 0) continue;
                if (i.search(b) !== -1) {
                    e += " " + b + "(" + c + ")";
                    g = true;
                } else e += " " + i + ")";
            }
            if (!g) e += " " + b + "(" + c + ")";
            a.style[Prefixer.get("transform", a)] = e.gridifierTrim();
        },
        style: function(a, b, c) {
            for (var d = 0; d < b.length; d++) a.style[b[d]] = c;
        },
        opacity: function(a, b) {
            this.style(a, this._opacityProps, b);
        },
        perspective: function(a, b) {
            this.style(a, this._perspectiveProps, b);
        },
        transformStyle: function(a, b) {
            this.style(a, this._transformStyleProps, b);
        },
        backfaceVisibility: function(a, b) {
            this.style(a, this._backfaceVisibilityProps, b);
        },
        transformOrigin: function(a, b) {
            for (var c = 0; c < this._transformOriginProps.length; c++) {
                if (typeof a.style[this._transformOriginProps[c]] != "undefined") a.style[this._transformOriginProps[c]] = b;
            }
        }
    },
    find: {
        byId: function(a) {
            return document.getElementById(a);
        },
        byClass: function(a, b) {
            return a.querySelectorAll("." + b);
        },
        byQuery: function(a, b) {
            var c = b.gridifierTrim()[0];
            if (c == ">") {
                var d = b.substr(2, b.length - 1);
                var e = a.querySelectorAll(d);
                var f = [];
                for (var g = 0; g < e.length; g++) {
                    if (e[g].parentNode == a) f.push(e[g]);
                }
                return f;
            }
            return a.querySelectorAll(b);
        }
    },
    remove: {
        byQuery: function(a, b) {
            var c = Dom.find.byQuery(a, b);
            for (var d = 0; d < c.length; d++) {
                var e = c[d];
                e.parentNode.removeChild(e);
            }
        }
    }
};