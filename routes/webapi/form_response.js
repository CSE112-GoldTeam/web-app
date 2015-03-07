exports.get  = function (req, res) {
    // grab our db object from the request
    var db = req.db;
    var response = db.get('formResponses');
    // query the collection
    response.find({ appointments : req.params.id }, function(err, data) {
        if (err) { return res.sendStatus(500, err); }
        return res.json(200, data);
    });
};
