var gm = require('gm');

exports.getDefault = function (req, res) {
    res.redirect('%20');
};

exports.get = function (req, res) {
    var text = req.params.text;

    // creating an image
    gm(500, 100, '#ffffffff')
        .options({imageMagick: true})
        .transparent('#ffffffff')
        .fill('#000000')
        .font('brushscript.ttf', 32)
        .drawText(10, 50, text)
        .trim()
        .toBuffer('PNG', function (err, buffer) {
            //DO SOME ERROR CHECKING HERE
            res.set('Content-Type', 'image/png');
            res.send(buffer);
        });

};
