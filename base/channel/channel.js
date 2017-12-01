var request = $require('lib/request');
// var locache = $require('lib/locache');
var regDomain = /^http:\/\/m\.le\.com/;

module.exports = function* (enameData) {
    // var region = this.region;
    var geo = this.geo;
    var langName = this.lang.name === 'en_us' ? 'en' : this.lang.name;

    if (enameData) {
		enameData.region = this.region;
        return yield this.include("base/channel/channelV2", enameData);
    }
    /*var data = yield locache.get('/base/channel');
    if (data) {
        return data;
    }*/

    data = this.render(__dirname+'/channel.html', yield {
        nav: getNav(geo, langName),
        title: this.lang.x005,
        ecoNav: getEcoNav(geo, langName)
    });
    //locache.set('/base/channel', data);
    return data;
};

function* getNav(geo, langName) {
	var data = yield request(geo.channelNav+'&v=1&lang='+langName, 10, function (res) {
		var nav = [];
		res.data.blockContent.forEach(function (item) {
			if (item.playPlatform && item.playPlatform['420001']) {
				item.url = item.url.replace(regDomain, '');
				if (item.androidUrl) {
					item.cls = ' class="j-android"';
				} else if (item.iosUrl) {
					item.cls = ' class="j-ios"';
				} else {
					item.cls = '';
				}
                //2016-9-2 去掉只展示在导航中的频道
                if (item.position!=="navigation") {
                    nav.push(item);
                }
			}
		});
		return nav;
	});
	return data;
}

function* getEcoNav(geo, langName) {
	var data = yield request(geo.ecoNav+'&v=1&lang='+langName, 10, function (res) {
		res.data.blockContent.forEach(function (item) {
			if (item.tagUrl) {
				item.tagurl = ' tagurl="'+item.tagUrl+'"';
			} else {
				item.tagurl = '';
			}
		});
		return res.data.blockContent;
	});
	return data;
}
