exports.get = function (req, res) {
    var bid = req.user.Business[0]._id;
    res.render('business/theme');
};
