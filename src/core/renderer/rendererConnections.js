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

Gridifier.Renderer.Connections = function(a) {
    var b = this;
    this._settings = null;
    this._css = {};
    this._construct = function() {
        b._settings = a;
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        b._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.Renderer.Connections.CONNECTION_RENDERED_ITEM_DATA_CLASS = "gridifier-connection-rendered";

Gridifier.Renderer.Connections.prototype.isConnectionItemRendered = function(a) {
    return Dom.css.hasClass(a.item, Gridifier.Renderer.Connections.CONNECTION_RENDERED_ITEM_DATA_CLASS);
};

Gridifier.Renderer.Connections.prototype.markConnectionItemAsRendered = function(a) {
    Dom.css.addClass(a.item, Gridifier.Renderer.Connections.CONNECTION_RENDERED_ITEM_DATA_CLASS);
};

Gridifier.Renderer.Connections.prototype.unmarkConnectionItemAsRendered = function(a) {
    Dom.css.removeClass(a.item, Gridifier.Renderer.Connections.CONNECTION_RENDERED_ITEM_DATA_CLASS);
};

Gridifier.Renderer.Connections.prototype.getCssLeftPropertyValuePerConnection = function(a) {
    if (this._settings.isVerticalGrid()) {
        var b = a.x1 + "px";
    } else if (this._settings.isHorizontalGrid()) {
        if (this._settings.isDefaultIntersectionStrategy()) {
            var b = a.x1 + "px";
        } else if (this._settings.isNoIntersectionsStrategy()) {
            var b = a.x1 + a.horizontalOffset + "px";
        }
    }
    return b;
};

Gridifier.Renderer.Connections.prototype.getCssTopPropertyValuePerConnection = function(a) {
    if (this._settings.isVerticalGrid()) {
        if (this._settings.isDefaultIntersectionStrategy()) {
            var b = a.y1 + "px";
        } else if (this._settings.isNoIntersectionsStrategy()) {
            var b = a.y1 + a.verticalOffset + "px";
        }
    } else if (this._settings.isHorizontalGrid()) {
        var b = a.y1 + "px";
    }
    return b;
};