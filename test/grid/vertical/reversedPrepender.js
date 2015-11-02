$(document).ready(function() {
    module("VgReversedPrepender");

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
            grid = {x2: function() { return 100; }};
            rounder = {fixLowRounding: function(v) { return v; }};

            var prepender = new VgReversedPrepender();
            prepender._position._crInitialCr(connectors, grid);
            prepender._position._addItemCrs({x1: 10, x2: 30, y1: 10, y2: 30}, 1);
            prepender._position._addItemCrs({x1: 0, x2: 101, y1: 20, y2: 40}, 2);

            ok(PosCore.isValidInit(prepender, OPS.REV_PREPEND) && crs.length == 4 &&
                PosCore.crEquals(crs, 0, CRS.PREPEND.REV, CRS.LEFT.BOTTOM, 100, 0) &&
                PosCore.crEquals(crs, 1, CRS.PREPEND.REV, CRS.LEFT.BOTTOM, 9, 30, 1) &&
                PosCore.crEquals(crs, 2, CRS.PREPEND.REV, CRS.TOP.RIGHT, 30, 9, 1) &&
                PosCore.crEquals(crs, 3, CRS.PREPEND.REV, CRS.TOP.RIGHT, 101, 19, 2),
                "cr create fns ok");

            ok(!prepender._position._cantFitCond({x1: 30}), "cantFitCond false ok");
            ok(prepender._position._cantFitCond({x1: -1}), "cantFitCond true ok");

            clearTestData();
        },

        _position: function() {
            var prepender = new VgPrepender();
            PosCore.testPrepender(prepender, "item", {
                initCrs: {
                    side1: "Top",
                    side2: "Bottom",
                    side3: "Top"
                },
                filterCrs: {
                    rmType: "Appended",
                    crSide: CRS.TOP.LEFT,
                    side1: "Top",
                    side2: "Left",
                    type: "Prepend"
                },
                findCnCoords: {
                    item: "item",
                    sortedCrs: "crs",
                    insertType: "VgPrepend",
                    data1: "AboveY",
                    data2: "y1",
                    data3: "Bigger",
                    data4: "Y"
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
                    side1: "Top",
                    side2: "Bottom",
                    side3: "Top"
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