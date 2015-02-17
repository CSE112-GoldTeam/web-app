var express = require('express');
var _ = require('underscore');
var router = express.Router();

//No associated use case so far
router.get('/office/:id/done', function (req, res, next) {
    res.render('checkin/done', {title: 'Express'});
});

//Appointment Info
router.get('/office/:id/apptinfo', function (req, res, next) {
    res.render('checkin/apptinfo', {title: 'Express'});
});

//Enter Code
router.get('/office/:id/entercode', function (req, res, next) {
    res.render('checkin/entercode', {title: 'CompanyName'});
});

//No Code
router.get('/office/:id/nocode', function (req, res, next) {
    res.render('checkin/nocode', {title: 'Express'});
});

//Checkin Start
router.get('/office/:id/checkin', function (req, res, next) {
    res.render('checkin/checkin', {title: 'Express'});
});

//Custom Form
function makeDropdown(options, index) {
    var s = '<select class="form-control" name="_'+index+'" id="_'+index+'">';
    _.each(options, function (option) {
        s += '<option value="'+option+'">'+option+'</option> ';
    });
    s+= '</select>';
    return s;
}


function makeTextfield(index) {
    return'<input type="text" class="form-control" name="_'+index+'" id="_' + index + '">';
}

function makeFormGroup(field, index) {
    var s = '<div class="form-group">';
    s += '<label for="_' + index + '" class="col-md-2 control-label">' + field.label + '</label>';

    s += '<div class="col-md-10">';
    if (field.type === 'textbox') {
        s += makeTextfield(index);
    } else if (field.type === 'dropdown') {
        s += makeDropdown(field.options, index);
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
 * Custom Form POST route. Called when the user submits a form. If the form
 * is valid then it redirects to the next page, otherwise it will show an error.
 */
router.post('/office/:id/customform', function (req, res, next) {
    console.log(req.body);
    res.send('Testing');
});

router.get('/office/:id/customform', function (req, res, next) {
    var db = req.db;
    var businesses = db.get('businesses');
    var forms = db.get('forms');

    //Find the business and get their form
    businesses.find({_id: req.params.id}, function (err, results) {
        var business = results[0]; //TODO: This assumes there is a result
        forms.find({business: business._id}, function (err, results) {
            var form = results[0]; //TODO: This also assumes there is a result
            var formHtml = '<form class="form-horizontal" method="post" action="customform" enctype="application/x-www-form-urlencoded">';

            _.each(form.fields, function (field, index) {
                formHtml += makeFormGroup(field, index);
            });

            formHtml += makeSubmitButton();

            formHtml += '</form>';

            res.render('checkin/customform', {title: 'Express', formHtml: formHtml});
        });
    });
});

module.exports = router;
