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

Antialiaser = function() {
    this._shouldUpdateZ = false;
    this._disableZUpdates = false;
    this._updateZTimeout = null;
    var a = this;
    gridifier.onReposition(function() {
        if (!a._shouldUpdateZ || a._disableZUpdates) return;
        clearTimeout(a._updateZTimeout);
        a._updateZTimeout = setTimeout(function() {
            a._updateZ.call(a);
        }, C.UPDATE_Z_DELAY);
    });
    ev.onSetSettingForNzer(function(b) {
        var c = [ "widthPx", "heightPx", "widthPt", "heightPt" ];
        var d = false;
        for (var e = 0; e < c.length; e++) {
            if (b == c[e] + "As") d = true;
        }
        if (d) a.updateAs();
    });
    self(this, {
        disableZUpdates: function() {
            a._disableZUpdates = true;
            return gridifier;
        }
    });
    this.updateAs();
};

proto(Antialiaser, {
    updateAs: function() {
        var a = this._updateAs("x", "width", "Width");
        var b = this._updateAs("y", "height", "Height");
        this._shouldUpdateZ = a || b;
    },
    _updateAs: function(a, b, c) {
        var d = parseFloat(settings.get(b + "PxAs"));
        var e = parseFloat(settings.get(b + "PtAs"));
        if (d == 0 && e == 0) {
            srManager["setOuter" + c + "AntialiasValue"](0);
            return false;
        }
        if (e != 0) var f = (grid[a + "2"]() + 1) * (e / 100); else var f = d;
        srManager["setOuter" + c + "AntialiasValue"](f);
        return true;
    },
    _updateZ: function() {
        var a = function(a) {
            for (var b = 0; b < a.length; b++) {
                var c = Math.abs(a[b].x2 - a[b].x1) + 1;
                var d = Math.abs(a[b].y2 - a[b].y1) + 1;
                a[b].normArea = Math.round(c * d);
            }
        };
        var b = function(a, b) {
            if (a.normArea > b.normArea) return 1;
            return a.normArea < b.normArea ? -1 : 0;
        };
        var c = function(a) {
            var b = {};
            for (var c = 0; c < a.length; c++) {
                if (typeof b[a[c].normArea] == "undefined") b[a[c].normArea] = [];
                b[a[c].normArea].push(a[c]);
            }
            return b;
        };
        var d = connections.get();
        a(d);
        d.sort(b);
        var e = c(d);
        var f = [];
        for (var g in e) {
            e[g] = cnsSorter.sortForReappend(e[g]);
            f.push(Dom.int(g));
        }
        f.sort(function(a, b) {
            if (a > b) return 1;
            return a < b ? -1 : 0;
        });
        var h = 1;
        for (var i = 0; i < f.length; i++) {
            for (var j = 0; j < e[f[i]].length; j++) {
                e[f[i]][j].item.style.zIndex = h;
                h++;
            }
        }
    }
});