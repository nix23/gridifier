/* Gridifier v1.~.~ source file for custom build.
 * Async Responsive HTML Grids
 * http://gridifier.io
 * 
 * Gridifier is dual-licensed:
 *   GPLV3 per non-commercial usage; 
 *   Commercial license per commercial usage.
 * Read http://gridifier.io/license for details.
 * Copyright 2015 nTech
 */

Gridifier.Discretizer.Demonstrator = function(a, b) {
    var c = this;
    this._gridifier = null;
    this._settings = null;
    this._demonstrator = null;
    this._demonstratorClickHandler = null;
    this._css = {};
    this._construct = function() {
        c._gridifier = a;
        c._settings = b;
        c._bindEvents();
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        c._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.Discretizer.Demonstrator.prototype.create = function(a) {
    this._createDemonstrator();
    this._decorateDemonstrator();
    this._bindDemonstratorDeleteOnClick();
    this._createCells(a);
};

Gridifier.Discretizer.Demonstrator.prototype._createDemonstrator = function() {
    this._demonstrator = document.createElement("div");
    this._gridifier.getGrid().appendChild(this._demonstrator);
    Dom.css.set(this._demonstrator, {
        width: this._gridifier.getGridX2() + 1 + "px",
        height: this._gridifier.getGridY2() + 1 + "px",
        position: "absolute",
        left: "0px",
        top: "0px"
    });
};

Gridifier.Discretizer.Demonstrator.prototype._decorateDemonstrator = function() {
    Dom.css.set(this._demonstrator, {
        background: "rgb(235,235,235)",
        zIndex: "100",
        opacity: "0.8"
    });
};

Gridifier.Discretizer.Demonstrator.prototype._bindDemonstratorDeleteOnClick = function() {
    var a = this;
    this._demonstratorClickHandler = function() {
        Event.remove(a._demonstrator, "click", a._demonstratorClickHandler);
        a["delete"].call(a);
    };
    Event.add(this._demonstrator, "click", this._demonstratorClickHandler);
};

Gridifier.Discretizer.Demonstrator.prototype.update = function(a) {
    if (this._demonstrator != null) this["delete"].call(this);
    this.create(a);
};

Gridifier.Discretizer.Demonstrator.prototype["delete"] = function() {
    if (this._demonstrator == null) return;
    this._demonstrator.parentNode.removeChild(this._demonstrator);
    this._demonstrator = null;
};

Gridifier.Discretizer.Demonstrator.prototype._createCells = function(a) {
    var b = [ "gridFirstBorderColor", "gridSecondBorderColor", "gridThirdBorderColor", "gridFourthBorderColor", "gridFifthBorderColor" ];
    var c = -1;
    for (var d = 0; d < a.length; d++) {
        for (var e = 0; e < a[d].length; e++) {
            var f = document.createElement("div");
            var g = a[d][e].x2 - a[d][e].x1 + 1;
            var h = a[d][e].y2 - a[d][e].y1 + 1;
            c++;
            if (c == 5) {
                b.reverse();
                c = 0;
            }
            f.setAttribute("class", b[c]);
            Dom.css.set(f, {
                position: "absolute",
                boxSizing: "border-box",
                left: a[d][e].x1 + "px",
                top: a[d][e].y1 + "px",
                width: g + "px",
                height: h + "px",
                border: "5px dashed"
            });
            if (a[d][e][Gridifier.Discretizer.IS_INTERSECTED_BY_ITEM]) {
                f.style.background = "red";
                f.style.opacity = "1";
            }
            this._demonstrator.appendChild(f);
            var i = document.createElement("div");
            Dom.css.set(i, {
                position: "absolute",
                left: a[d][e][Gridifier.Discretizer.CELL_CENTER_X] + "px",
                top: a[d][e][Gridifier.Discretizer.CELL_CENTER_Y] + "px",
                width: "5px",
                height: "5px",
                background: "black"
            });
            this._demonstrator.appendChild(i);
        }
    }
};