var express = require('express');
var router = express.Router();

var appointmentsToday = require('./appointmentstoday');
var setApptState = require('./set_appt_state');
var formResponse = require('./form_response');

router.get('/employee/:eid/appointments/today', appointmentsToday.get);

router.put('/appointments/:id/state', setApptState.put);

router.get('/formResponses/appointments/:id', formResponse.get);

module.exports = router;
