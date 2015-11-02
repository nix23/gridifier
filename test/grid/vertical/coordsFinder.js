$(document).ready(function() {
    module("VgCoordsFinder");

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
                    "find"
                ]);
            });
        },

        _find: function() {
            srManager = {};
            srManager.itemSizes = function(item) {
                if(item.guid != 1) return;
                return {width: 100, height: 200};
            };

            var coordsFinder = new VgCoordsFinder();

            var sizes = coordsFinder.find(OPS.APPEND, {guid: 1}, {x: 300, y: 400});
            ok(sizes.x1 == 300 && sizes.x2 == 399 && sizes.y1 == 400 && sizes.y2 == 599,
               "find on OPS.APPEND ok");

            sizes = coordsFinder.find(OPS.REV_APPEND, {guid: 1}, {x: 300, y: 400});
            ok(sizes.x1 == 201 && sizes.x2 == 300 && sizes.y1 == 400 && sizes.y2 == 599,
               "find on OPS.REV_APPEND ok");

            sizes = coordsFinder.find(OPS.PREPEND, {guid: 1}, {x: 300, y: 400});
            ok(sizes.x1 == 300 && sizes.x2 == 399 && sizes.y1 == 201 && sizes.y2 == 400,
               "find on OPS.PREPEND ok");

            sizes = coordsFinder.find(OPS.REV_PREPEND, {guid: 1}, {x: 300, y: 400});
            ok(sizes.x1 == 201 && sizes.x2 == 300 && sizes.y1 == 201 && sizes.y2 == 400,
               "find on OPS.REV_PREPEND ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});