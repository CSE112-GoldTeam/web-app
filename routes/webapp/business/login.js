
exports.get = function(req, res) {
	req.logout();
    res.render('business/login.hjs');
};


