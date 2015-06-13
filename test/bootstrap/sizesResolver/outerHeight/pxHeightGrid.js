$(document).ready(function() {
    window.outerHeightTesterPxHeightGrid = {
        testCallOnPxHeightGridPerAllContentBoxItems: function() {
            var gridHeights = [17, 261, 300, 550, 773];

            for(var i = 0; i < gridHeights.length; i++) {
                var gridWidth = parseInt(this._grids.GRID_WIDTH, 10);
                var gridHeight = gridHeights[i];
                var $grid = this._grids.createGridWithPxHeight(gridHeight);

                this._gridItemTests.setBoxSizing(this._gridItemTests.BOX_SIZINGS.CONTENT_BOX);

                clearTestData();
                $testContent.append($grid);
                this._gridItemTests.callPerItemWithPxHeight($grid, gridHeight + "px", 237, 237);

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 237;
                var expectedItemHeight = itemHeight + parseInt(this._gridItemTests.PADDING_PX_SIZE, 10) * 2;
                this._gridItemTests.callPerItemWithPxHeightAndPxPadding(
                    $grid, gridHeight + "px", itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 237;
                var expectedItemHeight = itemHeight + parseInt(this._gridItemTests.MARGIN_PX_SIZE, 10) * 2;
                this._gridItemTests.callPerItemWithPxHeightAndPxMargin(
                    $grid, gridHeight + "px", itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 237;
                var expectedItemHeight = itemHeight + parseInt(this._gridItemTests.BORDER_PX_SIZE, 10) * 2;
                this._gridItemTests.callPerItemWithPxHeightAndPxBorder(
                    $grid, gridHeight + "px", itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 30;
                var expectedItemHeight = gridHeight / 100 * itemHeight;
                this._gridItemTests.callPerItemWithPercentageHeight(
                    $grid, gridHeight + "px", itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 30;
                var expectedItemHeight = gridHeight / 100 * itemHeight;
                var paddingHeight = gridWidth / 100 * (parseFloat(this._gridItemTests.PADDING_PERCENTS_SIZE) * 2);
                expectedItemHeight += paddingHeight;
                this._gridItemTests.callPerItemWithPercentageHeightAndPercentagePadding(
                    $grid, gridHeight + "px", itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 33;
                var expectedItemHeight = gridHeight / 100 * itemHeight;
                var marginHeight = gridWidth / 100 * (parseFloat(this._gridItemTests.MARGIN_PERCENTS_SIZE) * 2);
                expectedItemHeight += marginHeight;
                this._gridItemTests.callPerItemWithPercentageHeightAndPercentageMargin(
                    $grid, gridHeight + "px", itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 33;
                var expectedItemHeight = gridHeight / 100 * itemHeight;
                var borderHeight = parseInt(this._gridItemTests.BORDER_PX_SIZE) * 2;
                expectedItemHeight += borderHeight;
                this._gridItemTests.callPerItemWithPercentageHeightAndPxBorder(
                    $grid, gridHeight + "px", itemHeight, expectedItemHeight
                );
            }
        },

        testCallOnPxHeightGridPerAllBorderBoxItems: function() {
            var gridHeights = [67, 261, 300, 550, 773];

            for(var i = 0; i < gridHeights.length; i++) {
                var gridWidth = parseInt(this._grids.GRID_WIDTH, 10);
                var gridHeight = gridHeights[i];
                var $grid = this._grids.createGridWithPxHeight(gridHeight);

                this._gridItemTests.setBoxSizing(this._gridItemTests.BOX_SIZINGS.BORDER_BOX);

                clearTestData();
                $testContent.append($grid);
                this._gridItemTests.callPerItemWithPxHeight($grid, gridHeight + "px", 237, 237);

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 237;
                var expectedItemHeight = itemHeight;
                this._gridItemTests.callPerItemWithPxHeightAndPxPadding(
                    $grid, gridHeight + "px", itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 237;
                var expectedItemHeight = itemHeight + parseInt(this._gridItemTests.MARGIN_PX_SIZE, 10) * 2;
                this._gridItemTests.callPerItemWithPxHeightAndPxMargin(
                    $grid, gridHeight + "px", itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 237;
                var expectedItemHeight = itemHeight;
                this._gridItemTests.callPerItemWithPxHeightAndPxBorder(
                    $grid, gridHeight + "px", itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 30;
                var expectedItemHeight = gridHeight / 100 * itemHeight;
                this._gridItemTests.callPerItemWithPercentageHeight(
                    $grid, gridHeight + "px", itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 15;
                var expectedItemHeight = gridHeight / 100 * itemHeight;
                var $item = this._gridItemTests._createItem(itemHeight + "%");
                $item.css({"padding": this._gridItemTests.PADDING_PERCENTS_SIZE, "box-sizing": "border-box"});
                $grid.append($item);
                this._gridItemTests.callPerItemWithPercentageHeightAndPercentagePadding(
                    $grid, gridHeight + "px", itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 33;
                var expectedItemHeight = gridHeight / 100 * itemHeight;
                var marginHeight = gridWidth / 100 * (parseFloat(this._gridItemTests.MARGIN_PERCENTS_SIZE) * 2);
                expectedItemHeight += marginHeight;
                this._gridItemTests.callPerItemWithPercentageHeightAndPercentageMargin(
                    $grid, gridHeight + "px", itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 50;
                var expectedItemHeight = gridHeight / 100 * itemHeight;
                this._gridItemTests.callPerItemWithPercentageHeightAndPxBorder(
                    $grid, gridHeight + "px", itemHeight, expectedItemHeight
                );
            }
        }
    }
});