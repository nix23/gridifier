$(document).ready(function() {
    module("CssManager");

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
                    "self",
                    "toggleCss",
                    "addRemoveCss",
                    "saveEventData",
                    "emitAddEvent",
                    "emitRemoveEvent",
                    "emitEventsForMultipleItems"
                ]);
            });
        },

        _self: function() {
            var fns = ["toggle", "add", "rm"];
            for(var i = 0; i < fns.length; i++) {
                var targetFnName = fns[i];
                var wasUpdateAsCalled = false;
                var wasReposCalled = false;
                var wasChangeCssCalled = false;

                antialiaser = {
                    updateAs: function() {
                        wasUpdateAsCalled = true;
                    }
                };
                reposition = {
                    fromFirstSortedCn: function() {
                        wasReposCalled = true;
                    }
                };

                var cssManager = new CssManager();
                cssManager.changeCss = function(fnName) {
                    if(fnName == targetFnName)
                        wasChangeCssCalled = true;
                };
                var result = gridifier[targetFnName + "Css"]();

                ok(wasUpdateAsCalled && wasReposCalled && wasChangeCssCalled && result == gridifier,
                   targetFnName + "Css call ok");
            }
        },

        _toggleCss: function() {
            gridItem = new Item();
            guid = new GUID();
            var cssManager = new CssManager();

            var $items = [$("<div/>"), $("<div/>"), $("<div/>")];
            var items = [Dom.div(), Dom.div(), Dom.div()];
            for(var i = 0; i < items.length; i++) {
                gridItem.markAsConnected($items[i].get(0));
                gridItem.markAsConnected(items[i]);
            }

            items = cssManager.changeCss("toggle", items, "class1");
            cssManager.changeCss("toggle", $items, ["class1", "class2"]);
            var areAllToggled = true;
            for(var i = 0; i < items.length; i++) {
                if(!$(items[i]).hasClass("class1") || !$items[i].hasClass("class1") ||
                   !$items[i].hasClass("class2")) {
                    areAllToggled = false;
                    break;
                }
            }

            ok(areAllToggled, "toggle classes set ok");

            items = cssManager.changeCss("toggle", items, "class1");
            cssManager.changeCss("toggle", $items, ["class1", "class2"]);
            var areAllToggled = true;
            for(var i = 0; i < items.length; i++) {
                if($(items[i]).hasClass("class1") || $items[i].hasClass("class1") ||
                   $items[i].hasClass("class2")) {
                    areAllToggled = false;
                    break;
                }
            }

            ok(areAllToggled, "toggle classes rm ok");
        },

        _addRemoveCss: function() {
            gridItem = new Item();
            guid = new GUID();
            var cssManager = new CssManager();

            var $items = [$("<div/>"), $("<div/>"), $("<div/>")];
            var items = [Dom.div(), Dom.div(), Dom.div()];
            for(var i = 0; i < items.length; i++) {
                gridItem.markAsConnected($items[i].get(0));
                gridItem.markAsConnected(items[i]);
            }

            items = cssManager.changeCss("add", items, "class1");
            cssManager.changeCss("add", $items, ["class1", "class2"]);
            var areAllAdded = true;
            for(var i = 0; i < items.length; i++) {
                if(!$(items[i]).hasClass("class1") || !$items[i].hasClass("class1") ||
                    !$items[i].hasClass("class2")) {
                    areAllToggled = false;
                    break;
                }
            }

            ok(areAllAdded, "add classes ok");

            items = cssManager.changeCss("rm", items, "class1");
            cssManager.changeCss("rm", $items, ["class1", "class2"]);
            var areAllRemoved = true;
            for(var i = 0; i < items.length; i++) {
                if($(items[i]).hasClass("class1") || $items[i].hasClass("class1") ||
                    $items[i].hasClass("class2")) {
                    areAllRemoved = false;
                    break;
                }
            }

            ok(areAllRemoved, "rm classes ok");
        },

        _saveEventData: function() {
            settings = new Settings();
            ev = new EventEmitter();
            gridItem = new Item();
            guid = new GUID();
            var cssManager = new CssManager();

            var items = [Dom.div(), Dom.div(), Dom.div()];
            for(var i = 0; i < items.length; i++) {
                gridItem.markAsConnected(items[i]);
                guid.markForAppend(items[i]);
            }

            cssManager.changeCss("add", items, "class1");
            ok(cssManager._eventsData[0].itemGUID == 10000 &&
               cssManager._eventsData[0].added.length == 1 &&
               cssManager._eventsData[0].added[0] == "class1" &&
               cssManager._eventsData[0].removed.length == 0,
               "save single event data ok");

            cssManager.changeCss("add", items[0], "class2");
            ok(cssManager._eventsData[0].itemGUID == 10000 &&
               cssManager._eventsData[0].added.length == 1 &&
               cssManager._eventsData[0].added[0] == "class2" &&
               cssManager._eventsData[0].removed.length == 0,
               "update single event data ok");

            cssManager.changeCss("rm", items[1], "class1");
            ok(cssManager._eventsData[1].itemGUID == 10001 &&
               cssManager._eventsData[1].added.length == 0 &&
               cssManager._eventsData[1].removed[0] == "class1" &&
               cssManager._eventsData[1].removed.length == 1,
               "remove single event data ok");
        },

        _emitAddEvent: function(assert) {
            var item1 = null;
            var added1 = null;
            var removed1 = null;
            var item2 = null;
            var added2 = null;
            var removed2 = null;

            var initFn = function() {
                sourceSettings = {
                    onCssChange: function(evitem, evadded, evremoved) {
                        if(guid.get(evitem) == "10000") {
                            item1 = evitem;
                            added1 = evadded;
                            removed1 = evremoved;
                        }
                        else if(guid.get(evitem) == "10001") {
                            item2 = evitem;
                            added2 = evadded;
                            removed2 = evremoved;
                        }
                    },
                    coordsChangeTime: 0
                };
                ev = new EventEmitter();
                settings = new Settings();
                gridItem = new Item();
                guid = new GUID();
                var cssManager = new CssManager();

                cssManager.emitEvents([]);
                ok(item1 == null && item2 == null, "emitEvents with no eventsData ok");

                var items = [Dom.div(), Dom.div(), Dom.div()];
                for(var i = 0; i < items.length; i++) {
                    gridItem.markAsConnected(items[i]);
                    guid.markForAppend(items[i]);
                }

                cssManager.changeCss("add", items[0], "class1");
                cssManager.changeCss("add", items[1], ["class1", "class2"]);
                var cns = [
                    {itemGUID: 10000, item: items[0]},
                    {itemGUID: 10001, item: items[1]}
                ];
                cssManager.emitEvents(cns);
            };
            var checkFn = function() {
                ok(guid.get(item1) == "10000" && added1.length == 1 &&
                   added1[0] == "class1" && removed1.length == 0 &&
                   guid.get(item2) == "10001" && added2.length == 2 &&
                   added2[0] == "class1" && added2[1] == "class2" &&
                   removed2.length == 0,
                   "emit add class events ok");
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        },

        _emitRemoveEvent: function(assert) {
            var item1 = null;
            var added1 = null;
            var removed1 = null;
            var item2 = null;
            var added2 = null;
            var removed2 = null;

            var initFn = function() {
                sourceSettings = {
                    onCssChange: function(evitem, evadded, evremoved) {
                        if(guid.get(evitem) == "10000") {
                            item1 = evitem;
                            added1 = evadded;
                            removed1 = evremoved;
                        }
                        else if(guid.get(evitem) == "10001") {
                            item2 = evitem;
                            added2 = evadded;
                            removed2 = evremoved;
                        }
                    },
                    coordsChangeTime: 0
                };
                ev = new EventEmitter();
                settings = new Settings();
                gridItem = new Item();
                guid = new GUID();
                var cssManager = new CssManager();

                var items = [Dom.div(), Dom.div(), Dom.div()];
                for(var i = 0; i < items.length; i++) {
                    gridItem.markAsConnected(items[i]);
                    guid.markForAppend(items[i]);
                }

                cssManager.changeCss("add", items[0], "class1");
                cssManager.changeCss("add", items[1], ["class1", "class2"]);
                cssManager.changeCss("rm", items[0], "class1");
                cssManager.changeCss("rm", items[1], ["class1", "class2"]);
                var cns = [
                    {itemGUID: 10000, item: items[0]},
                    {itemGUID: 10001, item: items[1]}
                ];
                cssManager.emitEvents(cns);
            };
            var checkFn = function() {
                ok(guid.get(item1) == "10000" && added1.length == 0 &&
                    removed1[0] == "class1" && removed1.length == 1 &&
                    guid.get(item2) == "10001" && added2.length == 0 &&
                    removed2[0] == "class1" && removed2[1] == "class2" &&
                    removed2.length == 2,
                    "emit rm class events ok");
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        },

        _emitEventsForMultipleItems: function(assert) {
            var item1 = null;
            var added1 = null;
            var removed1 = null;
            var item2 = null;
            var added2 = null;
            var removed2 = null;
            var cssManager = null;

            var initFn = function() {
                sourceSettings = {
                    onCssChange: function(evitem, evadded, evremoved) {
                        if(guid.get(evitem) == "10000") {
                            item1 = evitem;
                            added1 = evadded;
                            removed1 = evremoved;
                        }
                        else if(guid.get(evitem) == "10001") {
                            item2 = evitem;
                            added2 = evadded;
                            removed2 = evremoved;
                        }
                    },
                    coordsChangeTime: 0
                };
                ev = new EventEmitter();
                settings = new Settings();
                gridItem = new Item();
                guid = new GUID();
                cssManager = new CssManager();

                var items = [Dom.div(), Dom.div(), Dom.div()];
                for(var i = 0; i < items.length; i++) {
                    gridItem.markAsConnected(items[i]);
                    guid.markForAppend(items[i]);
                }

                // Testing fast calls in a row(rm-ed classname should still be emitted)
                cssManager.changeCss("rm", [items[0], items[1]], "class1");
                cssManager.changeCss("rm", [items[0], items[1]], "class1");
                var cns = [
                    {itemGUID: 10000, item: items[0]},
                    {itemGUID: 10001, item: items[1]}
                ];
                cssManager.emitEvents(cns);
            };
            var checkFn = function() {
                ok(guid.get(item1) == "10000" && added1.length == 0 &&
                    removed1[0] == "class1" && removed1.length == 1 &&
                    guid.get(item2) == "10001" && added2.length == 0 &&
                    removed2[0] == "class1" && removed2.length == 1 &&
                    // Events data should be removed
                    cssManager._eventsData.length == 0,
                    "emit events for multiple items ok");
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        }
    }

    tester.runTests();
    clearTestData();
});