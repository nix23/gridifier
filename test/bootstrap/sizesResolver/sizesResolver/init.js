$(document).ready(function() {
    module("SizesResolver");

    var tester = {
        _before: function() {
            ;
        },

        _after: function() {

        },

        runTests: function() {
            var me = this;

            test("init", function(assert) {
                var test = function(tests) {
                    me._before.call(me);

                    for(var i = 0; i < tests.length; i++)
                        me["_" + tests[i]].call(me, assert);

                    me._after.call(me);
                }

                test(["findBorderBoxType", "findPtValsCalcType"]);
            });
        },

        _findBorderBoxType: function() {
            var origFn = SizesResolver._normalizeComputedCSS;

            SizesResolver._normalizeComputedCSS = function() { return 100; };
            SizesResolver._findBorderBoxType(Dom.div());
            ok(SizesResolver._borderBoxType == SizesResolver._borderBoxTypes.OUTER,
               "_findBorderBoxType - isOuterBBType");

            SizesResolver._normalizeComputedCSS = function() { return 150; };
            SizesResolver._findBorderBoxType(Dom.div());
            ok(SizesResolver._borderBoxType == SizesResolver._borderBoxTypes.INNER,
               "_findBorderBoxType - isInnerBBType");

            SizesResolver._normalizeComputedCSS = origFn;
            SizesResolver._findBorderBoxType(Dom.div());
        },

        _findPtValsCalcType: function() {
            var origFn = SizesResolver.outerWidth;

            SizesResolver.outerWidth = function() { return 117.8; };
            SizesResolver._findPtValsCalcType(Dom.div(), Dom.div());
            ok(SizesResolver._ptValsCalcType == SizesResolver._ptValsCalcTypes.BROWSER,
                "_findPtValsCalcType - Browser");

            SizesResolver.outerWidth = function() { return 150; };
            SizesResolver._findPtValsCalcType(Dom.div(), Dom.div());
            ok(SizesResolver._ptValsCalcType == SizesResolver._ptValsCalcTypes.RECALC,
                "_findPtValsCalcType - Recalc");

            SizesResolver.outerWidth = origFn;
            SizesResolver._findPtValsCalcType(Dom.div(), Dom.div(), true);
        }
    };

    tester.runTests();
    clearTestData();
});