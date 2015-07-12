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

Gridifier.Dragifier.ConnectionIntersectionDraggableItem = function(a, b, c, d, e, f, g, h, i, j) {
    var k = this;
    this._gridifier = null;
    this._appender = null;
    this._reversedAppender = null;
    this._collector = null;
    this._connections = null;
    this._connectors = null;
    this._connectionsIntersector = null;
    this._guid = null;
    this._settings = null;
    this._sizesResolverManager = null;
    this._eventEmitter = null;
    this._dragifierCore = null;
    this._dragifierRenderer = null;
    this._dragIdentifiers = [];
    this._draggableItem = null;
    this._draggableItemClone = null;
    this._connectionsSorter = null;
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
        k._dragIdentifiers = [];
        k._connectionsIntersector = new Gridifier.ConnectionsIntersector(k._connections);
        k._dragifierRenderer = new Gridifier.Dragifier.Renderer(k._settings);
        k._dragifierCore = new Gridifier.Dragifier.Core(k._gridifier, k._appender, k._reversedAppender, k._collector, k._connectors, k._connections, k._settings, k._guid, k._dragifierRenderer, k._sizesResolverManager, k._eventEmitter);
        if (k._settings.isVerticalGrid()) {
            k._connectionsSorter = new Gridifier.VerticalGrid.ConnectionsSorter(k._connections, k._settings, k._guid);
        } else if (k._settings.isHorizontalGrid()) {
            k._connectionsSorter = new Gridifier.HorizontalGrid.ConnectionsSorter(k._connections, k._settings, k._guid);
        }
        k._bindEvents();
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        k._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.Dragifier.ConnectionIntersectionDraggableItem.prototype.bindDraggableItem = function(a, b, c) {
    this._initDraggableItem(a);
    this._dragifierCore.determineGridOffsets();
    this._dragifierCore.determineInitialCursorOffsetsFromDraggableItemCenter(this._draggableItem, b, c);
    this._draggableItemClone = this._dragifierCore.createDraggableItemClone(this._draggableItem);
    this._hideDraggableItem();
};

Gridifier.Dragifier.ConnectionIntersectionDraggableItem.prototype.getDraggableItem = function() {
    return this._draggableItem;
};

Gridifier.Dragifier.ConnectionIntersectionDraggableItem.prototype.addDragIdentifier = function(a) {
    this._dragIdentifiers.push(a);
};

Gridifier.Dragifier.ConnectionIntersectionDraggableItem.prototype.hasDragIdentifier = function(a) {
    for (var b = 0; b < this._dragIdentifiers.length; b++) {
        if (this._dragIdentifiers[b] == a) return true;
    }
    return false;
};

Gridifier.Dragifier.ConnectionIntersectionDraggableItem.prototype.removeDragIdentifier = function(a) {
    for (var b = 0; b < this._dragIdentifiers.length; b++) {
        if (this._dragIdentifiers[b] == a) {
            this._dragIdentifiers.splice(b, 1);
            break;
        }
    }
};

Gridifier.Dragifier.ConnectionIntersectionDraggableItem.prototype.getDragIdentifiersCount = function() {
    return this._dragIdentifiers.length;
};

Gridifier.Dragifier.ConnectionIntersectionDraggableItem.prototype._initDraggableItem = function(a) {
    this._draggableItem = a;
    if (Dom.isBrowserSupportingTransitions()) Dom.css3.transitionProperty(this._draggableItem, "Visibility 0ms ease");
};

Gridifier.Dragifier.ConnectionIntersectionDraggableItem.prototype._hideDraggableItem = function() {
    this._draggableItem.style.visibility = "hidden";
    this._draggableItem.setAttribute(Gridifier.Dragifier.IS_DRAGGABLE_ITEM_DATA_ATTR, "yes");
    var a = this._gridifier.getItemClonesManager();
    if (a.hasBindedClone(this._draggableItem)) {
        var b = a.getBindedClone(this._draggableItem);
        b.style.visibility = "hidden";
    }
};

Gridifier.Dragifier.ConnectionIntersectionDraggableItem.prototype.processDragMove = function(a, b) {
    var c = this._dragifierCore.calculateDraggableItemCloneNewDocumentPosition(this._draggableItem, a, b);
    this._dragifierRenderer.render(this._draggableItemClone, c.x, c.y);
    var d = this._dragifierCore.calculateDraggableItemCloneNewGridPosition(this._draggableItem, c);
    var e = this._getNewIntersectedConnections(d);
    if (e.length == 0) return;
    if (this._settings.isDisabledSortDispersion() || this._settings.isCustomSortDispersion()) {
        this._swapItemGUIDS(e);
        this._dragifierCore.reappendGridItems();
    } else if (this._settings.isCustomAllEmptySpaceSortDispersion()) {
        if (this._swapItemPositions(e)) this._dragifierCore.reappendGridItems();
    }
};

Gridifier.Dragifier.ConnectionIntersectionDraggableItem.prototype._getNewIntersectedConnections = function(a) {
    var b = this._guid.getItemGUID(this._draggableItem);
    var c = this._connectionsIntersector.getAllConnectionsWithIntersectedCenter(a);
    var d = [];
    for (var e = 0; e < c.length; e++) {
        if (c[e].itemGUID != b) {
            d.push(c[e]);
        }
    }
    return d;
};

Gridifier.Dragifier.ConnectionIntersectionDraggableItem.prototype._swapItemGUIDS = function(a) {
    var b = this._guid.getItemGUID(this._draggableItem);
    var c = a[0];
    for (var d = 0; d < a.length; d++) {
        if (a[d].itemGUID < c) c = a[d];
    }
    this._guid.setItemGUID(this._draggableItem, c.itemGUID);
    this._guid.setItemGUID(this._draggableItemClone, c.itemGUID);
    this._guid.setItemGUID(c.item, b);
};

Gridifier.Dragifier.ConnectionIntersectionDraggableItem.prototype._swapItemPositions = function(a) {
    var b = this._connections.findConnectionByItem(this._draggableItem, true);
    if (b == null) return false;
    if (this._settings.isVerticalGrid()) {
        a = this._connectionsSorter.sortConnectionsPerReappend(a);
    } else if (this._settings.isHorizontalGrid()) {
        a = this._connectionsSorter.sortConnectionsPerReappend(a);
    }
    var c = a[0];
    var d = this._guid.getItemGUID(this._draggableItem);
    var e = this._guid.getItemGUID(c.item);
    this._guid.setItemGUID(this._draggableItem, e);
    this._guid.setItemGUID(c.item, d);
    var f = b.item;
    b.item = c.item;
    c.item = f;
    var g = b.itemGUID;
    b.itemGUID = e;
    c.itemGUID = g;
    return true;
};

Gridifier.Dragifier.ConnectionIntersectionDraggableItem.prototype.unbindDraggableItem = function() {
    document.body.removeChild(this._draggableItemClone);
    this._showDraggableItem();
    this._draggableItem = null;
    this._draggableItem = null;
};

Gridifier.Dragifier.ConnectionIntersectionDraggableItem.prototype._showDraggableItem = function() {
    this._draggableItem.removeAttribute(Gridifier.Dragifier.IS_DRAGGABLE_ITEM_DATA_ATTR);
    this._draggableItem.style.visibility = "visible";
};