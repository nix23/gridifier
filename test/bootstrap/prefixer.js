$(document).ready(function() {
    module("Prefixer");

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

                test(["get", "getForCss"]);
            });
        },

        _get: function() {
            var fakeItem = {style: {transition: "width 400ms ease, height 400ms ease"}};
            ok(Prefixer.get("transition", fakeItem) == "transition", "no-prefix prop get ok");

            var fakeItem = {style: {WebkitTransition: "width 400ms ease, height 400ms ease"}};
            ok(Prefixer.get("transition", fakeItem) == "WebkitTransition", "prefixed prop get ok");
        },

        _getForCss: function() {
            var fakeItem = {style: {transition: "width 400ms ease, height 400ms ease"}};
            ok(Prefixer.getForCss("transition", fakeItem) == "transition", "no-prefix prop getForCss ok");

            var fakeItem = {style: {WebkitTransition: "width 400ms ease, height 400ms ease"}};
            ok(Prefixer.getForCss("transition", fakeItem) == "-webkit-transition", "prefixed prop getForCss ok");
        }
    };

    tester.runTests();
    clearTestData();
});