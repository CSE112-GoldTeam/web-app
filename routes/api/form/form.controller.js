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

    var business = forms.id(req.mobileToken.business);

    forms.find({ "_id" : req.params.id, "business" : business }, function (err, doc) {
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
    try {
      var businessId = req.mobileToken.business;
    }
    catch (e) {
      return res.status(500).send('The mobileToken not set! ' + e);
    }

forms.find({business: forms.id(businessId)}, function (err, results)
{
    if (err) { return res.sendStatus(500, err);}
    console.log("forms.find() return "+ JSON.stringify(results[0].fields));

    var form = results[0];

      var formList = [];
      _.each(form.fields, function(value, index) {
         console.log("Value " + JSON.stringify(value));
         formList.push(value.label);
      });

      var responseList = [];
      _.each(req.body.answers, function(value, index) {
         console.log("Value " + JSON.stringify(value));
         responseList.push(value.label);
      });

      var unionList =  _.union(_.difference(formList, responseList), _.difference(responseList, formList))
      console.log(JSON.stringify(unionList));
    if(unionList.length > 0) {
        return res.status(400).send("Malformed Requests, fields from formResponse is different from the actual form.");
    } else {
        var formResponses = db.get('formResponses');
        var formResponse = {answers: []};

        _.each(form.fields, function (field, index) {
            var name = '_' + index;

            formResponse.answers.push({
                label: field.label,
                response: req.body.answers[index].response
            });
        });
            formResponses.insert(formResponse, function(err, data) {
                if (err) { return res.sendStatus(500, err);}
                return res.json(200, data);
            });

        }
    });


};

function handleError(res, err) {
    return res.sendStatus(500, err);
}
