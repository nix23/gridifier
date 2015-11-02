$(document).ready(function() {
    module("CrsCleaner");

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
                    "cleanerType",
                    "rmIntFromTop",
                    "rmIntFromBottom",
                    "rmIntFromLeft",
                    "rmIntFromRight",
                    "rmAllTooBottomFromMostTop",
                    "rmAllTooTopFromMostBottom",
                    "rmAllTooRightFromMostLeft",
                    "rmAllTooLeftFromMostRight"
                ]);
            });
        },

        _cleanerType: function() {
            ev = new EventEmitter();
            settings = new Settings();

            var crsCleaner = new CrsCleaner();
            ok(!crsCleaner._isInsideCleaner(), "not inside cleaner ok");

            sourceSettings = {sortDispersion: true};
            settings = new Settings();

            crsCleaner = new CrsCleaner();
            ok(crsCleaner._isInsideCleaner(), "is inside cleaner ok");

            clearTestData();
        },

        _rmIntFromTop: function() {
            var scrs = [
                {x: 0,   y: 99, itemGUID: 1, side: CRS.TOP.LEFT, type: CRS.APPEND.DEF},
                {x: 100, y: 99, itemGUID: 2, side: CRS.TOP.LEFT, type: CRS.PREPEND.DEF},
                {x: 0,   y: 0,  itemGUID: 4, side: CRS.TOP.LEFT, type: CRS.APPEND.DEF}
            ];
            var cns = [
                {x1: 0.90, x2: 99, y1: 100, y2: 199, itemGUID: 1},
                {x1: 100, x2: 199, y1: 100, y2: 199, itemGUID: 2},
                {x1: 100.9, x2: 199, y1: 50, y2: 98.2, itemGUID: 3},
                {x1: 0, x2: 199, y1: 1, y2: 49, itemGUID: 4}
            ];

            ev = new EventEmitter();
            settings = new Settings();
            crsRounder = new CrsRounder();
            connectors = new Connectors();
            for(var i = 0; i < scrs.length; i++)
                connectors.create(scrs[i].type, scrs[i].side, scrs[i].x, scrs[i].y, scrs[i].itemGUID);

            connections = {
                get: function() { return cns; },
                mapAllIntAndTopCns: function(crsClone) {
                    for(var i = 0; i < crsClone.length; i++) {
                        if(crsClone[i].itemGUID == 1)
                            crsClone[i].cnIndexes = [[3]];
                        else if(crsClone[i].itemGUID == 2)
                            crsClone[i].cnIndexes = [[2], [3]];
                        else
                            crsClone[i].cnIndexes = [];
                    }

                    return crsClone;
                }
            };

            var crsCleaner = new CrsCleaner();
            crsCleaner.rmIntFromTop();
            var crs = connectors.get();

            ok(crs.length == 1 && crs[0].itemGUID == 4,
               "rmIntFromTop with insideOrBefore clean type ok");

            clearTestData();

            sourceSettings = {sortDispersion: true};
            settings = new Settings();

            connectors = new Connectors();
            for(var i = 0; i < scrs.length; i++)
                connectors.create(scrs[i].type, scrs[i].side, scrs[i].x, scrs[i].y, scrs[i].itemGUID);

            var crsCleaner = new CrsCleaner();
            crsCleaner.rmIntFromTop();
            crs = connectors.get();

            ok(crs.length == 2 && crs[0].itemGUID == 1 && crs[1].itemGUID == 4,
               "rmIntFromTop with inside clean type ok");

            clearTestData();
        },

        _rmIntFromBottom: function() {
            var scrs = [
                {x: 99,  y: 50,  itemGUID: 1, side: CRS.BOTTOM.RIGHT, type: CRS.APPEND.DEF},
                {x: 199, y: 50,  itemGUID: 2, side: CRS.BOTTOM.RIGHT, type: CRS.PREPEND.DEF},
                {x: 199, y: 200, itemGUID: 4, side: CRS.BOTTOM.RIGHT, type: CRS.APPEND.DEF}
            ];
            var cns = [
                {x1: 0,   x2: 99,   y1: 0,    y2: 49,  itemGUID: 1},
                {x1: 100, x2: 199,  y1: 0,    y2: 49,  itemGUID: 2},
                {x1: 0,   x2: 98.1, y1: 50.9, y2: 99,  itemGUID: 3},
                {x1: 0,   x2: 199,  y1: 100,  y2: 199, itemGUID: 4}
            ];

            ev = new EventEmitter();
            settings = new Settings();
            crsRounder = new CrsRounder();
            connectors = new Connectors();
            for(var i = 0; i < scrs.length; i++)
                connectors.create(scrs[i].type, scrs[i].side, scrs[i].x, scrs[i].y, scrs[i].itemGUID);

            connections = {
                get: function() { return cns; },
                mapAllIntAndBottomCns: function(crsClone) {
                    for(var i = 0; i < crsClone.length; i++) {
                        if(crsClone[i].itemGUID == 1)
                            crsClone[i].cnIndexes = [[2], [3]];
                        else if(crsClone[i].itemGUID == 2)
                            crsClone[i].cnIndexes = [[3]];
                        else
                            crsClone[i].cnIndexes = [];
                    }

                    return crsClone;
                }
            };

            var crsCleaner = new CrsCleaner();
            crsCleaner.rmIntFromBottom();
            var crs = connectors.get();

            ok(crs.length == 1 && crs[0].itemGUID == 4,
                "rmIntFromBottom with insideOrBefore clean type ok");

            clearTestData();

            sourceSettings = {sortDispersion: true};
            settings = new Settings();

            connectors = new Connectors();
            for(var i = 0; i < scrs.length; i++)
                connectors.create(scrs[i].type, scrs[i].side, scrs[i].x, scrs[i].y, scrs[i].itemGUID);

            var crsCleaner = new CrsCleaner();
            crsCleaner.rmIntFromBottom();
            crs = connectors.get();

            ok(crs.length == 2 && crs[0].itemGUID == 2 && crs[1].itemGUID == 4,
                "rmIntFromBottom with inside clean type ok");

            clearTestData();
        },

        _rmIntFromLeft: function() {
            var scrs = [
                {x: 99, y: 99,  itemGUID: 1, side: CRS.LEFT.BOTTOM, type: CRS.APPEND.DEF},
                {x: 99, y: 199, itemGUID: 2, side: CRS.LEFT.BOTTOM, type: CRS.PREPEND.DEF},
                {x: 0,  y: 199, itemGUID: 4, side: CRS.LEFT.BOTTOM, type: CRS.APPEND.DEF}
            ];
            var cns = [
                {x1: 100, x2: 199,  y1: 0,   y2: 99,   itemGUID: 1},
                {x1: 100, x2: 199,  y1: 100, y2: 199,  itemGUID: 2},
                {x1: 50,  x2: 98.2, y1: 0,   y2: 98.2, itemGUID: 3},
                {x1: 1,   x2: 49,   y1: 0,   y2: 199,  itemGUID: 4}
            ];

            ev = new EventEmitter();
            settings = new Settings();
            crsRounder = new CrsRounder();
            connectors = new Connectors();
            for(var i = 0; i < scrs.length; i++)
                connectors.create(scrs[i].type, scrs[i].side, scrs[i].x, scrs[i].y, scrs[i].itemGUID);

            connections = {
                get: function() { return cns; },
                mapAllIntAndLeftCns: function(crsClone) {
                    for(var i = 0; i < crsClone.length; i++) {
                        if(crsClone[i].itemGUID == 1)
                            crsClone[i].cnIndexes = [[2, 3]];
                        else if(crsClone[i].itemGUID == 2)
                            crsClone[i].cnIndexes = [[3]];
                        else
                            crsClone[i].cnIndexes = [];
                    }

                    return crsClone;
                }
            };

            var crsCleaner = new CrsCleaner();
            crsCleaner.rmIntFromLeft();
            var crs = connectors.get();

            ok(crs.length == 1 && crs[0].itemGUID == 4,
               "rmIntFromLeft with insideOrBefore clean type ok");

            clearTestData();

            sourceSettings = {sortDispersion: true};
            settings = new Settings();

            connectors = new Connectors();
            for(var i = 0; i < scrs.length; i++)
                connectors.create(scrs[i].type, scrs[i].side, scrs[i].x, scrs[i].y, scrs[i].itemGUID);

            var crsCleaner = new CrsCleaner();
            crsCleaner.rmIntFromLeft();
            crs = connectors.get();

            ok(crs.length == 2 && crs[0].itemGUID == 2 && crs[1].itemGUID == 4,
                "rmIntFromLeft with inside clean type ok");

            clearTestData();
        },

        _rmIntFromRight: function() {
            var scrs = [
                {x: 50,  y: 99,  itemGUID: 1, side: CRS.RIGHT.BOTTOM, type: CRS.APPEND.DEF},
                {x: 50,  y: 199, itemGUID: 2, side: CRS.RIGHT.BOTTOM, type: CRS.PREPEND.DEF},
                {x: 200, y: 199, itemGUID: 4, side: CRS.RIGHT.BOTTOM, type: CRS.APPEND.DEF}
            ];
            var cns = [
                {x1: 0,    x2: 49,  y1: 0,   y2: 99,   itemGUID: 1},
                {x1: 0,    x2: 49,  y1: 100, y2: 199,  itemGUID: 2},
                {x1: 50.8, x2: 99,  y1: 0,   y2: 98.1, itemGUID: 3},
                {x1: 100,  x2: 199, y1: 0,   y2: 199,  itemGUID: 4}
            ];

            ev = new EventEmitter();
            settings = new Settings();
            crsRounder = new CrsRounder();
            connectors = new Connectors();
            for(var i = 0; i < scrs.length; i++)
                connectors.create(scrs[i].type, scrs[i].side, scrs[i].x, scrs[i].y, scrs[i].itemGUID);

            connections = {
                get: function() { return cns; },
                mapAllIntAndRightCns: function(crsClone) {
                    for(var i = 0; i < crsClone.length; i++) {
                        if(crsClone[i].itemGUID == 1)
                            crsClone[i].cnIndexes = [[2, 3]];
                        else if(crsClone[i].itemGUID == 2)
                            crsClone[i].cnIndexes = [[3]];
                        else
                            crsClone[i].cnIndexes = [];
                    }

                    return crsClone;
                }
            };

            var crsCleaner = new CrsCleaner();
            crsCleaner.rmIntFromRight();
            var crs = connectors.get();

            ok(crs.length == 1 && crs[0].itemGUID == 4,
                "rmIntFromRight with insideOrBefore clean type ok");

            clearTestData();

            sourceSettings = {sortDispersion: true};
            settings = new Settings();

            connectors = new Connectors();
            for(var i = 0; i < scrs.length; i++)
                connectors.create(scrs[i].type, scrs[i].side, scrs[i].x, scrs[i].y, scrs[i].itemGUID);

            var crsCleaner = new CrsCleaner();
            crsCleaner.rmIntFromRight();
            crs = connectors.get();

            ok(crs.length == 2 && crs[0].itemGUID == 2 && crs[1].itemGUID == 4,
                "rmIntFromRight with inside clean type ok");

            clearTestData();
        },

        _rmAllTooBottomFromMostTop: function() {
            ev = new EventEmitter();
            settings = new Settings();
            connectors = {
                _crs: [
                    {x: 50,  y: 0,   itemGUID: 1, side: CRS.RIGHT.BOTTOM, type: CRS.APPEND.DEF},
                    {x: 50,  y: 199, itemGUID: 2, side: CRS.LEFT.TOP,     type: CRS.PREPEND.DEF},
                    {x: 15,  y: 39,  itemGUID: 3, side: CRS.RIGHT.BOTTOM, type: CRS.APPEND.DEF},
                    {x: 200, y: 199, itemGUID: 4, side: CRS.RIGHT.BOTTOM, type: CRS.APPEND.DEF},
                    {x: 100, y: 48,  itemGUID: 5, side: CRS.BOTTOM.RIGHT, type: CRS.APPEND.DEF}
                ],

                get: function() { return this._crs; }
            };
            settings.set("insertRange", 100);

            var crsCleaner = new CrsCleaner();
            crsCleaner.rmAllTooBottomFromMostTop();

            ok(connectors._crs.length == 3 && connectors._crs[0].itemGUID == 1 && connectors._crs[1].itemGUID == 3 &&
               connectors._crs[2].itemGUID == 5, "rmAllTooBottomFromMostTop ok");

            clearTestData();
        },

        _rmAllTooTopFromMostBottom: function() {
            ev = new EventEmitter();
            settings = new Settings();
            connectors = {
                _crs: [
                    {x: 50,  y: 0,   itemGUID: 1, side: CRS.RIGHT.BOTTOM, type: CRS.APPEND.DEF},
                    {x: 50,  y: 251, itemGUID: 2, side: CRS.LEFT.TOP,     type: CRS.PREPEND.DEF},
                    {x: 15,  y: 39,  itemGUID: 3, side: CRS.RIGHT.BOTTOM, type: CRS.APPEND.DEF},
                    {x: 200, y: 300, itemGUID: 4, side: CRS.RIGHT.BOTTOM, type: CRS.APPEND.DEF},
                    {x: 100, y: 206, itemGUID: 5, side: CRS.BOTTOM.RIGHT, type: CRS.APPEND.DEF}
                ],

                get: function() { return this._crs; }
            };
            settings.set("insertRange", 100);

            var crsCleaner = new CrsCleaner();
            crsCleaner.rmAllTooTopFromMostBottom();

            ok(connectors._crs.length == 3 && connectors._crs[0].itemGUID == 2 && connectors._crs[1].itemGUID == 4 &&
               connectors._crs[2].itemGUID == 5, "rmAllTooTopFromMostBottom ok");

            clearTestData();
        },

        _rmAllTooRightFromMostLeft: function() {
            ev = new EventEmitter();
            settings = new Settings();
            connectors = {
                _crs: [
                    {x: 0,   y: 0,   itemGUID: 1, side: CRS.RIGHT.BOTTOM, type: CRS.APPEND.DEF},
                    {x: 150, y: 251, itemGUID: 2, side: CRS.LEFT.TOP,     type: CRS.PREPEND.DEF},
                    {x: 15,  y: 39,  itemGUID: 3, side: CRS.RIGHT.BOTTOM, type: CRS.APPEND.DEF},
                    {x: 200, y: 300, itemGUID: 4, side: CRS.RIGHT.BOTTOM, type: CRS.APPEND.DEF},
                    {x: 101, y: 206, itemGUID: 5, side: CRS.BOTTOM.RIGHT, type: CRS.APPEND.DEF}
                ],

                get: function() { return this._crs; }
            };
            settings.set("insertRange", 100);

            var crsCleaner = new CrsCleaner();
            crsCleaner.rmAllTooRightFromMostLeft();

            ok(connectors._crs.length == 2 && connectors._crs[0].itemGUID == 1 && connectors._crs[1].itemGUID == 3,
               "rmAllTooRightFromMostLeft ok");

            clearTestData();
        },

        _rmAllTooLeftFromMostRight: function() {
            ev = new EventEmitter();
            settings = new Settings();
            connectors = {
                _crs: [
                    {x: 0,   y: 0,   itemGUID: 1, side: CRS.RIGHT.BOTTOM, type: CRS.APPEND.DEF},
                    {x: 250, y: 251, itemGUID: 2, side: CRS.LEFT.TOP,     type: CRS.PREPEND.DEF},
                    {x: 15,  y: 39,  itemGUID: 3, side: CRS.RIGHT.BOTTOM, type: CRS.APPEND.DEF},
                    {x: 205, y: 300, itemGUID: 4, side: CRS.RIGHT.BOTTOM, type: CRS.APPEND.DEF},
                    {x: 300, y: 206, itemGUID: 5, side: CRS.BOTTOM.RIGHT, type: CRS.APPEND.DEF}
                ],

                get: function() { return this._crs; }
            };
            settings.set("insertRange", 100);

            var crsCleaner = new CrsCleaner();
            crsCleaner.rmAllTooLeftFromMostRight();

            ok(connectors._crs.length == 3 && connectors._crs[0].itemGUID == 2 && connectors._crs[1].itemGUID == 4
               && connectors._crs[2].itemGUID == 5, "rmAllTooLeftFromMostRight ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});