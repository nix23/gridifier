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

Gridifier.VerticalGrid.ConnectorsSelector = function(a) {
    var b = this;
    this._connectors = null;
    this._guid = null;
    this._css = {};
    this._construct = function() {
        b._guid = a;
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        b._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.VerticalGrid.ConnectorsSelector.prototype.attachConnectors = function(a) {
    this._connectors = a;
};

Gridifier.VerticalGrid.ConnectorsSelector.prototype.getSelectedConnectors = function() {
    return this._connectors;
};

Gridifier.VerticalGrid.ConnectorsSelector.prototype.selectOnlyMostBottomConnectorFromSide = function(a) {
    var b = null;
    var c = null;
    var d = this._connectors.length;
    while (d--) {
        if (this._connectors[d].side == a) {
            if (b == null || this._connectors[d].y > c) {
                b = this._connectors[d].itemGUID;
                c = this._connectors[d].y;
            }
        }
    }
    if (b == null) return;
    var d = this._connectors.length;
    while (d--) {
        if (this._connectors[d].side == a && this._connectors[d].itemGUID != b) this._connectors.splice(d, 1);
    }
};

Gridifier.VerticalGrid.ConnectorsSelector.prototype.selectOnlyMostTopConnectorFromSide = function(a) {
    var b = null;
    var c = null;
    var d = this._connectors.length;
    while (d--) {
        if (this._connectors[d].side == a) {
            if (b == null || this._connectors[d].y < c) {
                b = this._connectors[d].itemGUID;
                c = this._connectors[d].y;
            }
        }
    }
    if (b == null) return;
    var d = this._connectors.length;
    while (d--) {
        if (this._connectors[d].side == a && this._connectors[d].itemGUID != b) this._connectors.splice(d, 1);
    }
};

Gridifier.VerticalGrid.ConnectorsSelector.prototype._isInitialConnector = function(a) {
    return a.itemGUID == Gridifier.Connectors.INITIAL_CONNECTOR_ITEM_GUID;
};

Gridifier.VerticalGrid.ConnectorsSelector.prototype.selectOnlySpecifiedSideConnectorsOnAppendedItems = function(a) {
    for (var b = 0; b < this._connectors.length; b++) {
        if (!this._isInitialConnector(this._connectors[b]) && !this._guid.wasItemPrepended(this._connectors[b].itemGUID) && a != this._connectors[b].side) {
            this._connectors.splice(b, 1);
            b--;
        }
    }
};

Gridifier.VerticalGrid.ConnectorsSelector.prototype.selectOnlySpecifiedSideConnectorsOnPrependedItems = function(a) {
    for (var b = 0; b < this._connectors.length; b++) {
        if (!this._isInitialConnector(this._connectors[b]) && this._guid.wasItemPrepended(this._connectors[b].itemGUID) && a != this._connectors[b].side) {
            this._connectors.splice(b, 1);
            b--;
        }
    }
};