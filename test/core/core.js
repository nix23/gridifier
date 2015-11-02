$(document).ready(function() {
    module("Core");

    var tester = {
        _before: function() {
            ;
        },

        _after: function() {

        },

        runTests: function() {
            var me = this;

            test("all", function(assert) {
                var test = function(tests) {
                    me._before.call(me);

                    for(var i = 0; i < tests.length; i++)
                        me["_" + tests[i]].call(me, assert);

                    me._after.call(me);
                }

                var origBind = Core.prototype._bindEvents;
                Core.prototype._bindEvents = fns.nop();
                test([
                    "destroy",
                    "setters",
                    "setApiWrappers",
                    "repositionFns",
                    "prepend",
                    "append",
                    "silentAppend",
                    "insertBefore",
                    "insertAfter",
                    "silentFns",
                    "insertNew",
                    "rotate",
                    "exec",
                    "execSilentAppend"
                ]);
                Core.prototype._bindEvents = origBind;
                me._events.call(me, assert);
                me._eventsWithDelay.call(me, assert);
            });
        },

        _destroy: function() {
            var unbinded = false;

            var core = new Core();
            core._unbindEvents = function() {
                unbinded = true;
            };

            var ret = gridifier.destroy();
            ok(unbinded && ret == gridifier, "destroy ok");

            clearTestData();
        },

        _setters: function() {
            var data = {
                setName: null, setVal: null,
                setApiName: null, setApiVal: null,
                addApiName: null, addApiVal: null,
                addApiFn: null,
                getName: null
            };

            settings = {};
            settings.set = function(n, v) {
                data.setName = n;
                data.setVal = v;
            };
            settings.setApi = function(n, v) {
                data.setApiName = n;
                data.setApiVal = v;
            };
            settings.addApi = function(n, v, vfn) {
                data.addApiName = n;
                data.addApiVal = v;
                data.addApiFn = vfn;
            };
            settings.get = function(n) {
                data.getName = n;
            };

            var core = new Core();
            var ret1 = gridifier.set("s1", "v1");
            var ret2 = gridifier.setApi("sa1", "sav1");

            ok(ret1 == gridifier && data.setName == "s1" && data.setVal == "v1",
               "set ok");

            ok(ret2 == gridifier && data.setApiName == "sa1" && data.setApiVal == "sav1",
                "setApi ok");

            var ret3 = gridifier.addApi("sa2", "sav2", "sav2fn");
            gridifier.get("gv1");
            ok(ret3 == gridifier && data.addApiName == "sa2" && data.addApiVal == "sav2" &&
                data.addApiFn == "sav2fn",
               "addApi ok");
            ok(data.getName == "gv1");

            clearTestData();
        },

        _setApiWrappers: function() {
            var core = new Core();
            var data = {names: [], vals: []};
            gridifier.setApi = function(n, v) {
                data.names.push(n);
                data.vals.push(v);
                return gridifier;
            };

            var rets = [];
            rets.push(gridifier.toggle("togglefn"));
            rets.push(gridifier.sort("sortfn"));
            rets.push(gridifier.coordsChanger("ccfn"));
            rets.push(gridifier.drag("dragfn"));

            ok(
                rets[0] == gridifier && rets[1] == gridifier && 
                rets[2] == gridifier && rets[3] == gridifier &&
                data.names[0] == "toggle" && data.vals[0] == "togglefn" &&
                data.names[1] == "sort" && data.vals[1] == "sortfn" &&
                data.names[2] == "coordsChanger" && data.vals[2] == "ccfn" &&
                data.names[3] == "drag" && data.vals[3] == "dragfn",
                "setApiWrappers ok"
            );

            clearTestData();
        },

        _repositionFns: function() {
            var core = new Core();
            var getData = function() {
                return {
                    setApiName: null, 
                    setApiVal: null, 
                    reposed: false,
                    synced: false,
                    resorted: false,
                    filtered: false,
                    asUpdated: false
                };
            };

            gridifier.setApi = function(n, v) {
                data.setApiName = n;
                data.setApiVal = v;
            };
            reposition = {};
            reposition.all = function() { data.reposed = true; };
            reposition.sync = function() { data.synced = true; };
            resorter = {};
            resorter.resort = function() { data.resorted = true; };
            filtrator = {};
            filtrator.filter = function() { data.filtered = true; };
            antialiaser = {};
            antialiaser.updateAs = function() { data.asUpdated = true; };

            var data = getData();
            var res = gridifier.rsort("rsortfn");
            ok(
                res == gridifier && data.setApiName == "rsort" &&
                data.setApiVal == "rsortfn" && data.reposed,
                "rsort ok"
            );

            data = getData();
            res = gridifier.resort();
            ok(
                res == gridifier && data.synced && data.resorted &&
                data.reposed, "resort ok"
            );

            data = getData();
            res = gridifier.filter("filterfn");
            ok(
                res == gridifier && data.synced && data.setApiName == "filter" &&
                data.setApiVal == "filterfn" && data.filtered &&
                data.reposed, "filter ok"
            );

            var origGridifier = gridifier;

            gridifier = {};
            core = new Core();
            data = getData();
            res = gridifier.reposition();
            ok(res == gridifier && data.asUpdated && data.reposed, "reposition ok");

            gridifier = origGridifier;
            clearTestData();
        },

        _prepend: function() {
            ev = new EventEmitter();
            sourceSettings = {loadImages: true, prepend: "mirrored"};
            settings = new Settings();

            var data = {items: null, op: null, params: null};

            gridItem = {};
            gridItem.toNative = function(items) { return items; };

            imagesLoader = {};
            imagesLoader.schedule = function(items, op, params) {
                data.items = items;
                data.op = op;
                data.params = params;
            };

            var core = new Core();
            var ret = gridifier.prepend("items", "bs", "bd");
            ok(
                ret == gridifier &&
                data.items == "items" && data.op == OPS.INS_BEFORE &&
                data.params.batchSize == "bs" && data.params.batchDelay == "bd",
                "prepend with load images and mirrored prepend ok"
            );

            sourceSettings = {loadImages: true, prepend: "default"};
            settings = new Settings();
            ret = gridifier.prepend("items2", "bs2", "bd2");
            ok(
                ret == gridifier &&
                data.items == "items2" && data.op == OPS.PREPEND &&
                data.params.batchSize == "bs2" && data.params.batchDelay == "bd2",
                "prepend with load images and prepend ok"
            );

            gridifier.insertBefore = function(items, fv, bs, bd) {
                data.items = items;
                data.params = {batchSize: bs, batchDelay: bd};
            };

            sourceSettings = {loadImages: false, prepend: "mirrored"};
            settings = new Settings();
            ret = gridifier.prepend("items3", "bs3", "bd3");
            ok(
                ret == gridifier &&
                data.items == "items3"  &&
                data.params.batchSize == "bs3" && 
                data.params.batchDelay == "bd3",
                "mirrored prepend ok"
            );

            core.exec = function(op, items, bs, bd) {
                data.items = items;
                data.op = op;
                data.params = {batchSize: bs, batchDelay: bd};
            };

            sourceSettings = {loadImages: false, prepend: "default"};
            settings = new Settings();
            ret = gridifier.prepend("items4", "bs4", "bd4");
            ok(
                ret == gridifier &&
                data.items == "items4" && data.op == OPS.PREPEND &&
                data.params.batchSize == "bs4" && data.params.batchDelay == "bd4",
                "prepend ok"
            );

            clearTestData();
        },

       _append: function() {
            ev = new EventEmitter();
            sourceSettings = {loadImages: true};
            settings = new Settings();

            var data = {items: null, op: null, params: null};

            gridItem = {};
            gridItem.toNative = function(items) { return items; };

            imagesLoader = {};
            imagesLoader.schedule = function(items, op, params) {
                data.items = items;
                data.op = op;
                data.params = params;
            };

            var core = new Core();
            var ret = gridifier.append("items", "bs", "bd");
            ok(
                ret == gridifier &&
                data.items == "items" && data.op == OPS.APPEND &&
                data.params.batchSize == "bs" && data.params.batchDelay == "bd",
                "append with load images ok"
            );

            core.exec = function(op, items, bs, bd) {
                data.items = items;
                data.op = op;
                data.params = {batchSize: bs, batchDelay: bd};
            };

            sourceSettings = {loadImages: false};
            settings = new Settings();
            ret = gridifier.append("items2", "bs2", "bd2");
            ok(
                ret == gridifier &&
                data.items == "items2" && data.op == OPS.APPEND &&
                data.params.batchSize == "bs2" && data.params.batchDelay == "bd2",
                "append ok"
            );

            clearTestData();
        },

       _silentAppend: function() {
            ev = new EventEmitter();
            sourceSettings = {loadImages: true};
            settings = new Settings();

            var data = {items: null, op: null, params: null};

            gridItem = {};
            gridItem.toNative = function(items) { return items; };

            imagesLoader = {};
            imagesLoader.schedule = function(items, op, params) {
                data.items = items;
                data.op = op;
                data.params = params;
            };

            var core = new Core();
            var ret = gridifier.silentAppend("items", "bs", "bd");
            ok(
                ret == gridifier &&
                data.items == "items" && data.op == OPS.SIL_APPEND &&
                data.params.batchSize == "bs" && data.params.batchDelay == "bd",
                "silent append with load images ok"
            );

            core.execSilentAppend = function(items, bs, bd) {
                data.items = items;
                data.params = {batchSize: bs, batchDelay: bd};
            };

            sourceSettings = {loadImages: false};
            settings = new Settings();
            ret = gridifier.silentAppend("items2", "bs2", "bd2");
            ok(
                ret == gridifier &&
                data.items == "items2" &&
                data.params.batchSize == "bs2" && data.params.batchDelay == "bd2",
                "silent append ok"
            );

            clearTestData();
        },

       _insertBefore: function() {
            ev = new EventEmitter();
            sourceSettings = {loadImages: true};
            settings = new Settings();

            var data = {items: null, op: null, params: null};

            gridItem = {};
            gridItem.toNative = function(items) { return items; };

            imagesLoader = {};
            imagesLoader.schedule = function(items, op, params) {
                data.items = items;
                data.op = op;
                data.params = params;
            };

            var core = new Core();
            var ret = gridifier.insertBefore("items", "target", "bs", "bd");
            ok(
                ret == gridifier && data.params.beforeItem == "target" &&
                data.items == "items" && data.op == OPS.INS_BEFORE &&
                data.params.batchSize == "bs" && data.params.batchDelay == "bd",
                "insert before with load images ok"
            );

            core.exec = function(op, items, bs, bd, ti) {
                data.items = items;
                data.op = op;
                data.params = {batchSize: bs, batchDelay: bd, beforeItem: ti};
            };

            sourceSettings = {loadImages: false};
            settings = new Settings();
            ret = gridifier.insertBefore("items2", "ti2", "bs2", "bd2");
            ok(
                ret == gridifier && data.params.beforeItem == "ti2" &&
                data.items == "items2" && data.op == OPS.INS_BEFORE &&
                data.params.batchSize == "bs2" && data.params.batchDelay == "bd2",
                "insert before ok"
            );

            clearTestData();
        },

        _insertAfter: function() {
            ev = new EventEmitter();
            sourceSettings = {loadImages: true};
            settings = new Settings();

            var data = {items: null, op: null, params: null};

            gridItem = {};
            gridItem.toNative = function(items) { return items; };

            imagesLoader = {};
            imagesLoader.schedule = function(items, op, params) {
                data.items = items;
                data.op = op;
                data.params = params;
            };

            var core = new Core();
            var ret = gridifier.insertAfter("items", "target", "bs", "bd");
            ok(
                ret == gridifier && data.params.afterItem == "target" &&
                data.items == "items" && data.op == OPS.INS_AFTER &&
                data.params.batchSize == "bs" && data.params.batchDelay == "bd",
                "insert after with load images ok"
            );

            core.exec = function(op, items, bs, bd, ti) {
                data.items = items;
                data.op = op;
                data.params = {batchSize: bs, batchDelay: bd, afterItem: ti};
            };

            sourceSettings = {loadImages: false};
            settings = new Settings();
            ret = gridifier.insertAfter("items2", "ti2", "bs2", "bd2");
            ok(
                ret == gridifier && data.params.afterItem == "ti2" &&
                data.items == "items2" && data.op == OPS.INS_AFTER &&
                data.params.batchSize == "bs2" && data.params.batchDelay == "bd2",
                "insert after ok"
            );

            clearTestData();
        },

        _silentFns: function() {
            var data = {items: null, bs: null, bd: null, insideVp: null};

            silentRenderer = {};
            silentRenderer.exec = function(i, bs, bd) {
                data.items = i;
                data.bs = bs;
                data.bd = bd;
            };
            silentRenderer.getScheduled = function(onlyInsideVp) {
                data.insideVp = onlyInsideVp;
                return "ok";
            };

            var core = new Core();
            var ret = gridifier.silentRender("i", "bs", "bd");
            ok(
                ret == gridifier && data.items == "i" &&
                data.bs == "bs" && data.bd == "bd",
                "silent render ok"
            );

            res = gridifier.getSilent("vp");
            ok(
                res == "ok" && data.insideVp == "vp",
                "getForSilentRender ok"
            );

            clearTestData();
        },

        _insertNew: function() {
            var core = new Core();
            var data = {items: null, bs: null, bd: null};
            gridifier.collectNew = function() { return "new"; };
            gridifier.append = function(items, bs, bd) {
                data.items = items;
                data.bs = bs;
                data.bd = bd;
            };
            gridifier.prepend = function(items, bs, bd) {
                data.items = items;
                data.bs = bs;
                data.bd = bd;
            };

            var ret = gridifier.appendNew("bs", "bd");
            ok(
                ret == gridifier && data.items == "new" &&
                data.bs == "bs" && data.bd == "bd",
                "append new ok"
            );

            var ret = gridifier.prependNew("bs", "bd");
            ok(
                ret == gridifier && data.items == "new" &&
                data.bs == "bs" && data.bd == "bd",
                "prepend new ok"
            );

            clearTestData();
        },

        _rotate: function() {
            var core = new Core();
            var data = {rtype: null, ritems: null};

            gridifier.toggle = function(rtype) {
                data.rtype = rtype;
            };
            gridItem = {};
            gridItem.toNative = function(i) { return i; };
            renderer = {};
            renderer.rotate = function(items) { data.ritems = items; };
            
            var ret = gridifier.rotate("items", "rotateZ");
            ok(data.rtype == "rotateZ" && data.ritems == "items" && ret == gridifier,
                "rotate without batch size ok");

            insertQueue = {};
            insertQueue.scheduleFnExec = function(items, bs, bd, fn) { 
                if(items != "items2" || bs != "bs" || bd != "bd") return; 
                fn("items3");
            };

            ret = gridifier.rotate("items2", "rotateX", "bs", "bd");
            ok(data.rtype == "rotateX" && data.ritems == "items3" && ret == gridifier,
                "rotate with batch size ok");

            clearTestData();
        },

        _exec: function(assert) {
            var op = null;
            var items = null;
            var bs = null;
            var bd = null;
            var ti = null;
            var origDelay = null;
            var origEvent = null;

            var initFn = function() {
                origDelay = C.REFLOW_FIX_DELAY;
                C.REFLOW_FIX_DELAY = 0;
                origEvent = Event;
                Event = {};
                Event.add = nop();
                Event.rm = nop();
                
                insertQueue = {};
                insertQueue.schedule = function(fnop, fnitems, fnbs, fnbd, fnti) {
                    op = fnop;
                    items = fnitems;
                    bs = fnbs;
                    bd = fnbd;
                    ti = fnti;
                };

                var core = new Core();
                core.exec("op", "i", "bs", "bd", "ti");
            };
            var checkFn = function() {
                ok(op == "op" && items == "i" && bs == "bs" && bd == "bd" && ti == "ti",
                   "exec ok");
                C.REFLOW_FIX_DELAY = origDelay;
                Event = origEvent;
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        },

        _execSilentAppend: function() {
            var scheduled = null;
            var op = null;
            var bs = null;
            var bd = null;
            var items = null;

            silentRenderer = {};
            silentRenderer.schedule = function(items) {
                scheduled = items;
            };
            gridItem = {};
            gridItem.toNative = function(i) { return i; };

            var core = new Core();
            core.exec = function(fnop, fnitems, fnbs, fnbd) {
                op = fnop;
                items = fnitems;
                bs = fnbs;
                bd = fnbd;
            };

            core.execSilentAppend("i", "bs", "bd");
            ok(
                scheduled == "i" && op == OPS.APPEND && items == "i" &&
                bs == "bs" && bd == "bd",
                "silent append ok"
            );

            clearTestData();
        },

        _events: function() {
            ev = new EventEmitter();
            settings = new Settings();

            var data = {
                obj: null,
                evName: null,
                handler: null
            };
            var reposed = false;

            var origEvent = Event;
            Event = {};
            Event.add = function(obj, evName, handler) {
                data.obj = obj;
                data.evName = evName;
                data.handler = handler;
            };
            Event.rm = function(obj, evName, handler) {
                data.obj = obj;
                data.evName = evName;
                data.handler = handler;
            };
            var core = new Core();
            gridifier = {};
            gridifier.reposition = function() { reposed = true; };

            ok(data.obj == window && data.evName == "resize" && data.handler != null,
               "bind resize event ok");

            core._onResize();
            ok(reposed, "resize event call ok");

            var dragOff = false;
            gridifier.isDragifierOn = function() { return true; };
            gridifier.dragifierOff = function() { dragOff = true; };

            core._unbindEvents();
            ok(data.obj == window && data.evName == "resize" && data.handler != null &&
               dragOff, "unbind events ok");

            Event = origEvent;
            clearTestData();
        },

        _eventsWithDelay: function(assert) {
            var origEvent = null;
            var cc = 0;
            var reposed = false;
            var core = null;

            var initFn = function() {
                ev = new EventEmitter();
                sourceSettings = {vpResizeDelay: 0};
                settings = new Settings();

                origEvent = Event;
                Event = {};
                Event.add = function(obj, evName, handler) {};

                core = new Core();
                gridifier = {};
                gridifier.reposition = function() { reposed = true; cc++; };
                gridifier.isDragifierOn = fns.f();

                core._onResize();
                core._onResize();
            };
            var checkFn = function() {
                ok(reposed && cc == 1, "resize with delay ok");
                Event = origEvent;
                core._unbindEvents();
            };

            asyncTests.add(assert, initFn, checkFn, 20, this);
        }
    }

    tester.runTests();
    clearTestData();
});