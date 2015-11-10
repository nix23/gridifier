/* Gridifier v2.~.~ source file for custom build.
 * Async Responsive HTML Grids
 * http://gridifier.io
 * 
 * Gridifier is dual-licensed:
 *   Non-commercial license - https://creativecommons.org/licenses/by-nc-sa/4.0/.
 *   Commercial license - http://gridifier.io/license (Commercial license).
 * Read http://gridifier.io/license for details.
 * Copyright 2015 nTech
 */

Discretizer = function() {
    this._cells = [];
};

proto(Discretizer, {
    cells: function() {
        return this._cells;
    },
    discretize: function() {
        var a = cnsCore.getMinWidth();
        var b = cnsCore.getMinHeight();
        var c = settings.eq("append", "default") ? "Def" : "Rev";
        this._cells = discretizerCore["discretizeOn" + c + "Append"](a, b);
    },
    intCellsToCoords: function(a) {
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
    },
    markIntCellsBy: function(a) {
        for (var b = 0; b < this._cells.length; b++) {
            for (var c = 0; c < this._cells[b].length; c++) {
                var d = this._cells[b][c];
                var e = {
                    x1: d.centerX,
                    x2: d.centerX,
                    y1: d.centerY,
                    y2: d.centerY
                };
                this._cells[b][c].isInt = cnsIntersector.isIntersectingAny([ e ], a);
            }
        }
    },
    getAllCellsWithIntCenter: function(a) {
        var b = [];
        var c = [];
        var d = {
            rows: 0,
            cols: 0
        };
        var e = function(a) {
            for (var b = 0; b < c.length; b++) {
                if (c[b] == a) return true;
            }
            return false;
        };
        for (var f = 0; f < this._cells.length; f++) {
            var g = false;
            var h = [];
            for (var i = 0; i < this._cells[f].length; i++) {
                var j = this._cells[f][i];
                var k = {
                    x1: j.centerX,
                    x2: j.centerX,
                    y1: j.centerY,
                    y2: j.centerY
                };
                if (cnsIntersector.isIntersectingAny([ k ], a)) {
                    h.push(j);
                    if (!g) {
                        d.rows++;
                        g = true;
                    }
                    if (!e(i)) {
                        d.cols++;
                        c.push(i);
                    }
                }
            }
            if (h.length > 0) b.push(h);
        }
        return {
            intCells: b,
            "int": d
        };
    }
});