function rgb2hex(rgb) {
    if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ('0' + parseInt(x).toString(16)).slice(-2);
    }

    return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

$(document).ready(function () {
    var $themeToolbar = $('#theme-toolbar');

    //Hide other pages of the toolbar
    $themeToolbar.children('.hidden-page').hide();

    //Bind change page buttons
    $themeToolbar.find('.change-toolbar-page').click(function () {
        var $activePage = $themeToolbar.children('.active-page');
        var $targetPage = $themeToolbar.children('#' + $(this).data('to'));

        $activePage.removeClass('active-page').addClass('hidden-page');
        $targetPage.removeClass('hidden-page').addClass('active-page');

        $activePage.slideUp(500, function () {
            $targetPage.slideDown(500);
            $activePage.hide();
        });
    });

    //Changing BG picture
    $themeToolbar.find('.bg-image').click(function () {
        var bg = $(this).data('bg');
        $('.customBG').css('background-image', ' url(images/bg/full/' + bg + ')');
    });

    //Colorpicker
    $('#button-bg-color').spectrum({
        color: rgb2hex($('.checkinbutton').css('background-color')),
        move: function (color) {
            $('.checkinbutton').css('background-color', color.toHexString());
        }
    });

    $('#button-font-color').spectrum({
        color: rgb2hex($('.checkinbutton').css('color')),
        move: function (color) {
            $('.checkinbutton').css('color', color.toHexString());
        }
    });
});
