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

// Request a form
exports.show = function(req, res) {

    // grab our db object from the request
      var db = req.db;
      var collection = db.get('forms');

      // query to create entry in collection
      collection.findById(req.params.id, function (err, doc) {
          if(err) { return handleError(res, err); }
          if(!doc) { return res.sendStatus(404); }// res.send is deprecated
          return res.json(doc);
      });
};

// Create a form
exports.createForm = function(req, res) {

    // grab our db object from the request
    var db = req.db;
    var collection = db.get('forms');

    // query to create entry in collection
    collection.insert(req.body, function (err, doc) {
        if (err) { return handleError(res, err); }
        return res.json(201,doc);
    });
};

// Create a formResponse
exports.createResponse = function(req, res) {

    // grab our db object from the request
    var db = req.db;
    var collection = db.get('forms');

    // query to create entry in collection
    collection.insert(req.body, function (err, doc) {
        if (err) { return handleError(res, err); }
        return res.json(201,doc);
    });
};

function handleError(res, err) {
  return res.sendStatus(500, err);
}
