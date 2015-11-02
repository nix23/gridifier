$(document).ready(function() {
    module("EventEmitter");

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
                    "init",
                    "emitWrongEvent",
                    "emit",
                    "emitReposition",
                    "emitHardDisconnect",
                    "emitInsert",
                    "emitMultipleInsert",
                    "emitWrongIntEvent",
                    "emitInternal",
                    "rmInternal"
                ]);
            });
        },

        _init: function() {
            var ev = new EventEmitter();
            var hasAllCallbacks = function(names) {
                var isArr = true;
                for(var i = 0; i < names.length; i++) {
                    if(!Dom.isArray(ev._callbacks[names[i]]))
                        isArr = false;
                }

                return isArr;
            };
            var hasAllIntCallbacks = function(names) {
                var hasAll = true;
                for(var i = 0; i < names.length; i++) {
                    if(typeof ev._callbacks[names[i]] == null)
                        hasAll = false;
                }

                return hasAll;
            };

            var events = [
                "Show", "Hide", "GridResize", "CssChange",
                "RepositionEnd", "Reposition", "Disconnect",
                "Insert", "DragEnd"
            ];
            var intEvents = [
                "RepositionEndForDrag", "BeforeShowForRsort",
                "SetSettingForNzer", "RsortChange"
            ];

            ok(hasAllCallbacks(events), "all event callbacks init ok");
            ok(hasAllIntCallbacks(intEvents), "all internal event callbacks init ok");

            for(var i = 0; i < events.length; i++) {
                gridifier["on" + events[i]](function() {});
                gridifier["on" + events[i]](function() {});
            }
            for(var i = 0; i < intEvents.length; i++)
                ev["on" + intEvents[i]](function() {});

            var hasAllFnCallbacks = function(events) {
                var hasAll = true;
                for(var i = 0; i < events.length; i++) {
                    if(typeof ev._callbacks[events[i]][0] != "function" ||
                       typeof ev._callbacks[events[i]][1] != "function")
                        hasAll = false;
                }

                return hasAll;
            };
            var hasAllIntFnCallbacks = function(events) {
                var hasAll = true;
                for(var i = 0; i < events.length; i++) {
                    if(typeof ev._callbacks[events[i]] != "function")
                        hasAll = false;
                }

                return hasAll;
            };

            ok(hasAllFnCallbacks(events), "has all event callback fns");
            ok(hasAllIntCallbacks(intEvents), "has all internal event callback fns");

            clearTestData();
        },

        _emitWrongEvent: function(assert) {
            var ev = new EventEmitter();
            assert.throws(
                function() { ev.emit("wrongEvent"); },
                /(.*)no(.*)to emit(.*)/,
                "emit wrong event ok"
            );
        },

        _emit: function() {
            var ev = new EventEmitter();
            var firstEmitted = false;
            var secondEmitted = false;
            var firstArgOk = false;
            var secondArgOk = false;

            gridifier.onShow(function(arg1, arg2) {
                firstArgOk = (arg1 == 10);
                secondArgOk = (arg2 == "test");
                firstEmitted = true;
            });
            gridifier.onShow(function(arg1, arg2) {
                secondEmitted = true;
                firstArgOk = (arg1 == 10);
                secondArgOk = (arg2 == "test");
            });

            ev.emit(EV.SHOW, 10, "test");
            ok(firstEmitted && secondEmitted && firstArgOk && secondArgOk,
               "events emitted ok");

            clearTestData();
        },

        _emitReposition: function(assert) {
            var firstEmitted = false;
            var secondEmitted = false;
            var firstArgOk = false;
            var secondArgOk = false;

            var initFn = function() {
                var ev = new EventEmitter();
                gridifier.onReposition(function(arg1, arg2) {
                    firstArgOk = (arg1 == 10);
                    secondArgOk = (arg2 == "test");
                    firstEmitted = true;
                });
                gridifier.onReposition(function(arg1, arg2) {
                    secondEmitted = true;
                    firstArgOk = (arg1 == 10);
                    secondArgOk = (arg2 == "test");
                });

                ev.emit(EV.REPOSITION, 10, "test");
            };
            var checkFn = function() {
                ok(firstEmitted && secondEmitted && firstArgOk && secondArgOk,
                   "reposition event emitted ok");
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        },

        _emitHardDisconnect: function() {
            collector = new Collector();
            var ev = new EventEmitter();
            var firstHideOk = false;
            var secondHideOk = false;
            var firstDiscOk = false;
            var secondDiscOk = false;

            var item = Dom.div();
            collector.markAsNotCollectable(item);

            gridifier.onHide(function(i) { firstHideOk = (i.nodeName == "DIV"); });
            gridifier.onHide(function(i) { secondHideOk = (i.nodeName == "DIV"); });
            gridifier.onDisconnect(function(i) { firstDiscOk = (i.nodeName == "DIV"); });
            gridifier.onDisconnect(function(i) { secondDiscOk = (i.nodeName == "DIV"); });

            ev.emit(EV.HIDE, item);
            ok(firstHideOk && secondHideOk && firstDiscOk && secondDiscOk,
               "hard disconnect event emit ok");

            clearTestData();
        },

        _emitInsert: function(assert) {
            var areItemsValid = false;

            var initFn = function() {
                var ev = new EventEmitter();
                ev._insertEvTimeout = {};
                ev._insertEvItems = [{id: 1}, {id: 2}];

                gridifier.onInsert(function(items) {
                    areItemsValid = items[0].id == 3 && items[1].id == 4 &&
                                    items[2].id == 1 && items[3].id == 2;
                });
                gridifier.onInsert(function(items) {
                    areItemsValid = items[0].id == 3 && items[1].id == 4 &&
                                    items[2].id == 1 && items[3].id == 2;
                });

                ev.emit(EV.INSERT, [{id: 3}, {id: 4}]);
            };
            var checkFn = function() {
                ok(areItemsValid, "insert event emitted ok");
            };

            asyncTests.add(assert, initFn, checkFn, 40, this);
        },

        _emitMultipleInsert: function(assert) {
            var areItemsValid = false;

            var initFn = function() {
                var ev = new EventEmitter();

                gridifier.onInsert(function(items) {
                    areItemsValid = items[0].id == 3 && items[1].id == 4 &&
                    items[2].id == 1 && items[3].id == 2;
                });
                gridifier.onInsert(function(items) {
                    areItemsValid = items[0].id == 3 && items[1].id == 4 &&
                    items[2].id == 1 && items[3].id == 2;
                });

                ev.emit(EV.INSERT, [{id: 1}, {id: 2}]);
                ev.emit(EV.INSERT, [{id: 3}, {id: 4}]);
            };
            var checkFn = function() {
                ok(areItemsValid, "insert event emitted ok");
            };

            asyncTests.add(assert, initFn, checkFn, 40, this);
        },

        _emitWrongIntEvent: function(assert) {
            var ev = new EventEmitter();
            assert.throws(
                function() { ev.emitInternal("wrongEvent"); },
                /(.*)no(.*)to emit(.*)/,
                "emit wrong internal event ok"
            );
        },

        _emitInternal: function() {
            var ev = new EventEmitter();
            ev.emitInternal(INT_EV.RSORT_CHANGE);
            ok(ev._callbacks.RsortChange == null, "emit null internal event ok");

            var wasEmitted = false;
            var param = null;
            ev.onRsortChange(function(arg) { wasEmitted = true; param = arg; });
            ev.emitInternal(INT_EV.RSORT_CHANGE, "param");
            ok(wasEmitted && param == "param", "emit internal event ok");

            ev.onRsortChange(null);
            ok(ev._callbacks.RsortChange == null, "internal event eq null after update");

            var wasEmitted = false;
            ev.onRepositionEndForDrag(function() { wasEmitted = true; });
            ev.emitInternal(INT_EV.REPOSITION_END_FOR_DRAG);
            ok(wasEmitted && ev._callbacks.RepositionEndForDrag == null, "emit repositionEndForDrag ev ok");

            clearTestData();
        },

        _rmInternal: function() {
            var ev = new EventEmitter();
            ev.onRsortChange(function() {});
            ok(typeof ev._callbacks.RsortChange == "function", "rmInternal init ok");

            ev.rmInternal(INT_EV.RSORT_CHANGE);
            ok(ev._callbacks.RsortChange == null, "rmInternal event ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});