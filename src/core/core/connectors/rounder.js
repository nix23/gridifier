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

var CrsRounder = function() {};

proto(CrsRounder, {
    roundCnPerCr: function(a, b) {
        a.origX1 = a.x1;
        a.origX2 = a.x2;
        a.origY1 = a.y1;
        a.origY2 = a.y2;
        var c = function(a) {
            return connectors.eq(b, a);
        };
        if (c(CRS.BOTTOM.LEFT) || c(CRS.RIGHT.TOP)) {
            a.x1 = Math.floor(a.x1);
            a.y1 = Math.floor(a.y1);
        } else if (c(CRS.LEFT.TOP) || c(CRS.BOTTOM.RIGHT)) {
            a.x2 = Math.ceil(a.x2);
            a.y1 = Math.floor(a.y1);
        } else if (c(CRS.LEFT.BOTTOM) || c(CRS.TOP.RIGHT)) {
            a.x2 = Math.ceil(a.x2);
            a.y2 = Math.ceil(a.y2);
        } else if (c(CRS.TOP.LEFT) || c(CRS.RIGHT.BOTTOM)) {
            a.x1 = Math.floor(a.x1);
            a.y2 = Math.ceil(a.y2);
        }
    },
    unroundCnPerCr: function(a, b) {
        a.x1 = a.origX1;
        a.y1 = a.origY1;
        a.x2 = a.origX2;
        a.y2 = a.origY2;
    }
});