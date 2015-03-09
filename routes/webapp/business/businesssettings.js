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

    var companyName = req.body.companyName;
    var email = req.body.email;
    var phone = req.body.phone;
    console.log("req.body.phone-------------->>...:  "+ req.body.phone); 
    // var oldPassword = req.body.oldPassword;
    // var newPassword = req.body.newPassword;
    // var confirmPassword = req.body.confirmPassword;
    businesses.find({_id: bid}, function (err, result) {
         var dbBusiness = result[0];
         

        if (companyName === '' || email === '' || phone === '') {
            phone = dbBusiness.phone;
            phone = phone.slice(0, 3) + "-" + phone.slice(3, 6) + "-" + phone.slice(6);
            res.render('business/businesssettings', {
                error: "You must fill in all fields.",
                companyName: dbBusiness.companyName,
                email: email,
                phone: phone
            });
        }
        // else if (oldpassword !== dbpassword || oldPassword === null || newPassword !== confirmPassword ||
        //     newPassword === null || confirmPassword === null) {
        //     //Show an error to the user
        //     res.render('business/businesssettings', {
        //         error: 'Your passwords must be nonblank and must match.'
        //     });
        // }
         else {
            phone = phone.replace(/-/g, "");
            console.log("this is getting fraustrated:  "+ phone);
            businesses.findAndModify({_id:bid}, {
                $set :{
                    companyName: companyName,
                    email: email,
                    phone: phone
                }
            });
            phone = phone.slice(0, 3) + "-" + phone.slice(3, 6) + "-" + phone.slice(6);
            res.render('business/businesssettings', {
                companyName: dbBusiness.companyName,
                email: email,
                phone: phone,
                edited: "change successfully done."
            });
        }
    });

    
}; 