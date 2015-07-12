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

Gridifier.ImagesResolver.ResolvedImage = function(a, b) {
    var c = this;
    this._image = null;
    this._imagesResolver = null;
    this._resolvedImage = null;
    this._isResolved = false;
    this._loadCallback = null;
    this._errorCallback = null;
    this._construct = function() {
        c._image = b;
        c._imagesResolver = a;
    };
    this._bindEvents = function() {
        c._loadCallback = function() {
            c._onLoad.call(c);
        };
        c._errorCallback = function() {
            c._onError.call(c);
        };
        Event.add(c._resolvedImage, "load", c._loadCallback);
        Event.add(c._resolvedImage, "error", c._errorCallback);
    };
    this._unbindEvents = function() {
        Event.remove(c._resolvedImage, "load", c._loadCallback);
        Event.remove(c._resolvedImage, "error", c._errorCallback);
    };
    this.destruct = function() {
        c._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.ImagesResolver.ResolvedImage.prototype.scheduleResolve = function() {
    if (this._isAlreadyResolved()) {
        this._isResolved = true;
        this._imagesResolver.onResolve(this, this._image);
        return;
    }
    this._resolvedImage = new Image();
    this._bindEvents();
    this._resolvedImage.src = this._image.src;
};

Gridifier.ImagesResolver.ResolvedImage.prototype.isImageResolved = function() {
    return this._isResolved;
};

Gridifier.ImagesResolver.ResolvedImage.prototype._isAlreadyResolved = function() {
    return this._image.complete && this._image.naturalWidth !== undefined && this._image.naturalWidth !== 0;
};

Gridifier.ImagesResolver.ResolvedImage.prototype._onLoad = function() {
    this._isResolved = true;
    this._imagesResolver.onResolve(this, this._image);
};

Gridifier.ImagesResolver.ResolvedImage.prototype._onError = function() {
    this._isResolved = true;
    this._imagesResolver.onResolve(this, this._image);
};