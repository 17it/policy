var request = $require('lib/request');
// var locache = $require('lib/locache');
var regDomain = /^http:\/\/m\.le\.com/;

module.exports = function* (enameData) {
    // var data = yield locache.get('/base/channel');
    // if (data) {
    // 	return data;
    // }
    var lang = this.lang;
    var geo = this.geo;
    var langName = lang.name==='en_us' ? 'en' : lang.name;
    var nav = yield getNav(geo, langName);
    var navWall = [];
    nav.forEach(function (item) {
        if (item.position!=="navigation") {
            navWall.push(item);
        }
    });

    var channel = this.render(__dirname+'/channelV2.html', {
        navList: nav,
        ename: enameData.ename || '',
        region: enameData.region
    });
    var channelWall = this.render(__dirname+'/channelWall.html', {
        'specialNav': navWall.slice(0, 4),
        'nav': navWall.slice(4),
        ecoNav: yield getEcoNav(geo, langName),
        region: enameData.region,
        ename: enameData,
        lang: lang
    });

    return {
        'nav': channel,
        'wall': channelWall
    };
    // locache.set('/base/channel', data);
    // return data;
};

function* getNav(geo, langName) {
	var data = yield request(geo.channelNav+'&v=2&lang='+langName, 10, function (res) {
		var nav = [];
	    res.data.blockContent.forEach(function (item, i) {
	        var $item = {};
	        if (item.playPlatform && item.playPlatform['420001']) {
	            $item.pic = item.picList.h5Pic;
	            $item.title = item.title;
	            $item.url = item.url.replace(regDomain, '');
	            $item.ename = $item.url[0]==='/' && $item.url.split('/')[1];
	            $item.position = item.position; // 此项只展示在导航条，不展示在频道墙

	            if (item.androidUrl) {
	                $item.cls = 'j-android';
	            } else if (item.iosUrl) {
	                $item.cls = 'j-ios';
	            }
	            if (item.remark==='redpoint') {//加红点
	                $item.cls = $item.cls ? $item.cls+' icon_reddot' : 'icon_reddot';
	            }

	            nav.push($item);
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
