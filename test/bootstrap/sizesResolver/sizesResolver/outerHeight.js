$(document).ready(function() {
    module("SizesResolver");

    var ohTester = {
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

            GRID_WIDTH: "50px",
            GRID_WRAPPER_WIDTH: "50px", // Will be as children width(GRID_WIDTH)

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

            createGridWithPxHeight: function(pxHeight) {
                var $grid = $("<div/>");
                $grid.css({
                    width: this.GRID_WIDTH,
                    height: pxHeight + "px",
                    "box-sizing": this._boxSizing,
                    position: "relative"
                });

                return $grid;
            },

            createGridWithPxHeightAndPxPadding: function(pxHeight) {
                $grid = this.createGridWithPxHeight(pxHeight);
                $grid.css({"padding": this.PADDING_PX_SIZE});

                return $grid;
            },

            createGridWithPxHeightAndPxMargin: function(pxHeight) {
                $grid = this.createGridWithPxHeight(pxHeight);
                $grid.css({"margin": this.MARGIN_PX_SIZE});

                return $grid;
            },

            createGridWithPxHeightAndPxBorder: function(pxHeight) {
                $grid = this.createGridWithPxHeight(pxHeight);
                $grid.css({"border": this.BORDER_PX_SIZE + " black solid"});

                return $grid;
            },

            createGridWithPercentageHeight: function(wrapperPxHeight, percentageHeight) {
                var $wrapper = $("<div/>");
                $wrapper.css({"height": wrapperPxHeight + "px", "width": this.GRID_WRAPPER_WIDTH});

                var $grid = $("<div/>");
                $grid.css({
                    width: this.GRID_WIDTH,
                    height: percentageHeight + "%",
                    "box-sizing": this._boxSizing,
                    position: "relative"
                });

                $wrapper.append($grid);

                return $grid;
            },

            createGridWithPercentageHeightAndPercentagePadding: function(wrapperPxHeight, percentageHeight) {
                var $grid = this.createGridWithPercentageHeight(wrapperPxHeight, percentageHeight);
                $grid.css({"padding": this.PADDING_PERCENTS_SIZE});

                return $grid;
            },

            createGridWithPercentageHeightAndPercentageMargin: function(wrapperPxHeight, percentageHeight) {
                var $grid = this.createGridWithPercentageHeight(wrapperPxHeight, percentageHeight);
                $grid.css({"margin": this.MARGIN_PERCENTS_SIZE});

                return $grid;
            }
        },

        runTests: function() {
            var me = this;

            test("outerHeight(content-box grid)", function() {
                me._before.call(me);

                me._grids.setBoxSizing(me._grids.BOX_SIZINGS.CONTENT_BOX);

                ohPxHeightGrid.withContentBoxItems.call(me);
                ohPxHeightGrid.withBorderBoxItems.call(me);

                ohPxHeightPxPaddingGrid.withContentBoxItems.call(me);
                ohPxHeightPxPaddingGrid.withBorderBoxItems.call(me);

                ohPxHeightPxMarginGrid.withContentBoxItems.call(me);
                ohPxHeightPxMarginGrid.withBorderBoxItems.call(me);

                ohPxHeightPxBorderGrid.withContentBoxItems.call(me);
                ohPxHeightPxBorderGrid.withBorderBoxItems.call(me);

                ohPtHeightGrid.withContentBoxItems.call(me);
                ohPtHeightGrid.withBorderBoxItems.call(me);

                ohPtHeightPtPaddingGrid.withContentBoxItems.call(me);
                ohPtHeightPtPaddingGrid.withBorderBoxItems.call(me);

                ohPtHeightPtMarginGrid.withContentBoxItems.call(me);
                ohPtHeightPtMarginGrid.withBorderBoxItems.call(me);

                me._after.call(me);
            });

            test("outerHeight(border-box grid)", function() {
                me._before.call(me);

                me._grids.setBoxSizing(me._grids.BOX_SIZINGS.BORDER_BOX);

                ohPxHeightGrid.withContentBoxItems.call(me);
                ohPxHeightGrid.withBorderBoxItems.call(me);

                ohPxHeightPxPaddingGrid.withContentBoxItems.call(me);
                ohPxHeightPxPaddingGrid.withBorderBoxItems.call(me);

                ohPxHeightPxMarginGrid.withContentBoxItems.call(me);
                ohPxHeightPxMarginGrid.withBorderBoxItems.call(me);

                ohPxHeightPxBorderGrid.withContentBoxItems.call(me);
                ohPxHeightPxBorderGrid.withBorderBoxItems.call(me);

                ohPtHeightGrid.withContentBoxItems.call(me);
                ohPtHeightGrid.withBorderBoxItems.call(me);

                ohPtHeightPtPaddingGrid.withContentBoxItems.call(me);
                ohPtHeightPtPaddingGrid.withBorderBoxItems.call(me);

                ohPtHeightPtMarginGrid.withContentBoxItems.call(me);
                ohPtHeightPtMarginGrid.withBorderBoxItems.call(me);

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

            _createItem: function(height) {
                var $item = $("<div/>");
                $item.css({
                    width: "100px",
                    height: height,
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
                if(ohTester._grids.isContentBoxBSGrid()) {
                    var gridBoxSizingLabel = "; content-box";
                }
                else if(ohTester._grids.isBorderBoxBSGrid()) {
                    var gridBoxSizingLabel = "; border-box";
                }

                return gridBoxSizingLabel;
            },

            callPerItemWithPxHeight: function($grid, gridHeight, itemPxHeight, expectedItemHeight) {
                var $item = this._createItem(itemPxHeight + "px");
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    SizesResolver.outerHeight($item.get(0)) == expectedItemHeight,
                    "call with: Grid -> height = " + gridHeight + BSLabel + "; Item -> height = " + itemPxHeight + "px; " +
                    "box-sizing = " + this._boxSizing + "; "
                );
            },

            callPerItemWithPxHeightAndPxPadding: function($grid, gridHeight, itemPxHeight, expectedItemHeight) {
                var $item = this._createItem(itemPxHeight + "px");
                $item.css({"padding": this.PADDING_PX_SIZE});
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    SizesResolver.outerHeight($item.get(0)) == expectedItemHeight,
                    "call with: Grid -> height = " + gridHeight + BSLabel + "; Item -> height = " + itemPxHeight + "px; " +
                    "box-sizing = " + this._boxSizing + "; padding = " + this.PADDING_PX_SIZE
                );
            },

            callPerItemWithPxHeightAndPxMargin: function($grid, gridHeight, itemPxHeight, expectedItemHeight) {
                var $item = this._createItem(itemPxHeight + "px");
                $item.css({"margin": this.MARGIN_PX_SIZE});
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    SizesResolver.outerHeight($item.get(0), true) == expectedItemHeight,
                    "call with: Grid -> height = " + gridHeight + BSLabel + "; Item -> height = " + itemPxHeight + "px; " +
                    "box-sizing = " + this._boxSizing + "; margin = " + this.MARGIN_PX_SIZE
                );
            },

            callPerItemWithPxHeightAndPxBorder: function($grid, gridHeight, itemPxHeight, expectedItemHeight) {
                var $item = this._createItem(itemPxHeight + "px");
                $item.css({"border": this.BORDER_PX_SIZE + " black solid"});
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    SizesResolver.outerHeight($item.get(0), true) == expectedItemHeight,
                    "call with: Grid -> height = " + gridHeight + BSLabel + "; Item -> height = " + itemPxHeight + "px; " +
                    "box-sizing = " + this._boxSizing + "; border = " + this.BORDER_PX_SIZE
                );
            },

            callPerItemWithPercentageHeight: function($grid, gridHeight, itemPercentageHeight, expectedItemHeight) {
                var $item = this._createItem(itemPercentageHeight + "%");
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    this.doesFractionalResultsEquals(
                        SizesResolver.outerHeight($item.get(0), true), expectedItemHeight
                    ),
                    "call with: Grid -> height = " + gridHeight + BSLabel + "; Item -> height = " + itemPercentageHeight + "%; " +
                    "box-sizing = " + this._boxSizing
                );
            },

            callPerItemWithPercentageHeightAndPercentagePadding: function($grid, gridHeight, itemPercentageHeight, expectedItemHeight) {
                var $item = this._createItem(itemPercentageHeight + "%");
                $item.css({"padding": this.PADDING_PERCENTS_SIZE});
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    this.doesFractionalResultsEquals(
                        SizesResolver.outerHeight($item.get(0), true), expectedItemHeight
                    ),
                    "call with: Grid -> height = " + gridHeight + BSLabel + "; Item -> height = " + itemPercentageHeight + "%; " +
                    "box-sizing = " + this._boxSizing + "; padding = " + this.PADDING_PERCENTS_SIZE
                );
            },

            callPerItemWithPercentageHeightAndPercentageMargin: function($grid, gridHeight, itemPercentageHeight, expectedItemHeight) {
                var $item = this._createItem(itemPercentageHeight + "%");
                $item.css({"margin": this.MARGIN_PERCENTS_SIZE});
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    this.doesFractionalResultsEquals(
                        SizesResolver.outerHeight($item.get(0), true), expectedItemHeight
                    ),
                    "call with: Grid -> height = " + gridHeight + BSLabel + "; Item -> height = " + itemPercentageHeight + "%; " +
                    "box-sizing = " + this._boxSizing + "; margin = " + this.MARGIN_PERCENTS_SIZE
                );
            },

            callPerItemWithPercentageHeightAndPxBorder: function($grid, gridHeight, itemPercentageHeight, expectedItemHeight) {
                var $item = this._createItem(itemPercentageHeight + "%");
                $item.css({"border": this.BORDER_PX_SIZE + " black solid"});
                $grid.append($item);

                var BSLabel = this._getGridBoxSizingLabel();
                ok(
                    this.doesFractionalResultsEquals(
                        SizesResolver.outerHeight($item.get(0), true), expectedItemHeight
                    ),
                    "call with: Grid -> height = " + gridHeight + BSLabel + "; Item -> height = " + itemPercentageHeight + "%; " +
                    "box-sizing = " + this._boxSizing + "; border = " + this.BORDER_PX_SIZE
                );
            }
        }
    }

    ohTester.runTests();
    clearTestData();
});