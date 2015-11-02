$(document).ready(function() {
    module("CnsXYIntersector");

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
                    "isIntMoreThanOneCnY",
                    "isIntMoreThanOneCnX",
                    "getMostBigFromAllYIntCns",
                    "getMostBigFromAllXIntCns",
                    "getAllIntYCns",
                    "getAllIntXCns",
                    "expandYAllCnsToMostBigWithTopAlign",
                    "expandYAllCnsToMostBigWithCenterAlign",
                    "expandYAllCnsToMostBigWithBottomAlign",
                    "expandXAllCnsToMostBigWithLeftAlign",
                    "expandXAllCnsToMostBigWithCenterAlign",
                    "expandXAllCnsToMostBigWithRightAlign"
                ]);
            });
        },

        _isIntMoreThanOneCnY: function() {
            var cns = [
                {x1: 100, x2: 199, y1: 0, y2: 49, itemGUID: 2},
                {x1: 200, x2: 299, y1: 50, y2: 79, itemGUID: 3},
                {x1: 300, x2: 399, y1: 0, y2: 109, itemGUID: 4}
            ];
            connections = {get: function() { return cns; }};

            var cnsXYIntersector = new CnsXYIntersector();
            ok(cnsXYIntersector.isIntMoreThanOneCnXY({x1: 0, x2: 99, y1: 0, y2: 99}, "y1", "y2"),
               "isIntMoreThanOneCnY ok");
            ok(!cnsXYIntersector.isIntMoreThanOneCnXY({x1: 0, x2: 99, y1: 80, y2: 119}, "y1", "y2"),
               "!isIntMoreThanOneCnY ok");

            cns = [
                {x1: 100, x2: 199, y1: 2.3, y2: 15.9, itemGUID: 1},
                {x1: 200, x2: 299, y1: 2,   y2: 15.5, itemGUID: 2}
            ];
            ok(!cnsXYIntersector.isIntMoreThanOneCnXY({x1: 0, x2: 99, y1: 0, y2: 2}, "y1", "y2") &&
               cns[0].y1 == 2.3 && cns[0].y2 == 15.9,
               "!isIntMoreThanOneCnY with rounding ok");

            clearTestData();
        },

        _isIntMoreThanOneCnX: function() {
            var cns = [
                {x1: 0, x2: 49,  y1: 100, y2: 199, itemGUID: 2},
                {x1: 50, x2: 79,  y1: 200, y2: 299, itemGUID: 3},
                {x1: 0, x2: 109, y1: 300, y2: 399, itemGUID: 4}
            ];
            connections = {get: function() { return cns; }};

            var cnsXYIntersector = new CnsXYIntersector();
            ok(cnsXYIntersector.isIntMoreThanOneCnXY({x1: 0, x2: 99, y1: 0, y2: 99}, "x1", "x2"),
                "isIntMoreThanOneCnX ok");
            ok(!cnsXYIntersector.isIntMoreThanOneCnXY({x1: 80, x2: 119, y1: 0, y2: 99}, "x1", "x2"),
                "!isIntMoreThanOneCnX ok");

            cns = [
                {x1: 2.3, x2: 15.9, y1: 100, y2: 199, itemGUID: 1},
                {x1: 2,   x2: 15.5, y1: 200, y2: 299, itemGUID: 2}
            ];
            ok(!cnsXYIntersector.isIntMoreThanOneCnXY({x1: 0, x2: 2, y1: 0, y2: 99}, "x1", "x2") &&
               cns[0].x1 == 2.3 && cns[0].x2 == 15.9,
                "!isIntMoreThanOneCnX with rounding ok");

            clearTestData();
        },

        _getMostBigFromAllYIntCns: function() {
            var cns = [
                {x1: 100, x2: 199, y1: 0, y2: 49, itemGUID: 2},
                {x1: 200, x2: 299, y1: 0, y2: 79, itemGUID: 3},
                {x1: 300, x2: 399, y1: 0, y2: 109, itemGUID: 4}
            ];
            connections = {get: function() { return cns; }};

            var cnsXYIntersector = new CnsXYIntersector();
            var intCn = cnsXYIntersector.getMostBigFromAllXYIntCns({x1: 0, x2: 99, y1: 0, y2: 99}, "y1", "y2");

            ok(intCn.itemGUID == 4, "getMostBigFromAllYIntCns ok");

            clearTestData();
        },

        _getMostBigFromAllXIntCns: function() {
            var cns = [
                {x1: 0, x2: 49,  y1: 100, y2: 199, itemGUID: 2},
                {x1: 0, x2: 79,  y1: 200, y2: 299, itemGUID: 3},
                {x1: 0, x2: 109, y1: 300, y2: 399, itemGUID: 4}
            ];
            connections = {get: function() { return cns; }};

            var cnsXYIntersector = new CnsXYIntersector();
            var intCn = cnsXYIntersector.getMostBigFromAllXYIntCns({x1: 0, x2: 99, y1: 0, y2: 99}, "x1", "x2");

            ok(intCn.itemGUID == 4, "getMostBigFromAllXIntCns ok");

            clearTestData();
        },

        _getAllIntYCns: function() {
            var cns = [
                {x1: 100, x2: 199, y1: 0, y2: 49, itemGUID: 2},
                {x1: 200, x2: 299, y1: 0, y2: 79, itemGUID: 3},
                {x1: 300, x2: 399, y1: 0, y2: 109, itemGUID: 4}
            ];
            connections = {get: function() { return cns; }};

            var cnsXYIntersector = new CnsXYIntersector();
            var intCns = cnsXYIntersector.getAllXYIntCns({x1: 0, x2: 99, y1: 0, y2: 99}, "y1", "y2");

            ok(intCns.length == 3 && intCns[0].itemGUID == 2 && intCns[1].itemGUID == 3 &&
               intCns[2].itemGUID == 4, "getAllIntYCns ok");

            clearTestData();
        },

        _getAllIntXCns: function() {
            var cns = [
                {x1: 0, x2: 49,  y1: 100, y2: 199, itemGUID: 2},
                {x1: 0, x2: 79,  y1: 200, y2: 299, itemGUID: 3},
                {x1: 0, x2: 109, y1: 300, y2: 399, itemGUID: 4}
            ];
            connections = {get: function() { return cns; }};

            var cnsXYIntersector = new CnsXYIntersector();
            var intCns = cnsXYIntersector.getAllXYIntCns({x1: 0, x2: 99, y1: 0, y2: 99}, "x1", "x2");

            ok(intCns.length == 3 && intCns[0].itemGUID == 2 && intCns[1].itemGUID == 3 &&
               intCns[2].itemGUID == 4, "getAllIntXCns ok");

            clearTestData();
        },

        _expandYAllCnsToMostBigWithTopAlign: function() {
            ev = new EventEmitter();
            sourceSettings = {};
            settings = new Settings();

            var cns = [
                {x1: 100, x2: 199, y1: 0, y2: 49, itemGUID: 2},
                {x1: 200, x2: 299, y1: 0, y2: 79, itemGUID: 3},
                {x1: 300, x2: 399, y1: 0, y2: 109, itemGUID: 4}
            ];
            connections = {get: function() { return cns; }};

            var cnsXYIntersector = new CnsXYIntersector();
            cnsXYIntersector.expandXYAllCnsToMostBig(
                {x1: 0, x2: 99, y1: 0, y2: 99}, "y1", "y2", "vOffset", "Height"
            );
            var ecns = cnsXYIntersector.getLastXYExpandedCns();

            ok(ecns.length == 3 && ecns[0].itemGUID == 2 && ecns[0].y1 == 0 && ecns[0].y2 == 109 &&
               ecns[0].vOffset == 0 && ecns[1].itemGUID == 3 && ecns[1].y1 == 0 && ecns[1].y2 == 109 &&
               ecns[1].vOffset == 0 && ecns[2].itemGUID == 4 && ecns[2].y1 == 0 && ecns[2].y2 == 109 &&
               ecns[2].vOffset == 0, "expandYAllCnsToMostBig with top align ok");

            cnsXYIntersector.expandXYAllCnsToMostBig(
                {x1: 0, x2: 99, y1: 0, y2: 99}, "y1", "y2", "vOffset", "Height"
            );
            var ecns = cnsXYIntersector.getLastXYExpandedCns();

            ok(ecns.length == 0, "expandYAllCnsToMostBig with top align second call ok");

            clearTestData();
        },

        _expandYAllCnsToMostBigWithCenterAlign: function() {
            ev = new EventEmitter();
            sourceSettings = {align: "center"};
            settings = new Settings();

            srManager = {outerHeight: function(item) {
                if(item.guid == 2) return 50;
                else if(item.guid == 3) return 80;
                else if(item.guid == 4) return 110;
            }};

            var cns = [
                {x1: 100, x2: 199, y1: 0, y2: 49, itemGUID: 2, item: {guid: 2}},
                {x1: 200, x2: 299, y1: 0, y2: 79, itemGUID: 3, item: {guid: 3}},
                {x1: 300, x2: 399, y1: 0, y2: 109, itemGUID: 4, item: {guid: 4}}
            ];
            connections = {get: function() { return cns; }};

            var cnsXYIntersector = new CnsXYIntersector();
            cnsXYIntersector.expandXYAllCnsToMostBig(
                {x1: 0, x2: 99, y1: 0, y2: 99}, "y1", "y2", "vOffset", "Height"
            );
            var ecns = cnsXYIntersector.getLastXYExpandedCns();

            ok(ecns.length == 3 && ecns[0].itemGUID == 2 && ecns[0].y1 == 0 && ecns[0].y2 == 109 &&
               ecns[0].vOffset == 30 && ecns[1].itemGUID == 3 && ecns[1].y1 == 0 && ecns[1].y2 == 109 &&
               ecns[1].vOffset == 15 && ecns[2].itemGUID == 4 && ecns[2].y1 == 0 && ecns[2].y2 == 109 &&
               ecns[2].vOffset == 0, "expandYAllCnsToMostBig with center align ok");

            cnsXYIntersector.expandXYAllCnsToMostBig(
                {x1: 0, x2: 99, y1: 0, y2: 99}, "y1", "y2", "vOffset", "Height"
            );
            var ecns = cnsXYIntersector.getLastXYExpandedCns();

            ok(ecns.length == 0, "expandYAllCnsToMostBig with center align second call ok");

            clearTestData();
        },

        _expandYAllCnsToMostBigWithBottomAlign: function() {
            ev = new EventEmitter();
            sourceSettings = {align: "bottom"};
            settings = new Settings();

            srManager = {outerHeight: function(item) {
                if(item.guid == 2) return 50;
                else if(item.guid == 3) return 80;
                else if(item.guid == 4) return 110;
            }};

            var cns = [
                {x1: 100, x2: 199, y1: 0, y2: 49, itemGUID: 2, item: {guid: 2}},
                {x1: 200, x2: 299, y1: 0, y2: 79, itemGUID: 3, item: {guid: 3}},
                {x1: 300, x2: 399, y1: 0, y2: 109, itemGUID: 4, item: {guid: 4}}
            ];
            connections = {get: function() { return cns; }};

            var cnsXYIntersector = new CnsXYIntersector();
            cnsXYIntersector.expandXYAllCnsToMostBig(
                {x1: 0, x2: 99, y1: 0, y2: 99}, "y1", "y2", "vOffset", "Height"
            );
            var ecns = cnsXYIntersector.getLastXYExpandedCns();

            ok(ecns.length == 3 && ecns[0].itemGUID == 2 && ecns[0].y1 == 0 && ecns[0].y2 == 109 &&
               ecns[0].vOffset == 60 && ecns[1].itemGUID == 3 && ecns[1].y1 == 0 && ecns[1].y2 == 109 &&
               ecns[1].vOffset == 30 && ecns[2].itemGUID == 4 && ecns[2].y1 == 0 && ecns[2].y2 == 109 &&
               ecns[2].vOffset == 0, "expandYAllCnsToMostBig with bottom align ok");

            cnsXYIntersector.expandXYAllCnsToMostBig(
                {x1: 0, x2: 99, y1: 0, y2: 99}, "y1", "y2", "vOffset", "Height"
            );
            var ecns = cnsXYIntersector.getLastXYExpandedCns();

            ok(ecns.length == 0, "expandYAllCnsToMostBig with bottom align second call ok");

            clearTestData();
        },

        _expandXAllCnsToMostBigWithLeftAlign: function() {
            ev = new EventEmitter();
            sourceSettings = {grid: "horizontal"};
            settings = new Settings();

            var cns = [
                {x1: 0, x2: 49,  y1: 100, y2: 199, itemGUID: 2},
                {x1: 0, x2: 79,  y1: 200, y2: 299, itemGUID: 3},
                {x1: 0, x2: 109, y1: 300, y2: 399, itemGUID: 4}
            ];
            connections = {get: function() { return cns; }};

            var cnsXYIntersector = new CnsXYIntersector();
            cnsXYIntersector.expandXYAllCnsToMostBig(
                {x1: 0, x2: 99, y1: 0, y2: 99}, "x1", "x2", "hOffset", "Width"
            );
            var ecns = cnsXYIntersector.getLastXYExpandedCns();

            ok(ecns.length == 3 && ecns[0].itemGUID == 2 && ecns[0].x1 == 0 && ecns[0].x2 == 109 &&
               ecns[0].hOffset == 0 && ecns[1].itemGUID == 3 && ecns[1].x1 == 0 && ecns[1].x2 == 109 &&
               ecns[1].hOffset == 0 && ecns[2].itemGUID == 4 && ecns[2].x1 == 0 && ecns[2].x2 == 109 &&
               ecns[2].hOffset == 0, "expandXAllCnsToMostBig with left align ok");

            cnsXYIntersector.expandXYAllCnsToMostBig(
                {x1: 0, x2: 99, y1: 0, y2: 99}, "x1", "x2", "hOffset", "Width"
            );
            var ecns = cnsXYIntersector.getLastXYExpandedCns();

            ok(ecns.length == 0, "expandXAllCnsToMostBig with left align second call ok");

            clearTestData();
        },

        _expandXAllCnsToMostBigWithCenterAlign: function() {
            ev = new EventEmitter();
            sourceSettings = {grid: "horizontal", align: "center"};
            settings = new Settings();

            srManager = {outerWidth: function(item) {
                if(item.guid == 2) return 50;
                else if(item.guid == 3) return 80;
                else if(item.guid == 4) return 110;
            }};

            var cns = [
                {x1: 0, x2: 49,  y1: 100, y2: 199, itemGUID: 2, item: {guid: 2}},
                {x1: 0, x2: 79,  y1: 200, y2: 299, itemGUID: 3, item: {guid: 3}},
                {x1: 0, x2: 109, y1: 300, y2: 399, itemGUID: 4, item: {guid: 4}}
            ];
            connections = {get: function() { return cns; }};

            var cnsXYIntersector = new CnsXYIntersector();
            cnsXYIntersector.expandXYAllCnsToMostBig(
                {x1: 0, x2: 99, y1: 0, y2: 99}, "x1", "x2", "hOffset", "Width"
            );
            var ecns = cnsXYIntersector.getLastXYExpandedCns();

            ok(ecns.length == 3 && ecns[0].itemGUID == 2 && ecns[0].x1 == 0 && ecns[0].x2 == 109 &&
               ecns[0].hOffset == 30 && ecns[1].itemGUID == 3 && ecns[1].x1 == 0 && ecns[1].x2 == 109 &&
               ecns[1].hOffset == 15 && ecns[2].itemGUID == 4 && ecns[2].x1 == 0 && ecns[2].x2 == 109 &&
               ecns[2].hOffset == 0, "expandXAllCnsToMostBig with center align ok");

            cnsXYIntersector.expandXYAllCnsToMostBig(
                {x1: 0, x2: 99, y1: 0, y2: 99}, "x1", "x2", "hOffset", "Width"
            );
            var ecns = cnsXYIntersector.getLastXYExpandedCns();

            ok(ecns.length == 0, "expandXAllCnsToMostBig with center align second call ok");

            clearTestData();
        },

        _expandXAllCnsToMostBigWithRightAlign: function() {
            ev = new EventEmitter();
            sourceSettings = {grid: "horizontal", align: "bottom"};
            settings = new Settings();

            srManager = {outerWidth: function(item) {
                if(item.guid == 2) return 50;
                else if(item.guid == 3) return 80;
                else if(item.guid == 4) return 110;
            }};

            var cns = [
                {x1: 0, x2: 49,  y1: 100, y2: 199, itemGUID: 2, item: {guid: 2}},
                {x1: 0, x2: 79,  y1: 200, y2: 299, itemGUID: 3, item: {guid: 3}},
                {x1: 0, x2: 109, y1: 300, y2: 399, itemGUID: 4, item: {guid: 4}}
            ];
            connections = {get: function() { return cns; }};

            var cnsXYIntersector = new CnsXYIntersector();
            cnsXYIntersector.expandXYAllCnsToMostBig(
                {x1: 0, x2: 99, y1: 0, y2: 99}, "x1", "x2", "hOffset", "Width"
            );
            var ecns = cnsXYIntersector.getLastXYExpandedCns();

            ok(ecns.length == 3 && ecns[0].itemGUID == 2 && ecns[0].x1 == 0 && ecns[0].x2 == 109 &&
               ecns[0].hOffset == 60 && ecns[1].itemGUID == 3 && ecns[1].x1 == 0 && ecns[1].x2 == 109 &&
               ecns[1].hOffset == 30 && ecns[2].itemGUID == 4 && ecns[2].x1 == 0 && ecns[2].x2 == 109 &&
               ecns[2].hOffset == 0, "expandXAllCnsToMostBig with bottom align ok");

            cnsXYIntersector.expandXYAllCnsToMostBig(
                {x1: 0, x2: 99, y1: 0, y2: 99}, "x1", "x2", "hOffset", "Width"
            );
            var ecns = cnsXYIntersector.getLastXYExpandedCns();

            ok(ecns.length == 0, "expandXAllCnsToMostBig with bottom align second call ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});