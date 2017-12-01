var md5 = $require('lib/md5');
var locache = $require('lib/locache');
var api = $require('data/api');
var getMmsLang = $require('base/globalize/util').getMmsLang;
var request = $require('lib/request');
var parseJson = $require('lib/parseJson');
var querystring = require('querystring');
var mmsKey = 'mletvsiop';
var platform = 'pc', platformId = 420001;

// amode 专辑信息输出 0：全量 1：精简
function* getAlbumInfos(albumId, amode, reset) {
    if (!albumId) return;
    // amode = typeof amode === 'undefined' ? 1 : 0;

    var token = md5(albumId + platform + mmsKey);
    var params = {
        'id': albumId,
        'amode': amode || 0,
        'token': token,
        'platform': platform
    };
    var url = api.mmsApi + '/mms/inner/albumInfo/get?' + querystring.stringify(params);
    var data = yield request(url, {expire:3, type:'txt', reset:reset}, function (res) {
        var starring = res.match(/"starring":\{(.+?)\}/);
        starring = starring ? starring[1] : '';
        starring = starring.replace(/"/g, '').replace(/\d+:/g, '').split(',');
        res = parseJson(res);
        if(res.data && res.data.starring){
            res.data.starring = starring;
        }
        return res.data;
    });

    return data; //???接口返回格式决定要取数组第一个？？
}

// 获取专辑信息，多语言版
// amode 专辑信息输出 0：全量 1：精简
exports.getAlbumInfo = function*(albumId, amode, lang, region) {
    if (!albumId) return;
    amode = amode === 0 ? 0 : 1;

    var token = md5(albumId + platform + mmsKey);
    var params = {
        'id': albumId,
        'amode': amode,
        'lang': getMmsLang(lang, region),
        'region': region || 'CN',
        'token': token,
        'platform': platform
    };
    var url = api.mmsApi + '/mms/inner/albumInfo/get?' + querystring.stringify(params);

    var data = yield request(url, 3, function (res) {
        return res.data;
    });

    return data; //???接口返回格式决定要取数组第一个？？
};

//PC取视频简介接口方法
exports.getDetailInfo = function*(platform, pid) {
    var params = {
        'platform': platform,
        'pid': pid
    }
    var url = api.detailApi + '/getVideoDesc?' + querystring.stringify(params);

    var data = yield request(url, 10, function (res) {
        return res.data;
    });

    return data; 
};

function* getPlayVidByAid(cid, albumId, albumInfo, lang, region, from) {
    var type = 3;
    var order = 1;//倒序
    // if(cid == 1 || cid == 2 || cid == 5 || cid == 11){
    //     //电视剧、动漫、综艺 取正片， 其他取全部
    //     type = 1;
    //     var albumInfo = albumInfo ? albumInfo : yield getAlbumInfos(albumId, 0);
    //     albumInfo.isEnd == 1 && (order = -1);
    // }
    var list = yield getVideoList(albumId, 0, type, order, 0, 0, lang, region, from);
    if (list && list.videoInfo && list.videoInfo.length) {
        //console.log("原来的");
        //console.log(list.videoInfo[0].id);
        return list.videoInfo[0];
    }
}

function* getPlayVidByAidV2(cid, albumId, albumInfo, lang, region, from) {
    /* 1、判断是否正片
     2、是正片则播放正片第一集（跟播剧除外）
     3、播放记录逻辑（如果当前PID中存在播放记录中播过的VID，则优先播放此VID）
     */

    //判断正片
    var type = 1;//正片
    var order = -1;//按照集数porder升序
    // if(cid == 1 || cid == 2 || cid == 5 || cid == 11){
    //     //电视剧、动漫、综艺 取正片， 其他取全部
    //     type = 1;
    //     var albumInfo = albumInfo ? albumInfo : yield getAlbumInfos(albumId, 0);
    //     albumInfo.isEnd == 1 && (order = -1);
    // }
    var list = yield getVideoList(albumId, 0, type, order, 0, 1, lang, region, from);//判断该专辑下是否有正片
    if (list && list.videoInfo && list.videoInfo.length) {
        var data = yield request(api.mmsApi + videoListApi["5"] + `id=${albumId}`, 5);//专辑信息查询，判断是否完结
        if (data.data[0] && data.data[0].isEnd == 1) {
            //完结了,应该播放正片第一集，如果有正片的话，
            //console.log("完结正片");
            //console.log(list.videoInfo[0].id);
            return list.videoInfo[0];
        } else {
            //没完结
            data = yield request(api.mmsApi + videoListApi["4"] + `id=${albumId}&platformId=${platformId}`, 5);
            if(data.result!=0 && data.data && data.data.length){
                //console.log("没完结");
                //console.log(data.data[0].vid);
                return {id: data.data[0].vid};//为了保持和完结情况下的key,value统一
            }
        }
    }
    //最后走个原来的
    return yield getPlayVidByAid(cid, albumId, albumInfo, lang, region, from);
}

var videoListApi = {
    1: '/mms/inner/albumInfo/getVideoList?',
    2: '/mms/inner/albumInfo/getOtherVideoList?',
    3: '/mms/inner/albumInfo/getAllVideoList?',
    4: "/mms/inner/albumInfo/getVidList?",//根据专辑id查询集数最大的正片视频id
    5: '/mms/inner/albumInfo/get?',//根据专辑id查询专辑信息
};

function* getVideoList(albumId, vid, type, order, page, pageSize, lang, region, from) {
    if (!albumId) return;
    page = page || 1;
    pageSize = pageSize || 10;
    var token = md5(albumId + platform + mmsKey);
    var params = {
        'id': albumId,
        'vid': vid,
        'b': page,
        's': pageSize,
        'o': order,
        'lang': getMmsLang(lang, region),
        'region': region || 'CN',
        'token': token,
        'platform': platform
    };
    var mmsApi;
    //临时解决推荐数据都从大陆媒资库获取相关信息
    if (from && from === 'rec') {
        mmsApi = 'http://i.api.letv.com';
        params.region = 'CN';
    } else if (region === 'HK') {
        mmsApi = 'http://f.i.api.letv.com';
    } else {
        mmsApi = 'http://i.api.letv.com';
    }
    var url = mmsApi + videoListApi[type] + querystring.stringify(params);
    var data = yield request(url, 5, trimVideoInfo);
    return data;
}

exports.getVideoList = getVideoList;

// 获得单视频信息
exports.getVideoInfo = function*(vid, reset, lang, region) {
    var token = md5(vid + platform + mmsKey);
    var mmsApi;
    //香港地域，请求香港媒资接口
    if (region === 'HK') {
        mmsApi = 'http://f.i.api.letv.com';
    } else {
        mmsApi = 'http://i.api.letv.com';
    }
    //增加参数hit=1，用于展示被屏蔽的视频，能够获取到详情信息
    var url = mmsApi + '/mms/inner/video/get?type=1&vmode=0&token=' + token +
        '&id=' + vid + '&platform=' + platform + '&hit=1';
    lang && (url += '&lang=' + getMmsLang(lang, region));
    region && (url += '&region=' + region);
    // 判断降级开关是否开启
    // if( MMS_FORBIDEN ) {
    // 取降级数据，返回
    // }
    var data = yield request(url, {expire:3, reset:reset}, function (res) { //回调处理数据的匿名函数
        // var data = res.data || {};
        // 目前只用到nameCn这个字段，用到别得再加吧
        // return {nameCn: data.nameCn};
        return res.data;
    });
    /* 如果视频没有播放权限，则清除缓存 */
    // if (!isset($result['playPlatform'][420001]) || isset($result['playPlatform'][420011])) {
    //     $this->clearCache($url, self::VIDEO_CACHE_PREFIX . $vid);
    // }

    return data;
};

//取预告最新更换的方法
exports.getYugaoNews = function*($albumId, $vid) {
    var url = api.mmsApi + '/mms/inner/albumInfo/getHearaldVideoList?id=' + $albumId +
        '&vid=' + $vid + '&platform=' + platform + '&platformId=' + platformId;
    var data = yield request(url, 10, trimVideoInfo);
    return data ? data.videoInfo.slice(0, 5) : []; // 最多返回5条
};


//PC取剧集方法
exports.getEpisodeInfo = function* (platform, pid, page, pagesize, type) {
    page = page || 1;
    pagesize = pagesize || 50;
    var params = {
        'platform': platform,
        'pid': pid,
        'page': page,
        'pagesize': pagesize,
        'type': type
    };
    var url = api.detailApi + '/episode?' + querystring.stringify(params);
    var data = yield request(url, 10, function(res) {
        return res.data || {};
    });
    return data;
}

//PC综艺取往期节目的方法
exports.getPeriod = function* (pid, year, platform) {
    var url = api.detailApi + '/getPeriod?pid=' + pid + '&year=' + year + '&platform=' + platform;
    var data = yield request(url, 10, function(res){
        return res.data || '';
    });
    return data;
}

//PC取预告最新的方法
exports.getTrailerInfo = function* (platform, pid) {
    var url = api.detailApi + '/getVideoTrailer?platform=' + platform + '&pid=' + pid;
    var data = yield request(url, 10, function(res){
        return res.data || '';
    });
    return data.slice(0, 5); // 最多返回5条
}

//PC取花絮和精彩看点方法
exports.getperiodPoint = function* (platform, pid, page, pagesize, bit) {
    page = page || 1;
    pagesize = pagesize || 50;
    var params = {
        'platform': platform,
        'pid': pid,
        'page': page,
        'pagesize': pagesize,
        'bit': bit,
    };
    var url = api.detailApi + '/periodpoint?' + querystring.stringify(params);
    var data = yield request(url, 10, function(res) {
        return res.data || {};
    });
    return data;
}

//PC取同主演作品方法
exports.getStarWorks = function* (starID, platform) {
    var url = api.detailApi + '/starringworks?starring_ids=' + starID + '&platform=' + platform;
    var data = yield request(url, 10, function (res) {
            return data = res.data || '';
    });
    return data ? data : '';
}

//PC取同系列（电影）/关联作品（动漫）方法
exports.getRelateVideos = function* (pid, platform) {
    var url = api.detailApi + '/relatevideos?aid=' + pid + '&platform=' + platform;
    var data = yield request(url, 10, function (res) {
            return data = res.data || '';
    });
    return data ? data.slice(0, 5) : '';
}

//PC取动漫周边短片方法
exports.getOtherVideos = function* (pid, platform) {
    var url = api.detailApi + '/othervideos?aid=' + pid + '&platform=' + platform;
    var data = yield request(url, 10, function (res) {
            return data = res.data || '';
    });
    return data.slice(0, 5);
}

//PC取同导演作品方法
exports.getDirectVideos = function* (directID, platform) {
    var url = api.detailApi + '/directorworks?director_id=' + directID + '&platform=' + platform;
    var data = yield request(url, 10, function (res) {
            return data = res.data || '';
    });
    return data ? data : '';
}

//PC取小编推荐播放器信息
exports.getEditOrderPlay = function* (platform, pid) {
    var url = api.detailApi + '/getEditOrderPlay?platform=' + platform + '&pid=' + pid;
    var data = yield request(url, 10, function (res) {
            var data = res.data || '';
            // 目前只用到nameCn这个字段，用到别得再加吧
            return {nameCn: data.nameCn, id: data.id};
    });
    return data;
}

//PC取综艺详情小编推荐接口
exports.getEditRecommend = function* (platform) {
    var url = api.detailApi + '/getEditRecommend?platform=' + platform;
    var data = yield request(url, 10, function (res) {
        return res.data.data.blockContent || '';
    });
    return data;
}

//取相关视频的花絮方法
exports.getFeatureList = function*($albumId, platform, platformId) {
    var url = api.mmsApi + '/mms/inner/albumInfo/getRelatedVideos?id=' + $albumId +
        '&platform=' + platform + '&platformId=' + platformId;
    var data = yield request(url, 10, trimVideoInfo);
    return data ? data.videoInfo.slice(0, 5) : []; // 最多返回5条
};

function trimVideoInfo(res) {
    res = res.data;
    if (!res) {
        return null
    }
    // 去除无播放权限视频
    var data = [], videoInfo = res.videoInfo || res || [];
    videoInfo.forEach(function (item, i) {
        // if (!isset($vv['playPlatform'][420001]) && $this->platform == 'msite') {
        //     unset($data['data']['videoInfo'][$vk]);
        // }
        item.playPlatform && item.playPlatform[420001] && data.push(item);
    });
    res.videoInfo = data;
    return res;
}




/**
 * 批量取视频的各种数目播放数
 * 代替原来的getScoreByAids（type传plist）和getPlayCountByVids（type传vlist）
 * type 类型，例如vlist，plist
 * @param string vids    id串
 * @return array
 */
exports.getCountByVids = function*(type, vids) {
    var url = api.moreCount + 'type=' + type + '&ids=' + vids;

    var data = yield request(url, 10, function (res) {
        var data = {}, hasData = 0;
        res && res.forEach(function (item) {
            data[item.id] = item;
            hasData = 1;
        });
        return hasData ? data : null;
    });

    return data;
};

// 获取最新期数的最新一集
exports.getEpisode = function*(pid, lang, region) {
    if (!pid) {
        return 0;
    }
    var url = api.videoListByDate + '?videoType=0&order=REVERSE&platformId=' +
        platformId + '&platform=' + platform + '&id=' + pid + '&lang=' + getMmsLang(lang, region);
    var data = yield request(url, 10, function (res) {
        // php里是酱紫的：$arr = end($data['data']);
        var $arr = res.data, k, regJoin = /-/g;
        if (!$arr) {
            return 0
        }
        for (k in $arr) {
        }
        $arr = $arr[k];
        var $rs = [], data = [];
        for (k in $arr) {
            if ($arr[k] instanceof Array) {
                $rs.push.apply($rs, $arr[k]);
            }
        }
        if ($rs.length) {
            $rs.forEach(function (item) {
                if (!item.playPlatform[420001]) {
                    return;
                }
                if (!item.porder) {
                    item.porder = item.releaseDate.replace(regJoin, '');
                }
                // 简单区分教育频道和综艺频道的期数，教育频道不会超过1900
                // if (!item.episode || item.episode<1900) {
                // 	item.episode = item.porder>1900 ? item.porder :
                // 		item.releaseDate.replace(regJoin, '');
                // }
                data.push(item);
            });
            data.sort(function (a, b) {
                var ap = parseInt(a.porder), bp = parseInt(b.porder);
                if (ap === bp) {
                    return a.createTime > b.createTime ? -1 : 1;
                }
                return ap > bp ? -1 : 1;
            });
            return data.length ? data[0].porder : 0;
        }
        return 0;
    });
    return data;
};


// 获取评分，评论数，播放数)
exports.getAlbumUser = function* (pid) {
    var url = 'http://v.stat.letv.com/vplay/queryMmsTotalPCount?pid=' + pid;
    var userData = yield request(url, 10, function(data) {
            return {
                score: data.plist_score,
                playNum: data.plist_play_count,
                commNum: data.pcomm_count
            }
        }); 
    return userData;
}

exports.getScoreByAid = function*(cid, pid) {
    var url = api.count + 'cid=' + cid + '&pid=' + pid;
    var score = yield request(url, 10, function (res) {
        if (res) {
            return res['plist_score'] || 0
        }
    });
    return score;
};

//获取专辑信息
exports.getAlbumInfos = getAlbumInfos;
//获取专辑下第一个视频
exports.getPlayVidByAid = getPlayVidByAid;
exports.getPlayVidByAidV2 = getPlayVidByAidV2;//zyr
