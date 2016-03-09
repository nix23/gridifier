// @todo - Finish tutorials
$(document).ready(function() {
    var grid = new Gridifier($(".grid"), {
        //query: "img",
        query: "> div",
        //loadImages: true,
        dragifier: true
        //gridResizeDelay: 500
    });

    var initial = {x: null, y: null};
    var $target = null;
    $("body").on("mouseup", function(ev) {
        if($target == null) return;

        var xDiff = Math.abs(ev.pageX - initial.x); 
        var yDiff = Math.abs(ev.pageY - initial.y);
        if(xDiff < 10 && yDiff < 10) {
            setTimeout(function() { 
                grid.toggleCss($target, "bigTest");
            }, 0);
        }
    });

    $(".grid").on("mousedown", "div", function(ev) {
        initial.x = ev.pageX;
        initial.y = ev.pageY;
        $target = $(this);
    });

    // $(".grid").on("touchstart", "div", function() {
    //     console.log("touched");
    // });

    grid.append(grid.collectNew());
    
    //setTimeout(function() {
    //    $.each($(".grid").find("img"), function() {
    //        $(this).attr("src", "../../vendor/img/test.jpg");
    //    });
    //}, 1000);
});