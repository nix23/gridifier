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

Gridifier.SizesTransformer.EmptySpaceNormalizer = function(a, b, c) {
    var d = this;
    this._connections = null;
    this._connectors = null;
    this._settings = null;
    this._css = {};
    this._construct = function() {
        d._connections = a;
        d._connectors = b;
        d._settings = c;
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        d._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.SizesTransformer.EmptySpaceNormalizer.prototype.normalizeFreeSpace = function() {
    if (this._settings.isVerticalGrid()) this._applyNoIntersectionsStrategyTopFreeSpaceFixOnPrependedItemTransform(); else if (this._settings.isHorizontalGrid()) this._applyNoIntersectionsStrategyLeftFreeSpaceFixOnPrependedItemTransform();
};

Gridifier.SizesTransformer.EmptySpaceNormalizer.prototype._applyNoIntersectionsStrategyTopFreeSpaceFixOnPrependedItemTransform = function() {
    var a = this._connections.get();
    for (var b = 0; b < a.length; b++) {
        if (a[b].y1 == 0) return;
    }
    var c = null;
    for (var b = 0; b < a.length; b++) {
        if (c == null) c = a[b].y1; else {
            if (a[b].y1 < c) c = a[b].y1;
        }
    }
    var d = c;
    for (var b = 0; b < a.length; b++) {
        a[b].y1 -= d;
        a[b].y2 -= d;
    }
};

Gridifier.SizesTransformer.EmptySpaceNormalizer.prototype._applyNoIntersectionsStrategyLeftFreeSpaceFixOnPrependedItemTransform = function() {
};