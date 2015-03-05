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
        });
    });

    //Changing BG picture
    $themeToolbar.find('.bg-image').click(function () {
        var bg = $(this).data('bg');
        $('.customBG').css('background-image', ' url(images/bg/full/'+bg+')')
    });
});
