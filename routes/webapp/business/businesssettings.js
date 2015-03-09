exports.get = function (req,res) {
    var bid = '54eca953f2a2d47937757616';
    var db = req.db;
    var businesses = db.get('businesses');

    var companyName;
    var phone;
    var email;

    businesses.find({_id: bid}, function (err, result) {
        var dbBusiness = result[0];
        var phone = dbBusiness.phone;
        phone = phone.slice(0, 3) + "-" + phone.slice(3, 6) + "-" + phone.slice(6);
        res.render('business/businesssettings', {
            title: 'Express',
            companyName: dbBusiness.companyName,
            phone: phone,
            email: dbBusiness.email
        });
    });
};


exports.post = function (req, res) {
    var db = req.db;
    var businesses = db.get('businesses');
    var bid = '54eca953f2a2d47937757616';

    // var companyName = req.body.companyName;
    // var email = req.body.email;
    // var phone = req.body.phone; 
    // console.log("this is fucked up: "+email+" "+phone+" "+companyName);
    // var oldPassword = req.body.oldPassword;
    // var newPassword = req.body.newPassword;
    // var confirmPassword = req.body.confirmPassword;
    //businesses.find({_id: eid}, function (err, result) {
        // var dbpassword = result[0].password;

        // if (companyName.length === 0 || email === null || phone === null) {
        //     console.log("---------->>>>: ");
        //     res.render('business/businesssettings', {
        //         error: "You must fill in all fields."
        //     });
        // }
        // else if (oldpassword !== dbpassword || oldPassword === null || newPassword !== confirmPassword ||
        //     newPassword === null || confirmPassword === null) {
        //     //Show an error to the user
        //     res.render('business/businesssettings', {
        //         error: 'Your passwords must be nonblank and must match.'
        //     });
        // }
        // else {
            businesses.findAndModify({_id:bid}, {
                $set :{
                    companyName: companyName,
                    email: email,
                    phone: phone
                }
            });
        //}
    //});

    
}; 

    // if (inputPass != null)
    // {
    //     employees.findAndModify({_id: eid}, { $set: {password: inputPass}}, function(err, data)
    //     {
    //         if (err) { return handleError(res, err);}

    //         employees.find({_id: eid}, function (err, result) {
    //             var emp = result[0];
    //             var phone = emp.phone;
    //             phone = phone.slice(0, 3) + "-" + phone.slice(3, 6) + "-" + phone.slice(6);
    //             res.render('business/accountsettings', {
    //                 title: 'Express',
    //                 fname: emp.fname,
    //                 lname: emp.lname,
    //                 password: emp.password,
    //                 phone: phone,
    //                 email: emp.email,
    //                 smsNotify: emp.smsNotify,
    //                 emailNotify: emp.emailNotify,
    //                 edited: "Password successfully changed!"
    //             });
    //         });
    //     });
    // }

    // if (inputEmail != null)
    // {
    //     employees.findAndModify({_id: eid}, { $set: {email: inputEmail}}, function(err, data)
    //     {
    //         if (err) { return handleError(res, err);}

    //         employees.find({_id: eid}, function (err, result) {
    //             var emp = result[0];
    //             var phone = emp.phone;
    //             phone = phone.slice(0, 3) + "-" + phone.slice(3, 6) + "-" + phone.slice(6);
    //             res.render('business/accountsettings', {
    //                 title: 'Express',
    //                 fname: emp.fname,
    //                 lname: emp.lname,
    //                 password: emp.password,
    //                 phone: phone,
    //                 email: emp.email,
    //                 smsNotify: emp.smsNotify,
    //                 emailNotify: emp.emailNotify,
    //                 edited: "Email successfully changed!"
    //             });
    //         });
    //     });
    // }

    // if (inputPhone != null)
    // {
    //     inputPhone = inputPhone.replace(/-/g, "");

    //     if (inputPhone.length === 10)
    //     {
    //         employees.findAndModify({_id: eid}, { $set: {phone: inputPhone}}, function(err, data)
    //         {
    //             if (err) { return handleError(res, err);}

    //             employees.find({_id: eid}, function (err, result) {
    //                 var emp = result[0];
    //                 var phone = emp.phone;
    //                 phone = phone.slice(0, 3) + "-" + phone.slice(3, 6) + "-" + phone.slice(6);
    //                 res.render('business/accountsettings', {
    //                     title: 'Express',
    //                     fname: emp.fname,
    //                     lname: emp.lname,
    //                     password: emp.password,
    //                     phone: phone,
    //                     email: emp.email,
    //                     smsNotify: emp.smsNotify,
    //                     emailNotify: emp.emailNotify,
    //                     edited: "Phone number successfully changed!"
    //                 });
    //             });
    //         });
    //     }
    //     else
    //     {
    //         employees.find({_id: eid}, function (err, result) {
    //             var emp = result[0];
    //             var phone = emp.phone;
    //             phone = phone.slice(0, 3) + "-" + phone.slice(3, 6) + "-" + phone.slice(6);
    //             res.render('business/accountsettings', {
    //                 title: 'Express',
    //                 fname: emp.fname,
    //                 lname: emp.lname,
    //                 password: emp.password,
    //                 phone: phone,
    //                 email: emp.email,
    //                 smsNotify: emp.smsNotify,
    //                 emailNotify: emp.emailNotify,
    //                 alert: "Incorrect phone number format"
    //             });
    //         });
    //     }
    // }
