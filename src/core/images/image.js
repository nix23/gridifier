/* Gridifier v2.~.~ source file for custom build.
 * Async Responsive HTML Grids
 * http://gridifier.io
 * 
 * Gridifier is dual-licensed:
 *   Non-commercial license - https://creativecommons.org/licenses/by-nc-sa/4.0/.
 *   Commercial license - http://gridifier.io/license (Commercial license).
 * Read http://gridifier.io/license for details.
 * Copyright 2015 nTech
 */

LoadedImage = function(a) {
    this._image = a;
    this._loadedImage = null;
    this._isLoaded = false;
    this._onLoad = null;
    this._onError = null;
};

proto(LoadedImage, {
    _bindEvents: function() {
        var a = this;
        a._onLoad = function() {
            a._load.call(a);
        };
        a._onError = function() {
            a._error.call(a);
        };
        Event.add(a._loadedImage, "load", a._onLoad);
        Event.add(a._loadedImage, "error", a._onError);
    },
    _unbindEvents: function() {
        var a = this;
        if (a._onLoad != null) Event.rm(a._loadedImage, "load", a._onLoad);
        if (a._onError != null) Event.rm(a._loadedImage, "error", a._onError);
    },
    destroy: function() {
        this._unbindEvents();
    },
    scheduleLoad: function() {
        if (this._isAlreadyLoaded()) {
            this._isLoaded = true;
            imagesLoader.onLoad(this._image);
            return;
        }
        this._loadedImage = this._loader();
        this._bindEvents();
        this._loadedImage.src = this._image.src;
    },
    _loader: function() {
        return new Image();
    },
    isLoaded: function() {
        return this._isLoaded;
    },
    _isAlreadyLoaded: function() {
        return this._image.complete && this._image.naturalWidth !== undefined && this._image.naturalWidth !== 0;
    },
    _load: function() {
        this._isLoaded = true;
        imagesLoader.onLoad(this._image);
    },
    _error: function() {
        this._isLoaded = true;
        imagesLoader.onLoad(this._image);
    }
});