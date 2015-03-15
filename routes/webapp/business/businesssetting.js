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

    businesses.find({_id: bid}, function (err, result) {
         var dbBusiness = result[0];
         var dbPassword = result[0].password;
         phone = dbBusiness.phone;
         //checks and makes sure to only perform a name, phone email setting
        if(!oldPassword && !newPassword && !confirmPassword && phone && email && companyName) {
            console.log("i am inside name setting yo ---___>>>+++++=====");
            if (companyName === '' || email === '' || phone === '') {
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
                businesses.findAndModify({_id:bid}, {
                    $set :{
                        companyName: companyName,
                        email: email,
                        phone: phone
                    }
                });
                phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
                res.render('business/businesssetting', {
                    companyName: dbBusiness.companyName,
                    email: dbBusiness.email,
                    phone: phone,
                    edited: 'change successfully done.'
                });
            }
        }// end of undefined password if statement

        //performs only if password submit is pressed
        else if (!phone && !companyName && !email) {
            console.log("Inside else ifXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
            if (oldPassword && newPassword && confirmPassword){
                //var boolPsw = auth.validPassword(dbPassword, oldPassword);
                console.log("confirmPassword-------->>>> :"+confirmPassword);
                if (/*boolPsw && */ newPassword === confirmPassword) {
                    //console.log("hashPassword-------->>>> : "+newPassword+'-->'+auth.hashPassword(newPassword));
                   // newPassword = auth.hashPassword(newPassword);
                    businesses.findAndModify({_id:bid}, {
                        $set :{
                            password: newPassword,
                        }
                    });
                    phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
                    res.render('business/businesssetting', {
                        companyName: dbBusiness.companyName,
                        email: dbBusiness.email,
                        phone: phone,
                        edited: 'password successfully changed.'
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
        //$2a$08$PSCbjEeE2ymJTfY3buscq.ozt3J8iHcIaHQ4yHKzPeETYvcywJX
        //$2a$08$PSCbjEeE2ymJTfY3buscq.ozt3J8iHcIaHQ4yHKzPeETYvcywJX3S"
            

    });

    
}; 