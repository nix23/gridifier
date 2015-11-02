$(document).ready(function() {
    module("Operation");

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
                    "all"
                ]);
            });
        },

        _all: function() {
            var operation = new Operation();
            var res = operation.isInitial(OPS.APPEND);
            ok(res && operation._last == OPS.APPEND, "is initial ok");

            res = operation.isInitial(OPS.PREPEND);
            ok(!res && operation._last == OPS.APPEND, "is not initial ok");

            ok(operation.isSameAsPrev(OPS.APPEND), "is same as prev op ok");

            res = operation.isSameAsPrev(OPS.PREPEND);
            ok(!res && operation._last == OPS.PREPEND, "is not same as prev op ok");

            operation.setLast(OPS.REV_APPEND);
            ok(operation._last == OPS.REV_APPEND, "set last op ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});