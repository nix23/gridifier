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

proto(Settings, {
    _parse: function(settings) {
        this._parseCoreSettings(settings);
        this._adjustCoreSettings(settings);
        this._parseApiSettings(settings);
    },

    _parseCoreSettings: function(settings) {
        if(Dom.hasAnyProp(settings, ["class", "data", "query"]))
            this.set([["class", false], ["data", false], ["query", false]]);

        for(var name in settings) {
            var val = settings[name];
            var eventReg = /^on(.*)$/;

            if(Dom.hasOwnProp(this._settings, name) && !this._isApiSetting(name))
                this.set(name, val);
            else if(eventReg.test(name))
                gridifier[name](val);
        }
    },

    _adjustCoreSettings: function(settings) {
        if(this.eq("grid", "horizontal") && !Dom.hasOwnProp(settings, "align"))
            this.set("align", "left");

        if(Dom.hasOwnProp(settings, "align"))
            this.set("intersections", false);

        if(this.eq("dragifierMode", "d")) {
            this.set("intersections", true);
            this.set("sortDispersion", true);
            if(!Dom.hasOwnProp(settings, "disableQueueOnDrags"))
                this.set("disableQueueOnDrags", false);
        }
    },

    _parseApiSettings: function(settings) {
        for(var name in settings) {
            var val = settings[name];

            if(this._isApiSetting(name))
                this._parseApiSetting(name, val);
        }
    },

    _isApiSetting: function(name) {
        for(var as in AS) {
            if(AS[as] == name)
                return true;
        }

        return false;
    },

    _parseApiSetting: function(name, val) {
        if(typeof val == "string" || val instanceof String ||
            (name == AS.FILTER && Dom.isArray(val))) {
            this._settings[name].selected = val;
        }
        else if(typeof val == "function") {
            this._settings[name].userfn = val;
            this._settings[name].selected = "userfn";
        }
        else if(typeof val == "object") {
            for(var fnName in val) {
                if(fnName == "selected") continue;
                var fn = val[fnName];

                this._settings[name][fnName] = fn;
            }

            if(Dom.hasOwnProp(val, "selected"))
                this._settings[name].selected = val.selected;
        }
    },

    get: function(name) {
        this._check(name, "get");
        return this._settings[name];
    },

    set: function(name, val) {
        if(!Dom.isArray(name)) {
            this._check(name, "set");
            this._settings[name] = val;
            ev.emitInternal(INT_EV.SET_SETTING_FOR_NZER, name);
            return;
        }

        for(var i = 0; i < name.length; i++)
            this.set(name[i][0], name[i][1]);
    },

    getApi: function(name) {
        this._check(name, "getApi");
        var apiObj = this.get(name);
        var throwErr = function(fnName) {
            err("getApi('" + name + "') -> " + fnName + " fn not found");
        }

        if(name != AS.FILTER) {
            if(!Dom.hasOwnProp(apiObj, apiObj.selected))
                throwErr(apiObj.selected);
            return apiObj[apiObj.selected];
        }

        var selFilters = apiObj.selected;
        if(!Dom.isArray(selFilters)) selFilters = [selFilters];
        var fns = [];
        for(var i = 0; i < selFilters.length; i++) {
            if(!Dom.hasOwnProp(apiObj, selFilters[i]))
                throwErr(selFilters[i]);
            fns.push(apiObj[selFilters[i]]);
        }

        return fns;
    },

    setApi: function(name, fnName) {
        this._check(name, "setApi");
        this.get(name).selected = fnName;

        if(name == AS.RSORT)
            ev.emitInternal(INT_EV.RSORT_CHANGE);
    },

    addApi: function(name, fnName, fn) {
        this._check(name, "addApi");
        this.get(name)[fnName] = fn;
    },

    eq: function(name, val) {
        this._check(name, "eq");
        return this._settings[name] == val;
    },

    notEq: function(name, val) {
        return !this.eq(name, val);
    },

    _check: function(name, fnName) {
        if(!Dom.hasOwnProp(this._settings, name))
            err("No setting '" + name + "' to " + fnName);
    }
});