var PosCore = {
    isValidInit: function(positioner, op) {
        return (typeof positioner.recreateCrs == "function" &&
                typeof positioner.createInitialCr == "function" &&
                op == positioner._position._op);
    },

    crEquals: function(crs, index, type, side, x, y, itemGUID) {
        var equals = true;
        var cr = crs[index];

        if(cr.type != type) equals = false;
        if(cr.side != side) equals = false;
        if(cr.x != x) equals = false;
        if(cr.y != y) equals = false;

        if(typeof itemGUID != "undefined" && cr.itemGUID != itemGUID)
            equals = false;

        return equals;
    },

    testAppender: function(appender, item, expected) {
        var initCrs = {side1: null, side2: null, side3: null};
        var filterCrs = {rmType: null, crSide: null, side1: null, side2: null, type: null};
        var findCnCoords = {item: null, sortedCrs: null, insertType: null, data1: null,
                            data2: null, data3: null, data4: null};
        var createCn = {item: null, sortedCrs: null, sortedCrs2: null};
        var attachToRanges = {cn: null};
        var cleanCrs = {side1: null, side2: null, side3: null};
        var render = {item: null, cn: null};

        appender._position = {
            initCrs: function(side1, side2, side3) {
                initCrs.side1 = side1;
                initCrs.side2 = side2;
                initCrs.side3 = side3;
            },
            filterCrs: function(rmType, crSide, side1, side2, type) {
                filterCrs.rmType = rmType;
                filterCrs.crSide = crSide;
                filterCrs.side1 = side1;
                filterCrs.side2 = side2;
                filterCrs.type = type;
                return "crs";
            },
            findCnCoords: function(item, sortedCrs, insertType, data1, data2, data3, data4) {
                findCnCoords.item = item;
                findCnCoords.sortedCrs = sortedCrs;
                findCnCoords.insertType = insertType;
                findCnCoords.data1 = data1;
                findCnCoords.data2 = data2;
                findCnCoords.data3 = data3;
                findCnCoords.data4 = data4;
                return sortedCrs;
            },
            createCn: function(item, sortedCrs, sortedCrs2) {
                createCn.item = item;
                createCn.sortedCrs = sortedCrs;
                createCn.sortedCrs2 = sortedCrs2;
                return "cn";
            },
            cleanCrs: function(side1, side2, side3) {
                cleanCrs.side1 = side1;
                cleanCrs.side2 = side2;
                cleanCrs.side3 = side3;
            },
            render: function(item, cn) {
                render.item = item;
                render.cn = cn;
            }
        };
        connections = {attachToRanges: function(cn) { attachToRanges.cn = cn; }};

        appender.position(item);
        var initCrsOk = (expected.initCrs.side1 == initCrs.side1 &&
                         expected.initCrs.side2 == initCrs.side2 &&
                         expected.initCrs.side3 == initCrs.side3);
        var filterCrsOk = (expected.filterCrs.rmType == filterCrs.rmType &&
                           expected.filterCrs.crSide == filterCrs.crSide &&
                           expected.filterCrs.side1 == filterCrs.side1 &&
                           expected.filterCrs.side2 == filterCrs.side2 &&
                           expected.filterCrs.type == filterCrs.type);
        var findCnCoordsOk = (expected.findCnCoords.item == findCnCoords.item &&
                              expected.findCnCoords.sortedCrs == findCnCoords.sortedCrs &&
                              expected.findCnCoords.insertType == findCnCoords.insertType &&
                              expected.findCnCoords.data1 == findCnCoords.data1 &&
                              expected.findCnCoords.data2 == findCnCoords.data2 &&
                              expected.findCnCoords.data3 == findCnCoords.data3 &&
                              expected.findCnCoords.data4 == findCnCoords.data4);
        var createCnOk = (expected.createCn.item == createCn.item &&
                          expected.createCn.sortedCrs == createCn.sortedCrs &&
                          expected.createCn.sortedCrs2 == createCn.sortedCrs2);
        var attachToRangesOk = (expected.attachToRanges.cn == attachToRanges.cn);
        var cleanCrsOk = (expected.cleanCrs.side1 == cleanCrs.side1 &&
                          expected.cleanCrs.side2 == cleanCrs.side2 &&
                          expected.cleanCrs.side3 == cleanCrs.side3);
        var renderOk = (expected.render.item == render.item &&
                        expected.render.cn == render.cn);

        ok(initCrsOk && filterCrsOk && findCnCoordsOk && createCnOk && attachToRangesOk &&
           cleanCrsOk && renderOk, "position ok");
    },

    testPrepender: function(prepender, item, expected) {
        var initCrs = {side1: null, side2: null, side3: null};
        var filterCrs = {rmType: null, crSide: null, side1: null, side2: null, type: null};
        var findCnCoords = {item: null, sortedCrs: null, insertType: null, data1: null,
                            data2: null, data3: null, data4: null};
        var createCn = {item: null, sortedCrs: null, sortedCrs2: null};
        var markIfFirstPrepended = {item: null};
        var fixAllXYPosAfterPrepend = {cn: null, allCrs: null};
        var attachToRanges = {cn: null};
        var cleanCrs = {side1: null, side2: null, side3: null};
        var renderAfterPrependFix = {cn: null};
        var render = {item: null, cn: null};

        prepender._position = {
            initCrs: function(side1, side2, side3) {
                initCrs.side1 = side1;
                initCrs.side2 = side2;
                initCrs.side3 = side3;
            },
            filterCrs: function(rmType, crSide, side1, side2, type) {
                filterCrs.rmType = rmType;
                filterCrs.crSide = crSide;
                filterCrs.side1 = side1;
                filterCrs.side2 = side2;
                filterCrs.type = type;
                return "crs";
            },
            findCnCoords: function(item, sortedCrs, insertType, data1, data2, data3, data4) {
                findCnCoords.item = item;
                findCnCoords.sortedCrs = sortedCrs;
                findCnCoords.insertType = insertType;
                findCnCoords.data1 = data1;
                findCnCoords.data2 = data2;
                findCnCoords.data3 = data3;
                findCnCoords.data4 = data4;
                return sortedCrs;
            },
            createCn: function(item, sortedCrs, sortedCrs2) {
                createCn.item = item;
                createCn.sortedCrs = sortedCrs;
                createCn.sortedCrs2 = sortedCrs2;
                return "cn";
            },
            fixAllXYPosAfterPrepend: function(cn, allCrs) {
                fixAllXYPosAfterPrepend.cn = cn;
                fixAllXYPosAfterPrepend.allCrs = allCrs;
                return true;
            },
            cleanCrs: function(side1, side2, side3) {
                cleanCrs.side1 = side1;
                cleanCrs.side2 = side2;
                cleanCrs.side3 = side3;
            },
            renderAfterPrependFix: function(cn) {
                renderAfterPrependFix.cn = cn;
            },
            render: function(item, cn) {
                render.item = item;
                render.cn = cn;
            }
        };
        guid = {markIfFirstPrepended: function(item) { markIfFirstPrepended.item = item; }};
        connections = {attachToRanges: function(cn) { attachToRanges.cn = cn; }};
        connectors = {get: function() { return "allCrs"; }};

        prepender.position(item);
        var initCrsOk = (expected.initCrs.side1 == initCrs.side1 &&
                         expected.initCrs.side2 == initCrs.side2 &&
                         expected.initCrs.side3 == initCrs.side3);
        var filterCrsOk = (expected.filterCrs.rmType == filterCrs.rmType &&
                           expected.filterCrs.crSide == filterCrs.crSide &&
                           expected.filterCrs.side1 == filterCrs.side1 &&
                           expected.filterCrs.side2 == filterCrs.side2 &&
                           expected.filterCrs.type == filterCrs.type);
        var findCnCoordsOk = (expected.findCnCoords.item == findCnCoords.item &&
                              expected.findCnCoords.sortedCrs == findCnCoords.sortedCrs &&
                              expected.findCnCoords.insertType == findCnCoords.insertType &&
                              expected.findCnCoords.data1 == findCnCoords.data1 &&
                              expected.findCnCoords.data2 == findCnCoords.data2 &&
                              expected.findCnCoords.data3 == findCnCoords.data3 &&
                              expected.findCnCoords.data4 == findCnCoords.data4);
        var createCnOk = (expected.createCn.item == createCn.item &&
                          expected.createCn.sortedCrs == createCn.sortedCrs &&
                          expected.createCn.sortedCrs2 == createCn.sortedCrs2);
        var markIfFirstPrependedOk = (expected.markIfFirstPrepended.item == markIfFirstPrepended.item);
        var fixAllXYPosAfterPrependOk = (expected.fixAllXYPosAfterPrepend.cn == fixAllXYPosAfterPrepend.cn &&
                                         expected.fixAllXYPosAfterPrepend.allCrs == fixAllXYPosAfterPrepend.allCrs);
        var attachToRangesOk = (expected.attachToRanges.cn == attachToRanges.cn);
        var cleanCrsOk = (expected.cleanCrs.side1 == cleanCrs.side1 &&
                          expected.cleanCrs.side2 == cleanCrs.side2 &&
                          expected.cleanCrs.side3 == cleanCrs.side3);
        var renderAfterPrependFixOk = (expected.renderAfterPrependFix.cn == renderAfterPrependFix.cn);
        var renderOk = (expected.render.item == render.item &&
                        expected.render.cn == render.cn);

        ok(initCrsOk && filterCrsOk && findCnCoordsOk && createCnOk && markIfFirstPrependedOk &&
           fixAllXYPosAfterPrependOk && attachToRangesOk && cleanCrsOk &&
           renderAfterPrependFixOk && renderOk, "position ok");
    }
};