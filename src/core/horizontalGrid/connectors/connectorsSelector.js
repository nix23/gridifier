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

Gridifier.HorizontalGrid.ConnectorsSelector = function(a) {
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

Gridifier.HorizontalGrid.ConnectorsSelector.prototype.attachConnectors = function(a) {
    this._connectors = a;
};

Gridifier.HorizontalGrid.ConnectorsSelector.prototype.getSelectedConnectors = function() {
    return this._connectors;
};

Gridifier.HorizontalGrid.ConnectorsSelector.prototype.selectOnlyMostRightConnectorFromSide = function(a) {
    var b = null;
    var c = null;
    var d = this._connectors.length;
    while (d--) {
        if (this._connectors[d].side == a) {
            if (b == null || this._connectors[d].x > c) {
                b = this._connectors[d].itemGUID;
                c = this._connectors[d].x;
            }
        }
    }
    if (b == null) return;
    var d = this._connectors.length;
    while (d--) {
        if (this._connectors[d].side == a && this._connectors[d].itemGUID != b) this._connectors.splice(d, 1);
    }
};

Gridifier.HorizontalGrid.ConnectorsSelector.prototype.selectOnlyMostLeftConnectorFromSide = function(a) {
    var b = null;
    var c = null;
    var d = this._connectors.length;
    while (d--) {
        if (this._connectors[d].side == a) {
            if (b == null || this._connectors[d].x < c) {
                b = this._connectors[d].itemGUID;
                c = this._connectors[d].x;
            }
        }
    }
    if (b == null) return;
    var d = this._connectors.length;
    while (d--) {
        if (this._connectors[d].side == a && this._connectors[d].itemGUID != b) this._connectors.splice(d, 1);
    }
};

Gridifier.HorizontalGrid.ConnectorsSelector.prototype._isInitialConnector = function(a) {
    return a.itemGUID == Gridifier.Connectors.INITIAL_CONNECTOR_ITEM_GUID;
};

Gridifier.HorizontalGrid.ConnectorsSelector.prototype.selectOnlySpecifiedSideConnectorsOnAppendedItems = function(a) {
    for (var b = 0; b < this._connectors.length; b++) {
        if (!this._isInitialConnector(this._connectors[b]) && !this._guid.wasItemPrepended(this._connectors[b].itemGUID) && a != this._connectors[b].side) {
            this._connectors.splice(b, 1);
            b--;
        }
    }
};

Gridifier.HorizontalGrid.ConnectorsSelector.prototype.selectOnlySpecifiedSideConnectorsOnPrependedItems = function(a) {
    for (var b = 0; b < this._connectors.length; b++) {
        if (!this._isInitialConnector(this._connectors[b]) && this._guid.wasItemPrepended(this._connectors[b].itemGUID) && a != this._connectors[b].side) {
            this._connectors.splice(b, 1);
            b--;
        }
    }
};