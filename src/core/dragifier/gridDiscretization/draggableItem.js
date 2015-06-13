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

Gridifier.Dragifier.GridDiscretizationDraggableItem = function(a, b, c, d, e, f, g, h, i, j) {
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
    this._dragifierCore = null;
    this._discretizer = null;
    this._dragifierCells = null;
    this._dragifierRenderer = null;
    this._dragIdentifiers = [];
    this._draggableItem = null;
    this._draggableItemConnection = null;
    this._draggableItemClone = null;
    this._draggableItemPointer = null;
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
        k._dragifierRenderer = new Gridifier.Dragifier.Renderer(k._settings);
        k._dragifierCore = new Gridifier.Dragifier.Core(k._gridifier, k._appender, k._reversedAppender, k._collector, k._connectors, k._connections, k._settings, k._guid, k._dragifierRenderer, k._sizesResolverManager, k._eventEmitter);
        k._discretizer = new Gridifier.Discretizer(k._gridifier, k._connections, k._settings, k._sizesResolverManager);
        k._dragifierCells = new Gridifier.Dragifier.Cells(k._discretizer);
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

Gridifier.Dragifier.GridDiscretizationDraggableItem.REAPPEND_GRID_ITEMS_DELAY = 100;

Gridifier.Dragifier.GridDiscretizationDraggableItem.prototype.bindDraggableItem = function(a, b, c) {
    this._initDraggableItem(a);
    this._initDraggableItemConnection();
    this._dragifierCore.determineGridOffsets();
    this._dragifierCore.determineInitialCursorOffsetsFromDraggableItemCenter(this._draggableItem, b, c);
    this._draggableItemClone = this._dragifierCore.createDraggableItemClone(this._draggableItem);
    this._draggableItemPointer = this._dragifierCore.createDraggableItemPointer(this._draggableItem);
    this._discretizer.discretizeGrid();
    this._discretizer.markCellsIntersectedByItem(this._draggableItem, this._draggableItemConnection);
    this._discretizer.createDemonstrator();
    this._hideDraggableItem();
};

Gridifier.Dragifier.GridDiscretizationDraggableItem.prototype.getDraggableItem = function() {
    return this._draggableItem;
};

Gridifier.Dragifier.GridDiscretizationDraggableItem.prototype.addDragIdentifier = function(a) {
    this._dragIdentifiers.push(a);
};

Gridifier.Dragifier.GridDiscretizationDraggableItem.prototype.hasDragIdentifier = function(a) {
    for (var b = 0; b < this._dragIdentifiers.length; b++) {
        if (this._dragIdentifiers[b] == a) return true;
    }
    return false;
};

Gridifier.Dragifier.GridDiscretizationDraggableItem.prototype.removeDragIdentifier = function(a) {
    for (var b = 0; b < this._dragIdentifiers.length; b++) {
        if (this._dragIdentifiers[b] == a) {
            this._dragIdentifiers.splice(b, 1);
            break;
        }
    }
};

Gridifier.Dragifier.GridDiscretizationDraggableItem.prototype.getDragIdentifiersCount = function() {
    return this._dragIdentifiers.length;
};

Gridifier.Dragifier.GridDiscretizationDraggableItem.prototype._initDraggableItem = function(a) {
    this._draggableItem = a;
    if (Dom.isBrowserSupportingTransitions()) Dom.css3.transitionProperty(this._draggableItem, "Visibility 0ms ease");
};

Gridifier.Dragifier.GridDiscretizationDraggableItem.prototype._initDraggableItemConnection = function() {
    this._draggableItemConnection = this._connections.findConnectionByItem(this._draggableItem);
    this._draggableItemConnection[Gridifier.SizesTransformer.RESTRICT_CONNECTION_COLLECT] = true;
};

Gridifier.Dragifier.GridDiscretizationDraggableItem.prototype._hideDraggableItem = function() {
    this._draggableItem.style.visibility = "hidden";
    this._draggableItem.setAttribute(Gridifier.Dragifier.IS_DRAGGABLE_ITEM_DATA_ATTR, "yes");
    var a = this._gridifier.getItemClonesManager();
    if (a.hasBindedClone(this._draggableItem)) {
        var b = a.getBindedClone(this._draggableItem);
        b.style.visibility = "hidden";
    }
};

Gridifier.Dragifier.GridDiscretizationDraggableItem.prototype.processDragMove = function(a, b) {
    var c = this._dragifierCore.calculateDraggableItemCloneNewDocumentPosition(this._draggableItem, a, b);
    this._dragifierRenderer.render(this._draggableItemClone, c.x, c.y);
    var d = this._dragifierCore.calculateDraggableItemCloneNewGridPosition(this._draggableItem, c);
    var e = this._dragifierCells.getIntersectedByDraggableItemCellCentersData(this._draggableItemConnection);
    var f = this._discretizer.getAllCellsWithIntersectedCenterData(d);
    if (!this._dragifierCells.isAtLeastOneOfIntersectedCellCentersEmpty(f)) return;
    if (!this._dragifierCells.isIntersectingEnoughRowsAndCols(e, f)) return;
    this._transformGrid(this._dragifierCells.normalizeCellsWithMaybeIntersectionOverflows(f.cellsWithIntersectedCenter, e, f));
    this._discretizer.updateDemonstrator();
};

Gridifier.Dragifier.GridDiscretizationDraggableItem.prototype._transformGrid = function(a) {
    var b = this._discretizer.intersectedCellsToCoords(a);
    b = this._discretizer.normalizeItemNewConnectionHorizontalCoords(this._draggableItem, b);
    b = this._discretizer.normalizeItemNewConnectionVerticalCoords(this._draggableItem, b);
    this._adjustDraggableItemPositions(b);
    this._discretizer.markCellsIntersectedByItem(this._draggableItem, b);
    var c = this;
    setTimeout(function() {
        c._dragifierCore.reappendGridItems();
    }, Gridifier.Dragifier.GridDiscretizationDraggableItem.REAPPEND_GRID_ITEMS_DELAY);
};

Gridifier.Dragifier.GridDiscretizationDraggableItem.prototype._adjustDraggableItemPositions = function(a) {
    this._draggableItemConnection.x1 = a.x1;
    this._draggableItemConnection.x2 = a.x2;
    this._draggableItemConnection.y1 = a.y1;
    this._draggableItemConnection.y2 = a.y2;
    var b = this._settings.getCoordsChanger();
    var c = this._settings.getCoordsChangeAnimationMsDuration();
    var d = this._settings.getEventEmitter();
    b(this._draggableItem, a.x1 + "px", a.y1 + "px", c, d, false);
    this._dragifierRenderer.render(this._draggableItemPointer, a.x1, a.y1);
};

Gridifier.Dragifier.GridDiscretizationDraggableItem.prototype.unbindDraggableItem = function() {
    document.body.removeChild(this._draggableItemClone);
    this._gridifier.getGrid().removeChild(this._draggableItemPointer);
    this._draggableItemConnection[Gridifier.SizesTransformer.RESTRICT_CONNECTION_COLLECT] = false;
    this._showDraggableItem();
    this._draggableItem = null;
    this._discretizer.deleteDemonstrator();
};

Gridifier.Dragifier.GridDiscretizationDraggableItem.prototype._showDraggableItem = function() {
    this._draggableItem.style.visibility = "visible";
    this._draggableItem.removeAttribute(Gridifier.Dragifier.IS_DRAGGABLE_ITEM_DATA_ATTR);
};