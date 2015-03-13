'use strict';

var express = require('express');
var controller = require('./appointment.controller');

var router = express.Router();
var auth = require('../../../lib/auth');

router.get('/index', controller.index);

/**
 * @api {get} /m/appointment Confirm an Appointment
 * @apiName confirm
 * @apiGroup Appointment
 * @apiPermission admin
 *
 * @apiParam {String} fname Firstname of the User.
 * @apiParam {String} lname Lastname of the User.
 * @apiParam {String} dob Date of birth of the User.
 *
 * @apiExample Example usage:
 * curl -i http://localhost/api/m/appointment?fname=Frodo&lname=St. John&dob=02/17/1956
 *
* @apiExample Temporary No Auth Example usage:
* curl -i http://localhost/api/m/appointment?fname=Frodo&lname=St. John&dob=02/17/1956&bid=5500a18ac0a954cae1bbf238
*
 * @apiSuccess { ObjectID } business Business ID
 * @apiSuccess { ObjectID } employee Employee ID
 * @apiSuccess { Date } date Date of the appointment
 * @apiSuccess { String } lname Last name
 * @apiSuccess { String } fname First name
 * @apiSuccess { String } dob Date of birth MM/DD/YYYY
 * @apiSuccess { String } email Email
 * @apiSuccess { String } state See db scheme for possible states
 *
 * @apiSuccessExample {json} Success-Response (example):
 * HTTP/1.1 200 OK
 * [
 *  {
 *  	"business" : ObjectId("54eca953f2a2d47937757616"),
 *  	"employee" : ObjectId("54ecaa24fb4974129dc2050c"),
 *  	"date" : ISODate("2015-02-26T21:00:00Z"),
 *  	"fname" : "Emily",
 *  	"lname" : "Lee",
 *  	"dob" : "03/25/1968",
 *  	"email" : "Emily.Lee@example.com",
 *  	"state" : "scheduled"
 *  }
 * ]
 *
 * @apiErrorExample Error (example):
 *     HTTP/1.1 401 Not Authenticated
 */
router.get('/', auth.isAuthenticated, controller.confirm);

/**
 * @api {get} /m/appointment/:id Get Appointment Info
 * @apiVersion 0.6.0
 * @apiName retrieve
 * @apiGroup Appointment
 * @apiPermission admin
 *
 * @apiParam {String} id Appointment id
 *
 *
 * @apiExample Example usage:
 * curl -i http://localhost/api/m/appointment/123456789
 *
* @apiSuccess { ObjectID } business Business ID
* @apiSuccess { ObjectID } employee Employee ID
* @apiSuccess { Date } date Date of the appointment
* @apiSuccess { String } lname Last name
* @apiSuccess { String } fname First name
* @apiSuccess { String } dob Date of birth MM/DD/YYYY
* @apiSuccess { String } email Email
* @apiSuccess { String } state See db scheme for possible states
*
* @apiSuccessExample {json} Success-Response (example):
* HTTP/1.1 200 OK
* [
*  {
*  	"business" : ObjectId("54eca953f2a2d47937757616"),
*  	"employee" : ObjectId("54ecaa24fb4974129dc2050c"),
*  	"date" : ISODate("2015-02-26T21:00:00Z"),
*  	"fname" : "Emily",
*  	"lname" : "Lee",
*  	"dob" : "03/25/1968",
*  	"email" : "Emily.Lee@example.com",
*  	"state" : "scheduled"
*  }
* ]
* @apiErrorExample Error (example):
*     HTTP/1.1 401 Not Authenticated
 */
router.get('/:id', auth.isAuthenticated, controller.retrieve);

/**
 * @api {put} /m/appointment/:id/state/next Transition to Next State
 * @apiName controller.nextState
 * @apiGroup Appointment
 * @apiPermission admin
 *
 * @apiParam {String} id Appointment id
 * @apiSuccessExample Success-Response (example):
 * HTTP/1.1 200 OK
 */
router.put('/:id/state/next', auth.isAuthenticated, controller.nextState);

/**
 * @api {put} /m/appointment/:id/state Set a Specific State
 * @apiName controller.updateState
 * @apiGroup Appointment
 * @apiPermission admin
 *
 * @apiParam {String} id Appointment id
 *
 * @apiSuccessExample Success-Response (example):
 * HTTP/1.1 200 OK
 */
router.put('/:id/state', auth.isAuthenticated, controller.updateState);


module.exports = router;
