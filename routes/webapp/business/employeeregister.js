var passport = null;
exports.init = function (passportIn) {
    passport = passportIn;
};

exports.get = function(req,res){
    res.render('business/registeremployees');
};


exports.post = function (){
     return passport.authenticate('local-signup-employee',{
        successRedirect : '/config', // redirect to the secure profile section
        failureRedirect : '/register' // redirect back to the signup page if there is an error
    });
};
