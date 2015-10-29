$(function() {
    var e = $(window).height() - 60;
    var t = $(".resize");
    t.css("height", e);
    var n = function() {
        var e = t.width() / 300;
        t.css("font-size", e / 3 + "em");
        $("footer").css("font-size", e / 4 + "em")
    };
    $(window).on("resize", n);
    n();
    $(document).ready(function() {
        function t() {
            e = new IScroll(".wrapper", {
                mouseWheel: true,
                click: true,
                interactiveScrollbars: true,
				shrinkScrollbars: 'scale',
				fadeScrollbars: true
            })
        }
        var e;
        t();
        $(".down").on("click", function() {
            e.scrollToElement("." + $(this).attr("goto"), null, null, true)
        })
    })
})
