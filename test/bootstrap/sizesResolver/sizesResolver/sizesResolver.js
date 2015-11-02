$(document).ready(function() {
    module("SizesResolver");

    var tester = {
        _before: function() {
            ;
        },

        _after: function() {

        },

        runTests: function() {
            var me = this;

            test("main", function(assert) {
                var test = function(tests) {
                    me._before.call(me);

                    for(var i = 0; i < tests.length; i++)
                        me["_" + tests[i]].call(me, assert);

                    me._after.call(me);
                }

                test([
                    "isDefBoxSizing",
                    "isOuterBoxSizing",
                    "normalizeComputedCSS",
                    "getComputedProps",
                    "position",
                    "offset",
                    "cloneComputedStyle"
                ]);
            });
        },

        _isDefBoxSizing: function() {
            var origProps = SizesResolver._prefixedProps;

            SizesResolver._prefixedProps = {boxSizing: "boxSizing"};
            ok(SizesResolver._isDefBoxSizing({boxSizing: "border-box"}), "_isDefBoxSizing - yes");
            ok(!SizesResolver._isDefBoxSizing({boxSizing: "fake-box"}), "_isDefBoxSizing - no");

            SizesResolver._prefixedProps = origProps;
        },

        _isOuterBoxSizing: function() {
            var origProp = SizesResolver._borderBoxType;

            SizesResolver._borderBoxType = SizesResolver._borderBoxTypes.INNER;
            ok(!SizesResolver._isOuterBoxSizing(), "not outer box sizing");

            SizesResolver._borderBoxType = SizesResolver._borderBoxTypes.OUTER;
            ok(SizesResolver._isOuterBoxSizing(), "is outer box sizing");

            SizesResolver._borderBoxType = origProp;
        },

        _normalizeComputedCSS: function() {
            ok(SizesResolver._normalizeComputedCSS("14.42px") == 14.42, "normalize 14.42px ok");
            ok(!SizesResolver._normalizeComputedCSS("145%"), "normalize 145% ok");
            ok(!SizesResolver._normalizeComputedCSS("%%"), "normalize false val ok");
        },

        _getComputedProps: function() {
            var fakeCompCss = {
                paddingLeft: "10", paddingRight: "10", marginLeft: "5px", marginRight: "5",
                borderLeftWidth: "2", borderRightWidth: "2"
            };

            var compProps = SizesResolver._getComputedProps("forOw", fakeCompCss, Dom.div());
            ok(compProps.paddingLeft == 10 && compProps.paddingRight == 10 &&
               compProps.marginLeft == 5 && compProps.marginRight == 5 &&
               compProps.borderLeftWidth == 2 && compProps.borderRightWidth == 2,
               "getComputedProps for ow ok");

            var fakeCompCss = {
                paddingTop: "10", paddingBottom: "10", marginTop: "5px", marginBottom: "5",
                borderTopWidth: "2", borderBottomWidth: "2"
            };

            var compProps = SizesResolver._getComputedProps("forOh", fakeCompCss, Dom.div());
            ok(compProps.paddingTop == 10 && compProps.paddingBottom == 10 &&
                compProps.marginTop == 5 && compProps.marginBottom == 5 &&
                compProps.borderTopWidth == 2 && compProps.borderBottomWidth == 2,
                "getComputedProps for oh ok");

            var fakeCompCss = {
                marginLeft: "5", marginTop: "5"
            };
            var compProps = SizesResolver._getComputedProps("forPosLeft", fakeCompCss, Dom.div());
            var compProps2 = SizesResolver._getComputedProps("forPosTop", fakeCompCss, Dom.div());
            ok(compProps.marginLeft == 5 && compProps2.marginTop == 5, "getComputedStyle for pos left/top ok");
        },

        _position: function() {
            var $wrapper = $("<div/>").css({width: "100px", height: "100px", position: "relative"});
            var $item = $("<div/>").css({
                width: "20px", height: "20px", position: "absolute",
                left: "30px", top: "40px"
            });
            $wrapper.append($item);
            $testContent.append($wrapper);

            $item.css("display", "none");
            ok(SizesResolver.positionLeft($item.get(0)) == 0 &&
               SizesResolver.positionTop($item.get(0)) == 0,
               "position left/top with dis:none = 0");

            $item.css("display", "block");
            ok(SizesResolver.positionLeft($item.get(0)) == 30 &&
               SizesResolver.positionTop($item.get(0)) == 40,
               "position left/top ok");

            $item.css({"margin-left": "20px", "margin-right": "20px"});
            ok(SizesResolver.positionLeft($item.get(0)) == 30 &&
               SizesResolver.positionTop($item.get(0)) == 40,
               "position left/top with margins ok");

            clearTestData();
        },

        _offset: function() {
            var $wrapper = $("<div/>").css({
                width: "100px", height: "100px", position: "absolute",
                left: "20px", top: "20px"
            });
            var $item = $("<div/>").css({
                width: "20px", height: "20px", position: "absolute",
                left: "30px", top: "40px"
            });
            $wrapper.append($item);
            $testContent.append($wrapper);

            ok(SizesResolver.offsetLeft($item.get(0)) == 50 &&
               SizesResolver.offsetTop($item.get(0)) == 60,
               "offset left/top ok");

            clearTestData();
        },

        _cloneComputedStyle: function() {
            var origFn = SizesResolver.getComputedCSS;

            SizesResolver.getComputedCSS = function() {
                return {"padding-left": "10px", "paddingLeft": "10px", "paddingRight": "20px"};
            };

            var target = {style: {"paddingLeft": "", "paddingRight": ""}};
            SizesResolver.cloneComputedStyle(Dom.div(), target);
            ok(target.style.paddingLeft == "10px" && target.style.paddingRight == "20px", "cloneProps ok");

            SizesResolver.getComputedCSS = origFn;

            var compCss = {"fontSize": "20px", "borderLeftWidth": "10px", "borderTopStyle": "20px"};
            var target = {style: {"fontSize": "", "borderLeftWidth": "", "borderTopStyle": ""}};
            SizesResolver._reclone(compCss, target);
            ok(target.style.fontSize == "20px" && target.style.borderLeftWidth == "10px"
               && target.style.borderTopStyle == "20px", "recloneProps ok");
        }
    };

    tester.runTests();
    clearTestData();
});