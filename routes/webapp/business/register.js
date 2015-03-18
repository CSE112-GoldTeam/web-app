
exports.get = function (req, res) {
	if (!req.session.companyName) {
        res.render('business/register');
    } else {
        res.render('business/register', {title: 'Express', companyName: req.session.companyName});
    }
};
