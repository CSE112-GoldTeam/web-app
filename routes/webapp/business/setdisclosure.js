var auth = require('../../../lib/auth');

exports.get = function(req, res) {
	var bid = req.user.Business[0]._id;
	var db = req.db;
	var business = db.get('businesses');
	business.find({_id: bid}, function (err, result) {
		var dbBusiness = result[0];
		//console.log(result);
		var disclosure = dbBusiness.disclosure;

		disclosure = disclosure.slice(3);
		disclosure = disclosure.replace(/<p>/g, '\n');
		disclosure = disclosure.replace(/<\/p>/g, '\n');

		res.render('business/setdisclosure', {
			disclosure: disclosure
		});
	});
	
};

exports.post = function(req, res) {
	var bid = req.user.Business[0]._id;
	var db = req.db;
	var business = db.get('businesses');
	console.log("bid: ---->>>>++++>>>: "+bid);
	var disclosure = req.body.disclosure;

console.log("disclosure:------------------------------------->>>>>>>>>>>>>>>>>>>> "+disclosure);
	disclosure = disclosure.replace(/\r\n\r\n/g, '</p><p>');
	disclosure = disclosure.replace(/\r\n/g, '</p><p>');
	disclosure = '<p>' + disclosure + '</p>';
	business.findAndModify({_id: bid},{
		$set :{
			disclosure: disclosure
		}
	});

	res.render('business/setdisclosure', {
			disclosure: req.body.disclosure
		});
}