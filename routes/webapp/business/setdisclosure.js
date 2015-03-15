var auth = require('../../../lib/auth');

exports.get = function(req, res) {
	var bid = req.user.Business[0]._id;
	var db = req.db;
	var business = db.get('businesses');
	business.find({_id: bid}, function (err, result) {
		var dbBusiness = result[0];
		console.log(result);
		var disclosure = dbBusiness.disclosure;



		res.render('business/setdisclosure', {
			disclosure: disclosure
		});
	});
	
};

//exports.post = function(req, res) {

//}