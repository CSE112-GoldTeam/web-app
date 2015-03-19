var auth = require('../../../lib/auth');

exports.get = function (req, res) {

	var employeeId = req.user[0]._id;
	var employeename = req.user[0].fname;

    res.render('business/dashboard', {title: 'Express',
		eid: employeeId,
		employeeName: employeename,
		message: req.flash("permission"),
	});
};
