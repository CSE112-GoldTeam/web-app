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

/**
 * Verifies if a mobile token is proper.
 *
 * @param db
 * @param authHeader The req.headers.authorization token. Expect to be in form `Token _id`
 * @param fn Callback function
 */
function isValidToken(db, authHeader, fn) {
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
exports.isValidToken = isValidToken;

exports.validateLogin = function (db, email, password, fn) {
    var businesses = db.get('businesses');
    console.log("Validating Login");
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

/**
 * Middleware authentication which will call the next function if successful
 * otherwise 403 forbidden
 */
function isAuthenticated(req, res, next) {
    isValidToken(req.db, req.headers.authorization, function (result) {
        if (!result) {
            res.send(403);
        } else {
            return next();
        }

    });
}

exports.isAuthenticated = isAuthenticated;
