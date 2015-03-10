var express = require('express');
var crypto = require('crypto');
var baby = require('babyparse');
var async = require('async');
var sendgrid  = require('sendgrid')('robobetty', 'NoKcE0FGE4bd');
var router = express.Router();


//Define the controllers for checkin process
var landing = require('./landing');
var theming = require('./theming');
var login = require('./login');
var formbuilder = require('./formbuilder');
var accountSettings = require('./accountsettings');
var uploadLogo = require('./uploadlogo');
var register = require('./register');
var dashboard = require('./dashboard');
var registerDevice = require('./registerdevice');
var addEmployees = require('./addemployees');
var employeeRegister = require('./employeeregister');
var viewForm = require('./viewform');

module.exports = function (passport) {

   

    //Pass in passport    

    //Setup the routes
    router.get('/', landing.get);

    router.get('/theming', theming.get);

    router.get('/login', login.get);
    router.post('/login',passport.authenticate('local-login',{
        successRedirect : '/dashboard',
        failureRedirect : '/login'
    }));

    router.get('/formbuilder', formbuilder.get);

    router.get('/accountSettings', accountSettings.get);
    router.post('/accountSettings', accountSettings.post);

    router.get('/uploadlogo', uploadLogo.get);
    router.post('/uploadlogo', uploadLogo.post);

    router.get('/register', register.get);
    router.post('/register',passport.authenticate('local-signup',{
        successRedirect : '/dashboard', // redirect to the secure profile section
        failureRedirect : '/register' // redirect back to the signup page if there is an error
    }));

    router.get('/dashboard', dashboard.get);

    router.get('/registerdevice', registerDevice.get);

    router.get('/addemployees', function (req,res){
        var db =  req.db;
        var csvEmployees = db.get('employees');
        var employee;
        var notemployee;
        

        async.parallel({
            employee: function(cb){
                csvEmployees.find({registrationToken: {$exists: false}},function (err,results){

                    if (err) { return res.sendStatus(500, err); }
                    if(!results) { return res.send(404,'User not found');}
                     
                        employeee = results;
                       cb();
                
                });
            },
            nonemployee: function(cb){
                csvEmployees.find({registrationToken: {$exists: true}}, function (err,results){


                    if (err) { return res.sendStatus(500, err); }
                    if(!results) { return res.send(404,'User not found');}
                      
                         notemployee = results;
                         cb();
                });
            }
        },

        function(err,results){

            if(err){
                throw err;
            }
            res.render('business/addemployees',{title: 'Express',notsigned: notemployee, signed: employeee});

        });  
    });
    router.post('/addemployees',function (req,res){

         var parsed = baby.parse(req.body.csvEmployees);
         var rows = parsed.data;

 
        //  var number = 0;
        // rows.forEach(function (d){
        //     number += 1;
        // });

        var db =  req.db;
        var csvEmployees = db.get('employees');

        for(var i = 0; i < rows.length; i++){
           var username = rows[i][0];
           var email = rows[i][1];

            var token = randomToken();
            csvEmployees.insert({
            name: username,
            email: email,
            registrationToken : token,
            });


              sendgrid.send({
                to: email,
                from: 'test@localhost',
                subject: 'Employee Signup',
                text: 'Hello ' + username + ',\n\n' + 'Please click on the following link, or paste this into your browser to complete sign-up the process: \n\n' +
                'http://localhost:3000/employeeregister?token=' + token 
            }, function (err){
                if (err) {
                    return console.error(err);
                }
              });
        }   
        res.redirect('/addemployees'); 
    });    

    router.get('/employeeregister', employeeRegister.get);
    router.post('/employeeregister', passport.authenticate('local-signup-employee',{
        successRedirect : '/dashboard', // redirect to the secure profile section
        failureRedirect : '/register' // redirect back to the signup page if there is an error
    }));

    router.get('/viewform/:id', viewForm.get);


    function randomToken() {
        return crypto.randomBytes(24).toString('hex');
    }

    return router;
};
