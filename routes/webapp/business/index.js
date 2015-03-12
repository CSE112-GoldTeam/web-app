var express = require('express');
var router = express.Router();


//Define the controllers for checkin process
var landing = require('./landing');
var theming = require('./theming');
var login = require('./login');
var formbuilder = require('./formbuilder');
var accountSettings = require('./accountsettings');
var uploadLogo = require('./uploadlogo');
var register = require('./register');
var dashboard = require('./dashboard');
var registerDevice = require('./registerdevice');
var addEmployees = require('./addemployees');
var employeeRegister = require('./employeeregister');
var viewForm = require('./viewform');
var customizeTheme = require('./customize_theme');
var manageForms = require('./manage_forms');

module.exports = function (passport) {



    //Pass in passport

    //Setup the routes
    router.get('/', landing.get);
    router.post('/', landing.post);

    router.get('/theming', theming.get);

    router.get('/login', login.get);
    router.post('/login',passport.authenticate('local-login',{
        successRedirect : '/dashboard',
        failureRedirect : '/login'
    }));

    router.get('/formbuilder',isLoggedInBusiness, formbuilder.get);

    router.get('/accountSettings', isLoggedInEmployee, accountSettings.get);
    router.post('/accountSettings', isLoggedInEmployee, accountSettings.post);

    router.get('/uploadlogo', uploadLogo.get);
    router.post('/uploadlogo', uploadLogo.post);

    router.get('/register', register.get);
    router.post('/register',passport.authenticate('local-signup',{
        successRedirect : '/dashboard', // redirect to the secure profile section
        failureRedirect : '/register' // redirect back to the signup page if there is an error
    }));

    router.get('/dashboard', isLoggedInBusiness, dashboard.get);

    router.get('/registerdevice', registerDevice.get);

    router.get('/addemployees',isLoggedInBusiness, addEmployees.get);
    router.post('/addemployees',isLoggedInBusiness, addEmployees.post);

    router.get('/customizetheme', customizeTheme.get);

    router.get('/manageforms', manageForms.get);

    router.get('/employeeregister', employeeRegister.get);
    router.post('/employeeregister', passport.authenticate('local-signup-employee',{
        successRedirect : '/dashboard', // redirect to the secure profile section
        failureRedirect : '/register' // redirect back to the signup page if there is an error
    }));

    router.get('/viewform/:id', viewForm.get);


function isLoggedInEmployee(req,res,next){
        if((req.isAuthenticated() && (req.user.Employee.length === 1))){
            return next();
        }

        res.redirect('/');
    }

// route middleware to make sure a user is logged in
function isLoggedInBusiness(req, res, next) {

    // if user is authenticated in the session, carry on
    if ((req.isAuthenticated()&& (req.user.Business.length === 1))) {
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/');
}


    return router;
};
