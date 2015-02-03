var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/sample2', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/formscomplete', function (req, res, next) {
  res.render('formscomplete', {title: 'Express'});
});

router.get('/welcome', function (req, res, next) {
    res.render('welcome', {title: 'Express'});
});

router.get('/walkin', function (req, res, next) {
    res.render('walkin', {title: 'Express'});
});

router.get('/checkin', function (req, res, next) {
    res.render('checkin', {title: 'Express'});
});

module.exports = router;
