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

var Reposition = function() {};

proto(Reposition, {
    all: function() {
        srManager.startCachingTransaction();
        this._all();
        srManager.stopCachingTransaction();
    },
    fromFirstSortedCn: function(a) {
        srManager.startCachingTransaction();
        this._fromFirstSortedCn(a);
        srManager.stopCachingTransaction();
    },
    from: function(a) {
        this._from(a);
    },
    sync: function() {
        var a = connections.get();
        if (!repositionQueue.isEmpty()) {
            var b = repositionQueue.stop();
            var c = [];
            for (var d = 0; d < b.queueData.length; d++) c.push(b.queueData[d].cn);
            cnsCore.syncParams(c);
            for (var d = 0; d < b.queue.length; d++) a.push(b.queue[d].cn);
        }
    },
    _stop: function() {
        var a = [];
        if (!repositionQueue.isEmpty()) {
            var b = repositionQueue.stop();
            for (var c = 0; c < b.queue.length; c++) {
                if (b.queue[c].cn.restrictCollect) continue;
                a.push(b.queue[c].cn);
            }
        }
        return a;
    },
    _all: function() {
        this.sync();
        var a = connections.get();
        if (a.length == 0) return;
        a = cnsSorter.sortForReappend(a);
        guid.unmarkFirstPrepended();
        this._start(repositionData.getForRepositionAll(a));
    },
    _from: function(a) {
        var b = this._stop();
        guid.unmarkFirstPrepended();
        this._start(repositionData.get(b, a));
    },
    _fromFirstSortedCn: function(a) {
        var b = this._stop();
        var c = connections.get();
        var d = [];
        for (var e = 0; e < a.length; e++) {
            for (var f = 0; f < c.length; f++) {
                if (guid.get(c[f].item) == guid.get(a[e])) {
                    d.push(c[f]);
                    continue;
                }
            }
            for (var f = 0; f < b.length; f++) {
                if (guid.get(b[f].item) == guid.get(a[e])) {
                    d.push(b[f]);
                    continue;
                }
            }
        }
        var g = cnsSorter.sortForReappend(d);
        guid.unmarkFirstPrepended();
        this._start(repositionData.get(b, g[0]));
    },
    _start: function(a) {
        repositionCrs.recreateForFirst(a.firstCn.item, a.firstCn);
        repositionQueue.init(a.items, a.cns);
        repositionQueue.start();
    }
});