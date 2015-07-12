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

Gridifier.TransformerOperations.Transform = function(a, b, c, d, e, f) {
    var g = this;
    this._gridifier = null;
    this._collector = null;
    this._connections = null;
    this._guid = null;
    this._sizesTransformer = null;
    this._sizesResolverManager = null;
    this._optionsParser = null;
    this._transformationData = [];
    this._executeTransformOperationTimeout = null;
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

Gridifier.TransformerOperations.Transform.prototype.prepare = function(a, b, c, d) {
    var e = this._optionsParser.parseItemsToTransform(a);
    var f = this._optionsParser.parseSizesToTransform(a, b, c);
    var g = this._parseTransformationData(e, f, d);
    if (g.length == 0) return [];
    return g;
};

Gridifier.TransformerOperations.Transform.prototype._parseTransformationData = function(a, b, c) {
    var d = new Gridifier.SizesTransformer.ItemNewRawSizesFinder(this._sizesResolverManager);
    var e = [];
    for (var f = 0; f < a.length; f++) {
        if (this._gridifier.isItemClone(a[f])) continue;
        var g = this._connections.findConnectionByItem(a[f]);
        var h = null;
        h = d.initConnectionTransform(g, b[f][0], b[f][1], c);
        e.push({
            connectionToTransform: g,
            widthToTransform: h.targetWidth,
            heightToTransform: h.targetHeight,
            usePaddingBottomInsteadHeight: c
        });
    }
    return e;
};

Gridifier.TransformerOperations.Transform.prototype.schedule = function(a) {
    if (a.length == 0) return;
    if (this._executeTransformOperationTimeout == null) {
        this._transformationData = a;
    } else {
        clearTimeout(this._executeTransformOperationTimeout);
        this._executeTransformOperationTimeout = null;
        for (var b = 0; b < a.length; b++) {
            var c = false;
            for (var d = 0; d < this._transformationData.length; d++) {
                if (this._transformationData[d].connectionToTransform.itemGUID == a[b].connectionToTransform.itemGUID) {
                    this._transformationData[d] = a[b];
                    c = true;
                    break;
                }
            }
            if (!c) this._transformationData.push(a[b]);
        }
    }
    var e = this;
    this._executeTransformOperationTimeout = setTimeout(function() {
        e._execute.call(e, e._transformationData);
        e._transformationData = [];
    }, 40);
};

Gridifier.TransformerOperations.Transform.prototype._execute = function(a) {
    this._sizesResolverManager.startCachingTransaction();
    this._sizesTransformer.transformConnectionSizes(a);
    this._sizesResolverManager.stopCachingTransaction();
};

Gridifier.TransformerOperations.Transform.prototype.executeRetransformAllSizes = function() {
    this._sizesResolverManager.startCachingTransaction();
    this._sizesTransformer.retransformAllConnections();
    this._sizesResolverManager.stopCachingTransaction();
};

Gridifier.TransformerOperations.Transform.prototype.executeRetransformFromFirstSortedConnection = function(a) {
    this._sizesResolverManager.startCachingTransaction();
    this._sizesTransformer.retransformFromFirstSortedConnection(a);
    this._sizesResolverManager.stopCachingTransaction();
};