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

Gridifier.SizesTransformer.ItemNewRawSizesFinder = function(a) {
    var b = this;
    this._sizesResolverManager = null;
    this._css = {};
    this._construct = function() {
        b._sizesResolverManager = a;
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        b._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.SizesTransformer.ItemNewRawSizesFinder.TOGGLE_SIZES_TOGGLED_ITEM_SIZES_DATA_ATTR = "data-toggle-sizes-item-sizes-are-toggled";

Gridifier.SizesTransformer.ItemNewRawSizesFinder.TOGGLE_SIZES_TOGGLED_ITEM_SIZES_CLASS = "gridifier-toggled-item";

Gridifier.SizesTransformer.ItemNewRawSizesFinder.TOGGLE_SIZES_ORIGINAL_WIDTH_DATA_ATTR = "data-toggle-sizes-original-width";

Gridifier.SizesTransformer.ItemNewRawSizesFinder.TOGGLE_SIZES_ORIGINAL_HEIGHT_DATA_ATTR = "data-toggle-sizes-original-height";

Gridifier.SizesTransformer.ItemNewRawSizesFinder.EMPTY_DATA_ATTR_VALUE = "gridifier-data";

Gridifier.SizesTransformer.ItemNewRawSizesFinder.prototype.initConnectionTransform = function(a, b, c, d) {
    var e = {};
    var f = {
        width: 0,
        height: 1,
        paddingBottom: 2
    };
    var g = this;
    var h = function(b, c) {
        var d = new RegExp(/^\*(\d*\.?\d*)$/);
        var e = new RegExp(/^\/(\d*\.?\d*)$/);
        var h = new RegExp(/(^\d*\.?\d*)(px|%)$/);
        var i = new RegExp(/^\d*\.?\d*$/);
        if (typeof b != "undefined" && typeof b != "boolean" && typeof b != null) {
            var j = 0;
            if (b.search(",") !== -1) {
                var k = b.split(",");
                b = k[0];
                j = Dom.toInt(k[1]);
            }
            if (d.test(b)) {
                var l = g._getItemRawSize(a.item, c, f);
                var m = h.exec(l);
                var n = d.exec(b)[1];
                return m[1] * n + j + m[2];
            }
            if (e.test(b)) {
                var l = g._getItemRawSize(a.item, c, f);
                var m = h.exec(l);
                var o = e.exec(b)[1];
                return m[1] / o + j + m[2];
            }
            if (h.test(b)) return b;
            if (i.test(b)) return b + "px";
            new Gridifier.Error(Gridifier.Error.ERROR_TYPES.SIZES_TRANSFORMER.WRONG_TARGET_TRANSFORMATION_SIZES, b);
        }
        return g._getItemRawSize(a.item, c, f);
    };
    e.targetWidth = h(b, f.width);
    if (!d) e.targetHeight = h(c, f.height); else e.targetHeight = h(c, f.paddingBottom);
    return e;
};

Gridifier.SizesTransformer.ItemNewRawSizesFinder.prototype._getItemRawSize = function(a, b, c) {
    var d = SizesResolver.getComputedCSSWithMaybePercentageSizes(a);
    if (b == c.width) {
        if (SizesResolver.hasPercentageCSSValue("width", a, d)) return SizesResolver.getPercentageCSSValue("width", a, d); else return this._sizesResolverManager.outerWidth(a) + "px";
    } else if (b == c.height) {
        if (SizesResolver.hasPercentageCSSValue("height", a, d)) return SizesResolver.getPercentageCSSValue("height", a, d); else return this._sizesResolverManager.outerHeight(a) + "px";
    } else if (b == c.paddingBottom) {
        if (SizesResolver.hasPercentageCSSValue("paddingBottom", a, d)) return SizesResolver.getPercentageCSSValue("paddingBottom", a, d); else return d.paddingBottom;
    }
};

Gridifier.SizesTransformer.ItemNewRawSizesFinder.prototype.areConnectionSizesToggled = function(a) {
    var b = Gridifier.SizesTransformer.ItemNewRawSizesFinder;
    if (Dom.hasAttribute(a.item, b.TOGGLE_SIZES_TOGGLED_ITEM_SIZES_DATA_ATTR)) return true;
    return false;
};

Gridifier.SizesTransformer.ItemNewRawSizesFinder.prototype.getConnectionSizesPerUntoggle = function(a) {
    var b = Gridifier.SizesTransformer.ItemNewRawSizesFinder;
    var c = {};
    c.targetWidth = a.item.getAttribute(b.TOGGLE_SIZES_ORIGINAL_WIDTH_DATA_ATTR);
    c.targetHeight = a.item.getAttribute(b.TOGGLE_SIZES_ORIGINAL_HEIGHT_DATA_ATTR);
    return c;
};

Gridifier.SizesTransformer.ItemNewRawSizesFinder.prototype.markConnectionPerToggle = function(a, b) {
    var c = Gridifier.SizesTransformer.ItemNewRawSizesFinder;
    a.item.setAttribute(c.TOGGLE_SIZES_TOGGLED_ITEM_SIZES_DATA_ATTR, c.EMPTY_DATA_ATTR_VALUE);
    Dom.css.addClass(a.item, c.TOGGLE_SIZES_TOGGLED_ITEM_SIZES_CLASS);
    var d = {
        width: 0,
        height: 1,
        paddingBottom: 2
    };
    var e = this._getItemRawSize(a.item, d.width, d);
    if (!b) var f = this._getItemRawSize(a.item, d.height, d); else var f = this._getItemRawSize(a.item, d.paddingBottom, d);
    a.item.setAttribute(c.TOGGLE_SIZES_ORIGINAL_WIDTH_DATA_ATTR, e);
    a.item.setAttribute(c.TOGGLE_SIZES_ORIGINAL_HEIGHT_DATA_ATTR, f);
};

Gridifier.SizesTransformer.ItemNewRawSizesFinder.prototype.unmarkConnectionPerToggle = function(a) {
    var b = Gridifier.SizesTransformer.ItemNewRawSizesFinder;
    a.item.removeAttribute(b.TOGGLE_SIZES_TOGGLED_ITEM_SIZES_DATA_ATTR);
    a.item.removeAttribute(b.TOGGLE_SIZES_ORIGINAL_WIDTH_DATA_ATTR);
    a.item.removeAttribute(b.TOGGLE_SIZES_ORIGINAL_HEIGHT_DATA_ATTR);
    Dom.css.removeClass(a.item, b.TOGGLE_SIZES_TOGGLED_ITEM_SIZES_CLASS);
};