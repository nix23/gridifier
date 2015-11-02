$(document).ready(function() {
    module("ToggleSyncerApi");

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
                    "syncs"
                ]);
            });
        },

        _syncs: function() {
            var origSet = Dom.set;
            var origHas = Dom.has;
            var origGet = Dom.get;
            var origData = TOGGLE.SYNCER_DATA;
            TOGGLE.SYNCER_DATA = "syncerData";
            Dom.set = function(item, param, val) {
                item[param] = val;
            };
            Dom.has = function(item, param) {
                return Dom.hasOwnProp(item, param);
            };
            Dom.get = function(item, param) {
                return item[param];
            };

            var syncer = new ToggleSyncerApi();
            var item = {id: 1};
            var item1Timeout = setTimeout(function() { 
                alert("Error: toggle syncer test failed!");
            }, 1000);
            var item2Timeout = setTimeout(function() {
                alert("Error: toggle syncer test failed!");
            }, 1000);
            var item2 = {id: 2};
            var item21Timeout = setTimeout(function() {
                alert("Error: toggle syncer test failed!");
            }, 1000);
            
            syncer.add(item, item1Timeout);
            syncer.add(item, item2Timeout);
            syncer.add(item2, item21Timeout);
            ok(syncer.isSynced(item) &&
               syncer._getSyncId(item) == 1 &&
               syncer._syncTimeouts["1"].length == 2 &&
               syncer.isSynced(item2) &&
               syncer._getSyncId(item2) == 2 &&
               syncer._syncTimeouts["2"].length == 1,
               "add 2 timeouts ok");

            syncer.flush(item);
            syncer.flush(item2);
            ok(syncer._syncTimeouts["1"].length == 0 &&
               syncer._syncTimeouts["2"].length == 0,
               "flush ok");

            TOGGLE.SYNCER_DATA = origData;
            Dom.set = origSet;
            Dom.has = origHas;
            Dom.get = origGet;
            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});