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

var VgReversedPrepender = function() {
    this._position = new Position(this, OPS.REV_PREPEND, function(a, b) {
        a.create(CRS.PREPEND.REV, CRS.LEFT.BOTTOM, b.x2(), 0);
    }, function(a, b) {
        if (a.x1 - 1 >= 0) {
            connectors.create(CRS.PREPEND.REV, CRS.LEFT.BOTTOM, parseFloat(a.x1 - 1), parseFloat(a.y2), Dom.int(b));
        }
        connectors.create(CRS.PREPEND.REV, CRS.TOP.RIGHT, parseFloat(a.x2), parseFloat(a.y1 - 1), Dom.int(b));
    }, function(a) {
        return a.x1 < rounder.fixLowRounding(0);
    });
};

proto(VgReversedPrepender, {
    position: function(a) {
        var b = this._position;
        b.initCrs("Top", "Bottom", "Top");
        var c = b.filterCrs("Appended", CRS.TOP.RIGHT, "Top", "Right", "Prepend");
        var d = b.createCn(a, b.findCnCoords(a, c, "VgPrepend", "AboveY", "y1", "Bigger", "Y"), c);
        guid.markIfFirstPrepended(a);
        var e = b.fixAllXYPosAfterPrepend(d, connectors.get());
        connections.attachToRanges(d);
        b.cleanCrs("Top", "Bottom", "Top");
        if (e) b.renderAfterPrependFix(d);
        b.render(a, d);
    }
});