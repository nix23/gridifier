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

Gridifier.EventEmitter = function(a) {
    var b = this;
    b._gridifier = null;
    b._showCallbacks = [];
    b._hideCallbacks = [];
    b._gridSizesChangeCallbacks = [];
    b._transformCallbacks = [];
    b._responsiveTransformCallbacks = [];
    b._gridRetransformCallbacks = [];
    b._connectionCreateCallbacks = [];
    b._disconnectCallbacks = [];
    b._insertCallbacks = [];
    b._insertEventTimeout = null;
    b._dragEndCallbacks = [];
    b._kernelCallbacks = {
        itemsReappendExecutionEndPerDragifier: null,
        beforeItemShowPerRetransformSorter: null
    };
    this._css = {};
    this._construct = function() {
        b._gridifier = a;
        b._bindEmitterToGridifier();
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        b._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.EventEmitter.prototype._bindEmitterToGridifier = function() {
    var a = this;
    this._gridifier.onShow = function(b) {
        a.onShow.call(a, b);
    };
    this._gridifier.onHide = function(b) {
        a.onHide.call(a, b);
    };
    this._gridifier.onGridSizesChange = function(b) {
        a.onGridSizesChange.call(a, b);
    };
    this._gridifier.onTransform = function(b) {
        a.onTransform.call(a, b);
    };
    this._gridifier.onResponsiveTransform = function(b) {
        a.onResponsiveTransform.call(a, b);
    };
    this._gridifier.onGridRetransform = function(b) {
        a.onGridRetransform.call(a, b);
    };
    this._gridifier.onConnectionCreate = function(b) {
        a.onConnectionCreate.call(a, b);
    };
    this._gridifier.onDisconnect = function(b) {
        a.onDisconnect.call(a, b);
    };
    this._gridifier.onInsert = function(b) {
        a.onInsert.call(a, b);
    };
    this._gridifier.onDragEnd = function(b) {
        a.onDragEnd.call(a, b);
    };
};

Gridifier.EventEmitter.prototype.onShow = function(a) {
    this._showCallbacks.push(a);
};

Gridifier.EventEmitter.prototype.onHide = function(a) {
    this._hideCallbacks.push(a);
};

Gridifier.EventEmitter.prototype.onTransform = function(a) {
    this._transformCallbacks.push(a);
};

Gridifier.EventEmitter.prototype.onResponsiveTransform = function(a) {
    this._responsiveTransformCallbacks.push(a);
};

Gridifier.EventEmitter.prototype.onGridRetransform = function(a) {
    this._gridRetransformCallbacks.push(a);
};

Gridifier.EventEmitter.prototype.onGridSizesChange = function(a) {
    this._gridSizesChangeCallbacks.push(a);
};

Gridifier.EventEmitter.prototype.onConnectionCreate = function(a) {
    this._connectionCreateCallbacks.push(a);
};

Gridifier.EventEmitter.prototype.onDisconnect = function(a) {
    this._disconnectCallbacks.push(a);
};

Gridifier.EventEmitter.prototype.onInsert = function(a) {
    this._insertCallbacks.push(a);
};

Gridifier.EventEmitter.prototype.onDragEnd = function(a) {
    this._dragEndCallbacks.push(a);
};

Gridifier.EventEmitter.prototype.onItemsReappendExecutionEndPerDragifier = function(a) {
    this._kernelCallbacks.itemsReappendExecutionEndPerDragifier = a;
};

Gridifier.EventEmitter.prototype.onBeforeShowPerRetransformSorter = function(a) {
    this._kernelCallbacks.beforeItemShowPerRetransformSorter = a;
};

Gridifier.EventEmitter.prototype.emitShowEvent = function(a) {
    for (var b = 0; b < this._showCallbacks.length; b++) {
        this._showCallbacks[b](a);
        if (this._gridifier.hasItemBindedClone(a)) {
            var c = this._gridifier.getItemClone(a);
            this._showCallbacks[b](a);
        }
    }
};

Gridifier.EventEmitter.prototype.emitHideEvent = function(a) {
    for (var b = 0; b < this._hideCallbacks.length; b++) {
        this._hideCallbacks[b](a);
        if (this._gridifier.hasItemBindedClone(a)) {
            var c = this._gridifier.getItemClone(a);
            this._hideCallbacks[b](a);
        }
    }
    var d = this._gridifier.getCollector();
    if (d.isItemRestrictedToCollect(a)) {
        for (var e = 0; e < this._disconnectCallbacks.length; e++) this._disconnectCallbacks[e](a);
    }
};

Gridifier.EventEmitter.prototype.emitGridSizesChangeEvent = function() {
    for (var a = 0; a < this._gridSizesChangeCallbacks.length; a++) {
        this._gridSizesChangeCallbacks[a]();
    }
};

Gridifier.EventEmitter.prototype.emitResponsiveTransformEvent = function(a, b, c) {
    for (var d = 0; d < this._responsiveTransformCallbacks.length; d++) {
        this._responsiveTransformCallbacks[d](a, b, c);
    }
};

Gridifier.EventEmitter.prototype.emitTransformEvent = function(a, b, c, d, e) {
    for (var f = 0; f < this._transformCallbacks.length; f++) {
        this._transformCallbacks[f](a, b, c, d, e);
    }
};

Gridifier.EventEmitter.prototype.emitGridRetransformEvent = function() {
    for (var a = 0; a < this._gridRetransformCallbacks.length; a++) {
        this._gridRetransformCallbacks[a]();
    }
};

Gridifier.EventEmitter.prototype.emitConnectionCreateEvent = function(a) {
    for (var b = 0; b < this._connectionCreateCallbacks.length; b++) {
        (function(a, b) {
            setTimeout(function() {
                a(b);
            }, 0);
        })(this._connectionCreateCallbacks[b], a);
    }
};

Gridifier.EventEmitter.prototype.emitInsertEvent = function() {
    var a = function() {
        for (var a = 0; a < this._insertCallbacks.length; a++) {
            this._insertCallbacks[a]();
        }
    };
    if (this._insertEventTimeout != null) {
        clearTimeout(this._insertEventTimeout);
        this._insertEventTimeout = null;
    }
    var b = this;
    this._insertEventTimeout = setTimeout(function() {
        a.call(b);
    }, 20);
};

Gridifier.EventEmitter.prototype.emitDragEndEvent = function(a) {
    for (var b = 0; b < this._dragEndCallbacks.length; b++) {
        this._dragEndCallbacks[b](a);
    }
};

Gridifier.EventEmitter.prototype.emitItemsReappendExecutionEndPerDragifier = function() {
    if (this._kernelCallbacks.itemsReappendExecutionEndPerDragifier != null) {
        this._kernelCallbacks.itemsReappendExecutionEndPerDragifier();
        this._kernelCallbacks.itemsReappendExecutionEndPerDragifier = null;
    }
};

Gridifier.EventEmitter.prototype.emitBeforeShowPerRetransformSortEvent = function() {
    if (this._kernelCallbacks.beforeItemShowPerRetransformSorter != null) this._kernelCallbacks.beforeItemShowPerRetransformSorter();
};