/* Gridifier v2.~.~ source file for custom build.
 * Async Responsive HTML Grids
 * http://gridifier.io
 * 
 * Gridifier is dual-licensed:
 *   Non-commercial license - https://creativecommons.org/licenses/by-nc-sa/4.0/.
 *   Commercial license - http://gridifier.io/license (Commercial license).
 * Read http://gridifier.io/license for details.
 * Copyright 2015 nTech
 */

var SizesResolverManager = function() {
    this._owCache = [];
    this._ohCache = [];
    this._nextOwGUID = 0;
    this._nextOhGUID = 0;
    this._isActive = false;
    this._owAntialias = 0;
    this._ohAntialias = 0;
};

proto(SizesResolverManager, {
    setOuterWidthAntialiasValue: function(a) {
        this._owAntialias = a;
    },
    setOuterHeightAntialiasValue: function(a) {
        this._ohAntialias = a;
    },
    _markAsCachedPerOw: function(a, b) {
        Dom.set(a, [ [ C.SRM.CACHED_PER_OW_DATA, C.SRM.EMPTY_DATA ], [ C.SRM.CACHED_PER_OW_ITEM_GUID_DATA, b ] ]);
    },
    _markAsCachedPerOh: function(a, b) {
        Dom.set(a, [ [ C.SRM.CACHED_PER_OH_DATA, C.SRM.EMPTY_DATA ], [ C.SRM.CACHED_PER_OH_ITEM_GUID_DATA, b ] ]);
    },
    unmarkAsCached: function(a) {
        Dom.rmIfHas(a, [ C.SRM.CACHED_PER_OW_DATA, C.SRM.CACHED_PER_OW_ITEM_GUID_DATA, C.SRM.CACHED_PER_OH_DATA, C.SRM.CACHED_PER_OH_ITEM_GUID_DATA ]);
    },
    _getCachedItemEntry: function(a, b, c) {
        for (var d = 0; d < b.length; d++) {
            if (parseInt(b[d].GUID) == parseInt(c)) return b[d];
        }
    },
    _getOwCachedItemEntry: function(a) {
        return this._getCachedItemEntry(a, this._owCache, Dom.get(a, C.SRM.CACHED_PER_OW_ITEM_GUID_DATA));
    },
    _getOhCachedItemEntry: function(a) {
        return this._getCachedItemEntry(a, this._ohCache, Dom.get(a, C.SRM.CACHED_PER_OH_ITEM_GUID_DATA));
    },
    _isCallCached: function(a, b, c, d) {
        if (!Dom.has(a, c)) return false;
        var e = d(a);
        if (b) return e.cachedCalls.withMargins != null; else return e.cachedCalls.withoutMargins != null;
    },
    _isOwCallCached: function(a, b) {
        var c = this;
        return this._isCallCached(a, b, C.SRM.CACHED_PER_OW_DATA, function(a) {
            return c._getOwCachedItemEntry(a);
        });
    },
    _isOhCallCached: function(a, b) {
        var c = this;
        return this._isCallCached(a, b, C.SRM.CACHED_PER_OH_DATA, function(a) {
            return c._getOhCachedItemEntry(a);
        });
    },
    startCachingTransaction: function() {
        this._isActive = true;
    },
    stopCachingTransaction: function() {
        this._isActive = false;
        for (var a = 0; a < this._owCache.length; a++) this.unmarkAsCached(this._owCache[a].item);
        for (var a = 0; a < this._ohCache.length; a++) this.unmarkAsCached(this._ohCache[a].item);
        this._owCache = [];
        this._ohCache = [];
        this._nextOwGUID = 0;
        this._nextOhGUID = 0;
    },
    _callRealOuter: function(a, b, c, d, e, f, g) {
        var h = this;
        var g = g || false;
        var i = SizesResolver.recalcPtWidthFn;
        var j = SizesResolver.recalcPtHeightFn;
        var k = function(a) {
            return function(b, c, d, e) {
                return h[a](b, c, true, d, e, true);
            };
        };
        SizesResolver.recalcPtWidthFn = k("outerWidth");
        SizesResolver.recalcPtHeightFn = k("outerHeight");
        if (!f) SizesResolver.clearRecursiveSubcallsData();
        var l = !g ? "outerWidth" : "outerHeight";
        var m = SizesResolver[l](a, b, d, e);
        if (!c) m -= !g ? this._owAntialias : this._ohAntialias;
        SizesResolver.recalcPtWidthFn = i;
        SizesResolver.recalcPtHeightFn = j;
        return m;
    },
    _callRealOw: function(a, b, c, d, e, f) {
        return this._callRealOuter(a, b, c, d, e, f);
    },
    _callRealOh: function(a, b, c, d, e, f) {
        return this._callRealOuter(a, b, c, d, e, f, true);
    },
    _outer: function(a, b, c, d, e, f, g) {
        var h = arguments;
        var g = g || false;
        h[2] = h[2] || false;
        h[5] = h[5] || false;
        if (!this._isActive) return !g ? this._callRealOw.apply(this, h) : this._callRealOh.apply(this, h);
        var i = null;
        if (!g && this._isOwCallCached(a, b)) i = this._getOwCachedItemEntry(a); else if (g && this._isOhCallCached(a, b)) i = this._getOhCachedItemEntry(a);
        if (i != null) {
            var j = i.cachedCalls;
            return b ? j.withMargins : j.withoutMargins;
        }
        var k = !g ? this._callRealOw.apply(this, h) : this._callRealOh.apply(this, h);
        if (!g && Dom.has(a, C.SRM.CACHED_PER_OW_DATA) || g && Dom.has(a, C.SRM.CACHED_PER_OH_DATA)) {
            var i = !g ? this._getOwCachedItemEntry(a) : this._getOhCachedItemEntry(a);
            if (b) i.cachedCalls.withMargins = k; else i.cachedCalls.withoutMargins = k;
        } else {
            if (!g) this._markAsCachedPerOw(a, ++this._nextOwGUID); else this._markAsCachedPerOh(a, ++this._nextOhGUID);
            var l = {
                withMargins: b ? k : null,
                withoutMargins: !b ? k : null
            };
            var m = !g ? this._owCache : this._ohCache;
            m.push({
                GUID: !g ? this._nextOwGUID : this._nextOhGUID,
                item: a,
                cachedCalls: l
            });
        }
        return k;
    },
    outerWidth: function(a, b, c, d, e, f) {
        return this._outer(a, b, c, d, e, f);
    },
    outerHeight: function(a, b, c, d, e, f) {
        return this._outer(a, b, c, d, e, f, true);
    },
    positionTop: function(a) {
        return SizesResolver.positionTop(a);
    },
    positionLeft: function(a) {
        return SizesResolver.positionLeft(a);
    },
    _offset: function(a, b, c, d) {
        var b = b || false;
        if (b) {
            var e = this[c](a);
            var f = this[c](a, true);
            var g = f - e;
            var h = g / 2;
            var i = SizesResolver[d](a) - h;
        } else var i = SizesResolver[d](a);
        return i;
    },
    offsetLeft: function(a, b) {
        return this._offset(a, b, "outerWidth", "offsetLeft");
    },
    offsetTop: function(a, b) {
        return this._offset(a, b, "outerHeight", "offsetTop");
    },
    viewportWidth: function() {
        return document.documentElement.clientWidth;
    },
    viewportHeight: function() {
        return document.documentElement.clientHeight;
    },
    viewportScrollLeft: function() {
        return window.pageXOffset || document.documentElement.scrollLeft;
    },
    viewportScrollTop: function() {
        return window.pageYOffset || document.documentElement.scrollTop;
    },
    viewportDocumentCoords: function() {
        return {
            x1: this.viewportScrollLeft(),
            x2: this.viewportScrollLeft() + this.viewportWidth() - 1,
            y1: this.viewportScrollTop(),
            y2: this.viewportScrollTop() + this.viewportHeight() - 1
        };
    },
    itemSizes: function(a) {
        return {
            width: this.outerWidth(a, true),
            height: this.outerHeight(a, true)
        };
    },
    copyComputedStyle: function(a, b) {
        var c = this;
        var d = function(a, b) {
            SizesResolver.cloneComputedStyle(a, b);
            for (var e = 0; e < a.childNodes.length; e++) {
                if (a.childNodes[e].nodeType == 1) {
                    d(a.childNodes[e], b.childNodes[e]);
                    var f = SizesResolver.getComputedCSS(a.childNodes[e]);
                    if (/.*px.*/.test(f.left)) b.childNodes[e].style.left = c.positionLeft(a.childNodes[e]) + "px";
                    if (/.*px.*/.test(f.top)) b.childNodes[e].style.top = c.positionTop(a.childNodes[e]) + "px";
                    var g = SizesResolver.getUncomputedCSS(a.childNodes[e]);
                    b.childNodes[e].style.width = c.outerWidth(a.childNodes[e]) + "px";
                    if (Dom.int(g.height) != 0) b.childNodes[e].style.height = c.outerHeight(a.childNodes[e]) + "px";
                }
            }
        };
        d(a, b);
    }
});