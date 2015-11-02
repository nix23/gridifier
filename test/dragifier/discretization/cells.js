$(document).ready(function() {
    module("Dragifier Cells");

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
                    "getIntCellsData",
                    "isAnyIntCellEmpty",
                    "isIntEnoughRowsAndCols",
                    "normalizeOverflowedCells"
                ]);
            });
        },

        _getIntCellsData: function() {
            var cells = new DragifierCells();
            var intCells = cells.getIntCellsData({int: {cols: 0, rows: 0}});
            ok(intCells.int.rows == 1 && intCells.int.cols == 1,
               "getIntCellsData with fix ok");

            intCells = cells.getIntCellsData({int: {cols: 2, rows: 0}});
            ok(intCells.int.rows == 0 && intCells.int.cols == 2,
               "getIntCellsData ok");

            clearTestData();
        },

        _isAnyIntCellEmpty: function() {
            var cells = new DragifierCells();

            var isEmpty = cells.isAnyIntCellEmpty({
                intCells: [[{isInt: true}, {isInt: true}], [{isInt: true, isInt: true}]]
            });
            ok(!isEmpty, "isAnyIntCellEmpty no empty cells ok");

            var isEmpty = cells.isAnyIntCellEmpty({
                intCells: [[{isInt: false}, {isInt: true}], [{isInt: true, isInt: true}]]
            });
            ok(isEmpty, "isAnyIntCellEmpty one cell empty ok");

            clearTestData();
        },

        _isIntEnoughRowsAndCols: function() {
            var cells = new DragifierCells();

            var isEnough = cells.isIntEnoughRowsAndCols(
                {int: {rows: 1, cols: 2}},
                {int: {rows: 2, cols: 3}}
            );
            ok(isEnough, "isIntEnoughRowsAndCols ok");

            isEnough = cells.isIntEnoughRowsAndCols(
                {int: {rows: 3, cols: 2}},
                {int: {rows: 2, cols: 2}}
            );
            ok(!isEnough, "isIntEnoughRowsAndCols not enough rows ok");

            isEnough = cells.isIntEnoughRowsAndCols(
                {int: {rows: 3, cols: 2}},
                {int: {rows: 4, cols: 1}}
            );
            ok(!isEnough, "isIntEnoughRowsAndCols not enough cols ok");

            clearTestData();
        },

        _normalizeOverflowedCells: function() {
            var cells = new DragifierCells();

            var normalized = cells.normalizeOverflowedCells(
                [[{id: 1}, {id: 2}], [{id: 3}, {id: 4}]],
                {int: {rows: 1, cols: 2}},
                {int: {rows: 2, cols: 2}}
            );
            ok(normalized.length == 2 &&
               normalized[0].id == 1 &&
               normalized[1].id == 2,
               "normalizeOverflowedCells with rows overflow ok");

            normalized = cells.normalizeOverflowedCells(
                [[{id: 1}, {id: 2}, {id: 3}], [{id: 4}, {id: 5}, {id: 6}]],
                {int: {rows: 3, cols: 1}},
                {int: {rows: 3, cols: 3}}
            );
            ok(normalized.length == 2 &&
               normalized[0].id == 1 &&
               normalized[1].id == 4,
               "normalizeOverflowedCells with cols overflow ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});