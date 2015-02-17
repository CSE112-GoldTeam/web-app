var express = require('express'),
    fs = require('fs'),
    gm = require('gm');
var router = express.Router();

router.get('/api/signature', function(req, res, next) {
    res.redirect('%20')
})

router.get('/api/signature/:text', function (req, res, next) {
    var text = req.params.text;

    var exec = require('child_process').exec,
        child;

    // creating an image
    gm(200, 100, "#ffffffff")
        .options({imageMagick: true})
        .transparent('#ffffffff')
        .fill('#000000')
        .font('Monotype-Corsiva',42)
        .drawText(10,50,text)
        .toBuffer('PNG',function (err, buffer) {
            //DO SOME ERROR CHECKING HERE
            res.set('Content-Type', 'image/png');
            res.send(buffer);
        });

});

module.exports = router;
