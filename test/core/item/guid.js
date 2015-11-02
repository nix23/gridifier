$(document).ready(function() {
    module("GUID");

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
                    "reinit", "crud", "mark", "prepend"
                ]);
            });
        },

        _reinit: function() {
            var guid = new GUID();
            guid.reinit();
            ok(guid._max == 9999 && guid._min == 10000, "reinit ok");

            guid.reinitMax();
            ok(guid._max == 9999, "reinitMax without param ok");

            guid.reinitMax(30);
            ok(guid._max == 30, "reinitMax with param ok");
        },

        _crud: function() {
            var guid = new GUID();
            var item = Dom.div();

            guid.set(item, "100");
            ok(guid.get(item) == "100", "set/get ok");

            guid.rm(item);
            ok(isNaN(guid.get(item)), "rm ok");
        },

        _mark: function() {
            var guid = new GUID();
            var apItem = Dom.div();
            var prItem = Dom.div();

            var newMax = guid.markForAppend(apItem);
            ok(guid.get(apItem) == 10000 && newMax == 10000, "markForAppend ok");

            var newMin = guid.markForPrepend(prItem);
            ok(guid.get(prItem) == 9999 && newMin == 9999, "markForPrepend ok");
        },

        _prepend: function() {
            var guid = new GUID();
            var item = Dom.div();

            var newMin = guid.markForPrepend(item);
            guid.markIfFirstPrepended(item);
            ok(guid._firstPrepended == newMin, "markIfFirstPrepended first call ok");
            guid.markIfFirstPrepended(item);
            ok(guid._firstPrepended == newMin, "markIfFirstPrepended second call ok");

            ok(guid.wasPrepended(guid.get(item)), "item was prepended ok");
            ok(!guid.wasPrepended(newMin + 100), "item wasn't prepended ok");

            guid.unmarkFirstPrepended();
            ok(!guid.wasPrepended(guid.get(item)), "unmarkFirstPrepended ok");
        }
    }

    tester.runTests();
    clearTestData();
});