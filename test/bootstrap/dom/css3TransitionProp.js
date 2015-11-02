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

            test("css3.transitionProperty", function(assert) {
                var test = function(tests) {
                    me._before.call(me);

                    for(var i = 0; i < tests.length; i++)
                        me["_" + tests[i]].call(me, assert);

                    me._after.call(me);
                }

                // Notes -> Ie can hide ease and 0ms parts, Firefox can add 0s substr
                // in the end of the transition string
                test([
                    "addNewParamToEmptyTrString",
                    "addNewParamToNotEmptyTrString",
                    "replaceParamOnTrStringWithOnlyThatParam",
                    "replaceParamOnTrStringWithThatAndOtherParams",
                    "replaceParamOnTrStringWithMultipleParams",
                    "replaceMultipleParamsOnTrStringWithMultipleParams",
                    "replaceParamOnTrStringWithCubicBezierEasing"
                ]);
            });
        },

        _addNewParamToEmptyTrString: function() {
            var fakeItem = document.createElement("div");
            fakeItem.style[Prefixer.get('transition', fakeItem)] = "";
            Dom.css3.transitionProperty(fakeItem, "width 0ms ease");

            ok(
                //fakeItem.style[Prefixer.get('transition', fakeItem)].search("width 0ms ease") != -1,
                fakeItem.style[Prefixer.get('transition', fakeItem)].search("width") != -1,
                "call with 'width 0ms ease' param on empty transition string"
            );
        },

        _addNewParamToNotEmptyTrString: function() {
            var fakeItem = document.createElement("div");
            fakeItem.style[Prefixer.get('transition', fakeItem)] = "height 0ms ease, transform 0ms ease";
            Dom.css3.transitionProperty(fakeItem, "width 0ms ease");

            ok(
                //fakeItem.style[Prefixer.get('transition', fakeItem)].search("width 0ms ease") != -1 &&
                //fakeItem.style[Prefixer.get('transition', fakeItem)].search("height 0ms ease") != -1 &&
                //fakeItem.style[Prefixer.get('transition', fakeItem)].search("transform 0ms ease") != - 1,
                fakeItem.style[Prefixer.get('transition', fakeItem)].search("width") != -1 &&
                fakeItem.style[Prefixer.get('transition', fakeItem)].search("height") != -1 &&
                fakeItem.style[Prefixer.get('transition', fakeItem)].search("transform") != - 1,
                "call with 'width 0ms ease' param on 'height 0ms ease, transform 0ms ease' string"
            );
        },

        _replaceParamOnTrStringWithOnlyThatParam: function() {
            var fakeItem = document.createElement("div");
            fakeItem.style[Prefixer.get('transition', fakeItem)] = "transform 0ms ease";
            Dom.css3.transitionProperty(fakeItem, "transform 10ms ease");

            ok(
                //fakeItem.style[Prefixer.get('transition', fakeItem)].search("transform 10ms ease") != -1,
                fakeItem.style[Prefixer.get('transition', fakeItem)].search("transform 10ms") != -1,
                "call with 'transform 10ms ease' param on 'transform 0ms ease' string"
            );
        },

        _replaceParamOnTrStringWithThatAndOtherParams: function() {
            var fakeItem = document.createElement("div");
            fakeItem.style[Prefixer.get('transition', fakeItem)] = "width 0ms ease, height 0ms ease";
            Dom.css3.transitionProperty(fakeItem, "width 10ms ease");

            ok(
                //fakeItem.style[Prefixer.get('transition', fakeItem)].search("width 10ms ease") != -1 &&
                // fakeItem.style[Prefixer.get('transition', fakeItem)].search("height 0ms ease") != -1,
                fakeItem.style[Prefixer.get('transition', fakeItem)].search("width 10ms") != -1 &&
                fakeItem.style[Prefixer.get('transition', fakeItem)].search("height") != -1,
                "call with 'width 10ms ease' param on 'width 0ms ease, height 0ms ease' string"
            );
        },

        _replaceParamOnTrStringWithMultipleParams: function() {
            var fakeItem = document.createElement("div");
            fakeItem.style[Prefixer.get('transition', fakeItem)] = "width 0ms ease, height 0ms ease";
            Dom.css3.transitionProperty(fakeItem, "transform 10ms ease, height 20ms ease");

            ok(
                //fakeItem.style[Prefixer.get('transition', fakeItem)].search("transform 10ms ease") != -1 &&
                //fakeItem.style[Prefixer.get('transition', fakeItem)].search("height 20ms ease") != -1 &&
                //fakeItem.style[Prefixer.get('transition', fakeItem)].search("width 0ms ease") != -1,
                fakeItem.style[Prefixer.get('transition', fakeItem)].search("transform 10ms") != -1 &&
                fakeItem.style[Prefixer.get('transition', fakeItem)].search("height 20ms") != -1 &&
                fakeItem.style[Prefixer.get('transition', fakeItem)].search("width") != -1,
                "call with 'transform 10ms ease, height 20ms ease' param on 'width 0ms ease, height 0ms ease' string"
            );
        },

        _replaceMultipleParamsOnTrStringWithMultipleParams: function() {
            var fakeItem = document.createElement("div");
            fakeItem.style[Prefixer.get('transition', fakeItem)] = "width 0ms ease, height 0ms ease";
            Dom.css3.transitionProperty(fakeItem, "transform 10ms ease");
            Dom.css3.transitionProperty(fakeItem, "height 20ms ease");
            Dom.css3.transitionProperty(fakeItem, "width 30ms ease");

            ok(
                //fakeItem.style[Prefixer.get('transition', fakeItem)].search("transform 10ms ease") != -1 &&
                //fakeItem.style[Prefixer.get('transition', fakeItem)].search("height 20ms ease") != -1 &&
                //fakeItem.style[Prefixer.get('transition', fakeItem)].search("width 0ms ease") != -1,
                fakeItem.style[Prefixer.get('transition', fakeItem)].search("transform 10ms") != -1 &&
                fakeItem.style[Prefixer.get('transition', fakeItem)].search("height 20ms") != -1 &&
                fakeItem.style[Prefixer.get('transition', fakeItem)].search("width 30ms") != -1,
                "call with 'transform 10ms ease, height 20ms ease width 30ms ease' param on 'width 0ms ease, height 0ms ease' string"
            );
        },

        _replaceParamOnTrStringWithCubicBezierEasing: function() {
            var fakeItem = document.createElement("div");
            fakeItem.style[Prefixer.get('transition', fakeItem)] = "width 5ms cubic-bezier(0.755, 0.05, 0.855, 0.06), height 0ms ease";
            Dom.css3.transitionProperty(fakeItem, "height 10ms ease");

            ok(
                //fakeItem.style[Prefixer.get('transition', fakeItem)].search("width 10ms ease") != -1 &&
                // fakeItem.style[Prefixer.get('transition', fakeItem)].search("height 0ms ease") != -1,
                fakeItem.style[Prefixer.get('transition', fakeItem)].search(/(.*)width 5ms cubic-bezier\(0.755, 0.05, 0.855, 0.06\)(.*)/) != -1 &&
                fakeItem.style[Prefixer.get('transition', fakeItem)].search("height 10ms") != -1,
                "call with 'height 10ms ease' param on 'width 5ms cubic-bezier(0.755, 0.05, 0.855, 0.06), height 0ms ease' string"
            );
        }
    }

    tester.runTests();
    clearTestData();
});