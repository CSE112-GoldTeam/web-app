exports.get = function (req, res) {
    res.render('business/customize_theme', {message: req.flash("permission")});
};
