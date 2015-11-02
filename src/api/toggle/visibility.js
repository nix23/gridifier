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

VisibilityToggle = function() {
    return {
        show: function(item, left, top, time, timing, ev, sync, dom, api) {
            sync.flush(item);
            dom.show(item);
            ev.emit(api.EVENT.SHOW, item);
        },

        hide: function(item, left, top, time, timing, ev, sync, dom, api) {
            sync.flush(item);
            dom.hide(item);
            ev.emit(api.EVENT.HIDE, item);
        }
    }
}