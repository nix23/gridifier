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

var Connectors = function() {
    this._crs = [];
    this._nextFlushCb = null;
};

proto(Connectors, {
    eq: function(a, b) {
        return a.side == b;
    },
    isInitial: function(a) {
        return a.itemGUID == CRS.INITIAL_GUID;
    },
    create: function(a, b, c, d, e) {
        this._crs.push({
            type: a,
            side: b,
            x: Dom.toFixed(c, 2),
            y: Dom.toFixed(d, 2),
            itemGUID: typeof e == "undefined" ? CRS.INITIAL_GUID : e
        });
    },
    count: function() {
        return this._crs.length;
    },
    get: function() {
        return this._crs;
    },
    set: function(a) {
        this._crs = a;
    },
    setNextFlushCb: function(a) {
        this._nextFlushCb = a;
    },
    flush: function() {
        this._crs = [];
        if (typeof this._nextFlushCb == "function") {
            this._nextFlushCb();
            this._nextFlushCb = null;
        }
    },
    getClone: function() {
        var a = [];
        var b = [ "type", "side", "x", "y", "itemGUID" ];
        for (var c = 0; c < this._crs.length; c++) {
            var d = {};
            for (var e = 0; e < b.length; e++) d[b[e]] = this._crs[c][b[e]];
            d.crIndex = c;
            a.push(d);
        }
        return a;
    }
});