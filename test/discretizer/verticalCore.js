$(document).ready(function() {
    module("Discretizer verticalCore tests.");

    var discretizeGridWithDefaultAppendTester = {
        _before: function() {
            ;
        },

        _after: function() {
            ;
        },

        runTests: function() {
            var me = this;

            test("discretizeGridWithDefaultAppend", function(assert) {
                me._before.call(me);

                me._testCallOn20pxWidth20pxHeightGridAnd10pxHorizontal10pxVerticalDiscretizationStep.call(me);

                me._after.call(me);
            });
        },

        _testCallOn20pxWidth20pxHeightGridAnd10pxHorizontal10pxVerticalDiscretizationStep: function() {
            var gridifierMock = {
                getGridX2: function() { return 19; },
                getGridY2: function() { return 19; }
            };

            var discretizerVerticalCore = new Gridifier.Discretizer.VerticalCore(
                gridifierMock, null
            );
            var discretizationCells = discretizerVerticalCore.discretizeGridWithDefaultAppend(10, 10);
            
            var isCell00Valid = (discretizationCells[0][0].x1 == 0 && discretizationCells[0][0].x2 == 9 &&
                                 discretizationCells[0][0].y1 == 0 && discretizationCells[0][0].y2 == 9 &&
                                 discretizationCells[0][0][Gridifier.Discretizer.CELL_CENTER_X] == 5 &&
                                 discretizationCells[0][0][Gridifier.Discretizer.CELL_CENTER_Y] == 5);
            ok(
                isCell00Valid,
                "call on grid[w=20px, h=20px], discretizationStep[h=10, v=10], Cell[0][0] is valid"
            );

            var isCell01Valid = (discretizationCells[0][1].x1 == 10 && discretizationCells[0][1].x2 == 19 &&
                                 discretizationCells[0][1].y1 == 0 && discretizationCells[0][1].y2 == 9 &&
                                 discretizationCells[0][1][Gridifier.Discretizer.CELL_CENTER_X] == 15 &&
                                 discretizationCells[0][1][Gridifier.Discretizer.CELL_CENTER_Y] == 5);
            ok(
                isCell01Valid,
                "call on grid[w=20px, h=20px], discretizationStep[h=10, v=10], Cell[0][1] is valid"
            );

            var isCell10Valid = (discretizationCells[1][0].x1 == 0 && discretizationCells[1][0].x2 == 9 &&
                                 discretizationCells[1][0].y1 == 10 && discretizationCells[1][0].y2 == 19 &&
                                 discretizationCells[1][0][Gridifier.Discretizer.CELL_CENTER_X] == 5 &&
                                 discretizationCells[1][0][Gridifier.Discretizer.CELL_CENTER_Y] == 15);
            ok(
                isCell10Valid,
                "call on grid[w=20px, h=20px], discretizationStep[h=10, v=10], Cell[1][0] is valid"
            );

            var isCell11Valid = (discretizationCells[1][1].x1 == 10 && discretizationCells[1][1].x2 == 19 &&
                                 discretizationCells[1][1].y1 == 10 && discretizationCells[1][1].y2 == 19 &&
                                 discretizationCells[1][1][Gridifier.Discretizer.CELL_CENTER_X] == 15 &&
                                 discretizationCells[1][1][Gridifier.Discretizer.CELL_CENTER_Y] == 15);
            ok(
                isCell11Valid,
                "call on grid[w=20px, h=20px], discretizationStep[h=10, v=10], Cell[1][1] is valid"
            );
        }
    };

    discretizeGridWithDefaultAppendTester.runTests();

    var discretizeGridWithReversedAppendTester = {
        _before: function() {
            ;
        },

        _after: function() {
            ;
        },

        runTests: function() {
            var me = this;

            test("discretizeGridWithDefaultAppend", function(assert) {
                me._before.call(me);

                me._testCallOn20pxWidth20pxHeightGridAnd10pxHorizontal10pxVerticalDiscretizationStep.call(me);

                me._after.call(me);
            });
        },

        _testCallOn20pxWidth20pxHeightGridAnd10pxHorizontal10pxVerticalDiscretizationStep: function() {
            var gridifierMock = {
                getGridX2: function() { return 19; },
                getGridY2: function() { return 19; }
            };

            var discretizerVerticalCore = new Gridifier.Discretizer.VerticalCore(
                gridifierMock, null
            );
            var discretizationCells = discretizerVerticalCore.discretizeGridWithReversedAppend(10, 10);
            
            var isCell00Valid = (discretizationCells[0][0].x1 == 0 && discretizationCells[0][0].x2 == 9 &&
                                 discretizationCells[0][0].y1 == 0 && discretizationCells[0][0].y2 == 9 &&
                                 discretizationCells[0][0][Gridifier.Discretizer.CELL_CENTER_X] == 5 &&
                                 discretizationCells[0][0][Gridifier.Discretizer.CELL_CENTER_Y] == 5);
            ok(
                isCell00Valid,
                "call on grid[w=20px, h=20px], discretizationStep[h=10, v=10], Cell[0][0] is valid"
            );

            var isCell01Valid = (discretizationCells[0][1].x1 == 10 && discretizationCells[0][1].x2 == 19 &&
                                 discretizationCells[0][1].y1 == 0 && discretizationCells[0][1].y2 == 9 &&
                                 discretizationCells[0][1][Gridifier.Discretizer.CELL_CENTER_X] == 15 &&
                                 discretizationCells[0][1][Gridifier.Discretizer.CELL_CENTER_Y] == 5);
            ok(
                isCell01Valid,
                "call on grid[w=20px, h=20px], discretizationStep[h=10, v=10], Cell[0][1] is valid"
            );

            var isCell10Valid = (discretizationCells[1][0].x1 == 0 && discretizationCells[1][0].x2 == 9 &&
                                 discretizationCells[1][0].y1 == 10 && discretizationCells[1][0].y2 == 19 &&
                                 discretizationCells[1][0][Gridifier.Discretizer.CELL_CENTER_X] == 5 &&
                                 discretizationCells[1][0][Gridifier.Discretizer.CELL_CENTER_Y] == 15);
            ok(
                isCell10Valid,
                "call on grid[w=20px, h=20px], discretizationStep[h=10, v=10], Cell[1][0] is valid"
            );

            var isCell11Valid = (discretizationCells[1][1].x1 == 10 && discretizationCells[1][1].x2 == 19 &&
                                 discretizationCells[1][1].y1 == 10 && discretizationCells[1][1].y2 == 19 &&
                                 discretizationCells[1][1][Gridifier.Discretizer.CELL_CENTER_X] == 15 &&
                                 discretizationCells[1][1][Gridifier.Discretizer.CELL_CENTER_Y] == 15);
            ok(
                isCell11Valid,
                "call on grid[w=20px, h=20px], discretizationStep[h=10, v=10], Cell[1][1] is valid"
            );
        }
    };

    discretizeGridWithReversedAppendTester.runTests();
});