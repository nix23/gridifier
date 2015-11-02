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

var InsertOp = function() {};

proto(InsertOp, {
    exec: function(a, b) {
        var a = gridItem.filterNotConnected(gridItem.toNative(a));
        if (a.length == 0) return;
        srManager.startCachingTransaction();
        grid.ensureCanFit(a);
        a = collector.sort(collector.filter(a));
        for (var c = 0; c < a.length; c++) {
            collector.unmarkAsNotCollectable(a[c]);
            grid.add(a[c]);
            b(a[c]);
        }
        srManager.stopCachingTransaction();
        grid.scheduleResize();
        ev.emit(EV.INSERT, a);
    },
    execInsertBA: function(a, b, c, d, e, f, g) {
        var a = gridItem.filterNotConnected(gridItem.toNative(a));
        if (a.length == 0) return;
        var h = connections.get();
        if (h.length == 0) {
            c(a);
            return;
        }
        h = cnsSorter.sortForReappend(h);
        var i = [];
        var b = this._getTargetItem(b, h, d);
        var j = this._getTargetItemGuid(b, e, h, i);
        if (j == null) err(E.WRONG_IBA_ITEM);
        this._reposition(i, a, j, c, f, g);
    },
    _getTargetItem: function(a, b, c) {
        if (typeof a == "undefined" || a == null) var a = b[c(b)].item; else {
            var a = gridItem.toNative(a)[0];
            if (typeof a == "undefined" || a == null) a = b[c(b)].item;
        }
        return a;
    },
    _getTargetItemGuid: function(a, b, c, d) {
        var e = null;
        for (var f = 0; f < c.length; f++) {
            if (guid.get(c[f].item) == guid.get(a)) {
                e = c[f].itemGUID;
                Array.prototype.push.apply(d, b(c, f));
                break;
            }
        }
        return e;
    },
    _reposition: function(a, b, c, d, e, f) {
        connections.reinitRanges();
        guid.reinitMax(c + 1 * e);
        var g = settings.eq("append", "default") ? appender : reversedAppender;
        g.recreateCrs();
        d(b);
        if (settings.eq("sortDispersion", false)) {
            connections.restore(a);
            cnsCore.remapGUIDSIn(a);
        } else {
            connections.restoreOnSortDispersion(a);
            cnsCore.remapAllGUIDS();
        }
        f(a);
    }
});