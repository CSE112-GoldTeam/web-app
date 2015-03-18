var express = require('express');
var router = express.Router();
var auth = require('../../../lib/auth');

/**
 * Takes an HTTP Basic Auth String and returns the username and password parts of it.
 *
 * @param authString The auth string with "Basic " already removed from beginning,
 * @returns {Object|Boolean} An object with fields `email` and `password` or the value `false`
 * indicating that the auth string is not valid.
 */
function decodeAuthString(authString) {
    var buffer = new Buffer(authString, 'base64');
    var s = buffer.toString();

    //Split into 2 parts at the first instance of the : . We know that the first
    //: will be the separator since emails cannot contain ports
    var parts = s.split(':');
    //If it doesn't have two parts it's an error
    if (parts.length < 2) {
        return false;
    }
    var email = parts[0];
    var password = parts.slice(1).join(':');

    return {
        email: email,
        password: password
    };
}

/**
 * @api {post} /authTest/ Test Your Authentication
 * @apiName authTest
 * @apiGroup Authentication
 * @apiPermission Admin
 *
 * @apiHeader {String} api_token returned from api/auth

 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authentication": "Token 550286024ae861626c9235f4"
 *     }
 *
* @apiExample Example usage:
curl -X POST -i http://localhost:3000/api/authTest \
-H "Authorization: Token 550286024ae861626c9235f4"
 *
 * @apiSuccessExample Success-Response (example):
 * HTTP/1.1 200 OK
 *
 * @apiErrorExample Error-Response (example):
 *     HTTP/1.1 401 Not Authenticated
 */
router.post('/api/authTest', function (req, res) {
    auth.isValidToken(req.db, req.headers.authorization, function (result) {
        if (!result) {
            res.send(401);
        } else {

            res.json(200,result);
        }
    });
});

/**
 * @api {post} /auth/ Get Authenticated
 * @apiName postAuth
 * @apiGroup Authentication
 *
 * @apiHeader {String} Authentication The api_token created from a base64 encoded
 string with email appended to password semicolon. ex. "email:password"
 *
 * @apiParam {String} name Name of the employee to be authenticated
 *
 * @apiExample Example usage:
 curl -X POST -i http://localhost:3000/api/auth \
 -H "Authorization: Basic bm9ydGh3b29kLmRlbnRhbEBnbWFpbC5jb206cGFzc3dvcmQ=" \
 -H "Content-Type: application/json" \
 -d '{"name":"Frodo"}'

 * @apiSuccessExample {json} Success-Response (example):
 * HTTP/1.1 200 OK
 *     {
 *       "api_token": "WW9sbzp5b2xv"
 *     }
 *
 * @apiErrorExample Error-Response (example):
 *     HTTP/1.1 401 Not Authenticated
 */
router.post('/api/auth', function (req, res, next) {
    if (!req.headers.authorization) {
        return res.send(400, 'Basic HTTP Auth required');
    }

    var authString = req.headers.authorization;
    var matches = authString.split(' ');

    //Check that it's basic auth in right format
    if (matches.length !== 2 || matches[0] !== 'Basic') {
        return res.send(400, 'Basic HTTP Auth required.');
    }

    var user = decodeAuthString(matches[1]);
    // Validates user's email and password
    auth.validateLogin(req.db, user.email, user.password, function (result) {
        if (result) {
            var name = req.body.name;
            // Checks if name field is blank
            if (name === '' || !name) {
                return res.send(400, 'Name field required');
            }
            if (!result.business) {
                return res.send(404, 'Business not found. Name or password maybe wrong.');
            }

            var mobileTokens = req.db.get('mobileTokens');

            mobileTokens.insert({
                business: result.business,
                name: name
            }, function (err, results) {
                if (err) {
                    return next(err);
                }

                res.json(200, {
                    api_token: results._id
                });
            });
        } else {
            res.send(401);
        }
    });
});

module.exports = router;
