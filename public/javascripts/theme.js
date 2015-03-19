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
        style.bg = bg;
    });

    //Colorpicker for buttons
    $('#button-bg-color').spectrum({
        color: $('.checkinbutton').css('background-color'),
        move: function (color) {
            $('.checkinbutton').css('background-color', color.toHexString());
        }, change: function (color) {
            $('.checkinbutton').css('background-color', color.toHexString());
            style.buttonBg = color.toRgb();
        }, hide: function (color) {
            $('.checkinbutton').css('background-color', color.toHexString());
        }
    });

    $('#button-font-color').spectrum({
        color: $('.checkinbutton').css('color'),
        move: function (color) {
            $('.checkinbutton').css('color', color.toHexString());
        }, change: function (color) {
            $('.checkinbutton').css('color', color.toHexString());
            style.buttonText = color.toRgb();
        }, hide: function (color) {
            $('.checkinbutton').css('color', color.toHexString());
        }
    });

    //Colorpicker for content container
    $('#content-container-color').spectrum({
        color: $('.container-checkin').css('background-color'),
        showAlpha: true,
        change: function (color) {
            $('.container-checkin').css('background-color', color.toRgbString());
            style.containerBg = color.toRgb();
        }, hide: function (color) {
            $('.container-checkin').css('background-color', color.toRgbString());
        }
    }).on('dragstop.spectrum', function (e, color) {
        $('.container-checkin').css('background-color', color.toRgbString());
    });

    $('#content-container-font-color').spectrum({
        color: $('.header').css('color'),
        move: function (color) {
            $('.header').css('color', color.toHexString());
        },
        change: function (color) {
            $('.header').css('background-color', color.toRgbString());
            style.containerText = color.toRgb();
        }, hide: function (color) {
            $('.header').css('background-color', color.toRgbString());
        }
    });

    //Save button
    $('#save').click(function () {
        $.ajax({
            method: 'put',
            url: '/api/style',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(style),
            complete: function () {
                window.location.href = '/customizetheme';
            }
        });
    });
});
