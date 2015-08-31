/* Gridifier v1.~.~ source file for custom build.
 * Async Responsive HTML Grids
 * http://gridifier.io
 * 
 * Gridifier is dual-licensed:
 *   GPLV3 per non-commercial usage; 
 *   Commercial license per commercial usage.
 * Read http://gridifier.io/license for details.
 * Copyright 2015 nTech
 */

/* You can define your custom togglers in this class.
 * Read about custom builds at http://gridifier.io/essentials/install
 * Read about sizes changers at http://gridifier.io/api/togglers
 * (To write custom toggler some additional information is required.
 *  So, we will write separate chapter about it later)
 */
Gridifier.Api.Toggle = function(settings, gridifier, eventEmitter, sizesResolverManager) {
    var me = this;

    this._settings = null;
    this._gridifier = null;
    this._eventEmitter = null;
    this._sizesResolverManager = null;

    this._slideApi = null;
    this._rotateApi = null;

    this._toggleFunction = null;
    this._toggleFunctions = {};

    this._css = {
    };

    this._construct = function() {
        me._settings = settings;
        me._gridifier = gridifier;
        me._eventEmitter = eventEmitter;
        me._sizesResolverManager = sizesResolverManager;

        me._slideApi = new Gridifier.Api.Slide(
            me._settings, me._gridifier, me._eventEmitter, me._sizesResolverManager
        );
        me._rotateApi = new Gridifier.Api.Rotate(
            me._settings, me._eventEmitter, me._sizesResolverManager
        );

        me._toggleFunctions = {};

        me._addSlides();
        me._addRotates();
        me._addScale();
        me._addFade();
        me._addVisibility();
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

Gridifier.Api.Toggle.IS_TOGGLE_ANIMATION_RUNNING = "data-gridifier-toggle-animation-is-running";
Gridifier.Api.Toggle.IS_TOGGLE_ANIMATION_WITH_COORDS_CHANGE_RUNNING = "data-gridifier-toggle-animation-with-coords-change-is-running";

Gridifier.Api.Toggle.prototype.setCollectorInstance = function(collector) {
    this._rotateApi.setCollectorInstance(collector);
}

Gridifier.Api.Toggle.prototype.setToggleFunction = function(toggleFunctionName) {
    if(!this._toggleFunctions.hasOwnProperty(toggleFunctionName)) {
        new Gridifier.Error(
            Gridifier.Error.ERROR_TYPES.SETTINGS.SET_TOGGLE_INVALID_PARAM,
            toggleFunctionName
        );
        return;
    }

    this._toggleFunction = this._toggleFunctions[toggleFunctionName];
}

Gridifier.Api.Toggle.prototype.addToggleFunction = function(toggleFunctionName, toggleFunctionData) {
    this._toggleFunctions[toggleFunctionName] = toggleFunctionData;
}

Gridifier.Api.Toggle.prototype.getToggleFunction = function() {
    return this._toggleFunction;
}

Gridifier.Api.Toggle.prototype._addSlides = function() {
    var me = this;

    var sliderNames = [
        "slideLeft", "slideLeftTop", "slideLeftBottom",
        "slideRight", "slideRightTop", "slideRightBottom",
        "slideTop", "slideTopLeft", "slideTopRight",
        "slideBottom", "slideBottomLeft", "slideBottomRight"
    ];

    var createSliders = function(sliderNames, fade) {
        this._toggleFunctions[sliderNames[0]] = this._slideApi.createHorizontalSlideToggler(false, false, false, fade);
        this._toggleFunctions[sliderNames[1]] = this._slideApi.createHorizontalSlideToggler(true, false, false, fade);
        this._toggleFunctions[sliderNames[2]] = this._slideApi.createHorizontalSlideToggler(false, true, false, fade);

        this._toggleFunctions[sliderNames[3]] = this._slideApi.createHorizontalSlideToggler(false, false, true, fade);
        this._toggleFunctions[sliderNames[4]] = this._slideApi.createHorizontalSlideToggler(true, false, true, fade);
        this._toggleFunctions[sliderNames[5]] = this._slideApi.createHorizontalSlideToggler(false, true, true, fade);

        this._toggleFunctions[sliderNames[6]] = this._slideApi.createVerticalSlideToggler(false, false, false, fade);
        this._toggleFunctions[sliderNames[7]] = this._slideApi.createVerticalSlideToggler(true, false, false, fade);
        this._toggleFunctions[sliderNames[8]] = this._slideApi.createVerticalSlideToggler(false, true, false, fade);

        this._toggleFunctions[sliderNames[9]] = this._slideApi.createVerticalSlideToggler(false, false, true, fade);
        this._toggleFunctions[sliderNames[10]] = this._slideApi.createVerticalSlideToggler(true, false, true, fade);
        this._toggleFunctions[sliderNames[11]] = this._slideApi.createVerticalSlideToggler(false, true, true, fade);
    }

    createSliders.call(this, sliderNames, false);
    for(var i = 0; i < sliderNames.length; i++)
        sliderNames[i] += "WithFade";
    createSliders.call(this, sliderNames, true);

    var sliderPairs = [
        ["slideLeftThanSlideRight", "slideLeft", "slideRight"],
        ["slideTopThanSlideBottom", "slideTop", "slideBottom"],
        ["slideLeftTopThanSlideRightTop", "slideLeftTop", "slideRightTop"],
        ["slideTopLeftThanSlideBottomLeft", "slideTopLeft", "slideBottomLeft"],
        ["slideLeftBottomThanSlideRightBottom", "slideLeftBottom", "slideRightBottom"],
        ["slideTopRightThanSlideBottomRight", "slideTopRight", "slideBottomRight"]
    ];
    for(var i = 0; i < sliderPairs.length; i++) {
        this._toggleFunctions[sliderPairs[i][0]] = this._slideApi.createCycledSlider([
            this._toggleFunctions[sliderPairs[i][1]], this._toggleFunctions[sliderPairs[i][2]]
        ]);

        this._toggleFunctions[sliderPairs[i][0] + "WithFade"] = this._slideApi.createCycledSlider([
            this._toggleFunctions[sliderPairs[i][1] + "WithFade"], this._toggleFunctions[sliderPairs[i][2] + "WithFade"]
        ]);
    }

    var customSliders = [
        ["slideClockwiseFromCenters", "slideLeft", "slideTop", "slideRight", "slideBottom"],
        ["slideClockwiseFromSides", "slideLeft", "slideTop", "slideRight", "slideBottom"],
        ["slideClockwiseFromCorners", "slideLeftTop", "slideRightTop", "slideRightBottom", "slideLeftBottom"]
    ];
    for(var i = 0; i < customSliders.length; i++) {
        this._toggleFunctions[customSliders[i][0]] = this._slideApi.createCycledSlider([
            this._toggleFunctions[customSliders[i][1]],
            this._toggleFunctions[customSliders[i][2]],
            this._toggleFunctions[customSliders[i][3]],
            this._toggleFunctions[customSliders[i][4]]
        ]);

        this._toggleFunctions[customSliders[i][0] + "WithFade"] = this._slideApi.createCycledSlider([
            this._toggleFunctions[customSliders[i][1] + "WithFade"],
            this._toggleFunctions[customSliders[i][2] + "WithFade"],
            this._toggleFunctions[customSliders[i][3] + "WithFade"],
            this._toggleFunctions[customSliders[i][4] + "WithFade"]
        ]);
    }
}

Gridifier.Api.Toggle.prototype._createRotator = function(rotatorName,
                                                         showRotateApiFunction,
                                                         hideRotateApiFunction,
                                                         rotateMatrixType,
                                                         rotateFadeType) {
    var me = this;

    this._toggleFunctions[rotatorName] = {
        "show": function(item,
                         grid,
                         animationMsDuration,
                         timeouter,
                         eventEmitter,
                         sizesResolverManager,
                         coordsChanger,
                         collector,
                         left,
                         top,
                         coordsChangerApi,
                         itemClonesManager,
                         transitionTiming) {
            timeouter.flush(item);
            if(!Dom.isBrowserSupportingTransitions()) {
                item.style.visibility = "visible";
                eventEmitter.emitShowEvent(item);
                return;
            }

            me._rotateApi.setRotateFadeType(rotateFadeType);
            me._rotateApi.setTransitionTiming(transitionTiming);
            me._rotateApi[showRotateApiFunction](item, grid, rotateMatrixType, timeouter, left, top, itemClonesManager);
        },

        "hide": function(item,
                         grid,
                         animationMsDuration,
                         timeouter,
                         eventEmitter,
                         sizesResolverManager,
                         coordsChanger,
                         collector,
                         left,
                         top,
                         coordsChangerApi,
                         itemClonesManager,
                         transitionTiming) {
            timeouter.flush(item);
            if(!Dom.isBrowserSupportingTransitions()) {
                item.style.visibility = "hidden";
                eventEmitter.emitHideEvent(item);
                return;
            }

            me._rotateApi.setRotateFadeType(rotateFadeType);
            me._rotateApi.setTransitionTiming(transitionTiming);
            me._rotateApi[hideRotateApiFunction](item, grid, rotateMatrixType, timeouter, left, top, itemClonesManager);
        }
    };
}

Gridifier.Api.Toggle.prototype._addRotates = function() {
    var rotatorPostfixes = ["", "WithFade", "WithFadeOut"];
    var rotatorFadeTypes = [
        Gridifier.Api.Rotate.ROTATE_FADE_TYPES.NONE,
        Gridifier.Api.Rotate.ROTATE_FADE_TYPES.FULL,
        Gridifier.Api.Rotate.ROTATE_FADE_TYPES.ON_HIDE_MIDDLE
    ];

    for(var i = 0; i < rotatorPostfixes.length; i++) {
        var postfix = rotatorPostfixes[i];
        var fadeType = rotatorFadeTypes[i];

        this._createRotator("rotate3dX" + postfix, "show3d", "hide3d", Gridifier.Api.Rotate.ROTATE_MATRIX_TYPES.X, fadeType);
        this._createRotator("rotate3dY" + postfix, "show3d", "hide3d", Gridifier.Api.Rotate.ROTATE_MATRIX_TYPES.Y, fadeType);
        this._createRotator("rotate3dZ" + postfix, "show3d", "hide3d", Gridifier.Api.Rotate.ROTATE_MATRIX_TYPES.Z, fadeType);
        this._createRotator("rotate3dXY" + postfix, "show3d", "hide3d", Gridifier.Api.Rotate.ROTATE_MATRIX_TYPES.XY, fadeType);
        this._createRotator("rotate3dXZ" + postfix, "show3d", "hide3d", Gridifier.Api.Rotate.ROTATE_MATRIX_TYPES.XZ, fadeType);
        this._createRotator("rotate3dYZ" + postfix, "show3d", "hide3d", Gridifier.Api.Rotate.ROTATE_MATRIX_TYPES.YZ, fadeType);
        this._createRotator("rotate3dXYZ" + postfix, "show3d", "hide3d", Gridifier.Api.Rotate.ROTATE_MATRIX_TYPES.XYZ, fadeType);

        this._createRotator("rotateX" + postfix, "show", "hide", Gridifier.Api.Rotate.ROTATE_FUNCTION_TYPES.X, fadeType);
        this._createRotator("rotateY" + postfix, "show", "hide", Gridifier.Api.Rotate.ROTATE_FUNCTION_TYPES.Y, fadeType);
        this._createRotator("rotateZ" + postfix, "show", "hide", Gridifier.Api.Rotate.ROTATE_FUNCTION_TYPES.Z, fadeType);
    }
}

Gridifier.Api.Toggle.prototype._addScale = function() {
    var me = this;

    var createScaler = function(beforeScaleShow,
                                onScaleShow,
                                beforeScaleHide,
                                afterScaleHide) {
        return {
            "show":  function(item,
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

                if(coordsChangerApi.hasTranslateOrTranslate3DTransformSet(item)) {
                    coordsChangerApi.setTransformOriginAccordingToCurrentTranslate(
                        item,
                        connectionLeft,
                        connectionTop,
                        sizesResolverManager.outerWidth(item, true),
                        sizesResolverManager.outerHeight(item, true)
                    );
                }

                if(!item.hasAttribute(Gridifier.Api.Toggle.IS_TOGGLE_ANIMATION_RUNNING)) {
                    Dom.css3.transition(item, "none");
                    beforeScaleShow(item, animationMsDuration, transitionTiming);
                    Dom.css3.transformProperty(item, "scale3d", "0,0,0");
                    item.setAttribute(Gridifier.Api.Toggle.IS_TOGGLE_ANIMATION_RUNNING, "yes");
                }

                var initScaleTimeout = setTimeout(function () {
                    item.style.visibility = "visible";
                    Dom.css3.transition(
                        item,
                        Prefixer.getForCSS('transform', item) + " " + animationMsDuration + "ms " + transitionTiming
                    );
                    Dom.css3.transformProperty(item, "scale3d", "1,1,1");
                    onScaleShow(item, animationMsDuration, transitionTiming);
                }, 40);
                timeouter.add(item, initScaleTimeout);

                var completeScaleTimeout = setTimeout(function () {
                    coordsChangerApi.resetTransformOrigin(item);

                    item.removeAttribute(Gridifier.Api.Toggle.IS_TOGGLE_ANIMATION_RUNNING);
                    eventEmitter.emitShowEvent(item);
                }, animationMsDuration + 60);
                timeouter.add(item, completeScaleTimeout);
            },

            "hide": function (item,
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

                if(coordsChangerApi.hasTranslateOrTranslate3DTransformSet(item)) {
                    coordsChangerApi.setTransformOriginAccordingToCurrentTranslate(
                        item,
                        connectionLeft,
                        connectionTop,
                        sizesResolverManager.outerWidth(item, true),
                        sizesResolverManager.outerHeight(item, true)
                    );
                }

                Dom.css3.transition(
                    item,
                    Prefixer.getForCSS('transform', item) + " " + animationMsDuration + "ms " + transitionTiming
                );

                item.setAttribute(Gridifier.Api.Toggle.IS_TOGGLE_ANIMATION_RUNNING, "yes");
                Dom.css3.transformProperty(item, "scale3d", "0,0,0");
                beforeScaleHide(item, animationMsDuration, transitionTiming);

                if(animationMsDuration > 200)
                    var hideItemTimeout = animationMsDuration - 100;
                else
                    var hideItemTimeout = animationMsDuration - 50;

                if(hideItemTimeout < 0)
                    hideItemTimeout = 0;

                var prehideItemTimeout = setTimeout(function () {
                    item.style.visibility = "hidden";
                    // setTimeout should be smaller than animation duration(Flickering bug in Webkit)
                }, hideItemTimeout);
                timeouter.add(item, prehideItemTimeout);

                var completeScaleTimeout = setTimeout(function () {
                    item.style.visibility = "hidden";
                    Dom.css3.transition(item, "none");
                    Dom.css3.transformProperty(item, "scale3d", "1,1,1");
                    afterScaleHide(item, animationMsDuration, transitionTiming);
                    Dom.css3.transition(item, "");

                    coordsChangerApi.resetTransformOrigin(item);

                    item.removeAttribute(Gridifier.Api.Toggle.IS_TOGGLE_ANIMATION_RUNNING);
                    eventEmitter.emitHideEvent(item);
                }, animationMsDuration + 20);
                timeouter.add(item, completeScaleTimeout);
            }
        };
    }

    var voidFunction = function(item, animationMsDuration) { ; };
    this._toggleFunctions.scale = createScaler(voidFunction, voidFunction, voidFunction, voidFunction);
    this._toggleFunctions.scaleWithFade = createScaler(
        function(item, animationMsDuration, transitionTiming) {
            Dom.css3.opacity(item, "0");
        },
        function(item, animationMsDuration, transitionTiming) {
            Dom.css3.transitionProperty(
                item,
                Prefixer.getForCSS('opacity', item) + " " + animationMsDuration + "ms " + transitionTiming
            );
            Dom.css3.opacity(item, 1);
        },
        function(item, animationMsDuration, transitionTiming) {
            Dom.css3.transitionProperty(
                item,
                Prefixer.getForCSS('opacity', item) + " " + animationMsDuration + "ms " + transitionTiming
            );
            Dom.css3.opacity(item, "0");
        },
        function(item, animationMsDuration, transitionTiming) {
            Dom.css3.opacity(item, "1");
        }
    );
}

Gridifier.Api.Toggle.prototype._addFade = function() {
    var me = this;

    this._toggleFunctions.fade = {
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

            if (!item.hasAttribute(Gridifier.Api.Toggle.IS_TOGGLE_ANIMATION_RUNNING)) {
                Dom.css3.transition(item, "none");
                Dom.css3.opacity(item, "0");
                item.setAttribute(Gridifier.Api.Toggle.IS_TOGGLE_ANIMATION_RUNNING, "yes");
            }

            var initFadeTimeout = setTimeout(function() {
                item.style.visibility = "visible";
                Dom.css3.transition(
                    item,
                    Prefixer.getForCSS('opacity', item) + " " + animationMsDuration + "ms " + transitionTiming
                );
                Dom.css3.opacity(item, 1);
            }, 40);
            timeouter.add(item, initFadeTimeout);

            var completeFadeTimeout = setTimeout(function() {
                item.removeAttribute(Gridifier.Api.Toggle.IS_TOGGLE_ANIMATION_RUNNING);
                eventEmitter.emitShowEvent(item);
            }, animationMsDuration + 60);
            timeouter.add(item, completeFadeTimeout);
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

            Dom.css3.transition(
                item,
                Prefixer.getForCSS('opacity', item) + " " + animationMsDuration + "ms " + transitionTiming
            );

            item.setAttribute(Gridifier.Api.Toggle.IS_TOGGLE_ANIMATION_RUNNING, "yes");
            Dom.css3.opacity(item, "0");

            var executeFadeOutTimeout = setTimeout(function () {
                item.removeAttribute(Gridifier.Api.Toggle.IS_TOGGLE_ANIMATION_RUNNING);
                item.style.visibility = "hidden";

                Dom.css3.transition(item, "none");
                Dom.css3.opacity(item, "1");
                Dom.css3.transition(item, "");

                eventEmitter.emitHideEvent(item);
            }, animationMsDuration + 20);
            timeouter.add(item, executeFadeOutTimeout);
        }
    };
}

Gridifier.Api.Toggle.prototype._addVisibility = function() {
    var me = this;

    this._toggleFunctions.visibility = {
        "show": function(item, grid, animationMsDuration, timeouter, eventEmitter, sizesResolverManager) {
            timeouter.flush(item);
            item.style.visibility = "visible";
            eventEmitter.emitShowEvent(item);
        },

        "hide": function(item, grid, animationMsDuration, timeouter, eventEmitter, sizesResolverManager) {
            timeouter.flush(item);
            item.style.visibility = "hidden";
            eventEmitter.emitHideEvent(item);
        }
    };
}