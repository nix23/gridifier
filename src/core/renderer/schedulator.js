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

Gridifier.Renderer.Schedulator = function(a, b, c, d, e) {
    var f = this;
    this._gridifier = null;
    this._settings = null;
    this._connections = null;
    this._renderer = null;
    this._rendererConnections = null;
    this._silentRenderer = null;
    this._connectedItemMarker = null;
    this._scheduledConnectionsToProcessData = null;
    this._processScheduledConnectionsTimeout = null;
    this._css = {};
    this._construct = function() {
        f._gridifier = a;
        f._settings = b;
        f._connections = c;
        f._renderer = d;
        f._rendererConnections = e;
        f._connectedItemMarker = new Gridifier.ConnectedItemMarker();
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        f._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.Renderer.Schedulator.PROCESS_SCHEDULED_CONNECTIONS_TIMEOUT = 20;

Gridifier.Renderer.Schedulator.SCHEDULED_CONNECTIONS_PROCESSING_TYPES = {
    SHOW: 0,
    HIDE: 1,
    RENDER: 2,
    RENDER_TRANSFORMED: 3,
    RENDER_DEPENDED: 4,
    DELAYED_RENDER: 5
};

Gridifier.Renderer.Schedulator.prototype.setSilentRendererInstance = function(a) {
    this._silentRenderer = a;
};

Gridifier.Renderer.Schedulator.prototype.reinit = function() {
    if (this._scheduledConnectionsToProcessData == null) {
        this._scheduledConnectionsToProcessData = [];
    } else {
        clearTimeout(this._processScheduledConnectionsTimeout);
        this._processScheduledConnectionsTimeout = null;
    }
};

Gridifier.Renderer.Schedulator.prototype.scheduleShow = function(a, b, c) {
    if (this._silentRenderer.isScheduledForSilentRender(a.item)) return;
    this._scheduledConnectionsToProcessData.push({
        connection: a,
        processingType: Gridifier.Renderer.Schedulator.SCHEDULED_CONNECTIONS_PROCESSING_TYPES.SHOW,
        left: b,
        top: c
    });
    this._schedule();
};

Gridifier.Renderer.Schedulator.prototype.scheduleHide = function(a, b, c) {
    this._scheduledConnectionsToProcessData.push({
        connection: a,
        processingType: Gridifier.Renderer.Schedulator.SCHEDULED_CONNECTIONS_PROCESSING_TYPES.HIDE,
        left: b,
        top: c
    });
    this._schedule();
};

Gridifier.Renderer.Schedulator.prototype.scheduleRender = function(a, b, c) {
    this._scheduledConnectionsToProcessData.push({
        connection: a,
        processingType: Gridifier.Renderer.Schedulator.SCHEDULED_CONNECTIONS_PROCESSING_TYPES.RENDER,
        left: b,
        top: c
    });
    this._schedule();
};

Gridifier.Renderer.Schedulator.prototype.scheduleDelayedRender = function(a, b, c, d) {
    this._scheduledConnectionsToProcessData.push({
        connection: a,
        processingType: Gridifier.Renderer.Schedulator.SCHEDULED_CONNECTIONS_PROCESSING_TYPES.DELAYED_RENDER,
        left: b,
        top: c,
        delay: d
    });
    this._schedule();
};

Gridifier.Renderer.Schedulator.prototype.scheduleRenderTransformed = function(a, b, c, d, e) {
    this._scheduledConnectionsToProcessData.push({
        connection: a,
        processingType: Gridifier.Renderer.Schedulator.SCHEDULED_CONNECTIONS_PROCESSING_TYPES.RENDER_TRANSFORMED,
        left: b,
        top: c,
        targetWidth: d,
        targetHeight: e
    });
    this._schedule();
};

Gridifier.Renderer.Schedulator.prototype.scheduleRenderDepended = function(a, b, c) {
    this._scheduledConnectionsToProcessData.push({
        connection: a,
        processingType: Gridifier.Renderer.Schedulator.SCHEDULED_CONNECTIONS_PROCESSING_TYPES.RENDER_DEPENDED,
        left: b,
        top: c
    });
    this._schedule();
};

Gridifier.Renderer.Schedulator.prototype._schedule = function() {
    var a = this;
    this._processScheduledConnectionsTimeout = setTimeout(function() {
        a._processScheduledConnections.call(a);
    }, Gridifier.Renderer.Schedulator.PROCESS_SCHEDULED_CONNECTIONS_TIMEOUT);
};

Gridifier.Renderer.Schedulator.prototype._processScheduledConnections = function() {
    var a = this;
    var b = Gridifier.Renderer.Schedulator;
    for (var c = 0; c < this._scheduledConnectionsToProcessData.length; c++) {
        var d = this._scheduledConnectionsToProcessData[c].connection;
        var e = this._scheduledConnectionsToProcessData[c].processingType;
        var f = this._scheduledConnectionsToProcessData[c].left;
        var g = this._scheduledConnectionsToProcessData[c].top;
        if (this._silentRenderer.isScheduledForSilentRender(d.item)) continue;
        if (e == b.SCHEDULED_CONNECTIONS_PROCESSING_TYPES.SHOW) {
            if (!this._connectedItemMarker.isItemConnected(d.item)) continue;
            Dom.css.set(d.item, {
                position: "absolute",
                left: f,
                top: g
            });
            if (this._gridifier.hasItemBindedClone(d.item)) {
                var h = this._gridifier.getItemClone(d.item);
                Dom.css.set(h, {
                    position: "absolute",
                    left: f,
                    top: g
                });
            }
            var i = this._settings.getToggle();
            var j = this._settings.getToggleTimeouter();
            var k = this._settings.getEventEmitter();
            var l = this._settings.getToggleAnimationMsDuration();
            var m = this._settings.getSizesResolverManager();
            var n = this._settings.getCoordsChanger();
            var o = this._settings.getCollector();
            var p = this._settings.getCoordsChangerApi();
            var q = this._gridifier.getItemClonesManager();
            var r = this._settings.getToggleTransitionTiming();
            var s = function(b) {
                i.show(d.item, a._gridifier.getGrid(), l, j, k, m, n, o, f, g, p, q, r);
            };
            if (this._gridifier.hasItemBindedClone(d.item)) {
                var h = this._gridifier.getItemClone(d.item);
                n(h, f, g, l, k, false, false, false, true);
            } else {
                n(d.item, f, g, l, k, false, false, false, true);
            }
            k.emitBeforeShowPerRetransformSortEvent();
            s(d.item);
        } else if (e == b.SCHEDULED_CONNECTIONS_PROCESSING_TYPES.HIDE) {
            this._renderer.unmarkItemAsScheduledToHide(d.item);
            var i = this._settings.getToggle();
            var j = this._settings.getToggleTimeouter();
            var k = this._settings.getEventEmitter();
            var l = this._settings.getToggleAnimationMsDuration();
            var m = this._settings.getSizesResolverManager();
            var n = this._settings.getCoordsChanger();
            var o = this._settings.getCollector();
            var p = this._settings.getCoordsChangerApi();
            var q = this._gridifier.getItemClonesManager();
            var r = this._settings.getToggleTransitionTiming();
            var t = function(b) {
                i.hide(b, a._gridifier.getGrid(), l, j, k, m, n, o, f, g, p, q, r);
            };
            t(d.item);
        } else if (e == b.SCHEDULED_CONNECTIONS_PROCESSING_TYPES.DELAYED_RENDER) {
            var u = this._scheduledConnectionsToProcessData[c].delay;
            var n = this._settings.getCoordsChanger();
            var k = this._settings.getEventEmitter();
            if (Dom.hasAttribute(d.item, Gridifier.Api.Toggle.IS_TOGGLE_ANIMATION_WITH_COORDS_CHANGE_RUNNING)) {
                var l = this._settings.getToggleAnimationMsDuration();
                var v = this._settings.getToggleTransitionTiming();
            } else {
                var l = this._settings.getCoordsChangeAnimationMsDuration();
                var v = this._settings.getCoordsChangeTransitionTiming();
            }
            var a = this;
            (function(b, c, d, e, f) {
                setTimeout(function() {
                    var f = a._connections.findConnectionByItem(b, true);
                    if (f == null) return;
                    n(b, a._rendererConnections.getCssLeftPropertyValuePerConnection(f), a._rendererConnections.getCssTopPropertyValuePerConnection(f), c, d, false, false, false, false, e);
                }, f);
            })(d.item, l, k, v, u);
        } else if (e == b.SCHEDULED_CONNECTIONS_PROCESSING_TYPES.RENDER || e == b.SCHEDULED_CONNECTIONS_PROCESSING_TYPES.RENDER_DEPENDED) {
            var n = this._settings.getCoordsChanger();
            var k = this._settings.getEventEmitter();
            if (Dom.hasAttribute(d.item, Gridifier.Api.Toggle.IS_TOGGLE_ANIMATION_WITH_COORDS_CHANGE_RUNNING)) {
                var l = this._settings.getToggleAnimationMsDuration();
                var v = this._settings.getToggleTransitionTiming();
            } else {
                var l = this._settings.getCoordsChangeAnimationMsDuration();
                var v = this._settings.getCoordsChangeTransitionTiming();
            }
            n(d.item, f, g, l, k, false, false, false, false, v);
        } else if (e == b.SCHEDULED_CONNECTIONS_PROCESSING_TYPES.RENDER_TRANSFORMED) {
            var w = this._scheduledConnectionsToProcessData[c].targetWidth;
            var x = this._scheduledConnectionsToProcessData[c].targetHeight;
            var y = this._settings.getSizesChanger();
            y(d.item, w, x);
            var n = this._settings.getCoordsChanger();
            var l = this._settings.getCoordsChangeAnimationMsDuration();
            var k = this._settings.getEventEmitter();
            var v = this._settings.getCoordsChangeTransitionTiming();
            n(d.item, f, g, l, k, true, w, x, false, v);
        }
    }
    this._gridifier.scheduleGridSizesUpdate();
    this._scheduledConnectionsToProcessData = null;
    this._processScheduledConnectionsTimeout = null;
};