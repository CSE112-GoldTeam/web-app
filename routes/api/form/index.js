'use strict';

var express = require('express');
var controller = require('./form.controller');

var router = express.Router();
var auth = require('../../../lib/auth');

//Request a form
//api/form/:id
router.get('/:id', auth.isAuthenticated, controller.show);

//Send form
//api/form/
router.post('/', controller.createForm);

//Send form response
//api/form/fromResponse
router.post('/formResponse', auth.isAuthenticated, controller.createResponse);

module.exports = router;
