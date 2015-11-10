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

var VgAppender = function() {
    this._position = new Position(this, OPS.APPEND, function(a) {
        a.create(CRS.APPEND.DEF, CRS.RIGHT.TOP, 0, 0);
    }, function(a, b) {
        if (a.x2 + 1 <= grid.x2()) {
            connectors.create(CRS.APPEND.DEF, CRS.RIGHT.TOP, parseFloat(a.x2 + 1), parseFloat(a.y1), Dom.int(b));
        }
        connectors.create(CRS.APPEND.DEF, CRS.BOTTOM.LEFT, parseFloat(a.x1), parseFloat(a.y2 + 1), Dom.int(b));
    }, function(a) {
        return a.x2 > rounder.fixHighRounding(grid.x2());
    });
};

proto(VgAppender, {
    position: function(a) {
        var b = this._position;
        b.initCrs("Bottom", "Top", "Bottom");
        var c = b.filterCrs("Prepended", CRS.BOTTOM.LEFT, "Bottom", "Left", "Append");
        var d = b.createCn(a, b.findCnCoords(a, c, "VgAppend", "BelowY", "y2", "Smaller", "Y"), c);
        connections.attachToRanges(d);
        b.cleanCrs("Bottom", "Top", "Bottom");
        b.render(a, d);
    }
});