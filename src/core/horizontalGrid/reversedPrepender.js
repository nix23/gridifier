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

Gridifier.HorizontalGrid.ReversedPrepender = function(a, b, c, d, e, f, g, h, i) {
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
        j._connectorsCleaner = new Gridifier.HorizontalGrid.ConnectorsCleaner(j._connectors, j._connections, j._settings);
        j._connectorsShifter = new Gridifier.ConnectorsShifter(j._gridifier, j._connections, j._settings);
        j._connectorsSelector = new Gridifier.HorizontalGrid.ConnectorsSelector(j._guid);
        j._connectorsSorter = new Gridifier.HorizontalGrid.ConnectorsSorter();
        j._itemCoordsExtractor = new Gridifier.HorizontalGrid.ItemCoordsExtractor(j._gridifier, j._sizesResolverManager);
        j._connectionsIntersector = new Gridifier.HorizontalGrid.ConnectionsIntersector(j._connections);
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        j._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.HorizontalGrid.ReversedPrepender.prototype.reversedPrepend = function(a) {
    this._initConnectors();
    var b = this._createConnectionPerItem(a);
    var c = this._connections.normalizeHorizontalPositionsOfAllConnectionsAfterPrepend(b, this._connectors.get());
    this._connections.attachConnectionToRanges(b);
    this._connectorsCleaner.deleteAllTooRightConnectorsFromMostLeftConnector();
    this._connectorsCleaner.deleteAllIntersectedFromLeftConnectors();
    if (c) {
        this._renderer.renderConnections(this._connections.get(), [ b ]);
    }
    if (this._settings.isDefaultIntersectionStrategy()) this._renderer.showConnections(b); else if (this._settings.isNoIntersectionsStrategy()) {
        var d = this._connections.getLastColHorizontallyExpandedConnections();
        for (var e = 0; e < d.length; e++) {
            if (d[e].itemGUID == b.itemGUID) {
                d.splice(e, 1);
                e--;
            }
        }
        this._renderer.renderConnectionsAfterDelay(d);
        this._renderer.showConnections(b);
    }
};

Gridifier.HorizontalGrid.ReversedPrepender.prototype._initConnectors = function() {
    if (this._operation.isInitialOperation(Gridifier.OPERATIONS.REVERSED_PREPEND)) {
        this.createInitialConnector();
        return;
    }
    if (!this._operation.isCurrentOperationSameAsPrevious(Gridifier.OPERATIONS.REVERSED_PREPEND)) {
        this.recreateConnectorsPerAllConnectedItems();
        this._connectorsCleaner.deleteAllIntersectedFromLeftConnectors();
        this._connectorsCleaner.deleteAllTooRightConnectorsFromMostLeftConnector();
    }
};

Gridifier.HorizontalGrid.ReversedPrepender.prototype.createInitialConnector = function() {
    this._connectors.addPrependConnector(Gridifier.Connectors.SIDES.LEFT.TOP, 0, 0);
};

Gridifier.HorizontalGrid.ReversedPrepender.prototype.recreateConnectorsPerAllConnectedItems = function(a) {
    var a = a || false;
    if (!a) this._connectors.flush();
    var b = this._connections.get();
    for (var c = 0; c < b.length; c++) {
        this._addItemConnectors(b[c], b[c].itemGUID);
    }
    if (this._connectors.count() == 0) this.createInitialConnector();
};

Gridifier.HorizontalGrid.ReversedPrepender.prototype._addItemConnectors = function(a, b) {
    if (a.y2 + 1 <= this._gridifier.getGridY2()) {
        this._connectors.addPrependConnector(Gridifier.Connectors.SIDES.BOTTOM.RIGHT, parseFloat(a.x2), parseFloat(a.y2 + 1), Dom.toInt(b));
    }
    this._connectors.addPrependConnector(Gridifier.Connectors.SIDES.LEFT.TOP, parseFloat(a.x1 - 1), parseFloat(a.y1), Dom.toInt(b));
};

Gridifier.HorizontalGrid.ReversedPrepender.prototype._createConnectionPerItem = function(a) {
    var b = this._filterConnectorsPerNextConnection();
    var c = this._findItemConnectionCoords(a, b);
    var d = this._connections.add(a, c);
    if (this._settings.isNoIntersectionsStrategy()) {
        this._connections.expandHorizontallyAllColConnectionsToMostWide(d);
    }
    this._addItemConnectors(c, this._guid.getItemGUID(a));
    this._guid.markAsPrependedItem(a);
    return d;
};

Gridifier.HorizontalGrid.ReversedPrepender.prototype._filterConnectorsPerNextConnection = function() {
    var a = this._connectors.getClone();
    this._connectorsSelector.attachConnectors(a);
    this._connectorsSelector.selectOnlySpecifiedSideConnectorsOnAppendedItems(Gridifier.Connectors.SIDES.LEFT.TOP);
    a = this._connectorsSelector.getSelectedConnectors();
    if (this._settings.isDefaultIntersectionStrategy()) {
        this._connectorsShifter.attachConnectors(a);
        this._connectorsShifter.shiftAllConnectors();
        a = this._connectorsShifter.getAllConnectors();
    } else if (this._settings.isNoIntersectionsStrategy()) {
        var b = Gridifier.Connectors.SIDES.LEFT.TOP;
        this._connectorsSelector.attachConnectors(a);
        this._connectorsSelector.selectOnlyMostLeftConnectorFromSide(b);
        a = this._connectorsSelector.getSelectedConnectors();
        this._connectorsShifter.attachConnectors(a);
        this._connectorsShifter.shiftAllWithSpecifiedSideToTopGridCorner(b);
        a = this._connectorsShifter.getAllConnectors();
    }
    this._connectorsSorter.attachConnectors(a);
    this._connectorsSorter.sortConnectorsForPrepend(Gridifier.PREPEND_TYPES.REVERSED_PREPEND);
    return this._connectorsSorter.getConnectors();
};

Gridifier.HorizontalGrid.ReversedPrepender.prototype._findItemConnectionCoords = function(a, b) {
    var c = null;
    for (var d = 0; d < b.length; d++) {
        var e = this._itemCoordsExtractor.connectorToReversedPrependedItemCoords(a, b[d]);
        if (e.y2 > this._normalizer.normalizeHighRounding(this._gridifier.getGridY2())) {
            continue;
        }
        var f = this._connectionsIntersector.findAllMaybeIntersectableConnectionsOnPrepend(b[d]);
        if (this._connectionsIntersector.isIntersectingAnyConnection(f, e)) {
            continue;
        }
        c = e;
        var g = this._connections.getAllConnectionsBeforeX(e.x1);
        if (this._connections.isAnyConnectionItemGUIDBiggerThan(g, a)) {
            continue;
        }
        if (this._settings.isNoIntersectionsStrategy()) {
            if (this._connections.isIntersectingMoreThanOneConnectionItemHorizontally(c)) {
                c = null;
            }
        }
        if (c != null) {
            break;
        }
    }
    if (c == null) {
        var h = Gridifier.Error.ERROR_TYPES.INSERTER.TOO_TALL_ITEM_ON_HORIZONTAL_GRID_INSERT;
        new Gridifier.Error(h, a);
    }
    return c;
};