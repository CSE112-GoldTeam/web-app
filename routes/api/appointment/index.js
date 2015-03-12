'use strict';

var express = require('express');
var controller = require('./appointment.controller');

var router = express.Router();
var auth = require('../../../lib/auth');


/**
 * @api {get} /api/m/appointment Confirm an Appointment
 * @apiName confirm
 * @apiGroup Appointment
 * @apiPermission admin
 *
 * @apiParam {String} fname Firstname of the User.
 * @apiParam {String} lname Lastname of the User.
 * @apiParam {String} dob Date of birth of the User.
 *
 * @apiExample Example usage:
 * curl -i http://localhost/api/m/appointment?fname=John&lname="Doe"&dob="05/13/1965
 *
 * @apiSuccess {String} fname Firstname of the User.
 *
 * @apiError NoAccessRight Only authenticated Admins can access the data.
 * @apiError ApptNotFound  The <code>id</code> of the User was not found.
 *
 * @apiErrorExample Response (example):
 *     HTTP/1.1 401 Not Authenticated
 *     {
 *       "error": "NoAccessRight"
 *     }
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
