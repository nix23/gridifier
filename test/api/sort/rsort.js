$(document).ready(function() {
    module("RsortApi");

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
                    "listenEvent",
                    "updateOnDefRsort",
                    "updateOnCustomRsort",
                    "change",
                    "reposition"
                ]);
            });
        },

        _listenEvent: function() {
            var updated = false;

            ev = {};
            ev.onRsortChange = function(cb) {
                cb();
            };

            var origUpdate = RsortApi.prototype._update;
            RsortApi.prototype._update = function() { updated = true; };
            var rsortApi = new RsortApi();

            ok(updated, "listen for event ok");

            RsortApi.prototype._update = origUpdate;
            clearTestData();
        },

        _updateOnDefRsort: function() {
            ev = {};
            ev.onRsortChange = fns.nop();

            settings = {};
            settings.get = function(param) {
                if(param != "rsort") return;
                return {selected: "default"};
            };

            var changed = false;
            var origChange = RsortApi.prototype._change;
            RsortApi.prototype._change = function(rsort) {
                if(rsort != "default") return;
                changed = true;
            };

            var rsortApi = new RsortApi();
            ok(!rsortApi._created, "helpers not created on def rsort ok");

            clearTestData();
            RsortApi.prototype._change = origChange;
        },

        _updateOnCustomRsort: function() {
            ev = {};
            ev.onRsortChange = fns.nop();

            settings = {id: 1};
            settings.get = function(param) {
                if(param != "rsort") return;
                return {selected: "custom"};
            };

            var changed = false;
            var origChange = RsortApi.prototype._change;
            var origHelpers = RsortHelpers;
            RsortHelpers = function(settings) {
                if(settings.id != 1) return;
                window._testRsortSettings = settings;
                return this;
            };
            RsortApi.prototype._change = function(rsort) {
                if(rsort != "custom") return;
                changed = true;
            };

            var rsortApi = new RsortApi();
            ok(rsortApi._created && changed && 
                window._testRsortSettings.id == 1, 
                "helpers are created on custom rsort ok");

            clearTestData();
            RsortHelpers = origHelpers;
            RsortApi.prototype._change = origChange;
        },

        _change: function(assert) {
            var wasCalled = false;
            var callsCount = 0;
            var origDelay = null;
            var origUpdate = null;
            var param = null;

            var initFn = function() {
                origDelay = C.RESORT_REPOS_DELAY;
                C.RESORT_REPOS_DELAY = 0;

                origUpdate = RsortApi.prototype._update;
                RsortApi.prototype._update = fns.nop();
                ev = {};
                ev.onRsortChange = fns.nop();
                ev.onBeforeShowForRsort = function(fnparam) { param = fnparam; };

                var rsortApi = new RsortApi();
                rsortApi._change("default");
                ok(param == null && !wasCalled, "change on default rsort ok");

                ev.onBeforeShowForRsort = function(cb) { cb(); };
                rsortApi._reposition = function() { wasCalled = true; callsCount++; };
                rsortApi._change("custom");
                rsortApi._change("custom");
            };
            var checkFn = function() {
                ok(wasCalled && callsCount == 1, "change on custom rsort ok");

                RsortApi.prototype._update = origUpdate;
                C.RESORT_REPOS_DELAY = origDelay;
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        },

        _reposition: function() {
            var origUpdate = RsortApi.prototype._update;
            RsortApi.prototype._update = fns.nop(); 
            ev = {};
            ev.onRsortChange = fns.nop();

            settings = {};
            settings.get = function(param) { if(param == "repackSize") return null; };

            reposition = {};
            reposition.all = function() { reposed = true; };

            var reposed = false;
            var rsortApi = new RsortApi();

            rsortApi._reposition();
            ok(reposed, "reposition on no repackSize ok");

            reposed = false;
            gridifier.all = function() { return [1,2,3,4,5,6]; };
            settings.get = function(param) { if(param == "repackSize") return 20; };
            rsortApi._reposition();
            ok(reposed, "reposition on items count < repackSize ok");

            reposed = false;
            settings.get = function() { return 3; };
            reposition.fromFirstSortedCn = function(item) {
                if(item != 4) return;
                reposed = true;
            };
            rsortApi._reposition();
            ok(reposed, "reposition on custom repackSize ok");

            RsortApi.prototype._update = origUpdate;
            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});