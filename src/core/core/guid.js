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

Gridifier.GUID = function() {
    var a = this;
    this._maxItemGUID = 9999;
    this._minItemGUID = 1e4;
    this._firstPrependedItemGUID = null;
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

Gridifier.GUID.GUID_DATA_ATTR = "data-gridifier-item-id";

Gridifier.GUID.prototype.reinit = function() {
    this._maxItemGUID = 9999;
    this._minItemGUID = 1e4;
};

Gridifier.GUID.prototype.reinitMaxGUID = function(a) {
    if (typeof a == "undefined" || a == null) this._maxItemGUID = 9999; else this._maxItemGUID = a;
};

Gridifier.GUID.prototype.getItemGUID = function(a) {
    return Dom.toInt(a.getAttribute(Gridifier.GUID.GUID_DATA_ATTR));
};

Gridifier.GUID.prototype.setItemGUID = function(a, b) {
    return a.setAttribute(Gridifier.GUID.GUID_DATA_ATTR, b);
};

Gridifier.GUID.prototype.removeItemGUID = function(a) {
    a.removeAttribute(Gridifier.GUID.GUID_DATA_ATTR);
};

Gridifier.GUID.prototype.markNextAppendedItem = function(a) {
    this._maxItemGUID++;
    a.setAttribute(Gridifier.GUID.GUID_DATA_ATTR, this._maxItemGUID);
    return this._maxItemGUID;
};

Gridifier.GUID.prototype.markNextPrependedItem = function(a) {
    this._minItemGUID--;
    a.setAttribute(Gridifier.GUID.GUID_DATA_ATTR, this._minItemGUID);
    return this._minItemGUID;
};

Gridifier.GUID.prototype.markAsPrependedItem = function(a) {
    if (this._firstPrependedItemGUID != null) return;
    this._firstPrependedItemGUID = a.getAttribute(Gridifier.GUID.GUID_DATA_ATTR);
};

Gridifier.GUID.prototype.unmarkAllPrependedItems = function() {
    this._firstPrependedItemGUID = null;
};

Gridifier.GUID.prototype.wasItemPrepended = function(a) {
    if (this._firstPrependedItemGUID == null) return false;
    return Dom.toInt(a) <= this._firstPrependedItemGUID;
};