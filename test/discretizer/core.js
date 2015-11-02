$(document).ready(function() {
    module("Discretizer Core");

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
                    "normalizeOverflows",
                    "normalizeVgItemXCoords",
                    "normalizeVgItemYCoords",
                    "normalizeHgItemXCoords",
                    "normalizeHgItemYCoords"
                ]);
            });
        },

        _normalizeOverflows: function() {
            ev = new EventEmitter();
            settings = new Settings();

            srManager = {};
            srManager.outerWidth = function(item, includeMargins) {
                if(!includeMargins) return 0;
                if(item.id == "item") return 113;
            };
            grid = {};
            grid.x2 = function() { return 150; };

            var core = new DiscretizerCore();

            var coords = core.normalizeCnXCoords({id: "item"}, {x1: -2, x2: 110});
            ok(coords.x1 == 0 && coords.x2 == 112, "normalize overflow < 0 ok");

            srManager.outerWidth = function() { return 151; };
            coords = core.normalizeCnXCoords({id: "item"}, {x1: 10, x2: 160});
            ok(coords.x1 == 0 && coords.x2 == 150, "normalize overflow > grid size ok");

            clearTestData();
        },

        _normalizeVgItemXCoords: function() {
            ev = new EventEmitter();
            settings = new Settings();

            srManager = {};
            srManager.outerWidth = function(item, includeMargins) {
                if(!includeMargins) return 0;
                if(item.id == "item") return 10;
            };
            grid = {};
            grid.x2 = function() { return 100; };

            var core = new DiscretizerCore();

            var coords = core.normalizeCnXCoords({id: "item"}, {x1: 10, x2: 25});
            ok(coords.x1 == 16, "normalizeCnXCoords itemW < cnW def app ok");

            sourceSettings = {append: "reversed"};
            settings = new Settings();
            coords = core.normalizeCnXCoords({id: "item"}, {x1: 10, x2: 25});
            ok(coords.x2 == 19, "normalizeCnXCoords itemW < cnW rev app ok");

            coords = core.normalizeCnXCoords({id: "item"}, {x1: 2, x2: 4});
            ok(coords.x2 == 11, "normalizeCnXCoords cnW < itemW rev app ok");

            clearTestData();
        },

        _normalizeVgItemYCoords: function() {
            ev = new EventEmitter();
            settings = new Settings();

            srManager = {};
            srManager.outerHeight = function(item, includeMargins) {
                if(!includeMargins) return 0;
                if(item.id == "item") return 10;
            };
            grid = {};
            grid.y2 = function() { return 100; };

            var core = new DiscretizerCore();

            var coords = core.normalizeCnYCoords({id: "item"}, {y1: 10, y2: 25});
            ok(coords.y2 == 19, "normalizeCnYCoords itemH < cnH def app ok");

            sourceSettings = {append: "reversed"};
            settings = new Settings();
            coords = core.normalizeCnYCoords({id: "item"}, {y1: 10, y2: 25});
            ok(coords.y2 == 19, "normalizeCnYCoords itemH < cnH rev app ok");

            coords = core.normalizeCnYCoords({id: "item"}, {y1: 2, y2: 4});
            ok(coords.y2 == 11, "normalizeCnYCoords cnY < itemY rev app ok");

            clearTestData();
        },

        _normalizeHgItemXCoords: function() {
            ev = new EventEmitter();
            sourceSettings = {grid: "horizontal"};
            settings = new Settings();

            srManager = {};
            srManager.outerWidth = function(item, includeMargins) {
                if(!includeMargins) return 0;
                if(item.id == "item") return 10;
            };
            grid = {};
            grid.x2 = function() { return 100; };

            var core = new DiscretizerCore();

            var coords = core.normalizeCnXCoords({id: "item"}, {x1: 10, x2: 25});
            ok(coords.x2 == 19, "normalizeCnXCoords itemW < cnW def app ok");

            sourceSettings = {grid: "horizontal", append: "reversed"};
            settings = new Settings();
            coords = core.normalizeCnXCoords({id: "item"}, {x1: 10, x2: 25});
            ok(coords.x2 == 19, "normalizeCnXCoords itemW < cnW rev app ok");

            coords = core.normalizeCnXCoords({id: "item"}, {x1: 2, x2: 4});
            ok(coords.x2 == 11, "normalizeCnXCoords cnW < itemW rev app ok");

            clearTestData();
        },

        _normalizeHgItemYCoords: function() {
            ev = new EventEmitter();
            sourceSettings = {grid: "horizontal"};
            settings = new Settings();

            srManager = {};
            srManager.outerHeight = function(item, includeMargins) {
                if(!includeMargins) return 0;
                if(item.id == "item") return 10;
            };
            grid = {};
            grid.y2 = function() { return 100; };

            var core = new DiscretizerCore();

            var coords = core.normalizeCnYCoords({id: "item"}, {y1: 10, y2: 25});
            ok(coords.y1 == 16, "normalizeCnYCoords itemH < cnH def app ok");

            sourceSettings = {grid: "horizontal", append: "reversed"};
            settings = new Settings();
            coords = core.normalizeCnYCoords({id: "item"}, {y1: 10, y2: 25});
            ok(coords.y2 == 19, "normalizeCnYCoords itemH < cnH rev app ok");

            coords = core.normalizeCnYCoords({id: "item"}, {y1: 2, y2: 4});
            ok(coords.y2 == 11, "normalizeCnYCoords cnJ < itemH rev app ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});