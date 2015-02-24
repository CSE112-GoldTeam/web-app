var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var session = require('express-session');

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
router.use(session({
    secret: '1234567890QWERTY',
    resave: false,
    saveUninitialized: true
}));

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

//Form Builder
router.get('/formbuilder', function (req, res, next) {
    res.render('business/formbuilder', {title: 'Express'});
});

//Device Reg
router.get('/registerDevice', function (req,res, next) {
    res.render('business/registerDevice', {title: 'Express'});
});

router.post('/register', function(req, res) {
    var db = req.db;
    var companyName = req.body.companyName;
    var username = req.body.username;
    var email = req.body.email;
    var phone = req.body.phone;
    var password = req.body.password;

    // Check if any field has been left blank
    if(companyName === '' || username === '' || email === ''
        ||  phone === '' || password === ''){
        res.render('business/register', {
            error: 'You must fill in all fields.',
            companyName: companyName,
            phone: phone,
            username : username,
            email: email,
        });
    } else {
        // Set our collection
        var collection = db.get('businesses');

        // Submit to the db
        collection.insert({
            "companyName" : companyName,
            "username" : username,
            "password" : password,
            "email" : email,
            "phone" : phone,
            "logo" : '',
            "walkins" : false
        }, function (err, doc) {
            if (err) {
                console.error('Error registering new company:', err);

                // If it failed, return error
                res.send("there was a problem adding the information to the database.");
            }
            else {
               res.redirect('config');
            }
        });
    }
});

module.exports = router;
