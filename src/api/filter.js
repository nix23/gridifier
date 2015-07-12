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

/* You can define your custom filters in this class.
 * Read about custom builds at http://gridifier.io/essentials/install
 * Read about filters at http://gridifier.io/sortings/filters
 */
Gridifier.Api.Filter = function(settings, eventEmitter) {
    var me = this;

    this._settings = null;
    this._eventEmitter = null;

    this._filters = null;
    this._filterFunctions = {};

    this._css = {
    };

    this._construct = function() {
        me._settings = settings;
        me._eventEmitter = eventEmitter;

        me._filterFunctions = {};

        me._addAllFilter();
        // Call register function per each filter here
        // me._addCustomFilter();
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

Gridifier.Api.Filter.prototype.setFilterFunction = function(filterFunctionName) {
    if(!Dom.isArray(filterFunctionName))
        var filterFunctionNames = [filterFunctionName];
    else
        var filterFunctionNames = filterFunctionName;

    this._filters = [];
    for(var i = 0; i < filterFunctionNames.length; i++) {
        if(!this._filterFunctions.hasOwnProperty(filterFunctionNames[i])) {
            new Gridifier.Error(
                Gridifier.Error.ERROR_TYPES.SETTINGS.SET_FILTER_INVALID_PARAM,
                filterFunctionNames[i]
            );
            return;
        }

        this._filters.push(this._filterFunctions[filterFunctionNames[i]]);
    }
}

Gridifier.Api.Filter.prototype.addFilterFunction = function(filterFunctionName, filterFunction) {
    this._filterFunctions[filterFunctionName] = filterFunction;
}

Gridifier.Api.Filter.prototype.getFilterFunction = function() {
    return this._filters;
}

Gridifier.Api.Filter.prototype._addAllFilter = function() {
    this._filterFunctions.all = function(item) {
        return true;
    };
}

//Custom filter
//Gridifier.Api.Filter.prototype._addCustomFilter = function() {
//    this._filterFunctions.customFilter = function(item) {
//        return (show_item_conditions) ? true : false;
//    }
//}