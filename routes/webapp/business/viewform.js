exports.get = function (req, res, next) {
    var db = req.db;
    var formResponses = db.get('formResponses');
    var appointments = db.get('appointments');

    formResponses.findOne({ appointment: req.params.id }, function(err, formResponse) {
        if (err) {
            return next(err);
        }
        if (!formResponse) {
            return next(new Error('Error finding form response for appointment: ' + req.params.id));
        }

        appointments.findById(req.params.id, function (err, appt) {
            if (err) {
                return next(err);
            }
            if (!appt) {
                return next(new Error('Error finding appointment: ' + req.params.id));
            }

            return res.render('business/viewform', {
                title: 'Form for ' + appt.fname + ' ' + appt.lname,
                name: appt.fname + ' ' + appt.lname,
                formData: formResponse.answers
            });
        });
    });
};
