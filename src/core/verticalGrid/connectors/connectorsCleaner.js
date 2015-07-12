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

Gridifier.VerticalGrid.ConnectorsCleaner = function(a, b, c) {
    var d = this;
    this._connectors = null;
    this._connections = null;
    this._settings = null;
    this._connectorsNormalizer = null;
    this._connectionItemIntersectionStrategy = null;
    this._css = {};
    this._construct = function() {
        d._connectors = a;
        d._connections = b;
        d._settings = c;
        d._connectorsNormalizer = new Gridifier.ConnectorsNormalizer(d._connections, d._connectors, d._settings);
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        d._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.VerticalGrid.ConnectorsCleaner.CONNECTION_ITEM_INTERSECTION_STRATEGIES = {
    CONNECTOR_INSIDE_CONNECTION_ITEM: 0,
    CONNECTOR_INSIDE_OR_BEFORE_CONNECTION_ITEM: 1
};

Gridifier.VerticalGrid.ConnectorsCleaner.MAX_VALID_VERTICAL_DISTANCE = {
    FROM_MOST_BOTTOM_CONNECTOR: 3e3,
    FROM_MOST_TOP_CONNECTOR: 3e3
};

Gridifier.VerticalGrid.ConnectorsCleaner.prototype.setConnectorInsideItemIntersectionStrategy = function() {
    var a = Gridifier.VerticalGrid.ConnectorsCleaner.CONNECTION_ITEM_INTERSECTION_STRATEGIES;
    this._connectionItemIntersectionStrategy = a.CONNECTOR_INSIDE_CONNECTION_ITEM;
};

Gridifier.VerticalGrid.ConnectorsCleaner.prototype.setConnectorInsideOrBeforeItemIntersectionStrategy = function() {
    var a = Gridifier.VerticalGrid.ConnectorsCleaner.CONNECTION_ITEM_INTERSECTION_STRATEGIES;
    this._connectionItemIntersectionStrategy = a.CONNECTOR_INSIDE_OR_BEFORE_CONNECTION_ITEM;
};

Gridifier.VerticalGrid.ConnectorsCleaner.prototype._updateConnectorIntersectionStrategy = function() {
    if (this._settings.isDisabledSortDispersion()) {
        this.setConnectorInsideOrBeforeItemIntersectionStrategy();
    } else if (this._settings.isCustomSortDispersion() || this._settings.isCustomAllEmptySpaceSortDispersion()) {
        this.setConnectorInsideItemIntersectionStrategy();
    }
};

Gridifier.VerticalGrid.ConnectorsCleaner.prototype.isConnectorInsideItemIntersectionStrategy = function() {
    this._updateConnectorIntersectionStrategy();
    var a = Gridifier.VerticalGrid.ConnectorsCleaner.CONNECTION_ITEM_INTERSECTION_STRATEGIES;
    return this._connectionItemIntersectionStrategy == a.CONNECTOR_INSIDE_CONNECTION_ITEM;
};

Gridifier.VerticalGrid.ConnectorsCleaner.prototype.isConnectorInsideOrBeforeItemIntersectionStrategy = function() {
    this._updateConnectorIntersectionStrategy();
    var a = Gridifier.VerticalGrid.ConnectorsCleaner.CONNECTION_ITEM_INTERSECTION_STRATEGIES;
    return this._connectionItemIntersectionStrategy == a.CONNECTOR_INSIDE_OR_BEFORE_CONNECTION_ITEM;
};

Gridifier.VerticalGrid.ConnectorsCleaner.prototype._isMappedConnectorIntersectingAnyTopConnectionItem = function(a) {
    var b = this._connections.get();
    for (var c = 0; c < a.connectionIndexes.length; c++) {
        for (var d = 0; d < a.connectionIndexes[c].length; d++) {
            var e = b[a.connectionIndexes[c][d]];
            this._connectorsNormalizer.applyConnectionRoundingPerConnector(e, a);
            if (this.isConnectorInsideOrBeforeItemIntersectionStrategy()) var f = a.y >= e.y1; else if (this.isConnectorInsideItemIntersectionStrategy()) var f = a.y >= e.y1 && a.y <= e.y2;
            if (a.x >= e.x1 && a.x <= e.x2 && f) {
                this._connectorsNormalizer.unapplyConnectionRoundingPerConnector(e, a);
                return true;
            }
            this._connectorsNormalizer.unapplyConnectionRoundingPerConnector(e, a);
        }
    }
    return false;
};

Gridifier.VerticalGrid.ConnectorsCleaner.prototype.deleteAllIntersectedFromTopConnectors = function() {
    var a = this._connectors.get();
    var b = this._connectors.getClone();
    b.sort(function(a, b) {
        if (a.y == b.y) return 0; else if (a.y > b.y) return -1; else return 1;
    });
    b = this._connections.mapAllIntersectedAndUpperConnectionsPerEachConnector(b);
    for (var c = 0; c < b.length; c++) {
        if (this._isMappedConnectorIntersectingAnyTopConnectionItem(b[c])) a[b[c].connectorIndex].isIntersected = true; else a[b[c].connectorIndex].isIntersected = false;
    }
    for (var c = 0; c < a.length; c++) {
        if (a[c].isIntersected) {
            a.splice(c, 1);
            c--;
        }
    }
};

Gridifier.VerticalGrid.ConnectorsCleaner.prototype.deleteAllTooLowConnectorsFromMostTopConnector = function() {
    var a = this._connectors.get();
    if (a.length == 0) return;
    var b = a[0];
    for (var c = 1; c < a.length; c++) {
        if (a[c].y < b.y) b = a[c];
    }
    var d = Gridifier.VerticalGrid.ConnectorsCleaner;
    var e = b.y + this._settings.getMaxInsertionRange();
    for (var c = 0; c < a.length; c++) {
        if (a[c].y > e) {
            a.splice(c, 1);
            c--;
        }
    }
};

Gridifier.VerticalGrid.ConnectorsCleaner.prototype._isMappedConnectorIntersectingAnyBottomConnectionItem = function(a) {
    var b = this._connections.get();
    for (var c = 0; c < a.connectionIndexes.length; c++) {
        for (var d = 0; d < a.connectionIndexes[c].length; d++) {
            var e = b[a.connectionIndexes[c][d]];
            this._connectorsNormalizer.applyConnectionRoundingPerConnector(e, a);
            if (this.isConnectorInsideOrBeforeItemIntersectionStrategy()) var f = a.y <= e.y2; else if (this.isConnectorInsideItemIntersectionStrategy()) var f = a.y <= e.y2 && a.y >= e.y1;
            if (a.x >= e.x1 && a.x <= e.x2 && f) {
                this._connectorsNormalizer.unapplyConnectionRoundingPerConnector(e, a);
                return true;
            }
            this._connectorsNormalizer.unapplyConnectionRoundingPerConnector(e, a);
        }
    }
    return false;
};

Gridifier.VerticalGrid.ConnectorsCleaner.prototype.deleteAllIntersectedFromBottomConnectors = function() {
    var a = this._connectors.get();
    var b = this._connectors.getClone();
    b.sort(function(a, b) {
        if (a.y == b.y) return 0; else if (a.y < b.y) return -1; else return 1;
    });
    b = this._connections.mapAllIntersectedAndLowerConnectionsPerEachConnector(b);
    for (var c = 0; c < b.length; c++) {
        if (this._isMappedConnectorIntersectingAnyBottomConnectionItem(b[c])) a[b[c].connectorIndex].isIntersected = true; else a[b[c].connectorIndex].isIntersected = false;
    }
    for (var c = 0; c < a.length; c++) {
        if (a[c].isIntersected) {
            a.splice(c, 1);
            c--;
        }
    }
};

Gridifier.VerticalGrid.ConnectorsCleaner.prototype.deleteAllTooHighConnectorsFromMostBottomConnector = function() {
    var a = this._connectors.get();
    if (a.length == 0) return;
    var b = a[0];
    for (var c = 1; c < a.length; c++) {
        if (a[c].y > b.y) b = a[c];
    }
    var d = Gridifier.VerticalGrid.ConnectorsCleaner;
    var e = b.y - this._settings.getMaxInsertionRange();
    for (var c = 0; c < a.length; c++) {
        if (a[c].y < e) {
            a.splice(c, 1);
            c--;
        }
    }
};