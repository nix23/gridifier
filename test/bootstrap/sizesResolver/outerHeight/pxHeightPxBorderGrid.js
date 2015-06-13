$(document).ready(function() {
    window.outerHeightTesterPxHeightPxBorderGrid = {
        testCallOnPxHeightPxBorderGridPerAllContentBoxItems: function() {
            var gridHeights = [47, 261, 300, 550, 773];

            for(var i = 0; i < gridHeights.length; i++) {
                var gridWidth = parseInt(this._grids.GRID_WIDTH, 10);
                var gridHeight = gridHeights[i];
                var $grid = this._grids.createGridWithPxHeightAndPxBorder(gridHeight);
                var gridVerticalBorderLabel = this._grids.BORDER_PX_SIZE;
                var gridLabel = gridHeight + "px; border = " + gridVerticalBorderLabel;

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
                if(this._grids.isContentBoxBSGrid())
                    var gridBorderHeight = 0;
                else if(this._grids.isBorderBoxBSGrid())
                    var gridBorderHeight = parseInt(this._grids.BORDER_PX_SIZE, 10) * 2;
                var expectedItemHeight = (gridHeight - gridBorderHeight) / 100 * itemHeight;
                this._gridItemTests.callPerItemWithPercentageHeight(
                    $grid, gridLabel, itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 30;
                if(this._grids.isContentBoxBSGrid())
                    var gridBorderHeight = 0;
                else if(this._grids.isBorderBoxBSGrid())
                    var gridBorderHeight = parseInt(this._grids.BORDER_PX_SIZE, 10) * 2;
                var expectedItemHeight = (gridHeight - gridBorderHeight) / 100 * itemHeight;
                var paddingSize = (parseFloat(this._gridItemTests.PADDING_PERCENTS_SIZE) * 2);
                var paddingHeight = (gridWidth - gridBorderHeight) / 100 * paddingSize;
                expectedItemHeight += paddingHeight;
                this._gridItemTests.callPerItemWithPercentageHeightAndPercentagePadding(
                    $grid, gridLabel, itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 33;
                if(this._grids.isContentBoxBSGrid())
                    var gridBorderHeight = 0;
                else if(this._grids.isBorderBoxBSGrid())
                    var gridBorderHeight = parseInt(this._grids.BORDER_PX_SIZE, 10) * 2;
                var expectedItemHeight = (gridHeight - gridBorderHeight) / 100 * itemHeight;
                var marginSize = (parseFloat(this._gridItemTests.MARGIN_PERCENTS_SIZE) * 2);
                var marginHeight = (gridWidth - gridBorderHeight) / 100 * marginSize;
                expectedItemHeight += marginHeight;
                this._gridItemTests.callPerItemWithPercentageHeightAndPercentageMargin(
                    $grid, gridLabel, itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 33;
                if(this._grids.isContentBoxBSGrid())
                    var gridBorderHeight = 0;
                else if(this._grids.isBorderBoxBSGrid())
                    var gridBorderHeight = parseInt(this._grids.BORDER_PX_SIZE, 10) * 2;
                var expectedItemHeight = (gridHeight - gridBorderHeight) / 100 * itemHeight;
                var borderHeight = parseInt(this._gridItemTests.BORDER_PX_SIZE, 10) * 2;
                expectedItemHeight += borderHeight;
                this._gridItemTests.callPerItemWithPercentageHeightAndPxBorder(
                    $grid, gridLabel, itemHeight, expectedItemHeight
                );
            }
        },

        testCallOnPxHeightPxBorderGridPerAllBorderBoxItems: function() {
            var gridHeights = [67, 261, 300, 550, 773];

            for(var i = 0; i < gridHeights.length; i++) {
                var gridWidth = parseInt(this._grids.GRID_WIDTH, 10);
                var gridHeight = gridHeights[i];
                var $grid = this._grids.createGridWithPxHeightAndPxBorder(gridHeight);
                var gridVerticalBorderLabel = this._grids.BORDER_PX_SIZE;
                var gridLabel = gridHeight + "px; border = " + gridVerticalBorderLabel;

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
                if(this._grids.isContentBoxBSGrid())
                    var gridBorderHeight = 0;
                else if(this._grids.isBorderBoxBSGrid())
                    var gridBorderHeight = parseInt(this._grids.BORDER_PX_SIZE, 10) * 2;
                var expectedItemHeight = (gridHeight - gridBorderHeight) / 100 * itemHeight;
                this._gridItemTests.callPerItemWithPercentageHeight(
                    $grid, gridLabel, itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 30;
                if(this._grids.isContentBoxBSGrid())
                    var gridBorderHeight = 0;
                else if(this._grids.isBorderBoxBSGrid())
                    var gridBorderHeight = parseInt(this._grids.BORDER_PX_SIZE, 10) * 2;
                var expectedItemHeight = (gridHeight - gridBorderHeight) / 100 * itemHeight;
                this._gridItemTests.callPerItemWithPercentageHeightAndPercentagePadding(
                    $grid, gridLabel, itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 33;
                if(this._grids.isContentBoxBSGrid())
                    var gridBorderHeight = 0;
                else if(this._grids.isBorderBoxBSGrid())
                    var gridBorderHeight = parseInt(this._grids.BORDER_PX_SIZE, 10) * 2;
                var expectedItemHeight = (gridHeight - gridBorderHeight) / 100 * itemHeight;
                var marginSize = (parseFloat(this._gridItemTests.MARGIN_PERCENTS_SIZE) * 2);
                var marginHeight = (gridWidth - gridBorderHeight) / 100 * marginSize;
                expectedItemHeight += marginHeight;
                this._gridItemTests.callPerItemWithPercentageHeightAndPercentageMargin(
                    $grid, gridLabel, itemHeight, expectedItemHeight
                );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 50;
                if(this._grids.isContentBoxBSGrid())
                    var gridBorderHeight = 0;
                else if(this._grids.isBorderBoxBSGrid())
                    var gridBorderHeight = parseInt(this._grids.BORDER_PX_SIZE, 10) * 2;
                var expectedItemHeight = (gridHeight - gridBorderHeight) / 100 * itemHeight;
                this._gridItemTests.callPerItemWithPercentageHeightAndPxBorder(
                    $grid, gridLabel, itemHeight, expectedItemHeight
                );
            }
        }
    }
});