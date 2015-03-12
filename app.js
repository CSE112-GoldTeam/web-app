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
var async = require('async');
var app = express();

//Database
var monk = require('monk');
var mongoURI = process.env.MONGOLAB_URI || 'localhost:27017/robobetty';
console.log('Connecting to DB: ' + mongoURI);
var db = monk(mongoURI);

//login config
var businesses = db.get('businesses');
var employee = db.get('employees');



//passport functions to Serialize and Deserialize users

passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

// used to deserialize the user
passport.deserializeUser(function (id, done) {
    var theemployee;
    var thebusiness;
    async.parallel({
        Employee: function(cb){
            employee.find({_id: id}, function (err, user){
                    if(err){ done(err);}
                    if(user){
                        theemployee = user;
                    }
                    cb();
            });
        },
        Business: function(cb){
            businesses.find({_id: id}, function (err, user) {
                    if(err){ done(err);}
                    if(user){
                        thebusiness = user;
                    }
                    cb();
            });
        }
    }, function (err,results){
        results.Employee = theemployee;
        results.Business = thebusiness;
        done(null,results);
    });
});

require('./config/passport')(passport); // pass passport for configuration


var businessRoutes = require('./routes/webapp/business')(passport);

// Load Routes for Mobile
var mobileAuth = require('./routes/api/auth');
var mobileForm = require('./routes/api/form');
var mobileAppointment = require('./routes/api/appointment');
var mobileToken = require('./routes/api/mobiletoken');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use(multer({
  dest: __dirname + '/public/images/uploads/',
  onFileUploadStart: function (file) {
    console.log(file.mimetype);
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
      return false;
    } else {
      console.log(file.fieldname + ' is starting ...');
    }
  },
  onFileUploadData: function (file, data) {
    console.log(data.length + ' of ' + file.fieldname + ' arrived');
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path);
  }
}));




app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'static')));


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
app.use('/office', require('./routes/webapp/checkin'));
app.use('/', businessRoutes);

// Set Mobile Routes
app.use('/', mobileAuth);
app.use('/api/m/form', mobileForm);
app.use('/api/m/appointment', mobileAppointment);
app.use('/api/m/mobiletoken', mobileToken);
app.use('/api/m/example', require('./routes/api/example'));
app.use('/api', require('./routes/webapi'));

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
