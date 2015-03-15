exports.get = function (req, res) {
    res.render('business/formbuilder', {title: 'Express'});
};

exports.get = function (req, res) {
  var forms = req.db.get('forms');
  var businessID = req.user.Business[0]._id;
  forms.findOne({business: businessID.toString()}, function (err, form,findID) {
    res.render('business/formbuilder', {
      title: 'Express',
      form: JSON.stringify(form),
      findID: businessID
    });
  });
};
