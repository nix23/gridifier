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

SizesResolver.outerHeight = function(a, b, c, d) {
    var b = b || false;
    var c = c || false;
    var d = d || false;
    var e = this.getComputedCSS(a);
    if (c) var f = false; else if (this.isBrowserNativePercentageCSSValuesCalcStrategy()) var f = false; else if (this.isRecalculatePercentageCSSValuesCalcStrategy()) {
        this._ensureHasParentNode(a);
        if (this.hasPercentageCSSValue("height", a)) var f = true; else var f = false;
    }
    if (e.display === "none") return 0;
    var g = this.getComputedProperties("forOuterHeight", e, a);
    var h = g.paddingTop + g.paddingBottom;
    var i = g.marginTop + g.marginBottom;
    var j = g.borderTopWidth + g.borderBottomWidth;
    var k = 0;
    var l = this.normalizeComputedCSSSizeValue(e.height);
    if (l !== false) k = l;
    var m = null;
    var n = null;
    var o = null;
    if (f) {
        m = this._getComputedCSSWithMaybePercentageSizes(a);
        if (a.parentNode.nodeName == "HTML") var p = true; else var p = false;
        n = this.recalculatePercentageWidthFunction.call(this, a.parentNode, false, p, true);
        if (this.hasLastRecalculatedDOMElBorderBoxBS) {
            n -= this.lastRecalculatedDOMElBorderWidth;
        }
        o = this.recalculatePercentageHeightFunction.call(this, a.parentNode, false, p, true);
        if (this.hasLastRecalculatedDOMElBorderBoxBS && this.hasPercentageCSSValue("height", a, m)) {
            o -= this.lastRecalculatedDOMElBorderHeight;
        }
    }
    if (f && (this.hasPercentageCSSValue("paddingTop", a, m) || this.hasPercentageCSSValue("paddingBottom", a, m))) {
        h = this._recalculateTwoSidePropertyWithPercentageValues(a, n, g, m, "padding", "vertical");
    }
    if (f && this.hasPercentageCSSValue("height", a, m)) {
        k = this._recalculateHeightWithPercentageValue(a, o, m);
    }
    if (!this.isBoxSizingBorderBox(e) || this.isBoxSizingBorderBox(e) && !this.isOuterBorderBoxSizing()) {
        this.lastRecalculatedDOMElRawHeight = k;
        k += h;
        if (!d) k += j;
        this.hasLastRecalculatedDOMElBorderBoxBS = false;
    } else {
        this.hasLastRecalculatedDOMElBorderBoxBS = true;
        this.lastRecalculatedDOMElRawHeight = k;
        this.lastRecalculatedDOMElBorderHeight = j;
    }
    if (b) {
        if (f && (this.hasPercentageCSSValue("marginTop", a, m) || this.hasPercentageCSSValue("marginBottom", a, m))) {
            i = this._recalculateTwoSidePropertyWithPercentageValues(a, n, g, m, "margin", "vertical");
        }
        k += i;
    }
    return k;
};