$(document).ready(function() {
    module("Grid");

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
                    "toNative",
                    "adjustCSS",
                    "getSizes",
                    "add",
                    "ensureNoOverflow",
                    "markByClass",
                    "markByData",
                    "resizeVgGrid",
                    "resizeHgGrid",
                    "scheduleVgResize",
                    "scheduleHgResize",
                    "scheduleResizeOnBusyRepositionQueue",
                    "scheduleResizeOnEmptyRepositionQueue"
                ]);
            });
        },

        _self: function() {
            sourceGrid = Dom.div();
            settings = new Settings();
            var grid = new Grid();

            ok(typeof gridifier.grid == "function" && typeof gridifier.gridWidth == "function"
               && typeof gridifier.gridHeight == "function", "expose fns to self ok");

            clearTestData();
        },

        _toNative: function(assert) {
            var $grid = $("<div/>");
            sourceGrid = Dom.div();

            var grid = new Grid();
            ok(Dom.isNative(grid.get()), "native grid to native ok");

            sourceGrid = [sourceGrid];
            var grid = new Grid();
            ok(Dom.isNative(grid.get()), "native grid in arr[0] to native ok");

            sourceGrid = $grid;
            var grid = new Grid();
            ok(Dom.isNative(grid.get()), "jquery grid to native ok");

            sourceGrid = {};
            assert.throws(
                function() { var grid = new Grid(); },
                /(.*)grid is not jQuery(.*)Native DOM object(.*)/,
                "incorrect grid to native ok"
            );

            clearTestData();
        },

        _adjustCSS: function() {
            sourceGrid = Dom.div();
            var grid = new Grid();

            ok(grid.get().style.position == "relative", "set grid to relative position ok");

            sourceGrid = Dom.div();
            sourceGrid.style.position = "absolute";
            $testContent.append($(sourceGrid));

            var grid = new Grid();
            ok(grid.get().style.position == "absolute", "keep grid position absolute ok");

            clearTestData();
        },

        _getSizes: function() {
            sourceGrid = Dom.div();
            Dom.css.set(sourceGrid, {
                width: "100px",
                height: "100px"
            });
            $testContent.append($(sourceGrid));

            srManager = new SizesResolverManager();
            var grid = new Grid();
            ok(grid.x2() == 99 && grid.y2() == 99 && grid.width() == 100 && grid.height() == 100,
               "get grid sizes ok");

            clearTestData();
        },

        _add: function() {
            gridItem = new Item();

            sourceGrid = Dom.div();
            $testContent.append($(sourceGrid));

            settings = new Settings();
            var grid = new Grid();
            var items = [Dom.div(), Dom.div(), Dom.div()];
            sourceGrid.appendChild(items[0]);

            var isChild = function(item) {
                return Dom.isChildOf(item, grid.get());
            }

            ok(isChild(items[0]) && !isChild(items[1]) && !isChild(items[2]), "init grid items for add ok");
            grid.add(items);
            ok(isChild(items[0]) && isChild(items[1]) && isChild(items[2]), "add items to grid ok");

            clearTestData();
        },

        _ensureNoOverflow: function(assert) {
            sourceGrid = Dom.div();
            Dom.css.set(sourceGrid, {
                width: "100px", height: "100px"
            });
            $testContent.append($(sourceGrid));

            ev = new EventEmitter();
            srManager = new SizesResolverManager();
            settings = new Settings();
            gridItem = new Item();
            var grid = new Grid();
            var item = Dom.div();
            Dom.css.set(item, {width: "100px", height: "100px"});
            sourceGrid.appendChild(item);

            grid.ensureCanFit([item]);

            var grid = new Grid();
            var item2 = Dom.div();
            Dom.css.set(item2, {width: "101px", height: "101px"});
            sourceGrid.appendChild(item2);

            assert.throws(
                function() { grid.ensureCanFit([item2]); },
                /(.*)Item (.*)px(.*)> Grid(.*)/,
                "ensureCanFit with too large item ok(vg)"
            );

            settings.set("grid", "horizontal");
            assert.throws(
                function() { grid.ensureCanFit([item2]); },
                /(.*)Item (.*)px(.*)> Grid(.*)/,
                "ensureCanFit with too large item ok(hg)"
            );

            clearTestData();
        },

        _markByClass: function() {
            var $grid = $("<div/>");
            $testContent.append($grid);
            sourceGrid = $grid;

            var $items = [$("<div/>", $("<div/>"), $("<div/>"))];
            var items = [Dom.div(), Dom.div(), Dom.div()];
            for(var i = 0; i < items.length; i++) {
                $grid.get(0).appendChild(items[i]);
                $grid.append($items[i]);
            }

            gridItem = new Item();
            settings = new Settings();
            grid = new Grid();

            grid.mark($items);
            var items = grid.mark(items);

            var allMarked = true;
            for(var i = 0; i < $items.length; i++) {
                if(!Dom.css.hasClass($items[i].get(0), "grid-item") ||
                   !Dom.css.hasClass(items[i], "grid-item")) {
                    allMarked = false;
                    break;
                }
            }

            ok(allMarked, "mark by class ok");

            clearTestData();
        },

        _markByData: function() {
            var $grid = $("<div/>");
            $testContent.append($grid);
            sourceGrid = $grid;

            var $items = [$("<div/>", $("<div/>"), $("<div/>"))];
            var items = [Dom.div(), Dom.div(), Dom.div()];
            for(var i = 0; i < items.length; i++) {
                $grid.get(0).appendChild(items[i]);
                $grid.append($items[i]);
            }

            sourceSettings = {
                data: "data-grid-item"
            };
            ev = new EventEmitter();
            gridItem = new Item();
            settings = new Settings();
            grid = new Grid();

            grid.mark($items);
            var items = grid.mark(items);

            var allMarked = true;
            for(var i = 0; i < $items.length; i++) {
                if(!Dom.has($items[i].get(0), "data-grid-item") ||
                    !Dom.has(items[i], "data-grid-item")) {
                    allMarked = false;
                    break;
                }
            }

            ok(allMarked, "mark by data ok");

            clearTestData();
        },

        _resizeVgGrid: function() {
            var grid = Dom.div();
            $testContent.get(0).appendChild(grid);
            sourceGrid = grid;
            sourceGrid.style.width = "1px";
            sourceGrid.style.height = "1px";

            ev = new EventEmitter();
            gridItem = new Item();
            var evCalls = 0;
            sourceSettings = {
                onGridResize: function(eventGrid) {
                    if(eventGrid == grid.get())
                        evCalls++;
                },
                gridResize: "disabled"
            };
            guid = new GUID();
            settings = new Settings();
            grid = new Grid();
            cnsCore = new CnsCore();
            connections = new VgConnections();

            var resize = function() {
                grid._resize.call(grid, "y2", "height", function() {
                    return grid.y2.call(grid);
                });
            }

            resize();
            ok(grid.x2() == 0 && grid.y2() == 0, "resize with no cns ok(vg)");

            var items = [Dom.div(), Dom.div(), Dom.div()];
            for(var i = 0; i < items.length; i++) {
                connections.add(items[i], {
                    x1: 0, x2: 0, y1: 0, y2: 10 + i
                });
            }

            resize();
            ok(grid.x2() == 0 && grid.y2() == 0 && evCalls == 1,
               "resize with gridResize eq disabled ok(vg)");

            settings.set("gridResize", "fit");
            resize();
            ok(grid.x2() == 0 && grid.y2() == 12 && grid.get().style.height == "13px",
               "resize with gridResize eq fit ok(vg)");

            var cns = connections.get();
            for(var i = 0; i < cns.length; i++)
                cns[i].y2 = 5;

            settings.set("gridResize", "expand");
            resize();
            ok(grid.x2() == 0 && grid.y2() == 12 && grid.get().style.height == "13px",
               "resize with gridResize eq expand to smaller size ok(vg)");

            var cns = connections.get();
            for(var i = 0; i < cns.length; i++)
                cns[i].y2 = 50;

            resize();
            ok(grid.x2() == 0 && grid.y2() == 50 && grid.get().style.height == "51px",
               "resize with gridResize eq expand to bigger size ok(vg)");

            clearTestData();
        },

        _resizeHgGrid: function() {
            var grid = Dom.div();
            $testContent.get(0).appendChild(grid);
            sourceGrid = grid;
            sourceGrid.style.width = "1px";
            sourceGrid.style.height = "1px";

            ev = new EventEmitter();
            gridItem = new Item();
            var evCalls = 0;
            sourceSettings = {
                onGridResize: function(eventGrid) {
                    if(eventGrid == grid.get())
                        evCalls++;
                },
                gridResize: "disabled"
            };
            guid = new GUID();
            settings = new Settings();
            grid = new Grid();
            cnsCore = new CnsCore();
            connections = new VgConnections();

            var resize = function() {
                grid._resize.call(grid, "x2", "width", function() {
                    return grid.x2.call(grid);
                });
            }

            resize();
            ok(grid.y2() == 0 && grid.x2() == 0, "resize with no cns ok(hg)");

            var items = [Dom.div(), Dom.div(), Dom.div()];
            for(var i = 0; i < items.length; i++) {
                connections.add(items[i], {
                    x1: 0, x2: 10 + i, y1: 0, y2: 0
                });
            }

            resize();
            ok(grid.y2() == 0 && grid.x2() == 0 && evCalls == 1,
                "resize with gridResize eq disabled ok(hg)");

            settings.set("gridResize", "fit");
            resize();
            ok(grid.y2() == 0 && grid.x2() == 12 && grid.get().style.width == "13px",
                "resize with gridResize eq fit ok(hg)");

            var cns = connections.get();
            for(var i = 0; i < cns.length; i++)
                cns[i].x2 = 5;

            settings.set("gridResize", "expand");
            resize();
            ok(grid.y2() == 0 && grid.x2() == 12 && grid.get().style.width == "13px",
                "resize with gridResize eq expand to smaller size ok(hg)");

            var cns = connections.get();
            for(var i = 0; i < cns.length; i++)
                cns[i].x2 = 50;

            resize();
            ok(grid.y2() == 0 && grid.x2() == 50 && grid.get().style.width == "51px",
                "resize with gridResize eq expand to bigger size ok(hg)");

            clearTestData();
        },

        _scheduleVgResize: function(assert) {
            var coord = null;
            var size = null;
            var getC2 = null;

            var initFn = function() {
                var sgrid = Dom.div();
                $testContent.get(0).appendChild(sgrid);
                sourceGrid = sgrid;
                sourceGrid.style.width = "1px";
                sourceGrid.style.height = "1px";
                sourceSettings = {gridResizeDelay: 0};

                repositionQueue = {isEmpty: function() { return true; }};
                ev = new EventEmitter();
                gridItem = new Item();
                guid = new GUID();
                settings = new Settings();
                var grid = new Grid();

                grid._resize = function(fncoord, fnsize, fngetC2) {
                    coord = fncoord;
                    size = fnsize;
                    getC2 = fngetC2;
                };

                grid.scheduleResize();
            };
            var checkFn = function() {
                ok(coord == "y2" && size == "height" && getC2() == 0, "schedule vg resize ok");
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        },

        _scheduleHgResize: function(assert) {
            var coord = null;
            var size = null;
            var getC2 = null;
            var callsCount = 0;

            var initFn = function() {
                var sgrid = Dom.div();
                $testContent.get(0).appendChild(sgrid);
                sourceGrid = sgrid;
                sourceGrid.style.width = "1px";
                sourceGrid.style.height = "1px";
                sourceSettings = {gridResizeDelay: 0, grid: "horizontal"};

                repositionQueue = {isEmpty: function() { return true; }};
                ev = new EventEmitter();
                gridItem = new Item();
                guid = new GUID();
                settings = new Settings();
                var grid = new Grid();

                grid._resize = function(fncoord, fnsize, fngetC2) {
                    coord = fncoord;
                    size = fnsize;
                    getC2 = fngetC2;
                    callsCount++;
                };

                grid.scheduleResize();
                grid.scheduleResize();
            };
            var checkFn = function() {
                ok(coord == "x2" && size == "width" && getC2() == 0 && callsCount == 1,
                   "schedule hg resize ok");
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        },

        _scheduleResizeOnBusyRepositionQueue: function(assert) {
            var wasResizeCalled = false;

            var initFn = function() {
                sourceGrid = Dom.div();
                sourceSettings = {gridResizeDelay: 0};

                repositionQueue = {isEmpty: function() { return false; }};
                ev = new EventEmitter();
                gridItem = new Item();
                guid = new GUID();
                settings = new Settings();
                var grid = new Grid();

                grid._resize = function() {
                    wasResizeCalled = true;
                }

                grid.scheduleResize();
            };
            var checkFn = function() {
                ok(!wasResizeCalled, "schedule resize wait for reposition queue release ok");
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        },

        _scheduleResizeOnEmptyRepositionQueue: function(assert) {
            var wasResizeCalled = false;

            var initFn = function() {
                sourceGrid = Dom.div();
                sourceSettings = {gridResizeDelay: 0};

                repositionQueue = {isEmpty: function() { return true; }};
                ev = new EventEmitter();
                gridItem = new Item();
                guid = new GUID();
                settings = new Settings();
                var grid = new Grid();

                grid._resize = function() {
                    wasResizeCalled = true;
                }

                grid.scheduleResize();
            };
            var checkFn = function() {
                ok(wasResizeCalled, "schedule resize call after reposition queue release ok");
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        }
    }

    tester.runTests();
    clearTestData();
});