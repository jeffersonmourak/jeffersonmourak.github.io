(function() {
    "use strict";

    var $window = $(window);
    var scrollTime = 1.2;
    var scrollDistance = 170;



    $window.scroll(function() {
        if ($window.scrollTop() > 324) {
            if($("#mainHeader").attr("class") != "header-nav"){
                $("#mainHeader").attr("class", "header-nav");
                $(".first-element").css("margin-top", "50vh");
            }
        } else {
            if($(".first-element").css("margin-top") != "40px"){
                $("#mainHeader").attr("class", "");
                $(".first-element").css("margin-top", "40px");
            }
        }
    });

})();
