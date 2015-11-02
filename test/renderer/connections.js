$(document).ready(function() {
    module("RendererCns");

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
                    "crud",
                    "left",
                    "top"
                ]);
            });
        },

        _crud: function() {
            var rendererCns = new RendererCns();
            var cn = {item: Dom.div()};

            rendererCns.markAsRendered(cn);
            ok(rendererCns.isRendered(cn), "isRendered ok");

            rendererCns.unmarkAsRendered(cn);
            ok(!rendererCns.isRendered(cn), "mark/unmark as rendered ok");

            clearTestData();
        },

        _left: function() {
            ev = new EventEmitter();
            settings = new Settings();

            var rendererCns = new RendererCns();
            ok(rendererCns.left({x1: 10}) == "10px", "left on vg ok");

            sourceSettings = {grid: "horizontal"};
            settings = new Settings();
            ok(rendererCns.left({x1: 10}) == "10px", "left on hg ok");

            sourceSettings = {grid: "horizontal", intersections: false};
            settings = new Settings();
            ok(rendererCns.left({x1: 10, hOffset: 15}) == "25px", "left on hg dis inters-ns ok");

            clearTestData();
        },

        _top: function() {
            ev = new EventEmitter();
            sourceSettings = {grid: "horizontal"};
            settings = new Settings();

            var rendererCns = new RendererCns();
            ok(rendererCns.top({y1: 10}) == "10px", "top on hg ok");

            sourceSettings = {grid: "vertical"};
            settings = new Settings();
            ok(rendererCns.top({y1: 10}) == "10px", "top on vg ok");

            sourceSettings = {grid: "vertical", intersections: false};
            settings = new Settings();
            ok(rendererCns.top({y1: 10, vOffset: 15}) == "25px", "top on vg dis inters-ns ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});