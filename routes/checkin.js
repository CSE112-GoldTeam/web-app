var express = require('express');
var _ = require('underscore');
var router = express.Router();

//No associated use case so far


//Enter Code
router.get('/office/:id/entercode', function (req, res) {
    res.render('checkin/entercode', {title: 'CompanyName'});
});

//No Cod







module.exports = router;
