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

var Operation = function() {
    this._last = null;
};

proto(Operation, {
    isInitial: function(a) {
        if (this._last == null) {
            this._last = a;
            return true;
        }
        return false;
    },
    isSameAsPrev: function(a) {
        if (this._last != a) {
            this._last = a;
            return false;
        }
        return true;
    },
    setLast: function(a) {
        this._last = a;
    }
});