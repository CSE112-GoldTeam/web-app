var ObjectId = require('mongodb').ObjectID;
var async = require('async');

exports.get = function (req, res, next) {

    var currentuser = req.user[0].business;
    console.log(currentuser);
    var db = req.db;
    var tokens = db.get('mobileTokens');
    var employees = db.get('employees');
    tokens.find({}, function (err, results) {
        if (err) {
            return res.sendStatus(500, err);
        }
        async.eachSeries(results, function (result, fn) {
            employees.findOne({_id: result.employee, business: currentuser}, function (err, employee) {
                result.employee = employee.fname + " " + employee.lname;
                fn();
            })
        }, function () {
            res.render('business/registerDevice', {tokensDB: results, message: req.flash("permission")});
            }
        );
    });
};
