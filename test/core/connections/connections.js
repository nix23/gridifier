$(document).ready(function() {
    module("Connections");

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
                    "find",
                    "findInReposQueue",
                    "create",
                    "rm",
                    "remapGUIDS",
                    "remapGUIDSIn",
                    "getByGUIDS",
                    "syncParams",
                    "getMinWidth",
                    "getMinHeight",
                    "isAnyGUIDSmallerThan",
                    "isAnyGUIDBiggerThan",
                    "getMaxY",
                    "restoreOnSortDispersion",
                    "getAllBACoord",
                    "fixAllYPosAfterPrepend",
                    "fixAllXPosAfterPrepend"
                ]);
            });
        },

        _find: function(assert) {
            guid = {get: function(item) { if(typeof item == "object") return 3; }};
            connections = {get: function() { return []; }};
            repositionQueue = {isEmpty: function() { return true; }};

            var cnsCore = new CnsCore();
            assert.throws(
                function() { cnsCore.find({}); },
                /no inserted items/,
                "no cns to find ok"
            );

            connections = {get: function() {
                return [
                    {itemGUID: 1},
                    {itemGUID: 2},
                    {itemGUID: 3}
                ];
            }};

            var cn = cnsCore.find({});
            ok(cn.itemGUID == 3, "find cn in cns ok");

            guid = {get: function(item) { if(typeof item == "object") return 6; }};
            ok(cnsCore.find({}, true) == null, "find not existing cn ok");

            assert.throws(
                function() { cnsCore.find({}); },
                /can't find conn. by item/,
                "can't find conn by item ok"
            );

            clearTestData();
        },

        _findInReposQueue: function(assert) {
            guid = {get: function(item) { if(typeof item == "object") return 6; }};
            connections = {get: function() { return [{itemGUID: 700}]; }};
            repositionQueue = {
                isEmpty: function() { return false; },
                getQueued: function() { return []; }
            };

            var cnsCore = new CnsCore();

            assert.throws(
                function() { cnsCore.find({}); },
                /can't find conn. by item/,
                "can't find conn by item ok"
            );

            repositionQueue.getQueued = function() {
                return [
                    {cn: {itemGUID: 17}},
                    {cn: {itemGUID: 6}}
                ];
            };
            ok(cnsCore.find({}).itemGUID == 6, "find cn in repos queue ok");

            clearTestData();
        },

        _create: function() {
            guid = {get: function(item) { if(typeof item == "object") return 6; }};
            gridItem = new Item();

            var cnsCore = new CnsCore();
            var cn = cnsCore.create(Dom.div(), {x1: 12.608, x2: 15.703, y1: 14.00, y2: 86.145});

            ok(gridItem.isConnected(cn.item) && cn.x1 == 12.61 && cn.x2 == 15.70 &&
               cn.y1 == 14.00 && cn.y2 == 86.15 && cn.hOffset == 0 && cn.vOffset == 0 &&
               cn.itemGUID == 6 && !cn.restrictCollect, "create cn ok");

            cn.vOffset = 10;
            cn.hOffset = 13;
            cn.restrictCollect = true;
            cn = cnsCore.create(cn.item, cn);
            ok(cn.vOffset == 10 && cn.hOffset == 13 && cn.restrictCollect, "recreate cn ok");

            clearTestData();
        },

        _rm: function() {
            guid = {get: function(item) { return item.guid }};
            var cns = [
                {item: {guid: 1}},
                {item: {guid: 2}},
                {item: {guid: 3}}
            ];

            var cnsCore = new CnsCore();
            cnsCore.rm(cns, cns[1]);

            ok(cns.length == 2 && cns[0].item.guid == 1 && cns[1].item.guid == 3,
               "rm cn ok");

            clearTestData();
        },

        _remapGUIDS: function() {
            var cns = [
                {item: {guid: 3}},
                {item: {guid: 2}},
                {item: {guid: 1}}
            ];

            cnsSorter = {sortForReappend: function(cns) { return cns; }};
            connections = {get: function() { return cns; }};

            var nextGUID = 0;
            var reinitCalled = false;
            guid = {
                markForAppend: function(item) { item.guid = ++nextGUID; },
                reinit: function() { reinitCalled = true; }
            };

            var cnsCore = new CnsCore();
            cnsCore.remapAllGUIDS(cns);

            ok(reinitCalled && cns[0].item.guid == 1 && cns[1].item.guid == 2 &&
               cns[2].item.guid == 3, "remapGUIDS ok");

            clearTestData();
        },

        _remapGUIDSIn: function() {
            var cns = [
                {item: {guid: 3}},
                {item: {guid: 2}},
                {item: {guid: 1}}
            ];
            connections = {get: function() { return cns; }};

            var nextGUID = 0;
            guid = {
                markForAppend: function(item) { item.guid = ++nextGUID; }
            };

            var cnsCore = new CnsCore();
            cnsCore.remapGUIDSIn(connections.get());

            ok(cns[0].item.guid == 1 && cns[1].item.guid == 2 && cns[2].item.guid == 3,
               "remapGUIDSIn ok");

            clearTestData();
        },

        _getByGUIDS: function() {
            var cns = [
                {itemGUID: 1},
                {itemGUID: 2},
                {itemGUID: 3}
            ];
            connections = {get: function() { return cns; }};

            var cnsCore = new CnsCore();
            var newCns = cnsCore.getByGUIDS([1,3]);

            ok(newCns.length == 2 && newCns[0].itemGUID == 1 && newCns[1].itemGUID == 3,
               "getByGUIDS ok");

            clearTestData();
        },

        _syncParams: function() {
            var cns = [
                {itemGUID: 1, x1: 0, x2: 1, y1: 2, y2: 3, hOffset: 0, vOffset: 1, restrictCollect: false},
                {itemGUID: 2, x1: 0, x2: 1, y1: 2, y2: 3, hOffset: 0, vOffset: 1, restrictCollect: false},
                {itemGUID: 3, x1: 0, x2: 1, y1: 2, y2: 3, hOffset: 0, vOffset: 1, restrictCollect: false}
            ];
            connections = {get: function() { return cns; }};

            var cnsCore = new CnsCore();
            cnsCore.syncParams([
                {itemGUID: 1, x1: 10, x2: 20, y1: 20, y2: 40, hOffset: 20, vOffset: 30, restrictCollect: true},
                {itemGUID: 3, y1: 30, y2: 30}
            ]);

            ok(cns[0].itemGUID == 1 && cns[0].x1 == 10 && cns[0].x2 == 20 && cns[0].y1 == 20 &&
               cns[0].y2 == 40 && cns[0].hOffset == 20 && cns[0].vOffset == 30 && cns[0].restrictCollect &&
               cns[2].itemGUID == 3 && cns[2].y1 == 30 && cns[2].y2 == 30,
               "syncParams ok");

            clearTestData();
        },

        _getMinWidth: function() {
            var sizesRecalcs = [false,false,false];

            connections = {get: function() { return []; }};
            grid = {x2: function() { return 199; }};
            srManager = {outerWidth: function(item) {
                if(item.itemGUID == 1) { sizesRecalcs[0] = true; return 100; }
                else if(item.itemGUID == 2) { sizesRecalcs[1] = true; return 200; }
                else if(item.itemGUID == 3) { sizesRecalcs[2] = true; return 30; }
            }};

            var cnsCore = new CnsCore();
            ok(cnsCore.getMinWidth() == 0, "get min width on no cns ok");

            var cns = [
                {itemGUID: 1, x1: 0, x2: 99,  y1: 0, y2: 99, item: {itemGUID: 1}},
                {itemGUID: 2, x1: 0, x2: 199, y1: 0, y2: 199, item: {itemGUID: 2}},
                {itemGUID: 3, x1: 0, x2: 29,  y1: 0, y2: 29, item: {itemGUID: 3}}
            ];
            connections = {get: function() { return cns; }};
            ok(cnsCore.getMinWidth() == 30 && !sizesRecalcs[0] && !sizesRecalcs[1] &&
               !sizesRecalcs[2], "get min width ok");

            cns[0].x1 = 100;
            cns[1].x1 = -1;
            cns[2].x2 = 200;
            ok(cnsCore.getMinWidth() == 30 && sizesRecalcs[0] && sizesRecalcs[1] &&
               sizesRecalcs[2], "get min width with recalcs ok");

            clearTestData();
        },

        _getMinHeight: function() {
            var sizesRecalcs = [false,false,false];

            connections = {get: function() { return []; }};
            grid = {y2: function() { return 199; }};
            srManager = {outerHeight: function(item) {
                if(item.itemGUID == 1) { sizesRecalcs[0] = true; return 100; }
                else if(item.itemGUID == 2) { sizesRecalcs[1] = true; return 200; }
                else if(item.itemGUID == 3) { sizesRecalcs[2] = true; return 30; }
            }};

            var cnsCore = new CnsCore();
            ok(cnsCore.getMinHeight() == 0, "get min height on no cns ok");

            var cns = [
                {itemGUID: 1, x1: 0, x2: 99,  y1: 0, y2: 99, item: {itemGUID: 1}},
                {itemGUID: 2, x1: 0, x2: 199, y1: 0, y2: 199, item: {itemGUID: 2}},
                {itemGUID: 3, x1: 0, x2: 29,  y1: 0, y2: 29, item: {itemGUID: 3}}
            ];
            connections = {get: function() { return cns; }};
            ok(cnsCore.getMinHeight() == 30 && !sizesRecalcs[0] && !sizesRecalcs[1] &&
              !sizesRecalcs[2], "get min height ok");

            cns[0].y1 = 100;
            cns[1].y1 = -1;
            cns[2].y2 = 200;
            ok(cnsCore.getMinHeight() == 30 && sizesRecalcs[0] && sizesRecalcs[1] &&
               sizesRecalcs[2], "get min height with recalcs ok");

            clearTestData();
        },

        _isAnyGUIDSmallerThan: function() {
            guid = {get: function(item) { return item.itemGUID; }};
            var cns = [
                {item: {itemGUID: 1}},
                {item: {itemGUID: 2}},
                {item: {itemGUID: 3}},
                {item: {itemGUID: 4}}
            ];

            var cnsCore = new CnsCore();
            ok(cnsCore.isAnyGUIDSmallerThan(cns, {itemGUID: 3}), "isAnyGUIDSmallerThan ok");
            ok(!cnsCore.isAnyGUIDSmallerThan(cns, {itemGUID: 1}), "!isAnyGUIDSmallerThan ok");

            clearTestData();
        },

        _isAnyGUIDBiggerThan: function() {
            guid = {get: function(item) { return item.itemGUID; }};
            var cns = [
                {item: {itemGUID: 1}},
                {item: {itemGUID: 2}},
                {item: {itemGUID: 3}},
                {item: {itemGUID: 4}}
            ];

            var cnsCore = new CnsCore();
            ok(cnsCore.isAnyGUIDBiggerThan(cns, {itemGUID: 3}), "isAnyGUIDBiggerThan ok");
            ok(!cnsCore.isAnyGUIDBiggerThan(cns, {itemGUID: 4}), "!isAnyGUIDBiggerThan ok");

            clearTestData();
        },

        _getMaxY: function() {
            var cns = [
                {y2: 20},
                {y2: 1},
                {y2: 150},
                {y2: 70}
            ];
            connections = {get: function() { return cns; }};

            var cnsCore = new CnsCore();
            ok(cnsCore.getMaxY() == 150, "getMaxY ok");

            clearTestData();
        },

        _restoreOnSortDispersion: function() {
            ev = new EventEmitter();
            sourceSettings = {};
            settings = new Settings();

            var cns = [
                {itemGUID: 1, x1: 0, x2: 99,  y1: 0, y2: 99},
                {itemGUID: 2, x1: 0, x2: 199, y1: 0, y2: 199},
                {itemGUID: 3, x1: 0, x2: 29,  y1: 0, y2: 29}
            ];
            connections = {get: function() { return cns; }};
            cnsSorter = {sortForReappend: function(cns) { return cns; }};

            var cnsCore = new CnsCore();
            var fnLastCn = null;
            var fnCns = null;

            var testFn = function(cns, lastCn, setCn) {
                fnLastCn = lastCn;
                for(var i = 0; i < cns.length; i++)
                    setCn(cns[i], -1, -1);

                fnCns = cns;
            };
            var testFn2 = function(cns, lastCn, setCn) {
                fnLastCn = lastCn;
                for(var i = 0; i < cns.length; i++)
                    setCn(cns[i], -2, -2);

                fnCns = cns;
            };

            cnsCore.restoreOnSortDispersion(cns, testFn, testFn2);

            ok(fnLastCn.itemGUID == 3 && fnCns[0].x1 == -1 && fnCns[0].x2 == -1 &&
               fnCns[0].y1 == -1 && fnCns[0].y2 == -1 && fnCns[2].x1 == -1, "resortOnSortDispersion def append ok");

            clearTestData();
            ev = new EventEmitter();
            sourceSettings = {append: "reversed"};
            settings = new Settings();

            cnsCore.restoreOnSortDispersion(cns, testFn, testFn2);

            ok(fnLastCn.itemGUID == 3 && fnCns[0].x1 == -2 && fnCns[0].x2 == -2 &&
               fnCns[0].y1 == -2 && fnCns[0].y2 == -2 && fnCns[2].x1 == -2, "resortOnSortDispersion rev append ok");

            clearTestData();
        },

        _getAllBACoord: function() {
            ev = new EventEmitter();
            sourceSettings = {};
            settings = new Settings();

            var cns = [
                {itemGUID: 1, x1: 0, x2: 99,  y1: 0, y2: 99},
                {itemGUID: 2, x1: 0, x2: 199, y1: 0, y2: 199},
                {itemGUID: 3, x1: 0, x2: 29,  y1: 0, y2: 29}
            ];
            connections = {get: function() { return cns; }};

            var cnsCore = new CnsCore();
            ok(cnsCore.getAllBACoord(0, function(cn, coord) { return cn.y1 < coord; }).length == 0, "getAllBACoord no cns ok");

            var newCns = cnsCore.getAllBACoord(30, function(cn, coord) { return cn.y2 > coord; });
            ok(newCns.length == 2 && newCns[0].itemGUID == 1 && newCns[1].itemGUID == 2, "getAllBACoord ok");

            clearTestData();
            sourceSettings = {sortDispersion: true};
            settings = new Settings();
            ok(cnsCore.getAllBACoord(30, function(cn, coord) { return cn.y2 > coord; }).length == 0, "getAllBACoord with SD eq true ok");

            clearTestData();
        },

        _fixAllYPosAfterPrepend: function() {
            var cns = [
                {itemGUID: 1, x1: 0, x2: 99,  y1: 0, y2: 99},
                {itemGUID: 2, x1: 0, x2: 199, y1: 0, y2: 199},
                {itemGUID: 3, x1: 0, x2: 29,  y1: 0, y2: 29}
            ];
            connections = {get: function() { return cns; }};

            var incAllBy = {val: null, c1: null, c2: null};
            var createPrepended = {c1v: null, c2v: null, c1: null, c2: null};
            cnsRanges = {
                incAllBy: function(val, c1, c2) {
                    incAllBy.val = val; incAllBy.c1 = c1; incAllBy.c2 = c2;
                },

                createPrepended: function(c1v, c2v, c1, c2) {
                    createPrepended.c1v = c1v; createPrepended.c2v = c2v;
                    createPrepended.c1 = c1; createPrepended.c2 = c2;
                }
            };

            var crs = [
                {x: 10, y: 100, itemGUID: 1},
                {x: 20, y: 30, itemGUID: 3}
            ];
            var cnsCore = new CnsCore();

            var wereFixed = cnsCore.fixAllXYPosAfterPrepend({x1: 0, x2: 50, y1: 0, y2: 100}, crs, "y", "y1", "y2");
            ok(!wereFixed, "fixAllYPosAfterPrepend with no fixed ok");

            var newCn = {x1: 0, x2: 50, y1: -10, y2: 0, itemGUID: 2};
            wereFixed = cnsCore.fixAllXYPosAfterPrepend(newCn, crs, "y", "y1", "y2");
            ok(newCn.y1 == 0 &&
               newCn.y2 == 10 &&
               cns[0].y1 == 10 &&
               cns[0].y2 == 109 &&
               cns[1].y1 == 0 &&
               cns[1].y2 == 199 &&
               cns[2].y1 == 10 &&
               cns[2].y2 == 39 &&
               crs[0].y == 110 &&
               crs[1].y == 40 &&
               incAllBy.val == 10 &&
               incAllBy.c1 == "y1" &&
               incAllBy.c2 == "y2" &&
               createPrepended.c1v == 0 &&
               createPrepended.c2v == 10 &&
               createPrepended.c1 == "y1" &&
               createPrepended.c2 == "y2",
               "fixAllYPosAfterPrepend ok");

            clearTestData();
        },

        _fixAllXPosAfterPrepend: function() {
            var cns = [
                {itemGUID: 1, x1: 0, x2: 99,  y1: 0, y2: 99},
                {itemGUID: 2, x1: 0, x2: 199, y1: 0, y2: 199},
                {itemGUID: 3, x1: 0, x2: 29,  y1: 0, y2: 29}
            ];
            connections = {get: function() { return cns; }};

            var incAllBy = {val: null, c1: null, c2: null};
            var createPrepended = {c1v: null, c2v: null, c1: null, c2: null};
            cnsRanges = {
                incAllBy: function(val, c1, c2) {
                    incAllBy.val = val; incAllBy.c1 = c1; incAllBy.c2 = c2;
                },

                createPrepended: function(c1v, c2v, c1, c2) {
                    createPrepended.c1v = c1v; createPrepended.c2v = c2v;
                    createPrepended.c1 = c1; createPrepended.c2 = c2;
                }
            };

            var crs = [
                {x: 100, y: 10, itemGUID: 1},
                {x: 30, y: 20, itemGUID: 3}
            ];
            var cnsCore = new CnsCore();

            var wereFixed = cnsCore.fixAllXYPosAfterPrepend({x1: 0, x2: 100, y1: 0, y2: 50}, crs, "x", "x1", "x2");
            ok(!wereFixed, "fixAllXPosAfterPrepend with no fixed ok");

            var newCn = {x1: -10, x2: 0, y1: 0, y2: 50, itemGUID: 2};
            wereFixed = cnsCore.fixAllXYPosAfterPrepend(newCn, crs, "x", "x1", "x2");
            ok(newCn.x1 == 0 &&
                newCn.x2 == 10 &&
                cns[0].x1 == 10 &&
                cns[0].x2 == 109 &&
                cns[1].x1 == 0 &&
                cns[1].x2 == 199 &&
                cns[2].x1 == 10 &&
                cns[2].x2 == 39 &&
                crs[0].x == 110 &&
                crs[1].x == 40 &&
                incAllBy.val == 10 &&
                incAllBy.c1 == "x1" &&
                incAllBy.c2 == "x2" &&
                createPrepended.c1v == 0 &&
                createPrepended.c2v == 10 &&
                createPrepended.c1 == "x1" &&
                createPrepended.c2 == "x2",
                "fixAllXPosAfterPrepend ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});