$(document).ready(function() {
    window.ohPxHeightPxPaddingGrid = {
        withContentBoxItems: function() {
            var gridHeights = [47, 261, 300, 550, 773];

            for(var i = 0; i < gridHeights.length; i++) {
                var gridHeight = gridHeights[i];
                var $grid = this._grids.createGridWithPxHeightAndPxPadding(gridHeight);
                var gridVerticalPaddingLabel = this._grids.PADDING_PX_SIZE;
                var gridLabel = gridHeight + "px; padding = " + gridVerticalPaddingLabel;

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
                var itemHeight = 3;
                if(this._grids.isContentBoxBSGrid())
                    var gridVerticalPadding = parseInt(this._grids.PADDING_PX_SIZE, 10) * 2;
                else if(this._grids.isBorderBoxBSGrid())
                    var gridVerticalPadding = 0;
                var expectedItemHeight = (gridHeight + gridVerticalPadding) / 100 * itemHeight;
                this._gridItemTests.callPerItemWithPercentageHeight(
                    $grid, gridLabel, itemHeight, expectedItemHeight
                );

                // @Notice -> test disabled.(When grid has px padding, and grid item has percentage paddings,
                //                           Chrome calculates grid item paddings from raw parent height,
                //                           FF calculates from raw parent height + paddings)
                // clearTestData();
                // $testContent.append($grid);
                // var itemHeight = 30;
                // var gridVerticalPadding = parseInt(this._grids.PADDING_PX_SIZE, 10) * 2;
                // var expectedItemHeight = (gridHeight + gridVerticalPadding) / 100 * itemHeight;
                // var paddingHeight = gridHeight / 100 * (parseFloat(this._gridItemTests.PADDING_PERCENTS_SIZE) * 2);
                // expectedItemHeight += paddingHeight;
                // this._gridItemTests.callPerItemWithPercentageHeightAndPercentagePadding(
                //     $grid, gridLabel, itemHeight, expectedItemHeight
                // );

                // @Notice -> test disabled.(When grid has px padding, and grid item has percentage margins,
                //                           Chrome is calculating margins incorrectly(OK In FF))
                // clearTestData();
                // $testContent.append($grid);
                // var itemHeight = 33;
                // var gridVerticalPadding = parseInt(this._grids.PADDING_PX_SIZE, 10) * 2;
                // var expectedItemHeight = (gridHeight + gridVerticalPadding) / 100 * itemHeight;
                // var marginSize = (parseFloat(this._gridItemTests.MARGIN_PERCENTS_SIZE) * 2);
                // var marginHeight = (gridHeight + gridVerticalPadding) / 100 * marginSize;
                // expectedItemHeight += marginHeight;
                // this._gridItemTests.callPerItemWithPercentageHeightAndPercentageMargin(
                //     $grid, gridLabel, itemHeight, expectedItemHeight
                // );

                clearTestData();
                $testContent.append($grid);
                var itemHeight = 33;
                if(this._grids.isContentBoxBSGrid())
                    var gridVerticalPadding = parseInt(this._grids.PADDING_PX_SIZE, 10) * 2;
                else if(this._grids.isBorderBoxBSGrid())
                    var gridVerticalPadding = 0;
                var expectedItemHeight = (gridHeight + gridVerticalPadding) / 100 * itemHeight;
                var borderHeight = parseInt(this._gridItemTests.BORDER_PX_SIZE) * 2;
                expectedItemHeight += borderHeight;
                this._gridItemTests.callPerItemWithPercentageHeightAndPxBorder(
                    $grid, gridLabel, itemHeight, expectedItemHeight
                );
            }
        },

        withBorderBoxItems: function() {
            var gridHeights = [47, 261, 300, 550, 773];

            for(var i = 0; i < gridHeights.length; i++) {
                var gridHeight = gridHeights[i];
                var $grid = this._grids.createGridWithPxHeightAndPxPadding(gridHeight);
                var gridVerticalPaddingLabel = this._grids.PADDING_PX_SIZE;
                var gridLabel = gridHeight + "px; padding = " + gridVerticalPaddingLabel;

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
                if(this._grids.isContentBoxBSGrid())
                    var gridVerticalPadding = parseInt(this._grids.PADDING_PX_SIZE, 10) * 2;
                else if(this._grids.isBorderBoxBSGrid())
                    var gridVerticalPadding = 0;
                var itemHeight = 30;
                var expectedItemHeight = (gridHeight + gridVerticalPadding) / 100 * itemHeight;
                this._gridItemTests.callPerItemWithPercentageHeight(
                    $grid, gridLabel, itemHeight, expectedItemHeight
                );

                // @Notice -> test disabled. (When grid has px padding set and grid item has % padding,
                //                            IE11 returns incorrect calculated height per grid item)
                // clearTestData();
                // $testContent.append($grid);
                // var gridVerticalPadding = parseInt(this._grids.PADDING_PX_SIZE, 10) * 2;
                // var itemHeight = 30;
                // var expectedItemHeight = (gridHeight + gridVerticalPadding) / 100 * itemHeight;
                // this._gridItemTests.callPerItemWithPercentageHeightAndPercentagePadding(
                //     $grid, gridLabel, itemHeight, expectedItemHeight
                // );

                // @Notice -> test disabled. (When grid has px padding and grid item has % margin,
                //                            Chrome returns incorrect calculated margins per item)
                // clearTestData();
                // $testContent.append($grid);
                // var gridVerticalPadding = parseInt(this._grids.PADDING_PX_SIZE, 10) * 2;
                // var itemHeight = 33;
                // var expectedItemHeight = (gridHeight + gridVerticalPadding) / 100 * itemHeight;
                // var marginSize = (parseFloat(this._gridItemTests.MARGIN_PERCENTS_SIZE) * 2);
                // var marginHeight = (gridHeight + gridVerticalPadding) / 100 * marginSize;
                // expectedItemHeight += marginHeight;
                // this._gridItemTests.callPerItemWithPercentageHeightAndPercentageMargin(
                //     $grid, gridLabel, itemHeight, expectedItemHeight
                // );

                clearTestData();
                $testContent.append($grid);
                if(this._grids.isContentBoxBSGrid())
                    var gridVerticalPadding = parseInt(this._grids.PADDING_PX_SIZE, 10) * 2;
                else if(this._grids.isBorderBoxBSGrid())
                    var gridVerticalPadding = 0;
                var itemHeight = 50;
                var expectedItemHeight = (gridHeight + gridVerticalPadding) / 100 * itemHeight;
                this._gridItemTests.callPerItemWithPercentageHeightAndPxBorder(
                    $grid, gridLabel, itemHeight, expectedItemHeight
                );
            }
        }
    }
});