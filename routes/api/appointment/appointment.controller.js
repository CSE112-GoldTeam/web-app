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

// Get list of things
exports.sign = function(req, res) {

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
		
		// query the collection
    //collection.find({_id: businessId}, function(err, users) {
		//	if (err) { return handleError(res, err); }
		//	return res.json(200, users);
    //});
};

function handleError(res, err) {
    return res.sendStatus(500, err);
}
