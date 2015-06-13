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

Gridifier.Grid = function(a, b) {
    var c = this;
    this._grid = null;
    this._collector = null;
    this._sizesResolverManager = null;
    this._css = {};
    this._construct = function() {
        c._grid = a;
        c._sizesResolverManager = b;
        c._extractGrid(a);
        c._adjustGridCss();
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        c._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.Grid.prototype.setCollectorInstance = function(a) {
    this._collector = a;
};

Gridifier.Grid.prototype._extractGrid = function(a) {
    if (Dom.isJqueryObject(a)) this._grid = a.get(0); else if (Dom.isNativeDOMObject(a)) this._grid = a; else if (Dom.isArray(a) && Dom.isNativeDOMObject(a[0])) this._grid = a[0]; else new Gridifier.Error(Gridifier.Error.ERROR_TYPES.EXTRACT_GRID);
};

Gridifier.Grid.prototype._adjustGridCss = function() {
    var a = SizesResolver.getComputedCSS(this._grid);
    if (a.position != "relative" && a.position != "absolute") Dom.css.set(this._grid, {
        position: "relative"
    });
};

Gridifier.Grid.prototype.getGrid = function() {
    return this._grid;
};

Gridifier.Grid.prototype.getGridX2 = function() {
    return this._sizesResolverManager.outerWidth(this._grid, false, true) - 1;
};

Gridifier.Grid.prototype.getGridY2 = function() {
    return this._sizesResolverManager.outerHeight(this._grid, false, true) - 1;
};

Gridifier.Grid.prototype.addToGrid = function(a) {
    var a = this._collector.toDOMCollection(a);
    for (var b = 0; b < a.length; b++) {
        this._grid.appendChild(a[b]);
    }
    this._collector.attachToGrid(a);
};

Gridifier.Grid.prototype.markAsGridItem = function(a) {
    var a = this._collector.toDOMCollection(a);
    this._collector.attachToGrid(a);
};