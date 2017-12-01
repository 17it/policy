/*--
	加载公共碎片
*/
var request = require('../lib/request');
var commonFrags = require('../data/commonFrags');

exports.loadFrags = function* (fragNames) {
	var frags = {};

	fragNames.forEach(function (fragName) {
		var fragUrl = commonFrags[fragName];
		if (fragUrl) {
			frags[fragName] = request(fragUrl, 5);
		}
	});
	
	return yield frags;
};

exports.loadFrag = function* (fragName, expire) {
	var fragUrl = commonFrags[fragName];

	if (fragUrl) {
		return yield request(fragUrl, expire || 5);
	}

	return '';
};
