$(document).ready(function() {
    module("Dragifier Core");

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
                    "calcGridOffsets",
                    "getOffset",
                    "findItemCenterCursorOffsets",
                    //"getMaxCnItemZ",
                    "createClone",
                    "createPointer",
                    "calcCloneNewDocPosition",
                    "calcCloneNewGridPosition",
                    "dragIdCrud",
                    "itemCrud",
                    "repositionItems",
                    "reposition",
                    "repositionWithDelay"
                ]);
            });
        },

        _calcGridOffsets: function() {
            srManager = {};
            srManager.offsetLeft = function(grid) {
                if(grid != "grid") return null;
                return 10;
            };
            srManager.offsetTop = function(grid) {
                if(grid != "grid") return null;
                return 20;
            };
            grid = {};
            grid.get = function() { return "grid"; };

            var dragifierCore = new DragifierCore();
            dragifierCore.calcGridOffsets();

            ok(
                dragifierCore._gridOffset.left == 10 &&
                dragifierCore._gridOffset.top == 20,
                "calcGridOffsets ok"
            );

            clearTestData();
        },

        _getOffset: function() {
            ev = new EventEmitter();
            settings = new Settings();

            cnsCore = {};
            cnsCore.find = function(item) {
                if(item != "item") return null;
                return {
                    x1: 10, x2: 50, y1: 100, y2: 150,
                    hOffset: 25, vOffset: 15
                };
            };
            srManager = {};
            srManager.outerWidth = function(item, im) {
                if(item != "item") return null;
                return (im) ? 20 : 10;
            };
            srManager.outerHeight = function(item, im) {
                if(item != "item") return null;
                return (im) ? 20 : 10;
            };

            var core = new DragifierCore();
            core._gridOffset.left = 10;
            core._gridOffset.top = 15;

            ok(core._getOffsetLeft("item") == 20, "getOffsetLeft ok");
            ok(core._getOffsetLeft("item", true) == 15, "getOffsetLeft with margins ok");
            ok(core._getOffsetTop("item") == 115, "getOffsetTop ok");
            ok(core._getOffsetTop("item", true) == 110, "getOffsetTop with margins ok");

            sourceSettings = {intersections: false};
            settings = new Settings();

            ok(core._getOffsetLeft("item") == 20, "getOffsetLeft vg and int ok");
            ok(core._getOffsetLeft("item", true) == 15, "getOffsetLeft vg and int with margins ok");
            ok(core._getOffsetTop("item") == 130, "getOffsetTop vg and int ok");
            ok(core._getOffsetTop("item", true) == 125, "getOffsetTop vg and int with margins ok");

            sourceSettings = {intersections: false, grid: "horizontal"};
            settings = new Settings();

            ok(core._getOffsetLeft("item") == 45, "getOffsetLeft hg and int ok");
            ok(core._getOffsetLeft("item", true) == 40, "getOffsetLeft hg and int with margins ok");
            ok(core._getOffsetTop("item") == 115, "getOffsetTop hg and int ok");
            ok(core._getOffsetTop("item", true) == 110, "getOffsetTop hg and int with margins ok");

            clearTestData();
        },

        _findItemCenterCursorOffsets: function() {
            srManager = {};
            srManager.outerWidth = function(item, im) {
                if(item != "item" || !im) return null;
                return 10;
            };
            srManager.outerHeight = function(item, im) {
                if(item != "item" || !im) return null;
                return 20;
            };

            var core = new DragifierCore();
            core._getOffsetLeft = function(item) {
                if(item != "item") return null;
                return 30;
            };
            core._getOffsetTop = function(item) {
                if(item != "item") return null;
                return 40;
            };

            core.findItemCenterCursorOffsets("item", 15, 30);
            ok(core._itemCenterCursorOffset.x == 20 &&
               core._itemCenterCursorOffset.y == 20,
               "fintItemCenterCursosOffsets ok");

            clearTestData();
        },

        // _getMaxCnItemZ: function() {
        //     connections = {};
        //     connections.get = function() {
        //         return [
        //             {item: {style: {zIndex: 4}}},
        //             {item: {style: {zIndex: 1}}},
        //             {item: {style: {zIndex: 3}}},
        //             {item: {style: {zIndex: 2}}}
        //         ];
        //     };

        //     var origDom = Dom;
        //     Dom = {int: function(i) { return parseInt(i, 10); }};

        //     var core = new DragifierCore();
        //     ok(core._getMaxCnItemZ() == 4, "getMaxCnItemZ ok");

        //     Dom = origDom;
        //     clearTestData();
        // },

        _createClone: function() {
            var origDom = Dom;
            var origSizesResolver = SizesResolver;
            SizesResolver = {};
            SizesResolver.getComputedCSS = function(item) {
                if(item.id != "item") return null;
                return "compCss";
            };

            Dom = {};
            Dom.hasTransitions = function() { return true; };
            Dom.css3 = {};
            Dom.css3.transform = function(clone, val) {
                if(!$(clone).hasClass("nodeClone") || val != "") return null;
                data.css3transform = true;
            };
            Dom.css3.transition = function(clone, val) {
                if(!$(clone).hasClass("nodeClone") || val != "none") return null;
                data.css3transition = true;
            };
            Dom.css = {};
            Dom.css.set = function(clone, params) {
                if(!$(clone).hasClass("nodeClone")) return null;
                data.cssSetParams = params;
            };
            Dom.css.set4 = function(clone, param, compCss) {
                data.set4Param = param;
                data.set4CompCss = compCss;
                clone.setAttribute("class", "testCreateCloneSet4");
            };

            dragifier = {};
            dragifier.render = function(clone, left, top) {
                data.renderClone = clone;
                data.renderLeft = left;
                data.renderTop = top;
            };

            var core = new DragifierCore();
            core._getOffsetLeft = function(item) {
                if(item.id != "item") return null;
                return 10;
            };
            core._getOffsetTop = function(item) {
                if(item.id != "item") return null;
                return 20;
            };
            // core._getMaxCnItemZ = function() { return 45; };

            var data = {
                cloned: false,
                markedItem: null,
                dragClone: null,
                dragItem: null,
                dragSrManager: null,
                css3transform: false,
                css3transition: false,
                cssSetParams: null,
                set4Param: null,
                set4CompCss: null,
                renderClone: null,
                renderLeft: null,
                renderTop: null
            };

            var div = {id: "item"};
            div.cloneNode = function(param) {
                if(param) data.cloned = true;
                clone = document.createElement("div");
                $(clone).addClass("nodeClone");
                return clone;
            };

            collector = {};
            collector.markAsNotCollectable = function(clone) {
                if($(clone).hasClass("nodeClone")) data.markedItem = clone;
            };
            srManager = {id: "srManager"};
            srManager.outerWidth = function(item) {
                if(item.id != "item") return null;
                return 10;
            };
            srManager.outerHeight = function(item) {
                if(item.id != "item") return null;
                return 20;
            };

            settings = {};
            settings.getApi = function(name) {
                if(name != "drag") return null;
                return function(clone, item, srManager) {
                    data.dragClone = clone;
                    data.dragItem = item;
                    data.dragSrManager = srManager;
                };
            };

            var clone = core.createClone(div);
            ok(
                $(clone).hasClass("testCreateCloneSet4") &&
                data.cloned &&
                $(data.markedItem).hasClass("testCreateCloneSet4") &&
                $(data.dragClone).hasClass("testCreateCloneSet4") &&
                data.dragItem.id == "item" &&
                data.dragSrManager.id == "srManager" &&
                data.css3transform &&
                data.css3transition &&
                data.cssSetParams.width == "10px" &&
                data.cssSetParams.height == "20px" &&
                data.cssSetParams.zIndex == C.MAX_Z &&
                data.cssSetParams.left == "10px" &&
                data.cssSetParams.top == "20px" &&
                data.set4Param == "margin" &&
                data.set4CompCss == "compCss" &&
                $(data.renderClone).hasClass("testCreateCloneSet4") &&
                data.renderLeft == 10 &&
                data.renderTop == 20,
                "createClone ok"
            );

            Dom = origDom;
            SizesResolver = origSizesResolver;
            clearTestData();
        },

        _createPointer: function() {
            var origDom = Dom;
            var origSizesResolver = SizesResolver;
            SizesResolver = {};
            SizesResolver.getComputedCSS = function(item) {
                if(item.id != "item") return null;
                return {marginLeft: 50, marginTop: 60};
            };
            srManager = {};
            srManager.outerWidth = function(item, im) {
                if(item.id != "item" || !im) return null;
                return 10;
            };
            srManager.outerHeight = function(item, im) {
                if(item.id != "item" || !im) return null;
                return 20;
            };

            Dom = {id: "dom"};
            Dom.div = function() { return "pointer"; };
            Dom.css = {};
            Dom.css.set = function(pointer, params) {
                if(pointer != "pointer") return null;
                data.pointerParams = params;
            };

            grid = {};
            grid.get = function() {
                return {appendChild: function(pointer) {
                    data.appendChildPointer = pointer;
                }};
            };

            dragifier = {};
            dragifier.render = function(clone, left, top) {
                data.renderClone = clone;
                data.renderLeft = left;
                data.renderTop = top;
            };

            dragifierApi = {};
            dragifierApi.getPointerStyler = function() {
                return function(pointer, dom) {
                    data.dragifierApiPointer = pointer;
                    data.dragifierApiDom = dom;
                };
            };

            var core = new DragifierCore();
            core._gridOffset.left = 5;
            core._gridOffset.top = 5;
            core._getOffsetLeft = function(item) {
                if(item.id != "item") return null;
                return 10;
            };
            core._getOffsetTop = function(item) {
                if(item.id != "item") return null;
                return 20;
            };

            var data = {
                pointerParams: null,
                appendChildPointer: null,
                dragifierApiPointer: null,
                dragifierApiDom: null,
                renderClone: null,
                renderLeft: null,
                renderTop: null
            };

            var div = {id: "item"};
            var pointer = core.createPointer(div);
            ok(
                pointer == "pointer" &&
                data.pointerParams.width == "10px" &&
                data.pointerParams.height == "20px" &&
                data.pointerParams.position == "absolute" &&
                data.pointerParams.left == "5px" &&
                data.pointerParams.top == "15px" &&
                data.appendChildPointer == "pointer" &&
                data.dragifierApiPointer == "pointer" &&
                data.dragifierApiDom.id == "dom" &&
                data.renderClone == "pointer" &&
                data.renderLeft == 55 &&
                data.renderTop == 75,
                "createPointer ok"
            );

            Dom = origDom;
            SizesResolver = origSizesResolver;
            clearTestData();
        },

        _calcCloneNewDocPosition: function() {
            srManager = {};
            srManager.outerWidth = function(item, im) {
                if(item != "item" || !im) return null;
                return 10;
            };
            srManager.outerHeight = function(item, im) {
                if(item != "item" || !im) return null;
                return 20;
            };

            var core = new DragifierCore();
            core._itemCenterCursorOffset.x = 5;
            core._itemCenterCursorOffset.y = 10;

            var pos = core.calcCloneNewDocPosition("item", 100, 200);
            ok(pos.x == 100 && pos.y == 200, "calcCloneNewDocPosition ok");

            clearTestData();
        },

        _calcCloneNewGridPosition: function() {
            srManager = {};
            srManager.outerWidth = function(item, im) {
                if(item != "item" || !im) return null;
                return 10;
            };
            srManager.outerHeight = function(item, im) {
                if(item != "item" || !im) return null;
                return 20;
            };

            var core = new DragifierCore();
            core._gridOffset.left = 10;
            core._gridOffset.top = 20;

            var pos = core.calcCloneNewGridPosition("item", {x: 15, y: 35});
            ok(
                pos.x1 == 5 &&
                pos.x2 == 14 &&
                pos.y1 == 15 &&
                pos.y2 == 34,
                "calcCloneNewGridPosition ok"
            );

            clearTestData();
        },

        _dragIdCrud: function() {
            var core = new DragifierCore();

            ok(core.hasDragId(10, [20,30,10]), "hasDragId ok");
            ok(!core.hasDragId(15, [20,30,10]), "hasDragId no id ok");
            ok(!core.hasDragId(15, []), "hasDragid in empty arr ok");

            var ids = [2,3,4];
            core.rmDragId(2, ids);
            core.rmDragId(4, ids);
            ok(ids.length == 1 && ids[0] == 3, "rmDragId ok");

            clearTestData();
        },

        _itemCrud: function() {
            var origDom = Dom;
            Dom = {};

            Dom.hasTransitions = function() { return true; };
            Dom.css3 = {};
            Dom.css3.transitionProperty = function(item, prop) {
                item.style = prop;
            };
            Dom.set = function(item, attr, val) {
                item[attr] = val;
            };
            Dom.rm = function(item, val) {
                item.rm = val;
            };

            var core = new DragifierCore();
            var item = {style: {visibility: ""}};

            core.initItem(item);
            ok(item.style == "Visibility 0ms ease", "initItem ok");

            item = {style: {visibility: ""}};
            core.hideItem(item);
            ok(item.style.visibility == "hidden" && item[C.IS_DRAGGABLE_DATA] == "y",
               "hideItem ok");

            core.showItem(item);
            ok(item.style.visibility == "visible" && item.rm == C.IS_DRAGGABLE_DATA,
               "showItem ok");

            Dom = origDom;
            clearTestData();
        },

        _repositionItems: function() {
            ev = new EventEmitter();
            settings = new Settings();

            var data = {
                appCrCreated: false,
                revAppCrCreated: false,
                reposition: false,
                evItems: null
            };

            connectors = {};
            connectors.setNextFlushCb = function(cb) { cb(); };

            appender = {};
            appender.createInitialCr = function() { data.appCrCreated = true; };
            reversedAppender = {};
            reversedAppender.createInitialCr = function() { data.revAppCrCreated = true; };

            ev = {};
            ev.onRepositionEndForDrag = function(cb) { cb(); };
            ev.emit = function(evName, items) {
                if(evName == EV.DRAG_END) data.evItems = items;
            };
            connections = {};
            connections.get = function() { return [{item: 1}, {item: 2}]};
            cnsSorter = {};
            cnsSorter.sortForReappend = function(cns) { return cns; };

            var core = new DragifierCore();
            core._reposition = function() { data.reposition = true; };

            core.repositionItems();
            ok(
                data.appCrCreated && data.reposition && data.evItems.length == 2 &&
                data.evItems[0] == 1 && data.evItems[1] == 2,
                "repositionItems ok"
            );

            sourceSettings = {append: "reversed"};
            ev = new EventEmitter();
            settings = new Settings();
            ev = {};
            ev.onRepositionEndForDrag = function(cb) { cb(); };
            ev.emit = function(evName, items) {
                if(evName == EV.DRAG_END) data.evItems = items;
            };
            core.repositionItems();
            ok(data.revAppCrCreated, "repositionItems on rev app ok");

            clearTestData();
        },

        _reposition: function() {
            origDom = Dom;
            Dom = {};
            Dom.browsers = {};
            Dom.browsers.isAndroidFirefox = function() { return false; };
            Dom.browsers.isAndroidUC = function() { return false; };

            reposition = {};
            reposition.all = function() { ok("reposition ok"); };

            var core = new DragifierCore();
            core._reposition();

            Dom = origDom;
            clearTestData();
        },

        _repositionWithDelay: function(assert) {
            var wasCalled = false;
            var origDelay = null;
            var origDom = null;
            var callsCount = 0;

            var initFn = function() {
                origDelay = C.DRAGIFIER_REPOS_DELAY;
                C.DRAGIFIER_REPOS_DELAY = 0;
                origDom = Dom;
                Dom = {};
                Dom.browsers = {};
                Dom.browsers.isAndroidFirefox = function() { return true; };
                Dom.browsers.isAndroidUC = function() { return true; };

                reposition = {};
                reposition.all = function() { wasCalled = true; callsCount++; };

                var core = new DragifierCore();
                core._reposition();
                core._reposition();
            };
            var checkFn = function() {
                ok(wasCalled && callsCount == 1, "reposition with delay was called");
                C.DRAGIFIER_REPOS_DELAY = origDelay;
                Dom = origDom;
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        }
    }

    tester.runTests();
    clearTestData();
});