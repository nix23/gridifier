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

Gridifier.Dragifier.Renderer = function(a, b) {
    var c = this;
    this._settings = null;
    this._coordsChanger = null;
    this._css = {};
    this._construct = function() {
        c._settings = a;
        c._setRenderFunction();
        c._bindEvents();
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        c._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.Dragifier.Renderer.prototype._setRenderFunction = function() {
    this._coordsChanger = this._settings.getDraggableItemCoordsChanger();
};

Gridifier.Dragifier.Renderer.prototype.render = function(a, b, c) {
    this._coordsChanger(a, b, c);
};