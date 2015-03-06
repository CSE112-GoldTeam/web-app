var ObjectID = require('mongodb').ObjectID;

exports.get = function (req, res) {
    res.render('checkin/nocode', {title: 'Express'});
};

exports.post = function (req, res) {
    var db = req.db;
    var appointments = db.get('appointments');
    var dobFormatErr = 'Please enter your Date of Birth in MM/DD/YYYY format';
    var monthValErr = 'Please enter MM value between 01 and 12';
    var dayValErr = 'Please enter DD value between 01 and 31';

    var inputFirst = req.body.inputFirst;
    var inputLast = req.body.inputLast;
    var inputDOB = req.body.inputDOB;
    var dobSubStr = req.body.inputDOB;
    var numSlash = inputDOB.match(/\//g).length;

    if (numSlash !== 2) {
        res.render('checkin/nocode', {
            error: dobFormatErr,
            inputFirst: inputFirst,
            inputLast: inputLast,
            inputDOB: inputDOB
        });
    }

    var firstSep = dobSubStr.indexOf('/');
    var inputMonth = dobSubStr.substring(0, firstSep);

    if (inputMonth.length > 2) {
        res.render('checkin/nocode', {
            error: dobFormatErr,
            inputFirst: inputFirst,
            inputLast: inputLast,
            inputDOB: inputDOB
        });
    }

    dobSubStr = dobSubStr.substring(firstSep+1);
    var secondSep = dobSubStr.indexOf('/');
    var inputDay = dobSubStr.substring(0, secondSep);

    if (inputDay.length > 2) {
        res.render('checkin/nocode', {
            error: dobFormatErr,
            inputFirst: inputFirst,
            inputLast: inputLast,
            inputDOB: inputDOB
        });
    }

    var inputYear = dobSubStr.substring(secondSep+1);

    if (inputYear.length !== 4)
    {
        res.render('checkin/nocode', {
            error: dobFormatErr,
            inputFirst: inputFirst,
            inputLast: inputLast,
            inputDOB: inputDOB
        });
    }

    var monthInt = parseInt(inputMonth);

    if (monthInt < 1 || monthInt > 12)
    {
        res.render('checkin/nocode', {
            error: monthValErr,
            inputFirst: inputFirst,
            inputLast: inputLast,
            inputDOB: inputDOB
        });
    }
    else if (monthInt < 10 && inputMonth.length === 1)
    {
        inputMonth = '0' + inputMonth;
    }

    var dayInt = parseInt(inputDay);

    if (dayInt < 1 || dayInt > 31)
    {
        res.render('checkin/nocode', {
            error: dayValErr,
            inputFirst: inputFirst,
            inputLast: inputLast,
            inputDOB: inputDOB
        });
    }
    else if (dayInt < 10 && inputDay.length === 1)
    {
        inputDay = '0' + inputDay;
    }

    inputDOB = inputMonth + '/' + inputDay + '/' + inputYear;

    appointments.find({business: ObjectID(req.params.id), fname: inputFirst, lname: inputLast, dob: inputDOB}, function(err, result) {
        if (result.length === 0) {
            res.render('checkin/nocode', {
                error: 'No appointment found',
                inputFirst: inputFirst,
                inputLast: inputLast,
                inputDOB: inputDOB
            });
        }
        else {
            var appt = result[0];
            var apptID = appt._id;
            req.session.appointmentId = apptID;
            req.session.save(function (err) {
                if (err) {
                    console.error('Session save error:', err);
                }
                res.redirect('apptinfo');
            });
        }
    });
};
