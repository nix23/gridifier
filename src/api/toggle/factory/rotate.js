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

RotateToggleFactory = function(settings) {
    this._settings = settings;
    this._rotate = new RotateToggle();
    this.create();
}

proto(RotateToggleFactory, {
    create: function() {
        var postfixes = ["", "WithFade", "WithFadeOut"];
        var fades = [
            ROTATE.FADES.NONE,
            ROTATE.FADES.FULL,
            ROTATE.FADES.ON_HIDE_MIDDLE
        ];

        for(var i = 0; i < postfixes.length; i++) {
            for(var prop in ROTATE.MATRICES) {
                var matrix = ROTATE.MATRICES[prop];
                this._create("rotate3d" + prop + postfixes[i], "show3d", "hide3d", matrix, fades[i]);
            }

            for(var prop in ROTATE.FNS) {
                var rotateProp = ROTATE.FNS[prop];
                this._create("rotate" + prop + postfixes[i], "show", "hide", rotateProp, fades[i]);
            }
        }
    },

    _create: function(name, showFnName, hideFnName, matrixOrProp, fadeType) {
        var me = this;
        me._settings.addApi("toggle", name, {
            show: function(item, left, top, time, timing, ev, sync, dom, api, cn) {
                sync.flush(item);
                if(!dom.hasTransitions()) {
                    dom.show(item);
                    ev.emit(api.EVENT.SHOW, item);
                    return;
                }

                me._rotate.setFadeType(fadeType);
                me._rotate.setParams(time, timing, ev, sync, dom, api, cn);
                me._rotate[showFnName](item, matrixOrProp);
            },

            hide: function(item, left, top, time, timing, ev, sync, dom, api, cn) {
                sync.flush(item);
                if(!dom.hasTransitions()) {
                    dom.hide(item);
                    ev.emit(api.EVENT.HIDE, item);
                    return;
                }

                me._rotate.setFadeType(fadeType);
                me._rotate.setParams(time, timing, ev, sync, dom, api, cn);
                me._rotate[hideFnName](item, matrixOrProp);
            }
        });
    }
});