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

Gridifier.ItemClonesManager = function(a, b, c, d) {
    var e = this;
    this._grid = null;
    this._collector = null;
    this._connections = null;
    this._sizesResolverManager = null;
    this._itemClones = [];
    this._nextBindingId = 0;
    this._css = {};
    this._construct = function() {
        e._grid = a;
        e._collector = b;
        e._connections = c;
        e._sizesResolverManager = d;
        e._itemClones = [];
        e._bindEvents();
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        e._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.ItemClonesManager.ITEM_CLONE_MARKING_DATA_ATTR = "data-gridifier-clones-manager-item-clone";

Gridifier.ItemClonesManager.CLONES_MANAGER_BINDING_DATA_ATTR = "data-gridifier-clones-manager-binding";

Gridifier.ItemClonesManager.prototype.createClone = function(a) {
    var b = a.cloneNode(true);
    b.setAttribute(Gridifier.ItemClonesManager.ITEM_CLONE_MARKING_DATA_ATTR, "item-clone");
    b.style.visibility = "hidden";
    this._collector.markItemAsRestrictedToCollect(b);
    this._grid.getGrid().appendChild(b);
    if (a.style.zIndex.length == 0) {
        b.style.zIndex = 0;
        a.style.zIndex = 1;
    } else {
        var c = a.style.zIndex;
        if (c == 0) {
            b.style.zIndex = 0;
            a.style.zIndex = 1;
        } else {
            b.style.zIndex = 0;
        }
    }
    this._nextBindingId++;
    a.setAttribute(Gridifier.ItemClonesManager.CLONES_MANAGER_BINDING_DATA_ATTR, this._nextBindingId);
    b.setAttribute(Gridifier.ItemClonesManager.CLONES_MANAGER_BINDING_DATA_ATTR, this._nextBindingId);
    this._itemClones.push(b);
};

Gridifier.ItemClonesManager.prototype.unfilterClones = function(a) {
    a = this._collector.toDOMCollection(a);
    var b = [];
    for (var c = 0; c < a.length; c++) {
        if (this.isItemClone(a[c])) continue;
        b.push(a[c]);
    }
    return b;
};

Gridifier.ItemClonesManager.prototype.isItemClone = function(a) {
    return Dom.hasAttribute(a, Gridifier.ItemClonesManager.ITEM_CLONE_MARKING_DATA_ATTR);
};

Gridifier.ItemClonesManager.prototype.hasBindedClone = function(a) {
    return Dom.hasAttribute(a, Gridifier.ItemClonesManager.CLONES_MANAGER_BINDING_DATA_ATTR);
};

Gridifier.ItemClonesManager.prototype.getBindedClone = function(a) {
    var b = null;
    for (var c = 0; c < this._itemClones.length; c++) {
        if (this._itemClones[c].getAttribute(Gridifier.ItemClonesManager.CLONES_MANAGER_BINDING_DATA_ATTR) == a.getAttribute(Gridifier.ItemClonesManager.CLONES_MANAGER_BINDING_DATA_ATTR)) {
            b = this._itemClones[c];
            break;
        }
    }
    if (b == null) throw new Error("Gridifier error: binded clone not found(on bind). (Did you forgot to call setItemClonesManagerLifecycleCallbacks()?", a);
    return b;
};

Gridifier.ItemClonesManager.prototype.getOriginalItemFromClone = function(a) {
    var b = this._connections.get();
    for (var c = 0; c < b.length; c++) {
        if (b[c].item.getAttribute(Gridifier.ItemClonesManager.CLONES_MANAGER_BINDING_DATA_ATTR) == a.getAttribute(Gridifier.ItemClonesManager.CLONES_MANAGER_BINDING_DATA_ATTR)) return b[c].item;
    }
    return null;
};

Gridifier.ItemClonesManager.prototype.destroyClone = function(a) {
    var b = null;
    for (var c = 0; c < this._itemClones.length; c++) {
        if (this._itemClones[c].getAttribute(Gridifier.ItemClonesManager.CLONES_MANAGER_BINDING_DATA_ATTR) == a.getAttribute(Gridifier.ItemClonesManager.CLONES_MANAGER_BINDING_DATA_ATTR)) {
            b = this._itemClones[c];
            this._itemClones.splice(c, 1);
            break;
        }
    }
    if (b == null) throw new Error("Gridifier error: binded clone not found(on destroy). ", a);
    this._grid.getGrid().removeChild(b);
    a.removeAttribute(Gridifier.ItemClonesManager.CLONES_MANAGER_BINDING_DATA_ATTR);
};

Gridifier.ItemClonesManager.prototype.lockCloneOnToggle = function(a) {
    if (!this.hasBindedClone(a)) return this;
    var b = this.getBindedClone(a);
    b.setAttribute(Gridifier.Api.CoordsChanger.CSS3_TRANSLATE_3D_CLONES_RESTRICT_CLONE_SHOW_DATA_ATTR, "yes");
    return this;
};

Gridifier.ItemClonesManager.prototype.unlockCloneOnToggle = function(a) {
    if (!this.hasBindedClone(a)) return this;
    var b = this.getBindedClone(a);
    b.removeAttribute(Gridifier.Api.CoordsChanger.CSS3_TRANSLATE_3D_CLONES_RESTRICT_CLONE_SHOW_DATA_ATTR);
    return this;
};

Gridifier.ItemClonesManager.prototype.hideCloneOnToggle = function(a) {
    if (!this.hasBindedClone(a)) return;
    var b = this.getBindedClone(a);
    if (b.style.visibility == "visible") b.style.visibility = "hidden";
    return this;
};

Gridifier.ItemClonesManager.prototype.getConnectionItemAtPoint = function(a, b) {
    a = parseFloat(a) - this._sizesResolverManager.offsetLeft(this._grid.getGrid());
    b = parseFloat(b) - this._sizesResolverManager.offsetTop(this._grid.getGrid());
    var c = this._connections.get();
    for (var d = 0; d < c.length; d++) {
        if (a >= c[d].x1 && a <= c[d].x2 && b >= c[d].y1 && b <= c[d].y2) return c[d].item;
    }
    return null;
};