var style = require('./../../../lib/style.js');

exports.get = function (req, res, next) {
    req.db.get('businesses').findById(req.params.id, function (err, business) {
        if (err) {
            return next(err);
        }
        
        res.render('checkin/checkin', {
            companyName: business.companyName,
            bg: business.style.bg,
            logo: business.logo,
            buttonBg: style.rgbObjectToCSS(business.style.buttonBg),
            buttonText: style.rgbObjectToCSS(business.style.buttonText),
            containerText: style.rgbObjectToCSS(business.style.containerText),
            containerBg: style.rgbObjectToCSS(business.style.containerBg)
        });
    });
};
