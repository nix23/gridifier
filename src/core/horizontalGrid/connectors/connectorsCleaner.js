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

Gridifier.HorizontalGrid.ConnectorsCleaner = function(a, b, c) {
    var d = this;
    this._connectors = null;
    this._connections = null;
    this._settings = null;
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

Gridifier.HorizontalGrid.ConnectorsCleaner.CONNECTION_ITEM_INTERSECTION_STRATEGIES = {
    CONNECTOR_INSIDE_CONNECTION_ITEM: 0,
    CONNECTOR_INSIDE_OR_BEFORE_CONNECTION_ITEM: 1
};

Gridifier.HorizontalGrid.ConnectorsCleaner.MAX_VALID_HORIZONTAL_DISTANCE = {
    FROM_MOST_RIGHT_CONNECTOR: 3e3,
    FROM_MOST_LEFT_CONNECTOR: 3e3
};

Gridifier.HorizontalGrid.ConnectorsCleaner.prototype.setConnectorInsideItemIntersectionStrategy = function() {
    var a = Gridifier.HorizontalGrid.ConnectorsCleaner.CONNECTION_ITEM_INTERSECTION_STRATEGIES;
    this._connectionItemIntersectionStrategy = a.CONNECTOR_INSIDE_CONNECTION_ITEM;
};

Gridifier.HorizontalGrid.ConnectorsCleaner.prototype.setConnectorInsideOrBeforeItemIntersectionStrategy = function() {
    var a = Gridifier.HorizontalGrid.ConnectorsCleaner.CONNECTION_ITEM_INTERSECTION_STRATEGIES;
    this._connectionItemIntersectionStrategy = a.CONNECTOR_INSIDE_OR_BEFORE_CONNECTION_ITEM;
};

Gridifier.HorizontalGrid.ConnectorsCleaner.prototype._updateConnectorIntersectionStrategy = function() {
    if (this._settings.isDisabledSortDispersion()) {
        this.setConnectorInsideOrBeforeItemIntersectionStrategy();
    } else if (this._settings.isCustomSortDispersion() || this._settings.isCustomAllEmptySpaceSortDispersion()) {
        this.setConnectorInsideItemIntersectionStrategy();
    }
};

Gridifier.HorizontalGrid.ConnectorsCleaner.prototype.isConnectorInsideItemIntersectionStrategy = function() {
    this._updateConnectorIntersectionStrategy();
    var a = Gridifier.HorizontalGrid.ConnectorsCleaner.CONNECTION_ITEM_INTERSECTION_STRATEGIES;
    return this._connectionItemIntersectionStrategy == a.CONNECTOR_INSIDE_CONNECTION_ITEM;
};

Gridifier.HorizontalGrid.ConnectorsCleaner.prototype.isConnectorInsideOrBeforeItemIntersectionStrategy = function() {
    this._updateConnectorIntersectionStrategy();
    var a = Gridifier.HorizontalGrid.ConnectorsCleaner.CONNECTION_ITEM_INTERSECTION_STRATEGIES;
    return this._connectionItemIntersectionStrategy == a.CONNECTOR_INSIDE_OR_BEFORE_CONNECTION_ITEM;
};

Gridifier.HorizontalGrid.ConnectorsCleaner.prototype._isMappedConnectorIntersectingAnyLeftConnectionItem = function(a) {
    var b = this._connections.get();
    for (var c = 0; c < a.connectionIndexes.length; c++) {
        for (var d = 0; d < a.connectionIndexes[c].length; d++) {
            var e = b[a.connectionIndexes[c][d]];
            this._connectorsNormalizer.applyConnectionRoundingPerConnector(e, a);
            if (this.isConnectorInsideOrBeforeItemIntersectionStrategy()) var f = a.x >= e.x1; else if (this.isConnectorInsideItemIntersectionStrategy()) var f = a.x >= e.x1 && a.x <= e.x2;
            if (a.y >= e.y1 && a.y <= e.y2 && f) {
                this._connectorsNormalizer.unapplyConnectionRoundingPerConnector(e, a);
                return true;
            }
            this._connectorsNormalizer.unapplyConnectionRoundingPerConnector(e, a);
        }
    }
    return false;
};

Gridifier.HorizontalGrid.ConnectorsCleaner.prototype.deleteAllIntersectedFromLeftConnectors = function() {
    var a = this._connectors.get();
    var b = this._connectors.getClone();
    b.sort(function(a, b) {
        if (a.x == b.x) return 0; else if (a.x > b.x) return -1; else return 1;
    });
    b = this._connections.mapAllIntersectedAndLeftConnectionsPerEachConnector(b);
    for (var c = 0; c < b.length; c++) {
        if (this._isMappedConnectorIntersectingAnyLeftConnectionItem(b[c])) a[b[c].connectorIndex].isIntersected = true; else a[b[c].connectorIndex].isIntersected = false;
    }
    for (var c = 0; c < a.length; c++) {
        if (a[c].isIntersected) {
            a.splice(c, 1);
            c--;
        }
    }
};

Gridifier.HorizontalGrid.ConnectorsCleaner.prototype.deleteAllTooRightConnectorsFromMostLeftConnector = function() {
    var a = this._connectors.get();
    if (a.length == 0) return;
    var b = a[0];
    for (var c = 1; c < a.length; c++) {
        if (a[c].x < b.x) b = a[c];
    }
    var d = Gridifier.HorizontalGrid.ConnectorsCleaner;
    var e = b.x + this._settings.getMaxInsertionRange();
    for (var c = 0; c < a.length; c++) {
        if (a[c].x > e) {
            a.splice(c, 1);
            c--;
        }
    }
};

Gridifier.HorizontalGrid.ConnectorsCleaner.prototype._isMappedConnectorIntersectingAnyRightConnectionItem = function(a) {
    var b = this._connections.get();
    for (var c = 0; c < a.connectionIndexes.length; c++) {
        for (var d = 0; d < a.connectionIndexes[c].length; d++) {
            var e = b[a.connectionIndexes[c][d]];
            this._connectorsNormalizer.applyConnectionRoundingPerConnector(e, a);
            if (this.isConnectorInsideOrBeforeItemIntersectionStrategy()) var f = a.x <= e.x2; else if (this.isConnectorInsideItemIntersectionStrategy()) var f = a.x <= e.x2 && a.x >= e.x1;
            if (a.y >= e.y1 && a.y <= e.y2 && f) {
                this._connectorsNormalizer.unapplyConnectionRoundingPerConnector(e, a);
                return true;
            }
            this._connectorsNormalizer.unapplyConnectionRoundingPerConnector(e, a);
        }
    }
    return false;
};

Gridifier.HorizontalGrid.ConnectorsCleaner.prototype.deleteAllIntersectedFromRightConnectors = function() {
    var a = this._connectors.get();
    var b = this._connectors.getClone();
    b.sort(function(a, b) {
        if (a.x == b.x) return 0; else if (a.x < b.x) return -1; else return 1;
    });
    b = this._connections.mapAllIntersectedAndRightConnectionsPerEachConnector(b);
    for (var c = 0; c < b.length; c++) {
        if (this._isMappedConnectorIntersectingAnyRightConnectionItem(b[c])) a[b[c].connectorIndex].isIntersected = true; else a[b[c].connectorIndex].isIntersected = false;
    }
    for (var c = 0; c < a.length; c++) {
        if (a[c].isIntersected) {
            a.splice(c, 1);
            c--;
        }
    }
};

Gridifier.HorizontalGrid.ConnectorsCleaner.prototype.deleteAllTooLeftConnectorsFromMostRightConnector = function() {
    var a = this._connectors.get();
    if (a.length == 0) return;
    var b = a[0];
    for (var c = 1; c < a.length; c++) {
        if (a[c].x > b.x) b = a[c];
    }
    var d = Gridifier.HorizontalGrid.ConnectorsCleaner;
    var e = b.x - this._settings.getMaxInsertionRange();
    for (var c = 0; c < a.length; c++) {
        if (a[c].x < e) {
            a.splice(c, 1);
            c--;
        }
    }
};