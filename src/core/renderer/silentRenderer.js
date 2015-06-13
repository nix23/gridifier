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

Gridifier.SilentRenderer = function(a, b, c, d, e, f, g) {
    var h = this;
    this._gridifier = null;
    this._collector = null;
    this._connections = null;
    this._operationsQueue = null;
    this._renderer = null;
    this._rendererConnections = null;
    this._sizesResolverManager = null;
    this._css = {};
    this._construct = function() {
        h._gridifier = a;
        h._collector = b;
        h._connections = c;
        h._operationsQueue = d;
        h._renderer = e;
        h._rendererConnections = f;
        h._sizesResolverManager = g;
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        h._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.SilentRenderer.SILENT_RENDER_DATA_ATTR = "data-gridifier-scheduled-for-silent-render";

Gridifier.SilentRenderer.SILENT_RENDER_DATA_ATTR_VALUE = "silentRender";

Gridifier.SilentRenderer.prototype.scheduleForSilentRender = function(a) {
    for (var b = 0; b < a.length; b++) {
        a[b].setAttribute(Gridifier.SilentRenderer.SILENT_RENDER_DATA_ATTR, Gridifier.SilentRenderer.SILENT_RENDER_DATA_ATTR_VALUE);
    }
};

Gridifier.SilentRenderer.prototype._preUnscheduleForSilentRender = function(a) {
    for (var b = 0; b < a.length; b++) {
        a[b].removeAttribute(Gridifier.SilentRenderer.SILENT_RENDER_DATA_ATTR);
    }
};

Gridifier.SilentRenderer.prototype.unscheduleForSilentRender = function(a, b) {
    for (var c = 0; c < a.length; c++) {
        a[c].removeAttribute(Gridifier.SilentRenderer.SILENT_RENDER_DATA_ATTR);
        this._rendererConnections.unmarkConnectionItemAsRendered(b[c]);
    }
};

Gridifier.SilentRenderer.prototype.isScheduledForSilentRender = function(a) {
    return Dom.hasAttribute(a, Gridifier.SilentRenderer.SILENT_RENDER_DATA_ATTR);
};

Gridifier.SilentRenderer.prototype.getScheduledForSilentRenderItems = function(a) {
    var b = a || false;
    var c = this._collector.collectByQuery("[" + Gridifier.SilentRenderer.SILENT_RENDER_DATA_ATTR + "=" + Gridifier.SilentRenderer.SILENT_RENDER_DATA_ATTR_VALUE + "]");
    if (c.length == 0) return [];
    if (!b) return c;
    var d = this._sizesResolverManager.offsetLeft(this._gridifier.getGrid());
    var e = this._sizesResolverManager.offsetTop(this._gridifier.getGrid());
    var f = this._sizesResolverManager.viewportDocumentCoords();
    var g = [];
    for (var h = 0; h < c.length; h++) {
        var i = this._connections.findConnectionByItem(c[h], true);
        if (i == null) continue;
        var j = false;
        var k = d + i.x1;
        var l = d + i.x2;
        var m = e + i.y1;
        var n = e + i.y2;
        var o = m < f.y1 && n < f.y1;
        var p = m > f.y2 && n > f.y2;
        var q = k < f.x1 && l < f.x1;
        var r = k > f.x2 && l > f.x2;
        if (o || p || q || r) j = true;
        if (!j) g.push(c[h]);
    }
    return g;
};

Gridifier.SilentRenderer.prototype.execute = function(a, b, c) {
    var d = function(a, b) {
        this.unscheduleForSilentRender(a, b);
        this._renderer.showConnections(b);
    };
    var e = this;
    if (typeof a != "undefined" && a != null && a) {
        a = this._collector.toDOMCollection(a);
        var f = [];
        for (var g = 0; g < a.length; g++) {
            if (this.isScheduledForSilentRender(a[g])) f.push(a[g]);
        }
        a = f;
        this._preUnscheduleForSilentRender(a);
    }
    var h = function(a, b, c) {
        if (typeof a == "undefined" || a == null || !a) {
            var f = this.getScheduledForSilentRenderItems();
        } else {
            var f = a;
        }
        if (f.length == 0) return;
        this._preUnscheduleForSilentRender(f);
        var g = [];
        for (var h = 0; h < f.length; h++) {
            var i = this._connections.findConnectionByItem(f[h], true);
            if (i != null) g.push(i);
        }
        var j = this._connections.getConnectionsSorter();
        g = j.sortConnectionsPerReappend(g);
        f = [];
        for (var h = 0; h < g.length; h++) f.push(g[h].item);
        if (typeof b == "undefined") {
            d.call(e, f, g);
            return;
        }
        if (typeof c == "undefined") var c = 100;
        var k = this._operationsQueue.splitItemsToBatches(f, b);
        var l = this._operationsQueue.splitItemsToBatches(g, b);
        for (var h = 0; h < k.length; h++) {
            (function(a, b, f) {
                setTimeout(function() {
                    d.call(e, a, f);
                }, c * b);
            })(k[h], h, l[h]);
        }
    };
    setTimeout(function() {
        h.call(e, a, b, c);
    }, Gridifier.REFLOW_OPTIMIZATION_TIMEOUT);
};