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

var Position = function(a, b, c, d, e) {
    this._op = b;
    this._crInitialCr = c;
    this._addItemCrs = d;
    this._cantFitCond = e;
    var f = this;
    a.recreateCrs = bind("_recreateCrs", this);
    a.createInitialCr = bind("_createInitialCr", this);
};

proto(Position, {
    initCrs: function(a, b, c) {
        if (operation.isInitial(this._op)) {
            this._createInitialCr();
            return;
        }
        if (operation.isSameAsPrev(this._op)) return;
        this._recreateCrs();
        crsCleaner["rmIntFrom" + a]();
        crsCleaner["rmAllToo" + b + "FromMost" + c]();
    },
    _createInitialCr: function() {
        this._crInitialCr(connectors, grid);
    },
    _recreateCrs: function(a) {
        var a = a || false;
        if (!a) connectors.flush();
        var b = connections.get();
        for (var c = 0; c < b.length; c++) this._addItemCrs.call(this, b[c], b[c].itemGUID);
        if (connectors.count() == 0) this._createInitialCr();
    },
    cleanCrs: function(a, b, c) {
        crsCleaner["rmAllToo" + b + "FromMost" + c]();
        crsCleaner["rmIntFrom" + a]();
    },
    filterCrs: function(a, b, c, d, e) {
        var f = connectors.getClone();
        crsSelector.attach(f);
        crsSelector["selectOnlyFrom" + a](b);
        f = crsSelector.getSelected();
        if (settings.eq("intersections", true)) {
            crsShifter.attach(f);
            crsShifter.shiftAll();
            f = crsShifter.getNew();
        } else {
            crsSelector.attach(f);
            crsSelector["selectOnlyMost" + c](b);
            f = crsSelector.getSelected();
            crsShifter.attach(f);
            crsShifter["shiftAllTo" + d](b);
            f = crsShifter.getNew();
        }
        crsSorter.attach(f);
        crsSorter["sortFor" + e]();
        return crsSorter.getSorted();
    },
    findCnCoords: function(a, b, c, d, e, f, g) {
        var h = null;
        for (var i = 0; i < b.length; i++) {
            var j = coordsFinder.find(this._op, a, b[i]);
            if (this._cantFitCond.call(this, j)) {
                continue;
            }
            var k = cnsIntersector["findAllMaybeIntOn" + c](b[i]);
            if (cnsIntersector.isIntersectingAny(k, j)) {
                continue;
            }
            h = j;
            var l = connections["getAll" + d](j[e]);
            if (cnsCore["isAnyGUID" + f + "Than"](l, a)) {
                continue;
            }
            if (settings.eq("intersections", false) && connections["isIntMoreThanOneCn" + g](h)) {
                h = null;
            }
            if (h != null) {
                break;
            }
        }
        if (h == null) err(E.TOO_BIG_ITEM);
        return h;
    },
    createCn: function(a, b, c) {
        var d = connections.add(a, b);
        if (settings.eq("intersections", false)) {
            if (settings.eq("grid", "vertical")) connections.expandYAllRowCnsToMostTall(d); else connections.expandXAllColCnsToMostWide(d);
        }
        this._addItemCrs.call(this, d, guid.get(a));
        return d;
    },
    render: function(a, b) {
        if (settings.eq("intersections", true)) renderer.show(b); else {
            if (settings.eq("grid", "vertical")) var c = connections.getLastRowYExpandedCns(); else var c = connections.getLastColXExpandedCns();
            for (var d = 0; d < c.length; d++) {
                if (c[d].itemGUID == b.itemGUID) {
                    c.splice(d, 1);
                    d--;
                }
            }
            renderer.renderAfterDelay(c);
            renderer.show(b);
        }
    },
    fixAllXYPosAfterPrepend: function(a, b) {
        if (settings.eq("grid", "vertical")) var c = connections.fixAllYPosAfterPrepend(a, b); else var c = connections.fixAllXPosAfterPrepend(a, b);
        return c;
    },
    renderAfterPrependFix: function(a) {
        renderer.render(connections.get(), [ a ]);
    }
});