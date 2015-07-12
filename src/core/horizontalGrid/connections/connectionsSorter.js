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

Gridifier.HorizontalGrid.ConnectionsSorter = function(a, b, c) {
    var d = this;
    this._connections = null;
    this._settings = null;
    this._guid = null;
    this._css = {};
    this._construct = function() {
        d._connections = a;
        d._settings = b;
        d._guid = c;
    };
    this._bindEvents = function() {
    };
    this._unbindEvents = function() {
    };
    this.destruct = function() {
        d._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.HorizontalGrid.ConnectionsSorter.prototype.sortConnectionsPerReappend = function(a) {
    var b = this;
    if (this._settings.isDisabledSortDispersion()) {
        a.sort(function(a, c) {
            if (b._guid.getItemGUID(a.item) > b._guid.getItemGUID(c.item)) return 1;
            return -1;
        });
    } else if (this._settings.isCustomSortDispersion() || this._settings.isCustomAllEmptySpaceSortDispersion()) {
        if (this._settings.isDefaultAppend()) {
            a.sort(function(a, b) {
                if (Dom.areRoundedOrFlooredValuesEqual(a.x1, b.x1)) {
                    if (a.y2 < b.y2) return -1; else return 1;
                } else {
                    if (a.x1 < b.x1) return -1; else return 1;
                }
            });
        } else if (this._settings.isReversedAppend()) {
            a.sort(function(a, b) {
                if (Dom.areRoundedOrFlooredValuesEqual(a.x1, b.x1)) {
                    if (a.y1 > b.y1) return -1; else return 1;
                } else {
                    if (a.x1 < b.x1) return -1; else return 1;
                }
            });
        }
    }
    if (this._settings.isCustomAllEmptySpaceSortDispersion()) {
        var c = this._settings.getRetransformSort();
        a = c(a);
    }
    return a;
};