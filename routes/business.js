var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/sample', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

<<<<<<< HEAD
router.get('/manageForms', function (req, res, next) {
    res.render('manageForms', {title: 'Express'});
=======
router.get('/settings', function (req, res, next) {
    res.render('settings', {title: 'Express'});
>>>>>>> develop
});

module.exports = router;
