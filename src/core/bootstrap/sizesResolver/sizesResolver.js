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

var SizesResolver = {
    getComputedCSS: null,
    _getProps: {
        forOw: [ "paddingLeft", "paddingRight", "marginLeft", "marginRight", "borderLeftWidth", "borderRightWidth" ],
        forOh: [ "paddingTop", "paddingBottom", "marginTop", "marginBottom", "borderTopWidth", "borderBottomWidth" ],
        forPosLeft: [ "marginLeft" ],
        forPosTop: [ "marginTop" ]
    },
    _prefixedProps: {
        boxSizing: null
    },
    _borderBoxType: null,
    _borderBoxTypes: {
        OUTER: 0,
        INNER: 1
    },
    _ptValsCalcType: null,
    _ptValsCalcTypes: {
        BROWSER: 0,
        RECALC: 1
    },
    recalcPtWidthFn: function(a, b, c, d) {
        return this.outerWidth(a, b, c, d);
    },
    recalcPtHeightFn: function(a, b, c, d) {
        return this.outerHeight(a, b, c, d);
    },
    _lastRawWidth: null,
    _lastRawHeight: null,
    _lastBorderWidth: null,
    _lastBorderHeight: null,
    _hasLastBorderBox: false,
    init: function() {
        this.getComputedCSS = this._getComputedCSSFn();
        this._findPrefixedProps();
        this._findBorderBoxType(Dom.div());
        this._findPtValsCalcType(Dom.div(), Dom.div());
    },
    clearRecursiveSubcallsData: function() {
        this._lastRawWidth = null;
        this._lastRawHeight = null;
        this._lastBorderWidth = null;
        this._lastBorderHeight = null;
        this._hasLastBorderBox = false;
    },
    _areBrowserPtVals: function() {
        return this._ptValsCalcType == this._ptValsCalcTypes.BROWSER;
    },
    _areRecalcPtVals: function() {
        return this._ptValsCalcType == this._ptValsCalcTypes.RECALC;
    },
    getUncomputedCSS: function(a) {
        var b = a.parentNode.cloneNode();
        var c = a.cloneNode();
        b.appendChild(c);
        b.style.display = "none";
        var d = a.parentNode.nodeName == "HTML" ? a.parentNode : a.parentNode.parentNode;
        d.appendChild(b);
        var e = this.getComputedCSS(c);
        var f = {};
        var g = [ "paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "width", "height" ];
        for (var h = 0; h < g.length; h++) f[g[h]] = e[g[h]];
        d.removeChild(b);
        return f;
    },
    _ensureHasParentNode: function(a) {
        if (a.parentNode == null || !Dom.hasOwnProp(a.parentNode, "innerHTML")) err("no parentNode");
    },
    _ensureHasComputedProp: function(a, b) {
        if (!(b in a)) err("no prop " + b);
    },
    _hasPtCSSVal: function(a, b, c) {
        var d = function(a, b, c) {
            this._ensureHasParentNode(b);
            c = c || this.getUncomputedCSS(b);
            this._ensureHasComputedProp(c, a);
            var d = new RegExp("(.*\\d)%$");
            return d.test(c[a]);
        };
        if (Dom.isArray(a)) {
            for (var e = 0; e < a.length; e++) {
                if (d.call(this, a[e], b, c)) return true;
            }
            return false;
        } else return d.call(this, a, b, c);
    },
    _getPtCSSVal: function(a, b, c) {
        this._ensureHasParentNode(b);
        c = c || this.getUncomputedCSS(b);
        this._ensureHasComputedProp(c, a);
        return c[a];
    },
    _recalcPtVal: function(a, b, c, d) {
        var e = parseFloat(this._getPtCSSVal(d, a, c));
        return b / 100 * e;
    },
    _recalcTwoSidePropPtVals: function(a, b, c, d, e, f) {
        var g = e + (f ? "Top" : "Left");
        var h = e + (f ? "Bottom" : "Right");
        var i = c[g];
        var j = c[h];
        if (this._hasPtCSSVal(g, a, d)) i = this._recalcPtVal(a, b, d, g);
        if (this._hasPtCSSVal(h, a, d)) j = this._recalcPtVal(a, b, d, h);
        return i + j;
    },
    _isDefBoxSizing: function(a) {
        var b = this._prefixedProps.boxSizing;
        if (b && a[b] && a[b] === "border-box") return true;
        return false;
    },
    _isOuterBoxSizing: function() {
        return this._borderBoxType === this._borderBoxTypes.OUTER;
    },
    _isCascadedCSSVal: function(a) {
        return window.getComputedStyle || a.indexOf("px") !== -1 ? false : true;
    },
    _cascadedToComputed: function(a, b, c) {
        var d = new RegExp("(?=.*\\d)");
        if (!d.test(b)) return b;
        var e = a.style;
        var f = a.runtimeStyle;
        var g = e.left;
        var h = f && f.left;
        if (h) f.left = c.left;
        e.left = b;
        b = e.pixelLeft;
        e.left = g;
        if (h) f.left = h;
        return b;
    },
    _normalizeComputedCSS: function(a) {
        var b = parseFloat(a);
        var c = a.indexOf("%") === -1 && !isNaN(b);
        return c ? b : false;
    },
    _getComputedProps: function(a, b, c) {
        var d = {};
        for (var e = 0; e < this._getProps[a].length; e++) {
            var f = this._getProps[a][e];
            var g = b[f];
            if (this._isCascadedCSSVal(g)) g = this._cascadedToComputed(c, g, b);
            g = parseFloat(g);
            g = isNaN(g) ? 0 : g;
            d[f] = g;
        }
        return d;
    },
    positionLeft: function(a) {
        var b = this.getComputedCSS(a);
        if (b.display == "none") return 0;
        var c = this._getComputedProps("forPosLeft", b, a);
        return a.offsetLeft - c.marginLeft;
    },
    positionTop: function(a) {
        var b = this.getComputedCSS(a);
        if (b.display == "none") return 0;
        var c = this._getComputedProps("forPosTop", b, a);
        return a.offsetTop - c.marginTop;
    },
    offsetLeft: function(a) {
        var b = a.getBoundingClientRect();
        var c = window.pageXOffset || document.documentElement.scrollLeft;
        return b.left + c;
    },
    offsetTop: function(a) {
        var b = a.getBoundingClientRect();
        var c = window.pageYOffset || document.documentElement.scrollTop;
        return b.top + c;
    },
    cloneComputedStyle: function(a, b) {
        var c = function(a) {
            return a.replace(/-+(.)?/g, function(a, b) {
                return b ? b.toUpperCase() : "";
            });
        };
        var d = this.getComputedCSS(a);
        for (var e in d) {
            if (e == "cssText") continue;
            var f = c(e);
            if (b.style[f] != d[f]) b.style[f] = d[f];
        }
        this._reclone(d, b);
    },
    _reclone: function(a, b) {
        var c = [ "font", "fontSize", "fontWeight", "lineHeight" ];
        var d = [ "Width", "Color", "Style" ];
        var e = [ "Left", "Right", "Top", "Bottom" ];
        for (var f = 0; f < d.length; f++) {
            for (var g = 0; g < e.length; g++) c.push("border" + e[g] + d[f]);
        }
        for (var f = 0; f < c.length; f++) {
            var h = c[f];
            if (typeof a[h] != "undefined" && b.style[h] != a[h]) b.style[h] = a[h];
        }
    }
};