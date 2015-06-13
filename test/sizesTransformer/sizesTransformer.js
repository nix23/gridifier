$(document).ready(function() {
    module("Sizes transformer tests.");

    var gridifierMock = {};
    var settingsMock = {
        isVerticalGrid: function() {
            return true;
        }
    };
    var connectorsMock = {};
    var connectionsMock = {};
    var guidMock = {};
    var appenderMock = {};
    var reversedAppenderMock = {};

    // var sizesTransformer = new Gridifier.SizesTransformer(
    //     gridifierMock,
    //     settingsMock,
    //     connectorsMock,
    //     connectionsMock,
    //     guidMock,
    //     appenderMock,
    //     reversedAppenderMock
    // );

    var initConnectionTransformTester = {
        // _realSizesResolver: null,
        // _sizesResolverMock: null,
        _connectionMock: null,
        _connectionWithPercentageSizesItemMock: null,
        _item: null,
        _itemWithPercentageSizes: null,
        PX_WIDTH: "100px",
        PX_HEIGHT: "100px",
        PT_WIDTH: "30%",
        PT_HEIGHT: "10%",

        _before: function() {
            //this._realSizesResolver = SizesResolver;
            // this._sizesResolverMock = {
            //     outerWidth: function(DOMElem, includeMargins) {
            //         return 100;
            //     },

            //     outerHeight: function(DOMElem, includeMargins) {
            //         return 100;
            //     }
            // };
            // SizesResolver = this._sizesResolverMock;

            // this._connectionMock = {
            //     item: {}
            // };
            clearTestData();

            this._item = document.createElement("div");
            this._item.style.width = this.PX_WIDTH;
            this._item.style.height = this.PX_HEIGHT;
            $testContent.append($(this._item));

            this._itemWithPercentageSizes = document.createElement("div");
            this._itemWithPercentageSizes.style.width = this.PT_WIDTH;
            this._itemWithPercentageSizes.style.height = this.PT_HEIGHT;
            $testContent.append($(this._itemWithPercentageSizes));

            this._connectionMock = {
                item: this._item
            };

            this._connectionWithPercentageSizesItemMock = {
                item: this._itemWithPercentageSizes
            };
        },

        _after: function() {
            //SizesResolver = this._realSizesResolver;
        },

        runTests: function() {
            var me = this;

            test("initConnectionTransform", function(assert) {
                me._before.call(me);

                me._testCallWithPostfixedParams.call(me);
                me._testCallWithWrongParams.call(me, assert);
                me._testCallWithParamsWithoutPostfixes.call(me);
                me._testCallWithoutParams.call(me);
                me._testCallWithMultiplicationParams.call(me);
                me._testCallWithDivisionParams.call(me);
                
                me._after.call(me);
            });
        },

        _testCallWithPostfixedParams: function() {
            var targetSizes = sizesTransformer.initConnectionTransform(
                this._connectionMock, "100px", "300px"
            );
            ok(
                (targetSizes.targetWidth == "100px" && targetSizes.targetHeight =="300px"),
                "call initConnectionTransform with pxWidth and pxHeight"
            );

            var targetSizes = sizesTransformer.initConnectionTransform(
                this._connectionMock, "50%", "50%"
            );
            ok(
                (targetSizes.targetWidth == "50%" && targetSizes.targetHeight == "50%"),
                "call initConnectionTransform with ptWidth and ptHeight"
            );
        },

        _testCallWithWrongParams: function(assert) {
            var me = this;

            assert.throws(
                function() { sizesTransformer.initConnectionTransform(me._connectionMock, "wrongsize", "100px"); },
                /(.*)Wrong target transformation sizes(.*)/,
                "call initConnectionTransform with wrong width"
            );

            assert.throws(
                function() { sizesTransformer.initConnectionTransform(me._connectionMock, "100px", "wrongsize"); },
                /(.*)Wrong target transformation sizes(.*)/,
                "call initConnectionTransform with wrong height"
            );
        },

        _testCallWithParamsWithoutPostfixes: function() {
            var targetSizes = sizesTransformer.initConnectionTransform(
                this._connectionMock, 100, "100"
            );
            
            ok(
                (targetSizes.targetWidth == "100px" && targetSizes.targetHeight == "100px"), 
                "call initConnectionTransform with params without prefixes"
            );
        },

        _testCallWithoutParams: function() {
            var targetSizes = sizesTransformer.initConnectionTransform(this._connectionMock);
            ok(
                (targetSizes.targetWidth == this.PX_WIDTH && targetSizes.targetHeight == this.PX_HEIGHT), 
                "call initConnectionTransform without params on px-sized element"
            );

            var targetSizes = sizesTransformer.initConnectionTransform(this._connectionWithPercentageSizesItemMock);
            ok(
                (targetSizes.targetWidth == this.PT_WIDTH && targetSizes.targetHeight == this.PT_HEIGHT),
                "call initConnectionTransform without params on pt-sized element"
            );
        },

        _testCallWithMultiplicationParams: function() {
            var targetSizes = sizesTransformer.initConnectionTransform(
                this._connectionMock, "*2", "*0.5"
            );
            var expectedWidth = parseFloat(this.PX_WIDTH) * 2 + "px";
            var expectedHeight = parseFloat(this.PX_HEIGHT) * 0.5 + "px";
            ok(
                (targetSizes.targetWidth == expectedWidth && targetSizes.targetHeight == expectedHeight),
                "call initConnectionTransform with multiplication expression sizes on px based elements"
            );

            var targetSizes = sizesTransformer.initConnectionTransform(
                this._connectionWithPercentageSizesItemMock, "*2", "*0.5"
            );
            var expectedWidth = parseFloat(this.PT_WIDTH) * 2 + "%";
            var expectedHeight = parseFloat(this.PT_HEIGHT) * 0.5 + "%";
            ok(
                (targetSizes.targetWidth == expectedWidth && targetSizes.targetHeight == expectedHeight),
                "call initConnectionTransform with multiplication expression sizes on pt based elements"
            );
        },

        _testCallWithDivisionParams: function() {
            var targetSizes = sizesTransformer.initConnectionTransform(
                this._connectionMock, "/2", "/2"
            );
            var expectedWidth = parseFloat(this.PX_WIDTH) / 2 + "px";
            var expectedHeight = parseFloat(this.PX_HEIGHT) / 2 + "px";
            ok(
                (targetSizes.targetWidth == expectedWidth && targetSizes.targetHeight == expectedHeight),
                "call initConnectionTransform with division expression sizes on px based elements"
            );

            var targetSizes = sizesTransformer.initConnectionTransform(
                this._connectionWithPercentageSizesItemMock, "/2", "/2"
            );
            var expectedWidth = parseFloat(this.PT_WIDTH) / 2 + "%";
            var expectedHeight = parseFloat(this.PT_HEIGHT) / 2 + "%";
            ok(
                (targetSizes.targetWidth == expectedWidth && targetSizes.targetHeight == expectedHeight),
                "call initConnectionTransform with division expression sizes on pt based elements"
            );
        }
    }

    //initConnectionTransformTester.runTests();
});