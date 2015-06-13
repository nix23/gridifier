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

/* You can define your custom sorts and retransform sorts in this class.
 * Read about custom builds at http://gridifier.io/essentials/install
 * Read about sorts at http://gridifier.io/sortings/sorts
 * Read about retransform sorts at http://gridifier.io/sortings/retransform-sorts
 */
Gridifier.Api.Sort = function(settings, gridifier, eventEmitter) {
    var me = this;

    this._settings = null;
    this._gridifier = null;
    this._eventEmitter = null;

    this._sortComparatorTools = null;

    this._sortFunction = null;
    this._sortFunctions = {};

    this._areRetransformFunctionsCreated = false;

    this._retransformSortFunction = null;
    this._retransformSortFunctions = {};
    this._retransformSortGridRefreshTimeout = null;

    this._css = {
    };

    this._construct = function() {
        me._settings = settings;
        me._gridifier = gridifier;
        me._eventEmitter = eventEmitter;

        me._sortFunctions = {};

        me._addDefaultSort();
        // Call register function per each sort here
        // me._addCustomSort();

        me._addDefaultRetransformSort();
        // Call register function per each retransform sort here
        // me._addCustomRetransformSort();
    };

    this._bindEvents = function() {
    };

    this._unbindEvents = function() {
    };

    this.destruct = function() {
        me._unbindEvents();
    };

    this._construct();
    return this;
}

Gridifier.Api.Sort.prototype.getSortComparatorTools = function() {
    if(this._sortComparatorTools == null) {
        var applyReplacers = function(value, replacers) {
            for(var i = 0; i < replacers.length; i++)
                value = value.replace(replacers[i][0], replacers[i][1]);

            return value;
        }

        this._sortComparatorTools = {
            comparatorFns: {
                byData: function(item, comparatorParam, replacers) {
                    var value = item.getAttribute(comparatorParam);
                    return (!replacers) ? value : applyReplacers(value, replacers);
                },
                byDataInt: function(item, comparatorParam, replacers) {
                    var value = item.getAttribute(comparatorParam);
                    return (!replacers) ? Dom.toInt(value) : Dom.toInt(applyReplacers(value, replacers));
                },
                byDataFloat: function(item, comparatorParam, replacers) {
                    var value = item.getAttribute(comparatorParam);
                    return (!replacers) ? parseFloat(value) : parseFloat(applyReplacers(value, replacers));
                },
                byContent: function(item, comparatorParam, replacers) {
                    var value = item.innerHTML;
                    return (!replacers) ? value : applyReplacers(value, replacers);
                },
                byContentInt: function(item, comparatorParam, replacers) {
                    var value = item.innerHTML;
                    return (!replacers) ? Dom.toInt(value) : Dom.toInt(applyReplacers(value, replacers));
                },
                byContentFloat: function(item, comparatorParam, replacers) {
                    var value = item.innerHTML;
                    return (!replacers) ? parseFloat(value) : parseFloat(applyReplacers(value, replacers));
                },
                byQuery: function(item, comparatorParam, replacers) {
                    var value = Dom.get.byQuery(item, comparatorParam)[0].innerHTML;
                    return (!replacers) ? value : applyReplacers(value, replacers);
                },
                byQueryInt: function(item, comparatorParam, replacers) {
                    var value = Dom.get.byQuery(item, comparatorParam)[0].innerHTML;
                    return (!replacers) ? Dom.toInt(value) : Dom.toInt(applyReplacers(value, replacers));
                },
                byQueryFloat: function(item, comparatorParam, replacers) {
                    var value = Dom.get.byQuery(item, comparatorParam)[0].innerHTML;
                    return (!replacers) ? parseFloat(value) : parseFloat(applyReplacers(value, replacers));
                }
            },

            saveOriginalOrder: function(items) {
                for(var i = 0; i < items.length; i++) {
                    items[i].setAttribute(Gridifier.Collector.ITEM_SORTING_INDEX_DATA_ATTR, i + 1);
                }
            },

            flushOriginalOrder: function(items) {
                for(var i = 0; i < items.length; i++) {
                    items[i].removeAttribute(Gridifier.Collector.ITEM_SORTING_INDEX_DATA_ATTR);
                }
            },

            byOriginalPos: function(firstItem, secondItem) {
                var firstItemOriginalPos = firstItem.getAttribute(Gridifier.Collector.ITEM_SORTING_INDEX_DATA_ATTR);
                var secondItemOriginalPos = secondItem.getAttribute(Gridifier.Collector.ITEM_SORTING_INDEX_DATA_ATTR);

                if(Dom.toInt(firstItemOriginalPos) > Dom.toInt(secondItemOriginalPos))
                    return 1;
                else if(Dom.toInt(firstItemOriginalPos) < Dom.toInt(secondItemOriginalPos))
                    return -1;
            },

            byComparator: function(firstItemComparator, secondItemComparator, reverseOrder) {
                var orderReverser = (reverseOrder) ? -1 : 1;

                if(firstItemComparator > secondItemComparator)
                    return 1 * orderReverser;
                else if(firstItemComparator < secondItemComparator)
                    return -1 * orderReverser;

                return 0;
            },

            byMultipleComparators: function(firstItem, secondItem, comparators) {
                for(var i = 0; i < comparators.length; i++) {
                    var result = this.byComparator(
                        comparators[i].forFirstItem, comparators[i].forSecondItem, comparators[i].reverseOrder
                    );
                    if(result == 0) {
                        if(i == comparators.length - 1)
                            return this.byOriginalPos(firstItem, secondItem);

                        continue;
                    }

                    return result;
                }
            },

            buildComparators: function(firstItem,
                                       secondItem,
                                       comparatorGetterFn,
                                       comparatorParam,
                                       comparatorParamReplacers,
                                       reverseOrder) {
                if(typeof comparatorParam == "undefined")
                    throw new Error("Gridifier error: sort comparator param is undefined.");

                if(!Dom.isArray(comparatorParam)) {
                    var comparatorParams = [[comparatorParam, reverseOrder]];
                }
                else {
                    var comparatorParams = [];
                    for(var i = 0; i < comparatorParam.length; i++) {
                        var reverseOrder = false;
                        if(comparatorParam[i].indexOf("|desc") !== -1) {
                            reverseOrder = true;
                            comparatorParam[i] = comparatorParam[i].replace("|desc", "");
                        }

                        comparatorParams.push([comparatorParam[i], reverseOrder]);
                    }
                }

                var comparators = [];
                for(var i = 0; i < comparatorParams.length; i++) {
                    comparators.push({
                        forFirstItem: comparatorGetterFn(
                            firstItem, comparatorParams[i][0], comparatorParamReplacers
                        ),
                        forSecondItem: comparatorGetterFn(
                            secondItem, comparatorParams[i][0], comparatorParamReplacers
                        ),
                        reverseOrder: comparatorParams[i][1]
                    });
                }

                return comparators;
            },

            sortBy: function(firstItem,
                             secondItem,
                             comparatorGetterFn,
                             comparatorParam,
                             reverseOrder,
                             comparatorParamReplacers) {
                return this.byMultipleComparators(
                    firstItem,
                    secondItem,
                    this.buildComparators(
                        firstItem,
                        secondItem,
                        comparatorGetterFn,
                        comparatorParam,
                        comparatorParamReplacers || false,
                        reverseOrder || false
                    )
                );
            },

            byData: function(firstItem, secondItem, dataAttr, reverseOrder, replacers) {
                return this.sortBy(firstItem, secondItem, this.comparatorFns.byData, dataAttr, reverseOrder, replacers);
            },

            byDataInt: function(firstItem, secondItem, dataAttr, reverseOrder, replacers) {
                return this.sortBy(firstItem, secondItem, this.comparatorFns.byDataInt, dataAttr, reverseOrder, replacers);
            },

            byDataFloat: function(firstItem, secondItem, dataAttr, reverseOrder, replacers) {
                return this.sortBy(firstItem, secondItem, this.comparatorFns.byDataFloat, dataAttr, reverseOrder, replacers);
            },

            byContent: function(firstItem, secondItem, reverseOrder, replacers) {
                return this.sortBy(firstItem, secondItem, this.comparatorFns.byContent, null, reverseOrder, replacers);
            },

            byContentInt: function(firstItem, secondItem, reverseOrder, replacers) {
                return this.sortBy(firstItem, secondItem, this.comparatorFns.byContentInt, null, reverseOrder, replacers);
            },

            byContentFloat: function(firstItem, secondItem, reverseOrder, replacers) {
                return this.sortBy(firstItem, secondItem, this.comparatorFns.byContentFloat, null, reverseOrder, replacers);
            },

            byQuery: function(firstItem, secondItem, selector, reverseOrder, replacers) {
                return this.sortBy(firstItem, secondItem, this.comparatorFns.byQuery, selector, reverseOrder, replacers);
            },

            byQueryInt: function(firstItem, secondItem, selector, reverseOrder, replacers) {
                return this.sortBy(firstItem, secondItem, this.comparatorFns.byQueryInt, selector, reverseOrder, replacers);
            },

            byQueryFloat: function(firstItem, secondItem, selector, reverseOrder, replacers) {
                return this.sortBy(firstItem, secondItem, this.comparatorFns.byQueryFloat, selector, reverseOrder, replacers);
            }
        };
    }

    return this._sortComparatorTools;
}

Gridifier.Api.Sort.prototype.setSortFunction = function(sortFunctionName) {
    if(!this._sortFunctions.hasOwnProperty(sortFunctionName)) {
        new Gridifier.Error(
            Gridifier.Error.ERROR_TYPES.SETTINGS.SET_SORT_INVALID_PARAM,
            sortFunctionName
        );
        return;
    }

    this._sortFunction = this._sortFunctions[sortFunctionName];
}

Gridifier.Api.Sort.prototype.addSortFunction = function(sortFunctionName, sortFunction) {
    this._sortFunctions[sortFunctionName] = sortFunction;
}

Gridifier.Api.Sort.prototype.getSortFunction = function() {
    return this._sortFunction;
}

Gridifier.Api.Sort.prototype._addDefaultSort = function() {
    this._sortFunctions["default"] = function(firstItem, secondItem) {
        var firstItemSortNumber = firstItem.getAttribute(Gridifier.Collector.ITEM_SORTING_INDEX_DATA_ATTR);
        var secondItemSortNumber = secondItem.getAttribute(Gridifier.Collector.ITEM_SORTING_INDEX_DATA_ATTR);

        return parseInt(firstItemSortNumber, 10) - parseInt(secondItemSortNumber, 10);
    };
}

//Custom sort
//Gridifier.Api.Sort.prototype._addCustomSort = function() {
//    this._sortFunctions.customSort = function(first, second, sort) {
//        // return sort comparator result here
//        // never return 0 from this function(sorts are unstable in most browsers)
//    }
//}

Gridifier.Api.Sort.RETRANSFORM_SORT_GRID_REFRESH_TIMEOUT = 20;

Gridifier.Api.Sort.prototype.setRetransformSortFunction = function(retransformSortFunctionName) {
    var me = this;

    if(retransformSortFunctionName != "default") {
        this._createRetransformSortFunctions();
    }

    if(!this._retransformSortFunctions.hasOwnProperty(retransformSortFunctionName)) {
        new Gridifier.Error(
            Gridifier.Error.ERROR_TYPES.SETTINGS.SET_RETRANSFORM_SORT_INVALID_PARAM,
            retransformSortFunctionName
        );
        return;
    }

    // Don't change default retransform sorter. Otherwise unnecessary
    // grid retransforms will be triggered
    if(retransformSortFunctionName == "default") {
        this._eventEmitter.onBeforeShowPerRetransformSorter(null);
    }
    else {
        this._eventEmitter.onBeforeShowPerRetransformSorter(function() {
            if(me._retransformSortGridRefreshTimeout != null) {
                clearTimeout(me._retransformSortGridRefreshTimeout);
                me._retransformSortGridRefreshTimeout = null;
            }

            me._retransformSortGridRefreshTimeout = setTimeout(function() {
                if(me._settings.hasCustomRepackSize()) {
                    var repackSize = me._settings.getCustomRepackSize();
                    var items = me._gridifier.getAll();

                    if(items.length < repackSize)
                        me._gridifier.triggerResize();
                    else {
                        var retransformStartItem = items[items.length - repackSize];
                        var transformOperation = me._gridifier.getTransformOperation();
                        transformOperation.executeRetransformFromFirstSortedConnection([retransformStartItem]);
                    }
                }
                else {
                    me._gridifier.triggerResize();
                }
            }, Gridifier.Api.Sort.RETRANSFORM_SORT_GRID_REFRESH_TIMEOUT);
        });
    }

    this._retransformSortFunction = this._retransformSortFunctions[retransformSortFunctionName];
}

Gridifier.Api.Sort.prototype._createRetransformSortFunctions = function() {
    if(this._areRetransformSortFunctionsCreated)
        return;

    this._areRetransformSortFunctionsCreated = true;
    this._addBySizesRetransformSort();
}

Gridifier.Api.Sort.prototype.addRetransformSortFunction = function(retransformSortFunctionName, retransformSortFunction) {
    this._retransformSortFunctions[retransformSortFunctionName] = retransformSortFunction;
}

Gridifier.Api.Sort.prototype.getRetransformSortFunction = function() {
    return this._retransformSortFunction;
}

Gridifier.Api.Sort.prototype._addDefaultRetransformSort = function() {
    this._retransformSortFunctions["default"] = function(connections) {
        return connections;
    };
}

//Custom retransform sort
//Gridifier.Api.Sort.prototype._addCustomRetransformSort = function() {
//    this._retransformSortFunctions.customRetransformSort = function(connections) {
//        // sort connections here
//        // each connections array entry has x1, y1, x2, y2 coords available
//         return connections;
//    }
//}

Gridifier.Api.Sort.RETRANSFORM_SORT_SINGLE_BATCH_MARKER = 100000;

Gridifier.Api.Sort.prototype._addBySizesRetransformSort = function() {
    var me = this;

    var calculateAreaPerEachConnection = function(connections) {
        for(var i = 0; i < connections.length; i++) {
            var connectionWidth = Math.abs(connections[i].x2 - connections[i].x1) + 1;
            var connectionHeight = Math.abs(connections[i].y2 - connections[i].y1) + 1;
            var connectionArea = Math.round(connectionWidth * connectionHeight);
            connections[i].area = connectionArea;

            if(connectionWidth >= connectionHeight)
                connections[i].isLandscape = true;
            else
                connections[i].isLandscape = false;
        }
    }

    var packConnectionsByAreas = function(connections) {
        var areasWithConnections = [];
        for(var i = 0; i < connections.length; i++) {
            var connectionArea = connections[i].area;

            var wasAddedToExistingArea = false;
            for(var j = 0; j < areasWithConnections.length; j++) {
                if(areasWithConnections[j].area == connectionArea) {
                    areasWithConnections[j].connections.push(connections[i]);
                    wasAddedToExistingArea = true;
                    break;
                }
            }

            if(!wasAddedToExistingArea) {
                areasWithConnections.push({
                    area: connectionArea,
                    connections: [connections[i]]
                });
            }
        }

        return areasWithConnections;
    }

    var packConnectionsByOrientation = function(connections) {
        var areasWithConnections = [
            {area: "landscape", connections: []},
            {area: "portrait", connections: []}
        ];
        for(var i = 0; i < connections.length; i++) {
            if(connections[i].isLandscape)
                areasWithConnections[0].connections.push(connections[i]);
            else if(!connections[i].isLandscape)
                areasWithConnections[1].connections.push(connections[i]);
        }

        return areasWithConnections;
    }

    var sortEvenly = function(connections, itemsCountFromFirstGroup, packByOrientation) {
        packByOrientation = packByOrientation || false;

        if(!packByOrientation) {
            var areasWithConnections = packConnectionsByAreas(connections);
            // Stable sort here(All areas are unique). (Desc)
            areasWithConnections.sort(function(firstConnection, secondConnection) {
                return parseFloat(firstConnection.area) - parseFloat(secondConnection).area;
            });
        }
        else {
            var areasWithConnections = packConnectionsByOrientation(connections);
        }

        var sortedConnections = [];
        var allEmpty = false;
        while(!allEmpty) {
            var noChanges = true;
            for(var i = 0; i < areasWithConnections.length; i++) {
                if(areasWithConnections[i].connections.length != 0) {
                    if(i == 0) {
                        for(var j = 0; j < itemsCountFromFirstGroup; j++) {
                            if(areasWithConnections[i].connections.length != 0)
                                sortedConnections.push(areasWithConnections[i].connections.shift());
                        }
                    }
                    else {
                        sortedConnections.push(areasWithConnections[i].connections.shift());
                    }
                    noChanges = false;
                }
            }

            if(noChanges)
                allEmpty = true;
        }

        return sortedConnections;
    }

    var markConnectionPositions = function(connections) {
        var nextPosition = 0;
        for(var i = 0; i < connections.length; i++) {
            nextPosition++;
            connections[i].retransformSortPosition = nextPosition;
        }
    }

    var packConnectionsToBatches = function(connections, itemsCountInBatch) {
        var connectionBatches = [];
        var nextBatch = [];
        for(var i = 0; i < connections.length; i++) {
            nextBatch.push(connections[i]);
            if((i + 1) % itemsCountInBatch == 0) {
                connectionBatches.push(nextBatch);
                nextBatch = [];
            }
        }
        if(nextBatch.length != 0)
            connectionBatches.push(nextBatch);

        return connectionBatches;
    }

    var batchesToConnections = function(connections, connectionBatches) {
        connections.splice(0, connections.length);
        for(var i = 0; i < connectionBatches.length; i++) {
            for(var j = 0; j < connectionBatches[i].length; j++) {
                connections.push(connectionBatches[i][j]);
            }
        }

        return connections;
    }

    var createByAreaEvenlyRetransformSort = function(batchSize, itemsCountInFirstGroup) {
        return function(connections) {
            calculateAreaPerEachConnection(connections);
            markConnectionPositions(connections);
            var connectionBatches = packConnectionsToBatches(connections, batchSize);

            for(var i = 0; i < connectionBatches.length; i++)
                connectionBatches[i] = sortEvenly(connectionBatches[i], itemsCountInFirstGroup);

            return batchesToConnections(connections, connectionBatches);
        }
    }

    this._retransformSortFunctions["areaEvenly"] = createByAreaEvenlyRetransformSort(
        Gridifier.Api.Sort.RETRANSFORM_SORT_SINGLE_BATCH_MARKER, 1
    );

    var singleBatchMarker = Gridifier.Api.Sort.RETRANSFORM_SORT_SINGLE_BATCH_MARKER;
    var evenlySorts = [
        ["areaEvenlyAll-2", singleBatchMarker, 2],
        ["areaEvenlyAll-3", singleBatchMarker, 3],
        ["areaEvenlyAll-4", singleBatchMarker, 4],
        ["areaEvenlyAll-5", singleBatchMarker, 5]
    ];

    for(var i = 5; i <= 50; i += 5) {
        for(var j = 1; j <= 5; j++) {
            evenlySorts.push(["areaEvenly" + i + "-" + j, i, j]);
        }
    }

    for(var i = 0; i < evenlySorts.length; i++) {
        this._retransformSortFunctions[evenlySorts[i][0]] = createByAreaEvenlyRetransformSort(
            evenlySorts[i][1], evenlySorts[i][2]
        );
    }

    var createByAreaOrderedRetransformSort = function(reverseOrder) {
        if(reverseOrder)
            var reversor = -1;
        else
            var reversor = 1;

        return function(connections) {
            calculateAreaPerEachConnection(connections);
            markConnectionPositions(connections);
            var connectionBatches = packConnectionsToBatches(connections, Gridifier.Api.Sort.RETRANSFORM_SORT_SINGLE_BATCH_MARKER);

            for(var i = 0; i < connectionBatches.length; i++) {
                connectionBatches[i].sort(function(firstConnection, secondConnection) {
                    if(firstConnection.area > secondConnection.area)
                        return -1 * reversor;
                    else if(firstConnection.area < secondConnection.area)
                        return 1 * reversor;
                    else
                        return firstConnection.retransformSortPosition - secondConnection.retransformSortPosition;
                });
            }

            return batchesToConnections(connections, connectionBatches);
        }
    }

    this._retransformSortFunctions["areaDesc"] = createByAreaOrderedRetransformSort(false);
    this._retransformSortFunctions["areaAsc"] = createByAreaOrderedRetransformSort(true);

    this._retransformSortFunctions["orientationEvenly"] = function(connections) {
        calculateAreaPerEachConnection(connections);
        markConnectionPositions(connections);
        var connectionBatches = packConnectionsToBatches(connections, Gridifier.Api.Sort.RETRANSFORM_SORT_SINGLE_BATCH_MARKER);

        for(var i = 0; i < connectionBatches.length; i++)
            connectionBatches[i] = sortEvenly(connectionBatches[i], 1, true);

        return batchesToConnections(connections, connectionBatches);
    }
}