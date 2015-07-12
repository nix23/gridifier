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

Gridifier.VerticalGrid.Connections = function(a, b, c, d, e) {
    var f = this;
    this._gridifier = null;
    this._guid = null;
    this._settings = null;
    this._sizesResolverManager = null;
    this._eventEmitter = null;
    this._itemCoordsExtractor = null;
    this._sizesTransformer = null;
    this._connectionsCore = null;
    this._connectionsVerticalIntersector = null;
    this._connections = [];
    this._ranges = null;
    this._sorter = null;
    this._css = {};
    this._construct = function() {
        f._gridifier = a;
        f._guid = b;
        f._settings = c;
        f._sizesResolverManager = d;
        f._eventEmitter = e;
        f._ranges = new Gridifier.VerticalGrid.ConnectionsRanges(f);
        f._ranges.init();
        f._sorter = new Gridifier.VerticalGrid.ConnectionsSorter(f, f._settings, f._guid);
        f._itemCoordsExtractor = new Gridifier.VerticalGrid.ItemCoordsExtractor(f._gridifier, f._sizesResolverManager);
        f._connectionsCore = new Gridifier.Connections(f._gridifier, f, f._guid, f._sorter, f._sizesResolverManager);
        f._connectionsVerticalIntersector = new Gridifier.VerticalGrid.ConnectionsVerticalIntersector(f, f._settings, f._itemCoordsExtractor);
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        f._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.VerticalGrid.Connections.prototype.getConnectionsSorter = function() {
    return this._sorter;
};

Gridifier.VerticalGrid.Connections.prototype.setSizesTransformerInstance = function(a) {
    this._sizesTransformer = a;
    this._connectionsCore.setSizesTransformerInstance(a);
};

Gridifier.VerticalGrid.Connections.prototype.attachConnectionToRanges = function(a) {
    this._ranges.attachConnection(a, this._connections.length - 1);
};

Gridifier.VerticalGrid.Connections.prototype.reinitRanges = function() {
    this._ranges.init();
};

Gridifier.VerticalGrid.Connections.prototype.getAllHorizontallyIntersectedAndUpperConnections = function(a) {
    return this._ranges.getAllConnectionsFromIntersectedAndUpperRanges(a.y);
};

Gridifier.VerticalGrid.Connections.prototype.getAllHorizontallyIntersectedConnections = function(a) {
    return this._ranges.getAllConnectionsFromIntersectedRange(a.y);
};

Gridifier.VerticalGrid.Connections.prototype.getAllHorizontallyIntersectedAndLowerConnections = function(a) {
    return this._ranges.getAllConnectionsFromIntersectedAndLowerRanges(a.y);
};

Gridifier.VerticalGrid.Connections.prototype.mapAllIntersectedAndLowerConnectionsPerEachConnector = function(a) {
    return this._ranges.mapAllIntersectedAndLowerConnectionsPerEachConnector(a);
};

Gridifier.VerticalGrid.Connections.prototype.mapAllIntersectedAndUpperConnectionsPerEachConnector = function(a) {
    return this._ranges.mapAllIntersectedAndUpperConnectionsPerEachConnector(a);
};

Gridifier.VerticalGrid.Connections.prototype.getLastRowVerticallyExpandedConnections = function() {
    return this._connectionsVerticalIntersector.getLastRowVerticallyExpandedConnections();
};

Gridifier.VerticalGrid.Connections.prototype.get = function() {
    return this._connections;
};

Gridifier.VerticalGrid.Connections.prototype.count = function() {
    return this._connections.length;
};

Gridifier.VerticalGrid.Connections.prototype.restore = function(a) {
    this._connections = this._connections.concat(a);
};

Gridifier.VerticalGrid.Connections.prototype.restoreOnCustomSortDispersionMode = function(a) {
    var b = this._sorter.sortConnectionsPerReappend(this._connections);
    var c = b[b.length - 1];
    if (this._settings.isDefaultAppend()) {
        var d = c.x1;
        var e = c.y1;
        var f = d - 1;
        for (var g = 0; g < a.length; g++) {
            a[g].x1 = f;
            a[g].x2 = f;
            a[g].y1 = e;
            a[g].y2 = e;
            f--;
        }
    } else if (this._settings.isReversedAppend()) {
        var h = c.x2;
        var e = c.y1;
        var f = h + 1;
        for (var g = 0; g < a.length; g++) {
            a[g].x1 = f;
            a[g].x2 = f;
            a[g].y1 = e;
            a[g].y2 = e;
            f++;
        }
    }
    this.restore(a);
};

Gridifier.VerticalGrid.Connections.prototype.getMaxX2 = function() {
    return this._connectionsCore.getMaxX2();
};

Gridifier.VerticalGrid.Connections.prototype.getMaxY2 = function() {
    return this._connectionsCore.getMaxY2();
};

Gridifier.VerticalGrid.Connections.prototype.findConnectionByItem = function(a, b) {
    var c = b || false;
    return this._connectionsCore.findConnectionByItem(a, b);
};

Gridifier.VerticalGrid.Connections.prototype.remapAllItemGUIDS = function() {
    this._connectionsCore.remapAllItemGUIDS();
};

Gridifier.VerticalGrid.Connections.prototype.remapAllItemGUIDSInSortedConnections = function(a) {
    this._connectionsCore.remapAllItemGUIDSInSortedConnections(a);
};

Gridifier.VerticalGrid.Connections.prototype.add = function(a, b) {
    var c = this._connectionsCore.createItemConnection(a, b);
    this._connections.push(c);
    this._eventEmitter.emitConnectionCreateEvent(this);
    return c;
};

Gridifier.VerticalGrid.Connections.prototype.removeConnection = function(a) {
    for (var b = 0; b < this._connections.length; b++) {
        if (this._guid.getItemGUID(a.item) == this._guid.getItemGUID(this._connections[b].item)) {
            this._connections.splice(b, 1);
            return;
        }
    }
};

Gridifier.VerticalGrid.Connections.prototype.getConnectionsByItemGUIDS = function(a) {
    return this._connectionsCore.getConnectionsByItemGUIDS(a);
};

Gridifier.VerticalGrid.Connections.prototype.syncConnectionParams = function(a) {
    this._connectionsCore.syncConnectionParams(a);
};

Gridifier.VerticalGrid.Connections.prototype.getMinConnectionWidth = function() {
    return this._connectionsCore.getMinConnectionWidth();
};

Gridifier.VerticalGrid.Connections.prototype.getMinConnectionHeight = function() {
    return this._connectionsCore.getMinConnectionHeight();
};

Gridifier.VerticalGrid.Connections.prototype.isAnyConnectionItemGUIDSmallerThan = function(a, b) {
    return this._connectionsCore.isAnyConnectionItemGUIDSmallerThan(a, b);
};

Gridifier.VerticalGrid.Connections.prototype.isAnyConnectionItemGUIDBiggerThan = function(a, b) {
    return this._connectionsCore.isAnyConnectionItemGUIDBiggerThan(a, b);
};

Gridifier.VerticalGrid.Connections.prototype.getAllConnectionsBelowY = function(a) {
    var b = [];
    for (var c = 0; c < this._connections.length; c++) {
        if (this._settings.isDisabledSortDispersion()) {
            if (this._connections[c].y1 > a) b.push(this._connections[c]);
        } else if (this._settings.isCustomSortDispersion()) {
            var d = this._settings.getSortDispersionValue();
            if (this._connections[c].y1 - d > a) b.push(this._connections[c]);
        } else if (this._settings.isCustomAllEmptySpaceSortDispersion()) {
        }
    }
    return b;
};

Gridifier.VerticalGrid.Connections.prototype.getAllConnectionsAboveY = function(a) {
    var b = [];
    for (var c = 0; c < this._connections.length; c++) {
        if (this._settings.isDisabledSortDispersion()) {
            if (this._connections[c].y2 < a) b.push(this._connections[c]);
        } else if (this._settings.isCustomSortDispersion()) {
            var d = this._settings.getSortDispersionValue();
            if (this._connections[c].y2 + d < a) b.push(this._connections[c]);
        } else if (this._settings.isCustomAllEmptySpaceSortDispersion()) {
        }
    }
    return b;
};

Gridifier.VerticalGrid.Connections.prototype.getMaxYFromAllConnections = function() {
    var a = 0;
    for (var b = 0; b < this._connections.length; b++) {
        if (this._connections[b].y2 > a) a = this._connections[b].y2;
    }
    return a;
};

Gridifier.VerticalGrid.Connections.prototype.isIntersectingMoreThanOneConnectionItemVertically = function(a) {
    return this._connectionsVerticalIntersector.isIntersectingMoreThanOneConnectionItemVertically(a);
};

Gridifier.VerticalGrid.Connections.prototype.getMostTallFromAllVerticallyIntersectedConnections = function(a) {
    return this._connectionsVerticalIntersector.getMostTallFromAllVerticallyIntersectedConnections(a);
};

Gridifier.VerticalGrid.Connections.prototype.getAllVerticallyIntersectedConnections = function(a) {
    return this._connectionsVerticalIntersector.getAllVerticallyIntersectedConnections(a);
};

Gridifier.VerticalGrid.Connections.prototype.expandVerticallyAllRowConnectionsToMostTall = function(a) {
    this._connectionsVerticalIntersector.expandVerticallyAllRowConnectionsToMostTall(a);
};

Gridifier.VerticalGrid.Connections.prototype.normalizeVerticalPositionsOfAllConnectionsAfterPrepend = function(a, b) {
    if (a.y1 >= 0) return false;
    var c = Math.round(Math.abs(a.y1));
    a.y2 = Math.abs(a.y1 - a.y2);
    a.y1 = 0;
    for (var d = 0; d < this._connections.length; d++) {
        if (a.itemGUID == this._connections[d].itemGUID) continue;
        this._connections[d].y1 += c;
        this._connections[d].y2 += c;
    }
    for (var d = 0; d < b.length; d++) b[d].y += c;
    this._ranges.shiftAllRangesBy(c);
    this._ranges.createPrependedRange(a.y1, a.y2);
    return true;
};