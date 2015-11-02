$(document).ready(function() {
    window.owPxWidthGrid = {
        withContentBoxItems: function() {
            var gridWidths = [17, 261, 300, 550, 773];

            for(var i = 0; i < gridWidths.length; i++) {
                var gridWidth = gridWidths[i];
                var $grid = this._grids.createGridWithPxWidth(gridWidth);

                this._gridItemTests.setBoxSizing(this._gridItemTests.BOX_SIZINGS.CONTENT_BOX);
                clearTestData();
                $testContent.append($grid);
                this._gridItemTests.callPerItemWithPxWidth($grid, gridWidth + "px", 237, 237);

                clearTestData();
                $testContent.append($grid);
                var itemWidth = 237;
                var expectedItemWidth = itemWidth + parseInt(this._gridItemTests.PADDING_PX_SIZE, 10) * 2;
                this._gridItemTests.callPerItemWithPxWidthAndPxPadding(
                    $grid, gridWidth + "px", itemWidth, expectedItemWidth
                );

                clearTestData();
                $testContent.append($grid);
                var itemWidth = 237;
                var expectedItemWidth = itemWidth + parseInt(this._gridItemTests.MARGIN_PX_SIZE, 10) * 2;
                this._gridItemTests.callPerItemWithPxWidthAndPxMargin(
                    $grid, gridWidth + "px", itemWidth, expectedItemWidth
                );

                clearTestData();
                $testContent.append($grid);
                var itemWidth = 237;
                var expectedItemWidth = itemWidth + parseInt(this._gridItemTests.BORDER_PX_SIZE, 10) * 2;
                this._gridItemTests.callPerItemWithPxWidthAndPxBorder(
                    $grid, gridWidth + "px", itemWidth, expectedItemWidth
                );

                clearTestData();
                $testContent.append($grid);
                var itemWidth = 30;
                var expectedItemWidth = gridWidth / 100 * itemWidth;
                this._gridItemTests.callPerItemWithPercentageWidth(
                    $grid, gridWidth + "px", itemWidth, expectedItemWidth
                );

                clearTestData();
                $testContent.append($grid);
                var itemWidth = 30;
                var expectedItemWidth = gridWidth / 100 * itemWidth;
                var paddingWidth = gridWidth / 100 * (parseFloat(this._gridItemTests.PADDING_PERCENTS_SIZE) * 2);
                expectedItemWidth += paddingWidth;
                this._gridItemTests.callPerItemWithPercentageWidthAndPercentagePadding(
                    $grid, gridWidth + "px", itemWidth, expectedItemWidth
                );

                clearTestData();
                $testContent.append($grid);
                var itemWidth = 33;
                var expectedItemWidth = gridWidth / 100 * itemWidth;
                var marginWidth = gridWidth / 100 * (parseFloat(this._gridItemTests.MARGIN_PERCENTS_SIZE) * 2);
                expectedItemWidth += marginWidth;
                this._gridItemTests.callPerItemWithPercentageWidthAndPercentageMargin(
                    $grid, gridWidth + "px", itemWidth, expectedItemWidth
                );

                clearTestData();
                $testContent.append($grid);
                var itemWidth = 33;
                var expectedItemWidth = gridWidth / 100 * itemWidth;
                var borderWidth = parseInt(this._gridItemTests.BORDER_PX_SIZE) * 2;
                expectedItemWidth += borderWidth;
                this._gridItemTests.callPerItemWithPercentageWidthAndPxBorder(
                    $grid, gridWidth + "px", itemWidth, expectedItemWidth
                );
            }
        },

        withBorderBoxItems: function() {
            var gridWidths = [17, 261, 300, 550, 773];

            for(var i = 0; i < gridWidths.length; i++) {
                var gridWidth = gridWidths[i];
                var $grid = this._grids.createGridWithPxWidth(gridWidth);

                this._gridItemTests.setBoxSizing(this._gridItemTests.BOX_SIZINGS.BORDER_BOX);
                clearTestData();
                $testContent.append($grid);
                this._gridItemTests.callPerItemWithPxWidth($grid, gridWidth + "px", 237, 237);

                clearTestData();
                $testContent.append($grid);
                var itemWidth = 237;
                var expectedItemWidth = itemWidth;
                this._gridItemTests.callPerItemWithPxWidthAndPxPadding(
                    $grid, gridWidth + "px", itemWidth, expectedItemWidth
                );

                clearTestData();
                $testContent.append($grid);
                var itemWidth = 237;
                var expectedItemWidth = itemWidth + parseInt(this._gridItemTests.MARGIN_PX_SIZE, 10) * 2;
                this._gridItemTests.callPerItemWithPxWidthAndPxMargin(
                    $grid, gridWidth + "px", itemWidth, expectedItemWidth
                );

                clearTestData();
                $testContent.append($grid);
                var itemWidth = 237;
                var expectedItemWidth = itemWidth;
                this._gridItemTests.callPerItemWithPxWidthAndPxBorder(
                    $grid, gridWidth + "px", itemWidth, expectedItemWidth
                );

                clearTestData();
                $testContent.append($grid);
                var itemWidth = 30;
                var expectedItemWidth = gridWidth / 100 * itemWidth;
                this._gridItemTests.callPerItemWithPercentageWidth(
                    $grid, gridWidth + "px", itemWidth, expectedItemWidth
                );

                clearTestData();
                $testContent.append($grid);
                var itemWidth = 30;
                var expectedItemWidth = gridWidth / 100 * itemWidth;
                this._gridItemTests.callPerItemWithPercentageWidthAndPercentagePadding(
                    $grid, gridWidth + "px", itemWidth, expectedItemWidth
                );

                clearTestData();
                $testContent.append($grid);
                var itemWidth = 33;
                var expectedItemWidth = gridWidth / 100 * itemWidth;
                var marginWidth = gridWidth / 100 * (parseFloat(this._gridItemTests.MARGIN_PERCENTS_SIZE) * 2);
                expectedItemWidth += marginWidth;
                this._gridItemTests.callPerItemWithPercentageWidthAndPercentageMargin(
                    $grid, gridWidth + "px", itemWidth, expectedItemWidth
                );

                clearTestData();
                $testContent.append($grid);
                var itemWidth = 50;
                var expectedItemWidth = gridWidth / 100 * itemWidth;
                this._gridItemTests.callPerItemWithPercentageWidthAndPxBorder(
                    $grid, gridWidth + "px", itemWidth, expectedItemWidth
                );
            }
        }
    }
});