exports.get = function (req, res) {
    res.render('business/manage_forms',{message: req.flash("permission")});
};
