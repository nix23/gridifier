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

Gridifier.Dragifier.Cells = function(a) {
    var b = this;
    this._discretizer = null;
    this._css = {};
    this._construct = function() {
        b._discretizer = a;
        b._bindEvents();
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        b._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.Dragifier.Cells.prototype.getIntersectedByDraggableItemCellCentersData = function(a) {
    var b = this._discretizer.getAllCellsWithIntersectedCenterData(a);
    if (b.intersectedColsCount == 0 && b.intersectedRowsCount == 0) {
        b.intersectedRowsCount = 1;
        b.intersectedColsCount = 1;
    }
    return b;
};

Gridifier.Dragifier.Cells.prototype.isAtLeastOneOfIntersectedCellCentersEmpty = function(a) {
    var b = a.cellsWithIntersectedCenter;
    var c = false;
    for (var d = 0; d < b.length; d++) {
        for (var e = 0; e < b[d].length; e++) {
            if (!b[d][e][Gridifier.Discretizer.IS_INTERSECTED_BY_ITEM]) c = true;
        }
    }
    return c;
};

Gridifier.Dragifier.Cells.prototype.isIntersectingEnoughRowsAndCols = function(a, b) {
    if (b.intersectedRowsCount < a.intersectedRowsCount || b.intersectedColsCount < a.intersectedColsCount) {
        return false;
    }
    return true;
};

Gridifier.Dragifier.Cells.prototype.normalizeCellsWithMaybeIntersectionOverflows = function(a, b, c) {
    if (c.intersectedRowsCount > b.intersectedRowsCount) {
        var d = c.intersectedRowsCount - b.intersectedRowsCount;
        for (var e = 0; e < d; e++) {
            a.pop();
        }
    }
    if (c.intersectedColsCount > b.intersectedColsCount) {
        var f = c.intersectedColsCount - b.intersectedColsCount;
        for (var g = 0; g < a.length; g++) {
            for (var e = 0; e < f; e++) {
                a[g].pop();
            }
        }
    }
    var h = [];
    for (var g = 0; g < a.length; g++) {
        for (var i = 0; i < a[g].length; i++) {
            h.push(a[g][i]);
        }
    }
    return h;
};