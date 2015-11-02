$(document).ready(function() {
    module("SrManager");

    var tester = {
        _realSizesResolver: null,
        _sizesResolverMock: null,
        _testDomElemGUID: 0,
        _testDomElemGUIDDataAttr: "data-test-dom-elem-guid",
        _testDomElemGUIDMarker: "per-dom-elem-with-guid",
        _realSizesResolverOuterWidthCallMarker: "real-sizes-resolver-outer-width-call",
        _cachedSizesResolverOuterWidthCallMarker: "cached-sizes-resolver-outer-width-call",
        _callWithIncludeMarginsParamMarker: "with-include-margins-param",
        _callWithoutIncludeMarginsParamMarker: "without-include-margins-param",

        _before: function() {
            var me = this;
            //this._realSizesResolver = SizesResolver;
            this._realSizesResolver = {};
            this._realSizesResolver.outerWidth = SizesResolver.outerWidth;
            this._realSizesResolver.clearRecursiveSubcallsData = SizesResolver.clearRecursiveSubcallsData;
            this._sizesResolverMock = {
                outerWidth: function(DOMElem, includeMargins) {
                    var response = "";

                    response += me._realSizesResolverOuterWidthCallMarker;
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
            SizesResolver.outerWidth = this._sizesResolverMock.outerWidth;
            SizesResolver.clearRecursiveSubcallsData = this._sizesResolverMock.clearRecursiveSubcallsData;
        },

        _after: function() {
            //SizesResolver = this._realSizesResolver;
            SizesResolver.outerWidth = this._realSizesResolver.outerWidth;
            SizesResolver.clearRecursiveSubcallsData = this._realSizesResolver.clearRecursiveSubcallsData;
        },

        runTests: function() {
            var me = this;

            test("outerWidth", function(assert) {
                var test = function(tests) {
                    me._before.call(me);

                    for(var i = 0; i < tests.length; i++)
                        me["_" + tests[i]].call(me, assert);

                    me._after.call(me);
                }

                test([
                    "srOwMock",
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

        _markCachedValuesInOuterWidthCacheArray: function(sizesResolverManager) {
            for(var i = 0; i < sizesResolverManager._owCache.length; i++) {
                var cacheEntry = sizesResolverManager._owCache[i];
                var cachedReturnedValues = cacheEntry.cachedCalls;

                if(cachedReturnedValues.withMargins != null) {
                    if(cachedReturnedValues.withMargins.match(this._realSizesResolverOuterWidthCallMarker)) {
                        cachedReturnedValues.withMargins = cachedReturnedValues.withMargins.replace(
                            this._realSizesResolverOuterWidthCallMarker,
                            this._cachedSizesResolverOuterWidthCallMarker
                        );
                    }
                }

                if(cachedReturnedValues.withoutMargins != null) {
                    if(cachedReturnedValues.withoutMargins.match(this._realSizesResolverOuterWidthCallMarker)) {
                        cachedReturnedValues.withoutMargins = cachedReturnedValues.withoutMargins.replace(
                            this._realSizesResolverOuterWidthCallMarker,
                            this._cachedSizesResolverOuterWidthCallMarker
                        );
                    }
                }
            }
        },

        _srOwMock: function() {
            this._testDomElemGUID = 0;

            var testerDiv = document.createElement("div");
            testerDiv.setAttribute(this._testDomElemGUIDDataAttr, this._testDomElemGUID);

            var expectedResponse = this._realSizesResolverOuterWidthCallMarker;
            expectedResponse += "-" + this._testDomElemGUIDMarker + testerDiv.getAttribute(this._testDomElemGUIDDataAttr);
            expectedResponse += "-" + this._callWithoutIncludeMarginsParamMarker;
            ok(
                this._sizesResolverMock.outerWidth(testerDiv) == expectedResponse,
                "call sizesResolver outerWidth mock with includeMargins = false"
            );

            var expectedResponse = this._realSizesResolverOuterWidthCallMarker;
            expectedResponse += "-" + this._testDomElemGUIDMarker + testerDiv.getAttribute(this._testDomElemGUIDDataAttr);
            expectedResponse += "-" + this._callWithIncludeMarginsParamMarker;
            ok(
                this._sizesResolverMock.outerWidth(testerDiv, true) == expectedResponse,
                "call sizesResolver outerWidth mock with includeMargins = true"
            );
        },

        _withoutActiveCachingTransaction: function() {
            this._testDomElemGUID = 0;

            var testerDiv = document.createElement("div");
            testerDiv.setAttribute(this._testDomElemGUIDDataAttr, this._testDomElemGUID);

            var sizesResolverManager = new SizesResolverManager();

            var expectedResponse = this._realSizesResolverOuterWidthCallMarker;
            expectedResponse += "-" + this._testDomElemGUIDMarker + testerDiv.getAttribute(this._testDomElemGUIDDataAttr);
            expectedResponse += "-" + this._callWithoutIncludeMarginsParamMarker;
            ok(
                sizesResolverManager.outerWidth(testerDiv, false, true) == expectedResponse,
                "call with includeMargins = false"
            );

            var expectedResponse = this._realSizesResolverOuterWidthCallMarker;
            expectedResponse += "-" + this._testDomElemGUIDMarker + testerDiv.getAttribute(this._testDomElemGUIDDataAttr);
            expectedResponse += "-" + this._callWithIncludeMarginsParamMarker;
            ok(
                sizesResolverManager.outerWidth(testerDiv, true, true) == expectedResponse,
                "call with includeMargins = true"
            );
        },

        _isSecondCallWithIncludeMarginsCached: function() {
            this._testDomElemGUID = 0;

            var testerDiv = document.createElement("div");
            testerDiv.setAttribute(this._testDomElemGUIDDataAttr, this._testDomElemGUID);

            var sizesResolverManager = new SizesResolverManager();

            var expectedResponse = this._cachedSizesResolverOuterWidthCallMarker;
            expectedResponse += "-" + this._testDomElemGUIDMarker + testerDiv.getAttribute(this._testDomElemGUIDDataAttr);
            expectedResponse += "-" + this._callWithIncludeMarginsParamMarker;

            sizesResolverManager.startCachingTransaction();
            sizesResolverManager.outerWidth(testerDiv, true, true);
            this._markCachedValuesInOuterWidthCacheArray(sizesResolverManager);

            ok(
                sizesResolverManager.outerWidth(testerDiv, true, true) == expectedResponse,
                "cached call with includeMargins = true"
            );
            sizesResolverManager.stopCachingTransaction();
        },

        _isSecondCallWithoutIncludeMarginsCached: function() {
            this._testDomElemGUID = 0;

            var testerDiv = document.createElement("div");
            testerDiv.setAttribute(this._testDomElemGUIDDataAttr, this._testDomElemGUID);

            var sizesResolverManager = new SizesResolverManager();

            var expectedResponse = this._cachedSizesResolverOuterWidthCallMarker;
            expectedResponse += "-" + this._testDomElemGUIDMarker + testerDiv.getAttribute(this._testDomElemGUIDDataAttr);
            expectedResponse += "-" + this._callWithoutIncludeMarginsParamMarker;

            sizesResolverManager.startCachingTransaction();
            sizesResolverManager.outerWidth(testerDiv, false, true);
            this._markCachedValuesInOuterWidthCacheArray(sizesResolverManager);

            ok(
                sizesResolverManager.outerWidth(testerDiv, false, true) == expectedResponse,
                "cached call with includeMargins = false"
            );
            sizesResolverManager.stopCachingTransaction();
        },

        _areCallsWithAllPossibleParamsCached: function() {
            this._testDomElemGUID = 0;

            var testerDiv = document.createElement("div");
            testerDiv.setAttribute(this._testDomElemGUIDDataAttr, this._testDomElemGUID);

            var sizesResolverManager = new SizesResolverManager();

            var expectedResponsePrefix = this._cachedSizesResolverOuterWidthCallMarker;
            expectedResponsePrefix += "-" + this._testDomElemGUIDMarker + testerDiv.getAttribute(this._testDomElemGUIDDataAttr);

            var withoutParamCallExpectedResponse = expectedResponsePrefix + "-" + this._callWithoutIncludeMarginsParamMarker;
            var withParamCallExpectedResponse = expectedResponsePrefix + "-" + this._callWithIncludeMarginsParamMarker;

            sizesResolverManager.startCachingTransaction();
            sizesResolverManager.outerWidth(testerDiv, false, true);
            sizesResolverManager.outerWidth(testerDiv, true, true);
            this._markCachedValuesInOuterWidthCacheArray(sizesResolverManager);

            ok(
                sizesResolverManager.outerWidth(testerDiv, false, true) == withoutParamCallExpectedResponse &&
                sizesResolverManager.outerWidth(testerDiv, true, true) == withParamCallExpectedResponse,
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

            var expectedResponsePrefix = this._cachedSizesResolverOuterWidthCallMarker;

            var expectedResponsePerFirstTesterDiv = expectedResponsePrefix + "-" + this._testDomElemGUIDMarker;
            expectedResponsePerFirstTesterDiv += firstTesterDiv.getAttribute(this._testDomElemGUIDDataAttr);
            expectedResponsePerFirstTesterDiv += "-" + this._callWithoutIncludeMarginsParamMarker;

            var expectedResponsePerSecondTesterDiv = expectedResponsePrefix + "-" + this._testDomElemGUIDMarker;
            expectedResponsePerSecondTesterDiv += secondTesterDiv.getAttribute(this._testDomElemGUIDDataAttr);
            expectedResponsePerSecondTesterDiv += "-" + this._callWithoutIncludeMarginsParamMarker;

            var sizesResolverManager = new SizesResolverManager();

            sizesResolverManager.startCachingTransaction();
            sizesResolverManager.outerWidth(firstTesterDiv, false, true);
            sizesResolverManager.outerWidth(secondTesterDiv, false, true);
            this._markCachedValuesInOuterWidthCacheArray(sizesResolverManager);

            ok(
                sizesResolverManager.outerWidth(firstTesterDiv, false, true) == expectedResponsePerFirstTesterDiv &&
                sizesResolverManager.outerWidth(secondTesterDiv, false, true) == expectedResponsePerSecondTesterDiv,
                "cached calls per different elements"
            );
            sizesResolverManager.stopCachingTransaction();
        },

        _areUncachedAfterTransacationStop: function() {
            this._testDomElemGUID = 0;

            var testerDiv = document.createElement("div");
            testerDiv.setAttribute(this._testDomElemGUIDDataAttr, this._testDomElemGUID);

            var expectedResponse = this._realSizesResolverOuterWidthCallMarker;
            expectedResponse += "-" + this._testDomElemGUIDMarker + testerDiv.getAttribute(this._testDomElemGUIDDataAttr);
            expectedResponse += "-" + this._callWithoutIncludeMarginsParamMarker;

            var sizesResolverManager = new SizesResolverManager();

            sizesResolverManager.startCachingTransaction();
            sizesResolverManager.outerWidth(testerDiv, false, true);
            sizesResolverManager.outerWidth(testerDiv, false, true);
            sizesResolverManager.stopCachingTransaction();
            sizesResolverManager.startCachingTransaction();

            ok(
                sizesResolverManager.outerWidth(testerDiv, false, true) == expectedResponse,
                "uncached call after activeTransactionCaching stop"
            );
            sizesResolverManager.stopCachingTransaction();
        },

        _withItemAntialiasing: function() {
            //SizesResolver = this._realSizesResolver;
            SizesResolver.outerWidth = this._realSizesResolver.outerWidth;
            SizesResolver.clearRecursiveSubcallsData = this._realSizesResolver.clearRecursiveSubcallsData;

            clearTestData();

            var testerDiv = document.createElement("div");
            testerDiv.style.width = "100px";
            testerDiv.style.height = "100px";
            $testContent.append($(testerDiv));

            var sizesResolverManager = new SizesResolverManager();
            sizesResolverManager.startCachingTransaction();

            ok(
                sizesResolverManager.outerWidth(testerDiv) == 100,
                "real call with outerWidth antialias value = 0"
            );
            ok(
                sizesResolverManager.outerWidth(testerDiv) == 100,
                "cached call with outerWidth antialias value = 0"
            );

            sizesResolverManager.stopCachingTransaction();

            var sizesResolverManager = new SizesResolverManager();
            sizesResolverManager.startCachingTransaction();
            sizesResolverManager.setOuterWidthAntialiasValue(10.1);

            ok(
                sizesResolverManager.outerWidth(testerDiv) == 89.9,
                "real call with outerWidth antialias value = 10.1"
            );
            ok(
                sizesResolverManager.outerWidth(testerDiv) == 89.9,
                "cached call with outerWidth antialias value = 10.1"
            );

            sizesResolverManager.stopCachingTransaction();

            //SizesResolver = this._sizesResolverMock;
            SizesResolver.outerWidth = this._sizesResolverMock.outerWidth;
            SizesResolver.clearRecursiveSubcallsData = this._sizesResolverMock.clearRecursiveSubcallsData;
            clearTestData();
        }
    }

    tester.runTests();
    clearTestData();
});