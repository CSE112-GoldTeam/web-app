var bcrypt = require('bcrypt-nodejs');

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

exports.validateLogin = function (db, email, password, fn) {
    var businesses = db.get('businesses');

    businesses.findOne({email: email}, function (err, business) {
        if (err) {
            console.error('validateLogin DB Error: ' + err);
            return fn(false);
        }

        if (!business) {
            return fn(false);
        }

        if (!exports.validPassword(business.password, password)) {
            return fn(false);
        }

        return fn(business);
    });
};
