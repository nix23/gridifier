/* Gridifier v1.~.~ source file for custom build.
 * Async Responsive HTML Grids
 * http://gridifier.io
 * 
 * Gridifier is dual-licensed:
 *   GPLV3 per non-commercial usage; 
 *   Commercial license per commercial usage.
 * Read http://gridifier.io/license for details.
 * Copyright 2015 nTech
 */

Gridifier.Normalizer = function(a, b) {
    var c = this;
    this._gridifier = null;
    this._sizesResolverManager = null;
    this._roundingNormalizationValue = 1;
    this._itemWidthAntialiasPercentageValue = 0;
    this._itemWidthAntialiasPxValue = 0;
    this._itemHeightAntialiasPercentageValue = 0;
    this._itemHeightAntialiasPxValue = 0;
    this._areZIndexesUpdatesEnabled = true;
    this._areZIndexesUpdatesBinded = false;
    this._css = {};
    this._construct = function() {
        c._gridifier = a;
        c._sizesResolverManager = b;
        c.setItemWidthAntialiasPercentageValue(c._itemWidthAntialiasPercentageValue);
        c.setItemHeightAntialiasPercentageValue(c._itemHeightAntialiasPercentageValue);
        c.setItemWidthAntialiasPxValue(c._itemWidthAntialiasPxValue);
        c.setItemHeightAntialiasPxValue(c._itemHeightAntialiasPxValue);
        c._bindEvents();
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        c._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.Normalizer.prototype.normalizeLowRounding = function(a) {
    return a - this._roundingNormalizationValue;
};

Gridifier.Normalizer.prototype.normalizeHighRounding = function(a) {
    return a + this._roundingNormalizationValue;
};

Gridifier.Normalizer.prototype.setItemWidthAntialiasPercentageValue = function(a) {
    this._itemWidthAntialiasPercentageValue = a;
    this.updateItemWidthAntialiasPxValue();
};

Gridifier.Normalizer.prototype.setItemWidthAntialiasPxValue = function(a) {
    this._itemWidthAntialiasPxValue = a;
    this.updateItemWidthAntialiasPxValue();
};

Gridifier.Normalizer.prototype.setItemHeightAntialiasPercentageValue = function(a) {
    this._itemHeightAntialiasPercentageValue = a;
    this.updateItemHeightAntialiasPxValue();
};

Gridifier.Normalizer.prototype.setItemHeightAntialiasPxValue = function(a) {
    this._itemHeightAntialiasPxValue = a;
    this.updateItemHeightAntialiasPxValue();
};

Gridifier.Normalizer.prototype.updateItemWidthAntialiasPxValue = function() {
    if (this._itemWidthAntialiasPercentageValue == 0 && this._itemWidthAntialiasPxValue == 0) {
        this._sizesResolverManager.setOuterWidthAntialiasValue(0);
        return;
    }
    if (this._itemWidthAntialiasPercentageValue != 0) var a = (this._gridifier.getGridX2() + 1) * (this._itemWidthAntialiasPercentageValue / 100); else var a = this._itemWidthAntialiasPxValue;
    this._sizesResolverManager.setOuterWidthAntialiasValue(a);
};

Gridifier.Normalizer.prototype.updateItemHeightAntialiasPxValue = function() {
    if (this._itemHeightAntialiasPercentageValue == 0 && this._itemHeightAntialiasPxValue == 0) {
        this._sizesResolverManager.setOuterHeightAntialiasValue(0);
        return;
    }
    if (this._itemHeightAntialiasPercentageValue != 0) var a = (this._gridifier.getGridY2() + 1) * (this._itemHeightAntialiasPercentageValue / 100); else var a = this._itemHeightAntialiasPxValue;
    this._sizesResolverManager.setOuterHeightAntialiasValue(a);
};

Gridifier.Normalizer.prototype.updateItemAntialiasValues = function() {
    this.updateItemWidthAntialiasPxValue();
    this.updateItemHeightAntialiasPxValue();
};

Gridifier.Normalizer.prototype.disableZIndexesUpdates = function() {
    this._areZIndexesUpdatesEnabled = false;
};

Gridifier.Normalizer.prototype.bindZIndexesUpdates = function() {
    if (!this._areZIndexesUpdatesEnabled || this._areZIndexesUpdatesBinded) return;
    var a = this;
    var b = null;
    this._gridifier.onConnectionCreate(function(a) {
        var c = function() {
            var b = function(a) {
                for (var b = 0; b < a.length; b++) {
                    a[b].tmpWidth = Math.abs(a[b].x2 - a[b].x1) + 1;
                    a[b].tmpHeight = Math.abs(a[b].y2 - a[b].y1) + 1;
                    a[b].tmpWidth += parseFloat(a[b].horizontalOffset);
                    a[b].tmpHeight += parseFloat(a[b].verticalOffset);
                    a[b].tmpArea = Math.round(a[b].tmpWidth * a[b].tmpHeight);
                }
            };
            var c = -1;
            var d = function(a, b) {
                if (a.tmpArea > b.tmpArea) return -1 * c; else if (a.tmpArea < b.tmpArea) return 1 * c; else if (a.tmpArea == b.tmpArea) return 0;
            };
            var e = function(a) {
                var b = {};
                for (var c = 0; c < a.length; c++) {
                    if (typeof b[a[c].tmpArea] == "undefined") {
                        b[a[c].tmpArea] = [];
                    }
                    b[a[c].tmpArea].push(a[c]);
                }
                return b;
            };
            var f = a.get();
            b(f);
            f.sort(d);
            var g = e(f);
            var h = a.getConnectionsSorter();
            var i = [];
            for (var j in g) {
                g[j] = h.sortConnectionsPerReappend(g[j]);
                i.push(j);
            }
            i.sort(function(a, b) {
                if (Dom.toInt(a) > Dom.toInt(b)) return -1 * c; else if (Dom.toInt(a) < Dom.toInt(b)) return 1 * c; else if (Dom.toInt(a) == Dom.toInt(b)) return 0;
            });
            var k = 1;
            for (var l = 0; l < i.length; l++) {
                for (var m = 0; m < g[i[l]].length; m++) {
                    var n = g[i[l]][m];
                    n.item.style.zIndex = k;
                    k++;
                }
            }
        };
        if (b != null) {
            clearTimeout(b);
            b = null;
        }
        b = setTimeout(function() {
            c();
        }, 100);
    });
    this._areZIndexesUpdatesBinded = true;
};