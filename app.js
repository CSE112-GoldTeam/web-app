var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var app = express();





//Database
var monk = require('monk');
var db = monk('localhost:27017/robobetty');

//login config


require('./config/passport')(passport); // pass passport for configuration




//var business = require('./routes/business');
//var checkin = require('./routes/checkin');

//delete this after integrating authentication into main application
var auth = require('./routes/auth')(passport);//pass in passport dependency into routes



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));




app.use(session({secret: 'test'}));
//required for passport
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions










// Make our db accessible to our router
app.use(function (req, res, next) {
    req.db = db;
    req.passport = passport;
    req.app = app;
    next();
});









//uncomment after trying passportjs
//app.use('/', business);
//app.use('/', checkin);


//use the auth routes, delete this after integrating into app
app.use('/',auth);




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
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
