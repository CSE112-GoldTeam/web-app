/**
* Using Rails-like standard naming convention for endpoints.
* GET     /users              ->  index
* POST    /users              ->  create
* GET     /users/:id          ->  show
* PUT     /users/:id          ->  update
* DELETE  /users/:id          ->  destroy
*/

'use strict';

var _ = require('underscore');
var ObjectID = require('mongodb').ObjectID;

// Request a form
exports.show = function(req, res) {

    // grab our db object from the request
      var db = req.db;
      var forms = db.get('forms');

      // query to create entry in collection
      forms.findById(req.params.id, function (err, doc) {
          if(err) { return handleError(res, err); }
          if(!doc) { return res.sendStatus(404); }// res.send is deprecated
          return res.json(doc);
      });
};

// Create a form
exports.createForm = function(req, res) {

    // grab our db object from the request
    var db = req.db;
    var forms = db.get('forms');

    // query to create entry in collection
    forms.insert(req.body, function (err, doc) {
        if (err) { return handleError(res, err); }
        return res.json(201,doc);
    })
};

// Create a formResponse
exports.createResponse = function(req, res) {

    // grab our db object from the request
    var db = req.db;
    var forms = db.get('forms');

		//var businessId = "54eca953f2a2d47937757616";

		var businessId = req.business;
    businessId = "54eca953f2a2d47937757616";

    console.log(req.body);
		forms.find({business: ObjectID(businessId)}, function (err, results)
		{
			var form = results[0];
			var valid = _.every(form.fields, function (field, index) {
        console.log("Index: "+index);
				var name = '_' + index;
				return name in req.body && req.body[name].trim() !== '';
			});

			if(!valid) {
			} else {
				var formResponses = db.get('formResponses');
				var formResponse = {answers: []};

				_.each(form.fields, function (field, index) {
					var name = '_' + index;
					formResponse.answers.push({
						label: field.label,
						response: req.body[name]
					});
				});

				formResponses.insert(formResponse, function(err, data) {
					if (err) { return res.sendStatus(500, err);}
					return res.json(200, data);
				});
			}
		});

		/*
		forms.insert(req.body, function (err, doc) {
        if (err) { return handleError(res, err); }
        return res.json(201,doc);
    });
		*/
};

function handleError(res, err) {
    return res.sendStatus(500, err);
}
