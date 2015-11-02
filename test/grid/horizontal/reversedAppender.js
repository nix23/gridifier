$(document).ready(function() {
    module("HgReversedAppender");

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

            var appender = new HgReversedAppender();
            appender._position._crInitialCr(connectors, grid);
            appender._position._addItemCrs({x1: 10, x2: 30, y1: 10, y2: 30}, 1);
            appender._position._addItemCrs({x1: 0, x2: 101, y1: 0, y2: 40}, 2);

            ok(PosCore.isValidInit(appender, OPS.REV_APPEND) && crs.length == 4 &&
                PosCore.crEquals(crs, 0, CRS.APPEND.REV, CRS.TOP.LEFT, 0, 100) &&
                PosCore.crEquals(crs, 1, CRS.APPEND.REV, CRS.TOP.LEFT, 10, 9, 1) &&
                PosCore.crEquals(crs, 2, CRS.APPEND.REV, CRS.RIGHT.BOTTOM, 31, 30, 1) &&
                PosCore.crEquals(crs, 3, CRS.APPEND.REV, CRS.RIGHT.BOTTOM, 102, 40, 2),
                "cr create fns ok");

            ok(!appender._position._cantFitCond({y1: 30}), "cantFitCond false ok");
            ok(appender._position._cantFitCond({y1: -1}), "cantFitCond true ok");

            clearTestData();
        },

        _position: function() {
            var appender = new HgReversedAppender();
            PosCore.testAppender(appender, "item", {
                initCrs: {
                    side1: "Right",
                    side2: "Left",
                    side3: "Right"
                },
                filterCrs: {
                    rmType: "Prepended",
                    crSide: CRS.RIGHT.BOTTOM,
                    side1: "Right",
                    side2: "Bottom",
                    type: "Append"
                },
                findCnCoords: {
                    item: "item",
                    sortedCrs: "crs",
                    insertType: "HgAppend",
                    data1: "BehindX",
                    data2: "x2",
                    data3: "Smaller",
                    data4: "X"
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
                    side1: "Right",
                    side2: "Left",
                    side3: "Right"
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