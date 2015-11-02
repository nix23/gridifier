$(document).ready(function() {
    module("RsortHelpers");

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
                    "byAreaEvenlySingleBatch",
                    "byAreaEvenlyAll2SingleBatch",
                    "byAreaEvenly31",
                    "byAreaEvenly42",
                    "byAreaEvenly151",
                    "areaDesc",
                    "areaAsc",
                    "orientationEvenly"
                ]);
            });
        },

        _isCorrectOrder: function(cns, ids) {
            for(var i = 0; i < ids.length; i++) {
                if(cns[i].id != ids[i])
                    return false;
            }

            return true;
        },

        _byAreaEvenlySingleBatch: function() {
            var sortFn = null;
            var settings = {};
            settings.addApi = function(api, fnName, fn) {
                if(api != "rsort" || fnName != "areaEvenly") return;
                sortFn = fn;
            };

            new RsortHelpers(settings);
            var cns = [
                {id: 1, x1: 0, x2: 20, y1: 0, y2: 20},
                {id: 2, x1: 0, x2: 20, y1: 0, y2: 20},
                {id: 3, x1: 0, x2: 30, y1: 0, y2: 30},
                {id: 4, x1: 0, x2: 30, y1: 0, y2: 30},
                {id: 5, x1: 0, x2: 30, y1: 0, y2: 30}
            ];
            cns = sortFn(cns);
            ok(this._isCorrectOrder(cns, [3, 1, 4, 2, 5]), "byAreaEvenly ok");

            clearTestData();
        },

        _byAreaEvenlyAll2SingleBatch: function() {
            var sortFn = null;
            var settings = {};
            settings.addApi = function(api, fnName, fn) {
                if(api != "rsort" || fnName != "areaEvenlyAll-2") return;
                sortFn = fn;
            };

            new RsortHelpers(settings);
            var cns = [
                {id: 1, x1: 0, x2: 20, y1: 0, y2: 20},
                {id: 2, x1: 0, x2: 20, y1: 0, y2: 20},
                {id: 3, x1: 0, x2: 30, y1: 0, y2: 30},
                {id: 4, x1: 0, x2: 30, y1: 0, y2: 30},
                {id: 5, x1: 0, x2: 30, y1: 0, y2: 30}
            ];
            cns = sortFn(cns); 
            ok(this._isCorrectOrder(cns, [3, 4, 1, 5, 2]), "byAreaEvenlyAll-2 ok");

            clearTestData();
        },

        _byAreaEvenly31: function() {
            var sortFn = null;
            var settings = {};
            settings.addApi = function(api, fnName, fn) {
                if(api != "rsort" || fnName != "areaEvenly3-1") return;
                sortFn = fn;
            };

            new RsortHelpers(settings);
            var cns = [
                {id: 1, x1: 0, x2: 20, y1: 0, y2: 20},
                {id: 2, x1: 0, x2: 20, y1: 0, y2: 20},
                {id: 3, x1: 0, x2: 30, y1: 0, y2: 30},
                {id: 4, x1: 0, x2: 30, y1: 0, y2: 30},
                {id: 5, x1: 0, x2: 30, y1: 0, y2: 30},
                {id: 6, x1: 0, x2: 30, y1: 0, y2: 30}
            ];
            cns = sortFn(cns); 
            ok(this._isCorrectOrder(cns, [3, 1, 2, 4, 5, 6]), "byAreaEvenly3-1 ok");

            clearTestData();
        },

        _byAreaEvenly42: function() {
            var sortFn = null;
            var settings = {};
            settings.addApi = function(api, fnName, fn) {
                if(api != "rsort" || fnName != "areaEvenly4-2") return;
                sortFn = fn;
            };

            new RsortHelpers(settings);
            var cns = [
                {id: 1, x1: 0, x2: 20, y1: 0, y2: 20},
                {id: 2, x1: 0, x2: 20, y1: 0, y2: 20},
                {id: 3, x1: 0, x2: 30, y1: 0, y2: 30},
                {id: 4, x1: 0, x2: 30, y1: 0, y2: 30},
                {id: 5, x1: 0, x2: 30, y1: 0, y2: 30},
                {id: 6, x1: 0, x2: 30, y1: 0, y2: 30}
            ];
            cns = sortFn(cns); 
            ok(this._isCorrectOrder(cns, [3, 4, 1, 2, 5, 6]), "byAreaEvenly4-2 ok");

            clearTestData();
        },

        _byAreaEvenly151: function() {
            var sortFn = null;
            var settings = {};
            settings.addApi = function(api, fnName, fn) {
                if(api != "rsort" || fnName != "areaEvenly15-1") return;
                sortFn = fn;
            };

            new RsortHelpers(settings);
            var cns = [
                {id: 1, x1: 0, x2: 20, y1: 0, y2: 20},
                {id: 2, x1: 0, x2: 20, y1: 0, y2: 20},
                {id: 3, x1: 0, x2: 30, y1: 0, y2: 30},
                {id: 4, x1: 0, x2: 30, y1: 0, y2: 30},
                {id: 5, x1: 0, x2: 30, y1: 0, y2: 30},
                {id: 6, x1: 0, x2: 30, y1: 0, y2: 30}
            ];
            cns = sortFn(cns); 
            ok(this._isCorrectOrder(cns, [3, 1, 4, 2, 5, 6]), "byAreaEvenly15-1 ok");

            clearTestData();
        },

        _areaDesc: function() {
            var sortFn = null;
            var settings = {};
            settings.addApi = function(api, fnName, fn) {
                if(api != "rsort" || fnName != "areaDesc") return;
                sortFn = fn;
            };

            new RsortHelpers(settings);
            var cns = [
                {id: 1, x1: 0, x2: 20, y1: 0, y2: 20},
                {id: 2, x1: 0, x2: 20, y1: 0, y2: 20},
                {id: 3, x1: 0, x2: 30, y1: 0, y2: 30},
                {id: 4, x1: 0, x2: 30, y1: 0, y2: 30},
                {id: 5, x1: 0, x2: 30, y1: 0, y2: 30}
            ];
            cns = sortFn(cns); 
            ok(this._isCorrectOrder(cns, [3, 4, 5, 1, 2]), "byAreaDesc ok");

            clearTestData();
        },

        _areaAsc: function() {
            var sortFn = null;
            var settings = {};
            settings.addApi = function(api, fnName, fn) {
                if(api != "rsort" || fnName != "areaAsc") return;
                sortFn = fn;
            };

            new RsortHelpers(settings);
            var cns = [
                {id: 1, x1: 0, x2: 20, y1: 0, y2: 20},
                {id: 2, x1: 0, x2: 20, y1: 0, y2: 20},
                {id: 3, x1: 0, x2: 30, y1: 0, y2: 30},
                {id: 4, x1: 0, x2: 30, y1: 0, y2: 30},
                {id: 5, x1: 0, x2: 30, y1: 0, y2: 30}
            ];
            cns = sortFn(cns); 
            ok(this._isCorrectOrder(cns, [1, 2, 3, 4, 5]), "byAreaAsc ok");

            clearTestData();
        },

        _orientationEvenly: function() {
            var sortFn = null;
            var settings = {};
            settings.addApi = function(api, fnName, fn) {
                if(api != "rsort" || fnName != "orientationEvenly") return;
                sortFn = fn;
            };

            new RsortHelpers(settings);
            var cns = [
                {id: 1, x1: 0, x2: 20, y1: 0, y2: 40},
                {id: 2, x1: 0, x2: 40, y1: 0, y2: 20},
                {id: 3, x1: 0, x2: 20, y1: 0, y2: 40},
                {id: 4, x1: 0, x2: 40, y1: 0, y2: 20},
                {id: 5, x1: 0, x2: 20, y1: 0, y2: 40}
            ];
            cns = sortFn(cns); 
            ok(this._isCorrectOrder(cns, [2, 1, 4, 3, 5]), "byOrientationEvenly ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});