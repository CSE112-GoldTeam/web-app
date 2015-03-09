exports.get = function(req, res, next){
    res.render('business/businesssettings',{title:'Business Setting'});
};
// exports.get = function (req,res) {
//     var bid = '54eca953f2a2d47937757616';
//     var db = req.db;
//     var businesses = db.get('businesses');

//     var companyName;
//     var phone;
//     var email;
//     var 

//     employees.find({_id: bid}, function (err, result) {
//         var emp = result[0];
//         var phone = emp.phone;
//         phone = phone.slice(0, 3) + "-" + phone.slice(3, 6) + "-" + phone.slice(6);
//         res.render('business/businesssettings', {
//             title: 'Express',
//             fname: emp.fname,
//             lname: emp.lname,
//             password: emp.password,
//             phone: phone,
//             email: emp.email,
//             smsNotify: emp.smsNotify,
//             emailNotify: emp.emailNotify
//         });
//     });
// };