$(document).ready(function() {
    module("Discretizer yCore");

    var discretizeGridWithDefaultAppendTester = {
        _before: function() {
            ;
        },

        _after: function() {
            ;
        },

        runTests: function() {
            var me = this;

            test("onDefaultAppend", function(assert) {
                me._before.call(me);

                me._testCallOn20pxWidth20pxHeightGridAnd10pxHorizontal10pxVerticalDiscretizationStep.call(me);

                me._after.call(me);
            });
        },

        _testCallOn20pxWidth20pxHeightGridAnd10pxHorizontal10pxVerticalDiscretizationStep: function() {
            ev = new EventEmitter();
            settings = new Settings();
            grid = {
                x2: function() { return 19; },
                y2: function() { return 19; }
            };

            var discretizerVerticalCore = new DiscretizerCore();
            var discretizationCells = discretizerVerticalCore.discretizeOnDefAppend(10, 10);
            
            var isCell00Valid = (discretizationCells[0][0].x1 == 0 && discretizationCells[0][0].x2 == 9 &&
                                 discretizationCells[0][0].y1 == 0 && discretizationCells[0][0].y2 == 9 &&
                                 discretizationCells[0][0].centerX == 5 &&
                                 discretizationCells[0][0].centerY == 5);
            ok(
                isCell00Valid,
                "call on grid[w=20px, h=20px], discretizationStep[h=10, v=10], Cell[0][0] is valid"
            );

            var isCell01Valid = (discretizationCells[0][1].x1 == 10 && discretizationCells[0][1].x2 == 19 &&
                                 discretizationCells[0][1].y1 == 0 && discretizationCells[0][1].y2 == 9 &&
                                 discretizationCells[0][1].centerX == 15 &&
                                 discretizationCells[0][1].centerY == 5);
            ok(
                isCell01Valid,
                "call on grid[w=20px, h=20px], discretizationStep[h=10, v=10], Cell[0][1] is valid"
            );

            var isCell10Valid = (discretizationCells[1][0].x1 == 0 && discretizationCells[1][0].x2 == 9 &&
                                 discretizationCells[1][0].y1 == 10 && discretizationCells[1][0].y2 == 19 &&
                                 discretizationCells[1][0].centerX == 5 &&
                                 discretizationCells[1][0].centerY == 15);
            ok(
                isCell10Valid,
                "call on grid[w=20px, h=20px], discretizationStep[h=10, v=10], Cell[1][0] is valid"
            );

            var isCell11Valid = (discretizationCells[1][1].x1 == 10 && discretizationCells[1][1].x2 == 19 &&
                                 discretizationCells[1][1].y1 == 10 && discretizationCells[1][1].y2 == 19 &&
                                 discretizationCells[1][1].centerX == 15 &&
                                 discretizationCells[1][1].centerY == 15);
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

            test("onRevAppend", function(assert) {
                me._before.call(me);

                me._testCallOn20pxWidth20pxHeightGridAnd10pxHorizontal10pxVerticalDiscretizationStep.call(me);

                me._after.call(me);
            });
        },

        _testCallOn20pxWidth20pxHeightGridAnd10pxHorizontal10pxVerticalDiscretizationStep: function() {
            ev = new EventEmitter();
            sourceSettings = {append: "reversed"};
            settings = new Settings();
            grid = {
                x2: function() { return 19; },
                y2: function() { return 19; }
            };

            var discretizerVerticalCore = new DiscretizerCore();
            var discretizationCells = discretizerVerticalCore.discretizeOnRevAppend(10, 10);
            
            var isCell00Valid = (discretizationCells[0][0].x1 == 0 && discretizationCells[0][0].x2 == 9 &&
                                 discretizationCells[0][0].y1 == 0 && discretizationCells[0][0].y2 == 9 &&
                                 discretizationCells[0][0].centerX == 5 &&
                                 discretizationCells[0][0].centerY == 5);
            ok(
                isCell00Valid,
                "call on grid[w=20px, h=20px], discretizationStep[h=10, v=10], Cell[0][0] is valid"
            );

            var isCell01Valid = (discretizationCells[0][1].x1 == 10 && discretizationCells[0][1].x2 == 19 &&
                                 discretizationCells[0][1].y1 == 0 && discretizationCells[0][1].y2 == 9 &&
                                 discretizationCells[0][1].centerX == 15 &&
                                 discretizationCells[0][1].centerY == 5);
            ok(
                isCell01Valid,
                "call on grid[w=20px, h=20px], discretizationStep[h=10, v=10], Cell[0][1] is valid"
            );

            var isCell10Valid = (discretizationCells[1][0].x1 == 0 && discretizationCells[1][0].x2 == 9 &&
                                 discretizationCells[1][0].y1 == 10 && discretizationCells[1][0].y2 == 19 &&
                                 discretizationCells[1][0].centerX == 5 &&
                                 discretizationCells[1][0].centerY == 15);
            ok(
                isCell10Valid,
                "call on grid[w=20px, h=20px], discretizationStep[h=10, v=10], Cell[1][0] is valid"
            );

            var isCell11Valid = (discretizationCells[1][1].x1 == 10 && discretizationCells[1][1].x2 == 19 &&
                                 discretizationCells[1][1].y1 == 10 && discretizationCells[1][1].y2 == 19 &&
                                 discretizationCells[1][1].centerX == 15 &&
                                 discretizationCells[1][1].centerY == 15);
            ok(
                isCell11Valid,
                "call on grid[w=20px, h=20px], discretizationStep[h=10, v=10], Cell[1][1] is valid"
            );
        }
    };

    discretizeGridWithReversedAppendTester.runTests();
});