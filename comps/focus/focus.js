var request = $require('lib/request');
var locache = $require('lib/locache');
var repeat = $require('air/string/repeat');
var lastAd = require('./lastAd');
var cms = $require('modules/cms');
var api = $require('data/api');

module.exports = function* (obj) {
	var data = obj && obj.data;
	var num = data && data.num || 6;
	var focusList = [];
	var cmsId = data && data.id;
	var dataKey = data && data.id ? data.id : 'focus/' + obj.pageid;

	// if (obj.pageid==='vip') {
	// 	var url = api.focusList+'&focus=vippage_focus';
	// 	var res = yield request(url);
	// 	if (res.code == 200) {
	// 		focusList = res.data;
	// 		if (focusList.length > num) {
	// 			focusList = focusList.splice(0, num);
	// 		}
	// 	}
	// } else if (obj.pageid==='home') {//首页请求接口，同时最后一个焦点图位置给商城维护，是广告
	// 	var res = yield request('focusList');
	// 	if (res.code == 200) {
	// 		focusList = res.data;
	// 	}
	// 	if (!focusList instanceof Array) return;
	// 	focusList = focusList.concat(); // 复制出一个新数组
	// 	if (focusList.length > num) {
	// 		focusList = focusList.splice(0, num);
	// 	}
	// 	var lastad = yield lastAd();
	// 	lastad && focusList.push(lastad);
	// } else if (cmsId) {
		var res = yield cms.getCmsFormatDataNew({
			blockId: cmsId,
			num: num,
			type: 'focus',
			geo: this.geo,
			langName: this.lang.name
		});
		if (res) {
			res.forEach(function (item) {
				if (!item.pic || !item.url) {return}
				if (!(obj.pageid==='home') && (item.title || item.subTitle)){
					item.titleHtml = '<span class="s-txt"><b class="b-1"></b>'+
									(item.title ? '<b class="b-2">'+item.title+'</b>' : '') +
									(item.subTitle ? '<b class="b-3">'+item.subTitle+'</b>' : '')+
									'</span>';
				}
				var $item = {
					img: item.pic,
					url: item.url,
					titleHtml: item.titleHtml
				};
				focusList.push($item);
			});
			if (obj.pageid==='home') {
				var lastad = yield lastAd();
				lastad && focusList.push(lastad);
			}
			if (focusList.length===0) {return}
		}
	//}

	data = {};
	data.focusList = focusList;
	data.blankLi = repeat('<li></li>', focusList.length - 1);
	//console.log(data);
	//data.region=
	var res = this.render(__dirname+'/focus.html', data);
	return res;
};