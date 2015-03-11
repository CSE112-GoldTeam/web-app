var crypto = require('crypto');
var baby = require('babyparse');
var async = require('async');
var sendgrid  = require('sendgrid')('robobetty', 'NoKcE0FGE4bd');

exports.get = function(req,res){
	    var database =  req.db;
        var employeeDB = database.get('employees');
        var employee;
        var notemployee;
        

        async.parallel({
            employee: function(cb){
                employeeDB.find({registrationToken: {$exists: false}},function (err,results){

                    if (err) { return next(err);  }
                    if(!results) { return next(new Error('Error finding employee'));}
                     
                        employeee = results;
                       cb();
                
                });
            },
            nonemployee: function(cb){
                employeeDB.find({registrationToken: {$exists: true}}, function (err,results){


                    if (err) { return next(err); }
                    if(!results) { return next(new Error('Error finding employee'));}
                      
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
}


exports.post = function(req,res){
	   var parsed = baby.parse(req.body.csvEmployees);
       var rows = parsed.data;
       var database =  req.db;
       var employeeDB = db.get('employees');

        for(var i = 0; i < rows.length; i++){
           var username = rows[i][0];
           var email = rows[i][1];

            var token = randomToken();
            employeeDB.insert({
                name: username,
                email: email,
                registrationToken : token,
            });


              sendgrid.send({
                to: email,
                from: 'test@localhost',
                subject: 'Employee Signup',
                text: 'Hello ' + username + ',\n\n' + 'Please click on the following link, or paste this into your browser to complete sign-up the process: \n\n' +
                'http://robobetty-dev.herokuapp.com/employeeregister?token=' + token 
            }, function (err){
                if (err) {
                    return next(err);
                }
              });
        }   
        res.redirect('/addemployees'); 
}


 function randomToken() {
        return crypto.randomBytes(24).toString('hex');
    }