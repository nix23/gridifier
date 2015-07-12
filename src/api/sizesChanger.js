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

/* You can define your custom sizes changers in this class.
 * (Sizes changers are used per default grid retransforms)
 * Read about custom builds at http://gridifier.io/essentials/install
 * Read about sizes changers at http://gridifier.io/grids/sizes-transforms
 */
Gridifier.Api.SizesChanger = function(settings, eventEmitter) {
    var me = this;

    this._settings = null;
    this._eventEmitter = null;

    this._sizesChangerFunction = null;
    this._sizesChangerFunctions = {};

    this._css = {
    };

    this._construct = function() {
        me._settings = settings;
        me._eventEmitter = eventEmitter;

        me._sizesChangerFunctions = {};

        me._addDefaultSizesChanger();
        me._addDefaultPaddingBottomSizesChanger();
        me._addCSS3TransitionSizesChanger();
        me._addCSS3PaddingBottomTransitionSizesChanger();
        // Call register function per each sizes changer here
        // me._addCustomSizesChanger();
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

Gridifier.Api.SizesChanger.prototype.setSizesChangerFunction = function(sizesChangerFunctionName) {
    if(!this._sizesChangerFunctions.hasOwnProperty(sizesChangerFunctionName)) {
        new Gridifier.Error(
            Gridifier.Error.ERROR_TYPES.SETTINGS.SET_SIZES_CHANGER_INVALID_PARAM,
            sizesChangerFunctionName
        );
        return;
    }

    this._sizesChangerFunction = this._sizesChangerFunctions[sizesChangerFunctionName];
}

Gridifier.Api.SizesChanger.prototype.addSizesChangerFunction = function(sizesChangerFunctionName, 
                                                                        sizesChangerFunction) {
    this._sizesChangerFunctions[sizesChangerFunctionName] = sizesChangerFunction;
}

Gridifier.Api.SizesChanger.prototype.getSizesChangerFunction = function() {
    return this._sizesChangerFunction;
}

Gridifier.Api.SizesChanger.prototype._addDefaultSizesChanger = function() {
    this._sizesChangerFunctions["default"] = function(item, newWidth, newHeight) {
        if(Dom.isBrowserSupportingTransitions()) {
            Dom.css3.transitionProperty(item, "width 0ms ease");
            Dom.css3.transitionProperty(item, "height 0ms ease");
        }

        Dom.css.set(item, {
            width: newWidth,
            height: newHeight
        });
    };
}

Gridifier.Api.SizesChanger.prototype._addDefaultPaddingBottomSizesChanger = function() {
    this._sizesChangerFunctions["defaultPaddingBottom"] = function(item, newWidth, newPaddingBottom) {
        if(Dom.isBrowserSupportingTransitions()) {
            Dom.css3.transitionProperty(item, "width 0ms ease");
            Dom.css3.transitionProperty(item, "padding-bottom 0ms ease");
        }

        Dom.css.set(item, {
            width: newWidth,
            paddingBottom: newPaddingBottom
        });
    };
}

Gridifier.Api.SizesChanger.prototype._addCSS3TransitionSizesChanger = function() {
    this._sizesChangerFunctions.css3 = function(item, newWidth, newHeight) {
        if(Dom.isBrowserSupportingTransitions()) {
            Dom.css3.transitionProperty(item, "width 200ms ease");
            Dom.css3.transitionProperty(item, "height 200ms ease");
        }

        Dom.css.set(item, {
            width: newWidth,
            height: newHeight
        });
    };
}

Gridifier.Api.SizesChanger.prototype._addCSS3PaddingBottomTransitionSizesChanger = function() {
    this._sizesChangerFunctions.css3PaddingBottom = function(item, newWidth, newPaddingBottom) {
        if(Dom.isBrowserSupportingTransitions()) {
            Dom.css3.transitionProperty(item, "width 200ms ease");
            Dom.css3.transitionProperty(item, "padding-bottom 200ms ease");
        }

        Dom.css.set(item, {
            width: newWidth,
            "padding-bottom": newPaddingBottom
        });
    };
}

// Gridifier.Api.SizesChanger.prototype._addCustomSizesChanger = function() {
//     // If you want use coords changer with toggle/transformSizesWithPaddingBottom,
//     // 3-rd parameter will be newPaddingBottom
//     this._sizesChangerFunctions["customSizesChanger"] = function(item, newWidth, newHeight) {
//         // Do something with item here :)
//     }
// }