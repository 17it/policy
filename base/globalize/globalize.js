var get = $require('lib/get');
var langs = require('./util').loadLang();
var geoConf = require('./geo');
var envGeo = global.env.GEO;

module.exports = function* (next) {
	var lang = this.cookies.get('lang'), geo = this.cookies.get('geo');
	// if (this.query.geo) { // 用于测试时手动设置地域，上线后请注释掉！
	// 	geo = this.query.geo;
	// 	this.cookies.set('geo', geo, {domain: '.le.com', httpOnly: false});
	// }
	if (!lang) {
		if (this.query.locale) { // 只用于facebook抓取页面时设置语言
			var ua = this.headers['user-agent'] || '';
			if (ua.indexOf('facebook')>-1) {
				lang = this.query.locale;
				langs.hasOwnProperty(lang) || (lang = 'zh_cn');
			} else {
				lang = getLang(this.headers);
				this.cookies.set('lang', lang, {domain: '.le.com', httpOnly: false});
			}
		} else {
			lang = getLang(this.headers);
			this.cookies.set('lang', lang, {domain: '.le.com', httpOnly: false});
		}
	}
	if (!geo) {
		if (envGeo) {
			geo = envGeo;
		} else {
			geo = yield get('http://geo.mob.app.letv.com/geo?platform=msite&ip='+
				getClientIp(this), false, 1000);
			if (geo && geo.body && geo.body.country && geo.body.country!=='XX') {
				geo = geo.body.country+'_'+geo.body.provinceid+'_'+geo.body.districtid;
			} else {
				geo = 'CN_1_9';
			}
		}
		// , expires: new Date(Date.now() + 86400000)
		this.cookies.set('geo', geo, {domain: '.le.com', httpOnly: false});
	}

	this.lang = langs[lang];
	this.region = geo.split('_')[0];
	this.geo = geoConf[this.region] || geoConf.CN;
	this.district = geo;

	yield next;
};

function getClientIp(req) {
	return req.headers['x-real-ip'] ||
		req.headers['x-forwarded-for'] || '127.0.0.1';
}

// zh-CN 华语 - 中国
// zh-HK 华语 - 香港
// en-US 英语 - 美国
// en-GB 英语 - 英国
// hi-IN 印度语
function getLang(headers) {
	var lang = 'zh_cn';
	if (headers) {
		var al = (headers['accept-language'] || '').split(';')[0].toLowerCase();
		if (al.indexOf('zh-cn')>-1) {
			lang = 'zh_cn';
		} else if (al.indexOf('zh-tw')>-1 || al.indexOf('zh-hk')>-1) {
			lang = 'zh_hk';
		} else if (al.indexOf('en-us')>-1 || al.indexOf('en-gb')>-1) {
			lang = 'en_us';
		}
	}
	return lang;
}
