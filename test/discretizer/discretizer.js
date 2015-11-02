$(document).ready(function() {
    module("Discretizer");

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
                    "cells",
                    "discretize",
                    "intCellsToCoords",
                    "markIntCellsBy",
                    "getAllWithIntCenter"
                ]);
            });
        },

        _cells: function() {
            var discretizer = new Discretizer();
            ok(Dom.isArray(discretizer.cells()), "cells ok");

            clearTestData();
        },

        _discretize: function() {
            ev = new EventEmitter();
            settings = new Settings();

            var disc = {x: null, y: null};
            var revDisc = {x: null, y: null};

            discretizerCore = {
                discretizeOnDefAppend: function(xstep, ystep) {
                    disc.x = xstep;
                    disc.y = ystep;
                    return "cells";
                },
                discretizeOnRevAppend: function(xstep, ystep) {
                    revDisc.x = xstep;
                    revDisc.y = ystep;
                    return "cells";
                }
            };

            var discretizer = new Discretizer();

            cnsCore = {
                getMinWidth: function() { return 10; },
                getMinHeight: function() { return 20; }
            };
            discretizer.discretize();
            ok(discretizer._cells == "cells" &&
               disc.x == 10 && disc.y == 20,
               "discretizeOnDefAppend ok");

            sourceSettings = {append: "reversed"};
            settings = new Settings();
            discretizer.discretize();
            ok(discretizer._cells == "cells" &&
               revDisc.x == 10 && revDisc.y == 20,
               "discretizeOnRevAppend ok");

            clearTestData();
        },

        _intCellsToCoords: function() {
            var discretizer = new Discretizer();

            var coords = discretizer.intCellsToCoords([
                {x1: 30, x2: 100, y1: 30, y2: 100},
                {x1: 20, x2: 30, y1: 31, y2: 32},
                {x1: 30, x2: 110, y1: 31, y2: 32},
                {x1: 30, x2: 100, y1: 0, y2: 300}
            ]);
            ok(coords.x1 == 20 && coords.x2 == 110 &&
               coords.y1 == 0 && coords.y2 == 300,
               "intCellsToCoords ok");

            clearTestData();
        },

        _markIntCellsBy: function() {
            cnsIntersector = {};
            cnsIntersector.isIntersectingAny = function(coordsArr, cn) {
                if(cn != "cn") return false;
                var coords = coordsArr[0];
                if(coords.x1 == 100 && coords.y1 == 100 &&
                   coords.x2 == 100 && coords.y2 == 100)
                    return true;
                else
                    return false;
            };

            var discretizer = new Discretizer();
            discretizer._cells = [
                [{centerX: 100, centerY: 100, isInt: false}],
                [{centerX: 150, centerY: 150, isInt: false}]
            ];
            discretizer.markIntCellsBy("cn");
            ok(discretizer._cells[0][0].isInt &&
               !discretizer._cells[1][0].isInt,
               "markIntCellsBy ok");

            clearTestData();
        },

        _getAllWithIntCenter: function() {
            cnsIntersector = {};
            cnsIntersector.isIntersectingAny = function(coordsArr, coords) {
                var c = coordsArr[0];
                if(coords != "coords") return false;
                if(c.x1 == 100 && c.x2 == 100 && c.y1 == 100 &&
                   c.y2 == 100) return true;
                if(c.x1 == 150) return true;
                if(c.x1 == 300) return true;
                return false;
            };

            var discretizer = new Discretizer();
            discretizer._cells = [
                [{centerX: 10, centerY: 10}, {centerX: 100, centerY: 100}],
                [{centerX: 150, centerY: 150}, {centerX: 300, centerY: 300}]
            ];

            var data = discretizer.getAllCellsWithIntCenter("coords");
            ok(
                data.int.rows == 2 &&
                data.int.cols == 2 &&
                data.intCells[0][0].centerX == 100 &&
                data.intCells[1][0].centerX == 150 &&
                data.intCells[1][1].centerX == 300,
                "getAllCellsWithIntCenter ok"
            );

            discretizer._cells = [
                [{centerX: 300, centerY: 300}, {centerX: 10, centerY: 10}],
                [{centerX: 10, centerY: 10}, {centerX: 10, centerY: 10}]
            ];
            data = discretizer.getAllCellsWithIntCenter("coords");
            ok(
                data.int.rows == 1 &&
                data.int.cols == 1 &&
                data.intCells[0][0].centerX == 300,
                "getAllCellsWithIntCenter with single cell ok"
            );

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});