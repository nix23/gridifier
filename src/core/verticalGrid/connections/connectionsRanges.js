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

Gridifier.VerticalGrid.ConnectionsRanges = function(a) {
    var b = this;
    this._connections = null;
    this._ranges = null;
    this._css = {};
    this._construct = function() {
        b._connections = a;
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        b._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.VerticalGrid.ConnectionsRanges.RANGE_PX_HEIGHT = 500;

Gridifier.VerticalGrid.ConnectionsRanges.prototype.init = function() {
    this._ranges = [];
    this._ranges.push({
        y1: -1,
        y2: Gridifier.VerticalGrid.ConnectionsRanges.RANGE_PX_HEIGHT,
        connectionIndexes: []
    });
    this._attachAllConnections();
};

Gridifier.VerticalGrid.ConnectionsRanges.prototype.shiftAllRangesBy = function(a) {
    for (var b = 0; b < this._ranges.length; b++) {
        this._ranges[b].y1 += a;
        this._ranges[b].y2 += a;
    }
};

Gridifier.VerticalGrid.ConnectionsRanges.prototype.createPrependedRange = function(a, b) {
    this._ranges.unshift({
        y1: -1,
        y2: b,
        connectionIndexes: []
    });
};

Gridifier.VerticalGrid.ConnectionsRanges.prototype._createNextRange = function() {
    var a = this._ranges[this._ranges.length - 1].y2 + 1;
    this._ranges.push({
        y1: a,
        y2: a + Gridifier.VerticalGrid.ConnectionsRanges.RANGE_PX_HEIGHT,
        connectionIndexes: []
    });
};

Gridifier.VerticalGrid.ConnectionsRanges.prototype.attachConnection = function(a, b) {
    while (a.y2 + 1 > this._ranges[this._ranges.length - 1].y2) {
        this._createNextRange();
    }
    var c = false;
    for (var d = 0; d < this._ranges.length; d++) {
        var e = a.y2 < this._ranges[d].y1;
        var f = a.y1 > this._ranges[d].y2;
        if (!e && !f) {
            this._ranges[d].connectionIndexes.push(b);
            c = true;
        }
    }
    if (!c) throw new Error("Gridifier core error: connection was not connected to any range: " + a.itemGUID);
};

Gridifier.VerticalGrid.ConnectionsRanges.prototype._attachAllConnections = function() {
    var a = this._connections.get();
    for (var b = 0; b < a.length; b++) this.attachConnection(a[b], b);
};

Gridifier.VerticalGrid.ConnectionsRanges.prototype.mapAllIntersectedAndUpperConnectionsPerEachConnector = function(a) {
    var b = this._ranges.length - 1;
    var c = [];
    for (var d = 0; d < a.length; d++) {
        var e = false;
        if (b == this._ranges.length - 1) var f = false; else var f = true;
        while (!e) {
            if (b > this._ranges.length - 1 || b < 0) {
                b = this._ranges.length - 1;
                break;
            }
            if (a[d].y >= this._ranges[b].y1 && a[d].y <= this._ranges[b].y2) {
                e = true;
            } else {
                b--;
                f = false;
            }
        }
        if (!f) {
            c = [];
            for (var g = b; g >= 0; g--) c.push(this._ranges[g].connectionIndexes);
        }
        a[d].connectionIndexes = c;
    }
    return a;
};

Gridifier.VerticalGrid.ConnectionsRanges.prototype.getAllConnectionsFromIntersectedAndLowerRanges = function(a) {
    var b = [];
    var c = null;
    for (var d = 0; d < this._ranges.length; d++) {
        if (a >= this._ranges[d].y1 && a <= this._ranges[d].y2) {
            c = d;
            break;
        }
    }
    if (c == null) c = 0;
    for (var d = c; d < this._ranges.length; d++) {
        b.push(this._ranges[d].connectionIndexes);
    }
    return b;
};

Gridifier.VerticalGrid.ConnectionsRanges.prototype.mapAllIntersectedAndLowerConnectionsPerEachConnector = function(a) {
    var b = 0;
    var c = [];
    for (var d = 0; d < a.length; d++) {
        var e = false;
        if (b == 0) var f = false; else var f = true;
        while (!e) {
            if (b > this._ranges.length - 1 || b < 0) {
                b = 0;
                break;
            }
            if (a[d].y >= this._ranges[b].y1 && a[d].y <= this._ranges[b].y2) {
                e = true;
            } else {
                b++;
                f = false;
            }
        }
        if (!f) {
            c = [];
            for (var g = b; g < this._ranges.length; g++) c.push(this._ranges[g].connectionIndexes);
        }
        a[d].connectionIndexes = c;
    }
    return a;
};

Gridifier.VerticalGrid.ConnectionsRanges.prototype.getAllConnectionsFromIntersectedRange = function(a) {
    for (var b = 0; b < this._ranges.length; b++) {
        if (a >= this._ranges[b].y1 && a <= this._ranges[b].y2) return this._ranges[b].connectionIndexes;
    }
    var c = function(a, b) {
        for (var c = 0; c < a.length; c++) {
            if (a[c] == b) return true;
        }
        return false;
    };
    var d = [];
    for (var b = 0; b < this._ranges.length; b++) {
        for (var e = 0; e < this._ranges[b].connectionIndexes.length; e++) {
            if (!c(d, this._ranges[b].connectionIndexes[e])) d.push(this._ranges[b].connectionIndexes[e]);
        }
    }
    return d;
};

Gridifier.VerticalGrid.ConnectionsRanges.prototype.getAllConnectionsFromIntersectedAndUpperRanges = function(a) {
    var b = [];
    var c = null;
    for (var d = this._ranges.length - 1; d >= 0; d--) {
        if (a >= this._ranges[d].y1 && a <= this._ranges[d].y2) {
            c = d;
            break;
        }
    }
    if (c == null) c = this._ranges.length - 1;
    for (var d = c; d >= 0; d--) {
        b.push(this._ranges[d].connectionIndexes);
    }
    return b;
};