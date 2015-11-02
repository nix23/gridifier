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

var Disconnector = function() {
    self(this, {
        disconnect: function(a) {
            var b = this;
            a = gridItem.filterConnected(gridItem.toNative(a));
            setTimeout(function() {
                reposition.sync();
                b.disconnect(a, C.DISC_TYPES.HARD);
                reposition.all();
            }, C.REFLOW_FIX_DELAY);
            return gridifier;
        },
        pop: function() {
            var a = gridifier.first();
            if (a != null) gridifier.disconnect(a);
            return a;
        },
        shift: function() {
            var a = gridifier.last();
            if (a != null) gridifier.disconnect(a);
            return a;
        }
    });
};

proto(Disconnector, {
    disconnect: function(a, b) {
        var b = b || C.DISC_TYPES.SOFT;
        var a = gridItem.filterConnected(gridItem.toNative(a));
        if (b == C.DISC_TYPES.HARD) {
            for (var c = 0; c < a.length; c++) collector.markAsNotCollectable(a[c]);
        }
        var d = this._findCnsToDisc(a);
        for (var c = 0; c < d.length; c++) {
            connections.rm(d[c]);
            guid.rm(d[c].item);
        }
        if (connections.count() == 0) this._recreateCrs();
        for (var c = 0; c < d.length; c++) gridItem.unmarkAsConnected(d[c].item);
        connections.reinitRanges();
        this._scheduleRender(d);
    },
    _findCnsToDisc: function(a) {
        var b = [];
        for (var c = 0; c < a.length; c++) b.push(cnsCore.find(a[c]));
        return cnsSorter.sortForReappend(b);
    },
    _recreateCrs: function() {
        connectors.flush();
        if (settings.eq("append", "default")) appender.createInitialCr(); else reversedAppender.createInitialCr();
    },
    _scheduleRender: function(a) {
        var b = insertQueue.itemsToBatches(a, C.DISC_BATCH, true);
        renderer.markAsSchToHide(a);
        for (var c = 0; c < b.length; c++) {
            (function(a, b) {
                setTimeout(function() {
                    renderer.hide(a);
                }, C.DISC_DELAY * b);
            })(b[c], c);
        }
    }
});