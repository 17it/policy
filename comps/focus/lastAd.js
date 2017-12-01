//获取轮播图最后一帧广告
var request = require('../../lib/request');
var locache = require('../../lib/locache');
var url = require('../../data/api').getCmsUrl('2979');

module.exports = function* () {
	var data = yield locache.get('lastAd');
	if (data) {return data}
	data = yield request(url);
	if (data && data.blockContent && data.blockContent.length) {
		data = data.blockContent;
		var item = data[data.length - 1];
		data = {
			img: item.mobilePic,
			pic: item.mobilePic,
			tagUrl: item.tagUrl,
			title: '',
			subTitle: ''
		};
		locache.set('lastAd', data);
		return data;
	}
	return null;
};
