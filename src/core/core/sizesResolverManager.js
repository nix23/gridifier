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

Gridifier.SizesResolverManager = function() {
    var a = this;
    this._outerWidthCache = [];
    this._outerHeightCache = [];
    this._nextCachedItemGUIDPerOuterWidth = 0;
    this._nextCachedItemGUIDPerOuterHeight = 0;
    this._isCachingTransactionActive = false;
    this._outerWidthAntialiasValue = 0;
    this._outerHeightAntialiasValue = 0;
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

Gridifier.SizesResolverManager.CACHED_PER_OUTERWIDTH_ITEM_GUID_DATA_ATTR = "data-gridifier-cached-per-outerwidth-guid";

Gridifier.SizesResolverManager.CACHED_PER_OUTERHEIGHT_ITEM_GUID_DATA_ATTR = "data-gridifier-cached-per-outerheight-guid";

Gridifier.SizesResolverManager.CACHED_PER_OUTERWIDTH_DATA_ATTR = "data-gridifier-cached-per-outerwidth";

Gridifier.SizesResolverManager.CACHED_PER_OUTERHEIGHT_DATA_ATTR = "data-gridifier-cached-per-outerheight";

Gridifier.SizesResolverManager.EMPTY_DATA_ATTR_VALUE = "gridifier-empty-data";

Gridifier.SizesResolverManager.prototype.setOuterWidthAntialiasValue = function(a) {
    this._outerWidthAntialiasValue = a;
};

Gridifier.SizesResolverManager.prototype.setOuterHeightAntialiasValue = function(a) {
    this._outerHeightAntialiasValue = a;
};

Gridifier.SizesResolverManager.prototype._markAsCachedPerOuterWidth = function(a, b) {
    a.setAttribute(Gridifier.SizesResolverManager.CACHED_PER_OUTERWIDTH_DATA_ATTR, Gridifier.SizesResolverManager.EMPTY_DATA_ATTR_VALUE);
    a.setAttribute(Gridifier.SizesResolverManager.CACHED_PER_OUTERWIDTH_ITEM_GUID_DATA_ATTR, b);
};

Gridifier.SizesResolverManager.prototype._markAsCachedPerOuterHeight = function(a, b) {
    a.setAttribute(Gridifier.SizesResolverManager.CACHED_PER_OUTERHEIGHT_DATA_ATTR, Gridifier.SizesResolverManager.EMPTY_DATA_ATTR_VALUE);
    a.setAttribute(Gridifier.SizesResolverManager.CACHED_PER_OUTERHEIGHT_ITEM_GUID_DATA_ATTR, b);
};

Gridifier.SizesResolverManager.prototype.unmarkAsCached = function(a) {
    if (Dom.hasAttribute(a, Gridifier.SizesResolverManager.CACHED_PER_OUTERWIDTH_DATA_ATTR)) a.removeAttribute(Gridifier.SizesResolverManager.CACHED_PER_OUTERWIDTH_DATA_ATTR);
    if (Dom.hasAttribute(a, Gridifier.SizesResolverManager.CACHED_PER_OUTERWIDTH_ITEM_GUID_DATA_ATTR)) a.removeAttribute(Gridifier.SizesResolverManager.CACHED_PER_OUTERWIDTH_ITEM_GUID_DATA_ATTR);
    if (Dom.hasAttribute(a, Gridifier.SizesResolverManager.CACHED_PER_OUTERHEIGHT_DATA_ATTR)) a.removeAttribute(Gridifier.SizesResolverManager.CACHED_PER_OUTERHEIGHT_DATA_ATTR);
    if (Dom.hasAttribute(a, Gridifier.SizesResolverManager.CACHED_PER_OUTERHEIGHT_ITEM_GUID_DATA_ATTR)) a.removeAttribute(Gridifier.SizesResolverManager.CACHED_PER_OUTERHEIGHT_ITEM_GUID_DATA_ATTR);
};

Gridifier.SizesResolverManager.prototype._getOuterWidthCachedItemEntry = function(a) {
    var b = Gridifier.SizesResolverManager.CACHED_PER_OUTERWIDTH_ITEM_GUID_DATA_ATTR;
    var c = a.getAttribute(b);
    for (var d = 0; d < this._outerWidthCache.length; d++) {
        if (parseInt(this._outerWidthCache[d].cachedItemGUID) == parseInt(c)) return this._outerWidthCache[d];
    }
};

Gridifier.SizesResolverManager.prototype._getOuterHeightCachedItemEntry = function(a) {
    var b = Gridifier.SizesResolverManager.CACHED_PER_OUTERHEIGHT_ITEM_GUID_DATA_ATTR;
    var c = a.getAttribute(b);
    for (var d = 0; d < this._outerHeightCache.length; d++) {
        if (parseInt(this._outerHeightCache[d].cachedItemGUID) == parseInt(c)) return this._outerHeightCache[d];
    }
};

Gridifier.SizesResolverManager.prototype._isOuterWidthCallWithSuchParamsCached = function(a, b) {
    if (!Dom.hasAttribute(a, Gridifier.SizesResolverManager.CACHED_PER_OUTERWIDTH_DATA_ATTR)) return false;
    var c = this._getOuterWidthCachedItemEntry(a);
    if (b) return c.cachedReturnedValues.withIncludeMarginsParam != null ? true : false; else return c.cachedReturnedValues.withoutIncludeMarginsParam != null ? true : false;
};

Gridifier.SizesResolverManager.prototype._isOuterHeightCallWithSuchParamsCached = function(a, b) {
    if (!Dom.hasAttribute(a, Gridifier.SizesResolverManager.CACHED_PER_OUTERHEIGHT_DATA_ATTR)) return false;
    var c = this._getOuterHeightCachedItemEntry(a);
    if (b) return c.cachedReturnedValues.withIncludeMarginsParam != null ? true : false; else return c.cachedReturnedValues.withoutIncludeMarginsParam ? true : false;
};

Gridifier.SizesResolverManager.prototype.startCachingTransaction = function() {
    this._isCachingTransactionActive = true;
};

Gridifier.SizesResolverManager.prototype.stopCachingTransaction = function() {
    this._isCachingTransactionActive = false;
    for (var a = 0; a < this._outerWidthCache.length; a++) this.unmarkAsCached(this._outerWidthCache[a].DOMElem);
    for (var a = 0; a < this._outerHeightCache.length; a++) this.unmarkAsCached(this._outerHeightCache[a].DOMElem);
    this._outerWidthCache = [];
    this._outerHeightCache = [];
    this._nextCachedItemGUIDPerOuterWidth = 0;
    this._nextCachedItemGUIDPerOuterHeight = 0;
};

Gridifier.SizesResolverManager.prototype.outerWidth = function(a, b, c, d, e, f) {
    var c = c || false;
    var f = f || false;
    if (!this._isCachingTransactionActive) {
        return this._callRealOuterWidth(a, b, c, d, e, f);
    }
    if (this._isOuterWidthCallWithSuchParamsCached(a, b)) {
        var g = this._getOuterWidthCachedItemEntry(a);
        if (b) return g.cachedReturnedValues.withIncludeMarginsParam; else return g.cachedReturnedValues.withoutIncludeMarginsParam;
    }
    var h = this._callRealOuterWidth(a, b, c, d, e, f);
    if (Dom.hasAttribute(a, Gridifier.SizesResolverManager.CACHED_PER_OUTERWIDTH_DATA_ATTR)) {
        var g = this._getOuterWidthCachedItemEntry(a);
        if (b) g.cachedReturnedValues.withIncludeMarginsParam = h; else g.cachedReturnedValues.withoutIncludeMarginsParam = h;
    } else {
        this._nextCachedItemGUIDPerOuterWidth++;
        this._markAsCachedPerOuterWidth(a, this._nextCachedItemGUIDPerOuterWidth);
        var i = {};
        i.withIncludeMarginsParam = b ? h : null;
        i.withoutIncludeMarginsParam = !b ? h : null;
        this._outerWidthCache.push({
            cachedItemGUID: this._nextCachedItemGUIDPerOuterWidth,
            DOMElem: a,
            cachedReturnedValues: i
        });
    }
    return h;
};

Gridifier.SizesResolverManager.prototype._callRealOuterWidth = function(a, b, c, d, e, f) {
    var g = this;
    var h = SizesResolver.recalculatePercentageWidthFunction;
    SizesResolver.recalculatePercentageWidthFunction = function(a, b, c, d) {
        return g.outerWidth(a, b, true, c, d, true);
    };
    if (!f) SizesResolver.clearRecursiveSubcallsData();
    var i = SizesResolver.outerWidth(a, b, d, e);
    if (!c) i -= this._outerWidthAntialiasValue;
    SizesResolver.recalculatePercentageWidthFunction = h;
    return i;
};

Gridifier.SizesResolverManager.prototype.outerHeight = function(a, b, c, d, e, f) {
    var c = c || false;
    var f = f || false;
    if (!this._isCachingTransactionActive) {
        return this._callRealOuterHeight(a, b, c, d, e, f);
    }
    if (this._isOuterHeightCallWithSuchParamsCached(a, b)) {
        var g = this._getOuterHeightCachedItemEntry(a);
        if (b) return g.cachedReturnedValues.withIncludeMarginsParam; else return g.cachedReturnedValues.withoutIncludeMarginsParam;
    }
    var h = this._callRealOuterHeight(a, b, c, d, e, f);
    if (Dom.hasAttribute(a, Gridifier.SizesResolverManager.CACHED_PER_OUTERHEIGHT_DATA_ATTR)) {
        var g = this._getOuterHeightCachedItemEntry(a);
        if (b) g.cachedReturnedValues.withIncludeMarginsParam = h; else g.cachedReturnedValues.withoutIncludeMarginsParam = h;
    } else {
        this._nextCachedItemGUIDPerOuterHeight++;
        this._markAsCachedPerOuterHeight(a, this._nextCachedItemGUIDPerOuterHeight);
        var i = {};
        i.withIncludeMarginsParam = b ? h : null;
        i.withoutIncludeMarginsParam = !b ? h : null;
        this._outerHeightCache.push({
            cachedItemGUID: this._nextCachedItemGUIDPerOuterHeight,
            DOMElem: a,
            cachedReturnedValues: i
        });
    }
    return h;
};

Gridifier.SizesResolverManager.prototype._callRealOuterHeight = function(a, b, c, d, e, f) {
    var g = this;
    var h = SizesResolver.recalculatePercentageWidthFunction;
    var i = SizesResolver.recalculatePercentageHeightFunction;
    SizesResolver.recalculatePercentageWidthFunction = function(a, b, c, d) {
        return g.outerWidth(a, b, true, c, d, true);
    };
    SizesResolver.recalculatePercentageHeightFunction = function(a, b, c, d) {
        return g.outerHeight(a, b, true, c, d, true);
    };
    if (!f) SizesResolver.clearRecursiveSubcallsData();
    var j = SizesResolver.outerHeight(a, b, d, e);
    if (!c) j -= this._outerHeightAntialiasValue;
    SizesResolver.recalculatePercentageWidthFunction = h;
    SizesResolver.recalculatePercentageHeightFunction = i;
    return j;
};

Gridifier.SizesResolverManager.prototype.positionTop = function(a) {
    return SizesResolver.positionTop(a);
};

Gridifier.SizesResolverManager.prototype.positionLeft = function(a) {
    return SizesResolver.positionLeft(a);
};

Gridifier.SizesResolverManager.prototype.offsetLeft = function(a, b) {
    var b = b || false;
    if (b) {
        var c = this.outerWidth(a);
        var d = this.outerWidth(a, true);
        var e = d - c;
        var f = e / 2;
        var g = SizesResolver.offsetLeft(a) - f;
    } else {
        var g = SizesResolver.offsetLeft(a);
    }
    return g;
};

Gridifier.SizesResolverManager.prototype.offsetTop = function(a, b) {
    var b = b || false;
    if (b) {
        var c = this.outerHeight(a);
        var d = this.outerHeight(a, true);
        var e = d - c;
        var f = e / 2;
        var g = SizesResolver.offsetTop(a) - f;
    } else {
        var g = SizesResolver.offsetTop(a);
    }
    return g;
};

Gridifier.SizesResolverManager.prototype.viewportWidth = function() {
    return document.documentElement.clientWidth;
};

Gridifier.SizesResolverManager.prototype.viewportHeight = function() {
    return document.documentElement.clientHeight;
};

Gridifier.SizesResolverManager.prototype.viewportScrollLeft = function() {
    return window.pageXOffset || document.documentElement.scrollLeft;
};

Gridifier.SizesResolverManager.prototype.viewportScrollTop = function() {
    return window.pageYOffset || document.documentElement.scrollTop;
};

Gridifier.SizesResolverManager.prototype.viewportDocumentCoords = function() {
    return {
        x1: this.viewportScrollLeft(),
        x2: this.viewportScrollLeft() + this.viewportWidth() - 1,
        y1: this.viewportScrollTop(),
        y2: this.viewportScrollTop() + this.viewportHeight() - 1
    };
};

Gridifier.SizesResolverManager.prototype.copyComputedStyle = function(a, b) {
    var c = this;
    var d = function(a, b) {
        SizesResolver.cloneComputedStyle(a, b);
        for (var e = 0; e < a.childNodes.length; e++) {
            if (a.childNodes[e].nodeType == 1) {
                d(a.childNodes[e], b.childNodes[e]);
                var f = SizesResolver.getComputedCSS(a.childNodes[e]);
                if (/.*px.*/.test(f.left)) b.childNodes[e].style.left = c.positionLeft(a.childNodes[e]) + "px";
                if (/.*px.*/.test(f.top)) b.childNodes[e].style.top = c.positionTop(a.childNodes[e]) + "px";
                var g = SizesResolver.getComputedCSSWithMaybePercentageSizes(a.childNodes[e]);
                b.childNodes[e].style.width = c.outerWidth(a.childNodes[e]) + "px";
                if (Dom.toInt(g.height) != 0) b.childNodes[e].style.height = c.outerHeight(a.childNodes[e]) + "px";
            }
        }
    };
    d(a, b);
};