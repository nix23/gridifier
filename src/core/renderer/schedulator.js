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
    DELAYED_RENDER: 3
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
            var h = this._settings.getToggle();
            var i = this._settings.getToggleTimeouter();
            var j = this._settings.getEventEmitter();
            var k = this._settings.getToggleAnimationMsDuration();
            var l = this._settings.getSizesResolverManager();
            var m = this._settings.getCoordsChanger();
            var n = this._settings.getCollector();
            var o = this._settings.getCoordsChangerApi();
            var p = this._settings.getToggleTransitionTiming();
            var q = function(b) {
                h.show(d.item, a._gridifier.getGrid(), k, i, j, l, m, n, f, g, o, null, p);
            };
            m(d.item, f, g, k, j, true);
            j.emitBeforeShowPerRetransformSortEvent();
            q(d.item);
        } else if (e == b.SCHEDULED_CONNECTIONS_PROCESSING_TYPES.HIDE) {
            this._renderer.unmarkItemAsScheduledToHide(d.item);
            var h = this._settings.getToggle();
            var i = this._settings.getToggleTimeouter();
            var j = this._settings.getEventEmitter();
            var k = this._settings.getToggleAnimationMsDuration();
            var l = this._settings.getSizesResolverManager();
            var m = this._settings.getCoordsChanger();
            var n = this._settings.getCollector();
            var o = this._settings.getCoordsChangerApi();
            var p = this._settings.getToggleTransitionTiming();
            var r = function(b) {
                h.hide(b, a._gridifier.getGrid(), k, i, j, l, m, n, f, g, o, null, p);
            };
            r(d.item);
        } else if (e == b.SCHEDULED_CONNECTIONS_PROCESSING_TYPES.DELAYED_RENDER) {
            var s = this._scheduledConnectionsToProcessData[c].delay;
            var m = this._settings.getCoordsChanger();
            var j = this._settings.getEventEmitter();
            if (Dom.hasAttribute(d.item, Gridifier.Api.Toggle.IS_TOGGLE_ANIMATION_WITH_COORDS_CHANGE_RUNNING)) {
                var k = this._settings.getToggleAnimationMsDuration();
                var t = this._settings.getToggleTransitionTiming();
            } else {
                var k = this._settings.getCoordsChangeAnimationMsDuration();
                var t = this._settings.getCoordsChangeTransitionTiming();
            }
            var a = this;
            (function(b, c, d, e, f) {
                setTimeout(function() {
                    var f = a._connections.findConnectionByItem(b, true);
                    if (f == null) return;
                    m(b, a._rendererConnections.getCssLeftPropertyValuePerConnection(f), a._rendererConnections.getCssTopPropertyValuePerConnection(f), c, d, false, e);
                }, f);
            })(d.item, k, j, t, s);
        } else if (e == b.SCHEDULED_CONNECTIONS_PROCESSING_TYPES.RENDER) {
            var m = this._settings.getCoordsChanger();
            var j = this._settings.getEventEmitter();
            if (Dom.hasAttribute(d.item, Gridifier.Api.Toggle.IS_TOGGLE_ANIMATION_WITH_COORDS_CHANGE_RUNNING)) {
                var k = this._settings.getToggleAnimationMsDuration();
                var t = this._settings.getToggleTransitionTiming();
            } else {
                var k = this._settings.getCoordsChangeAnimationMsDuration();
                var t = this._settings.getCoordsChangeTransitionTiming();
            }
            m(d.item, f, g, k, j, false, t);
        }
    }
    this._gridifier.scheduleGridSizesUpdate();
    this._scheduledConnectionsToProcessData = null;
    this._processScheduledConnectionsTimeout = null;
};