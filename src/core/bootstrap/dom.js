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

var Dom = {
    hasDOMElemOwnPropertyFunction: null,
    _isBrowserSupportingTransitions: null,
    init: function() {
        this.createTrimFunction();
        this.createHasDOMElemOwnPropertyFunction();
        this._determineIfBrowserIsSupportingTransitions();
        this.browsers.init();
    },
    createTrimFunction: function() {
        if (typeof String.prototype.gridifierTrim !== "function") {
            String.prototype.gridifierTrim = function() {
                return this.replace(/^\s+|\s+$/g, "");
            };
        }
    },
    createHasDOMElemOwnPropertyFunction: function() {
        var a = document.createElement("div");
        var b = document.body || document.documentElement;
        b.appendChild(a);
        if (Object.prototype.hasOwnProperty.call(a, "innerHTML")) {
            this.hasDOMElemOwnPropertyFunction = function(a, b) {
                return Object.prototype.hasOwnProperty.call(a, b);
            };
        } else {
            this.hasDOMElemOwnPropertyFunction = function(a, b) {
                for (var c in a) {
                    if (c == b) return true;
                }
                return false;
            };
        }
        b.removeChild(a);
    },
    _determineIfBrowserIsSupportingTransitions: function() {
        var a = document.createElement("div");
        var b = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd otransitionend",
            transition: "transitionend"
        };
        this._isBrowserSupportingTransitions = false;
        for (var c in b) {
            if (a.style[c] !== undefined) this._isBrowserSupportingTransitions = true;
        }
    },
    hasAttribute: function(a, b) {
        if (a.getAttribute(b) === null || a.getAttribute(b) === "") return false;
        return true;
    },
    toInt: function(a) {
        return parseInt(a, 10);
    },
    isJqueryObject: function(a) {
        if (typeof jQuery == "undefined") return false;
        return a && a instanceof jQuery;
    },
    isNativeDOMObject: function(a) {
        if (typeof a != "undefined" && typeof a.tagName != "undefined" && typeof a.nodeName != "undefined" && typeof a.ownerDocument != "undefined" && typeof a.removeAttribute != "undefined") return true; else return false;
    },
    isArray: function(a) {
        return Object.prototype.toString.call(a) == "[object Array]";
    },
    isChildOf: function(a, b) {
        var c = a.parentNode;
        while (c != undefined) {
            if (c == b) return true;
            if (c == document.body) break;
            c = c.parentNode;
        }
        return false;
    },
    isBrowserSupportingTransitions: function() {
        return this._isBrowserSupportingTransitions;
    },
    hasDOMElemOwnProperty: function(a, b) {
        return this.hasDOMElemOwnPropertyFunction(a, b);
    },
    toFixed: function(a, b) {
        return parseFloat(+(Math.round(+(a.toString() + "e" + b)).toString() + "e" + -b));
    },
    areRoundedOrFlooredValuesEqual: function(a, b) {
        return Math.round(a) == Math.round(b) || Math.floor(a) == Math.floor(b);
    },
    areRoundedOrCeiledValuesEqual: function(a, b) {
        return Math.round(a) == Math.round(b) || Math.ceil(a) == Math.ceil(b);
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
        isAndroidUCBrowser: function() {
            if (!this.isAndroid()) return false;
            return /UCBrowser/i.test(this._navigator);
        }
    },
    css: {
        set: function(a, b) {
            if (!Dom.isNativeDOMObject(a)) throw new Error("Dom abstraction layer error: DOMElem must be a scalar value.");
            for (var c in b) a.style[c] = b[c];
        },
        hasClass: function(a, b) {
            var c = a.getAttribute("class");
            if (c == null || c.length == 0) return false;
            var d = c.split(" ");
            for (var e = 0; e < d.length; e++) {
                d[e] = d[e].gridifierTrim();
                if (d[e] == b) return true;
            }
            return false;
        },
        addClass: function(a, b) {
            var c = a.getAttribute("class");
            if (c == null || c.length == 0) var d = b; else var d = c + " " + b;
            a.setAttribute("class", d);
        },
        removeClass: function(a, b) {
            var c = a.getAttribute("class").split(" ");
            var d = "";
            for (var e = 0; e < c.length; e++) {
                if (c[e].gridifierTrim() != b) d += c[e] + " ";
            }
            d = d.substring(0, d.length - 1);
            a.setAttribute("class", d);
        }
    },
    css3: {
        prefixedTransitionProps: [ "WebkitTransition", "MozTransition", "MsTransition", "OTransition", "transition" ],
        prefixedTransformProps: [ "WebkitTransform", "MozTransform", "OTransform", "MsTransform", "transform" ],
        prefixedPerspectiveProps: [ "WebkitPerspective", "perspective", "MozPerspective" ],
        prefixedTransformStyleProps: [ "transformStyle", "WebkitTransformStyle", "MozTransformStyle" ],
        prefixedBackfaceVisibilityProps: [ "WebkitBackfaceVisibility", "MozBackfaceVisibility", "backfaceVisibility" ],
        prefixedTransformOriginProps: [ "webkitTransformOrigin", "mozTransformOrigin", "oTransformOrigin", "msTransformOrigin", "transformOrigin" ],
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
                if (f.search(k) === -1) {
                    f += ", " + i;
                }
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
                if (i.gridifierTrim().length == 0) continue;
                if (i.search(b) !== -1) {
                    e += " " + b + "(" + c + ")";
                    g = true;
                } else {
                    e += " " + i + ")";
                }
            }
            if (!g) e += " " + b + "(" + c + ")";
            a.style[Prefixer.get("transform", a)] = e.gridifierTrim();
        },
        opacity: function(a, b) {
            var c = [ "-webkit-opacity", "-moz-opacity", "opacity" ];
            for (var d = 0; d < c.length; d++) a.style[c[d]] = b;
        },
        perspective: function(a, b) {
            for (var c = 0; c < this.prefixedPerspectiveProps.length; c++) a.style[this.prefixedPerspectiveProps[c]] = b;
        },
        transformStyle: function(a, b) {
            for (var c = 0; c < this.prefixedTransformStyleProps.length; c++) a.style[this.prefixedTransformStyleProps[c]] = b;
        },
        backfaceVisibility: function(a, b) {
            for (var c = 0; c < this.prefixedBackfaceVisibilityProps.length; c++) a.style[this.prefixedBackfaceVisibilityProps[c]] = b;
        },
        transformOrigin: function(a, b) {
            for (var c = 0; c < this.prefixedTransformOriginProps.length; c++) {
                if (typeof a.style[this.prefixedTransformOriginProps[c]] != "undefined") a.style[this.prefixedTransformOriginProps[c]] = b;
            }
        }
    },
    get: {
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
            var c = Dom.get.byQuery(a, b);
            for (var d = 0; d < c.length; d++) {
                var e = c[d];
                e.parentNode.removeChild(e);
            }
        }
    }
};

Dom.has = Dom.hasAttribute;