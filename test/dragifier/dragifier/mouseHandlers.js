$(document).ready(function() {
    module("Dragifier Mouse Handlers");

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
                    "mouseUpMoveCall",
                    "mouseDown",
                    "mouseUp",
                    "mouseMove"
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

        _mouseUpMoveCall: function(assert) {
            var eventData = [null, null];

            var dragifier = this._createDragifier();
            dragifier._mouseUp = function(e) { eventData[0] = e; };
            dragifier._mouseMove = function(e) { eventData[1] = e; };

            var fakeEv1 = "ev";
            var fakeEv2 = "ev2";

            dragifier._mouse.up(fakeEv1);
            dragifier._mouse.move(fakeEv2);
            ok(eventData[0] == null, "mouseUp call without dragging ok");
            ok(eventData[1] == null, "mouseMove call without dragging ok");

            var initFn = function() {
                dragifier._isDragging = true;
                dragifier._mouse.up(fakeEv1);
                dragifier._mouse.move(fakeEv2);
            };
            var checkFn = function() {
                ok(eventData[0] == "ev", "mouseUp call ok");
                ok(eventData[1] == "ev2", "mouseMove call ok");
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        },

        _mouseDown: function() {
            var getData = function() {
                return {
                    initDragEvent: null,
                    initItemItem: null,
                    initItemEvent: null,
                    initItemBool: null
                };
            };
            var data = getData();
            var dragifier = this._createDragifier();
            dragifier._findClosestConnected = function(target) {
               return target;
            };
            dragifier._initDrag = function(ev) {
                data.initDragEvent = ev;
            };
            dragifier._initDraggableItem = function(item, ev, bool) {
                data.initItemItem = item;
                data.initItemEvent = ev;
                data.initItemBool = bool;
            };
            var origDom = Dom;
            Dom = {};
            Dom.browsers = {};
            Dom.browsers.isAndroidUC = fns.t();

            dragifier._mouse.down({target: null});
            ok(data.initDragEvent == null, "mouse down with no closest item ok");

            dragifier._mouse.down({target: "item"});
            ok(data.initDragEvent == null, "mouse down with bad browser ok");

            Dom.browsers.isAndroidUC = fns.f();
            dragifier._mouse.down({target: "item"});
            ok(
                data.initDragEvent.target == "item" &&
                data.initItemItem == "item" &&
                data.initItemEvent.target == "item" &&
                !data.initItemBool,
                "mouse down ok"
            );

            Dom = origDom;
            clearTestData();
        },

        _mouseUp: function() {
            var getData = function() {
                return {
                    dragEnd: false,
                    unbinded: []
                };
            };
            var data = getData();
            var dragifier = this._createDragifier();
            dragifier._endDrag = function() { data.dragEnd = true; };

            var origDom = Dom;
            Dom = {};
            Dom.browsers = {};
            Dom.browsers.isAndroidUC = fns.f();

            dragifier._mouseUp({});
            ok(!data.dragEnd, "mouseUp without dragging ok");

            Dom.browsers.isAndroidUC = fns.t();
            dragifier._isDragging = true;
            dragifier._mouseUp({});
            ok(!data.dragEnd, "mouseUp with bad browser ok");

            dragifier._items = [
                {unbind: function() { data.unbinded.push(true); }}
            ];
            Dom.browsers.isAndroidUC = fns.f();
            dragifier._mouseUp({});
            ok(data.dragEnd && data.unbinded[0] && dragifier._items.length == 0,
               "mouseUp ok");

            Dom = origDom;
            clearTestData();
        },

        _mouseMove: function() {
            var getData = function() {
                return {
                    synced: false,
                    dragMove: []
                };
            };
            var data = getData();
            var dragifier = this._createDragifier();
            dragifier._reposQueueSync = function() { data.synced = true; };

            var origDom = Dom;
            Dom = {};
            Dom.browsers = {};
            Dom.browsers.isAndroidUC = fns.f();

            dragifier._mouseMove({});
            ok(!data.synced, "mouseMove without dragging ok");

            Dom.browsers.isAndroidUC = fns.t();
            dragifier._isDragging = true;
            dragifier._mouseMove({});
            ok(!data.synced, "mouseMove with bad browser ok");

            dragifier._items = [
                {dragMove: function(x, y) { data.dragMove.push([x, y]); }}
            ];
            Dom.browsers.isAndroidUC = fns.f();
            dragifier._mouseMove({pageX: 10, pageY: 20});
            ok(
                data.synced &&
                data.dragMove[0][0] == 10 &&
                data.dragMove[0][1] == 20,
                "mouseMove ok"
            );

            Dom = origDom;
            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});