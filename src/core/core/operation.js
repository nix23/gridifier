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