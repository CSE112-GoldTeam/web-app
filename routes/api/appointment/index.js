'use strict';

var express = require('express');
var controller = require('./appointment.controller');

var router = express.Router();
var auth = require('../../../lib/auth');


/**
 * GET identity
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
