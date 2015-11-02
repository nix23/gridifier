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

SizesResolver.outerWidth = function(a, b, c, d) {
    var b = b || false;
    var c = c || false;
    var d = d || false;
    var e = this.getComputedCSS(a);
    if (c || this._areBrowserPtVals()) var f = false; else if (this._areRecalcPtVals()) {
        this._ensureHasParentNode(a);
        var f = this._hasPtCSSVal("width", a);
    }
    if (e.display === "none") return 0;
    var g = this._getComputedProps("forOw", e, a);
    var h = g.paddingLeft + g.paddingRight;
    var i = g.marginLeft + g.marginRight;
    var j = g.borderLeftWidth + g.borderRightWidth;
    var k = 0;
    var l = this._normalizeComputedCSS(e.width);
    if (l !== false) k = l;
    var m = null;
    var n = null;
    if (f) {
        m = this.getUncomputedCSS(a);
        n = this.recalcPtWidthFn.call(this, a.parentNode, false, a.parentNode.nodeName == "HTML", true);
        if (this._hasLastBorderBox && this._hasPtCSSVal("width", a, m)) n -= this._lastBorderWidth;
    }
    if (f && this._hasPtCSSVal([ "paddingLeft", "paddingRight" ], a, m)) {
        h = this._recalcTwoSidePropPtVals(a, n, g, m, "padding");
    }
    if (f && this._hasPtCSSVal("width", a, m)) k = this._recalcPtVal(a, n, m, "width");
    if (!this._isDefBoxSizing(e) || this._isDefBoxSizing(e) && !this._isOuterBoxSizing()) {
        this._lastRawWidth = k;
        k += h;
        if (!d) k += j;
        this._hasLastBorderBox = false;
    } else {
        this._hasLastBorderBox = true;
        this._lastRawWidth = k;
        this._lastBorderWidth = j;
    }
    if (b) {
        if (f && this._hasPtCSSVal([ "marginLeft", "marginRight" ], a, m)) {
            i = this._recalcTwoSidePropPtVals(a, n, g, m, "margin");
        }
        k += i;
    }
    return k;
};