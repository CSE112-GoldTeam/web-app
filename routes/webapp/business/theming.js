var style = require('./../../../lib/style.js');

exports.get = function (req, res, next) {
    var bid = req.user[0].business;

    req.db.get('businesses').findById(bid, function (err, business) {
        if (err) {
            return next(err);
        }

        res.render('business/theme', {
            companyName: business.companyName,
            bg: business.style.bg,
            logo: business.logo,
            buttonBg: style.rgbObjectToCSS(business.style.buttonBg),
            buttonText: style.rgbObjectToCSS(business.style.buttonText),
            containerText: style.rgbObjectToCSS(business.style.containerText),
            containerBg: style.rgbObjectToCSS(business.style.containerBg),
            style: JSON.stringify(business.style)
        });
    });
};
