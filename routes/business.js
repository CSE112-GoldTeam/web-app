var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/sample', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/registration', function (req, res, next) {
    res.render('registration');
});

module.exports = router;
