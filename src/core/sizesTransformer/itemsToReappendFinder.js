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

Gridifier.SizesTransformer.ItemsToReappendFinder = function(a, b, c) {
    var d = this;
    d._connections = null;
    d._connectionsSorter = null;
    d._settings = null;
    this._css = {};
    this._construct = function() {
        d._connections = a;
        d._connectionsSorter = b;
        d._settings = c;
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        d._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.SizesTransformer.ItemsToReappendFinder.prototype.findAllOnSizesTransform = function(a, b) {
    var c = this._connections.get();
    for (var d = 0; d < c.length; d++) {
        if (c[d][Gridifier.SizesTransformer.RESTRICT_CONNECTION_COLLECT]) continue;
        if (this._settings.isDisabledSortDispersion() && this._settings.isDefaultIntersectionStrategy()) {
            if (c[d].itemGUID >= b.itemGUID) {
                a.push(c[d]);
                c.splice(d, 1);
                d--;
            }
        } else if (this._settings.isNoIntersectionsStrategy()) {
            if (this._settings.isVerticalGrid()) {
                var e = c[d].y2 >= b.y1;
            } else if (this._settings.isHorizontalGrid()) {
                var e = c[d].x2 >= b.x1;
            }
            if (e) {
                a.push(c[d]);
                c.splice(d, 1);
                d--;
            }
        } else if (this._settings.isCustomSortDispersion() || this._settings.isCustomAllEmptySpaceSortDispersion()) {
            if (this._settings.isVerticalGrid()) {
                if (this._settings.isDefaultAppend()) {
                    var e = c[d].y1 > b.y1 || c[d].y1 == b.y1 && c[d].x1 <= b.x2;
                } else if (this._settings.isReversedAppend()) {
                    var e = c[d].y1 > b.y1 || c[d].y1 == b.y1 && c[d].x1 >= b.x1;
                }
            } else if (this._settings.isHorizontalGrid()) {
                if (this._settings.isDefaultAppend()) {
                    var e = c[d].x1 > b.x1 || c[d].x1 == b.x1 && c[d].y1 >= b.y1;
                } else if (this._settings.isReversedAppend()) {
                    var e = c[d].x1 > b.x1 || c[d].x1 == b.x1 && c[d].y1 <= b.y2;
                }
            }
            if (e) {
                a.push(c[d]);
                c.splice(d, 1);
                d--;
            }
        }
    }
    var f = this._connectionsSorter.sortConnectionsPerReappend(a);
    var g = [];
    for (var d = 0; d < f.length; d++) {
        g.push(f[d].item);
    }
    return {
        itemsToReappend: g,
        connectionsToReappend: a,
        firstConnectionToReappend: f[0]
    };
};