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

// Get list of things
exports.index = function(req, res) {
  //Test
  //console.log(req.app);
  //console.log(exports.index);
  // grab our db object from the request
  var db = req.db;
  var auth = db.get('authorization');

  var authJSON = { authorization: req.headers.authorization };
  var updateJSON =  {
    authorization: req.headers.authorization,
    api_token : auth.id()
  };

  console.log(updateJSON);
  auth.findAndModify(authJSON, updateJSON, { upsert : true }, function(err,doc){
    console.log(err);
    if (err) { return handleError(res, err); }
    return res.json(201,{api_token: doc.api_token});
  });
};

function handleError(res, err) {
  return res.sendStatus(500, err);
}
