$(document).ready(function() {
    module("Antialiaser");

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
                    "updateAsOnSettingSet",
                    "updateAsOnInit",
                    "updateAsWithDisabledAs",
                    "updateAsWithEnabledPxWidthAs",
                    "updateAsWithEnabledPtWidthAs",
                    "updateAsWithEnabledPxHeightAs",
                    "updateAsWithEnabledPtHeightAs",

                    "updateZCallWhenDisabled",
                    "updateZCallWhenEnabled",
                    "updateZCallWhenZUpdatesDisabled",
                    "updateZ"
                ]);
            });
        },

        _updateAsOnSettingSet: function() {
            var gridWidth = 100;
            var gridHeight = 100;
            var widthPtAs = 0.1;
            var heightPtAs = 0.1;

            srManager = new SizesResolverManager();
            sourceGrid = Dom.div();
            grid = new Grid();
            grid.x2 = function() { return gridWidth; };
            grid.y2 = function() { return gridHeight; };

            ev = new EventEmitter();
            settings = new Settings();

            var expectedOwAs = (gridWidth + 1) * (widthPtAs / 100);
            var expectedOhAs = (gridHeight + 1) * (heightPtAs / 100);

            var antialiaser = new Antialiaser();
            ok(!antialiaser._shouldUpdateZ && srManager._owAntialias == 0 &&
               srManager._ohAntialias == 0,
               "init settings antialias values ok");

            settings.set("widthPxAs", 1);
            settings.set("heightPxAs", 1);
            ok(antialiaser._shouldUpdateZ && srManager._owAntialias == 1 &&
               srManager._ohAntialias == 1,
               "as values after widthPx/heightPx As setting update ok");

            settings.set([["widthPtAs", widthPtAs], ["heightPtAs", heightPtAs]]);
            ok(antialiaser._shouldUpdateZ && srManager._owAntialias == expectedOwAs &&
               srManager._ohAntialias == expectedOhAs,
               "as values after widthPt/heightPt As setting update ok");

            clearTestData();
        },

        _updateAsOnInit: function() {
            srManager = new SizesResolverManager();
            ev = new EventEmitter();
            sourceSettings = {widthPxAs: 1, heightPxAs: 1};
            settings = new Settings();

            var antialiaser = new Antialiaser();
            ok(antialiaser._shouldUpdateZ && srManager._owAntialias == 1 &&
               srManager._ohAntialias == 1,
               "width and height antialias on init ok");

            clearTestData();
        },

        _updateAsWithDisabledAs: function() {
            srManager = new SizesResolverManager();
            ev = new EventEmitter();
            settings = new Settings();

            var antialiaser = new Antialiaser();
            antialiaser.updateAs();

            ok(!antialiaser._shouldUpdateZ && srManager._owAntialias == 0 &&
               srManager._ohAntialias == 0,
               "width and height antialias disabled ok");

            clearTestData();
        },

        _updateAsWithEnabledPxWidthAs: function() {
            srManager = new SizesResolverManager();
            ev = new EventEmitter();
            sourceSettings = {widthPxAs: 1};
            settings = new Settings();

            var antialiaser = new Antialiaser();
            antialiaser.updateAs();

            ok(antialiaser._shouldUpdateZ && srManager._owAntialias == 1 &&
               srManager._ohAntialias == 0,
               "width px antialias enabled ok");

            clearTestData();
        },

        _updateAsWithEnabledPtWidthAs: function() {
            srManager = new SizesResolverManager();
            ev = new EventEmitter();

            var gridWidth = 100;
            var widthPtAs = 0.1;

            sourceGrid = Dom.div();
            grid = new Grid();
            grid.x2 = function() { return gridWidth; };

            sourceSettings = {widthPtAs: widthPtAs};
            settings = new Settings();

            var antialiaser = new Antialiaser();
            antialiaser.updateAs();

            var expectedOwAs = (gridWidth + 1) * (widthPtAs / 100);
            ok(antialiaser._shouldUpdateZ && srManager._owAntialias == expectedOwAs &&
               srManager._ohAntialias == 0,
               "width pt antialias enabled ok");

            clearTestData();
        },

        _updateAsWithEnabledPxHeightAs: function() {
            srManager = new SizesResolverManager();
            ev = new EventEmitter();
            sourceSettings = {heightPxAs: 1};
            settings = new Settings();

            var antialiaser = new Antialiaser();
            antialiaser.updateAs();

            ok(antialiaser._shouldUpdateZ && srManager._owAntialias == 0 &&
               srManager._ohAntialias == 1,
               "height px antialias enabled ok");

            clearTestData();
        },

        _updateAsWithEnabledPtHeightAs: function() {
            srManager = new SizesResolverManager();
            ev = new EventEmitter();

            var gridHeight = 100;
            var heightPtAs = 0.1;

            sourceGrid = Dom.div();
            grid = new Grid();
            grid.y2 = function() { return gridHeight; };

            sourceSettings = {heightPtAs: heightPtAs};
            settings = new Settings();

            var antialiaser = new Antialiaser();
            antialiaser.updateAs();

            var expectedOhAs = (gridHeight + 1) * (heightPtAs / 100);
            ok(antialiaser._shouldUpdateZ && srManager._owAntialias == 0 &&
               srManager._ohAntialias == expectedOhAs,
               "height pt antialias enabled ok");

            clearTestData();
        },

        _updateZCallWhenDisabled: function(assert) {
            var wasUpdateZCalled = false;
            var origDelay = null;

            var initFn = function() {
                origDelay = C.UPDATE_Z_DELAY;
                C.UPDATE_Z_DELAY = 0;
                srManager = new SizesResolverManager();
                ev = new EventEmitter();
                settings = new Settings();

                var antialiaser = new Antialiaser();
                antialiaser._updateZ = function() {
                    wasUpdateZCalled = true;
                };

                ev.emit(EV.REPOSITION);
            };
            var checkFn = function() {
                ok(!wasUpdateZCalled, "updateZ was not called when disabled");
                C.UPDATE_Z_DELAY = origDelay;
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        },

        _updateZCallWhenEnabled: function(assert) {
            var wasUpdateZCalled = false;
            var origDelay = null;
            var callsCount = 0;

            var initFn = function() {
                origDelay = C.UPDATE_Z_DELAY;
                C.UPDATE_Z_DELAY = 0;
                srManager = new SizesResolverManager();
                ev = new EventEmitter();
                settings = new Settings();

                var antialiaser = new Antialiaser();
                antialiaser._updateZ = function() {
                    wasUpdateZCalled = true;
                    callsCount++;
                };

                settings.set("widthPxAs", 1);
                ev.emit(EV.REPOSITION);
                ev.emit(EV.REPOSITION);
            };
            var checkFn = function() {
                ok(wasUpdateZCalled && callsCount == 1, "updateZ was called when enabled");
                C.UPDATE_Z_DELAY = origDelay;
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        },

        _updateZCallWhenZUpdatesDisabled: function(assert) {
            var wasUpdateZCalled = false;
            var disableZUpdatesRes = null;
            var origDelay = null;

            var initFn = function() {
                origDelay = C.UPDATE_Z_DELAY;
                C.UPDATE_Z_DELAY = 0;
                srManager = new SizesResolverManager();
                ev = new EventEmitter();
                settings = new Settings();

                var antialiaser = new Antialiaser();
                antialiaser._updateZ = function() {
                    wasUpdateZCalled = true;
                };

                settings.set("widthPxAs", 1);
                disableZUpdatesRes = gridifier.disableZUpdates();
                ev.emit(EV.REPOSITION);
                ev.emit(EV.REPOSITION);
            };
            var checkFn = function() {
                ok(!wasUpdateZCalled && disableZUpdatesRes == gridifier,
                   "updateZ was not called when disableZUpdates was called");
                C.UPDATE_Z_DELAY = origDelay;
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        },

        _updateZ: function() {
            ev = new EventEmitter();
            settings = new Settings();
            guid = new GUID();
            cnsSorter = new CnsSorter();
            connections = new VgConnections();

            connections._cns = [
                {x1: 0, x2: 19, y1: 0, y2: 19, item: {style: {zIndex: 1}}, itemGUID: 4},
                {x1: 0, x2: 9, y1: 0, y2: 9, item: {style: {zIndex: 1}}, itemGUID: 2},
                {x1: 0, x2: 19, y1: 0, y2: 19, item: {style: {zIndex: 1}}, itemGUID: 1},
                {x1: 0, x2: 9, y1: 0, y2: 9, item: {style: {zIndex: 1}}, itemGUID: 3}
                // After sortByAreas: (sorts original cns in connections._cns obj)
                // {x1: 0, x2: 9, y1: 0, y2: 9, item: {style: {zIndex: 1}}, itemGUID: 2},
                // {x1: 0, x2: 9, y1: 0, y2: 9, item: {style: {zIndex: 1}}, itemGUID: 3},
                // {x1: 0, x2: 19, y1: 0, y2: 19, item: {style: {zIndex: 1}}, itemGUID: 4},
                // {x1: 0, x2: 19, y1: 0, y2: 19, item: {style: {zIndex: 1}}, itemGUID: 1},
                // After sortForReappend in packedCns: (cns in connections._cns will not be affected by this sort)
                // {x1: 0, x2: 9, y1: 0, y2: 9, item: {style: {zIndex: 1}}, itemGUID: 2},
                // {x1: 0, x2: 9, y1: 0, y2: 9, item: {style: {zIndex: 1}}, itemGUID: 3},
                // {x1: 0, x2: 19, y1: 0, y2: 19, item: {style: {zIndex: 1}}, itemGUID: 1},
                // {x1: 0, x2: 19, y1: 0, y2: 19, item: {style: {zIndex: 1}}, itemGUID: 4}
            ];
            for(var i = 0; i < connections._cns.length; i++) {
                (function(item, itemGUID) {
                    item.getAttribute = function() { return Dom.int(itemGUID); };
                })(connections._cns[i].item, connections._cns[i].itemGUID);
            }

            var antialiaser = new Antialiaser();
            antialiaser._updateZ();

            var cns = connections.get();
            ok(cns[0].item.style.zIndex == 1 && cns[1].item.style.zIndex == 2 &&
               cns[2].item.style.zIndex == 4 && cns[3].item.style.zIndex == 3,
               "updateZ ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});