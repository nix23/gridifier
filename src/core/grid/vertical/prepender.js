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

var VgPrepender = function() {
    this._position = new Position(this, OPS.PREPEND, function(a) {
        a.create(CRS.PREPEND.DEF, CRS.RIGHT.BOTTOM, 0, 0);
    }, function(a, b) {
        if (a.x2 + 1 <= grid.x2()) {
            connectors.create(CRS.PREPEND.DEF, CRS.RIGHT.BOTTOM, parseFloat(a.x2 + 1), parseFloat(a.y2), Dom.int(b));
        }
        connectors.create(CRS.PREPEND.DEF, CRS.TOP.LEFT, parseFloat(a.x1), parseFloat(a.y1 - 1), Dom.int(b));
    }, function(a) {
        return a.x2 > rounder.fixHighRounding(grid.x2());
    });
};

proto(VgPrepender, {
    position: function(a) {
        var b = this._position;
        b.initCrs("Top", "Bottom", "Top");
        var c = b.filterCrs("Appended", CRS.TOP.LEFT, "Top", "Left", "Prepend");
        var d = b.createCn(a, b.findCnCoords(a, c, "VgPrepend", "AboveY", "y1", "Bigger", "Y"), c);
        guid.markIfFirstPrepended(a);
        var e = b.fixAllXYPosAfterPrepend(d, connectors.get());
        connections.attachToRanges(d);
        b.cleanCrs("Top", "Bottom", "Top");
        if (e) b.renderAfterPrependFix(d);
        b.render(a, d);
    }
});