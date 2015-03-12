var baby = require('babyparse');
var sendgrid  = require('sendgrid')('robobetty', 'NoKcE0FGE4bd');


exports.get = function (req,res){
    var db =  req.db;
    var csvEmployees = db.get('csvEmployees');
    csvEmployees.find({registrationToken: {$exists: false}},function (err,results){

        if (err) { return res.sendStatus(500, err); }
        if(!results) { return res.send(404,'User not found');}

        employee = results;

    });

    csvEmployees.find({registrationToken: {$exists: true}}, function (err,results){


        if (err) { return res.sendStatus(500, err); }
        if(!results) { return res.send(404,'User not found');}

        notemployee = results;

    });

    res.render('business/addemployees',{title: 'Express', notsigned: notemployee, signed: employee});
};

exports.post = function (req,res){


    parsed = baby.parse(req.body.csvEmployees);
    rows = parsed.data;




    username = rows[0][0];
    email = rows[0][1];

    var token = randomToken();


    sendgrid.send({
        to: email,
        from: 'test@localhost',
        subject: 'Employee Signup',
        text: 'Hello ' + username + ',\n\n' + 'Please click on the following link, or paste this into your browser to complete sign-up the process: \n\n' +
        'http://robobetty/register/?token=' + token
    }, function (err, json){
        if (err) {
            return console.error(err);
        }
        var db =  req.db;
        var csvEmployees = db.get('csvEmployees');
        csvEmployees.insert({
            name: username,
            email: email,
            registrationToken : token,
        },{
            w: 1
        }, function (err){
            if (err) {
                return console.error(err);
            }
            res.redirect('/addemployees');
        })
    });

};
