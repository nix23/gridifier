/* Jquery based version of touch-click event */
TouchClickEvent = function() {
    var me = this;

    /*
       [{UID: touchDataUID, startCoords: [{x: x, y: y}, ..., N],
         startTime: timestamp, disableClick: t/f, DomElem: {}}]
        ...,
        N
       ]
    */
    this._touchData = [];
    this._nextTouchDataUID = 0;

    this._css = {
        ids: {},
        classes: {}
    }

    this._construct = function () {
        me._bindEvents();
    }

    this._bindEvents = function () {
    }

    this._unbindEvents = function () {
        ;
    }

    this.destruct = function () {
        me._unbindEvents();
    }

    this._construct();
    return this;
}

TouchClickEvent.TOUCH_CLICK_EVENT_DATA_UID_DATA_ATTR = "data-gridifierapp-touchclick-data-uid";
TouchClickEvent.RECOGNIZE_AS_SCROLL_PX_DISTANCE = 5;
TouchClickEvent.DELETE_TOUCH_DATA_AFTER_MS_COUNT = 300;

TouchClickEvent.prototype.listen = function($element, maybeListenElementChild, callbackFn) {
    var me = this;

    if(typeof maybeListenElementChild == "function") {
        var $elementChild = null;
        callbackFn = maybeListenElementChild;
    }
    else {
        var $elementChild = maybeListenElementChild;
    }
    
    $element.on("touchstart", $elementChild, function(event) {
        me._clearOutdatedTouchData();
        var DomElem = event.target;

        if(!me._hasTouchData(DomElem))
            me._addTouchData(DomElem, callbackFn);

        var touchData = me._getTouchData(DomElem);
        me._saveTouchStartCoords(event.originalEvent, touchData);
    });

    $element.on("touchend", $elementChild, function(event) {
        var DomElem = event.target;

        var touchData = me._getTouchData(DomElem);
        // We also have an option to suppress events without touchstart(touchData == null)
        // @todo -> Decide, which way we should choose
        if(touchData == null) {
            event.preventDefault();
            callbackFn(event);
            return;
        }

        // Click will not be fired with nativeScroll on Android
        if(me._isNativeTouchScroll(event.originalEvent, touchData)) {
            touchData.disableClick = true;
            return;
        }

        event.preventDefault();
        callbackFn(event);
        me._removeTouchData(DomElem);
    });

    $element.on("click", $elementChild, function(event) {
        var DomElem = event.target;

        var touchData = me._getTouchData(DomElem);
        if(touchData == null) {
            callbackFn(event);
            return;
        }

        if(touchData.disableClick) {
            me._removeTouchData(DomElem);
            return;
        }

        callbackFn(event);
    });
}

TouchClickEvent.prototype._hasTouchData = function(DomElem) {
    var attr = TouchClickEvent.TOUCH_CLICK_EVENT_DATA_UID_DATA_ATTR;
    if((DomElem.getAttribute(attr) === null) || (DomElem.getAttribute(attr) === ''))
        return false;

    return true;
}

TouchClickEvent.prototype._getTouchData = function(DomElem) {
    var attr = TouchClickEvent.TOUCH_CLICK_EVENT_DATA_UID_DATA_ATTR;
    var touchDataUID = DomElem.getAttribute(attr);

    for(var i = 0; i < this._touchData.length; i++) {
        if(parseInt(this._touchData[i].UID, 10) == parseInt(touchDataUID, 10))
            return this._touchData[i];
    }

    return null;
}

TouchClickEvent.prototype._addTouchData = function(DomElem) {
    var attr = TouchClickEvent.TOUCH_CLICK_EVENT_DATA_UID_DATA_ATTR;
    this._nextTouchDataUID++;

    DomElem.setAttribute(attr, this._nextTouchDataUID);
    this._touchData.push({
        UID: this._nextTouchDataUID,
        startCoords: [],
        startTime: (new Date).getTime(),
        disableClick: false,
        DomElem: DomElem
    });
}

TouchClickEvent.prototype._removeTouchData = function(DomElem) {
    var attr = TouchClickEvent.TOUCH_CLICK_EVENT_DATA_UID_DATA_ATTR;
    var touchDataUID = DomElem.getAttribute(attr);
    DomElem.removeAttribute(attr);

    for(var i = 0; i < this._touchData.length; i++) {
        if(parseInt(this._touchData[i].UID, 10) == parseInt(touchDataUID, 10)) {
            this._touchData.splice(i, 1);
            return;
        }
    }
}

TouchClickEvent.prototype._clearOutdatedTouchData = function() {
    var currentTime = (new Date).getTime();
    var deleteAfterMsCount = TouchClickEvent.DELETE_TOUCH_DATA_AFTER_MS_COUNT;

    for(var i = 0; i < this._touchData.length; i++) {
        if(currentTime - this._touchData[i].startTime > deleteAfterMsCount) {
            var uidAttr = TouchClickEvent.TOUCH_CLICK_EVENT_DATA_UID_DATA_ATTR;
            this._touchData[i].DomElem.removeAttribute(uidAttr);
            this._touchData.splice(i, 1);
            i--;
        }
    }
}

TouchClickEvent.prototype._saveTouchStartCoords = function(event, touchData) {
    touchData.startCoords.push({
        x: event.changedTouches[0].pageX,
        y: event.changedTouches[0].pageY
    });
}

TouchClickEvent.prototype._isNativeTouchScroll = function(event, touchData) {
    var validDistance = TouchClickEvent.RECOGNIZE_AS_SCROLL_PX_DISTANCE;

    var currentX = event.changedTouches[0].pageX;
    var currentY = event.changedTouches[0].pageY;

    for(var i = 0; i < touchData.startCoords.length; i++) {
        var startX = touchData.startCoords[i].x;
        var startY = touchData.startCoords[i].y;

        if(Math.abs(currentX - startX) < validDistance && Math.abs(currentY - startY) < validDistance)
            return false;
    }

    return true;
}