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

Gridifier.TransformerOperations.OptionsParser = function(a, b) {
    var c = this;
    this._collector = null;
    this._sizesResolverManager = null;
    this._css = {};
    this._construct = function() {
        c._collector = a;
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

Gridifier.TransformerOperations.OptionsParser.prototype.parseItemsToTransform = function(a) {
    var b = [];
    if (Dom.isArray(a)) {
        for (var c = 0; c < a.length; c++) {
            b.push(a[c][0]);
        }
    } else {
        b.push(a);
    }
    b = this._collector.toDOMCollection(b);
    this._sizesResolverManager.startCachingTransaction();
    this._collector.ensureAllItemsAreAttachedToGrid(b);
    this._collector.ensureAllItemsCanBeAttachedToGrid(b);
    return b;
};

Gridifier.TransformerOperations.OptionsParser.prototype.parseSizesToTransform = function(a, b, c) {
    var d = [];
    if (Dom.isArray(a)) {
        for (var e = 0; e < a.length; e++) {
            d.push([ a[e][1], a[e][2] ]);
        }
    } else {
        d.push([ b, c ]);
    }
    return d;
};