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
router.get('/:id/checkin', checkin.get);

router.get('/:id/nocode', nocode.get);
router.post('/:id/nocode', nocode.post);

router.get('/:id/apptinfo', apptinfo.get);

router.get('/:id/customform', customform.get);
router.post('/:id/customform', customform.post);

router.get('/:id/sign', sign.get);
router.post('/:id/sign', sign.post);

router.get('/:id/done', done.get);

module.exports = router;
