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

var VgConnections = function() {
    this._cns = [];
};

proto(VgConnections, {
    reinitRanges: function() {
        cnsRanges.init("y1", "y2");
    },
    attachToRanges: function(a) {
        cnsRanges.attachCn(a, connections.get().length - 1, "y1", "y2");
    },
    mapAllIntAndTopCns: function(a) {
        var b = cnsRanges;
        return cnsRanges.mapAllIntAndSideCns(a, "y", "y1", "y2", b.lastRngIndexFn(), b.lastRngIndexFn(), b.lowerCrCnIndexesFn(), b.decFn());
    },
    mapAllIntAndBottomCns: function(a) {
        var b = cnsRanges;
        return cnsRanges.mapAllIntAndSideCns(a, "y", "y1", "y2", b.firstRngIndexFn(), b.lastRngIndexFn(), b.upperCrCnIndexesFn(), b.incFn());
    },
    getAllIntXCns: function(a) {
        return cnsRanges.getAllCnsFromIntRange(a.y, "y1", "y2");
    },
    getAllIntXAndTopCns: function(a) {
        return cnsRanges.getAllCnsFromIntAndTLSideRgs(a.y, "y1", "y2");
    },
    getAllIntXAndBottomCns: function(a) {
        return cnsRanges.getAllCnsFromIntAndRBSideRgs(a.y, "y1", "y2");
    },
    getLastRowYExpandedCns: function() {
        return cnsXYIntersector.getLastXYExpandedCns();
    },
    isIntMoreThanOneCnY: function(a) {
        return cnsXYIntersector.isIntMoreThanOneCnXY(a, "y1", "y2");
    },
    getMostTallFromAllYIntCns: function(a) {
        return cnsXYIntersector.getMostBigFromAllXYIntCns(a, "y1", "y2");
    },
    getAllYIntCns: function(a) {
        return cnsXYIntersector.getAllXYIntCns(a, "y1", "y2");
    },
    expandYAllRowCnsToMostTall: function(a) {
        return cnsXYIntersector.expandXYAllCnsToMostBig(a, "y1", "y2", "vOffset", "Height");
    },
    get: function() {
        return this._cns;
    },
    count: function() {
        return this._cns.length;
    },
    restore: function(a) {
        this._cns = this._cns.concat(a);
    },
    add: function(a, b) {
        var c = cnsCore.create(a, b);
        this._cns.push(c);
        ev.emit(EV.REPOSITION, c.item, c, this);
        return c;
    },
    rm: function(a) {
        cnsCore.rm(this._cns, a);
    },
    restoreOnSortDispersion: function(a) {
        cnsCore.restoreOnSortDispersion(a, function(a, b, c) {
            var d = b.x2 + 1;
            for (var e = 0; e < a.length; e++) {
                c(a[e], d++, b.y1);
            }
        }, function(a, b, c) {
            var d = b.x1 - 1;
            for (var e = 0; e < a.length; e++) {
                c(a[e], d--, b.y1);
            }
        });
        this.restore(a);
    },
    getAllBelowY: function(a) {
        return cnsCore.getAllBACoord(a, function(a, b) {
            return a.y1 > b;
        });
    },
    getAllAboveY: function(a) {
        return cnsCore.getAllBACoord(a, function(a, b) {
            return a.y2 < b;
        });
    },
    fixAllYPosAfterPrepend: function(a, b) {
        return cnsCore.fixAllXYPosAfterPrepend(a, b, "y", "y1", "y2");
    }
});