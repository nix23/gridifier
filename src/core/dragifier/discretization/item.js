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

DiscrDraggableItem = function() {
    this._dragIds = [];
    this._item = null;
    this._itemCn = null;
    this._clone = null;
    this._pointer = null;
    this._discretizer = new Discretizer();
};

proto(DiscrDraggableItem, {
    get: function() {
        return this._item;
    },
    addDragId: function(a) {
        this._dragIds.push(a);
    },
    hasDragId: function(a) {
        return dragifierCore.hasDragId(a, this._dragIds);
    },
    rmDragId: function(a) {
        dragifierCore.rmDragId(a, this._dragIds);
    },
    getDragIdsCount: function() {
        return this._dragIds.length;
    },
    bind: function(a, b, c) {
        this._item = a;
        dragifierCore.initItem(a);
        this._initCn();
        dragifierCore.calcGridOffsets();
        dragifierCore.findItemCenterCursorOffsets(a, b, c);
        this._clone = dragifierCore.createClone(a);
        this._pointer = dragifierCore.createPointer(a);
        this._discretizer.discretize();
        this._discretizer.markIntCellsBy(this._itemCn);
        dragifierCore.hideItem(a);
    },
    _initCn: function() {
        this._itemCn = cnsCore.find(this._item);
        this._itemCn.restrictCollect = true;
    },
    unbind: function() {
        document.body.removeChild(this._clone);
        grid.get().removeChild(this._pointer);
        dragifierCore.showItem(this._item);
        this._item = null;
        this._itemCn.restrictCollect = false;
    },
    dragMove: function(a, b) {
        var c = dragifierCore.calcCloneNewDocPosition(this._item, a, b);
        var d = dragifierCore.calcCloneNewGridPosition(this._item, c);
        dragifier.render(this._clone, c.x, c.y);
        var e = dragifierCells.getIntCellsData(this._discretizer.getAllCellsWithIntCenter(this._itemCn));
        var f = this._discretizer.getAllCellsWithIntCenter(d);
        if (!dragifierCells.isAnyIntCellEmpty(f)) return;
        if (!dragifierCells.isIntEnoughRowsAndCols(e, f)) return;
        this._repositionGrid(dragifierCells.normalizeOverflowedCells(f.intCells, e, f));
    },
    _repositionGrid: function(a) {
        var b = this._discretizer.intCellsToCoords(a);
        b = discretizerCore.normalizeCnXCoords(this._item, b);
        b = discretizerCore.normalizeCnYCoords(this._item, b);
        this._adjustPosition(b);
        this._discretizer.markIntCellsBy(b);
        setTimeout(function() {
            dragifierCore.repositionItems();
        }, C.DRAGIFIER_DISCR_REPOS_DELAY);
    },
    _adjustPosition: function(a) {
        var b = [ "x1", "x2", "y1", "y2" ];
        for (var c = 0; c < b.length; c++) this._itemCn[b[c]] = a[b[c]];
        var d = bind("get", settings);
        settings.getApi("coordsChanger")(this._item, a.x1 + "px", a.y1 + "px", d("coordsChangeTime"), d("coordsChangeTiming"), Dom, Prefixer, d);
        dragifier.render(this._pointer, a.x1, a.y1);
    }
});