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

//Enter Code
router.get('/entercode', function (req, res, next) {
    res.render('checkin/entercode', {title: 'CompanyName'});
});

//Office Configuration
router.get('/config', function (req, res, next) {
    res.render('config', {title: 'Express'});
});

module.exports = router;
