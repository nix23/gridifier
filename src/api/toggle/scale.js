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

ScaleToggle = function(beforeShow, onShow, beforeHide, afterHide) {
    return {
        show: function(item, left, top, time, timing, ev, sync, dom, api, cn) {
            sync.flush(item);
            if(!dom.hasTransitions()) {
                dom.show(item);
                ev.emit(api.EVENT.SHOW, item);
                return;
            }

            if(api.toggle.hasTranslateTransform(item, api.prefix)) {
                var srm = api.srManager;
                api.toggle.updateTransformOrigin(
                   item, cn.x1, cn.y1, srm.outerWidth(item, true), srm.outerHeight(item, true), dom
                );
            }

            if(!dom.has(item, api.TOGGLE.IS_ACTIVE)) {
                dom.css3.transition(item, "none");
                beforeShow(item, time, timing, dom, api);
                dom.css3.transformProperty(item, "scale3d", "0,0,0");
                dom.set(item, api.TOGGLE.IS_ACTIVE, "y");
            }

            sync.add(item, setTimeout(function() {
                var prefix = api.prefix.getForCss('transform', item);

                dom.show(item);
                dom.css3.transition(item, prefix + " " + time + "ms " + timing);
                dom.css3.transformProperty(item, "scale3d", "1,1,1");
                onShow(item, time, timing, dom, api);
            }, 40));

            sync.add(item, setTimeout(function() {
                api.toggle.resetTransformOrigin(item, dom);
                dom.rm(item, api.TOGGLE.IS_ACTIVE);
                ev.emit(api.EVENT.SHOW, item);
            }, time + 60));
        },

        hide: function(item, left, top, time, timing, ev, sync, dom, api, cn) {
            sync.flush(item);
            if(!dom.hasTransitions()) {
                dom.hide(item);
                ev.emit(api.EVENT.HIDE, item);
                return;
            }

            if(api.toggle.hasTranslateTransform(item, api.prefix)) {
                var srm = api.srManager;
                api.toggle.updateTransformOrigin(
                    item, cn.x1, cn.y1, srm.outerWidth(item, true), srm.outerHeight(item, true), dom
                );
            }

            var prefix = api.prefix.getForCss('transform', item);
            dom.css3.transition(item, prefix + " " + time + "ms " + timing);
            dom.set(item, api.TOGGLE.IS_ACTIVE, "y");
            dom.css3.transformProperty(item, "scale3d", "0,0,0");
            beforeHide(item, time, timing, dom, api);

            var hideTime = (time > 200) ? time - 100 : time - 50;
            if(hideTime < 0) hideTime = 0;

            // setTimeout should be smaller than animation time(Flickering bug in Webkit)
            sync.add(item, setTimeout(function() {
                dom.hide(item);
            }, hideTime));

            sync.add(item, setTimeout(function() {
                dom.hide(item);
                dom.css3.transition(item, "none");
                dom.css3.transformProperty(item, "scale3d", "1,1,1");

                afterHide(item, time, timing, dom, api);
                dom.css3.transition(item, "");
                api.toggle.resetTransformOrigin(item, dom);

                dom.rm(item, api.TOGGLE.IS_ACTIVE);
                ev.emit(api.EVENT.HIDE, item);
            }, time + 20));
        }
    }
}