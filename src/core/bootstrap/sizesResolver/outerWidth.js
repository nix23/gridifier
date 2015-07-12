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

SizesResolver.outerWidth = function(a, b, c, d) {
    var b = b || false;
    var c = c || false;
    var d = d || false;
    var e = this.getComputedCSS(a);
    if (c) var f = false; else if (this.isBrowserNativePercentageCSSValuesCalcStrategy()) var f = false; else if (this.isRecalculatePercentageCSSValuesCalcStrategy()) {
        this._ensureHasParentNode(a);
        if (this.hasPercentageCSSValue("width", a)) var f = true; else var f = false;
    }
    if (e.display === "none") return 0;
    var g = this.getComputedProperties("forOuterWidth", e, a);
    var h = g.paddingLeft + g.paddingRight;
    var i = g.marginLeft + g.marginRight;
    var j = g.borderLeftWidth + g.borderRightWidth;
    var k = 0;
    var l = this.normalizeComputedCSSSizeValue(e.width);
    if (l !== false) k = l;
    var m = null;
    var n = null;
    if (f) {
        m = this._getComputedCSSWithMaybePercentageSizes(a);
        if (a.parentNode.nodeName == "HTML") var o = true; else var o = false;
        n = this.recalculatePercentageWidthFunction.call(this, a.parentNode, false, o, true);
        if (this.hasLastRecalculatedDOMElBorderBoxBS && this.hasPercentageCSSValue("width", a, m)) {
            n -= this.lastRecalculatedDOMElBorderWidth;
        }
    }
    if (f && (this.hasPercentageCSSValue("paddingLeft", a, m) || this.hasPercentageCSSValue("paddingRight", a, m))) {
        h = this._recalculateTwoSidePropertyWithPercentageValues(a, n, g, m, "padding", "horizontal");
    }
    if (f && this.hasPercentageCSSValue("width", a, m)) {
        k = this._recalculateWidthWithPercentageValue(a, n, m);
    }
    if (!this.isBoxSizingBorderBox(e) || this.isBoxSizingBorderBox(e) && !this.isOuterBorderBoxSizing()) {
        this.lastRecalculatedDOMElRawWidth = k;
        k += h;
        if (!d) k += j;
        this.hasLastRecalculatedDOMElBorderBoxBS = false;
    } else {
        this.hasLastRecalculatedDOMElBorderBoxBS = true;
        this.lastRecalculatedDOMElRawWidth = k;
        this.lastRecalculatedDOMElBorderWidth = j;
    }
    if (b) {
        if (f && (this.hasPercentageCSSValue("marginLeft", a, m) || this.hasPercentageCSSValue("marginRight", a, m))) {
            i = this._recalculateTwoSidePropertyWithPercentageValues(a, n, g, m, "margin", "horizontal");
        }
        k += i;
    }
    return k;
};