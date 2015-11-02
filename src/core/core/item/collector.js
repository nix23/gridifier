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

var Collector = function() {
    this._collectFn = null;
    this._createCollectFn();
    self(this, {
        collect: this.collect,
        collectNew: this.collectDisconnected,
        collectConnected: this.collectConnected
    });
};

proto(Collector, {
    _createCollectFn: function() {
        var a = this;
        this._collectFn = function(b) {
            if (settings.notEq("class", false)) var c = "." + settings.get("class"); else if (settings.notEq("data", false)) var c = "[" + settings.get("data") + "]"; else var c = settings.get("query");
            return a.filterCollectable(Dom.find.byQuery(b, c));
        };
    },
    filterCollectable: function(a) {
        return Dom.filter(a, function(a) {
            return !this.isNotCollectable(a);
        }, this);
    },
    markAsNotCollectable: function(a) {
        Dom.set(a, C.COLL.NOT_COLLECTABLE_DATA, "r");
    },
    unmarkAsNotCollectable: function(a) {
        Dom.rmIfHas(a, C.COLL.NOT_COLLECTABLE_DATA);
    },
    isNotCollectable: function(a) {
        return Dom.has(a, C.COLL.NOT_COLLECTABLE_DATA);
    },
    collect: function() {
        return this._collectFn(grid.get());
    },
    collectByQuery: function(a) {
        return this.filterCollectable(Dom.find.byQuery(grid.get(), a));
    },
    collectConnected: function() {
        return gridItem.filterConnected(this._collectFn(grid.get()));
    },
    collectDisconnected: function() {
        return gridItem.filterNotConnected(this._collectFn(grid.get()));
    },
    filter: function(a) {
        var b = settings.getApi("filter");
        for (var c = 0; c < b.length; c++) {
            var d = [];
            for (var e = 0; e < a.length; e++) {
                if (b[c](a[e])) d.push(a[e]);
            }
            a = d;
        }
        return a;
    },
    sort: function(a) {
        this.saveOriginalOrder(a);
        a.sort(function(a, b) {
            return settings.getApi("sort")(a, b, sortHelpers, Dom);
        });
        this.flushOriginalOrder(a);
        return a;
    },
    saveOriginalOrder: function(a) {
        for (var b = 0; b < a.length; b++) Dom.set(a[b], C.COLL.SORT_INDEX_DATA, b + 1);
    },
    flushOriginalOrder: function(a) {
        for (var b = 0; b < a.length; b++) Dom.rm(a[b], C.COLL.SORT_INDEX_DATA);
    }
});