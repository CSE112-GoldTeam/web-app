var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/sample', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


router.get('/registration', function (req, res, next) {
    res.render('registration');
});

/* GET landing page.*/
router.get('/landing', function (req, res, next) {
    res.render('landing', {title: 'Landing'});
});

router.get('/manageForms', function (req, res, next) {
    res.render('manageForms', {title: 'Express'});
});


/* GET enter code page. */
router.get('/code', function (req, res, next) {
    res.render('code', {title: 'CompanyName'});
});

router.get('/settings', function (req, res, next) {
    res.render('settings', {title: 'Express'});
});

module.exports = router;
