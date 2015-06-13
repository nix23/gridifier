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

Gridifier.ApiSettingsParser = function(a, b) {
    var c = this;
    this._settingsCore = null;
    this._settings = null;
    this._css = {};
    this._construct = function() {
        c._settingsCore = a;
        c._settings = b;
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        c._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.ApiSettingsParser.INITIAL_SETTING_MARKER = "initial";

Gridifier.ApiSettingsParser.prototype.parseToggleOptions = function(a) {
    if (!this._settings.hasOwnProperty("toggle")) {
        a.setToggleFunction("scale");
        return;
    }
    if (typeof this._settings.toggle == "string" || this._settings.toggle instanceof String) {
        a.setToggleFunction(this._settings.toggle);
        return;
    }
    if (typeof this._settings.toggle != "object") {
        new Gridifier.Error(Gridifier.Error.ERROR_TYPES.SETTINGS.INVALID_TOGGLE_PARAM_VALUE, this._settings.toggle);
    }
    for (var b in this._settings.toggle) {
        if (b == Gridifier.ApiSettingsParser.INITIAL_SETTING_MARKER) continue;
        var c = this._settings.toggle[b];
        if (typeof c != "object" || typeof c.show == "undefined" || typeof c.hide == "undefined") {
            new Gridifier.Error(Gridifier.Error.ERROR_TYPES.SETTINGS.INVALID_ONE_OF_TOGGLE_PARAMS, c);
        }
        a.addToggleFunction(b, c);
    }
    if (this._settings.toggle.hasOwnProperty(Gridifier.ApiSettingsParser.INITIAL_SETTING_MARKER)) a.setToggleFunction(this._settings.toggle[Gridifier.ApiSettingsParser.INITIAL_SETTING_MARKER]); else a.setToggleFunction("scale");
};

Gridifier.ApiSettingsParser.prototype.parseSortOptions = function(a) {
    if (!this._settings.hasOwnProperty("sort")) {
        a.setSortFunction("default");
        return;
    }
    if (typeof this._settings.sort == "string" || this._settings.sort instanceof String) {
        a.setSortFunction(this._settings.sort);
        return;
    } else if (typeof this._settings.sort == "function") {
        a.addSortFunction("clientDefault", this._settings.sort);
        a.setSortFunction("clientDefault");
        return;
    } else if (typeof this._settings.sort == "object") {
        for (var b in this._settings.sort) {
            if (b == Gridifier.ApiSettingsParser.INITIAL_SETTING_MARKER) continue;
            var c = this._settings.sort[b];
            if (typeof c != "function") {
                new Gridifier.Error(Gridifier.Error.ERROR_TYPES.SETTINGS.INVALID_ONE_OF_SORT_FUNCTION_TYPES, c);
            }
            a.addSortFunction(b, c);
        }
        if (this._settings.sort.hasOwnProperty(Gridifier.ApiSettingsParser.INITIAL_SETTING_MARKER)) a.setSortFunction(this._settings.sort[Gridifier.ApiSettingsParser.INITIAL_SETTING_MARKER]); else a.setSortFunction("default");
        return;
    } else {
        new Gridifier.Error(Gridifier.Error.ERROR_TYPES.SETTINGS.INVALID_SORT_PARAM_VALUE, this._settings.sort);
    }
};

Gridifier.ApiSettingsParser.prototype.parseRetransformSortOptions = function(a) {
    if (!this._settings.hasOwnProperty("retransformSort")) {
        a.setRetransformSortFunction("default");
        return;
    }
    if (!this._settingsCore.isCustomAllEmptySpaceSortDispersion()) {
        var b = "Gridifier error: retransformSort option is supported only with ";
        b += "'customAllEmptySpace' sortDispersion param.";
        throw new Error(b);
    }
    if (typeof this._settings.retransformSort == "string" || this._settings.retransformSort instanceof String) {
        a.setRetransformSortFunction(this._settings.retransformSort);
        return;
    } else if (typeof this._settings.retransformSort == "function") {
        a.addRetransformSortFunction("clientDefault", this._settings.retransformSort);
        a.setRetransformSortFunction("clientDefault");
        return;
    } else if (typeof this._settings.retransformSort == "object") {
        for (var c in this._settings.retransformSort) {
            if (c == Gridifier.ApiSettingsParser.INITIAL_SETTING_MARKER) continue;
            var d = this._settings.retransformSort[c];
            if (typeof d != "function") {
                new Gridifier.Error(Gridifier.Error.ERROR_TYPES.SETTINGS.INVALID_ONE_OF_RETRANSFORM_SORT_FUNCTION_TYPES, d);
            }
            a.addRetransformSortFunction(c, d);
        }
        if (this._settings.retransformSort.hasOwnProperty(Gridifier.ApiSettingsParser.INITIAL_SETTING_MARKER)) a.setRetransformSortFunction(this._settings.retransformSort[Gridifier.ApiSettingsParser.INITIAL_SETTING_MARKER]); else a.setRetransformSortFunction("default");
        return;
    } else {
        new Gridifier.Error(Gridifier.Error.ERROR_TYPES.SETTINGS.INVALID_RETRANSFORM_SORT_PARAM_VALUE, this._settings.retransformSort);
    }
};

Gridifier.ApiSettingsParser.prototype.parseFilterOptions = function(a) {
    if (!this._settings.hasOwnProperty("filter")) {
        a.setFilterFunction("all");
        return;
    }
    if (typeof this._settings.filter == "string" || this._settings.filter instanceof String || Dom.isArray(this._settings.filter)) {
        a.setFilterFunction(this._settings.filter);
        return;
    } else if (typeof this._settings.filter == "function") {
        a.addFilterFunction("clientDefault", this._settings.filter);
        a.setFilterFunction("clientDefault");
        return;
    } else if (typeof this._settings.filter == "object") {
        for (var b in this._settings.filter) {
            if (b == Gridifier.ApiSettingsParser.INITIAL_SETTING_MARKER) continue;
            var c = this._settings.filter[b];
            if (typeof c != "function") {
                new Gridifier.Error(Gridifier.Error.ERROR_TYPES.SETTINGS.INVALID_ONE_OF_FILTER_FUNCTION_TYPES, c);
            }
            a.addFilterFunction(b, c);
        }
        if (this._settings.filter.hasOwnProperty(Gridifier.ApiSettingsParser.INITIAL_SETTING_MARKER)) a.setFilterFunction(this._settings.filter[Gridifier.ApiSettingsParser.INITIAL_SETTING_MARKER]); else a.setFilterFunction("all");
        return;
    } else {
        new Gridifier.Error(Gridifier.Error.ERROR_TYPES.SETTINGS.INVALID_FILTER_PARAM_VALUE, this._settings.filter);
    }
};

Gridifier.ApiSettingsParser.prototype.parseCoordsChangerOptions = function(a) {
    if (!this._settings.hasOwnProperty("coordsChanger")) {
        a.setCoordsChangerFunction("CSS3Translate3DWithRounding");
        return;
    }
    if (typeof this._settings.coordsChanger == "string" || this._settings.coordsChanger instanceof String) {
        a.setCoordsChangerFunction(this._settings.coordsChanger);
        return;
    } else if (typeof this._settings.coordsChanger == "function") {
        a.addCoordsChangerFunction("clientDefault", this._settings.coordsChanger);
        a.setCoordsChangerFunction("clientDefault");
    } else if (typeof this._settings.coordsChanger == "object") {
        for (var b in this._settings.coordsChanger) {
            if (b == Gridifier.ApiSettingsParser.INITIAL_SETTING_MARKER) continue;
            var c = this._settings.coordsChanger[b];
            if (typeof c != "function") {
                new Gridifier.Error(Gridifier.Error.ERROR_TYPES.SETTINGS.INVALID_ONE_OF_COORDS_CHANGER_FUNCTION_TYPES, c);
            }
            a.addCoordsChangerFunction(b, c);
        }
        if (this._settings.coordsChanger.hasOwnProperty(Gridifier.ApiSettingsParser.INITIAL_SETTING_MARKER)) a.setCoordsChangerFunction(this._settings.coordsChanger[Gridifier.ApiSettingsParser.INITIAL_SETTING_MARKER]); else a.setCoordsChangerFunction("CSS3Translate3DWithRounding");
    } else {
        new Gridifier.Error(Gridifier.Error.ERROR_TYPES.SETTINGS.INVALID_COORDS_CHANGER_PARAM_VALUE, this._settings.coordsChanger);
    }
};

Gridifier.ApiSettingsParser.prototype.parseSizesChangerOptions = function(a) {
    if (!this._settings.hasOwnProperty("sizesChanger")) {
        a.setSizesChangerFunction("default");
        return;
    }
    if (typeof this._settings.sizesChanger == "string" || this._settings.sizesChanger instanceof String) {
        a.setSizesChangerFunction(this._settings.sizesChanger);
        return;
    } else if (typeof this._settings.sizesChanger == "function") {
        a.addSizesChangerFunction("clientDefault", this._settings.sizesChanger);
        a.setSizesChangerFunction("clientDefault");
        return;
    } else if (typeof this._settings.sizesChanger == "object") {
        for (var b in this._settings.sizesChanger) {
            if (b == Gridifier.ApiSettingsParser.INITIAL_SETTING_MARKER) continue;
            var c = this._settings.sizesChanger[b];
            if (typeof c != "function") {
                new Gridifier.Error(Gridifier.Error.ERROR_TYPES.SETTINGS.INVALID_ONE_OF_SIZES_CHANGER_FUNCTION_TYPES, c);
            }
            a.addSizesChangerFunction(b, c);
        }
        if (this._settings.sizesChanger.hasOwnProperty(Gridifier.ApiSettingsParser.INITIAL_SETTING_MARKER)) a.setSizesChangerFunction(this._settings.sizesChanger[Gridifier.ApiSettingsParser.INITIAL_SETTING_MARKER]); else a.setSizesChangerFunction("default");
        return;
    } else {
        new Gridifier.Error(Gridifier.Error.ERROR_TYPES.SETTINGS.INVALID_SIZES_CHANGER_PARAM_VALUE, this._settings.sizesChanger);
    }
};

Gridifier.ApiSettingsParser.prototype.parseDraggableItemDecoratorOptions = function(a) {
    if (!this._settings.hasOwnProperty("draggableItemDecorator") && !this._settings.hasOwnProperty("dragDecorator")) {
        a.setDraggableItemDecoratorFunction("cloneCSS");
        return;
    }
    if (this._settings.hasOwnProperty("dragDecorator")) this._settings.draggableItemDecorator = this._settings.dragDecorator;
    if (typeof this._settings.draggableItemDecorator == "string" || this._settings.draggableItemDecorator instanceof String) {
        a.setDraggableItemDecoratorFunction(this._settings.draggableItemDecorator);
        return;
    } else if (typeof this._settings.draggableItemDecorator == "function") {
        a.addDraggableItemDecoratorFunction("clientDefault", this._settings.draggableItemDecorator);
        a.setDraggableItemDecoratorFunction("clientDefault");
        return;
    } else if (typeof this._settings.draggableItemDecorator == "object") {
        for (var b in this._settings.draggableItemDecorator) {
            if (b == Gridifier.ApiSettingsParser.INITIAL_SETTING_MARKER) continue;
            var c = this._settings.draggableItemDecorator[b];
            if (typeof c != "function") {
                new Gridifier.Error(Gridifier.Error.ERROR_TYPES.SETTINGS.INVALID_ONE_OF_DRAGGABLE_ITEM_DECORATOR_FUNCTION_TYPES, c);
            }
            a.addDraggableItemDecoratorFunction(b, c);
        }
        if (this._settings.draggableItemDecorator.hasOwnProperty(Gridifier.ApiSettingsParser.INITIAL_SETTING_MARKER)) a.setDraggableItemDecoratorFunction(this._settings.draggableItemDecorator[Gridifier.ApiSettingsParser.INITIAL_SETTING_MARKER]); else a.setDraggableItemDecoratorFunction("cloneCSS");
        return;
    } else {
        new Gridifier.Error(Gridifier.Error.ERROR_TYPES.SETTINGS.INVALID_DRAGGABLE_ITEM_DECORATOR_PARAM_VALUE, this._settings.draggableItemDecorator);
    }
};