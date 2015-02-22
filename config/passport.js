// config/passport.js

//monk and db are neeeded because pass.deserialize doesnt pass a req parameter, 
//so in order to find the correct id in mongo, we need to make a connection to database and findbyid


var monk = require('monk');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var db = monk('localhost:27017/robobetty');
var collect = db.get('users');




//need this since we are passing in a passport dependency in app.js line 22
module.exports = function(passport) {



//passport functions to Serialize and Deserialize users

passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    collect.findById(id, function(err, user) {
        done(err, user);
    });
});


// =========================================================================
// LOCAL SIGNUP ============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'



passport.use('local-signup', new LocalStrategy({

    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, email, password, done) {

    // asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick(function() {

    var collection = req.db.get('users');
    
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    collection.findOne({},{ email :  email }, function(err, user) {
        // if there are any errors, return the error
        
        if (err){
            return done(err);
        }

        // check to see if theres already a user with that email
        if (user) {
            return done(null, false);
        } else {

            // if there is no user with that email
            // create the user

            // set the user's local credentials
            password = hashPassword(password);

            var dbemail    = email;
            var dbpassword = password;
            var dbcname = req.body.cname;
            var dbtel = req.body.tel;
            var dbname = req.body.name;

            // save the user
            collection.insert({'email' : dbemail, 'password' : dbpassword, 'Company Name' : dbcname, 'telephone' : dbtel, 'name' : dbname}, function(err,user) {
                if (err)
                    throw err;
                
                return done(null,user);

                
            });
        }

    });    

    });

}));


   // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists

        var collection = req.db.get('users');

        collection.findOne({ 'email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
             if (err)
                return done(err);

            // if no user is found, return the message
            if (!user){
                return done(null, false); 
            }
            

      
            if (!validPassword(user,password)){
                return done(null, false); 
             }      
            // all is well, return successful user
            return done(null, user);
        })
    }));


//function to hash password

function hashPassword(password) {
    var hashedPassword =  bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    return hashedPassword;
}


//function to check if password is correct
function validPassword(user,password){
    return bcrypt.compareSync(password, user.password);
}

};

