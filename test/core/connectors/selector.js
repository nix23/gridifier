$(document).ready(function() {
    module("CrsSelector");

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
                    "selectOnlyMostTopBottom",
                    "selectOnlyMostLeftRight",
                    "selectOnlyFromAppended",
                    "selectOnlyFromPrepended"
                ]);
            });
        },

        _selectOnlyMostTopBottom: function() {
            var crsSelector = new CrsSelector();
            var crs = [
                {x: 10, y: 300, itemGUID: 1, side: CRS.LEFT.TOP, type: CRS.APPEND.DEF},
                {x: 30, y: 150, itemGUID: 2, side: CRS.RIGHT.BOTTOM, type: CRS.APPEND.DEF},
                {x: 70, y: 100, itemGUID: 3, side: CRS.LEFT.TOP, type: CRS.APPEND.DEF},
                {x: 30, y: 50,  itemGUID: 4, side: CRS.BOTTOM.LEFT, type: CRS.APPEND.DEF}
            ];
            crsSelector.attach(crs);
            crsSelector.selectOnlyMostBottom(CRS.LEFT.TOP);

            var scrs = crsSelector.getSelected();
            ok(scrs.length == 3 && scrs[0].itemGUID == 1 && scrs[1].itemGUID == 2 && scrs[2].itemGUID == 4,
               "selectOnlyMostBottom from LEFT.TOP ok");

            var crs = [
                {x: 10, y: 300, itemGUID: 1, side: CRS.RIGHT.TOP, type: CRS.APPEND.DEF},
                {x: 30, y: 150, itemGUID: 2, side: CRS.RIGHT.BOTTOM, type: CRS.APPEND.DEF},
                {x: 70, y: 100, itemGUID: 3, side: CRS.RIGHT.TOP, type: CRS.APPEND.DEF},
                {x: 30, y: 50,  itemGUID: 4, side: CRS.BOTTOM.LEFT, type: CRS.APPEND.DEF}
            ];
            crsSelector.attach(crs);
            crsSelector.selectOnlyMostTop(CRS.RIGHT.TOP);

            var scrs = crsSelector.getSelected();
            ok(scrs.length == 3 && scrs[0].itemGUID == 2 && scrs[1].itemGUID == 3 && scrs[2].itemGUID == 4,
               "selectOnlyMostTop from RIGHT.TOP ok");

            clearTestData();
        },

        _selectOnlyMostLeftRight: function() {
            var crsSelector = new CrsSelector();
            var crs = [
                {x: 10, y: 300, itemGUID: 1, side: CRS.LEFT.TOP, type: CRS.APPEND.DEF},
                {x: 30, y: 150, itemGUID: 2, side: CRS.RIGHT.BOTTOM, type: CRS.APPEND.DEF},
                {x: 70, y: 100, itemGUID: 3, side: CRS.LEFT.TOP, type: CRS.APPEND.DEF},
                {x: 90, y: 50,  itemGUID: 4, side: CRS.BOTTOM.LEFT, type: CRS.APPEND.DEF},
                {x: 120, y: 60, itemGUID: 5, side: CRS.LEFT.TOP, type: CRS.APPEND.DEF}
            ];
            crsSelector.attach(crs);
            crsSelector.selectOnlyMostLeft(CRS.LEFT.TOP);

            var scrs = crsSelector.getSelected();
            ok(scrs.length == 3 && scrs[0].itemGUID == 1 && scrs[1].itemGUID == 2 && scrs[2].itemGUID == 4,
                "selectOnlyMostLeft from LEFT.TOP ok");

            var crs = [
                {x: 10, y: 300, itemGUID: 1, side: CRS.RIGHT.TOP, type: CRS.APPEND.DEF},
                {x: 30, y: 150, itemGUID: 2, side: CRS.RIGHT.BOTTOM, type: CRS.APPEND.DEF},
                {x: 70, y: 100, itemGUID: 3, side: CRS.RIGHT.TOP, type: CRS.APPEND.DEF},
                {x: 30, y: 50,  itemGUID: 4, side: CRS.BOTTOM.LEFT, type: CRS.APPEND.DEF},
                {x: 100, y: 20, itemGUID: 5, side: CRS.RIGHT.TOP, type: CRS.APPEND.DEF}
            ];
            crsSelector.attach(crs);
            crsSelector.selectOnlyMostRight(CRS.RIGHT.TOP);

            var scrs = crsSelector.getSelected();
            ok(scrs.length == 3 && scrs[0].itemGUID == 2 && scrs[1].itemGUID == 4 && scrs[2].itemGUID == 5,
                "selectOnlyMostRight from RIGHT.TOP ok");

            clearTestData();
        },

        _selectOnlyFromAppended: function() {
            guid = {wasPrepended: function(guid) { return guid == 3; }};
            connectors = new Connectors();

            var i = CRS.INITIAL_GUID;
            var crs = [
                {x: 10, y: 300, itemGUID: i, side: CRS.RIGHT.TOP,    type: CRS.APPEND.DEF},
                {x: 30, y: 150, itemGUID: 2, side: CRS.RIGHT.BOTTOM, type: CRS.APPEND.DEF},
                {x: 70, y: 100, itemGUID: 3, side: CRS.RIGHT.TOP,    type: CRS.PREPEND.DEF},
                {x: 30, y: 50,  itemGUID: 4, side: CRS.BOTTOM.LEFT,  type: CRS.APPEND.DEF},
                {x: 100, y: 20, itemGUID: 5, side: CRS.RIGHT.TOP,    type: CRS.APPEND.DEF},
                {x: 130, y: 35, itemGUID: 6, side: CRS.RIGHT.BOTTOM, type: CRS.APPEND.DEF}
            ];

            var crsSelector = new CrsSelector();
            crsSelector.attach(crs);
            crsSelector.selectOnlyFromAppended(CRS.RIGHT.BOTTOM);

            var scrs = crsSelector.getSelected();
            ok(scrs.length == 4 && scrs[0].itemGUID == CRS.INITIAL_GUID &&
               scrs[1].itemGUID == 2 && scrs[2].itemGUID == 3 && scrs[3].itemGUID == 6,
               "selectOnlyFromAppended(rightBottom) ok");

            clearTestData();
        },

        _selectOnlyFromPrepended: function() {
            guid = {wasPrepended: function(guid) { return guid != 3; }};
            connectors = new Connectors();

            var i = CRS.INITIAL_GUID;
            var crs = [
                {x: 10, y: 300, itemGUID: i, side: CRS.RIGHT.TOP,    type: CRS.PREPEND.DEF},
                {x: 30, y: 150, itemGUID: 2, side: CRS.RIGHT.BOTTOM, type: CRS.PREPEND.DEF},
                {x: 70, y: 100, itemGUID: 3, side: CRS.RIGHT.TOP,    type: CRS.APPEND.DEF},
                {x: 30, y: 50,  itemGUID: 4, side: CRS.BOTTOM.LEFT,  type: CRS.PREPEND.DEF},
                {x: 100, y: 20, itemGUID: 5, side: CRS.RIGHT.TOP,    type: CRS.PREPEND.DEF},
                {x: 130, y: 35, itemGUID: 6, side: CRS.RIGHT.BOTTOM, type: CRS.PREPEND.DEF}
            ];

            var crsSelector = new CrsSelector();
            crsSelector.attach(crs);
            crsSelector.selectOnlyFromPrepended(CRS.RIGHT.BOTTOM);

            var scrs = crsSelector.getSelected();
            ok(scrs.length == 4 && scrs[0].itemGUID == CRS.INITIAL_GUID &&
               scrs[1].itemGUID == 2 && scrs[2].itemGUID == 3 && scrs[3].itemGUID == 6,
               "selectOnlyFromPrepended(rightBottom) ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});