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

DragifierApi = function() {
    this._selectToggler = null;
}

proto(DragifierApi, {
    getCoordsChanger: function() {
        return function(item, left, top, dom) {
            var left = parseFloat(left);
            var top = parseFloat(top);

            if(!dom.hasTransitions()) {
                dom.css.set(item, {left: left + "px", top: top + "px"});
                return;
            }

            var currLeft = parseFloat(item.style.left);
            var currTop = parseFloat(item.style.top);

            var getTr = function(curr, prev) {
                if(curr > prev) return curr - prev;
                return (curr < prev) ? (prev - curr) * -1 : 0;
            }

            var trX = getTr(left, currLeft);
            var trY = getTr(top, currTop);

            dom.css3.transitionProperty(item, "none");
            dom.css3.perspective(item, "1000");
            dom.css3.backfaceVisibility(item, "hidden");
            dom.css3.transformProperty(item, "translate3d", trX + "px," + trY + "px,0px");
        };
    },

    getPointerStyler: function() {
        return function(pointer, dom) {
            dom.css.addClass(pointer, "gridifier-drag-pointer");
            pointer.style.backgroundColor = "red";
        };
    },

    getSelectToggler: function() {
        if(this._selectToggler != null)
            return this._selectToggler;

        this._selectToggler = {
            _target: document.body,
            _props: ["webkitTouchCallout", "webkit", "khtml", "moz", "ms", "userSelect"],
            _origProps: {},

            _hasProp: function(prop) {
                return (typeof this._target["style"][prop] != "undefined");
            },

            disableSelect: function() {
                for(var i = 0; i < this._props.length; i++) {
                    var prop = (i == 0 || i == 5) ? this._props[i] : this._props[i] + "UserSelect";
                    if(this._hasProp(prop)) {
                        this._origProps[prop] = this._target["style"][prop];
                        this._target["style"][prop] = "none";
                    }
                }
            },

            enableSelect: function() {
                for(var prop in this._origProps)
                    this._target["style"][prop] = this._origProps[prop];

                this._origProps = {};
            }
        };

        return this._selectToggler;
    }
});