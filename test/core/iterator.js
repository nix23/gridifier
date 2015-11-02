$(document).ready(function() {
    module("Iterator");

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
                    "callFirst",
                    "callLast",
                    "callAll",
                    "callNext",
                    "callPrev",
                    "getFirstLast",
                    "getAll",
                    "getNextPrev"
                ]);
            });
        },

        _callFirst: function() {
            var iterator = new Iterator();

            var called = false;
            iterator.get = function(t, i) { if(t == "first") called = true; return true; };
            var res = gridifier.first();

            ok(called && res, "self first call ok");
        },

        _callLast: function() {
            var iterator = new Iterator();

            var called = false;
            iterator.get = function(t, i) { if(t == "last") called = true; return true; };
            var res = gridifier.last();

            ok(called && res, "self last call ok");
        },

        _callAll: function() {
            var iterator = new Iterator();

            var called = false;
            iterator.get = function(t, i) { if(t == "all") called = true; return true; };
            var res = gridifier.all();

            ok(called && res, "self all call ok");
        },

        _callNext: function() {
            var iterator = new Iterator();

            var called = false;
            iterator.get = function(t, i) {
                if(t == "next" && typeof i != "undefined") called = true;
                return true;
            };
            var res = gridifier.next({});

            ok(called && res, "self next call ok");
        },

        _callPrev: function() {
            var iterator = new Iterator();

            var called = false;
            iterator.get = function(t, i) {
                if(t == "prev" && typeof i != "undefined") called = true;
                return true;
            };
            var res = gridifier.prev({});

            ok(called && res, "self prev call ok");
        },

        _getFirstLast: function() {
            cnsSorter = {sortForReappend: function(items) { return items; }};
            connections = {get: function() { return []; }};

            var iterator = new Iterator();
            ok(iterator.get("first") == null, "first with no items ok");
            ok(iterator.get("last") == null, "last with no items ok");

            connections = {get: function() {
                return [{item: {id: 1}}, {item: {id: 2}}, {item: {id: 3}}];
            }};
            ok(iterator.get("first").id == 1, "first ok");
            ok(iterator.get("last").id == 3, "last ok");

            clearTestData();
        },

        _getAll: function() {
            cnsSorter = {sortForReappend: function(items) { return items; }};
            connections = {get: function() { return []; }};

            var iterator = new Iterator();
            ok(Dom.isArray(iterator.get("all")), "all with no items ok");

            connections = {get: function() {
                return [{item: {id: 1}}, {item: {id: 2}}, {item: {id: 3}}];
            }};
            var res = iterator.get("all");
            ok(res[0].id == 1 && res[1].id == 2 && res[2].id == 3);

            clearTestData();
        },

        _getNextPrev: function() {
            cnsSorter = {sortForReappend: function(items) { return items; }};
            connections = {get: function() { return []; }};
            guid = {get: function(item) { return item.id; }};
            gridItem = {toNative: function(item) { return [item]; }};

            var iterator = new Iterator();
            ok(iterator.get("next", Dom.div()) == null, "next with no items ok");
            ok(iterator.get("prev", Dom.div()) == null, "prev with no items ok");

            connections = {get: function() {
                return [{item: {id: 1}}, {item: {id: 2}}, {item: {id: 3}}];
            }};

            ok(iterator.get("next", {id: 4}) == null, "next with wrong item ok");
            ok(iterator.get("prev", {id: 4}) == null, "prev with wrong item ok");

            ok(iterator.get("next", connections.get()[2].item) == null, "next with last item ok");
            ok(iterator.get("prev", connections.get()[0].item) == null, "prev with first item ok");

            ok(iterator.get("next", connections.get()[1].item).id == 3, "next ok");
            ok(iterator.get("prev", connections.get()[1].item).id == 1, "prev ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});