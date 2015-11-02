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

var Item = function() {};

proto(Item, {
    markAsConnected: function(a) {
        Dom.set(a, C.ITEM.IS_CONNECTED_DATA, "y");
    },
    unmarkAsConnected: function(a) {
        Dom.rm(a, C.ITEM.IS_CONNECTED_DATA);
    },
    isConnected: function(a) {
        return Dom.has(a, C.ITEM.IS_CONNECTED_DATA);
    },
    filterConnected: function(a) {
        return Dom.filter(a, function(a) {
            return this.isConnected(a);
        }, this);
    },
    filterNotConnected: function(a) {
        return Dom.filter(a, function(a) {
            return !this.isConnected(a);
        }, this);
    },
    toNative: function(a) {
        var b = [];
        if (Dom.isJquery(a)) {
            for (var c = 0; c < a.length; c++) b.push(a.get(c));
        } else if (Dom.isNative(a)) {
            b.push(a);
        } else if (Dom.isArray(a)) {
            for (var c = 0; c < a.length; c++) {
                b.push(Dom.isJquery(a[c]) ? a[c].get(0) : a[c]);
                if (!Dom.isNative(b[b.length - 1])) err(E.NOT_NATIVE);
            }
        } else err(E.NOT_NATIVE);
        return b;
    }
});