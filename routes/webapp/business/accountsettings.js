exports.get = function (req,res) {
    var eid = '54ecaa5cfb4974129dc2050f';
    var db = req.db;
    var employees = db.get('employees');

    var fname;
    var lname;
    var phone;
    var sms;
    var email;

    employees.find({_id: eid}, function (err, result) {
        var emp = result[0];
        var phone = emp.phone;
        phone = phone.slice(0, 3) + "-" + phone.slice(3, 6) + "-" + phone.slice(6);
        res.render('business/accountsettings', {
            title: 'Express',
            fname: emp.fname,
            lname: emp.lname,
            password: emp.password,
            phone: phone,
            email: emp.email,
            smsNotify: emp.smsNotify,
            emailNotify: emp.emailNotify
        });
    });
};

exports.post = function (req, res) {
    var db = req.db;
    var employees = db.get('employees');
    var eid = '54ecaa5cfb4974129dc2050f';

    var inputPass = req.body.editPassword;
    var inputEmail = req.body.editEmail;
    var inputPhone = req.body.editPhone;
    var textNotify = req.body.sendText;
    var emailNotify = req.body.sendEmail;

    if (inputPass != null)
    {
        employees.findAndModify({_id: eid}, { $set: {password: inputPass}}, function(err, data)
        {
            if (err) { return handleError(res, err);}

            employees.find({_id: eid}, function (err, result) {
                var emp = result[0];
                var phone = emp.phone;
                phone = phone.slice(0, 3) + "-" + phone.slice(3, 6) + "-" + phone.slice(6);
                res.render('business/accountsettings', {
                    title: 'Express',
                    fname: emp.fname,
                    lname: emp.lname,
                    password: emp.password,
                    phone: phone,
                    email: emp.email,
                    smsNotify: emp.smsNotify,
                    emailNotify: emp.emailNotify,
                    edited: "Password successfully changed!"
                });
            });
        });
    }

    if (inputEmail != null)
    {
        employees.findAndModify({_id: eid}, { $set: {email: inputEmail}}, function(err, data)
        {
            if (err) { return handleError(res, err);}

            employees.find({_id: eid}, function (err, result) {
                var emp = result[0];
                var phone = emp.phone;
                phone = phone.slice(0, 3) + "-" + phone.slice(3, 6) + "-" + phone.slice(6);
                res.render('business/accountsettings', {
                    title: 'Express',
                    fname: emp.fname,
                    lname: emp.lname,
                    password: emp.password,
                    phone: phone,
                    email: emp.email,
                    smsNotify: emp.smsNotify,
                    emailNotify: emp.emailNotify,
                    edited: "Email successfully changed!"
                });
            });
        });
    }

    if (inputPhone != null)
    {
        inputPhone = inputPhone.replace(/-/g, "");

        if (inputPhone.length === 10)
        {
            employees.findAndModify({_id: eid}, { $set: {phone: inputPhone}}, function(err, data)
            {
                if (err) { return handleError(res, err);}

                employees.find({_id: eid}, function (err, result) {
                    var emp = result[0];
                    var phone = emp.phone;
                    phone = phone.slice(0, 3) + "-" + phone.slice(3, 6) + "-" + phone.slice(6);
                    res.render('business/accountsettings', {
                        title: 'Express',
                        fname: emp.fname,
                        lname: emp.lname,
                        password: emp.password,
                        phone: phone,
                        email: emp.email,
                        smsNotify: emp.smsNotify,
                        emailNotify: emp.emailNotify,
                        edited: "Phone number successfully changed!"
                    });
                });
            });
        }
        else
        {
            employees.find({_id: eid}, function (err, result) {
                var emp = result[0];
                var phone = emp.phone;
                phone = phone.slice(0, 3) + "-" + phone.slice(3, 6) + "-" + phone.slice(6);
                res.render('business/accountsettings', {
                    title: 'Express',
                    fname: emp.fname,
                    lname: emp.lname,
                    password: emp.password,
                    phone: phone,
                    email: emp.email,
                    smsNotify: emp.smsNotify,
                    emailNotify: emp.emailNotify,
                    alert: "Incorrect phone number format"
                });
            });
        }
    }

    if (textNotify != null)
    {
        if (textNotify === "0")
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

            employees.find({_id: eid}, function (err, result) {
                var emp = result[0];
                var phone = emp.phone;
                phone = phone.slice(0, 3) + "-" + phone.slice(3, 6) + "-" + phone.slice(6);
                res.render('business/accountsettings', {
                    title: 'Express',
                    fname: emp.fname,
                    lname: emp.lname,
                    password: emp.password,
                    phone: phone,
                    email: emp.email,
                    smsNotify: emp.smsNotify,
                    emailNotify: emp.emailNotify,
                    edited: "SMS notification settings successfully changed!"
                });
            });
        });
    }

    if (emailNotify != null)
    {
        if (emailNotify === "0")
        {
            var emailSet = false;
        }
        else
        {
            var emailSet = true;
        }

        employees.findAndModify({_id: eid}, { $set: {emailNotify: emailSet}}, function(err, data)
        {
            if (err) { return handleError(res, err);}

            employees.find({_id: eid}, function (err, result) {
                var emp = result[0];
                var phone = emp.phone;
                phone = phone.slice(0, 3) + "-" + phone.slice(3, 6) + "-" + phone.slice(6);
                res.render('business/accountsettings', {
                    title: 'Express',
                    fname: emp.fname,
                    lname: emp.lname,
                    password: emp.password,
                    phone: phone,
                    email: emp.email,
                    smsNotify: emp.smsNotify,
                    emailNotify: emp.emailNotify,
                    edited: "Email notification settings successfully changed!"
                });
            });
        });
    }

};
