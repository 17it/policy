var request = $require('lib/request');
//var api = $require('data/api').getCmsUrl('2784');

module.exports = function* () {
	var render = this.render,
		region = this.region,
		lang = this.lang,
		langName = lang.name === 'en_us' ? 'en' : lang.name,
		geo = this.geo;
	var res = yield request(geo.getCmsUrl('2784')+'&a=1&lang='+langName, 5, function (data) {
		var list = [];
		data = data.data.blockContent;
		data.forEach(function (item) {
			if (item.pic1==='' || item.url==='' || item.title==='') {return ''}
			var r = {
				p: item.priority || 1,
				img: item.pic1,
				title: item.title,
				subTitle: item.subTitle || '',
				url: item.url
			};
			list.push(r);
		});
		if (list.length===0) {return ''}
		list.sort(function (a, b) {
			return a.p>b.p ? -1 : 1
		});
		var viewData = {
			'list': list,
			'title': lang.x902
		}
		return render(__dirname+'/appList.html', viewData);
	});
	return res;
};
