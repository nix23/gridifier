$(document).ready(function() {
    module("SizesResolver");

    var tester = {
        _before: function() {

        },

        _after: function() {

        },

        runTests: function() {
            var me = this;

            test("recalcTwoSidePropPtVals", function(assert) {
                var test = function(tests) {
                    me._before.call(me);

                    for(var i = 0; i < tests.length; i++)
                        me["_" + tests[i]].call(me, assert);

                    me._after.call(me);
                }

                test([
                    "recalcHorPaddingsWithLeftPtPadding",
                    "recalcHorPaddingsWithRightPtPadding",
                    "recalcHorPaddingsWithBothPtPaddings",
                    "recalcHorMarginsWithLeftPtMargin",
                    "recalcHorMarginsWithRightPtMargin",
                    "recalcHorMarginsWithBothPtMargins",

                    "recalcVerPaddingsWithTopPtPadding",
                    "recalcVerPaddingsWithBottomPtPadding",
                    "recalcVerPaddingsWithBothPtPaddings",
                    "recalcVerMarginsWithTopPtMargin",
                    "recalcVerMarginsWithBottomPtMargin",
                    "recalcVerMarginsWithBothPtMargins"
                ]);
            });
        },

        //_testCallWithWrongDirection: function(assert) {
        //    clearTestData();
        //
        //    assert.throws(
        //        function() { SizesResolver._recalcTwoSidePropPtVals(null, null, null, null, null, "wrongDirection"); },
        //        /(.*)SizesResolver error: wrong direction in twoSideProperty recalculation.(.*)/,
        //        "call with wrong direction"
        //    );
        //},
        //
        //_testCallWithWrongCSSProperty: function(assert) {
        //    clearTestData();
        //
        //    assert.throws(
        //        function() { SizesResolver._recalcTwoSidePropPtVals(null, null, null, null, "wrongProperty", "horizontal"); },
        //        /(.*)SizesResolver error: unknown CSSProperty in twoSideProperty recalculation.(.*)/,
        //        "call with wrong CSS property"
        //    );
        //},

        _recalcHorPaddingsWithLeftPtPadding: function() {
            clearTestData();

            var $testerParentDiv = $("<div/>");
            $testerParentDiv.css({
                width: "1000px",
                height: "100px"
            });

            $testContent.append($testerParentDiv);

            var $testerDiv = $("<div/>");
            $testerDiv.css({
                width: "100px",
                "padding-left": "10.5%",
                "padding-right": "10px"
            });

            $testerParentDiv.append($testerDiv);

            var computedPropertiesMock = {
                paddingRight: parseFloat("10px"),
                paddingLeft: "will be replaced"
            };

            ok(
                SizesResolver._recalcTwoSidePropPtVals(
                    $testerDiv.get(0),
                    1000,
                    computedPropertiesMock,
                    false,
                    "padding"
                ) == 115,
                "call with parentNode width = 1000px, padding-left = 10.5%, padding-right = 10px"
            );
        },

        _recalcHorPaddingsWithRightPtPadding: function() {
            clearTestData();

            var $testerParentDiv = $("<div/>");
            $testerParentDiv.css({
                width: "1000px",
                height: "100px"
            });

            $testContent.append($testerParentDiv);

            var $testerDiv = $("<div/>");
            $testerDiv.css({
                width: "100px",
                "padding-left": "10px",
                "padding-right": "10.5%"
            });

            $testerParentDiv.append($testerDiv);

            var computedPropertiesMock = {
                paddingLeft: parseFloat("10px"),
                paddingRight: "will be replaced"
            };

            ok(
                SizesResolver._recalcTwoSidePropPtVals(
                    $testerDiv.get(0),
                    1000,
                    computedPropertiesMock,
                    false,
                    "padding"
                ) == 115,
                "call with parentNode width = 1000px, padding-left = 10px, padding-right = 10.5%"
            );
        },

        _recalcHorPaddingsWithBothPtPaddings: function() {
            clearTestData();

            var $testerParentDiv = $("<div/>");
            $testerParentDiv.css({
                width: "1000px",
                height: "100px"
            });

            $testContent.append($testerParentDiv);

            var $testerDiv = $("<div/>");
            $testerDiv.css({
                width: "100px",
                "padding-left": "10.5%",
                "padding-right": "10.5%"
            });

            $testerParentDiv.append($testerDiv);

            var computedPropertiesMock = {
                paddingLeft: "will be replaced",
                paddingRight: "will be replaced"
            };

            ok(
                SizesResolver._recalcTwoSidePropPtVals(
                    $testerDiv.get(0),
                    1000,
                    computedPropertiesMock,
                    false,
                    "padding"
                ) == 210,
                "call with parentNode width = 1000px, padding-left = 10.5%, padding-right = 10.5%"
            );
        },

        _recalcHorMarginsWithLeftPtMargin: function() {
            clearTestData();

            var $testerParentDiv = $("<div/>");
            $testerParentDiv.css({
                width: "1000px",
                height: "100px"
            });

            $testContent.append($testerParentDiv);

            var $testerDiv = $("<div/>");
            $testerDiv.css({
                width: "100px",
                "margin-left": "10.5%",
                "margin-right": "10px"
            });

            $testerParentDiv.append($testerDiv);

            var computedPropertiesMock = {
                marginRight: parseFloat("10px"),
                marginLeft: "will be replaced"
            };

            ok(
                SizesResolver._recalcTwoSidePropPtVals(
                    $testerDiv.get(0),
                    1000,
                    computedPropertiesMock,
                    false,
                    "margin"
                ) == 115,
                "call with parentNode width = 1000px, margin-left = 10.5%, margin-right = 10px"
            );
        },

        _recalcHorMarginsWithRightPtMargin: function() {
            clearTestData();

            var $testerParentDiv = $("<div/>");
            $testerParentDiv.css({
                width: "1000px",
                height: "100px"
            });

            $testContent.append($testerParentDiv);

            var $testerDiv = $("<div/>");
            $testerDiv.css({
                width: "100px",
                "margin-left": "10px",
                "margin-right": "10.5%"
            });

            $testerParentDiv.append($testerDiv);

            var computedPropertiesMock = {
                marginLeft: parseFloat("10px"),
                marginRight: "will be replaced"
            };

            ok(
                SizesResolver._recalcTwoSidePropPtVals(
                    $testerDiv.get(0),
                    1000,
                    computedPropertiesMock,
                    false,
                    "margin"
                ) == 115,
                "call with parentNode width = 1000px, margin-left = 10px, margin-right = 10.5%"
            );
        },

        _recalcHorMarginsWithBothPtMargins: function() {
            clearTestData();

            var $testerParentDiv = $("<div/>");
            $testerParentDiv.css({
                width: "1000px",
                height: "100px"
            });

            $testContent.append($testerParentDiv);

            var $testerDiv = $("<div/>");
            $testerDiv.css({
                width: "100px",
                "margin-left": "10.5%",
                "margin-right": "10.5%"
            });

            $testerParentDiv.append($testerDiv);

            var computedPropertiesMock = {
                marginLeft: "will be replaced",
                marginRight: "will be replaced"
            };

            ok(
                SizesResolver._recalcTwoSidePropPtVals(
                    $testerDiv.get(0),
                    1000,
                    computedPropertiesMock,
                    false,
                    "margin"
                ) == 210,
                "call with parentNode width = 1000px, margin-left = 10.5%, margin-right = 10.5%"
            );
        },

        _recalcVerPaddingsWithTopPtPadding: function() {
            clearTestData();

            var $testerParentDiv = $("<div/>");
            $testerParentDiv.css({
                width: "1000px",
                height: "1000px"
            });

            $testContent.append($testerParentDiv);

            var $testerDiv = $("<div/>");
            $testerDiv.css({
                width: "100px",
                "padding-top": "10.5%",
                "padding-bottom": "10px"
            });

            $testerParentDiv.append($testerDiv);

            var computedPropertiesMock = {
                paddingBottom: parseFloat("10px"),
                paddingTop: "will be replaced"
            };

            ok(
                SizesResolver._recalcTwoSidePropPtVals(
                    $testerDiv.get(0),
                    1000,
                    computedPropertiesMock,
                    false,
                    "padding",
                    true
                ) == 115,
                "call with parentNode height = 1000px, padding-top = 10.5%, padding-bottom = 10px"
            );
        },

        _recalcVerPaddingsWithBottomPtPadding: function() {
            clearTestData();

            var $testerParentDiv = $("<div/>");
            $testerParentDiv.css({
                width: "1000px",
                height: "1000px"
            });

            $testContent.append($testerParentDiv);

            var $testerDiv = $("<div/>");
            $testerDiv.css({
                width: "100px",
                "padding-top": "10px",
                "padding-bottom": "10.5%"
            });

            $testerParentDiv.append($testerDiv);

            var computedPropertiesMock = {
                paddingTop: parseFloat("10px"),
                paddingBottom: "will be replaced"
            };

            ok(
                SizesResolver._recalcTwoSidePropPtVals(
                    $testerDiv.get(0),
                    1000,
                    computedPropertiesMock,
                    false,
                    "padding",
                    true
                ) == 115,
                "call with parentNode height = 1000px, padding-top = 10px, padding-bottom = 10.5%"
            );
        },

        _recalcVerPaddingsWithBothPtPaddings: function() {
            clearTestData();

            var $testerParentDiv = $("<div/>");
            $testerParentDiv.css({
                width: "1000px",
                height: "1000px"
            });

            $testContent.append($testerParentDiv);

            var $testerDiv = $("<div/>");
            $testerDiv.css({
                width: "100px",
                "padding-top": "10.5%",
                "padding-bottom": "10.5%"
            });

            $testerParentDiv.append($testerDiv);

            var computedPropertiesMock = {
                paddingTop: "will be replaced",
                paddingBottom: "will be replaced"
            };

            ok(
                SizesResolver._recalcTwoSidePropPtVals(
                    $testerDiv.get(0),
                    1000,
                    computedPropertiesMock,
                    false,
                    "padding",
                    true
                ) == 210,
                "call with parentNode height = 1000px, padding-top = 10.5%, padding-bottom = 10.5%"
            );
        },

        _recalcVerMarginsWithTopPtMargin: function() {
            clearTestData();

            var $testerParentDiv = $("<div/>");
            $testerParentDiv.css({
                width: "1000px",
                height: "1000px"
            });

            $testContent.append($testerParentDiv);

            var $testerDiv = $("<div/>");
            $testerDiv.css({
                width: "100px",
                "margin-top": "10.5%",
                "margin-bottom": "10px"
            });

            $testerParentDiv.append($testerDiv);

            var computedPropertiesMock = {
                marginBottom: parseFloat("10px"),
                marginTop: "will be replaced"
            };

            ok(
                SizesResolver._recalcTwoSidePropPtVals(
                    $testerDiv.get(0),
                    1000,
                    computedPropertiesMock,
                    false,
                    "margin",
                    true
                ) == 115,
                "call with parentNode height = 1000px, margin-top = 10.5%, margin-bottom = 10px"
            );
        },

        _recalcVerMarginsWithBottomPtMargin: function() {
            clearTestData();

            var $testerParentDiv = $("<div/>");
            $testerParentDiv.css({
                width: "1000px",
                height: "1000px"
            });

            $testContent.append($testerParentDiv);

            var $testerDiv = $("<div/>");
            $testerDiv.css({
                width: "100px",
                "margin-top": "10px",
                "margin-bottom": "10.5%"
            });

            $testerParentDiv.append($testerDiv);

            var computedPropertiesMock = {
                marginTop: parseFloat("10px"),
                marginBottom: "will be replaced"
            };

            ok(
                SizesResolver._recalcTwoSidePropPtVals(
                    $testerDiv.get(0),
                    1000,
                    computedPropertiesMock,
                    false,
                    "margin",
                    true
                ) == 115,
                "call with parentNode height = 1000px, margin-top = 10px, margin-bottom = 10.5%"
            );
        },

        _recalcVerMarginsWithBothPtMargins: function() {
            clearTestData();

            var $testerParentDiv = $("<div/>");
            $testerParentDiv.css({
                width: "1000px",
                height: "1000px"
            });

            $testContent.append($testerParentDiv);

            var $testerDiv = $("<div/>");
            $testerDiv.css({
                width: "100px",
                "margin-top": "10.5%",
                "margin-bottom": "10.5%"
            });

            $testerParentDiv.append($testerDiv);

            var computedPropertiesMock = {
                marginTop: "will be replaced",
                marginBottom: "will be replaced"
            };

            ok(
                SizesResolver._recalcTwoSidePropPtVals(
                    $testerDiv.get(0),
                    1000,
                    computedPropertiesMock,
                    false,
                    "margin",
                    true
                ) == 210,
                "call with parentNode height = 1000px, margin-top = 10.5%, margin-bottom = 10.5%"
            );
        }
    }

    tester.runTests();
    clearTestData();
});