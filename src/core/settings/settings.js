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

Gridifier.Settings = function(a, b, c, d, e) {
    var f = this;
    this._settings = null;
    this._gridifier = null;
    this._guid = null;
    this._collector = null;
    this._eventEmitter = null;
    this._sizesResolverManager = null;
    this._coreSettingsParser = null;
    this._apiSettingsParser = null;
    this._gridType = null;
    this._prependType = null;
    this._appendType = null;
    this._intersectionStrategy = null;
    this._alignmentType = null;
    this._sortDispersionMode = null;
    this._sortDispersionValue = null;
    this._maxInsertionRange = null;
    this._toggleApi = null;
    this._toggleTimeouterApi = null;
    this._sortApi = null;
    this._filterApi = null;
    this._coordsChangerApi = null;
    this._sizesChangerApi = null;
    this._dragifierApi = null;
    this._resizeTimeout = null;
    this._gridItemMarkingStrategyType = null;
    this._gridItemMarkingValue = null;
    this._dragifierMode = null;
    this._shouldEnableDragifierOnInit = false;
    this._dragifierItemSelector = null;
    this._shouldDisableItemHideOnGridAttach = false;
    this._toggleAnimationMsDuration = null;
    this._coordsChangeAnimationMsDuration = null;
    this._toggleTransitionTiming = null;
    this._coordsChangeTransitionTiming = null;
    this._rotatePerspective = null;
    this._rotateBackface = null;
    this._rotateAngles = null;
    this._gridTransformType = null;
    this._gridTransformTimeout = null;
    this._retransformQueueBatchSize = null;
    this._retransformQueueBatchTimeout = null;
    this._disableRetransformQueueOnDrags = false;
    this._repackSize = null;
    this._resolveImages = false;
    this._css = {};
    this._construct = function() {
        f._settings = a;
        f._gridifier = b;
        f._guid = c;
        f._eventEmitter = d;
        f._sizesResolverManager = e;
        f._coreSettingsParser = new Gridifier.CoreSettingsParser(f, f._settings);
        f._apiSettingsParser = new Gridifier.ApiSettingsParser(f, f._settings);
        f._toggleApi = new Gridifier.Api.Toggle(f, f._gridifier, f._eventEmitter, f._sizesResolverManager);
        f._toggleTimeouterApi = new Gridifier.Api.ToggleTimeouter();
        f._sortApi = new Gridifier.Api.Sort(f, f._gridifier, f._eventEmitter);
        f._filterApi = new Gridifier.Api.Filter(f, f._eventEmitter);
        f._coordsChangerApi = new Gridifier.Api.CoordsChanger(f, f._gridifier, f._eventEmitter);
        f._sizesChangerApi = new Gridifier.Api.SizesChanger(f, f._eventEmitter);
        f._dragifierApi = new Gridifier.Api.Dragifier();
        f._parse();
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        f._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.Settings.prototype.setCollectorInstance = function(a) {
    this._toggleApi.setCollectorInstance(a);
    this._collector = a;
};

Gridifier.Settings.prototype._parse = function() {
    this._gridType = this._coreSettingsParser.parseGridType();
    this._prependType = this._coreSettingsParser.parsePrependType();
    this._appendType = this._coreSettingsParser.parseAppendType();
    this._intersectionStrategy = this._coreSettingsParser.parseIntersectionStrategy();
    this._alignmentType = this._coreSettingsParser.parseIntersectionStrategyAlignmentType();
    this._sortDispersionMode = this._coreSettingsParser.parseSortDispersionMode();
    this._sortDispersionValue = this._coreSettingsParser.parseSortDispersionValue();
    this._maxInsertionRange = this._coreSettingsParser.parseMaxInsertionRange();
    this._resizeTimeout = this._coreSettingsParser.parseResizeTimeoutValue();
    this._shouldDisableItemHideOnGridAttach = this._coreSettingsParser.parseDisableItemHideOnGridAttachValue();
    this._toggleAnimationMsDuration = this._coreSettingsParser.parseToggleAnimationMsDuration();
    this._coordsChangeAnimationMsDuration = this._coreSettingsParser.parseCoordsChangeAnimationMsDuration();
    this._toggleTransitionTiming = this._coreSettingsParser.parseToggleTransitionTiming();
    this._coordsChangeTransitionTiming = this._coreSettingsParser.parseCoordsChangeTransitionTiming();
    this._rotatePerspective = this._coreSettingsParser.parseRotatePerspective();
    this._rotateBackface = this._coreSettingsParser.parseRotateBackface();
    this._rotateAngles = this._coreSettingsParser.parseRotateAngles();
    this._gridTransformType = this._coreSettingsParser.parseGridTransformType();
    this._gridTransformTimeout = this._coreSettingsParser.parseGridTransformTimeout();
    this._retransformQueueBatchSize = this._coreSettingsParser.parseRetransformQueueBatchSize();
    this._retransformQueueBatchTimeout = this._coreSettingsParser.parseRetransformQueueBatchTimeout();
    this._apiSettingsParser.parseToggleOptions(this._toggleApi);
    this._apiSettingsParser.parseSortOptions(this._sortApi);
    this._apiSettingsParser.parseRetransformSortOptions(this._sortApi);
    this._apiSettingsParser.parseFilterOptions(this._filterApi);
    this._apiSettingsParser.parseCoordsChangerOptions(this._coordsChangerApi);
    this._apiSettingsParser.parseSizesChangerOptions(this._sizesChangerApi);
    this._apiSettingsParser.parseDraggableItemDecoratorOptions(this._dragifierApi);
    var a = this._coreSettingsParser.parseGridItemMarkingStrategy();
    this._gridItemMarkingStrategyType = a.gridItemMarkingStrategyType;
    this._gridItemMarkingValue = a.gridItemMarkingValue;
    this._dragifierMode = this._coreSettingsParser.parseDragifierMode();
    var b = this._coreSettingsParser.parseDragifierSettings();
    this._shouldEnableDragifierOnInit = b.shouldEnableDragifierOnInit;
    this._dragifierItemSelector = b.dragifierItemSelector;
    this._disableRetransformQueueOnDrags = this._coreSettingsParser.parseDisableRetransformQueueOnDrags();
    this._repackSize = this._coreSettingsParser.parseCustomRepackSize();
    this._resolveImages = this._coreSettingsParser.parseResolveImages();
    var c = this;
    this._gridifier.setDefaultPrepend = function() {
        c.setDefaultPrepend.call(c);
    };
    this._gridifier.setReversedPrepend = function() {
        c.setReversedPrepend.call(c);
    };
    this._gridifier.setMirroredPrepend = function() {
        c.setMirroredPrepend.call(c);
    };
    this._gridifier.setDefaultAppend = function() {
        c.setDefaultAppend.call(c);
    };
    this._gridifier.setReversedAppend = function() {
        c.setReversedAppend.call(c);
    };
    this._gridifier.setDisabledSortDispersion = function() {
        c._sortDispersionMode = Gridifier.SORT_DISPERSION_MODES.DISABLED;
    };
    this._gridifier.setAllGridSortDispersion = function() {
        c._sortDispersionMode = Gridifier.SORT_DISPERSION_MODES.CUSTOM_ALL_EMPTY_SPACE_SHORT;
    };
};

Gridifier.Settings.prototype.parseAntialiasingSettings = function() {
    if (this._settings.hasOwnProperty("widthPtAntialias")) this._gridifier.setWidthPtAntialias(this._settings.widthPtAntialias);
    if (this._settings.hasOwnProperty("heightPtAntialias")) this._gridifier.setHeightPtAntialias(this._settings.heightPtAntialias);
    if (this._settings.hasOwnProperty("widthPxAntialias")) this._gridifier.setWidthPxAntialias(this._settings.widthPxAntialias);
    if (this._settings.hasOwnProperty("heightPxAntialias")) this._gridifier.setHeightPxAntialias(this._settings.heightPxAntialias);
};

Gridifier.Settings.prototype.setDefaultPrepend = function() {
    this._prependType = Gridifier.PREPEND_TYPES.DEFAULT_PREPEND;
};

Gridifier.Settings.prototype.setReversedPrepend = function() {
    this._prependType = Gridifier.PREPEND_TYPES.REVERSED_PREPEND;
};

Gridifier.Settings.prototype.setMirroredPrepend = function() {
    this._prependType = Gridifier.PREPEND_TYPES.MIRRORED_PREPEND;
};

Gridifier.Settings.prototype.setDefaultAppend = function() {
    if (this.isVerticalGrid()) this._appendType = Gridifier.APPEND_TYPES.REVERSED_APPEND; else if (this.isHorizontalGrid()) this._appendType = Gridifier.APPEND_TYPES.DEFAULT_APPEND;
};

Gridifier.Settings.prototype.setReversedAppend = function() {
    if (this.isVerticalGrid()) this._appendType = Gridifier.APPEND_TYPES.DEFAULT_APPEND; else if (this.isHorizontalGrid()) this._appendType = Gridifier.APPEND_TYPES.REVERSED_APPEND;
};

Gridifier.Settings.prototype.getCollector = function() {
    return this._collector;
};

Gridifier.Settings.prototype.getEventEmitter = function() {
    return this._eventEmitter;
};

Gridifier.Settings.prototype.getSizesResolverManager = function() {
    return this._sizesResolverManager;
};

Gridifier.Settings.prototype.getCoordsChangerApi = function() {
    return this._coordsChangerApi;
};

Gridifier.Settings.prototype.getSortApi = function() {
    return this._sortApi;
};

Gridifier.Settings.prototype.getResizeTimeout = function() {
    return this._resizeTimeout;
};

Gridifier.Settings.prototype.getToggleAnimationMsDuration = function() {
    return this._toggleAnimationMsDuration;
};

Gridifier.Settings.prototype.getCoordsChangeAnimationMsDuration = function() {
    return this._coordsChangeAnimationMsDuration;
};

Gridifier.Settings.prototype.getToggleTransitionTiming = function() {
    return this._toggleTransitionTiming;
};

Gridifier.Settings.prototype.getCoordsChangeTransitionTiming = function() {
    return this._coordsChangeTransitionTiming;
};

Gridifier.Settings.prototype.setToggleTransitionTiming = function(a) {
    this._toggleTransitionTiming = a;
};

Gridifier.Settings.prototype.setCoordsChangeTransitionTiming = function(a) {
    this._coordsChangeTransitionTiming = a;
};

Gridifier.Settings.prototype.setToggleAnimationMsDuration = function(a) {
    this._toggleAnimationMsDuration = a;
};

Gridifier.Settings.prototype.setCoordsChangeAnimationMsDuration = function(a) {
    this._coordsChangeAnimationMsDuration = a;
};

Gridifier.Settings.prototype.getRotatePerspective = function() {
    return this._rotatePerspective;
};

Gridifier.Settings.prototype.getRotateBackface = function() {
    return this._rotateBackface;
};

Gridifier.Settings.prototype.getRotateAngles = function() {
    return this._rotateAngles;
};

Gridifier.Settings.prototype.setRotatePerspective = function(a) {
    this._rotatePerspective = a;
};

Gridifier.Settings.prototype.setRotateAngles = function(a) {
    this._rotateAngles = this._coreSettingsParser.parseRotateAnglesArray(a);
};

Gridifier.Settings.prototype.setRotateBackface = function(a) {
    this._rotateBackface = a;
};

Gridifier.Settings.prototype.setSortDispersionValue = function(a) {
    this._sortDispersionValue = a;
};

Gridifier.Settings.prototype.getMaxInsertionRange = function() {
    return this._maxInsertionRange;
};

Gridifier.Settings.prototype.isExpandGridTransformType = function() {
    return this._gridTransformType == Gridifier.GRID_TRANSFORM_TYPES.EXPAND;
};

Gridifier.Settings.prototype.isFitGridTransformType = function() {
    return this._gridTransformType == Gridifier.GRID_TRANSFORM_TYPES.FIT;
};

Gridifier.Settings.prototype.getGridTransformTimeout = function() {
    return this._gridTransformTimeout;
};

Gridifier.Settings.prototype.getRetransformQueueBatchSize = function() {
    return this._retransformQueueBatchSize;
};

Gridifier.Settings.prototype.getRetransformQueueBatchTimeout = function() {
    return this._retransformQueueBatchTimeout;
};

Gridifier.Settings.prototype.setRetransformQueueBatchSize = function(a) {
    this._retransformQueueBatchSize = a;
};

Gridifier.Settings.prototype.setRetransformQueueTimeout = function(a) {
    this._retransformQueueTimeout = a;
};

Gridifier.Settings.prototype.shouldDisableRetransformQueueOnDrags = function() {
    return this._disableRetransformQueueOnDrags;
};

Gridifier.Settings.prototype.getToggleTimeouter = function() {
    return this._toggleTimeouterApi;
};

Gridifier.Settings.prototype.getDraggableItemCoordsChanger = function() {
    return this._dragifierApi.getDraggableItemCoordsChanger();
};

Gridifier.Settings.prototype.getDraggableItemPointerDecorator = function() {
    return this._dragifierApi.getDraggableItemPointerDecorator();
};

Gridifier.Settings.prototype.getDragifierUserSelectToggler = function() {
    return this._dragifierApi.getDragifierUserSelectToggler();
};

Gridifier.Settings.prototype.isVerticalGrid = function() {
    return this._gridType == Gridifier.GRID_TYPES.VERTICAL_GRID || this._gridType == Gridifier.GRID_TYPES.VERTICAL_GRID_SHORT;
};

Gridifier.Settings.prototype.isHorizontalGrid = function() {
    return this._gridType == Gridifier.GRID_TYPES.HORIZONTAL_GRID || this._gridType == Gridifier.GRID_TYPES.HORIZONTAL_GRID_SHORT;
};

Gridifier.Settings.prototype.isDefaultPrepend = function() {
    return this._prependType == Gridifier.PREPEND_TYPES.DEFAULT_PREPEND || this._prependType == Gridifier.PREPEND_TYPES.DEFAULT_PREPEND_SHORT;
};

Gridifier.Settings.prototype.isReversedPrepend = function() {
    return this._prependType == Gridifier.PREPEND_TYPES.REVERSED_PREPEND || this._prependType == Gridifier.PREPEND_TYPES.REVERSED_PREPEND_SHORT;
};

Gridifier.Settings.prototype.isMirroredPrepend = function() {
    return this._prependType == Gridifier.PREPEND_TYPES.MIRRORED_PREPEND || this._prependType == Gridifier.PREPEND_TYPES.MIRRORED_PREPEND_SHORT;
};

Gridifier.Settings.prototype.isDefaultAppend = function() {
    return this._appendType == Gridifier.APPEND_TYPES.DEFAULT_APPEND || this._appendType == Gridifier.APPEND_TYPES.DEFAULT_APPEND_SHORT;
};

Gridifier.Settings.prototype.isReversedAppend = function() {
    return this._appendType == Gridifier.APPEND_TYPES.REVERSED_APPEND || this._appendType == Gridifier.APPEND_TYPES.REVERSED_APPEND_SHORT;
};

Gridifier.Settings.prototype.isDefaultIntersectionStrategy = function() {
    return this._intersectionStrategy == Gridifier.INTERSECTION_STRATEGIES.DEFAULT || this._intersectionStrategy == Gridifier.INTERSECTION_STRATEGIES.DEFAULT_SHORT;
};

Gridifier.Settings.prototype.isNoIntersectionsStrategy = function() {
    return this._intersectionStrategy == Gridifier.INTERSECTION_STRATEGIES.NO_INTERSECTIONS || this._intersectionStrategy == Gridifier.INTERSECTION_STRATEGIES.NO_INTERSECTIONS_SHORT;
};

Gridifier.Settings.prototype.isVerticalGridTopAlignmentType = function() {
    return this._alignmentType == Gridifier.INTERSECTION_STRATEGY_ALIGNMENT_TYPES.FOR_VERTICAL_GRID.TOP;
};

Gridifier.Settings.prototype.isVerticalGridCenterAlignmentType = function() {
    return this._alignmentType == Gridifier.INTERSECTION_STRATEGY_ALIGNMENT_TYPES.FOR_VERTICAL_GRID.CENTER;
};

Gridifier.Settings.prototype.isVerticalGridBottomAlignmentType = function() {
    return this._alignmentType == Gridifier.INTERSECTION_STRATEGY_ALIGNMENT_TYPES.FOR_VERTICAL_GRID.BOTTOM;
};

Gridifier.Settings.prototype.isHorizontalGridLeftAlignmentType = function() {
    return this._alignmentType == Gridifier.INTERSECTION_STRATEGY_ALIGNMENT_TYPES.FOR_HORIZONTAL_GRID.LEFT;
};

Gridifier.Settings.prototype.isHorizontalGridCenterAlignmentType = function() {
    return this._alignmentType == Gridifier.INTERSECTION_STRATEGY_ALIGNMENT_TYPES.FOR_HORIZONTAL_GRID.CENTER;
};

Gridifier.Settings.prototype.isHorizontalGridRightAlignmentType = function() {
    return this._alignmentType == Gridifier.INTERSECTION_STRATEGY_ALIGNMENT_TYPES.FOR_HORIZONTAL_GRID.RIGHT;
};

Gridifier.Settings.prototype.isDisabledSortDispersion = function() {
    return this._sortDispersionMode == Gridifier.SORT_DISPERSION_MODES.DISABLED;
};

Gridifier.Settings.prototype.isCustomSortDispersion = function() {
    return this._sortDispersionMode == Gridifier.SORT_DISPERSION_MODES.CUSTOM;
};

Gridifier.Settings.prototype.isCustomAllEmptySpaceSortDispersion = function() {
    return this._sortDispersionMode == Gridifier.SORT_DISPERSION_MODES.CUSTOM_ALL_EMPTY_SPACE || this._sortDispersionMode == Gridifier.SORT_DISPERSION_MODES.CUSTOM_ALL_EMPTY_SPACE_SHORT;
};

Gridifier.Settings.prototype.getSortDispersionValue = function() {
    return this._sortDispersionValue;
};

Gridifier.Settings.prototype.shouldDisableItemHideOnGridAttach = function() {
    return this._shouldDisableItemHideOnGridAttach;
};

Gridifier.Settings.prototype.setToggle = function(a) {
    this._toggleApi.setToggleFunction(a);
};

Gridifier.Settings.prototype.setFilter = function(a) {
    this._filterApi.setFilterFunction(a);
};

Gridifier.Settings.prototype.setSort = function(a) {
    this._sortApi.setSortFunction(a);
};

Gridifier.Settings.prototype.setRetransformSort = function(a) {
    this._sortApi.setRetransformSortFunction(a);
};

Gridifier.Settings.prototype.getToggle = function() {
    return this._toggleApi.getToggleFunction();
};

Gridifier.Settings.prototype.getSort = function() {
    return this._sortApi.getSortFunction();
};

Gridifier.Settings.prototype.getRetransformSort = function() {
    return this._sortApi.getRetransformSortFunction();
};

Gridifier.Settings.prototype.getFilter = function() {
    return this._filterApi.getFilterFunction();
};

Gridifier.Settings.prototype.setCoordsChanger = function(a) {
    this._coordsChangerApi.setCoordsChangerFunction(a);
};

Gridifier.Settings.prototype.setSizesChanger = function(a) {
    this._sizesChangerApi.setSizesChangerFunction(a);
};

Gridifier.Settings.prototype.setDraggableItemDecorator = function(a) {
    this._dragifierApi.setDraggableItemDecoratorFunction(a);
};

Gridifier.Settings.prototype.getCoordsChanger = function() {
    return this._coordsChangerApi.getCoordsChangerFunction();
};

Gridifier.Settings.prototype.getSizesChanger = function() {
    return this._sizesChangerApi.getSizesChangerFunction();
};

Gridifier.Settings.prototype.getDraggableItemDecorator = function() {
    return this._dragifierApi.getDraggableItemDecoratorFunction();
};

Gridifier.Settings.prototype.isByClassGridItemMarkingStrategy = function() {
    return this._gridItemMarkingStrategyType == Gridifier.GRID_ITEM_MARKING_STRATEGIES.BY_CLASS;
};

Gridifier.Settings.prototype.isByDataAttrGridItemMarkingStrategy = function() {
    return this._gridItemMarkingStrategyType == Gridifier.GRID_ITEM_MARKING_STRATEGIES.BY_DATA_ATTR;
};

Gridifier.Settings.prototype.isByQueryGridItemMarkingStrategy = function() {
    return this._gridItemMarkingStrategyType == Gridifier.GRID_ITEM_MARKING_STRATEGIES.BY_QUERY;
};

Gridifier.Settings.prototype.getGridItemMarkingType = function() {
    return this._gridItemMarkingValue;
};

Gridifier.Settings.prototype.getGridItemMarkingValue = function() {
    return this._gridItemMarkingValue;
};

Gridifier.Settings.prototype.isIntersectionDragifierMode = function() {
    return this._dragifierMode == Gridifier.DRAGIFIER_MODES.INTERSECTION;
};

Gridifier.Settings.prototype.isDiscretizationDragifierMode = function() {
    return this._dragifierMode == Gridifier.DRAGIFIER_MODES.DISCRETIZATION;
};

Gridifier.Settings.prototype.shouldEnableDragifierOnInit = function() {
    return this._shouldEnableDragifierOnInit;
};

Gridifier.Settings.prototype.getDragifierItemSelector = function() {
    return this._dragifierItemSelector;
};

Gridifier.Settings.prototype.setNoIntersectionStrategy = function() {
    if (this._dragifierMode == Gridifier.DRAGIFIER_MODES.DISCRETIZATION) {
        throw new Error("Gridifier error: discretization dragifier is not compatible with no insersections strategy");
        return;
    }
    this._intersectionStrategy = Gridifier.INTERSECTION_STRATEGIES.NO_INTERSECTIONS;
};

Gridifier.Settings.prototype.setDefaultIntersectionStrategy = function() {
    this._intersectionStrategy = Gridifier.INTERSECTION_STRATEGIES.DEFAULT;
};

Gridifier.Settings.prototype.setAlignmentType = function(a) {
    this._coreSettingsParser.ensureIsValidAlignmentType(a);
    this._alignmentType = a;
};

Gridifier.Settings.prototype.setCustomRepackSize = function(a) {
    this._repackSize = a;
};

Gridifier.Settings.prototype.hasCustomRepackSize = function() {
    return this._repackSize != null;
};

Gridifier.Settings.prototype.getCustomRepackSize = function() {
    return this._repackSize;
};

Gridifier.Settings.prototype.shouldResolveImages = function() {
    return this._resolveImages;
};