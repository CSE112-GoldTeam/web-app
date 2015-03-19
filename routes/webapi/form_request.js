var ObjectID = require('mongodb').ObjectID;

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

exports.updateForm = function (req, res, next) {
    // grab our db object from the request
    var db = req.db;
    var forms = db.get('forms');

    // query the database for the correct forms
    forms.update({business: ObjectID(req.body.business)}, {$set: {'fields': req.body.fields}}, function (err, doc) {
        if (err) {
            return next(err);
        }
        if (!doc) {
            return res.sendStatus(404);
        }// res.send is deprecated
        return res.json(doc);
    });
};
