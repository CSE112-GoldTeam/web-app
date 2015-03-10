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

/**
 * Exports router with new handlers when module is exported.
 */
module.exports = router;
