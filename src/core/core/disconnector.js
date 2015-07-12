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

Gridifier.Disconnector = function(a, b, c, d, e, f, g, h, i) {
    var j = this;
    this._gridifier = null;
    this._collector = null;
    this._connections = null;
    this._connectionsSorter = null;
    this._connectors = null;
    this._settings = null;
    this._guid = null;
    this._connectedItemMarker = null;
    this._appender = null;
    this._reversedAppender = null;
    this._css = {};
    this._construct = function() {
        j._gridifier = a;
        j._collector = b;
        j._connections = c;
        j._connectionsSorter = d;
        j._connectors = e;
        j._settings = f;
        j._guid = g;
        j._connectedItemMarker = new Gridifier.ConnectedItemMarker();
        j._appender = h;
        j._reversedAppender = i;
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        j._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.Disconnector.DISCONNECT_TYPES = {
    SOFT: 0,
    HARD: 1
};

Gridifier.Disconnector.prototype.disconnect = function(a, b) {
    var a = this._collector.toDOMCollection(a);
    this._collector.ensureAllItemsAreConnectedToGrid(a);
    var b = b || Gridifier.Disconnector.DISCONNECT_TYPES.SOFT;
    if (b == Gridifier.Disconnector.DISCONNECT_TYPES.HARD) {
        for (var c = 0; c < a.length; c++) this._collector.markItemAsRestrictedToCollect(a[c]);
    }
    var d = this._findConnectionsToDisconnect(a);
    for (var c = 0; c < d.length; c++) {
        this._connections.removeConnection(d[c]);
        this._guid.removeItemGUID(d[c].item);
    }
    if (this._connections.get().length == 0) this._recreateConnectors();
    for (var c = 0; c < d.length; c++) this._connectedItemMarker.unmarkItemAsConnected(d[c].item);
    this._connections.reinitRanges();
    this._scheduleDisconnectedItemsRender(d);
};

Gridifier.Disconnector.prototype._findConnectionsToDisconnect = function(a) {
    var b = [];
    for (var c = 0; c < a.length; c++) {
        var d = this._connections.findConnectionByItem(a[c]);
        b.push(d);
    }
    return this._connectionsSorter.sortConnectionsPerReappend(b);
};

Gridifier.Disconnector.prototype._recreateConnectors = function() {
    this._connectors.flush();
    if (this._settings.isDefaultAppend()) {
        this._appender.createInitialConnector();
    } else if (this._settings.isReversedAppend()) {
        this._reversedAppender.createInitialConnector();
    }
};

Gridifier.Disconnector.prototype._scheduleDisconnectedItemsRender = function(a) {
    var b = this._gridifier.getRenderer();
    var c = this._gridifier.splitToBatches(a, 12);
    var d = [];
    for (var e = 0; e < c.length; e++) {
        for (var f = 0; f < c[e].length; f++) d.push(c[e][f].item);
    }
    b.markItemsAsScheduledToHide(d);
    for (var e = 0; e < c.length; e++) {
        (function(a, c) {
            setTimeout(function() {
                b.hideConnections(a);
            }, 60 * c);
        })(c[e], e);
    }
};