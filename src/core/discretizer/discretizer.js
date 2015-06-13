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

Gridifier.Discretizer = function(a, b, c, d) {
    var e = this;
    this._gridifier = null;
    this._connections = null;
    this._settings = null;
    this._sizesResolverManager = null;
    this._discretizerCore = null;
    this._discretizationDemonstrator = null;
    this._showDemonstrator = false;
    this._cells = [];
    this._css = {};
    this._construct = function() {
        e._gridifier = a;
        e._connections = b;
        e._settings = c;
        e._sizesResolverManager = d;
        if (e._settings.isVerticalGrid()) {
            e._discretizerCore = new Gridifier.Discretizer.VerticalCore(e._gridifier, e._settings, e._sizesResolverManager);
        } else if (e._settings.isHorizontalGrid()) {
            e._discretizerCore = new Gridifier.Discretizer.HorizontalCore(e._gridifier, e._settings, e._sizesResolverManager);
        }
        if (e._showDemonstrator) {
            e._discretizationDemonstrator = new Gridifier.Discretizer.Demonstrator(e._gridifier, e._settings);
        } else {
            e._discretizationDemonstrator = {
                create: function() {
                    return;
                },
                update: function() {
                    return;
                },
                "delete": function() {
                    return;
                }
            };
        }
        e._bindEvents();
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        e._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.Discretizer.IS_INTERSECTED_BY_ITEM = "isIntersectedByItem";

Gridifier.Discretizer.CELL_CENTER_X = "centerX";

Gridifier.Discretizer.CELL_CENTER_Y = "centerY";

Gridifier.Discretizer.prototype.discretizeGrid = function() {
    var a = this._connections.getMinConnectionWidth();
    var b = this._connections.getMinConnectionHeight();
    if (this._settings.isDefaultAppend()) {
        this._cells = this._discretizerCore.discretizeGridWithDefaultAppend(a, b);
    } else if (this._settings.isReversedAppend()) {
        this._cells = this._discretizerCore.discretizeGridWithReversedAppend(a, b);
    }
};

Gridifier.Discretizer.prototype.intersectedCellsToCoords = function(a) {
    var b = {
        x1: a[0].x1,
        x2: a[0].x2,
        y1: a[0].y1,
        y2: a[0].y2
    };
    for (var c = 1; c < a.length; c++) {
        if (a[c].x1 < b.x1) b.x1 = a[c].x1;
        if (a[c].x2 > b.x2) b.x2 = a[c].x2;
        if (a[c].y1 < b.y1) b.y1 = a[c].y1;
        if (a[c].y2 > b.y2) b.y2 = a[c].y2;
    }
    return b;
};

Gridifier.Discretizer.prototype.markCellsIntersectedByItem = function(a, b) {
    for (var c = 0; c < this._cells.length; c++) {
        for (var d = 0; d < this._cells[c].length; d++) {
            var e = {
                x1: this._cells[c][d][Gridifier.Discretizer.CELL_CENTER_X],
                x2: this._cells[c][d][Gridifier.Discretizer.CELL_CENTER_X],
                y1: this._cells[c][d][Gridifier.Discretizer.CELL_CENTER_Y],
                y2: this._cells[c][d][Gridifier.Discretizer.CELL_CENTER_Y]
            };
            if (this._isCellIntersectedBy(e, b)) this._cells[c][d][Gridifier.Discretizer.IS_INTERSECTED_BY_ITEM] = true; else this._cells[c][d][Gridifier.Discretizer.IS_INTERSECTED_BY_ITEM] = false;
        }
    }
};

Gridifier.Discretizer.prototype.getAllCellsWithIntersectedCenterData = function(a) {
    var b = [];
    var c = 0;
    var d = 0;
    var e = [];
    var f = function(a) {
        for (var b = 0; b < e.length; b++) {
            if (e[b] == a) return true;
        }
        return false;
    };
    for (var g = 0; g < this._cells.length; g++) {
        var h = false;
        var i = [];
        for (var j = 0; j < this._cells[g].length; j++) {
            var k = {
                x1: this._cells[g][j][Gridifier.Discretizer.CELL_CENTER_X],
                x2: this._cells[g][j][Gridifier.Discretizer.CELL_CENTER_X],
                y1: this._cells[g][j][Gridifier.Discretizer.CELL_CENTER_Y],
                y2: this._cells[g][j][Gridifier.Discretizer.CELL_CENTER_Y]
            };
            if (this._isCellIntersectedBy(k, a)) {
                i.push(this._cells[g][j]);
                if (!h) {
                    c++;
                    h = true;
                }
                if (!f(j)) {
                    d++;
                    e.push(j);
                }
            }
        }
        if (i.length > 0) b.push(i);
    }
    return {
        cellsWithIntersectedCenter: b,
        intersectedRowsCount: c,
        intersectedColsCount: d
    };
};

Gridifier.Discretizer.prototype._isCellIntersectedBy = function(a, b) {
    var c = b.y1 < a.y1 && b.y2 < a.y1;
    var d = b.y1 > a.y2 && b.y2 > a.y2;
    var e = b.x1 < a.x1 && b.x2 < a.x1;
    var f = b.x1 > a.x2 && b.x2 > a.x2;
    if (!c && !d && !e && !f) return true; else return false;
};

Gridifier.Discretizer.prototype.normalizeItemNewConnectionHorizontalCoords = function(a, b) {
    return this._discretizerCore.normalizeItemNewConnectionHorizontalCoords(a, b);
};

Gridifier.Discretizer.prototype.normalizeItemNewConnectionVerticalCoords = function(a, b) {
    return this._discretizerCore.normalizeItemNewConnectionVerticalCoords(a, b);
};

Gridifier.Discretizer.prototype.createDemonstrator = function() {
    this._discretizationDemonstrator.create(this._cells);
};

Gridifier.Discretizer.prototype.updateDemonstrator = function() {
    this._discretizationDemonstrator.update(this._cells);
};

Gridifier.Discretizer.prototype.deleteDemonstrator = function() {
    this._discretizationDemonstrator["delete"].call(this);
};