$(document).ready(function() {
    window.owPxWidthPxBorderGrid = {
        withContentBoxItems: function() {
            var gridWidths = [47, 261, 300, 550, 773];

            for(var i = 0; i < gridWidths.length; i++) {
                var gridWidth = gridWidths[i];
                var $grid = this._grids.createGridWithPxWidthAndPxBorder(gridWidth);
                var gridHorizontalBorderLabel = this._grids.BORDER_PX_SIZE;
                var gridLabel = gridWidth + "px; border = " + gridHorizontalBorderLabel;

                this._gridItemTests.setBoxSizing(this._gridItemTests.BOX_SIZINGS.CONTENT_BOX);
                clearTestData();
                $testContent.append($grid);
                this._gridItemTests.callPerItemWithPxWidth($grid, gridLabel, 237, 237);

                clearTestData();
                $testContent.append($grid);
                var itemWidth = 237;
                var expectedItemWidth = itemWidth + parseInt(this._gridItemTests.PADDING_PX_SIZE, 10) * 2;
                this._gridItemTests.callPerItemWithPxWidthAndPxPadding(
                    $grid, gridLabel, itemWidth, expectedItemWidth
                );

                clearTestData();
                $testContent.append($grid);
                var itemWidth = 237;
                var expectedItemWidth = itemWidth + parseInt(this._gridItemTests.MARGIN_PX_SIZE, 10) * 2;
                this._gridItemTests.callPerItemWithPxWidthAndPxMargin(
                    $grid, gridLabel, itemWidth, expectedItemWidth
                );

                clearTestData();
                $testContent.append($grid);
                var itemWidth = 237;
                var expectedItemWidth = itemWidth + parseInt(this._gridItemTests.BORDER_PX_SIZE, 10) * 2;
                this._gridItemTests.callPerItemWithPxWidthAndPxBorder(
                    $grid, gridLabel, itemWidth, expectedItemWidth
                );

                clearTestData();
                $testContent.append($grid);
                var itemWidth = 30;
                if(this._grids.isContentBoxBSGrid())
                    var gridBorderWidth = 0;
                else if(this._grids.isBorderBoxBSGrid())
                    var gridBorderWidth = parseInt(this._grids.BORDER_PX_SIZE, 10) * 2;
                var expectedItemWidth = (gridWidth - gridBorderWidth) / 100 * itemWidth;
                this._gridItemTests.callPerItemWithPercentageWidth(
                    $grid, gridLabel, itemWidth, expectedItemWidth
                );

                clearTestData();
                $testContent.append($grid);
                var itemWidth = 30;
                if(this._grids.isContentBoxBSGrid())
                    var gridBorderWidth = 0;
                else if(this._grids.isBorderBoxBSGrid())
                    var gridBorderWidth = parseFloat(this._grids.BORDER_PX_SIZE) * 2;
                var expectedItemWidth = (gridWidth - gridBorderWidth) / 100 * itemWidth;
                var paddingWidth = (gridWidth - gridBorderWidth) / 100 * (parseFloat(this._gridItemTests.PADDING_PERCENTS_SIZE) * 2);
                expectedItemWidth += paddingWidth;
                this._gridItemTests.callPerItemWithPercentageWidthAndPercentagePadding(
                    $grid, gridLabel, itemWidth, expectedItemWidth
                );

                clearTestData();
                $testContent.append($grid);
                var itemWidth = 33;
                if(this._grids.isContentBoxBSGrid())
                    var gridBorderWidth = 0;
                else if(this._grids.isBorderBoxBSGrid())
                    var gridBorderWidth = parseFloat(this._grids.BORDER_PX_SIZE) * 2;
                var expectedItemWidth = (gridWidth - gridBorderWidth) / 100 * itemWidth;
                var marginWidth = (gridWidth - gridBorderWidth) / 100 * (parseFloat(this._gridItemTests.MARGIN_PERCENTS_SIZE) * 2);
                expectedItemWidth += marginWidth;
                this._gridItemTests.callPerItemWithPercentageWidthAndPercentageMargin(
                    $grid, gridLabel, itemWidth, expectedItemWidth
                );

                clearTestData();
                $testContent.append($grid);
                var itemWidth = 33;
                if(this._grids.isContentBoxBSGrid())
                    var gridBorderWidth = 0;
                else if(this._grids.isBorderBoxBSGrid())
                    var gridBorderWidth = parseFloat(this._grids.BORDER_PX_SIZE) * 2;
                var expectedItemWidth = (gridWidth - gridBorderWidth) / 100 * itemWidth;
                var borderWidth = parseInt(this._gridItemTests.BORDER_PX_SIZE) * 2;
                expectedItemWidth += borderWidth;
                this._gridItemTests.callPerItemWithPercentageWidthAndPxBorder(
                    $grid, gridLabel, itemWidth, expectedItemWidth
                );
            }
        },

        withBorderBoxItems: function() {
            var gridWidths = [47, 261, 300, 550, 773];

            for(var i = 0; i < gridWidths.length; i++) {
                var gridWidth = gridWidths[i];
                var $grid = this._grids.createGridWithPxWidthAndPxBorder(gridWidth);
                var gridHorizontalBorderLabel = this._grids.BORDER_PX_SIZE;
                var gridLabel = gridWidth + "px; border = " + gridHorizontalBorderLabel;

                this._gridItemTests.setBoxSizing(this._gridItemTests.BOX_SIZINGS.BORDER_BOX);
                clearTestData();
                $testContent.append($grid);
                this._gridItemTests.callPerItemWithPxWidth($grid, gridLabel, 237, 237);

                clearTestData();
                $testContent.append($grid);
                var itemWidth = 237;
                var expectedItemWidth = itemWidth;
                this._gridItemTests.callPerItemWithPxWidthAndPxPadding(
                    $grid, gridLabel, itemWidth, expectedItemWidth
                );

                clearTestData();
                $testContent.append($grid);
                var itemWidth = 237;
                var expectedItemWidth = itemWidth + parseInt(this._gridItemTests.MARGIN_PX_SIZE, 10) * 2;
                this._gridItemTests.callPerItemWithPxWidthAndPxMargin(
                    $grid, gridLabel, itemWidth, expectedItemWidth
                );

                clearTestData();
                $testContent.append($grid);
                var itemWidth = 237;
                var expectedItemWidth = itemWidth;
                this._gridItemTests.callPerItemWithPxWidthAndPxBorder(
                    $grid, gridLabel, itemWidth, expectedItemWidth
                );

                clearTestData();
                $testContent.append($grid);
                var itemWidth = 30;
                if(this._grids.isContentBoxBSGrid())
                    var gridBorderWidth = 0;
                else if(this._grids.isBorderBoxBSGrid())
                    var gridBorderWidth = parseInt(this._grids.BORDER_PX_SIZE, 10) * 2;
                var expectedItemWidth = (gridWidth - gridBorderWidth) / 100 * itemWidth;
                this._gridItemTests.callPerItemWithPercentageWidth(
                    $grid, gridLabel, itemWidth, expectedItemWidth
                );

                clearTestData();
                $testContent.append($grid);
                var itemWidth = 30;
                if(this._grids.isContentBoxBSGrid())
                    var gridBorderWidth = 0;
                else if(this._grids.isBorderBoxBSGrid())
                    var gridBorderWidth = parseInt(this._grids.BORDER_PX_SIZE, 10) * 2;
                var expectedItemWidth = (gridWidth - gridBorderWidth) / 100 * itemWidth;
                this._gridItemTests.callPerItemWithPercentageWidthAndPercentagePadding(
                    $grid, gridLabel, itemWidth, expectedItemWidth
                );

                clearTestData();
                $testContent.append($grid);
                var itemWidth = 33;
                if(this._grids.isContentBoxBSGrid())
                    var gridBorderWidth = 0;
                else if(this._grids.isBorderBoxBSGrid())
                    var gridBorderWidth = parseInt(this._grids.BORDER_PX_SIZE, 10) * 2;
                var expectedItemWidth = (gridWidth - gridBorderWidth) / 100 * itemWidth;
                var marginWidth = (gridWidth - gridBorderWidth) / 100 * (parseFloat(this._gridItemTests.MARGIN_PERCENTS_SIZE) * 2);
                expectedItemWidth += marginWidth;
                this._gridItemTests.callPerItemWithPercentageWidthAndPercentageMargin(
                    $grid, gridLabel, itemWidth, expectedItemWidth
                );

                clearTestData();
                $testContent.append($grid);
                var itemWidth = 50;
                if(this._grids.isContentBoxBSGrid())
                    var gridBorderWidth = 0;
                else if(this._grids.isBorderBoxBSGrid())
                    var gridBorderWidth = parseInt(this._grids.BORDER_PX_SIZE, 10) * 2;
                var expectedItemWidth = (gridWidth - gridBorderWidth) / 100 * itemWidth;
                this._gridItemTests.callPerItemWithPercentageWidthAndPxBorder(
                    $grid, gridLabel, itemWidth, expectedItemWidth
                );
            }
        }
    }
});