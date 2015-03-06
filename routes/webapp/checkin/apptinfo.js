exports.get = function (req, res) {
    var db = req.db;
    var appointments = db.get('appointments'); //This gets the collection
    appointments.findById(req.session.appointmentId, function(err, result) {
        if (err) { return res.sendStatus(500, err); }
        if(!result) { return res.send(404,'User not found');}
        res.render('checkin/apptinfo', {
            name: result.fname,
            DOB: result.dob,
            email: result.email
        });

    });
};
