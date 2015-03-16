var style = require('./../../../lib/style.js');

exports.get = function (req, res, next) {
    var business = req.session.business;

    res.render('checkin/done', {
        companyName: business.companyName,
        bg: business.style.bg,
        logo: business.logo,
        buttonBg: style.rgbObjectToCSS(business.style.buttonBg),
        buttonText: style.rgbObjectToCSS(business.style.buttonText),
        containerText: style.rgbObjectToCSS(business.style.containerText),
        containerBg: style.rgbObjectToCSS(business.style.containerBg)
    });
};
