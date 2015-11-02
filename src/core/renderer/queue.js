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

var RendererQueue = function() {
    this._queue = null;
    this._queueTimeout = null;
};

proto(RendererQueue, {
    _reinit: function() {
        if (this._queue == null) this._queue = []; else clearTimeout(this._queueTimeout);
    },
    schedule: function(a, b, c, d, e) {
        this._reinit();
        if (a == RENDER_OPS.SHOW && silentRenderer.isScheduled(b.item)) return;
        var f = this;
        this._queue.push({
            op: a,
            cn: b,
            left: c,
            top: d,
            delay: e
        });
        this._queueTimeout = setTimeout(function() {
            f._process.call(f);
        }, C.RENDER_QUEUE_DELAY);
    },
    _getApi: function() {
        return {
            toggle: toggleApi,
            cc: settings.getApi("coordsChanger"),
            grid: grid.get(),
            sr: SizesResolver,
            srManager: srManager,
            collect: collector,
            prefix: Prefixer,
            dom: Dom,
            getS: bind("get", settings),
            EVENT: EV,
            TOGGLE: TOGGLE,
            ROTATE: ROTATE
        };
    },
    _process: function() {
        for (var a = 0; a < this._queue.length; a++) {
            var b = this._queue[a];
            if (silentRenderer.isScheduled(b.cn.item)) continue;
            if (b.op == RENDER_OPS.SHOW) {
                if (!gridItem.isConnected(b.cn.item)) continue;
                var c = "show";
            } else var c = b.op == RENDER_OPS.HIDE ? "hide" : "render";
            this["_" + c](b.cn, b.left, b.top, this._getApi(), b.op, b.delay);
        }
        grid.scheduleResize();
        this._queue = null;
    },
    _show: function(a, b, c, d) {
        var e = bind("get", settings);
        d.dom.css.set(a.item, {
            position: "absolute",
            left: b,
            top: c
        });
        settings.getApi("coordsChanger")(a.item, b, c, e("coordsChangeTime"), e("coordsChangeTiming"), d.dom, d.prefix, e, true);
        ev.emitInternal(INT_EV.BEFORE_SHOW_FOR_RSORT);
        settings.getApi("toggle").show(a.item, b, c, e("toggleTime"), e("toggleTiming"), ev, toggleSyncerApi, d.dom, d, {
            x1: b,
            y1: c
        });
    },
    _hide: function(a, b, c, d) {
        var e = bind("get", settings);
        renderer.unmarkAsSchToHide(a.item);
        settings.getApi("toggle").hide(a.item, b, c, e("toggleTime"), e("toggleTiming"), ev, toggleSyncerApi, d.dom, d, {
            x1: b,
            y1: c
        });
    },
    _render: function(a, b, c, d, e, f) {
        var g = this;
        if (e == RENDER_OPS.RENDER) this._execRender(a.item, b, c, d); else {
            setTimeout(function() {
                var b = cnsCore.find(a.item, true);
                if (b == null) return;
                g._execRender(b.item, rendererCns.left(b), rendererCns.top(b), d);
            }, f);
        }
    },
    _execRender: function(a, b, c, d) {
        var e = bind("get", settings);
        if (Dom.has(a, TOGGLE.IS_ACTIVE_WITH_CC)) {
            var f = e("toggleTime");
            var g = e("toggleTiming");
        } else {
            var f = e("coordsChangeTime");
            var g = e("coordsChangeTiming");
        }
        settings.getApi("coordsChanger")(a, b, c, f, g, d.dom, d.prefix, e);
    }
});