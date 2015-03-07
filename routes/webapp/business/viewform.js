exports.get = function (req, res) {
    // grab our db object from the request
    var db = req.db;
    var response = db.get('formResponses');
    var appointments = db.get('appointments');
    // query the collection
    response.findOne({ appointment : req.params.id }, function(err, formResponse) {
        if (err) {
            return res.sendStatus(500, err);
        }
        appointments.findById(req.params.id, function (err, appt) {
            if (err) {
                return res.sendStatus(500, err);
            }

            return res.render('business/viewform', {
                title: 'Form for ' + appt.fname + ' ' + appt.lname,
                name: appt.fname + ' ' + appt.lname,
                formData: formResponse.answers
            });
        });
    });
};
