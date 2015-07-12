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

var Gridifier = function(a, b) {
    var c = this;
    this._grid = null;
    this._gridSizesUpdater = null;
    this._settings = null;
    this._collector = null;
    this._guid = null;
    this._eventEmitter = null;
    this._operation = null;
    this._resorter = null;
    this._filtrator = null;
    this._disconnector = null;
    this._sizesResolverManager = null;
    this._lifecycleCallbacks = null;
    this._itemClonesManager = null;
    this._responsiveClassesManager = null;
    this._imagesResolver = null;
    this._connectors = null;
    this._connections = null;
    this._connectionsSorter = null;
    this._iterator = null;
    this._renderer = null;
    this._silentRenderer = null;
    this._sizesTransformer = null;
    this._normalizer = null;
    this._prepender = null;
    this._reversedPrepender = null;
    this._appender = null;
    this._reversedAppender = null;
    this._operationsQueue = null;
    this._toggleOperation = null;
    this._transformOperation = null;
    this._dragifier = null;
    this._resizeEventHandler = null;
    this._css = {};
    this._construct = function() {
        if (typeof b == "undefined") b = {};
        c._sizesResolverManager = new Gridifier.SizesResolverManager();
        c._grid = new Gridifier.Grid(a, c._sizesResolverManager);
        c._eventEmitter = new Gridifier.EventEmitter(c);
        c._guid = new Gridifier.GUID();
        c._settings = new Gridifier.Settings(b, c, c._guid, c._eventEmitter, c._sizesResolverManager);
        c._collector = new Gridifier.Collector(c._settings, c.getGrid(), c._sizesResolverManager);
        c._settings.setCollectorInstance(c._collector);
        c._normalizer = new Gridifier.Normalizer(c, c._sizesResolverManager);
        c._operation = new Gridifier.Operation();
        c._lifecycleCallbacks = new Gridifier.LifecycleCallbacks(c._collector);
        c._grid.setCollectorInstance(c._collector);
        if (c._settings.shouldResolveImages()) {
            c._imagesResolver = new Gridifier.ImagesResolver(c);
        }
        if (c._settings.isVerticalGrid()) {
            c._connections = new Gridifier.VerticalGrid.Connections(c, c._guid, c._settings, c._sizesResolverManager, c._eventEmitter);
            c._connectionsSorter = new Gridifier.VerticalGrid.ConnectionsSorter(c._connections, c._settings, c._guid);
        } else if (c._settings.isHorizontalGrid()) {
            c._connections = new Gridifier.HorizontalGrid.Connections(c, c._guid, c._settings, c._sizesResolverManager, c._eventEmitter);
            c._connectionsSorter = new Gridifier.HorizontalGrid.ConnectionsSorter(c._connections, c._settings, c._guid);
        }
        c._itemClonesManager = new Gridifier.ItemClonesManager(c._grid, c._collector, c._connections, c._sizesResolverManager);
        c._responsiveClassesManager = new Gridifier.ResponsiveClassesManager(c, c._settings, c._collector, c._guid, c._eventEmitter, c._itemClonesManager);
        c._iterator = new Gridifier.Iterator(c._settings, c._collector, c._connections, c._connectionsSorter, c._guid);
        c._gridSizesUpdater = new Gridifier.GridSizesUpdater(c, c._grid, c._connections, c._settings, c._eventEmitter);
        c._connectors = new Gridifier.Connectors(c._guid, c._connections);
        c._renderer = new Gridifier.Renderer(c, c._connections, c._settings, c._normalizer);
        if (c._settings.isVerticalGrid()) {
            c._prepender = new Gridifier.VerticalGrid.Prepender(c, c._settings, c._sizesResolverManager, c._connectors, c._connections, c._guid, c._renderer, c._normalizer, c._operation);
            c._reversedPrepender = new Gridifier.VerticalGrid.ReversedPrepender(c, c._settings, c._sizesResolverManager, c._connectors, c._connections, c._guid, c._renderer, c._normalizer, c._operation);
            c._appender = new Gridifier.VerticalGrid.Appender(c, c._settings, c._sizesResolverManager, c._connectors, c._connections, c._guid, c._renderer, c._normalizer, c._operation);
            c._reversedAppender = new Gridifier.VerticalGrid.ReversedAppender(c, c._settings, c._sizesResolverManager, c._connectors, c._connections, c._guid, c._renderer, c._normalizer, c._operation);
        } else if (c._settings.isHorizontalGrid()) {
            c._prepender = new Gridifier.HorizontalGrid.Prepender(c, c._settings, c._sizesResolverManager, c._connectors, c._connections, c._guid, c._renderer, c._normalizer, c._operation);
            c._reversedPrepender = new Gridifier.HorizontalGrid.ReversedPrepender(c, c._settings, c._sizesResolverManager, c._connectors, c._connections, c._guid, c._renderer, c._normalizer, c._operation);
            c._appender = new Gridifier.HorizontalGrid.Appender(c, c._settings, c._sizesResolverManager, c._connectors, c._connections, c._guid, c._renderer, c._normalizer, c._operation);
            c._reversedAppender = new Gridifier.HorizontalGrid.ReversedAppender(c, c._settings, c._sizesResolverManager, c._connectors, c._connections, c._guid, c._renderer, c._normalizer, c._operation);
        }
        c._resorter = new Gridifier.Resorter(c, c._collector, c._connections, c._settings, c._guid);
        c._disconnector = new Gridifier.Disconnector(c, c._collector, c._connections, c._connectionsSorter, c._connectors, c._settings, c._guid, c._appender, c._reversedAppender);
        c._filtrator = new Gridifier.Filtrator(c, c._collector, c._connections, c._settings, c._guid, c._disconnector);
        c._sizesTransformer = new Gridifier.SizesTransformer.Core(c, c._settings, c._collector, c._connectors, c._connections, c._connectionsSorter, c._guid, c._appender, c._reversedAppender, c._normalizer, c._operation, c._sizesResolverManager, c._eventEmitter);
        c._connections.setSizesTransformerInstance(c._sizesTransformer);
        c._toggleOperation = new Gridifier.TransformerOperations.Toggle(c, c._collector, c._connections, c._guid, c._sizesTransformer, c._sizesResolverManager);
        c._transformOperation = new Gridifier.TransformerOperations.Transform(c, c._collector, c._connections, c._guid, c._sizesTransformer, c._sizesResolverManager);
        c._operationsQueue = new Gridifier.Operations.Queue(c._gridSizesUpdater, c._collector, c._connections, c._connectionsSorter, c._guid, c._settings, c._prepender, c._reversedPrepender, c._appender, c._reversedAppender, c._sizesTransformer, c._sizesResolverManager, c._eventEmitter);
        c._silentRenderer = new Gridifier.SilentRenderer(c, c._collector, c._connections, c._operationsQueue, c._renderer, c._renderer.getRendererConnections(), c._sizesResolverManager);
        c._renderer.setSilentRendererInstance(c._silentRenderer);
        c._dragifier = new Gridifier.Dragifier(c, c._appender, c._reversedAppender, c._collector, c._connections, c._connectors, c._guid, c._settings, c._sizesResolverManager, c._eventEmitter);
        c._settings.parseAntialiasingSettings();
        c._bindEvents();
    };
    this._bindEvents = function() {
        var a = c._settings.getResizeTimeout();
        var b = null;
        c._resizeEventHandler = function() {
            if (a == null) {
                c.triggerResize();
                return;
            }
            if (b != null) {
                clearTimeout(b);
                b = null;
            }
            b = setTimeout(function() {
                c.triggerResize();
            }, a);
        };
        Event.add(window, "resize", c._resizeEventHandler);
    };
    this._unbindEvents = function() {
        Event.remove(window, "resize");
    };
    this.destruct = function() {
        c._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.prototype.addToGrid = function(a) {
    this._grid.addToGrid(a);
    return this;
};

Gridifier.prototype.getGridX2 = function() {
    return this._grid.getGridX2();
};

Gridifier.prototype.getGridY2 = function() {
    return this._grid.getGridY2();
};

Gridifier.prototype.getGrid = function() {
    return this._grid.getGrid();
};

Gridifier.prototype.getCalculatedGridWidth = function() {
    return this._connections.getMaxX2();
};

Gridifier.prototype.getCalculatedGridHeight = function() {
    return this._connections.getMaxY2();
};

Gridifier.prototype.getGridWidth = function() {
    return Math.round(this.getGridX2() + 1);
};

Gridifier.prototype.getGridHeight = function() {
    return Math.round(this.getGridY2() + 1);
};

Gridifier.prototype.getCollector = function() {
    return this._collector;
};

Gridifier.prototype.getRenderer = function() {
    return this._renderer;
};

Gridifier.prototype.getTransformOperation = function() {
    return this._transformOperation;
};

Gridifier.prototype.getResponsiveClassesManager = function() {
    return this._responsiveClassesManager;
};

Gridifier.prototype.splitToBatches = function(a, b) {
    return this._operationsQueue.splitItemsToBatches(a, b);
};

Gridifier.prototype.markAsGridItem = function(a) {
    this._grid.markAsGridItem(a);
    return this;
};

Gridifier.prototype.scheduleGridSizesUpdate = function() {
    this._gridSizesUpdater.scheduleGridSizesUpdate();
};

Gridifier.prototype.triggerResize = function() {
    this.retransformAllSizes();
};

Gridifier.prototype.toggleBy = function(a) {
    this._settings.setToggle(a);
    return this;
};

Gridifier.prototype.sortBy = function(a) {
    this._settings.setSort(a);
    return this;
};

Gridifier.prototype.setRetransformSort = function(a) {
    this._settings.setRetransformSort(a);
    this.retransformAllSizes();
    return this;
};

Gridifier.prototype.setRepackSize = function(a) {
    this._settings.setCustomRepackSize(a);
    return this;
};

Gridifier.prototype.filterBy = function(a) {
    this._sizesTransformer.stopRetransformAllConnectionsQueue();
    this._settings.setFilter(a);
    this._filtrator.filter();
    this.retransformAllSizes();
    return this;
};

Gridifier.prototype.resort = function() {
    this._sizesTransformer.stopRetransformAllConnectionsQueue();
    this._resorter.resort();
    this.retransformAllSizes();
    return this;
};

Gridifier.prototype.collect = function() {
    return this._collector.collect();
};

Gridifier.prototype.collectAllConnectedItems = function() {
    return this._collector.collectAllConnectedItems();
};

Gridifier.prototype.collectAllDisconnectedItems = function() {
    return this._collector.collectAllDisconnectedItems();
};

Gridifier.prototype.getFirst = function() {
    return this._iterator.getFirst();
};

Gridifier.prototype.getLast = function() {
    return this._iterator.getLast();
};

Gridifier.prototype.getNext = function(a) {
    return this._iterator.getNext(a);
};

Gridifier.prototype.getPrev = function(a) {
    return this._iterator.getPrev(a);
};

Gridifier.prototype.getAll = function() {
    return this._iterator.getAll();
};

Gridifier.prototype.pop = function() {
    var a = this._iterator.getFirst();
    if (a != null) this.disconnect(a);
    return a;
};

Gridifier.prototype.shift = function() {
    var a = this._iterator.getLast();
    if (a != null) this.disconnect(a);
    return a;
};

Gridifier.prototype.disconnect = function(a) {
    var b = this;
    a = b._itemClonesManager.unfilterClones(a);
    a = b._collector.filterOnlyConnectedItems(a);
    b._lifecycleCallbacks.executePreDisconnectCallbacks(a);
    var c = function() {
        this._sizesTransformer.stopRetransformAllConnectionsQueue();
        this._disconnector.disconnect(a, Gridifier.Disconnector.DISCONNECT_TYPES.HARD);
        this.retransformAllSizes();
    };
    setTimeout(function() {
        c.call(b);
    }, Gridifier.REFLOW_OPTIMIZATION_TIMEOUT);
    return this;
};

Gridifier.prototype.setCoordsChanger = function(a) {
    this._settings.setCoordsChanger(a);
    return this;
};

Gridifier.prototype.setSizesChanger = function(a) {
    this._settings.setSizesChanger(a);
    return this;
};

Gridifier.prototype.setDraggableItemDecorator = function(a) {
    this._settings.setDraggableItemDecorator(a);
    return this;
};

Gridifier.prototype.setItemWidthPercentageAntialias = function(a) {
    this._normalizer.bindZIndexesUpdates();
    this._normalizer.setItemWidthAntialiasPercentageValue(a);
    return this;
};

Gridifier.prototype.setItemHeightPercentageAntialias = function(a) {
    this._normalizer.bindZIndexesUpdates();
    this._normalizer.setItemHeightAntialiasPercentageValue(a);
    return this;
};

Gridifier.prototype.setItemWidthPxAntialias = function(a) {
    this._normalizer.bindZIndexesUpdates();
    this._normalizer.setItemWidthAntialiasPxValue(a);
    return this;
};

Gridifier.prototype.setItemHeightPxAntialias = function(a) {
    this._normalizer.bindZIndexesUpdates();
    this._normalizer.setItemHeightAntialiasPxValue(a);
    return this;
};

Gridifier.prototype.disableZIndexesUpdates = function() {
    this._normalizer.disableZIndexesUpdates();
    return this;
};

Gridifier.prototype.setToggleAnimationMsDuration = function(a) {
    this._settings.setToggleAnimationMsDuration(a);
    return this;
};

Gridifier.prototype.setCoordsChangeAnimationMsDuration = function(a) {
    this._settings.setCoordsChangeAnimationMsDuration(a);
    return this;
};

Gridifier.prototype.setToggleTransitionTiming = function(a) {
    this._settings.setToggleTransitionTiming(a);
    return this;
};

Gridifier.prototype.setCoordsChangeTransitionTiming = function(a) {
    this._settings.setCoordsChangeTransitionTiming(a);
    return this;
};

Gridifier.prototype.setAlignmentType = function(a) {
    this._settings.setAlignmentType(a);
    this.retransformAllSizes();
    return this;
};

Gridifier.prototype.setRotatePerspective = function(a) {
    this._settings.setRotatePerspective(a);
    return this;
};

Gridifier.prototype.setRotateBackface = function(a) {
    this._settings.setRotateBackface(a);
    return this;
};

Gridifier.prototype.enableRotateBackface = function() {
    this._settings.setRotateBackface(true);
    return this;
};

Gridifier.prototype.disableRotateBackface = function() {
    this._settings.setRotateBackface(false);
    return this;
};

Gridifier.prototype.setRotateAngles = function(a) {
    this._settings.setRotateAngles(a);
    return this;
};

Gridifier.prototype.setSortDispersionValue = function(a) {
    this._settings.setSortDispersionValue(a);
    return this;
};

Gridifier.prototype.setDefaultIntersectionStrategy = function() {
    this._settings.setDefaultIntersectionStrategy();
    this.retransformAllSizes();
    return this;
};

Gridifier.prototype.setNoIntersectionStrategy = function() {
    this._settings.setNoIntersectionStrategy();
    this.retransformAllSizes();
    return this;
};

Gridifier.prototype.setRetransformQueueBatchSize = function(a) {
    this._settings.setRetransformQueueBatchSize(a);
    return this;
};

Gridifier.prototype.setRetransformQueueBatchTimeout = function(a) {
    this._settings.setRetransformQueueBatchTimeout(a);
    return this;
};

Gridifier.prototype.prepend = function(a, b, c) {
    if (this._settings.shouldResolveImages()) {
        this._imagesResolver.scheduleImagesResolve(this._collector.toDOMCollection(a), Gridifier.ImagesResolver.OPERATIONS.PREPEND, {
            batchSize: b,
            batchTimeout: c
        });
    } else {
        this.executePrepend(a, b, c);
    }
    return this;
};

Gridifier.prototype.executePrepend = function(a, b, c) {
    if (this._settings.isMirroredPrepend()) {
        this.insertBefore(a, null, b, c);
        return this;
    }
    this._lifecycleCallbacks.executePreInsertCallbacks(a);
    var d = function() {
        this._operationsQueue.schedulePrependOperation(a, b, c);
    };
    var e = this;
    setTimeout(function() {
        d.call(e);
    }, Gridifier.REFLOW_OPTIMIZATION_TIMEOUT);
};

Gridifier.prototype.append = function(a, b, c) {
    if (this._settings.shouldResolveImages()) {
        this._imagesResolver.scheduleImagesResolve(this._collector.toDOMCollection(a), Gridifier.ImagesResolver.OPERATIONS.APPEND, {
            batchSize: b,
            batchTimeout: c
        });
    } else {
        this.executeAppend(a, b, c);
    }
    return this;
};

Gridifier.prototype.executeAppend = function(a, b, c) {
    this._lifecycleCallbacks.executePreInsertCallbacks(a);
    var d = function() {
        this._operationsQueue.scheduleAppendOperation(a, b, c);
    };
    var e = this;
    setTimeout(function() {
        d.call(e);
    }, Gridifier.REFLOW_OPTIMIZATION_TIMEOUT);
};

Gridifier.prototype.silentAppend = function(a, b, c) {
    if (this._settings.shouldResolveImages()) {
        this._imagesResolver.scheduleImagesResolve(this._collector.toDOMCollection(a), Gridifier.ImagesResolver.OPERATIONS.SILENT_APPEND, {
            batchSize: b,
            batchTimeout: c
        });
    } else {
        this.executeSilentAppend(a, b, c);
    }
    return this;
};

Gridifier.prototype.executeSilentAppend = function(a, b, c) {
    this._silentRenderer.scheduleForSilentRender(this._collector.toDOMCollection(a));
    this.executeAppend(a, b, c);
};

Gridifier.prototype.silentRender = function(a, b, c) {
    this._silentRenderer.execute(a, b, c);
    return this;
};

Gridifier.prototype.getScheduledForSilentRenderItems = function(a) {
    return this._silentRenderer.getScheduledForSilentRenderItems(a);
};

Gridifier.prototype.insertBefore = function(a, b, c, d) {
    if (this._settings.shouldResolveImages()) {
        this._imagesResolver.scheduleImagesResolve(this._collector.toDOMCollection(a), Gridifier.ImagesResolver.OPERATIONS.INSERT_BEFORE, {
            batchSize: c,
            batchTimeout: d,
            beforeItem: b
        });
    } else {
        this.executeInsertBefore(a, b, c, d);
    }
    return this;
};

Gridifier.prototype.executeInsertBefore = function(a, b, c, d) {
    this._lifecycleCallbacks.executePreInsertCallbacks(a);
    var e = function() {
        this._operationsQueue.scheduleInsertBeforeOperation(a, b, c, d);
    };
    var f = this;
    setTimeout(function() {
        e.call(f);
    }, Gridifier.REFLOW_OPTIMIZATION_TIMEOUT);
};

Gridifier.prototype.insertAfter = function(a, b, c, d) {
    if (this._settings.shouldResolveImages()) {
        this._imagesResolver.scheduleImagesResolve(this._collector.toDOMCollection(a), Gridifier.ImagesResolver.OPERATIONS.INSERT_AFTER, {
            batchSize: c,
            batchTimeout: d,
            afterItem: b
        });
    } else {
        this.executeInsertAfter(a, b, c, d);
    }
    return this;
};

Gridifier.prototype.executeInsertAfter = function(a, b, c, d) {
    this._lifecycleCallbacks.executePreInsertCallbacks(a);
    var e = function() {
        this._operationsQueue.scheduleInsertAfterOperation(a, b, c, d);
    };
    var f = this;
    setTimeout(function() {
        e.call(f);
    }, Gridifier.REFLOW_OPTIMIZATION_TIMEOUT);
};

Gridifier.prototype.triggerRotate = function(a, b, c, d) {
    var e = this;
    this.setToggle(b);
    var f = this._collector.toDOMCollection(a);
    if (typeof c == "undefined") {
        this._renderer.rotateItems(f);
        return this;
    }
    this._operationsQueue.scheduleAsyncFnExecutionByBatches(f, c, d, function(a) {
        e._renderer.rotateItems(a);
    });
    return this;
};

Gridifier.prototype.retransformAllSizes = function() {
    this._normalizer.updateItemAntialiasValues();
    this._transformOperation.executeRetransformAllSizes();
    return this;
};

Gridifier.prototype.toggleSizes = function(a, b, c) {
    this._normalizer.updateItemAntialiasValues();
    this._transformOperation.schedule(this._toggleOperation.prepare(a, b, c, false));
    return this;
};

Gridifier.prototype.transformSizes = function(a, b, c) {
    this._normalizer.updateItemAntialiasValues();
    this._transformOperation.schedule(this._transformOperation.prepare(a, b, c, false));
    return this;
};

Gridifier.prototype.toggleSizesWithPaddingBottom = function(a, b, c) {
    this._normalizer.updateItemAntialiasValues();
    this._transformOperation.schedule(this._toggleOperation.prepare(a, b, c, true));
    return this;
};

Gridifier.prototype.transformSizesWithPaddingBottom = function(a, b, c) {
    this._normalizer.updateItemAntialiasValues();
    this._transformOperation.schedule(this._transformOperation.prepare(a, b, c, true));
    return this;
};

Gridifier.prototype.toggleResponsiveClasses = function(a, b) {
    var c = this._responsiveClassesManager.toggleResponsiveClasses(a, b);
    this._normalizer.updateItemAntialiasValues();
    this._transformOperation.executeRetransformFromFirstSortedConnection(c);
    return this;
};

Gridifier.prototype.addResponsiveClasses = function(a, b) {
    var c = this._responsiveClassesManager.addResponsiveClasses(a, b);
    this._normalizer.updateItemAntialiasValues();
    this._transformOperation.executeRetransformFromFirstSortedConnection(c);
    return this;
};

Gridifier.prototype.removeResponsiveClasses = function(a, b) {
    var c = this._responsiveClassesManager.removeResponsiveClasses(a, b);
    this._normalizer.updateItemAntialiasValues();
    this._transformOperation.executeRetransformFromFirstSortedConnection(c);
    return this;
};

Gridifier.prototype.bindDragifierEvents = function() {
    this._dragifier.bindDragifierEvents();
    return this;
};

Gridifier.prototype.unbindDragifierEvents = function() {
    this._dragifier.unbindDragifierEvents();
    return this;
};

Gridifier.prototype.isDragifierEnabled = function() {
    return this._dragifier.isDragifierEnabled();
};

Gridifier.prototype.isItemConnected = function(a) {
    return this._collector.isItemConnected(a);
};

Gridifier.prototype.addPreInsertLifecycleCallback = function(a) {
    this._lifecycleCallbacks.addPreInsertCallback(a);
    return this;
};

Gridifier.prototype.addPreDisconnectLifecycleCallback = function(a) {
    this._lifecycleCallbacks.addPreDisconnectCallback(a);
    return this;
};

Gridifier.prototype.setItemClonesManagerLifecycleCallbacks = function() {
    var a = this;
    this.addPreInsertLifecycleCallback(function(b) {
        for (var c = 0; c < b.length; c++) {
            a._itemClonesManager.createClone(b[c]);
        }
    });
    this.addPreDisconnectLifecycleCallback(function(b) {
        setTimeout(function() {
            for (var c = 0; c < b.length; c++) {
                a._itemClonesManager.destroyClone(b[c]);
            }
        }, a._settings.getToggleAnimationMsDuration());
    });
    return this;
};

Gridifier.prototype.getItemClonesManager = function() {
    return this._itemClonesManager;
};

Gridifier.prototype.hasItemBindedClone = function(a) {
    var b = this._collector.toDOMCollection(a);
    var a = b[0];
    return this._itemClonesManager.hasBindedClone(a);
};

Gridifier.prototype.isItemClone = function(a) {
    var b = this._collector.toDOMCollection(a);
    var a = b[0];
    return this._itemClonesManager.isItemClone(a);
};

Gridifier.prototype.getItemClone = function(a) {
    var b = this._collector.toDOMCollection(a);
    var a = b[0];
    if (!this._itemClonesManager.hasBindedClone(a)) new Error("Gridifier error: item has no binded clone.(Wrong item?). Item = ", a);
    return this._itemClonesManager.getBindedClone(a);
};

Gridifier.prototype.getOriginalItemFromClone = function(a) {
    var b = this._collector.toDOMCollection(a);
    var c = b[0];
    return this._itemClonesManager.getOriginalItemFromClone(c);
};

Gridifier.prototype.getConnectedItems = function() {
    var a = this._connections.get();
    var b = [];
    for (var c = 0; c < a.length; c++) b.push(a[c].item);
    return b;
};

Gridifier.prototype.hasConnectedItemAtPoint = function(a, b) {
    var c = this._itemClonesManager.getConnectionItemAtPoint(a, b);
    if (c == null) return false;
    return true;
};

Gridifier.prototype.getConnectedItemAtPoint = function(a, b) {
    return this._itemClonesManager.getConnectionItemAtPoint(a, b);
};

Gridifier.prototype.setToggle = Gridifier.prototype.toggleBy;

Gridifier.prototype.setSort = Gridifier.prototype.sortBy;

Gridifier.prototype.setFilter = Gridifier.prototype.filterBy;

Gridifier.prototype.collectNew = Gridifier.prototype.collectAllDisconnectedItems;

Gridifier.prototype.appendNew = function(a, b) {
    this.append(this.collectNew(), a, b);
    return this;
};

Gridifier.prototype.prependNew = function(a, b) {
    this.prepend(this.collectNew(), a, b);
    return this;
};

Gridifier.prototype.collectConnected = Gridifier.prototype.collectAllConnectedItems;

Gridifier.prototype.getForSilentRender = Gridifier.prototype.getScheduledForSilentRenderItems;

Gridifier.prototype.setAlign = Gridifier.prototype.setAlignmentType;

Gridifier.prototype.enableIntersections = Gridifier.prototype.setDefaultIntersectionStrategy;

Gridifier.prototype.disableIntersections = Gridifier.prototype.setNoIntersectionStrategy;

Gridifier.prototype.setToggleDuration = Gridifier.prototype.setToggleAnimationMsDuration;

Gridifier.prototype.setCoordsChangeDuration = Gridifier.prototype.setCoordsChangeAnimationMsDuration;

Gridifier.prototype.setItemWidthPtAntialias = Gridifier.prototype.setItemWidthPercentageAntialias;

Gridifier.prototype.setItemHeightPtAntialias = Gridifier.prototype.setItemHeightPercentageAntialias;

Gridifier.prototype.setWidthPxAntialias = Gridifier.prototype.setItemWidthPxAntialias;

Gridifier.prototype.setHeightPxAntialias = Gridifier.prototype.setItemHeightPxAntialias;

Gridifier.prototype.setWidthPtAntialias = Gridifier.prototype.setItemWidthPercentageAntialias;

Gridifier.prototype.setHeightPtAntialias = Gridifier.prototype.setItemHeightPercentageAntialias;

Gridifier.prototype.retransformGrid = Gridifier.prototype.retransformAllSizes;

Gridifier.prototype.setDragDecorator = Gridifier.prototype.setDraggableItemDecorator;

Gridifier.prototype.add = Gridifier.prototype.addToGrid;

Gridifier.prototype.enableDragifier = Gridifier.prototype.bindDragifierEvents;

Gridifier.prototype.disableDragifier = Gridifier.prototype.unbindDragifierEvents;

Gridifier.Api = {};

Gridifier.HorizontalGrid = {};

Gridifier.VerticalGrid = {};

Gridifier.Operations = {};

Gridifier.TransformerOperations = {};

Gridifier.SizesTransformer = {};

Gridifier.REFLOW_OPTIMIZATION_TIMEOUT = 0;

Gridifier.GRID_TYPES = {
    VERTICAL_GRID: "verticalGrid",
    HORIZONTAL_GRID: "horizontalGrid",
    VERTICAL_GRID_SHORT: "vertical",
    HORIZONTAL_GRID_SHORT: "horizontal"
};

Gridifier.PREPEND_TYPES = {
    MIRRORED_PREPEND: "mirroredPrepend",
    DEFAULT_PREPEND: "defaultPrepend",
    REVERSED_PREPEND: "reversedPrepend",
    MIRRORED_PREPEND_SHORT: "mirrored",
    DEFAULT_PREPEND_SHORT: "default",
    REVERSED_PREPEND_SHORT: "reversed"
};

Gridifier.APPEND_TYPES = {
    DEFAULT_APPEND: "defaultAppend",
    REVERSED_APPEND: "reversedAppend",
    DEFAULT_APPEND_SHORT: "default",
    REVERSED_APPEND_SHORT: "reversed"
};

Gridifier.INTERSECTION_STRATEGIES = {
    DEFAULT: "default",
    NO_INTERSECTIONS: "noIntersections",
    DEFAULT_SHORT: "yes",
    NO_INTERSECTIONS_SHORT: "no"
};

Gridifier.INTERSECTION_STRATEGY_ALIGNMENT_TYPES = {
    FOR_VERTICAL_GRID: {
        TOP: "top",
        CENTER: "center",
        BOTTOM: "bottom"
    },
    FOR_HORIZONTAL_GRID: {
        LEFT: "left",
        CENTER: "center",
        RIGHT: "right"
    }
};

Gridifier.SORT_DISPERSION_MODES = {
    DISABLED: "disabled",
    CUSTOM: "custom",
    CUSTOM_ALL_EMPTY_SPACE: "customAllEmptySpace",
    CUSTOM_ALL_EMPTY_SPACE_SHORT: "allGrid"
};

Gridifier.GRID_ITEM_MARKING_STRATEGIES = {
    BY_CLASS: "class",
    BY_DATA_ATTR: "data",
    BY_QUERY: "query"
};

Gridifier.GRID_ITEM_MARKING_DEFAULTS = {
    CLASS: "gridifier-item",
    DATA_ATTR: "data-gridifier-item",
    QUERY: "div > div"
};

Gridifier.DRAGIFIER_MODES = {
    INTERSECTION: "intersection",
    DISCRETIZATION: "discretization"
};

Gridifier.OPERATIONS = {
    PREPEND: 0,
    REVERSED_PREPEND: 1,
    APPEND: 2,
    REVERSED_APPEND: 3,
    MIRRORED_PREPEND: 4
};

Gridifier.DEFAULT_TOGGLE_ANIMATION_MS_DURATION = 500;

Gridifier.DEFAULT_COORDS_CHANGE_ANIMATION_MS_DURATION = 300;

Gridifier.DEFAULT_TOGGLE_TRANSITION_TIMING = "ease";

Gridifier.DEFAULT_COORDS_CHANGE_TRANSITION_TIMING = "ease";

Gridifier.DEFAULT_ROTATE_PERSPECTIVE = "200px";

Gridifier.DEFAULT_ROTATE_BACKFACE = true;

Gridifier.DEFAULT_ROTATE_ANGLES = {
    FRONT_FRAME_INIT: 0,
    BACK_FRAME_INIT: -180,
    FRONT_FRAME_TARGET: 180,
    BACK_FRAME_TARGET: 0
};

Gridifier.GRID_TRANSFORM_TYPES = {
    EXPAND: "expand",
    FIT: "fit",
    DISABLED: "disabled"
};

Gridifier.DEFAULT_GRID_TRANSFORM_TIMEOUT = 100;

Gridifier.RETRANSFORM_QUEUE_DEFAULT_BATCH_SIZE = 12;

Gridifier.RETRANSFORM_QUEUE_DEFAULT_BATCH_TIMEOUT = 25;