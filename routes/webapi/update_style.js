exports.put = function (req, res, next) {
    var business = req.user[0].business;
    req.db.get('businesses').updateById(business._id, {
        $set: {
            style: req.body
        }
    }, function (err, result) {
        if (err) {
            return next(err);
        }
        res.send(200);
    });
};
