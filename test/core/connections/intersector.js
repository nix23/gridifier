$(document).ready(function() {
    module("CnsIntersector");

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
                    "isIntersectingAny",
                    "getAllWithIntersectedCenter",
                    "findAllMaybeIntOnVgAppend",
                    "findAllMaybeIntOnVgPrepend",
                    "findAllMaybeIntOnHgAppend",
                    "findAllMaybeIntOnHgPrepend"
                ]);
            });
        },

        _isIntersectingAny: function() {
            var cns = [
                {x1: 0, x2: 99, y1: 0, y2: 99, itemGUID: 1},
                {x1: 100, x2: 199, y1: 0, y2: 99, itemGUID: 2}
            ];

            var cnsIntersector = new CnsIntersector();
            ok(cnsIntersector.isIntersectingAny(cns, {x1: 0, x2: 50, y1: 0, y2: 50}), "is int cn");
            ok(!cnsIntersector.isIntersectingAny(cns, {x1: 0, x2: 10, y1: 100, y2: 199}), "is not int any(bottom)");
            ok(!cnsIntersector.isIntersectingAny(cns, {x1: 200, x2: 299, y1: 0, y2: 99}), "is not int any(right)");

            cns = [
                {x1: 100, x2: 199, y1: 100, y2: 199, itemGUID: 1},
                {x1: 200, x2: 399, y1: 200, y2: 299, itemGUID: 2}
            ];
            ok(!cnsIntersector.isIntersectingAny(cns, {x1: 0, x2: 50, y1: 0, y2: 99}), "is not int any(left)");
            ok(!cnsIntersector.isIntersectingAny(cns, {x1: 0, x2: 200, y1: 0, y2: 50}), "is not int any(top)");

            clearTestData();
        },

        _getAllWithIntersectedCenter: function() {
            var cns = [
                {x1: 0, x2: 99, y1: 0, y2: 99, itemGUID: 1},
                {x1: 100, x2: 199, y1: 0, y2: 99, itemGUID: 2},
                {x1: 0, x2: 199, y1: 100, y2: 199, itemGUID: 3}
            ];
            connections = {get: function() { return cns; }};

            var cnsIntersector = new CnsIntersector();
            var intCns = cnsIntersector.getAllWithIntersectedCenter({x1: 0, x2: 160, y1: 40, y2: 60});

            ok(intCns.length == 2 && intCns[0].itemGUID == 1 && intCns[1].itemGUID == 2,
               "getAllWithIntersectedCenter ok");

            intCns = cnsIntersector.getAllWithIntersectedCenter({x1: 0, x2: 160, y1: 0, y2: 15});
            ok(intCns.length == 0, "getAllWithIntersectedCenter no cns ok");

            clearTestData();
        },

        _findAllMaybeIntOnVgAppend: function() {
            var cns = [
                {x1: 0, x2: 99, y1: 0, y2: 99, itemGUID: 1},
                {x1: 100, x2: 199, y1: 0, y2: 99, itemGUID: 2},
                {x1: 0, x2: 199, y1: 100, y2: 199, itemGUID: 3}
            ];
            connections = {get: function() { return cns; }};

            var cnsIntersector = new CnsIntersector();
            var intCns = cnsIntersector.findAllMaybeIntOnVgAppend({x: 0, y: 100});
            ok(intCns.length == 1 && intCns[0].itemGUID == 3, "findAllMaybeIntOnVgAppend ok");

            clearTestData();
        },

        _findAllMaybeIntOnVgPrepend: function() {
            var cns = [
                {x1: 0, x2: 99, y1: 40, y2: 99, itemGUID: 1},
                {x1: 100, x2: 199, y1: 50, y2: 99, itemGUID: 2},
                {x1: 0, x2: 199, y1: 100, y2: 199, itemGUID: 3}
            ];
            connections = {get: function() { return cns; }};

            var cnsIntersector = new CnsIntersector();
            var intCns = cnsIntersector.findAllMaybeIntOnVgPrepend({x: 0, y: 45});
            ok(intCns.length == 1 && intCns[0].itemGUID == 1, "findAllMaybeIntOnVgPrepend ok");

            clearTestData();
        },

        _findAllMaybeIntOnHgAppend: function() {
            var cns = [
                {x1: 0, x2: 99, y1: 40, y2: 99, itemGUID: 1},
                {x1: 100, x2: 50, y1: 50, y2: 99, itemGUID: 2},
                {x1: 0, x2: 50, y1: 100, y2: 199, itemGUID: 3}
            ];
            connections = {get: function() { return cns; }};

            var cnsIntersector = new CnsIntersector();
            var intCns = cnsIntersector.findAllMaybeIntOnHgAppend({x: 80, y: 45});
            ok(intCns.length == 1 && intCns[0].itemGUID == 1, "findAllMaybeIntOnHgAppend ok");

            clearTestData();
        },

        _findAllMaybeIntOnHgPrepend: function() {
            var cns = [
                {x1: 20, x2: 99, y1: 40, y2: 99, itemGUID: 1},
                {x1: 100, x2: 50, y1: 50, y2: 99, itemGUID: 2},
                {x1: 100, x2: 50, y1: 100, y2: 199, itemGUID: 3}
            ];
            connections = {get: function() { return cns; }};

            var cnsIntersector = new CnsIntersector();
            var intCns = cnsIntersector.findAllMaybeIntOnHgPrepend({x: 50, y: 45});
            ok(intCns.length == 1 && intCns[0].itemGUID == 1, "findAllMaybeIntOnHgPrepend ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});