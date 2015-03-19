/**
 * Loads express module for ExpressJS and establishes router object.
 */
var express = require('express');
var router = express.Router();

/**
 * Loads modules for check-in operations:
 * appointmentsToday,setApptState, formResponse, signature
 */
var appointmentsToday = require('./appointmentstoday');
var setApptState = require('./set_appt_state');
var formResponse = require('./form_response');
var signature = require('./signature');
var form = require('./form_request');
var updateStyle = require('./update_style');

/**
 * Routes get request for url /employee/:eid/appointments/today to the get
 * method in the appointmentsToday module, which shows all appointments for
 * today for the given employee id, :eid.
 */
router.get('/employee/:eid/appointments/today', appointmentsToday.get);

/**
 * Routes put request for url /appointemnts/:id/state to the put method in the
 * setApptState module, which updates the state for the given appointment id,
 * :id, as necessary.
 */
router.put('/appointments/:id/state', setApptState.put);

/**
 * Routes get request for url /formResponses/appointments/:id to the get method
 * in the formResponse module, which obtains all responses to the business'
 * custom form given by client with appointment id, :id.
 */
router.get('/formResponses/appointments/:id', formResponse.get);

/**
 * Routes get request for url /signature/ to the getDefault method in the
 * signature module, which redirects the user to /signature/%20 to avoid
 * errors in rendering signature.
 */
router.get('/signature', signature.getDefault);

/**
 * Routes get request for url /signature/:text to the get method in the
 * signature module, which renders the text, :text, as cursive font.
 */
router.get('/signature/:text', signature.get);


router.post('/form', form.createForm);
router.put('/form', form.updateForm);
router.put('/style', isLoggedInBusiness, updateStyle.put);

function isLoggedInBusiness(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()&& (req.user[0].admin === true)){
        return next();
    }

    // if they aren't redirect them to the home page
    res.send('');
}


/**
 * Exports router with new handlers when module is exported.
 */
module.exports = router;
