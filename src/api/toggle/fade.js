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

FadeToggle = function() {
    return {
        show: function(item, left, top, time, timing, ev, sync, dom, api) {
            sync.flush(item);
            if(!dom.hasTransitions()) {
                dom.show(item);
                ev.emit(api.EVENT.SHOW, item);
                return;
            }

            if(!dom.has(item, api.TOGGLE.IS_ACTIVE)) {
                dom.css3.transition(item, "none");
                dom.css3.opacity(item, "0");
                dom.set(item, api.TOGGLE.IS_ACTIVE, "y");
            }

            sync.add(item, setTimeout(function() {
                var prefix = api.prefix.getForCss('opacity', item);

                dom.show(item);
                dom.css3.transition(item, prefix + " " + time + "ms " + timing);
                dom.css3.opacity(item, 1);
            }, 40));

            sync.add(item, setTimeout(function() {
                dom.rm(item, api.TOGGLE.IS_ACTIVE);
                ev.emit(api.EVENT.SHOW, item);
            }, time + 60));
        },

        hide: function(item, left, top, time, timing, ev, sync, dom, api) {
            sync.flush(item);
            if(!dom.hasTransitions()) {
                dom.hide(item);
                ev.emit(api.EVENT.HIDE, item);
                return;
            }

            var prefix = api.prefix.getForCss('opacity', item);
            dom.css3.transition(item, prefix + " " + time + "ms " + timing);
            dom.set(item, api.TOGGLE.IS_ACTIVE, "y");
            dom.css3.opacity(item, "0");

            sync.add(item, setTimeout(function() {
                dom.rm(item, api.TOGGLE.IS_ACTIVE);
                dom.hide(item);

                dom.css3.transition(item, "none");
                dom.css3.opacity(item, "1");
                dom.css3.transition(item, "");

                ev.emit(api.EVENT.HIDE, item);
            }, time + 20));
        }
    }
}