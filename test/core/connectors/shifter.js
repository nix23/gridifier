$(document).ready(function() {
    module("CrsShifter");

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
                    "crud",
                    "shiftAll",
                    "shiftLeftTop",
                    "shiftLeftBottom",
                    "shiftBottomRight",
                    "shiftTopLeft",
                    "shiftRightBottom",
                    "shiftRightTop",
                    "shiftAllToRight",
                    "shiftAllToLeft",
                    "shiftAllToTop",
                    "shiftAllToBottom"
                ]);
            });
        },

        _crud: function() {
            var crsShifter = new CrsShifter();
            var crs = [
                {x: 0, y: 0, itemGUID: 1, side: CRS.LEFT.TOP, type: CRS.APPEND.DEF},
                {x: 0, y: 0, itemGUID: 2, side: CRS.LEFT.TOP, type: CRS.APPEND.DEF},
                {x: 0, y: 0, itemGUID: 3, side: CRS.LEFT.TOP, type: CRS.APPEND.REV}
            ];

            crsShifter.attach(crs);
            ok(Dom.isArray(crsShifter._newCrs) && Dom.isArray(crsShifter._crs) &&
               crsShifter._crs[0].itemGUID == 1 && crsShifter._crs[2].itemGUID == 3,
               "attach crs ok");

            crsShifter._createShifted(10, 10, crs[0]);
            crsShifter._createShifted(20, 20, crs[1]);

            var n = crsShifter.getNew();
            ok(n[0].type == CRS.APPEND.DEF && n[0].side == CRS.SHIFTED && n[0].x == 10 && n[0].y == 10 && n[0].itemGUID == 1 &&
               n[1].type == CRS.APPEND.DEF && n[1].side == CRS.SHIFTED && n[1].x == 20 && n[1].y == 20 && n[1].itemGUID == 2,
               "createShifted and getNew ok");

            clearTestData();
        },

        _shiftAll: function() {
            connectors = new Connectors();
            var crsShifter = new CrsShifter();
            var crs = [
                {x: 0, y: 0, itemGUID: 1, side: CRS.LEFT.TOP, type: CRS.APPEND.DEF},
                {x: 0, y: 0, itemGUID: 2, side: CRS.LEFT.BOTTOM, type: CRS.APPEND.DEF},
                {x: 0, y: 0, itemGUID: 3, side: CRS.BOTTOM.RIGHT, type: CRS.APPEND.DEF},
                {x: 0, y: 0, itemGUID: 4, side: CRS.BOTTOM.LEFT, type: CRS.APPEND.DEF},
                {x: 0, y: 0, itemGUID: 5, side: CRS.TOP.LEFT, type: CRS.APPEND.DEF},
                {x: 0, y: 0, itemGUID: 6, side: CRS.TOP.RIGHT, type: CRS.APPEND.DEF},
                {x: 0, y: 0, itemGUID: 7, side: CRS.RIGHT.BOTTOM, type: CRS.APPEND.DEF},
                {x: 0, y: 0, itemGUID: 8, side: CRS.RIGHT.TOP, type: CRS.APPEND.DEF}
            ];
            crsShifter.attach(crs);

            var leftTopOk = false;
            var leftBottomOk = false;
            var bottomRightOk = false;
            var bottomLeftOk = false;
            var topLeftOk = false;
            var topRightOk = false;
            var rightBottomOk = false;
            var rightTopOk = false;
            var crOk = false;

            crsShifter._shiftLeftTop = function(cr) { crOk = (cr.x == 0); leftTopOk = true; };
            crsShifter._shiftLeftBottom = function() { leftBottomOk = true; };
            crsShifter._shiftBottomRight = function(cr) {
                (cr.itemGUID == 3) ? bottomRightOk = true : topRightOk = true;
            };
            crsShifter._shiftTopLeft = function(cr) {
                (cr.itemGUID == 4) ? topLeftOk = true : bottomLeftOk = true;
            };
            crsShifter._shiftRightBottom = function() { rightBottomOk = true; };
            crsShifter._shiftRightTop = function() { rightTopOk = true; };

            crsShifter.shiftAll();
            var n = crsShifter.getNew();

            ok(leftTopOk && leftBottomOk && bottomRightOk && bottomLeftOk &&
               topLeftOk && topRightOk && rightBottomOk && rightTopOk && crOk &&
               n.length == 8 && n[0].side == CRS.LEFT.TOP && n[1].side == CRS.LEFT.BOTTOM &&
               n[2].side == CRS.BOTTOM.RIGHT && n[3].side == CRS.BOTTOM.LEFT && n[4].side == CRS.TOP.LEFT &&
               n[5].side == CRS.TOP.RIGHT && n[6].side == CRS.RIGHT.BOTTOM && n[7].side == CRS.RIGHT.TOP,
               "shiftAll ok");

            clearTestData();
        },

        _shiftLeftTop: function() {
            var crsShifter = new CrsShifter();
            var cleanCrs = function() { crsShifter._newCrs = []; };
            var cr = null;

            cleanCrs();
            crsIntersector = {mostBottomFromTopOrTopLeft: function() { return null; }};
            cr = {x: 0, y: 0, itemGUID: 1, side: CRS.LEFT.TOP, type: CRS.APPEND.DEF};
            crsShifter._shiftLeftTop(cr);
            ok(crsShifter._newCrs.length == 0, "shiftLeftTop no shifts ok");

            cr.y = 20;
            crsShifter._shiftLeftTop(cr);
            ok(crsShifter._newCrs[0].x == 0 && crsShifter._newCrs[0].y == 0, "shiftLeftTop with mostClose null ok");

            cleanCrs();
            crsIntersector = {mostBottomFromTopOrTopLeft: function() { return {y2: 19}; }};
            crsShifter._shiftLeftTop(cr);
            ok(crsShifter._newCrs.length == 0, "shiftLeftTop with mostClose eq cr ok");

            crsIntersector = {mostBottomFromTopOrTopLeft: function() { return {y2: 30}; }};
            crsShifter._shiftLeftTop(cr);
            ok(crsShifter._newCrs[0].x == 0 && crsShifter._newCrs[0].y == 31, "shiftLeftTop ok");

            clearTestData();
        },

        _shiftLeftBottom: function() {
            cnsCore = {};
            var crsShifter = new CrsShifter();
            var cleanCrs = function() { crsShifter._newCrs = []; };
            var cr = null;

            cleanCrs();
            crsIntersector = {mostTopFromBottomOrBottomLeft: function() { return null; }};
            cr = {x: 0, y: 0, itemGUID: 1, side: CRS.LEFT.BOTTOM, type: CRS.APPEND.DEF};
            cnsCore.getMaxY = function() { return 0; };
            crsShifter._shiftLeftBottom(cr);
            ok(crsShifter._newCrs.length == 0, "shiftLeftBottom no shifts(maxY eq 0) ok");

            cnsCore.getMaxY = function() { return 1; };
            crsShifter._shiftLeftBottom(cr);
            ok(crsShifter._newCrs.length == 0, "shiftLeftBottom no shifts(maxY - 1 eq 0) ok");

            cnsCore.getMaxY = function() { return 20; };
            crsShifter._shiftLeftBottom(cr);
            ok(crsShifter._newCrs[0].x == 0 && crsShifter._newCrs[0].y == 19, "shiftLeftBottom with mostClose null ok");

            cleanCrs();
            crsIntersector = {mostTopFromBottomOrBottomLeft: function() { return {y1: 1}; }};
            crsShifter._shiftLeftBottom(cr);
            ok(crsShifter._newCrs.length == 0, "shiftLeftBottom with mostClose eq cr ok");

            crsIntersector = {mostTopFromBottomOrBottomLeft: function() { return {y1: 30}; }};
            crsShifter._shiftLeftBottom(cr);
            ok(crsShifter._newCrs[0].x == 0 && crsShifter._newCrs[0].y == 29, "shiftLeftBottom ok");

            clearTestData();
        },

        _shiftBottomRight: function() {
            ev = new EventEmitter();
            grid = {};
            var crsShifter = new CrsShifter();
            var cleanCrs = function() { crsShifter._newCrs = []; };
            var cr = null;

            cleanCrs();
            settings = new Settings();
            crsIntersector = {mostLeftFromRight: function() { return null; }};
            cr = {x: 0, y: 0, itemGUID: 1, side: CRS.LEFT.BOTTOM, type: CRS.PREPEND.DEF};
            grid.x2 = function() { return 0; };
            crsShifter._shiftBottomRight(cr);
            ok(crsShifter._newCrs.length == 0, "shiftBottomRight no shifts(grid.x2 eq cr.x) ok");

            grid.x2 = function() { return 20; };
            crsShifter._shiftBottomRight(cr);
            ok(crsShifter._newCrs[0].x == 20 && crsShifter._newCrs[0].y == 0,
               "shiftBottomRight shift on (cr.x eq grid.x2) ok");

            cleanCrs();
            sourceSettings = {grid: "horizontal"};
            settings = new Settings();
            crsShifter._shiftBottomRight(cr);
            ok(crsShifter._newCrs.length == 0, "shiftBottomRight on hor grid cr.type == prep.def no shifts ok");

            crsIntersector = {mostLeftFromRight: function() { return {x1: 1}; }};
            crsShifter._shiftBottomRight(cr);
            ok(crsShifter._newCrs.length == 0, "shiftBottomRight with cr.x eq mostClone.x1 no shifts ok");

            cr.x = 50;
            crsShifter._shiftBottomRight(cr);
            ok(crsShifter._newCrs[0].x == 0 && crsShifter._newCrs[0].y == 0,
               "shiftBottomRight with mostClose eq cr ok");

            clearTestData();
        },

        _shiftTopLeft: function() {
            var crsShifter = new CrsShifter();
            var cleanCrs = function() { crsShifter._newCrs = []; };
            var cr = null;

            cleanCrs();
            crsIntersector = {mostRightFromLeft: function() { return null; }};
            cr = {x: 0, y: 0, itemGUID: 1, side: CRS.TOP.LEFT, type: CRS.APPEND.DEF};
            crsShifter._shiftTopLeft(cr);
            ok(crsShifter._newCrs.length == 0, "shiftTopLeft no shifts ok");

            cr.x = 10;
            crsShifter._shiftTopLeft(cr);
            ok(crsShifter._newCrs[0].x == 0 && crsShifter._newCrs[0].y == 0, "shiftTopLeft on cr.x != 0 ok");

            cleanCrs();
            crsIntersector = {mostRightFromLeft: function() { return {x2: 9}; }};
            crsShifter._shiftTopLeft(cr);
            ok(crsShifter._newCrs.length == 0, "shiftTopLeft with mostClone.x2 + 1 == cr.x no shifts ok");

            crsIntersector = {mostRightFromLeft: function() { return {x2: 30}; }};
            crsShifter._shiftTopLeft(cr);
            ok(crsShifter._newCrs[0].x == 31 && crsShifter._newCrs[0].y == 0, "shiftTopLeft ok");

            clearTestData();
        },

        _shiftRightBottom: function() {
            cnsCore = {};
            var crsShifter = new CrsShifter();
            var cleanCrs = function() { crsShifter._newCrs = []; };
            var cr = null;

            cleanCrs();
            crsIntersector = {mostTopFromBottomOrBottomRight: function() { return null; }};
            cr = {x: 0, y: 0, itemGUID: 1, side: CRS.RIGHT.BOTTOM, type: CRS.APPEND.DEF};
            cnsCore.getMaxY = function() { return 0; };
            crsShifter._shiftRightBottom(cr);
            ok(crsShifter._newCrs.length == 0, "shiftRightBottom no shifts(maxY eq 0) ok");

            cnsCore.getMaxY = function() { return 1; };
            crsShifter._shiftRightBottom(cr);
            ok(crsShifter._newCrs.length == 0, "shiftRightBottom no shifts(maxY - 1 eq cr.y) ok");

            cnsCore.getMaxY = function() { return 20; };
            crsShifter._shiftRightBottom(cr);
            ok(crsShifter._newCrs[0].x == 0 && crsShifter._newCrs[0].y == 19,
               "shiftRightBottom with mostClose null ok");

            cleanCrs();
            crsIntersector = {mostTopFromBottomOrBottomRight: function() { return {y1: 1}; }};
            crsShifter._shiftRightBottom(cr);
            ok(crsShifter._newCrs.length == 0, "shiftRightBottom with mostClose eq cr ok");

            crsIntersector = {mostTopFromBottomOrBottomRight: function() { return {y1: 30}; }};
            crsShifter._shiftRightBottom(cr);
            ok(crsShifter._newCrs[0].x == 0 && crsShifter._newCrs[0].y == 29, "shiftRightBottom ok");

            clearTestData();
        },

        _shiftRightTop: function() {
            var crsShifter = new CrsShifter();
            var cleanCrs = function() { crsShifter._newCrs = []; };
            var cr = null;

            cleanCrs();
            crsIntersector = {mostBottomFromTopOrTopRight: function() { return null; }};
            cr = {x: 0, y: 0, itemGUID: 1, side: CRS.RIGHT.TOP, type: CRS.APPEND.DEF};
            crsShifter._shiftRightTop(cr);
            ok(crsShifter._newCrs.length == 0, "shiftRightTop no shifts ok");

            cr.y = 20;
            crsShifter._shiftRightTop(cr);
            ok(crsShifter._newCrs[0].x == 0 && crsShifter._newCrs[0].y == 0, "shiftRightTop with mostClose null ok");

            cleanCrs();
            crsIntersector = {mostBottomFromTopOrTopRight: function() { return {y2: 19}; }};
            crsShifter._shiftRightTop(cr);
            ok(crsShifter._newCrs.length == 0, "shiftRightTop with mostClose eq cr no shifts ok");

            crsIntersector = {mostBottomFromTopOrTopRight: function() { return {y2: 30}; }};
            crsShifter._shiftRightTop(cr);
            ok(crsShifter._newCrs[0].x == 0 && crsShifter._newCrs[0].y == 31, "shiftRightTop ok");

            clearTestData();
        },

        _shiftAllToRight: function() {
            grid = {x2: function() { return 100; }};
            var crsShifter = new CrsShifter();
            var crs = [
                {x: 10, y: 10, itemGUID: 1, side: CRS.LEFT.TOP, type: CRS.APPEND.DEF},
                {x: 20, y: 20, itemGUID: 2, side: CRS.LEFT.BOTTOM, type: CRS.APPEND.DEF},
                {x: 30, y: 30, itemGUID: 3, side: CRS.BOTTOM.RIGHT, type: CRS.APPEND.DEF},
                {x: 40, y: 40, itemGUID: 4, side: CRS.LEFT.TOP, type: CRS.APPEND.DEF},
                {x: 50, y: 50, itemGUID: 5, side: CRS.TOP.LEFT, type: CRS.APPEND.DEF}
            ];
            crsShifter.attach(crs);
            crsShifter.shiftAllToRight(CRS.LEFT.TOP);

            ok(crsShifter._newCrs[0].x == 100 && crsShifter._newCrs[3].x == 100 &&
               crsShifter._newCrs[1].x == 20 && crsShifter._newCrs[2].x == 30 &&
               crsShifter._newCrs[4].x == 50, "shiftAllToRight(2 leftTop crs) ok");

            crsShifter.shiftAllToRight(CRS.BOTTOM.LEFT);

            ok(crsShifter._newCrs[0].x == 100 && crsShifter._newCrs[3].x == 100 &&
            crsShifter._newCrs[1].x == 20 && crsShifter._newCrs[2].x == 30 &&
            crsShifter._newCrs[4].x == 50, "shiftAllToRight(not existing side) ok");

            clearTestData();
        },

        _shiftAllToLeft: function() {
            var crsShifter = new CrsShifter();
            var crs = [
                {x: 10, y: 10, itemGUID: 1, side: CRS.LEFT.TOP, type: CRS.APPEND.DEF},
                {x: 20, y: 20, itemGUID: 2, side: CRS.LEFT.BOTTOM, type: CRS.APPEND.DEF},
                {x: 30, y: 30, itemGUID: 3, side: CRS.BOTTOM.RIGHT, type: CRS.APPEND.DEF},
                {x: 40, y: 40, itemGUID: 4, side: CRS.LEFT.TOP, type: CRS.APPEND.DEF},
                {x: 50, y: 50, itemGUID: 5, side: CRS.TOP.LEFT, type: CRS.APPEND.DEF}
            ];
            crsShifter.attach(crs);
            crsShifter.shiftAllToLeft(CRS.LEFT.TOP);

            ok(crsShifter._newCrs[0].x == 0 && crsShifter._newCrs[3].x == 0 &&
            crsShifter._newCrs[1].x == 20 && crsShifter._newCrs[2].x == 30 &&
            crsShifter._newCrs[4].x == 50, "shiftAllToLeft(2 leftTop crs) ok");

            crsShifter.shiftAllToLeft(CRS.BOTTOM.LEFT);

            ok(crsShifter._newCrs[0].x == 0 && crsShifter._newCrs[3].x == 0 &&
            crsShifter._newCrs[1].x == 20 && crsShifter._newCrs[2].x == 30 &&
            crsShifter._newCrs[4].x == 50, "shiftAllToLeft(not existing side) ok");

            clearTestData();
        },

        _shiftAllToTop: function() {
            var crsShifter = new CrsShifter();
            var crs = [
                {x: 10, y: 10, itemGUID: 1, side: CRS.LEFT.TOP, type: CRS.APPEND.DEF},
                {x: 20, y: 20, itemGUID: 2, side: CRS.LEFT.BOTTOM, type: CRS.APPEND.DEF},
                {x: 30, y: 30, itemGUID: 3, side: CRS.BOTTOM.RIGHT, type: CRS.APPEND.DEF},
                {x: 40, y: 40, itemGUID: 4, side: CRS.LEFT.TOP, type: CRS.APPEND.DEF},
                {x: 50, y: 50, itemGUID: 5, side: CRS.TOP.LEFT, type: CRS.APPEND.DEF}
            ];
            crsShifter.attach(crs);
            crsShifter.shiftAllToTop(CRS.LEFT.TOP);

            ok(crsShifter._newCrs[0].y == 0 && crsShifter._newCrs[3].y == 0 &&
            crsShifter._newCrs[1].y == 20 && crsShifter._newCrs[2].y == 30 &&
            crsShifter._newCrs[4].y == 50, "shiftAllToTop(2 leftTop crs) ok");

            crsShifter.shiftAllToTop(CRS.BOTTOM.LEFT);

            ok(crsShifter._newCrs[0].y == 0 && crsShifter._newCrs[3].y == 0 &&
            crsShifter._newCrs[1].y == 20 && crsShifter._newCrs[2].y == 30 &&
            crsShifter._newCrs[4].y == 50, "shiftAllToTop(not existing side) ok");

            clearTestData();
        },

        _shiftAllToBottom: function() {
            grid = {y2: function() { return 100; }};
            var crsShifter = new CrsShifter();
            var crs = [
                {x: 10, y: 10, itemGUID: 1, side: CRS.LEFT.TOP, type: CRS.APPEND.DEF},
                {x: 20, y: 20, itemGUID: 2, side: CRS.LEFT.BOTTOM, type: CRS.APPEND.DEF},
                {x: 30, y: 30, itemGUID: 3, side: CRS.BOTTOM.RIGHT, type: CRS.APPEND.DEF},
                {x: 40, y: 40, itemGUID: 4, side: CRS.LEFT.TOP, type: CRS.APPEND.DEF},
                {x: 50, y: 50, itemGUID: 5, side: CRS.TOP.LEFT, type: CRS.APPEND.DEF}
            ];
            crsShifter.attach(crs);
            crsShifter.shiftAllToBottom(CRS.LEFT.TOP);

            ok(crsShifter._newCrs[0].y == 100 && crsShifter._newCrs[3].y == 100 &&
            crsShifter._newCrs[1].y == 20 && crsShifter._newCrs[2].y == 30 &&
            crsShifter._newCrs[4].y == 50, "shiftAllToBottom(2 leftTop crs) ok");

            crsShifter.shiftAllToBottom(CRS.BOTTOM.LEFT);

            ok(crsShifter._newCrs[0].y == 100 && crsShifter._newCrs[3].y == 100 &&
            crsShifter._newCrs[1].y == 20 && crsShifter._newCrs[2].y == 30 &&
            crsShifter._newCrs[4].y == 50, "shiftAllToBottom(not existing side) ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});