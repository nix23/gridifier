$(document).ready(function() {
    module("Dom abstraction layer tests.");

    var CSS3transformPropertyTester = {
        _before: function() {
            ;
        },

        _after: function() {
            ;
        },

        runTests: function() {
            var me = this;

            test("CSS3transformProperty", function(assert) {
                me._before.call(me);

                me._testCallOnAddingNewParamToEmptyTransformString.call(me);
                me._testCallOnAddingNewParamToNotEmptyTransformString.call(me);
                me._testCallOnReplacingParamOnTransformStringOnlyWithThatParam.call(me);
                me._testCallOnReplacingParamOnTransformStringWithThatAndOtherParams.call(me);
                me._testCallOnReplacingParamOnTransformStringWithMultipleParams.call(me);

                me._after.call(me);
            });
        },

        _testCallOnAddingNewParamToEmptyTransformString: function() {
            var fakeDOMElem = document.createElement("div");
            fakeDOMElem.style[Prefixer.get('transform', fakeDOMElem)] = "";
            Dom.css3.transformProperty(fakeDOMElem, "scale", 1);

            ok(
                fakeDOMElem.style[Prefixer.get('transform', fakeDOMElem)] == "scale(1)",
                "call with scale(1) param on empty transform string"
            );
        },

        _testCallOnAddingNewParamToNotEmptyTransformString: function() {
            var fakeDOMElem = document.createElement("div");
            fakeDOMElem.style[Prefixer.get('transform', fakeDOMElem)] = "rotate(90deg)";
            Dom.css3.transformProperty(fakeDOMElem, "scale", 1, true);
            
            ok(
                fakeDOMElem.style[Prefixer.get('transform', fakeDOMElem)] == "rotate(90deg) scale(1)",
                "call with scale(1) param on 'rotate(90deg)' string"
            );
        },

        _testCallOnReplacingParamOnTransformStringOnlyWithThatParam: function() {
            var fakeDOMElem = document.createElement("div");
            fakeDOMElem.style[Prefixer.get('transform', fakeDOMElem)] = "scale(10)";
            Dom.css3.transformProperty(fakeDOMElem, "scale", 1);

            ok(
                fakeDOMElem.style[Prefixer.get('transform', fakeDOMElem)] == "scale(1)",
                "call with scale(1) param on 'scale(10)' string"
            );
        },

        _testCallOnReplacingParamOnTransformStringWithThatAndOtherParams: function() {
            var fakeDOMElem = document.createElement("div");
            fakeDOMElem.style[Prefixer.get('transform', fakeDOMElem)] = "scale(10) rotate(90deg)";
            Dom.css3.transformProperty(fakeDOMElem, "scale", 1);

            ok(
                fakeDOMElem.style[Prefixer.get('transform', fakeDOMElem)] == "scale(1) rotate(90deg)",
                "call with scale(1) param on 'scale(10) rotate(90deg)' string"
            );
        },

        _testCallOnReplacingParamOnTransformStringWithMultipleParams: function() {
            var fakeDOMElem = document.createElement("div");
            fakeDOMElem.style[Prefixer.get('transform', fakeDOMElem)] = "rotate(90deg) translate(10px,1px)";
            Dom.css3.transformProperty(fakeDOMElem, "translate", "10px, 5px");
            ok(
                fakeDOMElem.style[Prefixer.get('transform', fakeDOMElem)] == "rotate(90deg) translate(10px, 5px)",
                "call with translate(10px,5px) param on 'rotate(90deg) translate(10px,5px) string"
            );
        }
    }

    CSS3transformPropertyTester.runTests();
    clearTestData();

    var CSS3transitionPropertyTester = {
        _before: function() {
            ;
        },

        _after: function() {
            ;
        },

        runTests: function() {
            var me = this;

            test("CSS3transitionProperty", function(assert) {
                me._before.call(me);

                // Notes -> Ie can hide ease and 0ms parts, Firefox can add 0s substr
                // in the end of the transition string
                me._testCallOnAddingNewParamToEmptyTransitionString.call(me);
                me._testCallOnAddingNewParamToNotEmptyTransitionString.call(me);
                me._testCallOnReplacingParamOnTransitionStringOnlyWithThatParam.call(me);
                me._testCallOnReplacingParamOnTransitionStringWithThatAndOtherParams.call(me);
                me._testCallOnReplacingParamOnTransitionStringWithMultipleParams.call(me);

                me._after.call(me);
            });
        },

        _testCallOnAddingNewParamToEmptyTransitionString: function() {
            var fakeDOMElem = document.createElement("div");
            fakeDOMElem.style[Prefixer.get('transition', fakeDOMElem)] = "";
            Dom.css3.transitionProperty(fakeDOMElem, "width 0ms ease", true);

            ok(
                //fakeDOMElem.style[Prefixer.get('transition', fakeDOMElem)].search("width 0ms ease") != -1,
                fakeDOMElem.style[Prefixer.get('transition', fakeDOMElem)].search("width") != -1,
                "call with 'width 0ms ease' param on empty transition string"
            );
        },

        _testCallOnAddingNewParamToNotEmptyTransitionString: function() {
            var fakeDOMElem = document.createElement("div");
            fakeDOMElem.style[Prefixer.get('transition', fakeDOMElem)] = "height 0ms ease, transform 0ms ease";
            Dom.css3.transitionProperty(fakeDOMElem, "width 0ms ease");

            ok(
                //fakeDOMElem.style[Prefixer.get('transition', fakeDOMElem)].search("width 0ms ease") != -1 &&
                //fakeDOMElem.style[Prefixer.get('transition', fakeDOMElem)].search("height 0ms ease") != -1 &&
                //fakeDOMElem.style[Prefixer.get('transition', fakeDOMElem)].search("transform 0ms ease") != - 1,
                fakeDOMElem.style[Prefixer.get('transition', fakeDOMElem)].search("width") != -1 &&
                fakeDOMElem.style[Prefixer.get('transition', fakeDOMElem)].search("height") != -1 &&
                fakeDOMElem.style[Prefixer.get('transition', fakeDOMElem)].search("transform") != - 1,
                "call with 'width 0ms ease' param on 'height 0ms ease, transform 0ms ease' string"
            );
        },

        _testCallOnReplacingParamOnTransitionStringOnlyWithThatParam: function() {
            var fakeDOMElem = document.createElement("div");
            fakeDOMElem.style[Prefixer.get('transition', fakeDOMElem)] = "transform 0ms ease";
            Dom.css3.transitionProperty(fakeDOMElem, "transform 10ms ease");

            ok(
                //fakeDOMElem.style[Prefixer.get('transition', fakeDOMElem)].search("transform 10ms ease") != -1,
                fakeDOMElem.style[Prefixer.get('transition', fakeDOMElem)].search("transform 10ms") != -1,
                "call with 'transform 10ms ease' param on 'transform 0ms ease' string"
            );
        },

        _testCallOnReplacingParamOnTransitionStringWithThatAndOtherParams: function() {
            var fakeDOMElem = document.createElement("div");
            fakeDOMElem.style[Prefixer.get('transition', fakeDOMElem)] = "width 0ms ease, height 0ms ease";
            Dom.css3.transitionProperty(fakeDOMElem, "width 10ms ease");

            ok(
                //fakeDOMElem.style[Prefixer.get('transition', fakeDOMElem)].search("width 10ms ease") != -1 &&
                // fakeDOMElem.style[Prefixer.get('transition', fakeDOMElem)].search("height 0ms ease") != -1,
                fakeDOMElem.style[Prefixer.get('transition', fakeDOMElem)].search("width 10ms") != -1 &&
                fakeDOMElem.style[Prefixer.get('transition', fakeDOMElem)].search("height") != -1,
                "call with 'width 10ms ease' param on 'width 0ms ease, height 0ms ease' string"
            );
        },

        _testCallOnReplacingParamOnTransitionStringWithMultipleParams: function() {
            var fakeDOMElem = document.createElement("div");
            fakeDOMElem.style[Prefixer.get('transition', fakeDOMElem)] = "width 0ms ease, height 0ms ease";
            Dom.css3.transitionProperty(fakeDOMElem, "transform 10ms ease, height 20ms ease");

            ok(
                //fakeDOMElem.style[Prefixer.get('transition', fakeDOMElem)].search("transform 10ms ease") != -1 &&
                //fakeDOMElem.style[Prefixer.get('transition', fakeDOMElem)].search("height 20ms ease") != -1 &&
                //fakeDOMElem.style[Prefixer.get('transition', fakeDOMElem)].search("width 0ms ease") != -1,
                fakeDOMElem.style[Prefixer.get('transition', fakeDOMElem)].search("transform 10ms") != -1 &&
                fakeDOMElem.style[Prefixer.get('transition', fakeDOMElem)].search("height 20ms") != -1 &&
                fakeDOMElem.style[Prefixer.get('transition', fakeDOMElem)].search("width") != -1,
                "call with 'transform 10ms ease, height 20ms ease' param on 'width 0ms ease, height 0ms ease' string"
            );
        }
    }

    CSS3transitionPropertyTester.runTests();
    clearTestData();
});