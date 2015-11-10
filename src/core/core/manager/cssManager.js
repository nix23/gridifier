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

var CssManager = function() {
    this._eventsData = [];
    var a = function(a) {
        return function(b, c) {
            var d = this.changeCss(a, b, c);
            antialiaser.updateAs();
            reposition.fromFirstSortedCn(d);
            return gridifier;
        };
    };
    self(this, {
        toggleCss: a("toggle"),
        addCss: a("add"),
        rmCss: a("rm")
    });
};

proto(CssManager, {
    changeCss: function(a, b, c) {
        var b = gridItem.filterConnected(gridItem.toNative(b));
        var c = Dom.isArray(c) ? c : [ c ];
        for (var d = 0; d < b.length; d++) {
            var e = [];
            var f = [];
            var g = function(a, b) {
                e.push(b);
                if (!Dom.css.hasClass(a, b)) Dom.css.addClass(a, b);
            };
            var h = function(a, b) {
                f.push(b);
                if (Dom.css.hasClass(a, b)) Dom.css.removeClass(a, b);
            };
            for (var i = 0; i < c.length; i++) {
                if (a == "toggle") {
                    if (Dom.css.hasClass(b[d], c[i])) h(b[d], c[i]); else g(b[d], c[i]);
                } else if (a == "add") g(b[d], c[i]); else if (a == "rm") h(b[d], c[i]);
            }
            this._saveEventData(b[d], e, f);
        }
        return b;
    },
    _saveEventData: function(a, b, c) {
        var d = guid.get(a);
        var e = null;
        for (var f = 0; f < this._eventsData.length; f++) {
            if (this._eventsData[f].itemGUID == d) {
                e = this._eventsData[f];
                break;
            }
        }
        if (e == null) {
            e = {};
            this._eventsData.push(e);
        }
        e.itemGUID = d;
        e.added = b;
        e.removed = c;
    },
    emitEvents: function(a) {
        if (this._eventsData.length == 0) return;
        for (var b = 0; b < a.length; b++) {
            for (var c = 0; c < this._eventsData.length; c++) {
                if (Dom.int(a[b].itemGUID) == this._eventsData[c].itemGUID) {
                    var d = this._eventsData[c];
                    (function(a, b, c) {
                        setTimeout(function() {
                            ev.emit(EV.CSS_CHANGE, a, b, c);
                        }, settings.get("coordsChangeTime"));
                    })(a[b].item, d.added, d.removed);
                    this._eventsData.splice(c, 1);
                    break;
                }
            }
        }
    }
});