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

SizesResolver.getComputedCSSFunction = function() {
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

SizesResolver.determineMaybePrefixedProperties = function() {
    this.maybePrefixedProperties.boxSizing = Prefixer.get("boxSizing");
};

SizesResolver.determineBorderBoxComputedSizesCalculationStrategy = function() {
    var a = document.createElement("div");
    a.style.width = "100px";
    a.style.padding = "10px 20px";
    a.style.borderWidth = "10px 20px";
    a.style.borderStyle = "solid";
    var b = this.maybePrefixedProperties.boxSizing;
    a.style[b] = "border-box";
    var c = document.body || document.documentElement;
    c.appendChild(a);
    var d = this.getComputedCSS(a);
    if (this.normalizeComputedCSSSizeValue(d.width) === 100) this.borderBoxSizingStrategy = this.borderBoxSizingStrategies.OUTER; else this.borderBoxSizingStrategy = this.borderBoxSizingStrategies.INNER;
    c.removeChild(a);
};

SizesResolver.determinePercentageCSSValuesCalcStrategy = function() {
    var a = document.createElement("div");
    a.style.width = "1178px";
    a.style.height = "300px";
    a.style.position = "absolute";
    a.style.left = "-9000px";
    a.style.top = "0px";
    a.style.visibility = "hidden";
    var b = document.body || document.documentElement;
    b.appendChild(a);
    var c = document.createElement("div");
    c.style.width = "10%";
    c.style.height = "200px";
    a.appendChild(c);
    var d = 117.796875;
    var e = parseFloat(this.outerWidth(c, true));
    if (d.toFixed(1) == e.toFixed(1)) this.percentageCSSValuesCalcStrategy = this.percentageCSSValuesCalcStrategies.BROWSER_NATIVE; else this.percentageCSSValuesCalcStrategy = this.percentageCSSValuesCalcStrategies.RECALCULATE;
    b.removeChild(a);
};