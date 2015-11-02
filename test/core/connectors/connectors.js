$(document).ready(function() {
    module("Connectors");

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
                    "flush"
                ]);
            });
        },

        _crud: function() {
            var connectors = new Connectors();
            ok(Dom.isArray(connectors._crs, "init ok"));

            connectors.create(CRS.APPEND.DEF, CRS.TOP.LEFT, 0, 10, 25);
            connectors.create(CRS.PREPEND.DEF, CRS.BOTTOM.LEFT, 0, 10);
            connectors.create(CRS.APPEND.DEF, CRS.RIGHT.BOTTOM, 10.302, 52.829, 10000);

            var crs = connectors.get();
            ok(connectors.count() == 3, "crs count ok");
            ok(crs.length == 3 && crs[0].type == CRS.APPEND.DEF && crs[1].type == CRS.PREPEND.DEF
               && crs[2].type == CRS.APPEND.DEF && crs[0].side == CRS.TOP.LEFT && crs[1].side == CRS.BOTTOM.LEFT
               && crs[2].side == CRS.RIGHT.BOTTOM && crs[2].x == 10.30 && crs[2].y == 52.83
               && crs[2].itemGUID == 10000 && crs[1].itemGUID == CRS.INITIAL_GUID, "crs create/get ok");

            connectors.set([
                {type: CRS.APPEND.DEF, side: CRS.TOP.LEFT, x: 0, y: 10, itemGUID: 10000},
                {type: CRS.PREPEND.DEF, side: CRS.BOTTOM.LEFT, x: 0, y: 10, itemGUID: CRS.INITIAL_GUID}
            ]);
            crs = connectors.get();
            ok(crs.length == 2 && crs[0].itemGUID == 10000 && crs[1].itemGUID == CRS.INITIAL_GUID,
               "crs set ok");

            ok(connectors.eq(crs[0], CRS.TOP.LEFT), "cr eq TOP.LEFT ok");
            ok(!connectors.eq(crs[0], CRS.BOTTOM.RIGHT), "cr not eq BOTTOM.RIGHT ok");
            ok(connectors.isInitial(crs[1]), "is initial cr ok");
            ok(!connectors.isInitial(crs[0]), "is not inital cr ok");

            var crsClone = connectors.getClone();
            ok(crsClone.length == 2 && crsClone[0].itemGUID == 10000 && crsClone[0].crIndex == 0 &&
               crsClone[1].itemGUID == CRS.INITIAL_GUID && crsClone[1].crIndex == 1 &&
               crsClone[0].side == CRS.TOP.LEFT && crsClone[0].x == 0 && crsClone[0].y == 10,
               "getClone ok");

            clearTestData();
        },

        _flush: function() {
            var flushCbCalled = false;
            var connectors = new Connectors();

            connectors.setNextFlushCb(function() {
                flushCbCalled = true;
            });

            connectors.set([{}, {}]);
            connectors.flush();
            ok(connectors._crs.length == 0 && flushCbCalled, "flush cb call ok");

            flushCbCalled = false;
            connectors.flush();
            ok(!flushCbCalled, "flush cb second call ok");

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});