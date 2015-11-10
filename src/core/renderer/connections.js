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

var RendererCns = function() {};

proto(RendererCns, {
    isRendered: function(a) {
        return Dom.has(a.item, C.REND.CN_RENDERED_DATA);
    },
    markAsRendered: function(a) {
        Dom.set(a.item, C.REND.CN_RENDERED_DATA, "y");
    },
    unmarkAsRendered: function(a) {
        Dom.rm(a.item, C.REND.CN_RENDERED_DATA);
    },
    left: function(a) {
        var b = bind("eq", settings);
        if (b("grid", "vertical")) var c = a.x1; else var c = b("intersections", true) ? a.x1 : a.x1 + a.hOffset;
        return c + "px";
    },
    top: function(a) {
        var b = bind("eq", settings);
        if (b("grid", "vertical")) var c = b("intersections", true) ? a.y1 : a.y1 + a.vOffset; else var c = a.y1;
        return c + "px";
    }
});