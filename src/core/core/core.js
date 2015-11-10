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

var Core = function() {
    this._onResize = null;
    this._bindEvents();
    self(this, {
        destroy: function() {
            this._unbindEvents();
            return gridifier;
        },
        set: function(a, b) {
            settings.set(a, b);
            return gridifier;
        },
        setApi: function(a, b) {
            settings.setApi(a, b);
            return gridifier;
        },
        addApi: function(a, b, c) {
            settings.addApi(a, b, c);
            return gridifier;
        },
        get: function(a) {
            return settings.get(a);
        },
        toggle: function(a) {
            return gridifier.setApi("toggle", a);
        },
        sort: function(a) {
            return gridifier.setApi("sort", a);
        },
        coordsChanger: function(a) {
            return gridifier.setApi("coordsChanger", a);
        },
        drag: function(a) {
            return gridifier.setApi("drag", a);
        },
        rsort: function(a) {
            gridifier.setApi("rsort", a);
            reposition.all();
            return gridifier;
        },
        resort: function() {
            reposition.sync();
            resorter.resort();
            reposition.all();
            return gridifier;
        },
        filter: function(a) {
            reposition.sync();
            gridifier.setApi("filter", a);
            filtrator.filter();
            reposition.all();
            return gridifier;
        },
        reposition: function() {
            antialiaser.updateAs();
            reposition.all();
            return gridifier;
        },
        prepend: function(a, b, c) {
            var d = bind("eq", settings);
            if (d("loadImages", true)) {
                var e = d("prepend", "mirrored") ? OPS.INS_BEFORE : OPS.PREPEND;
                imagesLoader.schedule(gridItem.toNative(a), e, {
                    batchSize: b,
                    batchDelay: c,
                    beforeItem: null
                });
            } else {
                if (d("prepend", "mirrored")) gridifier.insertBefore(a, null, b, c); else this.exec(OPS.PREPEND, a, b, c);
            }
            return gridifier;
        },
        append: function(a, b, c) {
            if (settings.eq("loadImages", true)) {
                imagesLoader.schedule(gridItem.toNative(a), OPS.APPEND, {
                    batchSize: b,
                    batchDelay: c
                });
            } else this.exec(OPS.APPEND, a, b, c);
            return gridifier;
        },
        silentAppend: function(a, b, c) {
            if (settings.eq("loadImages", true)) {
                imagesLoader.schedule(gridItem.toNative(a), OPS.SIL_APPEND, {
                    batchSize: b,
                    batchDelay: c
                });
            } else this.execSilentAppend(a, b, c);
            return gridifier;
        },
        silentRender: function(a, b, c) {
            silentRenderer.exec(a, b, c);
            return gridifier;
        },
        getSilent: function(a) {
            return silentRenderer.getScheduled(a);
        },
        insertBefore: function(a, b, c, d) {
            if (settings.eq("loadImages", true)) {
                imagesLoader.schedule(gridItem.toNative(a), OPS.INS_BEFORE, {
                    batchSize: c,
                    batchDelay: d,
                    beforeItem: b
                });
            } else this.exec(OPS.INS_BEFORE, a, c, d, b);
            return gridifier;
        },
        insertAfter: function(a, b, c, d) {
            if (settings.eq("loadImages", true)) {
                imagesLoader.schedule(gridItem.toNative(a), OPS.INS_AFTER, {
                    batchSize: c,
                    batchDelay: d,
                    afterItem: b
                });
            } else this.exec(OPS.INS_AFTER, a, c, d, b);
            return gridifier;
        },
        appendNew: function(a, b) {
            gridifier.append(gridifier.collectNew(), a, b);
            return gridifier;
        },
        prependNew: function(a, b) {
            gridifier.prepend(gridifier.collectNew(), a, b);
            return gridifier;
        },
        rotate: function(a, b, c, d) {
            gridifier.toggle(b);
            var a = gridItem.toNative(a);
            if (typeof c == "undefined") {
                renderer.rotate(a);
                return gridifier;
            }
            insertQueue.scheduleFnExec(a, c, d, function(a) {
                renderer.rotate(a);
            });
            return gridifier;
        }
    });
};

proto(Core, {
    _bindEvents: function() {
        var a = bind("get", settings);
        var b = null;
        this._onResize = function() {
            if (a("vpResizeDelay") == null) {
                gridifier.reposition();
                return;
            }
            clearTimeout(b);
            b = setTimeout(function() {
                gridifier.reposition();
            }, a("vpResizeDelay"));
        };
        Event.add(window, "resize", this._onResize);
    },
    _unbindEvents: function() {
        Event.rm(window, "resize", this._onResize);
        if (gridifier.isDragifierOn()) gridifier.dragifierOff();
    },
    exec: function(a, b, c, d, e) {
        setTimeout(function() {
            insertQueue.schedule(a, b, c, d, e);
        }, C.REFLOW_FIX_DELAY);
    },
    execSilentAppend: function(a, b, c) {
        silentRenderer.schedule(gridItem.toNative(a));
        this.exec(OPS.APPEND, a, b, c);
    }
});