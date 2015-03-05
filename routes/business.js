var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var sendgrid  = require('sendgrid')('robobetty', 'NoKcE0FGE4bd');
var crypto = require('crypto');
var baby = require('babyparse');
// var session = require('express-session');


module.exports = function(passport){

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


/**
 * GET company registration
 * @param {Object} req
 * @param {Object} res
 */
router.get('/register', function (req, res) {

    if (!req.session.companyName) {
        res.render('business/register');
    } else {
        res.render('business/register', {title: 'Express', companyName: req.session.companyName});
    }
});


/**
 * GET company landing page
 * @param {Object} req
 * @param {Object} res
 */
router.get('/', function (req, res) {
    res.render('business/landing');
});


router.post('/', function (req, res) {

    var companyName = req.body.companyName;

    if (companyName === '') {
        res.redirect('/register');
    } else {
        req.session.companyName = companyName;

        req.session.save(function (err) {
            if (err) {
                console.error('Error saving session', err);
            }
        });

        res.redirect('/register');
    }

});


/**
 * GET company login
 * @param {Object} req
 * @param {Object} res
 */
router.get('/login', function(req, res) {
    res.render('business/login.hjs');
});

/**
 * POST the success of failure of user authetication
 */
router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/config',
    failureRedirect : '/login'
}));

/**
 * GET company configuration
 * @param {Object} req
 * @param {Object} res
 */
router.get('/config', isLoggedIn, function (req, res) {
    res.render('business/config', {title: 'Express'});
});

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
	// query the collection
	response.find({ appointment : req.params.id }, function(err, data) {
        if (err) { return res.sendStatus(500, err); }
        return res.render('business/viewform', {title: req.params.id, formData : data[0].answers });
	});
});

/**
 * GET company dashboard
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
router.get('/dashboard', function (req, res, next) {
    res.render('business/dashboard', {title: 'Express'});
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
 * GET form builder
 * @param {Object} req
 * @param {Object} res
 */
router.get('/formbuilder', function (req, res) {
    res.render('business/formbuilder', {title: 'Express'});
});

//Logo Upload
router.get('/uploadLogo',function(req,res){
    res.render('business/uploadLogo',{title:'Upload Logo'});
});

router.post('/api/photo',function(req,res){

    var db = req.db;
    var businesses = db.get('businesses');

    if(req.files.userLogo){

        var businessID = req.body.business;

        businesses.update(
        {
            _id:businessID
        },{ 
            $set: {
                logo: '/static/images/'+req.files.userLogo.name
            }
        },{ 
            upsert: true
        }, function (err){

            if (err) {
                console.error('MongoDB Error in /api/photo: ' + err);
                return res.send(500);
            }

            res.render('business/uploadLogo',{
                success:'Succesfully uploaded file: '+req.files.userLogo.originalname
            });

        });
        
    }
    else{
        res.render('business/uploadLogo',{
            error:'Please select a valid image(png,jpg) file to upload.'
        });
    }
   
});


//Employee Signup

router.get('/addemployees' ,function (req,res){
    var db =  req.db;
    var csvEmployees = db.get('csvEmployees');
    csvEmployees.find({registrationToken: {$exists: false}},function (err,results){

        if (err) { return res.sendStatus(500, err); }
        if(!results) { return res.send(404,'User not found');}

        employee = results;

    })

    csvEmployees.find({registrationToken: {$exists: true}}, function (err,results){


        if (err) { return res.sendStatus(500, err); }
        if(!results) { return res.send(404,'User not found');}

        notemployee = results;

    })



     res.render('business/addemployees',{title: 'Express',notsigned: notemployee, signed: employee});

});




router.post('/addemployees',function (req,res){


    parsed = baby.parse(req.body.csvEmployees);
    rows = parsed.data;




    username = rows[0][0];
    email = rows[0][1];

    var token = randomToken();


      sendgrid.send({
        to: email,
        from: 'test@localhost',
        subject: 'Employee Signup',
        text: 'Hello ' + username + ',\n\n' + 'Please click on the following link, or paste this into your browser to complete sign-up the process: \n\n' +
        'http://robobetty/register/?token=' + token
    }, function (err, json){
        if (err) {
            return console.error(err);
        }
        var db =  req.db;
        var csvEmployees = db.get('csvEmployees');
        csvEmployees.insert({
        name: username,
        email: email,
        registrationToken : token,
    },{
        w: 1
    }, function (err){
        if (err) {
            return console.error(err);
        }
        res.redirect('/addemployees');
    })
    });

});





router.get('/employeeregister',function(req,res){
    res.render('business/registeremployees');
});


router.post('/employeeregister',function (req,res){

    var db =req.db
    var employee = db.get('csvEmployees');

    employee.update({'token': req.query.token}, function (err,results){



    });

});


/**
 * POST user regisration
 */
router.post('/register', passport.authenticate('local-signup',{
    successRedirect : '/config', // redirect to the secure profile section
    failureRedirect : '/register' // redirect back to the signup page if there is an error
}));

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


/**
 * GET device regisration
 * @param {Object} req
 * @param {Object} res
 */
router.get('/registerDevice', function (req,res) {
    res.render('business/registerDevice', {title: 'Express'});
});

//Account Settings
router.get('/accountSettings', function (req, res) {
		res.render('business/accountsettings', {title: 'Express'});
});

 return router;
};
