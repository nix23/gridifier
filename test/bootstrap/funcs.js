$(document).ready(function() {
    module("Funcs");

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

                test(["proto", "self", "err", "bind"]);
            });
        },

        _proto: function() {
            var testObj = function() {};
            proto(testObj, {
                func1: function() {},
                func2: function() {}
            });

            ok(typeof testObj.prototype.func1 == "function" &&
               typeof testObj.prototype.func2 == "function",
               "add to proto ok");
        },

        _self: function() {
            this._testsFunc1Call = 0;
            this._testsFunc2Call = 0;
            var funcs = {
                func1: function() { this._testsFunc1Call++; },
                func2: function() { this._testsFunc2Call++; }
            };
            self(this, funcs);

            ok(typeof gridifier.func1 == "function" &&
               typeof gridifier.func2 == "function",
               "add to self ok");

            gridifier.func1();
            gridifier.func2();
            ok(this._testsFunc1Call == 1 && this._testsFunc2Call == 1,
               "call added to self functions ok");
        },

        _err: function(assert) {
            assert.throws(
                function() { err("testerror"); },
                /(.*)testerror(.*)/,
                "err test"
            );
        },

        _bindFn: function() {
            return this._bindParam;
        },

        _bind: function() {
            this._bindParam = 15;
            var unbindedFn = this._bindFn;
            var bindedFn = bind("_bindFn", this);

            ok(bindedFn() == 15, "binded fn context ok");
        }
    };

    tester.runTests();
    clearTestData();
});