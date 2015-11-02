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

SlideToggle = function() {}

proto(SlideToggle, {
    create: function(isY, alignTL, alignBR, reverseDir, fade) {
        var me = this;
        var fade = fade || false;

        var isY = isY || false;
        if(!isY) {
            var ltSize = "Width";
            var tlSize = "Height";
            var tlSide = "top";
        }
        else {
            var ltSize = "Height";
            var tlSize = "Width";
            var tlSide = "left";
        }

        var alignTL = alignTL || false;
        var alignBR = alignBR || false;

        var isLTSide = !reverseDir;
        var isRBSide = reverseDir;

        var getLeftTop = function(item, api) {
            if(isLTSide)
                return api.srManager["outer" + ltSize](item, true) * -1;
            else if(isRBSide) {
                var gridSize = api.srManager["outer" + ltSize](api.grid);
                var itemSize = api.srManager["outer" + ltSize](item, true);
                return gridSize + itemSize;
            }
        }

        var getTopLeft = function(item, api) {
            if(alignTL)
                return 0;
            else if(alignBR) {
                var gridSize = api.srManager["outer" + tlSize](api.grid);
                var itemSize = api.srManager["outer" + tlSize](item, true);
                return gridSize + itemSize;
            }
            else
                return item.style[tlSide];
        }

        var getInitCoords = function(item, api) {
            var c = {};
            c.x = getLeftTop(item, api) + "px";
            c.y = getTopLeft(item, api) + "px";

            if(isY) {
                var tmp = c.y;
                c.y = c.x;
                c.x = tmp;
            }

            return c;
        }

        return {
            show: function(item, left, top, time, timing, ev, sync, dom, api, cn) {
                sync.flush(item);
                if(!dom.hasTransitions()) {
                    dom.show(item);
                    ev.emit(api.EVENT.SHOW, item);
                    return;
                }

                var initC = getInitCoords(item, api);
                sync.add(item, setTimeout(function() {
                    dom.set(item, api.TOGGLE.IS_ACTIVE_WITH_CC, "y");

                    if(!dom.has(item, api.TOGGLE.IS_ACTIVE)) {
                        if(fade) {
                            dom.css3.transition(item, "none");
                            dom.css3.opacity(item, 0);
                            dom.css3.transition(item, "");
                        }

                        api.cc(item, initC.x, initC.y, 0, timing, dom, api.prefix, api.getS);
                        dom.set(item, api.TOGGLE.IS_ACTIVE, "y");
                    }
                }, 0));

                // Setting translated position after 0ms call requires a little delay
                // per browsers repaint(Also it should be enough to propogate NIS item align(20ms))
                sync.add(item, setTimeout(function() {
                    dom.show(item);

                    if(fade) {
                        var prefix = api.prefix.getForCss('opacity', item);
                        dom.css3.transitionProperty(item, prefix + " " + time + "ms " + timing);
                        dom.css3.opacity(item, 1);
                    }
                    api.cc(item, cn.x1, cn.y1, time, timing, dom, api.prefix, api.getS);
                }, 40));

                sync.add(item, setTimeout(function() {
                    dom.rm(item, api.TOGGLE.IS_ACTIVE_WITH_CC);
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

                var initC = getInitCoords(item, api);
                dom.set(item, api.TOGGLE.IS_ACTIVE, "y");
                dom.set(item, api.TOGGLE.IS_ACTIVE_WITH_CC, "y");

                if(fade) {
                    var prefix = api.prefix.getForCss('opacity', item);
                    dom.css3.transition(item, prefix + " " + time + "ms " + timing);
                    dom.css3.opacity(item, 0);
                }
                api.cc(item, initC.x, initC.y, time, timing, dom, api.prefix, api.getS);

                // Hidding item a little before animation def finish(Blink fix)
                sync.add(item, setTimeout(function() {
                    dom.hide(item);
                }, time));

                sync.add(item, setTimeout(function() {
                    if(fade) {
                        var prefix = api.prefix.getForCss('opacity', item);
                        dom.css3.transitionProperty(item, prefix + " 0ms " + timing);
                        dom.css3.opacity(item, 1);
                    }

                    dom.rm(item, api.TOGGLE.IS_ACTIVE_WITH_CC);
                    dom.hide(item);
                    dom.rm(item, api.TOGGLE.IS_ACTIVE);
                    ev.emit(api.EVENT.HIDE, item);
                }, time + 20));
            }
        };
    },

    createCycled: function(sliderFns) {
        var slideIndex = 1;
        return {
            show: function() {
                slideIndex++;
                var nextSlideIndex = slideIndex % sliderFns.length;
                var slider = sliderFns[nextSlideIndex];

                slider.show.apply(this, arguments);
            },

            hide: function() {
                slideIndex++;
                var nextSlideIndex = slideIndex % sliderFns.length;
                var slider = sliderFns[nextSlideIndex];

                slider.hide.apply(this, arguments);
            }
        };
    }
});