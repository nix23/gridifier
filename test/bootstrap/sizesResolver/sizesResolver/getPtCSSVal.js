$(document).ready(function() {
    module("SizesResolver");

    var tester = {
        _before: function() {

        },

        _after: function() {

        },

        runTests: function() {
            var me = this;

            test("getPtCSSVal", function(assert) {
                var test = function(tests) {
                    me._before.call(me);

                    for(var i = 0; i < tests.length; i++)
                        me["_" + tests[i]].call(me, assert);

                    me._after.call(me);
                }

                test([
                    "itemWithoutParentNode",
                    "wrongCSSProp",
                    "allPossibleValsWithItemPtVal",
                    "allPossibleValsWithItemPtValDeclaredInClass",
                    "withShorthandPtVals"
                ]);
            });
        },

        _itemWithoutParentNode: function(assert) {
            clearTestData();

            var testerDiv = document.createElement("div");
            assert.throws(
                function() { SizesResolver._getPtCSSVal("testCSSProperty", testerDiv); },
                /(.*)no parentNode(.*)/,
                "call on element without parent node"
            );
        },

        _wrongCSSProp: function(assert) {
            clearTestData();

            var testerDiv = document.createElement("div");
            $testContent.append($(testerDiv));

            assert.throws(
                function() { SizesResolver._getPtCSSVal("wrongCSSProperty", testerDiv); },
                /(.*)no prop(.*)/,
                "call with wrong CSS property"
            );
        },

        _allPossibleValsWithItemPtVal: function() {
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
                    SizesResolver._getPtCSSVal(cssProperty, testerDiv) == "20%",
                    "call with cssProperty = '" + cssProperty + "' and % value"
                );

                var recalculatedElementCSS = SizesResolver.getUncomputedCSS(testerDiv);
                ok(
                    SizesResolver._getPtCSSVal(cssProperty, testerDiv, recalculatedElementCSS) == "20%",
                    "call with cssProperty = '" + cssProperty + "', % value and recalculatedElementCSS"
                );
            }
        },

        _allPossibleValsWithItemPtValDeclaredInClass: function() {
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
                    SizesResolver._getPtCSSVal(cssProperty, testerDiv) == "60%",
                    "call with cssProperty = '" + cssProperty + "' and % value(declared in class)"
                );

                var recalculatedElementCSS = SizesResolver.getUncomputedCSS(testerDiv);
                ok(
                    SizesResolver._getPtCSSVal(cssProperty, testerDiv, recalculatedElementCSS) == "60%",
                    "call with cssProperty = '" + cssProperty + "', % value(declared in class) and recalculatedElementCSS"
                );
            }
        },

        _withShorthandPtVals: function() {
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
                    if(!SizesResolver._getPtCSSVal(computedCssPropertiesToCheck[j], testerDiv) == "60%")
                        areAllFullhandedPropertiesCorrectlyCalculated = false;
                }

                ok(
                    areAllFullhandedPropertiesCorrectlyCalculated,
                    "call with shorthandProperty = '" + shorthandCssProperty + "', % value(declared in class)"
                );
            }
        }
    }

    tester.runTests();
    clearTestData();
});