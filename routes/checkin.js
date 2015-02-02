var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/sample2', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/welcome', function (req, res, next) {
    res.render('welcome', {title: 'Express'});
});

module.exports = router;
