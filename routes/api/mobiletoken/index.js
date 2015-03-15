'use strict';

var express = require('express');
var controller = require('./mobileToken.controller');

var router = express.Router();

/**
 * @api {get} /m/mobileToken/ Get A List of Mobile Tokens
 * @apiName GetToken
 * @apiGroup MobileToken
 * @apiPermission Admin
 *
 * @apiExample Example usage:
 * curl -i http://localhost/api/m/mobileToken/
 *
 * @apiSuccessExample {json} Success-Response (example):
 *      HTTP/1.1 204 No Content
 *      {
 *          business : 121231239082103,
 *          employee : 123131231409844,
 *          name : "Device Name"
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
router.get('/', controller.index);

/**
 * @api {delete} /m/mobileToken/:id Delete A Mobile Token
 * @apiName DeleteToken
 * @apiGroup MobileToken
 * @apiPermission Admin
 *
 * @apiParam {String} id id for mobileToken.
 *
 * @apiExample Example usage:
 * curl -X DELETE -i http://localhost/api/m/mobileToken/:id
 *
 * @apiSuccessExample Success-Response (example):
 *      HTTP/1.1 204 No Content
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
router.delete('/:id', controller.destroy);

module.exports = router;
