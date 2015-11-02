$(document).ready(function() {
    module("Dom");

    var tester = {
        _before: function() {
            ;
        },

        _after: function() {
            ;
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
                    "trim",
                    "hasOwnProp",
                    "hasAnyProp",
                    "hasVal",
                    "hasTransitions",
                    "attrCrud",
                    "typeCheckers",
                    "isChildOf",
                    "rounding",
                    "filter",
                    "browsers",
                    "css",
                    "cssSet",
                    "css3",
                    "css3Init",
                    "getRm"
                ]);
            });
        },

        _trim: function() {
            var fakeStr = "  test    ";
            ok(fakeStr.gridifierTrim() == "test", "trim test string");
        },

        _hasOwnProp: function() {
            var obj = {testProp: "test"};
            ok(Dom.hasOwnProp(obj, "testProp"), "obj has own prop 'testProp'");
            ok(!Dom.hasOwnProp(obj, "wrongProp"), "obj has no own prop 'wrongProp'");
        },

        _hasAnyProp: function() {
            var obj = {testProp: "test"};
            ok(Dom.hasAnyProp(obj, ["noProp", "testProp"]), "obj has one of props");
            ok(!Dom.hasAnyProp(obj, ["noProp", "noProp2"]), "obj has none of props");
        },

        _hasVal: function() {
            var obj = {testProp: "testval", testProp2: "testVal2"};
            ok(Dom.hasVal(obj, "testval"), "obj has val 'testval'");
            ok(!Dom.hasVal(obj, "wrongVal"), "obj has no val 'wrongVal'");
        },

        _hasTransitions: function() {
            var tester = {style: {OTransition: ""}};
            Dom._checkIfHasTransitions(tester);
            ok(Dom.hasTransitions(), "browser has transitions");
            var tester = {style: {notrans: ""}};
            Dom._checkIfHasTransitions(tester);
            ok(!Dom.hasTransitions(), "browser has no transitions");
            Dom._checkIfHasTransitions(Dom.div());
        },

        _attrCrud: function() {
            var div = Dom.div();
            ok(div.nodeName == "DIV", "div created ok");
            ok(Dom.int("1434") == 1434, "parseInt ok");

            Dom.set(div, "data-test", "val");
            ok(Dom.get(div, "data-test") == "val", "get-set data ok");
            Dom.rm(div, "data-test");
            ok(Dom.get(div, "data-test") == null, "rm data ok");

            Dom.set(div, [["data-test", "val1"], ["data-test2", "val2"]]);
            ok(Dom.get(div, "data-test") == "val1" &&
               Dom.get(div, "data-test2") == "val2",
               "set multiple datas ok");

            Dom.rmIfHas(div, ["data-test", "data-test2"]);
            ok(Dom.get(div, "data-test") == null &&
               Dom.get(div, "data-tes2") == null,
               "rmIfHas array of vals ok");

            Dom.set(div, "data-test", "val");
            ok(Dom.has(div, "data-test"), "div has data attr");
            ok(!Dom.has(div, "data-wrong"), "div has not data attr");
            Dom.rmIfHas(div, "data-test");
            ok(Dom.get(div, "data-test") == null, "rmIfHas single val ok");

            Dom.hide(div);
            ok(div.style.visibility == "hidden", "div is hidden");
            Dom.show(div);
            ok(div.style.visibility == "visible", "div is visible");
        },

        _typeCheckers: function() {
            var native = Dom.div();
            var $j = $("<div/>");

            var jqueryTmp = jQuery;
            jQuery = undefined;
            ok(!Dom.isJquery(native), "no jquery");
            jQuery = jqueryTmp;

            ok(!Dom.isJquery(native), "not jquery object(native)");
            ok(Dom.isJquery($j), "is jquery object");
            ok(Dom.isNative(native), "is native object");
            ok(!Dom.isNative($j), "is not native object");
            ok(Dom.isArray([]), "is array");
            ok(!Dom.isArray($j), "is not array");
            ok(Dom.isObj({}), "is object");
            ok(!Dom.isObj(24), "is not object");
            ok(!Dom.isObj(null), "null is not object");
        },

        _isChildOf: function() {
            var div = Dom.div();
            var child = Dom.div();
            div.appendChild(child);

            ok(Dom.isChildOf(child, div), "is child of container");
            ok(!Dom.isChildOf(div, child), "container is not child of child");
            ok(!Dom.isChildOf(div, div), "is not child of itself");
        },

        _rounding: function() {
            ok(Dom.toFixed(1.005, 2) == 1.01, "toFixed 1.005, 2 = 1.01");
            ok(Dom.toFixed(1.5352, 1) == 1.5, "toFixed 1.5352, 1 = 1.5");
            ok(Dom.toFixed(1.677, 2) == 1.68, "toFixed 1.677, 2 = 1.68");
            ok(Dom.toFixed(1.699, 2) == 1.70, "toFixed 1.699, 2 = 1.70");

            ok(Dom.areRoundedOrFlooredEq(16.3, 16.4), "areRoundedOrFlooredEq - rounded eq");
            ok(Dom.areRoundedOrFlooredEq(16.3, 16.7), "areRoundedOrFlooredEq - floored eq");
            ok(!Dom.areRoundedOrFlooredEq((15.2, 16.3)), "areRoundedOrFlooredEq - not eq");

            ok(Dom.areRoundedOrCeiledEq(16.3, 16.4), "areRoundedOrCeiledEq - rounded eq");
            ok(Dom.areRoundedOrCeiledEq(16.3, 16.7), "areRoundedOrCeiledEq - ceiled eq");
            ok(!Dom.areRoundedOrCeiledEq((15.2, 16.3)), "areRoundedOrCeiledEq - not eq");
        },

        _filter: function() {
            var arr = [100, 20, 50, 60];
            ok(Dom.filter(arr, function(i) { return i < 50; }).length == 1, "filter ok");
        },

        _browsers: function() {
            var orig = Dom.browsers._navigator;
            Dom.browsers._navigator = "android-UCBrowser";
            ok(Dom.browsers.isAndroidUC(), "is android uc browser");
            ok(Dom.browsers.isAndroid(), "is android");

            Dom.browsers._navigator = "android-firefox";
            ok(Dom.browsers.isAndroidFirefox(), "is android ff browser");

            Dom.browsers._navigator = "";
            ok(!Dom.browsers.isAndroid(), "is not android");
            ok(!Dom.browsers.isAndroidFirefox(), "is not android ff");
            ok(!Dom.browsers.isAndroidUC(), "is not android UC");

            Dom.browsers._navigator = orig;
        },

        _css: function() {
            var div = Dom.div();
            Dom.css.addClass(div, "first second");

            ok(Dom.css.hasClass(div, "first") && Dom.css.hasClass(div, "second"), "add/has class ok");
            Dom.css.removeClass(div, "second");
            ok(!Dom.css.hasClass(div, "second"), "remove class ok");
            Dom.css.addClass(div, "third");
            Dom.css.addClass(div, "fourth");
            ok(Dom.css.hasClass(div, "fourth"), "seq-al addClass ok");
            Dom.css.removeClass(div, "notExisting");
            ok(Dom.css.hasClass(div, "first") && Dom.css.hasClass(div, "third") &&
               Dom.css.hasClass(div, "fourth"), "classes are same after rm not existing");

            var emptyDiv = Dom.div();
            ok(!Dom.css.hasClass(emptyDiv, "second"), "empty class div has no class");
        },

        _cssSet: function() {
            var div = Dom.div();
            Dom.css.set(div, {width: "100px", height: "200px"});

            ok(div.style.width == "100px" && div.style.height == "200px", "css.set ok");

            var fakeDiv = {style: {}};
            Dom.css.set4(fakeDiv, "margin", 40);
            ok(fakeDiv.style.marginLeft == 40 && fakeDiv.style.marginRight == 40 &&
               fakeDiv.style.marginTop == 40 && fakeDiv.style.marginBottom == 40,
               "css.set4 with single value ok");

            var fakeDiv = {style: {}};
            var sourceProps = {marginLeft: 20, marginRight: 20, marginTop: 10, marginBottom: 10};
            Dom.css.set4(fakeDiv, "margin", sourceProps);
            ok(fakeDiv.style.marginLeft == 20 && fakeDiv.style.marginRight == 20 &&
                fakeDiv.style.marginTop == 10 && fakeDiv.style.marginBottom == 10,
                "css.set4 with source values ok");
        },

        _css3Init: function() {
            var contains = function(prop, vals) {
                var containsAll = true;
                for(var i = 0; i < vals.length; i++) {
                    var contains = false;
                    for(var j = 0; j < Dom.css3[prop].length; j++) {
                        if(Dom.css3[prop][j] == vals[i]) {
                            contains = true;
                            break;
                        }
                    }

                    if(!contains) containsAll = false;
                }

                return containsAll;
            }

            ok(contains("_opacityProps", ["WebkitOpacity", "MozOpacity", "opacity"]),
               "_opacityProps init ok");
            ok(contains("_perspectiveProps", ["WebkitPerspective", "MozPerspective", "perspective"]),
               "_perspectiveProps init ok");
            ok(contains("_transformStyleProps", ["transformStyle", "WebkitTransformStyle", "MozTransformStyle"]),
               "_transformStyle init ok");
            ok(contains("_backfaceVisibilityProps", ["WebkitBackfaceVisibility", "MozBackfaceVisibility",
               "backfaceVisibility"]), "_backfaceVisibility init ok");
            ok(contains("_transformOriginProps", ["webkitTransformOrigin", "mozTransformOrigin", "oTransformOrigin",
               "msTransformOrigin", "transformOrigin"]), "_transformOrigin init ok");
        },

        _css3: function() {
            var fakeItem = document.createElement("div");
            Dom.css3.transition(fakeItem, "width 600ms ease");
            Dom.css3.transform(fakeItem, "scale(2.5) rotate(90deg)");

            if(Dom.hasTransitions()) {
                ok(fakeItem.style[Prefixer.get('transition', fakeItem)].search("width 600ms") != -1,
                    "transition set ok");
            }
            ok(fakeItem.style[Prefixer.get('transform', fakeItem)] == "scale(2.5) rotate(90deg)",
               "transform set ok");

            var fakeItem = {style: {}};
            Dom.css3.style(fakeItem, ["transition", "WebkitTransition"], "ease 500ms");
            ok(fakeItem.style.transition == "ease 500ms" && fakeItem.style.WebkitTransition == "ease 500ms",
               "css3 set style from arr of props ok");

            var fakeItem = {style: {}};
            Dom.css3.opacity(fakeItem, "0.5");
            ok(fakeItem.style.opacity == "0.5" && fakeItem.style.WebkitOpacity == "0.5",
               "css3 set opacity ok");

            var fakeItem = {style: {}};
            Dom.css3.perspective(fakeItem, "1");
            ok(fakeItem.style.perspective == "1" && fakeItem.style.WebkitPerspective == "1",
               "css3 set perspective ok");

            var fakeItem = {style: {}};
            Dom.css3.transformStyle(fakeItem, "2");
            ok(fakeItem.style.transformStyle == "2" && fakeItem.style.WebkitTransformStyle == "2",
               "css3 set transformStyle ok");

            var fakeItem = {style: {}};
            Dom.css3.backfaceVisibility(fakeItem, "hidden");
            ok(fakeItem.style.backfaceVisibility == "hidden" && fakeItem.style.WebkitBackfaceVisibility == "hidden",
               "css3 set backfaceVisibility ok");

            var fakeItem = {style: {transformOrigin: "", webkitTransformOrigin: ""}};
            Dom.css3.transformOrigin(fakeItem, "50% 50%");
            ok(fakeItem.style.transformOrigin == "50% 50%" && fakeItem.style.webkitTransformOrigin == "50% 50%"
               && typeof fakeItem.style.msTransformOrigin == "undefined",
               "css3 set transformOrigin ok");
        },

        _getRm: function() {
            var tester = Dom.div();
            Dom.css.addClass(tester, "testSelect");
            Dom.set(tester, "id", "testSelect");
            Dom.set(tester, "data-test-select", "y");
            document.body.appendChild(tester);

            ok(Dom.find.byId("testSelect").nodeName == "DIV", "get by id ok");
            ok(Dom.find.byClass(document.body, "testSelect")[0].nodeName == "DIV", "get by class ok");
            ok(Dom.find.byQuery(document.body, "> [data-test-select]")[0].nodeName == "DIV", "get by query with > ok");
            ok(Dom.find.byQuery(document.body, "[data-test-select]")[0].nodeName == "DIV", "get by query data ok");
            Dom.remove.byQuery(document.body, ".testSelect");
            ok(Dom.find.byClass(document.body, "testSelect").length == 0, "get by class after rm ok");
        }
    }

    tester.runTests();
    clearTestData();
});