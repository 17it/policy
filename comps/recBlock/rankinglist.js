var channelData = $require('data/channel');
var request = $require('lib/request');
var mms = $require('modules/mms');


var shorten = $require('air/number/shortenGlobal');

module.exports = function*(block, ename) {
    // var a = yield topList.call(this, ename || "movie");
    //var a = yield getTopData.call(this,ename||'tv',3,this.lang);
    // var a3 = a.channelVideoList.slice(0, 3);
    /*
     加注释，但是先不删除，郭总说后期会做...
     for (var index = 0; index < a3.length; index++) {
     var v = a3[index];
     //v.starring = v.starring.slice(0, 3).join(" ");
     var pid = (yield mms.getVideoInfo(v.vid)).pid;
     pid && (v.playStatus = (yield mms.getAlbumInfos(pid, 0)).playStatus || "");//不传第二个参数，不会返回playSatus结果
     }*/
    return yield topList.call(this, ename || "movie".block.contentTotal);
};


function* topList(curCname, num) {
    var curChannel = {};
    //使用不同的频道配置文件
    var channelData = $require('data/channel_CN');
    //获取当前频道的信息
    for (var i in channelData) {
        if (i == curCname) {
            if (!channelData[i].topUrl) {//没有排行b         ban
                return { channelVideoList: [] }
            }
            curChannel.cname = i;
            curChannel.topUrl = channelData[i]['topUrl']['playCount']['day'];
            break;
        }
    }
    return yield getTopData(curChannel, num, this.lang.name);
}

function* getTopData(curChannel, num, lang) {
    num = num || 3;
    result = [];
    var data = yield request(curChannel.topUrl, 5);
    for (var i = 0, len = data.length; i < len && i < num; i++) {
        var item = data[i];
        var $item = {};
        $item['title'] = item['name'] || '';
        if (curChannel.cname === 'tv' || curChannel.cname === 'comic') {
            var videoInfo = yield mms.getPlayVidByAid(item.cid, item.id);
            if (videoInfo) {
                $item['vid'] = videoInfo.id;
            } else {
                continue;
            }
        } else {
            //http://www.lesports.com/video/24858182.html
            //http://www.le.com/ptv/vplay/24847921.html
            if(!item.url){
                continue;
            }
            var res = item.url.match(/\/(vplay|video)\/(\d+)\.html/);
            if (res instanceof Array) {
                $item['vid'] = res[2];
            } else {
                continue;
            }
        }
        $item['pid'] = item['id'] || '';
        $item['cid'] = item['cid'] || '';
        $item['pic'] = item['picall']['400*225'] || item['picall']['400*300'] || item['picurl'];//zyr
        $item['playCount'] = shorten(Number(item['playcount']), 1, lang) || 0;
        $item['tag'] = item['tag'] ? item['tag'].join(' ') : '';
        result.push($item);
    }
    return result;
}
