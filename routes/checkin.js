var express = require('express');
var _ = require('underscore');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

//No associated use case so far
router.get('/office/:id/done', function (req, res) {
    res.render('checkin/done', {title: 'Express'});
});

//Appointment Info
router.get('/office/:id/apptinfo', function (req, res) {
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
});

//Enter Code
router.get('/office/:id/entercode', function (req, res) {
    res.render('checkin/entercode', {title: 'CompanyName'});
});

//No Code
router.get('/office/:id/nocode', function (req, res) {
    res.render('checkin/nocode', {title: 'Express'});
});



//Checkin Start
router.get('/office/:id/checkin', function (req, res) {
    res.render('checkin/checkin', {title: 'Express'});
});

//Sig Page
router.get('/office/:id/sign', function(req, res) {
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
});

router.post('/office/:id/sign', function (req, res) {
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
});

//Custom Form
function makeDropdown(options, name, body) {
    var s = '<select class="form-control" name="'+name+'" id="'+name+'">';
    _.each(options, function (option) {
        s += '<option value="'+option+'" ' + (body[name] === option ? 'selected' : '') + '>'+option+'</option> ';
    });
    s+= '</select>';
    return s;
}


function makeTextfield(name, body) {
    return'<input type="text" class="form-control" name="'+name+'" id="' + name + '"value="' + (body[name] || '') + '">';
}

function makeFormGroup(field, index, body) {
    var name = '_' + index;

    var s = '<div class="form-group">';
    s += '<label for="' + name + '" class="col-md-2 control-label">' + field.label + '</label>';

    s += '<div class="col-md-10">';
    if (field.type === 'textfield') {
        s += makeTextfield(name, body);
    } else if (field.type === 'dropdown') {
        s += makeDropdown(field.options, name, body);
    }
    s += '</div>';

    s += '</div>';
    return s;
}

function makeSubmitButton() {
    var s = '<div class="form-group">';
    s += '<div class="col-sm-offset-2 col-sm-10">';
    s += '<button type="submit" class="btn btn-default">Submit</button>';
    s += '</div>';
    s += '</div>';

    return s;
}
/**
 *
 *
 * @param db The MongoDB object
 * @param businessId The id for the business
 * @param body The form body (used to prefill form)
 * @param fn Callback function `fn(formHtml)`
 */
function makeForm(db, businessId, body, fn) {
    var businesses = db.get('businesses');
    var forms = db.get('forms');

    //Find the business and get their form
    businesses.find({_id: businessId}, function (err, results) {
        var business = results[0]; //TODO: This assumes there is a result
        forms.find({business: business._id}, function (err, results) {
            var form = results[0]; //TODO: This also assumes there is a result
            var formHtml = '<form class="form-horizontal" method="post" action="customform" enctype="application/x-www-form-urlencoded">';

            _.each(form.fields, function (field, index) {
                formHtml += makeFormGroup(field, index, body);
            });

            formHtml += makeSubmitButton();

            formHtml += '</form>';

            fn(formHtml);
        });
    });
}

/**
 * Custom Form POST route. Called when the user submits a form. If the form
 * is valid then it redirects to the next page, otherwise it will show an error.
 */
router.post('/office/:id/customform', function (req, res) {
    //Get the DB
    var db = req.db;
    var businesses = db.get('businesses');
    var forms = db.get('forms');

    businesses.find({_id: req.params.id}, function (err, results) {
				var business = results[0]; //TODO: This assumes there is a result
        forms.find({business: business._id}, function (err, results) {
            var form = results[0]; //TODO: This assumes there is a result

            //Ensure that there are all the responses
            var valid = _.every(form.fields, function (field, index) {
                var name = '_' + index;
                //TODO: Validation for dropdowns
                return name in req.body && req.body[name].trim() !== '';
            });

            if (!valid) {
                makeForm(db, req.params.id, req.body, function (formHtml) {
                    res.render('checkin/customform', {
                        title: 'Express',
                        formHtml: formHtml,
                        formError: 'You are missing required fields.'
                    });
                });
            } else { //Form is valid, let's put it into the DB
                var formResponses = db.get('formResponses');
                var formResponse = {answers: []};

                _.each(form.fields, function (field, index) {
                    var name = '_' + index;
                    formResponse.answers.push({
                        label: field.label,
                        response: req.body[name]
                    });
                });

                formResponses.insert(formResponse, function () {
                    //TODO: Error checking

                    //Update the state of the appointment
                    var appointmentId = req.session.appointmentId;
                    db.get('appointments').update({_id: ObjectID(appointmentId)}, {
                       $set: {
                            state: 'formDone'
                       }
                    }, function () {
                        res.redirect('sign');
                    });
                });
            }
        });
    });
});

router.get('/office/:id/customform', function (req, res) {
    var db = req.db; makeForm(db, req.params.id, {}, function (formHtml) {
        res.render('checkin/customform', {
            title: 'Express',
            formHtml: formHtml
        });
    });
});


/*
 * Code that gives nocode functionality when POST
 * detected. Will check db for appropriate info and,
 * if found, save _id to session var and redirect to apptInfo.
 * If input errors detected or no appointment found, error
 * printed on screen
 */
router.post('/office/:id/nocode', function (req, res) {
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

		var firstSep = dobSubStr.indexOf("/");
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
		var secondSep = dobSubStr.indexOf("/");
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
			inputMonth = "0" + inputMonth;
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
			inputDay = "0" + inputDay;
		}

		inputDOB = inputMonth + "/" + inputDay + "/" + inputYear;

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
                        console.error("Session save error:", err);
                    }
                    res.redirect('apptinfo');
                });
			}
		});
});

module.exports = router;
