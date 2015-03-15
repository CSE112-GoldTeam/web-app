var express = require('express');
var router = express.Router();

var appointmentsToday = require('./appointmentstoday');
var setApptState = require('./set_appt_state');
var formResponse = require('./form_response');
var signature = require('./signature');
var form = require('./form_request');

router.get('/employee/:eid/appointments/today', appointmentsToday.get);

router.put('/appointments/:id/state', setApptState.put);

router.get('/formResponses/appointments/:id', formResponse.get);

router.get('/signature', signature.getDefault);
router.get('/signature/:text', signature.get);

router.post('/form', form.createForm);
router.put('/form', form.updateForm);

module.exports = router;
