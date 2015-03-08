exports.get = function (req, res, next) {
    var db = req.db;
    var appointments = db.get('appointments');

    appointments.findById(req.session.appointmentId, function(err, appointment) {
        if (err) {
            return next(err);
        }
        if(!appointment) {
            return next(new Error('Appointment from session not found: ' + req.session.appointmentId));
        }

        res.render('checkin/apptinfo', {
            name: appointment.fname,
            DOB: appointment.dob,
            email: appointment.email
        });

    });
};
