$(document).ready(function() {
    module("HgReversedPrepender");

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
            rounder = {fixHighRounding: function(v) { return v; }};

            var prepender = new HgReversedPrepender();
            prepender._position._crInitialCr(connectors, grid);
            prepender._position._addItemCrs({x1: 10, x2: 30, y1: 10, y2: 30}, 1);
            prepender._position._addItemCrs({x1: 0, x2: 101, y1: 20, y2: 100}, 2);

            ok(PosCore.isValidInit(prepender, OPS.REV_PREPEND) && crs.length == 4 &&
                PosCore.crEquals(crs, 0, CRS.PREPEND.REV, CRS.LEFT.TOP, 0, 0) &&
                PosCore.crEquals(crs, 1, CRS.PREPEND.REV, CRS.BOTTOM.RIGHT, 30, 31, 1) &&
                PosCore.crEquals(crs, 2, CRS.PREPEND.REV, CRS.LEFT.TOP, 9, 10, 1) &&
                PosCore.crEquals(crs, 3, CRS.PREPEND.REV, CRS.LEFT.TOP, -1, 20, 2),
                "cr create fns ok");

            ok(!prepender._position._cantFitCond({y2: 30}), "cantFitCond false ok");
            ok(prepender._position._cantFitCond({y2: 130}), "cantFitCond true ok");

            clearTestData();
        },

        _position: function() {
            var prepender = new HgReversedPrepender();
            PosCore.testPrepender(prepender, "item", {
                initCrs: {
                    side1: "Left",
                    side2: "Right",
                    side3: "Left"
                },
                filterCrs: {
                    rmType: "Appended",
                    crSide: CRS.LEFT.TOP,
                    side1: "Left",
                    side2: "Top",
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