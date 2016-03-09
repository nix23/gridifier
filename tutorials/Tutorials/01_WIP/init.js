$(document).ready(function() {
var ITEMS_PER_ITERATION = 5;
var grid = new Gridifier($(".grid"), {
  class: "item",
  toggleTime: 1000,
  coordsChangeTime: 1000,
  dragifier: true
});

var create_item = function(id) {
    var item = $.parseHTML('<div id="' + id + '" class="item" style=""><div><button>' + id + '</button></div></div>');
    //console.log(item);
    $(".grid").append(item); //console.log($(item).outerWidth());
    //console.log($(item).outerWidth());
    grid.append(item);
    //grid.reposition();

   setTimeout(function() {
     //console.log("timeout 2: removing " + id);
     //grid.disconnect(item);
     //grid.reposition();
   }, 2000);
}

// grid.onReposition(function(item) {
//     console.log($(item).outerWidth());
// });

var counter = 0;
var interval_id = setInterval(function() {
  if(counter >= 2) {
    clearInterval(interval_id);
    return;
  }

  for(var x=0 ; x<ITEMS_PER_ITERATION ; ++x) {
    var id = counter++;
    //console.log("timeout 1: adding " + id);
    create_item(id);
    }
});

    var initial = {x: null, y: null};
    var $target = null;
    $("body").on("mouseup", function(ev) {
        if($target == null) return;

        var xDiff = Math.abs(ev.pageX - initial.x); 
        var yDiff = Math.abs(ev.pageY - initial.y);
        if(xDiff < 10 && yDiff < 10) {
            setTimeout(function() { 
                grid.toggleCss($target, "bigTest2");
            }, 0);
        }
    });

    $(".grid").on("mousedown", ".item", function(ev) {
        initial.x = ev.pageX;
        initial.y = ev.pageY;
        $target = $(this);
    });


grid.onDisconnect(function(item) {
  var id = item.id;
  //console.log("onDisconnect: removing id=" + id + " from DOM");
  $("#" + id).remove();
});
});