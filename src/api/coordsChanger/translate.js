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

TranslateCc = function(getTrX, getTrY, beforeSyncToggle, is3d) {
    var trProp = (is3d) ? "translate3d" : "translate";
    var trInit = (is3d) ? "(0px,0px,0px)" : "(0px,0px)";

    return function(item, left, top, time, timing, dom, prefix, getS, syncToggle) {
        if(!dom.hasTransitions()) {
            getS("coordsChanger")["default"].apply(this, arguments);
            return;
        }

        var syncToggle = syncToggle || false;
        if(syncToggle) {
            beforeSyncToggle(item, left, top, dom);
            dom.css3.transform(item, "scale3d(1,1,1) " + trProp + trInit);
            return;
        }

        var left = parseFloat(left);
        var top = parseFloat(top);

        var currLeft = parseFloat(item.style.left);
        var currTop = parseFloat(item.style.top);

        var getTr = function(curr, prev) {
            if(curr > prev) return curr - prev;
            return (curr < prev) ? (prev - curr) * -1 : 0;
        }

        var trX = getTr(left, currLeft);
        var trY = getTr(top, currTop);

        var trReg = (is3d) ? /.*translate3d\((.*)\).*/ : /.*translate\((.*)\).*/;
        var matches = trReg.exec(item.style[prefix.get("transform")]);
        if(matches == null || typeof matches[1] == "undefined" || matches[1] == null) {
            var setNewTr = true;
        }
        else {
            var trParts = matches[1].split(",");
            var lastTrX = trParts[0].gridifierTrim();
            var lastTrY = trParts[1].gridifierTrim();

            if(lastTrX == (trX + "px") && lastTrY == (trY + "px"))
                var setNewTr = false;
            else
                var setNewTr = true;
        }

        if(setNewTr) {
            dom.css3.transitionProperty(
                item, prefix.getForCss('transform', item) + " " + time + "ms " + timing
            );

            trX = getTrX(trX);
            trY = getTrY(trY);

            if(is3d) {
                dom.css3.perspective(item, "1000");
                dom.css3.backfaceVisibility(item, "hidden");
            }
            var last = (is3d) ? ",0px" : "";
            dom.css3.transformProperty(item, trProp, trX + "px," + trY + "px" + last);
        }
    }
}