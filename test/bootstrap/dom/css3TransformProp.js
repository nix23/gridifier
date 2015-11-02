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

            test("css3.transformProperty", function(assert) {
                var test = function(tests) {
                    me._before.call(me);

                    for(var i = 0; i < tests.length; i++)
                        me["_" + tests[i]].call(me, assert);

                    me._after.call(me);
                }

                test([
                    "addNewParamToEmptyTrString",
                    "addNewParamToNotEmptyTrString",
                    "replaceParamOnTrStringWithOnlyThatParam",
                    "replaceParamOnTrStringWithThatAndOtherParams",
                    "replaceParamWithMultipleValsOnTrStringWithThatAndOtherParams",
                    "replaceMultipleParamsOnTrStringWithThatParams",
                    "replaceMultipleParamsOnTrStringWithThatAndOtherParams"
                ]);
            });
        },

        _addNewParamToEmptyTrString: function() {
            var fakeItem = document.createElement("div");
            fakeItem.style[Prefixer.get('transform', fakeItem)] = "";
            Dom.css3.transformProperty(fakeItem, "scale", 1);

            ok(
                fakeItem.style[Prefixer.get('transform', fakeItem)] == "scale(1)",
                "call with scale(1) param on empty transform string"
            );
        },

        _addNewParamToNotEmptyTrString: function() {
            var fakeItem = document.createElement("div");
            fakeItem.style[Prefixer.get('transform', fakeItem)] = "rotate(90deg)";
            Dom.css3.transformProperty(fakeItem, "scale", 1);

            ok(
                fakeItem.style[Prefixer.get('transform', fakeItem)] == "rotate(90deg) scale(1)",
                "call with scale(1) param on 'rotate(90deg)' string"
            );
        },

        _replaceParamOnTrStringWithOnlyThatParam: function() {
            var fakeItem = document.createElement("div");
            fakeItem.style[Prefixer.get('transform', fakeItem)] = "scale(10)";
            Dom.css3.transformProperty(fakeItem, "scale", 1);

            ok(
                fakeItem.style[Prefixer.get('transform', fakeItem)] == "scale(1)",
                "call with scale(1) param on 'scale(10)' string"
            );
        },

        _replaceParamOnTrStringWithThatAndOtherParams: function() {
            var fakeItem = document.createElement("div");
            fakeItem.style[Prefixer.get('transform', fakeItem)] = "scale(10) rotate(90deg)";
            Dom.css3.transformProperty(fakeItem, "scale", 1);

            ok(
                fakeItem.style[Prefixer.get('transform', fakeItem)] == "scale(1) rotate(90deg)",
                "call with scale(1) param on 'scale(10) rotate(90deg)' string"
            );
        },

        _replaceParamWithMultipleValsOnTrStringWithThatAndOtherParams: function() {
            var fakeItem = document.createElement("div");
            fakeItem.style[Prefixer.get('transform', fakeItem)] = "rotate(90deg) translate(10px,1px)";
            Dom.css3.transformProperty(fakeItem, "translate", "10px, 5px");
            ok(
                fakeItem.style[Prefixer.get('transform', fakeItem)] == "rotate(90deg) translate(10px, 5px)",
                "call with translate(10px,5px) param on 'rotate(90deg) translate(10px,5px) string"
            );
        },

        _replaceMultipleParamsOnTrStringWithThatParams: function() {
            if(!Dom.hasTransitions()) return;

            var fakeItem = document.createElement("div");
            fakeItem.style[Prefixer.get('transform', fakeItem)] = "rotate(90deg) translate(10px,20px)";
            Dom.css3.transformProperty(fakeItem, "translate", "20px,30px");
            Dom.css3.transformProperty(fakeItem, "rotate", "60deg");
            ok(
                fakeItem.style[Prefixer.get('transform', fakeItem)] == "rotate(60deg) translate(20px, 30px)",
                "call with rotate(60deg) translate(20px,30px) on 'rotate(90deg) translate(10px,20px)' string"
            );
        },

        _replaceMultipleParamsOnTrStringWithThatAndOtherParams: function() {
            if(!Dom.hasTransitions()) return;

            var fakeItem = document.createElement("div");
            fakeItem.style[Prefixer.get('transform', fakeItem)] = "rotate(90deg) translate(10px,20px) scale(1)";
            Dom.css3.transformProperty(fakeItem, "translate", "20px,30px");
            Dom.css3.transformProperty(fakeItem, "scale", 3);
            ok(
                fakeItem.style[Prefixer.get('transform', fakeItem)] == "rotate(90deg) translate(20px, 30px) scale(3)",
                "call with translate(20px,30px) scale(3) on 'rotate(90deg) translate(10px,20px) scale(1)' string"
            );
        }
    }

    tester.runTests();
    clearTestData();
});