var auth = require ('../../../lib/auth');
exports.get = function (req,res) {
    var bid = req.user.Business[0]._id;
    var db = req.db;
    var businesses = db.get('businesses');
    businesses.find({_id: bid}, function (err, result) {
        var dbBusiness = result[0];
        var phone = dbBusiness.phone;
        phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
        res.render('business/businesssetting', {
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
    var bid = req.user.Business[0]._id;

    var companyName = req.body.companyName;
    var email = req.body.email;
    var phone = req.body.phone;
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    var confirmPassword = req.body.confirmPassword;
     console.log("oldPassword:       "+oldPassword);
     console.log("newPassword:       "+newPassword);
     console.log("confirmPassword:       "+confirmPassword);



    businesses.find({_id: bid}, function (err, result) {
         var dbBusiness = result[0];
            
            if (companyName === '' || email === '' || phone === '') {
                phone = dbBusiness.phone;
                phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
                res.render('business/businesssetting', {
                    error: 'You must fill in all fields.',
                    companyName: dbBusiness.companyName,
                    email: dbBusiness.email,
                    phone: dbBusiness.phone
                });
            }
             else {
                phone = phone.replace(/-/g, '');
                businesses.findAndModify({_id:bid}, {
                    $set :{
                        companyName: companyName,
                        email: email,
                        phone: phone
                    }
                });
                phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
                res.render('business/businesssetting', {
                    companyName: companyName,
                    email: email,
                    phone: phone,
                    edited: 'change successfully done.'
                });
            }

    });

    
}; 



 //    var dbPassword = result[0].password;
         //    var boolPsw = auth.validPassword(dbPassword, oldPassword);
         //    if (boolPsw && newPassword === confirmPassword) {
         //        newPassword = auth.hashPassword(newPassword);
         //        businesses.findAndModify({_id:bid}, {
         //            $set :{
         //                password: newPassword
         //            }
         //        });
         //        phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
         //        res.render('business/businesssetting', {
         //            companyName: companyName,
         //            email: email,
         //            phone: phone,
         //            edited: 'change successfully done.'
         //        });
         //    }
         //    else {



