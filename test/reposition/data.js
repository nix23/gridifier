$(document).ready(function() {
    module("RepositionData");

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
                    "get",
                    "getOnDisabledIntersections",
                    "getOnEnabledSd",
                    "getSdCond",
                    "getForRepositionAll",
                    "findCns",
                    "findFirstSortedCnToRps"
                ]);
            });
        },

        _get: function() {
            ev = new EventEmitter();
            settings = new Settings();
            cnsSorter = {
                sortForReappend: function(cns) {
                    return cns;
                }
            }

            var cns = [
                {item: 2, itemGUID: 2},
                {item: 4, itemGUID: 4, restrictCollect: true},
                {item: 5, itemGUID: 5},
                {item: 6, itemGUID: 6}
            ];
            connections = {
                get: function() {
                    return cns;
                }
            };

            var repositionData = new RepositionData();
            var data = repositionData.get([], {itemGUID: 3});

            ok(
                cns.length == 2 &&
                data.items.length == 2 &&
                data.items[0] == 5 &&
                data.items[1] == 6 &&
                data.cns[0].itemGUID == 5 &&
                data.cns[1].itemGUID == 6 &&
                data.firstCn.itemGUID == 5,
                "get on disabled SD and enabled intersections ok"
            );

            clearTestData();
        },

        _getOnDisabledIntersections: function() {
            ev = new EventEmitter();
            sourceSettings = {intersections: false};
            settings = new Settings();
            cnsSorter = {
                sortForReappend: function(cns) {
                    return cns;
                }
            }

            var cns = [
                {item: 2, guid: 2, y2: 10, x2: 10},
                {item: 4, guid: 4, y2: 20, x2: 20, restrictCollect: true},
                {item: 5, guid: 5, y2: 30, x2: 30},
                {item: 6, guid: 6, y2: 40, x2: 40}
            ];
            connections = {
                get: function() {
                    return cns;
                }
            };

            var repositionData = new RepositionData();
            var data = repositionData.get([], {y1: 15});

            ok(
                cns.length == 2 &&
                data.items.length == 2 &&
                data.items[0] == 5 &&
                data.items[1] == 6 &&
                data.cns[0].guid == 5 &&
                data.cns[1].guid == 6 &&
                data.firstCn.guid == 5,
                "get on disabled SD and disabled intersections VG ok"
            );

            cns = [
                {item: 2, guid: 2, y2: 10, x2: 10},
                {item: 4, guid: 4, y2: 20, x2: 20, restrictCollect: true},
                {item: 5, guid: 5, y2: 30, x2: 30},
                {item: 6, guid: 6, y2: 40, x2: 40}
            ];
            sourceSettings = {intersections: false, grid: "horizontal"};
            settings = new Settings();
            data = repositionData.get([], {x1: 15});

            ok(
                cns.length == 2 &&
                data.items.length == 2 &&
                data.items[0] == 5 &&
                data.items[1] == 6 &&
                data.cns[0].guid == 5 &&
                data.cns[1].guid == 6 &&
                data.firstCn.guid == 5,
                "get on disabled SD and disabled intersections HG ok"
            );

            clearTestData();
        },

        _getOnEnabledSd: function() {
            ev = new EventEmitter();
            sourceSettings = {sortDispersion: true};
            settings = new Settings();
            cnsSorter = {
                sortForReappend: function(cns) {
                    return cns;
                }
            }

            var cns = [
                {item: 2, guid: 2, y2: 10, x2: 10},
                {item: 4, guid: 4, y2: 20, x2: 20, restrictCollect: true},
                {item: 5, guid: 5, y2: 30, x2: 30},
                {item: 6, guid: 6, y2: 40, x2: 40}
            ];
            connections = {
                get: function() {
                    return cns;
                }
            };

            var repositionData = new RepositionData();
            repositionData._getSDCond = function(cn, argCn) {
                return cn.guid == argCn.guid;
            };
            var data = repositionData.get([{item: 8, guid: 8}], {guid: 5});

            ok(
                cns.length == 3 &&
                data.items.length == 2 &&
                data.items[0] == 8 &&
                data.items[1] == 5 &&
                data.cns[0].guid == 8 &&
                data.cns[1].guid == 5 &&
                data.firstCn.guid == 8,
                "get on enabled SD ok"
            );

            clearTestData();
        },

        _getSdCond: function() {
            ev = new EventEmitter();
            settings = new Settings();

            var repositionData = new RepositionData();
            cond = repositionData._getSDCond(
                {y1: 10, x1: 20}, {y1: 10, x1: 10}
            );
            ok(cond, "getSdCond VG def append ok");

            sourceSettings = {append: "reversed"};
            settings = new Settings();
            var cond = repositionData._getSDCond(
                {y1: 10, x1: 15}, {y1: 10, x2: 30}
            );
            ok(cond, "getSdCond VG rev append ok");

            sourceSettings = {grid: "horizontal"};
            settings = new Settings();
            cond = repositionData._getSDCond(
                {x1: 10, y1: 10}, {x1: 10, y1: 10}
            );
            ok(cond, "getSdCond HG def append ok");

            sourceSettings = {grid: "horizontal", append: "reversed"};
            settings = new Settings();
            cond = repositionData._getSDCond(
                {x1: 10, y1: 10}, {x1: 10, y2: 20}
            );
            ok(cond, "getSdCond HG rev append ok");

            clearTestData();
        },

        _getForRepositionAll: function() {
            var repositionData = new RepositionData();
            repositionData._findCns = function(origCns, items, cnsToKeep, cnsToRps) {
                items.push({id: "item"});
                cnsToKeep.push(origCns[0]);
                cnsToRps.push({id: "cnToRps"});
            };
            repositionData._findFirstCnToRps = function(cns, cnsToKeep) {
                if(cns.length != 2) return;
                return cnsToKeep[0];
            };

            var data = repositionData.getForRepositionAll([
                {id: "cn1"}, {id: "cn3"}
            ]);
            ok(data.items.length == 1 &&
               data.items[0].id == "item" &&
               data.cns.length == 1 &&
               data.cns[0].id == "cnToRps" &&
               data.firstCn.id == "cn1",
               "getForRepositionAllOk");

            clearTestData();
        },

        _findCns: function() {
            var repositionData = new RepositionData();

            var cns = [{id: 1, item: 1, restrictCollect: true},
                       {id: 2, item: 2, restrictCollect: false},
                       {id: 3, item: 3, restrictCollect: false}];
            var itemsToRps = [];
            var cnsToKeep = [];
            var cnsToRps = [];

            repositionData._findCns(cns, itemsToRps, cnsToKeep, cnsToRps);
            ok(
                cns.length == 3 &&
                itemsToRps.length == 2 &&
                itemsToRps[0] == 2 &&
                itemsToRps[1] == 3 &&
                cnsToRps.length == 2 &&
                cnsToRps[0].id == 2 &&
                cnsToRps[1].id == 3 &&
                cnsToKeep.length == 1 &&
                cnsToKeep[0].id == 1,
                "findCns ok"
            );

            clearTestData();
        },

        _findFirstSortedCnToRps: function() {
            var repositionData = new RepositionData();

            var cns = [{id: 1}, {id: 2}];
            var first = repositionData._findFirstCnToRps(cns, []);
            ok(first.id == 1 && cns.length == 0, "findFirstSortedCnToRps ok");

            cns = [{itemGUID: 1}, {itemGUID: 2}, {itemGUID: 3}, {itemGUID: 4}];
            first = repositionData._findFirstCnToRps(cns, [{itemGUID: 1}, {itemGUID: 3}]);

            ok(
                first.itemGUID == 2 &&
                cns.length == 2 &&
                cns[0].itemGUID == 1 &&
                cns[1].itemGUID == 3,
                "findFirstSortedCnToRps with cns to keep ok"
            );

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});