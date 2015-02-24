var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var router = express.Router();





module.exports = function(passport){

// router.use(bodyParser.json()); // for parsing application/json
// router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


//Company Registration
router.get('/register', function (req, res, next) {
    res.render('business/register');
});

//Landing Page
router.get('/', function (req, res, next) {
    res.render('business/landing', {title: 'Landing Page'});
});

//Office Configuration
router.get('/config', isLoggedIn, function (req, res, next) {
    res.render('business/config', {title: 'Express'});
});

//Form Builder
router.get('/formbuilder', function (req, res, next) {
    res.render('business/formbuilder', {title: 'Express'});
});

router.post('/register', passport.authenticate('local-signup',{
    successRedirect : '/config', // redirect to the secure profile section
    failureRedirect : '/register' // redirect back to the signup page if there is an error
}));



// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    //console.log(req.passport.session);
    // if user is authenticated in the session, carry on 
    console.log(req.isAuthenticated());
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


 return router;
};
