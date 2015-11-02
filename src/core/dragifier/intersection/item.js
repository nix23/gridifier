/* Gridifier v2.~.~ source file for custom build.
 * Async Responsive HTML Grids
 * http://gridifier.io
 * 
 * Gridifier is dual-licensed:
 *   GPLV3 per non-commercial usage; 
 *   Commercial license per commercial usage.
 * Read http://gridifier.io/license for details.
 * Copyright 2015 nTech
 */

IntDraggableItem = function() {
    this._dragIds = [];
    this._item = null;
    this._clone = null;
};

proto(IntDraggableItem, {
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
        dragifierCore.calcGridOffsets();
        dragifierCore.findItemCenterCursorOffsets(a, b, c);
        this._clone = dragifierCore.createClone(a);
        dragifierCore.hideItem(a);
    },
    unbind: function() {
        document.body.removeChild(this._clone);
        dragifierCore.showItem(this._item);
        this._item = null;
    },
    dragMove: function(a, b) {
        var c = dragifierCore.calcCloneNewDocPosition(this._item, a, b);
        var d = dragifierCore.calcCloneNewGridPosition(this._item, c);
        dragifier.render(this._clone, c.x, c.y);
        var e = this._getNewIntCns(d);
        if (e.length == 0) return;
        if (settings.eq("sortDispersion", false)) {
            this._swapGUIDS(e);
            dragifierCore.repositionItems();
        } else {
            if (this._swapPositions(e)) dragifierCore.repositionItems();
        }
    },
    _getNewIntCns: function(a) {
        var b = guid.get(this._item);
        var c = cnsIntersector.getAllWithIntersectedCenter(a);
        var d = [];
        for (var e = 0; e < c.length; e++) {
            if (c[e].itemGUID != b) d.push(c[e]);
        }
        return d;
    },
    _swapGUIDS: function(a) {
        var b = guid.get(this._item);
        var c = a[0];
        for (var d = 0; d < a.length; d++) {
            if (a[d].itemGUID < c.itemGUID) c = a[d];
        }
        guid.set(this._item, c.itemGUID);
        guid.set(this._clone, c.itemGUID);
        guid.set(c.item, b);
    },
    _swapPositions: function(a) {
        var b = cnsCore.find(this._item, true);
        if (b == null) return false;
        a = cnsSorter.sortForReappend(a);
        var c = a[0];
        var d = guid.get(c.item);
        var e = guid.get(this._item);
        guid.set(this._item, d);
        guid.set(c.item, e);
        this._swapCnData(b, c, d);
        return true;
    },
    _swapCnData: function(a, b, c) {
        var d = a.item;
        a.item = b.item;
        b.item = d;
        var e = a.itemGUID;
        a.itemGUID = c;
        b.itemGUID = e;
    }
});