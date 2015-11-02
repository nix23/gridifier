$(document).ready(function() {
    window.ohPtHeightGrid = {
        withContentBoxItems: function() {
            var gridWrapperPxHeights = [1071, 1333];

            for(var i = 0; i < gridWrapperPxHeights.length; i++) {
                var gridPercentageHeights = [33, 50];

                for(var j = 0; j < gridPercentageHeights.length; j++) {
                    var gridPxWidth = parseInt(this._grids.GRID_WIDTH, 10);
                    var gridWrapperPxHeight = gridWrapperPxHeights[i];
                    var gridPercentageHeight = gridPercentageHeights[j];
                    var gridPxHeight = gridWrapperPxHeight / 100 * gridPercentageHeight;

                    var $grid = this._grids.createGridWithPercentageHeight(
                        gridWrapperPxHeight, gridPercentageHeight
                    );
                    var gridLabel = gridPercentageHeight + "%; Grid wrapper height = " + gridWrapperPxHeight;

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
                    var $grid = this._grids.createGridWithPercentageHeight(
                        gridWrapperPxHeight, gridPercentageHeight
                    );
                    $testContent.append($grid.parent());
                    var itemHeight = 33;
                    var expectedItemHeight = gridPxHeight / 100 * itemHeight;
                    this._gridItemTests.callPerItemWithPercentageHeight(
                        $grid, gridLabel, itemHeight, expectedItemHeight
                    );

                    clearTestData();
                    var $grid = this._grids.createGridWithPercentageHeight(
                        gridWrapperPxHeight, gridPercentageHeight
                    );
                    $testContent.append($grid.parent());
                    var itemHeight = 30;
                    var expectedItemHeight = gridPxHeight / 100 * itemHeight;
                    var paddingHeight = gridPxWidth / 100 * (parseFloat(this._gridItemTests.PADDING_PERCENTS_SIZE) * 2);
                    expectedItemHeight += paddingHeight;
                    this._gridItemTests.callPerItemWithPercentageHeightAndPercentagePadding(
                        $grid, gridLabel, itemHeight, expectedItemHeight
                    );

                    clearTestData();
                    var $grid = this._grids.createGridWithPercentageHeight(
                        gridWrapperPxHeight, gridPercentageHeight
                    );
                    $testContent.append($grid.parent());
                    var itemHeight = 33;
                    var expectedItemHeight = gridPxHeight / 100 * itemHeight;
                    var marginHeight = gridPxWidth / 100 * (parseFloat(this._gridItemTests.MARGIN_PERCENTS_SIZE) * 2);
                    expectedItemHeight += marginHeight;
                    this._gridItemTests.callPerItemWithPercentageHeightAndPercentageMargin(
                        $grid, gridLabel, itemHeight, expectedItemHeight
                    );

                    clearTestData();
                    var $grid = this._grids.createGridWithPercentageHeight(
                        gridWrapperPxHeight, gridPercentageHeight
                    );
                    $testContent.append($grid.parent());
                    var itemHeight = 33;
                    var expectedItemHeight = gridPxHeight / 100 * itemHeight;
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
                    var gridWrapperPxHeight = gridWrapperPxHeights[i];
                    var gridPercentageHeight = gridPercentageHeights[j];
                    var gridPxHeight = gridWrapperPxHeight / 100 * gridPercentageHeight;

                    var $grid = this._grids.createGridWithPercentageHeight(
                        gridWrapperPxHeight, gridPercentageHeight
                    );
                    var gridLabel = gridPercentageHeight + "%; Grid wrapper height = " + gridWrapperPxHeight;

                    this._gridItemTests.setBoxSizing(this._gridItemTests.BOX_SIZINGS.BORDER_BOX);

                    clearTestData();
                    $testContent.append($grid.parent());
                    var itemHeight = 220;
                    var expectedItemHeight = itemHeight;
                    this._gridItemTests.callPerItemWithPxHeight($grid, gridLabel, itemHeight, expectedItemHeight);

                    clearTestData();
                    var $grid = this._grids.createGridWithPercentageHeight(
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
                    var $grid = this._grids.createGridWithPercentageHeight(
                        gridWrapperPxHeight, gridPercentageHeight
                    );
                    $testContent.append($grid.parent());
                    var itemHeight = 237;
                    var expectedItemHeight = itemHeight;
                    this._gridItemTests.callPerItemWithPxHeightAndPxBorder(
                        $grid, gridLabel, itemHeight, expectedItemHeight
                    );

                    clearTestData();
                    var $grid = this._grids.createGridWithPercentageHeight(
                        gridWrapperPxHeight, gridPercentageHeight
                    );
                    $testContent.append($grid.parent());
                    var itemHeight = 33;
                    var expectedItemHeight = gridPxHeight / 100 * itemHeight;
                    this._gridItemTests.callPerItemWithPercentageHeight(
                        $grid, gridLabel, itemHeight, expectedItemHeight
                    );

                    clearTestData();
                    var $grid = this._grids.createGridWithPercentageHeight(
                        gridWrapperPxHeight, gridPercentageHeight
                    );
                    $testContent.append($grid.parent());
                    var itemHeight = 30;
                    var expectedItemHeight = gridPxHeight / 100 * itemHeight;
                    this._gridItemTests.callPerItemWithPercentageHeightAndPercentagePadding(
                        $grid, gridLabel, itemHeight, expectedItemHeight
                    );

                    clearTestData();
                    var $grid = this._grids.createGridWithPercentageHeight(
                        gridWrapperPxHeight, gridPercentageHeight
                    );
                    $testContent.append($grid.parent());
                    var itemHeight = 33;
                    var expectedItemHeight = gridPxHeight / 100 * itemHeight;
                    var marginHeight = gridPxWidth / 100 * (parseFloat(this._gridItemTests.MARGIN_PERCENTS_SIZE) * 2);
                    expectedItemHeight += marginHeight;
                    this._gridItemTests.callPerItemWithPercentageHeightAndPercentageMargin(
                        $grid, gridLabel, itemHeight, expectedItemHeight
                    );

                    clearTestData();
                    var $grid = this._grids.createGridWithPercentageHeight(
                        gridWrapperPxHeight, gridPercentageHeight
                    );
                    $testContent.append($grid.parent());
                    var itemHeight = 33;
                    var expectedItemHeight = gridPxHeight / 100 * itemHeight;
                    this._gridItemTests.callPerItemWithPercentageHeightAndPxBorder(
                        $grid, gridLabel, itemHeight, expectedItemHeight
                    );
                }
            }
        }
    }
});