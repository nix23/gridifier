$(document).ready(function() {
    module("Collector");

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
                    "crud",
                    "collectByClass",
                    "collectByData",
                    "collectByQuery",
                    "collectCustom",
                    "filter",
                    "sort"
                ]);
            });
        },

        _self: function() {
            settings = new Settings();
            var collector = new Collector();

            ok(typeof gridifier.collect == "function" && typeof gridifier.collectNew == "function"
               && typeof gridifier.collectConnected == "function", "expose fns to self ok");

            clearTestData();
        },

        _crud: function() {
            var items = [Dom.div(), Dom.div()];
            var collector = new Collector();

            collector.markAsNotCollectable(items[0]);
            ok(collector.isNotCollectable(items[0]), "item is not collectable ok");
            ok(collector.filterCollectable(items).length == 1, "filter collectable items ok");

            collector.unmarkAsNotCollectable(items[0]);
            ok(!collector.isNotCollectable(items[0]), "items is collectable ok");
            ok(collector.filterCollectable(items).length == 2, "filter collectable items without not coll-le ok");
        },

        _collectByClass: function() {
            var $grid = $("<div/>");
            $testContent.append($grid);
            sourceGrid = $grid;

            var items = [Dom.div(), Dom.div(), Dom.div()];
            for(var i = 0; i < items.length; i++) {
                $grid.get(0).appendChild(items[i]);
                items[i].setAttribute("class", "grid-item");
            }
            var fakeItem = Dom.div();
            $grid.get(0).appendChild(fakeItem);

            settings = new Settings();
            grid = new Grid();

            var collector = new Collector();
            ok(collector.collect().length == 3, "collect items by class ok");

            collector.markAsNotCollectable(items[0]);
            ok(collector.collect().length == 2, "collect items with not collectable by class ok");

            clearTestData();
        },

        _collectByData: function() {
            ev = new EventEmitter();

            var $grid = $("<div/>");
            $testContent.append($grid);
            sourceGrid = $grid;

            var items = [Dom.div(), Dom.div(), Dom.div()];
            for(var i = 0; i < items.length; i++) {
                $grid.get(0).appendChild(items[i]);
                items[i].setAttribute("data-grid-item", "y");
            }
            var fakeItem = Dom.div();
            $grid.get(0).appendChild(fakeItem);

            sourceSettings = {data: "data-grid-item"};
            settings = new Settings();
            grid = new Grid();

            var collector = new Collector();
            ok(collector.collect().length == 3, "collect items by data ok");

            collector.markAsNotCollectable(items[0]);
            ok(collector.collect().length == 2, "collect items with not collectable by data ok");

            clearTestData();
        },

        _collectByQuery: function() {
            ev = new EventEmitter();

            var $grid = $("<div/>");
            $testContent.append($grid);
            sourceGrid = $grid;

            var items = [Dom.div(), Dom.div(), Dom.div()];
            for(var i = 0; i < items.length; i++) {
                $grid.get(0).appendChild(items[i]);
            }

            sourceSettings = {query: "> div"};
            settings = new Settings();
            grid = new Grid();

            var collector = new Collector();
            ok(collector.collect().length == 3, "collect items by query ok");

            collector.markAsNotCollectable(items[0]);
            ok(collector.collect().length == 2, "collect items with not collectable by query ok");

            clearTestData();
        },

        _collectCustom: function() {
            ev = new EventEmitter();

            var $grid = $("<div/>");
            $testContent.append($grid);
            sourceGrid = $grid;

            var items = [Dom.div(), Dom.div(), Dom.div()];
            for(var i = 0; i < items.length; i++) {
                $grid.get(0).appendChild(items[i]);
                items[i].setAttribute("class", "grid-item");
            }

            gridItem = new Item();
            gridItem.markAsConnected(items[0]);
            gridItem.markAsConnected(items[1]);

            settings = new Settings();
            grid = new Grid();

            var collector = new Collector();
            ok(collector.collectByQuery("div").length == 3, "collectByQuery ok");
            ok(collector.collectConnected().length == 2, "collectConnected ok");
            ok(collector.collectDisconnected().length == 1, "collectDisconnected ok");

            clearTestData();
        },

        _filter: function() {
            settings = new Settings();
            var collector = new Collector();

            var items = [Dom.div(), Dom.div(), Dom.div()];
            ok(collector.filter(items).length == 3, "default filter ok");

            items[0].setAttribute("class", "filterTest");
            sourceSettings = {
                filter: function(item) { return $(item).hasClass("filterTest"); }
            }

            settings = new Settings();
            var collector = new Collector();
            ok(collector.filter(items).length == 1, "custom filter ok");

            items[0].setAttribute("class", "filterTest filterTest2");
            items[1].setAttribute("class", "filterTest filterTest2");
            sourceSettings = {
                filter: {
                    selected: ["filterTest", "filterTest2"],
                    filterTest: function(item) {
                        return $(item).hasClass("filterTest");
                    },
                    filterTest2: function(item) {
                        return $(item).hasClass("filterTest2");
                    }
                }
            };

            settings = new Settings();
            var collector = new Collector();
            ok(collector.filter(items).length == 2, "multiple custom filters ok");

            clearTestData();
        },

        _sort: function() {
            sortHelpers = new SortHelpers();
            var items = [];
            for(var i = 0; i < 5; i++) {
                var item = Dom.div();
                Dom.set(item, "data-test-item-index", i + 1);
                Dom.set(item, "data-test-custom-sort-index", 5 - i);
                items.push(item);
            }

            sourceSettings = {
                sort: {
                    custom: function(first, second, sort, dom) {
                        return sort.byDataInt(first, second, "data-test-custom-sort-index");
                    }
                }
            };
            settings = new Settings();
            var collector = new Collector();
            var sorted = collector.sort(items);

            var correctOrder = true;
            for(var i = 0; i < sorted.length; i++) {
                if(Dom.int(Dom.get(sorted[i], "data-test-item-index")) != i + 1) {
                    correctOrder = false;
                    break;
                }
            }

            ok(correctOrder, "sort by default order ok");

            settings.setApi("sort", "custom");
            var sorted = collector.sort(items);

            var correctOrder = true;
            for(var i = 0; i < sorted.length; i++) {
                if(Dom.int(Dom.get(sorted[i], "data-test-custom-sort-index")) != i + 1) {
                    correctOrder = false;
                    break;
                }
            }

            ok(correctOrder, "sort with custom fn ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});