var ObjectID = require('mongodb').ObjectID;

exports.get = function(req, res) {
    var db = req.db;
    var businesses = db.get('businesses');

    businesses.find({_id: ObjectID(req.params.id)}, function (err, results) {
        //TODO: Verify that there are results and no errors
        var business = results[0];
        res.render('checkin/sign', {
            title: 'Express',
            disclosure: business.disclosure
        });
    });
};

exports.post = function (req, res) {
    var sig = req.body.sig.trim();
    if (sig === '') {
        var db = req.db;
        var businesses = db.get('businesses');

        businesses.find({_id: ObjectID(req.params.id)}, function (err, results) {
            //TODO: Verify that there are results and no errors
            var business = results[0];
            res.render('checkin/sign', {
                title: 'Express',
                disclosure: business.disclosure,
                error: 'You must provide a signature'
            });
        });
    } else {
        //Update the state of the appointment
        var appointmentId = req.session.appointmentId;
        req.db.get('appointments').update({_id: ObjectID(appointmentId)}, {
            $set: {
                state: 'checkedIn'
            }
        }, function () {
            res.redirect('done');
        });
    }
};
