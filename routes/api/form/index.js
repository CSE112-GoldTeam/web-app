'use strict';

var express = require('express');
var controller = require('./form.controller');

var router = express.Router();
var auth = require('../../../lib/auth');

/**
 * @api {get} /api/m/form/:id Get a form
 * @apiName controller.show
 * @apiGroup Form
 * @apiPermission Admin
 *
 * @apiExample Example usage:
 * curl -i http://localhost/api/m/form/:id
 *
 * @apiParam {String} id The id for a form.
 *
 * @apiSuccessExample {json} Success-Response (example):
 *      HTTP/1.1 200 OK
 *      {
 *          business: 1293182391203,
 *          fields: [ {
                    type: "textfield",
                    label: "Name"
            },
            {
                    type: "dropdown",
                    label: "Gender",
                    options: ["Male", "Female"]
            },
            {
                    type: "textfield",
                    label: "Email"
            },
            {
                    type: "dropdown",
                    label: "Favorite Color",
                    options: ["Blue", "Yellow", "Green", "Pink"]
            }]
 *      }
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
router.get('/:id', auth.isAuthenticated, controller.show);


/**
 * @api {post} /api/m/form/:id Create a form
 * @apiName controller.createForm
 * @apiGroup Form
 * @apiPermission Admin
 */
router.post('/', controller.createForm);

/**
 * @api {post} /api/m/form/ Create a form response
 * @apiName controller.createResponse
 * @apiGroup Form
 * @apiPermission Admin
 */
router.post('/formResponse', auth.isAuthenticated, controller.createResponse);

module.exports = router;
