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

Gridifier.LifecycleCallbacks = function(a) {
    var b = this;
    this._collector = null;
    this._preInsertCallbacks = [];
    this._preDisconnectCallbacks = [];
    this._css = {};
    this._construct = function() {
        b._collector = a;
        b._insertCallbacks = [];
        b._disconnectCallbacks = [];
        this._bindEvents();
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        b._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.LifecycleCallbacks.prototype.addPreInsertCallback = function(a) {
    this._preInsertCallbacks.push(a);
};

Gridifier.LifecycleCallbacks.prototype.addPreDisconnectCallback = function(a) {
    this._preDisconnectCallbacks.push(a);
};

Gridifier.LifecycleCallbacks.prototype.executePreInsertCallbacks = function(a) {
    var a = this._collector.toDOMCollection(a);
    for (var b = 0; b < this._preInsertCallbacks.length; b++) {
        this._preInsertCallbacks[b](a);
    }
};

Gridifier.LifecycleCallbacks.prototype.executePreDisconnectCallbacks = function(a) {
    var a = this._collector.toDOMCollection(a);
    for (var b = 0; b < this._preDisconnectCallbacks.length; b++) {
        this._preDisconnectCallbacks[b](a);
    }
};