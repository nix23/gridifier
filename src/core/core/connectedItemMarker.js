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

Gridifier.ConnectedItemMarker = function() {
    var a = this;
    this._css = {};
    this._construct = function() {};
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        a._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.ConnectedItemMarker.CONNECTED_ITEM_DATA_CLASS = "gridifier-connected-item";

Gridifier.ConnectedItemMarker.prototype.markItemAsConnected = function(a) {
    Dom.css.addClass(a, Gridifier.ConnectedItemMarker.CONNECTED_ITEM_DATA_CLASS);
};

Gridifier.ConnectedItemMarker.prototype.isItemConnected = function(a) {
    return Dom.css.hasClass(a, Gridifier.ConnectedItemMarker.CONNECTED_ITEM_DATA_CLASS);
};

Gridifier.ConnectedItemMarker.prototype.unmarkItemAsConnected = function(a) {
    Dom.css.removeClass(a, Gridifier.ConnectedItemMarker.CONNECTED_ITEM_DATA_CLASS);
};