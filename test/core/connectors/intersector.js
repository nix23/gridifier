$(document).ready(function() {
    module("CrsIntersector");

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
                    "mostYCloseGetIntCns",
                    "mostBottomFromTopOrTopLeftRight",
                    "mostTopFromBottomOrBottomLeftRight",
                    "mostXCloseGetIntCns",
                    "mostLeftFromRight",
                    "mostRightFromLeft"
                ]);
            });
        },

        _mostYCloseGetIntCns: function() {
            ev = new EventEmitter();
            settings = new Settings();

            var cns = [
                {x1: 0,   x2: 99,  y1: 0,   y2: 99, itemGUID: 1},
                {x1: 100, x2: 199, y1: 0,   y2: 99, itemGUID: 2},
                {x1: 0,   x2: 99,  y1: 100, y2: 199, itemGUID: 3},
                {x1: 100, x2: 199, y1: 100, y2: 199, itemGUID: 4}
            ];

            var wasXAndTopCalled = false;
            var wasXAndBottomCalled = false;
            var wasYAndLeftCalled = false;
            var wasYAndRightCalled = false;
            var lastCr = null;
            connections = {
                get: function() { return cns; },
                getAllIntXAndTopCns: function(cr) { lastCr = cr; wasXAndTopCalled = true; return [[0, 1], [2, 3]]; },
                getAllIntXAndBottomCns: function(cr) { lastCr = cr; wasXAndBottomCalled = true; return [[0, 1], [2, 3]]; },
                getAllIntYAndLeftCns: function(cr) { lastCr = cr; wasYAndLeftCalled = true; return [[0, 1], [2, 3]]; },
                getAllIntYAndRightCns: function(cr) { lastCr = cr; wasYAndRightCalled = true; return [[0, 1], [2, 3]]; }
            };

            var crsIntersector = new CrsIntersector();

            wasXAndTopCalled = false;
            crsIntersector.mostBottomFromTopOrTopLeft({x: 1, y: 200});
            ok(wasXAndTopCalled && lastCr.x == 1, "mostYCloseGetIntCns mostBottomFromTopOrTopLeft vg ok");

            wasXAndTopCalled = false;
            crsIntersector.mostBottomFromTopOrTopRight({x: 2, y: 200});
            ok(wasXAndTopCalled && lastCr.x == 2, "mostYCloseGetIntCns mostBottomFromTopOrTopRight vg ok");

            wasXAndBottomCalled = false;
            crsIntersector.mostTopFromBottomOrBottomLeft({x: 3, y: 200});
            ok(wasXAndBottomCalled && lastCr.x == 3, "mostYCloseGetIntCns mostTopFromBottomOrBottomLeft vg ok");

            wasXAndBottomCalled = false;
            crsIntersector.mostTopFromBottomOrBottomRight({x: 4, y: 200});
            ok(wasXAndBottomCalled && lastCr.x == 4, "mostYCloseGetIntCns mostTopFromBottomOrBottomRight vg ok");

            sourceSettings = {grid: "horizontal"};
            settings = new Settings();

            wasYAndLeftCalled = false;
            crsIntersector.mostBottomFromTopOrTopLeft({x: 5, y: 200});
            ok(wasYAndLeftCalled && lastCr.x == 5, "mostYCloseGetIntCns mostBottomFromTopOrTopLeft hg ok");

            wasYAndRightCalled = false;
            crsIntersector.mostBottomFromTopOrTopRight({x: 6, y: 200});
            ok(wasYAndRightCalled && lastCr.x == 6, "mostYCloseGetIntCns mostBottomFromTopOrTopRight hg ok");

            wasYAndLeftCalled = false;
            crsIntersector.mostTopFromBottomOrBottomLeft({x: 7, y: 200});
            ok(wasYAndLeftCalled && lastCr.x == 7, "mostYCloseGetIntCns mostTopFromBottomOrBottomLeft hg ok");

            wasYAndRightCalled = false;
            crsIntersector.mostTopFromBottomOrBottomRight({x: 8, y: 200});
            ok(wasYAndRightCalled && lastCr.x == 8, "mostYCloseGetIntCns mostTopFromBottomOrBottomRight hg ok");

            clearTestData();
        },

        _mostBottomFromTopOrTopLeftRight: function() {
            ev = new EventEmitter();
            settings = new Settings();

            var cns = [
                {x1: 0,   x2: 99,  y1: 0,   y2: 99, itemGUID: 1},
                {x1: 100, x2: 199, y1: 0,   y2: 99, itemGUID: 2},
                {x1: 0,   x2: 99,  y1: 100, y2: 199, itemGUID: 3},
                {x1: 100, x2: 199, y1: 100, y2: 199, itemGUID: 4}
            ];

            connections = {
                get: function() { return cns; },
                getAllIntXAndTopCns: function() { return [[0, 1], [2, 3]]; }
            };

            var crsIntersector = new CrsIntersector();
            var mostBottom = crsIntersector.mostBottomFromTopOrTopLeft({x: 100, y: 200});
            ok(mostBottom.itemGUID == 3, "mostBottomFromTopOrTopLeft(square grid) item 3 ok");

            var mostBottom = crsIntersector.mostBottomFromTopOrTopLeft({x: 0, y: 0});
            ok(mostBottom == null, "mostBottomFromTopOrTopLeft(square grid) item 0 ok");

            var mostBottom = crsIntersector.mostBottomFromTopOrTopRight({x: 100, y: 200});
            ok(mostBottom.itemGUID == 4, "mostBottomFromTopOrTopRight(square grid) item 4 ok");

            var mostBottom = crsIntersector.mostBottomFromTopOrTopRight({x: 0, y: 0});
            ok(mostBottom == null, "mostBottomFromTopOrTopRight(square grid) item 0 ok");

            cns = [
                {x1: 0,   x2: 99,  y1: 0,   y2: 199, itemGUID: 1},
                {x1: 100, x2: 199, y1: 0,   y2: 99, itemGUID: 2},
                {x1: 0,   x2: 99,  y1: 200, y2: 399, itemGUID: 3},
                {x1: 100, x2: 199, y1: 100, y2: 299, itemGUID: 4}
            ];

            var mostBottom = crsIntersector.mostBottomFromTopOrTopLeft({x: 100, y: 300});
            ok(mostBottom.itemGUID == 4, "mostBottomFromTopOrTopLeft(rect grid) item 4 ok");

            var mostBottom = crsIntersector.mostBottomFromTopOrTopLeft({x: 99, y: 200});
            ok(mostBottom.itemGUID == 1, "mostBottomFromTopOrTopLeft(rect grid) item 1 ok");

            var mostBottom = crsIntersector.mostBottomFromTopOrTopRight({x: 100, y: 300});
            ok(mostBottom.itemGUID == 4, "mostBottomFromTopOrTopRight(rect grid) item 4 ok");

            var mostBottom = crsIntersector.mostBottomFromTopOrTopRight({x: 100, y: 200});
            ok(mostBottom.itemGUID == 2, "mostBottomFromTopOrTopRight(rect grid) item 2 ok");

            clearTestData();
        },

        _mostTopFromBottomOrBottomLeftRight: function() {
            ev = new EventEmitter();
            settings = new Settings();

            var cns = [
                {x1: 0,   x2: 99,  y1: 0,   y2: 99, itemGUID: 1},
                {x1: 100, x2: 199, y1: 0,   y2: 99, itemGUID: 2},
                {x1: 0,   x2: 99,  y1: 100, y2: 199, itemGUID: 3},
                {x1: 100, x2: 199, y1: 100, y2: 199, itemGUID: 4}
            ];

            connections = {
                get: function() { return cns; },
                getAllIntXAndBottomCns: function() { return [[0, 1], [2, 3]]; }
            };

            var crsIntersector = new CrsIntersector();
            var mostTop = crsIntersector.mostTopFromBottomOrBottomLeft({x: 100, y: 99});
            ok(mostTop.itemGUID == 3, "mostTopFromBottomOrBottomLeft(square grid) item 3 ok");

            var mostTop = crsIntersector.mostTopFromBottomOrBottomLeft({x: 0, y: 200});
            ok(mostTop == null, "mostTopFromBottomOrBottomLeft(square grid) item 0 ok");

            var mostTop = crsIntersector.mostTopFromBottomOrBottomRight({x: 99, y: 0});
            ok(mostTop.itemGUID == 3, "mostTopFromBottomOrBottomRight(square grid) item 3 ok");

            var mostTop = crsIntersector.mostTopFromBottomOrBottomRight({x: 0, y: 200});
            ok(mostTop == null, "mostTopFromBottomOrBottomRight(square grid) item 0 ok");

            cns = [
                {x1: 0,   x2: 99,  y1: 0,   y2: 199, itemGUID: 1},
                {x1: 100, x2: 199, y1: 0,   y2: 99, itemGUID: 2},
                {x1: 0,   x2: 99,  y1: 200, y2: 399, itemGUID: 3},
                {x1: 100, x2: 199, y1: 100, y2: 299, itemGUID: 4}
            ];

            var mostTop = crsIntersector.mostTopFromBottomOrBottomLeft({x: 100, y: 99});
            ok(mostTop.itemGUID == 4, "mostTopFromBottomOrBottomLeft(rect grid) item 4 ok");

            var mostTop = crsIntersector.mostTopFromBottomOrBottomLeft({x: 99, y: 199});
            ok(mostTop.itemGUID == 3, "mostTopFromBottomOrBottomLeft(rect grid) item 3 ok");

            var mostTop = crsIntersector.mostTopFromBottomOrBottomRight({x: 100, y: 0});
            ok(mostTop.itemGUID == 4, "mostTopFromBottomOrBottomRight(rect grid) item 4 ok");

            var mostTop = crsIntersector.mostTopFromBottomOrBottomRight({x: 99, y: 100});
            ok(mostTop.itemGUID == 3, "mostTopFromBottomOrBottomRight(rect grid) item 3 ok");

            clearTestData();
        },

        _mostXCloseGetIntCns: function() {
            ev = new EventEmitter();
            settings = new Settings();

            var cns = [
                {x1: 0,   x2: 99,  y1: 0,   y2: 99, itemGUID: 1},
                {x1: 100, x2: 199, y1: 0,   y2: 99, itemGUID: 2},
                {x1: 0,   x2: 99,  y1: 100, y2: 199, itemGUID: 3},
                {x1: 100, x2: 199, y1: 100, y2: 199, itemGUID: 4}
            ];

            var wasXCalled = false;
            var wasYAndLeftCalled = false;
            var wasYAndRightCalled = false;
            var lastCr = null;
            connections = {
                get: function() { return cns; },
                getAllIntXCns: function(cr) { lastCr = cr; wasXCalled = true; return [0, 1, 2, 3]; },
                getAllIntYAndLeftCns: function(cr) { lastCr = cr; wasYAndLeftCalled = true; return [[0, 1], [2, 3]]; },
                getAllIntYAndRightCns: function(cr) { lastCr = cr; wasYAndRightCalled = true; return [[0, 1], [2, 3]]; }
            };

            var crsIntersector = new CrsIntersector();

            wasXCalled = false;
            crsIntersector.mostLeftFromRight({x: 1, y: 200});
            ok(wasXCalled && lastCr.x == 1, "mostXCloseGetIntCns mostLeftFromRight vg ok");

            wasXCalled = false;
            crsIntersector.mostRightFromLeft({x: 2, y: 200});
            ok(wasXCalled && lastCr.x == 2, "mostXCloseGetIntCns mostRightFromLeft vg ok");

            sourceSettings = {grid: "horizontal"};
            settings = new Settings();

            wasYAndRightCalled = false;
            crsIntersector.mostLeftFromRight({x: 3, y: 200});
            ok(wasYAndRightCalled && lastCr.x == 3, "mostXCloseGetIntCns mostLeftFromRight hg ok");

            wasYAndLeftCalled = false;
            crsIntersector.mostRightFromLeft({x: 4, y: 200});
            ok(wasYAndLeftCalled && lastCr.x == 4, "mostXCloseGetIntCns mostRightFromLeft hg ok");

            clearTestData();
        },

        _mostLeftFromRight: function() {
            var exec = function(isHor, gridType) {
                ev = new EventEmitter();
                if(isHor)
                    sourceSettings = {grid: "horizontal"};
                settings = new Settings();

                var cns = [
                    {x1: 0, x2: 99, y1: 0, y2: 99, itemGUID: 1},
                    {x1: 100, x2: 199, y1: 0, y2: 99, itemGUID: 2},
                    {x1: 0, x2: 99, y1: 100, y2: 199, itemGUID: 3},
                    {x1: 100, x2: 199, y1: 100, y2: 199, itemGUID: 4}
                ];

                connections = {get: function() { return cns; }};
                if(!isHor) {
                    connections.getAllIntXCns = function() { return [0, 1, 2, 3]; };
                }
                else {
                    connections.getAllIntYAndRightCns = function() { return [[0, 1], [2, 3]]; };
                }

                var crsIntersector = new CrsIntersector();

                var mostLeft = crsIntersector.mostLeftFromRight({x: 0, y: 0});
                ok(mostLeft.itemGUID == 2, "mostLeftFromRight(square grid) " + gridType + " item 2 ok");

                var mostLeft = crsIntersector.mostLeftFromRight({x: 100, y: 0});
                ok(mostLeft == null, "mostLeftFromRight(square grid) " + gridType + " item 0 ok");

                cns = [
                    {x1: 0, x2: 99, y1: 0, y2: 99, itemGUID: 1},
                    {x1: 100, x2: 299, y1: 0, y2: 99, itemGUID: 2},
                    {x1: 0, x2: 199, y1: 100, y2: 199, itemGUID: 3},
                    {x1: 200, x2: 399, y1: 100, y2: 199, itemGUID: 4}
                ];

                var mostLeft = crsIntersector.mostLeftFromRight({x: 0, y: 99});
                ok(mostLeft.itemGUID == 2, "mostLeftFromRight(rect grid) " + gridType + " item 2 ok");

                var mostLeft = crsIntersector.mostLeftFromRight({x: 199, y: 100});
                ok(mostLeft.itemGUID == 4, "mostLeftFromRight(rect grid) " + gridType + " item 4 ok");

                clearTestData();
            };

            exec.call(this, false, "vg");
            exec.call(this, true, "hg");
        },

        _mostRightFromLeft: function() {
            var exec = function(isHor, gridType) {
                ev = new EventEmitter();
                if(isHor)
                    sourceSettings = {grid: "horizontal"};
                settings = new Settings();

                var cns = [
                    {x1: 0, x2: 99, y1: 0, y2: 99, itemGUID: 1},
                    {x1: 100, x2: 199, y1: 0, y2: 99, itemGUID: 2},
                    {x1: 0, x2: 99, y1: 100, y2: 199, itemGUID: 3},
                    {x1: 100, x2: 199, y1: 100, y2: 199, itemGUID: 4}
                ];

                connections = {get: function() { return cns; }};
                if(!isHor) {
                    connections.getAllIntXCns = function() { return [0, 1, 2, 3]; };
                }
                else {
                    connections.getAllIntYAndLeftCns = function() { return [[0, 1], [2, 3]]; };
                }

                var crsIntersector = new CrsIntersector();

                var mostRight = crsIntersector.mostRightFromLeft({x: 100, y: 0});
                ok(mostRight.itemGUID == 1, "mostRightFromLeft(square grid) " + gridType + " item 1 ok");

                var mostRight = crsIntersector.mostRightFromLeft({x: 0, y: 0});
                ok(mostRight == null, "mostRightFromLeft(square grid) " + gridType + " item 0 ok");

                cns = [
                    {x1: 0, x2: 99, y1: 0, y2: 99, itemGUID: 1},
                    {x1: 100, x2: 299, y1: 0, y2: 99, itemGUID: 2},
                    {x1: 0, x2: 199, y1: 100, y2: 199, itemGUID: 3},
                    {x1: 200, x2: 399, y1: 100, y2: 199, itemGUID: 4}
                ];

                var mostRight = crsIntersector.mostRightFromLeft({x: 100, y: 0});
                ok(mostRight.itemGUID == 1, "mostRightFromLeft(rect grid) " + gridType + " item 1 ok");

                var mostRight = crsIntersector.mostRightFromLeft({x: 200, y: 100});
                ok(mostRight.itemGUID == 3, "mostRightFromLeft(rect grid) " + gridType + " item 3 ok");

                clearTestData();
            };

            exec.call(this, false, "vg");
            exec.call(this, true, "hg");
        }
    }

    tester.runTests();
    clearTestData();
});