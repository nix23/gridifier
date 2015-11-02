// @todo - Finish tutorials
$(document).ready(function() {
    var grid = new Gridifier($(".grid"), {
        //query: "img",
        query: "> div",
        //loadImages: true,
        dragifier: true
        //gridResizeDelay: 500
    });

    grid.append(grid.collectNew());
    
    //setTimeout(function() {
    //    $.each($(".grid").find("img"), function() {
    //        $(this).attr("src", "../../vendor/img/test.jpg");
    //    });
    //}, 1000);
});