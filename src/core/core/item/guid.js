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

var GUID = function() {
    this._max = 9999;
    this._min = 1e4;
    this._firstPrepended = null;
};

proto(GUID, {
    reinit: function() {
        this._max = 9999;
        this._min = 1e4;
    },
    reinitMax: function(a) {
        this._max = typeof a == "undefined" || a == null ? 9999 : a;
    },
    get: function(a) {
        return Dom.int(Dom.get(a, C.GUID_DATA));
    },
    set: function(a, b) {
        Dom.set(a, C.GUID_DATA, b);
    },
    rm: function(a) {
        Dom.rm(a, C.GUID_DATA);
    },
    markForAppend: function(a) {
        Dom.set(a, C.GUID_DATA, ++this._max);
        return this._max;
    },
    markForPrepend: function(a) {
        Dom.set(a, C.GUID_DATA, --this._min);
        return this._min;
    },
    markIfFirstPrepended: function(a) {
        if (this._firstPrepended != null) return;
        this._firstPrepended = Dom.int(Dom.get(a, C.GUID_DATA));
    },
    unmarkFirstPrepended: function() {
        this._firstPrepended = null;
    },
    wasPrepended: function(a) {
        return this._firstPrepended == null ? false : Dom.int(a) <= this._firstPrepended;
    }
});