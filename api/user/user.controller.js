/**
* Using Rails-like standard naming convention for endpoints.
* GET     /users              ->  index
* POST    /users              ->  create
* GET     /users/:id          ->  show
* PUT     /users/:id          ->  update
* DELETE  /users/:id          ->  destroy
*/

'use strict';

var _ = require('lodash');

// Get list of things
exports.index = function(req, res) {

  // grab our db object from the request
  var db = req.db;
  var Users = db.get('users');

  // query the collection
  Users.find({ }, function(err, users) {
    if (err) { return handleError(res, err); }
    return res.json(200, users);
    //res.send(users);
  });
};

//Create a User
exports.create = function(req, res) {

  // grab our db object from the request
  var db = req.db;
  var Users = db.get('users');

  // query to create entry in collection
  Users.insert(req.body, function (err, doc) {
    if (err) { return handleError(res, err); }
    return res.json(201,doc);
  });
};

// Get a single user
exports.show = function(req, res) {

  // grab our db object from the request
  var db = req.db;
  var Users = db.get('users');

  // query to create entry in collection
  Users.findById(req.params.id, function (err, doc) {
    if(err) { return handleError(res, err); }
    if(!doc) { return res.sendStatus(404); }// res.send is deprecated
    return res.json(doc);
  });
};

//TODO: Convert Moongose DELETE to Monk DELETE
// Updates an existing thing in the DB.
// exports.update = function(req, res) {
//   if(req.body._id) { delete req.body._id; }
//   User.findById(req.params.id, function (err, thing) {
//     if (err) { return handleError(res, err); }
//     if(!thing) { return res.send(404); }
//     var updated = _.merge(thing, req.body);
//     updated.save(function (err) {
//       if (err) { return handleError(res, err); }
//       return res.json(200, thing);
//     });
//   });
// };

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  // grab our db object from the request
  var db = req.db;
  var Users = db.get('users');

  // query to create entry in collection
  Users.remove({ _id: req.params.id }, function(err) {
    if(err) { return handleError(res, err); }
    return res.sendStatus(204);
  });
};

function handleError(res, err) {
  return res.sendStatus(500, err);
}
