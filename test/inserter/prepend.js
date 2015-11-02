$(document).ready(function() {
    module("PrependOp");

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
                    "exec",
                    "prepend"
                ]);
            });
        },

        _exec: function() {
            var data = {items: []};

            insertOp = {
                exec: function(items, insertFn) {
                    for(var i = 0; i < items.length; i++)
                        insertFn(items[i]);
                }
            };
            var prependOp = new PrependOp();
            prependOp._prepend = function(item) {
                data.items.push(item);
            };

            prependOp.exec([{id: 1}, {id: 2}]);
            ok(
                data.items.length == 2 &&
                data.items[0].id == 1 &&
                data.items[1].id == 2,
                "exec ok"
            );

            clearTestData();
        },

        _prepend: function() {
            ev = new EventEmitter();
            sourceSettings = {prepend: "default"};
            settings = new Settings();

            var data = {
                item: null,
                revItem: null,
                marked: false
            };

            Logger = {
                startLoggingOperation: function() {},
                stopLoggingOperation: function() {}
            };
            Logger.OPERATION_TYPES = {};
            Logger.OPERATION_TYPES.PREPEND = "";
            Logger.OPERATION_TYPES.REVERSED_PREPEND = "";
            guid = {
                get: function() {},
                markForPrepend: function(item) {
                    if(item.id == 1) data.marked = true;
                }
            };
            prepender = {
                position: function(item) {
                    if(item.id == 1) data.item = item;
                }
            };
            reversedPrepender = {
                position: function(item) {
                    if(item.id == 1) data.revItem = item;
                }
            };

            var prependOp = new PrependOp();

            prependOp._prepend({id: 1});
            ok(data.marked && data.item.id == 1, "prepend with def prepend ok");

            sourceSettings = {prepend: "reversed"};
            settings = new Settings();
            prependOp._prepend({id: 1});
            ok(data.revItem.id == 1, "prepend with rev prepend ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});