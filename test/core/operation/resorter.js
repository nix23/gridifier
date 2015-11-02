$(document).ready(function() {
    module("Resorter");

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
                    "resortOnDisabledSd",
                    "resortOnEnabledSd",
                    "resortOnSdVg",
                    "resortOnSdHg"
                ]);
            });
        },

        _resortOnDisabledSd: function() {
            var items = [Dom.div(), Dom.div(), Dom.div()];

            ev = new EventEmitter();
            gridItem = new Item();
            guid = new GUID();
            settings = new Settings();
            collector = new Collector();
            collector.sort = function(items) { return items; };
            collector.collectConnected = function() { return items; };

            var resorter = new Resorter();
            resorter.resort();

            ok(guid.get(items[0]) == "10000" && guid.get(items[1]) == "10001" &&
               guid.get(items[2]) == "10002",
               "resort on disabled sd ok");

            clearTestData();
        },

        _resortOnEnabledSd: function() {
            var items = [Dom.div(), Dom.div(), Dom.div()];
            var wasResortOnSdCalled = false;

            ev = new EventEmitter();
            gridItem = new Item();
            guid = new GUID();
            sourceSettings = {sortDispersion: true};
            settings = new Settings();
            collector = new Collector();
            collector.sort = function(items) { return items; };
            collector.collectConnected = function() { return items; };

            var resorter = new Resorter();
            resorter._resortOnSD = function() { wasResortOnSdCalled = true; };
            resorter.resort();

            ok(guid.get(items[0]) == "10000" && guid.get(items[1]) == "10001" &&
               guid.get(items[2]) == "10002" && wasResortOnSdCalled,
               "resort on enabled sd ok");

            clearTestData();
        },

        _resortOnSdVg: function() {
            ev = new EventEmitter();
            gridItem = new Item();
            guid = new GUID();
            settings = new Settings();
            cnsCore = new CnsCore();
            connections = new VgConnections();

            var items = [Dom.div(), Dom.div(), Dom.div()];
            for(var i = 0; i < items.length; i++) {
                gridItem.markAsConnected(items[i]);
                guid.markForAppend(items[i]);
                connections.add(items[i], {x1: 10000, x2: 10000, y1: 10000, y2: 10000});
            }

            var resorter = new Resorter();
            resorter._resortOnSD(items);

            var cns = connections.get();
            ok(cns[0].x1 == 0 && cns[0].x2 == 0 && cns[0].y1 == 0 && cns[0].y2 == 0 &&
               cns[1].x1 == 0 && cns[1].x2 == 0 && cns[1].y1 == 1 && cns[1].y2 == 1 &&
               cns[2].x1 == 0 && cns[2].x2 == 0 && cns[2].y1 == 2 && cns[2].y2 == 2,
               "_resortOnSD vg");

            clearTestData();
        },

        _resortOnSdHg: function() {
            ev = new EventEmitter();
            gridItem = new Item();
            guid = new GUID();
            sourceSettings = {grid: "horizontal"};
            settings = new Settings();
            cnsCore = new CnsCore();
            connections = new VgConnections();

            var items = [Dom.div(), Dom.div(), Dom.div()];
            for(var i = 0; i < items.length; i++) {
                gridItem.markAsConnected(items[i]);
                guid.markForAppend(items[i]);
                connections.add(items[i], {x1: 10000, x2: 10000, y1: 10000, y2: 10000});
            }

            var resorter = new Resorter();
            resorter._resortOnSD(items);

            var cns = connections.get();
            ok(cns[0].x1 == 0 && cns[0].x2 == 0 && cns[0].y1 == 0 && cns[0].y2 == 0 &&
                cns[1].x1 == 1 && cns[1].x2 == 1 && cns[1].y1 == 0 && cns[1].y2 == 0 &&
                cns[2].x1 == 2 && cns[2].x2 == 2 && cns[2].y1 == 0 && cns[2].y2 == 0,
                "_resortOnSD hg");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});