$(document).ready(function() {
    module("Rounder");

    var tester = {
        _before: function() {
            ;
        },

        _after: function() {

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
                    "fixRounding"
                ]);
            });
        },

        _fixRounding: function() {
            var rounder = new Rounder();
            ok(rounder.fixLowRounding(10) == 9, "fixLowRounding ok");
            ok(rounder.fixHighRounding(10) == 11, "fixHighRounding ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});