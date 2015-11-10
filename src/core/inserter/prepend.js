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

var PrependOp = function() {};

proto(PrependOp, {
    exec: function(a) {
        var b = this;
        insertOp.exec(a, function(a) {
            b._prepend.call(b, a);
        });
    },
    _prepend: function(a) {
        guid.markForPrepend(a);
        if (settings.eq("prepend", "default")) {
            prepender.position(a);
        } else {
            reversedPrepender.position(a);
        }
    }
});