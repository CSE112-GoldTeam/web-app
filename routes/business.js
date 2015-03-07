var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
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

    /**
 * GET company form appointment responses
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns the appointments of the user
 */
router.get('/api/formResponses/appointments/:id', function (req, res, next) {
     	// grab our db object from the request
	var db = req.db;
	var response = db.get('formResponses');
	// query the collection
	response.find({ appointments : req.params.id }, function(err, data) {
        if (err) { return res.sendStatus(500, err); }
		return res.json(200, data);
	});
});


/**
 * PUT company appointments states
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns the state of the appointment
 */
router.put('/api/appointments/:id/state', function (req, res, next) {

	 // grab our db object from the request
	var db = req.db;
	var appt = db.get('appointments');
	// query the collection
    appt.find({_id:req.params.id},function(err,data){
        var myState = {};
        if (data[0].state == 'checkedIn'){
            myState = {$set: {state : "roomed"}};
        } else if (data[0].state == 'roomed'){
            myState = {$set: {state : "done"}};
        }

        appt.findAndModify({_id:req.params.id }, myState, function(err, data) {
            if (err) { return res.sendStatus(500, err); }
            return res.json(200, data);
        });
    });

});

/**
 * GET appointment for today
 * @param {Object} req
 * @param {Object} res
 * @returns the appointments for today
 */
router.get('/api/employee/:eid/appointments/today', function (req, res) {
    var db = req.db;
    var appointments = db.get('appointments');

    //Get the start and end of today
    var begin = new Date();
    begin.setHours(0,0,0,0);

    var end = new Date();
    end.setHours(23, 59, 59, 999);

    appointments.find({
        employee: ObjectID(req.params.eid),
        date: {
            $gte: begin,
            $lte: end
        }
    },{sort : {date: 1}}, function (err, results) {
        if (err) {
            console.error('MongoDB Error in /api/employee/:eid/appointments/today: ' + err);
            return res.send(500);
        }
        res.json(results);
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
