var express = require('express');
var router = express.Router();


//Company Registration
router.get('/register', function (req, res, next) {
    res.render('business/register');
});

//Landing Page
router.get('/', function (req, res, next) {
    res.render('business/landing', {title: 'Landing Page'});
});

//Office Configuration
router.get('/config', function (req, res, next) {
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

router.put('/api/formResponses/:id/state', function (req, res, next) {
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

module.exports = router;
