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

Gridifier.ApiSettingsErrors = function(a, b) {
    var c = this;
    this._error = null;
    this._isApiSettingsError = false;
    this._errorMsg = "";
    this._css = {};
    this._construct = function() {
        c._error = a;
        c._isApiSettingsError = false;
        c._errorMsg = "";
        c._parseIfIsApiSettingsError(b);
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        c._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.ApiSettingsErrors.prototype.isApiSettingsError = function() {
    return this._isApiSettingsError;
};

Gridifier.ApiSettingsErrors.prototype.getErrorMessage = function() {
    return this._errorMsg;
};

Gridifier.ApiSettingsErrors.prototype._parseIfIsApiSettingsError = function(a) {
    var b = Gridifier.Error.ERROR_TYPES.SETTINGS;
    if (a == b.INVALID_ONE_OF_TOGGLE_PARAMS) {
        this._markAsApiSettingsError();
        this._invalidOneOfToggleParamsError();
    } else if (a == b.INVALID_ONE_OF_SORT_FUNCTION_TYPES || a == b.INVALID_ONE_OF_RETRANSFORM_SORT_FUNCTION_TYPES || a == b.INVALID_ONE_OF_FILTER_FUNCTION_TYPES || a == b.INVALID_ONE_OF_COORDS_CHANGER_FUNCTION_TYPES || a == b.INVALID_ONE_OF_SIZES_CHANGER_FUNCTION_TYPES || a == b.INVALID_ONE_OF_DRAGGABLE_ITEM_DECORATOR_FUNCTION_TYPES) {
        this._markAsApiSettingsError();
        if (a == b.INVALID_ONE_OF_SORT_FUNCTION_TYPES) {
            var c = "sort";
        } else if (a == b.INVALID_ONE_OF_RETRANSFORM_SORT_FUNCTION_TYPES) {
            var c = "retransformSort";
        } else if (a == b.INVALID_ONE_OF_FILTER_FUNCTION_TYPES) {
            var c = "filter";
        } else if (a == b.INVALID_ONE_OF_COORDS_CHANGER_FUNCTION_TYPES) {
            var c = "coordsChanger";
        } else if (a == b.INVALID_ONE_OF_SIZES_CHANGER_FUNCTION_TYPES) {
            var c = "sizesChanger";
        } else if (a == b.INVALID_ONE_OF_DRAGGABLE_ITEM_DECORATOR_FUNCTION_TYPES) {
            var c = "draggableItemDecorator";
        }
        this._invalidOneOfFunctionTypesError(c);
    } else if (a == b.INVALID_TOGGLE_PARAM_VALUE || a == b.INVALID_SORT_PARAM_VALUE || a == b.INVALID_RETRANSFORM_SORT_PARAM_VALUE || a == b.INVALID_FILTER_PARAM_VALUE || a == b.INVALID_COORDS_CHANGER_PARAM_VALUE || a == b.INVALID_SIZES_CHANGER_PARAM_VALUE || a == b.INVALID_DRAGGABLE_ITEM_DECORATOR_PARAM_VALUE) {
        this._markAsApiSettingsError();
        if (a == b.INVALID_TOGGLE_PARAM_VALUE) {
            var c = "toggle";
        } else if (a == b.INVALID_SORT_PARAM_VALUE) {
            var c = "sort";
        } else if (a == b.INVALID_RETRANSFORM_SORT_PARAM_VALUE) {
            var c = "retransformSort";
        } else if (a == b.INVALID_FILTER_PARAM_VALUE) {
            var c = "filter";
        } else if (a == b.INVALID_COORDS_CHANGER_PARAM_VALUE) {
            var c = "coordsChanger";
        } else if (a == b.INVALID_SIZES_CHANGER_PARAM_VALUE) {
            var c = "sizesChanger";
        } else if (a == b.INVALID_DRAGGABLE_ITEM_DECORATOR_PARAM_VALUE) {
            var c = "draggableItemDecorator";
        }
        this._invalidParamValueError(c);
    } else if (a == b.SET_TOGGLE_INVALID_PARAM || a == b.SET_FILTER_INVALID_PARAM || a == b.SET_SORT_INVALID_PARAM || a == b.SET_RETRANSFORM_SORT_INVALID_PARAM || a == b.SET_COORDS_CHANGER_INVALID_PARAM || a == b.SET_SIZES_CHANGER_INVALID_PARAM || a == b.SET_DRAGGABLE_ITEM_DECORATOR_INVALID_PARAM) {
        this._markAsApiSettingsError();
        if (a == b.SET_TOGGLE_INVALID_PARAM) {
            var d = "toggle";
        } else if (a == b.SET_FILTER_INVALID_PARAM) {
            var d = "filter";
        } else if (a == b.SET_SORT_INVALID_PARAM) {
            var d = "sort";
        } else if (a == b.SET_RETRANSFORM_SORT_INVALID_PARAM) {
            var d = "retransformSort";
        } else if (a == b.SET_COORDS_CHANGER_INVALID_PARAM) {
            var d = "coordsChanger";
        } else if (a == b.SET_SIZES_CHANGER_INVALID_PARAM) {
            var d = "sizesChanger";
        } else if (a == b.SET_DRAGGABLE_ITEM_DECORATOR_INVALID_PARAM) {
            var d = "draggableItemDecorator";
        }
        this._invalidSetterParamError(d);
    }
};

Gridifier.ApiSettingsErrors.prototype._markAsApiSettingsError = function() {
    this._isApiSettingsError = true;
};

Gridifier.ApiSettingsErrors.prototype._invalidOneOfToggleParamsError = function() {
    var a = this._error.getErrorMsgPrefix();
    a += "Wrong one of the 'toggle' params. It must be an object with show and hide function definitions.";
    a += " Got: '" + this._error.getErrorParam() + "'.";
    this._errorMsg = a;
};

Gridifier.ApiSettingsErrors.prototype._invalidOneOfFunctionTypesError = function(a) {
    var b = this._error.getErrorMsgPrefix();
    b += "Wrong one of the '" + a + "' functions. It must be a function. Got: '" + this._error.getErrorParam() + "'.";
    this._errorMsg = b;
};

Gridifier.ApiSettingsErrors.prototype._invalidParamValueError = function(a) {
    var b = this._error.getErrorMsgPrefix();
    b += "Wrong '" + a + "' param value. It must be a function(which will be used by default), ";
    b += "or an object with key(function name)-value(function body) pairs. Got: '" + this._error.getErrorParam() + "'.";
    this._errorMsg = b;
};

Gridifier.ApiSettingsErrors.prototype._invalidSetterParamError = function(a) {
    var b = this._error.getErrorMsgPrefix();
    b += "Can't set '" + a + "' with name '" + this._error.getErrorParam() + "'.";
    b += " It is not registred in Gridifier.";
    this._errorMsg = b;
};