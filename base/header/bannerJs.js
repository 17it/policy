var UglifyJS = require('uglify-js');
var request = require('../../lib/request');
// var reportError = require('../../lib/reportError');
var globalJs = require('fs').readFileSync(__dirname+'/global.js', 'utf8');
globalJs = UglifyJS.minify(globalJs, {fromString: true}).code+'\n';

var iosUrl = 'appIos';
var androidUrl = 'appAndroid';
if (global.env.T_FRAG) { // t环境
	iosUrl = 'appIosTest';
	androidUrl = 'appAndroidTest';
}
var iosJs = globalJs, androidJs = globalJs, allJs = globalJs;
var loadFlag = true;

module.exports = function* (os) {
	loadFlag && (yield loadData());
	return os ? (os==='ios' ? iosJs : androidJs) : allJs;
};

function* loadData() {
	loadFlag = false;

	var app = yield {
		ios: request(iosUrl),
		android: request(androidUrl)
	};
	var all = 'if (info.ua.ios) {'+app.ios+'\n} else {'+app.android+'\n}';
	try {
		iosJs = globalJs+UglifyJS.minify(app.ios, {fromString: true}).code;
		androidJs = globalJs+UglifyJS.minify(app.android, {fromString: true}).code;
		allJs = globalJs+UglifyJS.minify(all, {fromString: true}).code;
	} catch (e) {
		// 编辑填的banner数据有语法错误
		console.error('bannerJs error: '+iosUrl+' or '+androidUrl+'\n'+e.message);
	}

	setTimeout(function () {
		loadFlag = true;
	}, 300000); // 缓存5分钟
}
