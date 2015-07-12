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

Gridifier.Operation = function() {
    var a = this;
    this._lastOperation = null;
    this._css = {};
    this._construct = function() {};
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        a._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.Operation.prototype.isInitialOperation = function(a) {
    if (this._lastOperation == null) {
        this._lastOperation = a;
        return true;
    }
    return false;
};

Gridifier.Operation.prototype.isCurrentOperationSameAsPrevious = function(a) {
    if (this._lastOperation != a) {
        this._lastOperation = a;
        return false;
    }
    return true;
};

Gridifier.Operation.prototype.setLastOperation = function(a) {
    this._lastOperation = a;
};