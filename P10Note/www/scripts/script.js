$(document).ready(function () {

    $('#hamburger-button').click(function () {
        $('#hamburger-menu-wrapper').toggle();
        $('#darkscreen').toggle();
    });

    $('#darkscreen').click(function () {
        if ($('#hamburger-menu-wrapper').is(':visible'))
        {
            $('#hamburger-menu-wrapper').toggle();
            $('#darkscreen').toggle();
        }
    });

    $('.hm-listitem').click(function () {
        $('#hamburger-menu-wrapper').toggle();
        $('#darkscreen').toggle();
    });

    function closeWindow() {
        window.open('', '_parent', '');
        window.close();
    }
});