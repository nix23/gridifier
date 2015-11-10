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

DragifierCells = function() {};

proto(DragifierCells, {
    getIntCellsData: function(a) {
        if (a.int.cols == 0 && a.int.rows == 0) {
            a.int.cols = 1;
            a.int.rows = 1;
        }
        return a;
    },
    isAnyIntCellEmpty: function(a) {
        var b = a.intCells;
        var c = false;
        for (var d = 0; d < b.length; d++) {
            for (var e = 0; e < b[d].length; e++) {
                if (!b[d][e].isInt) c = true;
            }
        }
        return c;
    },
    isIntEnoughRowsAndCols: function(a, b) {
        if (b.int.rows < a.int.rows || b.int.cols < a.int.cols) return false;
        return true;
    },
    normalizeOverflowedCells: function(a, b, c) {
        if (c.int.rows > b.int.rows) {
            var d = c.int.rows - b.int.rows;
            for (var e = 0; e < d; e++) a.pop();
        }
        if (c.int.cols > b.int.cols) {
            var f = c.int.cols - b.int.cols;
            for (var g = 0; g < a.length; g++) {
                for (var e = 0; e < f; e++) a[g].pop();
            }
        }
        var h = [];
        for (var g = 0; g < a.length; g++) {
            for (var i = 0; i < a[g].length; i++) h.push(a[g][i]);
        }
        return h;
    }
});