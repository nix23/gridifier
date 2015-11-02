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

var ToggleApi = function() {
    settings.addApi("toggle", "scale", new ScaleToggleFactory());
    settings.addApi("toggle", "scaleWithFade", new ScaleToggleFactory(true));
    settings.addApi("toggle", "fade", new FadeToggle());
    settings.addApi("toggle", "visibility", new VisibilityToggle());

    var slideFactory = new SlideToggleFactory(settings);
    var rotateFactory = new RotateToggleFactory(settings);
}

proto(ToggleApi, {
    hasTranslateTransform: function(item, prefix) {
        var reg = /.*translate\((.*)\).*/;
        var reg3d = /.*translate3d\((.*)\).*/;

        if(reg.test(item.style[prefix.get("transform", item)]) ||
            reg3d.test(item.style[prefix.get("transform", item)]))
            return true;

        return false;
    },

    updateTransformOrigin: function(item, cnLeft, cnTop, iWidth, iHeight, dom) {
        var newLeft = parseFloat(cnLeft);
        var newTop = parseFloat(cnTop);

        var currLeft = parseFloat(item.style.left);
        var currTop = parseFloat(item.style.top);

        var getC = function(curr, prev) {
            if(curr > prev) return curr - prev;
            return (curr < prev) ? (prev - curr) * -1 : 0;
        }

        var x = getC(newLeft, currLeft);
        var y = getC(newTop, currTop);

        dom.css3.transformOrigin(item, (x + iWidth / 2) + "px " + (y + iHeight / 2) + "px");
    },

    resetTransformOrigin: function(item, dom) {
        dom.css3.transformOrigin(item, "50% 50%");
    }
});