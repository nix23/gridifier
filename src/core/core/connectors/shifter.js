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

var CrsShifter = function() {
    this._crs = null;
    this._newCrs = null;
};

proto(CrsShifter, {
    attach: function(a) {
        this._crs = a;
        this._newCrs = [];
    },
    getNew: function() {
        return this._newCrs;
    },
    _createShifted: function(a, b, c) {
        this._newCrs.push({
            type: c.type,
            side: CRS.SHIFTED,
            x: parseFloat(a),
            y: parseFloat(b),
            itemGUID: Dom.int(c.itemGUID)
        });
    },
    shiftAll: function() {
        var a = [ [ CRS.LEFT.TOP, "LeftTop" ], [ CRS.LEFT.BOTTOM, "LeftBottom" ], [ CRS.BOTTOM.RIGHT, "BottomRight" ], [ CRS.BOTTOM.LEFT, "TopLeft" ], [ CRS.TOP.LEFT, "TopLeft" ], [ CRS.TOP.RIGHT, "BottomRight" ], [ CRS.RIGHT.BOTTOM, "RightBottom" ], [ CRS.RIGHT.TOP, "RightTop" ] ];
        for (var b = 0; b < this._crs.length; b++) {
            this._newCrs.push(this._crs[b]);
            for (var c = 0; c < a.length; c++) {
                if (connectors.eq(this._crs[b], a[c][0])) {
                    this["_shift" + a[c][1]](this._crs[b]);
                    break;
                }
            }
        }
    },
    _shiftLeftTop: function(a) {
        var b = crsIntersector.mostBottomFromTopOrTopLeft(a);
        if (b != null) {
            if (b.y2 + 1 != a.y) this._createShifted(a.x, b.y2 + 1, a);
        } else if (a.y != 0) this._createShifted(a.x, 0, a);
    },
    _shiftLeftBottom: function(a) {
        var b = crsIntersector.mostTopFromBottomOrBottomLeft(a);
        if (b != null) {
            if (b.y1 - 1 != a.y) this._createShifted(a.x, b.y1 - 1, a);
        } else {
            var c = cnsCore.getMaxY();
            if (c != 0 && c - 1 != a.y) this._createShifted(a.x, c - 1, a);
        }
    },
    _shiftBottomRight: function(a) {
        var b = crsIntersector.mostLeftFromRight(a);
        if (b != null) {
            if (b.x1 - 1 != a.x) this._createShifted(b.x1 - 1, a.y, a);
        } else {
            if (settings.eq("grid", "horizontal") && a.type == CRS.PREPEND.DEF) return;
            if (a.x != grid.x2()) this._createShifted(grid.x2(), a.y, a);
        }
    },
    _shiftTopLeft: function(a) {
        var b = crsIntersector.mostRightFromLeft(a);
        if (b != null) {
            if (b.x2 + 1 != a.x) this._createShifted(b.x2 + 1, a.y, a);
        } else if (a.x != 0) this._createShifted(0, a.y, a);
    },
    _shiftRightBottom: function(a) {
        var b = crsIntersector.mostTopFromBottomOrBottomRight(a);
        if (b != null) {
            if (b.y1 - 1 != a.y) this._createShifted(a.x, b.y1 - 1, a);
        } else {
            var c = cnsCore.getMaxY();
            if (c != 0 && c - 1 != a.y) this._createShifted(a.x, c - 1, a);
        }
    },
    _shiftRightTop: function(a) {
        var b = crsIntersector.mostBottomFromTopOrTopRight(a);
        if (b != null) {
            if (b.y2 + 1 != a.y) this._createShifted(a.x, b.y2 + 1, a);
        } else if (a.y != 0) this._createShifted(a.x, 0, a);
    },
    _shiftAllTo: function(a, b, c) {
        this._newCrs = this._crs;
        for (var d = 0; d < this._newCrs.length; d++) {
            if (this._newCrs[d].side == a) this._newCrs[d][b] = c;
        }
    },
    shiftAllToRight: function(a) {
        this._shiftAllTo(a, "x", grid.x2());
    },
    shiftAllToLeft: function(a) {
        this._shiftAllTo(a, "x", 0);
    },
    shiftAllToTop: function(a) {
        this._shiftAllTo(a, "y", 0);
    },
    shiftAllToBottom: function(a) {
        this._shiftAllTo(a, "y", grid.y2());
    }
});