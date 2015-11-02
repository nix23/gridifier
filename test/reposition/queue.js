$(document).ready(function() {
    module("RepositionQueue");

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
                    "crud",
                    "isSameRepositionProcess",
                    "repositionNextBatch",
                    "execNextBatchReposition",
                    "processQueue",
                    "scheduleNextBatchReposition",
                    "repositionItem"
                ]);
            });
        },

        _crud: function() {
            var repositionQueue = new RepositionQueue();
            ok(repositionQueue.isEmpty(), "isEmpty ok");

            repositionQueue._nextBatchTimeout = 14;
            ok(!repositionQueue.isEmpty(), "is not empty ok");

            repositionQueue._nextBatchTimeout = null;
            repositionQueue.init([{id: 1}, {id: 2}], [{id: 3}, {id: 4}]);
            ok(repositionQueue._queue[0].item.id == 1 &&
               repositionQueue._queue[1].item.id == 2 &&
               repositionQueue._queue[0].cn.id == 3 &&
               repositionQueue._queue[1].cn.id == 4 &&
               Dom.isArray(repositionQueue._queueData),
               "init ok");

            repositionQueue._nextBatchTimeout = setTimeout(function() {
                alert("Err: cleared timeout fired!");
            }, 1000);
            repositionQueue._queueData = "qd";
            var data = repositionQueue.stop();
            ok(
                data.queue[0].item.id == 1 &&
                data.queue[1].item.id == 2 &&
                data.queue[0].cn.id == 3 &&
                data.queue[1].cn.id == 4 &&
                data.queueData == "qd",
                "stop ok"
            );
            repositionQueue._queueData = [];

            grid = {};
            grid.x2 = function() { return 10; };
            grid.y2 = function() { return 20; };
            srManager = {};
            srManager.viewportWidth = function() { return 30; };
            srManager.viewportHeight = function() { return 40; };

            var reposed = false;
            repositionQueue._repositionNextBatch = function() {
                reposed = true;
            };

            repositionQueue.start();
            ok(repositionQueue._repositionStart.gridX2 == 10 &&
               repositionQueue._repositionStart.gridY2 == 20 &&
               repositionQueue._repositionStart.vpWidth == 30 &&
               repositionQueue._repositionStart.vpHeight == 40 &&
               reposed,
               "start ok");

            var queue = repositionQueue.getQueued();
            ok(queue[0].item.id == 1 && queue[1].item.id == 2, "getQueued ok");

            clearTestData();
        },

        _isSameRepositionProcess: function() {
            ev = new EventEmitter();
            settings = new Settings();

            var repositionQueue = new RepositionQueue();
            repositionQueue._repositionStart = {
                gridX2: 10,
                gridY2: 20,
                vpWidth: 30,
                vpHeight: 40
            };

            grid = {};
            grid.x2 = function() { return 10; };
            grid.y2 = function() { return 20; };
            srManager = {};
            srManager.viewportWidth = function() { return 30; };
            srManager.viewportHeight = function() { return 40; };

            ok(repositionQueue._isSameRepositionProcess(), "isSameReappendProcess ok");

            grid.x2 = function() { return 15; };
            ok(!repositionQueue._isSameRepositionProcess(), "isSameReappendProcess vg1 not eq ok");

            grid.x2 = function() { return 10; };
            srManager.viewportWidth = function() { return 35; };
            ok(!repositionQueue._isSameRepositionProcess(), "isSameReappendProcess vg2 not eq ok");

            srManager.viewportWidth = function() { return 30; };
            sourceSettings = {grid: "horizontal"};
            settings = new Settings();

            grid.y2 = function() { return 25; };
            ok(!repositionQueue._isSameRepositionProcess(), "isSameReappendProcess hg1 not eq ok");

            grid.y2 = function() { return 20; };
            srManager.viewportHeight = function() { return 45; };
            ok(!repositionQueue._isSameRepositionProcess(), "isSameReappendProcess hg2 not eq ok");

            clearTestData();
        },

        _repositionNextBatch: function() {
            Logger = {};
            Logger.stopLoggingOperation = function() {};
            Logger.log = function() {};
            connectors = {get: function() {}};
            connections = {get: function() {}};

            ev = new EventEmitter();
            sourceSettings = {queueSize: 1};
            settings = new Settings();

            var data = {
                started: false,
                stopped: false,
                execBatch: null,
                processBatch: null
            };

            srManager = {};
            srManager.startCachingTransaction = function() { data.started = true; };
            srManager.stopCachingTransaction = function() { data.stopped = true; };

            var repositionQueue = new RepositionQueue();
            repositionQueue._queue = [];
            repositionQueue._isSameRepositionProcess = function() { return false; };
            repositionQueue._execNextBatchReposition = function(bs) { data.execBatch = bs; };
            repositionQueue._processQueue = function(bs) { data.processBatch = bs; };

            repositionQueue._repositionNextBatch(true);
            ok(data.started && data.stopped && data.execBatch == null,
               "repositionNextBatch on not same reappend process ok");

            repositionQueue._repositionNextBatch();
            ok(data.execBatch == 0 && data.processBatch == 0,
               "repositionNextBatch on empty queue ok");

            repositionQueue._queue = [{id: 1}, {id: 2}];
            repositionQueue._repositionNextBatch();
            ok(data.execBatch == 1 && data.processBatch == 1,
               "repositionNextBatch on not empty queue ok");

            clearTestData();
        },

        _execNextBatchReposition: function() {
            Logger = {};
            Logger.stopLoggingOperation = function() {};
            Logger.log = function() {};
            connectors = {get: function() {}};
            connections = {get: function() {}};

            var data = {
                stopped: false,
                reposed: null,
                intFromBottomRm: false,
                intFromRightRm: false,
                evGuids: null,
                renderGuids: null
            };

            ev = new EventEmitter();
            settings = new Settings();

            srManager = {};
            srManager.stopCachingTransaction = function() { data.stopped = true; };
            crsCleaner = {};
            crsCleaner.rmIntFromBottom = function() { data.intFromBottomRm = true; };
            crsCleaner.rmIntFromRight = function() { data.intFromRightRm = true };
            guid = {};
            guid.get = function(item) { return item; };
            cnsCore = {};
            cnsCore.getByGUIDS = function(guids) { return guids; };
            cssManager = {};
            cssManager.emitEvents = function(guids) { data.evGuids = guids; };
            renderer = {};
            renderer.renderRepositioned = function(guids) { data.renderGuids = guids; };

            reposition = new RepositionQueue();
            reposition._repositionItem = function(item) { data.reposed = item; };
            reposition._queue = [{item: 6}, {item: 7}];

            reposition._execNextBatchReposition(1);
            ok(
                data.stopped &&
                data.reposed == 6 &&
                data.intFromBottomRm &&
                data.evGuids[0] == 6 &&
                data.renderGuids[0] == 6,
                "execNextBatchReposition vg ok"
            );

            sourceSettings = {grid: "horizontal"};
            settings = new Settings();

            reposition._execNextBatchReposition(1);
            ok(
                data.stopped &&
                data.reposed == 6 &&
                data.intFromBottomRm &&
                data.evGuids[0] == 6 &&
                data.renderGuids[0] == 6,
                "execNextBatchReposition hg ok"
            );

            clearTestData();
        },

        _processQueue: function() {
            Logger = {};
            Logger.stopLoggingOperation = function() {};

            var data = {ev: null, ev2: null, scheduled: false};

            ev = {
                emitInternal: function(ev) { data.ev = ev; },
                emit: function(ev) { data.ev2 = ev; }
            };

            var repositionQueue = new RepositionQueue();
            repositionQueue._queue = [{id: 1}, {id: 2}];
            repositionQueue._queueData = [];
            repositionQueue._scheduleNextBatchReposition = function() {
                data.scheduled = true;
            };

            repositionQueue._processQueue(2);
            ok(
                repositionQueue._nextBatchTimeout == null &&
                repositionQueue._queue.length == 0 &&
                repositionQueue._queueData.length == 2 &&
                repositionQueue._queueData[0].id == 1 &&
                repositionQueue._queueData[1].id == 2 &&
                data.ev == INT_EV.REPOSITION_END_FOR_DRAG &&
                data.ev2 == EV.REPOSITION_END && 
                !data.scheduled,
                "updateQueue with all items ok"
            );

            repositionQueue._queue = [{id: 1}, {id: 2}];
            repositionQueue._queueData = [];
            repositionQueue._processQueue(1);
            ok(data.scheduled, "updateQueue with schedule next items repos ok");

            clearTestData();
        },

        _scheduleNextBatchReposition: function(assert) {
            var repositionQueue = new RepositionQueue();
            var wasChecked = false;

            var initFn = function() {
                sourceSettings = {queueDelay: 0};
                settings = new Settings();

                repositionQueue._repositionNextBatch = function(check) {
                    if(check) wasChecked = true;
                };
                repositionQueue._scheduleNextBatchReposition();
            };
            var checkFn = function() {
                ok(wasChecked, "scheduleNextBatchReposition ok");
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        },

        _repositionItem: function() {
            Logger = {};
            Logger.startLoggingSubaction = function() {};
            Logger.stopLoggingSubaction = function() {};
            guid = {};
            guid.get = function() {};

            var revAppItem = null;
            var appItem = null;

            appender = {position: function(item) { appItem = item; }};
            reversedAppender = {position: function(item) { revAppItem = item; }};

            ev = new EventEmitter();
            settings = new Settings();

            var queue = new RepositionQueue();

            queue._repositionItem(6);
            ok(appItem == 6, "repositionItem dev app ok");

            sourceSettings = {append: "reversed"};
            settings = new Settings();
            queue._repositionItem(8);
            ok(revAppItem == 8, "repositionItem rev app ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});