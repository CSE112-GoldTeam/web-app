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
router.get('/viewform', function (req, res, next) {
    res.render('business/viewform', {title: 'Express'});
});

//Dashboard dashboard
router.get('/dashboard', function (req, res, next) {
    res.render('business/dashboard', {title: 'Express'});
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

module.exports = router;
