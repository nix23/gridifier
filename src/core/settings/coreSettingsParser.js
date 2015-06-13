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

Gridifier.CoreSettingsParser = function(a, b) {
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

Gridifier.CoreSettingsParser.prototype.parseGridType = function() {
    if (!this._settings.hasOwnProperty("gridType") && !this._settings.hasOwnProperty("grid")) {
        var a = Gridifier.GRID_TYPES.VERTICAL_GRID;
        return a;
    }
    if (this._settings.hasOwnProperty("grid")) this._settings.gridType = this._settings.grid;
    if (this._settings.gridType != Gridifier.GRID_TYPES.VERTICAL_GRID && this._settings.gridType != Gridifier.GRID_TYPES.HORIZONTAL_GRID && this._settings.gridType != Gridifier.GRID_TYPES.VERTICAL_GRID_SHORT && this._settings.gridType != Gridifier.GRID_TYPES.HORIZONTAL_GRID_SHORT) {
        new Gridifier.Error(Gridifier.Error.ERROR_TYPES.SETTINGS.INVALID_GRID_TYPE, this._settings.gridType);
    }
    var a = this._settings.gridType;
    return a;
};

Gridifier.CoreSettingsParser.prototype.parsePrependType = function() {
    if (!this._settings.hasOwnProperty("prependType") && !this._settings.hasOwnProperty("prepend")) {
        var a = Gridifier.PREPEND_TYPES.MIRRORED_PREPEND;
        return a;
    }
    if (this._settings.hasOwnProperty("prepend")) this._settings.prependType = this._settings.prepend;
    if (this._settings.prependType != Gridifier.PREPEND_TYPES.DEFAULT_PREPEND && this._settings.prependType != Gridifier.PREPEND_TYPES.REVERSED_PREPEND && this._settings.prependType != Gridifier.PREPEND_TYPES.MIRRORED_PREPEND && this._settings.prependType != Gridifier.PREPEND_TYPES.DEFAULT_PREPEND_SHORT && this._settings.prependType != Gridifier.PREPEND_TYPES.REVERSED_PREPEND_SHORT && this._settings.prependType != Gridifier.PREPEND_TYPES.MIRRORED_PREPEND_SHORT) {
        new Gridifier.Error(Gridifier.Error.ERROR_TYPES.SETTINGS.INVALID_PREPEND_TYPE, this._settings.prependType);
    }
    var a = this._settings.prependType;
    return a;
};

Gridifier.CoreSettingsParser.prototype.parseAppendType = function() {
    if (!this._settings.hasOwnProperty("appendType") && !this._settings.hasOwnProperty("append")) {
        if (this._settingsCore.isVerticalGrid()) var a = Gridifier.APPEND_TYPES.REVERSED_APPEND; else if (this._settingsCore.isHorizontalGrid()) var a = Gridifier.APPEND_TYPES.DEFAULT_APPEND;
        return a;
    }
    if (this._settings.hasOwnProperty("append")) this._settings.appendType = this._settings.append;
    if (this._settings.appendType != Gridifier.APPEND_TYPES.DEFAULT_APPEND && this._settings.appendType != Gridifier.APPEND_TYPES.REVERSED_APPEND && this._settings.appendType != Gridifier.APPEND_TYPES.DEFAULT_APPEND_SHORT && this._settings.appendType != Gridifier.APPEND_TYPES.REVERSED_APPEND_SHORT) {
        new Gridifier.Error(Gridifier.Error.ERROR_TYPES.SETTINGS.INVALID_APPEND_TYPE, this._settings.appendType);
    }
    if (this._settingsCore.isHorizontalGrid()) var a = this._settings.appendType; else if (this._settingsCore.isVerticalGrid()) {
        if (this._settings.appendType == Gridifier.APPEND_TYPES.DEFAULT_APPEND || this._settings.appendType == Gridifier.APPEND_TYPES.DEFAULT_APPEND_SHORT) a = Gridifier.APPEND_TYPES.REVERSED_APPEND; else if (this._settings.appendType == Gridifier.APPEND_TYPES.REVERSED_APPEND || this._settings.appendType == Gridifier.APPEND_TYPES.REVERSED_APPEND_SHORT) a = Gridifier.APPEND_TYPES.DEFAULT_APPEND;
    }
    return a;
};

Gridifier.CoreSettingsParser.prototype.parseIntersectionStrategy = function() {
    if (!this._settings.hasOwnProperty("intersectionStrategy") && !this._settings.hasOwnProperty("intersections") && !this._settings.hasOwnProperty("alignmentType") && !this._settings.hasOwnProperty("align")) {
        var a = Gridifier.INTERSECTION_STRATEGIES.DEFAULT;
        return a;
    }
    if (this._settings.hasOwnProperty("intersections")) this._settings.intersectionStrategy = this._settings.intersections;
    if (this._settings.hasOwnProperty("intersectionStrategy")) {
        if (this._settings.intersectionStrategy != Gridifier.INTERSECTION_STRATEGIES.DEFAULT && this._settings.intersectionStrategy != Gridifier.INTERSECTION_STRATEGIES.NO_INTERSECTIONS && this._settings.intersectionStrategy != Gridifier.INTERSECTION_STRATEGIES.DEFAULT_SHORT && this._settings.intersectionStrategy != Gridifier.INTERSECTION_STRATEGIES.NO_INTERSECTIONS_SHORT) {
            new Gridifier.Error(Gridifier.Error.ERROR_TYPES.SETTINGS.INVALID_INTERSECTION_STRATEGY, this._settings.intersectionStrategy);
        }
    }
    if (this._settings.hasOwnProperty("intersectionStrategy")) var a = this._settings.intersectionStrategy; else if (this._settings.hasOwnProperty("alignmentType") || this._settings.hasOwnProperty("align")) var a = Gridifier.INTERSECTION_STRATEGIES.NO_INTERSECTIONS; else var a = Gridifier.INTERSECTION_STRATEGIES.DEFAULT;
    return a;
};

Gridifier.CoreSettingsParser.prototype.parseIntersectionStrategyAlignmentType = function() {
    var a = Gridifier.INTERSECTION_STRATEGY_ALIGNMENT_TYPES;
    if (!this._settings.hasOwnProperty("alignmentType") && !this._settings.hasOwnProperty("align")) {
        if (this._settingsCore.isVerticalGrid()) var b = a.FOR_VERTICAL_GRID.TOP; else if (this._settingsCore.isHorizontalGrid()) var b = a.FOR_HORIZONTAL_GRID.LEFT;
        return b;
    }
    if (this._settings.hasOwnProperty("alignmentType")) {
        this.ensureIsValidAlignmentType(this._settings.alignmentType);
        return this._settings.alignmentType;
    } else if (this._settings.hasOwnProperty("align")) {
        this.ensureIsValidAlignmentType(this._settings.align);
        return this._settings.align;
    }
};

Gridifier.CoreSettingsParser.prototype.ensureIsValidAlignmentType = function(a) {
    var b = Gridifier.INTERSECTION_STRATEGY_ALIGNMENT_TYPES;
    if (this._settingsCore.isVerticalGrid()) {
        var c = [ b.FOR_VERTICAL_GRID.TOP, b.FOR_VERTICAL_GRID.CENTER, b.FOR_VERTICAL_GRID.BOTTOM ];
    } else if (this._settingsCore.isHorizontalGrid()) {
        var c = [ b.FOR_HORIZONTAL_GRID.LEFT, b.FOR_HORIZONTAL_GRID.CENTER, b.FOR_HORIZONTAL_GRID.RIGHT ];
    }
    var d = false;
    for (var e = 0; e < c.length; e++) {
        if (c[e] == a) return;
    }
    new Gridifier.Error(Gridifier.Error.ERROR_TYPES.SETTINGS.INVALID_ALIGNMENT_TYPE, a);
};

Gridifier.CoreSettingsParser.prototype.parseSortDispersionMode = function() {
    if (!this._settings.hasOwnProperty("sortDispersionMode") && !this._settings.hasOwnProperty("sortDispersion")) {
        var a = Gridifier.SORT_DISPERSION_MODES.DISABLED;
        return a;
    }
    if (this._settings.hasOwnProperty("sortDispersion")) this._settings.sortDispersionMode = this._settings.sortDispersion;
    if (this._settings.sortDispersionMode != Gridifier.SORT_DISPERSION_MODES.DISABLED && this._settings.sortDispersionMode != Gridifier.SORT_DISPERSION_MODES.CUSTOM && this._settings.sortDispersionMode != Gridifier.SORT_DISPERSION_MODES.CUSTOM_ALL_EMPTY_SPACE && this._settings.sortDispersionMode != Gridifier.SORT_DISPERSION_MODES.CUSTOM_ALL_EMPTY_SPACE_SHORT) {
        new Gridifier.Error(Gridifier.Error.ERROR_TYPES.SETTINGS.INVALID_SORT_DISPERSION_MODE, this._settings.sortDispersionMode);
    }
    var a = this._settings.sortDispersionMode;
    return a;
};

Gridifier.CoreSettingsParser.prototype.parseSortDispersionValue = function() {
    if (!this._settingsCore.isCustomSortDispersion()) return "";
    if (!this._settings.hasOwnProperty("sortDispersionValue")) {
        new Gridifier.Error(Gridifier.Error.ERROR_TYPES.SETTINGS.MISSING_SORT_DISPERSION_VALUE);
    }
    var a = new RegExp(/[\d]+(px)/);
    if (!a.test(this._settings.sortDispersionValue)) {
        new Gridifier.Error(Gridifier.Error.ERROR_TYPES.SETTINGS.INVALID_SORT_DISPERSION_VALUE, this._settings.sortDispersionValue);
    }
    var b = this._settings.sortDispersionValue;
    return b;
};

Gridifier.CoreSettingsParser.prototype.parseMaxInsertionRange = function() {
    if (!this._settings.hasOwnProperty("maxInsertionRange")) return Gridifier.VerticalGrid.ConnectorsCleaner.MAX_VALID_VERTICAL_DISTANCE.FROM_MOST_TOP_CONNECTOR;
    return this._settings.maxInsertionRange;
};

Gridifier.CoreSettingsParser.prototype.parseResizeTimeoutValue = function() {
    if (!this._settings.hasOwnProperty("resizeTimeout")) return null;
    return Dom.toInt(this._settings.resizeTimeout);
};

Gridifier.CoreSettingsParser.prototype.parseDisableItemHideOnGridAttachValue = function() {
    if (!this._settings.hasOwnProperty("disableItemHideOnGridAttach") && !this._settings.hasOwnProperty("hideItems")) return false;
    if (this._settings.hasOwnProperty("hideItems")) return this._settings.hideItems ? false : true;
    return this._settings.disableItemHideOnGridAttach;
};

Gridifier.CoreSettingsParser.prototype.parseToggleAnimationMsDuration = function() {
    if (!this._settings.hasOwnProperty("toggleAnimationMsDuration") && !this._settings.hasOwnProperty("toggleDuration")) return Gridifier.DEFAULT_TOGGLE_ANIMATION_MS_DURATION;
    if (this._settings.hasOwnProperty("toggleDuration")) this._settings.toggleAnimationMsDuration = this._settings.toggleDuration;
    return this._settings.toggleAnimationMsDuration;
};

Gridifier.CoreSettingsParser.prototype.parseCoordsChangeAnimationMsDuration = function() {
    if (!this._settings.hasOwnProperty("coordsChangeAnimationMsDuration") && !this._settings.hasOwnProperty("coordsChangeDuration")) return Gridifier.DEFAULT_COORDS_CHANGE_ANIMATION_MS_DURATION;
    if (this._settings.hasOwnProperty("coordsChangeDuration")) this._settings.coordsChangeAnimationMsDuration = this._settings.coordsChangeDuration;
    return this._settings.coordsChangeAnimationMsDuration;
};

Gridifier.CoreSettingsParser.prototype.parseToggleTransitionTiming = function() {
    if (!this._settings.hasOwnProperty("toggleTransitionTiming")) return Gridifier.DEFAULT_TOGGLE_TRANSITION_TIMING;
    return this._settings.toggleTransitionTiming;
};

Gridifier.CoreSettingsParser.prototype.parseCoordsChangeTransitionTiming = function() {
    if (!this._settings.hasOwnProperty("coordsChangeTransitionTiming")) return Gridifier.DEFAULT_COORDS_CHANGE_TRANSITION_TIMING;
    return this._settings.coordsChangeTransitionTiming;
};

Gridifier.CoreSettingsParser.prototype.parseRotatePerspective = function() {
    if (!this._settings.hasOwnProperty("rotatePerspective")) return Gridifier.DEFAULT_ROTATE_PERSPECTIVE;
    return this._settings.rotatePerspective;
};

Gridifier.CoreSettingsParser.prototype.parseRotateBackface = function() {
    if (!this._settings.hasOwnProperty("rotateBackface")) return Gridifier.DEFAULT_ROTATE_BACKFACE;
    return this._settings.rotateBackface;
};

Gridifier.CoreSettingsParser.prototype.parseRotateAngles = function() {
    if (!this._settings.hasOwnProperty("rotateAngles") || !Dom.isArray(this._settings.rotateAngles)) {
        return [ Gridifier.DEFAULT_ROTATE_ANGLES.FRONT_FRAME_INIT, Gridifier.DEFAULT_ROTATE_ANGLES.BACK_FRAME_INIT, Gridifier.DEFAULT_ROTATE_ANGLES.FRONT_FRAME_TARGET, Gridifier.DEFAULT_ROTATE_ANGLES.BACK_FRAME_TARGET ];
    }
    return this.parseRotateAnglesArray(this._settings.rotateAngles);
};

Gridifier.CoreSettingsParser.prototype.parseRotateAnglesArray = function(a) {
    return [ typeof a[0] != "undefined" ? a[0] : Gridifier.DEFAULT_ROTATE_ANGLES.FRONT_FRAME_INIT, typeof a[1] != "undefined" ? a[1] : Gridifier.DEFAULT_ROTATE_ANGLES.BACK_FRAME_INIT, typeof a[2] != "undefined" ? a[2] : Gridifier.DEFAULT_ROTATE_ANGLES.FRONT_FRAME_TARGET, typeof a[3] != "undefined" ? a[3] : Gridifier.DEFAULT_ROTATE_ANGLES.BACK_FRAME_TARGET ];
};

Gridifier.CoreSettingsParser.prototype.parseGridTransformType = function() {
    if (!this._settings.hasOwnProperty("gridTransformType")) return Gridifier.GRID_TRANSFORM_TYPES.FIT;
    if (this._settings.gridTransformType == Gridifier.GRID_TRANSFORM_TYPES.EXPAND) return Gridifier.GRID_TRANSFORM_TYPES.EXPAND; else if (this._settings.gridTransformType == Gridifier.GRID_TRANSFORM_TYPES.DISABLED) return Gridifier.GRID_TRANSFORM_TYPES.DISABLED; else return Gridifier.GRID_TRANSFORM_TYPES.FIT;
};

Gridifier.CoreSettingsParser.prototype.parseGridTransformTimeout = function() {
    if (!this._settings.hasOwnProperty("gridTransformTimeout")) return Gridifier.DEFAULT_GRID_TRANSFORM_TIMEOUT;
    return this._settings.gridTransformTimeout;
};

Gridifier.CoreSettingsParser.prototype.parseRetransformQueueBatchSize = function() {
    if (!this._settings.hasOwnProperty("retransformQueueBatchSize")) return Gridifier.RETRANSFORM_QUEUE_DEFAULT_BATCH_SIZE;
    return this._settings.retransformQueueBatchSize;
};

Gridifier.CoreSettingsParser.prototype.parseRetransformQueueBatchTimeout = function() {
    if (!this._settings.hasOwnProperty("retransformQueueBatchTimeout")) return Gridifier.RETRANSFORM_QUEUE_DEFAULT_BATCH_TIMEOUT;
    return this._settings.retransformQueueBatchTimeout;
};

Gridifier.CoreSettingsParser.prototype.parseGridItemMarkingStrategy = function() {
    if (!this._settings.hasOwnProperty(Gridifier.GRID_ITEM_MARKING_STRATEGIES.BY_CLASS) && !this._settings.hasOwnProperty(Gridifier.GRID_ITEM_MARKING_STRATEGIES.BY_DATA_ATTR) && !this._settings.hasOwnProperty(Gridifier.GRID_ITEM_MARKING_STRATEGIES.BY_QUERY)) {
        return {
            gridItemMarkingStrategyType: Gridifier.GRID_ITEM_MARKING_STRATEGIES.BY_DATA_ATTR,
            gridItemMarkingValue: Gridifier.GRID_ITEM_MARKING_DEFAULTS.DATA_ATTR
        };
    }
    if (this._settings.hasOwnProperty(Gridifier.GRID_ITEM_MARKING_STRATEGIES.BY_CLASS)) {
        return {
            gridItemMarkingStrategyType: Gridifier.GRID_ITEM_MARKING_STRATEGIES.BY_CLASS,
            gridItemMarkingValue: this._settings[Gridifier.GRID_ITEM_MARKING_STRATEGIES.BY_CLASS]
        };
    } else if (this._settings.hasOwnProperty(Gridifier.GRID_ITEM_MARKING_STRATEGIES.BY_DATA_ATTR)) {
        return {
            gridItemMarkingStrategyType: Gridifier.GRID_ITEM_MARKING_STRATEGIES.BY_DATA_ATTR,
            gridItemMarkingValue: this._settings[Gridifier.GRID_ITEM_MARKING_STRATEGIES.BY_DATA_ATTR]
        };
    } else if (this._settings.hasOwnProperty(Gridifier.GRID_ITEM_MARKING_STRATEGIES.BY_QUERY)) {
        return {
            gridItemMarkingStrategyType: Gridifier.GRID_ITEM_MARKING_STRATEGIES.BY_QUERY,
            gridItemMarkingValue: this._settings[Gridifier.GRID_ITEM_MARKING_STRATEGIES.BY_QUERY]
        };
    }
};

Gridifier.CoreSettingsParser.prototype.parseDragifierMode = function() {
    if (this._settings.hasOwnProperty("dragifierMode") && (this._settings.dragifierMode == Gridifier.DRAGIFIER_MODES.INTERSECTION || this._settings.dragifierMode == Gridifier.DRAGIFIER_MODES.DISCRETIZATION)) {
        if (this._settings.dragifierMode == Gridifier.DRAGIFIER_MODES.DISCRETIZATION) {
            if (this._settingsCore.isNoIntersectionsStrategy() || !this._settingsCore.isCustomAllEmptySpaceSortDispersion()) {
                new Gridifier.Error(Gridifier.Error.ERROR_TYPES.SETTINGS.INVALID_DRAGIFIER_DISCRETIZATION_MODE);
            }
        }
        return this._settings.dragifierMode;
    }
    return Gridifier.DRAGIFIER_MODES.INTERSECTION;
};

Gridifier.CoreSettingsParser.prototype.parseDragifierSettings = function() {
    if (this._settings.hasOwnProperty("dragifier") && this._settings.dragifier) {
        var a = true;
        if (typeof this._settings.dragifier == "boolean") {
            var b = false;
        } else {
            var b = this._settings.dragifier;
        }
        return {
            shouldEnableDragifierOnInit: a,
            dragifierItemSelector: b
        };
    }
    var a = false;
    var b = false;
    return {
        shouldEnableDragifierOnInit: a,
        dragifierItemSelector: b
    };
};

Gridifier.CoreSettingsParser.prototype.parseDisableRetransformQueueOnDrags = function() {
    if (!this._settings.hasOwnProperty("disableRetransformQueueOnDrags")) {
        if (this._settingsCore.isIntersectionDragifierMode()) return true; else if (this._settingsCore.isDiscretizationDragifierMode()) return false;
    }
    return this._settings.disableRetransformQueueOnDrags;
};

Gridifier.CoreSettingsParser.prototype.parseCustomRepackSize = function() {
    if (!this._settings.hasOwnProperty("repackSize")) return null;
    return this._settings.repackSize;
};