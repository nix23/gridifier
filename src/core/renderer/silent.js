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

SilentRenderer = function() {};

proto(SilentRenderer, {
    schedule: function(a) {
        for (var b = 0; b < a.length; b++) Dom.set(a[b], C.REND.SILENT_DATA, "y");
    },
    unschedule: function(a, b) {
        for (var c = 0; c < a.length; c++) {
            Dom.rm(a[c], C.REND.SILENT_DATA);
            rendererCns.unmarkAsRendered(b[c]);
        }
    },
    isScheduled: function(a) {
        return Dom.has(a, C.REND.SILENT_DATA);
    },
    _preUnschedule: function(a) {
        for (var b = 0; b < a.length; b++) Dom.rm(a[b], C.REND.SILENT_DATA);
    },
    getScheduled: function(a) {
        var a = a || false;
        var b = collector.collectByQuery("[" + C.REND.SILENT_DATA + "]");
        if (b.length == 0) return [];
        if (!a) return b;
        var c = {
            left: srManager.offsetLeft(grid.get()),
            top: srManager.offsetTop(grid.get())
        };
        var d = srManager.viewportDocumentCoords();
        var e = [];
        for (var f = 0; f < b.length; f++) {
            var g = cnsCore.find(b[f], true);
            if (g == null) continue;
            var h = {
                x1: c.left + g.x1,
                x2: c.left + g.x2,
                y1: c.top + g.y1,
                y2: c.top + g.y2
            };
            if (cnsIntersector.isIntersectingAny([ d ], h)) e.push(b[f]);
        }
        return e;
    },
    exec: function(a, b, c) {
        if (typeof a != "undefined" && a != null && a) {
            a = gridItem.toNative(a);
            var d = [];
            for (var e = 0; e < a.length; e++) {
                if (this.isScheduled(a[e])) d.push(a[e]);
            }
            this._preUnschedule(d);
            a = d;
        }
        var f = this;
        setTimeout(function() {
            f._exec.call(f, a, b, c);
        }, C.REFLOW_FIX_DELAY);
    },
    _exec: function(a, b, c) {
        if (typeof a == "undefined" || a == null || !a) var d = this.getScheduled(); else var d = a;
        if (d.length == 0) return;
        this._preUnschedule(d);
        var e = [];
        var f = [];
        for (var g = 0; g < d.length; g++) {
            var h = cnsCore.find(d[g], true);
            if (h != null) e.push(h);
        }
        e = cnsSorter.sortForReappend(e);
        for (var g = 0; g < e.length; g++) f.push(e[g].item);
        if (typeof b == "undefined") {
            this._render.call(this, f, e);
            return;
        }
        this._execByBatches(f, e, b, c);
    },
    _execByBatches: function(a, b, c, d) {
        if (typeof d == "undefined") var d = C.INSERT_BATCH_DELAY;
        var e = insertQueue.itemsToBatches(a, c);
        var f = insertQueue.itemsToBatches(b, c, true);
        for (var g = 0; g < e.length; g++) this._execBatch(e[g], f[g], g * d);
    },
    _execBatch: function(a, b, c) {
        var d = this;
        setTimeout(function() {
            d._render.call(d, a, b);
        }, c);
    },
    _render: function(a, b) {
        this.unschedule(a, b);
        renderer.show(b);
    }
});