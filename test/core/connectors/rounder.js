$(document).ready(function() {
    module("CrsRounder");

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
                    "roundCnPerBottomLeftCr",
                    "roundCnPerRightTopCr",
                    "roundCnPerLeftTopCr",
                    "roundCnPerBottomRightCr",
                    "roundCnPerLeftBottomCr",
                    "roundCnPerTopRightCr",
                    "roundCnPerTopLeftCr",
                    "roundCnPerRightBottomCr",
                    "unroundCnPerCr"
                ]);
            });
        },

        _roundCnPerBottomLeftCr: function() {
            connectors = new Connectors();
            var crsRounder = new CrsRounder();

            var cn = {x1: 16.16, x2: 16.76, y1: 16.16, y2: 16.99};
            var cr = {x: 0, y: 0, side: CRS.BOTTOM.LEFT, type: CRS.APPEND.DEF};
            crsRounder.roundCnPerCr(cn, cr);
            ok(cn.x1 == 16 && cn.y1 == 16, "round cn per bottomLeft cr ok");
        },

        _roundCnPerRightTopCr: function() {
            connectors = new Connectors();
            var crsRounder = new CrsRounder();

            var cn = {x1: 16.16, x2: 16.76, y1: 16.16, y2: 16.99};
            var cr = {x: 0, y: 0, side: CRS.RIGHT.TOP, type: CRS.APPEND.DEF};
            crsRounder.roundCnPerCr(cn, cr);
            ok(cn.x1 == 16 && cn.y1 == 16, "round cn per rightTop cr ok");
        },

        _roundCnPerLeftTopCr: function() {
            connectors = new Connectors();
            var crsRounder = new CrsRounder();

            var cn = {x1: 16.16, x2: 16.76, y1: 16.16, y2: 16.99};
            var cr = {x: 0, y: 0, side: CRS.LEFT.TOP, type: CRS.APPEND.DEF};
            crsRounder.roundCnPerCr(cn, cr);
            ok(cn.x2 == 17 && cn.y1 == 16, "round cn per leftTop cr ok");
        },

        _roundCnPerBottomRightCr: function() {
            connectors = new Connectors();
            var crsRounder = new CrsRounder();

            var cn = {x1: 16.16, x2: 16.76, y1: 16.16, y2: 16.99};
            var cr = {x: 0, y: 0, side: CRS.BOTTOM.RIGHT, type: CRS.APPEND.DEF};
            crsRounder.roundCnPerCr(cn, cr);
            ok(cn.x2 == 17 && cn.y1 == 16, "round cn per bottomRight cr ok");
        },

        _roundCnPerLeftBottomCr: function() {
            connectors = new Connectors();
            var crsRounder = new CrsRounder();

            var cn = {x1: 16.16, x2: 16.76, y1: 16.16, y2: 16.99};
            var cr = {x: 0, y: 0, side: CRS.LEFT.BOTTOM, type: CRS.APPEND.DEF};
            crsRounder.roundCnPerCr(cn, cr);
            ok(cn.x2 == 17 && cn.y2 == 17, "round cn per leftBottom cr ok");
        },

        _roundCnPerTopRightCr: function() {
            connectors = new Connectors();
            var crsRounder = new CrsRounder();

            var cn = {x1: 16.16, x2: 16.76, y1: 16.16, y2: 16.99};
            var cr = {x: 0, y: 0, side: CRS.TOP.RIGHT, type: CRS.APPEND.DEF};
            crsRounder.roundCnPerCr(cn, cr);
            ok(cn.x2 == 17 && cn.y2 == 17, "round cn per topRight cr ok");
        },

        _roundCnPerTopLeftCr: function() {
            connectors = new Connectors();
            var crsRounder = new CrsRounder();

            var cn = {x1: 16.16, x2: 16.76, y1: 16.16, y2: 16.99};
            var cr = {x: 0, y: 0, side: CRS.TOP.LEFT, type: CRS.APPEND.DEF};
            crsRounder.roundCnPerCr(cn, cr);
            ok(cn.x1 == 16 && cn.y2 == 17, "round cn per topLeft cr ok");
        },

        _roundCnPerRightBottomCr: function() {
            connectors = new Connectors();
            var crsRounder = new CrsRounder();

            var cn = {x1: 16.16, x2: 16.76, y1: 16.16, y2: 16.99};
            var cr = {x: 0, y: 0, side: CRS.RIGHT.BOTTOM, type: CRS.APPEND.DEF};
            crsRounder.roundCnPerCr(cn, cr);
            ok(cn.x1 == 16 && cn.y2 == 17, "round cn per rightBottom cr ok");
        },

        _unroundCnPerCr: function() {
            connectors = new Connectors();

            var cn = {x1: 16.16, x2: 16.76, y1: 16.16, y2: 16.99};
            var cr = {x: 0, y: 0, side: CRS.BOTTOM.LEFT, type: CRS.APPEND.DEF};
            var crsRounder = new CrsRounder();

            crsRounder.roundCnPerCr(cn, cr);
            cn.x1 = null;
            cn.x2 = null;
            cn.y1 = null;
            cn.y2 = null;
            crsRounder.unroundCnPerCr(cn, cr);

            ok(cn.x1 == 16.16 && cn.x2 == 16.76 && cn.y1 == 16.16 && cn.y2 == 16.99,
               "unround cn per cr ok");
        }
    }

    tester.runTests();
    clearTestData();
});