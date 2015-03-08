var bcrypt = require('bcrypt-nodejs');
var async = require('async');
exports.hashPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/**
 *
 * @param storedPassword The password stored in the database
 * @param givenPassword The password given by the user
 * @returns {*}
 */
exports.validPassword = function (storedPassword, givenPassword){
    return bcrypt.compareSync(givenPassword, storedPassword);
};

/**
 * Verifies if a mobile token is proper.
 *
 * @param db
 * @param authHeader The req.headers.authorization token. Expect to be in form `Token _id`
 * @param fn Callback function
 */
exports.isValidToken = function (db, authHeader, fn) {
    var matches = authHeader.split(' ');

    //Check that it's basic auth in right format
    if (matches.length !== 2 || matches[0] !== 'Token') {
        return fn(false);
    }

    var token = matches[1];

    db.get('mobileTokens').find({_id: token}, function (err, results) {
        if (err) {
            console.error('MongoDB Error: ' + err);
            return fn(false);
        }

        if (!results) {
            return fn(false);
        }

        fn(true);
    });
};

exports.validateLogin = function (db, email, password,fn) {
    var businesses = db.get('businesses');
    var employees = db.get('employees');

    var isEmployee;
    var isBusiness;
    var theResult;


async.parallel({
        employee: function(cb){
            employees.findOne({email: email}, function (err,employee){
                if(err){
                    console.error('validateLogin DB Error: ' + err);
                }
                if(!employee || !exports.validPassword(employee.password, password)){
                    isEmployee = employee;
                }
                isEmployee = employee;
                cb();
            })
        },
        business: function(cb){
            businesses.findOne({email: email}, function (err, business) {
                if (err) {
                    console.error('validateLogin DB Error: ' + err);
                }

                if (!business || !exports.validPassword(business.password, password)) {
                    isBusiness = business;
                }
                    isBusiness = business;
                    cb();

            })
        }
    },
            function (err,results){
                results.employee = isEmployee;
                results.business = isBusiness;
                return fn(results);
            });

}
