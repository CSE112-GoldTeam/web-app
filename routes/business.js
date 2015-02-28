var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
// var session = require('express-session');




module.exports = function(passport){

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


//Company Registration
router.get('/register', function (req, res) {
    res.render('business/register');
});

//Landing Page
router.get('/', function (req, res) {
    res.render('business/landing', {title: 'Landing Page'});
});

router.get('/login', function(req, res) {
    res.render('business/login.hjs');
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/config',
    failureRedirect : '/login'
}));

//Office Configuration
router.get('/config', isLoggedIn, function (req, res) {
    res.render('business/config', {title: 'Express'});
});
//dashboard form
router.get('/viewform/:id', function (req, res, next) {
     // grab our db object from the request
	var db = req.db;
	var response = db.get('formResponses');
	// query the collection
	response.find({ appointment : req.params.id }, function(err, data) {
	if (err) { return res.sendStatus(500, err); }
		console.log(data);
		return res.render('business/viewform', {title: req.params.id, formData : data[0].answers });
			});
});

//Dashboard dashboard
router.get('/dashboard', function (req, res, next) {
    res.render('business/dashboard', {title: 'Express'});
});

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


router.get('/api/appointments', function (req, res, next) {
     // grab our db object from the request

	var db = req.db;
	var appt = db.get('appointments');
	// query the collection
	appt.find({ }, function(err, data) {
	if (err) { return res.sendStatus(500, err); }
		return res.json(200, data);
	});
});

router.put('/api/appointments/:id/state', function (req, res, next) {
	console.log("Change State");
     // grab our db object from the request
	var db = req.db;
	var appt = db.get('appointments');
	// query the collection
	appt.findAndModify({_id:req.params.id },{$set: {state : "roomed"}}, function(err, data) {
		console.log("Success");
	if (err) { return res.sendStatus(500, err); }
		return res.json(200, data);
	});
});






//Form Builder
router.get('/formbuilder', function (req, res) {
    res.render('business/formbuilder', {title: 'Express'});
});


router.post('/register', passport.authenticate('local-signup',{
    successRedirect : '/config', // redirect to the secure profile section
    failureRedirect : '/register' // redirect back to the signup page if there is an error
}));

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
    }, [ //Fields to not return
        '-employee',
        '-business'
    ], function (err, results) {
        if (err) {
            console.error('MongoDB Error in /api/employee/:eid/appointments/today: ' + err);
            return res.send(500);
        }
        res.json(results);
    });
});


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/');
}


//Device Reg
router.get('/registerDevice', function (req,res) {
    res.render('business/registerDevice', {title: 'Express'});
});

 return router;
};
