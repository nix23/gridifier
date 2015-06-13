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

Gridifier.Renderer = function(a, b, c, d) {
    var e = this;
    this._gridifier = null;
    this._connections = null;
    this._settings = null;
    this._normalizer = null;
    this._transformedItemMarker = null;
    this._rendererSchedulator = null;
    this._rendererConnections = null;
    this._css = {};
    this._construct = function() {
        e._gridifier = a;
        e._connections = b;
        e._settings = c;
        e._normalizer = d;
        e._transformedItemMarker = new Gridifier.SizesTransformer.TransformedItemMarker();
        e._rendererConnections = new Gridifier.Renderer.Connections(e._settings);
        e._rendererSchedulator = new Gridifier.Renderer.Schedulator(e._gridifier, e._settings, e._connections, e, e._rendererConnections);
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        e._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.Renderer.SCHEDULED_ITEM_TO_HIDE_DATA_ATTR = "data-gridifier-scheduled-to-hide";

Gridifier.Renderer.SCHEDULED_ITEM_TO_HIDE_DATA_ATTR_VALUE = "yes";

Gridifier.Renderer.prototype.getRendererConnections = function() {
    return this._rendererConnections;
};

Gridifier.Renderer.prototype.setSilentRendererInstance = function(a) {
    this._rendererSchedulator.setSilentRendererInstance(a);
};

Gridifier.Renderer.prototype.showConnections = function(a) {
    var b = this;
    if (!Dom.isArray(a)) var a = [ a ];
    for (var c = 0; c < a.length; c++) {
        this.unmarkItemAsScheduledToHide(a[c].item);
        if (this._rendererConnections.isConnectionItemRendered(a[c])) continue;
        var d = this._rendererConnections.getCssLeftPropertyValuePerConnection(a[c]);
        var e = this._rendererConnections.getCssTopPropertyValuePerConnection(a[c]);
        this._rendererConnections.markConnectionItemAsRendered(a[c]);
        this._rendererSchedulator.reinit();
        this._rendererSchedulator.scheduleShow(a[c], d, e);
    }
};

Gridifier.Renderer.prototype.markItemsAsScheduledToHide = function(a) {
    for (var b = 0; b < a.length; b++) {
        a[b].setAttribute(Gridifier.Renderer.SCHEDULED_ITEM_TO_HIDE_DATA_ATTR, Gridifier.Renderer.SCHEDULED_ITEM_TO_HIDE_DATA_ATTR_VALUE);
    }
};

Gridifier.Renderer.prototype.unmarkItemAsScheduledToHide = function(a) {
    a.removeAttribute(Gridifier.Renderer.SCHEDULED_ITEM_TO_HIDE_DATA_ATTR);
};

Gridifier.Renderer.prototype.wasItemScheduledToHide = function(a) {
    return Dom.hasAttribute(a, Gridifier.Renderer.SCHEDULED_ITEM_TO_HIDE_DATA_ATTR);
};

Gridifier.Renderer.prototype.hideConnections = function(a) {
    var b = this;
    if (!Dom.isArray(a)) var a = [ a ];
    for (var c = 0; c < a.length; c++) {
        if (!this.wasItemScheduledToHide(a[c].item)) {
            continue;
        }
        var d = this._rendererConnections.getCssLeftPropertyValuePerConnection(a[c]);
        var e = this._rendererConnections.getCssTopPropertyValuePerConnection(a[c]);
        this._rendererConnections.unmarkConnectionItemAsRendered(a[c]);
        this._rendererSchedulator.reinit();
        this._rendererSchedulator.scheduleHide(a[c], d, e);
    }
};

Gridifier.Renderer.prototype.renderTransformedConnections = function(a) {
    for (var b = 0; b < a.length; b++) {
        var c = this._rendererConnections.getCssLeftPropertyValuePerConnection(a[b]);
        var d = this._rendererConnections.getCssTopPropertyValuePerConnection(a[b]);
        this._rendererSchedulator.reinit();
        if (this._transformedItemMarker.isTransformedItem(a[b].item)) {
            var e = this._transformedItemMarker.getTransformedItemTargetRawSizes(a[b].item);
            this._rendererSchedulator.scheduleRenderTransformed(a[b], c, d, e.targetRawWidth, e.targetRawHeight);
            this._transformedItemMarker.unmarkItemAsTransformed(a[b].item);
        } else if (this._transformedItemMarker.isDependedItem(a[b].item)) {
            this._rendererSchedulator.scheduleRenderDepended(a[b], c, d);
            this._transformedItemMarker.unmarkItemAsDepended(a[b].item);
        }
    }
};

Gridifier.Renderer.prototype.renderConnections = function(a, b) {
    var b = b || false;
    for (var c = 0; c < a.length; c++) {
        if (b) {
            var d = false;
            for (var e = 0; e < b.length; e++) {
                if (a[c].itemGUID == b[e].itemGUID) {
                    d = true;
                    break;
                }
            }
            if (d) continue;
        }
        var f = this._rendererConnections.getCssLeftPropertyValuePerConnection(a[c]);
        var g = this._rendererConnections.getCssTopPropertyValuePerConnection(a[c]);
        this._rendererSchedulator.reinit();
        this._rendererSchedulator.scheduleRender(a[c], f, g);
    }
};

Gridifier.Renderer.prototype.renderConnectionsAfterDelay = function(a, b) {
    var c = this;
    var b = b || 40;
    for (var d = 0; d < a.length; d++) {
        this._rendererSchedulator.reinit();
        this._rendererSchedulator.scheduleDelayedRender(a[d], null, null, b);
    }
};

Gridifier.Renderer.prototype.rotateItems = function(a) {
    var b = [];
    for (var c = 0; c < a.length; c++) {
        if (this._gridifier.hasItemBindedClone(a[c])) {
            var d = this._gridifier.getItemClone(a[c]);
            d.style.visibility = "hidden";
        }
        var e = this._connections.findConnectionByItem(a[c]);
        this._rendererConnections.unmarkConnectionItemAsRendered(e);
        b.push(e);
    }
    this.showConnections(b);
};