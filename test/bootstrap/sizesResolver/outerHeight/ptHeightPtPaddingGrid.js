$(document).ready(function() {
    window.ohPtHeightPtPaddingGrid = {
        withContentBoxItems: function() {
            var gridWrapperPxHeights = [1071, 1333];

            for(var i = 0; i < gridWrapperPxHeights.length; i++) {
                var gridPercentageHeights = [33, 50];

                for(var j = 0; j < gridPercentageHeights.length; j++) {
                    var gridPxWidth = parseInt(this._grids.GRID_WIDTH, 10);
                    var gridWrapperPxWidth = parseInt(this._grids.GRID_WRAPPER_WIDTH, 10);
                    var gridWrapperPxHeight = gridWrapperPxHeights[i];
                    var gridPercentageHeight = gridPercentageHeights[j];
                    var gridPxHeight = gridWrapperPxHeight / 100 * gridPercentageHeight;

                    var $grid = this._grids.createGridWithPercentageHeightAndPercentagePadding(
                        gridWrapperPxHeight, gridPercentageHeight
                    );
                    var gridLabel = gridPercentageHeight + "%; Grid wrapper height = " + gridWrapperPxHeight;
                    gridLabel += "; Padding: " + this._grids.PADDING_PERCENTS_SIZE;

                    this._gridItemTests.setBoxSizing(this._gridItemTests.BOX_SIZINGS.CONTENT_BOX);

                    clearTestData();
                    $testContent.append($grid.parent());
                    var itemHeight = 220;
                    var expectedItemHeight = itemHeight;
                    this._gridItemTests.callPerItemWithPxHeight($grid, gridLabel, itemHeight, expectedItemHeight);

                    clearTestData();
                    $testContent.append($grid.parent());
                    var itemHeight = 237;
                    var expectedItemHeight = itemHeight + parseInt(this._gridItemTests.PADDING_PX_SIZE, 10) * 2;
                    this._gridItemTests.callPerItemWithPxHeightAndPxPadding(
                        $grid, gridLabel, itemHeight, expectedItemHeight
                    );

                    clearTestData();
                    $testContent.append($grid.parent());
                    var itemHeight = 237;
                    var expectedItemHeight = itemHeight + parseInt(this._gridItemTests.MARGIN_PX_SIZE, 10) * 2;
                    this._gridItemTests.callPerItemWithPxHeightAndPxMargin(
                        $grid, gridLabel, itemHeight, expectedItemHeight
                    );

                    clearTestData();
                    $testContent.append($grid.parent());
                    var itemHeight = 237;
                    var expectedItemHeight = itemHeight + parseInt(this._gridItemTests.BORDER_PX_SIZE, 10) * 2;
                    this._gridItemTests.callPerItemWithPxHeightAndPxBorder(
                        $grid, gridLabel, itemHeight, expectedItemHeight
                    );

                    clearTestData();
                    var $grid = this._grids.createGridWithPercentageHeightAndPercentagePadding(
                        gridWrapperPxHeight, gridPercentageHeight
                    );
                    $testContent.append($grid.parent());
                    var itemHeight = 33;
                    var gridPadding = parseFloat(this._grids.PADDING_PERCENTS_SIZE) * 2;
                    if(this._grids.isContentBoxBSGrid())
                        var gridPxPadding = gridWrapperPxWidth / 100 * gridPadding;
                    else if(this._grids.isBorderBoxBSGrid())
                        var gridPxPadding = 0;
                    var expectedItemHeight = (gridPxHeight + gridPxPadding) / 100 * itemHeight;
                    this._gridItemTests.callPerItemWithPercentageHeight(
                        $grid, gridLabel, itemHeight, expectedItemHeight
                    );

                    // @Notice -> test disabled.(When grid has % padding, and grid item also has pt paddings,
                    //                           Chrome calculates grid item paddings from raw parent height,
                    //                           FF calculates from raw parent height + paddings)
                    // clearTestData();
                    // var $grid = this._grids.createGridWithPercentageHeightAndPercentagePadding(
                    //     gridWrapperPxHeight, gridPercentageHeight
                    // );
                    // $testContent.append($grid.parent());
                    // var itemHeight = 30;
                    // var gridPadding = parseFloat(this._grids.PADDING_PERCENTS_SIZE) * 2;
                    // var gridPxPadding = gridWrapperPxHeight / 100 * gridPadding;
                    // var expectedItemHeight = (gridPxHeight + gridPxPadding) / 100 * itemHeight;
                    // var paddingHeight = gridPxHeight / 100 * (parseFloat(this._gridItemTests.PADDING_PERCENTS_SIZE) * 2);
                    // expectedItemHeight += paddingHeight;
                    // this._gridItemTests.callPerItemWithPercentageHeightAndPercentagePadding(
                    //     $grid, gridLabel, itemHeight, expectedItemHeight
                    // );

                    // @Notice -> test disabled.(When grid has % padding, and grid item has pt margins,
                    //                           Chrome is calculating margins incorrectly(OK In FF))
                    // clearTestData();
                    // var $grid = this._grids.createGridWithPercentageHeightAndPercentagePadding(
                    //     gridWrapperPxHeight, gridPercentageHeight
                    // );
                    // $testContent.append($grid.parent());
                    // var itemHeight = 33;
                    // var gridPadding = parseFloat(this._grids.PADDING_PERCENTS_SIZE) * 2;
                    // var gridPxPadding = gridWrapperPxHeight / 100 * gridPadding;
                    // var expectedItemHeight = (gridPxHeight + gridPxPadding) / 100 * itemHeight;
                    // var marginSize = parseFloat(this._gridItemTests.MARGIN_PERCENTS_SIZE) * 2;
                    // var marginHeight = (gridPxHeight + gridPxPadding) / 100 * expectedItemHeight;
                    // expectedItemHeight += marginHeight;
                    // this._gridItemTests.callPerItemWithPercentageHeightAndPercentageMargin(
                    //     $grid, gridLabel, itemHeight, expectedItemHeight
                    // );

                    clearTestData();
                    var $grid = this._grids.createGridWithPercentageHeightAndPercentagePadding(
                        gridWrapperPxHeight, gridPercentageHeight
                    );
                    $testContent.append($grid.parent());
                    var itemHeight = 33;
                    var gridPadding = parseFloat(this._grids.PADDING_PERCENTS_SIZE) * 2;
                    if(this._grids.isContentBoxBSGrid())
                        var gridPxPadding = gridWrapperPxWidth / 100 * gridPadding;
                    else if(this._grids.isBorderBoxBSGrid())
                        var gridPxPadding = 0;
                    var expectedItemHeight = (gridPxHeight + gridPxPadding) / 100 * itemHeight;
                    var borderHeight = parseInt(this._gridItemTests.BORDER_PX_SIZE) * 2;
                    expectedItemHeight += borderHeight;
                    this._gridItemTests.callPerItemWithPercentageHeightAndPxBorder(
                        $grid, gridLabel, itemHeight, expectedItemHeight
                    );
                }
            }
        },

        withBorderBoxItems: function() {
            var gridWrapperPxHeights = [1071, 1333];

            for(var i = 0; i < gridWrapperPxHeights.length; i++) {
                var gridPercentageHeights = [33, 50];

                for(var j = 0; j < gridPercentageHeights.length; j++) {
                    var gridPxWidth = parseInt(this._grids.GRID_WIDTH, 10);
                    var gridWrapperPxWidth = parseInt(this._grids.GRID_WRAPPER_WIDTH, 10);
                    var gridWrapperPxHeight = gridWrapperPxHeights[i];
                    var gridPercentageHeight = gridPercentageHeights[j];
                    var gridPxHeight = gridWrapperPxHeight / 100 * gridPercentageHeight;

                    var $grid = this._grids.createGridWithPercentageHeightAndPercentagePadding(
                        gridWrapperPxHeight, gridPercentageHeight
                    );
                    var gridLabel = gridPercentageHeight + "%; Grid wrapper height = " + gridWrapperPxHeight;
                    gridLabel += "; Padding: " + this._grids.PADDING_PERCENTS_SIZE;

                    this._gridItemTests.setBoxSizing(this._gridItemTests.BOX_SIZINGS.BORDER_BOX);

                    clearTestData();
                    $testContent.append($grid.parent());
                    var itemHeight = 220;
                    var expectedItemHeight = itemHeight;
                    this._gridItemTests.callPerItemWithPxHeight($grid, gridLabel, itemHeight, expectedItemHeight);

                    clearTestData();
                    var $grid = this._grids.createGridWithPercentageHeightAndPercentagePadding(
                        gridWrapperPxHeight, gridPercentageHeight
                    );
                    $testContent.append($grid.parent());
                    var itemHeight = 237;
                    var expectedItemHeight = itemHeight;
                    this._gridItemTests.callPerItemWithPxHeightAndPxPadding(
                        $grid, gridLabel, itemHeight, expectedItemHeight
                    );

                    clearTestData();
                    $testContent.append($grid.parent());
                    var itemHeight = 237;
                    var expectedItemHeight = itemHeight + parseInt(this._gridItemTests.MARGIN_PX_SIZE, 10) * 2;
                    this._gridItemTests.callPerItemWithPxHeightAndPxMargin(
                        $grid, gridLabel, itemHeight, expectedItemHeight
                    );

                    clearTestData();
                    var $grid = this._grids.createGridWithPercentageHeightAndPercentagePadding(
                        gridWrapperPxHeight, gridPercentageHeight
                    );
                    $testContent.append($grid.parent());
                    var itemHeight = 237;
                    var expectedItemHeight = itemHeight;
                    this._gridItemTests.callPerItemWithPxHeightAndPxBorder(
                        $grid, gridLabel, itemHeight, expectedItemHeight
                    );

                    clearTestData();
                    var $grid = this._grids.createGridWithPercentageHeightAndPercentagePadding(
                        gridWrapperPxHeight, gridPercentageHeight
                    );
                    $testContent.append($grid.parent());
                    var itemHeight = 33;
                    var gridPadding = parseFloat(this._grids.PADDING_PERCENTS_SIZE) * 2;
                    if(this._grids.isContentBoxBSGrid())
                        var gridPxPadding = gridWrapperPxWidth / 100 * gridPadding;
                    else if(this._grids.isBorderBoxBSGrid())
                        var gridPxPadding = 0;
                    var expectedItemHeight = (gridPxHeight + gridPxPadding) / 100 * itemHeight;
                    this._gridItemTests.callPerItemWithPercentageHeight(
                        $grid, gridLabel, itemHeight, expectedItemHeight
                    );

                    // @Notice -> test disabled. (When grid has % padding set and grid item has % paddings,
                    //                            IE11 returns incorrect calculated width per grid item)
                    // clearTestData();
                    // var $grid = this._grids.createGridWithPercentageHeightAndPercentagePadding(
                    //     gridWrapperPxHeight, gridPercentageHeight
                    // );
                    // $testContent.append($grid.parent());
                    // var itemHeight = 30;
                    // var gridPadding = parseFloat(this._grids.PADDINGS_PERCENT_SIZE) * 2;
                    // var gridPxPadding = gridWrapperPxHeight / 100 * gridPadding;
                    // var expectedItemHeight = (gridPxHeight + gridPxPadding) / 100 * itemHeight;
                    // this._gridItemTests.callPerItemWithPercentageHeightAndPercentagePadding(
                    //     $grid, gridLabel, itemHeight, expectedItemHeight
                    // );

                    // @Notice -> test disabled. (When grid has % padding and grid item has % margin,
                    //                            Chrome returns incorrect calculated margins per item)
                    // clearTestData();
                    // var $grid = this._grids.createGridWithPercentageHeightAndPercentagePadding(
                    //     gridWrapperPxHeight, gridPercentageHeight
                    // );
                    // $testContent.append($grid.parent());
                    // var itemHeight = 33;
                    // var gridPadding = parseFloat(this._grids.PADDING_PERCENTS_SIZE) * 2;
                    // var gridPxPadding = gridWrapperPxHeight / 100 * gridPadding;
                    // var expectedItemHeight = (gridPxHeight + gridPxPadding) / 100 * itemHeight;
                    // var marginSize = parseFloat(this._gridItemTests.MARGIN_PERCENTS_SIZE) * 2;
                    // var marginHeight = (gridPxHeight + gridPxPadding) / 100 * marginSize;
                    // expectedItemHeight += marginHeight;
                    // this._gridItemTests.callPerItemWithPercentageHeightAndPercentageMargin(
                    //     $grid, gridLabel, itemHeight, expectedItemHeight
                    // );

                    clearTestData();
                    var $grid = this._grids.createGridWithPercentageHeightAndPercentagePadding(
                        gridWrapperPxHeight, gridPercentageHeight
                    );
                    $testContent.append($grid.parent());
                    var itemHeight = 33;
                    var gridPadding = parseFloat(this._grids.PADDING_PERCENTS_SIZE) * 2;
                    if(this._grids.isContentBoxBSGrid())
                        var gridPxPadding = gridWrapperPxWidth / 100 * gridPadding;
                    else if(this._grids.isBorderBoxBSGrid())
                        var gridPxPadding = 0;
                    var expectedItemHeight = (gridPxHeight + gridPxPadding) / 100 * itemHeight;
                    this._gridItemTests.callPerItemWithPercentageHeightAndPxBorder(
                        $grid, gridLabel, itemHeight, expectedItemHeight
                    );
                }
            }
        }
    }
});