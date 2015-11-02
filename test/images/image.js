$(document).ready(function() {
    module("LoadedImage");

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
                    "events",
                    "scheduleLoad",
                    "fns"
                ]);
            });
        },

        _events: function() {
            var data = {
                objs: [], evNames: [], handlers: [],
                onLoad: false, onError: false
            };

            var origEvent = Event;
            Event = {};
            Event.add = function(obj, evName, handler) {
                data.objs.push(obj);
                data.evNames.push(evName);
                data.handlers.push(handler);
            };
            Event.rm = function(obj, evName, handler) {
                data.objs.push(obj);
                data.evNames.push(evName);
                data.handlers.push(handler);
            };

            var image = new LoadedImage();
            image._load = function() { data.onLoad = true; };
            image._error = function() { data.onError = true; };

            image._bindEvents();
            image._onLoad();
            image._onError();
            ok(
                data.objs[0] == null && data.evNames[0] == "load" &&
                (typeof data.handlers[0] == "function") && data.objs[1] == null &&
                data.evNames[1] == "error" && (typeof data.handlers[1] == "function") &&
                data.onLoad && data.onError,
                "bindEvents ok"
            );

            image._unbindEvents();
            ok(
                data.objs[2] == null && data.evNames[2] == "load" &&
                (typeof data.handlers[2] == "function") && data.objs[3] == null &&
                data.evNames[3] == "error" && (typeof data.handlers[3] == "function"),
                "unbind events ok"
            );

            Event = origEvent;
            clearTestData();
        },

        _scheduleLoad: function() {
            var data = {
                onLoadImage: null,
                eventsBinded: false
            };

            imagesLoader = {};
            imagesLoader.onLoad = function(img) {
                data.onLoadImage = img;
            };

            var image = new LoadedImage({src: "test"});
            image._bindEvents = function() {
                data.eventsBinded = true;
            };
            image._loader = function() {
                return {};
            };

            image.scheduleLoad();
            ok(
                data.eventsBinded &&
                image._loadedImage.src == "test",
                "scheduleLoad ok"
            );

            data.eventsBinded = false;
            image._isAlreadyLoaded = fns.t();
            image.scheduleLoad();
            ok(
                image._isLoaded && data.onLoadImage.src == "test" && 
                !data.eventsBinded,
                "scheduleLoad on already loaded image ok"
            );

            clearTestData();
        },

        _fns: function() {
            data = {
                unbinded: false, onLoad: null
            };

            var image = new LoadedImage();
            image._unbindEvents = function() {
                data.unbinded = true;
            };

            image.destroy();
            ok(data.unbinded, "destroy ok");
            ok(image._loader().nodeName == "IMG", "loader ok");
            ok(image.isLoaded() == false, "isLoaded ok");

            image._image = {
                complete: true, naturalWidth: 10
            };
            ok(image._isAlreadyLoaded(), "isAlreadyLoaded ok");

            image._image.naturalWidth = 0;
            ok(!image._isAlreadyLoaded(), "isAlreadyLoaded not loaded ok");

            imagesLoader = {};
            imagesLoader.onLoad = function(img) { data.onLoad = img; };

            image._load();
            ok(image._isLoaded && data.onLoad.complete, "load ok");

            image._isLoaded = false;
            image._error();
            ok(image._isLoaded && data.onLoad.complete, "error ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});