var express = require('express');
var router = express.Router();

//Define the controllers
var checkin = require('./checkin/checkin');
var nocode = require('./checkin/nocode');
var apptinfo = require('./checkin/apptinfo');
var customform = require('./checkin/customform');
var sign = require('./checkin/sign');
var done = require('./checkin/done');

//Setup the routes
router.get('/office/:id/checkin', checkin.get);

router.get('/office/:id/nocode', nocode.get);
router.post('/office/:id/nocode', nocode.post);

router.get('/office/:id/apptinfo', apptinfo.get);

router.get('/office/:id/customform', customform.get);
router.post('/office/:id/customform', customform.post);

router.get('/office/:id/sign', sign.get);
router.post('/office/:id/sign', sign.post);

router.get('/office/:id/done', done.get);

module.exports = router;
