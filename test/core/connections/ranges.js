$(document).ready(function() {
    module("CnsRanges");

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
                    "initVg",
                    "initHg",
                    "incAllByVg",
                    "incAllByHg",
                    "createPrependedVg",
                    "createPrependedHg",
                    "attachCnVg",
                    "attachCnHg",
                    "mapAllIntAndTopCns",
                    "mapAllIntAndBottomCns",
                    "mapAllIntAndLeftCns",
                    "mapAllIntAndRightCns",
                    "getAllIntXCns",
                    "getAllIntXAndTopCns",
                    "getAllIntXAndBottomCns",
                    "getAllIntYCns",
                    "getAllIntYAndLeftCns",
                    "getAllIntYAndRightCns"
                ]);
            });
        },

        _initVg: function() {
            ev = new EventEmitter();
            sourceSettings = {};
            settings = new Settings();
            connections = {get: function() {
                return [{id: 1}, {id: 2}];
            }};

            attachCnCalls = 0;
            attachCnIds = [];
            attachCnIndexes = [];
            attachC1 = null;
            attachC2 = null;

            var origAttachCn = CnsRanges.prototype.attachCn;
            CnsRanges.prototype.attachCn = function(cn, i, c1, c2) {
                attachCnIds.push(cn.id);
                attachCnIndexes.push(i);
                attachC1 = c1;
                attachC2 = c2;
                attachCnCalls++;
            };

            var cnsRanges = new CnsRanges();
            CnsRanges.prototype.attachCn = origAttachCn;

            ok(Dom.isArray(cnsRanges._ranges[0].cnIndexes) && cnsRanges._ranges[0].y1 == -1 &&
               cnsRanges._ranges[0].y2 == C.RANGE_SIZE - 1 && attachCnCalls == 2 &&
               attachCnIds[0] == 1 && attachCnIds[1] == 2 && attachCnIndexes[0] == 0 &&
               attachCnIndexes[1] == 1 && attachC1 == "y1" && attachC2 == "y2", "init vg ranges ok");

            clearTestData();
        },

        _initHg: function() {
            ev = new EventEmitter();
            sourceSettings = {grid: "horizontal"};
            settings = new Settings();
            connections = {get: function() {
                return [{id: 1}, {id: 2}];
            }};

            attachCnCalls = 0;
            attachCnIds = [];
            attachCnIndexes = [];
            attachC1 = null;
            attachC2 = null;

            var origAttachCn = CnsRanges.prototype.attachCn;
            CnsRanges.prototype.attachCn = function(cn, i, c1, c2) {
                attachCnIds.push(cn.id);
                attachCnIndexes.push(i);
                attachC1 = c1;
                attachC2 = c2;
                attachCnCalls++;
            };

            var cnsRanges = new CnsRanges();
            CnsRanges.prototype.attachCn = origAttachCn;

            ok(Dom.isArray(cnsRanges._ranges[0].cnIndexes) && cnsRanges._ranges[0].x1 == -1 &&
               cnsRanges._ranges[0].x2 == C.RANGE_SIZE - 1 && attachCnCalls == 2 &&
               attachCnIds[0] == 1 && attachCnIds[1] == 2 && attachCnIndexes[0] == 0 &&
               attachCnIndexes[1] == 1 && attachC1 == "x1" && attachC2 == "x2", "init hg ranges ok");

            clearTestData();
        },

        _incAllByVg: function() {
            ev = new EventEmitter();

            sourceSettings = {};
            settings = new Settings();

            connections = {get: function() {
                return [{y1: 0, y2: 100, id: 1}, {y1: 500, y2: 700, id: 2}];
            }};

            var cnsRanges = new CnsRanges();
            cnsRanges.attachCn(connections.get()[0], 0, "y1", "y2");
            cnsRanges.attachCn(connections.get()[1], 1, "y1", "y2");

            cnsRanges.incAllBy(100, "y1", "y2");
            ok(cnsRanges._ranges.length == 2 && cnsRanges._ranges[0].y1 == 99 &&
               cnsRanges._ranges[0].y2 == 99 + C.RANGE_SIZE && cnsRanges._ranges[1].y1 == 99 + C.RANGE_SIZE + 1 &&
               cnsRanges._ranges[1].y2 == 99 + C.RANGE_SIZE * 2, "incAllBy vg ok");

            clearTestData();
        },

        _incAllByHg: function() {
            ev = new EventEmitter();

            sourceSettings = {grid: "horizontal"};
            settings = new Settings();

            connections = {get: function() {
                return [{x1: 0, x2: 100, id: 1}, {x1: 500, x2: 700, id: 2}];
            }};

            var cnsRanges = new CnsRanges();
            cnsRanges.attachCn(connections.get()[0], 0, "x1", "x2");
            cnsRanges.attachCn(connections.get()[1], 1, "x1", "x2");

            cnsRanges.incAllBy(100, "x1", "x2");
            ok(cnsRanges._ranges.length == 2 && cnsRanges._ranges[0].x1 == 99 &&
               cnsRanges._ranges[0].x2 == 99 + C.RANGE_SIZE && cnsRanges._ranges[1].x1 == 99 + C.RANGE_SIZE + 1 &&
               cnsRanges._ranges[1].x2 == 99 + C.RANGE_SIZE * 2, "incAllBy hg ok");

            clearTestData();
        },

        _createPrependedVg: function() {
            ev = new EventEmitter();
            sourceSettings = {};
            settings = new Settings();

            var cnsRanges = new CnsRanges();
            cnsRanges.createPrepended(10, 100, "y1", "y2");
            ok(cnsRanges._ranges[0].y1 == -1 && cnsRanges._ranges[0].y2 == 100, "createPrepended vg ok");

            clearTestData();
        },

        _createPrependedHg: function() {
            ev = new EventEmitter();
            sourceSettings = {grid: "horizontal"};
            settings = new Settings();

            var cnsRanges = new CnsRanges();
            cnsRanges.createPrepended(10, 100, "x1", "x2");
            ok(cnsRanges._ranges[0].x1 == -1 && cnsRanges._ranges[0].x2 == 100, "createPrepended hg ok");

            clearTestData();
        },

        _attachCnVg: function(assert) {
            ev = new EventEmitter();
            sourceSettings = {};
            settings = new Settings();
            connections = {get: function() { return []; }};

            var cns = [
                {x1: 0, x2: 0, y1: 0, y2: 30},
                {x1: 0, x2: 0, y1: 100, y2: 100},
                {x1: 0, x2: 0, y1: 500, y2: 520},
                {x1: 0, x2: 0, y1: 1000, y2: 1050},
                {x1: 0, x2: 0, y1: 600, y2: 1100}
            ];

            var cnsRanges = new CnsRanges();
            cnsRanges.attachCn(cns[0], 0, "y1", "y2");
            cnsRanges.attachCn(cns[1], 1, "y1", "y2");
            cnsRanges.attachCn(cns[2], 2, "y1", "y2");
            cnsRanges.attachCn(cns[3], 3, "y1", "y2");
            cnsRanges.attachCn(cns[4], 4, "y1", "y2");

            ok(cnsRanges._ranges.length == 3 &&
               cnsRanges._ranges[0].y1 == -1 &&
               cnsRanges._ranges[0].y2 == C.RANGE_SIZE - 1 &&
               cnsRanges._ranges[0].cnIndexes.length == 2 &&
               cnsRanges._ranges[0].cnIndexes[0] == 0 &&
               cnsRanges._ranges[0].cnIndexes[1] == 1 &&
               cnsRanges._ranges[1].y1 == C.RANGE_SIZE &&
               cnsRanges._ranges[1].y2 == C.RANGE_SIZE + C.RANGE_SIZE - 1 &&
               cnsRanges._ranges[1].cnIndexes.length == 2 &&
               cnsRanges._ranges[1].cnIndexes[0] == 2 &&
               cnsRanges._ranges[1].cnIndexes[1] == 4 &&
               cnsRanges._ranges[2].y1 == C.RANGE_SIZE * 2 &&
               cnsRanges._ranges[2].y2 == C.RANGE_SIZE * 2 + C.RANGE_SIZE - 1 &&
               cnsRanges._ranges[2].cnIndexes.length == 2 &&
               cnsRanges._ranges[2].cnIndexes[0] == 3 &&
               cnsRanges._ranges[2].cnIndexes[1] == 4,
               "attach cns on vg ok");

            clearTestData();
        },

        _attachCnHg: function() {
            ev = new EventEmitter();
            sourceSettings = {grid: "horizontal"};
            settings = new Settings();
            connections = {get: function() { return []; }};

            var cns = [
                {y1: 0, y2: 0, x1: 0, x2: 30},
                {y1: 0, y2: 0, x1: 100, x2: 100},
                {y1: 0, y2: 0, x1: 500, x2: 520},
                {y1: 0, y2: 0, x1: 1000, x2: 1050},
                {y1: 0, y2: 0, x1: 600, x2: 1100}
            ];

            var cnsRanges = new CnsRanges();
            cnsRanges.attachCn(cns[0], 0, "x1", "x2");
            cnsRanges.attachCn(cns[1], 1, "x1", "x2");
            cnsRanges.attachCn(cns[2], 2, "x1", "x2");
            cnsRanges.attachCn(cns[3], 3, "x1", "x2");
            cnsRanges.attachCn(cns[4], 4, "x1", "x2");

            ok(cnsRanges._ranges.length == 3 &&
                cnsRanges._ranges[0].x1 == -1 &&
                cnsRanges._ranges[0].x2 == C.RANGE_SIZE - 1 &&
                cnsRanges._ranges[0].cnIndexes.length == 2 &&
                cnsRanges._ranges[0].cnIndexes[0] == 0 &&
                cnsRanges._ranges[0].cnIndexes[1] == 1 &&
                cnsRanges._ranges[1].x1 == C.RANGE_SIZE &&
                cnsRanges._ranges[1].x2 == C.RANGE_SIZE + C.RANGE_SIZE - 1 &&
                cnsRanges._ranges[1].cnIndexes.length == 2 &&
                cnsRanges._ranges[1].cnIndexes[0] == 2 &&
                cnsRanges._ranges[1].cnIndexes[1] == 4 &&
                cnsRanges._ranges[2].x1 == C.RANGE_SIZE * 2 &&
                cnsRanges._ranges[2].x2 == C.RANGE_SIZE * 2 + C.RANGE_SIZE - 1 &&
                cnsRanges._ranges[2].cnIndexes.length == 2 &&
                cnsRanges._ranges[2].cnIndexes[0] == 3 &&
                cnsRanges._ranges[2].cnIndexes[1] == 4,
                "attach cns on hg ok");

            clearTestData();
        },

        _mapAllIntAndTopCns: function() {
            ev = new EventEmitter();
            sourceSettings = {};
            settings = new Settings();
            connections = {get: function() { return []; }};

            var cns = [
                {x1: 0, x2: 100, y1: 0, y2: 30},
                {x1: 0, x2: 100, y1: 100, y2: 100},
                {x1: 0, x2: 100, y1: 500, y2: 520},
                {x1: 0, x2: 100, y1: 1000, y2: 1050},
                {x1: 0, x2: 100, y1: 600, y2: 1100}
            ];

            var cnsRanges = new CnsRanges();
            cnsRanges.attachCn(cns[0], 0, "y1", "y2");
            cnsRanges.attachCn(cns[1], 1, "y1", "y2");
            cnsRanges.attachCn(cns[2], 2, "y1", "y2");
            cnsRanges.attachCn(cns[3], 3, "y1", "y2");
            cnsRanges.attachCn(cns[4], 4, "y1", "y2");
            // ranges[0].cnIndexes = [0, 1] {-1, 499}
            // ranges[1].cnIndexes = [2, 4] {500, 999}
            // ranges[2].cnIndexes = [3, 4] {1000, 1499}

            var sortedCrs = [
                {x: 10, y: 520, itemGUID: 1},
                {x: 10, y: 420, itemGUID: 2},
                {x: 10, y: 1500, itemGUID: 3}
            ];

            var cr = cnsRanges;
            var mappedCrs = cnsRanges.mapAllIntAndSideCns(
                sortedCrs, "y", "y1", "y2", cr.lastRngIndexFn(), cr.lastRngIndexFn(), cr.lowerCrCnIndexesFn(), cr.decFn()
            );
            ok(
                mappedCrs[0].cnIndexes.length == 2 &&
                mappedCrs[0].cnIndexes[0][0] == 2 &&
                mappedCrs[0].cnIndexes[0][1] == 4 &&
                mappedCrs[0].cnIndexes[1][0] == 0 &&
                mappedCrs[0].cnIndexes[1][1] == 1 &&
                mappedCrs[1].cnIndexes[0][0] == 0 &&
                mappedCrs[1].cnIndexes[0][1] == 1 &&
                mappedCrs[2].cnIndexes[0][0] == 3 &&
                mappedCrs[2].cnIndexes[0][1] == 4 &&
                mappedCrs[2].cnIndexes[1][0] == 2 &&
                mappedCrs[2].cnIndexes[1][1] == 4 &&
                mappedCrs[2].cnIndexes[2][0] == 0 &&
                mappedCrs[2].cnIndexes[2][1] == 1,
                "mapAllIntAndTopCns ok"
            );

            clearTestData();
        },

        _mapAllIntAndBottomCns: function() {
            ev = new EventEmitter();
            sourceSettings = {};
            settings = new Settings();
            connections = {get: function() { return []; }};

            var cns = [
                {x1: 0, x2: 100, y1: 0, y2: 30},
                {x1: 0, x2: 100, y1: 100, y2: 100},
                {x1: 0, x2: 100, y1: 500, y2: 520},
                {x1: 0, x2: 100, y1: 1000, y2: 1050},
                {x1: 0, x2: 100, y1: 600, y2: 1100}
            ];

            var cnsRanges = new CnsRanges();
            cnsRanges.attachCn(cns[0], 0, "y1", "y2");
            cnsRanges.attachCn(cns[1], 1, "y1", "y2");
            cnsRanges.attachCn(cns[2], 2, "y1", "y2");
            cnsRanges.attachCn(cns[3], 3, "y1", "y2");
            cnsRanges.attachCn(cns[4], 4, "y1", "y2");
            // ranges[0].cnIndexes = [0, 1] {-1, 499}
            // ranges[1].cnIndexes = [2, 4] {500, 999}
            // ranges[2].cnIndexes = [3, 4] {1000, 1499}

            var sortedCrs = [
                {x: 10, y: 520, itemGUID: 1},
                {x: 10, y: 420, itemGUID: 2},
                {x: 10, y: 1500, itemGUID: 3}
            ];

            var cr = cnsRanges;
            var mappedCrs = cnsRanges.mapAllIntAndSideCns(
                sortedCrs, "y", "y1", "y2", cr.firstRngIndexFn(), cr.lastRngIndexFn(), cr.upperCrCnIndexesFn(), cr.incFn()
            );
            ok(
                mappedCrs[0].cnIndexes.length == 2 &&
                mappedCrs[0].cnIndexes[0][0] == 2 &&
                mappedCrs[0].cnIndexes[0][1] == 4 &&
                mappedCrs[0].cnIndexes[1][0] == 3 &&
                mappedCrs[0].cnIndexes[1][1] == 4 &&
                mappedCrs[1].cnIndexes[0][0] == 0 &&
                mappedCrs[1].cnIndexes[0][1] == 1 &&
                mappedCrs[1].cnIndexes[1][0] == 2 &&
                mappedCrs[1].cnIndexes[1][1] == 4 &&
                mappedCrs[1].cnIndexes[2][0] == 3 &&
                mappedCrs[1].cnIndexes[2][1] == 4 &&
                mappedCrs[2].cnIndexes[0][0] == 0 &&
                mappedCrs[2].cnIndexes[0][1] == 1 &&
                mappedCrs[2].cnIndexes[1][0] == 2 &&
                mappedCrs[2].cnIndexes[1][1] == 4 &&
                mappedCrs[2].cnIndexes[2][0] == 3 &&
                mappedCrs[2].cnIndexes[2][1] == 4,
                "mapAllIntAndBottomCns ok"
            );

            clearTestData();
        },

        _mapAllIntAndLeftCns: function() {
            ev = new EventEmitter();
            sourceSettings = {grid: "horizontal"};
            settings = new Settings();
            connections = {get: function() { return []; }};

            var cns = [
                {y1: 0, y2: 100, x1: 0,    x2: 30},
                {y1: 0, y2: 100, x1: 100,  x2: 100},
                {y1: 0, y2: 100, x1: 500,  x2: 520},
                {y1: 0, y2: 100, x1: 1000, x2: 1050},
                {y1: 0, y2: 100, x1: 600,  x2: 1100}
            ];

            var cnsRanges = new CnsRanges();
            cnsRanges.attachCn(cns[0], 0, "x1", "x2");
            cnsRanges.attachCn(cns[1], 1, "x1", "x2");
            cnsRanges.attachCn(cns[2], 2, "x1", "x2");
            cnsRanges.attachCn(cns[3], 3, "x1", "x2");
            cnsRanges.attachCn(cns[4], 4, "x1", "x2");
            // ranges[0].cnIndexes = [0, 1] {-1, 499}
            // ranges[1].cnIndexes = [2, 4] {500, 999}
            // ranges[2].cnIndexes = [3, 4] {1000, 1499}

            var sortedCrs = [
                {y: 10, x: 520, itemGUID: 1},
                {y: 10, x: 420, itemGUID: 2},
                {y: 10, x: 1500, itemGUID: 3}
            ];

            var cr = cnsRanges;
            var mappedCrs = cnsRanges.mapAllIntAndSideCns(
                sortedCrs, "x", "x1", "x2", cr.lastRngIndexFn(), cr.lastRngIndexFn(), cr.lowerCrCnIndexesFn(), cr.decFn()
            );
            ok(
                mappedCrs[0].cnIndexes.length == 2 &&
                mappedCrs[0].cnIndexes[0][0] == 2 &&
                mappedCrs[0].cnIndexes[0][1] == 4 &&
                mappedCrs[0].cnIndexes[1][0] == 0 &&
                mappedCrs[0].cnIndexes[1][1] == 1 &&
                mappedCrs[1].cnIndexes[0][0] == 0 &&
                mappedCrs[1].cnIndexes[0][1] == 1 &&
                mappedCrs[2].cnIndexes[0][0] == 3 &&
                mappedCrs[2].cnIndexes[0][1] == 4 &&
                mappedCrs[2].cnIndexes[1][0] == 2 &&
                mappedCrs[2].cnIndexes[1][1] == 4 &&
                mappedCrs[2].cnIndexes[2][0] == 0 &&
                mappedCrs[2].cnIndexes[2][1] == 1,
                "mapAllIntAndLeftCns ok"
            );

            clearTestData();
        },

        _mapAllIntAndRightCns: function() {
            ev = new EventEmitter();
            sourceSettings = {grid: "horizontal"};
            settings = new Settings();
            connections = {get: function() { return []; }};

            var cns = [
                {y1: 0, y2: 100, x1: 0,    x2: 30},
                {y1: 0, y2: 100, x1: 100,  x2: 100},
                {y1: 0, y2: 100, x1: 500,  x2: 520},
                {y1: 0, y2: 100, x1: 1000, x2: 1050},
                {y1: 0, y2: 100, x1: 600,  x2: 1100}
            ];

            var cnsRanges = new CnsRanges();
            cnsRanges.attachCn(cns[0], 0, "x1", "x2");
            cnsRanges.attachCn(cns[1], 1, "x1", "x2");
            cnsRanges.attachCn(cns[2], 2, "x1", "x2");
            cnsRanges.attachCn(cns[3], 3, "x1", "x2");
            cnsRanges.attachCn(cns[4], 4, "x1", "x2");
            // ranges[0].cnIndexes = [0, 1] {-1, 499}
            // ranges[1].cnIndexes = [2, 4] {500, 999}
            // ranges[2].cnIndexes = [3, 4] {1000, 1499}

            var sortedCrs = [
                {y: 10, x: 520, itemGUID: 1},
                {y: 10, x: 420, itemGUID: 2},
                {y: 10, x: 1500, itemGUID: 3}
            ];

            var cr = cnsRanges;
            var mappedCrs = cnsRanges.mapAllIntAndSideCns(
                sortedCrs, "x", "x1", "x2", cr.firstRngIndexFn(), cr.lastRngIndexFn(), cr.upperCrCnIndexesFn(), cr.incFn()
            );
            ok(
                mappedCrs[0].cnIndexes.length == 2 &&
                mappedCrs[0].cnIndexes[0][0] == 2 &&
                mappedCrs[0].cnIndexes[0][1] == 4 &&
                mappedCrs[0].cnIndexes[1][0] == 3 &&
                mappedCrs[0].cnIndexes[1][1] == 4 &&
                mappedCrs[1].cnIndexes[0][0] == 0 &&
                mappedCrs[1].cnIndexes[0][1] == 1 &&
                mappedCrs[1].cnIndexes[1][0] == 2 &&
                mappedCrs[1].cnIndexes[1][1] == 4 &&
                mappedCrs[1].cnIndexes[2][0] == 3 &&
                mappedCrs[1].cnIndexes[2][1] == 4 &&
                mappedCrs[2].cnIndexes[0][0] == 0 &&
                mappedCrs[2].cnIndexes[0][1] == 1 &&
                mappedCrs[2].cnIndexes[1][0] == 2 &&
                mappedCrs[2].cnIndexes[1][1] == 4 &&
                mappedCrs[2].cnIndexes[2][0] == 3 &&
                mappedCrs[2].cnIndexes[2][1] == 4,
                "mapAllIntAndRightCns ok"
            );

            clearTestData();
        },

        _getAllIntXCns: function() {
            ev = new EventEmitter();
            sourceSettings = {};
            settings = new Settings();
            connections = {get: function() { return []; }};

            var cns = [
                {x1: 0, x2: 100, y1: 0, y2: 30},
                {x1: 0, x2: 100, y1: 100, y2: 100},
                {x1: 0, x2: 100, y1: 500, y2: 520},
                {x1: 0, x2: 100, y1: 1000, y2: 1050},
                {x1: 0, x2: 100, y1: 600, y2: 1100}
            ];

            var cnsRanges = new CnsRanges();
            cnsRanges.attachCn(cns[0], 0, "y1", "y2");
            cnsRanges.attachCn(cns[1], 1, "y1", "y2");
            cnsRanges.attachCn(cns[2], 2, "y1", "y2");
            cnsRanges.attachCn(cns[3], 3, "y1", "y2");
            cnsRanges.attachCn(cns[4], 4, "y1", "y2");
            // ranges[0].cnIndexes = [0, 1] {-1, 499}
            // ranges[1].cnIndexes = [2, 4] {500, 999}
            // ranges[2].cnIndexes = [3, 4] {1000, 1499}

            var cnIndexes = cnsRanges.getAllCnsFromIntRange(520, "y1", "y2");
            ok(cnIndexes.length == 2 && cnIndexes[0] == 2 && cnIndexes[1] == 4, "getAllIntXCns ok");

            cnIndexes = cnsRanges.getAllCnsFromIntRange(1800, "y1", "y2");
            ok(cnIndexes.length == 5 && cnIndexes[0] == 0 && cnIndexes[1] == 1 &&
               cnIndexes[2] == 2 && cnIndexes[3] == 4 && cnIndexes[4] == 3,
               "getAllIntXCns out of range ok");

            clearTestData();
        },

        _getAllIntXAndTopCns: function() {
            ev = new EventEmitter();
            sourceSettings = {};
            settings = new Settings();
            connections = {get: function() { return []; }};

            var cns = [
                {x1: 0, x2: 100, y1: 0, y2: 30},
                {x1: 0, x2: 100, y1: 100, y2: 100},
                {x1: 0, x2: 100, y1: 500, y2: 520},
                {x1: 0, x2: 100, y1: 1000, y2: 1050},
                {x1: 0, x2: 100, y1: 600, y2: 1100}
            ];

            var cnsRanges = new CnsRanges();
            cnsRanges.attachCn(cns[0], 0, "y1", "y2");
            cnsRanges.attachCn(cns[1], 1, "y1", "y2");
            cnsRanges.attachCn(cns[2], 2, "y1", "y2");
            cnsRanges.attachCn(cns[3], 3, "y1", "y2");
            cnsRanges.attachCn(cns[4], 4, "y1", "y2");
            // ranges[0].cnIndexes = [0, 1] {-1, 499}
            // ranges[1].cnIndexes = [2, 4] {500, 999}
            // ranges[2].cnIndexes = [3, 4] {1000, 1499}

            var cnIndexes = cnsRanges.getAllCnsFromIntAndTLSideRgs(520, "y1", "y2");
            ok(cnIndexes.length == 2 && cnIndexes[0][0] == 2 && cnIndexes[0][1] == 4 &&
               cnIndexes[1][0] == 0 && cnIndexes[1][1] == 1,
               "getAllIntXAndTopCns ok");

            cnIndexes = cnsRanges.getAllCnsFromIntAndTLSideRgs(1800, "y1", "y2");
            ok(cnIndexes.length == 3 && cnIndexes[0][0] == 3 && cnIndexes[1][0] == 2 &&
               cnIndexes[2][0] == 0 && cnIndexes[2][1] == 1,
               "getAllIntXAndTopCns out of range ok");

            clearTestData();
        },

        _getAllIntXAndBottomCns: function() {
            ev = new EventEmitter();
            sourceSettings = {};
            settings = new Settings();
            connections = {get: function() { return []; }};

            var cns = [
                {x1: 0, x2: 100, y1: 0,    y2: 30},
                {x1: 0, x2: 100, y1: 100,  y2: 100},
                {x1: 0, x2: 100, y1: 500,  y2: 520},
                {x1: 0, x2: 100, y1: 1000, y2: 1050},
                {x1: 0, x2: 100, y1: 600,  y2: 1100}
            ];

            var cnsRanges = new CnsRanges();
            cnsRanges.attachCn(cns[0], 0, "y1", "y2");
            cnsRanges.attachCn(cns[1], 1, "y1", "y2");
            cnsRanges.attachCn(cns[2], 2, "y1", "y2");
            cnsRanges.attachCn(cns[3], 3, "y1", "y2");
            cnsRanges.attachCn(cns[4], 4, "y1", "y2");
            // ranges[0].cnIndexes = [0, 1] {-1, 499}
            // ranges[1].cnIndexes = [2, 4] {500, 999}
            // ranges[2].cnIndexes = [3, 4] {1000, 1499}

            var cnIndexes = cnsRanges.getAllCnsFromIntAndRBSideRgs(520, "y1", "y2");
            ok(cnIndexes.length == 2 && cnIndexes[0][0] == 2 && cnIndexes[0][1] == 4 &&
                cnIndexes[1][0] == 3 && cnIndexes[1][1] == 4,
                "getAllIntXAndBottomCns ok");

            cnIndexes = cnsRanges.getAllCnsFromIntAndRBSideRgs(1800, "y1", "y2");
            ok(cnIndexes.length == 3 && cnIndexes[2][0] == 3 && cnIndexes[1][0] == 2 &&
                cnIndexes[0][0] == 0 && cnIndexes[0][1] == 1,
                "getAllIntXAndBottomCns out of range ok");

            clearTestData();
        },

        _getAllIntYCns: function() {
            ev = new EventEmitter();
            sourceSettings = {grid: "horizontal"};
            settings = new Settings();
            connections = {get: function() { return []; }};

            var cns = [
                {y1: 0, y2: 100, x1: 0,    x2: 30},
                {y1: 0, y2: 100, x1: 100,  x2: 100},
                {y1: 0, y2: 100, x1: 500,  x2: 520},
                {y1: 0, y2: 100, x1: 1000, x2: 1050},
                {y1: 0, y2: 100, x1: 600,  x2: 1100}
            ];

            var cnsRanges = new CnsRanges();
            cnsRanges.attachCn(cns[0], 0, "x1", "x2");
            cnsRanges.attachCn(cns[1], 1, "x1", "x2");
            cnsRanges.attachCn(cns[2], 2, "x1", "x2");
            cnsRanges.attachCn(cns[3], 3, "x1", "x2");
            cnsRanges.attachCn(cns[4], 4, "x1", "x2");
            // ranges[0].cnIndexes = [0, 1] {-1, 499}
            // ranges[1].cnIndexes = [2, 4] {500, 999}
            // ranges[2].cnIndexes = [3, 4] {1000, 1499}

            var cnIndexes = cnsRanges.getAllCnsFromIntRange(520, "x1", "x2");
            ok(cnIndexes.length == 2 && cnIndexes[0] == 2 && cnIndexes[1] == 4, "getAllIntYCns ok");

            cnIndexes = cnsRanges.getAllCnsFromIntRange(1800, "x1", "x2");
            ok(cnIndexes.length == 5 && cnIndexes[0] == 0 && cnIndexes[1] == 1 &&
               cnIndexes[2] == 2 && cnIndexes[3] == 4 && cnIndexes[4] == 3,
               "getAllIntYCns out of range ok");

            clearTestData();
        },

        _getAllIntYAndLeftCns: function() {
            ev = new EventEmitter();
            sourceSettings = {grid: "horizontal"};
            settings = new Settings();
            connections = {get: function() { return []; }};

            var cns = [
                {y1: 0, y2: 100, x1: 0,    x2: 30},
                {y1: 0, y2: 100, x1: 100,  x2: 100},
                {y1: 0, y2: 100, x1: 500,  x2: 520},
                {y1: 0, y2: 100, x1: 1000, x2: 1050},
                {y1: 0, y2: 100, x1: 600,  x2: 1100}
            ];

            var cnsRanges = new CnsRanges();
            cnsRanges.attachCn(cns[0], 0, "x1", "x2");
            cnsRanges.attachCn(cns[1], 1, "x1", "x2");
            cnsRanges.attachCn(cns[2], 2, "x1", "x2");
            cnsRanges.attachCn(cns[3], 3, "x1", "x2");
            cnsRanges.attachCn(cns[4], 4, "x1", "x2");
            // ranges[0].cnIndexes = [0, 1] {-1, 499}
            // ranges[1].cnIndexes = [2, 4] {500, 999}
            // ranges[2].cnIndexes = [3, 4] {1000, 1499}

            var cnIndexes = cnsRanges.getAllCnsFromIntAndTLSideRgs(520, "x1", "x2");
            ok(cnIndexes.length == 2 && cnIndexes[0][0] == 2 && cnIndexes[0][1] == 4 &&
                cnIndexes[1][0] == 0 && cnIndexes[1][1] == 1,
                "getAllIntYAndLeftCns ok");

            cnIndexes = cnsRanges.getAllCnsFromIntAndTLSideRgs(1800, "x1", "x2");
            ok(cnIndexes.length == 3 && cnIndexes[0][0] == 3 && cnIndexes[1][0] == 2 &&
                cnIndexes[2][0] == 0 && cnIndexes[2][1] == 1,
                "getAllIntYAndLeftCns out of range ok");

            clearTestData();
        },

        _getAllIntYAndRightCns: function() {
            ev = new EventEmitter();
            sourceSettings = {grid: "horizontal"};
            settings = new Settings();
            connections = {get: function() { return []; }};

            var cns = [
                {y1: 0, y2: 100, x1: 0,    x2: 30},
                {y1: 0, y2: 100, x1: 100,  x2: 100},
                {y1: 0, y2: 100, x1: 500,  x2: 520},
                {y1: 0, y2: 100, x1: 1000, x2: 1050},
                {y1: 0, y2: 100, x1: 600,  x2: 1100}
            ];

            var cnsRanges = new CnsRanges();
            cnsRanges.attachCn(cns[0], 0, "x1", "x2");
            cnsRanges.attachCn(cns[1], 1, "x1", "x2");
            cnsRanges.attachCn(cns[2], 2, "x1", "x2");
            cnsRanges.attachCn(cns[3], 3, "x1", "x2");
            cnsRanges.attachCn(cns[4], 4, "x1", "x2");
            // ranges[0].cnIndexes = [0, 1] {-1, 499}
            // ranges[1].cnIndexes = [2, 4] {500, 999}
            // ranges[2].cnIndexes = [3, 4] {1000, 1499}

            var cnIndexes = cnsRanges.getAllCnsFromIntAndRBSideRgs(520, "x1", "x2");
            ok(cnIndexes.length == 2 && cnIndexes[0][0] == 2 && cnIndexes[0][1] == 4 &&
                cnIndexes[1][0] == 3 && cnIndexes[1][1] == 4,
                "getAllIntYAndRightCns ok");

            cnIndexes = cnsRanges.getAllCnsFromIntAndRBSideRgs(1800, "x1", "x2");
            ok(cnIndexes.length == 3 && cnIndexes[2][0] == 3 && cnIndexes[1][0] == 2 &&
                cnIndexes[0][0] == 0 && cnIndexes[0][1] == 1,
                "getAllIntYAndRightCns out of range ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});