exports.get = function(req, res, next) {
    var db = req.db;
    var businesses = db.get('businesses');

    businesses.findById(req.params.id, function (err, business) {
        if (err) {
            return next(err);
        }
        if (!business) {
            return next(new Error('Error finding business: ' + req.params.id));
        }

        //TODO: Verify that there are results and no errors
        res.render('checkin/sign', {
            title: 'Express',
            disclosure: business.disclosure
        });
    });
};

exports.post = function (req, res, next) {
    var sig = req.body.sig.trim();
    if (sig === '') {
        var db = req.db;
        var businesses = db.get('businesses');

        businesses.findById(req.params.id, function (err, business) {
            if (err) {
                return next(err);
            }
            if (!business) {
                return next(new Error('Error finding business: ' + req.params.id));
            }

            res.render('checkin/sign', {
                title: 'Express',
                disclosure: business.disclosure,
                error: 'You must provide a signature'
            });
        });
    } else {
        //Update the state of the appointment
        req.db.get('appointments').updateById(req.session.appointmentId, {
            $set: {
                state: 'checkedIn'
            }
        }, function (err) {
            if (err) {
                return next(err);
            }
            res.redirect('done');
        });
    }
};
