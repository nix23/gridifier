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

SizesResolver.outerHeight = function(a, b, c, d) {
    var b = b || false;
    var c = c || false;
    var d = d || false;
    var e = this.getComputedCSS(a);
    if (c || this._areBrowserPtVals()) var f = false; else if (this._areRecalcPtVals()) {
        this._ensureHasParentNode(a);
        var f = this._hasPtCSSVal("height", a);
    }
    if (e.display === "none") return 0;
    var g = this._getComputedProps("forOh", e, a);
    var h = g.paddingTop + g.paddingBottom;
    var i = g.marginTop + g.marginBottom;
    var j = g.borderTopWidth + g.borderBottomWidth;
    var k = 0;
    var l = this._normalizeComputedCSS(e.height);
    if (l !== false) k = l;
    var m = null;
    var n = null;
    var o = null;
    if (f) {
        m = this.getUncomputedCSS(a);
        n = this.recalcPtWidthFn.call(this, a.parentNode, false, a.parentNode.nodeName == "HTML", true);
        if (this._hasLastBorderBox) n -= this._lastBorderWidth;
        o = this.recalcPtHeightFn.call(this, a.parentNode, false, a.parentNode.nodeName == "HTML", true);
        if (this._hasLastBorderBox && this._hasPtCSSVal("height", a, m)) o -= this._lastBorderHeight;
    }
    if (f && this._hasPtCSSVal([ "paddingTop", "paddingBottom" ], a, m)) {
        h = this._recalcTwoSidePropPtVals(a, n, g, m, "padding", true);
    }
    if (f && this._hasPtCSSVal("height", a, m)) k = this._recalcPtVal(a, o, m, "height");
    if (!this._isDefBoxSizing(e) || this._isDefBoxSizing(e) && !this._isOuterBoxSizing()) {
        this._lastRawHeight = k;
        k += h;
        if (!d) k += j;
        this._hasLastBorderBox = false;
    } else {
        this._hasLastBorderBox = true;
        this._lastRawHeight = k;
        this._lastBorderHeight = j;
    }
    if (b) {
        if (f && this._hasPtCSSVal([ "marginTop", "marginBottom" ], a, m)) {
            i = this._recalcTwoSidePropPtVals(a, n, g, m, "margin", true);
        }
        k += i;
    }
    return k;
};