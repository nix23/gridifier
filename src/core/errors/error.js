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

Gridifier.Error = function(a, b) {
    var c = this;
    this._errorParam = null;
    this._coreErrors = null;
    this._collectorErrors = null;
    this._apiSettingsErrors = null;
    this._coreSettingsErrors = null;
    this._css = {};
    this._construct = function() {
        c._errorParam = b || null;
        c._coreErrors = new Gridifier.CoreErrors(c, a);
        c._collectorErrors = new Gridifier.CollectorErrors(c, a);
        c._apiSettingsErrors = new Gridifier.ApiSettingsErrors(c, a);
        c._coreSettingsErrors = new Gridifier.CoreSettingsErrors(c, a);
        if (c._coreErrors.isCoreError()) {
            var d = c._coreErrors.getErrorMessage();
        } else if (c._collectorErrors.isCollectorError()) {
            var d = c._collectorErrors.getErrorMessage();
        } else if (c._apiSettingsErrors.isApiSettingsError()) {
            var d = c._apiSettingsErrors.getErrorMessage();
        } else if (c._coreSettingsErrors.isCoreSettingsError()) {
            var d = c._coreSettingsErrors.getErrorMessage();
        } else {
            throw new Error("Gridifier Error -> Wrong error type: " + a);
        }
        throw new Error(d);
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        c._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.Error.ERROR_TYPES = {
    EXTRACT_GRID: 0,
    SETTINGS: {
        INVALID_GRID_TYPE: 1,
        INVALID_PREPEND_TYPE: 2,
        INVALID_APPEND_TYPE: 3,
        INVALID_INTERSECTION_STRATEGY: 4,
        INVALID_ALIGNMENT_TYPE: 5,
        INVALID_SORT_DISPERSION_MODE: 6,
        MISSING_SORT_DISPERSION_VALUE: 7,
        INVALID_SORT_DISPERSION_VALUE: 8,
        INVALID_SORT_PARAM_VALUE: 9,
        INVALID_ONE_OF_SORT_FUNCTION_TYPES: 10,
        INVALID_RETRANSFORM_SORT_PARAM_VALUE: 41,
        INVALID_ONE_OF_RETRANSFORM_SORT_FUNCTION_TYPES: 42,
        INVALID_FILTER_PARAM_VALUE: 11,
        INVALID_ONE_OF_FILTER_FUNCTION_TYPES: 12,
        INVALID_TOGGLE_PARAM_VALUE: 13,
        INVALID_ONE_OF_TOGGLE_PARAMS: 14,
        INVALID_COORDS_CHANGER_PARAM_VALUE: 15,
        INVALID_ONE_OF_COORDS_CHANGER_FUNCTION_TYPES: 16,
        INVALID_SIZES_CHANGER_PARAM_VALUE: 17,
        INVALID_ONE_OF_SIZES_CHANGER_FUNCTION_TYPES: 18,
        INVALID_DRAGGABLE_ITEM_DECORATOR_PARAM_VALUE: 37,
        INVALID_ONE_OF_DRAGGABLE_ITEM_DECORATOR_FUNCTION_TYPES: 38,
        SET_TOGGLE_INVALID_PARAM: 19,
        SET_FILTER_INVALID_PARAM: 20,
        SET_SORT_INVALID_PARAM: 21,
        SET_RETRANSFORM_SORT_INVALID_PARAM: 43,
        SET_COORDS_CHANGER_INVALID_PARAM: 22,
        SET_SIZES_CHANGER_INVALID_PARAM: 23,
        SET_DRAGGABLE_ITEM_DECORATOR_INVALID_PARAM: 36,
        INVALID_DRAGIFIER_DISCRETIZATION_MODE: 40
    },
    COLLECTOR: {
        NOT_DOM_ELEMENT: 24,
        ITEM_NOT_ATTACHED_TO_GRID: 25,
        ITEM_NOT_CONNECTED_TO_GRID: 26,
        ITEM_WIDER_THAN_GRID_WIDTH: 27,
        ITEM_TALLER_THAN_GRID_HEIGHT: 28
    },
    CONNECTIONS: {
        NO_CONNECTIONS: 29,
        CONNECTION_BY_ITEM_NOT_FOUND: 30
    },
    SIZES_TRANSFORMER: {
        WRONG_TARGET_TRANSFORMATION_SIZES: 31
    },
    APPENDER: {
        WRONG_INSERT_BEFORE_TARGET_ITEM: 32,
        WRONG_INSERT_AFTER_TARGET_ITEM: 33
    },
    INSERTER: {
        TOO_WIDE_ITEM_ON_VERTICAL_GRID_INSERT: 34,
        TOO_TALL_ITEM_ON_HORIZONTAL_GRID_INSERT: 35
    }
};

Gridifier.Error.prototype.getErrorMsgPrefix = function() {
    return "Gridifier error: ";
};

Gridifier.Error.prototype.getErrorApiUrlPrefix = function() {
    return "http://gridifier.io/api/errors/";
};

Gridifier.Error.prototype.getErrorParam = function() {
    return this._errorParam + "(" + typeof this._errorParam + ")";
};

Gridifier.Error.prototype.getErrorObjectParam = function() {
    return this._errorParam;
};