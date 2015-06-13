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

Gridifier.SizesTransformer.ItemNewPxSizesFinder = function(a, b, c, d) {
    var e = this;
    e._gridifier = null;
    e._collector = null;
    e._connections = null;
    e._sizesResolverManager = null;
    this._css = {};
    this._construct = function() {
        e._gridifier = a;
        e._collector = b;
        e._connections = c;
        e._sizesResolverManager = d;
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        e._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.SizesTransformer.ItemNewPxSizesFinder.prototype.calculateNewPxSizesPerAllTransformedItems = function(a) {
    for (var b = 0; b < a.length; b++) {
        var c = this._calculateNewPxSizesPerConnectionItem(a[b].connectionToTransform.item, a[b].widthToTransform, a[b].heightToTransform, a[b].usePaddingBottomInsteadHeight);
        a[b].pxWidthToTransform = c.width;
        a[b].pxHeightToTransform = c.height;
    }
    return a;
};

Gridifier.SizesTransformer.ItemNewPxSizesFinder.prototype._calculateNewPxSizesPerConnectionItem = function(a, b, c, d) {
    var e = a.cloneNode();
    this._collector.markItemAsRestrictedToCollect(e);
    this._sizesResolverManager.unmarkAsCached(e);
    Dom.css.set(e, {
        position: "absolute",
        top: "0px",
        left: "-90000px",
        visibility: "hidden",
        width: b,
        height: d ? 0 : c
    });
    if (d) e.style.paddingBottom = c;
    this._gridifier.getGrid().appendChild(e);
    var f = {
        width: this._sizesResolverManager.outerWidth(e, true),
        height: this._sizesResolverManager.outerHeight(e, true)
    };
    this._gridifier.getGrid().removeChild(e);
    return f;
};