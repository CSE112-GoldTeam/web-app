var express = require('express');
var router = express.Router();

//Define the controllers for checkin process
var checkin = require('./checkin');
var nocode = require('./nocode');
var apptinfo = require('./apptinfo');
var customform = require('./customform');
var sign = require('./sign');
var done = require('./done');

//Setup the routes
router.get('/checkin', checkin.get);

router.get('/nocode', nocode.get);
router.post('/nocode', nocode.post);

router.get('/apptinfo', apptinfo.get);

router.get('/customform', customform.get);
router.post('/customform', customform.post);

router.get('/sign', sign.get);
router.post('/sign', sign.post);

router.get('/done', done.get);

module.exports = router;
