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

Gridifier.Operations.Prepend = function(a, b, c, d, e, f, g, h) {
    var i = this;
    this._gridSizesUpdater = null;
    this._collector = null;
    this._guid = null;
    this._settings = null;
    this._prepender = null;
    this._reversedPrepender = null;
    this._sizesResolverManager = null;
    this._eventEmitter = null;
    this._css = {};
    this._construct = function() {
        i._gridSizesUpdater = a;
        i._collector = b;
        i._guid = c;
        i._settings = d;
        i._prepender = e;
        i._reversedPrepender = f;
        i._sizesResolverManager = g;
        i._eventEmitter = h;
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        i._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.Operations.Prepend.prototype.execute = function(a) {
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
        this._guid.markNextPrependedItem(a[b]);
        this._prepend(a[b]);
    }
    this._sizesResolverManager.stopCachingTransaction();
    this._gridSizesUpdater.scheduleGridSizesUpdate();
    this._eventEmitter.emitInsertEvent(a);
};

Gridifier.Operations.Prepend.prototype._prepend = function(a) {
    if (this._settings.isDefaultPrepend()) {
        this._prepender.prepend(a);
    } else if (this._settings.isReversedPrepend()) {
        this._reversedPrepender.reversedPrepend(a);
    }
};