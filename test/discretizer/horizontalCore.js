$(document).ready(function() {
    module("Discretizer horizontalCore tests.");

    var _transposeCellsTester = {
        _before: function() {
            ;
        },

        _after: function() {

        },

        runTests: function() {
            var me = this;

            test("_transposeCells", function(assert) {
                me._before.call(me);

                me._testAreResultArraysSame.call(me);
                me._testWithOneRowOneColArrayCall.call(me);
                me._testWithThreeRowsOneColArrayCall.call(me);
                me._testWithThreeRowsThreeColsArrayCall.call(me);

                me._after.call(me);
            });
        },

        _areResultArraysSame: function(expectedResultsArray, resultsArray) {
            if(expectedResultsArray.length != resultsArray.length)
                return false;

            for(var i = 0; i < expectedResultsArray.length; i++) {
                if(expectedResultsArray[i].length != resultsArray[i].length)
                    return false;
            }

            var haveBothArraysSameElems = true;
            for(var i = 0; i < expectedResultsArray.length; i++) {
                for(var j = 0; j < expectedResultsArray[i].length; j++) {
                    if(expectedResultsArray[i][j] != resultsArray[i][j])
                        haveBothArraysSameElems = false;
                }
            }

            return haveBothArraysSameElems;
        },

        _testAreResultArraysSame: function() {
            ok(
                this._areResultArraysSame([[1]], [[1]]),
                "call areResultArraysSame with [[1]], [[1]]"
            );

            ok(
                !this._areResultArraysSame([[1]], [[1, 2]]),
                "call areResultArraysSame with [[1]], [[1, 2]]"
            );

            ok(
                this._areResultArraysSame([[1, 5], [6,7,8]], [[1, 5], [6,7,8]]),
                "call areResultArraysSame with [[1, 5], [6,7,8]], [[1, 5], [6,7,8]]"
            );
        },

        _testWithOneRowOneColArrayCall: function() {
            var discretizerHorizontalCore = new Gridifier.Discretizer.HorizontalCore(
                null, null
            );

            ok(
                this._areResultArraysSame([[5]], discretizerHorizontalCore._transposeCells([[5]])),
                "call with [[5]] array"
            );
        },

        _testWithThreeRowsOneColArrayCall: function() {
            var discretizerHorizontalCore = new Gridifier.Discretizer.HorizontalCore(
                null, null
            );

            ok(
                this._areResultArraysSame([[1,2,3]], discretizerHorizontalCore._transposeCells([[1],[2],[3]])),
                "call with [[1],[2],[3]] array"
            );
        },

        _testWithThreeRowsThreeColsArrayCall: function() {
            var discretizerHorizontalCore = new Gridifier.Discretizer.HorizontalCore(
                null, null
            );

            ok(
                this._areResultArraysSame(
                    [[1,4,7], [2,5,8], [3,6,9]],
                    discretizerHorizontalCore._transposeCells([[1,2,3], [4,5,6], [7,8,9]])
                ),
                "call with [[1,2,3], [4,5,6], [7,8,9]] array"
            );
        }
    };

    _transposeCellsTester.runTests();

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

                me._testCallOn21pxWidth21pxHeightGridAnd10pxHorizontal10pxVerticalDiscretizationStep.call(me);

                me._after.call(me);
            });
        },

        _testCallOn21pxWidth21pxHeightGridAnd10pxHorizontal10pxVerticalDiscretizationStep: function() {
            var gridifierMock = {
                getGridX2: function() { return 20; },
                getGridY2: function() { return 20; }
            };

            var discretizerHorizontalCore = new Gridifier.Discretizer.HorizontalCore(
                gridifierMock, null
            );
            var discretizationCells = discretizerHorizontalCore.discretizeGridWithDefaultAppend(10, 10);
            
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

            test("discretizeGridWithReversedAppend", function(assert) {
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

            var discretizerHorizontalCore = new Gridifier.Discretizer.HorizontalCore(
                gridifierMock, null
            );
            var discretizationCells = discretizerHorizontalCore.discretizeGridWithReversedAppend(10, 10);
            
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