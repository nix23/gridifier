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

var Grid = function() {
    this._grid = null;
    this._markingFn = null;
    this._resizeTimeout = null;
    this._createMarkingFn();
    this._toNative(sourceGrid);
    this._adjustCSS();
    self(this, {
        grid: this.get,
        gridWidth: this.width,
        gridHeight: this.height
    });
};

proto(Grid, {
    _createMarkingFn: function() {
        this._markingFn = function(a) {
            if (settings.notEq("class", false)) {
                if (!Dom.css.hasClass(a, settings.get("class"))) Dom.css.addClass(a, settings.get("class"));
            } else if (settings.notEq("data", false)) Dom.set(a, settings.get("data"), "gi");
        };
    },
    _toNative: function(a) {
        if (Dom.isJquery(a)) this._grid = a.get(0); else if (Dom.isNative(a)) this._grid = a; else if (Dom.isArray(a) && Dom.isNative(a[0])) this._grid = a[0]; else err(E.GRID_NOT_NATIVE);
    },
    _adjustCSS: function() {
        var a = SizesResolver.getComputedCSS(this._grid);
        if (a.position != "relative" && a.position != "absolute") Dom.css.set(this._grid, {
            position: "relative"
        });
    },
    get: function() {
        return this._grid;
    },
    x2: function() {
        return srManager.outerWidth(this._grid, false, true) - 1;
    },
    y2: function() {
        return srManager.outerHeight(this._grid, false, true) - 1;
    },
    width: function() {
        return Math.round(this.x2() + 1);
    },
    height: function() {
        return Math.round(this.y2() + 1);
    },
    mark: function(a) {
        var a = gridItem.toNative(a);
        for (var b = 0; b < a.length; b++) this._markingFn(a[b]);
        return a;
    },
    add: function(a) {
        var a = this.mark(a);
        for (var b = 0; b < a.length; b++) {
            if (!Dom.isChildOf(a[b], this._grid)) this._grid.appendChild(a[b]);
        }
    },
    ensureCanFit: function(a) {
        var b = this;
        var c = function(a, c) {
            var d = Math.round(srManager["outer" + c](a, true));
            var e = Math.round(srManager["outer" + c](b._grid, false, true));
            if (d > e) err("Item " + c + "(" + d + "px) > Grid " + c + "(" + e + "px).");
        };
        for (var d = 0; d < a.length; d++) c(a[d], settings.eq("grid", "vertical") ? "Width" : "Height");
    },
    scheduleResize: function() {
        var a = this;
        clearTimeout(this._resizeTimeout);
        this._resizeTimeout = setTimeout(function() {
            if (!repositionQueue.isEmpty()) {
                a.scheduleResize();
                return;
            }
            if (settings.eq("grid", "vertical")) a._resize.call(a, "y2", "height", function() {
                return a.y2();
            }); else a._resize.call(a, "x2", "width", function() {
                return a.x2();
            });
        }, settings.get("gridResizeDelay"));
    },
    _resize: function(a, b, c) {
        var d = connections.get();
        if (d.length == 0) return;
        var e = d[0][a];
        for (var f = 1; f < d.length; f++) {
            if (d[f][a] > e) e = d[f][a];
        }
        var g = {};
        g[b] = e + 1 + "px";
        if (settings.eq("gridResize", "fit") || settings.eq("gridResize", "expand") && c() < e) Dom.css.set(this._grid, g);
        ev.emit(EV.GRID_RESIZE, this._grid);
    }
});