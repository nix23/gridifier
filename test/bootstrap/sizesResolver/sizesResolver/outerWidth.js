$(document).ready(function() {
    module("SizesResolver");

    var owTester = {
        _before: function() {

        },

        _after: function() {

        },

        _grids: {
            _boxSizing: null,
            BOX_SIZINGS: {CONTENT_BOX: "content-box", BORDER_BOX: "border-box"},

            PADDING_PX_SIZE: "20px",
            PADDING_PERCENTS_SIZE: "10.5%",
            MARGIN_PX_SIZE: "20px",
            MARGIN_PERCENTS_SIZE: "10.5%",
            BORDER_PX_SIZE: "3px",

            setBoxSizing: function(boxSizing) {
                if(boxSizing != this.BOX_SIZINGS.CONTENT_BOX &&
                    boxSizing != this.BOX_SIZINGS.BORDER_BOX) {
                    throw new Error("Can't set unknown box sizing!");
                }

                this._boxSizing = boxSizing;
            },

            isContentBoxBSGrid: function() {
                return this._boxSizing == this.BOX_SIZINGS.CONTENT_BOX;
            },

            isBorderBoxBSGrid: function() {
                return this._boxSizing == this.BOX_SIZINGS.BORDER_BOX;
            },

            createGridWithPxWidth: function(pxWidth) {
                var $grid = $("<div/>");
                $grid.css({
                    width: pxWidth + "px",
                    height: "500px",
                    "box-sizing": this._boxSizing,
                    position: "relative"
                });

                return $grid;
            },

            createGridWithPxWidthAndPxPadding: function(pxWidth) {
                $grid = this.createGridWithPxWidth(pxWidth);
                $grid.css({"padding": this.PADDING_PX_SIZE});

                return $grid;
            },

            createGridWithPxWidthAndPxMargin: function(pxWidth) {
                $grid = this.createGridWithPxWidth(pxWidth);
                $grid.css({"margin": this.MARGIN_PX_SIZE});

                return $grid;
            },

            createGridWithPxWidthAndPxBorder: function(pxWidth) {
                $grid = this.createGridWithPxWidth(pxWidth);
                $grid.css({"border": this.BORDER_PX_SIZE + " black solid"});

                return $grid;
            },

            createGridWithPercentageWidth: function(wrapperPxWidth, percentageWidth) {
                var $wrapper = $("<div/>");
                $wrapper.css({"width": wrapperPxWidth + "px"});

                var $grid = $("<div/>");
                $grid.css({
                    width: percentageWidth + "%",
                    height: "500px",
                    "box-sizing": this._boxSizing,
                    position: "relative"
                });

                $wrapper.append($grid);

                return $grid;
            },

            createGridWithPercentageWidthAndPercentagePadding: function(wrapperPxWidth, percentageWidth) {
                var $grid = this.createGridWithPercentageWidth(wrapperPxWidth, percentageWidth);
                $grid.css({"padding": this.PADDING_PERCENTS_SIZE});

                return $grid;
            },

            createGridWithPercentageWidthAndPercentageMargin: function(wrapperPxWidth, percentageWidth) {
                var $grid = this.createGridWithPercentageWidth(wrapperPxWidth, percentageWidth);
                $grid.css({"margin": this.MARGIN_PERCENTS_SIZE});

                return $grid;
            }
        },

        runTests: function() {
            var me = this;

            test("outerWidth(content-box grid)", function() {
                me._before.call(me);

                me._grids.setBoxSizing(me._grids.BOX_SIZINGS.CONTENT_BOX);

                owPxWidthGrid.withContentBoxItems.call(me);
                owPxWidthGrid.withBorderBoxItems.call(me);

                owPxWidthPxPaddingGrid.withContentBoxItems.call(me);
                owPxWidthPxPaddingGrid.withBorderBoxItems.call(me);

                owPxWidthPxMarginGrid.withContentBoxItems.call(me);
                owPxWidthPxMarginGrid.withBorderBoxItems.call(me);

                owPxWidthPxBorderGrid.withContentBoxItems.call(me);
                owPxWidthPxBorderGrid.withBorderBoxItems.call(me);

                owPtWidthGrid.withContentBoxItems.call(me);
                owPtWidthGrid.withBorderBoxItems.call(me);

                owPtWidthPtPaddingGrid.withContentBoxItems.call(me);
                owPtWidthPtPaddingGrid.withBorderBoxItems.call(me);

                owPtWidthPtMarginGrid.withContentBoxItems.call(me);
                owPtWidthPtMarginGrid.withBorderBoxItems.call(me);

                me._after.call(me);
            });

            test("outerWidth(border-box grid)", function() {
                me._before.call(me);

                me._grids.setBoxSizing(me._grids.BOX_SIZINGS.BORDER_BOX);

                owPxWidthGrid.withContentBoxItems.call(me);
                owPxWidthGrid.withBorderBoxItems.call(me);

                owPxWidthPxPaddingGrid.withContentBoxItems.call(me);
                owPxWidthPxPaddingGrid.withBorderBoxItems.call(me);

                owPxWidthPxMarginGrid.withContentBoxItems.call(me);
                owPxWidthPxMarginGrid.withBorderBoxItems.call(me);

                owPxWidthPxBorderGrid.withContentBoxItems.call(me);
                owPxWidthPxBorderGrid.withBorderBoxItems.call(me);

                owPtWidthGrid.withContentBoxItems.call(me);
                owPtWidthGrid.withBorderBoxItems.call(me);

                owPtWidthPtPaddingGrid.withContentBoxItems.call(me);
                owPtWidthPtPaddingGrid.withBorderBoxItems.call(me);

                owPtWidthPtMarginGrid.withContentBoxItems.call(me);
                owPtWidthPtMarginGrid.withBorderBoxItems.call(me);

                me._after.call(me);
            });
        },

        _gridItemTests: {
            _boxSizing: null,
            BOX_SIZINGS: {CONTENT_BOX: "content-box", BORDER_BOX: "border-box"},

            PADDING_PX_SIZE: "10px",
            PADDING_PERCENTS_SIZE: "5.5%",
            MARGIN_PX_SIZE: "15px",
            MARGIN_PERCENTS_SIZE: "5.8%",
            BORDER_PX_SIZE: "3px",

            setBoxSizing: function(boxSizing) {
                if(boxSizing != this.BOX_SIZINGS.CONTENT_BOX &&
                    boxSizing != this.BOX_SIZINGS.BORDER_BOX) {
                    throw new Error("Can't set unknown box sizing!");
                }

                this._boxSizing = boxSizing;
            },

            _createItem: function(width) {
                var $item = $("<div/>");
                $item.css({
                    width: width,
                    height: "100px",
                    "box-sizing": this._boxSizing,
                    position: "absolute",
                    left: "10px",
                    top: "10px",
                    visibility: "hidden"
                });

                return $item;
            },

            doesFractionalResultsEquals: function(firstResult, secondResult) {
                var difference = Math.abs(firstResult - secondResult);
                return (difference < 0.1);
            },

            _getGridBoxSizingLabel: function() {
                if(owTester._grids.isContentBoxBSGrid()) {
                    var gridBoxSizingLabel = "; content-box";
                }
                else if(owTester._grids.isBorderBoxBSGrid()) {
                    var gridBoxSizingLabel = "; border-box";
                }

                return gridBoxSizingLabel;
            },

            callPerItemWithPxWidth: function($grid, gridWidth, itemPxWidth, expectedItemWidth) {
                var $item = this._createItem(itemPxWidth + "px");
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    SizesResolver.outerWidth($item.get(0)) == expectedItemWidth,
                    "call with: Grid -> width = " + gridWidth + BSLabel + "; Item -> width = " + itemPxWidth + "px; " +
                    "box-sizing = " + this._boxSizing + "; "
                );
            },

            callPerItemWithPxWidthAndPxPadding: function($grid, gridWidth, itemPxWidth, expectedItemWidth) {
                var $item = this._createItem(itemPxWidth + "px");
                $item.css({"padding": this.PADDING_PX_SIZE});
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    SizesResolver.outerWidth($item.get(0)) == expectedItemWidth,
                    "call with: Grid -> width = " + gridWidth + BSLabel + "; Item -> width = " + itemPxWidth + "px; " +
                    "box-sizing = " + this._boxSizing + "; padding = " + this.PADDING_PX_SIZE
                );
            },

            callPerItemWithPxWidthAndPxMargin: function($grid, gridWidth, itemPxWidth, expectedItemWidth) {
                var $item = this._createItem(itemPxWidth + "px");
                $item.css({"margin": this.MARGIN_PX_SIZE});
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    SizesResolver.outerWidth($item.get(0), true) == expectedItemWidth,
                    "call with: Grid -> width = " + gridWidth + BSLabel + "; Item -> width = " + itemPxWidth + "px; " +
                    "box-sizing = " + this._boxSizing + "; margin = " + this.MARGIN_PX_SIZE
                );
            },

            callPerItemWithPxWidthAndPxBorder: function($grid, gridWidth, itemPxWidth, expectedItemWidth) {
                var $item = this._createItem(itemPxWidth + "px");
                $item.css({"border": this.BORDER_PX_SIZE + " black solid"});
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    SizesResolver.outerWidth($item.get(0)) == expectedItemWidth,
                    "call with: Grid -> width = " + gridWidth + BSLabel + "; Item -> width = " + itemPxWidth + "px; " +
                    "box-sizing = " + this._boxSizing + "; border = " + this.BORDER_PX_SIZE
                );
            },

            callPerItemWithPercentageWidth: function($grid, gridWidth, itemPercentageWidth, expectedItemWidth) {
                var $item = this._createItem(itemPercentageWidth + "%");
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    this.doesFractionalResultsEquals(
                        SizesResolver.outerWidth($item.get(0), true), expectedItemWidth
                    ),
                    "call with: Grid -> width = " + gridWidth + BSLabel + "; Item -> width = " + itemPercentageWidth + "%; " +
                    "box-sizing = " + this._boxSizing
                );
            },

            callPerItemWithPercentageWidthAndPercentagePadding: function($grid, gridWidth, itemPercentageWidth, expectedItemWidth) {
                var $item = this._createItem(itemPercentageWidth + "%");
                $item.css({"padding": this.PADDING_PERCENTS_SIZE});
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    this.doesFractionalResultsEquals(
                        SizesResolver.outerWidth($item.get(0), true), expectedItemWidth
                    ),
                    "call with: Grid -> width = " + gridWidth + BSLabel + "; Item -> width = " + itemPercentageWidth + "%; " +
                    "box-sizing = " + this._boxSizing + "; padding = " + this.PADDING_PERCENTS_SIZE
                );
            },

            callPerItemWithPercentageWidthAndPercentageMargin: function($grid, gridWidth, itemPercentageWidth, expectedItemWidth) {
                var $item = this._createItem(itemPercentageWidth + "%");
                $item.css({"margin": this.MARGIN_PERCENTS_SIZE});
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    this.doesFractionalResultsEquals(
                        SizesResolver.outerWidth($item.get(0), true), expectedItemWidth
                    ),
                    "call with: Grid -> width = " + gridWidth + BSLabel + "; Item -> width = " + itemPercentageWidth + "%; " +
                    "box-sizing = " + this._boxSizing + "; margin = " + this.MARGIN_PERCENTS_SIZE
                );
            },

            callPerItemWithPercentageWidthAndPxBorder: function($grid, gridWidth, itemPercentageWidth, expectedItemWidth) {
                var $item = this._createItem(itemPercentageWidth + "%");
                $item.css({"border": this.BORDER_PX_SIZE + " black solid"});
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    this.doesFractionalResultsEquals(
                        SizesResolver.outerWidth($item.get(0), true), expectedItemWidth
                    ),
                    "call with: Grid -> width = " + gridWidth + BSLabel + "; Item -> width = " + itemPercentageWidth + "%; " +
                    "box-sizing = " + this._boxSizing + "; border = " + this.BORDER_PX_SIZE
                );
            }
        }
    }

    owTester.runTests();
    clearTestData();
});