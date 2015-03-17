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

/**
 * Request a form.
 * GET /api/m/form/:id
 *
 * @param req req.db A database object.
 * @param req req.mobileToken.business An id associated with a business.
 * @param req req.params.id An id associated with a form.
 * @param res Respond with '404' (form not found) or a JSON representation of
 *        the form.
 * @param next Used to handle any errors encountered when querying the
 *        database.
 * @returns {JSON} An array of fieldObjects representing the form.
 */
exports.show = function (req, res, next) {
    // grab our db object from the request
    var db = req.db;
    var forms = db.get('forms');

    // acquire the token for the appropriate business
    var business = forms.id(req.mobileToken.business);
    console.log('BusinessID: ' + req.mobileToken.business);
    // query the database for the correct forms
    forms.find({'business': business}, function (err, doc) {
        if (err) {
            return next(err);
        }
        if (!doc) {
            return res.sendStatus(404);
        }// res.send is deprecated
        return res.json(doc);
    });
};

/**
 * Create a form.
 * PUT /api/m/form/
 *
 * @param req req.body The form in JSON format
 * @param res Respond with '201' upon successful insert.
 * @param next Used to handle any errors encountered when querying the
 *        database.
 * @returns {JSON} A JSON object containing the created form.
 */
exports.createForm = function (req, res, next) {

    // grab our db object from the request
    var db = req.db;
    var forms = db.get('forms');

    // query to create entry in collection
    forms.insert(req.body, function (err, doc) {
        if (err) {
            return next(err);
        }
        return res.json(201, doc);
    });
};


/**
 * Send a form response.
 * POST /api/m/form/formResponse/
 *
 * @param req req.db A database object.
 * @param req req.mobileToken.business An id associated with a business.
 * @param req req.body.answers A fieldObject containing the user's responses
 *        to the form.
 * @param res Respond with a '500' (no business id), '400' (malformed response)
 *         or a '200'(everything is OK).
 * @param next Used to handle any errors encountered when querying the
 *        database.
 * @returns N/A
 */
exports.createResponse = function (req, res, next) {

    // grab our db object from the request
    var db = req.db;
    var forms = db.get('forms');

    // make sure that we have a business id
    if (!req.mobileToken.business) {
        return res.status(500).send('The mobileToken not set!');
    }
    var businessId = req.mobileToken.business;

    // query the database for the business using the business's id
    forms.find({business: forms.id(businessId)}, function (err, results) {
        if (err) {
            return next(err);
        }

        var form = results[0];

        // create array of form fields
        var formList = [];
        _.each(form.fields, function (value) {
            formList.push(value.label);
        });

        // create array of user responses to form
        var responseList = [];
        _.each(req.body.answers, function (value) {
            responseList.push(value.label);
        });

        // make sure that fields from formResponse match with the actual form
        var unionList = _.union(_.difference(formList, responseList), _.difference(responseList, formList));
        if (unionList.length > 0) {
            return res.status(400).send('Malformed Requests, fields from formResponse is different from the actual form.');
        } else {
            var formResponses = db.get('formResponses');
            var formResponse = {
                answers: []
            };

            _.each(form.fields, function (field, index) {
                formResponse.answers.push({
                    label: field.label,
                    response: req.body.answers[index].response
                });
            });

            // insert the user's responses into the database
            formResponses.insert(formResponse, function (err, data) {
                if (err) {
                    return next(err);
                }
                return res.json(200, data);
            });
        }
    });
};
