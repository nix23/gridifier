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

var Renderer = function() {};

proto(Renderer, {
    show: function(a) {
        var b = rendererCns;
        if (!Dom.isArray(a)) var a = [ a ];
        for (var c = 0; c < a.length; c++) {
            var d = a[c];
            this.unmarkAsSchToHide(d.item);
            if (b.isRendered(d)) continue;
            b.markAsRendered(d);
            rendererQueue.schedule(RENDER_OPS.SHOW, d, b.left(d), b.top(d));
        }
    },
    hide: function(a) {
        var b = rendererCns;
        if (!Dom.isArray(a)) var a = [ a ];
        for (var c = 0; c < a.length; c++) {
            var d = a[c];
            if (!this.wasSchToHide(d.item)) continue;
            b.unmarkAsRendered(d);
            rendererQueue.schedule(RENDER_OPS.HIDE, d, b.left(d), b.top(d));
        }
    },
    renderRepositioned: function(a) {
        this.render(a, false);
    },
    render: function(a, b) {
        var c = rendererCns;
        var b = b || false;
        for (var d = 0; d < a.length; d++) {
            var e = a[d];
            if (b !== false) {
                var f = false;
                for (var g = 0; g < b.length; g++) {
                    if (a[d].itemGUID == b[g].itemGUID) {
                        f = true;
                        break;
                    }
                }
                if (f) continue;
            }
            rendererQueue.schedule(RENDER_OPS.RENDER, e, c.left(e), c.top(e));
        }
    },
    renderAfterDelay: function(a, b) {
        var b = b || C.RENDER_DEF_DELAY;
        for (var c = 0; c < a.length; c++) rendererQueue.schedule(RENDER_OPS.DEL_RENDER, a[c], null, null, b);
    },
    rotate: function(a) {
        var b = [];
        for (var c = 0; c < a.length; c++) {
            var d = cnsCore.find(a[c]);
            rendererCns.unmarkAsRendered(d);
            b.push(d);
        }
        this.show(b);
    },
    markAsSchToHide: function(a) {
        for (var b = 0; b < a.length; b++) Dom.set(a[b].item, C.REND.SCH_TO_HIDE_DATA, "y");
    },
    unmarkAsSchToHide: function(a) {
        Dom.rm(a, C.REND.SCH_TO_HIDE_DATA);
    },
    wasSchToHide: function(a) {
        return Dom.has(a, C.REND.SCH_TO_HIDE_DATA);
    }
});