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

var HgPrepender = function() {
    this._position = new Position(this, OPS.PREPEND, function(a, b) {
        a.create(CRS.PREPEND.DEF, CRS.TOP.RIGHT, 0, b.y2());
    }, function(a, b) {
        if (a.y1 - 1 >= 0) {
            connectors.create(CRS.PREPEND.DEF, CRS.TOP.RIGHT, parseFloat(a.x2), parseFloat(a.y1 - 1), Dom.int(b));
        }
        connectors.create(CRS.PREPEND.DEF, CRS.LEFT.BOTTOM, parseFloat(a.x1 - 1), parseFloat(a.y2), Dom.int(b));
    }, function(a) {
        return a.y1 < rounder.fixLowRounding(0);
    });
};

proto(HgPrepender, {
    position: function(a) {
        var b = this._position;
        b.initCrs("Left", "Right", "Left");
        var c = b.filterCrs("Appended", CRS.LEFT.BOTTOM, "Left", "Bottom", "Prepend");
        var d = b.createCn(a, b.findCnCoords(a, c, "HgPrepend", "BeforeX", "x1", "Bigger", "X"), c);
        guid.markIfFirstPrepended(a);
        var e = b.fixAllXYPosAfterPrepend(d, connectors.get());
        connections.attachToRanges(d);
        b.cleanCrs("Left", "Right", "Left");
        if (e) b.renderAfterPrependFix(d);
        b.render(a, d);
    }
});