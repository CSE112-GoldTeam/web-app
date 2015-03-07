var passport = null;
exports.init = function (passportIn) {
    passport = passportIn;
};

exports.get = function(req, res) {
    res.render('business/login.hjs');
};

exports.post = function () {
    return passport.authenticate('local-login', {
        successRedirect : '/config',
        failureRedirect : '/login'
    });
};