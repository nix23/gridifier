/* Gridifier v2.~.~ source file for custom build.
 * Async Responsive HTML Grids
 * http://gridifier.io
 * 
 * Gridifier is dual-licensed:
 *   GPLV3 per non-commercial usage; 
 *   Commercial license per commercial usage.
 * Read http://gridifier.io/license for details.
 * Copyright 2015 nTech
 */

var HgAppender = function() {
    this._position = new Position(this, OPS.APPEND, function(a) {
        a.create(CRS.APPEND.DEF, CRS.RIGHT.TOP, 0, 0);
    }, function(a, b) {
        if (a.y2 + 1 <= grid.y2()) {
            connectors.create(CRS.APPEND.DEF, CRS.BOTTOM.LEFT, parseFloat(a.x1), parseFloat(a.y2 + 1), Dom.int(b));
        }
        connectors.create(CRS.APPEND.DEF, CRS.RIGHT.TOP, parseFloat(a.x2 + 1), parseFloat(a.y1), Dom.int(b));
    }, function(a) {
        return a.y2 > rounder.fixHighRounding(grid.y2());
    });
};

proto(HgAppender, {
    position: function(a) {
        var b = this._position;
        b.initCrs("Right", "Left", "Right");
        var c = b.filterCrs("Prepended", CRS.RIGHT.TOP, "Right", "Top", "Append");
        var d = b.createCn(a, b.findCnCoords(a, c, "HgAppend", "BehindX", "x2", "Smaller", "X"), c);
        connections.attachToRanges(d);
        b.cleanCrs("Right", "Left", "Right");
        b.render(a, d);
    }
});