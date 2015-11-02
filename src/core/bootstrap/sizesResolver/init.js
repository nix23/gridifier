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

SizesResolver._getComputedCSSFn = function() {
    if (window.getComputedStyle) {
        return function(a) {
            return window.getComputedStyle(a, null);
        };
    } else {
        return function(a) {
            return a.currentStyle;
        };
    }
};

SizesResolver._findPrefixedProps = function() {
    this._prefixedProps.boxSizing = Prefixer.get("boxSizing");
};

SizesResolver._findBorderBoxType = function(a) {
    Dom.css.set(a, {
        width: "100px",
        padding: "10px 20px",
        borderWidth: "10px 20px",
        borderStyle: "solid"
    });
    var b = this._prefixedProps.boxSizing;
    a.style[b] = "border-box";
    var c = document.body || document.documentElement;
    c.appendChild(a);
    var d = this.getComputedCSS(a);
    if (this._normalizeComputedCSS(d.width) === 100) this._borderBoxType = this._borderBoxTypes.OUTER; else this._borderBoxType = this._borderBoxTypes.INNER;
    c.removeChild(a);
};

SizesResolver._findPtValsCalcType = function(a, b, c) {
    Dom.css.set(a, {
        width: "1178px",
        height: "300px",
        position: "absolute",
        left: "-9000px",
        top: "0px",
        visibility: "hidden"
    });
    var d = document.body || document.documentElement;
    d.appendChild(a);
    Dom.css.set(b, {
        width: "10%",
        height: "200px"
    });
    a.appendChild(b);
    var e = 117.796875.toFixed(1);
    var f = parseFloat(this.outerWidth(b, true, true)).toFixed(1);
    this._ptValsCalcType = e == f ? this._ptValsCalcTypes.BROWSER : this._ptValsCalcTypes.RECALC;
    d.removeChild(a);
};