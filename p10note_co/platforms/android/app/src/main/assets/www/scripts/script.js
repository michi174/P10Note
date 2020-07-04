$(document).ready(function () {
    $("#hamburger-button").click(function () {
        $("#hamburger-menu-wrapper").toggleClass("visible");
        $("#darkscreen").toggleClass("visible");
    });

    $("#darkscreen").click(function () {
        if ($("#hamburger-menu-wrapper").is(":visible")) {
            $("#hamburger-menu-wrapper").removeClass("visible");
            $("#darkscreen").removeClass("visible");
        }

        if ($("#window-wrapper").is(":visible")) {
            $("#darkscreen").addClass("visible");
        }
    });

    $(".hm-listitem").click(function () {
        $("#hamburger-menu-wrapper").toggleClass("visible");
        $("#darkscreen").toggleClass("visible");
    });

    function closeWindow() {
        window.open("", "_parent", "");
        window.close();
    }
});
