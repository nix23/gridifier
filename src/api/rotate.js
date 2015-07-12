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

Gridifier.Api.Rotate = function(settings, eventEmitter, sizesResolverManager) {
    var me = this;

    this._settings = null;
    this._eventEmitter = null;
    this._sizesResolverManager = null;
    this._collector = null;

    this._rotateFadeType = null;
    this._transitionTiming = null;

    this._css = {
    };

    this._construct = function() {
        me._settings = settings;
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

Gridifier.Api.Rotate.ROTATE_MATRIX_TYPES = {X: 0, Y: 1, Z: 2, XY: 3, XZ: 4, YZ: 5, XYZ: 6};
Gridifier.Api.Rotate.ROTATE_FUNCTION_TYPES = {X: 0, Y: 1, Z: 2};
Gridifier.Api.Rotate.ROTATE_FADE_TYPES = {NONE: 0, FULL: 1, ON_HIDE_MIDDLE: 2};

Gridifier.Api.Rotate.prototype.setCollectorInstance = function(collector) {
    this._collector = collector;
}

Gridifier.Api.Rotate.prototype._getRotateMatrix = function(rotateMatrixType) {
    if(rotateMatrixType == Gridifier.Api.Rotate.ROTATE_MATRIX_TYPES.X)
        return "1, 0, 0, ";
    else if(rotateMatrixType == Gridifier.Api.Rotate.ROTATE_MATRIX_TYPES.Y)
        return "0, 1, 0, ";
    else if(rotateMatrixType == Gridifier.Api.Rotate.ROTATE_MATRIX_TYPES.Z)
        return "0, 0, 1, ";
    else if(rotateMatrixType == Gridifier.Api.Rotate.ROTATE_MATRIX_TYPES.XY)
        return "1, 1, 0, ";
    else if(rotateMatrixType == Gridifier.Api.Rotate.ROTATE_MATRIX_TYPES.XZ)
        return "1, 0, 1, ";
    else if(rotateMatrixType == Gridifier.Api.Rotate.ROTATE_MATRIX_TYPES.YZ)
        return "0, 1, 1, ";
    else if(rotateMatrixType == Gridifier.Api.Rotate.ROTATE_MATRIX_TYPES.XYZ)
        return "1, 1, 1, ";

    throw new Error("Gridifier error: wrong rotate matrix type = " + rotateMatrixType);
}

Gridifier.Api.Rotate.prototype._getRotateFunction = function(rotateFunctionType) {
    if(rotateFunctionType == Gridifier.Api.Rotate.ROTATE_FUNCTION_TYPES.X)
        return "rotateX";
    else if(rotateFunctionType == Gridifier.Api.Rotate.ROTATE_FUNCTION_TYPES.Y)
        return "rotateY";
    else if(rotateFunctionType == Gridifier.Api.Rotate.ROTATE_FUNCTION_TYPES.Z)
        return "rotateZ";

    throw new Error("Gridifier error: wrong rotate function type = " + rotateFunctionType);
}

Gridifier.Api.Rotate.prototype.setRotateFadeType = function(fadeType) {
    this._rotateFadeType = fadeType;
}

Gridifier.Api.Rotate.prototype.setTransitionTiming = function(transitionTiming) {
    this._transitionTiming = transitionTiming;
}

Gridifier.Api.Rotate.prototype.show3d = function(item, grid, rotateMatrixType, timeouter, left, top, itemClonesManager) {
    var rotateProp = "rotate3d";
    this._rotate(item, grid, rotateProp, false, timeouter, this._getRotateMatrix(rotateMatrixType), left, top, itemClonesManager);
}

Gridifier.Api.Rotate.prototype.hide3d = function(item, grid, rotateMatrixType, timeouter, left, top, itemClonesManager) {
    var rotateProp = "rotate3d";
    this._rotate(item, grid, rotateProp, true, timeouter, this._getRotateMatrix(rotateMatrixType), left, top, itemClonesManager);
}

Gridifier.Api.Rotate.prototype.show = function(item, grid, rotateFunctionType, timeouter, left, top, itemClonesManager) {
    var rotateProp = this._getRotateFunction(rotateFunctionType);
    this._rotate(item, grid, rotateProp, false, timeouter, "", left, top, itemClonesManager);
}

Gridifier.Api.Rotate.prototype.hide = function(item, grid, rotateFunctionType, timeouter, left, top, itemClonesManager) {
    var rotateProp = this._getRotateFunction(rotateFunctionType);
    this._rotate(item, grid, rotateProp, true, timeouter, "", left, top, itemClonesManager);
}

Gridifier.Api.Rotate.prototype._rotate = function(item,
                                                  grid,
                                                  rotateProp,
                                                  inverseToggle,
                                                  timeouter,
                                                  rotateMatrix,
                                                  left,
                                                  top,
                                                  itemClonesManager) {
    if(!inverseToggle) {
        var isShowing = true;
        var isHiding = false;
    }
    else {
        var isShowing = false;
        var isHiding = true;
    }

    var scene = this._createScene(item, grid, left, top);
    var frames = this._createFrames(scene);
    var itemClone = this._createItemClone(item);

    item.setAttribute(Gridifier.Api.Toggle.IS_TOGGLE_ANIMATION_RUNNING, "yes");
    itemClonesManager.lockCloneOnToggle(item);
    var frontFrame = this._createFrontFrame(frames, rotateProp, rotateMatrix);
    var backFrame = this._createBackFrame(frames, rotateProp, rotateMatrix);

    if(isShowing) {
        backFrame.appendChild(itemClone);
        item.style.visibility = "hidden";
    }
    else if(isHiding) {
        frontFrame.appendChild(itemClone);
        item.style.visibility = "hidden";
    }

    var animationMsDuration = this._settings.getToggleAnimationMsDuration();
    Dom.css3.transitionProperty(
        frontFrame, 
        Prefixer.getForCSS('transform', frontFrame) + " " + animationMsDuration + "ms " + this._transitionTiming
    );
    Dom.css3.transitionProperty(
        backFrame, 
        Prefixer.getForCSS('transform', backFrame) + " " + animationMsDuration + "ms " + this._transitionTiming
    );

    var me = this;
    var rotateAngles = this._settings.getRotateAngles();
    var initRotateTimeout = setTimeout(function() {
        Dom.css3.transformProperty(frontFrame, rotateProp, rotateMatrix + rotateAngles[2] + "deg");
        Dom.css3.transformProperty(backFrame, rotateProp, rotateMatrix + rotateAngles[3] + "deg");
    }, 40);
    // No sence to sync timeouts here -> Animations are performed on clones
    //timeouter.add(item, initRotateTimeout);

    this._initFadeEffect(scene, isShowing, isHiding, animationMsDuration);

    // A little helper to reduce blink effect after animation finish
    //if(animationMsDuration > 400) {
       //var prehideItemTimeout = setTimeout(function () {
       //   if (isShowing)
       //      item.style.visibility = "visible";
       //   else if (isHiding)
       //      item.style.visibility = "hidden";
       //}, animationMsDuration - 50);
       //timeouter.add(item, prehideItemTimeout);
    //}

    var completeRotateTimeout = setTimeout(function() {
        scene.parentNode.removeChild(scene);
        item.removeAttribute(Gridifier.Api.Toggle.IS_TOGGLE_ANIMATION_RUNNING);

        if(isShowing) {
            itemClonesManager.unlockCloneOnToggle(item);
            item.style.visibility = "visible";
            me._eventEmitter.emitShowEvent(item);
        }
        else if(isHiding) {
            itemClonesManager.unlockCloneOnToggle(item).hideCloneOnToggle(item);
            item.style.visibility = "hidden";
            me._eventEmitter.emitHideEvent(item);
        }
    }, animationMsDuration + 40);
    //timeouter.add(item, completeRotateTimeout);
}

Gridifier.Api.Rotate.prototype._createScene = function(item, grid, left, top) {
    var scene = document.createElement("div");
    var itemComputedCSS = SizesResolver.getComputedCSSWithMaybePercentageSizes(item);

    Dom.css.set(scene, {
        width: this._sizesResolverManager.outerWidth(item) + "px",
        height: this._sizesResolverManager.outerHeight(item) + "px",
        position: "absolute",
        left: left,
        top: top,
        marginLeft: itemComputedCSS.marginLeft,
        marginRight: itemComputedCSS.marginRight,
        marginTop: itemComputedCSS.marginTop,
        marginBottom: itemComputedCSS.marginBottom
    });
    Dom.css3.perspective(scene, this._settings.getRotatePerspective()); 
    grid.appendChild(scene);

    return scene;
}

Gridifier.Api.Rotate.prototype._createFrames = function(scene) {
    var frames = document.createElement("div");
    Dom.css.set(frames, {
        width: "100%", height: "100%", position: "absolute"
    });
    Dom.css3.transformStyle(frames, "preserve-3d");
    Dom.css3.perspective(frames, this._settings.getRotatePerspective());

    scene.appendChild(frames);
    return frames;
}

Gridifier.Api.Rotate.prototype._createItemClone = function(item) {
    var itemClone = item.cloneNode(true);
    this._collector.markItemAsRestrictedToCollect(itemClone);

    var itemComputedCSS = SizesResolver.getComputedCSSWithMaybePercentageSizes(item);
    var originalHeight = parseInt(itemComputedCSS.height);

    Dom.css.set(itemClone, {
        left: "0px",
        top: "0px",
        visibility: "visible",
        width: this._sizesResolverManager.outerWidth(item) + "px",
        height: this._sizesResolverManager.outerHeight(item) + "px",
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0
    });
    Dom.css3.transition(itemClone, "");
    Dom.css3.transform(itemClone, "");

    // If original height == 0, paddingBottom is setted up instead of height
    // (We should drop paddings, for rotate we should use sizes resolved through
    //  sizesResolverManager in px)
    if(originalHeight == 0) {
        Dom.css.set(itemClone, {
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: 0,
            paddingBottom: 0
        });
    }

    return itemClone;
}

Gridifier.Api.Rotate.prototype._addFrameCss = function(frame) {
    Dom.css.set(frame, {
        display: "block", 
        position: "absolute", 
        width: "100%", 
        height: "100%"
    });

    if(!this._settings.getRotateBackface())
        Dom.css3.backfaceVisibility(frame, "hidden");
}

Gridifier.Api.Rotate.prototype._createFrontFrame = function(frames, rotateProp, rotateMatrix) {
    var frontFrame = document.createElement("div");
    this._addFrameCss(frontFrame);
    frames.appendChild(frontFrame);

    Dom.css.set(frontFrame, {zIndex: 2});
    Dom.css3.transitionProperty(frontFrame, Prefixer.getForCSS('transform', frontFrame) + " 0ms " + this._transitionTiming);
    Dom.css3.transformProperty(frontFrame, rotateProp, rotateMatrix + this._settings.getRotateAngles()[0] + "deg");

    return frontFrame;
}

Gridifier.Api.Rotate.prototype._createBackFrame = function(frames, rotateProp, rotateMatrix) {
    var backFrame = document.createElement("div");
    this._addFrameCss(backFrame);
    frames.appendChild(backFrame);

    Dom.css3.transitionProperty(backFrame, Prefixer.getForCSS('transform', backFrame) + " 0ms " + this._transitionTiming);
    Dom.css3.transformProperty(backFrame, rotateProp, rotateMatrix + this._settings.getRotateAngles()[1] + "deg");

    return backFrame;
}

Gridifier.Api.Rotate.prototype._initFadeEffect = function(scene, isShowing, isHiding, animationMsDuration) {
    var me = this;

    if(this._rotateFadeType == Gridifier.Api.Rotate.ROTATE_FADE_TYPES.NONE)
        return;
    else if(this._rotateFadeType == Gridifier.Api.Rotate.ROTATE_FADE_TYPES.FULL) {
        if(isShowing) {
            Dom.css3.transition(scene, "none");
            Dom.css3.opacity(scene, 0);
            var targetOpacity = 1;
        }
        else if(isHiding) {
            Dom.css3.transition(scene, "none");
            Dom.css3.opacity(scene, 1);
            var targetOpacity = 0;
        }

        setTimeout(function() {
            Dom.css3.transition(
                scene,
                Prefixer.getForCSS('opacity', scene) + " " + animationMsDuration + "ms " + me._transitionTiming
            );
            Dom.css3.opacity(scene, targetOpacity);
        }, 40);
    }
    else if(this._rotateFadeType == Gridifier.Api.Rotate.ROTATE_FADE_TYPES.ON_HIDE_MIDDLE) {
        if(!isHiding)
            return;

        setTimeout(function () {
            Dom.css3.transition(
                scene,
                Prefixer.getForCSS('opacity', scene) + " " + (animationMsDuration / 2) + "ms " + me._transitionTiming
            );
            Dom.css3.opacity(scene, 0);
        }, animationMsDuration / 2);
    }
}