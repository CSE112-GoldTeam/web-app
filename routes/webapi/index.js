var express = require('express');
var router = express.Router();

var appointmentsToday = require('./appointmentstoday');
var setApptState = require('./set_appt_state');
var formResponse = require('./form_response');
var signature = require('./signature');

router.get('/employee/:eid/appointments/today', appointmentsToday.get);

router.put('/appointments/:id/state', setApptState.put);

router.get('/formResponses/appointments/:id', formResponse.get);

router.get('/signature', signature.getDefault);
router.get('/signature/:text', signature.get);

module.exports = router;
