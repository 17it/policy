var cms = $require('modules/cms');

module.exports = function* () {
	var geo = this.geo,
		lang = this.lang;
	// if (region != 'HK') {
		var nav = yield cms.getCmsDataNew({
			'geo': geo,
			'langName': lang.name,
			'blockId': '5168'
		}, function (res) {
			var nav = [];
			res.data && res.data.blockContent.forEach(function (item) {
				if (item.playPlatform && item.playPlatform['420001']) {
					nav.push({
						title: item.title,
						url: item.url,
						remark: item.remark
					});
				}
			});
			return nav;
		}) || [];
	// }

	return this.render(__dirname+'/bottomNav.html', {
		'nav': nav,
		'copyRight': lang.x006
	});
};
