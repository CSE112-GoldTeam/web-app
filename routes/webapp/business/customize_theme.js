exports.get = function (req, res, next) {
    //Get the logo for the business of the currently logged in user
    req.db.get('businesses').findById(req.user[0].business, function (err, business) {
        if (err) {
            return next(err);
        }
        if (!business) {
            return next(new Error('Business not found for user: ' + req.user));
        }

        res.render('business/customize_theme', {
            message: req.flash('permission'),
            logo: business.logo,
            bg: '/images/bg/thumb/' + business.style.bg
        });
    });
};
