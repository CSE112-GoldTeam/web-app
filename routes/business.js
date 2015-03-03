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


//Employee Signup

router.get('/addemployees' ,function (req,res){
    var db =  req.db;
    var csvEmployees = db.get('csvEmployees');
    csvEmployees.find({registrationToken: {$exists: false}},function (err,results){

        if (err) { return res.sendStatus(500, err); }
        if(!results) { return res.send(404,'User not found');}
        
      
        employee = results[0];
       
    
    });

    csvEmployees.find({registrationToken: {$exists: true}}, function (err,results){


        if (err) { return res.sendStatus(500, err); }
        if(!results) { return res.send(404,'User not found');}
        
        notemployee = results[0];

    });



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
        'http://robobetty/register/' + token 
    }, function (err, json) {
        if (err) {
            return console.error(err);
        }
        var db =  req.db;
        var csvEmployees = db.get('csvEmployees');
        csvEmployees.insert({
            name: username,
            email: email,
            registrationToken : token,
        });       
    });
      res.redirect('/addemployees');
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



function randomToken() {
    return crypto.randomBytes(20).toString('hex');
}

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
