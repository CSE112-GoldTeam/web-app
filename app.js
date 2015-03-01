if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
    require('newrelic');
}

var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var multer = require('multer');
var passport = require('passport');
var app = express();

//Database
var monk = require('monk');
var mongoURI = process.env.MONGOLAB_URI || 'localhost:27017/robobetty';
console.log('Connecting to DB: ' + mongoURI);
var db = monk(mongoURI);

//login config
var collect = db.get('businesses');

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

require('./config/passport')(passport); // pass passport for configuration

// Load Routes for Webapp
var business = require('./routes/business')(passport);
var checkin = require('./routes/checkin');
var signature = require('./routes/signature');

// Load Routes for Mobile
var mobileAuth = require('./routes/api/auth');
var mobileCheckin = require('./routes/api/checkin');
var mobileForm = require('./routes/api/form');
var mobileAppointment = require('./routes/api/appointment');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));


//so... when only using router, for some reason deserialize wont work
//but when using both or just app.use(session), the route works
//note to j

//required for passport
app.use(session({secret: '1234567890QWERTY'}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Make our db accessible to our router
app.use(function (req, res, next) {
    req.db = db;
    req.passport = passport;
    req.app = app;
    next();
});

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'fonts.googleapis.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
});


// Set Webapp Routes
app.use('/', business);
app.use('/', checkin);
app.use('/', signature);

// Set Mobile Routes
app.use('/', mobileAuth);
app.use('/api/m/checkin', mobileCheckin);
app.use('/api/m/form', mobileForm);
app.use('/api/m/appointment', mobileAppointment);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


exports = module.exports = app;
