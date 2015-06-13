$(document).ready(function() {
    module("Sizes resolver tests.");

    var hasPercentageCSSValueTester = {
        _before: function() {
            
        },

        _after: function() {

        },

        runTests: function() {
            var me = this;

            test("hasPercentageCSSValue", function(assert) {
                me._before.call(me);

                me._testCallWithElementWithoutParentNode.call(me, assert);
                me._testCallWithWrongCSSProperty.call(me, assert);

                me._testCallPerAllPossibleValuesWithElementPxValue.call(me);
                me._testCallPerAllPossibleValuesWithElementPercentageValue.call(me);
                me._testCallPerAllPossibleValuesWithElementPercentageValueDeclaredInClass.call(me);
                me._testCallWithShorthandPercentageValues.call(me);

                me._after.call(me);
            });
        },

        _testCallWithElementWithoutParentNode: function(assert) {
            clearTestData();

            var testerDiv = document.createElement("div");
            assert.throws(
                function() { SizesResolver.hasPercentageCSSValue("testCSSProperty", testerDiv); },
                /(.*)Can't resolve element parentNode per element:(.*)/,
                "call on element without parent node"
            );
        },

        _testCallWithWrongCSSProperty: function(assert) {
            clearTestData();

            var testerDiv = document.createElement("div");
            $testContent.append($(testerDiv));

            assert.throws(
                function() { SizesResolver.hasPercentageCSSValue("wrongCSSProperty", testerDiv); },
                /(.*)Can't find property 'wrongCSSProperty' in elementComputedCSS.(.*)/,
                "call with wrong CSS property"
            );
        },

        _testCallPerAllPossibleValuesWithElementPxValue: function() {
            var cssProperties = [
                "width", "height", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom",
                "marginLeft", "marginRight", "marginTop", "marginBottom"
            ];

            for(var i = 0; i < cssProperties.length; i++) {
                var cssProperty = cssProperties[i];

                clearTestData();

                var testerDiv = document.createElement("div");
                testerDiv.style[cssProperty] = "20px";
                $testContent.append($(testerDiv));

                ok(
                    !SizesResolver.hasPercentageCSSValue(cssProperty, testerDiv),
                    "call with cssProperty = '" + cssProperty + "' and px value"
                );

                var recalculatedElementCSS = SizesResolver._getComputedCSSWithMaybePercentageSizes(testerDiv);
                ok(
                    !SizesResolver.hasPercentageCSSValue(cssProperty, testerDiv, recalculatedElementCSS),
                    "call with cssProperty = '" + cssProperty + "', px value and recalculatedElementCSS"
                );
            }
        },

        _testCallPerAllPossibleValuesWithElementPercentageValue: function() {
            var cssProperties = [
                "width", "height", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom",
                "marginLeft", "marginRight", "marginTop", "marginBottom"
            ];

            for(var i = 0; i < cssProperties.length; i++) {
                var cssProperty = cssProperties[i];

                clearTestData();

                var testerDiv = document.createElement("div");
                testerDiv.style[cssProperty] = "20%";
                $testContent.append($(testerDiv));

                ok(
                    SizesResolver.hasPercentageCSSValue(cssProperty, testerDiv),
                    "call with cssProperty = '" + cssProperty + "' and % value"
                );

                var recalculatedElementCSS = SizesResolver._getComputedCSSWithMaybePercentageSizes(testerDiv);
                ok(
                    SizesResolver.hasPercentageCSSValue(cssProperty, testerDiv, recalculatedElementCSS),
                    "call with cssProperty = '" + cssProperty + "', % value and recalculatedElementCSS"
                );
            }
        },

        _testCallPerAllPossibleValuesWithElementPercentageValueDeclaredInClass: function() {
            var cssProperties = [
                "width", "height", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom",
                "marginLeft", "marginRight", "marginTop", "marginBottom"
            ];
            var styleCssProperties = [
                "width", "height", "padding-left", "padding-right", "padding-top", "padding-bottom",
                "margin-left", "margin-right", "margin-top", "margin-bottom"
            ];

            for(var i = 0; i < cssProperties.length; i++) {
                var cssProperty = cssProperties[i];
                var styleCssProperty = styleCssProperties[i];
                clearTestData();

                var testStyles = ".testDiv { " + styleCssProperty + ": 60%; }";
                $testStyles.append(testStyles);

                var testerDiv = document.createElement("div");
                testerDiv.setAttribute("class", "testDiv");
                $testContent.append($(testerDiv));

                ok(
                    SizesResolver.hasPercentageCSSValue(cssProperty, testerDiv),
                    "call with cssProperty = '" + cssProperty + "' and % value(declared in class)"
                );

                var recalculatedElementCSS = SizesResolver._getComputedCSSWithMaybePercentageSizes(testerDiv);
                ok(
                    SizesResolver.hasPercentageCSSValue(cssProperty, testerDiv, recalculatedElementCSS),
                    "call with cssProperty = '" + cssProperty + "', % value(declared in class) and recalculatedElementCSS"
                );
            }
        },

        _testCallWithShorthandPercentageValues: function() {
            var shorthandCssProperties = ["margin", "padding"];
            var paddingCssProperties = [
                "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"
            ];
            var marginCssProperties = [
                "marginLeft", "marginRight", "marginTop", "marginBottom"
            ];

            for(var i = 0; i < shorthandCssProperties.length; i++) {
                var shorthandCssProperty = shorthandCssProperties[i];
                if(shorthandCssProperty == "margin")
                    var computedCssPropertiesToCheck = marginCssProperties;
                else if(shorthandCssProperty == "padding")
                    var computedCssPropertiesToCheck = paddingCssProperties;
                else
                    throw new Error("Uknown shorthand property: '" + shorthandCssProperty + "'");
                clearTestData();

                var testStyles = ".testDiv { " + shorthandCssProperty + ": 60%; }";
                $testStyles.append(testStyles);

                var testerDiv = document.createElement("div");
                testerDiv.setAttribute("class", "testDiv");
                $testContent.append($(testerDiv));

                var areAllFullhandedPropertiesCorrectlyCalculated = true;
                for(var j = 0; j < computedCssPropertiesToCheck.length; j++) {
                    if(!SizesResolver.hasPercentageCSSValue(computedCssPropertiesToCheck[j], testerDiv))
                        areAllFullhandedPropertiesCorrectlyCalculated = false;
                }

                ok(
                    areAllFullhandedPropertiesCorrectlyCalculated,
                    "call with shorthandProperty = '" + shorthandCssProperty + "', % value(declared in class)"
                );
            }
        }
    }

    hasPercentageCSSValueTester.runTests();
    clearTestData();

    var getPercentageCSSValueTester = {
        _before: function() {

        },

        _after: function() {

        },

        runTests: function() {
            var me = this;

            test("getPercentageCSSValue", function(assert) {
                me._before.call(me);

                me._testCallWithElementWithoutParentNode.call(me, assert);
                me._testCallWithWrongCSSProperty.call(me, assert);

                me._testCallPerAllPossibleValuesWithElementPercentageValue.call(me);
                me._testCallPerAllPossibleValuesWithElementPercentageValueDeclaredInClass.call(me);
                me._testCallWithShorthandPercentageValues.call(me);

                me._after.call(me);
            });
        },

        _testCallWithElementWithoutParentNode: function(assert) {
            clearTestData();

            var testerDiv = document.createElement("div");
            assert.throws(
                function() { SizesResolver.getPercentageCSSValue("testCSSProperty", testerDiv); },
                /(.*)Can't resolve element parentNode per element:(.*)/,
                "call on element without parent node"
            );
        },

        _testCallWithWrongCSSProperty: function(assert) {
            clearTestData();

            var testerDiv = document.createElement("div");
            $testContent.append($(testerDiv));

            assert.throws(
                function() { SizesResolver.getPercentageCSSValue("wrongCSSProperty", testerDiv); },
                /(.*)Can't find property 'wrongCSSProperty' in elementComputedCSS.(.*)/,
                "call with wrong CSS property"
            );
        },

        _testCallPerAllPossibleValuesWithElementPercentageValue: function() {
            var cssProperties = [
                "width", "height", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom",
                "marginLeft", "marginRight", "marginTop", "marginBottom"
            ];

            for(var i = 0; i < cssProperties.length; i++) {
                var cssProperty = cssProperties[i];

                clearTestData();

                var testerDiv = document.createElement("div");
                testerDiv.style[cssProperty] = "20%";
                $testContent.append($(testerDiv));

                ok(
                    SizesResolver.getPercentageCSSValue(cssProperty, testerDiv) == "20%",
                    "call with cssProperty = '" + cssProperty + "' and % value"
                );

                var recalculatedElementCSS = SizesResolver._getComputedCSSWithMaybePercentageSizes(testerDiv);
                ok(
                    SizesResolver.getPercentageCSSValue(cssProperty, testerDiv, recalculatedElementCSS) == "20%",
                    "call with cssProperty = '" + cssProperty + "', % value and recalculatedElementCSS"
                );
            }
        },

        _testCallPerAllPossibleValuesWithElementPercentageValueDeclaredInClass: function() {
            var cssProperties = [
                "width", "height", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom",
                "marginLeft", "marginRight", "marginTop", "marginBottom"
            ];
            var styleCssProperties = [
                "width", "height", "padding-left", "padding-right", "padding-top", "padding-bottom",
                "margin-left", "margin-right", "margin-top", "margin-bottom"
            ];

            for(var i = 0; i < cssProperties.length; i++) {
                var cssProperty = cssProperties[i];
                var styleCssProperty = styleCssProperties[i];
                clearTestData();

                var testStyles = ".testDiv { " + styleCssProperty + ": 60%; }";
                $testStyles.append(testStyles);

                var testerDiv = document.createElement("div");
                testerDiv.setAttribute("class", "testDiv");
                $testContent.append($(testerDiv));

                ok(
                    SizesResolver.getPercentageCSSValue(cssProperty, testerDiv) == "60%",
                    "call with cssProperty = '" + cssProperty + "' and % value(declared in class)"
                );

                var recalculatedElementCSS = SizesResolver._getComputedCSSWithMaybePercentageSizes(testerDiv);
                ok(
                    SizesResolver.getPercentageCSSValue(cssProperty, testerDiv, recalculatedElementCSS) == "60%",
                    "call with cssProperty = '" + cssProperty + "', % value(declared in class) and recalculatedElementCSS"
                );
            }
        },

        _testCallWithShorthandPercentageValues: function() {
            var shorthandCssProperties = ["margin", "padding"];
            var paddingCssProperties = [
                "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"
            ];
            var marginCssProperties = [
                "marginLeft", "marginRight", "marginTop", "marginBottom"
            ];

            for(var i = 0; i < shorthandCssProperties.length; i++) {
                var shorthandCssProperty = shorthandCssProperties[i];
                if(shorthandCssProperty == "margin")
                    var computedCssPropertiesToCheck = marginCssProperties;
                else if(shorthandCssProperty == "padding")
                    var computedCssPropertiesToCheck = paddingCssProperties;
                else
                    throw new Error("Uknown shorthand property: '" + shorthandCssProperty + "'");
                clearTestData();

                var testStyles = ".testDiv { " + shorthandCssProperty + ": 60%; }";
                $testStyles.append(testStyles);

                var testerDiv = document.createElement("div");
                testerDiv.setAttribute("class", "testDiv");
                $testContent.append($(testerDiv));

                var areAllFullhandedPropertiesCorrectlyCalculated = true;
                for(var j = 0; j < computedCssPropertiesToCheck.length; j++) {
                    if(!SizesResolver.getPercentageCSSValue(computedCssPropertiesToCheck[j], testerDiv) == "60%")
                        areAllFullhandedPropertiesCorrectlyCalculated = false;
                }

                ok(
                    areAllFullhandedPropertiesCorrectlyCalculated,
                    "call with shorthandProperty = '" + shorthandCssProperty + "', % value(declared in class)"
                );
            }
        }
    }

    getPercentageCSSValueTester.runTests();
    clearTestData();

    var _recalculateTwoSidePropertyWithPercentageValuesTester = {
        _before: function() {

        },

        _after: function() {

        },

        runTests: function() {
            var me = this;

            test("_recalculateTwoSidePropertyWithPercentageValues", function(assert) {
                me._before.call(me);

                me._testCallWithWrongDirection.call(me, assert);
                me._testCallWithWrongCSSProperty.call(me, assert);

                me._testCallToRecalculateHorizontalPaddingsWithLeftPercentagePadding.call(me);
                me._testCallToRecalculateHorizontalPaddingsWithRightPercentagePadding.call(me);
                me._testCallToRecalculateHorizontalPaddingsWithBothPercentagePaddings.call(me);

                me._testCallToRecalculateHorizontalMarginsWithLeftPercentageMargin.call(me);
                me._testCallToRecalculateHorizontalMarginsWithRightPercentageMargin.call(me);
                me._testCallToRecalculateHorizontalMarginsWithBothPercentageMargins.call(me);

                me._testCallToRecalculateVerticalPaddingsWithTopPercentagePadding.call(me);
                me._testCallToRecalculateVerticalPaddingsWithBottomPercentagePadding.call(me);
                me._testCallToRecalculateVerticalPaddingsWithBothPercentagePaddings.call(me);

                me._testCallToRecalculateVerticalMarginsWithTopPercentageMargin.call(me);
                me._testCallToRecalculateVerticalMarginsWithBottomPercentageMargin.call(me);
                me._testCallToRecalculateVerticalMarginsWithBothPercentageMargins.call(me);

                me._after.call(me);
            });
        },

        _testCallWithWrongDirection: function(assert) {
            clearTestData();

            assert.throws(
                function() { SizesResolver._recalculateTwoSidePropertyWithPercentageValues(null, null, null, null, null, "wrongDirection"); },
                /(.*)SizesResolver error: wrong direction in twoSideProperty recalculation.(.*)/,
                "call with wrong direction"
            );
        },

        _testCallWithWrongCSSProperty: function(assert) {
            clearTestData();

            assert.throws(
                function() { SizesResolver._recalculateTwoSidePropertyWithPercentageValues(null, null, null, null, "wrongProperty", "horizontal"); },
                /(.*)SizesResolver error: unknown CSSProperty in twoSideProperty recalculation.(.*)/,
                "call with wrong CSS property"
            );
        },

        _testCallToRecalculateHorizontalPaddingsWithLeftPercentagePadding: function() {
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
                SizesResolver._recalculateTwoSidePropertyWithPercentageValues(
                    $testerDiv.get(0), 
                    1000,
                    computedPropertiesMock,
                    false,
                    "padding",
                    "horizontal"
                ) == 115,
                "call with parentNode width = 1000px, padding-left = 10.5%, padding-right = 10px"
            );
        },

        _testCallToRecalculateHorizontalPaddingsWithRightPercentagePadding: function() {
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
                SizesResolver._recalculateTwoSidePropertyWithPercentageValues(
                    $testerDiv.get(0), 
                    1000,
                    computedPropertiesMock,
                    false,
                    "padding",
                    "horizontal"
                ) == 115,
                "call with parentNode width = 1000px, padding-left = 10px, padding-right = 10.5%"
            );
        },

        _testCallToRecalculateHorizontalPaddingsWithBothPercentagePaddings: function() {
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
                SizesResolver._recalculateTwoSidePropertyWithPercentageValues(
                    $testerDiv.get(0), 
                    1000,
                    computedPropertiesMock,
                    false,
                    "padding",
                    "horizontal"
                ) == 210,
                "call with parentNode width = 1000px, padding-left = 10.5%, padding-right = 10.5%"
            );
        },

        _testCallToRecalculateHorizontalMarginsWithLeftPercentageMargin: function() {
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
                SizesResolver._recalculateTwoSidePropertyWithPercentageValues(
                    $testerDiv.get(0), 
                    1000,
                    computedPropertiesMock,
                    false,
                    "margin",
                    "horizontal"
                ) == 115,
                "call with parentNode width = 1000px, margin-left = 10.5%, margin-right = 10px"
            );
        },

        _testCallToRecalculateHorizontalMarginsWithRightPercentageMargin: function() {
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
                SizesResolver._recalculateTwoSidePropertyWithPercentageValues(
                    $testerDiv.get(0), 
                    1000,
                    computedPropertiesMock,
                    false,
                    "margin",
                    "horizontal"
                ) == 115,
                "call with parentNode width = 1000px, margin-left = 10px, margin-right = 10.5%"
            );
        },

        _testCallToRecalculateHorizontalMarginsWithBothPercentageMargins: function() {
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
                SizesResolver._recalculateTwoSidePropertyWithPercentageValues(
                    $testerDiv.get(0), 
                    1000,
                    computedPropertiesMock,
                    false,
                    "margin",
                    "horizontal"
                ) == 210,
                "call with parentNode width = 1000px, margin-left = 10.5%, margin-right = 10.5%"
            );
        },

        _testCallToRecalculateVerticalPaddingsWithTopPercentagePadding: function() {
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
                SizesResolver._recalculateTwoSidePropertyWithPercentageValues(
                    $testerDiv.get(0), 
                    1000,
                    computedPropertiesMock,
                    false,
                    "padding",
                    "vertical"
                ) == 115,
                "call with parentNode height = 1000px, padding-top = 10.5%, padding-bottom = 10px"
            );
        },

        _testCallToRecalculateVerticalPaddingsWithBottomPercentagePadding: function() {
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
                SizesResolver._recalculateTwoSidePropertyWithPercentageValues(
                    $testerDiv.get(0), 
                    1000,
                    computedPropertiesMock,
                    false,
                    "padding",
                    "vertical"
                ) == 115,
                "call with parentNode height = 1000px, padding-top = 10px, padding-bottom = 10.5%"
            );
        },

        _testCallToRecalculateVerticalPaddingsWithBothPercentagePaddings: function() {
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
                SizesResolver._recalculateTwoSidePropertyWithPercentageValues(
                    $testerDiv.get(0), 
                    1000,
                    computedPropertiesMock,
                    false,
                    "padding",
                    "vertical"
                ) == 210,
                "call with parentNode height = 1000px, padding-top = 10.5%, padding-bottom = 10.5%"
            );
        },


        _testCallToRecalculateVerticalMarginsWithTopPercentageMargin: function() {
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
                SizesResolver._recalculateTwoSidePropertyWithPercentageValues(
                    $testerDiv.get(0), 
                    1000,
                    computedPropertiesMock,
                    false,
                    "margin",
                    "vertical"
                ) == 115,
                "call with parentNode height = 1000px, margin-top = 10.5%, margin-bottom = 10px"
            );
        },

        _testCallToRecalculateVerticalMarginsWithBottomPercentageMargin: function() {
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
                SizesResolver._recalculateTwoSidePropertyWithPercentageValues(
                    $testerDiv.get(0), 
                    1000,
                    computedPropertiesMock,
                    false,
                    "margin",
                    "vertical"
                ) == 115,
                "call with parentNode height = 1000px, margin-top = 10px, margin-bottom = 10.5%"
            );
        },

        _testCallToRecalculateVerticalMarginsWithBothPercentageMargins: function() {
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
                SizesResolver._recalculateTwoSidePropertyWithPercentageValues(
                    $testerDiv.get(0), 
                    1000,
                    computedPropertiesMock,
                    false,
                    "margin",
                    "vertical"
                ) == 210,
                "call with parentNode height = 1000px, margin-top = 10.5%, margin-bottom = 10.5%"
            );
        },
    }

    _recalculateTwoSidePropertyWithPercentageValuesTester.runTests();
    clearTestData();

    var outerWidthTester = {
        _before: function() {

        },

        _after: function() {

        },

        _grids: {
            _boxSizing: null,
            BOX_SIZINGS: {CONTENT_BOX: "content-box", BORDER_BOX: "border-box"},

            PADDING_PX_SIZE: "20px",
            PADDING_PERCENTS_SIZE: "10.5%",
            MARGIN_PX_SIZE: "20px",
            MARGIN_PERCENTS_SIZE: "10.5%",
            BORDER_PX_SIZE: "3px",

            setBoxSizing: function(boxSizing) {
                if(boxSizing != this.BOX_SIZINGS.CONTENT_BOX &&
                    boxSizing != this.BOX_SIZINGS.BORDER_BOX) {
                    throw new Error("Can't set unknown box sizing!");
                }

                this._boxSizing = boxSizing;
            },

            isContentBoxBSGrid: function() {
                return this._boxSizing == this.BOX_SIZINGS.CONTENT_BOX;
            },

            isBorderBoxBSGrid: function() {
                return this._boxSizing == this.BOX_SIZINGS.BORDER_BOX;
            },

            createGridWithPxWidth: function(pxWidth) {
                var $grid = $("<div/>");
                $grid.css({
                    width: pxWidth + "px",
                    height: "500px",
                    "box-sizing": this._boxSizing,
                    position: "relative"
                });

                return $grid;
            },

            createGridWithPxWidthAndPxPadding: function(pxWidth) {
                $grid = this.createGridWithPxWidth(pxWidth);
                $grid.css({"padding": this.PADDING_PX_SIZE});

                return $grid;
            },

            createGridWithPxWidthAndPxMargin: function(pxWidth) {
                $grid = this.createGridWithPxWidth(pxWidth);
                $grid.css({"margin": this.MARGIN_PX_SIZE});

                return $grid;
            },

            createGridWithPxWidthAndPxBorder: function(pxWidth) {
                $grid = this.createGridWithPxWidth(pxWidth);
                $grid.css({"border": this.BORDER_PX_SIZE + " black solid"});

                return $grid;
            },

            createGridWithPercentageWidth: function(wrapperPxWidth, percentageWidth) {
                var $wrapper = $("<div/>");
                $wrapper.css({"width": wrapperPxWidth + "px"});

                var $grid = $("<div/>");
                $grid.css({
                    width: percentageWidth + "%",
                    height: "500px",
                    "box-sizing": this._boxSizing,
                    position: "relative"
                });

                $wrapper.append($grid);

                return $grid;
            },

            createGridWithPercentageWidthAndPercentagePadding: function(wrapperPxWidth, percentageWidth) {
                var $grid = this.createGridWithPercentageWidth(wrapperPxWidth, percentageWidth);
                $grid.css({"padding": this.PADDING_PERCENTS_SIZE});

                return $grid;
            },

            createGridWithPercentageWidthAndPercentageMargin: function(wrapperPxWidth, percentageWidth) {
                var $grid = this.createGridWithPercentageWidth(wrapperPxWidth, percentageWidth);
                $grid.css({"margin": this.MARGIN_PERCENTS_SIZE});

                return $grid;
            }
        },

        runTests: function() {
            var me = this;

            test("outerWidth(content-box grid)", function() {
                me._before.call(me);

                me._grids.setBoxSizing(me._grids.BOX_SIZINGS.CONTENT_BOX);

                outerWidthTesterPxWidthGrid.testCallOnPxWidthGridPerAllContentBoxItems.call(me);
                outerWidthTesterPxWidthGrid.testCallOnPxWidthGridPerAllBorderBoxItems.call(me);

                var tester = outerWidthTesterPxWidthPxPaddingGrid;
                tester.testCallOnPxWidthAndPxPaddingGridPerAllContentBoxItems.call(me);
                tester.testCallOnPxWidthAndPxPaddingGridPerAllBorderBoxItems.call(me);

                var tester = outerWidthTesterPxWidthPxMarginGrid;
                tester.testCallOnPxWidthPxMarginGridPerAllContentBoxItems.call(me);
                tester.testCallOnPxWidthPxMarginGridPerAllBorderBoxItems.call(me);

                var tester = outerWidthTesterPxWidthPxBorderGrid;
                tester.testCallOnPxWidthPxBorderGridPerAllContentBoxItems.call(me);
                tester.testCallOnPxWidthPxBorderGridPerAllBorderBoxItems.call(me);

                var tester = outerWidthTesterPercentageWidthGrid;
                tester.testCallOnPtWidthGridPerAllContentBoxItems.call(me);
                tester.testCallOnPtWidthGridPerAllBorderBoxItems.call(me);

                var tester = outerWidthTesterPercentageWidthPercentagePaddingGrid;
                tester.testCallOnPtWidthPtPaddingGridPerAllContentBoxItems.call(me);
                tester.testCallOnPtWidthPtPaddingGridPerAllBorderBoxItems.call(me);

                var tester = outerWidthTesterPercentageWidthPercentageMarginGrid;
                tester.testCallOnPtWidthPtMarginGridPerAllContentBoxItems.call(me);
                tester.testCallOnPtWidthPtMarginGridPerAllBorderBoxItems.call(me);

                me._after.call(me);
            });

            test("outerWidth(border-box grid)", function() {
                me._before.call(me);

                me._grids.setBoxSizing(me._grids.BOX_SIZINGS.BORDER_BOX);

                outerWidthTesterPxWidthGrid.testCallOnPxWidthGridPerAllContentBoxItems.call(me);
                outerWidthTesterPxWidthGrid.testCallOnPxWidthGridPerAllBorderBoxItems.call(me);

                var tester = outerWidthTesterPxWidthPxPaddingGrid;
                tester.testCallOnPxWidthAndPxPaddingGridPerAllContentBoxItems.call(me);
                tester.testCallOnPxWidthAndPxPaddingGridPerAllBorderBoxItems.call(me);

                var tester = outerWidthTesterPxWidthPxMarginGrid;
                tester.testCallOnPxWidthPxMarginGridPerAllContentBoxItems.call(me);
                tester.testCallOnPxWidthPxMarginGridPerAllBorderBoxItems.call(me);

                var tester = outerWidthTesterPxWidthPxBorderGrid;
                tester.testCallOnPxWidthPxBorderGridPerAllContentBoxItems.call(me);
                tester.testCallOnPxWidthPxBorderGridPerAllBorderBoxItems.call(me);

                var tester = outerWidthTesterPercentageWidthGrid;
                tester.testCallOnPtWidthGridPerAllContentBoxItems.call(me);
                tester.testCallOnPtWidthGridPerAllBorderBoxItems.call(me);

                var tester = outerWidthTesterPercentageWidthPercentagePaddingGrid;
                tester.testCallOnPtWidthPtPaddingGridPerAllContentBoxItems.call(me);
                tester.testCallOnPtWidthPtPaddingGridPerAllBorderBoxItems.call(me);

                var tester = outerWidthTesterPercentageWidthPercentageMarginGrid;
                tester.testCallOnPtWidthPtMarginGridPerAllContentBoxItems.call(me);
                tester.testCallOnPtWidthPtMarginGridPerAllBorderBoxItems.call(me);

                me._after.call(me);
            });
        },

        _gridItemTests: {
            _boxSizing: null,
            BOX_SIZINGS: {CONTENT_BOX: "content-box", BORDER_BOX: "border-box"},

            PADDING_PX_SIZE: "10px",
            PADDING_PERCENTS_SIZE: "5.5%",
            MARGIN_PX_SIZE: "15px",
            MARGIN_PERCENTS_SIZE: "5.8%",
            BORDER_PX_SIZE: "3px",

            setBoxSizing: function(boxSizing) {
                if(boxSizing != this.BOX_SIZINGS.CONTENT_BOX &&
                    boxSizing != this.BOX_SIZINGS.BORDER_BOX) {
                    throw new Error("Can't set unknown box sizing!");
                }

                this._boxSizing = boxSizing;
            },

            _createItem: function(width) {
                var $item = $("<div/>");
                $item.css({
                    width: width,
                    height: "100px",
                    "box-sizing": this._boxSizing,
                    position: "absolute",
                    left: "10px",
                    top: "10px",
                    visibility: "hidden"
                });

                return $item;
            },

            doesFractionalResultsEquals: function(firstResult, secondResult) {
                var difference = Math.abs(firstResult - secondResult);
                return (difference < 0.1);
            },

            _getGridBoxSizingLabel: function() {
                if(outerWidthTester._grids.isContentBoxBSGrid()) {
                    var gridBoxSizingLabel = "; content-box";
                }
                else if(outerWidthTester._grids.isBorderBoxBSGrid()) {
                    var gridBoxSizingLabel = "; border-box";
                }

                return gridBoxSizingLabel;
            },

            callPerItemWithPxWidth: function($grid, gridWidth, itemPxWidth, expectedItemWidth) {
                var $item = this._createItem(itemPxWidth + "px");
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    SizesResolver.outerWidth($item.get(0)) == expectedItemWidth,
                    "call with: Grid -> width = " + gridWidth + BSLabel + "; Item -> width = " + itemPxWidth + "px; " +
                    "box-sizing = " + this._boxSizing + "; "
                );
            },

            callPerItemWithPxWidthAndPxPadding: function($grid, gridWidth, itemPxWidth, expectedItemWidth) {
                var $item = this._createItem(itemPxWidth + "px");
                $item.css({"padding": this.PADDING_PX_SIZE}); 
                $grid.append($item);
                
                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    SizesResolver.outerWidth($item.get(0)) == expectedItemWidth,
                    "call with: Grid -> width = " + gridWidth + BSLabel + "; Item -> width = " + itemPxWidth + "px; " +
                    "box-sizing = " + this._boxSizing + "; padding = " + this.PADDING_PX_SIZE
                );
            },

            callPerItemWithPxWidthAndPxMargin: function($grid, gridWidth, itemPxWidth, expectedItemWidth) {
                var $item = this._createItem(itemPxWidth + "px");
                $item.css({"margin": this.MARGIN_PX_SIZE});
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    SizesResolver.outerWidth($item.get(0), true) == expectedItemWidth,
                    "call with: Grid -> width = " + gridWidth + BSLabel + "; Item -> width = " + itemPxWidth + "px; " +
                    "box-sizing = " + this._boxSizing + "; margin = " + this.MARGIN_PX_SIZE
                );
            },

            callPerItemWithPxWidthAndPxBorder: function($grid, gridWidth, itemPxWidth, expectedItemWidth) {
                var $item = this._createItem(itemPxWidth + "px");
                $item.css({"border": this.BORDER_PX_SIZE + " black solid"});
                $grid.append($item);
                
                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    SizesResolver.outerWidth($item.get(0)) == expectedItemWidth,
                    "call with: Grid -> width = " + gridWidth + BSLabel + "; Item -> width = " + itemPxWidth + "px; " +
                    "box-sizing = " + this._boxSizing + "; border = " + this.BORDER_PX_SIZE
                );
            },

            callPerItemWithPercentageWidth: function($grid, gridWidth, itemPercentageWidth, expectedItemWidth) {
                var $item = this._createItem(itemPercentageWidth + "%");
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    this.doesFractionalResultsEquals(
                        SizesResolver.outerWidth($item.get(0), true), expectedItemWidth
                    ),
                    "call with: Grid -> width = " + gridWidth + BSLabel + "; Item -> width = " + itemPercentageWidth + "%; " +
                    "box-sizing = " + this._boxSizing
                );
            },

            callPerItemWithPercentageWidthAndPercentagePadding: function($grid, gridWidth, itemPercentageWidth, expectedItemWidth) {
                var $item = this._createItem(itemPercentageWidth + "%");
                $item.css({"padding": this.PADDING_PERCENTS_SIZE});
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    this.doesFractionalResultsEquals(
                        SizesResolver.outerWidth($item.get(0), true), expectedItemWidth
                    ),
                    "call with: Grid -> width = " + gridWidth + BSLabel + "; Item -> width = " + itemPercentageWidth + "%; " +
                    "box-sizing = " + this._boxSizing + "; padding = " + this.PADDING_PERCENTS_SIZE
                );
            },

            callPerItemWithPercentageWidthAndPercentageMargin: function($grid, gridWidth, itemPercentageWidth, expectedItemWidth) {
                var $item = this._createItem(itemPercentageWidth + "%");
                $item.css({"margin": this.MARGIN_PERCENTS_SIZE});
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    this.doesFractionalResultsEquals(
                        SizesResolver.outerWidth($item.get(0), true), expectedItemWidth
                    ),
                    "call with: Grid -> width = " + gridWidth + BSLabel + "; Item -> width = " + itemPercentageWidth + "%; " +
                    "box-sizing = " + this._boxSizing + "; margin = " + this.MARGIN_PERCENTS_SIZE
                );
            },

            callPerItemWithPercentageWidthAndPxBorder: function($grid, gridWidth, itemPercentageWidth, expectedItemWidth) {
                var $item = this._createItem(itemPercentageWidth + "%");
                $item.css({"border": this.BORDER_PX_SIZE + " black solid"});
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    this.doesFractionalResultsEquals(
                        SizesResolver.outerWidth($item.get(0), true), expectedItemWidth
                    ),
                    "call with: Grid -> width = " + gridWidth + BSLabel + "; Item -> width = " + itemPercentageWidth + "%; " +
                    "box-sizing = " + this._boxSizing + "; border = " + this.BORDER_PX_SIZE
                );
            }
        }
    }

    outerWidthTester.runTests();
    clearTestData();

    var outerHeightTester = {
        _before: function() {

        },

        _after: function() {

        },

        _grids: {
            _boxSizing: null,
            BOX_SIZINGS: {CONTENT_BOX: "content-box", BORDER_BOX: "border-box"},

            PADDING_PX_SIZE: "20px",
            PADDING_PERCENTS_SIZE: "10.5%",
            MARGIN_PX_SIZE: "20px",
            MARGIN_PERCENTS_SIZE: "10.5%",
            BORDER_PX_SIZE: "3px",

            GRID_WIDTH: "50px",
            GRID_WRAPPER_WIDTH: "50px", // Will be as children width(GRID_WIDTH)

            setBoxSizing: function(boxSizing) {
                if(boxSizing != this.BOX_SIZINGS.CONTENT_BOX &&
                    boxSizing != this.BOX_SIZINGS.BORDER_BOX) {
                    throw new Error("Can't set unknown box sizing!");
                }

                this._boxSizing = boxSizing;
            },

            isContentBoxBSGrid: function() {
                return this._boxSizing == this.BOX_SIZINGS.CONTENT_BOX;
            },

            isBorderBoxBSGrid: function() {
                return this._boxSizing == this.BOX_SIZINGS.BORDER_BOX;
            },

            createGridWithPxHeight: function(pxHeight) {
                var $grid = $("<div/>");
                $grid.css({
                    width: this.GRID_WIDTH,
                    height: pxHeight + "px",
                    "box-sizing": this._boxSizing,
                    position: "relative"
                });

                return $grid;
            },

            createGridWithPxHeightAndPxPadding: function(pxHeight) {
                $grid = this.createGridWithPxHeight(pxHeight);
                $grid.css({"padding": this.PADDING_PX_SIZE});

                return $grid;
            },

            createGridWithPxHeightAndPxMargin: function(pxHeight) {
                $grid = this.createGridWithPxHeight(pxHeight);
                $grid.css({"margin": this.MARGIN_PX_SIZE});

                return $grid;
            },

            createGridWithPxHeightAndPxBorder: function(pxHeight) {
                $grid = this.createGridWithPxHeight(pxHeight);
                $grid.css({"border": this.BORDER_PX_SIZE + " black solid"});

                return $grid;
            },

            createGridWithPercentageHeight: function(wrapperPxHeight, percentageHeight) {
                var $wrapper = $("<div/>");
                $wrapper.css({"height": wrapperPxHeight + "px", "width": this.GRID_WRAPPER_WIDTH});

                var $grid = $("<div/>");
                $grid.css({
                    width: this.GRID_WIDTH,
                    height: percentageHeight + "%",
                    "box-sizing": this._boxSizing,
                    position: "relative"
                });

                $wrapper.append($grid);

                return $grid;
            },

            createGridWithPercentageHeightAndPercentagePadding: function(wrapperPxHeight, percentageHeight) {
                var $grid = this.createGridWithPercentageHeight(wrapperPxHeight, percentageHeight);
                $grid.css({"padding": this.PADDING_PERCENTS_SIZE});

                return $grid;
            },

            createGridWithPercentageHeightAndPercentageMargin: function(wrapperPxHeight, percentageHeight) {
                var $grid = this.createGridWithPercentageHeight(wrapperPxHeight, percentageHeight);
                $grid.css({"margin": this.MARGIN_PERCENTS_SIZE});

                return $grid;
            }
        },

        runTests: function() {
            var me = this;

            test("outerHeight(content-box grid)", function() {
                me._before.call(me);

                me._grids.setBoxSizing(me._grids.BOX_SIZINGS.CONTENT_BOX);

                outerHeightTesterPxHeightGrid.testCallOnPxHeightGridPerAllContentBoxItems.call(me);
                outerHeightTesterPxHeightGrid.testCallOnPxHeightGridPerAllBorderBoxItems.call(me);

                var tester = outerHeightTesterPxHeightPxPaddingGrid;
                tester.testCallOnPxHeightAndPxPaddingGridPerAllContentBoxItems.call(me);
                tester.testCallOnPxHeightAndPxPaddingGridPerAllBorderBoxItems.call(me);

                var tester = outerHeightTesterPxHeightPxMarginGrid;
                tester.testCallOnPxHeightPxMarginGridPerAllContentBoxItems.call(me);
                tester.testCallOnPxHeightPxMarginGridPerAllBorderBoxItems.call(me);

                var tester = outerHeightTesterPxHeightPxBorderGrid;
                tester.testCallOnPxHeightPxBorderGridPerAllContentBoxItems.call(me);
                tester.testCallOnPxHeightPxBorderGridPerAllBorderBoxItems.call(me);

                var tester = outerHeightTesterPercentageHeightGrid;
                tester.testCallOnPtHeightGridPerAllContentBoxItems.call(me);
                tester.testCallOnPtHeightGridPerAllBorderBoxItems.call(me);

                var tester = outerHeightTesterPercentageHeightPercentagePaddingGrid;
                tester.testCallOnPtHeightPtPaddingGridPerAllContentBoxItems.call(me);
                tester.testCallOnPtHeightPtPaddingGridPerAllBorderBoxItems.call(me);

                var tester = outerHeightTesterPercentageHeightPercentageMarginGrid;
                tester.testCallOnPtHeightPtMarginGridPerAllContentBoxItems.call(me);
                tester.testCallOnPtHeightPtMarginGridPerAllBorderBoxItems.call(me);

                me._after.call(me);
            });

            test("outerHeight(border-box grid)", function() {
                me._before.call(me);

                me._grids.setBoxSizing(me._grids.BOX_SIZINGS.BORDER_BOX);

                outerHeightTesterPxHeightGrid.testCallOnPxHeightGridPerAllContentBoxItems.call(me);
                outerHeightTesterPxHeightGrid.testCallOnPxHeightGridPerAllBorderBoxItems.call(me);

                var tester = outerHeightTesterPxHeightPxPaddingGrid;
                tester.testCallOnPxHeightAndPxPaddingGridPerAllContentBoxItems.call(me);
                tester.testCallOnPxHeightAndPxPaddingGridPerAllBorderBoxItems.call(me);

                var tester = outerHeightTesterPxHeightPxMarginGrid;
                tester.testCallOnPxHeightPxMarginGridPerAllContentBoxItems.call(me);
                tester.testCallOnPxHeightPxMarginGridPerAllBorderBoxItems.call(me);

                var tester = outerHeightTesterPxHeightPxBorderGrid;
                tester.testCallOnPxHeightPxBorderGridPerAllContentBoxItems.call(me);
                tester.testCallOnPxHeightPxBorderGridPerAllBorderBoxItems.call(me);

                var tester = outerHeightTesterPercentageHeightGrid;
                tester.testCallOnPtHeightGridPerAllContentBoxItems.call(me);
                tester.testCallOnPtHeightGridPerAllBorderBoxItems.call(me);

                var tester = outerHeightTesterPercentageHeightPercentagePaddingGrid;
                tester.testCallOnPtHeightPtPaddingGridPerAllContentBoxItems.call(me);
                tester.testCallOnPtHeightPtPaddingGridPerAllBorderBoxItems.call(me);

                var tester = outerHeightTesterPercentageHeightPercentageMarginGrid;
                tester.testCallOnPtHeightPtMarginGridPerAllContentBoxItems.call(me);
                tester.testCallOnPtHeightPtMarginGridPerAllBorderBoxItems.call(me);

                me._after.call(me);
            });
        },

        _gridItemTests: {
            _boxSizing: null,
            BOX_SIZINGS: {CONTENT_BOX: "content-box", BORDER_BOX: "border-box"},

            PADDING_PX_SIZE: "10px",
            PADDING_PERCENTS_SIZE: "5.5%",
            MARGIN_PX_SIZE: "15px",
            MARGIN_PERCENTS_SIZE: "5.8%",
            BORDER_PX_SIZE: "3px",

            setBoxSizing: function(boxSizing) {
                if(boxSizing != this.BOX_SIZINGS.CONTENT_BOX &&
                    boxSizing != this.BOX_SIZINGS.BORDER_BOX) {
                    throw new Error("Can't set unknown box sizing!");
                }

                this._boxSizing = boxSizing;
            },

            _createItem: function(height) {
                var $item = $("<div/>");
                $item.css({
                    width: "100px",
                    height: height,
                    "box-sizing": this._boxSizing,
                    position: "absolute",
                    left: "10px",
                    top: "10px",
                    visibility: "hidden"
                });

                return $item;
            },

            doesFractionalResultsEquals: function(firstResult, secondResult) {
                var difference = Math.abs(firstResult - secondResult);
                return (difference < 0.1);
            },

            _getGridBoxSizingLabel: function() {
                if(outerHeightTester._grids.isContentBoxBSGrid()) {
                    var gridBoxSizingLabel = "; content-box";
                }
                else if(outerHeightTester._grids.isBorderBoxBSGrid()) {
                    var gridBoxSizingLabel = "; border-box";
                }

                return gridBoxSizingLabel;
            },

            callPerItemWithPxHeight: function($grid, gridHeight, itemPxHeight, expectedItemHeight) {
                var $item = this._createItem(itemPxHeight + "px");
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    SizesResolver.outerHeight($item.get(0)) == expectedItemHeight,
                    "call with: Grid -> height = " + gridHeight + BSLabel + "; Item -> height = " + itemPxHeight + "px; " +
                    "box-sizing = " + this._boxSizing + "; "
                );
            },

            callPerItemWithPxHeightAndPxPadding: function($grid, gridHeight, itemPxHeight, expectedItemHeight) {
                var $item = this._createItem(itemPxHeight + "px");
                $item.css({"padding": this.PADDING_PX_SIZE});
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    SizesResolver.outerHeight($item.get(0)) == expectedItemHeight,
                    "call with: Grid -> height = " + gridHeight + BSLabel + "; Item -> height = " + itemPxHeight + "px; " +
                    "box-sizing = " + this._boxSizing + "; padding = " + this.PADDING_PX_SIZE
                );
            },

            callPerItemWithPxHeightAndPxMargin: function($grid, gridHeight, itemPxHeight, expectedItemHeight) {
                var $item = this._createItem(itemPxHeight + "px");
                $item.css({"margin": this.MARGIN_PX_SIZE});
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    SizesResolver.outerHeight($item.get(0), true) == expectedItemHeight,
                    "call with: Grid -> height = " + gridHeight + BSLabel + "; Item -> height = " + itemPxHeight + "px; " +
                    "box-sizing = " + this._boxSizing + "; margin = " + this.MARGIN_PX_SIZE
                );
            },

            callPerItemWithPxHeightAndPxBorder: function($grid, gridHeight, itemPxHeight, expectedItemHeight) {
                var $item = this._createItem(itemPxHeight + "px");
                $item.css({"border": this.BORDER_PX_SIZE + " black solid"});
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    SizesResolver.outerHeight($item.get(0), true) == expectedItemHeight,
                    "call with: Grid -> height = " + gridHeight + BSLabel + "; Item -> height = " + itemPxHeight + "px; " +
                    "box-sizing = " + this._boxSizing + "; border = " + this.BORDER_PX_SIZE
                );
            },

            callPerItemWithPercentageHeight: function($grid, gridHeight, itemPercentageHeight, expectedItemHeight) {
                var $item = this._createItem(itemPercentageHeight + "%");
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    this.doesFractionalResultsEquals(
                        SizesResolver.outerHeight($item.get(0), true), expectedItemHeight
                    ),
                    "call with: Grid -> height = " + gridHeight + BSLabel + "; Item -> height = " + itemPercentageHeight + "%; " +
                    "box-sizing = " + this._boxSizing
                );
            },

            callPerItemWithPercentageHeightAndPercentagePadding: function($grid, gridHeight, itemPercentageHeight, expectedItemHeight) {
                var $item = this._createItem(itemPercentageHeight + "%");
                $item.css({"padding": this.PADDING_PERCENTS_SIZE});
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    this.doesFractionalResultsEquals(
                        SizesResolver.outerHeight($item.get(0), true), expectedItemHeight
                    ),
                    "call with: Grid -> height = " + gridHeight + BSLabel + "; Item -> height = " + itemPercentageHeight + "%; " +
                    "box-sizing = " + this._boxSizing + "; padding = " + this.PADDING_PERCENTS_SIZE
                );
            },

            callPerItemWithPercentageHeightAndPercentageMargin: function($grid, gridHeight, itemPercentageHeight, expectedItemHeight) {
                var $item = this._createItem(itemPercentageHeight + "%");
                $item.css({"margin": this.MARGIN_PERCENTS_SIZE});
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    this.doesFractionalResultsEquals(
                        SizesResolver.outerHeight($item.get(0), true), expectedItemHeight
                    ),
                    "call with: Grid -> height = " + gridHeight + BSLabel + "; Item -> height = " + itemPercentageHeight + "%; " +
                    "box-sizing = " + this._boxSizing + "; margin = " + this.MARGIN_PERCENTS_SIZE
                );
            },

            callPerItemWithPercentageHeightAndPxBorder: function($grid, gridHeight, itemPercentageHeight, expectedItemHeight) {
                var $item = this._createItem(itemPercentageHeight + "%");
                $item.css({"border": this.BORDER_PX_SIZE + " black solid"});
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    this.doesFractionalResultsEquals(
                        SizesResolver.outerHeight($item.get(0), true), expectedItemHeight
                    ),
                    "call with: Grid -> height = " + gridHeight + BSLabel + "; Item -> height = " + itemPercentageHeight + "%; " +
                    "box-sizing = " + this._boxSizing + "; border = " + this.BORDER_PX_SIZE
                );
            }
        }
    }

    outerHeightTester.runTests();
    clearTestData();
});