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

Gridifier.CoreErrors = function(a, b) {
    var c = this;
    this._error = null;
    this._isCoreError = false;
    this._errorMsg = "";
    this._css = {};
    this._construct = function() {
        c._error = a;
        c._isCoreError = false;
        c._errorMsg = "";
        c._parseIfIsCoreError(b);
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        c._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.CoreErrors.prototype.isCoreError = function() {
    return this._isCoreError;
};

Gridifier.CoreErrors.prototype.getErrorMessage = function() {
    return this._errorMsg;
};

Gridifier.CoreErrors.prototype._parseIfIsCoreError = function(a) {
    var b = Gridifier.Error.ERROR_TYPES;
    if (a == b.EXTRACT_GRID) {
        this._markAsCoreError();
        this._notDomElementError();
    } else if (a == b.CONNECTIONS.NO_CONNECTIONS) {
        this._markAsCoreError();
        this._noConnectionsError();
    } else if (a == b.CONNECTIONS.CONNECTION_BY_ITEM_NOT_FOUND) {
        this._markAsCoreError();
        this._connectionByItemNotFoundError();
    } else if (a == b.SIZES_TRANSFORMER.WRONG_TARGET_TRANSFORMATION_SIZES) {
        this._markAsCoreError();
        this._wrongTargetTransformationSizesError();
    } else if (a == b.APPENDER.WRONG_INSERT_BEFORE_TARGET_ITEM) {
        this._markAsCoreError();
        this._wrongInsertBeforeTargetItem();
    } else if (a == b.APPENDER.WRONG_INSERT_AFTER_TARGET_ITEM) {
        this._markAsCoreError();
        this._wrongInsertAfterTargetItem();
    } else if (a == b.INSERTER.TOO_WIDE_ITEM_ON_VERTICAL_GRID_INSERT) {
        this._markAsCoreError();
        this._tooWideItemOnVerticalGridInsert();
    } else if (a == b.INSERTER.TOO_TALL_ITEM_ON_HORIZONTAL_GRID_INSERT) {
        this._markAsCoreError();
        this._tooTallItemOnHorizontalGridInsert();
    }
};

Gridifier.CoreErrors.prototype._markAsCoreError = function() {
    this._isCoreError = true;
};

Gridifier.CoreErrors.prototype._notDomElementError = function() {
    var a = this._error.getErrorMsgPrefix();
    a += "Can't get grid layout DOM element. Currently gridifier supports ";
    a += "native DOM elements, as well as jQuery objects. ";
    this._errorMsg = a;
};

Gridifier.CoreErrors.prototype._noConnectionsError = function() {
    var a = this._error.getErrorMsgPrefix();
    a += "Can't find any item, that was processed by Gridifier.";
    this._errorMsg = a;
};

Gridifier.CoreErrors.prototype._connectionByItemNotFoundError = function() {
    var a = this._error.getErrorMsgPrefix();
    var b = this._error.getErrorObjectParam();
    a += "Can't find connection by item.\n";
    a += "Item: \n" + b.item + "\n";
    a += "Connections:\n";
    for (var c = 0; c < b.connections.length; c++) a += b.connections[c] + "\n";
    this._errorMsg = a;
};

Gridifier.CoreErrors.prototype._wrongTargetTransformationSizesError = function() {
    var a = this._error.getErrorMsgPrefix();
    var b = this._error.getErrorParam();
    a += "Wrong target transformation sizes. 'transformSizes' and 'toggleSizes' functions accepts 4 types of values:\n";
    a += "    gridifier.transformSizes(item, '100px', '60%'); // px or % values\n";
    a += "    gridifier.transformSizes(item, 100, 200.5); // values without postfix will be parsed as px value.";
    a += "    gridifier.transformSizes(item, '*2', '/0.5'); // values with multiplication or division expressions.";
    this._errorMsg = a;
};

Gridifier.CoreErrors.prototype._wrongInsertBeforeTargetItem = function() {
    var a = this._error.getErrorMsgPrefix();
    var b = this._error.getErrorParam();
    a += "Wrong target item passed to the insertBefore function. It must be item, which was processed by gridifier. ";
    a += "Got: " + b + ".";
    this._errorMsg = a;
};

Gridifier.CoreErrors.prototype._wrongInsertAfterTargetItem = function() {
    var a = this._error.getErrorMsgPrefix();
    var b = this._error.getErrorParam();
    a += "Wrong target item passed to the insertAfter function. It must be item, which was processed by gridifier. ";
    a += "Got: " + b + ".";
    this._errorMsg = a;
};

Gridifier.CoreErrors.prototype._tooWideItemOnVerticalGridInsert = function() {
    var a = this._error.getErrorMsgPrefix();
    var b = this._error.getErrorParam();
    a += "Can't insert item '" + b + "'. Probably it has px based width and it's width is wider than grid width. ";
    a += "This can happen in such cases:\n";
    a += "    1. Px-width item is wider than grid from start.(Before attaching to gridifier)\n";
    a += "    2. Px-width item became wider than grid after grid resize.\n";
    a += "    3. Px-width item became wider after applying transform/toggle operation.\n";
    this._errorMsg = a;
};

Gridifier.CoreErrors.prototype._tooTallItemOnHorizontalGridInsert = function() {
    var a = this._error.getErrorMsgPrefix();
    var b = this._error.getErrorParam();
    a += "Can't insert item '" + b + "'. Probably it has px based height and it's height is taller than grid height. ";
    a += "This can happend in such cases:\n";
    a += "    1. Px-height item is taller than grid from start.(Before attaching to gridifier)\n";
    a += "    2. Px-height item became taller than grid after grid resize.\n";
    a += "    3. Px-height item became taller after applying transform/toggle operation.\n";
    this._errorMsg = a;
};