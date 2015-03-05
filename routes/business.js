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


//Account Settings
router.get('/accountSettings', function (req,res) {
		var eid = '54ecaa5cfb4974129dc2050f';
		var db = req.db;
		var employees = db.get('employees');

		var fname;
		var lname;
		var phone;
		var sms;
		var email;
		
		employees.find({_id: eid}, function (err, result) {
			var emp = result[0];
			var phone = emp.phone;
			phone = phone.slice(0, 3) + "-" + phone.slice(3, 6) + "-" + phone.slice(6);
			res.render('business/accountsettings', {
				title: 'Express',
				fname: emp.fname,
				lname: emp.lname,
				password: emp.password,
				phone: phone,
				email: emp.email,
				smsNotify: emp.smsNotify,
				emailNotify: emp.emailNotify
			});
		});
});

router.post('/accountSettings', function (req, res) {
	var db = req.db;
	var employees = db.get('employees');
	var eid = '54ecaa5cfb4974129dc2050f';

	var inputPass = req.body.editPassword;
	var inputEmail = req.body.editEmail;
	var inputPhone = req.body.editPhone;
	var textNotify = req.body.sendText;
	var emailNotify = req.body.sendEmail;

	if (inputPass != null)
	{
		employees.findAndModify({_id: eid}, { $set: {password: inputPass}}, function(err, data)
		{
			if (err) { return handleError(res, err);}
			
			employees.find({_id: eid}, function (err, result) {
				var emp = result[0];
				var phone = emp.phone;
				phone = phone.slice(0, 3) + "-" + phone.slice(3, 6) + "-" + phone.slice(6);
				res.render('business/accountsettings', {
					title: 'Express',
					fname: emp.fname,
					lname: emp.lname,
					password: emp.password,
					phone: phone,
					email: emp.email,
					smsNotify: emp.smsNotify,
					emailNotify: emp.emailNotify,
					edited: "Password successfully changed!"
				});
			});
		});
	}

	if (inputEmail != null)
	{
		employees.findAndModify({_id: eid}, { $set: {email: inputEmail}}, function(err, data)
		{
			if (err) { return handleError(res, err);}
		
			employees.find({_id: eid}, function (err, result) {
				var emp = result[0];
				var phone = emp.phone;
				phone = phone.slice(0, 3) + "-" + phone.slice(3, 6) + "-" + phone.slice(6);
				res.render('business/accountsettings', {
					title: 'Express',
					fname: emp.fname,
					lname: emp.lname,
					password: emp.password,
					phone: phone,
					email: emp.email,
					smsNotify: emp.smsNotify,
					emailNotify: emp.emailNotify,
					edited: "Email successfully changed!"
				});
			});
		});
	}

	if (inputPhone != null)
	{
		inputPhone = inputPhone.replace(/-/g, "");
		
		if (inputPhone.length === 10)
		{
			employees.findAndModify({_id: eid}, { $set: {phone: inputPhone}}, function(err, data)
			{
				if (err) { return handleError(res, err);}
		
				employees.find({_id: eid}, function (err, result) {
					var emp = result[0];
					var phone = emp.phone;
					phone = phone.slice(0, 3) + "-" + phone.slice(3, 6) + "-" + phone.slice(6);
					res.render('business/accountsettings', {
						title: 'Express',
						fname: emp.fname,
						lname: emp.lname,
						password: emp.password,
						phone: phone,
						email: emp.email,
						smsNotify: emp.smsNotify,
						emailNotify: emp.emailNotify,
						edited: "Phone number successfully changed!"
					});
				});
			});
		}
		else
		{
			employees.find({_id: eid}, function (err, result) {
				var emp = result[0];
				var phone = emp.phone;
				phone = phone.slice(0, 3) + "-" + phone.slice(3, 6) + "-" + phone.slice(6);
				res.render('business/accountsettings', {
					title: 'Express',
					fname: emp.fname,
					lname: emp.lname,
					password: emp.password,
					phone: phone,
					email: emp.email,
					smsNotify: emp.smsNotify,
					emailNotify: emp.emailNotify,
					alert: "Incorrect phone number format"
				});
			});
		}
	}

	if (textNotify != null)
	{
		if (textNotify === "0")
		{
			var smsSet = false;
		}
		else
		{
			var smsSet = true;
		}

		employees.findAndModify({_id: eid}, { $set: {smsNotify: smsSet}}, function(err, data)
		{
			if (err) { return handleError(res, err);}
		
			employees.find({_id: eid}, function (err, result) {
			var emp = result[0];
			var phone = emp.phone;
			phone = phone.slice(0, 3) + "-" + phone.slice(3, 6) + "-" + phone.slice(6);
			res.render('business/accountsettings', {
				title: 'Express',
				fname: emp.fname,
				lname: emp.lname,
				password: emp.password,
				phone: phone,
				email: emp.email,
				smsNotify: emp.smsNotify,
				emailNotify: emp.emailNotify,
				edited: "SMS notification settings successfully changed!"
				});
			});
		});
	}

	if (emailNotify != null)
	{
		if (emailNotify === "0")
		{
			var emailSet = false;
		}
		else
		{
			var emailSet = true;
		}

		employees.findAndModify({_id: eid}, { $set: {emailNotify: emailSet}}, function(err, data)
		{
			if (err) { return handleError(res, err);}
		
			employees.find({_id: eid}, function (err, result) {
			var emp = result[0];
			var phone = emp.phone;
			phone = phone.slice(0, 3) + "-" + phone.slice(3, 6) + "-" + phone.slice(6);
			res.render('business/accountsettings', {
				title: 'Express',
				fname: emp.fname,
				lname: emp.lname,
				password: emp.password,
				phone: phone,
				email: emp.email,
				smsNotify: emp.smsNotify,
				emailNotify: emp.emailNotify,
				edited: "Email notification settings successfully changed!"
				});
			});
		});
	}

});

return router;
};
