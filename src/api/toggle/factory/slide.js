/* Gridifier v2.~.~ source file for custom build.
 * Async Responsive HTML Grids
 * http://gridifier.io
 * 
 * Gridifier is dual-licensed:
 *   GPLV3 per non-commercial usage; 
 *   Commercial license per commercial usage.
 * Read http://gridifier.io/license for details.
 * Copyright 2015 nTech
 */

SlideToggleFactory = function(settings) {
    this._create(settings);
    this._createPairs(settings);
    this._createCustom(settings);
}

proto(SlideToggleFactory, {
    _create: function(s) {
        var names = [
            "Left",   "LeftTop",    "LeftBottom",
            "Right",  "RightTop",   "RightBottom",
            "Top",    "TopLeft",    "TopRight",
            "Bottom", "BottomLeft", "BottomRight"
        ];
        var params = [
            [false, false, false],
            [true,  false, false],
            [false, true,  false],
            [false, false, true],
            [true,  false, true],
            [false, true,  true]
        ];

        var createSliders = function(names, fade) {
            var slide = new SlideToggle();
            var sn = "toggle";

            for(var i = 0; i <= 5; i++) {
                var ps = params[i];
                s.addApi(sn, "slide" + names[i], slide.create(false, ps[0], ps[1], ps[2], fade));
            }

            for(var i = 0; i <= 5; i++) {
                var ps = params[i];
                s.addApi(sn, "slide" + names[i + 6], slide.create(true, ps[0], ps[1], ps[2], fade));
            }
        }

        createSliders(names, false);
        for(var i = 0; i < names.length; i++)
            names[i] += "WithFade";
        createSliders(names, true);
    },

    _createPairs: function(s) {
        var slide = new SlideToggle();
        var pairs = [
            ["LeftThenRight", "Left", "Right"],
            ["TopThenBottom", "Top", "Bottom"],
            ["LeftTopThenRightTop", "LeftTop", "RightTop"],
            ["TopLeftThenBottomLeft", "TopLeft", "BottomLeft"],
            ["LeftBottomThenRightBottom", "LeftBottom", "RightBottom"],
            ["TopRightThenBottomRight", "TopRight", "BottomRight"]
        ];

        for(var i = 0; i < pairs.length; i++) {
            var pr = "slide";
            var wf = "WithFade";

            s.addApi("toggle", pr + pairs[i][0], slide.createCycled([
                s.get("toggle")[pr + pairs[i][1]], s.get("toggle")[pr + pairs[i][2]]
            ]));

            s.addApi("toggle", pr + pairs[i][0] + wf, slide.createCycled([
                s.get("toggle")[pr + pairs[i][1] + wf], s.get("toggle")[pr + pairs[i][2] + wf]
            ]));
        }
    },

    _createCustom: function(s) {
        var slide = new SlideToggle();
        var pr = "slide";
        var wf = "WithFade";
        var custom = [
            ["ClockwiseFromCenters", "Left", "Top", "Right", "Bottom"],
            ["ClockwiseFromSides", "Left", "Top", "Right", "Bottom"],
            ["ClockwiseFromCorners", "LeftTop", "RightTop", "RightBottom", "LeftBottom"]
        ];

        for(var i = 0; i < custom.length; i++) {
            s.addApi("toggle", pr + custom[i][0], slide.createCycled([
                s.get("toggle")[pr + custom[i][1]],
                s.get("toggle")[pr + custom[i][2]],
                s.get("toggle")[pr + custom[i][3]],
                s.get("toggle")[pr + custom[i][4]]
            ]));

            s.addApi("toggle", pr + custom[i][0] + wf, slide.createCycled([
                s.get("toggle")[pr + custom[i][1] + wf],
                s.get("toggle")[pr + custom[i][2] + wf],
                s.get("toggle")[pr + custom[i][3] + wf],
                s.get("toggle")[pr + custom[i][4] + wf]
            ]));
        }
    }
});