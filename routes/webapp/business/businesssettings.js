exports.get = function (req,res) {
    var bid = '54eca953f2a2d47937757616';
    var db = req.db;
    var businesses = db.get('businesses');
    businesses.find({_id: bid}, function (err, result) {
        var dbBusiness = result[0];
        var phone = dbBusiness.phone;
        phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
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
    businesses.find({_id: bid}, function (err, result) {
         var dbBusiness = result[0];
         

        if (companyName === '' || email === '' || phone === '') {
            phone = dbBusiness.phone;
            phone = phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
            res.render('business/businesssettings', {
                error: 'You must fill in all fields.',
                companyName: dbBusiness.companyName,
                email: email,
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
            res.render('business/businesssettings', {
                companyName: companyName,
                email: email,
                phone: phone,
                edited: 'change successfully done.'
            });
        }
    });

    
}; 