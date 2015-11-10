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

var proto = function(c, def) {
    for(var prop in def)
        c.prototype[prop] = def[prop];
}

var self = function(c, fns) {
    for(var fnName in fns) {
        (function(fnName, c) {
            gridifier[fnName] = function() {
                return fns[fnName].apply(c, arguments);
            }
        })(fnName, c);
    }
}

var err = function(msg) {
    throw new Error(CP.ERR + msg);
}

var nop = function() { return function() {}; }

var bind = function(fn, obj) {
    return function() { return obj[fn].apply(obj, arguments); };
}