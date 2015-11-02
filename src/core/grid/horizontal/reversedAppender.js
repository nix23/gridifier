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

var HgReversedAppender = function() {
    this._position = new Position(this, OPS.REV_APPEND, function(a, b) {
        a.create(CRS.APPEND.REV, CRS.TOP.LEFT, 0, parseFloat(b.y2()));
    }, function(a, b) {
        if (a.y1 - 1 >= 0) {
            connectors.create(CRS.APPEND.REV, CRS.TOP.LEFT, parseFloat(a.x1), parseFloat(a.y1 - 1), Dom.int(b));
        }
        connectors.create(CRS.APPEND.REV, CRS.RIGHT.BOTTOM, parseFloat(a.x2 + 1), parseFloat(a.y2), Dom.int(b));
    }, function(a) {
        return a.y1 < rounder.fixLowRounding(0);
    });
};

proto(HgReversedAppender, {
    position: function(a) {
        var b = this._position;
        b.initCrs("Right", "Left", "Right");
        var c = b.filterCrs("Prepended", CRS.RIGHT.BOTTOM, "Right", "Bottom", "Append");
        var d = b.createCn(a, b.findCnCoords(a, c, "HgAppend", "BehindX", "x2", "Smaller", "X"), c);
        connections.attachToRanges(d);
        b.cleanCrs("Right", "Left", "Right");
        b.render(a, d);
    }
});