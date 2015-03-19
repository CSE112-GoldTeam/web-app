var auth = require ('../../../lib/auth');
exports.get = function (req,res) {
    var bid = req.user[0].business;
    var db = req.db;
    var businesses = db.get('businesses');
    businesses.findById(bid, function (err, result) {
        if (err) {
                return next(err);
            }
        var dbBusiness = result;
        var phone = dbBusiness.phone;
        phone = phone.replace('1', '');
        phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
        res.render('business/businesssetting', {
            companyName: dbBusiness.companyName,
            phone: phone
        });
    });
};


exports.post = function (req, res) {
    var db = req.db;
    var businesses = db.get('businesses');
    var bid = req.user[0].business;

    var companyName = req.body.companyName;
    var phone = req.body.phone;
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    var confirmPassword = req.body.confirmPassword;
    businesses.findById(bid, function (err, result) {
        if (err) {
                return next(err);
            }
        var dbBusiness = result;
        var dbPassword = result.password;
         //checks and makes sure to only perform a name, phone email setting
        if(phone  && companyName) {
            //if input fields are empty
            if (companyName === '' || phone === '') {
                phone = dbBusiness.phone;
                //removing country code 1 from phone 
                phone = phone.replace('1', '');
                phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
                res.render('business/businesssetting', {
                    error: 'You must fill in all fields.',
                    companyName: dbBusiness.companyName,
                    phone: phone
                });
            }
             else {
                phone = phone.replace(/-/g, '');
                if(phone.length === 10){
                    //this regex is removing the dashesh from input
                    //its adding 1 in the front for US coutry code
                    phone = '1'+phone;
                    businesses.update({_id:bid}, {
                        //writes in database
                        $set :{
                            companyName: companyName,
                            phone: phone
                        }
                    });
                    phone = phone.replace('1', '');
                    phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
                    res.render('business/businesssetting', {
                        companyName: companyName,
                        phone: phone,
                        edited: 'change successfully done.'
                    });
                }
                else{
                    phone = dbBusiness.phone;
                    phone = phone.replace('1', '');
                    phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
                    res.render('business/businesssetting', {
                        companyName: dbBusiness.companyName,
                        phone: phone,
                        error: 'phone number should be in 1 xxx-xxx-xxxx format'
                    });
                }
                
            }
        }// end of undefined password if statement

        //performs only if password submit is pressed
        else if (oldPassword && newPassword && confirmPassword) {
                var boolPsw = auth.validPassword(dbPassword, oldPassword);
                if (boolPsw &&  newPassword === confirmPassword) {
                    newPassword = auth.hashPassword(newPassword);
                    businesses.update({_id:bid}, {
                        $set :{
                            password: newPassword,
                        }
                    });
                    phone = dbBusiness.phone;
                    phone = phone.replace('1', '');
                    phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
                    res.render('business/businesssetting', {
                        companyName: dbBusiness.companyName,
                        phone: phone,
                        edited: 'password successfully changed.'
                    });
                }
                else {
                    phone = dbBusiness.phone;
                    phone = phone.replace('1', '');
                    phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
                    res.render('business/businesssetting', {
                        companyName: dbBusiness.companyName,
                        phone: phone,
                        error: 'password does not match'
                    });
                }
        }//end of elseif statement
        else {
            phone = dbBusiness.phone;
            phone = phone.replace('1', '');
            phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
            res.render('business/businesssetting', {
                error: 'You must fill in all fields.',
                companyName: dbBusiness.companyName,
                phone: phone
            });

        }

    });

    
}; 