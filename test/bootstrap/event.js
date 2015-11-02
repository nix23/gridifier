$(document).ready(function() {
    module("Event");

    var triggerResize = function() {
        var evt = window.document.createEvent('UIEvents');
        evt.initUIEvent('resize', true, false, window, 0);
        window.dispatchEvent(evt);
    }

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

                if(typeof window.document.createEvent != "function") {
                    ok(true, "Browser not supp-ing createEvent");
                    return;
                }

                test([
                    "singleResizeHandler",
                    "multipleResizeHandlers",
                    "syncWithJqueryEvents",
                    "handlerGUIDUniqness"
                ]);
            });
        },

        _singleResizeHandler: function() {
            testsResizeEv1 = 0;
            var handle = function() { testsResizeEv1++; };
            Event.add(window, "resize", handle);

            ok(testsResizeEv1 == 0, "resize ev1 count = 0");
            triggerResize();
            ok(testsResizeEv1 > 0, "resize ev1 count = 1");

            testsResizeEv1 = 0;
            Event.rm(window, "resize", handle);
            triggerResize();
            ok(testsResizeEv1 == 0, "resize ev1 count = 0 after rm");
        },

        _multipleResizeHandlers: function() {
            testsResizeEv1 = 0;
            testsResizeEv2 = 0;
            var handle1 = function() { testsResizeEv1++; };
            var handle2 = function() { testsResizeEv2++; };
            Event.add(window, "resize", handle1);
            Event.add(window, "resize", handle2);

            ok(testsResizeEv1 == 0 && testsResizeEv2 == 0, "resize ev1 && ev2 count = 0");
            triggerResize();
            ok(testsResizeEv1 > 0 && testsResizeEv2 > 0, "resize ev1 && ev2 count = 1");

            testsResizeEv1 = 0;
            testsResizeEv2 = 0;
            Event.rm(window, "resize", handle2);
            triggerResize();
            ok(testsResizeEv1 > 0 && testsResizeEv2 == 0, "resize ev1 = 1, ev2 = 0 after rm handle2");

            testsResizeEv1 = 0;
            Event.rm(window, "resize", handle1);
            triggerResize();
            ok(testsResizeEv1 == 0 && testsResizeEv2 == 0, "resize ev1 && ev2 count = 0 after rm handle1");
        },

        _syncWithJqueryEvents: function() {
            testsResizeEv1 = 0;
            testsJqueryResizeEv = 0;
            var handle1 = function() { testsResizeEv1++; };
            Event.add(window, "resize", handle1);

            var jqueryHandle = function() { testsJqueryResizeEv++ };
            $(window).on("resize", jqueryHandle);

            ok(testsResizeEv1 == 0 && testsJqueryResizeEv == 0, "resize ev1 && jquery ev count = 0");
            triggerResize();
            ok(testsResizeEv1 > 0 && testsJqueryResizeEv > 0, "resize ev1 = 1 && jquery ev = 1");

            testsResizeEv1 = 0;
            testsJqueryResizeEv = 0;
            Event.rm(window, "resize");
            triggerResize();
            ok(testsResizeEv1 == 0 && testsJqueryResizeEv > 0, "resize ev1 = 0 && jquery ev count > 0 after rm h1");
            $(window).off("resize", jqueryHandle);
        },

        _handlerGUIDUniqness: function() {
            var handlers = [];
            for(var i = 0; i < 20; i++)
                handlers.push(function() {});

            for(var i = 0; i < handlers.length; i++)
                Event.add(window, "resize", handlers[i]);

            var allUnique = true;
            for(var i = 0; i < handlers.length; i++) {
                var isUnique = true;
                for(var j = 0; j < handlers.length; j++) {
                    if(i == j) continue;
                    if(handlers[i].guid === handlers[j].guid)
                        isUnique = false;
                }

                if(!isUnique) allUnique = false;
            }

            ok(allUnique, "all guids are unique");

            for(var i = 0; i < handlers.length; i++)
                Event.rm(window, "resize", handlers[i]);
        }
    };

    tester.runTests();
    clearTestData();
});