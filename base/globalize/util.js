/*--
    各后台的语言映射
*/
exports.lang_mms = {
	'zh_cn': 'zh_cn',
	'zh_hk': 'zh_hk',
	'en_us': 'en',
	'hi_in': 'en'
};

// 根据区域获取mms的国际化语言
// 大陆支持：zh_cn,zh_hk；北美支持：zh_cn；香港支持：zh_hk,en
exports.getMmsLang = function (lang, region) {
	var res = 'zh_cn';
	if (region==='US') {
		res = lang==='en_us' ? 'zh_cn' : lang;
	} else if (region==='CN') {
		res = lang==='zh_hk' ? 'zh_hk' : 'zh_cn';
	} else if (region==='HK') {
		res = lang==='en_us' ? 'en' : 'zh_hk';
	}
	return res;
};

var langs;

// 加载语言文件
exports.loadLang = function () {
	if (!langs) {
		langs = {};
		var fs = require('fs');
		var names = ['zh_cn', 'zh_hk', 'en_us'];
		names.forEach(function (name) {
			var lines = fs.readFileSync(__dirname+'/lang/'+name+'.js', 'utf8').split('\n');
			var lang = {'name': name};
			lines.forEach(function (line) {
				var i = line.indexOf(':');
				if (i>0) {
					lang[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/\\s/g, ' ');
				}
			});
			langs[name] = lang;
		});
	}
	return langs;
};
