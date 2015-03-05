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
    var forms = db.get('forms');

    // TODO: req.business needs to work first for the business parameter to work
    //var business = forms.id(req.business);
    //Use this to test form id 54ecb5a6fb4974129dc20634
    //business = forms.id("54eca979f2a2d47937757617");

    forms.find({ "_id" : req.params.id }, function (err, doc) {
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

    // query to create entry in collection
    forms.insert(req.body, function (err, doc) {
        if (err) { return handleError(res, err); }
        return res.json(201,doc);
    });
};

function handleError(res, err) {
    return res.sendStatus(500, err);
}
