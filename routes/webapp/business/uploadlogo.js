var fs = require('fs');

exports.get = function(req, res, next){
    
    var db = req.db;
    var businesses = db.get('businesses');

    var businessID = '54eca979f2a2d47937757617';

    businesses.findById(businessID,
        function (err, results){
            if(err){
                return next(err);
            }

            if(results.logo){

                res.render('business/uploadLogo',
                    {title:'Upload Logo',logo: results.logo});
            }
            else{
                res.render('business/uploadLogo',
                    {title:'Upload Logo'});
            }
        }    
    );

};

exports.post = function(req, res, next){

    var db = req.db;
    var businesses = db.get('businesses');
    var businessID = '54eca979f2a2d47937757617';

    if(req.files.userLogo){

        businesses.findById(businessID,
            function (err, results){

                if(err){
                    return next(err);
                }

                fs.unlink('public/'+results.logo);
            }    
        );

        businesses.updateById(businessID, {
                $set: {
                    logo: '/images/uploads/' + req.files.userLogo.name
                }
            },{
                upsert: true
            }, function (err){
                if (err) {
                    return next(err);
                }

                res.render('business/uploadLogo',{
                    success:'Succesfully uploaded file: '+req.files.userLogo.originalname,
                    logo:'/images/uploads/'+req.files.userLogo.name
                });

            }

        );
    }
    else{

        businesses.findById(businessID,
            function (err, results){
                if(err){
                    return next(err);
                }

                if(results.logo){

                    res.render('business/uploadLogo',{
                        title:'Upload Logo',
                        logo:results.logo,
                        error:'Please select a valid image(png,jpg) file to upload.'
                    });
                }
                else{
                    res.render('business/uploadLogo',{
                        title:'Upload Logo',
                        error:'Please select a valid image(png,jpg) file to upload.'
                    });
                }
            }    
        );
    }

};
