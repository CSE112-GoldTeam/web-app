/**
* Using Rails-like standard naming convention for endpoints.
* GET     /appointment              ->  show
*/

'use strict';

var _ = require('underscore');

// Get list of things
exports.confirm = function(req, res) {

    // grab our db object from the request
    var db = req.db;
    var collection = db.get('appointments');

    // query the collection
    collection.find({ }, function(err, users) {
        if (err) { return handleError(res, err); }
        return res.json(200, users);
    });
};

// Get list of things
exports.retrieve = function(req, res) {

    // grab our db object from the request
    var db = req.db;
    var collection = db.get('appointments');

    // query to create entry in collection
    collection.findById(req.params.id, function (err, doc) {
    if(err) { return handleError(res, err); }
    if(!doc) { return res.sendStatus(404); }// res.send is deprecated
        return res.json(doc);
    });
};

/**
 * PUT /api/appointment/:id/state/next
 * Transitions the state to the next state
 * scheduled -> formDone -> checkedIn -> roomed -> done
 */
exports.nextState = function(req, res) {
    // grab our db object from the request
    var db = req.db;
    var collection = db.get('appointments');

    collection.find({_id: req.params.id}, function(err, data){
			var currState = {};
			if (data[0].state == 'scheduled') {
				currState = {$set: {state: "formDone"}};
			} else if (data[0].state == 'formDone') {
				currState = {$set: {state: "checkedIn"}};
			} else if (data[0].state == 'checkedIn') {
				currState = {$set: {state: "roomed"}};
			} else if (data[0].state == 'roomed') {
				currState = {$set: {state: "done"}};
			} else {
				currState = {$set: {state: "done"}};
			}

			collection.findAndModify({_id: req.params.id}, currState, function(err, data){
				if (err) { return res.sendStatus(500, err);}
				return res.json(200, data);
			});
		});
};

/**
 * PUT /api/appointment/:id/state
 * Set a specific state
 * scheduled, formDone, checkedIn, roomed, done
 */
exports.updateState = function(req, res) {
    // grab our db object from the request
    var db = req.db;
    var collection = db.get('appointments');
    var validStates = ['scheduled','formDone','checkedIn','roomed','done'];
    var isValid = false;

    console.log(req.body.state);

    // Determine if the state is a valid one
    for(var i=0; i < validStates.length; i++){
      if(validStates[i]==req.body.state){
        isValid = true;
      }
    }

    // Check if valid flag was set
    if(!isValid){
      return res.status(400).send('Malformed request, the state variable must be set to a valid state.');
    }

    // If all is good update the new state
    collection.findAndModify({_id: req.params.id}, { $set:{state: req.body.state}}, function(err, data){
      if (err) { return handleError(res, err);}
      return res.json(200, data);
    });
};

function handleError(res, err) {
    return res.sendStatus(500, err);
}
