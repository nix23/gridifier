$(document).ready(function() {
    module("CnsSorter");

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
                    "sortOnDisabledSDVg",
                    "sortOnDisabledSDHg",
                    "sortOnEnabledSDVgDefAppend",
                    "sortOnEnabledSDVgRevAppend",
                    "sortOnEnabledSDHgDefAppend",
                    "sortOnEnabledSDHgRevAppend"
                ]);
            });
        },

        _sortOnDisabledSDVg: function() {
            ev = new EventEmitter();
            settings = new Settings();

            guid = {get: function(item) { return item.itemGUID; }};
            var cns = [
                {x1: 0, x2: 0, y1: 0, y2: 0, item: {itemGUID: 4}, itemGUID: 4},
                {x1: 0, x2: 0, y1: 0, y2: 0, item: {itemGUID: 2}, itemGUID: 2},
                {x1: 0, x2: 0, y1: 0, y2: 0, item: {itemGUID: 1}, itemGUID: 1},
                {x1: 0, x2: 0, y1: 0, y2: 0, item: {itemGUID: 3}, itemGUID: 3}
            ];
            var cnsSorter = new CnsSorter();

            sorted = cnsSorter.sortForReappend(cns);
            ok(sorted[0].itemGUID == 1 && sorted[1].itemGUID == 2 && sorted[2].itemGUID == 3
               && sorted[3].itemGUID == 4, "sort on disabled sort dispersion vg ok");

            clearTestData();
        },

        _sortOnDisabledSDHg: function() {
            ev = new EventEmitter();
            sourceSettings = {grid: "horizontal"};
            settings = new Settings();

            guid = {get: function(item) { return item.itemGUID; }};
            var cns = [
                {x1: 0, x2: 0, y1: 0, y2: 0, item: {itemGUID: 4}, itemGUID: 4},
                {x1: 0, x2: 0, y1: 0, y2: 0, item: {itemGUID: 2}, itemGUID: 2},
                {x1: 0, x2: 0, y1: 0, y2: 0, item: {itemGUID: 1}, itemGUID: 1},
                {x1: 0, x2: 0, y1: 0, y2: 0, item: {itemGUID: 3}, itemGUID: 3}
            ];
            var cnsSorter = new CnsSorter();

            sorted = cnsSorter.sortForReappend(cns);
            ok(sorted[0].itemGUID == 1 && sorted[1].itemGUID == 2 && sorted[2].itemGUID == 3
               && sorted[3].itemGUID == 4, "sort on disabled sort dispersion hg ok");

            clearTestData();
        },

        _sortOnEnabledSDVgDefAppend: function() {
            ev = new EventEmitter();
            sourceSettings = {sortDispersion: true};
            settings = new Settings();

            var wasRsortCalled = false;
            var rsortCnsCount = 0;

            settings.addApi("rsort", "testcustom", function(cns) {
                wasRsortCalled = true;
                rsortCnsCount = cns.length;
                return cns;
            });
            settings.setApi("rsort", "testcustom");

            var sourceCns = [
                //{x1: 0,   x2: 99,  y1: 0.2, y2: 99,  itemGUID: 1},
                //{x1: 100, x2: 199, y1: 0.7, y2: 99,  itemGUID: 2},
                //{x1: 0,   x2: 99,  y1: 100, y2: 199, itemGUID: 3},
                //{x1: 100, x2: 199, y1: 100, y2: 199, itemGUID: 4}
                {x1: 100, x2: 199, y1: 0.7, y2: 99,  itemGUID: 2},
                {x1: 100, x2: 199, y1: 100, y2: 199, itemGUID: 4},
                {x1: 0,   x2: 99,  y1: 0.2, y2: 99,  itemGUID: 1},
                {x1: 0,   x2: 99,  y1: 100, y2: 199, itemGUID: 3}
            ];

            var cnsSorter = new CnsSorter();
            var cns = cnsSorter.sortForReappend(sourceCns);
            ok(cns[0].itemGUID == 1 && cns[1].itemGUID == 2 && cns[2].itemGUID == 3
               && cns[3].itemGUID == 4 && wasRsortCalled && rsortCnsCount == 4,
               "sort on enabled sort dispersion vg def append ok");

            clearTestData();
        },

        _sortOnEnabledSDVgRevAppend: function() {
            ev = new EventEmitter();
            sourceSettings = {sortDispersion: true, append: "reversed"};
            settings = new Settings();

            var sourceCns = [
                //{x1: 100, x2: 199, y1: 0.7, y2: 99,  itemGUID: 1},
                //{x1: 0,   x2: 99,  y1: 0.2, y2: 99,  itemGUID: 2},
                //{x1: 100, x2: 199, y1: 100, y2: 199, itemGUID: 3},
                //{x1: 0,   x2: 99,  y1: 100, y2: 199, itemGUID: 4}
                {x1: 0, x2: 99, y1: 0.2, y2: 99, itemGUID: 2},
                {x1: 100, x2: 199, y1: 0.7, y2: 99, itemGUID: 1},
                {x1: 0, x2: 99, y1: 100, y2: 199, itemGUID: 4},
                {x1: 100, x2: 199, y1: 100, y2: 199, itemGUID: 3}
            ];

            var cnsSorter = new CnsSorter();
            var cns = cnsSorter.sortForReappend(sourceCns);
            ok(cns[0].itemGUID == 1 && cns[1].itemGUID == 2 && cns[2].itemGUID == 3
               && cns[3].itemGUID == 4, "sort on enabled sort dispersion vg def append ok");

            clearTestData();
        },

        _sortOnEnabledSDHgDefAppend: function() {
            ev = new EventEmitter();
            sourceSettings = {sortDispersion: true, grid: "horizontal"};
            settings = new Settings();

            var sourceCns = [
                //{x1: 0.2, x2: 99,  y1: 0,   y2: 99,  itemGUID: 1},
                //{x1: 0.7, x2: 99,  y1: 100, y2: 199, itemGUID: 2},
                //{x1: 100, x2: 199, y1: 0,   y2: 99,  itemGUID: 3},
                //{x1: 100, x2: 199, y1: 100, y2: 199, itemGUID: 4}
                {x1: 100, x2: 199, y1: 0,   y2: 99,  itemGUID: 3},
                {x1: 0.2, x2: 99,  y1: 0,   y2: 99,  itemGUID: 1},
                {x1: 100, x2: 199, y1: 100, y2: 199, itemGUID: 4},
                {x1: 0.7, x2: 99,  y1: 100, y2: 199, itemGUID: 2}
            ];

            var cnsSorter = new CnsSorter();
            var cns = cnsSorter.sortForReappend(sourceCns);
            ok(cns[0].itemGUID == 1 && cns[1].itemGUID == 2 && cns[2].itemGUID == 3
               && cns[3].itemGUID == 4, "sort on enabled sort dispersion hg def append ok");

            clearTestData();
        },

        _sortOnEnabledSDHgRevAppend: function() {
            ev = new EventEmitter();
            sourceSettings = {sortDispersion: true, grid: "horizontal", append: "reversed"};
            settings = new Settings();

            var sourceCns = [
                //{x1: 0.7, x2: 99,  y1: 100, y2: 199, itemGUID: 1},
                //{x1: 0.2, x2: 99,  y1: 0,   y2: 99,  itemGUID: 2},
                //{x1: 100, x2: 199, y1: 100, y2: 199, itemGUID: 3},
                //{x1: 100, x2: 199, y1: 0,   y2: 99,  itemGUID: 4}
                {x1: 0.2, x2: 99,  y1: 0,   y2: 99,  itemGUID: 2},
                {x1: 0.7, x2: 99,  y1: 100, y2: 199, itemGUID: 1},
                {x1: 100, x2: 199, y1: 0,   y2: 99,  itemGUID: 4},
                {x1: 100, x2: 199, y1: 100, y2: 199, itemGUID: 3}
            ];

            var cnsSorter = new CnsSorter();
            var cns = cnsSorter.sortForReappend(sourceCns);
            ok(cns[0].itemGUID == 1 && cns[1].itemGUID == 2 && cns[2].itemGUID == 3
               && cns[3].itemGUID == 4, "sort on enabled sort dispersion hg rev append ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});