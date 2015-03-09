var baby = require('babyparse');
var async = require('async');
var crypto = require('crypto');
var sendgrid  = require('sendgrid')('robobetty', 'NoKcE0FGE4bd');


exports.get = function (req,res){
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

};

exports.post = function (req,res){


    var parsed = baby.parse(req.body.csvEmployees);
    var rows = parsed.data;


    var number = 0;
    rows.forEach(function (d){
        number += 1;
    });

    var db =  req.db;
    var csvEmployees = db.get('employees');

for(var i = 0; i < number; i++){
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

};


function randomToken() {
    return crypto.randomBytes(24).toString('hex');
}
