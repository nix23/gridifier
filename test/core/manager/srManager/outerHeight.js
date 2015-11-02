$(document).ready(function() {
    module("SrManager");

    var tester = {
        _realSizesResolver: null,
        _sizesResolverMock: null,
        _testDomElemGUID: 0,
        _testDomElemGUIDDataAttr: "data-test-dom-elem-guid",
        _testDomElemGUIDMarker: "per-dom-elem-with-guid",
        _realSizesResolverOuterHeightCallMarker: "real-sizes-resolver-outer-height-call",
        _cachedSizesResolverOuterHeightCallMarker: "cached-sizes-resolver-outer-height-call",
        _callWithIncludeMarginsParamMarker: "with-include-margins-param",
        _callWithoutIncludeMarginsParamMarker: "without-include-margins-param",

        _before: function() {
            var me = this;
            //this._realSizesResolver = SizesResolver;
            this._realSizesResolver = {};
            this._realSizesResolver.outerHeight = SizesResolver.outerHeight;
            this._realSizesResolver.clearRecursiveSubcallsData = SizesResolver.clearRecursiveSubcallsData;
            this._sizesResolverMock = {
                outerHeight: function(DOMElem, includeMargins) {
                    var response = "";

                    response += me._realSizesResolverOuterHeightCallMarker;
                    response += "-" + me._testDomElemGUIDMarker + DOMElem.getAttribute(me._testDomElemGUIDDataAttr);

                    if(includeMargins)
                        response += "-" + me._callWithIncludeMarginsParamMarker;
                    else
                        response += "-" + me._callWithoutIncludeMarginsParamMarker;

                    return response;
                },

                clearRecursiveSubcallsData: function() {
                    ;
                }
            }

            //SizesResolver = this._sizesResolverMock;
            SizesResolver.outerHeight = this._sizesResolverMock.outerHeight;
            SizesResolver.clearRecursiveSubcallsData = this._sizesResolverMock.clearRecursiveSubcallsData;
        },

        _after: function() {
            //SizesResolver = this._realSizesResolver;
            SizesResolver.outerHeight = this._realSizesResolver.outerHeight;
            SizesResolver.clearRecursiveSubcallsData = this._realSizesResolver.clearRecursiveSubcallsData;
        },

        runTests: function() {
            var me = this;

            test("outerHeight", function(assert) {
                var test = function(tests) {
                    me._before.call(me);

                    for(var i = 0; i < tests.length; i++)
                        me["_" + tests[i]].call(me, assert);

                    me._after.call(me);
                }

                test([
                    "srOhMock",
                    "withoutActiveCachingTransaction",
                    "isSecondCallWithIncludeMarginsCached",
                    "isSecondCallWithoutIncludeMarginsCached",
                    "areCallsWithAllPossibleParamsCached",
                    "areSequentialCallsOnDifferentItemsCached",
                    "areUncachedAfterTransacationStop",
                    "withItemAntialiasing"
                ]);
            });
        },

        _markCachedValuesInOuterHeightCacheArray: function(sizesResolverManager) {
            for(var i = 0; i < sizesResolverManager._ohCache.length; i++) {
                var cacheEntry = sizesResolverManager._ohCache[i];
                var cachedReturnedValues = cacheEntry.cachedCalls;

                if(cachedReturnedValues.withMargins != null) {
                    if(cachedReturnedValues.withMargins.match(this._realSizesResolverOuterHeightCallMarker)) {
                        cachedReturnedValues.withMargins = cachedReturnedValues.withMargins.replace(
                            this._realSizesResolverOuterHeightCallMarker,
                            this._cachedSizesResolverOuterHeightCallMarker
                        );
                    }
                }

                if(cachedReturnedValues.withoutMargins != null) {
                    if(cachedReturnedValues.withoutMargins.match(this._realSizesResolverOuterHeightCallMarker)) {
                        cachedReturnedValues.withoutMargins = cachedReturnedValues.withoutMargins.replace(
                            this._realSizesResolverOuterHeightCallMarker,
                            this._cachedSizesResolverOuterHeightCallMarker
                        );
                    }
                }
            }
        },

        _srOhMock: function() {
            this._testDomElemGUID = 0;

            var testerDiv = document.createElement("div");
            testerDiv.setAttribute(this._testDomElemGUIDDataAttr, this._testDomElemGUID);

            var expectedResponse = this._realSizesResolverOuterHeightCallMarker;
            expectedResponse += "-" + this._testDomElemGUIDMarker + testerDiv.getAttribute(this._testDomElemGUIDDataAttr);
            expectedResponse += "-" + this._callWithoutIncludeMarginsParamMarker;
            ok(
                this._sizesResolverMock.outerHeight(testerDiv, false, true) == expectedResponse,
                "call sizesResolver outerHeight mock with includeMargins = false"
            );

            var expectedResponse = this._realSizesResolverOuterHeightCallMarker;
            expectedResponse += "-" + this._testDomElemGUIDMarker + testerDiv.getAttribute(this._testDomElemGUIDDataAttr);
            expectedResponse += "-" + this._callWithIncludeMarginsParamMarker;
            ok(
                this._sizesResolverMock.outerHeight(testerDiv, true, true) == expectedResponse,
                "call sizesResolver outerHeight mock with includeMargins = true"
            );
        },

        _withoutActiveCachingTransaction: function() {
            this._testDomElemGUID = 0;

            var testerDiv = document.createElement("div");
            testerDiv.setAttribute(this._testDomElemGUIDDataAttr, this._testDomElemGUID);

            var sizesResolverManager = new SizesResolverManager();

            var expectedResponse = this._realSizesResolverOuterHeightCallMarker;
            expectedResponse += "-" + this._testDomElemGUIDMarker + testerDiv.getAttribute(this._testDomElemGUIDDataAttr);
            expectedResponse += "-" + this._callWithoutIncludeMarginsParamMarker;
            ok(
                sizesResolverManager.outerHeight(testerDiv, false, true) == expectedResponse,
                "call with includeMargins = false"
            );

            var expectedResponse = this._realSizesResolverOuterHeightCallMarker;
            expectedResponse += "-" + this._testDomElemGUIDMarker + testerDiv.getAttribute(this._testDomElemGUIDDataAttr);
            expectedResponse += "-" + this._callWithIncludeMarginsParamMarker;
            ok(
                sizesResolverManager.outerHeight(testerDiv, true, true) == expectedResponse,
                "call with includeMargins = true"
            );
        },

        _isSecondCallWithIncludeMarginsCached: function() {
            this._testDomElemGUID = 0;

            var testerDiv = document.createElement("div");
            testerDiv.setAttribute(this._testDomElemGUIDDataAttr, this._testDomElemGUID);

            var sizesResolverManager = new SizesResolverManager();

            var expectedResponse = this._cachedSizesResolverOuterHeightCallMarker;
            expectedResponse += "-" + this._testDomElemGUIDMarker + testerDiv.getAttribute(this._testDomElemGUIDDataAttr);
            expectedResponse += "-" + this._callWithIncludeMarginsParamMarker;

            sizesResolverManager.startCachingTransaction();
            sizesResolverManager.outerHeight(testerDiv, true, true);
            this._markCachedValuesInOuterHeightCacheArray(sizesResolverManager);

            ok(
                sizesResolverManager.outerHeight(testerDiv, true, true) == expectedResponse,
                "cached call with includeMargins = true"
            );
            sizesResolverManager.stopCachingTransaction();
        },

        _isSecondCallWithoutIncludeMarginsCached: function() {
            this._testDomElemGUID = 0;

            var testerDiv = document.createElement("div");
            testerDiv.setAttribute(this._testDomElemGUIDDataAttr, this._testDomElemGUID);

            var expectedResponse = this._cachedSizesResolverOuterHeightCallMarker;
            expectedResponse += "-" + this._testDomElemGUIDMarker + testerDiv.getAttribute(this._testDomElemGUIDDataAttr);
            expectedResponse += "-" + this._callWithoutIncludeMarginsParamMarker;

            var sizesResolverManager = new SizesResolverManager();

            sizesResolverManager.startCachingTransaction();
            sizesResolverManager.outerHeight(testerDiv, false, true);
            this._markCachedValuesInOuterHeightCacheArray(sizesResolverManager);

            ok(
                sizesResolverManager.outerHeight(testerDiv, false, true) == expectedResponse,
                "cached call with includeMargins = false"
            );
            sizesResolverManager.stopCachingTransaction();
        },

        _areCallsWithAllPossibleParamsCached: function() {
            this._testDomElemGUID = 0;

            var testerDiv = document.createElement("div");
            testerDiv.setAttribute(this._testDomElemGUIDDataAttr, this._testDomElemGUID);

            var expectedResponsePrefix = this._cachedSizesResolverOuterHeightCallMarker;
            expectedResponsePrefix += "-" + this._testDomElemGUIDMarker + testerDiv.getAttribute(this._testDomElemGUIDDataAttr);

            var withoutParamCallExpectedResponse = expectedResponsePrefix + "-" + this._callWithoutIncludeMarginsParamMarker;
            var withParamCallExpectedResponse = expectedResponsePrefix + "-" + this._callWithIncludeMarginsParamMarker;

            var sizesResolverManager = new SizesResolverManager();

            sizesResolverManager.startCachingTransaction();
            sizesResolverManager.outerHeight(testerDiv, false, true);
            sizesResolverManager.outerHeight(testerDiv, true, true);
            this._markCachedValuesInOuterHeightCacheArray(sizesResolverManager);

            ok(
                sizesResolverManager.outerHeight(testerDiv, false, true) == withoutParamCallExpectedResponse &&
                sizesResolverManager.outerHeight(testerDiv, true, true) == withParamCallExpectedResponse,
                "cached calls with all possible params"
            );
            sizesResolverManager.stopCachingTransaction();
        },

        _areSequentialCallsOnDifferentItemsCached: function() {
            this._testDomElemGUID = 0;

            var firstTesterDiv = document.createElement("div");
            firstTesterDiv.setAttribute(this._testDomElemGUIDDataAttr, this._testDomElemGUID);

            this._testDomElemGUID++;
            var secondTesterDiv = document.createElement("div");
            secondTesterDiv.setAttribute(this._testDomElemGUIDDataAttr, this._testDomElemGUID);

            var expectedResponsePrefix = this._cachedSizesResolverOuterHeightCallMarker;

            var expectedResponsePerFirstTesterDiv = expectedResponsePrefix + "-" + this._testDomElemGUIDMarker;
            expectedResponsePerFirstTesterDiv += firstTesterDiv.getAttribute(this._testDomElemGUIDDataAttr);
            expectedResponsePerFirstTesterDiv += "-" + this._callWithoutIncludeMarginsParamMarker;

            var expectedResponsePerSecondTesterDiv = expectedResponsePrefix + "-" + this._testDomElemGUIDMarker;
            expectedResponsePerSecondTesterDiv += secondTesterDiv.getAttribute(this._testDomElemGUIDDataAttr);
            expectedResponsePerSecondTesterDiv += "-" + this._callWithoutIncludeMarginsParamMarker;

            var sizesResolverManager = new SizesResolverManager();

            sizesResolverManager.startCachingTransaction();
            sizesResolverManager.outerHeight(firstTesterDiv, false, true);
            sizesResolverManager.outerHeight(secondTesterDiv, false, true);
            this._markCachedValuesInOuterHeightCacheArray(sizesResolverManager);

            ok(
                sizesResolverManager.outerHeight(firstTesterDiv, false, true) == expectedResponsePerFirstTesterDiv &&
                sizesResolverManager.outerHeight(secondTesterDiv, false, true) == expectedResponsePerSecondTesterDiv
            );
            sizesResolverManager.stopCachingTransaction();
        },

        _areUncachedAfterTransacationStop: function() {
            this._testDomElemGUID = 0;

            var testerDiv = document.createElement("div");
            testerDiv.setAttribute(this._testDomElemGUIDDataAttr, this._testDomElemGUID);

            var expectedResponse = this._realSizesResolverOuterHeightCallMarker;
            expectedResponse += "-" + this._testDomElemGUIDMarker + testerDiv.getAttribute(this._testDomElemGUIDDataAttr);
            expectedResponse += "-" + this._callWithoutIncludeMarginsParamMarker;

            var sizesResolverManager = new SizesResolverManager();

            sizesResolverManager.startCachingTransaction();
            sizesResolverManager.outerHeight(testerDiv, false, true);
            sizesResolverManager.outerHeight(testerDiv, false, true);
            sizesResolverManager.stopCachingTransaction();
            sizesResolverManager.startCachingTransaction();

            ok(
                sizesResolverManager.outerHeight(testerDiv, false, true) == expectedResponse,
                "uncached call after activeTransactionCaching stop"
            );
            sizesResolverManager.stopCachingTransaction();
        },

        _withItemAntialiasing: function() {
            //SizesResolver = this._realSizesResolver;
            SizesResolver.outerHeight = this._realSizesResolver.outerHeight;
            SizesResolver.clearRecursiveSubcallsData = this._realSizesResolver.clearRecursiveSubcallsData;

            clearTestData();

            var testerDiv = document.createElement("div");
            testerDiv.style.width = "100px";
            testerDiv.style.height = "100px";
            $testContent.append($(testerDiv));

            var sizesResolverManager = new SizesResolverManager();
            sizesResolverManager.startCachingTransaction();

            ok(
                sizesResolverManager.outerHeight(testerDiv) == 100,
                "real call with outerHeight antialias value = 0"
            );
            ok(
                sizesResolverManager.outerHeight(testerDiv) == 100,
                "real call with outerHeight antialias value = 0"
            );

            sizesResolverManager.stopCachingTransaction();

            var sizesResolverManager = new SizesResolverManager();
            sizesResolverManager.startCachingTransaction();
            sizesResolverManager.setOuterHeightAntialiasValue(10.1);

            ok(
                sizesResolverManager.outerHeight(testerDiv) == 89.9,
                "real call with outerHeight antialias value = 10.1"
            );
            ok(
                sizesResolverManager.outerHeight(testerDiv) == 89.9,
                "cached call with outerHeight antialias  value = 10.1"
            );

            sizesResolverManager.stopCachingTransaction();

            SizesResolver.outerHeight = this._sizesResolverMock.outerHeight;
            SizesResolver.clearRecursiveSubcallsData = this._sizesResolverMock.clearRecursiveSubcallsData;

            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});