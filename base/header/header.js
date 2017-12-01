var fragJsCss = $require('modules/fragJsCss');
//var shareInfo = $require('data/shareInfo');
var bannerJs = require('./bannerJs');

module.exports = function* (data) {
	// console.log(shareInfo);
	var langName = this.lang.name;
	//使用不同的语言配置文件
	var shareInfo = $require('data/shareInfo_'+langName);
	data.cssLink = yield fragJsCss.loadCss(data.css);
	var info = data.info;
	info.lang = langName;
	info.region = this.region;
	info.share || (info.share = shareInfo[info.pageid] || shareInfo[info.cname||info.ename]);
	data.share = info.share || {};
	// data.pageInfo = JSON.stringify(info);
	data.ptvcid = info.ptvcid;
	data.bannerJs = yield bannerJs(data.os);
	// data.uri = encodeURIComponent(this.url);
	data.url = this.url;
	langName==='zh_cn' ||
	(data.bodyClass = data.bodyClass ? data.bodyClass+' '+langName : langName);
	data.region=this.region;
	data.xzapp=this.lang.x803;
	if(newItems(data.info.pageid)){
		return this.render(__dirname+'/headerV2.html', data);
	}
	return this.render(__dirname+'/header.html', data);
};

function newItems(pageid){
	return ["home","channel/home","hot","top","live/home"].indexOf(pageid)>-1;
}