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

Gridifier.TransformerConnectors = function(a, b, c, d, e, f, g, h, i, j, k, l) {
    var m = this;
    this._gridifier = null;
    this._settings = null;
    this._connectors = null;
    this._connections = null;
    this._guid = null;
    this._appender = null;
    this._reversedAppender = null;
    this._normalizer = null;
    this._sizesTransformer = null;
    this._connectorsCleaner = null;
    this._transformedItemMarker = null;
    this._itemsReappender = null;
    this._operation = null;
    this._css = {};
    this._construct = function() {
        m._gridifier = a;
        m._settings = b;
        m._connectors = c;
        m._connections = d;
        m._guid = e;
        m._appender = f;
        m._reversedAppender = g;
        m._normalizer = h;
        m._sizesTransformer = i;
        m._connectorsCleaner = j;
        m._transformedItemMarker = k;
        m._operation = l;
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        m._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.TransformerConnectors.prototype.setItemsReappenderInstance = function(a) {
    this._itemsReappender = a;
};

Gridifier.TransformerConnectors.prototype.recreateConnectorsPerFirstItemReappendOnTransform = function(a, b) {
    if (this._itemsReappender.isReversedAppendShouldBeUsedPerItemInsert(a)) {
        this._operation.setLastOperation(Gridifier.OPERATIONS.REVERSED_APPEND);
        this._recreateConnectorsPerReversedItemReappend(a, b);
    } else {
        this._operation.setLastOperation(Gridifier.OPERATIONS.APPEND);
        this._recreateConnectorsPerDefaultItemReappend(a, b);
    }
};

Gridifier.TransformerConnectors.prototype._recreateConnectorsPerReversedItemReappend = function(a, b) {
    this._connections.reinitRanges();
    this._reversedAppender.recreateConnectorsPerAllConnectedItems();
    if (this._settings.isVerticalGrid()) {
        this._connectorsCleaner.deleteAllIntersectedFromBottomConnectors();
    } else if (this._settings.isHorizontalGrid()) {
        this._connectorsCleaner.deleteAllIntersectedFromRightConnectors();
    }
};

Gridifier.TransformerConnectors.prototype._recreateConnectorsPerDefaultItemReappend = function(a, b) {
    this._connections.reinitRanges();
    this._appender.recreateConnectorsPerAllConnectedItems();
    if (this._settings.isVerticalGrid()) {
        this._connectorsCleaner.deleteAllIntersectedFromBottomConnectors();
    } else if (this._settings.isHorizontalGrid()) {
        this._connectorsCleaner.deleteAllIntersectedFromRightConnectors();
    }
};