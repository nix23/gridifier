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

Gridifier.Api.CoordsChanger = function(settings, gridifier, eventEmitter) {
    var me = this;

    this._settings = null;
    this._gridifier = null;
    this._eventEmitter = null;

    this._coordsChangerFunction = null;
    this._coordsChangerFunctions = {};

    this._css = {
    };

    this._construct = function() { 
        me._settings = settings;
        me._gridifier = gridifier;
        me._eventEmitter = eventEmitter;

        me._coordsChangerFunctions = {};

        me._addDefaultCoordsChanger();
        me._addCSS3PositionCoordsChanger();
        me._addCSS3TranslateCoordsChanger();
        me._addCSS3Translate3DCoordsChanger();
        me._addCSS3Translate3DClonesCoordsChanger();
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

Gridifier.Api.CoordsChanger.prototype.setCoordsChangerFunction = function(coordsChangerFunctionName) {
    if(!this._coordsChangerFunctions.hasOwnProperty(coordsChangerFunctionName)) {
        new Gridifier.Error(
            Gridifier.Error.ERROR_TYPES.SETTINGS.SET_COORDS_CHANGER_INVALID_PARAM,
            coordsChangerFunctionName
        );
        return;
    }

    this._coordsChangerFunction = this._coordsChangerFunctions[coordsChangerFunctionName];
}

Gridifier.Api.CoordsChanger.prototype.addCoordsChangerFunction = function(coordsChangerFunctionName, 
                                                                          coordsChangerFunction) {
    this._coordsChangerFunctions[coordsChangerFunctionName] = coordsChangerFunction;
}

Gridifier.Api.CoordsChanger.prototype.getCoordsChangerFunction = function() {
    return this._coordsChangerFunction;
}

Gridifier.Api.CoordsChanger.prototype._addDefaultCoordsChanger = function() {
    this._coordsChangerFunctions["default"] = function(item, 
                                                       newLeft, 
                                                       newTop,
                                                       animationMsDuration,
                                                       eventEmitter,
                                                       emitTransformEvent,
                                                       newWidth,
                                                       newHeight,
                                                       isItemInitializationCall,
                                                       transitionTiming) {
        var isItemInitializationCall = isItemInitializationCall || false;
        if(isItemInitializationCall) {
            // Custom init logic per coordsChanger sync can be placed here
            // (We are no passing this flag from CSS3 coordsChanger fallback methods,
            //  because no special initialization is required here)
            return;
        }

        if(newLeft != item.style.left)
            Dom.css.set(item, {left: newLeft});
        if(newTop != item.style.top)
            Dom.css.set(item, {top: newTop});

        if(emitTransformEvent) {
            eventEmitter.emitTransformEvent(item, newWidth, newHeight, newLeft, newTop);
        }
    };
}

Gridifier.Api.CoordsChanger.prototype._addCSS3PositionCoordsChanger = function() {
    var me = this;

    this._coordsChangerFunctions.CSS3Position = function(item,
                                                         newLeft,
                                                         newTop,
                                                         animationMsDuration,
                                                         eventEmitter,
                                                         emitTransformEvent,
                                                         newWidth,
                                                         newHeight,
                                                         isItemInitializationCall,
                                                         transitionTiming) {
        if(!Dom.isBrowserSupportingTransitions()) {
            me._coordsChangerFunctions["default"](
                item, newLeft, newTop, animationMsDuration, eventEmitter, emitTransformEvent, newWidth, newHeight
            );
            return;
        }

        newLeft = parseFloat(newLeft) + "px";
        newTop = parseFloat(newTop) + "px";

        var isItemInitializationCall = isItemInitializationCall || false;
        if(isItemInitializationCall) {
            Dom.css3.transform(item, "scale3d(1,1,1)");
            return;
        }

        if(newLeft != item.style.left) {
            Dom.css3.transitionProperty(item, "left " + animationMsDuration + "ms " + transitionTiming);
            Dom.css.set(item, {left: newLeft});
        }

        if(newTop != item.style.top) {
            Dom.css3.transitionProperty(item, "top " + animationMsDuration + "ms " + transitionTiming);
            Dom.css.set(item, {top: newTop});
        }

        if(emitTransformEvent) {
            setTimeout(function() {
                eventEmitter.emitTransformEvent(item, newWidth, newHeight, newLeft, newTop);
            }, animationMsDuration + 20);
        }
    }
}

Gridifier.Api.CoordsChanger.prototype._addCSS3TranslateCoordsChanger = function() {
    var me = this;

    var createCoordsChanger = function(translateXNormalizer, translateYNormalizer, beforeInit) {
        return function(item,
                        newLeft,
                        newTop,
                        animationMsDuration,
                        eventEmitter,
                        emitTransformEvent,
                        newWidth,
                        newHeight,
                        isItemInitializationCall,
                        transitionTiming) {
            if(!Dom.isBrowserSupportingTransitions()) {
                me._coordsChangerFunctions["default"](
                    item, newLeft, newTop, animationMsDuration, eventEmitter, emitTransformEvent, newWidth, newHeight
                );
                return;
            }

            var isItemInitializationCall = isItemInitializationCall || false;
            if(isItemInitializationCall) {
                beforeInit(item, newLeft, newTop);
                Dom.css3.transform(item, "scale3d(1,1,1) translate(0px,0px)");
                return;
            }

            var newLeft = parseFloat(newLeft);
            var newTop = parseFloat(newTop);

            var currentLeft = parseFloat(item.style.left);
            var currentTop = parseFloat(item.style.top);

            if(newLeft > currentLeft)
                var translateX = newLeft - currentLeft;
            else if(newLeft < currentLeft)
                var translateX = (currentLeft - newLeft) * -1;
            else
                var translateX = 0;

            if(newTop > currentTop)
                var translateY = newTop - currentTop;
            else if(newTop < currentTop)
                var translateY = (currentTop - newTop) * -1;
            else
                var translateY = 0;

            var translateRegexp = /.*translate\((.*)\).*/;
            var matches = translateRegexp.exec(item.style[Prefixer.get("transform")]);
            if(matches == null || typeof matches[1] == "undefined" || matches[1] == null) {
                var setNewTranslate = true;
            }
            else {
                var translateParts = matches[1].split(",");
                var lastTranslateX = translateParts[0].gridifierTrim();
                var lastTranslateY = translateParts[1].gridifierTrim();

                if(lastTranslateX == (translateX + "px") && lastTranslateY == (translateY + "px"))
                    var setNewTranslate = false;
                else
                    var setNewTranslate = true;
            }

            if(setNewTranslate) {
                Dom.css3.transitionProperty(
                    item,
                    Prefixer.getForCSS('transform', item) + " " + animationMsDuration + "ms " + transitionTiming
                );

                translateX = translateXNormalizer(translateX);
                translateY = translateYNormalizer(translateY);

                Dom.css3.transformProperty(item, "translate", translateX + "px," + translateY + "px");
            }

            if(emitTransformEvent) {
                setTimeout(function () {
                    eventEmitter.emitTransformEvent(item, newWidth, newHeight, newLeft, newTop);
                }, animationMsDuration + 20);
            }
        }
    };

    var returnOriginalTranslate = function(translate) { return translate; };
    var returnVoid = function(item, initLeft, initTop) { return; };
    this._coordsChangerFunctions.CSS3Translate = createCoordsChanger(returnOriginalTranslate, returnOriginalTranslate, returnVoid);
    this._coordsChangerFunctions.CSS3TranslateWithRounding = createCoordsChanger(
        function(translateX) { return Math.round(translateX); },
        function(translateY) { return Math.round(translateY); },
        function(item, initLeft, initTop) {
            Dom.css.set(item, {
                left: Math.round(parseFloat(initLeft)) + "px",
                top: Math.round(parseFloat(initTop)) + "px"
            });
        }
    );
}

Gridifier.Api.CoordsChanger.prototype._addCSS3Translate3DCoordsChanger = function() {
    var me = this;

    var createCoordsChanger = function(translateXNormalizer, translateYNormalizer, beforeInit) {
        return function (item,
                         newLeft,
                         newTop,
                         animationMsDuration,
                         eventEmitter,
                         emitTransformEvent,
                         newWidth,
                         newHeight,
                         isItemInitializationCall,
                         transitionTiming) {
            if(!Dom.isBrowserSupportingTransitions()) {
                me._coordsChangerFunctions["default"](
                    item, newLeft, newTop, animationMsDuration, eventEmitter, emitTransformEvent, newWidth, newHeight
                );
                return;
            }

            var isItemInitializationCall = isItemInitializationCall || false;
            if(isItemInitializationCall) {
                beforeInit(item, newLeft, newTop);
                Dom.css3.transform(item, "scale3d(1,1,1) translate3d(0px,0px,0px)");
                return;
            }

            var newLeft = parseFloat(newLeft);
            var newTop = parseFloat(newTop);

            var currentLeft = parseFloat(item.style.left);
            var currentTop = parseFloat(item.style.top);

            if(newLeft > currentLeft)
                var translateX = newLeft - currentLeft;
            else if(newLeft < currentLeft)
                var translateX = (currentLeft - newLeft) * -1;
            else
                var translateX = 0;

            if(newTop > currentTop)
                var translateY = newTop - currentTop;
            else if(newTop < currentTop)
                var translateY = (currentTop - newTop) * -1;
            else
                var translateY = 0;

            var translateRegexp = /.*translate3d\((.*)\).*/;
            var matches = translateRegexp.exec(item.style[Prefixer.get("transform")]);
            if(matches == null || typeof matches[1] == "undefined" || matches[1] == null) {
                var setNewTranslate = true;
            }
            else {
                var translateParts = matches[1].split(",");
                var lastTranslateX = translateParts[0].gridifierTrim();
                var lastTranslateY = translateParts[1].gridifierTrim();

                if(lastTranslateX == (translateX + "px") && lastTranslateY == (translateY + "px"))
                    var setNewTranslate = false;
                else
                    var setNewTranslate = true;
            }

            if(setNewTranslate) {
                Dom.css3.transitionProperty(
                    item,
                    Prefixer.getForCSS('transform', item) + " " + animationMsDuration + "ms " + transitionTiming
                );

                translateX = translateXNormalizer(translateX);
                translateY = translateYNormalizer(translateY);

                Dom.css3.perspective(item, "1000");
                Dom.css3.backfaceVisibility(item, "hidden");
                Dom.css3.transformProperty(item, "translate3d", translateX + "px," + translateY + "px,0px");
            }

            if(emitTransformEvent) {
                setTimeout(function () {
                    eventEmitter.emitTransformEvent(item, newWidth, newHeight, newLeft, newTop);
                }, animationMsDuration + 20);
            }
        };
    }

    var returnOriginalTranslate = function(translate) { return translate; };
    var returnVoid = function(item, initLeft, initTop) { return; };
    this._coordsChangerFunctions.CSS3Translate3D = createCoordsChanger(returnOriginalTranslate, returnOriginalTranslate, returnVoid);
    this._coordsChangerFunctions.CSS3Translate3DWithRounding = createCoordsChanger(
        function(translateX) { return Math.round(translateX); },
        function(translateY) { return Math.round(translateY); },
        function(item, initLeft, initTop) {
            Dom.css.set(item, {
                left: Math.round(parseFloat(initLeft)) + "px",
                top: Math.round(parseFloat(initTop)) + "px"
            });
        }
    );
}

Gridifier.Api.CoordsChanger.CSS3_TRANSLATE_3D_CLONES_RESTRICT_CLONE_SHOW_DATA_ATTR = "gridifier-clones-coords-changer-restrict-show";

Gridifier.Api.CoordsChanger.prototype._addCSS3Translate3DClonesCoordsChanger = function() {
    var me = this;
    var itemShownDataAttr = "data-gridifier-item-shown";

    this._gridifier.onShow(function(item) {
        var itemClonesManager = me._gridifier.getItemClonesManager();
        if(!itemClonesManager.hasBindedClone(item))
            return;

        item.setAttribute(itemShownDataAttr, "yes");
    });

    this._gridifier.onHide(function(item) {
        //var itemClonesManager = me._gridifier.getItemClonesManager();
        //if(!itemClonesManager.hasBindedClone(item))
        //    return;

        if(Dom.hasAttribute(item, itemShownDataAttr))
            item.removeAttribute(itemShownDataAttr);
    });

    var clonesHideTimeouts = [];

    this._coordsChangerFunctions.CSS3Translate3DClones = function(item,
                                                                  newLeft,
                                                                  newTop,
                                                                  animationMsDuration,
                                                                  eventEmitter,
                                                                  emitTransformEvent,
                                                                  newWidth,
                                                                  newHeight,
                                                                  isItemInitializationCall,
                                                                  transitionTiming) {
        if(!Dom.isBrowserSupportingTransitions()) {
            me._coordsChangerFunctions["default"](
                item, newLeft, newTop, animationMsDuration, eventEmitter, emitTransformEvent, newWidth, newHeight
            );
            return;
        }

        // We should preinit item transform property with scale3d(1,1,1) rule.
        // Otherwise animation will break on scale3d applying any later time.
        //      item.style.wT = "translate3d(0px,0px,0px)";
        //      item.style.wT = "translate3d(0px,0px,0px) scale3d(1,1,1) "; -> Won't work.
        //      item.style.wT = "scale3d(1,1,1)";
        //      item.style.wT = "scale3d(1,1,1) translate3d(0px,0px,0px)"; -> Will work, but will break without setting
        //                                                                    second rule without timeout. So we should
        //                                                                    set all required rules per coords changers
        //                                                                    before calling toggle function for first time.
        var isItemInitializationCall = isItemInitializationCall || false;
        if(isItemInitializationCall) {
            Dom.css3.transform(item, "scale3d(1,1,1) translate3d(0px,0px,0px)");
            return;
        }

        newLeft = parseFloat(newLeft) + "px";
        newTop = parseFloat(newTop) + "px";

        if(Dom.hasAttribute(item, Gridifier.Dragifier.IS_DRAGGABLE_ITEM_DATA_ATTR))
            var isDraggableItem = true;
        else
            var isDraggableItem = false;

        var itemClonesManager = me._gridifier.getItemClonesManager();
        var itemClone = itemClonesManager.getBindedClone(item);

        var guid = item.getAttribute(Gridifier.GUID.GUID_DATA_ATTR);

        if(typeof clonesHideTimeouts[guid] == "undefined") {
            clonesHideTimeouts[guid] = null;
        }

        var cc = Gridifier.Api.CoordsChanger;
        if(!isDraggableItem && !Dom.hasAttribute(itemClone, cc.CSS3_TRANSLATE_3D_CLONES_RESTRICT_CLONE_SHOW_DATA_ATTR)) {
            if(itemClone.style.visibility != "visible")
                itemClone.style.visibility = "visible";
        }

        if(Dom.hasAttribute(item, itemShownDataAttr)) {
            if(item.style.visibility != "hidden")
                item.style.visibility = "hidden";
        }

        if(emitTransformEvent) {
            var sizesChanger = me._settings.getSizesChanger();
            sizesChanger(itemClone, newWidth, newHeight);

            setTimeout(function () {
                eventEmitter.emitTransformEvent(itemClone, newWidth, newHeight, newLeft, newTop);
            }, animationMsDuration + 20);
        }

        if(newLeft != item.style.left)
            Dom.css.set(item, {left: newLeft});

        if(newTop != item.style.top)
            Dom.css.set(item, {top: newTop});

        var tt = transitionTiming;
        me._coordsChangerFunctions.CSS3Translate3D(
            itemClone, newLeft, newTop, animationMsDuration, eventEmitter, emitTransformEvent, newWidth, newHeight, false, tt
        );

        if(clonesHideTimeouts[guid] != null) {
            clearTimeout(clonesHideTimeouts[guid]);
            clonesHideTimeouts[guid] = null;
        }

        clonesHideTimeouts[guid] = setTimeout(function () {
            if(Dom.hasAttribute(item, itemShownDataAttr) && !isDraggableItem) {
                if(item.style.visibility != "visible")
                    item.style.visibility = "visible";

                if(itemClone.style.visibility != "hidden")
                    itemClone.style.visibility = "hidden";
            }
        }, animationMsDuration);
    };
}

Gridifier.Api.CoordsChanger.prototype.hasTranslateOrTranslate3DTransformSet = function(DOMElem) {
    var translateRegexp = /.*translate\((.*)\).*/;
    var translate3dRegexp = /.*translate3d\((.*)\).*/;

    if(translateRegexp.test(DOMElem.style[Prefixer.get("transform", DOMElem)]) ||
        translate3dRegexp.test(DOMElem.style[Prefixer.get("transform", DOMElem)]))
        return true;

    return false;
}

Gridifier.Api.CoordsChanger.prototype.setTransformOriginAccordingToCurrentTranslate = function(DOMElem,
                                                                                               connectionLeft,
                                                                                               connectionTop,
                                                                                               DOMElemWidth,
                                                                                               DOMElemHeight) {
    var newLeft = parseFloat(connectionLeft);
    var newTop = parseFloat(connectionTop);

    var currentLeft = parseFloat(DOMElem.style.left);
    var currentTop = parseFloat(DOMElem.style.top);

    if(newLeft > currentLeft)
        var translateX = newLeft - currentLeft;
    else if(newLeft < currentLeft)
        var translateX = (currentLeft - newLeft) * -1;
    else
        var translateX = 0;

    if(newTop > currentTop)
        var translateY = newTop - currentTop;
    else if(newTop < currentTop)
        var translateY = (currentTop - newTop) * -1;
    else
        var translateY = 0;

    Dom.css3.transformOrigin(DOMElem, (translateX + DOMElemWidth / 2) + "px " + (translateY + DOMElemHeight / 2) + "px");
}

Gridifier.Api.CoordsChanger.prototype.resetTransformOrigin = function(DOMElem) {
    Dom.css3.transformOrigin(DOMElem, "50% 50%");
}