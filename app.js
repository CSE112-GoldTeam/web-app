var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


//login config
var passport = require('passport');
var flash = require('connect-flash');



//Database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/robobetty');

//var db =monk('localhost:27017/login_test');






//var business = require('./routes/business');
//var checkin = require('./routes/checkin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//required for passport
app.use(session({secret: 'test'}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session



// Make our db accessible to our router
app.use(function (req, res, next) {
    req.db = db;
    next();
});



//uncomment after trying passportjs
/*app.use('/', business);
app.use('/', checkin);*/




 // load our routes and pass in our app and fully configured passport
require('./app/routes.js')(app, passport); 

// require('./config/passport')(passport); // pass passport for configuration


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
