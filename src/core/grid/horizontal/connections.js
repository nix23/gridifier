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

var HgConnections = function() {
    this._cns = [];
};

proto(HgConnections, {
    reinitRanges: function() {
        cnsRanges.init("x1", "x2");
    },
    attachToRanges: function(a) {
        cnsRanges.attachCn(a, connections.get().length - 1, "x1", "x2");
    },
    mapAllIntAndLeftCns: function(a) {
        var b = cnsRanges;
        return cnsRanges.mapAllIntAndSideCns(a, "x", "x1", "x2", b.lastRngIndexFn(), b.lastRngIndexFn(), b.lowerCrCnIndexesFn(), b.decFn());
    },
    mapAllIntAndRightCns: function(a) {
        var b = cnsRanges;
        return cnsRanges.mapAllIntAndSideCns(a, "x", "x1", "x2", b.firstRngIndexFn(), b.lastRngIndexFn(), b.upperCrCnIndexesFn(), b.incFn());
    },
    getAllIntYCns: function(a) {
        return cnsRanges.getAllCnsFromIntRange(a.x, "x1", "x2");
    },
    getAllIntYAndLeftCns: function(a) {
        return cnsRanges.getAllCnsFromIntAndTLSideRgs(a.x, "x1", "x2");
    },
    getAllIntYAndRightCns: function(a) {
        return cnsRanges.getAllCnsFromIntAndRBSideRgs(a.x, "x1", "x2");
    },
    getLastColXExpandedCns: function() {
        return cnsXYIntersector.getLastXYExpandedCns();
    },
    isIntMoreThanOneCnX: function(a) {
        return cnsXYIntersector.isIntMoreThanOneCnXY(a, "x1", "x2");
    },
    getMostWideFromAllXIntCns: function(a) {
        return cnsXYIntersector.getMostBigFromAllXYIntCns(a, "x1", "x2");
    },
    getAllXIntCns: function(a) {
        return cnsXYIntersector.getAllXYIntCns(a, "x1", "x2");
    },
    expandXAllColCnsToMostWide: function(a) {
        return cnsXYIntersector.expandXYAllCnsToMostBig(a, "x1", "x2", "hOffset", "Width");
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
            var d = b.y2 + 1;
            for (var e = 0; e < a.length; e++) {
                c(a[e], b.x1, d++);
            }
        }, function(a, b, c) {
            var d = b.y1 - 1;
            for (var e = 0; e < a.length; e++) {
                c(a[e], b.x1, d--);
            }
        });
        this.restore(a);
    },
    getAllBehindX: function(a) {
        return cnsCore.getAllBACoord(a, function(a, b) {
            return a.x1 > b;
        });
    },
    getAllBeforeX: function(a) {
        return cnsCore.getAllBACoord(a, function(a, b) {
            return a.x2 < b;
        });
    },
    fixAllXPosAfterPrepend: function(a, b) {
        return cnsCore.fixAllXYPosAfterPrepend(a, b, "x", "x1", "x2");
    }
});