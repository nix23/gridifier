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

Gridifier.Resorter = function(a, b, c, d, e) {
    var f = this;
    this._gridifier = null;
    this._collector = null;
    this._connections = null;
    this._settings = null;
    this._guid = null;
    this._css = {};
    this._construct = function() {
        f._gridifier = a;
        f._collector = b;
        f._connections = c;
        f._settings = d;
        f._guid = e;
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        f._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.Resorter.prototype.resort = function() {
    var a = this._collector.sortCollection(this._collector.collectAllConnectedItems());
    if (this._settings.isCustomAllEmptySpaceSortDispersion()) {
        if (this._settings.isHorizontalGrid()) {
            this._resortAllHorizontalGridConnectionsPerReappend(a);
        } else if (this._settings.isVerticalGrid()) {
            this._resortAllVerticalGridConnectionsPerReappend(a);
        }
    }
    this._guid.reinit();
    for (var b = 0; b < a.length; b++) {
        this._guid.markNextAppendedItem(a[b]);
    }
};

Gridifier.Resorter.prototype._resortAllHorizontalGridConnectionsPerReappend = function(a) {
    var b = 0;
    for (var c = 0; c < a.length; c++) {
        var d = this._connections.findConnectionByItem(a[c]);
        d.x1 = b;
        d.x2 = b;
        d.y1 = 0;
        d.y2 = 0;
        b++;
    }
};

Gridifier.Resorter.prototype._resortAllVerticalGridConnectionsPerReappend = function(a) {
    var b = 0;
    for (var c = 0; c < a.length; c++) {
        var d = this._connections.findConnectionByItem(a[c]);
        d.x1 = 0;
        d.x2 = 0;
        d.y1 = b;
        d.y2 = b;
        b++;
    }
};