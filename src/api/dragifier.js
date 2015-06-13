/* Gridifier v1.0.0
 * Async Responsive HTML Grids
 * http://gridifier.io
 * 
 * Gridifier is dual-licensed:
 *   GPLV3 per non-commercial usage; 
 *   Commercial license per commercial usage.
 * Read http://gridifier.io/license for details.
 * Copyright 2015 nTech
 */

Gridifier.Api.Dragifier = function() {
    var me = this;

    this._draggableItemDecoratorFunction = null;
    this._draggableItemDecoratorFunctions = {};

    this._dragifierUserSelectToggler = null;

    this._css = {
    };

    this._construct = function() {
        me._bindEvents();

        me._addCloneCSSDecoratorFunction();
    };

    this._bindEvents = function() {
    };

    this._unbindEvents = function() {
    };

    this.destruct = function() {
        me._unbindEvents();
    };

    this._construct();
    return this;
}

Gridifier.Api.Dragifier.prototype.setDraggableItemDecoratorFunction = function(draggableItemDecoratorFunctionName) {
    if(!this._draggableItemDecoratorFunctions.hasOwnProperty(draggableItemDecoratorFunctionName)) {
        new Gridifier.Error(
            Gridifier.Error.ERROR_TYPES.SETTINGS.SET_DRAGGABLE_ITEM_DECORATOR_INVALID_PARAM,
            draggableItemDecoratorFunctionName
        );
        return;
    }

    this._draggableItemDecoratorFunction = this._draggableItemDecoratorFunctions[draggableItemDecoratorFunctionName];
}

Gridifier.Api.Dragifier.prototype.addDraggableItemDecoratorFunction = function(draggableItemDecoratorFunctionName,
                                                                               draggableItemDecoratorFunction) {
    this._draggableItemDecoratorFunctions[draggableItemDecoratorFunctionName] = draggableItemDecoratorFunction;
}

Gridifier.Api.Dragifier.prototype.getDraggableItemDecoratorFunction = function() {
    return this._draggableItemDecoratorFunction;
}

Gridifier.Api.Dragifier.prototype.getDraggableItemCoordsChanger = function() {
    return function(item, newLeft, newTop) {
        if(!Dom.isBrowserSupportingTransitions()) {
            Dom.css.set(item, {
                left: newLeft,
                top: newTop
            });
            return;
        }

        var newLeft = parseFloat(newLeft);
        var newTop = parseFloat(newTop);

        var currentLeft = parseFloat(item.style.left);
        var currentTop = parseFloat(item.style.top);

        if(newLeft > currentLeft)
            var translateX = newLeft - currentLeft;
        else if(newLeft < currentLeft)
            var translateX = (currentLeft - newLeft) * -1;
        else
            var translateX = 0;

        if(newTop > currentTop)
            var translateY = newTop - currentTop;
        else if(newTop < currentTop)
            var translateY = (currentTop - newTop) * -1;
        else
            var translateY = 0;

        Dom.css3.transitionProperty(item, "none");
        Dom.css3.perspective(item, "1000");
        Dom.css3.backfaceVisibility(item, "hidden");
        Dom.css3.transformProperty(item, "translate3d", translateX + "px," + translateY + "px, 0px");
    };
}

Gridifier.Api.Dragifier.prototype.getDraggableItemPointerDecorator = function() {
    return function(draggableItemPointer) {
        Dom.css.addClass(draggableItemPointer, "gridifier-draggable-item-pointer");
        draggableItemPointer.style.backgroundColor = "red";
    };
}

Gridifier.Api.Dragifier.prototype.getDragifierUserSelectToggler = function() {
    if(this._dragifierUserSelectToggler != null)
        return this._dragifierUserSelectToggler;

    this._dragifierUserSelectToggler = {
        _setToNoneOriginalSelectProps: {},

        _hasSelectProp: function(propName) {
            return (typeof document.body.style[propName] != "undefined");
        },

        _selectProps: ["webkitTouchCallout", "webkitUserSelect", "khtmlUserSelect",
                       "mozUserSelect", "msUserSelect", "userSelect"],

        'disableSelect': function() {
            for(var i = 0; i < this._selectProps.length; i++) {
                if(this._hasSelectProp(this._selectProps[i])) {
                    this._setToNoneOriginalSelectProps[this._selectProps[i]] = document.body.style[this._selectProps[i]];
                    document.body.style[this._selectProps[i]] = "none";
                }
            }
        },

        'enableSelect': function() {
            for(var selectPropToRestore in this._setToNoneOriginalSelectProps) {
                document.body.style[selectPropToRestore] = this._setToNoneOriginalSelectProps[selectPropToRestore];
            }

            this._setToNoneOriginalSelectProps = {};
        }
    };

    return this._dragifierUserSelectToggler;
}

Gridifier.Api.Dragifier.prototype._addCloneCSSDecoratorFunction = function() {
    this._draggableItemDecoratorFunctions['cloneCSS'] = function(draggableItemClone, draggableItem, sizesResolverManager) {
        sizesResolverManager.copyComputedStyle(draggableItem, draggableItemClone);
    };
}