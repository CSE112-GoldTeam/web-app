'use strict';

var express = require('express');
var controller = require('./form.controller');

var router = express.Router();
var auth = require('../../../lib/auth');

/**
 * Requests a form after authenticating the user.
 * /api/m/form/:id
 *
 * See form.controller.show().
 */
router.get('/:id', auth.isAuthenticated, controller.show);

/**
 * Creates a form.
 * /api/m/form/
 *
 * See form.controller.createForm().
 */
router.post('/', controller.createForm);

/**
 * Sends a form response. after authenticating the user.
 * /api/m/form/formResponse
 *
 * See form.controller.createResponse().
 */
router.post('/formResponse', auth.isAuthenticated, controller.createResponse);

module.exports = router;
