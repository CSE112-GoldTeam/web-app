/**
 * GraphicsMagick plugin
 */
var gm = require('gm');

/**
 * Redirects to an empty space. Otherwise, attempting to render empty text
 * would cause an error.
 *
 * @param req
 * @param res
 * @returns N/A
 */
exports.getDefault = function (req, res) {
    res.redirect('%20');
};

/**
 * Creates an image by converting the a String (the user's input) into an
 * image. The image is created by drawing the user's input as text with a
 * cursive font on a transparent background, and serves as an electronic 
 * signature.
 *
 * @param req
 * @param res
 * @returns {Object} A Buffer object containing an image of the user's 
 * 'signature' in PNG format.
 */
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
