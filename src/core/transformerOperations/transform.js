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

Gridifier.TransformerOperations.Transform = function(a, b) {
    var c = this;
    this._sizesTransformer = null;
    this._sizesResolverManager = null;
    this._css = {};
    this._construct = function() {
        c._sizesTransformer = a;
        c._sizesResolverManager = b;
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        c._unbindEvents();
    };
    this._construct();
    return this;
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