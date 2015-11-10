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