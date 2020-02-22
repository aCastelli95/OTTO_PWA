$(document).ready(function () {
    setTimeout(function () {
      $("#loading").fadeOut(1500);
    }, 3000);
  
    setTimeout(function () {
      $("#nav-bar").fadeIn(1500);
      $("#container").fadeIn(1500);
      $("#footer").fadeIn(1500);
    }, 6000);
  
  
    $("#Home").click(function () { });
  
    //FLOATING BUTTON MANAGMENT
    document.addEventListener("DOMContentLoaded", function () {
      var elems = document.querySelectorAll(".fixed-action-btn");
      var instances = M.FloatingActionButton.init(elems, options);
    });
    $("#bluetooth").click(function () {
  
    });
    $(".action").click(function () {
      $("#modal-title").text($(this).attr("data-title"));
      $("#modal-content").text($(this).attr("data-content"));
      //$("#apply").val();
  
      $('.modal').modal()
    });
  
    // Modal
  });