$(document).ready(function() {
    module("Sort API tester.");

    var _sortApiSortComparatorToolsTester = {
        _sortApi: {},

        _createItemMock: function() {
            return {
                _attrs: {},

                getAttribute: function(attrName) {
                    return this._attrs[attrName];
                },

                setAttribute: function(attrName, attrValue) {
                    this._attrs[attrName] = attrValue;
                },

                removeAttribute: function(attrName) {
                    this._attrs[attrName] = null;
                }
            };
        },

        _sortItems: function(items, comparatorFn) {
            var sortComparatorTools = this._sortApi.getSortComparatorTools();

            sortComparatorTools.saveOriginalOrder(items);

            return items.sort(
                function(firstItem, secondItem) {
                    return comparatorFn(firstItem, secondItem, sortComparatorTools);
                }
            );
        },

        _before: function() {
            this._sortApi = new Gridifier.Api.Sort();
        },

        _after: function() {
            clearTestData();
        },

        runTests: function() {
            var me = this;

            test("_sortComparatorTools", function(assert) {
                me._before.call(me);

                me._testByOriginalPos();

                me._testByDataSortWithOneComparatorOnArrayWithAllUniqueItems();
                me._testByDataSortWithOneComparatorOnArrayWithAllUniqueItemsDesc();
                me._testByDataSortWithOneComparatorOnArrayWithSomeEqualItems();
                me._testByDataSortWithMultipleComparatorsOnArrayWithAllUniqueItems();
                me._testByDataSortWithMultipleComparatorsOnArrayWithSomeEqualItems();

                me._testByDataIntSortOnMixedArray();
                me._testByDataFloatSortOnMixedArray();

                me._testByContentSortOnMixedArray();
                me._testByContentIntSortOnMixedArray();
                me._testByContentFloatSortOnMixedArray();

                me._testByQueryOnMixedArray();
                me._testByQueryIntOnMixedArray();
                me._testByQueryFloatOnMixedArray();
                me._testByQueryIntOnMixedArrayWithReplacers();

                me._after.call(me);
            });
        },


        _testByOriginalPos: function() {
            var items = [];
            for(var i = 0; i < 4; i++)
                items.push(this._createItemMock());

            var comparatorFn = function(firstItem, secondItem, sort) {
                return sort.byOriginalPos(firstItem, secondItem);
            }

            items[0].setAttribute("original-position-tester", 1);
            items[1].setAttribute("original-position-tester", 2);
            items[2].setAttribute("original-position-tester", 3);
            items[3].setAttribute("original-position-tester", 4);

            items = this._sortItems(items, comparatorFn);

            ok(
                items[0].getAttribute("original-position-tester") == 1 &&
                items[1].getAttribute("original-position-tester") == 2 &&
                items[2].getAttribute("original-position-tester") == 3 &&
                items[3].getAttribute("original-position-tester") == 4,
                "comparatorTools sort.byOriginalPos"
            );
        },

        _testByDataSortWithOneComparatorOnArrayWithAllUniqueItems: function() {
            var items = [];
            for(var i = 0; i < 4; i++)
                items.push(this._createItemMock());

            var comparatorFn = function(firstItem, secondItem, sort) {
                return sort.byData(firstItem, secondItem, "data-sort-id");
            }

            items[0].setAttribute("data-sort-id", 6);
            items[1].setAttribute("data-sort-id", 11);
            items[2].setAttribute("data-sort-id", 8);
            items[3].setAttribute("data-sort-id", 1);

            items = this._sortItems(items, comparatorFn);

            ok(
                items[0].getAttribute("data-sort-id") == 1 &&
                items[1].getAttribute("data-sort-id") == 6 &&
                items[2].getAttribute("data-sort-id") == 8 &&
                items[3].getAttribute("data-sort-id") == 11,
                "comparatorTools sort.byData(1 comparator) array of unique items(numbers)."
            );

            items[0].setAttribute("data-sort-id", "Bob");
            items[1].setAttribute("data-sort-id", "Alice");
            items[2].setAttribute("data-sort-id", "Tom");
            items[3].setAttribute("data-sort-id", "Steve");

            items = this._sortItems(items, comparatorFn);

            ok(
                items[0].getAttribute("data-sort-id") == "Alice" &&
                items[1].getAttribute("data-sort-id") == "Bob" &&
                items[2].getAttribute("data-sort-id") == "Steve" &&
                items[3].getAttribute("data-sort-id") == "Tom",
                "comparatorTools sort.byData(1 comparator) array of unique items(strings)."
            );
        },

        _testByDataSortWithOneComparatorOnArrayWithAllUniqueItemsDesc: function() {
            var items = [];
            for(var i = 0; i < 4; i++)
                items.push(this._createItemMock());

            var comparatorFn = function(firstItem, secondItem, sort) {
                return sort.byData(firstItem, secondItem, "data-sort-id", true);
            }

            items[0].setAttribute("data-sort-id", 6);
            items[1].setAttribute("data-sort-id", 11);
            items[2].setAttribute("data-sort-id", 8);
            items[3].setAttribute("data-sort-id", 1);

            items = this._sortItems(items, comparatorFn);

            ok(
                items[0].getAttribute("data-sort-id") == 11 &&
                items[1].getAttribute("data-sort-id") == 8 &&
                items[2].getAttribute("data-sort-id") == 6 &&
                items[3].getAttribute("data-sort-id") == 1,
                "comparatorTools sort.byData(1 comparator) array of unique items(numbers desc)."
            );
        },

        _testByDataSortWithOneComparatorOnArrayWithSomeEqualItems: function() {
            var items = [];
            for(var i = 0; i < 11; i++)
                items.push(this._createItemMock())

            var comparatorFn = function(firstItem, secondItem, sort) {
                return sort.byData(firstItem, secondItem, "data-sort-id");
            }

            items[0].setAttribute("data-sort-id", 8);
            items[1].setAttribute("data-sort-id", 11);
            items[2].setAttribute("data-sort-id", 8);
            items[3].setAttribute("data-sort-id", 1);
            // Add some dummy data(chrome enables unstable sort on items count > 10)
            items[4].setAttribute("data-sort-id", 15);
            items[5].setAttribute("data-sort-id", 16);
            items[6].setAttribute("data-sort-id", 17);
            items[7].setAttribute("data-sort-id", 18);
            items[8].setAttribute("data-sort-id", 19);
            items[9].setAttribute("data-sort-id", 20);
            items[10].setAttribute("data-sort-id", 21);

            items[0].setAttribute("original-position-tester", 1);
            items[2].setAttribute("original-position-tester", 2);

            items = this._sortItems(items, comparatorFn);

            ok(
                items[0].getAttribute("data-sort-id") == 1 &&
                items[1].getAttribute("data-sort-id") == 8 &&
                items[2].getAttribute("data-sort-id") == 8 &&
                items[3].getAttribute("data-sort-id") == 11 &&
                items[1].getAttribute("original-position-tester") == 1 &&
                items[2].getAttribute("original-position-tester") == 2,
                "comparatorTools sort.byData(1 comparator) array with some equal items"
            );
        },

        _testByDataSortWithMultipleComparatorsOnArrayWithAllUniqueItems: function() {
            var items = [];
            for(var i = 0; i < 4; i++)
                items.push(this._createItemMock())

            var comparatorFn = function(firstItem, secondItem, sort) {
                return sort.byData(firstItem, secondItem, ["data-sort-id", "data-sort-subid"]);
            }

            items[0].setAttribute("data-sort-id", 16);
            items[0].setAttribute("data-sort-subid", 1);

            items[1].setAttribute("data-sort-id", 11);
            items[1].setAttribute("data-sort-subid", 2);

            items[2].setAttribute("data-sort-id", 13);
            items[2].setAttribute("data-sort-subid", 3);

            items[3].setAttribute("data-sort-id", 1);
            items[3].setAttribute("data-sort-subid", 4);

            items = this._sortItems(items, comparatorFn);

            ok(
                items[0].getAttribute("data-sort-id") == 1 &&
                items[1].getAttribute("data-sort-id") == 11 &&
                items[2].getAttribute("data-sort-id") == 13 &&
                items[3].getAttribute("data-sort-id") == 16,
                "comparatorTools sort.byData(2 comparators) array with all unique items"
            );
        },

        _testByDataSortWithMultipleComparatorsOnArrayWithSomeEqualItems: function() {
            var items = [];
            for(var i = 0; i < 11; i++)
                items.push(this._createItemMock())

            var comparatorFn = function(firstItem, secondItem, sort) {
                return sort.byData(firstItem, secondItem, ["data-sort-id", "data-sort-subid"]);
            }

            items[0].setAttribute("data-sort-id", 16);
            items[0].setAttribute("data-sort-subid", 3);

            items[1].setAttribute("data-sort-id", 15);
            items[1].setAttribute("data-sort-subid", 2);
            items[1].setAttribute("data-original-position-tester", 1);

            items[2].setAttribute("data-sort-id", 16);
            items[2].setAttribute("data-sort-subid", 1);

            items[3].setAttribute("data-sort-id", 15);
            items[3].setAttribute("data-sort-subid", 2);
            items[3].setAttribute("data-original-position-tester", 2);

            // Add some dummy data(chrome enables unstable sort on items count > 10)
            items[4].setAttribute("data-sort-id", 34);
            items[4].setAttribute("data-sort-subid", 34);
            items[5].setAttribute("data-sort-id", 36);
            items[5].setAttribute("data-sort-subid", 36);
            items[6].setAttribute("data-sort-id", 77);
            items[6].setAttribute("data-sort-subid", 77);
            items[7].setAttribute("data-sort-id", 38);
            items[7].setAttribute("data-sort-subid", 38);
            items[8].setAttribute("data-sort-id", 39);
            items[8].setAttribute("data-sort-subid", 39);
            items[9].setAttribute("data-sort-id", 40);
            items[9].setAttribute("data-sort-subid", 40);
            items[10].setAttribute("data-sort-id", 41);
            items[10].setAttribute("data-sort-subid", 41);

            items = this._sortItems(items, comparatorFn);

            ok(
                items[0].getAttribute("data-sort-id") == 15 && items[0].getAttribute("data-original-position-tester") == 1 &&
                items[1].getAttribute("data-sort-id") == 15 && items[1].getAttribute("data-original-position-tester") == 2 &&
                items[2].getAttribute("data-sort-id") == 16 && items[2].getAttribute("data-sort-subid") == 1 &&
                items[3].getAttribute("data-sort-id") == 16 && items[3].getAttribute("data-sort-subid") == 3,
                "comparatorTools sort.byData(2 comparators) array with some equal items"
            );
        },

        _testByDataIntSortOnMixedArray: function() {
            var items = [];
            for(var i = 0; i < 4; i++)
                items.push(this._createItemMock());

            var comparatorFn = function(firstItem, secondItem, sort) {
                return sort.byDataInt(firstItem, secondItem, "data-sort-id");
            }

            items[0].setAttribute("data-sort-id", "152");
            items[1].setAttribute("data-sort-id", "30");
            items[2].setAttribute("data-sort-id", "152");
            items[3].setAttribute("data-sort-id", "9000");

            items[0].setAttribute("original-position-tester", 1);
            items[2].setAttribute("original-position-tester", 2);

            items = this._sortItems(items, comparatorFn);

            ok(
                items[0].getAttribute("data-sort-id") == 30 &&
                items[1].getAttribute("data-sort-id") == 152 &&
                items[2].getAttribute("data-sort-id") == 152 &&
                items[3].getAttribute("data-sort-id") == 9000 &&
                items[1].getAttribute("original-position-tester") == 1 &&
                items[2].getAttribute("original-position-tester") == 2,
                "comparatorTools sort.byDataInt mixed array"
            );
        },

        _testByDataFloatSortOnMixedArray: function() {
            var items = [];
            for(var i = 0; i < 4; i++)
                items.push(this._createItemMock());

            var comparatorFn = function(firstItem, secondItem, sort) {
                return sort.byDataFloat(firstItem, secondItem, "data-sort-id");
            }

            items[0].setAttribute("data-sort-id", "152.15");
            items[1].setAttribute("data-sort-id", "30.12");
            items[2].setAttribute("data-sort-id", "152.15");
            items[3].setAttribute("data-sort-id", "9000.11");

            items[0].setAttribute("original-position-tester", 1);
            items[2].setAttribute("original-position-tester", 2);

            items = this._sortItems(items, comparatorFn);

            ok(
                items[0].getAttribute("data-sort-id") == 30.12 &&
                items[1].getAttribute("data-sort-id") == 152.15 &&
                items[2].getAttribute("data-sort-id") == 152.15 &&
                items[3].getAttribute("data-sort-id") == 9000.11 &&
                items[1].getAttribute("original-position-tester") == 1 &&
                items[2].getAttribute("original-position-tester") == 2,
                "comparatorTools sort.byDataFloat mixed array"
            );
        },

        _testByContentSortOnMixedArray: function() {
            var items = [];
            for(var i = 0; i < 4; i++)
                items.push(this._createItemMock());

            var comparatorFn = function(firstItem, secondItem, sort) {
                return sort.byContent(firstItem, secondItem);
            }

            items[0].innerHTML = "first";
            items[1].innerHTML = "second";
            items[2].innerHTML = "first";
            items[3].innerHTML = "third";

            items[0].setAttribute("original-position-tester", 1);
            items[2].setAttribute("original-position-tester", 2);

            items = this._sortItems(items, comparatorFn);

            ok(
                items[0].innerHTML == "first" &&
                items[1].innerHTML == "first" &&
                items[2].innerHTML == "second" &&
                items[3].innerHTML == "third" &&
                items[0].getAttribute("original-position-tester") == 1 &&
                items[1].getAttribute("original-position-tester") == 2,
                "comparatorTools sort.byContent mixed array"
            );
        },

        _testByContentIntSortOnMixedArray: function() {
            var items = [];
            for(var i = 0; i < 4; i++)
                items.push(this._createItemMock());

            var comparatorFn = function(firstItem, secondItem, sort) {
                return sort.byContentInt(firstItem, secondItem);
            }

            items[0].innerHTML = "166";
            items[1].innerHTML = "16";
            items[2].innerHTML = "2";
            items[3].innerHTML = "1";

            items = this._sortItems(items, comparatorFn);

            ok(
                items[0].innerHTML == "1" &&
                items[1].innerHTML == "2" &&
                items[2].innerHTML == "16" &&
                items[3].innerHTML == "166",
                "comparatorTools sort.byContent mixed array"
            );
        },

        _testByContentFloatSortOnMixedArray: function() {
            var items = [];
            for(var i = 0; i < 4; i++)
                items.push(this._createItemMock());

            var comparatorFn = function(firstItem, secondItem, sort) {
                return sort.byContentFloat(firstItem, secondItem);
            }

            items[0].innerHTML = "166.15";
            items[1].innerHTML = "16.12";
            items[2].innerHTML = "2.10";
            items[3].innerHTML = "1.13";

            items = this._sortItems(items, comparatorFn);

            ok(
                items[0].innerHTML == "1.13" &&
                items[1].innerHTML == "2.10" &&
                items[2].innerHTML == "16.12" &&
                items[3].innerHTML == "166.15",
                "comparatorTools sort.byContentFloat mixed array"
            );
        },

        _testByQueryOnMixedArray: function() {
            clearTestData();

            var items = [];
            for(var i = 0; i < 4; i++) {
                var $testerDiv = $("<div/>");
                var $child = $("<div/>").addClass("child");
                $testerDiv.append($child);
                $testContent.append($testerDiv);

                items.push($testerDiv.get(0));
            }

            var comparatorFn = function(firstItem, secondItem, sort) {
                return sort.byQuery(firstItem, secondItem, ".child");
            }

            $(items[0]).find(".child").text("first");
            $(items[1]).find(".child").text("second");
            $(items[2]).find(".child").text("first");
            $(items[3]).find(".child").text("third");

            items = this._sortItems(items, comparatorFn);

            ok(
                $(items[0]).text() == "first" &&
                $(items[1]).text() == "first" &&
                $(items[2]).text() == "second" &&
                $(items[3]).text() == "third",
                "comparatorTools sort.byQuery mixed array"
            );
        },

        _testByQueryIntOnMixedArray: function() {
            clearTestData();

            var items = [];
            for(var i = 0; i < 4; i++) {
                var $testerDiv = $("<div/>");
                var $child = $("<div/>").addClass("child");
                $testerDiv.append($child);
                $testContent.append($testerDiv);

                items.push($testerDiv.get(0));
            }

            var comparatorFn = function(firstItem, secondItem, sort) {
                return sort.byQueryInt(firstItem, secondItem, ".child");
            }

            $(items[0]).find(".child").text("166");
            $(items[1]).find(".child").text("16");
            $(items[2]).find(".child").text("33");
            $(items[3]).find(".child").text("1");

            items = this._sortItems(items, comparatorFn);

            ok(
                $(items[0]).text() == "1" &&
                $(items[1]).text() == "16" &&
                $(items[2]).text() == "33" &&
                $(items[3]).text() == "166",
                "comparatorTools sort.byQueryInt mixed array"
            );
        },

        _testByQueryFloatOnMixedArray: function() {
            clearTestData();

            var items = [];
            for(var i = 0; i < 4; i++) {
                var $testerDiv = $("<div/>");
                var $child = $("<div/>").addClass("child");
                $testerDiv.append($child);
                $testContent.append($testerDiv);

                items.push($testerDiv.get(0));
            }

            var comparatorFn = function(firstItem, secondItem, sort) {
                return sort.byQueryFloat(firstItem, secondItem, ".child");
            }

            $(items[0]).find(".child").text("166.16");
            $(items[1]).find(".child").text("16.1");
            $(items[2]).find(".child").text("33.6");
            $(items[3]).find(".child").text("1.17");

            items = this._sortItems(items, comparatorFn);

            ok(
                $(items[0]).text() == "1.17" &&
                $(items[1]).text() == "16.1" &&
                $(items[2]).text() == "33.6" &&
                $(items[3]).text() == "166.16",
                "comparatorTools sort.byQueryFloat mixed array"
            );
        },

        _testByQueryIntOnMixedArrayWithReplacers: function() {
            clearTestData();

            var items = [];
            for(var i = 0; i < 4; i++) {
                var $testerDiv = $("<div/>");
                var $child = $("<div/>").addClass("child");
                $testerDiv.append($child);
                $testContent.append($testerDiv);

                items.push($testerDiv.get(0));
            }

            var comparatorFn = function(firstItem, secondItem, sort) {
                return sort.byQueryInt(firstItem, secondItem, ".child", false, [["#", ""], ["!", ""]]);
            }

            $(items[0]).find(".child").text("#1!66");
            $(items[1]).find(".child").text("#1!6");
            $(items[2]).find(".child").text("#3!3");
            $(items[3]).find(".child").text("#1!");

            items = this._sortItems(items, comparatorFn);

            ok(
                $(items[0]).text() == "#1!" &&
                $(items[1]).text() == "#1!6" &&
                $(items[2]).text() == "#3!3" &&
                $(items[3]).text() == "#1!66",
                "comparatorTools sort.byQueryInt mixed array with replacers"
            );
        }
    };

    _sortApiSortComparatorToolsTester.runTests();
});