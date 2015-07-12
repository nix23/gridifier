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

Gridifier.CollectorErrors = function(a, b) {
    var c = this;
    this._error = null;
    this._isCollectorError = false;
    this._errorMsg = "";
    this._css = {};
    this._construct = function() {
        c._error = a;
        c._isCollectorError = false;
        c._errorMsg = "";
        c._parseIfIsCollectorError(b);
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        c._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.CollectorErrors.prototype.isCollectorError = function() {
    return this._isCollectorError;
};

Gridifier.CollectorErrors.prototype.getErrorMessage = function() {
    return this._errorMsg;
};

Gridifier.CollectorErrors.prototype._parseIfIsCollectorError = function(a) {
    var b = Gridifier.Error.ERROR_TYPES.COLLECTOR;
    if (a == b.NOT_DOM_ELEMENT) {
        this._markAsCollectorError();
        this._notDomElementError();
    } else if (a == b.ITEM_NOT_ATTACHED_TO_GRID) {
        this._markAsCollectorError();
        this._itemNotAttachedToGridError();
    } else if (a == b.ITEM_NOT_CONNECTED_TO_GRID) {
        this._markAsCollectorError();
        this._itemNotConnectedToGridError();
    } else if (a == b.ITEM_WIDER_THAN_GRID_WIDTH) {
        this._markAsCollectorError();
        this._itemWiderThanGridWidthError();
    } else if (a == b.ITEM_TALLER_THAN_GRID_HEIGHT) {
        this._markAsCollectorError();
        this._itemTallerThanGridHeightError();
    }
};

Gridifier.CollectorErrors.prototype._markAsCollectorError = function() {
    this._isCollectorError = true;
};

Gridifier.CollectorErrors.prototype._notDomElementError = function() {
    var a = this._error.getErrorMsgPrefix();
    a += "One of the added elements to Gridifier is not DOM Element. Got: '";
    a += this._error.getErrorParam() + "'.";
    this._errorMsg = a;
};

Gridifier.CollectorErrors.prototype._itemNotAttachedToGridError = function() {
    var a = this._error.getErrorMsgPrefix();
    a += "One of the appended/prepended items is not attached to grid. Item: '";
    a += this._error.getErrorParam() + "'.";
    this._errorMsg = a;
};

Gridifier.CollectorErrors.prototype._itemNotConnectedToGridError = function() {
    var a = this._error.getErrorMsgPrefix();
    a += "One of items is not connected to grid. Item: '";
    a += this._error.getErrorParam() + "'.";
    this._errorMsg = a;
};

Gridifier.CollectorErrors.prototype._itemWiderThanGridWidthError = function() {
    var a = this._error.getErrorMsgPrefix();
    var b = this._error.getErrorObjectParam();
    a += "Item '" + b.item + "' is wider than grid. Grid type: 'Vertical Grid'. ";
    a += "Grid width: '" + b.gridWidth + "px'. Item width: '" + b.itemWidth + "px'.";
    this._errorMsg = a;
};

Gridifier.CollectorErrors.prototype._itemTallerThanGridHeightError = function() {
    var a = this._error.getErrorMsgPrefix();
    var b = this._error.getErrorObjectParam();
    a += "Item '" + b.item + "' is taller than grid. Grid type: 'Horizontal Grid'. ";
    a += "Grid height: '" + b.gridHeight + "px'. Item height: '" + b.itemHeight + "px'.";
    this._errorMsg = a;
};