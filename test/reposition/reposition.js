$(document).ready(function() {
    module("Reposition");

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
                    "all",
                    "fromFirstSortedCn",
                    "from",
                    "sync",
                    "stop",
                    "_all",
                    "_from",
                    "_fromFirstSortedCn",
                    "_start"
                ]);
            });
        },

        _all: function() {
            Logger = {};
            Logger.startLoggingOperation = function() {};
            Logger.stopLoggingOperation = function() {};
            Logger.OPERATION_TYPES = {};
            Logger.OPERATION_TYPES.TRANSFORM_SIZES = "";

            var data = {start: false, stop: false, reposition: false};
            srManager = {
                startCachingTransaction: function() { data.start = true; },
                stopCachingTransaction: function() { data.stop = true; }
            };

            var reposition = new Reposition();
            reposition._all = function() {
                data.reposition = true;
            };
            reposition.all();

            ok(
                data.start && data.stop && data.reposition,
                "all ok"
            );

            clearTestData();
        },

        _fromFirstSortedCn: function() {
            Logger = {};
            Logger.startLoggingOperation = function() {};
            Logger.stopLoggingOperation = function() {};
            Logger.OPERATION_TYPES = {};
            Logger.OPERATION_TYPES.TRANSFORM_SIZES = "";

            var data = {start: false, stop: false, reposition: null};
            srManager = {
                startCachingTransaction: function() { data.start = true; },
                stopCachingTransaction: function() { data.stop = true; }
            };

            var reposition = new Reposition();
            reposition._fromFirstSortedCn = function(items) {
                data.reposition = items;
            };
            reposition.fromFirstSortedCn("items");

            ok(
                data.start && data.stop && data.reposition == "items",
                "fromFirstSortedCn ok"
            );

            clearTestData();
        },

        _from: function() {
            var reposition = new Reposition();

            var from = null;
            reposition._from = function(cn) {
                from = cn;
            };

            reposition.from({id: 1});
            ok(from.id == 1, "from ok");

            clearTestData();
        },

        _sync: function() {
            var reposition = new Reposition();
            repositionQueue = {
                isEmpty: function() { return false; },
                stop: function() {
                    return {
                        queueData: [{cn: 1}, {cn: 2}],
                        queue: [{cn: 3}, {cn: 4}]
                    };
                }
            };

            var syncedParams = [];
            cnsCore = {
                syncParams: function(cns) {
                    for(var i = 0; i < cns.length; i++)
                        syncedParams.push(cns[i]);
                }
            };

            var cns = [];
            connections = {get: function() { return cns; }};

            reposition.sync();
            ok(
                cns.length == 2 &&
                syncedParams.length == 2 &&
                syncedParams[0] == 1 &&
                syncedParams[1] == 2 &&
                cns[0] == 3 &&
                cns[1] == 4,
                "sync ok"
            );

            clearTestData();
        },

        _stop: function() {
            var reposition = new Reposition();
            repositionQueue = {
                isEmpty: function() { return false; },
                stop: function() {
                    return {
                        queue: [{cn: {id: 1, restrictCollect: false}},
                                {cn: {id: 2, restrictCollect: false}},
                                {cn: {id: 3, restrictCollect: true}}],
                        queueData: [{cn: 3}, {cn: 4}]
                    };
                }
            };

            var remainedCns = reposition._stop();
            ok(remainedCns.length == 2 && remainedCns[0].id == 1 && remainedCns[1].id == 2,
               "stop ok");

            clearTestData();
        },

        __all: function() {
            var data = {synced: false, sorted: false, unmarked: false, started: false};
            connections = {};
            connections.get = function() { return []; };

            var reposition = new Reposition();
            reposition.sync = function() { data.synced = true; };

            reposition._all();
            ok(!data.unmarked && data.synced, "repositionAll with no cns ok");

            connections.get = function() { return [{id: 1}, {id: 2}]; };
            cnsSorter = {};
            cnsSorter.sortForReappend = function(cns) {
                if(cns.length != 2) return null;
                data.sorted = true;
                return cns;
            };
            guid = {};
            guid.unmarkFirstPrepended = function() { data.unmarked = true; };
            repositionData = {};
            repositionData.getForRepositionAll = function(cns) { if(cns.length == 2) return cns; };

            reposition._start = function(cns) {
                if(cns.length == 2) data.started = true;
            };
            reposition._all();

            ok(
                data.sorted && data.unmarked && data.started,
                "_all ok"
            );

            clearTestData();
        },

        __from: function() {
            var started = false;
            var unmarked = false;

            var reposition = new Reposition();
            reposition._stop = function() { return [{id: 1}, {id: 2}]};
            reposition._start = function(data) {
                if(data == "data") started = true;
            };

            guid = {};
            guid.unmarkFirstPrepended = function() { unmarked = true; };

            repositionData = {};
            repositionData.get = function(cns, firstCn) {
                if(firstCn.id != "2" || cns.length != 2) return null;
                return "data";
            };

            reposition._from({id: 2});
            ok(started && unmarked, "_from ok");

            clearTestData();
        },

        __fromFirstSortedCn: function() {
            var start = {cns: null, firstCn: null};
            var unmarked = false;

            var reposition = new Reposition();
            reposition._stop = function() { return [{item: {id: 1}}, {item: {id: 2}}]};
            reposition._start = function(data) {
                start.cns = data[0];
                start.firstCn = data[1];
            };

            guid = {};
            guid.unmarkFirstPrepended = function() { unmarked = true; };
            guid.get = function(item) { return item.id; };
            cnsSorter = {};
            cnsSorter.sortForReappend = function(cns) { if(cns.length > 0) return cns; };

            connections = {};
            connections.get = function() {
                return [{item: {id: 3}}, {item: {id: 4}}];
            };

            repositionData = {};
            repositionData.get = function(cns, firstCn) {
                return [cns, firstCn];
            };

            reposition._fromFirstSortedCn([{id: 2}, {id: 4}]);
            ok(
                unmarked &&
                start.cns.length == 2 &&
                start.cns[0].item.id == 1 &&
                start.cns[1].item.id == 2 &&
                start.firstCn.item.id == 2,
                "_fromFirstSortedCn ok"
            );

            clearTestData();
        },

        __start: function() {
            var recreated = false;
            var inited = false;
            var started = false;

            var reposition = new Reposition();
            repositionCrs = {};
            repositionCrs.recreateForFirst = function(firstItem, firstCn) {
                if(firstItem != "item" || firstCn.item != "item") return;
                recreated = true;
            };
            repositionQueue = {};
            repositionQueue.init = function(items, cns) {
                if(items != "items" || cns != "cns") return;
                inited = true;
            };
            repositionQueue.start = function() {
                started = true;
            };

            reposition._start({
                firstCn: {item: "item"},
                items: "items",
                cns: "cns"
            });

            ok(recreated && inited && started, "_start ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});