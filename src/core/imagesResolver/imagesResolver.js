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

Gridifier.ImagesResolver = function(a) {
    var b = this;
    this._gridifier = null;
    this._batchesToResolve = [];
    this._alreadyResolved = [];
    this._construct = function() {
        b._gridifier = a;
        b._bindEvents();
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {
    };
    this.destruct = function() {
        b._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.ImagesResolver.OPERATIONS = {
    APPEND: 0,
    SILENT_APPEND: 1,
    PREPEND: 2,
    INSERT_BEFORE: 3,
    INSERT_AFTER: 4
};

Gridifier.ImagesResolver.prototype.scheduleImagesResolve = function(a, b, c) {
    if (a.length == 0) {
        this._batchesToResolve.push({
            items: a,
            images: [],
            operation: b,
            data: c
        });
        this._emitResolveEvent();
        return;
    }
    var d = this._findImages(a);
    this._batchesToResolve.push({
        items: a,
        images: d,
        operation: b,
        data: c
    });
    if (d.length == 0) {
        this._emitResolveEvent();
        return;
    }
    for (var e = 0; e < d.length; e++) d[e].scheduleResolve();
};

Gridifier.ImagesResolver.prototype._findImages = function(a) {
    var b = [];
    for (var c = 0; c < a.length; c++) {
        if (a[c].nodeName == "IMG") {
            if (!this._isAlreadyResolved(a[c])) b.push(new Gridifier.ImagesResolver.ResolvedImage(this, a[c]));
            continue;
        }
        if (!this._isValidNode(a[c])) continue;
        var d = a[c].querySelectorAll("img");
        for (var e = 0; e < d.length; e++) {
            if (!this._isAlreadyResolved(d[e])) b.push(new Gridifier.ImagesResolver.ResolvedImage(this, d[e]));
        }
    }
    return b;
};

Gridifier.ImagesResolver.prototype._isAlreadyResolved = function(a) {
    for (var b = 0; b < this._alreadyResolved.length; b++) {
        if (this._alreadyResolved[b] === a.src) return true;
    }
    if (a.src.length == 0) return true;
    return false;
};

Gridifier.ImagesResolver.prototype._isValidNode = function(a) {
    return a.nodeType && (a.nodeType == 1 || a.nodeType == 9 || a.nodeType == 11);
};

Gridifier.ImagesResolver.prototype.onResolve = function(a, b) {
    this._alreadyResolved.push(b.src);
    this._emitResolveEvent();
};

Gridifier.ImagesResolver.prototype._emitResolveEvent = function() {
    for (var a = 0; a < this._batchesToResolve.length; a++) {
        var b = true;
        var c = this._batchesToResolve[a].images;
        for (var d = 0; d < c.length; d++) {
            if (!c[d].isImageResolved()) {
                b = false;
                break;
            }
        }
        if (b) {
            for (var d = 0; d < c.length; d++) c[d].destruct();
            this._batchesToResolve[a].images = [];
            var e = this._batchesToResolve[a].items;
            var f = this._batchesToResolve[a].data;
            var g = Gridifier.ImagesResolver.OPERATIONS;
            switch (this._batchesToResolve[a].operation) {
              case g.APPEND:
                this._gridifier.executeAppend(e, f.batchSize, f.batchTimeout);
                break;

              case g.SILENT_APPEND:
                this._gridifier.executeSilentAppend(e, f.batchSize, f.batchTimeout);
                break;

              case g.PREPEND:
                this._gridifier.executePrepend(e, f.batchSize, f.batchTimeout);
                break;

              case g.INSERT_BEFORE:
                this._gridifier.executeInsertBefore(e, f.beforeItem, f.batchSize, f.batchTimeout);
                break;

              case g.INSERT_AFTER:
                this._gridifier.executeInsertAfter(e, f.afterItem, f.batchSize, f.batchTimeout);
                break;

              default:
                console.log("Gridifier ERROR: Unknown images resolver operation.");
                break;
            }
            this._batchesToResolve.splice(a, 1);
            a--;
        } else {
            break;
        }
    }
};