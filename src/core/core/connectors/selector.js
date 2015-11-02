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

var CrsSelector = function() {
    this._crs = null;
};

proto(CrsSelector, {
    attach: function(a) {
        this._crs = a;
    },
    getSelected: function() {
        return this._crs;
    },
    _selectOnlyMostSideCr: function(a, b, c) {
        var d = null;
        var e = null;
        var f = this._crs.length;
        while (f--) {
            if (this._crs[f].side == a) {
                if (d == null || c(this._crs[f][b], e)) {
                    d = this._crs[f].itemGUID;
                    e = this._crs[f][b];
                }
            }
        }
        if (d == null) return;
        var f = this._crs.length;
        while (f--) {
            if (this._crs[f].side == a && this._crs[f].itemGUID != d) this._crs.splice(f, 1);
        }
    },
    _bgCond: function(a, b) {
        return a > b;
    },
    _smCond: function(a, b) {
        return a < b;
    },
    selectOnlyMostBottom: function(a) {
        this._selectOnlyMostSideCr(a, "y", this._bgCond);
    },
    selectOnlyMostTop: function(a) {
        this._selectOnlyMostSideCr(a, "y", this._smCond);
    },
    selectOnlyMostRight: function(a) {
        this._selectOnlyMostSideCr(a, "x", this._bgCond);
    },
    selectOnlyMostLeft: function(a) {
        this._selectOnlyMostSideCr(a, "x", this._smCond);
    },
    _selectOnly: function(a, b) {
        for (var c = 0; c < this._crs.length; c++) {
            if (!connectors.isInitial(this._crs[c]) && b(this._crs[c].itemGUID) && a != this._crs[c].side) {
                this._crs.splice(c, 1);
                c--;
            }
        }
    },
    selectOnlyFromAppended: function(a) {
        this._selectOnly(a, function(a) {
            return !guid.wasPrepended(a);
        });
    },
    selectOnlyFromPrepended: function(a) {
        this._selectOnly(a, function(a) {
            return guid.wasPrepended(a);
        });
    }
});