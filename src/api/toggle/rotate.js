/* Gridifier v2.~.~ source file for custom build.
 * Async Responsive HTML Grids
 * http://gridifier.io
 * 
 * Gridifier is dual-licensed:
 *   Non-commercial license - https://creativecommons.org/licenses/by-nc-sa/4.0/.
 *   Commercial license - http://gridifier.io/license (Commercial license).
 * Read http://gridifier.io/license for details.
 * Copyright 2015 nTech
 */

RotateToggle = function() {
    //this._time = null;
    //this._timing = null;
    //this._ev = null;
    //this._sync = null;
    //this._dom = null;
    //this._api = null;
    //this._cn = null;

    this._fadeType = null;
    this._nextRotateGUID = 0;
}

proto(RotateToggle, {
    setParams: function(time, timing, ev, sync, dom, api, cn) {
        this._time = time;
        this._timing = timing;
        this._ev = ev;
        this._sync = sync;
        this._dom = dom;
        this._api = api;
        this._cn = cn;
    },

    setFadeType: function(fadeType) {
        this._fadeType = fadeType;
    },

    show3d: function(item, rotateProp) {
        this._rotate(item, "rotate3d", rotateProp, false);
    },

    hide3d: function(item, rotateProp) {
        this._rotate(item, "rotate3d", rotateProp, true);
    },

    show: function(item, rotateProp) {
        this._rotate(item, rotateProp, "", false);
    },

    hide: function(item, rotateProp) {
        this._rotate(item, rotateProp, "", true);
    },

    _rotate: function(item, rotateProp, rotateMatrix, inverse) {
        var dom = this._dom;
        var api = this._api;
        var ev = this._ev;
        var left = this._cn.x1;
        var top = this._cn.y1;
        var show = !inverse;

        if(!dom.has(item, api.ROTATE.GUID_DATA)) {
            var isNewRotate = true;
            dom.set(item, api.ROTATE.GUID_DATA, ++this._nextRotateGUID);

            var scene = this._createScene(item, left, top);
            var frames = this._createFrames(scene);
            var itemClone = this._createClone(item);

            dom.css.addClass(scene, api.ROTATE.SCENE_CLASS_PREFIX + this._nextRotateGUID);
            dom.set(item, api.TOGGLE.IS_ACTIVE, "y");

            var frontFrame = this._createFrame(true, frames, rotateProp, rotateMatrix, show, 2);
            var backFrame = this._createFrame(false, frames, rotateProp, rotateMatrix, show, 1);

            backFrame.appendChild(itemClone);
            dom.hide(item);
        }
        else {
            var isNewRotate = false;
            var rotateGUID = dom.get(item, api.ROTATE.GUID_DATA);
            var scene = dom.find.byClass(api.grid, api.ROTATE.SCENE_CLASS_PREFIX + rotateGUID)[0];
            var frames = scene.childNodes[0];
            var frontFrame = frames.childNodes[0];
            var backFrame = frames.childNodes[1];
            var itemClone = backFrame.childNodes[0];

            // Fix per filter changes(left and top changes should be applied to scene)
            var cct = api.getS("coordsChangeTime");
            var cctm = api.getS("coordsChangeTiming");
            api.cc(scene, left, top, cct, cctm, dom, api.prefix, api.getS);
        }

        var ffPrefix = api.prefix.getForCss("transform", frontFrame);
        var bfPrefix = api.prefix.getForCss("transform", backFrame);
        dom.css3.transitionProperty(frontFrame, ffPrefix + " " + this._time + "ms " + this._timing);
        dom.css3.transitionProperty(backFrame, bfPrefix + " " + this._time + "ms " + this._timing);

        this._sync.add(item, setTimeout(function() {
            var angles = api.getS("rotateAngles");
            var frontFrameTA = angles[(show) ? 2 : 0];
            var backFrameTA = angles[(show) ? 3 : 1];

            dom.css3.transformProperty(frontFrame, rotateProp, rotateMatrix + frontFrameTA + "deg");
            dom.css3.transformProperty(backFrame, rotateProp, rotateMatrix + backFrameTA + "deg");
        }, 40));

        if(isNewRotate)
            this._initFade(scene, show, item);
        else
            this._syncFade(scene, show);

        this._sync.add(item, setTimeout(function() {
            scene.parentNode.removeChild(scene);
            dom.rm(item, api.TOGGLE.IS_ACTIVE);
            dom.rm(item, api.ROTATE.GUID_DATA);

            if(show) {
                dom.show(item);
                ev.emit(api.EVENT.SHOW, item);
            }
            else {
                dom.hide(item);
                ev.emit(api.EVENT.HIDE, item);
            }
        }, this._time + 40));
    },

    _createScene: function(item, left, top) {
        var api = this._api;
        var dom = this._dom;

        var scene = dom.div();
        var uCss = api.sr.getUncomputedCSS(item);

        dom.css.set(scene, {
            position: "absolute", left: left, top: top,
            width: api.srManager.outerWidth(item) + "px",
            height: api.srManager.outerHeight(item) + "px"
        });
        dom.css.set4(scene, "margin", uCss);
        dom.css3.perspective(scene, api.getS("rotatePerspective"));
        api.grid.appendChild(scene);

        var cct = api.getS("coordsChangeTime");
        var cctm = api.getS("coordsChangeTiming");
        // Fix per filter changes(left and top changes should be applied to scene)
        api.cc(scene, left, top, cct, cctm, dom, api.prefix, api.getS, true);
        api.cc(scene, left, top, cct, cctm, dom, api.prefix, api.getS);

        return scene;
    },

    _createFrames: function(scene) {
        var dom = this._dom;
        var frames = dom.div();

        dom.css.set(frames, {width: "100%", height: "100%", position: "absolute"});
        dom.css3.transformStyle(frames, "preserve-3d");
        dom.css3.perspective(frames, this._api.getS("rotatePerspective"));

        scene.appendChild(frames);
        return frames;
    },

    _createClone: function(item) {
        var dom = this._dom;
        var api = this._api;
        var clone = item.cloneNode(true);

        api.collect.markAsNotCollectable(clone);
        var uCss = api.sr.getUncomputedCSS(item);
        var origHeight = dom.int(uCss.height);

        dom.css.set(clone, {
            left: "0px", top: "0px", visibility: "visible",
            width: api.srManager.outerWidth(item) + "px",
            height: api.srManager.outerHeight(item) + "px"
        });
        dom.css.set4(clone, "margin", 0);
        dom.css3.transition(clone, "");
        dom.css3.transform(clone, "");

        // If orig height == 0, pad-s are used. (Paddings are dropped
        // here bec-se sizes res-ed through srManager(in px) are used)
        if(origHeight == 0)
            dom.css.set4(clone, "padding", 0);

        return clone;
    },

    _createFrame: function(isFront, frames, rotateProp, rotateMatrix, show, zi) {
        var dom = this._dom;
        var api = this._api;
        var frame = dom.div();

        dom.css.set(frame, {
            display: "block", position: "absolute",
            width: "100%", height: "100%", zIndex: zi
        });
        if(!api.getS("rotateBackface"))
            dom.css3.backfaceVisibility(frame, "hidden");

        frames.appendChild(frame);
        var prefix = api.prefix.getForCss("transform", frame);
        dom.css3.transitionProperty(frame, prefix + " 0ms " + this._timing);

        var angles = api.getS("rotateAngles"); 
        if(isFront) var initAI = (show) ? 0 : 2;
        if(!isFront) var initAI = (show) ? 1 : 3;

        dom.css3.transformProperty(frame, rotateProp, rotateMatrix + angles[initAI] + "deg");
        return frame;
    },

    _initFade: function(scene, show, item) {
        var dom = this._dom;
        var api = this._api;
        var time = this._time;
        var timing = this._timing;
        var prefix = api.prefix.getForCss("opacity", scene);
        var getTargetO = function() {
            dom.css3.transition(scene, "none");
            dom.css3.opacity(scene, (show) ? 0 : 1);
            return (show) ? 1 : 0;
        }

        if(this._fadeType == api.ROTATE.FADES.NONE)
            return;
        else if(this._fadeType == api.ROTATE.FADES.FULL) {
            var targetO = getTargetO();
            this._sync.add(item, setTimeout(function() {
                dom.css3.transition(scene, prefix + " " + time + "ms " + timing);
                dom.css3.opacity(scene, targetO);
            }, 40));
        }
        else {
            dom.css3.transition(scene, prefix + " " + (time / 2) + "ms " + timing);
            if(show) return;

            this._sync.add(item, setTimeout(function() {
                dom.css3.opacity(scene, 0);
            }, time / 2));
        }
    },

    _syncFade: function(scene, show) {
        if(this._fadeType == this._api.ROTATE.FADES.NONE)
            return;
        else
            this._dom.css3.opacity(scene, (show) ? 1 : 0);
    }
});