$(document).ready(function() {
    module("Position");

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
                    "construct",
                    "initCrs",
                    "createInitialCr",
                    "recreateCrs",
                    "cleanCrs",
                    "filterCrs",
                    "findCnCoords",
                    "createCn",
                    "render",
                    "fixAllXYPosAfterPrepend",
                    "renderAfterPrependFix"
                ]);
            });
        },

        _construct: function() {
            var data = {crInitialCr: false, addItemCrs: false, cantFitCond: false};
            var inserter = {};
            var crsRecreated = false;
            var initialCrCreated = false;

            var origRecreateCrs = Position.prototype._recreateCrs;
            var origCreateIntitialCr = Position.prototype._createInitialCr;
            Position.prototype._recreateCrs = function() { crsRecreated = true; };
            Position.prototype._createInitialCr = function() { initialCrCreated = true; };

            var position = new Position(
                inserter,
                OPS.APPEND,
                function() { data.crInitialCr = true; },
                function() { data.addItemCrs = true; },
                function() { data.cantFitCond = true; }
            );

            inserter.recreateCrs();
            inserter.createInitialCr();
            position._crInitialCr();
            position._addItemCrs();
            position._cantFitCond();

            ok(crsRecreated && initialCrCreated && data.crInitialCr &&
               position._op == OPS.APPEND &&
               data.addItemCrs && data.cantFitCond, "position construct ok");

            Position.prototype._recreateCrs = origRecreateCrs;
            Position.prototype._createInitialCr = origCreateIntitialCr;
            clearTestData();
        },

        _initLog: function() {
            Logger = {log: function() {}};
            Logger.startFindCnCoordsLog = function() {};
            Logger.logInspectConnector = function() {};
            Logger.logCnCoordsFound = function() {};
            Logger.stopFindCnCoordsLog = function() {};
            Logger.logOutOfLayoutBounds = function() {};
            Logger.logIntFound = function() {};
            Logger.logWrongSorting = function() {};
            Logger.logIntersectionsError = function() {};
            connectors = {get: function() {}};
            connections = {get: function() {}};
        },

        _initCrs: function() {
            this._initLog();
            operation = {isInitial: function(op) { return op == OPS.APPEND; }};
            var initialCrCreated = false;

            var position = new Position({}, OPS.APPEND);
            position._createInitialCr = function() { initialCrCreated = true; };
            position.initCrs();
            ok(initialCrCreated, "initCrs -> initialCr created ok");

            initialCrCreated = false;
            var isSameAsPrev = false;
            operation.isSameAsPrev = function(op) {
                isSameAsPrev = (op == OPS.PREPEND);
                return isSameAsPrev;
            };
            position = new Position({}, OPS.PREPEND);
            position.initCrs();
            ok(!initialCrCreated && isSameAsPrev, "initCrs -> isSameAsPrev ok");

            isSameAsPrev = false;
            var rmIntFromSide = false;
            var rmAllTooSideFromMostSide = false;
            crsCleaner = {
                rmIntFromSide: function() { rmIntFromSide = true; },
                rmAllTooSide1FromMostSide2: function() {
                    rmAllTooSideFromMostSide = true;
                }
            };
            var crsRecreated = false;
            position = new Position({}, OPS.REV_PREPEND);
            position._recreateCrs = function() { crsRecreated = true; };
            position.initCrs("Side", "Side1", "Side2");
            ok(!initialCrCreated && !isSameAsPrev && rmIntFromSide &&
               rmAllTooSideFromMostSide && crsRecreated,
               "initCrs -> recreate crs and clean ok");

            clearTestData();
        },

        _createInitialCr: function() {
            this._initLog();
            connectors.guid = 1;
            grid = {guid: 2};

            var wasCreated = false;
            var paramsOk = false;
            var position = new Position({}, OPS.APPEND, function(crs, grid) {
                wasCreated = true;
                paramsOk = (crs.guid == 1) && (grid.guid == 2);
            });
            position._createInitialCr();
            ok(wasCreated && paramsOk, "_createInitialCr ok");

            clearTestData();
        },

        _recreateCrs: function() {
            this._initLog();

            var wasFlushed = false;
            connectors.flush = function() { wasFlushed = true; };
            connectors.count = function() { return 5; };
            connections.get = function() { return [
                {id: 1, itemGUID: 1}, {id: 2, itemGUID: 2}
            ]};
            var addCrCns = [];
            var addCrGuids = [];
            var position = new Position({}, OPS.APPEND, null, function(cn, itemGUID) {
                addCrCns.push(cn);
                addCrGuids.push(itemGUID);
            });
            var wasInitialCrCreated = false;
            position._createInitialCr = function() { wasInitialCrCreated = true; };
            position._recreateCrs();
            ok(wasFlushed && addCrCns.length == 2 && addCrCns[0].id == 1 &&
               addCrCns[1].id == 2 && !wasInitialCrCreated &&
               addCrGuids.length == 2 && addCrGuids[0] == 1 && addCrGuids[1] == 2,
               "recreateCrs ok");

            wasFlushed = false;
            connectors.count = function() { return 0; };
            position._recreateCrs(true);
            ok(!wasFlushed && wasInitialCrCreated,
               "recreateCrs with disabled flush and no crs");

            clearTestData();
        },

        _cleanCrs: function() {
            this._initLog();

            var firstCalled = false;
            var secondCalled = false;

            crsCleaner = {};
            crsCleaner.rmAllTooSide1FromMostSide2 = function() {
                firstCalled = true;
            };
            crsCleaner.rmIntFromSide = function() { secondCalled = true; };

            var position = new Position({}, OPS.APPEND);
            position.cleanCrs("Side", "Side1", "Side2");
            ok(firstCalled && secondCalled, "cleanCrs ok");

            clearTestData();
        },

        _filterCrs: function() {
            this._initLog();
            ev = new EventEmitter();
            sourceSettings = {};
            settings = new Settings();

            var setEachCr = function(crs, name) {
                for(var i = 0; i < crs.length; i++)
                    crs[i][name] = true;
            }
            connectors.getClone = function() {
                return [
                    {itemGUID: 1, selected: false, shifted: false, sorted: false,
                     selectedOnlyMost: false, shiftedAllTo: false},
                    {itemGUID: 2, selected: false, shifted: false, sorted: false,
                     selectedOnlyMost: false, shiftedAllTo: false}
                ];
            };
            crsSelector = {
                attach: function(crs) { this._crs = crs; },
                selectOnlyFromAppended: function(side) {
                    if(side != CRS.BOTTOM.LEFT) return;
                    setEachCr(this._crs, "selected");
                },
                getSelected: function() { return this._crs; },
                selectOnlyMostBottom: function(side) {
                    if(side != CRS.BOTTOM.LEFT) return;
                    setEachCr(this._crs, "selectedOnlyMost");
                }
            };
            crsShifter = {
                attach: function(crs) { this._crs = crs; },
                shiftAll: function() { setEachCr(this._crs, "shifted"); },
                getNew: function() { return this._crs; },
                shiftAllToBottom: function(side) {
                    if(side != CRS.BOTTOM.LEFT) return;
                    setEachCr(this._crs, "shiftedAllTo");
                }
            };
            crsSorter = {
                attach: function(crs) { this._crs = crs; },
                sortForAppend: function() { setEachCr(this._crs, "sorted"); },
                getSorted: function() { return this._crs; }
            };

            var position = new Position({});
            var crs = position.filterCrs("Appended", CRS.BOTTOM.LEFT, "Bottom", "Bottom", "Append");
            ok(crs[0].selected &&
               crs[0].shifted &&
               crs[0].sorted &&
               !crs[0].selectedOnlyMost &&
               !crs[0].shiftedAllTo &&
               crs[1].selected &&
               crs[1].shifted &&
               crs[1].sorted &&
               !crs[1].selectedOnlyMost &&
               !crs[1].shiftedAllTo,
               "filterCrs with enabled intersections ok");

            sourceSettings = {intersections: false};
            settings = new Settings();
            position = new Position({});
            crs = position.filterCrs("Appended", CRS.BOTTOM.LEFT, "Bottom", "Bottom", "Append");
            ok(crs[0].selected &&
               !crs[0].shifted &&
               crs[0].sorted &&
               crs[0].selectedOnlyMost &&
               crs[0].shiftedAllTo &&
               crs[1].selected &&
               !crs[1].shifted &&
               crs[1].sorted &&
               crs[1].selectedOnlyMost &&
               crs[1].shiftedAllTo,
               "filterCrs with disabled intersections ok");

            clearTestData();
        },

        _findCnCoords: function(assert) {
            this._initLog();
            ev = new EventEmitter();
            settings = new Settings();

            coordsFinder = {
                find: function(op, item, cr) {
                    if(op != OPS.APPEND) return;
                    if(item.guid != 1) return;
                    return cr;
                }
            };
            var cantFitCond = function(cr) {
                if(cr.itemGUID == 1) return true;
                return false;
            };
            cnsIntersector = {
                findAllMaybeIntOnAppend: function(cr) { return cr; },
                isIntersectingAny: function(cr, cr2) {
                    if(cr.itemGUID != cr2.itemGUID) return true;
                    if(cr.itemGUID == 2) return true;
                    return false;
                }
            };
            connections.getAllBelowY = function(itemGUID) {
                if(itemGUID == 3) return 0;
                return 2;
            };
            cnsCore = {
                isAnyGUIDBiggerThan: function(cnsCount, item) {
                    if(cnsCount == 0 && item.guid == 1) return true;
                    return false;
                }
            };
            connections.isIntMoreThanOneCnY = function(cr) {
                if(cr.itemGUID == 4) return true;
                return false;
            };

            var sortedCrs = [
                {itemGUID: 1}, {itemGUID: 2}, {itemGUID: 3},
                {itemGUID: 4}, {itemGUID: 5}
            ];
            var position = new Position({}, OPS.APPEND, null, null, cantFitCond);
            var cn = position.findCnCoords(
                {guid: 1}, sortedCrs, "Append", "BelowY", "itemGUID", "Bigger", "Y"
            );
            ok(cn.itemGUID == 4, "findCnCoords with enabled intersections ok");

            sourceSettings = {intersections: false};
            settings = new Settings();
            var cn = position.findCnCoords(
                {guid: 1}, sortedCrs, "Append", "BelowY", "itemGUID", "Bigger", "Y"
            );
            ok(cn.itemGUID == 5, "findCnCoords with disabled intersections ok");

            sortedCrs.pop();
            assert.throws(
                function() {
                    position.findCnCoords(
                        {guid: 1}, sortedCrs, "Append", "BelowY", "itemGUID", "Bigger", "Y"
                    );
                },
                /too wide(.*)item(.*)/,
                "findCnCoords coords not found ok"
            );

            clearTestData();
        },

        _createCn: function() {
            this._initLog();
            ev = new EventEmitter();
            settings = new Settings();

            var getData = function() {
                return {
                    item: null, cn: null, expandedY: false, expandedX: false,
                    expandedCn: null, addedItem: null, addedCn: null
                };
            };
            connections = {
                add: function(item, cn) {
                    data.item = item;
                    data.cn = cn;
                    return cn;
                },
                expandYAllRowCnsToMostTall: function(cn) {
                    data.expandedY = true;
                    data.expandedCn = cn;
                },
                expandXAllColCnsToMostWide: function(cn) {
                    data.expandedX = true;
                    data.expandedCn = cn;
                },
                get: function() {}
            };
            guid = {get: function(item) { return item; }};

            var data = getData();
            var position = new Position({});
            position._addItemCrs = function(cn, item) {
                data.addedItem = item;
                data.addedCn = cn;
            };
            position.createCn({guid: 1}, {guid: 2});
            ok(data.item.guid == 1 && data.cn.guid == 2 && data.expandedCn == null &&
               data.addedItem.guid == 1 && data.addedCn.guid == 2, "createCn with enabled intersections ok");

            sourceSettings = {intersections: false};
            settings = new Settings();
            data = getData();
            position.createCn({guid: 1}, {guid: 2});
            ok(data.item.guid == 1 && data.cn.guid == 2 && data.expandedCn.guid == 2 && data.expandedY &&
               data.addedItem.guid == 1 && data.addedCn.guid == 2, "createCn with disabled intersections(vg) ok");

            settings.set("grid", "horizontal");
            data = getData();
            position.createCn({guid: 1}, {guid: 2});
            ok(data.item.guid == 1 && data.cn.guid == 2 && data.expandedCn.guid == 2 && data.expandedX &&
               data.addedItem.guid == 1 && data.addedCn.guid == 2, "createCn with disabled intersections(hg) ok");

            clearTestData();
        },

        _render: function() {
            this._initLog();
            ev = new EventEmitter();
            settings = new Settings();

            connections = {
                getLastRowYExpandedCns: function() {
                    return [{itemGUID: 2}, {itemGUID: 3}];
                },
                getLastColXExpandedCns: function() {
                    return [{itemGUID: 4}, {itemGUID: 5}];
                }
            };

            var renderedAfterDelay = [];
            var showedCn = null;

            var position = new Position({});
            renderer = {};
            renderer.show = function(cn) { showedCn = cn; };
            renderer.renderAfterDelay = function(cns) {
                renderedAfterDelay = cns;
            };

            position.render({}, {itemGUID: 3});
            ok(showedCn.itemGUID == 3, "render cn ok");

            sourceSettings = {intersections: false};
            settings = new Settings();
            position.render({}, {itemGUID: 2});
            ok(showedCn.itemGUID == 2 && renderedAfterDelay[0].itemGUID == 3,
               "render with disabled intersections(vg) ok");

            renderedAfterDelayCount = 0;
            settings.set("grid", "horizontal");
            position.render({}, {itemGUID: 6});
            ok(showedCn.itemGUID == 6 && renderedAfterDelay[0].itemGUID == 4 &&
               renderedAfterDelay[1].itemGUID == 5,
               "render with enabled intersections(hg) ok");

            clearTestData();
        },

        _fixAllXYPosAfterPrepend: function() {
            this._initLog();
            ev = new EventEmitter();
            settings = new Settings();

            connections = {
                fixAllYPosAfterPrepend: function(cn, crs) {
                    if(cn.guid == 1 && crs.length == 2) return true;
                    return false;
                },
                fixAllXPosAfterPrepend: function(cn, crs) {
                    if(cn.guid == 2 && crs.length == 2) return true;
                    return false;
                },
                get: function() {}
            };

            var position = new Position({});
            var wereFixed = position.fixAllXYPosAfterPrepend({guid: 1}, [{},{}]);
            ok(wereFixed, "fixAllYPosAfterPrepend ok");

            settings.set("grid", "horizontal");
            var wereFixed = position.fixAllXYPosAfterPrepend({guid: 2}, [{},{}]);
            ok(wereFixed, "fixAllXPosAfterPrepend ok");

            clearTestData();
        },

        _renderAfterPrependFix: function() {
            this._initLog();
            var allCns = null;
            var newCn = null;

            connections.get = function() { return [{},{}]; };
            renderer = {render: function(fnAllCns, newCns) {
                allCns = fnAllCns;
                newCn = newCns[0];
            }};

            var position = new Position({});
            position.renderAfterPrependFix({guid: 4});

            ok(allCns.length == 2 && newCn.guid == 4, "renderAfterPrependFix ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});