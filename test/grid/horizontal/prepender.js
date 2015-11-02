$(document).ready(function() {
    module("HgPrepender");

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
                    "createPosition",
                    "position"
                ]);
            });
        },

        _createPosition: function() {
            var crs = [];
            connectors = {
                create: function(type, side, x, y, itemGUID) {
                    crs.push({type: type, side: side, x: x, y: y, itemGUID: itemGUID});
                }
            };
            grid = {y2: function() { return 100; }};
            rounder = {fixLowRounding: function(v) { return v; }};

            var prepender = new HgPrepender();
            prepender._position._crInitialCr(connectors, grid);
            prepender._position._addItemCrs({x1: 10, x2: 30, y1: 10, y2: 30}, 1);
            prepender._position._addItemCrs({x1: 50, x2: 101, y1: 0, y2: 40}, 2);

            ok(PosCore.isValidInit(prepender, OPS.PREPEND) && crs.length == 4 &&
                PosCore.crEquals(crs, 0, CRS.PREPEND.DEF, CRS.TOP.RIGHT, 0, 100) &&
                PosCore.crEquals(crs, 1, CRS.PREPEND.DEF, CRS.TOP.RIGHT, 30, 9, 1) &&
                PosCore.crEquals(crs, 2, CRS.PREPEND.DEF, CRS.LEFT.BOTTOM, 9, 30, 1) &&
                PosCore.crEquals(crs, 3, CRS.PREPEND.DEF, CRS.LEFT.BOTTOM, 49, 40, 2),
                "cr create fns ok");

            ok(!prepender._position._cantFitCond({y1: 30}), "cantFitCond false ok");
            ok(prepender._position._cantFitCond({y1: -1}), "cantFitCond true ok");

            clearTestData();
        },

        _position: function() {
            var prepender = new HgPrepender();
            PosCore.testPrepender(prepender, "item", {
                initCrs: {
                    side1: "Left",
                    side2: "Right",
                    side3: "Left"
                },
                filterCrs: {
                    rmType: "Appended",
                    crSide: CRS.LEFT.BOTTOM,
                    side1: "Left",
                    side2: "Bottom",
                    type: "Prepend"
                },
                findCnCoords: {
                    item: "item",
                    sortedCrs: "crs",
                    insertType: "HgPrepend",
                    data1: "BeforeX",
                    data2: "x1",
                    data3: "Bigger",
                    data4: "X"
                },
                createCn: {
                    item: "item",
                    sortedCrs: "crs",
                    sortedCrs2: "crs"
                },
                markIfFirstPrepended: {
                    item: "item"
                },
                fixAllXYPosAfterPrepend: {
                    cn: "cn",
                    allCrs: "allCrs"
                },
                attachToRanges: {
                    cn: "cn"
                },
                cleanCrs: {
                    side1: "Left",
                    side2: "Right",
                    side3: "Left"
                },
                renderAfterPrependFix: {
                    cn: "cn"
                },
                render: {
                    item: "item",
                    cn: "cn"
                }
            });

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});