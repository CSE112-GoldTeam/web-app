var express = require('express');
var router = express.Router();

var appointmentsToday = require('./appointmentstoday');
var setApptState = require('./set_appt_state');
var formResponse = require('./form_response');
var signature = require('./signature');
var form = require('./form_request');
var updateStyle = require('./update_style');

router.get('/employee/:eid/appointments/today', appointmentsToday.get);

router.put('/appointments/:id/state', setApptState.put);

router.get('/formResponses/appointments/:id', formResponse.get);

router.get('/signature', signature.getDefault);
router.get('/signature/:text', signature.get);

router.post('/form', form.createForm);
router.put('/form', form.updateForm);
router.put('/style', isLoggedInBusiness, updateStyle.put);

function isLoggedInBusiness(req, res, next) {

    // if user is authenticated in the session, carry on
    if ((req.isAuthenticated()&& (req.user.Business.length === 1))) {
        return next();
    }

    // if they aren't redirect them to the home page
    res.send('');
}

module.exports = router;
