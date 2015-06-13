/* Gridifier v1.0.0
 * Async Responsive HTML Grids
 * http://gridifier.io
 * 
 * Gridifier is dual-licensed:
 *   GPLV3 per non-commercial usage; 
 *   Commercial license per commercial usage.
 * Read http://gridifier.io/license for details.
 * Copyright 2015 nTech
 */

var SizesResolver = {
    getComputedCSS: null,
    propertiesToGet: {
        forOuterWidth: [ "paddingLeft", "paddingRight", "marginLeft", "marginRight", "borderLeftWidth", "borderRightWidth" ],
        forOuterHeight: [ "paddingTop", "paddingBottom", "marginTop", "marginBottom", "borderTopWidth", "borderBottomWidth" ],
        forPositionLeft: [ "marginLeft" ],
        forPositionTop: [ "marginTop" ]
    },
    maybePrefixedProperties: {
        boxSizing: null
    },
    borderBoxSizingStrategy: null,
    borderBoxSizingStrategies: {
        OUTER: 0,
        INNER: 1
    },
    percentageCSSValuesCalcStrategy: null,
    percentageCSSValuesCalcStrategies: {
        BROWSER_NATIVE: 0,
        RECALCULATE: 1
    },
    recalculatePercentageWidthFunction: function(a, b, c, d) {
        return this.outerWidth(a, b, c, d);
    },
    recalculatePercentageHeightFunction: function(a, b, c, d) {
        return this.outerHeight(a, b, c, d);
    },
    lastRecalculatedDOMElRawWidth: null,
    lastRecalculatedDOMElRawHeight: null,
    lastRecalculatedDOMElBorderWidth: null,
    lastRecalculatedDOMElBorderHeight: null,
    hasLastRecalculatedDOMElBorderBoxBS: false,
    init: function() {
        this.getComputedCSS = this.getComputedCSSFunction();
        this.determineMaybePrefixedProperties();
        this.determineBorderBoxComputedSizesCalculationStrategy();
        this.determinePercentageCSSValuesCalcStrategy();
    },
    clearRecursiveSubcallsData: function() {
        this.lastRecalculatedDOMElRawWidth = null;
        this.lastRecalculatedDOMElRawHeight = null;
        this.lastRecalculatedDOMElBorderWidth = null;
        this.lastRecalculatedDOMElBorderHeight = null;
        this.hasLastRecalculatedDOMElBorderBoxBS = false;
    },
    isBrowserNativePercentageCSSValuesCalcStrategy: function() {
        return this.percentageCSSValuesCalcStrategy == this.percentageCSSValuesCalcStrategies.BROWSER_NATIVE;
    },
    isRecalculatePercentageCSSValuesCalcStrategy: function() {
        return this.percentageCSSValuesCalcStrategy == this.percentageCSSValuesCalcStrategies.RECALCULATE;
    },
    _isPercentageCSSValue: function(a) {
        var b = new RegExp("(.*\\d)%$");
        if (b.test(a)) return true;
        return false;
    },
    getComputedCSSWithMaybePercentageSizes: function(a) {
        return this._getComputedCSSWithMaybePercentageSizes(a);
    },
    _getComputedCSSWithMaybePercentageSizes: function(a) {
        var b = a.parentNode.cloneNode();
        var c = a.cloneNode();
        b.appendChild(c);
        b.style.display = "none";
        if (a.parentNode.nodeName == "HTML") var d = a.parentNode; else var d = a.parentNode.parentNode;
        d.appendChild(b);
        var e = this.getComputedCSS(c);
        var f = {};
        var g = [ "paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "width", "height" ];
        for (var h = 0; h < g.length; h++) {
            f[g[h]] = e[g[h]];
        }
        d.removeChild(b);
        return f;
    },
    _ensureHasParentNode: function(a) {
        if (a.parentNode == null || !Dom.hasDOMElemOwnProperty(a.parentNode, "innerHTML")) {
            var b = "";
            b += "SizesResolver error: ";
            b += "Can't resolve element parentNode per element: ";
            b += a;
            throw new Error(b);
        }
    },
    _ensureComputedCSSHasProperty: function(a, b) {
        if (!(b in a)) {
            var c = "";
            c += "SizesResolver error: ";
            c += "Can't find property '" + b + "' in elementComputedCSS. ";
            c += "Element computed CSS: ";
            c += a;
            throw new Error(c);
        }
    },
    hasPercentageCSSValue: function(a, b, c) {
        this._ensureHasParentNode(b);
        var c = c || this._getComputedCSSWithMaybePercentageSizes(b);
        this._ensureComputedCSSHasProperty(c, a);
        return this._isPercentageCSSValue(c[a]);
    },
    getPercentageCSSValue: function(a, b, c) {
        this._ensureHasParentNode(b);
        var c = c || this._getComputedCSSWithMaybePercentageSizes(b);
        this._ensureComputedCSSHasProperty(c, a);
        return c[a];
    },
    _recalculateTwoSidePropertyWithPercentageValues: function(a, b, c, d, e, f) {
        if (f == "horizontal") {
            var g = "Left";
            var h = "Right";
        } else if (f == "vertical") {
            var g = "Top";
            var h = "Bottom";
        } else {
            throw new Error("SizesResolver error: wrong direction in twoSideProperty recalculation.");
        }
        if (e != "margin" && e != "padding") {
            throw new Error("SizesResolver error: unknown CSSProperty in twoSideProperty recalculation.");
        }
        var i = e + g;
        var j = e + h;
        var k = c[i];
        var l = c[j];
        if (this.hasPercentageCSSValue(i, a, d)) {
            var m = parseFloat(this.getPercentageCSSValue(i, a, d));
            k = b / 100 * m;
        }
        if (this.hasPercentageCSSValue(j, a, d)) {
            var n = parseFloat(this.getPercentageCSSValue(j, a, d));
            l = b / 100 * n;
        }
        return k + l;
    },
    _recalculateWidthWithPercentageValue: function(a, b, c) {
        var d = parseFloat(this.getPercentageCSSValue("width", a, c));
        return b / 100 * d;
    },
    _recalculateHeightWithPercentageValue: function(a, b, c) {
        var d = parseFloat(this.getPercentageCSSValue("height", a, c));
        return b / 100 * d;
    },
    positionLeft: function(a) {
        var b = this.getComputedCSS(a);
        if (b.display == "none") return 0;
        var c = this.getComputedProperties("forPositionLeft", b, a);
        return a.offsetLeft - c.marginLeft;
    },
    positionTop: function(a) {
        var b = this.getComputedCSS(a);
        if (b.display == "none") return 0;
        var c = this.getComputedProperties("forPositionTop", b, a);
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
    getComputedProperty: function(a, b) {
        var c = this.getComputedCSS(a);
        return c[b];
    },
    isBoxSizingBorderBox: function(a) {
        var b = this.maybePrefixedProperties.boxSizing;
        if (b && a[b] && a[b] === "border-box") return true;
        return false;
    },
    isOuterBorderBoxSizing: function() {
        return this.borderBoxSizingStrategy === this.borderBoxSizingStrategies.OUTER ? true : false;
    },
    isCascadedCSSValue: function(a) {
        return window.getComputedStyle || a.indexOf("px") !== -1 ? false : true;
    },
    transformFromCascadedToComputedStyle: function(a, b, c) {
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
    normalizeComputedCSSSizeValue: function(a) {
        var b = parseFloat(a);
        var c = a.indexOf("%") === -1 && !isNaN(b);
        return c ? b : false;
    },
    getComputedProperties: function(a, b, c) {
        var d = {};
        for (var e = 0; e < this.propertiesToGet[a].length; e++) {
            var f = this.propertiesToGet[a][e];
            var g = b[f];
            if (this.isCascadedCSSValue(g)) g = this.transformFromCascadedToComputedStyle(c, g, b);
            g = parseFloat(g);
            g = isNaN(g) ? 0 : g;
            d[f] = g;
        }
        return d;
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
        var g = [ "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth", "borderLeftColor", "borderRightColor", "borderTopColor", "borderBottomColor", "borderLeftStyle", "borderRightStyle", "borderTopStyle", "borderBottomStyle", "font", "fontSize", "fontWeight", "lineHeight" ];
        for (var h = 0; h < g.length; h++) {
            var f = g[h];
            if (typeof d[f] != "undefined" && b.style[f] != d[f]) b.style[f] = d[f];
        }
    }
};