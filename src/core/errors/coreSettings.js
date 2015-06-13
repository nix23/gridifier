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

Gridifier.CoreSettingsErrors = function(a, b) {
    var c = this;
    this._error = null;
    this._isCoreSettingsError = false;
    this._errorMsg = "";
    this._css = {};
    this._construct = function() {
        c._error = a;
        c._isCoreSettingsError = false;
        c._errorMsg = "";
        c._parseIfIsCoreSettingsError(b);
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        c._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.CoreSettingsErrors.prototype.isCoreSettingsError = function() {
    return this._isCoreSettingsError;
};

Gridifier.CoreSettingsErrors.prototype.getErrorMessage = function() {
    return this._errorMsg;
};

Gridifier.CoreSettingsErrors.prototype._parseIfIsCoreSettingsError = function(a) {
    var b = Gridifier.Error.ERROR_TYPES.SETTINGS;
    if (a == b.INVALID_GRID_TYPE) {
        this._markAsCoreSettingsError();
        this._invalidGridTypeError();
    } else if (a == b.INVALID_PREPEND_TYPE) {
        this._markAsCoreSettingsError();
        this._invalidPrependTypeError();
    } else if (a == b.INVALID_APPEND_TYPE) {
        this._markAsCoreSettingsError();
        this._invalidAppendTypeError();
    } else if (a == b.INVALID_INTERSECTION_STRATEGY) {
        this._markAsCoreSettingsError();
        this._invalidIntersectionStrategyError();
    } else if (a == b.INVALID_ALIGNMENT_TYPE) {
        this._markAsCoreSettingsError();
        this._invalidAlignmentTypeError();
    } else if (a == b.INVALID_SORT_DISPERSION_MODE) {
        this._markAsCoreSettingsError();
        this._invalidSortDispersionModeError();
    } else if (a == b.MISSING_SORT_DISPERSION_VALUE) {
        this._markAsCoreSettingsError();
        this._missingSortDispersionValueError();
    } else if (a == b.INVALID_SORT_DISPERSION_VALUE) {
        this._markAsCoreSettingsError();
        this._invalidSortDispersionValueError();
    } else if (a == b.INVALID_DRAGIFIER_DISCRETIZATION_MODE) {
        this._markAsCoreSettingsError();
        this._invalidDragifierDiscretizationModeError();
    }
};

Gridifier.CoreSettingsErrors.prototype._markAsCoreSettingsError = function() {
    this._isCoreSettingsError = true;
};

Gridifier.CoreSettingsErrors.prototype._invalidGridTypeError = function() {
    var a = this._error.getErrorMsgPrefix();
    a += "Wrong 'gridType' param value. Got: '" + this._error.getErrorParam() + "'. ";
    a += "Available types: " + Gridifier.GRID_TYPES.VERTICAL_GRID;
    a += ", " + Gridifier.GRID_TYPES.HORIZONTAL_GRID + ".";
    this._errorMsg = a;
};

Gridifier.CoreSettingsErrors.prototype._invalidPrependTypeError = function() {
    var a = this._error.getErrorMsgPrefix();
    a += "Wrong 'prependType' param value. Got: '" + this._error.getErrorParam() + "'. ";
    a += "Available types: " + Gridifier.PREPEND_TYPES.MIRRORED_PREPEND;
    a += " , " + Gridifier.PREPEND_TYPES.DEFAULT_PREPEND;
    a += " , " + Gridifier.PREPEND_TYPES.REVERSED_PREPEND + ".";
    this._errorMsg = a;
};

Gridifier.CoreSettingsErrors.prototype._invalidAppendTypeError = function() {
    var a = this._error.getErrorMsgPrefix();
    a += "Wrong 'appendType' param value. Got: '" + this._error.getErrorParam() + "'. ";
    a += "Available types: " + Gridifier.APPEND_TYPES.DEFAULT_APPEND;
    a += " , " + Gridifier.APPEND_TYPES.REVERSED_APPEND + ".";
    this._errorMsg = a;
};

Gridifier.CoreSettingsErrors.prototype._invalidIntersectionStrategyError = function() {
    var a = this._error.getErrorMsgPrefix();
    a += "Wrong 'intersectionStrategy' param value. Got: '" + this._error.getErrorParam() + "'. ";
    a += "Available strategies: " + Gridifier.INTERSECTION_STRATEGIES.DEFAULT;
    a += " , " + Gridifier.INTERSECTION_STRATEGIES.REVERSED;
    this._errorMsg = a;
};

Gridifier.CoreSettingsErrors.prototype._invalidAlignmentTypeError = function() {
    var a = this._error.getErrorMsgPrefix();
    var b = Gridifier.INTERSECTION_STRATEGY_ALIGNMENT_TYPES;
    var c = b.FOR_VERTICAL_GRID;
    var d = b.FOR_HORIZONTAL_GRID;
    a += "Wrong 'alignmentType' param value. Got: '" + this._error.getErrorParam() + "'. ";
    a += "Available values: ";
    a += c.TOP + ", ";
    a += c.CENTER + ", ";
    a += c.BOTTOM + "(For vertical grids), ";
    a += d.LEFT + ", ";
    a += d.CENTER + ", ";
    a += d.RIGHT + "(For horizontal grids). ";
    this._errorMsg = a;
};

Gridifier.CoreSettingsErrors.prototype._invalidSortDispersionModeError = function() {
    var a = this._error.getErrorMsgPrefix();
    a += "Wrong 'sortDispersionMode' param value. Got: '" + this._error.getErrorParam() + "'. ";
    a += "Available modes: " + Gridifier.SORT_DISPERSION_MODES.DISABLED;
    a += " , " + Gridifier.SORT_DISPERSION_MODES.CUSTOM;
    a += " , " + Gridifier.SORT_DISPERSION_MODES.CUSTOM_ALL_EMPTY_SPACE;
    this._errorMsg = a;
};

Gridifier.CoreSettingsErrors.prototype._missingSortDispersionModeError = function() {
    var a = this._error.getErrorMsgPrefix();
    a += "You have chosen custom sort dispersion mode, but didn't provided required 'sortDispersionValue' param.";
    this._errorMsg = a;
};

Gridifier.CoreSettingsErrors.prototype._invalidSortDispersionValueError = function() {
    var a = this._error.getErrorMsgPrefix();
    a += "Wrong 'sortDispersionValue' param value. It must be a string with number as prefix, ";
    a += "and px as postfix.(100px). Got: '" + this._error.getErrorParam() + "'.";
    this._errorMsg = a;
};

Gridifier.CoreSettingsErrors.prototype._invalidDragifierDiscretizationModeError = function() {
    var a = this._error.getErrorMsgPrefix();
    a += "Can't combine 'gridDiscretization' dragifier algorithm param with following settings: \n";
    a += "    1. 'discretization' dragifier mode doesn't support noIntersections strategy.\n";
    a += "    2. 'discretization' dragifier mode requires 'sortDispersion' parameter to be equal to the 'customAllEmptySpace' value.";
    a += " (This mode must have all grid space available per drags.)";
    this._errorMsg = a;
};