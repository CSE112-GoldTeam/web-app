var bcrypt = require('bcrypt-nodejs');

exports.hashPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/**
 * Calls compareSync to check the given password against the password stored in the database
 * @param {String} storedPassword The password stored in the database
 * @param {String} givenPassword The password given by the user
 * @returns {boolean} True if the passwords matched, false otherwise
 */
exports.validPassword = function (storedPassword, givenPassword){
    return bcrypt.compareSync(givenPassword, storedPassword);
};

/**
 * Verifies if a mobile token is proper.
 *
 * @param {Object} db A mongoDB
 * @param {Object} authHeader The req.headers.authorization token. Expect to be in form `Token _id`
 * @param {Function} fn Callback function
 * @return fn(false) if an error was found, fn(true) otherwise
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

        fn(results);
    });
};

/**
 * Verifies that a login is valid before calling a function
 *
 * @param {Object} db A mongoDB
 * @param {String} email The email used to login
 * @param {String} password The password used to login
 * @param {Function} fn The callback function
 * @return fn(true) if the login is successful, fn(false) otherwise
 */
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
 * @param {Object} req The request object
 * @param {Object} res The response object
 * @param {Function} next The function to call if successful
 * @return next() if req contains a valid token, 403 otherwise
 */
function isAuthenticated(req, res, next) {
    isValidToken(req.db, req.headers.authorization, function (result) {
        if (!result) {
            return res.send(403);
        } else {
            req.mobileToken = result;          
            return next();
        }

    });
}

exports.isValidToken = isValidToken;
exports.isAuthenticated = isAuthenticated;
