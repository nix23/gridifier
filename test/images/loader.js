$(document).ready(function() {
    module("ImagesLoader");

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

                test([
                    "schedule",
                    "findImages",
                    "checks",
                    "onLoad",
                    "checkLoadOnNotLoaded",
                    "checkLoadOnLoaded",
                    "callOp"
                ]);
            });
        },

        _schedule: function() {
            var data = {
                checkLoad: false,
                findImages: null
            };
            
            var imagesLoader = new ImagesLoader();
            imagesLoader._checkLoad = function() { data.checkLoad = true; };
            imagesLoader._findImages = function(items) {
                data.findImages = items;
                return [];
            };

            imagesLoader.schedule([], "op", "data");
            ok(
                Dom.isArray(imagesLoader._batches[0].items) &&
                Dom.isArray(imagesLoader._batches[0].images) &&
                imagesLoader._batches[0].op == "op" &&
                imagesLoader._batches[0].data == "data" &&
                data.findImages == null &&
                data.checkLoad,
                "schedule on empty items ok"
            );

            data.checkLoad = false;
            imagesLoader.schedule([{id: 1}], "op", "data");
            ok(
                Dom.isArray(imagesLoader._batches[1].items) &&
                Dom.isArray(imagesLoader._batches[1].images) &&
                imagesLoader._batches[1].op == "op" &&
                imagesLoader._batches[1].data == "data" &&
                data.findImages[0].id == 1 &&
                data.checkLoad,
                "schedule on non empty items ok"
            );

            var schCount = 0;
            var schLoad = function() {
                schCount++;
            };
            imagesLoader._findImages = function(items) {
                return items;
            };
            var images = [{scheduleLoad: schLoad}, {scheduleLoad: schLoad}];
            imagesLoader.schedule(images, "op", "data");
            ok(schCount == 2, "schedule with found images ok");

            clearTestData();
        },

        _findImages: function() {
            var origLoadedImage = LoadedImage;
            LoadedImage = function(img) {
                this._image = img;
                return this;
            };

            var imagesLoader = new ImagesLoader();
            imagesLoader._isAlreadyLoaded = function(obj) {
                return obj.id == 3 || obj.id == 7;
            };
            imagesLoader._isValidNode = function(obj) {
                return obj.id != 4;
            };

            var emptySel = function(node) {
                if(node != "img") return [];
                return [];
            };

            var items = [
                {
                    nodeName: "DIV", 
                    id: 1, 
                    querySelectorAll: emptySel
                },
                {
                    nodeName: "IMG", 
                    id: 2, 
                    querySelectorAll: emptySel
                },
                {
                    nodeName: "IMG", 
                    id: 3, 
                    querySelectorAll: emptySel
                },
                {
                    nodeName: "DIV", 
                    id: 4, 
                    querySelectorAll: emptySel
                },
                {
                    nodeName: "DIV", 
                    id: 5, 
                    querySelectorAll: function(node) {
                        if(node != "img") return [];
                        return [{id: 7}, {id: 8}];
                    }
                }
            ];

            var images = imagesLoader._findImages(items);
            ok(images[0]._image.id == 2 && images[1]._image.id == 8,
                "findImages ok");

            LoadedImage = origLoadedImage;
            clearTestData();
        },

        _checks: function() {
            var imagesLoader = new ImagesLoader();
            imagesLoader._loaded = [
                "1.jpg", "2.jpg", "3.jpg"
            ];
            ok(imagesLoader._isAlreadyLoaded({src: "2.jpg"}),
                "isAlreadyLoaded ok");

            ok(imagesLoader._isAlreadyLoaded({src: ""}),
                "isAlreadyLoaded with empty src ok");

            ok(!imagesLoader._isAlreadyLoaded({src: "7.jpg"}),
                "isAlreadyLoaded with not loaded src ok");

            ok(
               imagesLoader._isValidNode({nodeType: 1}) &&
               imagesLoader._isValidNode({nodeType: 9}) &&
               imagesLoader._isValidNode({nodeType: 11}),
               "isValidNode ok"
            );

            ok(!imagesLoader._isValidNode({nodeType: 2}),
               "isValidNode with wrong node ok");

            clearTestData();
        },

        _onLoad: function() {
            var checkLoad = false;
            var imagesLoader = new ImagesLoader();
            imagesLoader._checkLoad = function() { checkLoad = true; };

            imagesLoader.onLoad({src: "test"});
            ok(imagesLoader._loaded[0] == "test" && checkLoad,
               "onLoad ok");

            clearTestData();
        },

        _checkLoadOnNotLoaded: function() {
            var imagesLoader = new ImagesLoader();
            imagesLoader._batches = [
                {
                    images: [
                        {isLoaded: fns.t()},
                        {isLoaded: fns.f()}
                    ]
                },
                {
                    images: [
                        {isLoaded: fns.t()},
                        {isLoaded: fns.t()}
                    ]
                }
            ];
            imagesLoader._checkLoad();
            ok(imagesLoader._batches.length == 2,
                "checkLoad on pending load ok");

            clearTestData();
        },

        _checkLoadOnLoaded: function() {
            var imagesLoader = new ImagesLoader();
            var destroyedCount = 0;
            var destroyFn = function() { destroyedCount++ };

            imagesLoader._batches = [
                {
                    images: [
                        {isLoaded: fns.t(), destroy: destroyFn},
                        {isLoaded: fns.t(), destroy: destroyFn}
                    ],
                    items: "i1",
                    data: "d1",
                    op: "op1"
                },
                {
                    images: [
                        {isLoaded: fns.t(), destroy: destroyFn},
                        {isLoaded: fns.t(), destroy: destroyFn}
                    ],
                    items: "i2",
                    data: "d2",
                    op: "op2"
                }
            ];
            var data = {items: [], ops: [], datas: []};
            imagesLoader._callOp = function(items, op, fndata) {
                data.items.push(items);
                data.ops.push(op);
                data.datas.push(fndata);
            };
            imagesLoader._checkLoad();
            ok(
                imagesLoader._batches.length == 0 &&
                destroyedCount == 4 &&
                data.items[0] == "i1" && data.items[1] == "i2" &&
                data.ops[0] == "op1" && data.datas[0] == "d1",
                "checkLoad after all loaded ok"
            );

            clearTestData();
        },

        _callOp: function() {
            var data = {
                op: [], items: [], bs: [], bd: [], ti: []
            };
            var isValid = function(i, op, item, bs, bd, ti) {
                var cond = (typeof ti == "undefined") ? true : data.ti[i] == ti;
                return (data.op[i] == op && 
                        data.items[i] == item &&
                        data.bs[i] == bs &&
                        data.bd[i] == bd && cond);
            };
            
            core = {};
            core.exec = function(op, items, bs, bd, ti) {
                data.op.push(op);
                data.items.push(items);
                data.bs.push(bs);
                data.bd.push(bd);
                data.ti.push(ti);
            };
            core.execSilentAppend = function(items, bs, bd, ti) {
                data.op.push(OPS.SIL_APPEND);
                data.items.push(items);
                data.bs.push(bs);
                data.bd.push(bd);
                data.ti.push(ti);
            };

            var itemsLoader = new ImagesLoader();
            itemsLoader._callOp("i1", OPS.APPEND, {batchSize: 1, batchDelay: 1});
            itemsLoader._callOp("i2", OPS.PREPEND, {batchSize: 2, batchDelay: 2});
            itemsLoader._callOp("i3", OPS.SIL_APPEND, {batchSize: 3, batchDelay: 3});
            itemsLoader._callOp("i4", OPS.INS_BEFORE, {batchSize: 4, batchDelay: 4, beforeItem: "bi"});
            itemsLoader._callOp("i5", OPS.INS_AFTER, {batchSize: 5, batchDelay: 5, afterItem: "ai"});
            
            ok(
                isValid(0, OPS.APPEND, "i1", 1, 1) &&
                isValid(1, OPS.PREPEND, "i2", 2, 2) &&
                isValid(2, OPS.SIL_APPEND, "i3", 3, 3) &&
                isValid(3, OPS.INS_BEFORE, "i4", 4, 4, "bi") &&
                isValid(4, OPS.INS_AFTER, "i5", 5, 5, "ai"),
                "callOp ok"
            );

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});