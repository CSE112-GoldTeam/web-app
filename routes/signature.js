/**
 * These two lines require the 'express' and the 'gm' library. These libraries are loaded into the folder
 * 'node_modules' when someone runs 'npm install'. How does NPM know what to download? Check out the 'package.json' file
 * to see!
 */
var express = require('express'),
    gm = require('gm');

/**
 * This creates a new Router instance.
 */
var router = express.Router();

/**
 * This is the key part of Express. On the web there are two main types of requests: GET and POST. A GET request is where
 * you're just getting a webpage. Sometimes variables are passed in through the URL. A POST request is where you're sending
 * data to a webpage before it renders the HTML for you (this is a bit of a simplification about the difference but it'll
 * work for the sake of example). A POST request is like when you submit a form.
 *
 * This function registers a GET request with our server. There are two arguments here: the first one is a string that
 * represents the URL. The second is the handler function. Whenever anyone visits that URL on our server it will use that
 * handler function. Pretty cool, huh?
 */
router.get('/api/signature', function (req, res) {
    /**
     * This line uses `res` (which is short for response) to redirect the user to the page with "%20" appended to the
     * URL.
     */
    res.redirect('%20');
});

/**
 * Another GET request! This time it's a bit different. Notice how ":text" is in the URL? That means we're expecting a
 * variable and we'll store it in the `text` variable. So /api/signature/abc and /api/signature/jfkjfsdk both would
 * use this function handler.
 */
router.get('/api/signature/:text', function (req, res) {
    /**
     * req.params.<var> stores all the variables from the url. Like `text`!
     */
    var text = req.params.text;

    /**
     * So we're using an external library called graphicsmagick. `gm` is a library meant to interface with it. To see the
     * docs for it check out here: http://aheckmann.github.io/gm/docs.html
     */
    gm(500, 100, '#ffffffff')
        .options({imageMagick: true})
        .transparent('#ffffffff')
        .fill('#000000')
        .font('brushscript.ttf', 32)
        .drawText(10, 50, text)
        .trim()
        .toBuffer('PNG', function (err, buffer) {
            //DO SOME ERROR CHECKING HERE
            /**
             * res is short for "response". It's what we give back to the user
             */
            res.set('Content-Type', 'image/png');
            res.send(buffer);
        });

});

/**
 * Now that we're done creating the routes we're gonna return them as an export. That means that whenever anyone does
 * `var x = require('signature.js')`
 * They'll be able to access our routes! (checkout app.js to see this in action)
 */
module.exports = router;
