$(document).ready(function() {
    window.owPtWidthPtPaddingGrid = {
        withContentBoxItems: function() {
            var gridWrapperPxWidths = [1071, 1333];

            for(var i = 0; i < gridWrapperPxWidths.length; i++) {
                var gridPercentageWidths = [33, 50];

                for(var j = 0; j < gridPercentageWidths.length; j++) {
                    var gridWrapperPxWidth = gridWrapperPxWidths[i];
                    var gridPercentageWidth = gridPercentageWidths[j];
                    var gridPxWidth = gridWrapperPxWidth / 100 * gridPercentageWidth;

                    var $grid = this._grids.createGridWithPercentageWidthAndPercentagePadding(
                        gridWrapperPxWidth, gridPercentageWidth
                    );
                    var gridLabel = gridPercentageWidth + "%; Grid Wrapper width = " + gridWrapperPxWidth;
                    gridLabel += "; Padding: " + this._grids.PADDING_PERCENTS_SIZE;

                    this._gridItemTests.setBoxSizing(this._gridItemTests.BOX_SIZINGS.CONTENT_BOX);

                    clearTestData();
                    $testContent.append($grid.parent());
                    var itemWidth = 220;
                    var expectedItemWidth = itemWidth;
                    this._gridItemTests.callPerItemWithPxWidth($grid, gridLabel, itemWidth, expectedItemWidth);

                    clearTestData();
                    $testContent.append($grid.parent());
                    var itemWidth = 237;
                    var expectedItemWidth = itemWidth + parseInt(this._gridItemTests.PADDING_PX_SIZE, 10) * 2;
                    this._gridItemTests.callPerItemWithPxWidthAndPxPadding(
                        $grid, gridLabel, itemWidth, expectedItemWidth
                    );

                    clearTestData();
                    $testContent.append($grid.parent());
                    var itemWidth = 237;
                    var expectedItemWidth = itemWidth + parseInt(this._gridItemTests.MARGIN_PX_SIZE, 10) * 2;
                    this._gridItemTests.callPerItemWithPxWidthAndPxMargin(
                        $grid, gridLabel, itemWidth, expectedItemWidth
                    );

                    clearTestData();
                    $testContent.append($grid.parent());
                    var itemWidth = 237;
                    var expectedItemWidth = itemWidth + parseInt(this._gridItemTests.BORDER_PX_SIZE, 10) * 2;
                    this._gridItemTests.callPerItemWithPxWidthAndPxBorder(
                        $grid, gridLabel, itemWidth, expectedItemWidth
                    );

                    clearTestData();
                    var $grid = this._grids.createGridWithPercentageWidthAndPercentagePadding(
                        gridWrapperPxWidth, gridPercentageWidth
                    );
                    $testContent.append($grid.parent());
                    var itemWidth = 33;
                    var gridPadding = parseFloat(this._grids.PADDING_PERCENTS_SIZE) * 2;
                    if(this._grids.isContentBoxBSGrid())
                        var gridPxPadding = gridWrapperPxWidth / 100 * gridPadding;
                    else if(this._grids.isBorderBoxBSGrid())
                        var gridPxPadding = 0;
                    var expectedItemWidth = (gridPxWidth + gridPxPadding) / 100 * itemWidth;
                    this._gridItemTests.callPerItemWithPercentageWidth(
                        $grid, gridLabel, itemWidth, expectedItemWidth
                    );

                    // @Notice -> test disabled.(When grid has px padding, and grid item has percentage paddings,
                    //                           Chrome calculates grid item paddings from raw parent width,
                    //                           FF calculates from raw parent width + paddings)
                    // clearTestData();
                    // var $grid = this._grids.createGridWithPercentageWidthAndPercentagePadding(
                    //     gridWrapperPxWidth, gridPercentageWidth
                    // );
                    // $testContent.append($grid.parent()); 
                    // var itemWidth = 30;
                    // var gridPadding = parseFloat(this._grids.PADDING_PERCENTS_SIZE) * 2;
                    // var gridPxPadding = gridWrapperPxWidth / 100 * gridPadding;
                    // var expectedItemWidth = (gridPxWidth + gridPxPadding) / 100 * itemWidth;
                    // var paddingWidth = gridPxWidth / 100 * (parseFloat(this._gridItemTests.PADDING_PERCENTS_SIZE) * 2);
                    // expectedItemWidth += paddingWidth;
                    // this._gridItemTests.callPerItemWithPercentageWidthAndPercentagePadding(
                    //     $grid, gridLabel, itemWidth, expectedItemWidth
                    // );

                    // @Notice -> test disabled.(When grid has % padding, and grid item has percentage margins,
                    //                           Chrome is calculating margins incorrectly(OK In FF))
                    // clearTestData();
                    // var $grid = this._grids.createGridWithPercentageWidthAndPercentagePadding(
                    //     gridWrapperPxWidth, gridPercentageWidth
                    // );
                    // $testContent.append($grid.parent());
                    // var itemWidth = 33;
                    // var gridPadding = parseFloat(this._grids.PADDING_PERCENTS_SIZE) * 2;
                    // var gridPxPadding = gridWrapperPxWidth / 100 * gridPadding;
                    // var expectedItemWidth = (gridPxWidth + gridPxPadding) / 100 * itemWidth;
                    // var marginWidth = (gridPxWidth + gridPxPadding) / 100 * (parseFloat(this._gridItemTests.MARGIN_PERCENTS_SIZE) * 2);
                    // expectedItemWidth += marginWidth;
                    // this._gridItemTests.callPerItemWithPercentageWidthAndPercentageMargin(
                    //     $grid, gridLabel, itemWidth, expectedItemWidth
                    // );

                    clearTestData();
                    var $grid = this._grids.createGridWithPercentageWidthAndPercentagePadding(
                        gridWrapperPxWidth, gridPercentageWidth
                    );
                    $testContent.append($grid.parent());
                    var itemWidth = 33;
                    var gridPadding = parseFloat(this._grids.PADDING_PERCENTS_SIZE) * 2;
                    if(this._grids.isContentBoxBSGrid())
                        var gridPxPadding = gridWrapperPxWidth / 100 * gridPadding;
                    else if(this._grids.isBorderBoxBSGrid())
                        var gridPxPadding = 0;
                    var expectedItemWidth = (gridPxWidth + gridPxPadding) / 100 * itemWidth;
                    var borderWidth = parseInt(this._gridItemTests.BORDER_PX_SIZE) * 2;
                    expectedItemWidth += borderWidth;
                    this._gridItemTests.callPerItemWithPercentageWidthAndPxBorder(
                        $grid, gridLabel, itemWidth, expectedItemWidth
                    );
                }
            }
        },

        withBorderBoxItems: function() {
            var gridWrapperPxWidths = [1071, 1333];

            for(var i = 0; i < gridWrapperPxWidths.length; i++) {
                var gridPercentageWidths = [33, 50];

                for(var j = 0; j < gridPercentageWidths.length; j++) {
                    var gridWrapperPxWidth = gridWrapperPxWidths[i];
                    var gridPercentageWidth = gridPercentageWidths[j];
                    var gridPxWidth = gridWrapperPxWidth / 100 * gridPercentageWidth;

                    var $grid = this._grids.createGridWithPercentageWidthAndPercentagePadding(
                        gridWrapperPxWidth, gridPercentageWidth
                    );
                    var gridLabel = gridPercentageWidth + "%; Grid Wrapper width = " + gridWrapperPxWidth;
                    gridLabel += "; Padding: " + this._grids.PADDING_PERCENTS_SIZE;

                    this._gridItemTests.setBoxSizing(this._gridItemTests.BOX_SIZINGS.BORDER_BOX);

                    clearTestData();
                    $testContent.append($grid.parent());
                    var itemWidth = 220;
                    var expectedItemWidth = itemWidth;
                    this._gridItemTests.callPerItemWithPxWidth($grid, gridLabel, itemWidth, expectedItemWidth);

                    clearTestData();
                    var $grid = this._grids.createGridWithPercentageWidth(
                        gridWrapperPxWidth, gridPercentageWidth
                    );
                    $testContent.append($grid.parent());
                    var itemWidth = 237;
                    var expectedItemWidth = itemWidth;
                    this._gridItemTests.callPerItemWithPxWidthAndPxPadding(
                        $grid, gridLabel, itemWidth, expectedItemWidth
                    );

                    clearTestData();
                    $testContent.append($grid.parent());
                    var itemWidth = 237;
                    var expectedItemWidth = itemWidth + parseInt(this._gridItemTests.MARGIN_PX_SIZE, 10) * 2;
                    this._gridItemTests.callPerItemWithPxWidthAndPxMargin(
                        $grid, gridLabel, itemWidth, expectedItemWidth
                    );

                    clearTestData();
                    var $grid = this._grids.createGridWithPercentageWidthAndPercentagePadding(
                        gridWrapperPxWidth, gridPercentageWidth
                    );
                    $testContent.append($grid.parent());
                    var itemWidth = 237;
                    var expectedItemWidth = itemWidth;
                    this._gridItemTests.callPerItemWithPxWidthAndPxBorder(
                        $grid, gridLabel, itemWidth, expectedItemWidth
                    );

                    clearTestData();
                    var $grid = this._grids.createGridWithPercentageWidthAndPercentagePadding(
                        gridWrapperPxWidth, gridPercentageWidth
                    );
                    $testContent.append($grid.parent());
                    var itemWidth = 33;
                    var gridPadding = parseFloat(this._grids.PADDING_PERCENTS_SIZE) * 2;
                    if(this._grids.isContentBoxBSGrid())
                        var gridPxPadding = gridWrapperPxWidth / 100 * gridPadding;
                    else if(this._grids.isBorderBoxBSGrid())
                        var gridPxPadding = 0;
                    var expectedItemWidth = (gridPxWidth + gridPxPadding) / 100 * itemWidth;
                    this._gridItemTests.callPerItemWithPercentageWidth(
                        $grid, gridLabel, itemWidth, expectedItemWidth
                    );

                    // @Notice -> test disabled. (When grid has % padding set and grid item has % padding,
                    //                            IE11 returns incorrect calculated width per grid item)
                    // clearTestData();
                    // var $grid = this._grids.createGridWithPercentageWidthAndPercentagePadding(
                    //     gridWrapperPxWidth, gridPercentageWidth
                    // );
                    // $testContent.append($grid.parent());
                    // var itemWidth = 30;
                    // var gridPadding = parseFloat(this._grids.PADDING_PERCENTS_SIZE) * 2;
                    // var gridPxPadding = gridWrapperPxWidth / 100 * gridPadding;
                    // var expectedItemWidth = (gridPxWidth + gridPxPadding) / 100 * itemWidth;
                    // this._gridItemTests.callPerItemWithPercentageWidthAndPercentagePadding(
                    //     $grid, gridLabel, itemWidth, expectedItemWidth
                    // );

                    // @Notice -> test disabled. (When grid has % padding and grid item has % margin,
                    //                            Chrome returns incorrect calculated margins per item)
                    // clearTestData();
                    // var $grid = this._grids.createGridWithPercentageWidthAndPercentagePadding(
                    //     gridWrapperPxWidth, gridPercentageWidth
                    // );
                    // $testContent.append($grid.parent());
                    // var itemWidth = 33;
                    // var gridPadding = parseFloat(this._grids.PADDING_PERCENTS_SIZE) * 2;
                    // var gridPxPadding = gridWrapperPxWidth / 100 * gridPadding;
                    // var expectedItemWidth = (gridPxWidth + gridPxPadding) / 100 * itemWidth;
                    // var marginWidth = (gridPxWidth + gridPxPadding) / 100 * (parseFloat(this._gridItemTests.MARGIN_PERCENTS_SIZE) * 2);
                    // expectedItemWidth += marginWidth;
                    // this._gridItemTests.callPerItemWithPercentageWidthAndPercentageMargin(
                    //     $grid, gridLabel, itemWidth, expectedItemWidth
                    // );

                    clearTestData();
                    var $grid = this._grids.createGridWithPercentageWidthAndPercentagePadding(
                        gridWrapperPxWidth, gridPercentageWidth
                    );
                    $testContent.append($grid.parent());
                    var itemWidth = 33;
                    var gridPadding = parseFloat(this._grids.PADDING_PERCENTS_SIZE) * 2;
                    if(this._grids.isContentBoxBSGrid())
                        var gridPxPadding = gridWrapperPxWidth / 100 * gridPadding;
                    else if(this._grids.isBorderBoxBSGrid())
                        var gridPxPadding = 0;
                    var expectedItemWidth = (gridPxWidth + gridPxPadding) / 100 * itemWidth;
                    this._gridItemTests.callPerItemWithPercentageWidthAndPxBorder(
                        $grid, gridLabel, itemWidth, expectedItemWidth
                    );
                }
            }
        }
    }
});