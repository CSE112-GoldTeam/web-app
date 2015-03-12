exports.get = function (req, res) {

	req.session.companyName = null;

	req.session.save(function (err) {
            
            if (err) {
                
                console.error('Error saving session', err);
            }
        });
    
    res.render('business/landing', {title: 'Landing Page'});
};

exports.post = function (req, res) {
    var companyName = req.body.companyName;

    if (companyName === '') {
        
        res.redirect('/register');
    } else {
        
        req.session.companyName = companyName;

        req.session.save(function (err) {
        
            if (err) {
        
                console.error('Error saving session', err);
            }
        
            res.redirect('/register');
        });
    }
};