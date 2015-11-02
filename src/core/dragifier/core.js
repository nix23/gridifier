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

DragifierCore = function() {
    this._itemCenterCursorOffset = {
        x: null,
        y: null
    };
    this._gridOffset = {
        left: null,
        top: null
    };
    this._repositionTimeout = null;
};

proto(DragifierCore, {
    calcGridOffsets: function() {
        this._gridOffset.left = srManager.offsetLeft(grid.get());
        this._gridOffset.top = srManager.offsetTop(grid.get());
    },
    _getOffset: function(a, b, c, d, e, f, g) {
        var b = b || false;
        var h = cnsCore.find(a);
        if (settings.eq("intersections", false) && settings.eq("grid", c)) var i = h[d + "Offset"]; else var i = 0;
        if (!b) return this._gridOffset[e] + h[g] + i;
        var j = srManager["outer" + f](a);
        var k = srManager["outer" + f](a, true);
        var l = k - j;
        var m = l / 2;
        return this._gridOffset[e] + h[g] - m + i;
    },
    _getOffsetLeft: function(a, b) {
        return this._getOffset(a, b, "horizontal", "h", "left", "Width", "x1");
    },
    _getOffsetTop: function(a, b) {
        return this._getOffset(a, b, "vertical", "v", "top", "Height", "y1");
    },
    findItemCenterCursorOffsets: function(a, b, c) {
        var d = this._getOffsetLeft(a) + srManager.outerWidth(a, true) / 2;
        var e = this._getOffsetTop(a) + srManager.outerHeight(a, true) / 2;
        this._itemCenterCursorOffset = {
            x: d - b,
            y: e - c
        };
    },
    createClone: function(a) {
        var b = a.cloneNode(true);
        var c = {
            left: this._getOffsetLeft(a),
            top: this._getOffsetTop(a)
        };
        collector.markAsNotCollectable(b);
        settings.getApi("drag")(b, a, srManager);
        if (Dom.hasTransitions()) {
            Dom.css3.transform(b, "");
            Dom.css3.transition(b, "none");
        }
        Dom.css.set(b, {
            width: srManager.outerWidth(a) + "px",
            height: srManager.outerHeight(a) + "px",
            zIndex: C.MAX_Z,
            left: c.left + "px",
            top: c.top + "px"
        });
        Dom.css.set4(b, "margin", SizesResolver.getComputedCSS(a));
        document.body.appendChild(b);
        dragifier.render(b, c.left, c.top);
        return b;
    },
    createPointer: function(a) {
        var b = {
            left: this._getOffsetLeft(a, true),
            top: this._getOffsetTop(a, true)
        };
        var c = Dom.div();
        Dom.css.set(c, {
            width: srManager.outerWidth(a, true) + "px",
            height: srManager.outerHeight(a, true) + "px",
            position: "absolute",
            left: b.left - this._gridOffset.left + "px",
            top: b.top - this._gridOffset.top + "px"
        });
        var d = SizesResolver.getComputedCSS(a);
        grid.get().appendChild(c);
        dragifierApi.getPointerStyler()(c, Dom);
        var e = parseFloat(d.marginLeft);
        var f = parseFloat(d.marginTop);
        dragifier.render(c, b.left - this._gridOffset.left + (isNaN(e) ? 0 : e), b.top - this._gridOffset.top + (isNaN(f) ? 0 : f));
        return c;
    },
    calcCloneNewDocPosition: function(a, b, c) {
        return {
            x: b - srManager.outerWidth(a, true) / 2 - this._itemCenterCursorOffset.x * -1,
            y: c - srManager.outerHeight(a, true) / 2 - this._itemCenterCursorOffset.y * -1
        };
    },
    calcCloneNewGridPosition: function(a, b) {
        return {
            x1: b.x - this._gridOffset.left,
            x2: b.x + srManager.outerWidth(a, true) - 1 - this._gridOffset.left,
            y1: b.y - this._gridOffset.top,
            y2: b.y + srManager.outerHeight(a, true) - 1 - this._gridOffset.top
        };
    },
    hasDragId: function(a, b) {
        for (var c = 0; c < b.length; c++) {
            if (b[c] == a) return true;
        }
        return false;
    },
    rmDragId: function(a, b) {
        for (var c = 0; c < b.length; c++) {
            if (b[c] == a) {
                b.splice(c, 1);
                break;
            }
        }
    },
    initItem: function(a) {
        if (Dom.hasTransitions()) Dom.css3.transitionProperty(a, "Visibility 0ms ease");
    },
    hideItem: function(a) {
        a.style.visibility = "hidden";
        Dom.set(a, C.IS_DRAGGABLE_DATA, "y");
    },
    showItem: function(a) {
        a.style.visibility = "visible";
        Dom.rm(a, C.IS_DRAGGABLE_DATA);
    },
    repositionItems: function() {
        if (settings.eq("append", "default")) var a = function() {
            appender.createInitialCr();
        }; else var a = function() {
            reversedAppender.createInitialCr();
        };
        connectors.setNextFlushCb(a);
        ev.onRepositionEndForDrag(function() {
            var a = cnsSorter.sortForReappend(connections.get());
            var b = [];
            for (var c = 0; c < a.length; c++) b.push(a[c].item);
            ev.emit(EV.DRAG_END, b);
        });
        this._reposition();
    },
    _reposition: function() {
        if (!Dom.browsers.isAndroidFirefox() && !Dom.browsers.isAndroidUC()) {
            reposition.all();
            return;
        }
        clearTimeout(this._repositionTimeout);
        this._repositionTimeout = setTimeout(function() {
            reposition.all();
        }, C.DRAGIFIER_REPOS_DELAY);
    }
});