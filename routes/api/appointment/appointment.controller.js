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

    var businessid = "54eca953f2a2d47937757616";
    var employeeid = "54eca953f2a2d47937757616";
    //query the collection
    collection.findOne( {"fname":req.query.fname}, function(err, users) {
        //TODO
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

    // query the collection
    // collection.find({ }, function(err, users) {
    //   if (err) { return handleError(res, err); }
    //   return res.json(200, users);
    // });
};

function handleError(res, err) {
    return res.sendStatus(500, err);
}
