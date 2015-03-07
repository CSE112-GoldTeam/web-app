exports.get = function(req, res, next){
    res.render('business/uploadLogo',{title:'Upload Logo'});
};

exports.post = function(req, res, next){
    var db = req.db;
    var businesses = db.get('businesses');

    if(req.files.userLogo){
        var businessID = req.body.business;

        businesses.updateById(businessID, {
                $set: {
                    logo: '/static/images/' + req.files.userLogo.name
                }
            },{
                upsert: true
            }, function (err){
                if (err) {
                    return next(err);
                }

                res.render('business/uploadLogo',{
                    success:'Succesfully uploaded file: '+req.files.userLogo.originalname
                });

            });
    }
    else{
        res.render('business/uploadLogo',{
            error:'Please select a valid image(png,jpg) file to upload.'
        });
    }

};
