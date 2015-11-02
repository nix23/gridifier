$(document).ready(function() {
    module("Filtrator");

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
                    "filterOutOneItem",
                    "filterOutAllItems",
                    "findConnItemsToHide",
                    "recreateGUIDS",
                    "recreateCnsOnVG",
                    "recreateCnsOnHG"
                ]);
            });
        },

        _filterOutOneItem: function() {
            var items = [{conn: true}, {conn: false}, {conn: false}];
            var discItemsCount = 0;
            var wereGuidsRecreated = false;
            var wereCnsRecreated = false;
            var recreatedItemsCount = 0;

            collector = new Collector();
            collector.filter = function(items) { return items; };
            collector.sort = function(items) { return items; };
            collector.collect = function() {
                return items;
            };
            collector.collectConnected = function() {
                var cn = [];
                for(var i = 0; i < items.length; i++) {
                    if(items[i].conn) cn.push(items[i]);
                }
                return cn;
            };
            disconnector = new Disconnector();
            disconnector.disconnect = function(items) { discItemsCount = items.length; };

            ev = new EventEmitter();
            settings = new Settings();

            var filtrator = new Filtrator();
            filtrator._findConnItemsToHide = function(items) { return items; };
            filtrator._recreateGUIDS = function(items) {
                recreatedItemsCount = items.length;
                wereGuidsRecreated = true;
            };
            filtrator._recreateCns = function(items) {
                recreatedItemsCount = items.length;
                wereCnsRecreated = true;
            };

            filtrator.filter();
            ok(discItemsCount == 1 && wereCnsRecreated && wereGuidsRecreated &&
               recreatedItemsCount == 3,
               "filter out 1 item from 3 items ok");

            clearTestData();
        },

        _filterOutAllItems: function() {
            var items = [{conn: true}, {conn: true}, {conn: true}];
            var discItemsCount = 0;
            var wereGuidsRecreated = false;
            var wereCnsRecreated = false;

            collector = new Collector();
            collector.filter = function(items) { return items; };
            collector.sort = function(items) { return items; };
            collector.collect = function() {
                return items;
            };
            collector.collectConnected = function() {
                var cn = [];
                for(var i = 0; i < items.length; i++) {
                    if(items[i].conn) cn.push(items[i]);
                }
                return cn;
            };
            disconnector = new Disconnector();
            disconnector.disconnect = function(items) { discItemsCount = items.length; };

            ev = new EventEmitter();
            settings = new Settings();

            var filtrator = new Filtrator();
            filtrator._findConnItemsToHide = function(items) { return items; };
            filtrator._recreateGUIDS = function() { wereGuidsRecreated = true; };
            filtrator._recreateCns = function() { wereCnsRecreated = true; };

            filtrator.filter();
            ok(discItemsCount == 3 && wereCnsRecreated && wereGuidsRecreated,
                "filter out 3 from 3 items ok");

            clearTestData();
        },

        _findConnItemsToHide: function() {
            ev = new EventEmitter();
            collector = new Collector();
            settings = new Settings();

            var items = [Dom.div(), Dom.div(), Dom.div()];
            var filtrator = new Filtrator();

            var itemsToHide = filtrator._findConnItemsToHide(items);
            ok(itemsToHide.length == 0, "findConnItemsToHide with def filter ok");

            ev = new EventEmitter();
            collector = new Collector();
            sourceSettings = {filter: function(item) { return false; }};
            settings = new Settings();

            var items = [Dom.div(), Dom.div(), Dom.div()];
            var filtrator = new Filtrator();

            var itemsToHide = filtrator._findConnItemsToHide(items);
            ok(itemsToHide.length == 3, "findConnItemsToHide with false filter ok");

            clearTestData();
        },

        _recreateGUIDS: function() {
            ev = new EventEmitter();
            gridItem = new Item();
            guid = new GUID();
            cnsCore = new CnsCore();
            connections = new VgConnections();
            settings = new Settings();

            var items = [Dom.div(), Dom.div(), Dom.div()];

            var filtrator = new Filtrator();
            filtrator._recreateGUIDS(items);

            ok(guid.get(items[0]) == 10000 && guid.get(items[1]) == 10001 &&
               guid.get(items[2]) == 10002,
               "recreateGUIDS ok");
        },

        _recreateCnsOnVG: function() {
            ev = new EventEmitter();
            gridItem = new Item();
            guid = new GUID();
            cnsCore = new CnsCore();
            connections = new VgConnections();
            settings = new Settings();

            var items = [Dom.div(), Dom.div(), Dom.div()];
            for(var i = 0; i < items.length; i++) {
                gridItem.markAsConnected(items[i]);
                guid.markForAppend(items[i]);
                connections.add(items[i], {x1: 10000, x2: 10000, y1: 10000, y2: 10000});
            }

            var filtrator = new Filtrator();
            filtrator._recreateCns(items);

            var cns = connections.get();
            ok(cns[0].y1 == 0 && cns[0].y2 == 0 && cns[0].x1 == 0 && cns[0].x2 == 0 &&
               cns[1].y1 == 1 && cns[1].y2 == 1 && cns[1].x1 == 0 && cns[1].x2 == 0 &&
               cns[2].y1 == 2 && cns[2].y2 == 2 && cns[2].x1 == 0 && cns[2].x2 == 0,
               "recreateCns on vgrid ok");

            clearTestData();
        },

        _recreateCnsOnHG: function() {
            ev = new EventEmitter();
            gridItem = new Item();
            guid = new GUID();
            cnsCore = new CnsCore();
            connections = new VgConnections();
            sourceSettings = {grid: "horizontal"};
            settings = new Settings();

            var items = [Dom.div(), Dom.div(), Dom.div()];
            for(var i = 0; i < items.length; i++) {
                gridItem.markAsConnected(items[i]);
                guid.markForAppend(items[i]);
                connections.add(items[i], {x1: 10000, x2: 10000, y1: 10000, y2: 10000});
            }

            var filtrator = new Filtrator();
            filtrator._recreateCns(items);

            var cns = connections.get();
            ok(cns[0].y1 == 0 && cns[0].y2 == 0 && cns[0].x1 == 0 && cns[0].x2 == 0 &&
                cns[1].y1 == 0 && cns[1].y2 == 0 && cns[1].x1 == 1 && cns[1].x2 == 1 &&
                cns[2].y1 == 0 && cns[2].y2 == 0 && cns[2].x1 == 2 && cns[2].x2 == 2,
                "recreateCns on vgrid ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});