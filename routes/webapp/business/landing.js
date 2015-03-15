exports.get = function (req, res, next) {

	req.session.companyName = null;

	req.session.save(function (err) {
            
            if (err) {
                
                return next(err);
            }
        });
    
    res.render('business/landing', {title: 'Landing Page'});
};

exports.post = function (req, res, next) {
    var companyName = req.body.companyName;

    if (companyName === '') {
        
        res.redirect('/register');
    } else {
        
        req.session.companyName = companyName;

        req.session.save(function (err) {
        
            if (err) {
        
                return next(err);
            }
        
            res.redirect('/register');
        });
    }
};