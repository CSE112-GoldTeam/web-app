var auth = require('../../../lib/auth');

exports.get = function (req, res) {

	var employeeId = req.user[0]._id;
	var employeename = req.user[0].fname;

    //delete me
    var employeeLastName = req.user[0].lname;
    var employeePhone = req.user[0].phone;
    var employeePermission = req.user[0].permissionLevel;
    console.log('Business = ' + req.user[0].business);
    var walkinsAllowed = req.user[0].walkins;

    res.render('business/dashboard', {title: 'Express',
		eid: employeeId,
		employeeName: employeename,
        employeeLast: employeeLastName,
        employeePhone: employeePhone,
        employeePermission: employeePermission,
        walkinsAllowed: walkinsAllowed,
		message: req.flash("permission"),
	});
};
