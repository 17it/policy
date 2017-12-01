var request = $require('lib/request');
var liveHotList = $require("data/api").liveHotList;
var shorten = $require('air/number/shortenGlobal');
var api = $require("data/api");
var calcUrlAndClass = $require("main/live/listModel").calcUrlAndClass;
var apiNum = [api.onlineNumber, api.zhiboAll];
module.exports = function*(config, langName) {
    var sortHotItems = (yield request(liveHotList + '?lang=' +
        (langName === 'zh_hk' ? 'cht' : 'chs'), 2)).sortHotItems;//缓存2min
    var dataList = [];
    var howmuch = config.contentTotal;
    if (howmuch == 0) {
        return dataList;
    }
    for (var i = 0; i < sortHotItems.length - 1; i++) {//zyr 郭正说不要回看了
        for (var j = 0; j < sortHotItems[i]["data"].length; j++) {
            var $item = {}, item = sortHotItems[i]["data"][j];
            $item.status = item.status;//3：回看 2：直播 1：预告
            $item.title = item.title || "";
            $item.type = item.typeName || item.type || item.level2 || item.level1 || "";
            $item.time = item.beginTime && (item.beginTime.slice(5, 16)) || "";
            if ($item.status == 1) {
                $item.hourMin = $item.time.split(' ')[1];
                $item.MonthDay = $item.time.split(' ')[0];
            }
            $item.pic = item.focusPic["pic3_400_225"] || "";
            $item.id = item.id || "";
            if (item.isVS) {
                $item.homeImgUrl = item.homeImgUrl;
                $item.guestImgUrl = item.guestImgUrl;
                $item.home = item.home;
                $item.guest = item.guest;
                $item.isVS = item.isVS
            }
            calcUrlAndClass($item, item, item.liveType);
            dataList.push($item);
            if (dataList.length == howmuch) {
                break;
            }
        }
        if (dataList.length == howmuch) {
            break;
        }
    }

    /*for (var i = 0; i < dataList.length; i++) {
     var $item = dataList[i];
     if ($item.status != 1) {
     $item.numberOfPeople = (yield request(apiNum[$item.status ^ 2] + $item.id)).number || 0;
     $item.number = shorten(Number($item.numberOfPeople), 2);
     }
     }*/
    //config.videoList = dataList;
    return dataList;

    //http://n.api.live.letv.com/napi/onlineNumber/all/zhibo/1020160616085204?callback=jsonp3
    //http://n.api.live.letv.com/napi/uv/all/zhibo/1020160616085204?callback=jsonp4
};