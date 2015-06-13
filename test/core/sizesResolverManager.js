$(document).ready(function() {
    module("Sizes resolver manager tests.");

    var outerWidthTester = {
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
                me._before.call(me);

                me._testSizesResolverOuterWidthMockCall.call(me);
                me._testCallWithoutActiveCachingTransaction.call(me);
                me._testIfSecondCallIsCachedWithIncludeMarginsParam.call(me);
                me._testIfSecondCallIsCachedWithoutIncludeMarginsParam.call(me);
                me._testIfCallsWithAllPossibleParamsAreCachedSeparately.call(me);
                me._testIfSequentialCallsOnDifferentElemsAreCached.call(me);
                me._testIfUncachedCallAfterCachingActiveTransactionStop.call(me);
                me._testWithAntialiasingOnTestElem.call(me);

                me._after.call(me);
            });
        },

        _markCachedValuesInOuterWidthCacheArray: function(sizesResolverManager) {
            for(var i = 0; i < sizesResolverManager._outerWidthCache.length; i++) {
                var cacheEntry = sizesResolverManager._outerWidthCache[i];
                var cachedReturnedValues = cacheEntry.cachedReturnedValues;

                if(cachedReturnedValues.withIncludeMarginsParam != null) {
                    if(cachedReturnedValues.withIncludeMarginsParam.match(this._realSizesResolverOuterWidthCallMarker)) {
                        cachedReturnedValues.withIncludeMarginsParam = cachedReturnedValues.withIncludeMarginsParam.replace(
                            this._realSizesResolverOuterWidthCallMarker,
                            this._cachedSizesResolverOuterWidthCallMarker
                        );
                    }
                }

                if(cachedReturnedValues.withoutIncludeMarginsParam != null) {
                    if(cachedReturnedValues.withoutIncludeMarginsParam.match(this._realSizesResolverOuterWidthCallMarker)) {
                        cachedReturnedValues.withoutIncludeMarginsParam = cachedReturnedValues.withoutIncludeMarginsParam.replace(
                            this._realSizesResolverOuterWidthCallMarker,
                            this._cachedSizesResolverOuterWidthCallMarker
                        );
                    }
                }
            }
        },

        _testSizesResolverOuterWidthMockCall: function() {
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

        _testCallWithoutActiveCachingTransaction: function() {
            this._testDomElemGUID = 0;

            var testerDiv = document.createElement("div");
            testerDiv.setAttribute(this._testDomElemGUIDDataAttr, this._testDomElemGUID);

            var sizesResolverManager = new Gridifier.SizesResolverManager();

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

        _testIfSecondCallIsCachedWithIncludeMarginsParam: function() {
            this._testDomElemGUID = 0;

            var testerDiv = document.createElement("div");
            testerDiv.setAttribute(this._testDomElemGUIDDataAttr, this._testDomElemGUID);

            var sizesResolverManager = new Gridifier.SizesResolverManager();

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

        _testIfSecondCallIsCachedWithoutIncludeMarginsParam: function() {
            this._testDomElemGUID = 0;

            var testerDiv = document.createElement("div");
            testerDiv.setAttribute(this._testDomElemGUIDDataAttr, this._testDomElemGUID);

            var sizesResolverManager = new Gridifier.SizesResolverManager();

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

        _testIfCallsWithAllPossibleParamsAreCachedSeparately: function() {
            this._testDomElemGUID = 0;

            var testerDiv = document.createElement("div");
            testerDiv.setAttribute(this._testDomElemGUIDDataAttr, this._testDomElemGUID);

            var sizesResolverManager = new Gridifier.SizesResolverManager();

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

        _testIfSequentialCallsOnDifferentElemsAreCached: function() {
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

            var sizesResolverManager = new Gridifier.SizesResolverManager();

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

        _testIfUncachedCallAfterCachingActiveTransactionStop: function() {
            this._testDomElemGUID = 0;

            var testerDiv = document.createElement("div");
            testerDiv.setAttribute(this._testDomElemGUIDDataAttr, this._testDomElemGUID);

            var expectedResponse = this._realSizesResolverOuterWidthCallMarker;
            expectedResponse += "-" + this._testDomElemGUIDMarker + testerDiv.getAttribute(this._testDomElemGUIDDataAttr);
            expectedResponse += "-" + this._callWithoutIncludeMarginsParamMarker;

            var sizesResolverManager = new Gridifier.SizesResolverManager();

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

        _testWithAntialiasingOnTestElem: function() {
            //SizesResolver = this._realSizesResolver;
            SizesResolver.outerWidth = this._realSizesResolver.outerWidth;
            SizesResolver.clearRecursiveSubcallsData = this._realSizesResolver.clearRecursiveSubcallsData;

            clearTestData();

            var testerDiv = document.createElement("div");
            testerDiv.style.width = "100px";
            testerDiv.style.height = "100px";
            $testContent.append($(testerDiv));

            var sizesResolverManager = new Gridifier.SizesResolverManager();
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

            var sizesResolverManager = new Gridifier.SizesResolverManager();
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

    outerWidthTester.runTests();
    clearTestData();

    var outerHeightTester = {
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
                me._before.call(me);

                me._testSizesResolverOuterHeightMockCall.call(me);
                me._testCallWithoutActiveCachingTransaction.call(me);
                me._testIfSecondCallIsCachedWithIncludeMarginsParam.call(me);
                me._testIfSecondCallIsCachedWithoutIncludeMarginsParam.call(me);
                me._testIfCallsWithAllPossibleParamsAreCachedSeparately.call(me);
                me._testIfSequentialCallsOnDifferentElemsAreCached.call(me);
                me._testIfUncachedCallAfterCachingActiveTransactionStop.call(me);
                me._testWithAntialiasingOnTestElem.call(me);

                me._after.call(me);
            });
        },

        _markCachedValuesInOuterHeightCacheArray: function(sizesResolverManager) {
            for(var i = 0; i < sizesResolverManager._outerHeightCache.length; i++) {
                var cacheEntry = sizesResolverManager._outerHeightCache[i];
                var cachedReturnedValues = cacheEntry.cachedReturnedValues;

                if(cachedReturnedValues.withIncludeMarginsParam != null) {
                    if(cachedReturnedValues.withIncludeMarginsParam.match(this._realSizesResolverOuterHeightCallMarker)) {
                        cachedReturnedValues.withIncludeMarginsParam = cachedReturnedValues.withIncludeMarginsParam.replace(
                            this._realSizesResolverOuterHeightCallMarker,
                            this._cachedSizesResolverOuterHeightCallMarker
                        );
                    }
                }

                if(cachedReturnedValues.withoutIncludeMarginsParam != null) {
                    if(cachedReturnedValues.withoutIncludeMarginsParam.match(this._realSizesResolverOuterHeightCallMarker)) {
                        cachedReturnedValues.withoutIncludeMarginsParam = cachedReturnedValues.withoutIncludeMarginsParam.replace(
                            this._realSizesResolverOuterHeightCallMarker,
                            this._cachedSizesResolverOuterHeightCallMarker
                        );
                    }
                }
            }
        },

        _testSizesResolverOuterHeightMockCall: function() {
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

        _testCallWithoutActiveCachingTransaction: function() {
            this._testDomElemGUID = 0;

            var testerDiv = document.createElement("div");
            testerDiv.setAttribute(this._testDomElemGUIDDataAttr, this._testDomElemGUID);

            var sizesResolverManager = new Gridifier.SizesResolverManager();

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

        _testIfSecondCallIsCachedWithIncludeMarginsParam: function() {
            this._testDomElemGUID = 0;

            var testerDiv = document.createElement("div");
            testerDiv.setAttribute(this._testDomElemGUIDDataAttr, this._testDomElemGUID);

            var sizesResolverManager = new Gridifier.SizesResolverManager();

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

        _testIfSecondCallIsCachedWithoutIncludeMarginsParam: function() {
            this._testDomElemGUID = 0;

            var testerDiv = document.createElement("div");
            testerDiv.setAttribute(this._testDomElemGUIDDataAttr, this._testDomElemGUID);

            var expectedResponse = this._cachedSizesResolverOuterHeightCallMarker;
            expectedResponse += "-" + this._testDomElemGUIDMarker + testerDiv.getAttribute(this._testDomElemGUIDDataAttr);
            expectedResponse += "-" + this._callWithoutIncludeMarginsParamMarker;

            var sizesResolverManager = new Gridifier.SizesResolverManager();

            sizesResolverManager.startCachingTransaction();
            sizesResolverManager.outerHeight(testerDiv, false, true);
            this._markCachedValuesInOuterHeightCacheArray(sizesResolverManager);

            ok(
                sizesResolverManager.outerHeight(testerDiv, false, true) == expectedResponse,
                "cached call with includeMargins = false"
            );
            sizesResolverManager.stopCachingTransaction();
        },

        _testIfCallsWithAllPossibleParamsAreCachedSeparately: function() {
            this._testDomElemGUID = 0;

            var testerDiv = document.createElement("div");
            testerDiv.setAttribute(this._testDomElemGUIDDataAttr, this._testDomElemGUID);

            var expectedResponsePrefix = this._cachedSizesResolverOuterHeightCallMarker;
            expectedResponsePrefix += "-" + this._testDomElemGUIDMarker + testerDiv.getAttribute(this._testDomElemGUIDDataAttr);

            var withoutParamCallExpectedResponse = expectedResponsePrefix + "-" + this._callWithoutIncludeMarginsParamMarker;
            var withParamCallExpectedResponse = expectedResponsePrefix + "-" + this._callWithIncludeMarginsParamMarker;

            var sizesResolverManager = new Gridifier.SizesResolverManager();

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

        _testIfSequentialCallsOnDifferentElemsAreCached: function() {
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

            var sizesResolverManager = new Gridifier.SizesResolverManager();

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

        _testIfUncachedCallAfterCachingActiveTransactionStop: function() {
            this._testDomElemGUID = 0;

            var testerDiv = document.createElement("div");
            testerDiv.setAttribute(this._testDomElemGUIDDataAttr, this._testDomElemGUID);

            var expectedResponse = this._realSizesResolverOuterHeightCallMarker;
            expectedResponse += "-" + this._testDomElemGUIDMarker + testerDiv.getAttribute(this._testDomElemGUIDDataAttr);
            expectedResponse += "-" + this._callWithoutIncludeMarginsParamMarker;

            var sizesResolverManager = new Gridifier.SizesResolverManager();

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

        _testWithAntialiasingOnTestElem: function() {
            //SizesResolver = this._realSizesResolver;
            SizesResolver.outerHeight = this._realSizesResolver.outerHeight;
            SizesResolver.clearRecursiveSubcallsData = this._realSizesResolver.clearRecursiveSubcallsData;

            clearTestData();

            var testerDiv = document.createElement("div");
            testerDiv.style.width = "100px";
            testerDiv.style.height = "100px";
            $testContent.append($(testerDiv));

            var sizesResolverManager = new Gridifier.SizesResolverManager();
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

            var sizesResolverManager = new Gridifier.SizesResolverManager();
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

    outerHeightTester.runTests();
    clearTestData();
});