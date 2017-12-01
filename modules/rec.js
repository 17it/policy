var mms = require('./mms');
var api = $require('data/api');
var request = $require('lib/request');
exports.formatRecData = function* (data, langName, region, num) {
    var list = [];
    for (var i=0,len=data.length; i<len; i++) {
        var item = data[i];
        var $item = {};
        $item.vid = item.vid || '';
        $item.pid = item.pid || '';
        $item.zid = item.zid || '';

        //TODO:如果是在APP内，过滤掉APP无版权的

        if (!item['vid'] && !item['pid'] && !item['zid']) continue;
        if ($item.vid) {
            $item.url = '/vplay_'+$item.vid+'.html';
        } else if ($item.pid) {
            // 取视频专辑下第一个vid
            var cid = item.cid || 0;
            // if(!cid){
            //     var albumInfo = yield mms.getAlbumInfos($item.pid, 0);
            //     if (!albumInfo || albumInfo['deleted'] == 1){
            //         $item.vid = 0;
            //     }
            //     var cid = albumInfo['category'] ? Object.keys(albumInfo['category'])[0] : 0;
            // }
            var albumInfo = albumInfo || '';
            //暂时方案，推荐没有对接香港媒资库，所以推荐的数据都从大陆的媒资库中读取相关信息。用‘rec’标识来自推荐
            // var videoInfo = yield mms.getPlayVidByAid(cid, $item.pid, albumInfo, langName, region, 'rec');
            var videoInfo = yield mms.getPlayVidByAidV2(cid, $item.pid, albumInfo, langName, region, 'rec');
            $item.vid = videoInfo ? videoInfo.id : 0;
            $item.isAutoPid = 1;
            if (!$item.vid) continue;
            $item.url = '/vplay_'+$item.vid+'.html';
        } else if ($item.zid) {
            if (/http:\/\/*/.test(item.playurl)) {
                $item.url = item.playurl
            } else {
                continue;
            }
        }
        //TODO获取视频播放数
        //如果是专辑，标题优先取专辑名，非专辑，标题优先取视频标题
        if (item.isalbum != 1) {
            $item.title = item.title || item.pidname || '';
        } else {
            $item.title = item.pidname || item.title || '';
        }
        $item.subTitle = item.subtitle || '';
        if (item.cid == 2 || item.cid == 5) {
            if (item.episodes && item.vcount) {
                if (parseInt(item.episodes) > parseInt(item.vcount)) {
                    $item.subTitle ='更新至' + item.vcount + '集';
                } else {
                    $item.subTitle = $item.subTitle || item.episodes + '集全';
                }
            }
        } else if (item.cid == 9) {//音乐频道单独逻辑
            if (item.isalbum != 1) {
                if (item.subtitle) {
                    $item.title = item.subtitle;
                    $item.subTitle = '';
                } else {
                    $item.title = item.title || item.pidname;
                    $item.subTitle = item.starring || '';
                }
            } else {
                $item.title = item.pidname;
                $item.subTitle = '';
            }
        }
        $item.pic = item['pic320*200'] ? item['pic320*200'] : item.video_pic ? item.video_pic+'/thumb/2_200_150.jpg' : 'http://i2.letvimg.com/lc04_img/201601/08/16/37/img_bg.png';
        $item.payPlatform = item.payPlatform || {};
        item['pay_platform'] = item['pay_platform'] || '';
        $item.payPlatform['141001'] = item['pay_platform'].indexOf('pc_web')>=0 ? 1 : 0;
        $item.acode2 = '0';//自动推荐 zyr线上没了
        list.push($item);
    }
    //如果数据是单数，那么舍弃最后的
    /*if (list.length%2) {
        list.pop();这个应该可以删除了哈
    }*/
    return list;
};