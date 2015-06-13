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

Gridifier.Collector = function(a, b, c) {
    var d = this;
    this._settings = null;
    this._grid = null;
    this._sizesResolverManager = null;
    this._collectorFunction = null;
    this._markingFunction = null;
    this._connectedItemMarker = null;
    this._css = {};
    this._construct = function() {
        d._settings = a;
        d._grid = b;
        d._sizesResolverManager = c;
        d._createCollectorFunction();
        d._createMarkingFunction();
        d._connectedItemMarker = new Gridifier.ConnectedItemMarker();
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        d._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.Collector.ITEM_SORTING_INDEX_DATA_ATTR = "data-gridifier-original-item-sorting-index";

Gridifier.Collector.RESTRICT_ITEM_COLLECT_DATA_ATTR = "data-gridifier-item-restrict-collect";

Gridifier.Collector.prototype._createCollectorFunction = function() {
    var a = this._settings.getGridItemMarkingType();
    var b = this;
    if (this._settings.isByClassGridItemMarkingStrategy()) {
        this._collectorFunction = function(c) {
            var d = Dom.get.byQuery(c, "." + a);
            return b.filterNotRestrictedToCollectItems(d);
        };
    } else if (this._settings.isByDataAttrGridItemMarkingStrategy()) {
        this._collectorFunction = function(c) {
            var d = Dom.get.byQuery(c, "[" + a + "]");
            return b.filterNotRestrictedToCollectItems(d);
        };
    } else if (this._settings.isByQueryGridItemMarkingStrategy()) {
        this._collectorFunction = function(c) {
            var d = Dom.get.byQuery(c, a);
            return b.filterNotRestrictedToCollectItems(d);
        };
    }
};

Gridifier.Collector.prototype._createMarkingFunction = function() {
    var a = this._settings.getGridItemMarkingType();
    if (this._settings.isByClassGridItemMarkingStrategy()) {
        this._markingFunction = function(b) {
            if (!Dom.css.hasClass(b, a)) Dom.css.addClass(b, a);
        };
    } else if (this._settings.isByDataAttrGridItemMarkingStrategy()) {
        this._markingFunction = function(b) {
            b.setAttribute(Gridifier.GRID_ITEM_MARKING_DEFAULTS.DATA_ATTR, a);
        };
    } else if (this._settings.isByQueryGridItemMarkingStrategy()) {
        this._markingFunction = function(a) {
        };
    }
};

Gridifier.Collector.prototype.attachToGrid = function(a) {
    if (!Dom.isArray(a)) var a = [ a ];
    for (var b = 0; b < a.length; b++) {
        if (!this._settings.shouldDisableItemHideOnGridAttach()) Dom.css.set(a[b], {
            visibility: "hidden"
        });
    }
    for (var b = 0; b < a.length; b++) this._markingFunction(a[b]);
};

Gridifier.Collector.prototype.ensureAllItemsAreAttachedToGrid = function(a) {
    for (var b = 0; b < a.length; b++) {
        if (!Dom.isChildOf(a[b], this._grid)) {
            new Gridifier.Error(Gridifier.Error.ERROR_TYPES.COLLECTOR.ITEM_NOT_ATTACHED_TO_GRID, a[b]);
        }
    }
};

Gridifier.Collector.prototype.ensureAllItemsAreConnectedToGrid = function(a) {
    for (var b = 0; b < a.length; b++) {
        if (!this._connectedItemMarker.isItemConnected(a[b])) {
            new Gridifier.Error(Gridifier.Error.ERROR_TYPES.COLLECTOR.ITEM_NOT_CONNECTED_TO_GRID, a[b]);
        }
    }
};

Gridifier.Collector.prototype._isItemWiderThanGridWidth = function(a) {
    return Math.floor(this._sizesResolverManager.outerWidth(a, true)) > this._sizesResolverManager.outerWidth(this._grid, false, true);
};

Gridifier.Collector.prototype._isItemTallerThanGridHeight = function(a) {
    return Math.floor(this._sizesResolverManager.outerHeight(a, true)) > this._sizesResolverManager.outerHeight(this._grid, false, true);
};

Gridifier.Collector.prototype.canItemBeAttachedToGrid = function(a) {
    if (this._settings.isVerticalGrid()) return !this._isItemWiderThanGridWidth(a); else if (this._settings.isHorizontalGrid()) return !this._isItemTallerThanGridHeight(a);
};

Gridifier.Collector.prototype.throwWrongItemSizesError = function(a) {
    if (this._settings.isVerticalGrid()) {
        var b = {
            item: a,
            itemWidth: this._sizesResolverManager.outerWidth(a, true),
            gridWidth: this._sizesResolverManager.outerWidth(this._grid, false, true)
        };
        var c = Gridifier.Error.ERROR_TYPES.COLLECTOR.ITEM_WIDER_THAN_GRID_WIDTH;
    } else if (this._settings.isHorizontalGrid()) {
        var b = {
            item: a,
            itemHeight: this._sizesResolverManager.outerHeight(a, true),
            gridHeight: this._sizesResolverManager.outerHeight(this._grid, false, true)
        };
        var c = Gridifier.Error.ERROR_TYPES.COLLECTOR.ITEM_TALLER_THAN_GRID_HEIGHT;
    }
    new Gridifier.Error(c, b);
};

Gridifier.Collector.prototype.ensureAllItemsCanBeAttachedToGrid = function(a) {
    for (var b = 0; b < a.length; b++) {
        if (!this.canItemBeAttachedToGrid(a[b])) {
            this.throwWrongItemSizesError(a[b]);
        }
    }
};

Gridifier.Collector.prototype.collect = function() {
    var a = this._collectorFunction(this._grid);
    return a;
};

Gridifier.Collector.prototype.collectByQuery = function(a) {
    var b = Dom.get.byQuery(this._grid, a);
    return this.filterNotRestrictedToCollectItems(b);
};

Gridifier.Collector.prototype.collectAllConnectedItems = function() {
    var a = this._collectorFunction(this._grid);
    var b = [];
    for (var c = 0; c < a.length; c++) {
        if (this._connectedItemMarker.isItemConnected(a[c])) b.push(a[c]);
    }
    return b;
};

Gridifier.Collector.prototype.collectAllDisconnectedItems = function() {
    var a = this._collectorFunction(this._grid);
    var b = [];
    for (var c = 0; c < a.length; c++) {
        if (!this._connectedItemMarker.isItemConnected(a[c])) b.push(a[c]);
    }
    return b;
};

Gridifier.Collector.prototype.toDOMCollection = function(a) {
    var b = function(a) {
        new Gridifier.Error(Gridifier.Error.ERROR_TYPES.COLLECTOR.NOT_DOM_ELEMENT, a);
    };
    if (Dom.isJqueryObject(a)) {
        var c = [];
        for (var d = 0; d < a.length; d++) c.push(a.get(d));
        return c;
    }
    if (Dom.isNativeDOMObject(a)) {
        var c = [];
        c.push(a);
        return c;
    }
    if (Dom.isArray(a)) {
        for (var d = 0; d < a.length; d++) {
            if (Dom.isJqueryObject(a[d])) a[d] = a[d].get(0);
            if (!Dom.isNativeDOMObject(a[d])) {
                b(a[d]);
            }
        }
        return a;
    } else {
        b(a);
    }
};

Gridifier.Collector.prototype.filterCollection = function(a) {
    var b = this._settings.getFilter();
    var c = a;
    for (var d = 0; d < b.length; d++) {
        var e = [];
        for (var f = 0; f < c.length; f++) {
            if (b[d](c[f])) {
                e.push(c[f]);
            }
        }
        c = e;
    }
    return c;
};

Gridifier.Collector.prototype.sortCollection = function(a) {
    var b = this._settings.getSortApi().getSortComparatorTools();
    var c = this._settings.getSort();
    b.saveOriginalOrder(a);
    a.sort(function(a, d) {
        return c(a, d, b);
    });
    b.flushOriginalOrder(a);
    return a;
};

Gridifier.Collector.prototype.filterNotRestrictedToCollectItems = function(a) {
    var b = [];
    for (var c = 0; c < a.length; c++) {
        if (Dom.hasAttribute(a[c], Gridifier.Collector.RESTRICT_ITEM_COLLECT_DATA_ATTR)) continue;
        b.push(a[c]);
    }
    return b;
};

Gridifier.Collector.prototype.markItemAsRestrictedToCollect = function(a) {
    a.setAttribute(Gridifier.Collector.RESTRICT_ITEM_COLLECT_DATA_ATTR, "restricted");
};

Gridifier.Collector.prototype.unmarkItemAsRestrictedToCollect = function(a) {
    if (Dom.hasAttribute(a, Gridifier.Collector.RESTRICT_ITEM_COLLECT_DATA_ATTR)) a.removeAttribute(Gridifier.Collector.RESTRICT_ITEM_COLLECT_DATA_ATTR);
};

Gridifier.Collector.prototype.isItemRestrictedToCollect = function(a) {
    return Dom.hasAttribute(a, Gridifier.Collector.RESTRICT_ITEM_COLLECT_DATA_ATTR);
};

Gridifier.Collector.prototype.filterOnlyConnectedItems = function(a) {
    var b = [];
    for (var c = 0; c < a.length; c++) {
        if (this._connectedItemMarker.isItemConnected(a[c])) b.push(a[c]);
    }
    return b;
};

Gridifier.Collector.prototype.filterOnlyNotConnectedItems = function(a) {
    var b = [];
    for (var c = 0; c < a.length; c++) {
        if (!this._connectedItemMarker.isItemConnected(a[c])) b.push(a[c]);
    }
    return b;
};

Gridifier.Collector.prototype.isItemConnected = function(a) {
    return this._connectedItemMarker.isItemConnected(a);
};