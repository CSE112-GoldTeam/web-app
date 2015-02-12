var express = require('express');
var router = express.Router();

router.get('/api/signature/:text', function (req, res, next) {
    var text = req.params.text;

    res.send(text);
});

module.exports = router;
