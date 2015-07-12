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

Gridifier.HorizontalGrid.Connections = function(a, b, c, d, e) {
    var f = this;
    this._gridifier = null;
    this._guid = null;
    this._settings = null;
    this._sizesResolverManager = null;
    this._eventEmitter = null;
    this._itemCoordsExtractor = null;
    this._sizesTransformer = null;
    this._connectionsCore = null;
    this._connectionsHorizontalIntersector = null;
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
        f._ranges = new Gridifier.HorizontalGrid.ConnectionsRanges(f);
        f._ranges.init();
        f._sorter = new Gridifier.HorizontalGrid.ConnectionsSorter(f, f._settings, f._guid);
        f._itemCoordsExtractor = new Gridifier.HorizontalGrid.ItemCoordsExtractor(f._gridifier, f._sizesResolverManager);
        f._connectionsCore = new Gridifier.Connections(f._gridifier, f, f._guid, f._sorter, f._sizesResolverManager);
        f._connectionsHorizontalIntersector = new Gridifier.HorizontalGrid.ConnectionsHorizontalIntersector(f, f._settings, f._itemCoordsExtractor);
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        f._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.HorizontalGrid.Connections.prototype.getConnectionsSorter = function() {
    return this._sorter;
};

Gridifier.HorizontalGrid.Connections.prototype.setSizesTransformerInstance = function(a) {
    this._sizesTransformer = a;
    this._connectionsCore.setSizesTransformerInstance(a);
};

Gridifier.HorizontalGrid.Connections.prototype.attachConnectionToRanges = function(a) {
    this._ranges.attachConnection(a, this._connections.length - 1);
};

Gridifier.HorizontalGrid.Connections.prototype.reinitRanges = function() {
    this._ranges.init();
};

Gridifier.HorizontalGrid.Connections.prototype.getAllVerticallyIntersectedAndLeftConnections = function(a) {
    return this._ranges.getAllConnectionsFromIntersectedAndLeftRanges(a.x);
};

Gridifier.HorizontalGrid.Connections.prototype.getAllVerticallyIntersectedConnections = function(a) {
    return this._ranges.getAllConnectionsFromIntersectedRange(a.x);
};

Gridifier.HorizontalGrid.Connections.prototype.getAllVerticallyIntersectedAndRightConnections = function(a) {
    return this._ranges.getAllConnectionsFromIntersectedAndRightRanges(a.x);
};

Gridifier.HorizontalGrid.Connections.prototype.mapAllIntersectedAndRightConnectionsPerEachConnector = function(a) {
    return this._ranges.mapAllIntersectedAndRightConnectionsPerEachConnector(a);
};

Gridifier.HorizontalGrid.Connections.prototype.mapAllIntersectedAndLeftConnectionsPerEachConnector = function(a) {
    return this._ranges.mapAllIntersectedAndLeftConnectionsPerEachConnector(a);
};

Gridifier.HorizontalGrid.Connections.prototype.getLastColHorizontallyExpandedConnections = function() {
    return this._connectionsHorizontalIntersector.getLastColHorizontallyExpandedConnections();
};

Gridifier.HorizontalGrid.Connections.prototype.get = function() {
    return this._connections;
};

Gridifier.HorizontalGrid.Connections.prototype.count = function() {
    return this._connections.length;
};

Gridifier.HorizontalGrid.Connections.prototype.restore = function(a) {
    this._connections = this._connections.concat(a);
};

Gridifier.HorizontalGrid.Connections.prototype.restoreOnCustomSortDispersionMode = function(a) {
    var b = this._sorter.sortConnectionsPerReappend(this._connections);
    var c = b[b.length - 1];
    if (this._settings.isDefaultAppend()) {
        var d = c.y2;
        var e = c.x1;
        var f = d + 1;
        for (var g = 0; g < a.length; g++) {
            a[g].x1 = e;
            a[g].x2 = e;
            a[g].y1 = f;
            a[g].y2 = f;
            f++;
        }
    } else if (this._settings.isReversedAppend()) {
        var h = c.y1;
        var e = c.x1;
        var f = h - 1;
        for (var g = 0; g < a.length; g++) {
            a[g].x1 = e;
            a[g].x2 = e;
            a[g].y1 = f;
            a[g].y2 = f;
            f--;
        }
    }
    this.restore(a);
};

Gridifier.HorizontalGrid.Connections.prototype.getMaxX2 = function() {
    return this._connectionsCore.getMaxX2();
};

Gridifier.HorizontalGrid.Connections.prototype.getMaxY2 = function() {
    return this._connectionsCore.getMaxY2();
};

Gridifier.HorizontalGrid.Connections.prototype.findConnectionByItem = function(a, b) {
    var b = b || false;
    return this._connectionsCore.findConnectionByItem(a, b);
};

Gridifier.HorizontalGrid.Connections.prototype.remapAllItemGUIDS = function() {
    this._connectionsCore.remapAllItemGUIDS();
};

Gridifier.HorizontalGrid.Connections.prototype.remapAllItemGUIDSInSortedConnections = function(a) {
    this._connectionsCore.remapAllItemGUIDSInSortedConnections(a);
};

Gridifier.HorizontalGrid.Connections.prototype.add = function(a, b) {
    var c = this._connectionsCore.createItemConnection(a, b);
    this._connections.push(c);
    this._eventEmitter.emitConnectionCreateEvent(this);
    return c;
};

Gridifier.HorizontalGrid.Connections.prototype.removeConnection = function(a) {
    for (var b = 0; b < this._connections.length; b++) {
        if (this._guid.getItemGUID(a.item) == this._guid.getItemGUID(this._connections[b].item)) {
            this._connections.splice(b, 1);
            return;
        }
    }
};

Gridifier.HorizontalGrid.Connections.prototype.getConnectionsByItemGUIDS = function(a) {
    return this._connectionsCore.getConnectionsByItemGUIDS(a);
};

Gridifier.HorizontalGrid.Connections.prototype.syncConnectionParams = function(a) {
    this._connectionsCore.syncConnectionParams(a);
};

Gridifier.HorizontalGrid.Connections.prototype.getMinConnectionWidth = function() {
    return this._connectionsCore.getMinConnectionWidth();
};

Gridifier.HorizontalGrid.Connections.prototype.getMinConnectionHeight = function() {
    return this._connectionsCore.getMinConnectionHeight();
};

Gridifier.HorizontalGrid.Connections.prototype.isAnyConnectionItemGUIDSmallerThan = function(a, b) {
    return this._connectionsCore.isAnyConnectionItemGUIDSmallerThan(a, b);
};

Gridifier.HorizontalGrid.Connections.prototype.isAnyConnectionItemGUIDBiggerThan = function(a, b) {
    return this._connectionsCore.isAnyConnectionItemGUIDBiggerThan(a, b);
};

Gridifier.HorizontalGrid.Connections.prototype.getAllConnectionsBehindX = function(a) {
    var b = [];
    for (var c = 0; c < this._connections.length; c++) {
        if (this._settings.isDisabledSortDispersion()) {
            if (this._connections[c].x1 > a) b.push(this._connections[c]);
        } else if (this._settings.isCustomSortDispersion()) {
            var d = this._settings.getSortDispersionValue();
            if (this._connections[c].x1 - d > a) b.push(this._connections[c]);
        } else if (this._settings.isCustomAllEmptySpaceSortDispersion()) {
        }
    }
    return b;
};

Gridifier.HorizontalGrid.Connections.prototype.getAllConnectionsBeforeX = function(a) {
    var b = [];
    for (var c = 0; c < this._connections.length; c++) {
        if (this._settings.isDisabledSortDispersion()) {
            if (this._connections[c].x2 < a) b.push(this._connections[c]);
        } else if (this._settings.isCustomSortDispersion()) {
            var d = this._settings.getSortDispersionValue();
            if (this._connections[c].x2 + d < a) b.push(this._connections[c]);
        } else if (this._settings.isCustomAllEmptySpaceSortDispersion()) {
        }
    }
    return b;
};

Gridifier.HorizontalGrid.Connections.prototype.getMaxYFromAllConnections = function() {
    var a = 0;
    for (var b = 0; b < this._connections.length; b++) {
        if (this._connections[b].y2 > a) a = this._connections[b].y2;
    }
    return a;
};

Gridifier.HorizontalGrid.Connections.prototype.isIntersectingMoreThanOneConnectionItemHorizontally = function(a) {
    return this._connectionsHorizontalIntersector.isIntersectingMoreThanOneConnectionItemHorizontally(a);
};

Gridifier.HorizontalGrid.Connections.prototype.getMostWideFromAllHorizontallyIntersectedConnections = function(a) {
    return this._connectionsHorizontalIntersector.getMostWideFromAllHorizontallyIntersectedConnections(a);
};

Gridifier.HorizontalGrid.Connections.prototype.getAllHorizontallyIntersectedConnections = function(a) {
    return this._connectionsHorizontalIntersector.getAllHorizontallyIntersectedConnections(a);
};

Gridifier.HorizontalGrid.Connections.prototype.expandHorizontallyAllColConnectionsToMostWide = function(a) {
    this._connectionsHorizontalIntersector.expandHorizontallyAllColConnectionsToMostWide(a);
};

Gridifier.HorizontalGrid.Connections.prototype.normalizeHorizontalPositionsOfAllConnectionsAfterPrepend = function(a, b) {
    if (a.x1 >= 0) return false;
    var c = Math.round(Math.abs(a.x1));
    a.x2 = Math.abs(a.x1 - a.x2);
    a.x1 = 0;
    for (var d = 0; d < this._connections.length; d++) {
        if (a.itemGUID == this._connections[d].itemGUID) continue;
        this._connections[d].x1 += c;
        this._connections[d].x2 += c;
    }
    for (var d = 0; d < b.length; d++) b[d].x += c;
    this._ranges.shiftAllRangesBy(c);
    this._ranges.createPrependedRange(a.x1, a.x2);
    return true;
};