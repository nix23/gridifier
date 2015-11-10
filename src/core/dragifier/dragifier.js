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

Dragifier = function() {
    this._items = [];
    this._isDragging = false;
    this._areEventsBinded = false;
    this._origReposQueueSize = null;
    this._coordsChanger = dragifierApi.getCoordsChanger();
    this._createEvents();
    if (!settings.eq("dragifier", false)) this._bindEvents();
    self(this, {
        dragifierOn: function() {
            this._bindEvents();
        },
        dragifierOff: function() {
            this._unbindEvents();
        },
        isDragifierOn: function() {
            return this._areEventsBinded;
        }
    });
};

proto(Dragifier, {
    _createEvents: function() {
        var a = this;
        this._touch = {
            start: function(b) {
                a._touchStart.call(a, b);
            },
            end: function(b) {
                if (!a._isDragging) return;
                b.preventDefault();
                setTimeout(function() {
                    a._touchEnd.call(a, b);
                }, 0);
            },
            move: function(b) {
                if (!a._isDragging) return;
                b.preventDefault();
                setTimeout(function() {
                    a._touchMove.call(a, b);
                }, 0);
            }
        };
        this._mouse = {
            down: function(b) {
                a._mouseDown.call(a, b);
            },
            up: function(b) {
                setTimeout(function() {
                    a._mouseUp.call(a, b);
                }, 0);
            },
            move: function(b) {
                setTimeout(function() {
                    a._mouseMove.call(a, b);
                }, 0);
            }
        };
    },
    _touchStart: function(a) {
        var b = this;
        var c = a.changedTouches[0];
        var d = b._findClosestConnected(a.target);
        if (d == null) return;
        b._initDrag.call(b, a);
        if (b._isAlreadyDraggable(d)) {
            b._findAlreadyDraggable(d).addDragId(c.identifier);
            return;
        }
        b._initDraggableItem.call(b, d, c, true);
    },
    _touchEnd: function(a) {
        var b = this;
        if (!b._isDragging) return;
        var c = a.changedTouches;
        for (var d = 0; d < c.length; d++) {
            var e = b._findDraggableById(c[d].identifier, true);
            if (e.item == null) continue;
            e.item.rmDragId(c[d].identifier);
            if (e.item.getDragIdsCount() == 0) {
                e.item.unbind();
                b._items.splice(e.itemIndex, 1);
            }
        }
        if (b._items.length == 0) b._endDrag();
    },
    _touchMove: function(a) {
        var b = this;
        if (!b._isDragging) return;
        b._reposQueueSync();
        var c = a.changedTouches;
        for (var d = 0; d < c.length; d++) {
            var e = b._findDraggableById(c[d].identifier);
            if (e == null) continue;
            e.dragMove(c[d].pageX, c[d].pageY);
        }
    },
    _mouseDown: function(a) {
        var b = this;
        var c = b._findClosestConnected(a.target);
        if (c == null || Dom.browsers.isAndroidUC()) return;
        b._initDrag.call(b, a);
        b._initDraggableItem.call(b, c, a, false);
    },
    _mouseUp: function(a) {
        var b = this;
        if (!b._isDragging || Dom.browsers.isAndroidUC()) return;
        b._endDrag();
        b._items[0].unbind();
        b._items.splice(0, 1);
    },
    _mouseMove: function(a) {
        var b = this;
        if (!b._isDragging || Dom.browsers.isAndroidUC()) return;
        b._reposQueueSync();
        b._items[0].dragMove(a.pageX, a.pageY);
    },
    _initDrag: function(a) {
        a.preventDefault();
        this._reposQueueOff();
        dragifierApi.getSelectToggler().disableSelect();
        srManager.startCachingTransaction();
        this._isDragging = true;
    },
    _endDrag: function() {
        this._reposQueueOn();
        dragifierApi.getSelectToggler().enableSelect();
        srManager.stopCachingTransaction();
        this._isDragging = false;
    },
    _initDraggableItem: function(a, b, c) {
        var d = this._createDraggableItem();
        d.bind(a, b.pageX, b.pageY);
        if (c) d.addDragId(b.identifier);
        this._items.push(d);
    },
    _toggleEvents: function(a) {
        Event[a](grid.get(), "mousedown", this._mouse.down);
        Event[a](document.body, "mouseup", this._mouse.up);
        Event[a](document.body, "mousemove", this._mouse.move);
        Event[a](grid.get(), "touchstart", this._touch.start);
        Event[a](document.body, "touchend", this._touch.end);
        Event[a](document.body, "touchmove", this._touch.move);
    },
    _bindEvents: function() {
        if (this._areEventsBinded) return;
        this._areEventsBinded = true;
        this._toggleEvents("add");
    },
    _unbindEvents: function() {
        if (!this._areEventsBinded) return;
        this._areEventsBinded = false;
        this._toggleEvents("rm");
    },
    _reposQueueOff: function() {
        if (settings.eq("disableQueueOnDrags", false)) return;
        this._origReposQueueSize = settings.get("queueSize");
        this._reposQueueSync();
    },
    _reposQueueOn: function() {
        if (settings.eq("disableQueueOnDrags", false)) return;
        settings.set("queueSize", this._origReposQueueSize);
    },
    _reposQueueSync: function() {
        if (settings.eq("disableQueueOnDrags", false)) return;
        settings.set("queueSize", gridifier.all().length);
    },
    _findClosestConnected: function(a) {
        if (a == grid.get()) return null;
        var b = settings.get("dragifier");
        var c = typeof b == "string" || b instanceof String;
        var d = null;
        var e = null;
        var f = false;
        while (d == null && e != grid.get()) {
            e = e == null ? a : e.parentNode;
            if (c) {
                if (Dom.css.hasClass(e, b)) f = true;
            }
            if (gridItem.isConnected(e)) d = e;
        }
        return d == null || c && !f ? null : d;
    },
    _createDraggableItem: function() {
        return settings.eq("dragifierMode", "i") ? new IntDraggableItem() : new DiscrDraggableItem();
    },
    _isAlreadyDraggable: function(a) {
        for (var b = 0; b < this._items.length; b++) {
            if (guid.get(this._items[b].get()) == guid.get(a)) return true;
        }
        return false;
    },
    _findAlreadyDraggable: function(a) {
        for (var b = 0; b < this._items.length; b++) {
            if (guid.get(this._items[b].get()) == guid.get(a)) return this._items[b];
        }
        err("Drag.item NF.");
    },
    _findDraggableById: function(a, b) {
        var b = b || false;
        for (var c = 0; c < this._items.length; c++) {
            if (this._items[c].hasDragId(a)) {
                if (b) return {
                    item: this._items[c],
                    itemIndex: c
                }; else return this._items[c];
            }
        }
    },
    render: function(a, b, c) {
        this._coordsChanger(a, b, c, Dom);
    }
});