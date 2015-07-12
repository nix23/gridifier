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

Gridifier.Connectors = function(a, b) {
    var c = this;
    this._guid = null;
    this._connections = null;
    this._connectors = [];
    this._nextFlushCallback = null;
    this._css = {};
    this._construct = function() {
        c._guid = a;
        c._connections = b;
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        c._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.Connectors.INITIAL_CONNECTOR_ITEM_GUID = -1;

Gridifier.Connectors.TYPES = {
    APPEND: {
        DEFAULT: "appendDefault",
        REVERSED: "appendReversed"
    },
    PREPEND: {
        DEFAULT: "prependDefault",
        REVERSED: "prependReversed"
    }
};

Gridifier.Connectors.SIDES = {
    LEFT: {
        TOP: "leftTop",
        BOTTOM: "leftBottom"
    },
    BOTTOM: {
        RIGHT: "bottomRight",
        LEFT: "bottomLeft"
    },
    RIGHT: {
        TOP: "rightTop",
        BOTTOM: "rightBottom"
    },
    TOP: {
        LEFT: "topLeft",
        RIGHT: "topRight"
    }
};

Gridifier.Connectors.isLeftTopSideConnector = function(a) {
    return a.side == Gridifier.Connectors.SIDES.LEFT.TOP;
};

Gridifier.Connectors.isLeftBottomSideConnector = function(a) {
    return a.side == Gridifier.Connectors.SIDES.LEFT.BOTTOM;
};

Gridifier.Connectors.isBottomRightSideConnector = function(a) {
    return a.side == Gridifier.Connectors.SIDES.BOTTOM.RIGHT;
};

Gridifier.Connectors.isBottomLeftSideConnector = function(a) {
    return a.side == Gridifier.Connectors.SIDES.BOTTOM.LEFT;
};

Gridifier.Connectors.isRightTopSideConnector = function(a) {
    return a.side == Gridifier.Connectors.SIDES.RIGHT.TOP;
};

Gridifier.Connectors.isRightBottomSideConnector = function(a) {
    return a.side == Gridifier.Connectors.SIDES.RIGHT.BOTTOM;
};

Gridifier.Connectors.isTopLeftSideConnector = function(a) {
    return a.side == Gridifier.Connectors.SIDES.TOP.LEFT;
};

Gridifier.Connectors.isTopRightSideConnector = function(a) {
    return a.side == Gridifier.Connectors.SIDES.TOP.RIGHT;
};

Gridifier.Connectors.isInitialConnector = function(a) {
    return a.itemGUID == Gridifier.Connectors.INITIAL_CONNECTOR_ITEM_GUID;
};

Gridifier.Connectors.prototype._addConnector = function(a, b, c, d, e) {
    if (typeof e == "undefined") var e = Gridifier.Connectors.INITIAL_CONNECTOR_ITEM_GUID;
    this._connectors.push({
        type: a,
        side: b,
        x: Dom.toFixed(c, 2),
        y: Dom.toFixed(d, 2),
        itemGUID: e
    });
};

Gridifier.Connectors.prototype.addAppendConnector = function(a, b, c, d) {
    this._addConnector(Gridifier.Connectors.TYPES.APPEND.DEFAULT, a, b, c, d);
};

Gridifier.Connectors.prototype.addReversedAppendConnector = function(a, b, c, d) {
    this._addConnector(Gridifier.Connectors.TYPES.APPEND.REVERSED, a, b, c, d);
};

Gridifier.Connectors.prototype.addPrependConnector = function(a, b, c, d) {
    this._addConnector(Gridifier.Connectors.TYPES.PREPEND.DEFAULT, a, b, c, d);
};

Gridifier.Connectors.prototype.addReversedPrependConnector = function(a, b, c, d) {
    this._addConnector(Gridifier.Connectors.TYPES.PREPEND.REVERSED, a, b, c, d);
};

Gridifier.Connectors.prototype.count = function() {
    return this._connectors.length;
};

Gridifier.Connectors.prototype.setNextFlushCallback = function(a) {
    this._nextFlushCallback = a;
};

Gridifier.Connectors.prototype.flush = function() {
    this._connectors = [];
    if (typeof this._nextFlushCallback == "function") {
        this._nextFlushCallback();
        this._nextFlushCallback = null;
    }
};

Gridifier.Connectors.prototype.get = function() {
    return this._connectors;
};

Gridifier.Connectors.prototype.set = function(a) {
    this._connectors = a;
};

Gridifier.Connectors.prototype.getClone = function() {
    var a = [];
    for (var b = 0; b < this._connectors.length; b++) {
        a.push({
            type: this._connectors[b].type,
            side: this._connectors[b].side,
            x: this._connectors[b].x,
            y: this._connectors[b].y,
            itemGUID: this._connectors[b].itemGUID,
            connectorIndex: b
        });
    }
    return a;
};