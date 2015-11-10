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

var RepositionCrs = function() {};

proto(RepositionCrs, {
    recreateForFirst: function(a, b) {
        if (settings.eq("append", "reversed")) {
            operation.setLast(OPS.REV_APPEND);
            this._recreate(a, b, reversedAppender, "Rev");
        } else {
            operation.setLast(OPS.APPEND);
            this._recreate(a, b, appender, "Def");
        }
    },
    _recreate: function(a, b, c, d) {
        connections.reinitRanges();
        bind("recreateCrs", c)();
        if (settings.eq("grid", "vertical")) {
            crsCleaner.rmIntFromBottom();
        } else {
            crsCleaner.rmIntFromRight();
        }
    }
});