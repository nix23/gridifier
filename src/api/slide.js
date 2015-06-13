/* Gridifier v1.0.0
 * Async Responsive HTML Grids
 * http://gridifier.io
 * 
 * Gridifier is dual-licensed:
 *   GPLV3 per non-commercial usage; 
 *   Commercial license per commercial usage.
 * Read http://gridifier.io/license for details.
 * Copyright 2015 nTech
 */

Gridifier.Api.Slide = function(settings, gridifier, eventEmitter, sizesResolverManager) {
    var me = this;

    this._settings = null;
    this._gridifier = null;
    this._eventEmitter = null;
    this._sizesResolverManager = null;

    this._css = {
    };

    this._construct = function() {
        me._settings = settings;
        me._gridifier = gridifier;
        me._eventEmitter = eventEmitter;
        me._sizesResolverManager = sizesResolverManager;
    };

    this._bindEvents = function() {
    };

    this._unbindEvents = function() {
    };

    this.destruct = function() {
        me._unbindEvents();
    };

    this._construct();
    return this;
}

Gridifier.Api.Slide.prototype._executeSlideShow = function(item, 
                                                           grid, 
                                                           animationMsDuration,
                                                           timeouter,
                                                           eventEmitter,
                                                           coordsChanger,
                                                           collector,
                                                           startLeft,
                                                           startTop,
                                                           connectionLeft,
                                                           connectionTop,
                                                           transitionTiming,
                                                           animateFade) {
    var me = this;
    var targetLeft = connectionLeft;
    var targetTop = connectionTop;

    this._markAsToggleAnimationWithCoordsChange(item);

    if(animateFade)
        var animateFadeTargetItem = (this._gridifier.hasItemBindedClone(item)) ? this._gridifier.getItemClone(item) : item;

    if (!item.hasAttribute(Gridifier.Api.Toggle.IS_TOGGLE_ANIMATION_RUNNING)) {
        if(animateFade) {
            Dom.css3.transition(animateFadeTargetItem, "none");
            Dom.css3.opacity(animateFadeTargetItem, 0);
            Dom.css3.transition(animateFadeTargetItem, "");
        }
        coordsChanger(
            item, startLeft, startTop, 0, eventEmitter, false, false, false, false, transitionTiming
        );

        item.setAttribute(Gridifier.Api.Toggle.IS_TOGGLE_ANIMATION_RUNNING, "yes");
    }

    // Setting translated position after 0ms call requires a little delay
    // per browsers repaint(Also it should be enough to propogate NIS item align(20ms))
    var slideOutTimeout = setTimeout(function() {
        if(!me._gridifier.hasItemBindedClone(item))
            item.style.visibility = "visible";

        if(animateFade) {
            Dom.css3.transitionProperty(
                animateFadeTargetItem,
                Prefixer.getForCSS('opacity', animateFadeTargetItem) + " " + animationMsDuration + "ms " + transitionTiming
            );
            Dom.css3.opacity(animateFadeTargetItem, 1);
        }
        coordsChanger(
            item, targetLeft, targetTop, animationMsDuration, eventEmitter, false, false, false, false, transitionTiming
        );
    }, 40);
    timeouter.add(item, slideOutTimeout);

    var completeSlideOutTimeout = setTimeout(function() {
        me._unmarkAsToggleAnimationWithCoordsChange(item);
        item.removeAttribute(Gridifier.Api.Toggle.IS_TOGGLE_ANIMATION_RUNNING);
        eventEmitter.emitShowEvent(item);

        if(me._gridifier.hasItemBindedClone(item)) {
            coordsChanger(
                item, item.style.left, item.style.top, 0, eventEmitter, false, false, false, false, transitionTiming
            );
        }
    }, animationMsDuration + 60);
    timeouter.add(item, completeSlideOutTimeout);
}

Gridifier.Api.Slide.prototype._executeSlideHide = function(item,
                                                           grid,
                                                           animationMsDuration,
                                                           timeouter,
                                                           eventEmitter,
                                                           coordsChanger,
                                                           collector,
                                                           targetLeft,
                                                           targetTop,
                                                           connectionLeft,
                                                           connectionTop,
                                                           transitionTiming,
                                                           animateFade) {
    item.setAttribute(Gridifier.Api.Toggle.IS_TOGGLE_ANIMATION_RUNNING, "yes");
    this._markAsToggleAnimationWithCoordsChange(item);

    if(animateFade) {
        var animateFadeTargetItem = (this._gridifier.hasItemBindedClone(item)) ? this._gridifier.getItemClone(item) : item;
        Dom.css3.transition(
            animateFadeTargetItem,
            Prefixer.getForCSS('opacity', animateFadeTargetItem) + " " + animationMsDuration + "ms " + transitionTiming
        );
        Dom.css3.opacity(animateFadeTargetItem, 0);
    }

    coordsChanger(
        item, targetLeft, targetTop, animationMsDuration, eventEmitter, false, false, false, false, transitionTiming
    );

    // Hidding item and possibly clone a little before animation def finish(Blink fix)
    var me = this;
    var prehideTimeout = setTimeout(function() {
        item.style.visibility = "hidden";

        if(me._gridifier.hasItemBindedClone(item)) {
            var itemClone = me._gridifier.getItemClone(item);
            itemClone.style.visibility = "hidden";
        }
    }, animationMsDuration);
    timeouter.add(item, prehideTimeout);

    var slideInTimeout = setTimeout(function() {
        if(animateFade) {
            Dom.css3.transitionProperty(
                animateFadeTargetItem,
                Prefixer.getForCSS('opacity', animateFadeTargetItem) + " 0ms " + transitionTiming
            );
            //Dom.css3.transition(animateFadeTargetItem, "none");
            Dom.css3.opacity(animateFadeTargetItem, 1);
            //Dom.css3.transition(animateFadeTargetItem, "");
        }

        me._unmarkAsToggleAnimationWithCoordsChange(item);
        item.style.visibility = "hidden";
        item.removeAttribute(Gridifier.Api.Toggle.IS_TOGGLE_ANIMATION_RUNNING);
        eventEmitter.emitHideEvent(item);
    }, animationMsDuration + 20);
    timeouter.add(item, slideInTimeout);
}

Gridifier.Api.Slide.prototype._markAsToggleAnimationWithCoordsChange = function(item) {
    item.setAttribute(Gridifier.Api.Toggle.IS_TOGGLE_ANIMATION_WITH_COORDS_CHANGE_RUNNING, "yes");
    if(this._gridifier.hasItemBindedClone(item)) {
        this._gridifier.getItemClone(item).setAttribute(
            Gridifier.Api.Toggle.IS_TOGGLE_ANIMATION_WITH_COORDS_CHANGE_RUNNING, "yes"
        );
    }
}

Gridifier.Api.Slide.prototype._unmarkAsToggleAnimationWithCoordsChange = function(item) {
    item.removeAttribute(Gridifier.Api.Toggle.IS_TOGGLE_ANIMATION_WITH_COORDS_CHANGE_RUNNING);
    if(this._gridifier.hasItemBindedClone(item)) {
        this._gridifier.getItemClone(item).removeAttribute(
            Gridifier.Api.Toggle.IS_TOGGLE_ANIMATION_WITH_COORDS_CHANGE_RUNNING
        );
    }
}

Gridifier.Api.Slide.prototype.createHorizontalSlideToggler = function(alignTop, alignBottom, reverseDirection, animateFade) {
    var me = this;

    var alignTop = alignTop || false;
    var alignBottom = alignBottom || false;

    var isLeftSideToggler = !reverseDirection;
    var isRightSideToggler = reverseDirection;

    var getLeftPos = function(item, grid) {
        if(isLeftSideToggler)
            return me._sizesResolverManager.outerWidth(item, true) * -1;
        else if(isRightSideToggler)
            return me._sizesResolverManager.outerWidth(grid) + me._sizesResolverManager.outerWidth(item, true);
    }

    return {
        "show": function(item, 
                         grid, 
                         animationMsDuration,
                         timeouter,
                         eventEmitter, 
                         sizesResolverManager,
                         coordsChanger,
                         collector,
                         connectionLeft,
                         connectionTop,
                         coordsChangerApi,
                         itemClonesManager,
                         transitionTiming) {
            timeouter.flush(item);
            if(!Dom.isBrowserSupportingTransitions()) {
                item.style.visibility = "visible";
                eventEmitter.emitShowEvent(item);
                return;
            }
            
            if(alignTop)
                var top = 0;
            else if(alignBottom)
                var top = sizesResolverManager.outerHeight(grid) + sizesResolverManager.outerHeight(item, true);
            else
                var top = item.style.top;

            me._executeSlideShow(
                item, 
                grid, 
                animationMsDuration,
                timeouter,
                eventEmitter,
                coordsChanger,
                collector,
                getLeftPos(item, grid) + "px",
                top + "px",
                connectionLeft,
                connectionTop,
                transitionTiming,
                animateFade || false
            );
        },

        "hide": function(item,
                         grid, 
                         animationMsDuration,
                         timeouter,
                         eventEmitter, 
                         sizesResolverManager,
                         coordsChanger,
                         collector,
                         connectionLeft,
                         connectionTop,
                         coordsChangerApi,
                         itemClonesManager,
                         transitionTiming) {
            timeouter.flush(item);
            if(!Dom.isBrowserSupportingTransitions()) {
                item.style.visibility = "hidden";
                eventEmitter.emitHideEvent(item);
                return;
            }

            if(alignTop)
                var top = 0;
            else if(alignBottom)
                var top = sizesResolverManager.outerHeight(grid) + sizesResolverManager.outerHeight(item, true);
            else
                var top = item.style.top;

            me._executeSlideHide(
                item,
                grid,
                animationMsDuration,
                timeouter,
                eventEmitter,
                coordsChanger,
                collector,
                getLeftPos(item, grid) + "px",
                top + "px",
                connectionLeft,
                connectionTop,
                transitionTiming,
                animateFade || false
            );
        }
    };
}

Gridifier.Api.Slide.prototype.createVerticalSlideToggler = function(alignLeft, alignRight, reverseDirection, animateFade) {
    var me = this;

    var alignLeft = alignLeft || false;
    var alignRight = alignRight || false;

    var isTopSideToggler = !reverseDirection;
    var isBottomSideToggler = reverseDirection;

    var getTopPos = function(item, grid) {
        if(isTopSideToggler)
            return me._sizesResolverManager.outerHeight(item,true) * -1;
        else if(isBottomSideToggler)
            return me._sizesResolverManager.outerHeight(grid) + me._sizesResolverManager.outerHeight(item, true);
    }

    return {
        "show": function(item, 
                         grid, 
                         animationMsDuration,
                         timeouter,
                         eventEmitter, 
                         sizesResolverManager,
                         coordsChanger,
                         collector,
                         connectionLeft,
                         connectionTop,
                         coordsChangerApi,
                         itemClonesManager,
                         transitionTiming) {
            timeouter.flush(item);
            if(!Dom.isBrowserSupportingTransitions()) {
                item.style.visibility = "visible";
                eventEmitter.emitShowEvent(item);
                return;
            }

            if(alignLeft)
                var left = 0;
            else if(alignRight)
                var left = sizesResolverManager.outerWidth(grid) + sizesResolverManager.outerWidth(item, true);
            else
                var left = item.style.left;

            me._executeSlideShow(
                item, 
                grid, 
                animationMsDuration,
                timeouter,
                eventEmitter,
                coordsChanger,
                collector,
                left + "px",
                getTopPos(item, grid) + "px",
                connectionLeft,
                connectionTop,
                transitionTiming,
                animateFade || false
            );
        },

        "hide": function(item,
                         grid, 
                         animationMsDuration,
                         timeouter,
                         eventEmitter, 
                         sizesResolverManager,
                         coordsChanger,
                         collector,
                         connectionLeft,
                         connectionTop,
                         coordsChangerApi,
                         itemClonesManager,
                         transitionTiming) {
            timeouter.flush(item);
            if(!Dom.isBrowserSupportingTransitions()) {
                item.style.visibility = "hidden";
                eventEmitter.emitHideEvent(item);
                return;
            }

            if(alignLeft)
                var left = 0;
            else if(alignRight)
                var left = sizesResolverManager.outerWidth(grid) + sizesResolverManager.outerWidth(item, true);
            else
                var left = item.style.left;

            me._executeSlideHide(
                item,
                grid,
                animationMsDuration,
                timeouter,
                eventEmitter,
                coordsChanger,
                collector,
                left + "px",
                getTopPos(item, grid) + "px",
                connectionLeft,
                connectionTop,
                transitionTiming,
                animateFade || false
            );
        }
    };
}

Gridifier.Api.Slide.prototype.createCycledSlider = function(sliderFunctions) {
    var slideIndex = 1;
    return {
        "show": function(item,
                         grid,
                         animationMsDuration,
                         timeouter,
                         eventEmitter,
                         coordsChanger,
                         collector,
                         targetLeft,
                         targetTop,
                         connectionLeft,
                         connectionTop,
                         transitionTiming,
                         animateFade) {
            slideIndex++;
            var nextSlideIndex = slideIndex % sliderFunctions.length;
            var slider = sliderFunctions[nextSlideIndex];

            slider.show(
                item,
                grid,
                animationMsDuration,
                timeouter,
                eventEmitter,
                coordsChanger,
                collector,
                targetLeft,
                targetTop,
                connectionLeft,
                connectionTop,
                transitionTiming,
                animateFade
            );
        },

        "hide": function(item,
                         grid,
                         animationMsDuration,
                         timeouter,
                         eventEmitter,
                         coordsChanger,
                         collector,
                         targetLeft,
                         targetTop,
                         connectionLeft,
                         connectionTop,
                         transitionTiming,
                         animateFade) {
            slideIndex++;
            var nextSlideIndex = slideIndex % sliderFunctions.length;
            var slider = sliderFunctions[nextSlideIndex];

            slider.hide(
                item,
                grid,
                animationMsDuration,
                timeouter,
                eventEmitter,
                coordsChanger,
                collector,
                targetLeft,
                targetTop,
                connectionLeft,
                connectionTop,
                transitionTiming,
                animateFade
            );
        }
    };
}