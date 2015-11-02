$(document).ready(function() {
    module("InsertOp");

    var tester = {
        _before: function() {
            ;
        },

        _after: function() {

        },

        runTests: function() {
            var me = this;

            test("all", function(assert) {
                var test = function(tests) {
                    me._before.call(me);

                    for(var i = 0; i < tests.length; i++)
                        me["_" + tests[i]].call(me, assert);

                    me._after.call(me);
                }

                test([
                    "exec",
                    "execInsertBA",
                    "getTargetItem",
                    "getTargetItemGuid",
                    "reposition"
                ]);
            });
        },

        _exec: function() {
            var data = {
                filterNotConnected: null,
                toNative: null,
                startCaching: false,
                stopCaching: false,
                ensureCanFit: null,
                add: [],
                scheduleResize: false,
                sort: null,
                filter: null,
                unmarked: [],
                evName: null,
                evItems: null,
                insertFnItems: []
            };
            gridItem = {
                filterNotConnected: function(item) {
                    data.filterNotConnected = item;
                    return item;
                },
                toNative: function(item) {
                    data.toNative = item;
                    return item;
                }
            };
            srManager = {
                startCachingTransaction: function() {
                    data.startCaching = true;
                },
                stopCachingTransaction: function() {
                    data.stopCaching = true;
                }
            };
            grid = {
                ensureCanFit: function(item) {
                    data.ensureCanFit = item;
                },
                add: function(item) {
                    data.add.push(item);
                },
                scheduleResize: function() { data.scheduleResize = true; }
            };
            collector = {
                unmarkAsNotCollectable: function(item) {
                    data.unmarked.push(item);
                },
                sort: function(items) {
                    data.sort = items;
                    return items;
                },
                filter: function(items) {
                    data.filter = items;
                    return items;
                }
            };
            ev = {
                emit: function(evName, items) {
                    data.evName = evName;
                    data.evItems = items;
                }
            };

            var insertOp = new InsertOp();
            var insertFn = function(item) {
                data.insertFnItems.push(item);
            };

            insertOp.exec([{id: 1}, {id: 2}], insertFn);

            ok(
                data.filterNotConnected.length == 2 &&
                data.toNative.length == 2 &&
                data.startCaching &&
                data.stopCaching &&
                data.ensureCanFit.length == 2 &&
                data.add[0].id == 1 &&
                data.add[1].id == 2 &&
                data.scheduleResize &&
                data.sort.length == 2 &&
                data.filter.length == 2 &&
                data.unmarked[0].id == 1 &&
                data.unmarked[1].id == 2 &&
                data.evName == EV.INSERT &&
                data.evItems.length == 2 &&
                data.insertFnItems[0].id == 1 &&
                data.insertFnItems[1].id == 2,
                "exec ok"
            );

            clearTestData();
        },

        _execInsertBA: function(assert) {
            var getGridItemData = function() {
                return {
                    filtered: null, native: null
                };
            };
            var getData = function() {
                return {
                    insertFnItems: null,
                    sortedItems: null
                };
            };
            var getTargetItemData = function() {
                return {
                    cns: null,
                    getIndex: null,
                    spliceCns: null,
                    cns2: null,
                    rpsCns: null
                };
            };
            var getRepositionData = function() {
                return {
                    cns: null,
                    items: null,
                    targetItemGuid: null,
                    insertFn: null,
                    rev: null,
                    rpsFn: null
                };
            };
            var gridItemData = getGridItemData();
            var data = getData();
            var targetItemData = getTargetItemData();
            var repositionData = getRepositionData();

            gridItem = {
                toNative: function(items) {
                    gridItemData.native = items;
                    return items;
                },
                filterNotConnected: function(items) {
                    gridItemData.filtered = items;
                    return items;
                }
            };
            cnsSorter = {
                sortForReappend: function(cns) {
                    data.sortedItems = cns;
                    return cns;
                }
            };
            connections = {
                get: function() { return []; }
            };

            var insertFn = function(items) {
                data.insertFnItems = items;
            };
            var insertOp = new InsertOp();
            insertOp._reposition = function(cns, items, targetItemGuid, insertFn, rev, rpsFn) {
                repositionData.cns = cns;
                repositionData.items = items;
                repositionData.targetItemGuid = targetItemGuid;
                repositionData.insertFn = insertFn;
                repositionData.rev = rev;
                repositionData.rpsFn = rpsFn;
            };
            insertOp._getTargetItem = function(targetItem, cns, getIndex) {
                targetItemData.cns = cns;
                targetItemData.getIndex = getIndex;
                return targetItem;
            };
            insertOp._getTargetItemGuid = function(targetItem, spliceCns, cns, cnsToRps) {
                targetItemData.spliceCns = spliceCns;
                targetItemData.cns2 = cns;
                targetItemData.rpsCns = cnsToRps;
                return targetItem;
            };

            insertOp.execInsertBA([], null, insertFn);
            ok(data.insertFnItems == null && repositionData.insertFn == null, "call without items ok");

            insertOp.execInsertBA([{id: 1}, {id: 2}], null, insertFn);
            ok(
                gridItemData.filtered.length == 2 &&
                gridItemData.native.length == 2 &&
                data.insertFnItems[0].id == 1 &&
                data.insertFnItems[1].id == 2 &&
                repositionData.insertFn == null,
                "call with no cns ok"
            );

            connections = {get: function() { return "cns"; }};
            assert.throws(
                function() { insertOp.execInsertBA([{id: 1}, {id: 2}], null, insertFn); },
                /wrong insertBefore(.*)After targetItem/,
                "call with returned target item guid eq null ok"
            );

            insertOp.execInsertBA(
                [{id: 1}, {id: 2}],
                {id: 3},
                "insertFn",
                "getIndex",
                "spliceCns",
                "rev",
                "rpsFn"
            );
            var dataOk = (data.sortedItems == "cns");
            var targetItemDataOk = (targetItemData.cns == "cns" &&
                                    targetItemData.getIndex == "getIndex" &&
                                    targetItemData.spliceCns == "spliceCns" &&
                                    targetItemData.cns2 == "cns" &&
                                    Dom.isArray(targetItemData.rpsCns) &&
                                    targetItemData.rpsCns.length == 0);
            var repositionDataOk = (repositionData.items.length == 2 &&
                                    repositionData.items[0].id == 1 &&
                                    repositionData.items[1].id == 2 &&
                                    repositionData.targetItemGuid.id == 3 &&
                                    repositionData.insertFn == "insertFn" &&
                                    repositionData.rev == "rev" &&
                                    repositionData.rpsFn == "rpsFn");

            ok(dataOk && targetItemDataOk && repositionDataOk, "call ok");

            clearTestData();
        },

        _getTargetItem: function() {
            gridItem = {
                toNative: function(item) {
                    if(item.id == 1) return [item.id];
                    if(item.id == null) return [null];
                    if(item.id == "undefined") return [undefined];
                    return null;
                }
            };

            var getIndex = function(cns) {
                return 0;
            };
            var insertOp = new InsertOp();

            var target = insertOp._getTargetItem(undefined, [{item: 1}, {item: 2}], getIndex);
            ok(target == 1, "getTargetItem with undefined target ok");

            var target = insertOp._getTargetItem(null, [{item: 1}, {item: 2}], getIndex);
            ok(target == 1, "getTargetItem with null target ok");

            var target = insertOp._getTargetItem({id: 1}, [{item: 1}, {item: 2}], getIndex);
            ok(target == 1, "getTargetItem ok");

            var target = insertOp._getTargetItem({id: null}, [{item: 1}, {item: 2}], getIndex);
            ok(target == 1, "getTargetItem with toNative eq null ok");

            var target = insertOp._getTargetItem({id: undefined}, [{item: 1}, {item: 2}], getIndex);
            ok(target == 1, "getTargetItem with toNative eq undefined ok");

            clearTestData();
        },

        _getTargetItemGuid: function() {
            guid = {
                get: function(item) {
                    return item.id;
                }
            };
            var spliceCns = function(cns, i) {
                return [cns[i]];
            };

            var insertOp = new InsertOp();
            var cns = [{item: {id: 2}, itemGUID: 2}, {item: {id: 4}, itemGUID: 4}];
            var cnsToRps = [];
            var targetItemGuid = insertOp._getTargetItemGuid({id: 4}, spliceCns, cns, cnsToRps);

            ok(
                targetItemGuid == 4 &&
                cnsToRps.length == 1 &&
                cnsToRps[0].itemGUID == 4,
                "getTargetItemGuid ok"
            );

            clearTestData();
        },

        _reposition: function() {
            ev = new EventEmitter();
            settings = new Settings();

            var data = {
                rangesReinited: false,
                maxGuid: null,
                appendCalled: false,
                revAppendCalled: false,
                insertFnItems: null,
                restore: null,
                restoreOnSd: null,
                remapAllGuidsIn: null,
                remapAllGuids: false,
                rpsFn: false
            };

            connections = {
                reinitRanges: function() {
                    data.rangesReinited = true;
                },
                restore: function(cns) {
                    data.restore = cns;
                },
                restoreOnSortDispersion: function(cns) {
                    data.restoreOnSd = cns;
                }
            };
            cnsCore = {
                remapGUIDSIn: function(cns) {
                    data.remapAllGuidsIn = cns;
                },
                remapAllGUIDS: function() {
                    data.remapAllGuids = true;
                }
            };
            guid = {
                reinitMax: function(val) {
                    data.maxGuid = val;
                }
            };
            appender = {recreateCrs: function() { data.appendCalled = true; }};
            reversedAppender = {recreateCrs: function() { data.revAppendCalled = true; }};

            var insertFn = function(items) {
                data.insertFnItems = items;
            };
            var rpsFn = function(cns) {
                if(cns == "cns") data.rpsFn = true;
            };

            var insertOp = new InsertOp();

            insertOp._reposition("cns", "items", 10, insertFn, 1, rpsFn);
            ok(
                data.rangesReinited &&
                data.maxGuid == 11 &&
                data.appendCalled &&
                data.insertFnItems == "items" &&
                data.restore == "cns" &&
                data.remapAllGuidsIn == "cns" &&
                data.rpsFn,
                "reposition on def app sd eq false ok"
            );

            sourceSettings = {"append": "reversed", sortDispersion: true};
            settings = new Settings();

            data.rpsFn = false;
            insertOp._reposition("cns", "items", 10, insertFn, -1, rpsFn);
            ok(
                data.maxGuid == 9 &&
                data.revAppendCalled &&
                data.restoreOnSd == "cns" &&
                data.remapAllGuids &&
                data.rpsFn,
                "reposition on rev app sd eq true ok"
            );

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});