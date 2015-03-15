var auth = require ('../../../lib/auth');
exports.get = function (req,res) {
    var bid = req.user.Business[0]._id;
    var db = req.db;
    var businesses = db.get('businesses');
    businesses.find({_id: bid}, function (err, result) {
        if (err) {
                return next(err);
            }
        var dbBusiness = result[0];
        var phone = dbBusiness.phone;
        phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
        res.render('business/businesssetting', {
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

    businesses.find({_id: bid}, function (err, result) {
        if (err) {
                return next(err);
            }
        var dbBusiness = result[0];
        var dbPassword = result[0].password;
         //checks and makes sure to only perform a name, phone email setting
        if(phone && email && companyName) {
            
            if (companyName === '' || email === '' || phone === '') {
                phone = dbBusiness.phone;
                phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
                res.render('business/businesssetting', {
                    error: 'You must fill in all fields.',
                    companyName: dbBusiness.companyName,
                    email: dbBusiness.email,
                    phone: phone
                });
            }
             else {
                phone = phone.replace(/-/g, '');
                businesses.update({_id:bid}, {
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
        }// end of undefined password if statement

        //performs only if password submit is pressed
        else if (oldPassword && newPassword && confirmPassword) {
            if (oldPassword && newPassword && confirmPassword){
                var boolPsw = auth.validPassword(dbPassword, oldPassword);
                if (boolPsw &&  newPassword === confirmPassword) {
                    newPassword = auth.hashPassword(newPassword);
                    businesses.findAndModify({_id:bid}, {
                        $set :{
                            password: newPassword,
                        }
                    });
                    phone = dbBusiness.phone;
                    phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
                    res.render('business/businesssetting', {
                        companyName: dbBusiness.companyName,
                        email: dbBusiness.email,
                        phone: phone,
                        edited: 'password successfully changed.'
                    });
                }
                else {
                    phone = dbBusiness.phone;
                    phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
                    res.render('business/businesssetting', {
                        companyName: dbBusiness.companyName,
                        email: dbBusiness.email,
                        phone: phone,
                        error: 'password does not match'
                    });
                }
                
            }
            else {
                phone = dbBusiness.phone;
                phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
                res.render('business/businesssetting', {
                    error: 'You must fill in all fields of password.',
                    companyName: dbBusiness.companyName,
                    email: dbBusiness.email,
                    phone: phone
                });
            }

        }//end of elseif statement
        else {
            phone = dbBusiness.phone;
            phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
            res.render('business/businesssetting', {
                error: 'You must fill in all fields',
                companyName: dbBusiness.companyName,
                email: dbBusiness.email,
                phone: phone
            });

        }

    });

    
}; 