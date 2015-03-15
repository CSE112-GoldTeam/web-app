var plivo = require('plivo-node');

var sms = plivo.RestAPI({
    authId: 'SANJM0NZEWNJUZYJJLNG',
    authToken: 'MjAwZGZhNWNlNzJjYjE2ODFkNTQ2Y2U0OWM4YzI4'
});

exports.sendText = function (dst, text, fn) {
    sms.send_message({
        src: '14157235683',
        dst: dst,
        text: text,
        type: 'sms'
    }, function (status, response) {
        console.log(status, response);
        if (status >= 200 && status < 300) {
            fn();
        } else {
            fn(new Error('Plivo Error. Status code ' + status + '. Response: ' + response));
        }
    });
};
