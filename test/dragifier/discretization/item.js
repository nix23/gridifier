$(document).ready(function() {
    module("DiscrDraggableItem");

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
                    "bindUnbind",
                    "dragMove",
                    "repositionGrid",
                    "adjustPosition"
                ]);
            });
        },

        _crud: function() {
            dragifierCore = {};
            dragifierCore.hasDragId = function(id, ids) {
                for(var i = 0; i < ids.length; i++) {
                    if(ids[i] == id) return true;
                }

                return false;
            };
            dragifierCore.rmDragId = function(id, ids) {
                for(var i = 0; i < ids.length; i++) {
                    if(ids[i] == id) {
                        ids.splice(i, 1);
                        break;
                    }
                }
            };

            var item = new DiscrDraggableItem();

            item._item = "item";
            ok(item.get() == "item", "get ok");

            item.addDragId(10);
            ok(item.hasDragId(10), "has drag id ok");
            ok(!item.hasDragId(20), "has no drag id ok");
            ok(item.getDragIdsCount() == 1, "drag ids count ok");

            item.rmDragId(10);
            ok(!item.hasDragId(10) && item.getDragIdsCount() == 0,
                "rm drag id ok");

            clearTestData();
        },

        _bindUnbind: function() {
            var data = {
                item: null,
                initCn: null,
                calced: false,
                findOffsets: [],
                clone: null,
                pointer: null,
                discretized: false,
                markedCn: null,
                debugCreated: false,
                hidden: null,
                shown: null
            };
            discretizerDebug = {create: fns.nop(), rm: fns.nop()};

            dragifierCore = {
                initItem: function(item) { data.item = item; },
                calcGridOffsets: function() { data.calced = true; },
                findItemCenterCursorOffsets: function(item, cx, cy) {
                    data.findOffsets[0] = item;
                    data.findOffsets[1] = cx;
                    data.findOffsets[2] = cy;
                },
                createClone: function(item) { data.clone = item; return item; },
                createPointer: function(item) { data.pointer = item; return item; },
                hideItem: function(item) { data.hidden = item; },
                showItem: function(item) { data.shown = item; }
            };
            cnsCore = {};
            cnsCore.find = function(item) {
                if(item != "item") return null;
                return {id: "itemCn", restrictCollect: false};
            };

            var item = new DiscrDraggableItem();
            item._discretizer.discretize = function() { data.discretized = true; };
            item._discretizer.markIntCellsBy = function(cn) { data.markedCn = cn; };

            item.bind("item", 10, 20);
            ok(
                data.item == "item" &&
                item._item == "item" &&
                item._clone == "item" &&
                item._pointer == "item" &&
                item._itemCn.restrictCollect &&
                data.calced &&
                data.findOffsets[0] == "item" &&
                data.findOffsets[1] == 10 &&
                data.findOffsets[2] == 20 &&
                data.discretized &&
                data.markedCn.id == "itemCn" &&
                data.hidden == "item",
                "bind ok"
            );

            var gridDiv = Dom.div();
            var pointer = Dom.div();
            Dom.css.addClass(pointer, "testdragpointer");
            gridDiv.appendChild(pointer);
            item._pointer = pointer;

            grid = {};
            grid.get = function() { return gridDiv; };

            var removed = false;

            item._clone = Dom.div();
            Dom.css.addClass(item._clone, "testdragtest");
            document.body.appendChild(item._clone);

            item.unbind();
            ok(
                data.shown == "item" &&
                item._item == null &&
                !item._itemCn.restrictCollect &&
                $(".testdragtest").length == 0 &&
                $(".testdragpointer").length == 0,
                "unbind ok"
            );

            clearTestData();
        },

        _dragMove: function() {
            var data = {
                renderClone: null,
                renderX: null,
                renderY: null,
                gridReposed: false,
                discUpdated: false
            };
            discretizerDebug = {update: fns.nop()};

            dragifierCore = {};
            dragifierCore.calcCloneNewDocPosition = function(item, cx, cy) {
                if(item != "item" || cx != 20 || cy != 30) return null;
                return {x: 10, y: 20};
            };
            dragifierCore.calcCloneNewGridPosition = function(item, docPos) {
                if(item != "item" || docPos.x != 10 || docPos.y != 20) return null;
                return "newGridPos";
            };

            dragifier = {};
            dragifier.render = function(clone, x, y) {
                data.renderClone = clone;
                data.renderX = x;
                data.renderY = y;
            };

            dragifierCells = {};
            dragifierCells.getIntCellsData = function(itemcn) {
                if(itemcn.intCells != "itemIntCellsData") return null;
                return {intCells: "itemIntCellsData"};
            };
            dragifierCells.isAnyIntCellEmpty = function(intCellsData) {
                if(intCellsData.intCells != "itemIntCellsData") return false;
                return true;
            };
            dragifierCells.isIntEnoughRowsAndCols = function(int1, int2) {
                if(int1.intCells != "itemIntCellsData" && int2.intCells != "itemIntCellsData")
                    return false;
                return true;
            };
            dragifierCells.normalizeOverflowedCells = function(int1, int2, int3) {
                if(int1 != "itemIntCellsData" &&
                   int2.intCells != "itemIntCellsData" &&
                   int3.intCells != "itemIntCellsData")
                    return null;

                return "intOk";
            };

            var item = new DiscrDraggableItem();
            item._discretizer.getAllCellsWithIntCenter = function(itemcn) {
                if(itemcn != "itemCn" && itemcn != "newGridPos") return null;
                return {intCells: "itemIntCellsData"};
            };

            item._item = "item";
            item._itemCn = "itemCn";
            item._clone = "clone";
            item._repositionGrid = function(int) {
                if(int == "intOk") data.gridReposed = true;
            };

            item.dragMove(20, 30);

            ok(
                data.renderClone == "clone" &&
                data.renderX == 10 &&
                data.renderY == 20 &&
                data.gridReposed,
                "dragMove ok"
            );

            clearTestData();
        },

        _repositionGrid: function(assert) {
            var origDelay = null;
            var data = {
                adjustCoords: null,
                markCoords: null,
                reposed: false
            };

            var initFn = function() {
                origDelay = C.DRAGIFIER_DISCR_REPOS_DELAY;
                C.DRAGIFIER_DISCR_REPOS_DELAY = 0;

                discretizerCore = {};
                discretizerCore.normalizeCnXCoords = function(item, cnCoords) {
                    if(item != "item" || cnCoords != "cnCoords") return null;
                    return "cn1coords";
                };
                discretizerCore.normalizeCnYCoords = function(item, cnCoords) {
                    if(item != "item" || cnCoords != "cn1coords") return null;
                    return "cn2coords";
                };

                dragifierCore = {};
                dragifierCore.repositionItems = function() {
                    data.reposed = true;
                };

                var item = new DiscrDraggableItem();
                item._discretizer.intCellsToCoords = function(cells) {
                    if(cells != "intCells") return null;
                    return "cnCoords";
                };
                item._discretizer.markIntCellsBy = function(cnCoords) {
                    if(cnCoords == "cn2coords") data.markCoords = cnCoords;
                };

                item._item = "item";
                item._adjustPosition = function(cnCoords) {
                    if(cnCoords == "cn2coords") data.adjustCoords = cnCoords;
                };
                item._repositionGrid("intCells");
            };
            var checkFn = function() {
                ok(data.adjustCoords == "cn2coords" &&
                   data.markCoords == "cn2coords" &&
                   data.reposed,
                   "repositionGrid ok");
                C.DRAGIFIER_DISCR_REPOS_DELAY = origDelay;
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        },

        _adjustPosition: function() {
            var data = {
                item: null,
                x1: null,
                y1: null,
                ccTime: null,
                ccTiming: null,
                dom: null,
                prefixer: null,
                getS: null,
                renderPointer: null,
                renderX: null,
                renderY: null
            };

            ev = new EventEmitter();
            settings = {};
            settings.get = function(name) {
                if(name == "coordsChangeTime") return "time";
                if(name == "coordsChangeTiming") return "timing";
            };
            settings.getApi = function(name) {
                if(name != "coordsChanger") return null;

                return function(item, x1, y1, ccTime, ccTiming, dom, prefixer, getS) {
                    data.item = item;
                    data.x1 = x1;
                    data.y1 = y1;
                    data.ccTime = ccTime;
                    data.ccTiming = ccTiming;
                    data.dom = dom;
                    data.prefixer = prefixer;
                    data.getS = getS;
                };
            };

            dragifier = {};
            dragifier.render = function(pointer, x, y) {
                data.renderPointer = pointer;
                data.renderX = x;
                data.renderY = y;
            };

            var origDom = Dom;
            var origPrefixer = Prefixer;
            Dom = "dom";
            Prefixer = "prefixer";

            var item = new DiscrDraggableItem();
            item._item = "item";
            item._pointer = "pointer";
            item._itemCn = {x1: 0, x2: 0, y1: 0, y2: 0};

            item._adjustPosition({x1: 10, x2: 15, y1: 20, y2: 25});
            ok(
                item._itemCn.x1 == 10 &&
                item._itemCn.x2 == 15 &&
                item._itemCn.y1 == 20 &&
                item._itemCn.y2 == 25 &&
                data.item == "item" &&
                data.x1 == "10px" &&
                data.y1 == "20px" &&
                data.ccTime == "time" &&
                data.ccTiming == "timing" &&
                data.dom == "dom" &&
                data.prefixer == "prefixer" &&
                data.getS("coordsChangeTime") == "time" &&
                data.renderPointer == "pointer" &&
                data.renderX == 10 &&
                data.renderY == 20,
                "adjustPosition ok"
            );

            Dom = origDom;
            Prefixer = origPrefixer;

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});