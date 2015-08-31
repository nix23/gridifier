$(document).ready(function() {
    var grid = new Gridifier($(".grid"), {
        query: "img",
        resolveImages: true,
        dragifier: true,
        gridTransformTimeout: 500
    });

    grid.append($(".grid").find("img"));

    //setTimeout(function() {
    //    $.each($(".grid").find("img"), function() {
    //        $(this).attr("src", "../../vendor/img/test.jpg");
    //    });
    //}, 1000);
});