var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/sample', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

/* GET enter code page. */
router.get('/code', function (req, res, next) {
    res.render('code', {title: 'CompanyName'});
});

module.exports = router;
