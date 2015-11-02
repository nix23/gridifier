$(document).ready(function() {
    module("DragifierApi");

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
                    "toggleSelect"
                ]);
            });
        },

        _toggleSelect: function() {
            var dragifierApi = new DragifierApi();
            var toggler = dragifierApi.getSelectToggler();

            ok(dragifierApi._selectToggler != null,
               "select toggler cached ok");
            ok(toggler._target.nodeName == "BODY", "target ok");

            var target = {style: {
                "webkitTouchCallout": "orig",
                "webkitUserSelect": "orig",
                "khtmlUserSelect": "orig",
                "mozUserSelect": "orig",
                "msUserSelect": "orig",
                "userSelect": "orig",
                "anotherAttr": "orig"
            }};
            toggler._target = target;

            toggler.disableSelect();
            ok(
                target.style.webkitTouchCallout == "none" &&
                target.style.webkitUserSelect == "none" &&
                target.style.khtmlUserSelect == "none" &&
                target.style.mozUserSelect == "none" &&
                target.style.msUserSelect == "none" &&
                target.style.userSelect == "none" &&
                target.style.anotherAttr == "orig" &&
                toggler._origProps.mozUserSelect == "orig",
                "disableSelect ok"
            );

            toggler.enableSelect();
            ok(
                target.style.webkitTouchCallout == "orig" &&
                target.style.webkitUserSelect == "orig" &&
                target.style.khtmlUserSelect == "orig" &&
                target.style.mozUserSelect == "orig" &&
                target.style.msUserSelect == "orig" &&
                target.style.userSelect == "orig" &&
                target.style.anotherAttr == "orig" &&
                !Dom.hasOwnProp(toggler._origProps, "mozUserSelect"),
                "enableSelect ok"
            );

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});