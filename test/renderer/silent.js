$(document).ready(function() {
    module("SilentRenderer");

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
                    "scheduleCrud",
                    "getScheduled",
                    "execWithoutParams",
                    "exec",
                    "_exec",
                    "_execByBatches",
                    "_execBatch",
                    "render"
                ]);
            });
        },

        _scheduleCrud: function() {
            var unmarked = [];
            rendererCns = {
                unmarkAsRendered: function(cn) {
                    unmarked.push(cn);
                }
            };
            var silent = new SilentRenderer();

            var items = [Dom.div(), Dom.div()];
            var cns = [{itemGUID: 1}, {itemGUID: 2}];

            silent.schedule(items);
            ok(silent.isScheduled(items[0]) && silent.isScheduled(items[1]),
               "isScheduled ok");

            silent.unschedule(items, cns);
            ok(unmarked.length == 2 && unmarked[0].itemGUID == 1 &&
               unmarked[1].itemGUID == 2 && !silent.isScheduled(items[0])
               && !silent.isScheduled(items[1]), "schedule/unschedule ok");

            silent.schedule(items);
            silent._preUnschedule(items);
            ok(!silent.isScheduled(items[0]) && !silent.isScheduled(items[1]),
               "preUnschedule ok");

            clearTestData();
        },

        _getScheduled: function() {
            var items = [Dom.div(), Dom.div(), Dom.div()];
            var container = Dom.div();
            $testContent.append($(container));

            collector = new Collector();
            grid = {get: function() { return container; }};

            var silent = new SilentRenderer();
            ok(silent.getScheduled().length == 0, "getScheduled without scheduled ok");

            for(var i = 0; i < items.length; i++) {
                container.appendChild(items[i]);
                silent.schedule([items[i]]);
                Dom.set(items[i], "data-guid", i + 1);
            }

            container.appendChild(Dom.div());
            var scheduled = silent.getScheduled();
            ok(Dom.get(scheduled[0], "data-guid") == "1" &&
               Dom.get(scheduled[1], "data-guid") == "2" &&
               Dom.get(scheduled[2], "data-guid") == "3" &&
               scheduled.length == 3, "getScheduled all ok");

            srManager = {};
            srManager.offsetLeft = function(grid) {
                return (grid.nodeName == "DIV") ? 0 : 1000000;
            };
            srManager.offsetTop = function(grid) {
                return (grid.nodeName == "DIV") ? 0 : 10000000;
            };
            srManager.viewportDocumentCoords = function() {
                return {x1: 0, x2: 1000, y1: 0, y2: 1000};
            };
            cnsCore = {};
            cnsCore.find = function(item, find) {
                if(!find) return null;
                if(Dom.get(item, "data-guid") == "1")
                    return {x1: 0, x2: 500, y1: 0, y2: 500};
                else if(Dom.get(item, "data-guid") == "2")
                    return {x1: 0, x2: 500, y1: 1001, y2: 1300};
                else if(Dom.get(item, "data-guid") == "3")
                    return null;
            };
            cnsIntersector = new CnsIntersector();

            var scheduled = silent.getScheduled(true);
            ok(scheduled.length == 1 && Dom.get(scheduled[0], "data-guid") == "1",
               "getScheduled only inside vp ok");

            clearTestData();
        },

        _execWithoutParams: function(assert) {
            var items = null;
            var batchSize = null;
            var batchDelay = null;
            var origDelay = null;

            var initFn = function() {
                origDelay = C.REFLOW_FIX_DELAY;
                C.REFLOW_FIX_DELAY = 0;

                var silent = new SilentRenderer();
                silent._exec = function(fnitems, bs, bd) {
                    items = fnitems;
                    batchSize = bs;
                    batchDelay = bd;
                }
                silent.exec();
            };
            var checkFn = function() {
                ok(typeof items == "undefined" && typeof batchSize == "undefined" &&
                   typeof batchDelay == "undefined",
                   "_exec without params ok");
                C.UPDATE_Z_DELAY = origDelay;
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        },

        _exec: function(assert) {
            var items = null;
            var batchSize = null;
            var batchDelay = null;
            var origDelay = null;

            var initFn = function() {
                origDelay = C.REFLOW_FIX_DELAY;
                C.REFLOW_FIX_DELAY = 0;

                var $items = [Dom.div(), $(Dom.div())];
                Dom.set($items[0], "data-guid", "test");
                gridItem = new Item();

                var silent = new SilentRenderer();
                silent.schedule([$items[0]]);

                silent._exec = function(fnitems, bs, bd) {
                    items = fnitems;
                    batchSize = bs;
                    batchDelay = bd;
                }
                silent.exec($items, 10, 20);
            };
            var checkFn = function() {
                var silent = new SilentRenderer();
                ok(Dom.get(items[0], "data-guid") == "test" && batchSize == 10
                   && batchDelay == 20 && !silent.isScheduled(items[0]),
                   "_exec with params ok");
                C.UPDATE_Z_DELAY = origDelay;
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        },

        __exec: function() {
            var scheduledItems = null;
            var scheduledCns = null;

            var getMocks = function() {
                var div1 = Dom.div();
                var div2 = Dom.div();
                var div3 = Dom.div();
                Dom.set(div1, "data-guid", "1");
                Dom.set(div2, "data-guid", "2");
                Dom.set(div3, "data-guid", "3");

                return [div1, div2, div3];
            };

            var silent = new SilentRenderer();

            silent.getScheduled = function() {
                return getMocks();
            };
            silent._render = function(items, cns) {
                scheduledItems = items;
                scheduledCns = cns;
            };

            cnsCore = {};
            cnsCore.find = function(item, find) {
                if(!find) return null;
                if(Dom.get(item, "data-guid") != "3") return {item: item};
                return null;
            };
            cnsSorter = {sortForReappend: function(cns) { return cns; }};

            silent._exec();
            ok(scheduledItems.length == 2 && scheduledCns.length == 2 &&
               Dom.get(scheduledItems[0], "data-guid") == "1" &&
               Dom.get(scheduledItems[1], "data-guid") == "2" &&
               Dom.get(scheduledCns[0].item, "data-guid") == "1" &&
               Dom.get(scheduledCns[1].item, "data-guid") == "2",
               "_exec with scheduled items ok");

            silent._exec(getMocks());
            ok(scheduledItems.length == 2 && scheduledCns.length == 2 &&
                Dom.get(scheduledItems[0], "data-guid") == "1" &&
                Dom.get(scheduledItems[1], "data-guid") == "2" &&
                Dom.get(scheduledCns[0].item, "data-guid") == "1" &&
                Dom.get(scheduledCns[1].item, "data-guid") == "2",
                "_exec with passed items ok");

            clearTestData();
        },

        __execByBatches: function() {
            var data = {
                items: [], cns: [], batchDelays: []
            };
            var batchSize = 2;

            insertQueue = {};
            insertQueue.itemsToBatches = function(items, bs) {
                if(bs != batchSize && (items != "items" || items != "cns")) return;

                var divs = [];
                for(var i = 0; i < 4; i++) {
                    divs.push(Dom.div());
                    Dom.set(divs[i], "data-guid", i + 1);
                }

                return [[divs[0], divs[1]], [divs[2], divs[3]]];
            };

            var silent = new SilentRenderer();
            silent._execBatch = function(items, cns, batchDelay) {
                data.items.push(items);
                data.cns.push(cns);
                data.batchDelays.push(batchDelay);
            };

            silent._execByBatches("items", "cns", 2);
            silent._execByBatches("items", "cns", 2, 350);

            ok(Dom.get(data.items[0][0], "data-guid") == "1" &&
               Dom.get(data.items[0][1], "data-guid") == "2" &&
               Dom.get(data.items[1][0], "data-guid") == "3" &&
               Dom.get(data.items[1][1], "data-guid") == "4" &&
               Dom.get(data.items[2][0], "data-guid") == "1" &&
               Dom.get(data.items[3][1], "data-guid") == "4" &&
               Dom.get(data.cns[0][0], "data-guid") == "1" &&
               Dom.get(data.cns[3][1], "data-guid") == "4" &&
               data.batchDelays[0] == 0 &&
               data.batchDelays[1] == C.INSERT_BATCH_DELAY &&
               data.batchDelays[2] == 0,
               data.batchDelays[3] == 350,
               "_execByBatches ok");

            clearTestData();
        },

        __execBatch: function(assert) {
            var items = null;
            var cns = null;

            var initFn = function() {
                var silent = new SilentRenderer();
                silent._render = function(fnitems, fncns) {
                    items = fnitems;
                    cns = fncns;
                };
                silent._execBatch("items", "cns", 0, 0);
            };
            var checkFn = function() {
                ok(items == "items" && cns == "cns", "_execBatch ok");
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        },

        _render: function() {
            var items = null;
            var cns = null;
            var showCns = null;

            var silent = new SilentRenderer();
            silent.unschedule = function(fnitems, fncns) {
                items = fnitems;
                cns = fncns;
            };
            renderer = {show: function(cns) { showCns = cns; }};

            silent._render("items", "cns");
            ok(items == "items" && cns == "cns" && showCns == "cns", "_render ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});