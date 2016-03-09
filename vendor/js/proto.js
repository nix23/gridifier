window.proto = function(c, def) {
    for(var prop in def)
        c.prototype[prop] = def[prop];
};