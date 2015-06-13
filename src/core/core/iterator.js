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

Gridifier.Iterator = function(a, b, c, d, e) {
    var f = this;
    this._settings = null;
    this._collector = null;
    this._connections = null;
    this._connectionsSorter = null;
    this._guid = null;
    this._css = {};
    this._construct = function() {
        f._settings = a;
        f._collector = b;
        f._connections = c;
        f._connectionsSorter = d;
        f._guid = e;
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        f._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.Iterator.prototype.getFirst = function() {
    var a = this._connections.get();
    if (a.length == 0) return null;
    a = this._connectionsSorter.sortConnectionsPerReappend(a);
    return a[0].item;
};

Gridifier.Iterator.prototype.getLast = function() {
    var a = this._connections.get();
    if (a.length == 0) return null;
    a = this._connectionsSorter.sortConnectionsPerReappend(a);
    return a[a.length - 1].item;
};

Gridifier.Iterator.prototype.getNext = function(a) {
    var b = this._collector.toDOMCollection(a);
    a = b[0];
    var c = this._connections.get();
    if (c.length == 0) return null;
    c = this._connectionsSorter.sortConnectionsPerReappend(c);
    for (var d = 0; d < c.length; d++) {
        if (this._guid.getItemGUID(c[d].item) == this._guid.getItemGUID(a)) {
            if (d + 1 > c.length - 1) return null;
            return c[d + 1].item;
        }
    }
    return null;
};

Gridifier.Iterator.prototype.getPrev = function(a) {
    var b = this._collector.toDOMCollection(a);
    a = b[0];
    var c = this._connections.get();
    if (c.length == 0) return null;
    c = this._connectionsSorter.sortConnectionsPerReappend(c);
    for (var d = c.length - 1; d >= 0; d--) {
        if (this._guid.getItemGUID(c[d].item) == this._guid.getItemGUID(a)) {
            if (d - 1 < 0) return null;
            return c[d - 1].item;
        }
    }
    return null;
};

Gridifier.Iterator.prototype.getAll = function() {
    var a = this._connections.get();
    if (a.length == 0) return [];
    var b = this._connectionsSorter.sortConnectionsPerReappend(a);
    var c = [];
    for (var d = 0; d < b.length; d++) c.push(b[d].item);
    return c;
};