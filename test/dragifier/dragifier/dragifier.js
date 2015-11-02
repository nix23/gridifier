$(document).ready(function() {
    module("Dragifier");

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
                    "eventsCrud",
                    "initEndDrag",
                    "initDraggableItem",
                    "toggleEvents",
                    "reposQueueCrud",
                    "findClosestConnected",
                    "createDraggableItem",
                    "draggableFuncs",
                    "render"
                ]);
            });
        },

        _eventsCrud: function() {
            dragifierApi = {};
            dragifierApi.getCoordsChanger = function() {};

            ev = new EventEmitter();
            settings = new Settings();

            var origToggle = Dragifier.prototype._toggleEvents;
            Dragifier.prototype._toggleEvents = function(lt) {
                lastToggle = lt;
            };
            var dragifier = new Dragifier();
            var lastToggle = null;

            ok(!gridifier.isDragifierOn(), "isDragifierOn not on after init ok");

            gridifier.dragifierOn();
            ok(gridifier.isDragifierOn() && lastToggle == "add", "dragifierOn ok");

            lastToggle = null;
            gridifier.dragifierOn();
            ok(lastToggle == null, "second dragifierOn call ok");

            gridifier.dragifierOff();
            ok(!gridifier.isDragifierOn() && lastToggle == "rm", "dragifierOff ok");

            lastToggle = null;
            gridifier.dragifierOff();
            ok(lastToggle == null, "second dragifierOff call ok");

            sourceSettings = {dragifier: true};
            settings = new Settings();
            dragifier = new Dragifier();
            ok(gridifier.isDragifierOn(), "dragifierOn on init ok");

            Dragifier.prototype._toggleEvents = origToggle;
            clearTestData();
        },

        _initEndDrag: function() {
            dragifierApi = {};
            dragifierApi.getCoordsChanger = function() {};

            ev = new EventEmitter();
            settings = new Settings();

            var data = {
                prev: false,
                queueOn: false,
                queueOff: false,
                selectDisabled: false,
                selectEnabled: false,
                cacheStarted: false,
                cacheStopped: false
            };
            var dragifier = new Dragifier();
            dragifier._reposQueueOff = function() { data.queueOff = true; };
            dragifier._reposQueueOn = function() { data.queueOn = true; };

            srManager = {};
            srManager.startCachingTransaction = function() { data.cacheStarted = true; };
            srManager.stopCachingTransaction = function() { data.cacheStopped = true; };

            dragifierApi = {};
            dragifierApi.getSelectToggler = function() {
                return {
                    disableSelect: function() { data.selectDisabled = true; },
                    enableSelect: function() { data.selectEnabled = true; }
                };
            };

            var ev = {preventDefault: function() { data.prev = true; }};
            dragifier._initDrag(ev);
            ok(
                data.prev && data.queueOff && data.selectDisabled &&
                data.cacheStarted && dragifier._isDragging,
                "initDrag ok"
            );

            dragifier._endDrag();
            ok(
                data.queueOn && data.selectEnabled &&
                data.cacheStopped && !dragifier._isDragging,
                "endDrag ok"
            );

            clearTestData();
        },

        _initDraggableItem: function() {
            dragifierApi = {};
            dragifierApi.getCoordsChanger = function() {};

            ev = new EventEmitter();
            settings = new Settings();

            var data = {
                bindItem: null,
                bindX: null,
                bindY: null,
                touchId: null
            };

            var dragifier = new Dragifier();
            dragifier._createDraggableItem = function() {
                return {
                    id: 1,
                    bind: function(item, x, y) {
                        data.bindItem = item;
                        data.bindX = x;
                        data.bindY = y;
                    },
                    addDragId: function(touchId) {
                        data.touchId = touchId;
                    }
                };
            };

            dragifier._initDraggableItem("item", {pageX: 10, pageY: 20});
            ok(
                data.bindItem == "item" &&
                data.bindX == 10 &&
                data.bindY == 20 &&
                data.touchId == null &&
                dragifier._items.length == 1,
                "initDraggableItem ok"
            );

            dragifier._initDraggableItem(
                "item", {pageX: 20, pageY: 30, identifier: 17}, true
            );
            ok(data.touchId == 17, "initDraggableItem on touch ok");

            clearTestData();
        },

        _toggleEvents: function() {
            dragifierApi = {};
            dragifierApi.getCoordsChanger = function() {};

            ev = new EventEmitter();
            settings = new Settings();

            var data = {items: [], evNames: [], handlers: []};

            var dragifier = new Dragifier();
            var origEv = Event;
            Event = {};
            Event.add = function(p1, p2, p3) {
                data.items.push(p1);
                data.evNames.push(p2);
                data.handlers.push(p3);
            };

            grid = {};
            grid.get = function() { return "grid"; };

            dragifier._mouse = {down: "down", up: "up", move: "move"};
            dragifier._touch = {start: "start", end: "end", move: "move"};

            dragifier._toggleEvents("add");
            var recOk = function(i, p1, p2, p3, checkObj) {
                if(!checkObj)
                    cond = data.items[i] == p1;
                else
                    cond = data.items[i].nodeName == "BODY";
                return (
                    cond &&
                    data.evNames[i] == p2 &&
                    data.handlers[i] == p3
                );
            };

            ok(
                recOk(0, "grid", "mousedown", "down") &&
                recOk(1, null, "mouseup", "up", true) &&
                recOk(2, null, "mousemove", "move", true) &&
                recOk(3, "grid", "touchstart", "start") &&
                recOk(4, null, "touchend", "end", true) &&
                recOk(5, null, "touchmove", "move", true),
                "toggleEvents ok"
            );

            Event = origEv;
            clearTestData();
        },

        _reposQueueCrud: function() {
            dragifierApi = {};
            dragifierApi.getCoordsChanger = function() {};

            ev = new EventEmitter();
            settings = new Settings();
            settings.set("disableQueueOnDrags", false);
            settings.set("queueSize", 5);

            var dragifier = new Dragifier();
            var synced = false;
            var origSync = dragifier._reposQueueSync;
            dragifier._reposQueueSync = function() { synced = true; };
            gridifier.all = function() { return [1,2,3]; };

            dragifier._reposQueueOff();
            ok(!synced, "reposQueueOff on enabled queue ok");

            dragifier._reposQueueOn();
            ok(settings.get("queueSize") == 5, "reposQueueOn on enabled queue ok");

            dragifier._reposQueueSync();
            ok(settings.get("queueSize") == 5, "reposQueueSync on enabled queue ok");

            settings.set("disableQueueOnDrags", true);
            settings.set("queueSize", 2);

            dragifier._reposQueueOff();
            ok(dragifier._origReposQueueSize == 2 && synced, "reposQueueOn on disabled queue ok");

            dragifier._reposQueueSync = origSync;
            dragifier._reposQueueSync();
            ok(settings.get("queueSize") == 3, "reposQueueSync on disabled queue ok");

            dragifier._reposQueueOn();
            ok(settings.get("queueSize") == 2, "reposQueueOff on disabled queue ok");

            clearTestData();
        },

        _findClosestConnected: function() {
            dragifierApi = {};
            dragifierApi.getCoordsChanger = function() {};

            ev = new EventEmitter();
            settings = new Settings();

            var origDom = Dom;
            var wereClassChecks = false;
            Dom = {};
            Dom.css = {};
            Dom.css.hasClass = function(parentNode, className) {
                wereClassChecks = true;
                if(parentNode.id == 2 && className == "child")
                    return true;
                return false;
            };
            Dom.hasOwnProp = function() { return true; };

            gridItem = {};
            gridItem.isConnected = function(parentNode) {
                if(parentNode.id == 1) return true;
                return false;
            };

            var dragifier = new Dragifier();

            grid = {};
            grid.get = function() { return "grid"; };
            ok(dragifier._findClosestConnected("grid") == null,
               "findClosestConnected with grid param ok");

            var root = {id: 1, parentNode: "grid"};
            var child = {id: 2, parentNode: root};
            var childChild = {id: 3, parentNode: child};

            var fakeRoot = {id: 6, parentNode: "grid"};
            var fakeRootChild = {id: 7, parentNode: fakeRoot};

            ok(dragifier._findClosestConnected(fakeRootChild) == null,
               "findClosestConnected without class check and no connected item ok");

            ok(dragifier._findClosestConnected(childChild).id == 1 && !wereClassChecks,
               "findClosestConnected without class check and connected item ok");

            settings._settings.dragifier = "child";

            ok(dragifier._findClosestConnected(fakeRootChild) == null,
               "findClosestConnected with class check and no connected item ok");

            ok(dragifier._findClosestConnected(childChild).id == 1 && wereClassChecks,
               "findClosestConnected with class check and connected item ok");

            Dom.css.hasClass = fns.f();
            ok(dragifier._findClosestConnected(childChild) == null,
               "findClosestConnected with no class and connected item ok");

            Dom = origDom;
            clearTestData();
        },

        _createDraggableItem: function() {
            dragifierApi = {};
            dragifierApi.getCoordsChanger = function() {};

            ev = new EventEmitter();
            settings = new Settings();

            var origID = IntDraggableItem;
            var origDI = DiscrDraggableItem;

            IntDraggableItem = function() { this.id = 10; };
            DiscrDraggableItem = function() { this.id = 20; };

            var dragifier = new Dragifier();
            ok(dragifier._createDraggableItem().id == 10, "createDraggableItem ok");

            settings._settings.dragifierMode = "d";
            ok(dragifier._createDraggableItem().id == 20,
               "createDraggableItem with discr ok");

            IntDraggableItem = origID;
            DiscrDraggableItem = origDI;
            clearTestData();
        },

        _draggableFuncs: function(assert) {
            dragifierApi = {};
            dragifierApi.getCoordsChanger = function() {};

            ev = new EventEmitter();
            settings = new Settings();

            guid = {};
            guid.get = function(item) { return item.id; };

            var dragifier = new Dragifier();
            var hasDragId = function(id) {
                return id == 5;
            };
            dragifier._items = [
                {get: function() { return {id: 1}; }, hasDragId: fns.f()},
                {get: function() { return {id: 2}; }, hasDragId: fns.f()},
                {get: function() { return {id: 3}; }, hasDragId: hasDragId}
            ];

            ok(dragifier._isAlreadyDraggable({id: 2}), "isAlreadyDraggable ok");
            ok(!dragifier._isAlreadyDraggable({id: 5}), "isAlreadyDraggable not ok");

            ok(dragifier._findAlreadyDraggable({id: 2}).get().id == 2, "findAlreadyDraggable ok");
            assert.throws(
                function() { dragifier._findAlreadyDraggable({id: 5}); },
                /Drag.item NF./,
                "findAlreadyDraggable not existing ok"
            );

            ok(dragifier._findDraggableById(5).get().id == 3, "findDraggableById ok");

            var data = dragifier._findDraggableById(5, true);
            ok(data.item.get().id == 3 && data.itemIndex == 2,
               "findDraggableById with fetch index ok");

            clearTestData();
        },

        _render: function() {
            dragifierApi = {};
            dragifierApi.getCoordsChanger = function() {
                return function(item, left, top, dom) {
                    ok(item == "item" && left == "left" && top == "top" && dom.id == "dom",
                        "render ok");
                };
            };

            ev = new EventEmitter();
            settings = new Settings();

            var origDom = Dom;
            Dom = {id: "dom"};
            Dom.hasOwnProp = fns.t();

            var dragifier = new Dragifier();
            dragifier.render("item", "left", "top");

            Dom = origDom;
            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});