var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/sample', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

/* GET landing page.*/
router.get('/landing', function (req, res, next) {
    res.render('landing', {title: 'Landing'});
});

module.exports = router;
