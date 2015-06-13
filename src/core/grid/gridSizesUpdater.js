/* Gridifier v1.0.0
 * Async Responsive HTML Grids
 * http://gridifier.io
 * 
 * Gridifier is dual-licensed:
 *   GPLV3 per non-commercial usage; 
 *   Commercial license per commercial usage.
 * Read http://gridifier.io/license for details.
 * Copyright 2015 nTech
 */

Gridifier.GridSizesUpdater = function(a, b, c, d, e) {
    var f = this;
    f._gridifier = null;
    f._grid = null;
    f._connections = null;
    f._settings = null;
    f._eventEmitter = null;
    f._gridSizesUpdateTimeout = null;
    this._css = {};
    this._construct = function() {
        f._gridifier = a;
        f._grid = b;
        f._connections = c;
        f._settings = d;
        f._eventEmitter = e;
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        f._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.GridSizesUpdater.prototype.scheduleGridSizesUpdate = function() {
    var a = this;
    if (this._gridSizesUpdateTimeout != null) {
        clearTimeout(this._gridSizesUpdateTimeout);
        this._gridSizesUpdateTimeout = null;
    }
    var b = function() {
        if (a._settings.isVerticalGrid()) {
            a._updateVerticalGridSizes.call(a);
        } else if (a._settings.isHorizontalGrid()) {
            a._updateHorizontalGridSizes.call(a);
        }
    };
    this._gridSizesUpdateTimeout = setTimeout(function() {
        if (!a._gridifier._sizesTransformer._itemsReappender.isReappendQueueEmpty()) {
            a.scheduleGridSizesUpdate();
            return;
        }
        b.call(a);
    }, this._settings.getGridTransformTimeout());
};

Gridifier.GridSizesUpdater.prototype._updateVerticalGridSizes = function() {
    var a = this._connections.get();
    if (a.length == 0) return;
    var b = a[0].y2;
    for (var c = 1; c < a.length; c++) {
        if (a[c].y2 > b) b = a[c].y2;
    }
    if (this._settings.isExpandGridTransformType()) {
        if (this._grid.getGridY2() < b) Dom.css.set(this._grid.getGrid(), {
            height: b + 1 + "px"
        });
    } else if (this._settings.isFitGridTransformType()) {
        Dom.css.set(this._grid.getGrid(), {
            height: b + 1 + "px"
        });
    }
    this._eventEmitter.emitGridSizesChangeEvent(this._grid.getGrid(), this._grid.getGridX2() + 1, b + 1);
};

Gridifier.GridSizesUpdater.prototype._updateHorizontalGridSizes = function() {
    var a = this._connections.get();
    if (a.length == 0) return;
    var b = a[0].x2;
    for (var c = 1; c < a.length; c++) {
        if (a[c].x2 > b) b = a[c].x2;
    }
    if (this._settings.isExpandGridTransformType()) {
        if (this._grid.getGridX2() < b) Dom.css.set(this._grid.getGrid(), {
            width: b + 1 + "px"
        });
    } else if (this._settings.isFitGridTransformType()) {
        Dom.css.set(this._grid.getGrid(), {
            width: b + 1 + "px"
        });
    }
    this._eventEmitter.emitGridSizesChangeEvent(this._grid.getGrid(), b + 1, this._grid.getGridY2() + 1);
};