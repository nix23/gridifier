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

var Rounder = function() {
    this._fixRoundingVal = 1;
};

proto(Rounder, {
    fixLowRounding: function(a) {
        return a - this._fixRoundingVal;
    },
    fixHighRounding: function(a) {
        return a + this._fixRoundingVal;
    }
});