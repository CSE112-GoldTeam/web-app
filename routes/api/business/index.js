'use strict';

var express = require('express');
var controller = require('./business.controller');

var router = express.Router();

/**
* @api {get} /m/business List businesses
* @apiName index
* @apiGroup Business
* @apiPermission admin
*
* @apiSuccess {Nothing} Nothing See the business schema...
* @apiSuccessExample {json} Success-Response (example):
* HTTP/1.1 200 OK
{
	"_id" : "5500a18ac0a954cae1bbf23a",
	"companyName" : "Arch Health Partners",
	"email" : "1letterboy@gmail.com",
	"password" : "$2a$08$KoipSqlCwrLi2dSRcvCHse1mpzMnRfA1NCBZaaAEf2fQ1U9tVIYp.",
	"phone" : "16199209355",
	"disclosure" : "A very long disclosure",
	"logo" : "/images/uploads/arch.png",
	"style" : {
		"buttonBg" : {
			"r" : 202,
			"g" : 122,
			"b" : 33,
			"a" : 1
		},
		"buttonText" : {
			"r" : 255,
			"g" : 255,
			"b" : 255,
			"a" : 1
		},
		"containerBg" : {
			"r" : 255,
			"g" : 255,
			"b" : 255,
			"a" : 0.95
		},
		"containerText" : {
			"r" : 21,
			"g" : 24,
			"b" : 49,
			"a" : 1
		},
		"bg" : "bg5.jpg"
	}
}

*
 */
router.get('/', controller.index);
// router.get('/:id', controller.show);
// router.post('/', controller.create);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;
