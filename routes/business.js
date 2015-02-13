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

//Dashboard dashboard
router.get('/dashboard', function (req, res, next) {
    res.render('business/dashboard', {title: 'Express'});
});

module.exports = router;
