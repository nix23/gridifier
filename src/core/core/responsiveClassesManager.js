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

Gridifier.ResponsiveClassesManager = function(a, b, c, d, e) {
    var f = this;
    this._gridifier = null;
    this._settings = null;
    this._collector = null;
    this._guid = null;
    this._eventEmitter = null;
    this._eventsData = [];
    this._css = {};
    this._construct = function() {
        f._gridifier = a;
        f._settings = b;
        f._collector = c;
        f._guid = d;
        f._eventEmitter = e;
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        f._unbindEvents();
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
    var c = this._collector.toDOMCollection(a);
    this._collector.ensureAllItemsAreConnectedToGrid(c);
    if (!Dom.isArray(b)) var d = [ b ]; else var d = b;
    for (var e = 0; e < c.length; e++) {
        var f = [];
        var g = [];
        for (var h = 0; h < d.length; h++) {
            if (Dom.css.hasClass(c[e], d[h])) {
                g.push(d[h]);
                Dom.css.removeClass(c[e], d[h]);
            } else {
                f.push(d[h]);
                Dom.css.addClass(c[e], d[h]);
            }
        }
        this._saveTransformDataPerEvent(c[e], f, g);
    }
    return c;
};

Gridifier.ResponsiveClassesManager.prototype.addResponsiveClasses = function(a, b) {
    var c = this._collector.toDOMCollection(a);
    this._collector.ensureAllItemsAreConnectedToGrid(c);
    if (!Dom.isArray(b)) var d = [ b ]; else var d = b;
    for (var e = 0; e < c.length; e++) {
        var f = [];
        for (var g = 0; g < d.length; g++) {
            if (!Dom.css.hasClass(c[e], d[g])) {
                f.push(d[g]);
                Dom.css.addClass(c[e], d[g]);
            }
        }
        this._saveTransformDataPerEvent(c[e], f, []);
    }
    return c;
};

Gridifier.ResponsiveClassesManager.prototype.removeResponsiveClasses = function(a, b) {
    var c = this._collector.toDOMCollection(a);
    this._collector.ensureAllItemsAreConnectedToGrid(c);
    if (!Dom.isArray(b)) var d = [ b ]; else var d = b;
    for (var e = 0; e < c.length; e++) {
        var f = [];
        for (var g = 0; g < d.length; g++) {
            if (Dom.css.hasClass(c[e], d[g])) {
                f.push(d[g]);
                Dom.css.removeClass(c[e], d[g]);
            }
        }
        this._saveTransformDataPerEvent(c[e], [], f);
    }
    return c;
};