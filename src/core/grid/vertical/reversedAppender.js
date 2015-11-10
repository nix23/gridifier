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

var VgReversedAppender = function() {
    this._position = new Position(this, OPS.REV_APPEND, function(a, b) {
        a.create(CRS.APPEND.REV, CRS.LEFT.TOP, parseFloat(b.x2()), 0);
    }, function(a, b) {
        if (a.x1 - 1 >= 0) {
            connectors.create(CRS.APPEND.REV, CRS.LEFT.TOP, parseFloat(a.x1 - 1), parseFloat(a.y1), Dom.int(b));
        }
        connectors.create(CRS.APPEND.REV, CRS.BOTTOM.RIGHT, parseFloat(a.x2), parseFloat(a.y2 + 1), Dom.int(b));
    }, function(a) {
        return a.x1 < rounder.fixLowRounding(0);
    });
};

proto(VgReversedAppender, {
    position: function(a) {
        var b = this._position;
        b.initCrs("Bottom", "Top", "Bottom");
        var c = b.filterCrs("Prepended", CRS.BOTTOM.RIGHT, "Bottom", "Right", "Append");
        var d = b.createCn(a, b.findCnCoords(a, c, "VgAppend", "BelowY", "y2", "Smaller", "Y"), c);
        connections.attachToRanges(d);
        b.cleanCrs("Bottom", "Top", "Bottom");
        b.render(a, d);
    }
});