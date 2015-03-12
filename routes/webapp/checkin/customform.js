var ObjectID = require('mongodb').ObjectID;
var _ = require('underscore');
var style = require('./../../../lib/style.js');

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
    businesses.findById(businessId, function (err, business) {
        if (err) {
            return fn(err);
        }
        if (!business) {
            return fn(new Error('Business not found: ' + businessId));
        }
        forms.findOne({business: business._id}, function (err, form) {
            if (err) {
                return fn(err);
            }
            if (!form) {
                return fn(new Error('Form not found for business: ' + businessId));
            }

            var formHtml = '<form class="form-horizontal" method="post" action="customform" enctype="application/x-www-form-urlencoded">';

            _.each(form.fields, function (field, index) {
                formHtml += makeFormGroup(field, index, body);
            });

            formHtml += makeSubmitButton();

            formHtml += '</form>';

            fn(null, formHtml);
        });
    });
}

exports.get = function (req, res, next) {
    req.db.get('businesses').findById(req.params.id, function (err, business) {
        if (err) {
            return next(err);
        }

        makeForm(req.db, req.params.id, {}, function (err, formHtml) {
            if (err) {
                return next(err);
            }
            res.render('checkin/customform', {
                formHtml: formHtml,
                companyName: business.companyName,
                bg: business.style.bg,
                logo: business.logo,
                buttonBg: style.rgbObjectToCSS(business.style.buttonBg),
                buttonText: style.rgbObjectToCSS(business.style.buttonText),
                containerText: style.rgbObjectToCSS(business.style.containerText),
                containerBg: style.rgbObjectToCSS(business.style.containerBg)
            });
        });
    });
};

exports.post = function (req, res, next) {
    var db = req.db;
    var businesses = db.get('businesses');
    var forms = db.get('forms');

    businesses.findById(req.params.id, function (err, business) {
        if (err) {
            return next(err);
        }
        if (!business) {
            return next(new Error('Business not found: ' + req.params.id));
        }

        forms.findOne({business: business._id}, function (err, form) {
            if (err) {
                return next(err);
            }
            if (!form) {
                return next(new Error('Form for business not found: ' + business._id));
            }

            //Ensure that there are all the responses
            var valid = _.every(form.fields, function (field, index) {
                var name = '_' + index;
                //TODO: Validation for dropdowns
                return name in req.body && req.body[name].trim() !== '';
            });

            if (!valid) {
                makeForm(db, req.params.id, req.body, function (formHtml) {
                    res.render('checkin/customform', {
                        formHtml: formHtml,
                        formError: 'You are missing required fields.'
                    });
                });
            } else { //Form is valid, let's put it into the DB
                var formResponses = db.get('formResponses');
                var formResponse = {
                    appointment: req.session.appointmentId,
                    answers: []
                };

                _.each(form.fields, function (field, index) {
                    var name = '_' + index;
                    formResponse.answers.push({
                        label: field.label,
                        response: req.body[name]
                    });
                });

                formResponses.insert(formResponse, function (err) {
                    if (err) {
                        return next(err);
                    }

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
};
