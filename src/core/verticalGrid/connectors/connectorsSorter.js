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

Gridifier.VerticalGrid.ConnectorsSorter = function() {
    var a = this;
    this._connectors = null;
    this._css = {};
    this._construct = function() {};
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        a._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.VerticalGrid.ConnectorsSorter.prototype.attachConnectors = function(a) {
    this._connectors = a;
};

Gridifier.VerticalGrid.ConnectorsSorter.prototype.getConnectors = function() {
    return this._connectors;
};

Gridifier.VerticalGrid.ConnectorsSorter.prototype.sortConnectorsForPrepend = function(a) {
    var b = this;
    this._connectors.sort(function(b, c) {
        if (Dom.areRoundedOrCeiledValuesEqual(b.y, c.y)) {
            if (a == Gridifier.PREPEND_TYPES.DEFAULT_PREPEND) {
                if (b.x > c.x) return 1; else return -1;
            } else if (a == Gridifier.PREPEND_TYPES.REVERSED_PREPEND) {
                if (b.x < c.x) return 1; else return -1;
            }
        } else {
            if (b.y < c.y) return 1; else return -1;
        }
    });
};

Gridifier.VerticalGrid.ConnectorsSorter.prototype.sortConnectorsForAppend = function(a) {
    var b = this;
    this._connectors.sort(function(b, c) {
        if (Dom.areRoundedOrFlooredValuesEqual(b.y, c.y)) {
            if (a == Gridifier.APPEND_TYPES.DEFAULT_APPEND) {
                if (b.x > c.x) return -1; else return 1;
            } else if (a == Gridifier.APPEND_TYPES.REVERSED_APPEND) {
                if (b.x < c.x) return -1; else return 1;
            }
        } else {
            if (b.y < c.y) return -1; else return 1;
        }
    });
};