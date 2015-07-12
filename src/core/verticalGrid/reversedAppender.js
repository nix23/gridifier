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

Gridifier.VerticalGrid.ReversedAppender = function(a, b, c, d, e, f, g, h, i) {
    var j = this;
    this._gridifier = null;
    this._settings = null;
    this._sizesResolverManager = null;
    this._guid = null;
    this._renderer = null;
    this._normalizer = null;
    this._operation = null;
    this._connectors = null;
    this._connections = null;
    this._connectorsCleaner = null;
    this._connectorsShifter = null;
    this._connectorsSelector = null;
    this._connectorsSorter = null;
    this._itemCoordsExtractor = null;
    this._connectionsIntersector = null;
    this._css = {};
    this._construct = function() {
        j._gridifier = a;
        j._settings = b;
        j._sizesResolverManager = c;
        j._guid = f;
        j._renderer = g;
        j._normalizer = h;
        j._operation = i;
        j._connectors = d;
        j._connections = e;
        j._connectorsCleaner = new Gridifier.VerticalGrid.ConnectorsCleaner(j._connectors, j._connections, j._settings);
        j._connectorsShifter = new Gridifier.ConnectorsShifter(j._gridifier, j._connections, j._settings);
        j._connectorsSelector = new Gridifier.VerticalGrid.ConnectorsSelector(j._guid);
        j._connectorsSorter = new Gridifier.VerticalGrid.ConnectorsSorter();
        j._itemCoordsExtractor = new Gridifier.VerticalGrid.ItemCoordsExtractor(j._gridifier, j._sizesResolverManager);
        j._connectionsIntersector = new Gridifier.VerticalGrid.ConnectionsIntersector(j._connections);
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        j._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.VerticalGrid.ReversedAppender.prototype.reversedAppend = function(a) {
    this._initConnectors();
    var b = this._createConnectionPerItem(a);
    this._connections.attachConnectionToRanges(b);
    this._connectorsCleaner.deleteAllTooHighConnectorsFromMostBottomConnector();
    this._connectorsCleaner.deleteAllIntersectedFromBottomConnectors();
    if (this._settings.isDefaultIntersectionStrategy()) this._renderer.showConnections(b); else if (this._settings.isNoIntersectionsStrategy()) {
        var c = this._connections.getLastRowVerticallyExpandedConnections();
        for (var d = 0; d < c.length; d++) {
            if (c[d].itemGUID == b.itemGUID) {
                c.splice(d, 1);
                d--;
            }
        }
        this._renderer.renderConnectionsAfterDelay(c);
        this._renderer.showConnections(b);
    }
};

Gridifier.VerticalGrid.ReversedAppender.prototype._initConnectors = function() {
    if (this._operation.isInitialOperation(Gridifier.OPERATIONS.REVERSED_APPEND)) {
        this.createInitialConnector();
        return;
    }
    if (!this._operation.isCurrentOperationSameAsPrevious(Gridifier.OPERATIONS.REVERSED_APPEND)) {
        this.recreateConnectorsPerAllConnectedItems();
        this._connectorsCleaner.deleteAllIntersectedFromBottomConnectors();
        this._connectorsCleaner.deleteAllTooHighConnectorsFromMostBottomConnector();
    }
};

Gridifier.VerticalGrid.ReversedAppender.prototype.createInitialConnector = function() {
    this._connectors.addAppendConnector(Gridifier.Connectors.SIDES.RIGHT.TOP, 0, 0);
};

Gridifier.VerticalGrid.ReversedAppender.prototype.recreateConnectorsPerAllConnectedItems = function(a) {
    var a = a || false;
    if (!a) this._connectors.flush();
    var b = this._connections.get();
    for (var c = 0; c < b.length; c++) {
        this._addItemConnectors(b[c], b[c].itemGUID);
    }
    if (this._connectors.count() == 0) this.createInitialConnector();
};

Gridifier.VerticalGrid.ReversedAppender.prototype._addItemConnectors = function(a, b) {
    if (a.x2 + 1 <= this._gridifier.getGridX2()) {
        this._connectors.addAppendConnector(Gridifier.Connectors.SIDES.RIGHT.TOP, parseFloat(a.x2 + 1), parseFloat(a.y1), Dom.toInt(b));
    }
    this._connectors.addAppendConnector(Gridifier.Connectors.SIDES.BOTTOM.LEFT, parseFloat(a.x1), parseFloat(a.y2 + 1), Dom.toInt(b));
};

Gridifier.VerticalGrid.ReversedAppender.prototype._createConnectionPerItem = function(a) {
    var b = this._filterConnectorsPerNextConnection();
    var c = this._findItemConnectionCoords(a, b);
    var d = this._connections.add(a, c);
    if (this._settings.isNoIntersectionsStrategy()) {
        this._connections.expandVerticallyAllRowConnectionsToMostTall(d);
    }
    this._addItemConnectors(c, this._guid.getItemGUID(a));
    return d;
};

Gridifier.VerticalGrid.ReversedAppender.prototype._filterConnectorsPerNextConnection = function() {
    var a = this._connectors.getClone();
    this._connectorsSelector.attachConnectors(a);
    this._connectorsSelector.selectOnlySpecifiedSideConnectorsOnPrependedItems(Gridifier.Connectors.SIDES.BOTTOM.LEFT);
    a = this._connectorsSelector.getSelectedConnectors();
    if (this._settings.isDefaultIntersectionStrategy()) {
        this._connectorsShifter.attachConnectors(a);
        this._connectorsShifter.shiftAllConnectors();
        a = this._connectorsShifter.getAllConnectors();
    } else if (this._settings.isNoIntersectionsStrategy()) {
        var b = Gridifier.Connectors.SIDES.BOTTOM.LEFT;
        this._connectorsSelector.attachConnectors(a);
        this._connectorsSelector.selectOnlyMostBottomConnectorFromSide(b);
        a = this._connectorsSelector.getSelectedConnectors();
        this._connectorsShifter.attachConnectors(a);
        this._connectorsShifter.shiftAllWithSpecifiedSideToLeftGridCorner(b);
        a = this._connectorsShifter.getAllConnectors();
    }
    this._connectorsSorter.attachConnectors(a);
    this._connectorsSorter.sortConnectorsForAppend(Gridifier.APPEND_TYPES.REVERSED_APPEND);
    return this._connectorsSorter.getConnectors();
};

Gridifier.VerticalGrid.ReversedAppender.prototype._findItemConnectionCoords = function(a, b) {
    var c = null;
    for (var d = 0; d < b.length; d++) {
        var e = this._itemCoordsExtractor.connectorToReversedAppendedItemCoords(a, b[d]);
        if (e.x2 > this._normalizer.normalizeHighRounding(this._gridifier.getGridX2())) {
            continue;
        }
        var f = this._connectionsIntersector.findAllMaybeIntersectableConnectionsOnAppend(b[d]);
        if (this._connectionsIntersector.isIntersectingAnyConnection(f, e)) {
            continue;
        }
        c = e;
        var g = this._connections.getAllConnectionsBelowY(e.y2);
        if (this._connections.isAnyConnectionItemGUIDSmallerThan(g, a)) {
            continue;
        }
        if (this._settings.isNoIntersectionsStrategy()) {
            if (this._connections.isIntersectingMoreThanOneConnectionItemVertically(c)) {
                c = null;
            }
        }
        if (c != null) {
            break;
        }
    }
    if (c == null) {
        var h = Gridifier.Error.ERROR_TYPES.INSERTER.TOO_WIDE_ITEM_ON_VERTICAL_GRID_INSERT;
        new Gridifier.Error(h, a);
    }
    return c;
};