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

var HgReversedPrepender = function() {
    this._position = new Position(this, OPS.REV_PREPEND, function(a, b) {
        a.create(CRS.PREPEND.REV, CRS.LEFT.TOP, 0, 0);
    }, function(a, b) {
        if (a.y2 + 1 <= grid.y2()) {
            connectors.create(CRS.PREPEND.REV, CRS.BOTTOM.RIGHT, parseFloat(a.x2), parseFloat(a.y2 + 1), Dom.int(b));
        }
        connectors.create(CRS.PREPEND.REV, CRS.LEFT.TOP, parseFloat(a.x1 - 1), parseFloat(a.y1), Dom.int(b));
    }, function(a) {
        return a.y2 > rounder.fixHighRounding(grid.y2());
    });
};

proto(HgReversedPrepender, {
    position: function(a) {
        var b = this._position;
        b.initCrs("Left", "Right", "Left");
        var c = b.filterCrs("Appended", CRS.LEFT.TOP, "Left", "Top", "Prepend");
        var d = b.createCn(a, b.findCnCoords(a, c, "HgPrepend", "BeforeX", "x1", "Bigger", "X"), c);
        guid.markIfFirstPrepended(a);
        var e = b.fixAllXYPosAfterPrepend(d, connectors.get());
        connections.attachToRanges(d);
        b.cleanCrs("Left", "Right", "Left");
        if (e) b.renderAfterPrependFix(d);
        b.render(a, d);
    }
});