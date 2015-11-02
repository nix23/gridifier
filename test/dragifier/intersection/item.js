$(document).ready(function() {
    module("IntDraggableItem");

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
                    "getNewIntCns",
                    "swapGuids",
                    "swapPos",
                    "swapData"
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

            var item = new IntDraggableItem();

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
                calced: false,
                findOffsets: [],
                clone: null,
                hidden: null,
                shown: null
            };
            dragifierCore = {
                initItem: function(item) { data.item = item; },
                calcGridOffsets: function() { data.calced = true; },
                findItemCenterCursorOffsets: function(item, cx, cy) {
                    data.findOffsets[0] = item;
                    data.findOffsets[1] = cx;
                    data.findOffsets[2] = cy;
                },
                createClone: function(item) { data.clone = item; return item; },
                hideItem: function(item) { data.hidden = item; },
                showItem: function(item) { data.shown = item; }
            };

            var item = new IntDraggableItem();
            item.bind("item", 10, 20);
            ok(
                data.item == "item" &&
                item._item == "item" &&
                item._clone == "item" &&
                data.calced &&
                data.findOffsets[0] == "item" &&
                data.findOffsets[1] == 10 &&
                data.findOffsets[2] == 20 &&
                data.hidden == "item",
                "bind ok"
            );

            item._clone = Dom.div();
            Dom.css.addClass(item._clone, "testdragtest");
            document.body.appendChild(item._clone);
            item.unbind();
            ok(data.shown == "item" && data._item == null &&
               $(".testdragtest").length == 0, "unbind ok");

            clearTestData();
        },

        _dragMove: function() {
            ev = new EventEmitter();
            settings = new Settings();

            var data = {
                renderClone: null,
                renderX: null,
                renderY: null,
                swappedGuids: null,
                swappedPositions: null,
                repositioned: false
            };

            dragifierCore = {};
            dragifierCore.calcCloneNewDocPosition = function(item, cx, cy) {
                if(item != "item" || cx != 20 || cy != 30) return null;
                return {x: 10, y: 20};
            };
            dragifierCore.calcCloneNewGridPosition = function(item, docPos) {
                if(item != "item" || docPos.x != 10 || docPos.y != 20) return null;
                return "newGridPos";
            };
            dragifierCore.repositionItems = function() {
                data.repositioned = true;
            };

            dragifier = {};
            dragifier.render = function(clone, x, y) {
                data.renderClone = clone;
                data.renderX = x;
                data.renderY = y;
            };

            var item = new IntDraggableItem();
            item._getNewIntCns = function(gridPos) {
                if(gridPos != "newGridPos") return null;
                return [];
            };
            item._swapGUIDS = function(intCns) {
                data.swappedGuids = intCns;
            };

            item._item = "item";
            item._clone = "clone";
            item.dragMove(20, 30);
            ok(!data.repositioned, "dragMove without new int cns ok");

            item._getNewIntCns = function(gridPos) {
                if(gridPos != "newGridPos") return null;
                return [2, 3];
            };
            item.dragMove(20, 30);
            ok(
                data.renderClone == "clone" &&
                data.renderX == 10 &&
                data.renderY == 20 &&
                data.swappedGuids.length == 2 &&
                data.swappedGuids[0] == 2 &&
                data.swappedGuids[1] == 3 &&
                data.repositioned,
                "dragMove on disabled SD ok"
            );

            sourceSettings = {sortDispersion: true};
            settings = new Settings();
            data.repositioned = false;
            item._swapPositions = function(newCns) {
                data.swappedPositions = newCns;
                return false;
            };

            item.dragMove(20, 30);
            ok(!data.repositioned, "dragMove on enabled SD + no swaps ok");

            item._swapPositions = function(newCns) {
                data.swappedPositions = newCns;
                return true;
            };
            item.dragMove(20, 30);
            ok(data.swappedPositions[0] == 2 &&
               data.swappedPositions[1] == 3 &&
               data.repositioned,
               "dragMove on enabled SD + swaps ok");

            clearTestData();
        },

        _getNewIntCns: function() {
            cnsIntersector = {};
            cnsIntersector.getAllWithIntersectedCenter = function(gridPos) {
                if(gridPos != "gridPos") return null;
                return [{itemGUID: 1}, {itemGUID: 2}, {itemGUID: 3}];
            };
            guid = {};
            guid.get = function(item) {
                if(item != "item") return null;
                return 3;
            };

            var item = new IntDraggableItem();
            item._item = "item";

            var newIntCns = item._getNewIntCns("gridPos");
            ok(newIntCns.length == 2 &&
               newIntCns[0].itemGUID == 1 &&
               newIntCns[1].itemGUID == 2,
               "getNewIntCns ok");

            clearTestData();
        },

        _swapGuids: function() {
            guid = {};
            guid.get = function(item) {
                if(item.id != "item") return null;
                return 3;
            };
            guid.set = function(obj, guid) {
                obj.guid = guid;
            };

            var item = new IntDraggableItem();
            item._item = {id: "item"};
            item._clone = {id: "clone"};

            var cns = [
                {item: {guid: 0}, itemGUID: 3},
                {item: {guid: 0}, itemGUID: 1},
                {item: {guid: 0}, itemGUID: 2}
            ];
            item._swapGUIDS(cns);
            ok(item._item.guid == 1 &&
               item._clone.guid == 1 &&
               cns[1].item.guid == 3,
               "swap guids ok");

            clearTestData();
        },

        _swapPos: function() {
            guid = {};
            guid.get = function(item) {
                if(item.id != "item" && item.id != "cnItem") return null;
                return item.guid;
            };
            guid.set = function(obj, guid) {
                obj.guid = guid;
            };
            cnsSorter = {};
            cnsSorter.sortForReappend = function(cns) { return cns; };
            cnsCore = {};
            cnsCore.find = function(item, check) {
                if(!check) return null;
                if(item == null) return null;
                if(item.id == "item") return "itemCn";
            };

            var item = new IntDraggableItem();
            ok(!item._swapPositions([]), "swapPositions with not found cn ok");

            var data = {cn: null, smallestPosCn: null, smallestPosCnGuid: null};
            item._swapCnData = function(cn1, cn2, cn2guid) {
                data.cn = cn1;
                data.smallestPosCn = cn2;
                data.smallestPosCnGuid = cn2guid;
            };
            item._item = {id: "item", guid: 1};

            var res = item._swapPositions([
                {item: {id: "cnItem", guid: 3}},
                {item: {id: "cnItem", guid: 4}},
                {item: {id: "cnItem", guid: 6}}
            ]);
            ok(res &&
               data.cn == "itemCn" &&
               data.smallestPosCn.item.guid == 1 &&
               data.smallestPosCnGuid == 3 &&
               item._item.guid == 3,
               "swapPos ok");

            clearTestData();
        },

        _swapData: function() {
            var item = new IntDraggableItem();
            var itemCn = {item: 1, itemGUID: 1};
            var smallestCn = {item: 2, itemGUID: 2};
            var smallestGuid = 2;

            item._swapCnData(itemCn, smallestCn, smallestGuid);
            ok(
                itemCn.item == 2 &&
                itemCn.itemGUID == 2 &&
                smallestCn.item == 1 &&
                smallestCn.itemGUID == 1,
                "swapData ok"
            );

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});