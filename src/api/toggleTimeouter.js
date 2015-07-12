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

Gridifier.Api.ToggleTimeouter = function() {
    var me = this;

    this._css = {
    };

    this._toggleTimeouts = {};
    this._nextToggleTimeouterItemId = 0;

    this._construct = function() {
        me._toggleTimeouts = {};
        me._nextToggleTimeouterItemId = 0;
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

Gridifier.Api.ToggleTimeouter.TOGGLE_TIMEOUTER_ITEM_ID_DATA_ATTR = "data-gridifier-toggle-timeouter-id";

Gridifier.Api.ToggleTimeouter.prototype._markItemWithToggleTimeouterId = function(item) {
    this._nextToggleTimeouterItemId++;
    item.setAttribute(
        Gridifier.Api.ToggleTimeouter.TOGGLE_TIMEOUTER_ITEM_ID_DATA_ATTR,
        this._nextToggleTimeouterItemId
    );
}

Gridifier.Api.ToggleTimeouter.prototype._isItemMarkedWithToggleTimeouterId = function(item) {
    return Dom.hasAttribute(
        item,
        Gridifier.Api.ToggleTimeouter.TOGGLE_TIMEOUTER_ITEM_ID_DATA_ATTR
    );
}

Gridifier.Api.ToggleTimeouter.prototype._getToggleTimeouterItemId = function(item) {
    if(this._isItemMarkedWithToggleTimeouterId(item))
        return item.getAttribute(Gridifier.Api.ToggleTimeouter.TOGGLE_TIMEOUTER_ITEM_ID_DATA_ATTR);

    this._markItemWithToggleTimeouterId(item);
    return item.getAttribute(Gridifier.Api.ToggleTimeouter.TOGGLE_TIMEOUTER_ITEM_ID_DATA_ATTR);
}

Gridifier.Api.ToggleTimeouter.prototype.add = function(item, timeoutHandle) {
    var itemGUID = this._getToggleTimeouterItemId(item);

    if(!this._toggleTimeouts.hasOwnProperty(itemGUID))
        this._toggleTimeouts[itemGUID] = [];

    this._toggleTimeouts[itemGUID].push(timeoutHandle);
}

Gridifier.Api.ToggleTimeouter.prototype.flush = function(item) {
    var itemGUID = this._getToggleTimeouterItemId(item);

    if(this._toggleTimeouts.hasOwnProperty(itemGUID)) {
        for(var i = 0; i < this._toggleTimeouts[itemGUID].length; i++) {
            clearTimeout(this._toggleTimeouts[itemGUID][i]);
        }

        this._toggleTimeouts[itemGUID] = [];
    }
}