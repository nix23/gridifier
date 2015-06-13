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

Gridifier.Dragifier.Core = function(a, b, c, d, e, f, g, h, i, j, k) {
    var l = this;
    this._gridifier = null;
    this._appender = null;
    this._reversedAppender = null;
    this._collector = null;
    this._connectors = null;
    this._connections = null;
    this._settings = null;
    this._guid = null;
    this._dragifierRenderer = null;
    this._sizesResolverManager = null;
    this._eventEmitter = null;
    this._connectionsSorter = null;
    this._cursorOffsetXFromDraggableItemCenter = null;
    this._cursorOffsetYFromDraggableItemCenter = null;
    this._gridOffsetLeft = null;
    this._gridOffsetTop = null;
    this._executeGridRetransformTimeout = null;
    this._css = {};
    this._construct = function() {
        l._gridifier = a;
        l._appender = b;
        l._reversedAppender = c;
        l._collector = d;
        l._connectors = e;
        l._connections = f;
        l._settings = g;
        l._guid = h;
        l._dragifierRenderer = i;
        l._sizesResolverManager = j;
        l._eventEmitter = k;
        if (l._settings.isVerticalGrid()) {
            l._connectionsSorter = new Gridifier.VerticalGrid.ConnectionsSorter(l._connections, l._settings, l._guid);
        } else if (l._settings.isHorizontalGrid()) {
            l._connectionsSorter = new Gridifier.HorizontalGrid.ConnectionsSorter(l._connections, l._settings, l._guid);
        }
        l._bindEvents();
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        l._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.Dragifier.Core.prototype.determineGridOffsets = function() {
    this._gridOffsetLeft = this._sizesResolverManager.offsetLeft(this._gridifier.getGrid());
    this._gridOffsetTop = this._sizesResolverManager.offsetTop(this._gridifier.getGrid());
};

Gridifier.Dragifier.Core.prototype._getDraggableItemOffsetLeft = function(a, b) {
    var b = b || false;
    var c = this._connections.findConnectionByItem(a);
    if (this._settings.isNoIntersectionsStrategy() && this._settings.isHorizontalGrid()) var d = c.horizontalOffset; else var d = 0;
    if (b) {
        var e = this._sizesResolverManager.outerWidth(a);
        var f = this._sizesResolverManager.outerWidth(a, true);
        var g = f - e;
        var h = g / 2;
        return this._gridOffsetLeft + c.x1 - h + d;
    } else {
        return this._gridOffsetLeft + c.x1 + d;
    }
};

Gridifier.Dragifier.Core.prototype._getDraggableItemOffsetTop = function(a, b) {
    var b = b || false;
    var c = this._connections.findConnectionByItem(a);
    if (this._settings.isNoIntersectionsStrategy() && this._settings.isVerticalGrid()) var d = c.verticalOffset; else var d = 0;
    if (b) {
        var e = this._sizesResolverManager.outerHeight(a);
        var f = this._sizesResolverManager.outerHeight(a, true);
        var g = f - e;
        var h = g / 2;
        return this._gridOffsetTop + c.y1 - h + d;
    } else {
        return this._gridOffsetTop + c.y1 + d;
    }
};

Gridifier.Dragifier.Core.prototype.determineInitialCursorOffsetsFromDraggableItemCenter = function(a, b, c) {
    var d = this._getDraggableItemOffsetLeft(a);
    var e = this._getDraggableItemOffsetTop(a);
    var f = this._sizesResolverManager.outerWidth(a, true);
    var g = this._sizesResolverManager.outerHeight(a, true);
    var h = d + f / 2;
    var i = e + g / 2;
    this._cursorOffsetXFromDraggableItemCenter = h - b;
    this._cursorOffsetYFromDraggableItemCenter = i - c;
};

Gridifier.Dragifier.Core.prototype._getMaxConnectionItemZIndex = function() {
    var a = null;
    var b = this._connections.get();
    for (var c = 0; c < b.length; c++) {
        if (a == null) {
            a = Dom.toInt(b[c].item.style.zIndex);
        } else {
            if (Dom.toInt(b[c].item.style.zIndex) > a) a = Dom.toInt(b[c].item.style.zIndex);
        }
    }
    return Dom.toInt(a);
};

Gridifier.Dragifier.Core.prototype.createDraggableItemClone = function(a) {
    var b = a.cloneNode(true);
    this._collector.markItemAsRestrictedToCollect(b);
    var c = this._settings.getDraggableItemDecorator();
    c(b, a, this._sizesResolverManager);
    if (Dom.isBrowserSupportingTransitions()) {
        Dom.css3.transform(b, "");
        Dom.css3.transition(b, "none");
    }
    b.style.zIndex = this._getMaxConnectionItemZIndex() + 1;
    var d = this._sizesResolverManager.outerWidth(a);
    var e = this._sizesResolverManager.outerHeight(a);
    b.style.width = d + "px";
    b.style.height = e + "px";
    var f = SizesResolver.getComputedCSS(a);
    b.style.marginLeft = f.marginLeft;
    b.style.marginTop = f.marginTop;
    b.style.marginRight = f.marginRight;
    b.style.marginBottom = f.marginBottom;
    document.body.appendChild(b);
    var g = this._getDraggableItemOffsetLeft(a);
    var h = this._getDraggableItemOffsetTop(a);
    b.style.left = g + "px";
    b.style.top = h + "px";
    this._dragifierRenderer.render(b, g, h);
    return b;
};

Gridifier.Dragifier.Core.prototype.createDraggableItemPointer = function(a) {
    var b = this._getDraggableItemOffsetLeft(a, true);
    var c = this._getDraggableItemOffsetTop(a, true);
    var d = document.createElement("div");
    Dom.css.set(d, {
        width: this._sizesResolverManager.outerWidth(a, true) + "px",
        height: this._sizesResolverManager.outerHeight(a, true) + "px",
        position: "absolute",
        left: b - this._gridOffsetLeft + "px",
        top: c - this._gridOffsetTop + "px"
    });
    var e = SizesResolver.getComputedCSS(a);
    var f = e.marginLeft;
    var g = e.marginTop;
    this._gridifier.getGrid().appendChild(d);
    var h = this._settings.getDraggableItemPointerDecorator();
    h(d);
    this._dragifierRenderer.render(d, b - this._gridOffsetLeft + parseFloat(f), c - this._gridOffsetTop + parseFloat(g));
    return d;
};

Gridifier.Dragifier.Core.prototype.calculateDraggableItemCloneNewDocumentPosition = function(a, b, c) {
    var d = this._sizesResolverManager.outerWidth(a, true) / 2;
    var e = this._sizesResolverManager.outerHeight(a, true) / 2;
    return {
        x: b - d - this._cursorOffsetXFromDraggableItemCenter * -1,
        y: c - e - this._cursorOffsetYFromDraggableItemCenter * -1
    };
};

Gridifier.Dragifier.Core.prototype.calculateDraggableItemCloneNewGridPosition = function(a, b) {
    var c = {
        x1: b.x,
        x2: b.x + this._sizesResolverManager.outerWidth(a, true) - 1,
        y1: b.y,
        y2: b.y + this._sizesResolverManager.outerHeight(a, true) - 1
    };
    c.x1 -= this._gridOffsetLeft;
    c.x2 -= this._gridOffsetLeft;
    c.y1 -= this._gridOffsetTop;
    c.y2 -= this._gridOffsetTop;
    return c;
};

Gridifier.Dragifier.Core.prototype.reappendGridItems = function() {
    var a = this;
    if (this._settings.isDefaultAppend()) {
        this._connectors.setNextFlushCallback(function() {
            a._appender.createInitialConnector();
        });
    } else if (this._settings.isReversedAppend()) {
        this._connectors.setNextFlushCallback(function() {
            a._reversedAppender.createInitialConnector();
        });
    }
    this._eventEmitter.onItemsReappendExecutionEndPerDragifier(function() {
        var b = a._connectionsSorter.sortConnectionsPerReappend(a._connections.get());
        var c = [];
        for (var d = 0; d < b.length; d++) {
            c.push(b[d].item);
        }
        a._eventEmitter.emitDragEndEvent(c);
    });
    this._executeGridRetransform();
};

Gridifier.Dragifier.Core.EXECUTE_GRID_RETRANSFORM_MS_TIMEOUT = 20;

Gridifier.Dragifier.Core.prototype._executeGridRetransform = function() {
    var a = this;
    if (!Dom.browsers.isAndroidFirefox() && !Dom.browsers.isAndroidUCBrowser()) {
        this._gridifier.retransformAllSizes();
        return;
    }
    if (typeof this._executeGridRetransformTimeout != null) {
        clearTimeout(this._executeGridRetransformTimeout);
        this._executeGridRetransformTimeout = null;
    }
    this._executeGridRetransformTimeout = setTimeout(function() {
        a._gridifier.retransformAllSizes();
    }, Gridifier.Dragifier.Core.EXECUTE_GRID_RETRANSFORM_MS_TIMEOUT);
};