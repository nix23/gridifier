$(document).ready(function() {
    module("RepositionCrs");

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
                    "recreateForFirstOnDefAppend",
                    "recreateForFirstOnRevAppend",
                    "recreate"
                ]);
            });
        },

        _recreateForFirstOnDefAppend: function() {
            settings = new Settings();

            var lastOp = null;
            operation = {setLast: function(op) { lastOp = op; }};

            appender = {id: "appender"};

            var item = null;
            var cn = null;
            var app = null;
            var type = "";

            var repositionCrs = new RepositionCrs();
            repositionCrs._recreate = function(i, c, a, t) {
                item = i;
                cn = c;
                app = a;
                type = t;
            };

            repositionCrs.recreateForFirst({id: "item"}, {id: "cn"});
            ok(lastOp == OPS.APPEND && item.id == "item" && cn.id == "cn" &&
               app.id == "appender" && type == "Def", "recreateForFirst def append ok");

            clearTestData();
        },

        _recreateForFirstOnRevAppend: function() {
            ev = new EventEmitter();
            sourceSettings = {append: "reversed"};
            settings = new Settings();

            var lastOp = null;
            operation = {setLast: function(op) { lastOp = op; }};

            reversedAppender = {id: "reversedAppender"};

            var item = null;
            var cn = null;
            var app = null;
            var type = "";

            var repositionCrs = new RepositionCrs();
            repositionCrs._recreate = function(i, c, a, t) {
                item = i;
                cn = c;
                app = a;
                type = t;
            };

            repositionCrs.recreateForFirst({id: "item"}, {id: "cn"});
            ok(lastOp == OPS.REV_APPEND && item.id == "item" && cn.id == "cn" &&
               app.id == "reversedAppender" && type == "Rev", "recreateForFirst rev append ok");

            clearTestData();
        },

        _recreate: function() {
            ev = new EventEmitter();
            settings = new Settings();
            connectors = {get: function() {}};
            connections = {get: function() {}};
            Logger = {log: function() {}};

            var rangesReinited = false;
            var reappenderCalled = false;
            var crsCleaned = false;

            connections.reinitRanges = function() { rangesReinited = true; };
            var reappender = {recreateCrs: function() { reappenderCalled = true; }};
            crsCleaner = {rmIntFromBottom: function() { crsCleaned = true; }};

            var repositionCrs = new RepositionCrs();
            repositionCrs._recreate({}, {}, reappender, "");

            ok(rangesReinited && reappenderCalled && crsCleaned, "recreate on vgrid ok");

            sourceSettings = {grid: "horizontal"};
            settings = new Settings();

            rangesReinited = false;
            reappenderCalled = false;
            crsCleaned = false;
            crsCleaner = {rmIntFromRight: function() { crsCleaned = true; }};

            repositionCrs._recreate({}, {}, reappender, "");
            ok(rangesReinited && reappenderCalled && crsCleaned, "recreate on hgrid ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});