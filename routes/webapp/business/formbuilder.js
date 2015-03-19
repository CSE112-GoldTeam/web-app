exports.get = function (req, res) {
    res.render('business/formbuilder', {title: 'Express'});
};

exports.get = function (req, res, next) {
    var forms = req.db.get('forms');
    var businessID = req.user[0].business;
    forms.findOne({business: businessID}, function (err, form, findID) {
        if (err) {
            return next(err);
        }
        res.render('business/formbuilder', {
            title: 'Express',
            form: JSON.stringify(form),
            findID: businessID
        });
    });
};
