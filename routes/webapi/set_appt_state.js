exports.put = function (req, res, next) {

    // grab our db object from the request
    var db = req.db;
    var appt = db.get('appointments');
    // query the collection
    appt.find({_id:req.params.id},function(err,data){
        var myState = {};
        if (data[0].state == 'checkedIn'){
            myState = {$set: {state : "roomed"}};
        } else if (data[0].state == 'roomed'){
            myState = {$set: {state : "done"}};
        }

        appt.findAndModify({_id:req.params.id }, myState, function(err, data) {
            if (err) { return res.sendStatus(500, err); }
            return res.json(200, data);
        });
    });

};
