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

Gridifier.Dragifier = function(a, b, c, d, e, f, g, h, i, j) {
    var k = this;
    this._gridifier = null;
    this._appender = null;
    this._reversedAppender = null;
    this._collector = null;
    this._connections = null;
    this._connectors = null;
    this._guid = null;
    this._settings = null;
    this._sizesResolverManager = null;
    this._eventEmitter = null;
    this._connectedItemMarker = null;
    this._touchStartHandler = null;
    this._touchMoveHandler = null;
    this._touchEndHandler = null;
    this._mouseDownHandler = null;
    this._mouseMoveHandler = null;
    this._mouseUpHandler = null;
    this._draggableItems = [];
    this._isDragging = false;
    this._areDragifierEventsBinded = false;
    this._originalRetransformQueueBatchSize = null;
    this._css = {};
    this._construct = function() {
        k._gridifier = a;
        k._appender = b;
        k._reversedAppender = c;
        k._collector = d;
        k._connections = e;
        k._connectors = f;
        k._guid = g;
        k._settings = h;
        k._sizesResolverManager = i;
        k._eventEmitter = j;
        k._connectedItemMarker = new Gridifier.ConnectedItemMarker();
        k._dragifierApi = new Gridifier.Api.Dragifier();
        k._bindEvents();
        if (k._settings.shouldEnableDragifierOnInit()) {
            k.bindDragifierEvents();
        }
    };
    this._bindEvents = function() {
        k._touchStartHandler = function(a) {
            var b = k._findClosestConnectedItem(a.target);
            if (b == null) return;
            k._disableRetransformQueue();
            a.preventDefault();
            k._disableUserSelect();
            k._sizesResolverManager.startCachingTransaction();
            k._isDragging = true;
            if (k._isAlreadyDraggable(b)) {
                var c = a.changedTouches[0];
                var d = k._findAlreadyDraggableItem(b);
                d.addDragIdentifier(c.identifier);
                return;
            }
            var e = k._createDraggableItem();
            var f = a.changedTouches[0];
            e.bindDraggableItem(b, f.pageX, f.pageY);
            e.addDragIdentifier(f.identifier);
            k._draggableItems.push(e);
        };
        k._touchEndHandler = function(a) {
            if (!k._isDragging) return;
            a.preventDefault();
            setTimeout(function() {
                if (!k._isDragging) return;
                var b = a.changedTouches;
                for (var c = 0; c < b.length; c++) {
                    var d = k._findDraggableItemByIdentifier(b[c].identifier, true);
                    if (d.item == null) continue;
                    d.item.removeDragIdentifier(b[c].identifier);
                    if (d.item.getDragIdentifiersCount() == 0) {
                        d.item.unbindDraggableItem();
                        k._draggableItems.splice(d.itemIndex, 1);
                    }
                }
                if (k._draggableItems.length == 0) {
                    k._enableUserSelect();
                    k._enableRetransformQueue();
                    k._isDragging = false;
                    k._sizesResolverManager.stopCachingTransaction();
                }
            }, 0);
        };
        k._touchMoveHandler = function(a) {
            if (!k._isDragging) return;
            a.preventDefault();
            setTimeout(function() {
                if (!k._isDragging) return;
                k._syncRetransformQueueSizeIfDisabled();
                var b = a.changedTouches;
                for (var c = 0; c < b.length; c++) {
                    var d = k._findDraggableItemByIdentifier(b[c].identifier);
                    if (d == null) continue;
                    d.processDragMove(b[c].pageX, b[c].pageY);
                }
            }, 0);
        };
        k._mouseDownHandler = function(a) {
            var b = k._findClosestConnectedItem(a.target);
            if (b == null || Dom.browsers.isAndroidUCBrowser()) return;
            k._disableRetransformQueue();
            a.preventDefault();
            k._disableUserSelect();
            k._sizesResolverManager.startCachingTransaction();
            k._isDragging = true;
            var c = k._createDraggableItem();
            c.bindDraggableItem(b, a.pageX, a.pageY);
            k._draggableItems.push(c);
        };
        k._mouseUpHandler = function() {
            setTimeout(function() {
                if (!k._isDragging || Dom.browsers.isAndroidUCBrowser()) return;
                k._enableRetransformQueue();
                k._enableUserSelect();
                k._draggableItems[0].unbindDraggableItem();
                k._draggableItems.splice(0, 1);
                k._isDragging = false;
                k._sizesResolverManager.stopCachingTransaction();
            }, 0);
        };
        k._mouseMoveHandler = function(a) {
            setTimeout(function() {
                if (!k._isDragging || Dom.browsers.isAndroidUCBrowser()) return;
                k._syncRetransformQueueSizeIfDisabled();
                k._draggableItems[0].processDragMove(a.pageX, a.pageY);
            }, 0);
        };
    };
    this._unbindEvents = function() {};
    this.destruct = function() {
        k._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.Dragifier.IS_DRAGGABLE_ITEM_DATA_ATTR = "data-gridifier-is-draggable-item";

Gridifier.Dragifier.prototype.bindDragifierEvents = function() {
    if (this._areDragifierEventsBinded) return;
    this._areDragifierEventsBinded = true;
    Event.add(this._gridifier.getGrid(), "mousedown", this._mouseDownHandler);
    Event.add(document.body, "mouseup", this._mouseUpHandler);
    Event.add(document.body, "mousemove", this._mouseMoveHandler);
    Event.add(this._gridifier.getGrid(), "touchstart", this._touchStartHandler);
    Event.add(document.body, "touchend", this._touchEndHandler);
    Event.add(document.body, "touchmove", this._touchMoveHandler);
};

Gridifier.Dragifier.prototype.unbindDragifierEvents = function() {
    if (!this._areDragifierEventsBinded) return;
    this._areDragifierEventsBinded = false;
    Event.remove(this._gridifier.getGrid(), "mousedown", this._mouseDownHandler);
    Event.remove(document.body, "mouseup", this._mouseUpHandler);
    Event.remove(document.body, "mousemove", this._mouseMoveHandler);
    Event.remove(this._gridifier.getGrid(), "touchstart", this._touchStartHandler);
    Event.remove(document.body, "touchend", this._touchEndHandler);
    Event.remove(document.body, "touchmove", this._touchMoveHandler);
};

Gridifier.Dragifier.prototype.isDragifierEnabled = function() {
    return this._areDragifierEventsBinded;
};

Gridifier.Dragifier.prototype._disableRetransformQueue = function() {
    if (!this._settings.shouldDisableRetransformQueueOnDrags()) return;
    this._originalRetransformQueueBatchSize = this._settings.getRetransformQueueBatchSize();
    this._syncRetransformQueueSizeIfDisabled();
};

Gridifier.Dragifier.prototype._syncRetransformQueueSizeIfDisabled = function() {
    if (!this._settings.shouldDisableRetransformQueueOnDrags()) return;
    this._settings.setRetransformQueueBatchSize(this._gridifier.getAll().length);
};

Gridifier.Dragifier.prototype._enableRetransformQueue = function() {
    if (!this._settings.shouldDisableRetransformQueueOnDrags()) return;
    this._settings.setRetransformQueueBatchSize(this._originalRetransformQueueBatchSize);
};

Gridifier.Dragifier.prototype._disableUserSelect = function() {
    var a = this._settings.getDragifierUserSelectToggler();
    a.disableSelect();
};

Gridifier.Dragifier.prototype._enableUserSelect = function() {
    var a = this._settings.getDragifierUserSelectToggler();
    a.enableSelect();
};

Gridifier.Dragifier.prototype._findClosestConnectedItem = function(a) {
    var b = this._gridifier.getGrid();
    var c = this._settings.getDragifierItemSelector();
    if (a == b) return null;
    if (typeof c == "boolean" && !c) var d = false; else var d = true;
    var e = null;
    var f = null;
    var g = false;
    while (e == null && f != b) {
        if (f == null) f = a; else f = f.parentNode;
        if (d) {
            if (Dom.css.hasClass(f, c)) g = true;
        }
        if (this._connectedItemMarker.isItemConnected(f)) e = f;
    }
    if (e == null || d && !g) {
        return null;
    }
    return e;
};

Gridifier.Dragifier.prototype._createDraggableItem = function() {
    if (this._settings.isIntersectionDragifierMode()) {
        var a = new Gridifier.Dragifier.ConnectionIntersectionDraggableItem(this._gridifier, this._appender, this._reversedAppender, this._collector, this._connections, this._connectors, this._guid, this._settings, this._sizesResolverManager, this._eventEmitter);
    } else if (this._settings.isDiscretizationDragifierMode()) {
        var a = new Gridifier.Dragifier.GridDiscretizationDraggableItem(this._gridifier, this._appender, this._reversedAppender, this._collector, this._connections, this._connectors, this._guid, this._settings, this._sizesResolverManager, this._eventEmitter);
    }
    return a;
};

Gridifier.Dragifier.prototype._isAlreadyDraggable = function(a) {
    for (var b = 0; b < this._draggableItems.length; b++) {
        var c = this._draggableItems[b].getDraggableItem();
        if (this._guid.getItemGUID(c) == this._guid.getItemGUID(a)) return true;
    }
    return false;
};

Gridifier.Dragifier.prototype._findAlreadyDraggableItem = function(a) {
    for (var b = 0; b < this._draggableItems.length; b++) {
        var c = this._draggableItems[b].getDraggableItem();
        if (this._guid.getItemGUID(c) == this._guid.getItemGUID(a)) return this._draggableItems[b];
    }
    throw new Error("Draggable item not found");
};

Gridifier.Dragifier.prototype._findDraggableItemByIdentifier = function(a, b) {
    var b = b || false;
    var c = null;
    var d = null;
    for (var e = 0; e < this._draggableItems.length; e++) {
        if (this._draggableItems[e].hasDragIdentifier(a)) {
            c = this._draggableItems[e];
            d = e;
            break;
        }
    }
    if (b) {
        return {
            item: c,
            itemIndex: d
        };
    } else {
        return c;
    }
};