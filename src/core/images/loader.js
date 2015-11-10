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

ImagesLoader = function() {
    this._batches = [];
    this._loaded = [];
};

proto(ImagesLoader, {
    schedule: function(a, b, c) {
        if (a.length == 0) {
            this._batches.push({
                items: a,
                images: [],
                op: b,
                data: c
            });
            this._checkLoad();
            return;
        }
        var d = this._findImages(a);
        this._batches.push({
            items: a,
            images: d,
            op: b,
            data: c
        });
        if (d.length == 0) {
            this._checkLoad();
            return;
        }
        for (var e = 0; e < d.length; e++) d[e].scheduleLoad();
    },
    _findImages: function(a) {
        var b = [];
        for (var c = 0; c < a.length; c++) {
            if (a[c].nodeName == "IMG") {
                if (!this._isAlreadyLoaded(a[c])) b.push(new LoadedImage(a[c]));
                continue;
            }
            if (!this._isValidNode(a[c])) continue;
            var d = a[c].querySelectorAll("img");
            for (var e = 0; e < d.length; e++) {
                if (!this._isAlreadyLoaded(d[e])) b.push(new LoadedImage(d[e]));
            }
        }
        return b;
    },
    _isAlreadyLoaded: function(a) {
        for (var b = 0; b < this._loaded.length; b++) {
            if (this._loaded[b] === a.src) return true;
        }
        return a.src.length == 0;
    },
    _isValidNode: function(a) {
        return a.nodeType && (a.nodeType == 1 || a.nodeType == 9 || a.nodeType == 11);
    },
    onLoad: function(a) {
        this._loaded.push(a.src);
        this._checkLoad();
    },
    _checkLoad: function() {
        for (var a = 0; a < this._batches.length; a++) {
            var b = true;
            var c = this._batches[a].images;
            for (var d = 0; d < c.length; d++) {
                if (!c[d].isLoaded()) {
                    b = false;
                    break;
                }
            }
            if (!b) break;
            for (var d = 0; d < c.length; d++) c[d].destroy();
            this._batches[a].images = [];
            this._callOp(this._batches[a].items, this._batches[a].op, this._batches[a].data);
            this._batches.splice(a, 1);
            a--;
        }
    },
    _callOp: function(a, b, c) {
        var d = c.batchSize;
        var e = c.batchDelay;
        if (b == OPS.APPEND || b == OPS.PREPEND) core.exec(b, a, d, e); else if (b == OPS.SIL_APPEND) core.execSilentAppend(a, d, e); else if (b == OPS.INS_BEFORE) core.exec(b, a, d, e, c.beforeItem); else if (b == OPS.INS_AFTER) core.exec(b, a, d, e, c.afterItem); else err("Wrong op.");
    }
});