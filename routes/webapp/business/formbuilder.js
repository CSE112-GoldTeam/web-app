exports.get = function (req, res) {
    res.render('business/formbuilder', {title: 'Express'});
};

exports.get = function (req, res) {
  var forms = req.db.get('forms');
  forms.findOne({_id: '54ff31291cb54b1d7b1819af'}, function (err, form) {
    res.render('business/formbuilder', {
      title: 'Express',
      form: JSON.stringify(form)
    });
  });
};
