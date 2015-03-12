'use strict';

var express = require('express');
var controller = require('./appointment.controller');

var router = express.Router();
var auth = require('../../../lib/auth');


/**
 * @api {get} /api/m/appointment?fname=John&lname="Doe"&dob="05/13/1965"
 * @apiName GetAppointmentConfirm
 * @apiGroup Appointment
 *
 * @apiParam {String} fname Firstname of the User.
 * @apiParam {String} lname Lastname of the User.
 *
 * @apiSuccess {String} fname Firstname of the User.
 */
router.get('/', controller.confirm);

/**
 * GET appointment information
 */
router.get('/:id', auth.isAuthenticated, controller.retrieve);

/**
 * PUT transistion states
 */
router.put('/:id/state/next', controller.nextState);

/**
 * PUT setting sates
 */
router.put('/:id/state', controller.updateState);


module.exports = router;
