$(document).ready(function() {
    module("Dragifier Touch Handlers");

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
                    "touchStartNoClosestItem",
                    "touchStartOnAlreadyDraggable",
                    "touchStart",
                    "touchEndMoveCall",
                    "touchEnd",
                    "touchMove"
                ]);
            });
        },

        _createDragifier: function() {
            dragifierApi = {};
            dragifierApi.getCoordsChanger = function() {};

            ev = new EventEmitter();
            settings = new Settings();

            return new Dragifier();
        },

        _touchStartNoClosestItem: function() {
            var data = {
                initDragEvent: null
            };

            var dragifier = this._createDragifier();
            dragifier._findClosestConnected = function(target) {
                return null;
            };
            dragifier._initDrag = function(event) {
                data.initDragEvent = event;
            };

            var fakeEvent = {
                changedTouches: [{identifier: 1}],
                target: "targetDiv"
            };

            dragifier._touch.start(fakeEvent);
            ok(data.initDragEvent == null, "touchStart handler no connected item ok");

            clearTestData();
        },

        _touchStartOnAlreadyDraggable: function() {
            var data = {
                initDragEvent: null,
                touchId: null
            };

            var dragifier = this._createDragifier();
            dragifier._findClosestConnected = function(target) {
                return (target != "targetDiv") ? null : "item";
            };
            dragifier._initDrag = function(event) {
                data.initDragEvent = event;
            };
            dragifier._isAlreadyDraggable = function(item) {
                return (item == "item");
            };
            dragifier._findAlreadyDraggable = function(item) {
                if(item != "item") return;
                return {
                    addDragId: function(id) {
                        data.touchId = id;
                    }
                };
            };

            var fakeEvent = {
                changedTouches: [{identifier: 1}],
                target: "targetDiv"
            };

            dragifier._touch.start(fakeEvent);
            ok(data.initDragEvent.target == "targetDiv" &&
               data.touchId == 1,
               "touchStart handler on already draggable item ok");

            clearTestData();
        },

        _touchStart: function() {
            var dragifier = this._createDragifier();
            dragifier._findClosestConnected = fns.t();
            dragifier._initDrag = fns.nop();
            dragifier._isAlreadyDraggable = fns.f();
            dragifier._initDraggableItem = function(item, touch, init) {
                ok(init && item && touch.identifier == 1,
                   "touchStart handler ok");
            };

            var fakeEvent = {
                changedTouches: [{identifier: 1}],
                target: "targetDiv"
            };

            dragifier._touch.start(fakeEvent);

            clearTestData();
        },

        _touchEndMoveCall: function(assert) {
            var eventData = [null, null];
            var prevented = [false, false];

            var dragifier = this._createDragifier();
            dragifier._touchEnd = function(e) { eventData[0] = e; };
            dragifier._touchMove = function(e) { eventData[1] = e; };

            var fakeEv1 = {preventDefault: function() { prevented[0] = true; }};
            var fakeEv2 = {preventDefault: function() { prevented[1] = true; }};

            dragifier._touch.end(fakeEv1);
            dragifier._touch.move(fakeEv2);
            ok(eventData[0] == null && !prevented[0], "touchEnd call without dragging ok");
            ok(eventData[1] == null && !prevented[1], "touchMove call without dragging ok");

            var initFn = function() {
                dragifier._isDragging = true;
                dragifier._touch.end(fakeEv1);
                dragifier._touch.move(fakeEv2);
            };
            var checkFn = function() {
                ok(eventData[0] != null && prevented[0], "touchEnd call ok");
                ok(eventData[1] != null && prevented[1], "touchMove call ok");
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        },

        _touchEnd: function() {
            var getData = function() {
                return {
                    removed: false,
                    unbinded: false,
                    endDrag: false
                };
            };
            var data = getData();

            var firstEvent = true;
            var lastEvent = false;
            var dragifier = this._createDragifier();
            var item = function() {
                this.rmDragId = function(id) {
                    if(id != 2 && id != 3) return;
                    data.removed = true;
                };
                this.getDragIdsCount = function() {
                    if(firstEvent) return 0;
                    if(lastEvent) return 10;
                    return 0;
                };
                this.unbind = function() {
                    data.unbinded = true;
                };
                return this;
            };
            var items = [{item: new item(), itemIndex: 0}, {item: new item(), itemIndex: 1}];
            dragifier._items = items;
            dragifier._findDraggableById = function(touchId, check) {
                if(!check) return;
                if(touchId == 1) return {item: null};
                if(touchId == 2) return items[0];
                if(touchId == 3) return items[0];
            };
            dragifier._endDrag = function() { data.endDrag = true; };

            var fakeEvent = {
                changedTouches: [{identifier: 1}, {identifier: 2}]
            };
            var fakeEvent2 = {
                changedTouches: [{identifier: 3}]
            };

            dragifier._touchEnd(fakeEvent);
            ok(!data.removed && !data.unbinded, "touchEnd call without drags ok");

            dragifier._isDragging = true;
            dragifier._touchEnd(fakeEvent);
            ok(data.removed && data.unbinded && !data.endDrag && items.length == 1,
               "touchEnd for first item ok");

            firstEvent = false;
            data = getData();
            items[0].itemIndex = 0;
            dragifier._touchEnd(fakeEvent2);
            ok(data.removed && data.unbinded && data.endDrag && items.length == 0,
               "touchEnd for second item ok");

            lastEvent = true;
            var items = [{item: new item(), itemIndex: 0}];
            dragifier._items = items;
            data = getData();
            dragifier._touchEnd(fakeEvent);
            ok(data.removed && !data.unbinded && !data.endDrag && items.length == 1,
               "touchEnd for item while other touches still active ok");

            clearTestData();
        },

        _touchMove: function() {
            var getData = function() {
                return {
                    queueSynced: false,
                    dragMoves: []
                };
            };
            var data = getData();
            var item = function() {
                this.dragMove = function(pageX, pageY) {
                    data.dragMoves.push([pageX, pageY]);
                };

                return this;
            };

            var dragifier = this._createDragifier();
            dragifier._findDraggableById = function(touchId) {
                if(touchId == 1) return null;
                if(touchId == 2) return new item();
                if(touchId == 3) return new item();
            };
            dragifier._reposQueueSync = function() {
                data.queueSynced = true;
            };

            var fakeEvent = {
                changedTouches: [
                    {identifier: 1, pageX: 10, pageY: 15},
                    {identifier: 2, pageX: 20, pageY: 25},
                    {identifier: 3, pageX: 30, pageY: 35}
                ]
            };

            dragifier._touchMove(fakeEvent);
            ok(!data.queueSynced, "touchMove call without drags ok");

            dragifier._isDragging = true;
            dragifier._touchMove(fakeEvent);
            ok(
                data.queueSynced &&
                data.dragMoves[0][0] == 20 &&
                data.dragMoves[0][1] == 25 &&
                data.dragMoves[1][0] == 30 &&
                data.dragMoves[1][1] == 35,
                "touchMove ok"
            );

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});