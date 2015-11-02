$(document).ready(function() {
    module("Renderer");

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
                    "show",
                    "hide",
                    "renderRepositioned",
                    "render",
                    "renderAfterDelay",
                    "rotate",
                    "scheduleHideCrud"
                ]);
            });
        },

        _show: function() {
            var getRqueueData = function() {
                return {
                    op: null, cn: null, left: null, top: null
                };
            };

            var rqueueData = getRqueueData();
            rendererQueue = {
                schedule: function(op, cn, left, top) {
                    rqueueData.op = op;
                    rqueueData.cn = cn;
                    rqueueData.left = left;
                    rqueueData.top = top;
                }
            };
            rendererCns = {
                isRendered: function(cn) {
                    return cn.isRendered;
                },
                markAsRendered: function(cn) {
                    cn.isRendered = true;
                },
                left: function(cn) {
                    return (Dom.hasOwnProp(cn, "guid")) ? "left" : null;
                },
                top: function(cn) {
                    return (Dom.hasOwnProp(cn, "guid")) ? "top" : null;
                }
            };

            var cn = {item: Dom.div(), guid: 1, isRendered: false};
            var cns = [{item: Dom.div(), guid: 2, isRendered: false},
                       {item: Dom.div(), guid: 3, isRendered: false}];

            var renderer = new Renderer();
            renderer.markAsSchToHide([cn]);
            renderer.markAsSchToHide(cns);
            renderer.show(cn);

            ok(rqueueData.op == RENDER_OPS.SHOW &&
               rqueueData.cn.guid == 1 && rqueueData.left == "left" &&
               rqueueData.top == "top" && cn.isRendered &&
               !renderer.wasSchToHide(cn.item), "show single cn ok");

            rqueueData = getRqueueData();
            renderer.show(cn);
            ok(rqueueData.op == null, "show already rendered cn ok");

            rqueueData = getRqueueData();
            renderer.show(cns);

            ok(rqueueData.op == RENDER_OPS.SHOW &&
               rqueueData.cn.guid === 3 && rqueueData.left == "left" &&
               rqueueData.top == "top" && cns[0].isRendered && cns[1].isRendered &&
               !renderer.wasSchToHide(cns[0].item) && !renderer.wasSchToHide(cns[1].item),
                "show multiple cns ok");

            rqueueData = getRqueueData();
            renderer.show(cns);

            ok(rqueueData.op == null, "show already rendered cns ok");

            clearTestData();
        },

        _hide: function() {
            var getRqueueData = function() {
                return {
                    op: null, cn: null, left: null, top: null
                };
            };

            var rqueueData = getRqueueData();
            rendererQueue = {
                schedule: function(op, cn, left, top) {
                    rqueueData.op = op;
                    rqueueData.cn = cn;
                    rqueueData.left = left;
                    rqueueData.top = top;
                }
            };
            rendererCns = {
                isRendered: function(cn) {
                    return cn.isRendered;
                },
                markAsRendered: function(cn) {
                    cn.isRendered = true;
                },
                unmarkAsRendered: function(cn) {
                    cn.isRendered = false;
                },
                left: function(cn) {
                    return (Dom.hasOwnProp(cn, "guid")) ? "left" : null;
                },
                top: function(cn) {
                    return (Dom.hasOwnProp(cn, "guid")) ? "top" : null;
                }
            };

            var cn = {item: Dom.div(), guid: 1, isRendered: true};
            var cns = [{item: Dom.div(), guid: 2, isRendered: true},
                       {item: Dom.div(), guid: 3, isRendered: true}];

            var renderer = new Renderer();
            renderer.markAsSchToHide([cn]);
            renderer.hide(cn);

            ok(rqueueData.op == RENDER_OPS.HIDE &&
               rqueueData.cn.guid == 1 && rqueueData.left == "left" &&
               rqueueData.top == "top" && !cn.isRendered,
               "hide single cn ok");

            rqueueData = getRqueueData();
            renderer.unmarkAsSchToHide(cn.item);
            renderer.hide(cn);
            ok(rqueueData.cn == null, "hide not scheduled cn item ok");

            rqueueData = getRqueueData();
            renderer.markAsSchToHide([cns[0]]);
            renderer.hide(cns);

            ok(rqueueData.op == RENDER_OPS.HIDE &&
               rqueueData.cn.guid === 2 && rqueueData.left == "left" &&
               rqueueData.top == "top" && !cns[0].isRendered && cns[1].isRendered,
               "hide multiple cns ok");

            rqueueData = getRqueueData();
            renderer.unmarkAsSchToHide(cns[0].item);
            renderer.hide(cns);

            ok(rqueueData.cn == null, "hide not scheduled cns ok");

            clearTestData();
        },

        _renderRepositioned: function() {
            var renderer = new Renderer();
            renderer.render = function(cns, exceptCns) {
                ok(cns.length == 2 && !exceptCns, "render repositioned ok");
            }

            renderer.renderRepositioned([{}, {}]);

            clearTestData();
        },

        _render: function() {
            var getRqueueData = function() {
                return {
                    op: null, cns: [], left: null, top: null
                };
            };

            var rqueueData = getRqueueData();
            rendererQueue = {
                schedule: function(op, cn, left, top) {
                    rqueueData.op = op;
                    rqueueData.cns.push(cn);
                    rqueueData.left = left;
                    rqueueData.top = top;
                }
            };
            rendererCns = {
                left: function(cn) {
                    return (Dom.hasOwnProp(cn, "itemGUID")) ? "left" : null;
                },
                top: function(cn) {
                    return (Dom.hasOwnProp(cn, "itemGUID")) ? "top" : null;
                }
            };

            var cns = [{item: Dom.div(), itemGUID: 2}, {item: Dom.div(), itemGUID: 3}];
            var renderer = new Renderer();

            renderer.render(cns);
            ok(rqueueData.op == RENDER_OPS.RENDER &&
               rqueueData.cns[0].itemGUID == 2 && rqueueData.cns[1].itemGUID == 3 &&
               rqueueData.left == "left" && rqueueData.top == "top" &&
               rqueueData.cns.length == 2, "render cns ok");

            rqueueData = getRqueueData();
            renderer.render(cns, [cns[1]]);
            ok(rqueueData.op == RENDER_OPS.RENDER &&
               rqueueData.cns[0].itemGUID == 2 && rqueueData.cns.length == 1 &&
               rqueueData.left == "left" && rqueueData.top == "top",
               "render cns ok");

            clearTestData();
        },

        _renderAfterDelay: function() {
            var getRqueueData = function() {
                return {
                    op: null, cns: [], delay: null
                };
            };

            var rqueueData = getRqueueData();
            rendererQueue = {
                schedule: function(op, cn, left, top, delay) {
                    rqueueData.op = op;
                    rqueueData.cns.push(cn);
                    rqueueData.delay = delay;
                }
            };

            var cns = [{item: Dom.div(), itemGUID: 2}, {item: Dom.div(), itemGUID: 3}];
            var renderer = new Renderer();

            renderer.renderAfterDelay(cns);
            ok(rqueueData.cns[0].itemGUID == 2 &&
               rqueueData.cns[1].itemGUID == 3 && rqueueData.op == RENDER_OPS.DEL_RENDER &&
               rqueueData.delay == C.RENDER_DEF_DELAY, "renderAfterDelay def del ok");

            renderer.renderAfterDelay(cns, 100);
            ok(rqueueData.delay == 100, "renderAfterDelay cus del ok");

            clearTestData();
        },

        _rotate: function() {
            rendererCns = {
                isRendered: function(cn) { return cn.isRendered; },
                markAsRendered: function(cn) { cn.isRendered = true; },
                unmarkAsRendered: function(cn) { cn.isRendered = false; }
            };
            cnsCore = {
                find: function(cn) { return cn; }
            };

            var cns = [{item: Dom.div(), itemGUID: 2, isRendered: true},
                       {item: Dom.div(), itemGUID: 3, isRendered: true}];
            var renderer = new Renderer();
            renderer.show = function(cns) {
                ok(cns.length == 2 && !cns[0].isRendered && !cns[1].isRendered &&
                   cns[0].itemGUID == 2 && cns[1].itemGUID == 3,
                   "rotate ok");
            };

            renderer.rotate(cns);
            clearTestData();
        },

        _scheduleHideCrud: function() {
            var renderer = new Renderer();
            var cns = [{item: Dom.div()}, {item: Dom.div()}];

            renderer.markAsSchToHide(cns);
            ok(renderer.wasSchToHide(cns[0].item) && renderer.wasSchToHide(cns[1].item),
               "wasSchToHide ok");

            renderer.unmarkAsSchToHide(cns[0].item);
            renderer.unmarkAsSchToHide(cns[1].item);
            ok(!renderer.wasSchToHide(cns[0].item) && !renderer.wasSchToHide(cns[1].item),
               "mark/unmark as sch to hide ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});