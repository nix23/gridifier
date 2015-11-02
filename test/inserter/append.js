$(document).ready(function() {
    module("AppendOp");

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
                    "append",
                    "execInsBefore",
                    "execInsAfter"
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
            var appendOp = new AppendOp();
            appendOp._append = function(item) {
                data.items.push(item);
            };

            appendOp.exec([{id: 1}, {id: 2}]);
            ok(
                data.items.length == 2 &&
                data.items[0].id == 1 &&
                data.items[1].id == 2,
                "exec ok"
            );

            clearTestData();
        },

        _append: function() {
            ev = new EventEmitter();
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
            Logger.OPERATION_TYPES.APPEND = "";
            Logger.OPERATION_TYPES.REVERSED_APPEND = "";
            guid = {
                get: function() {},
                markForAppend: function(item) {
                    if(item.id == 1) data.marked = true;
                }
            };
            appender = {
                position: function(item) {
                    if(item.id == 1) data.item = item;
                }
            };
            reversedAppender = {
                position: function(item) {
                    if(item.id == 1) data.revItem = item;
                }
            };

            var appendOp = new AppendOp();

            appendOp._append({id: 1});
            ok(data.marked && data.item.id == 1, "append with def append ok");

            sourceSettings = {append: "reversed"};
            settings = new Settings();
            appendOp._append({id: 1});
            ok(data.revItem.id == 1, "append with rev append ok");

            clearTestData();
        },

        _execInsBefore: function() {
            var data = {
                items: null,
                targetItem: null,
                insertItems: null,
                index: null,
                spliced: null,
                rev: null,
                reposed: null
            };

            reposition = {
                from: function(cn) {
                    data.reposed = cn;
                }
            };
            insertOp = {
                execInsertBA: function(items,
                                       targetItem,
                                       insertFn,
                                       getIndex,
                                       spliceCns,
                                       rev,
                                       rpsFn) {
                    data.items = items;
                    data.targetItem = targetItem;
                    insertFn(items);
                    data.index = getIndex();
                    data.spliced = spliceCns([{id: 1}, {id: 2}], 1);
                    data.rev = rev;
                    rpsFn([{id: 1}, {id: 2}]);
                }
            };

            var appendOp = new AppendOp();
            appendOp.exec = function(items) {
                data.insertItems = items;
            };
            appendOp.execInsBefore([{id: 1}, {id: 2}], "target");

            ok(
                data.items.length == 2 &&
                data.items[0].id == 1 &&
                data.insertItems.length == 2 &&
                data.index == 0 &&
                data.spliced[0].id == 2 &&
                data.rev == -1 &&
                data.reposed.id == 1,
                "execInsBefore ok"
            );

            clearTestData();
        },

        _execInsAfter: function() {
            var data = {
                items: null,
                targetItem: null,
                insertItems: null,
                index: null,
                spliced: null,
                rev: null,
                reposed: null
            };

            reposition = {
                from: function(cn) {
                    data.reposed = cn;
                }
            };
            insertOp = {
                execInsertBA: function(items,
                                       targetItem,
                                       insertFn,
                                       getIndex,
                                       spliceCns,
                                       rev,
                                       rpsFn) {
                    data.items = items;
                    data.targetItem = targetItem;
                    insertFn(items);
                    data.index = getIndex([{id: 1}, {id: 2}]);
                    data.spliced = spliceCns([{id: 1}, {id: 2}], 0);
                    data.rev = rev;
                    rpsFn([{id: 1}, {id: 2}]);
                }
            };

            var appendOp = new AppendOp();
            appendOp.exec = function(items) {
                data.insertItems = items;
            };
            appendOp.execInsAfter([{id: 1}, {id: 2}], "target");

            ok(
                data.items.length == 2 &&
                data.items[0].id == 1 &&
                data.insertItems.length == 2 &&
                data.index == 1 &&
                data.spliced[0].id == 2 &&
                data.rev == 1 &&
                data.reposed.id == 1,
                "execInsAfter ok"
            );

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});