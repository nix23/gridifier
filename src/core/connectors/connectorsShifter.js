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

Gridifier.ConnectorsShifter = function(a, b, c) {
    var d = this;
    this._gridifier = null;
    this._connections = null;
    this._settings = null;
    this._connectorsIntersector = null;
    this._ci = null;
    this._connectors = null;
    this._shiftedConnectors = [];
    this._allConnectors = [];
    this._css = {};
    this._construct = function() {
        d._gridifier = a;
        d._connections = b;
        d._settings = c;
        d._connectorsIntersector = new Gridifier.ConnectorsIntersector(d._connections, d._settings);
        d._ci = d._connectorsIntersector;
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        d._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.ConnectorsShifter.SIDE = "shifted";

Gridifier.ConnectorsShifter.prototype.attachConnectors = function(a) {
    this._connectors = a;
    this._shifterConnectors = [];
    this._allConnectors = [];
};

Gridifier.ConnectorsShifter.prototype.getAllConnectors = function() {
    return this._allConnectors;
};

Gridifier.ConnectorsShifter.prototype._createShiftedConnector = function(a, b, c) {
    var d = {
        type: c.type,
        side: Gridifier.ConnectorsShifter.SIDE,
        x: parseFloat(a),
        y: parseFloat(b),
        itemGUID: Dom.toInt(c.itemGUID)
    };
    this._shiftedConnectors.push(d);
    this._allConnectors.push(d);
};

Gridifier.ConnectorsShifter.prototype.shiftAllConnectors = function() {
    for (var a = 0; a < this._connectors.length; a++) {
        this._allConnectors.push(this._connectors[a]);
        if (Gridifier.Connectors.isLeftTopSideConnector(this._connectors[a])) {
            this._shiftLeftTopConnector(this._connectors[a]);
        } else if (Gridifier.Connectors.isLeftBottomSideConnector(this._connectors[a])) {
            this._shiftLeftBottomConnector(this._connectors[a]);
        } else if (Gridifier.Connectors.isBottomRightSideConnector(this._connectors[a])) {
            this._shiftBottomRightConnector(this._connectors[a]);
        } else if (Gridifier.Connectors.isBottomLeftSideConnector(this._connectors[a])) {
            this._shiftTopLeftConnector(this._connectors[a]);
        } else if (Gridifier.Connectors.isTopLeftSideConnector(this._connectors[a])) {
            this._shiftTopLeftConnector(this._connectors[a]);
        } else if (Gridifier.Connectors.isTopRightSideConnector(this._connectors[a])) {
            this._shiftBottomRightConnector(this._connectors[a]);
        } else if (Gridifier.Connectors.isRightBottomSideConnector(this._connectors[a])) {
            this._shiftRightBottomConnector(this._connectors[a]);
        } else if (Gridifier.Connectors.isRightTopSideConnector(this._connectors[a])) {
            this._shiftRightTopConnector(this._connectors[a]);
        }
    }
};

Gridifier.ConnectorsShifter.prototype._shiftLeftTopConnector = function(a) {
    var b = this._ci.getMostBottomFromIntersectedTopOrTopLeftItems(a);
    if (b != null) {
        if (b.y2 + 1 != a.y) this._createShiftedConnector(a.x, b.y2 + 1, a);
    } else {
        if (a.y != 0) this._createShiftedConnector(a.x, 0, a);
    }
};

Gridifier.ConnectorsShifter.prototype._shiftLeftBottomConnector = function(a) {
    var b = this._ci.getMostTopFromIntersectedBottomOrBottomLeftItems(a);
    if (b != null) {
        if (b.y1 - 1 != a.y) this._createShiftedConnector(a.x, b.y1 - 1, a);
    } else {
        var c = this._connections.getMaxYFromAllConnections();
        if (c != 0) {
            if (c - 1 != a.y) this._createShiftedConnector(a.x, c - 1, a);
        }
    }
};

Gridifier.ConnectorsShifter.prototype._shiftBottomRightConnector = function(a) {
    var b = this._ci.getMostLeftFromIntersectedRightItems(a);
    if (b != null) {
        if (b.x1 - 1 != a.x) this._createShiftedConnector(b.x1 - 1, a.y, a);
    } else {
        if (this._settings.isHorizontalGrid() && a.type == Gridifier.Connectors.TYPES.PREPEND.DEFAULT) return;
        if (a.x != this._gridifier.getGridX2()) this._createShiftedConnector(this._gridifier.getGridX2(), a.y, a);
    }
};

Gridifier.ConnectorsShifter.prototype._shiftTopLeftConnector = function(a) {
    var b = this._ci.getMostRightFromIntersectedLeftItems(a);
    if (b != null) {
        if (b.x2 + 1 != a.x) this._createShiftedConnector(b.x2 + 1, a.y, a);
    } else {
        if (a.x != 0) this._createShiftedConnector(0, a.y, a);
    }
};

Gridifier.ConnectorsShifter.prototype._shiftRightBottomConnector = function(a) {
    var b = this._ci.getMostTopFromIntersectedBottomOrBottomRightItems(a);
    if (b != null) {
        if (b.y1 - 1 != a.y) this._createShiftedConnector(a.x, b.y1 - 1, a);
    } else {
        var c = this._connections.getMaxYFromAllConnections();
        if (c != 0) {
            if (c - 1 != a.y) this._createShiftedConnector(a.x, c - 1, a);
        }
    }
};

Gridifier.ConnectorsShifter.prototype._shiftRightTopConnector = function(a) {
    var b = this._ci.getMostBottomFromIntersectedTopOrTopRightItems(a);
    if (b != null) {
        if (b.y2 + 1 != a.y) this._createShiftedConnector(a.x, b.y2 + 1, a);
    } else {
        if (a.y != 0) {
            this._createShiftedConnector(a.x, 0, a);
        }
    }
};

Gridifier.ConnectorsShifter.prototype.shiftAllWithSpecifiedSideToRightGridCorner = function(a) {
    this._allConnectors = this._connectors;
    for (var b = 0; b < this._allConnectors.length; b++) {
        if (this._allConnectors[b].side == a) this._allConnectors[b].x = this._gridifier.getGridX2();
    }
};

Gridifier.ConnectorsShifter.prototype.shiftAllWithSpecifiedSideToLeftGridCorner = function(a) {
    this._allConnectors = this._connectors;
    for (var b = 0; b < this._allConnectors.length; b++) {
        if (this._allConnectors[b].side == a) this._allConnectors[b].x = 0;
    }
};

Gridifier.ConnectorsShifter.prototype.shiftAllWithSpecifiedSideToTopGridCorner = function(a) {
    this._allConnectors = this._connectors;
    for (var b = 0; b < this._allConnectors.length; b++) {
        if (this._allConnectors[b].side == a) this._allConnectors[b].y = 0;
    }
};

Gridifier.ConnectorsShifter.prototype.shiftAllWithSpecifiedSideToBottomGridCorner = function(a) {
    this._allConnectors = this._connectors;
    for (var b = 0; b < this._allConnectors.length; b++) {
        if (this._allConnectors[b].side == a) this._allConnectors[b].y = this._gridifier.getGridY2();
    }
};