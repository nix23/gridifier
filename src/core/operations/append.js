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

Gridifier.Operations.Append = function(a, b, c, d, e, f, g, h, i, j, k) {
    var l = this;
    this._gridSizesUpdater = null;
    this._collector = null;
    this._connections = null;
    this._connectionsSorter = null;
    this._guid = null;
    this._settings = null;
    this._appender = null;
    this._reversedAppender = null;
    this._sizesTransformer = null;
    this._sizesResolverManager = null;
    this._eventEmitter = null;
    this._css = {};
    this._construct = function() {
        l._gridSizesUpdater = a;
        l._collector = b;
        l._connections = c;
        l._connectionsSorter = d;
        l._guid = e;
        l._settings = f;
        l._appender = g;
        l._reversedAppender = h;
        l._sizesTransformer = i;
        l._sizesResolverManager = j;
        l._eventEmitter = k;
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        l._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.Operations.Append.prototype.execute = function(a) {
    var a = this._collector.filterOnlyNotConnectedItems(this._collector.toDOMCollection(a));
    if (a.length == 0) return;
    this._sizesResolverManager.startCachingTransaction();
    this._collector.ensureAllItemsAreAttachedToGrid(a);
    this._collector.ensureAllItemsCanBeAttachedToGrid(a);
    a = this._collector.filterCollection(a);
    a = this._collector.sortCollection(a);
    for (var b = 0; b < a.length; b++) {
        this._collector.unmarkItemAsRestrictedToCollect(a[b]);
        this._collector.attachToGrid(a[b]);
        this._guid.markNextAppendedItem(a[b]);
        this._append(a[b]);
    }
    this._sizesResolverManager.stopCachingTransaction();
    this._gridSizesUpdater.scheduleGridSizesUpdate();
    this._eventEmitter.emitInsertEvent(a);
};

Gridifier.Operations.Append.prototype._append = function(a) {
    if (this._settings.isDefaultAppend()) {
        this._appender.append(a);
    } else if (this._settings.isReversedAppend()) {
        this._reversedAppender.reversedAppend(a);
    }
};

Gridifier.Operations.Append.prototype.executeInsertBefore = function(a, b) {
    var a = this._collector.filterOnlyNotConnectedItems(this._collector.toDOMCollection(a));
    if (a.length == 0) return;
    var c = this._connections.get();
    if (c.length == 0) {
        this.execute(a);
        return;
    }
    var d = [];
    c = this._connectionsSorter.sortConnectionsPerReappend(c);
    if (typeof b == "undefined" || b == null) {
        var b = c[0].item;
    } else {
        var b = this._collector.toDOMCollection(b)[0];
        if (typeof b == "undefined" || b == null) var b = c[0].item;
    }
    var e = null;
    var f = false;
    for (var g = 0; g < c.length; g++) {
        if (this._guid.getItemGUID(c[g].item) == this._guid.getItemGUID(b)) {
            f = true;
            e = c[g].itemGUID;
            d = d.concat(c.splice(g, c.length - g));
            break;
        }
    }
    if (!f) {
        new Gridifier.Error(Gridifier.Error.ERROR_TYPES.APPENDER.WRONG_INSERT_BEFORE_TARGET_ITEM, b);
        return;
    }
    this._connections.reinitRanges();
    this._guid.reinitMaxGUID(e - 1);
    if (this._settings.isDefaultAppend()) this._appender.recreateConnectorsPerAllConnectedItems(); else if (this._settings.isReversedAppend()) this._reversedAppender.recreateConnectorsPerAllConnectedItems();
    this.execute(a);
    if (this._settings.isDisabledSortDispersion()) {
        this._connections.restore(d);
        this._connections.remapAllItemGUIDSInSortedConnections(d);
    } else if (this._settings.isCustomSortDispersion() || this._settings.isCustomAllEmptySpaceSortDispersion()) {
        this._connections.restoreOnCustomSortDispersionMode(d);
        this._connections.remapAllItemGUIDS();
    }
    this._sizesTransformer.retransformFrom(d[0]);
};

Gridifier.Operations.Append.prototype.executeInsertAfter = function(a, b) {
    var a = this._collector.filterOnlyNotConnectedItems(this._collector.toDOMCollection(a));
    if (a.length == 0) return;
    var c = this._connections.get();
    if (c.length == 0) {
        this.execute(a);
        return;
    }
    var d = [];
    c = this._connectionsSorter.sortConnectionsPerReappend(c);
    if (typeof b == "undefined" || b == null) {
        var b = c[c.length - 1].item;
    } else {
        var b = this._collector.toDOMCollection(b)[0];
        if (typeof b == "undefined" || b == null) var b = c[c.length - 1].item;
    }
    var e = null;
    var f = false;
    for (var g = 0; g < c.length; g++) {
        if (this._guid.getItemGUID(c[g].item) == this._guid.getItemGUID(b)) {
            f = true;
            e = c[g].itemGUID;
            d = d.concat(c.splice(g + 1, c.length - g - 1));
            break;
        }
    }
    if (!f) {
        new Gridifier.Error(Gridifier.Error.ERROR_TYPES.APPENDER.WRONG_INSERT_AFTER_TARGET_ITEM, b);
        return;
    }
    this._connections.reinitRanges();
    this._guid.reinitMaxGUID(e + 1);
    if (this._settings.isDefaultAppend()) this._appender.recreateConnectorsPerAllConnectedItems(); else if (this._settings.isReversedAppend()) this._reversedAppender.recreateConnectorsPerAllConnectedItems();
    this.execute(a);
    if (this._settings.isDisabledSortDispersion()) {
        this._connections.restore(d);
        this._connections.remapAllItemGUIDSInSortedConnections(d);
    } else if (this._settings.isCustomSortDispersion() || this._settings.isCustomAllEmptySpaceSortDispersion()) {
        this._connections.restoreOnCustomSortDispersionMode(d);
        this._connections.remapAllItemGUIDS();
    }
    if (d.length > 0) this._sizesTransformer.retransformFrom(d[0]);
};