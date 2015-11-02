$(document).ready(function() {
    module("InsertQueue");

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
                    "itemsToBatches",
                    "schedule",
                    "scheduleFnExec",
                    "_schedule",
                    "execSchedule",
                    "execScheduleOnBusyReposQueue",
                    "process",
                    "processOnBusyReposQueue",
                    "exec"
                ]);
            });
        },

        _itemsToBatches: function() {
            gridItem = {
                toNative: function(items) {
                    if(items.length != 0) return items;
                    return null;
                }
            };
            var insertQueue = new InsertQueue();

            var items =[{id: 1}, {id: 2}, {id: 3},
                        {id: 4}, {id: 5}, {id: 6}];

            var batches = insertQueue.itemsToBatches(items, 6);
            ok(batches.length == 1 && batches[0].length == 6, "itemsToBatches all ok");

            batches = insertQueue.itemsToBatches(items, 3, true);
            ok(batches.length == 2 && batches[0].length == 3 &&
               batches[1].length == 3, "itemsToBatches 2 x 3 ok");

            batches = insertQueue.itemsToBatches(items, 1);
            ok(batches.length == 6, "itemsToBatches 1 x 6 ok");

            batches = insertQueue.itemsToBatches(items, 2);
            ok(batches.length == 3 && batches[0].length == 2 &&
               batches[2].length == 2 && batches[0][0].id == 1 &&
               batches[2][0].id == 5, "itemsToBatches 3 x 2 ok");

            clearTestData();
        },

        _schedule: function() {
            var data = {
                op: null, items: null, bs: null, bd: null, ti: null, exec: false
            };
            var insertQueue = new InsertQueue();
            insertQueue._exec = function() { data.exec = true; };
            insertQueue._schedule = function(items, ti, bs, bd, op, exec) {
                data.op = op;
                data.items = items;
                data.bs = bs;
                data.bd = bd;
                data.ti = ti;
                exec();
            };

            insertQueue.schedule("op", "items", "bs", "bd", "ti");
            ok(data.op == "op" && data.items == "items" && data.ti == "ti" &&
               data.bs == "bs" && data.bd == "bd" && data.exec, "schedule ok");

            clearTestData();
        },

        _scheduleFnExec: function(assert) {
            var origDelay = null;
            var called = false;
            var calledWithDefDelay = false;

            var initFn = function() {
                origDelay = C.INSERT_BATCH_DELAY;
                C.INSERT_BATCH_DELAY = 0;

                var insertQueue = new InsertQueue();
                insertQueue.scheduleFnExec([{id: 1}, {id: 2}], 1, 0, function(batch) {
                    if(batch[0].id == 2)
                        called = true;
                });
                var insertQueue2 = new InsertQueue();
                insertQueue2.scheduleFnExec([{id: 1}, {id: 2}], 2, false, function(batch) {
                    if(batch[1].id == 2)
                        calledWithDefDelay = true;
                });
            };
            var checkFn = function() {
                C.INSERT_BATCH_DELAY = origDelay;
                ok(calledWithDefDelay, "scheduleFnExec ok");
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
            clearTestData();
        },

        __schedule: function(assert) {
            var data = {items: null, ti: null, op: null, opFn: null};
            var data2 = {bs: null, bd: null, items: null, ti: null, op: null, opFn: null};

            var initFn = function() {
                var insertQueue = new InsertQueue();
                insertQueue._execSchedule = function(items, ti, op, opFn) {
                    data.items = items;
                    data.ti = ti;
                    data.op = op;
                    data.opFn = opFn;
                };
                insertQueue._schedule("items", "target", undefined, undefined, "op", "opFn");

                var insertQueue2 = new InsertQueue();
                insertQueue2.scheduleFnExec = function(items, bs, bd, scFn) {
                    data2.bs = bs;
                    data2.bd = bd;
                    scFn(items);
                };
                insertQueue2._execSchedule = function(items, ti, op, opFn) {
                    data2.items = items;
                    data2.ti = ti;
                    data2.op = op;
                    data2.opFn = opFn;
                };
                insertQueue2._schedule("items", "target", 2, 100, "op", "opFn");
            };
            var checkFn = function() {
                var exec1Ok = (data.items == "items" && data.ti == "target" &&
                               data.op == "op" && data.opFn == "opFn");
                var exec2Ok = (data2.bs == 2 && data2.bd == 100 && data2.items == "items" &&
                               data2.ti == "target" && data2.op == "op" && data2.opFn == "opFn");
                ok(exec1Ok && exec2Ok, "_schedule ok");
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        },

        _execSchedule: function() {
            var getData = function() { return {items: null, targetItem: null, op: null}; };
            var data = getData();
            repositionQueue = {isEmpty: function() { return true; }};

            var insertQueue = new InsertQueue();
            insertQueue._execSchedule("items", "ti", "op", function(items, ti, op) {
                data.items = items;
                data.targetItem = ti;
                data.op = op;
            });

            ok(data.items == "items" && data.targetItem == "ti" && data.op == "op",
               "execSchedule ok");

            repositionQueue = {isEmpty: function() { return false; }};
            insertQueue._isWaitingForRpsQueue = true;

            insertQueue._execSchedule("items", "ti", "op");
            ok(insertQueue._queue[0].op == "op" && insertQueue._queue[0].targetItem == "ti" &&
               insertQueue._queue[0].items == "items", "execSchedule on wait for repos queue ok");

            clearTestData();
        },

        _execScheduleOnBusyReposQueue: function(assert) {
            var insertQueue = new InsertQueue();
            var called = false;
            var origDelay = null;

            var initFn = function() {
                origDelay = C.INSERT_QUEUE_DELAY;
                C.INSERT_QUEUE_DELAY = 0;
                repositionQueue = {isEmpty: function() { return false; }};
                insertQueue._process = function() { called = true; };

                insertQueue._execSchedule("i", "ti", "op");
            };
            var checkFn = function() {
                C.INSERT_QUEUE_DELAY = origDelay;
                ok(called && insertQueue._isWaitingForRpsQueue,
                   "execSchedule on busy repos queue ok");
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        },

        _process: function() {
            repositionQueue = {isEmpty: function() { return true; }};
            var data = {items: [], targetItem: [], op: []};

            var insertQueue = new InsertQueue();
            insertQueue._exec = function(items, targetItem, op) {
                data.items.push(items);
                data.targetItem.push(targetItem);
                data.op.push(op);
            };

            insertQueue._queue = [
                {items: "items1", op: "op1", targetItem: "ti1"},
                {items: "items2", op: "op2", targetItem: "ti2"}
            ];
            insertQueue._isWaitingForRpsQueue = true;

            insertQueue._process();
            ok(
                data.items[0] == "items1" && data.items[1] == "items2" &&
                data.op[0] == "op1" && data.op[1] == "op2" &&
                data.targetItem[0] == "ti1" && data.targetItem[1] == "ti2" &&
                !insertQueue._isWaitingForRpsQueue,
                "process ok"
            );

            clearTestData();
        },

        _processOnBusyReposQueue: function(assert) {
            var insertQueue = new InsertQueue();
            var called = false;
            var origDelay = null;

            var initFn = function() {
                origDelay = C.INSERT_QUEUE_DELAY;
                C.INSERT_QUEUE_DELAY = 0;
                repositionQueue = {isEmpty: function() { return false; }};
                insertQueue._process = function() { called = true; };
                insertQueue._isWaitingForRpsQueue = true;

                insertQueue._queue.push({});
                insertQueue._process();
            };
            var checkFn = function() {
                C.INSERT_QUEUE_DELAY = origDelay;
                ok(called && insertQueue._isWaitingForRpsQueue,
                   "process on busy repos queue ok");
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        },

        _exec: function(assert) {
            var fnitems = null;
            var fnti = null;
            prependOp = {
                exec: function(items) {
                    fnitems = items;
                }
            };
            appendOp = {
                exec: function(items) {
                    fnitems = items;
                },
                execInsBefore: function(items, ti) {
                    fnitems = items;
                    fnti = ti;
                },
                execInsAfter: function(items, ti) {
                    fnitems = items;
                    fnti = ti;
                }
            };

            var insertQueue = new InsertQueue();

            insertQueue._exec("items1", "ti1", OPS.PREPEND);
            ok(fnitems == "items1", "exec prepend op ok");

            insertQueue._exec("items2", null, OPS.APPEND);
            ok(fnitems == "items2", "exec append op ok");

            insertQueue._exec("items3", "ib", OPS.INS_BEFORE);
            ok(fnitems == "items3" && fnti == "ib", "exec ins before ok");

            insertQueue._exec("items4", "ia", OPS.INS_AFTER);
            ok(fnitems == "items4" && fnti == "ia", "exec ins after ok");

            assert.throws(
                function() { insertQueue._exec("", "", "wrongOp"); },
                /wrong op/,
                "exec with wrong op ok"
            );

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});