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
    register.init(passport);

    //Setup the routes
    router.get('/', landing.get);
    router.post('/', landing.post);

    router.get('/theming', theming.get);

    router.get('/login', login.get);
    router.post('/login', login.post);

    router.get('/formbuilder', formbuilder.get);

    router.get('/accountSettings', accountSettings.get);
    router.post('/accountSettings', accountSettings.post);

    router.get('/uploadlogo', uploadLogo.get);
    router.post('/uploadlogo', uploadLogo.post);

    router.get('/register', register.get);
    router.post('/register', register.post);

    router.get('/dashboard', dashboard.get);

    router.get('/registerdevice', registerDevice.get);

    router.get('/addemployees', addEmployees.get);
    router.post('/addemployees', addEmployees.post);

    router.get('/employeeregister', employeeRegister.get);
    router.post('/employeeregister', employeeRegister.post);

    router.get('/viewform/:id', viewForm.get);


    return router;
};
