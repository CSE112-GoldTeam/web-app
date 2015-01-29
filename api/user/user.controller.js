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
    if (err === undefined) { return handleError(res, err); }
    res.json(200, users);
    //res.send(users);
  });
};


// // Get list of things
// exports.index = function(req, res) {
//   User.find(function (err, things) {
//     if(err) { return handleError(res, err); }
//     return res.json(200, things);
//   });
// };
//
// // Get a single thing
// exports.show = function(req, res) {
//   User.findById(req.params.id, function (err, thing) {
//     if(err) { return handleError(res, err); }
//     if(!thing) { return res.send(404); }
//     return res.json(thing);
//   });
// };
//
// // Creates a new thing in the DB.
// exports.create = function(req, res) {
//   User.create(req.body, function(err, thing) {
//     if(err) { return handleError(res, err); }
//     return res.json(201, thing);
//   });
// };
//
// // Updates an existing thing in the DB.
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
//
// // Deletes a thing from the DB.
// exports.destroy = function(req, res) {
//   User.findById(req.params.id, function (err, thing) {
//     if(err) { return handleError(res, err); }
//     if(!thing) { return res.send(404); }
//     thing.remove(function(err) {
//       if(err) { return handleError(res, err); }
//       return res.send(204);
//     });
//   });
// };
//
function handleError(res, err) {
  return res.send(500, err);
}
