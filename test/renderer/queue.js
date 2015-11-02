$(document).ready(function() {
    module("RendererQueue");

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
                    "reinit",
                    "scheduleOnSilentRender",
                    "schedule",
                    "getApi",
                    "process",
                    "show",
                    "hide",
                    "render",
                    "delayedRender",
                    "execRender"
                ]);
            });
        },

        _reinit: function(assert) {
            var queue = new RendererQueue();
            queue._reinit();
            ok(Dom.isArray(queue._queue), "reinit ok");

            var wasCalled = false;

            var initFn = function() {
                queue._queueTimeout = setTimeout(function() {
                    wasCalled = true;
                }, 20);
                queue._reinit();
                queue._reinit();
            };
            var checkFn = function() {
                ok(!wasCalled, "reinit after reinit ok");
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        },

        _scheduleOnSilentRender: function() {
            silentRenderer = {};
            silentRenderer.isScheduled = function(item) {
                return (item == "item");
            };

            var queue = new RendererQueue();
            queue.schedule(RENDER_OPS.SHOW, {item: "item"});
            ok(queue._queue.length == 0, "schedule on silent render ok");

            clearTestData();
        },

        _schedule: function(assert) {
            var queue = new RendererQueue();
            var origDelay = null;
            var processCalled = false;
            var callsCount = 0;

            var initFn = function() {
                origDelay = C.RENDER_QUEUE_DELAY;
                C.RENDER_QUEUE_DELAY = 0;

                silentRenderer = {isScheduled: function() { return false; }};
                queue._process = function() { callsCount++; processCalled = true; };
                queue.schedule("op", {item: "item"}, "left", "top", 100);
                queue.schedule("op", {item: "item"}, "left", "top", 100);
            };
            var checkFn = function() {
                ok(callsCount == 1 &&
                   processCalled &&
                   queue._queue.length == 2 &&
                   queue._queue[0].op == "op" &&
                   queue._queue[0].cn.item == "item" &&
                   queue._queue[0].left == "left" &&
                   queue._queue[0].top == "top" &&
                   queue._queue[0].delay == 100,
                   "schedule ok");
                C.RENDER_QUEUE_DELAY = origDelay;
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        },

        _getApi: function() {
            var origSizesResolver = SizesResolver;
            var origPrefixer = Prefixer;
            var origDom = Dom;
            var origEV = EV;
            var origTOGGLE = TOGGLE;
            var origROTATE = ROTATE;

            var data = {
                getS: false, getApi: false, cc: false, grid: false
            };
            settings = {
                get: function() { data.getS = true; },
                getApi: function(name) {
                    data.getApi = true;
                    if(name == "coordsChanger")
                        return function() { data.cc = true; }
                }
            };
            toggleApi = {id: "toggleApi"};
            SizesResolver = {id: "sizesResolver"};
            srManager = {id: "srManager"};
            collector = {id: "collector"};
            Prefixer = {id: "prefixer"};
            Dom = {id: "dom"};
            grid = {get: function() { data.grid = true; }};
            EV = "ev";
            TOGGLE = "toggle";
            ROTATE = "rotate";

            var queue = new RendererQueue();
            var api = queue._getApi();
            api.getS();
            api.cc();

            ok(data.getS && data.getApi && data.cc && data.grid &&
               toggleApi.id == "toggleApi" && SizesResolver.id == "sizesResolver" &&
               srManager.id == "srManager" && collector.id == "collector" && Dom.id == "dom" &&
               Prefixer.id == "prefixer" && EV == "ev" && TOGGLE == "toggle" && ROTATE == "rotate",
               "getApi ok");

            SizesResolver = origSizesResolver;
            Prefixer = origPrefixer;
            Dom = origDom;
            EV = origEV;
            TOGGLE = origTOGGLE;
            ROTATE = origROTATE;

            clearTestData();
        },

        _process: function() {
            var show = {cn: null, left: null, top: null, api: null, op: null, delay: null};
            var hide = {cn: null, left: null, top: null, api: null, op: null, delay: null};
            var render = {cn: null, left: null, top: null, api: null, op: null, delay: null};
            var resizeScheduled = false;

            var queue = new RendererQueue();
            queue._getApi = function() { return "api"; };
            queue._show = function(cn, l, t, api, op, d) {
                show.cn = cn; show.left = l; show.top = t;
                show.api = api; show.op = op; show.delay = d;
            };
            queue._hide = function(cn, l, t, api, op, d) {
                hide.cn = cn; hide.left = l; hide.top = t;
                hide.api = api; hide.op = op; hide.delay = d;
            };
            queue._render = function(cn, l, t, api, op, d) {
                render.cn = cn; render.left = l; render.top = t;
                render.api = api; render.op = op; render.delay = d;
            };

            silentRenderer = {};
            silentRenderer.isScheduled = function(item) { return item.id == 3; };
            grid = {};
            grid.scheduleResize = function() { resizeScheduled = true; };

            gridItem = new Item();
            gridItem.isConnected = function(item) { return item.id != 2; };

            queue._queue = [];
            queue._queue.push({cn: {item: {id: 1}}, left: 2, top: 3, op: RENDER_OPS.SHOW, delay: 10});
            queue._queue.push({cn: {item: {id: 2}}, left: 4, top: 5, op: RENDER_OPS.SHOW, delay: 20});
            queue._queue.push({cn: {item: {id: 3}}, left: 6, top: 7, op: RENDER_OPS.SHOW, delay: 30});
            queue._queue.push({cn: {item: {id: 4}}, left: 8, top: 9, op: RENDER_OPS.HIDE, delay: 40});
            queue._queue.push({cn: {item: {id: 5}}, left: 0, top: 1, op: RENDER_OPS.RENDER, delay: 50});
            queue._process();

            ok(resizeScheduled &&
               queue._queue == null &&
               show.cn.item.id == 1 &&
               show.left == 2 &&
               show.top == 3 &&
               show.op == RENDER_OPS.SHOW &&
               show.delay == 10 &&
               hide.cn.item.id == 4 &&
               hide.left == 8 &&
               hide.top == 9 &&
               hide.op == RENDER_OPS.HIDE &&
               hide.delay == 40 &&
               render.cn.item.id == 5 &&
               render.left == 0 &&
               render.top == 1 &&
               render.op == RENDER_OPS.RENDER &&
               render.delay == 50,
               "process ok");

            clearTestData();
        },

        _show: function() {
            var cssSet = {position: null, left: null, top: null};
            var cc = {item: null, left: null, top: null, ccTime: null,
                      ccTiming: null, dom: null, prefix: null,
                      getS: null, initCall: false};
            var toggle = {item: null, left: null, top: null,
                          toggleTime: null, toggleTiming: null,
                          ev: null, toggleSyncerApi: null,
                          dom: null, api: null, coords: null};
            var rsortEventEmitted = false;

            settings = {
                get: function(name) {
                    if(name == "coordsChangeTime") return 100;
                    if(name == "coordsChangeTiming") return "ease";
                    if(name == "toggleTime") return 200;
                    if(name == "toggleTiming") return "ease";
                },
                getApi: function(name) {
                    if(name == "coordsChanger") {
                        return function(item, l, t, ccTime, ccTiming, dom, prefix, getS, isInit) {
                            cc.item = item; cc.left = l; cc.top = t;
                            cc.ccTime = ccTime; cc.ccTiming = ccTiming;
                            cc.dom = dom; cc.prefix = prefix;
                            cc.getS = getS; cc.initCall = isInit;
                        };
                    }
                    if(name == "toggle") {
                        return {
                            show: function(item, l, t, tTime, tTiming, ev, sa, dom, api, coords) {
                                toggle.item = item; toggle.left = l; toggle.top = t;
                                toggle.toggleTime = tTime; toggle.toggleTiming = tTiming;
                                toggle.ev = ev; toggle.toggleSyncerApi = sa;
                                toggle.dom = dom; toggle.api = api;
                                toggle.coords = coords;
                            }
                        };
                    }
                }
            };

            var api = {dom: {id: "dom", css: {}}};
            api.id = "api";
            api.prefix = {id: "prefix"};
            api.dom.css.set = function(item, obj) {
                if(item.id != 1) return;
                cssSet.position = obj.position;
                cssSet.left = obj.left;
                cssSet.top = obj.top;
            };

            ev = {id: "ev"};
            ev.emitInternal = function(name) {
                if(name == INT_EV.BEFORE_SHOW_FOR_RSORT)
                    rsortEventEmitted = true;
            };
            toggleSyncerApi = {id: "toggleSyncerApi"};

            var queue = new RendererQueue();
            queue._show({item: {id: 1}}, 10, 20, api);

            var cssSetOk = (cssSet.position == "absolute" &&
                            cssSet.left == 10 &&
                            cssSet.top == 20);

            var ccCallOk = (
                cc.item.id == 1 &&
                cc.left == 10 &&
                cc.top == 20 &&
                cc.ccTime == 100 &&
                cc.ccTiming == "ease" &&
                cc.dom.id == "dom" &&
                cc.prefix.id == "prefix" &&
                typeof cc.getS == "function" &&
                cc.initCall
            );

            var toggleCallOk = (
                toggle.item.id == 1 &&
                toggle.left == 10 &&
                toggle.top == 20 &&
                toggle.toggleTime == 200 &&
                toggle.toggleTiming == "ease" &&
                toggle.ev.id == "ev" &&
                toggle.toggleSyncerApi.id == "toggleSyncerApi" &&
                toggle.dom.id == "dom" &&
                toggle.api.id == "api" &&
                toggle.coords.x1 == 10 &&
                toggle.coords.y1 == 20
            );

            ok(rsortEventEmitted && cssSetOk && ccCallOk && toggleCallOk,
               "show ok");

            clearTestData();
        },

        _hide: function() {
            var toggle = {item: null, left: null, top: null,
                          toggleTime: null, toggleTiming: null,
                          ev: null, toggleSyncerApi: null,
                          dom: null, api: null, coords: null};
            var unmarked = false;

            settings = {
                get: function(name) {
                    if(name == "toggleTime") return 200;
                    if(name == "toggleTiming") return "ease";
                },
                getApi: function(name) {
                    if(name == "toggle") {
                        return {
                            hide: function(item, l, t, tTime, tTiming, ev, sa, dom, api, coords) {
                                toggle.item = item; toggle.left = l; toggle.top = t;
                                toggle.toggleTime = tTime; toggle.toggleTiming = tTiming;
                                toggle.ev = ev; toggle.toggleSyncerApi = sa;
                                toggle.dom = dom; toggle.api = api;
                                toggle.coords = coords;
                            }
                        };
                    }
                }
            };

            var api = {dom: {id: "dom", css: {}}};
            api.id = "api";
            ev = {id: "ev"};
            toggleSyncerApi = {id: "toggleSyncerApi"};
            renderer = {unmarkAsSchToHide: function(item) {
                if(item.id == 1) unmarked = true;
            }};

            var queue = new RendererQueue();
            queue._hide({item: {id: 1}}, 10, 20, api);

            var toggleCallOk = (
                unmarked &&
                toggle.item.id == 1 &&
                toggle.left == 10 &&
                toggle.top == 20 &&
                toggle.toggleTime == 200 &&
                toggle.toggleTiming == "ease" &&
                toggle.ev.id == "ev" &&
                toggle.toggleSyncerApi.id == "toggleSyncerApi" &&
                toggle.dom.id == "dom" &&
                toggle.api.id == "api" &&
                toggle.coords.x1 == 10 &&
                toggle.coords.y1 == 20
            );

            ok(toggleCallOk, "hide ok");

            clearTestData();
        },

        _render: function() {
            var data = {item: null, left: null, top: null, api: null};
            var queue = new RendererQueue();
            queue._execRender = function(item, left, top, api) {
                data.item = item;
                data.left = left;
                data.top = top;
                data.api = api;
            };

            var op = RENDER_OPS.RENDER;
            var api = {dom: "dom", prefix: "prefix"};
            queue._render({item: {id: 1}}, 10, 20, api, op, 0);

            ok(data.item.id == 1 && data.left == 10 && data.top == 20 &&
               data.api.dom == "dom" && data.api.prefix == "prefix",
               "execRender ok");
        },

        _delayedRender: function(assert) {
            var data = {item: null, left: null, top: null, api: null};
            var callsCount = 0;
            var queue = new RendererQueue();
            queue._execRender = function(item, left, top, api) {
                data.item = item;
                data.left = left;
                data.top = top;
                data.api = api;
                callsCount++;
            };

            var initFn = function() {
                cnsCore = {};
                cnsCore.find = function(item, find) {
                    if(!find) return;
                    if(item.id == 5)
                        return null;
                    if(item.id == 1)
                        return {item: {id: 2}, left: 10, top: 20};
                };
                rendererCns = {};
                rendererCns.left = function(v) { return v.left; };
                rendererCns.top = function(v) { return v.top; };

                var op = RENDER_OPS.DEL_RENDER;
                var api = {dom: "dom", prefix: "prefix"};
                queue._render({item: {id: 5}}, 10, 20, api, op, 0);
                queue._render({item: {id: 1}}, 10, 20, api, op, 0);
            };
            var checkFn = function() {
                ok(data.item.id == 2 && data.left == 10 && data.top == 20 &&
                   data.api.dom == "dom" && data.api.prefix == "prefix" && callsCount == 1,
                   "execRender with delay ok");
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        },

        _execRender: function() {
            var cc = {
                item: null, left: null, top: null, ccTime: [],
                ccTiming: [], dom: null, prefix: null,
                getS: null, initCall: false
            };

            settings = {
                get: function(name) {
                    if(name == "coordsChangeTime") return 100;
                    if(name == "coordsChangeTiming") return "ease";
                    if(name == "toggleTime") return 200;
                    if(name == "toggleTiming") return "ease";
                },
                getApi: function(name) {
                    if(name == "coordsChanger") {
                        return function(item, l, t, ccTime, ccTiming, dom, prefix, getS, isInit) {
                            cc.item = item; cc.left = l; cc.top = t;
                            cc.ccTime.push(ccTime); cc.ccTiming.push(ccTiming);
                            cc.dom = dom; cc.prefix = prefix;
                            cc.getS = getS; cc.initCall = isInit;
                        };
                    }
                }
            };

            var api = {dom: {id: "dom", css: {}}};
            api.id = "api";
            api.prefix = {id: "prefix"};

            var queue = new RendererQueue();

            var item = Dom.div();
            var itemWithCc = Dom.div();
            Dom.set(itemWithCc, TOGGLE.IS_ACTIVE_WITH_CC, "y");

            queue._execRender(item, 10, 20, api);
            queue._execRender(itemWithCc, 10, 20, api);

            ok(
                cc.item.nodeName == "DIV" &&
                cc.left == 10 &&
                cc.top == 20 &&
                cc.ccTime[0] == 100 &&
                cc.ccTiming[0] == "ease" &&
                cc.ccTime[1] == 200 &&
                cc.ccTiming[1] == "ease" &&
                cc.dom.id == "dom" &&
                cc.prefix.id == "prefix" &&
                typeof cc.getS == "function" &&
                !cc.initCall,
                "execRender ok"
            );

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});