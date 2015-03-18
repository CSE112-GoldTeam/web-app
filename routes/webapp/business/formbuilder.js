exports.get = function (req, res) {
    res.render('business/formbuilder', {title: 'Express'});
};

exports.get = function (req, res) {
  var forms = req.db.get('forms');
  var businessID = req.user[0].business;
  forms.findOne({business: businessID.toString()}, function (err, form,findID) {
    res.render('business/formbuilder', {
      title: 'Express',
      form: JSON.stringify(form),
      findID: businessID
    });
  });
};
