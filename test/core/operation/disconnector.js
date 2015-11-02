$(document).ready(function() {
    module("Disconnector");

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
                    "callDisconnect",
                    "callPop",
                    "callShift",
                    "disconnectAllSoft",
                    "disconnectNotAllHard",
                    "findCnsToDisc",
                    "recreateCrs",
                    "scheduleRender"
                ]);
            });
        },

        _callDisconnect: function(assert) {
            var wasReposSynced = false;
            var wereAllReposed = false;
            var wasHard = false;
            var itemsCount = 0;
            var result = null;

            var initFn = function() {
                ev = new EventEmitter();
                gridItem = new Item();
                guid = new GUID();
                settings = new Settings();
                reposition = {
                    sync: function() { wasReposSynced = true; },
                    all: function() { wereAllReposed = true; }
                };

                var items = [Dom.div(), Dom.div(), Dom.div()];
                for(var i = 0; i < items.length; i++) {
                    gridItem.markAsConnected(items[i]);
                    guid.markForAppend(items[i]);
                }

                disconnector = new Disconnector();
                disconnector.disconnect = function(items, discType) {
                    wasHard = (discType == C.DISC_TYPES.HARD);
                    itemsCount = items.length;
                }

                result = gridifier.disconnect(items);
            };
            var checkFn = function() {
                ok(result == gridifier && wasReposSynced && wereAllReposed &&
                   itemsCount == 3 && wasHard,
                   "disconnect call ok");
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        },

        _callPop: function() {
            var disconnector = new Disconnector();
            gridifier.first = function() { return null; };
            ok(gridifier.pop() == null, "call pop with no items ok");

            var fakeItem = {wasCalled: false};
            gridifier.first = function() { return fakeItem; };
            gridifier.disconnect = function(item) { item.wasCalled = true; };

            ok(gridifier.pop().wasCalled, "call pop ok");
        },

        _callShift: function() {
            var disconnector = new Disconnector();
            gridifier.last = function() { return null; }
            ok(gridifier.shift() == null, "call shift with no items ok");

            var fakeItem = {wasCalled: false};
            gridifier.last = function() { return fakeItem; };
            gridifier.disconnect = function(item) { item.wasCalled = true; };

            ok(gridifier.shift().wasCalled, "call shift ok");
        },

        _disconnectAllSoft: function() {
            ev = new EventEmitter();
            gridItem = new Item();
            guid = new GUID();
            settings = new Settings();
            cnsCore = new CnsCore();
            cnsSorter = new CnsSorter();
            connections = new VgConnections();

            var items = [Dom.div(), Dom.div(), Dom.div()];
            for(var i = 0; i < items.length; i++) {
                gridItem.markAsConnected(items[i]);
                guid.markForAppend(items[i]);
                connections.add(items[i], {x1: 0, x2: 0, y1: 0, y2: 0});
            }

            var disconnector = new Disconnector();

            var wereCrsRecreated = false;
            var wereRangesReinited = false;
            var scheduledCnsCount = 0;
            disconnector._recreateCrs = function() { wereCrsRecreated = true; };
            disconnector._scheduleRender = function(cns) { scheduledCnsCount += cns.length; };
            connections.reinitRanges = function() { wereRangesReinited = true; };

            disconnector.disconnect(items);
            var cns = connections.get();
            ok(cns.length == 0 && items[0].getAttribute(C.GUID_DATA) == null &&
               wereCrsRecreated && wereRangesReinited && scheduledCnsCount == 3 &&
               !gridItem.isConnected(items[0]) && !gridItem.isConnected(items[2]),
               "disconnect all items with soft disconnect ok");

            clearTestData();
        },

        _disconnectNotAllHard: function() {
            ev = new EventEmitter();
            gridItem = new Item();
            guid = new GUID();
            settings = new Settings();
            cnsCore = new CnsCore();
            cnsSorter = new CnsSorter();
            connections = new VgConnections();
            collector = new Collector();

            var items = [Dom.div(), Dom.div(), Dom.div()];
            for(var i = 0; i < items.length; i++) {
                gridItem.markAsConnected(items[i]);
                guid.markForAppend(items[i]);
                connections.add(items[i], {x1: 0, x2: 0, y1: 0, y2: 0});
            }

            var disconnector = new Disconnector();

            var wereCrsRecreated = false;
            var wereRangesReinited = false;
            var scheduledCnsCount = 0;
            disconnector._recreateCrs = function() { wereCrsRecreated = true; };
            disconnector._scheduleRender = function(cns) { scheduledCnsCount += cns.length; };
            connections.reinitRanges = function() { wereRangesReinited = true; };

            disconnector.disconnect([items[0], items[1]], C.DISC_TYPES.HARD);
            var cns = connections.get();
            ok(cns.length == 1 && items[0].getAttribute(C.GUID_DATA) == null &&
                !wereCrsRecreated && wereRangesReinited && scheduledCnsCount == 2 &&
                !gridItem.isConnected(items[0]) && !gridItem.isConnected(items[1]) &&
                collector.isNotCollectable(items[0]) && collector.isNotCollectable(items[1]),
                "disconnect not all items with hard disconnect ok");

            clearTestData();
        },

        _findCnsToDisc: function() {
            var cnsMock = [
                {x1: 0, x2: 19, y1: 0, y2: 19, item: {style: {zIndex: 1}}, itemGUID: 4},
                {x1: 0, x2: 9, y1: 0, y2: 9, item: {style: {zIndex: 1}}, itemGUID: 2},
                {x1: 0, x2: 19, y1: 0, y2: 19, item: {style: {zIndex: 1}}, itemGUID: 1},
                {x1: 0, x2: 9, y1: 0, y2: 9, item: {style: {zIndex: 1}}, itemGUID: 3}
            ];
            for(var i = 0; i < cnsMock.length; i++) {
                (function(item, itemGUID) {
                    item.getAttribute = function() { return Dom.int(itemGUID); };
                })(cnsMock[i].item, cnsMock[i].itemGUID);
            }
            var nextCn = -1;

            guid = new GUID();
            cnsCore = {find: function(item) { return cnsMock[++nextCn]; }};
            var fakeItems = ["fake1", "fake2", "fake3", "fake4"];
            cnsSorter = new CnsSorter();
            settings = new Settings();

            var disconnector = new Disconnector();
            var cns = disconnector._findCnsToDisc(fakeItems);
            ok(cns[0].itemGUID == 1 && cns[1].itemGUID == 2 && cns[2].itemGUID == 3 &&
               cns[3].itemGUID == 4,
               "findCnsToDisc cns ok");

            clearTestData();
        },

        _recreateCrs: function() {
            var wereCrsFlushed = false;
            var wereInitCrRecreated = false;
            connectors = {flush: function() { wereCrsFlushed = true; }};
            appender = {createInitialCr: function() { wereInitCrRecreated = true; }};

            ev = new EventEmitter();
            settings = new Settings();
            var disconnector = new Disconnector();
            disconnector._recreateCrs();
            ok(wereCrsFlushed && wereInitCrRecreated, "recreateCrs on default append ok");

            wereCrsFlushed = false;
            wereInitCrRecreated = false;
            reversedAppender = {createInitialCr: function() { wereInitCrRecreated = true; }};

            sourceSettings = {append: "reversed"};
            settings = new Settings();
            var disconnector = new Disconnector();
            disconnector._recreateCrs();
            ok(wereCrsFlushed && wereInitCrRecreated, "recreateCrs on reversed append ok");

            clearTestData();
        },

        _scheduleRender: function(assert) {
            var hiddenCnsCount = 0;
            var hideCalls = 0;
            var discCns = [];

            var origDiscBatch = null;
            var origDiscDelay = null;

            var initFn = function() {
                origDiscBatch = C.DISC_BATCH;
                origDiscDelay = C.DISC_DELAY;
                C.DISC_BATCH = 2;
                C.DISC_DELAY = 0;

                insertQueue = {itemsToBatches: function(cns, batchSize, isDisconnect) {
                    if(!isDisconnect) return [];
                    var cnBatches = [];
                    var guid = 0;

                    for(var i = 0; i < batchSize; i++) {
                        cnBatches.push([
                            {x1: 0, x2: 19, y1: 0, y2: 19, item: {}, itemGUID: ++guid},
                            {x1: 20, x2: 39, y1: 20, y2: 39, item: {}, itemGUID: ++guid}
                        ]);
                    }
                    return cnBatches;
                }};
                renderer = {
                    markAsSchToHide: function(cns) {
                        for(var i = 0; i < cns.length; i++)
                            cns[i].item.isDisc = true;
                    },
                    hide: function(cns) {
                        hideCalls++;
                        hiddenCnsCount += cns.length;
                    }
                };
                ev = new EventEmitter();

                var disconnector = new Disconnector();
                discCns = [{item: {}},{item: {}},{item: {}},{item: {}}];
                disconnector._scheduleRender(discCns);
            };
            var checkFn = function() {
                ok(discCns[0].item.isDisc && discCns[3].item.isDisc && hiddenCnsCount == 4
                   && hideCalls == 2,
                   "scheduleRender call ok");

                C.DISC_BATCH = origDiscBatch;
                C.DISC_DELAY = origDiscDelay;
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        }
    }

    tester.runTests();
    clearTestData();
});