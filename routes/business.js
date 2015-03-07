var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var crypto = require('crypto');


module.exports = function(passport){

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
/**
 * GET form responses from the id
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns the view form with the data that the user entered
 */
router.get('/viewform/:id', function (req, res, next) {
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
});



function randomToken() {
    return crypto.randomBytes(20).toString('hex');
}

/**
 * Makes sure that the user logged in is authenticated
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns the session if the user is authenticated if not redirects them to the home page.
 */
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/');
}

return router;
};
