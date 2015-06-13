$(document).ready(function() {
    window.outerHeightTesterPxHeightPxMarginGrid = {
        testCallOnPxHeightPxMarginGridPerAllContentBoxItems: function() {
            var gridHeights = [17, 261, 300, 550, 773];

            for(var i = 0; i < gridHeights.length; i++) {
                var gridWidth = parseInt(this._grids.GRID_WIDTH, 10);
                var gridHeight = gridHeights[i];
                var $grid = this._grids.createGridWithPxHeightAndPxMargin(gridHeight);
                var gridVerticalMarginLabel = this._grids.MARGIN_PX_SIZE;
                var gridLabel = gridHeight + "px; margin = " + gridVerticalMarginLabel;

                this._gridItemTests.setBoxSizing(this._gridItemTests.BOX_SIZINGS.CONTENT_BOX);

                clearTestData();
                $testContent.append($grid);
                this._gridItemTests.callPerItemWithPxHeight($grid, gridLabel, 237, 237);

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 237;
                var expectedItemHeight = itemHeight + parseInt(this._gridItemTests.PADDING_PX_SIZE, 10) * 2;
                this._gridItemTests.callPerItemWithPxHeightAndPxPadding(
                    $grid, gridLabel, itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 237;
                var expectedItemHeight = itemHeight + parseInt(this._gridItemTests.MARGIN_PX_SIZE, 10) * 2;
                this._gridItemTests.callPerItemWithPxHeightAndPxMargin(
                    $grid, gridLabel, itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 237;
                var expectedItemHeight = itemHeight + parseInt(this._gridItemTests.BORDER_PX_SIZE, 10) * 2;
                this._gridItemTests.callPerItemWithPxHeightAndPxBorder(
                    $grid, gridLabel, itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 30;
                var expectedItemHeight = gridHeight / 100 * itemHeight;
                this._gridItemTests.callPerItemWithPercentageHeight(
                    $grid, gridLabel, itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 30;
                var expectedItemHeight = gridHeight / 100 * itemHeight;
                var paddingHeight = gridWidth / 100 * (parseFloat(this._gridItemTests.PADDING_PERCENTS_SIZE) * 2);
                expectedItemHeight += paddingHeight;
                this._gridItemTests.callPerItemWithPercentageHeightAndPercentagePadding(
                    $grid, gridLabel, itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 33;
                var expectedItemHeight = gridHeight / 100 * itemHeight;
                var marginHeight = gridWidth / 100 * (parseFloat(this._gridItemTests.MARGIN_PERCENTS_SIZE) * 2);
                expectedItemHeight += marginHeight;
                this._gridItemTests.callPerItemWithPercentageHeightAndPercentageMargin(
                    $grid, gridLabel, itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 33;
                var expectedItemHeight = gridHeight / 100 * itemHeight;
                var borderHeight = parseInt(this._gridItemTests.BORDER_PX_SIZE) * 2;
                expectedItemHeight += borderHeight;
                this._gridItemTests.callPerItemWithPercentageHeightAndPxBorder(
                    $grid, gridLabel, itemHeight, expectedItemHeight
                );
            }
        },

        testCallOnPxHeightPxMarginGridPerAllBorderBoxItems: function() {
            var gridHeights = [67, 261, 300, 550, 773];

            for(var i = 0; i < gridHeights.length; i++) {
                var gridWidth = parseInt(this._grids.GRID_WIDTH, 10);
                var gridHeight = gridHeights[i];
                var $grid = this._grids.createGridWithPxHeightAndPxMargin(gridHeight);
                var gridVerticalMarginLabel = this._grids.MARGIN_PX_SIZE;
                var gridLabel = gridHeight + "px; margin = " + gridVerticalMarginLabel;

                this._gridItemTests.setBoxSizing(this._gridItemTests.BOX_SIZINGS.BORDER_BOX);

                clearTestData();
                $testContent.append($grid);
                this._gridItemTests.callPerItemWithPxHeight($grid, gridLabel, 237, 237);

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 237;
                var expectedItemHeight = itemHeight;
                this._gridItemTests.callPerItemWithPxHeightAndPxPadding(
                    $grid, gridLabel, itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 237;
                var expectedItemHeight = itemHeight + parseInt(this._gridItemTests.MARGIN_PX_SIZE, 10) * 2;
                this._gridItemTests.callPerItemWithPxHeightAndPxMargin(
                    $grid, gridLabel, itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 237;
                var expectedItemHeight = itemHeight;
                this._gridItemTests.callPerItemWithPxHeightAndPxBorder(
                    $grid, gridLabel, itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 30;
                var expectedItemHeight = gridHeight / 100 * itemHeight;
                this._gridItemTests.callPerItemWithPercentageHeight(
                    $grid, gridLabel, itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 30;
                var expectedItemHeight = gridHeight / 100 * itemHeight;
                this._gridItemTests.callPerItemWithPercentageHeightAndPercentagePadding(
                    $grid, gridLabel, itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 33;
                var expectedItemHeight = gridHeight / 100 * itemHeight;
                var marginHeight = gridWidth / 100 * (parseFloat(this._gridItemTests.MARGIN_PERCENTS_SIZE) * 2);
                expectedItemHeight += marginHeight;
                this._gridItemTests.callPerItemWithPercentageHeightAndPercentageMargin(
                    $grid, gridLabel, itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 50;
                var expectedItemHeight = gridHeight / 100 * itemHeight;
                this._gridItemTests.callPerItemWithPercentageHeightAndPxBorder(
                    $grid, gridLabel, itemHeight, expectedItemHeight
                );
            }
        }
    }
});