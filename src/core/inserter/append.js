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

var AppendOp = function() {};

proto(AppendOp, {
    exec: function(a) {
        var b = this;
        insertOp.exec(a, function(a) {
            b._append.call(b, a);
        });
    },
    _append: function(a) {
        guid.markForAppend(a);
        if (settings.eq("append", "default")) {
            appender.position(a);
        } else {
            reversedAppender.position(a);
        }
    },
    execInsBefore: function(a, b) {
        var c = this;
        insertOp.execInsertBA(a, b, function(a) {
            c.exec.call(c, a);
        }, function() {
            return 0;
        }, function(a, b) {
            return a.splice(b, a.length - b);
        }, -1, function(a) {
            reposition.from(a[0]);
        });
    },
    execInsAfter: function(a, b) {
        var c = this;
        insertOp.execInsertBA(a, b, function(a) {
            c.exec.call(c, a);
        }, function(a) {
            return a.length - 1;
        }, function(a, b) {
            return a.splice(b + 1, a.length - b - 1);
        }, 1, function(a) {
            if (a.length > 0) reposition.from(a[0]);
        });
    }
});