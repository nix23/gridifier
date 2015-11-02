$(document).ready(function() {
    module("SrManager");

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
                    "offset", "copyComputedStyle", "copyComputedStyleNoHeightLeftTopAuto"
                ]);
            });
        },

        _offset: function() {
            var origLeftFn = SizesResolver.offsetLeft;
            var origTopFn = SizesResolver.offsetTop;

            SizesResolver.offsetLeft = function() { return 10; };
            SizesResolver.offsetTop = function() { return 10; };
            var srManager = new SizesResolverManager();

            srManager.outerWidth = function(item, m) { return (m) ? 20 : 10; };
            srManager.outerHeight = function(item, m) { return (m) ? 20 : 10; };

            ok(srManager.offsetLeft(Dom.div()) == 10 && srManager.offsetTop(Dom.div()) == 10,
               "offset left/top without margins subs ok");

            ok(srManager.offsetLeft(Dom.div(), true) == 5 && srManager.offsetTop(Dom.div(), true) == 5,
               "offset left/top with margins subs ok");

            SizesResolver.offsetLeft = origLeftFn;
            SizesResolver.offsetTop = origTopFn;
        },

        _copyComputedStyle: function() {
            var origComputedCss = SizesResolver.getComputedCSS;
            var origUncomputedCss = SizesResolver.getUncomputedCSS;
            var origCloneCompStyle = SizesResolver.cloneComputedStyle;

            var srManager = new SizesResolverManager();
            srManager.positionLeft = function() { return 10; };
            srManager.positionTop = function() { return 10; };
            srManager.outerWidth = function() { return 10; };
            srManager.outerHeight = function() { return 10; };

            SizesResolver.getComputedCSS = function() {
                return {"left": "10px", "top": "10px"};
            };
            SizesResolver.getUncomputedCSS = function() {
                return {"height": "10px"};
            };
            SizesResolver.cloneComputedStyle = function(source, target) {
                for(var prop in source.style)
                    target.style[prop] = source.style[prop];
            }

            var source = {
                "style": {"left": "10px", "top": "10px", "paddingLeft": "10px", "paddingRight": "15px",
                          "width": "10px", "height": "10px"},
                "nodeType": 1,
                "childNodes": [
                    {"style": {"left": "5px", "top": "5px", "paddingLeft": "2px", "paddingRight": "2px",
                                "width": "10px", "height": "10px"},
                     "nodeType": 1, childNodes: []},

                    {"style": {"left": "5px", "top": "5px", "paddingLeft": "2px", "paddingRight": "2px",
                                "width": "10px", "height": "10px"},
                        "nodeType": 1, "childNodes": []}
                ]
            };

            var target = {
                "style": {"left": "", "top": "", "paddingLeft": "", "paddingRight": "",
                          "width": "", "height": ""},
                "nodeType": 1,
                "childNodes": [
                    {"style": {"left": "", "top": "", "paddingLeft": "", "paddingRight": "",
                               "width": "", "height": ""},
                        "nodeType": 1, "childNodes": []},

                    {"style": {"left": "", "top": "", "paddingLeft": "", "paddingRight": "",
                               "width": "", "height": ""},
                        "nodeType": 1, "childNodes": []}
                ]
            };

            srManager.copyComputedStyle(source, target);
            ok(target.style.left == "10px" && target.style.top == "10px" &&
               target.style.paddingLeft == "10px" && target.style.paddingRight == "15px" &&
               target.style.width == "10px" && target.style.height == "10px" &&
               target.childNodes[0].style.left == "10px" && target.childNodes[0].style.paddingLeft == "2px" &&
               target.childNodes[1].style.left == "10px" && target.childNodes[1].style.paddingRight == "2px",
               "copyComputedStyle ok");

            SizesResolver.getComputedCSS = origComputedCss;
            SizesResolver.getUncomputedCSS = origUncomputedCss;
            SizesResolver.cloneComputedStyle = origCloneCompStyle;
        },

        _copyComputedStyleNoHeightLeftTopAuto: function() {
            var origComputedCss = SizesResolver.getComputedCSS;
            var origUncomputedCss = SizesResolver.getUncomputedCSS;
            var origCloneCompStyle = SizesResolver.cloneComputedStyle;

            var srManager = new SizesResolverManager();
            srManager.positionLeft = function() { return 10; };
            srManager.positionTop = function() { return 10; };
            srManager.outerWidth = function() { return 10; };
            srManager.outerHeight = function() { return 10; };

            SizesResolver.getComputedCSS = function() {
                return {"left": "auto", "top": "auto"};
            };
            SizesResolver.getUncomputedCSS = function() {
                return {"height": "0px"};
            };
            SizesResolver.cloneComputedStyle = function(source, target) {
                for(var prop in source.style)
                    target.style[prop] = source.style[prop];
            }

            var source = {
                "style": {"left": "orig", "top": "orig", "paddingLeft": "10px", "paddingRight": "15px",
                    "width": "10px", "height": "orig"},
                "nodeType": 1,
                "childNodes": [
                    {"style": {"left": "orig", "top": "orig", "paddingLeft": "2px", "paddingRight": "2px",
                        "width": "10px", "height": "orig"},
                        "nodeType": 1, childNodes: []},

                    {"style": {"left": "orig", "top": "5px", "paddingLeft": "2px", "paddingRight": "2px",
                        "width": "orig", "height": "orig"},
                        "nodeType": 1, "childNodes": []}
                ]
            };

            var target = {
                "style": {"left": "", "top": "", "paddingLeft": "", "paddingRight": "",
                    "width": "", "height": ""},
                "nodeType": 1,
                "childNodes": [
                    {"style": {"left": "", "top": "", "paddingLeft": "", "paddingRight": "",
                        "width": "", "height": ""},
                        "nodeType": 1, "childNodes": []},

                    {"style": {"left": "", "top": "", "paddingLeft": "", "paddingRight": "",
                        "width": "", "height": ""},
                        "nodeType": 1, "childNodes": []}
                ]
            };

            srManager.copyComputedStyle(source, target);
            ok(target.style.left == "orig" && target.style.top == "orig" &&
               target.style.height == "orig" && target.childNodes[0].style.left == "orig" &&
               target.childNodes[0].style.height == "orig",
               "copyComputedStyle no height, left/top auto ok");

            SizesResolver.getComputedCSS = origComputedCss;
            SizesResolver.getUncomputedCSS = origUncomputedCss;
            SizesResolver.cloneComputedStyle = origCloneCompStyle;
        }
    }

    tester.runTests();
    clearTestData();
});