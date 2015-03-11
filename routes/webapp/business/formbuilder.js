exports.get = function (req, res) {
    res.render('business/formbuilder', {title: 'Express'});
};

exports.get = function (req, res) {
  var forms = req.db.get('forms');
  forms.findOne({business: 'temp'}, function (err, form) {
    res.render('business/formbuilder', {
      title: 'Express',
      form: JSON.stringify(form)
    });
  });
};
