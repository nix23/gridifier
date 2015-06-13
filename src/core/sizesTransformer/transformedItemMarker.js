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

Gridifier.SizesTransformer.TransformedItemMarker = function() {
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

Gridifier.SizesTransformer.TransformedItemMarker.TRANSFORMED_ITEM_DATA_ATTR = "data-transformed-item";

Gridifier.SizesTransformer.TransformedItemMarker.DEPENDED_ITEM_DATA_ATTR = "data-depended-item";

Gridifier.SizesTransformer.TransformedItemMarker.TRANSFORMER_EMPTY_DATA_ATTR_VALUE = "gridifier-data";

Gridifier.SizesTransformer.TransformedItemMarker.TRANSFORMED_ITEM_RAW_TARGET_WIDTH_DATA_ATTR = "data-transformed-item-raw-target-width";

Gridifier.SizesTransformer.TransformedItemMarker.TRANSFORMED_ITEM_RAW_TARGET_HEIGHT_DATA_ATTR = "data-transformed-item-raw-target-height";

Gridifier.SizesTransformer.TransformedItemMarker.TRANSFORMED_ITEM_PX_TARGET_WIDTH_DATA_ATTR = "data-transformed-item-px-target-width";

Gridifier.SizesTransformer.TransformedItemMarker.TRANSFORMED_ITEM_PX_TARGET_HEIGHT_DATA_ATTR = "data-transformed-item-px-target-height";

Gridifier.SizesTransformer.TransformedItemMarker.prototype.markEachConnectionItemWithTransformData = function(a) {
    var b = Gridifier.SizesTransformer.TransformedItemMarker;
    for (var c = 0; c < a.length; c++) {
        var d = a[c].connectionToTransform.item;
        d.setAttribute(b.TRANSFORMED_ITEM_DATA_ATTR, b.TRANSFORMER_EMPTY_DATA_ATTR_VALUE);
        d.setAttribute(b.TRANSFORMED_ITEM_RAW_TARGET_WIDTH_DATA_ATTR, a[c].widthToTransform);
        d.setAttribute(b.TRANSFORMED_ITEM_RAW_TARGET_HEIGHT_DATA_ATTR, a[c].heightToTransform);
        d.setAttribute(b.TRANSFORMED_ITEM_PX_TARGET_WIDTH_DATA_ATTR, a[c].pxWidthToTransform);
        d.setAttribute(b.TRANSFORMED_ITEM_PX_TARGET_HEIGHT_DATA_ATTR, a[c].pxHeightToTransform);
    }
};

Gridifier.SizesTransformer.TransformedItemMarker.prototype.isTransformedItem = function(a) {
    return Dom.hasAttribute(a, Gridifier.SizesTransformer.TransformedItemMarker.TRANSFORMED_ITEM_DATA_ATTR);
};

Gridifier.SizesTransformer.TransformedItemMarker.prototype.unmarkItemAsTransformed = function(a) {
    a.removeAttribute(Gridifier.SizesTransformer.TransformedItemMarker.TRANSFORMED_ITEM_DATA_ATTR);
    a.removeAttribute(Gridifier.SizesTransformer.TransformedItemMarker.TRANSFORMED_ITEM_RAW_TARGET_WIDTH_DATA_ATTR);
    a.removeAttribute(Gridifier.SizesTransformer.TransformedItemMarker.TRANSFORMED_ITEM_RAW_TARGET_HEIGHT_DATA_ATTR);
    a.removeAttribute(Gridifier.SizesTransformer.TransformedItemMarker.TRANSFORMED_ITEM_PX_TARGET_WIDTH_DATA_ATTR);
    a.removeAttribute(Gridifier.SizesTransformer.TransformedItemMarker.TRANSFORMED_ITEM_PX_TARGET_HEIGHT_DATA_ATTR);
};

Gridifier.SizesTransformer.TransformedItemMarker.prototype.getTransformedItemTargetRawSizes = function(a) {
    var b = Gridifier.SizesTransformer.TransformedItemMarker;
    return {
        targetRawWidth: a.getAttribute(b.TRANSFORMED_ITEM_RAW_TARGET_WIDTH_DATA_ATTR),
        targetRawHeight: a.getAttribute(b.TRANSFORMED_ITEM_RAW_TARGET_HEIGHT_DATA_ATTR)
    };
};

Gridifier.SizesTransformer.TransformedItemMarker.prototype.getTransformedItemTargetPxSizes = function(a) {
    var b = Gridifier.SizesTransformer.TransformedItemMarker;
    return {
        targetPxWidth: parseFloat(a.getAttribute(b.TRANSFORMED_ITEM_PX_TARGET_WIDTH_DATA_ATTR)),
        targetPxHeight: parseFloat(a.getAttribute(b.TRANSFORMED_ITEM_PX_TARGET_HEIGHT_DATA_ATTR))
    };
};

Gridifier.SizesTransformer.TransformedItemMarker.prototype.markAllTransformDependedItems = function(a) {
    for (var b = 0; b < a.length; b++) {
        if (this.isTransformedItem(a[b])) continue;
        a[b].setAttribute(Gridifier.SizesTransformer.TransformedItemMarker.DEPENDED_ITEM_DATA_ATTR, Gridifier.SizesTransformer.TransformedItemMarker.TRANSFORMER_EMPTY_DATA_ATTR_VALUE);
    }
};

Gridifier.SizesTransformer.TransformedItemMarker.prototype.isDependedItem = function(a) {
    return Dom.hasAttribute(a, Gridifier.SizesTransformer.TransformedItemMarker.DEPENDED_ITEM_DATA_ATTR);
};

Gridifier.SizesTransformer.TransformedItemMarker.prototype.unmarkItemAsDepended = function(a) {
    a.removeAttribute(Gridifier.SizesTransformer.TransformedItemMarker.DEPENDED_ITEM_DATA_ATTR);
};