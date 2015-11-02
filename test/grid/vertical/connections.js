$(document).ready(function() {
    module("VgConnections");

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
                    "reinitRanges",
                    "attachToRanges",
                    "mapAllIntAndTopCns",
                    "mapAllIntAndBottomCns",
                    "getAllIntXAndTBCns",
                    "getLastRowYExpandedCns",
                    "yIntFns",
                    "expandYAllRowCnsToMostTall",
                    "crud",
                    "restoreOnSortDispersionDefAppend",
                    "restoreOnSortDispersionRevAppend",
                    "getAllAboveBelowY",
                    "fixAllYPosAfterPrepend"
                ]);
            });
        },

        _reinitRanges: function() {
            var init = {c1: null, c2: null};
            cnsRanges = {
                init: function(c1, c2) {
                    init.c1 = c1;
                    init.c2 = c2;
                }
            };

            var connections = new VgConnections();
            connections.reinitRanges();

            ok(init.c1 == "y1" && init.c2 == "y2", "reinitRanges ok");

            clearTestData();
        },

        _attachToRanges: function() {
            var attachCn = {cn: null, lastCnIndex: null, c1: null, c2: null};
            cnsRanges = {
                attachCn: function(cn, lastCnIndex, c1, c2) {
                    attachCn.cn = cn;
                    attachCn.lastCnIndex = lastCnIndex;
                    attachCn.c1 = c1;
                    attachCn.c2 = c2;
                }
            };
            connections = {get: function() {
                return [{guid: 2}, {guid: 3}];
            }};

            var cns = new VgConnections();
            cns.attachToRanges({guid: 2});

            ok(attachCn.cn.guid == 2 && attachCn.lastCnIndex == 1 &&
               attachCn.c1 == "y1" && attachCn.c2 == "y2",
               "attachCn ok");

            clearTestData();
        },

        _mapAllIntAndTopCns: function() {
            var map = {
                crs: null, c: null, c1: null, c2: null,
                rangeIndexGetter: null, rangeIndexGetter2: null,
                crIndexesGetter: null, nextFn: null
            };
            cnsRanges = {
                mapAllIntAndSideCns: function(crs, c, c1, c2, rig, rig2, crig, nextFn) {
                    map.crs = crs;
                    map.c = c;
                    map.c1 = c1;
                    map.c2 = c2;
                    map.rangeIndexGetter = rig;
                    map.rangeIndexGetter2 = rig2;
                    map.crIndexesGetter = crig;
                    map.nextFn = nextFn;
                },

                lastRngIndexFn: function() { return 1; },
                lowerCrCnIndexesFn: function() { return 2; },
                decFn: function() { return 3; }
            };

            var connections = new VgConnections();
            connections.mapAllIntAndTopCns([{guid: 1}, {guid: 2}]);

            ok(map.crs.length == 2 &&
               map.crs[0].guid == 1 &&
               map.crs[1].guid == 2 &&
               map.c == "y" &&
               map.c1 == "y1" &&
               map.c2 == "y2" &&
               map.rangeIndexGetter == 1 &&
               map.rangeIndexGetter2 == 1 &&
               map.crIndexesGetter == 2 &&
               map.nextFn == 3,
               "mapAllIntAndTopCns ok");

            clearTestData();
        },

        _mapAllIntAndBottomCns: function() {
            var map = {
                crs: null, c: null, c1: null, c2: null,
                rangeIndexGetter: null, rangeIndexGetter2: null,
                crIndexesGetter: null, nextFn: null
            };
            cnsRanges = {
                mapAllIntAndSideCns: function(crs, c, c1, c2, rig, rig2, crig, nextFn) {
                    map.crs = crs;
                    map.c = c;
                    map.c1 = c1;
                    map.c2 = c2;
                    map.rangeIndexGetter = rig;
                    map.rangeIndexGetter2 = rig2;
                    map.crIndexesGetter = crig;
                    map.nextFn = nextFn;
                },

                firstRngIndexFn: function() { return 1; },
                lastRngIndexFn: function() { return 2; },
                upperCrCnIndexesFn: function() { return 3; },
                incFn: function() { return 4; }
            };

            var connections = new VgConnections();
            connections.mapAllIntAndBottomCns([{guid: 1}, {guid: 2}]);

            ok(map.crs.length == 2 &&
                map.crs[0].guid == 1 &&
                map.crs[1].guid == 2 &&
                map.c == "y" &&
                map.c1 == "y1" &&
                map.c2 == "y2" &&
                map.rangeIndexGetter == 1 &&
                map.rangeIndexGetter2 == 2 &&
                map.crIndexesGetter == 3 &&
                map.nextFn == 4,
                "mapAllIntAndBottomCns ok");

            clearTestData();
        },

        _getAllIntXAndTBCns: function() {
            var map = {
                crC: null, c1: null, c2: null
            };
            cnsRanges = {
                getAllCnsFromIntRange: function(crC, c1, c2) {
                    map.crC = crC; map.c1 = c1; map.c2 = c2;
                    return true;
                },
                getAllCnsFromIntAndTLSideRgs: function(crC, c1, c2) {
                    map.crC = crC; map.c1 = c1; map.c2 = c2;
                    return true;
                },
                getAllCnsFromIntAndRBSideRgs: function(crC, c1, c2) {
                    map.crC = crC; map.c1 = c1; map.c2 = c2;
                    return true;
                }
            };

            var connections = new VgConnections();

            var result = connections.getAllIntXCns({guid: 1, x: 10, y: 20});
            ok(result && map.crC == 20 && map.c1 == "y1" && map.c2 == "y2", "getAllIntXCns ok");

            var result = connections.getAllIntXAndTopCns({guid: 1, x: 10, y: 20});
            ok(result && map.crC == 20 && map.c1 == "y1" && map.c2 == "y2", "getAllIntXAndTopCns ok");

            var result = connections.getAllIntXAndBottomCns({guid: 1, x: 10, y: 20});
            ok(result && map.crC == 20 && map.c1 == "y1" && map.c2 == "y2", "getAllIntXAndBottomCns ok");

            clearTestData();
        },

        _getLastRowYExpandedCns: function() {
            var called = false;
            cnsXYIntersector = {};
            cnsXYIntersector.getLastXYExpandedCns = function() { called = true; return true; };

            var connections = new VgConnections();
            var result = connections.getLastRowYExpandedCns();

            ok(result && called, "getLastRowYExpandedCns ok");

            clearTestData();
        },

        _yIntFns: function() {
            var data = {intCoords: null, c1: null, c2: null};
            cnsXYIntersector = {};
            cnsXYIntersector.isIntMoreThanOneCnXY = function(ic, c1, c2) {
                data.intCoords = ic; data.c1 = c1; data.c2 = c2;
                return true;
            };
            cnsXYIntersector.getMostBigFromAllXYIntCns = function(ic, c1, c2) {
                data.intCoords = ic; data.c1 = c1; data.c2 = c2;
                return true;
            };
            cnsXYIntersector.getAllXYIntCns = function(ic, c1, c2) {
                data.intCoords = ic; data.c1 = c1; data.c2 = c2;
                return true;
            };

            var connections = new VgConnections();

            var result = connections.isIntMoreThanOneCnY({id: 2});
            ok(result && data.intCoords.id == 2 && data.c1 == "y1" && data.c2 == "y2",
               "isIntMoreThanOneCnY ok");

            var result = connections.getMostTallFromAllYIntCns({id: 2});
            ok(result && data.intCoords.id == 2 && data.c1 == "y1" && data.c2 == "y2",
               "getMostTallFromAllYIntCns ok");

            var result = connections.getAllYIntCns({id: 2});
            ok(result && data.intCoords.id == 2 && data.c1 == "y1" && data.c2 == "y2",
               "getAllYIntCns ok");

            clearTestData();
        },

        _expandYAllRowCnsToMostTall: function() {
            var data = {intCoords: null, c1: null, c2: null, vOffset: null, height: null};

            cnsXYIntersector = {};
            cnsXYIntersector.expandXYAllCnsToMostBig = function(ic, c1, c2, vo, h) {
                data.intCoords = ic; data.c1 = c1; data.c2 = c2;
                data.vOffset = vo; data.height = h;
                return true;
            };

            var connections = new VgConnections();

            var result = connections.expandYAllRowCnsToMostTall({id: 2});
            ok(result && data.intCoords.id == 2 && data.c1 == "y1" && data.c2 == "y2" &&
               data.vOffset == "vOffset" && data.height == "Height",
               "expandYAllRowCnsToMostTall ok");

            clearTestData();
        },

        _crud: function() {
            var data = {item: null, cn: null, evName: null, evItem: null, evCn: null, evObj: null};
            cnsCore = {
                create: function(item, cn) {
                    data.item = item;
                    data.cn = cn;
                    return cn;
                }
            };
            ev = {
                emit: function(evName, item, cn, cnsObj) {
                    data.evName = evName;
                    data.evItem = item;
                    data.evCn = cn;
                    data.evObj = cnsObj;
                }
            };

            var connections = new VgConnections();
            connections.evObjId = 10;

            var cn = connections.add({itemId: 1}, {cnId: 1, item: {itemId: 1}});
            ok(cn.cnId == 1 && data.item.itemId == 1 && data.cn.cnId == 1 &&
               connections._cns.length == 1 && connections._cns[0].cnId == 1 &&
               data.evName == EV.REPOSITION && data.evItem.itemId == 1 && data.evCn.cnId == 1 &&
               data.evObj.evObjId == 10, "cn add ok");

            ok(connections.count() == 1, "cn count ok");
            ok(connections.get()[0].cnId == 1, "cn get ok");

            var cn2 = {cnId: 2, item: {itemId: 2}};
            var cn3 = {cnId: 3, item: {itemId: 3}};
            connections.restore([cn2, cn3]);
            ok(connections.get().length == 3 && connections.get()[2].cnId == 3, "cns restore ok");

            guid = {get: function(item) {
                return item.itemId;
            }};
            cnsCore = {};
            cnsCore.rm = function(cns, cn) {
                for(var i = 0; i < cns.length; i++) {
                    if(guid.get(cn.item) == guid.get(cns[i].item)) {
                        cns.splice(i, 1);
                        return;
                    }
                }
            }
            connections.rm(cn2);
            connections.rm(cn3);

            var cns = connections.get();
            ok(cns.length == 1 && cns[0].cnId == 1, "cns rm ok");

            clearTestData();
        },

        _restoreOnSortDispersionDefAppend: function() {
            cnsCore = {};
            cnsCore.restoreOnSortDispersion = function(cns, fn1, fn2) {
                fn1(cns, cns[cns.length - 1], function(cn, newX, newY) {
                    cn.x1 = newX; cn.x2 = newX; cn.y1 = newY; cn.y2 = newY;
                });
            };
            var sourceCns = [
                {x1: 30,  x2: 100, y1: 0, y2: 100},
                {x1: 50,  x2: 120, y1: 100, y2: 200},
                {x1: 100, x2: 140, y1: 200, y2: 300}
            ];

            var restored = false;
            var connections = new VgConnections();
            connections.restore = function(cns) { if(cns.length == 3) restored = true; };

            connections.restoreOnSortDispersion(sourceCns);
            ok(sourceCns[0].x1 == 141 && sourceCns[1].x1 == 142 && sourceCns[2].x1 == 143 &&
                sourceCns[0].x2 == 141 && sourceCns[1].x2 == 142 && sourceCns[2].x2 == 143 &&
                sourceCns[0].y1 == 200 && sourceCns[1].y1 == 200 && sourceCns[2].y1 == 200 &&
                sourceCns[0].y2 == 200 && sourceCns[1].y2 == 200 && sourceCns[2].y2 == 200 && restored,
                "restoreOnSortDispersion def app ok");

            clearTestData();
        },

        _restoreOnSortDispersionRevAppend: function() {
            cnsCore = {};
            cnsCore.restoreOnSortDispersion = function(cns, fn1, fn2) {
                fn2(cns, cns[cns.length - 1], function(cn, newX, newY) {
                    cn.x1 = newX; cn.x2 = newX; cn.y1 = newY; cn.y2 = newY;
                });
            };
            var sourceCns = [
                {x1: 30,  x2: 100, y1: 0, y2: 100},
                {x1: 50,  x2: 100, y1: 100, y2: 200},
                {x1: 100, x2: 100, y1: 200, y2: 300}
            ];

            var restored = false;
            var connections = new VgConnections();
            connections.restore = function(cns) { if(cns.length == 3) restored = true; };

            connections.restoreOnSortDispersion(sourceCns);
            ok(sourceCns[0].x1 == 99 && sourceCns[1].x1 == 98 && sourceCns[2].x1 == 97 &&
               sourceCns[0].x2 == 99 && sourceCns[1].x2 == 98 && sourceCns[2].x2 == 97 &&
               sourceCns[0].y1 == 200 && sourceCns[1].y1 == 200 && sourceCns[2].y1 == 200 &&
               sourceCns[0].y2 == 200 && sourceCns[1].y2 == 200 && sourceCns[2].y2 == 200 && restored,
               "restoreOnSortDispersion rev app ok");

            clearTestData();
        },

        _getAllAboveBelowY: function() {
            var data = {c: null, fn: null};
            cnsCore = {
                getAllBACoord: function(c, fn) {
                    data.c = c;
                    data.fn = fn;
                    return true;
                }
            };

            var connections = new VgConnections();

            var result = connections.getAllBelowY(100);
            ok(result && data.c == 100 && data.fn({y1: 100}, 10), "getAllBelowY ok");

            var result = connections.getAllAboveY(50);
            ok(result && data.c == 50 && data.fn({y2: 30}, 60), "getAllAboveY ok");

            clearTestData();
        },

        _fixAllYPosAfterPrepend: function() {
            var data = {newCn: null, cr: null, c: null, c1: null, c2: null};
            cnsCore = {};
            cnsCore.fixAllXYPosAfterPrepend = function(newCn, cr, c, c1, c2) {
                data.newCn = newCn; data.cr = cr;
                data.c = c; data.c1 = c1; data.c2 = c2;
                return true;
            };

            var connections = new VgConnections();

            var result = connections.fixAllYPosAfterPrepend({id: 2}, {id: 3});
            ok(result && data.newCn.id == 2 && data.cr.id == 3 && data.c == "y" &&
               data.c1 == "y1" && data.c2 == "y2", "fixAllYPosAfterPrepend ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});