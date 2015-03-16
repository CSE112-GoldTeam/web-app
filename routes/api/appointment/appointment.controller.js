/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /appointment              ->  show
 */

'use strict';
var ObjectID = require('mongodb').ObjectID;

/*
 * Shows all appointments
 */

exports.index = function(req, res) {

  // grab our db object from the request
  var db = req.db;
  var collection = db.get('appointments');

  // query the collection
  collection.find({ }, function(err, users) {
    if (err) { return handleError(res, err); }
    return res.json(200, users);
  });
};

/**
 * Confirms the users first name, last name, date of birth and business id
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns `200` Ok or `404` error depedning if id was found
 */
exports.confirm = function (req, res, next) {
    var db = req.db;
    var appointments = db.get('appointments');
    var business;

    if(!req.mobileToken) {
        return res.send(400, "Mobiletoken is empty cannot access business id!");
    }  else {
        business = appointments.id(req.mobileToken.business);
    }

    if(!req.query.fname || !req.query.lname || !req.query.dob){
        return res.sendStatus(400);
    }

    var fname = req.query.fname.replace(/['"]+/g, '');
    var lname = req.query.lname.replace(/['"]+/g, '');
    var dob = req.query.dob.replace(/['"]+/g, '');


    appointments.findOne({
        'fname': fname,
        'lname': lname,
        'dob': dob
    }, function (err, appt) {
        if (err) { return handleError(res, err); }
        if(!appt) { return res.sendStatus(404); }
        return res.json(200, appt);
    });
};

/**
 * Retrieves the list of appointments
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns `200` Ok or `404` error depedning if id was found
 */
exports.retrieve = function (req, res, next) {
    var db = req.db;
    var appointments = db.get('appointments');

    appointments.findById(req.params.id, function (err, doc) {
        if (err) {
            return next(err);
        }
        if (!doc) {
            return res.sendStatus(404);
        }
        return res.json(doc);
    });
};

/**
 * Transitions the state to the next state
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns `200` Ok or error depending if the state update was successful
 */
exports.nextState = function (req, res, next) {
    var db = req.db;
    var appointments = db.get('appointments');

    appointments.find({_id: req.params.id}, function (err, data) {
        var currState = {};
        if (data[0].state === 'scheduled') {
            currState = {$set: {state: 'formDone'}};
        } else if (data[0].state === 'formDone') {
            currState = {$set: {state: 'checkedIn'}};
        } else if (data[0].state === 'checkedIn') {
            currState = {$set: {state: 'roomed'}};
        } else if (data[0].state === 'roomed') {
            currState = {$set: {state: 'done'}};
        } else {
            currState = {$set: {state: 'done'}};
        }

        appointments.findAndModify({_id: req.params.id}, currState, function (err, data) {
            if (err) {
                return next(err);
            }
            return res.json(200, data);
        });
    });
};

/**
 * PUT an updated state
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns if the state was valid
 */
exports.updateState = function (req, res, next) {
    // grab our db object from the request
    var db = req.db;
    var collection = db.get('appointments');
    var validStates = ['scheduled', 'formDone', 'checkedIn', 'roomed', 'done'];
    var isValid = false;

    // Determine if the state is a valid one
    for (var i = 0; i < validStates.length; i++) {
        if (validStates[i] === req.body.state) {
            isValid = true;
        }
    }

    // Check if valid flag was set
    if (!isValid) {
        return res.status(400).send('Malformed request, the state variable must be set to a valid state.');
    }

    // If all is good update the new state
    collection.findAndModify({_id: req.params.id}, {$set: {state: req.body.state}}, function (err, data) {
        if (err) {
            return next(err);
        }
        return res.json(200, data);
    });
};
