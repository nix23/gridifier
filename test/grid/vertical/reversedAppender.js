$(document).ready(function() {
    module("VgReversedAppender");

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

            var appender = new VgReversedAppender();
            appender._position._crInitialCr(connectors, grid);
            appender._position._addItemCrs({x1: 10, x2: 30, y1: 10, y2: 30}, 1);
            appender._position._addItemCrs({x1: 0, x2: 101, y1: 20, y2: 40}, 2);

            ok(PosCore.isValidInit(appender, OPS.REV_APPEND) && crs.length == 4 &&
                PosCore.crEquals(crs, 0, CRS.APPEND.REV, CRS.LEFT.TOP, 100, 0) &&
                PosCore.crEquals(crs, 1, CRS.APPEND.REV, CRS.LEFT.TOP, 9, 10, 1) &&
                PosCore.crEquals(crs, 2, CRS.APPEND.REV, CRS.BOTTOM.RIGHT, 30, 31, 1) &&
                PosCore.crEquals(crs, 3, CRS.APPEND.REV, CRS.BOTTOM.RIGHT, 101, 41, 2),
                "cr create fns ok");

            ok(!appender._position._cantFitCond({x1: 30}), "cantFitCond false ok");
            ok(appender._position._cantFitCond({x1: -1}), "cantFitCond true ok");

            clearTestData();
        },

        _position: function() {
            var appender = new VgReversedAppender();
            PosCore.testAppender(appender, "item", {
                initCrs: {
                    side1: "Bottom",
                    side2: "Top",
                    side3: "Bottom"
                },
                filterCrs: {
                    rmType: "Prepended",
                    crSide: CRS.BOTTOM.RIGHT,
                    side1: "Bottom",
                    side2: "Right",
                    type: "Append"
                },
                findCnCoords: {
                    item: "item",
                    sortedCrs: "crs",
                    insertType: "VgAppend",
                    data1: "BelowY",
                    data2: "y2",
                    data3: "Smaller",
                    data4: "Y"
                },
                createCn: {
                    item: "item",
                    sortedCrs: "crs",
                    sortedCrs2: "crs"
                },
                attachToRanges: {
                    cn: "cn"
                },
                cleanCrs: {
                    side1: "Bottom",
                    side2: "Top",
                    side3: "Bottom"
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