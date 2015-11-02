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

var EventEmitter = function() {
    this._callbacks = {};
    this._insertEvTimeout = null;
    this._init();
};

proto(EventEmitter, {
    _init: function() {
        var a = this;
        var b = function(b, c, d) {
            for (var e in b) {
                var f = b[e];
                this._callbacks[f] = c ? null : [];
                (function(b) {
                    d["on" + b] = function(d) {
                        if (!c) a._callbacks[b].push(d); else a._callbacks[b] = d;
                    };
                })(f);
            }
        };
        b.call(a, EV, false, gridifier);
        b.call(a, INT_EV, true, a);
    },
    _getArgs: function(a, b, c) {
        if (!Dom.hasVal(a, b)) err("no " + b + " to emit");
        var d = [];
        Array.prototype.push.apply(d, c);
        d.shift();
        return d;
    },
    emit: function(a) {
        var b = this._getArgs(EV, a, arguments);
        var c = this;
        if (a == EV.INSERT) {
            this._emitInsertEvent(b[0]);
            return;
        }
        for (var d = 0; d < this._callbacks[a].length; d++) {
            if (a == EV.REPOSITION || a == EV.REPOSITION_END) {
                (function(a, b) {
                    setTimeout(function() {
                        a.apply(c, b);
                    }, 0);
                })(this._callbacks[a][d], b);
            } else this._callbacks[a][d].apply(this, b);
        }
        if (a == EV.HIDE && collector.isNotCollectable(b[0])) {
            for (var d = 0; d < this._callbacks[EV.DISCONNECT].length; d++) this._callbacks[EV.DISCONNECT][d](b[0]);
        }
    },
    _emitInsertEvent: function(a) {
        var b = function(a) {
            for (var b = 0; b < this._callbacks[EV.INSERT].length; b++) this._callbacks[EV.INSERT][b](a);
        };
        if (this._insertEvTimeout != null) {
            clearTimeout(this._insertEvTimeout);
            this._insertEvTimeout = null;
            a = a.concat(this._insertEvItems);
        }
        var c = this;
        this._insertEvItems = a;
        this._insertEvTimeout = setTimeout(function() {
            c._insertEvTimeout = null;
            b.call(c, a);
        }, 20);
    },
    emitInternal: function(a) {
        var b = this._getArgs(INT_EV, a, arguments);
        if (this._callbacks[a] == null) return;
        this._callbacks[a].apply(this, b);
        if (a == INT_EV.REPOSITION_END_FOR_DRAG) this._callbacks[a] = null;
    },
    rmInternal: function(a) {
        this._getArgs(INT_EV, a, arguments);
        this._callbacks[a] = null;
    }
});