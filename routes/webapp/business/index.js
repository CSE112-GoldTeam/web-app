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

module.exports = function (passport) {
    //Pass in passport
    login.init(passport);

    

    //Setup the routes
    router.get('/', landing.get);

    router.get('/theming', theming.get);

    router.get('/login', login.get);
    router.post('/login', login.post);

    router.get('/formbuilder', formbuilder.get);

    router.get('/accountSettings', accountSettings.get);
    router.post('/accountSettings', accountSettings.post);

    router.get('/uploadlogo', uploadLogo.get);
    router.post('/uploadlogo', uploadLogo.post);

    router.get('/register', register.get);
    router.post('/register',passport.authenticate('local-signup',{
        successRedirect : '/config', // redirect to the secure profile section
        failureRedirect : '/register' // redirect back to the signup page if there is an error
    }));

    router.get('/dashboard', dashboard.get);

    router.get('/registerdevice', registerDevice.get);

    router.get('/addemployees', addEmployees.get);
    router.post('/addemployees', addEmployees.post);

    router.get('/employeeregister', employeeRegister.get);
    router.post('/employeeregister', passport.authenticate('local-signup-employee',{
        successRedirect : '/config', // redirect to the secure profile section
        failureRedirect : '/register' // redirect back to the signup page if there is an error
    }));

    router.get('/viewform/:id', viewForm.get);

    return router;
};
