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

Gridifier.ResponsiveClassesManager = function(a, b, c, d, e, f) {
    var g = this;
    this._gridifier = null;
    this._settings = null;
    this._collector = null;
    this._guid = null;
    this._eventEmitter = null;
    this._itemClonesManager = null;
    this._eventsData = [];
    this._css = {};
    this._construct = function() {
        g._gridifier = a;
        g._settings = b;
        g._collector = c;
        g._guid = d;
        g._eventEmitter = e;
        g._itemClonesManager = f;
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        g._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.ResponsiveClassesManager.prototype._saveTransformDataPerEvent = function(a, b, c) {
    var d = this._guid.getItemGUID(a);
    var e = null;
    for (var f = 0; f < this._eventsData.length; f++) {
        if (this._eventsData[f].itemGUID == d) {
            e = this._eventsData[f];
            break;
        }
    }
    if (e == null) {
        e = {};
        this._eventsData.push(e);
    }
    e.itemGUID = d;
    e.addedClasses = b;
    e.removedClasses = c;
};

Gridifier.ResponsiveClassesManager.prototype.emitTransformEvents = function(a) {
    if (this._eventsData.length == 0) return;
    var b = this;
    for (var c = 0; c < a.length; c++) {
        for (var d = 0; d < this._eventsData.length; d++) {
            if (Dom.toInt(a[c].itemGUID) == this._eventsData[d].itemGUID) {
                (function(a, c, d) {
                    setTimeout(function() {
                        b._eventEmitter.emitResponsiveTransformEvent(a, c, d);
                    }, b._settings.getCoordsChangeAnimationMsDuration());
                })(a[c].item, this._eventsData[d].addedClasses, this._eventsData[d].removedClasses);
                this._eventsData.splice(d, 1);
                break;
            }
        }
    }
};

Gridifier.ResponsiveClassesManager.prototype.toggleResponsiveClasses = function(a, b) {
    var c = this._itemClonesManager.unfilterClones(a);
    this._collector.ensureAllItemsAreConnectedToGrid(c);
    if (!Dom.isArray(b)) var d = [ b ]; else var d = b;
    for (var e = 0; e < c.length; e++) {
        if (this._gridifier.hasItemBindedClone(c[e])) var f = this._gridifier.getItemClone(c[e]); else var f = null;
        var g = [];
        var h = [];
        for (var i = 0; i < d.length; i++) {
            if (Dom.css.hasClass(c[e], d[i])) {
                h.push(d[i]);
                Dom.css.removeClass(c[e], d[i]);
                if (f != null) Dom.css.removeClass(f, d[i]);
            } else {
                g.push(d[i]);
                Dom.css.addClass(c[e], d[i]);
                if (f != null) Dom.css.addClass(f, d[i]);
            }
        }
        this._saveTransformDataPerEvent(c[e], g, h);
    }
    return c;
};

Gridifier.ResponsiveClassesManager.prototype.addResponsiveClasses = function(a, b) {
    var c = this._itemClonesManager.unfilterClones(a);
    this._collector.ensureAllItemsAreConnectedToGrid(c);
    if (!Dom.isArray(b)) var d = [ b ]; else var d = b;
    for (var e = 0; e < c.length; e++) {
        if (this._gridifier.hasItemBindedClone(c[e])) var f = this._gridifier.getItemClone(c[e]); else var f = null;
        var g = [];
        for (var h = 0; h < d.length; h++) {
            if (!Dom.css.hasClass(c[e], d[h])) {
                g.push(d[h]);
                Dom.css.addClass(c[e], d[h]);
                if (f != null) Dom.css.addClass(f, b[h]);
            }
        }
        this._saveTransformDataPerEvent(c[e], g, []);
    }
    return c;
};

Gridifier.ResponsiveClassesManager.prototype.removeResponsiveClasses = function(a, b) {
    var c = this._itemClonesManager.unfilterClones(a);
    this._collector.ensureAllItemsAreConnectedToGrid(c);
    if (!Dom.isArray(b)) var d = [ b ]; else var d = b;
    for (var e = 0; e < c.length; e++) {
        if (this._gridifier.hasItemBindedClone(c[e])) var f = this._gridifier.getItemClone(c[e]); else var f = null;
        var g = [];
        for (var h = 0; h < d.length; h++) {
            if (Dom.css.hasClass(c[e], d[h])) {
                g.push(d[h]);
                Dom.css.removeClass(c[e], d[h]);
                if (f != null) Dom.css.removeClass(f, d[h]);
            }
        }
        this._saveTransformDataPerEvent(c[e], [], g);
    }
    return c;
};