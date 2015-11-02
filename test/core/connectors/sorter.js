$(document).ready(function() {
    module("CrsSorter");

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
                    "sortForVgOnDefPrepend",
                    "sortForVgOnRevPrepend",
                    "sortForVgOnDefAppend",
                    "sortForVgOnRevAppend",
                    "sortForHgOnDefPrepend",
                    "sortForHgOnRevPrepend",
                    "sortForHgOnDefAppend",
                    "sortForHgOnRevAppend"
                ]);
            });
        },

        _isCorrectOrder: function(crs) {
            for(var i = 0; i < crs.length; i++) {
                if(crs[i].itemGUID != i + 1)
                    return false;
            }

            return true;
        },

        _sortForVgOnDefPrepend: function() {
            ev = new EventEmitter();
            sourceSettings = {prepend: "default"};
            settings = new Settings();

            var crs = [
                //{x: 100, y: 0,    itemGUID: 6},
                //{x: 0,   y: 0,    itemGUID: 5},
                //{x: 100, y: 16.9, itemGUID: 4},
                //{x: 0,   y: 16.4, itemGUID: 3},
                //{x: 10,  y: 30,   itemGUID: 2},
                //{x: 20,  y: 60,   itemGUID: 1}
                {x: 100, y: 16.9, itemGUID: 4},
                {x: 10,  y: 30,   itemGUID: 2},
                {x: 100, y: 0,    itemGUID: 6},
                {x: 0,   y: 0,    itemGUID: 5},
                {x: 0,   y: 16.4, itemGUID: 3},
                {x: 20,  y: 60,   itemGUID: 1}
            ];

            var crsSorter = new CrsSorter();
            crsSorter.attach(crs);
            crsSorter.sortForPrepend();

            ok(this._isCorrectOrder(crsSorter.getSorted()), "vgGrid def prepend sort ok");

            clearTestData();
        },

        _sortForVgOnRevPrepend: function() {
            ev = new EventEmitter();
            sourceSettings = {prepend: "reversed"};
            settings = new Settings();

            var crs = [
                //{x: 0,   y: 0,    itemGUID: 6},
                //{x: 100, y: 0,    itemGUID: 5},
                //{x: 0,   y: 16.4, itemGUID: 4},
                //{x: 100, y: 16.9, itemGUID: 3},
                //{x: 10,  y: 30,   itemGUID: 2},
                //{x: 20,  y: 60,   itemGUID: 1}
                {x: 0,   y: 0,    itemGUID: 6},
                {x: 100, y: 16.9, itemGUID: 3},
                {x: 100, y: 0,    itemGUID: 5},
                {x: 0,   y: 16.4, itemGUID: 4},
                {x: 10,  y: 30,   itemGUID: 2},
                {x: 20,  y: 60,   itemGUID: 1}
            ];

            var crsSorter = new CrsSorter();
            crsSorter.attach(crs);
            crsSorter.sortForPrepend();

            ok(this._isCorrectOrder(crsSorter.getSorted()), "vgGrid rev prepend sort ok");

            clearTestData();
        },

        _sortForVgOnDefAppend: function() {
            ev = new EventEmitter();
            settings = new Settings();

            var crs = [
                //{x: 0,   y: 0,    itemGUID: 1},
                //{x: 100, y: 0,    itemGUID: 2},
                //{x: 0,   y: 16.4, itemGUID: 3},
                //{x: 100, y: 16.9, itemGUID: 4},
                //{x: 10,  y: 30,   itemGUID: 5},
                //{x: 20,  y: 60,   itemGUID: 6}
                {x: 100, y: 16.9, itemGUID: 4},
                {x: 20,  y: 60,   itemGUID: 6},
                {x: 100, y: 0,    itemGUID: 2},
                {x: 0,   y: 0,    itemGUID: 1},
                {x: 0,   y: 16.4, itemGUID: 3},
                {x: 10,  y: 30,   itemGUID: 5}
            ];

            var crsSorter = new CrsSorter();
            crsSorter.attach(crs);
            crsSorter.sortForAppend();

            ok(this._isCorrectOrder(crsSorter.getSorted()), "vgGrid def append sort ok");

            clearTestData();
        },

        _sortForVgOnRevAppend: function() {
            ev = new EventEmitter();
            sourceSettings = {append: "reversed"};
            settings = new Settings();

            var crs = [
                //{x: 100, y: 0,    itemGUID: 1},
                //{x: 0,   y: 0,    itemGUID: 2},
                //{x: 100, y: 16.9, itemGUID: 3},
                //{x: 0,   y: 16.4, itemGUID: 4},
                //{x: 10,  y: 30,   itemGUID: 5},
                //{x: 20,  y: 60,   itemGUID: 6}
                {x: 100, y: 16.9, itemGUID: 3},
                {x: 10,  y: 30,   itemGUID: 5},
                {x: 100, y: 0,    itemGUID: 1},
                {x: 0,   y: 16.4, itemGUID: 4},
                {x: 0,   y: 0,    itemGUID: 2},
                {x: 20,  y: 60,   itemGUID: 6}
            ];

            var crsSorter = new CrsSorter();
            crsSorter.attach(crs);
            crsSorter.sortForAppend();

            ok(this._isCorrectOrder(crsSorter.getSorted()), "vgGrid rev append sort ok");

            clearTestData();
        },

        _sortForHgOnDefPrepend: function() {
            ev = new EventEmitter();
            sourceSettings = {prepend: "default", grid: "horizontal"};
            settings = new Settings();

            var crs = [
                //{x: 0,    y: 0,   itemGUID: 6},
                //{x: 0,    y: 100, itemGUID: 5},
                //{x: 16.4, y: 0,   itemGUID: 4},
                //{x: 16.9, y: 100, itemGUID: 3},
                //{x: 30,   y: 10,  itemGUID: 2},
                //{x: 60,   y: 20,  itemGUID: 1}
                {x: 16.9, y: 100, itemGUID: 3},
                {x: 30,   y: 10,  itemGUID: 2},
                {x: 0,    y: 0,   itemGUID: 6},
                {x: 0,    y: 100, itemGUID: 5},
                {x: 16.4, y: 0,   itemGUID: 4},
                {x: 60,   y: 20,  itemGUID: 1}
            ];

            var crsSorter = new CrsSorter();
            crsSorter.attach(crs);
            crsSorter.sortForPrepend();

            ok(this._isCorrectOrder(crsSorter.getSorted()), "hgGrid def prepend sort ok");

            clearTestData();
        },

        _sortForHgOnRevPrepend: function() {
            ev = new EventEmitter();
            sourceSettings = {prepend: "reversed", grid: "horizontal"};
            settings = new Settings();

            var crs = [
                //{x: 0,    y: 100,  itemGUID: 6},
                //{x: 0,    y: 0,    itemGUID: 5},
                //{x: 16.9, y: 100,  itemGUID: 4},
                //{x: 16.4, y: 0,    itemGUID: 3},
                //{x: 30,   y: 10,   itemGUID: 2},
                //{x: 60,   y: 20,   itemGUID: 1}
                {x: 30,   y: 10,   itemGUID: 2},
                {x: 0,    y: 100,  itemGUID: 6},
                {x: 16.4, y: 0,    itemGUID: 3},
                {x: 0,    y: 0,    itemGUID: 5},
                {x: 16.9, y: 100,  itemGUID: 4},
                {x: 60,   y: 20,   itemGUID: 1}
            ];

            var crsSorter = new CrsSorter();
            crsSorter.attach(crs);
            crsSorter.sortForPrepend();

            ok(this._isCorrectOrder(crsSorter.getSorted()), "hgGrid rev prepend sort ok");

            clearTestData();
        },

        _sortForHgOnDefAppend: function() {
            ev = new EventEmitter();
            sourceSettings = {grid: "horizontal"};
            settings = new Settings();

            var crs = [
                //{x: 0,    y: 0,    itemGUID: 1},
                //{x: 0,    y: 100,  itemGUID: 2},
                //{x: 16.4, y: 0,    itemGUID: 3},
                //{x: 16.9, y: 100,  itemGUID: 4},
                //{x: 30,   y: 10,   itemGUID: 5},
                //{x: 60,   y: 20,   itemGUID: 6}
                {x: 30,   y: 10,   itemGUID: 5},
                {x: 16.4, y: 0,    itemGUID: 3},
                {x: 0,    y: 0,    itemGUID: 1},
                {x: 0,    y: 100,  itemGUID: 2},
                {x: 16.9, y: 100,  itemGUID: 4},
                {x: 60,   y: 20,   itemGUID: 6}
            ];

            var crsSorter = new CrsSorter();
            crsSorter.attach(crs);
            crsSorter.sortForAppend();

            ok(this._isCorrectOrder(crsSorter.getSorted()), "hgGrid def append sort ok");

            clearTestData();
        },

        _sortForHgOnRevAppend: function() {
            ev = new EventEmitter();
            sourceSettings = {append: "reversed", grid: "horizontal"};
            settings = new Settings();

            var crs = [
                //{x: 0,    y: 100,  itemGUID: 1},
                //{x: 0,    y: 0,    itemGUID: 2},
                //{x: 16.9, y: 100,  itemGUID: 3},
                //{x: 16.4, y: 0,    itemGUID: 4},
                //{x: 30,   y: 10,   itemGUID: 5},
                //{x: 60,   y: 20,   itemGUID: 6}
                {x: 30,   y: 10,   itemGUID: 5},
                {x: 0,    y: 100,  itemGUID: 1},
                {x: 16.9, y: 100,  itemGUID: 3},
                {x: 0,    y: 0,    itemGUID: 2},
                {x: 16.4, y: 0,    itemGUID: 4},
                {x: 60,   y: 20,   itemGUID: 6}
            ];

            var crsSorter = new CrsSorter();
            crsSorter.attach(crs);
            crsSorter.sortForAppend();

            ok(this._isCorrectOrder(crsSorter.getSorted()), "hgGrid rev append sort ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});