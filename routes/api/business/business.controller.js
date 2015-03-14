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


exports.index = function(req, res) {

  // grab our db object from the request
  var db = req.db;
  var collection = db.get('businesses');

  // query the collection
  collection.find({ }, function(err, users) {
    if (err) { return handleError(res, err); }
    return res.json(200, users);
  });
};

function handleError(res, err) {
  return res.sendStatus(500, err);
}
