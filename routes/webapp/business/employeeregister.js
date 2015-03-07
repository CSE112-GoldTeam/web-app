exports.get = function(req,res){
    res.render('business/registeremployees');
};


exports.post = function (req){
    var db =req.db;
    var employee = db.get('csvEmployees');
    employee.update({'token': req.query.token}, function (err,results){
    });
};
