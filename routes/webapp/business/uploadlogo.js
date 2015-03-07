exports.get = function(req,res){
    res.render('business/uploadLogo',{title:'Upload Logo'});
};

exports.post = function(req,res){
    var db = req.db;
    var businesses = db.get('businesses');

    if(req.files.userLogo){

        var businessID = req.body.business;

        businesses.update(
            {
                _id:businessID
            },{
                $set: {
                    logo: '/static/images/'+req.files.userLogo.name
                }
            },{
                upsert: true
            }, function (err){

                if (err) {
                    console.error('MongoDB Error in /api/photo: ' + err);
                    return res.send(500);
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
