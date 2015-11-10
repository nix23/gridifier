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

PositionCc = function() {
    return function(item, left, top, time, timing, dom, prefix, getS, syncToggle) {
        if(!dom.hasTransitions()) {
            getS("coordsChanger")["default"].apply(this, arguments);
            return;
        }

        left = parseFloat(left) + "px";
        top = parseFloat(top) + "px";

        var syncToggle = syncToggle || false;
        if(syncToggle) {
            dom.css3.transform(item, "scale3d(1,1,1)");
            return;
        }

        if(left != item.style.left) {
            dom.css3.transitionProperty(item, "left " + time + "ms " + timing);
            dom.css.set(item, {left: left});
        }

        if(top != item.style.top) {
            dom.css3.transitionProperty(item, "top " + time + "ms " + timing);
            dom.css.set(item, {top: top});
        }
    }
}