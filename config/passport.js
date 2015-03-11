// config/passport.js

//monk and db are neeeded because pass.deserialize doesnt pass a req parameter,
//so in order to find the correct id in mongo, we need to make a connection to database and findbyid

var LocalStrategy = require('passport-local').Strategy;
var auth = require('../lib/auth');


//need this since we are passing in a passport dependency in app.js line 22
module.exports = function (passport) {


// =========================================================================
// LOCAL SIGNUP ============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'


    passport.use('local-signup', new LocalStrategy({

            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) {
            var db = req.db;
            var companyName = req.body.companyName;
            var username = req.body.username;
            var phone = req.body.phone;
            // Check if any field has been left blank
            if (companyName === '' || username === '' || email === ''
                || phone === '' || password === '') {
                res.render('business/register', {
                    error: 'You must fill in all fields.',
                    companyName: companyName,
                    phone: phone,
                    username: username,
                    email: email,
                });
            } else {

                var businesses = db.get('businesses');


                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                businesses.findOne({'email': email}, function (err, user) {
                    // if there are any errors, return the error

                    if (err) {
                        return done(err);
                    }

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false);
                    } else {

                        // if there is no user with that email
                        // create the user

                        // set the user's local credentials
                        password = auth.hashPassword(password);

                        // save the user
                        businesses.insert({
                            email: email,
                            password: password,
                            companyName: companyName,
                            phone: phone,
                            username: username,
                            logo: '',
                            walkins: false
                        }, function (err, user) {
                            if (err) {
                                throw err;
                            }

                            return done(null, user);

                        });
                    }
                });
            }

        }
    ));



    passport.use('local-signup-employee',new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req,email,password,done) {

       

            var db =req.db;
            var employee = db.get('employees');

            password = auth.hashPassword(password);

            employee.findAndModify({
             query: {registrationToken: req.query.token},
             update: { $unset: {registrationToken: 1},
                $set: {password: password} },
             new: true},    
                function (err,user){  
                if (err) { 
                     throw err; }
                return done(null,user);
       
                 }
            );
        }
    ));



    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) { // callback with email and password from our form

            auth.validateLogin(req.db, email, password, function (user) {
                if (!user) {
                    done(null, false);
                } else {
                    if(user.employee === null){
                        done(null, user.business);
                    }
                    else{
                        done(null,user.employee);
                    }
                }
            });
        }
    ));
};

