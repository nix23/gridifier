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

Gridifier.VerticalGrid.ItemCoordsExtractor = function(a, b) {
    var c = this;
    this._gridifier = null;
    this._sizesResolverManager = null;
    this._transformedItemMarker = null;
    this._css = {};
    this._construct = function() {
        c._gridifier = a;
        c._sizesResolverManager = b;
        c._transformedItemMarker = new Gridifier.SizesTransformer.TransformedItemMarker();
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        c._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.VerticalGrid.ItemCoordsExtractor.prototype._getItemSizesPerAppend = function(a) {
    if (this._transformedItemMarker.isTransformedItem(a)) {
        var b = this._transformedItemMarker.getTransformedItemTargetPxSizes(a);
        return {
            targetWidth: parseFloat(b.targetPxWidth),
            targetHeight: parseFloat(b.targetPxHeight)
        };
    } else {
        return {
            targetWidth: this._sizesResolverManager.outerWidth(a, true),
            targetHeight: this._sizesResolverManager.outerHeight(a, true)
        };
    }
};

Gridifier.VerticalGrid.ItemCoordsExtractor.prototype.getItemTargetSizes = function(a) {
    return this._getItemSizesPerAppend(a);
};

Gridifier.VerticalGrid.ItemCoordsExtractor.prototype.connectorToAppendedItemCoords = function(a, b) {
    var c = this._getItemSizesPerAppend(a);
    return {
        x1: parseFloat(b.x - c.targetWidth + 1),
        x2: parseFloat(b.x),
        y1: parseFloat(b.y),
        y2: parseFloat(b.y + c.targetHeight - 1)
    };
};

Gridifier.VerticalGrid.ItemCoordsExtractor.prototype.connectorToReversedAppendedItemCoords = function(a, b) {
    var c = this._getItemSizesPerAppend(a);
    return {
        x1: parseFloat(b.x),
        x2: parseFloat(b.x + c.targetWidth - 1),
        y1: parseFloat(b.y),
        y2: parseFloat(b.y + c.targetHeight - 1)
    };
};

Gridifier.VerticalGrid.ItemCoordsExtractor.prototype.connectorToPrependedItemCoords = function(a, b) {
    var c = this._getItemSizesPerAppend(a);
    return {
        x1: parseFloat(b.x),
        x2: parseFloat(b.x + c.targetWidth - 1),
        y1: parseFloat(b.y - c.targetHeight + 1),
        y2: parseFloat(b.y)
    };
};

Gridifier.VerticalGrid.ItemCoordsExtractor.prototype.connectorToReversedPrependedItemCoords = function(a, b) {
    var c = this._getItemSizesPerAppend(a);
    return {
        x1: parseFloat(b.x - c.targetWidth + 1),
        x2: parseFloat(b.x),
        y1: parseFloat(b.y - c.targetHeight + 1),
        y2: parseFloat(b.y)
    };
};