$(document).ready(function() {
    module("Settings");

    var tester = {
        _before: function() {
            ;
        },

        _after: function() {

        },

        runTests: function() {
            var me = this;

            test("main", function(assert) {
                var test = function(tests) {
                    me._before.call(me);

                    for(var i = 0; i < tests.length; i++)
                        me["_" + tests[i]].call(me, assert);

                    me._after.call(me);
                }

                test([
                    "initDefault",
                    "initWithCustomCoreSettings",
                    "itemSelectorTypeSet",
                    "adjustCoreSettings",
                    "initWithCustomApiSettings",
                    "getSet",
                    "getApi",
                    "setApi",
                    "addApi",
                    "eq"
                ]);
            });
        },

        _initDefault: function() {
            var settings = new Settings();
            ok(settings.get("grid") == "vertical" && settings.get("intersections") &&
               settings.get("toggleTime") == 500 && settings.get("filter").selected == "all",
               "settings obj def init ok");
        },

        _initWithCustomCoreSettings: function() {
            ev = new EventEmitter();

            sourceSettings = {
                grid: "horizontal",
                repackSize: 5,
                toggleTime: 100,
                rsort: {
                    custom: function() {}
                },
                onInsert: function() {}
            };
            var settings = new Settings();
            ok(settings.get("grid") == "horizontal" && settings.get("repackSize") == 5 &&
               typeof settings.get("rsort").custom == "function" && settings.get("toggleTime") == 100 &&
               ev._callbacks.Insert.length == 1,
               "settings obj custom init ok");
        },

        _itemSelectorTypeSet: function() {
            ev = new EventEmitter();

            sourceSettings = {
                data: "data-grid-item"
            };
            var settings = new Settings();
            ok(settings.get("class") == false && settings.get("query") == false &&
               settings.get("data") == "data-grid-item",
               "settings obj init with data selector ok");

            sourceSettings = {
                "class": "grid-item"
            };
            var settings = new Settings();
            ok(settings.get("class") == "grid-item" && settings.get("data") == false &&
               settings.get("query") == false,
               "settings obj init with query selector ok");
        },

        _adjustCoreSettings: function() {
            ev = new EventEmitter();

            sourceSettings = {
                grid: "horizontal",
                intersections: false
            };
            var settings = new Settings();
            ok(settings.get("align") == "left", "align = 'left' with hor grid, int = false");

            sourceSettings = {align: "center"};
            var settings = new Settings();
            ok(settings.eq("intersections", false), "passing align sets intersections to false");

            sourceSettings = {
                dragifierMode: "d",
                intersections: false,
                sortDispersion: false
            };
            var settings = new Settings();
            ok(settings.eq("intersections", true) && settings.eq("sortDispersion", true) &&
               settings.eq("disableQueueOnDrags", false),
               "passing dragifierMode = 'd' sets intersections & sort dispersion to true");

            sourceSettings.disableQueueOnDrags = true;
            var settings = new Settings();
            ok(settings.eq("disableQueueOnDrags", true), "passing disableQueueOnDrags with dragifierMode = 'd' ok");
        },

        _initWithCustomApiSettings: function() {
            ev = new EventEmitter();
            var eq = function(apiType, apiFn) { return typeof settings.get(apiType)[apiFn] == "function"; };

            sourceSettings = {
                "filter": {"custom": function() {}},
                "sort": {"custom": function() {}},
                "toggle": {"custom": function() {}},
                "drag": {"custom": function() {}},
                "rsort": {"custom": function() {}},
                "coordsChanger": {"custom": function() {}}
            };
            var settings = new Settings();
            ok(eq("filter", "custom") && eq("sort", "custom") && eq("toggle", "custom") &&
               eq("drag", "custom") && eq("rsort", "custom") && eq("coordsChanger", "custom"),
               "api fn names recognition ok");

            sourceSettings = {"filter": "custom"};
            var settings = new Settings();
            ok(settings.get("filter").selected == "custom", "init api setting with string ok");

            sourceSettings = {"filter": ["custom1", "custom2"]};
            var settings = new Settings();
            ok(settings.get("filter").selected[0] == "custom1" && settings.get("filter").selected[1] == "custom2",
               "init api setting with array of filters ok");

            sourceSettings = {"filter": function() {}};
            var settings = new Settings();
            ok(settings.get("filter").selected == "userfn" && typeof settings.get("filter").userfn == "function",
               "init api setting with fn ok");

            sourceSettings = {"filter": {
                "selected": "custom1",
                "custom1": function() {},
                "custom2": function() {}
            }};
            var settings = new Settings();
            ok(settings.get("filter").selected == "custom1" && typeof settings.get("filter").custom1 == "function" &&
               typeof settings.get("filter").custom2 == "function",
               "init api setting with obj of fns ok");
        },

        _getSet: function(assert) {
            ev = new EventEmitter();
            var settings = new Settings();
            assert.throws(
                function() { settings.get("notExisting"); },
                /(.*)No setting(.*)get(.*)/,
                "get not existing prop ok"
            );
            ok(settings.get("repackSize") == null, "get setting ok");

            assert.throws(
                function() { settings.set("notExisting", "test"); },
                /(.*)No setting(.*)set(.*)/,
                "set not existing prop ok"
            );
            settings.set("repackSize", 20);
            ok(settings.eq("repackSize", 20), "set setting ok");

            var evCalls = 0;
            ev.onSetSettingForNzer(function() { evCalls++; });
            settings.set([["repackSize", 40], ["grid", "horizontal"]]);
            ok(settings.eq("repackSize", 40) && settings.eq("grid", "horizontal"), "set array of settings ok");
            ok(evCalls == 2, "event for normalizer emitted ok");
        },

        _getApi: function(assert) {
            var wasCalled = false;
            sourceSettings = {"sort": {
                "selected": "custom", "custom": function() { wasCalled = true; }
            }};
            ev = new EventEmitter();
            var settings = new Settings();

            assert.throws(
                function() { settings.getApi("notExisting"); },
                /(.*)No setting(.*)getApi(.*)/,
                "getApi not existing prop ok"
            );

            settings.setApi("sort", "notExisting");
            assert.throws(
                function() { settings.getApi("sort", "notExisting"); },
                /(.*)getApi(.*)fn not found(.*)/,
                "getApi not existing fn ok"
            );

            settings.setApi("sort", "custom");
            settings.getApi("sort")();
            ok(wasCalled, "getApi selected fn call ok");

            var wasFilCalled = false;
            sourceSettings = {"filter": {
                "selected": "custom", "custom": function() { wasFilCalled = true; }
            }};
            var settings = new Settings();
            settings.getApi("filter")[0]();
            ok(wasFilCalled, "getApi filter with single filter ok");

            settings.setApi("filter", "notExisting");
            assert.throws(
                function() { settings.getApi("filter"); },
                /(.*)getApi(.*)fn not found(.*)/,
                "getApi not existing filter ok"
            );

            var wasFirstFilCalled = false;
            var wasSecondFilCalled = false;
            sourceSettings = {"filter": {
                "selected": ["custom1", "custom2"],
                "custom1": function() { wasFirstFilCalled = true; },
                "custom2": function() { wasSecondFilCalled = true; }
            }};
            var settings = new Settings();
            var filters = settings.getApi("filter");
            filters[0]();
            filters[1]();
            ok(wasFirstFilCalled && wasSecondFilCalled, "getApi filter with multiple filters ok");
        },

        _setApi: function(assert) {
            sourceSettings = {
                "sort": {"selected": "default", "custom": function() {}},
                "rsort": {"custom": function() {}}
            };

            ev = new EventEmitter();
            var settings = new Settings();

            assert.throws(
                function() { settings.setApi("notExisting"); },
                /(.*)No setting(.*)setApi(.*)/,
                "setApi not existing prop ok"
            );

            settings.setApi("sort", "custom");
            ok(settings.get("sort").selected == "custom", "setApi fn ok");

            var evCalls = 0;
            ev.onRsortChange(function() { evCalls++; });
            settings.setApi("rsort", "custom");
            ok(evCalls == 1, "setApi rsort fn int event emitted ok");
        },

        _addApi: function(assert) {
            ev = new EventEmitter();
            var settings = new Settings();

            assert.throws(
                function() { settings.addApi("notExisting"); },
                /(.*)No setting(.*)addApi(.*)/,
                "addApi not existing prop ok"
            );

            settings.addApi("sort", "custom", function() {});
            ok(typeof settings.get("sort").custom == "function", "addApi fn ok");
        },

        _eq: function(assert) {
            ev = new EventEmitter();
            var settings = new Settings();

            assert.throws(
                function() { settings.eq("notExisting", "val"); },
                /(.*)No setting(.*)eq(.*)/,
                "eq not existing prop ok"
            );

            ok(settings.eq("repackSize", null), "eq prop ok");
            ok(settings.notEq("repackSize", 20), "notEq prop ok");
        }
    }

    tester.runTests();
    clearTestData();
});