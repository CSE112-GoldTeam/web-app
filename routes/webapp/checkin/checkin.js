exports.get = function (req, res, next) {
    //Find the current business
    req.db.get('businesses').findById(req.params.id, function (err, business) {
        if (err) {
            return next(err);
        }

        res.render('checkin/checkin', {
            bg: business.style.bg
        });
    });
};
