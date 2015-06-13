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

Gridifier.SizesTransformer.TransformedConnectionsSorter = function(a) {
    var b = this;
    b._connectionsSorter = null;
    this._css = {};
    this._construct = function() {
        b._connectionsSorter = a;
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        b._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.SizesTransformer.TransformedConnectionsSorter.prototype.sortTransformedConnections = function(a) {
    var b = this;
    var c = [];
    for (var d = 0; d < a.length; d++) c.push(a[d].connectionToTransform);
    var e = 1;
    var f = this._connectionsSorter.sortConnectionsPerReappend(c);
    for (var d = 0; d < f.length; d++) {
        for (var g = 0; g < a.length; g++) {
            if (f[d].itemGUID == a[g].connectionToTransform.itemGUID) {
                a[g].sortNumber = e;
                e++;
                break;
            }
        }
    }
    a.sort(function(a, b) {
        if (a.sortNumber > b.sortNumber) return 1;
        return -1;
    });
    return a;
};