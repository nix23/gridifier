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

Gridifier.TransformerOperations.Toggle = function(a, b, c, d, e, f) {
    var g = this;
    this._gridifier = null;
    this._collector = null;
    this._connections = null;
    this._guid = null;
    this._sizesTransformer = null;
    this._sizesResolverManager = null;
    this._optionsParser = null;
    this._css = {};
    this._construct = function() {
        g._gridifier = a;
        g._collector = b;
        g._connections = c;
        g._guid = d;
        g._sizesTransformer = e;
        g._sizesResolverManager = f;
        g._optionsParser = new Gridifier.TransformerOperations.OptionsParser(g._collector, g._sizesResolverManager);
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        g._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.TransformerOperations.Toggle.prototype.prepare = function(a, b, c, d) {
    var e = this._optionsParser.parseItemsToTransform(a);
    var f = this._optionsParser.parseSizesToTransform(a, b, c);
    var g = this._parseTransformationData(e, f, d);
    if (g.length == 0) return [];
    return g;
};

Gridifier.TransformerOperations.Toggle.prototype._parseTransformationData = function(a, b, c) {
    var d = new Gridifier.SizesTransformer.ItemNewRawSizesFinder(this._sizesResolverManager);
    var e = [];
    for (var f = 0; f < a.length; f++) {
        if (this._gridifier.isItemClone(a[f])) continue;
        var g = this._connections.findConnectionByItem(a[f]);
        var h = null;
        if (d.areConnectionSizesToggled(g)) {
            h = d.getConnectionSizesPerUntoggle(g);
            d.unmarkConnectionPerToggle(g);
        } else {
            d.markConnectionPerToggle(g, c);
            h = d.initConnectionTransform(g, b[f][0], b[f][1], c);
        }
        e.push({
            connectionToTransform: g,
            widthToTransform: h.targetWidth,
            heightToTransform: h.targetHeight,
            usePaddingBottomInsteadHeight: c
        });
    }
    return e;
};