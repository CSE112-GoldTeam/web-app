exports.put = function (req, res, next) {
    var business = req.user.Business[0];
    req.db.get('businesses').updateById(business._id, {
        $set: {
            style: req.body
        }
    }, function (err, result) {
        console.log(err, result);
        res.send(200);
    });
};
