var regMobile = /phone|android|mobile|qqbrowser|ucweb|spider|samsung|symbianos|nokia|ipod|playstation|sinaweibobot|facebook|twitterbot/;
var regLetvphone = /\bx\d\d\d\b|leuibrowser|eui browser/;
// 判断是否PC浏览器
module.exports = function (ctx) {
	var src = (ctx.headers['user-agent'] || '').toLowerCase();
	if (src.indexOf('ipad')>-1 || !regMobile.test(src)) {
		return {pc: 1, src: src};
	}

	var ua = {
		src: src,
		// weixin: src.indexOf('micromessenger')>-1,
		android: src.indexOf('android')>-1,
		ios: src.indexOf('iphone os')>-1
	};
	if (src.indexOf('letvclient')>-1 || src.indexOf('letvmobileclient')>-1) {
		ua.letvapp = true;
	} else if (regLetvphone.test(src)) {
		ua.letvphone = true;
	}

	return ua;
};
