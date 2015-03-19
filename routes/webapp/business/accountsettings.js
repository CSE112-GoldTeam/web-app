var auth = require('../../../lib/auth');

/**
 * Takes an req parameter and res parameter and returns the details of a particular employee.
 *
 * @param req The req parameter used to access the database,
 * @returns title, fname, lname, password, phone, email, smsNotify, emailNotify
 */
exports.get = function (req,res) {
		var eid = req.user[0]._id;
    var db = req.db;
    var employees = db.get('employees');

    var fname;
    var lname;
    var phone;
    var sms;
    var email;

    //calls find method to find the correct employee to pull results
    employees.find({_id: eid}, function (err, result) {
        var emp = result[0];
        var phone = emp.phone;
        phone = phone.replace('1', '');
				phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
        res.render('business/accountsettings', {
            title: 'Express',
            fname: emp.fname,
            lname: emp.lname,
            password: emp.password,
            phone: phone,
            email: emp.email,
            smsNotify: emp.smsNotify,
            emailNotify: emp.emailNotify,
            message: req.flash("permission")
        });
    });
};

/**
 * Takes an req parameter and res parameter and returns the details of a particular employee. The user
 * is then prompted to change any of the information presented.
 *
 * @param req The req parameter used to access the database,
 * @returns title, fname, lname, password, phone, email, smsNotify, emailNotify
 */
exports.post = function (req, res) {
    var db = req.db;
    var employees = db.get('employees');
    var eid = req.user[0]._id;

    var inputPass = req.body.editPassword;
    var inputEmail = req.body.editEmail;
    var inputPhone = req.body.editPhone;
    var textNotify = req.body.sendText;
    var emailNotify = req.body.sendEmail;

    if (inputPass != null)
    {
        if(inputPass === req.user.Employee[0].password)
				{
                    //find employees based on id
					employees.find({_id: eid}, function (err, result) {
						var emp = result[0];
						var phone = emp.phone;
						phone = phone.replace('1', '');
						phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
        		res.render('business/accountsettings', {
            	title: 'Express',
            	fname: emp.fname,
            	lname: emp.lname,
            	password: emp.password,
            	phone: phone,
            	email: emp.email,
            	smsNotify: emp.smsNotify,
            	emailNotify: emp.emailNotify,
							edited: 'Password successfully changed!'
						});
					});
				}
				else
				{
					inputPass = auth.hashPassword(inputPass);
					employees.findAndModify({_id: eid}, { $set: {password: inputPass}}, function(err, data) {
           	if (err) { return handleError(res, err);}
		   //find employees based on id
           	employees.find({_id: eid}, function (err, result) {
             	var emp = result[0];
             	var phone = emp.phone;
             	phone = phone.replace('1', '');
							phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
             	res.render('business/accountsettings', {
                 	title: 'Express',
                 	fname: emp.fname,
                 	lname: emp.lname,
                 	password: emp.password,
                 	phone: phone,
                 	email: emp.email,
                 	smsNotify: emp.smsNotify,
                 	emailNotify: emp.emailNotify,
                 	edited: 'Password successfully changed!',
             	});
           	});
        	});
				}
    }

    if (inputEmail != null)
    {
        employees.findAndModify({_id: eid}, { $set: {email: inputEmail}}, function(err, data)
        {
            if (err) { return handleError(res, err);}
		    //find employees based on id
            employees.find({_id: eid}, function (err, result) {
                var emp = result[0];
                var phone = emp.phone;
                phone = phone.replace('1', '');
								phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
                res.render('business/accountsettings', {
                    title: 'Express',
                    fname: emp.fname,
                    lname: emp.lname,
                    password: emp.password,
                    phone: phone,
                    email: emp.email,
                    smsNotify: emp.smsNotify,
                    emailNotify: emp.emailNotify,
                    edited: 'Email successfully changed!'
                });
            });
        });
    }

    if (inputPhone != null)
    {
        inputPhone = inputPhone.replace(/-/g, '');

        if (inputPhone.length === 10)
        {
            inputPhone = '1' + inputPhone;
						employees.findAndModify({_id: eid}, { $set: {phone: inputPhone}}, function(err, data)
            {
                if (err) { return handleError(res, err);}
		        //find employees based on id
                employees.find({_id: eid}, function (err, result) {
                    var emp = result[0];
                    var phone = emp.phone;
                    phone = phone.replace('1', '');
										phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
                    res.render('business/accountsettings', {
                        title: 'Express',
                        fname: emp.fname,
                        lname: emp.lname,
                        password: emp.password,
                        phone: phone,
                        email: emp.email,
                        smsNotify: emp.smsNotify,
                        emailNotify: emp.emailNotify,
                        edited: 'Phone number successfully changed!'
                    });
                });
            });
        }
        else
        {
            //find employees based on id
            employees.find({_id: eid}, function (err, result) {
                var emp = result[0];
                var phone = emp.phone;
                phone = phone.replace('1', '');
								phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
                res.render('business/accountsettings', {
                    title: 'Express',
                    fname: emp.fname,
                    lname: emp.lname,
                    password: emp.password,
                    phone: phone,
                    email: emp.email,
                    smsNotify: emp.smsNotify,
                    emailNotify: emp.emailNotify,
                    alert: 'Incorrect phone number format'
                });
            });
        }
    }

    if (textNotify != null)
    {
        if (textNotify === '0')
        {
            var smsSet = false;
        }
        else
        {
            var smsSet = true;
        }

        employees.findAndModify({_id: eid}, { $set: {smsNotify: smsSet}}, function(err, data)
        {
            if (err) { return handleError(res, err);}
	        //find the employee based off ids
            employees.find({_id: eid}, function (err, result) {
                var emp = result[0];
                var phone = emp.phone;
                phone = phone.replace('1', '');
								phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
                res.render('business/accountsettings', {
                    title: 'Express',
                    fname: emp.fname,
                    lname: emp.lname,
                    password: emp.password,
                    phone: phone,
                    email: emp.email,
                    smsNotify: emp.smsNotify,
                    emailNotify: emp.emailNotify,
                    edited: 'SMS notification settings successfully changed!'
                });
            });
        });
    }

    if (emailNotify != null)
    {
        if (emailNotify === '0')
        {
            var emailSet = false;
        }
        else
        {
            var emailSet = true;
        }
	    //find the appropriate employee to set the email and notification settings
        employees.findAndModify({_id: eid}, { $set: {emailNotify: emailSet}}, function(err, data)
        {
            if (err) { return handleError(res, err);}

            employees.find({_id: eid}, function (err, result) {
                var emp = result[0];
                var phone = emp.phone;
                phone = phone.replace('1', '');
								phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
                res.render('business/accountsettings', {
                    title: 'Express',
                    fname: emp.fname,
                    lname: emp.lname,
                    password: emp.password,
                    phone: phone,
                    email: emp.email,
                    smsNotify: emp.smsNotify,
                    emailNotify: emp.emailNotify,
                    edited: 'Email notification settings successfully changed!'
                });
            });
        });
    }

};
