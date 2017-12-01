/**
 * created by xuyungeng 2016.10.27
 */
var shorten = $require('air/number/shorten');
var formatVideoDuration = $require('air/util/formatVideoDuration');
var request = $require('lib/request');
var cache = $require('lib/cache');
var mms = $require('modules/mms');
var playUrl = 'http://www.le.com/ptv/vplay/';
var vipinfoUrl = 'http://d.api.m.le.com/yuanxian/chargeinfo?platform=pc';

/**
*  获取详情页所需的信息，根据不同的专辑pid
*/
exports.getPageInfo = function* (pid, langName) {
    //平台
    var platform = 'pc';
    //缓存
    var pageInfo = yield cache.get('/main/detail:'+pid+langName);
    if (pageInfo) {return pageInfo}
    
    var albumInfo; // 专辑信息
    albumInfo = yield mms.getDetailInfo(platform, pid); // 获取专辑信息

    if(!albumInfo['playPlatform']||!albumInfo['playPlatform']['420001']||!albumInfo['category']) return;

    //获取cid,播放平台,初始取剧集参数
    var cid = parseInt(Object.keys(albumInfo['category'])[0]) || 0,
        isTvOrComic = cid===2 || cid===5, // 电视剧或动漫
        isZongyi = cid===11,//综艺
        playid = isZongyi && (albumInfo['playTv'] && parseInt(Object.keys(albumInfo['playTv'])[0]) || ''),
        page = 1,
        pagesize = 50;

    var descData = {};
    //专辑信息格式化
    descData = yield getDescData(albumInfo, cid, isTvOrComic, isZongyi);
    pageInfo = {};
    pageInfo.description = {
        pid: pid,
        cid: cid,
        name: albumInfo['nameCn'],
        category: albumInfo['category'][cid],
        releaseDate: albumInfo['releaseDate'],
        playStatus: albumInfo['playStatus']&&!albumInfo['isEnd'] ? albumInfo['playStatus'] : '',
        playTv: playid && albumInfo['playTv'][playid],
        status: albumInfo['isEnd'],
        videoCount: albumInfo['videoCount'],
        isEnd: albumInfo['isEnd'],
        isPay: albumInfo['isPay'], // videoInfo.payPlatform['141001']
        isHomemade: albumInfo['isHomemade'],
        playMark: albumInfo['playMark'],
        descData: descData,
        firstVid: albumInfo['firstVid'],
        payPlatform: albumInfo['payPlatform'] || {}
    };

    //处理专辑的会员角标 liuweidong 2017-11-04
    var vinfose = yield vipInfo([], [pid]);
    pageInfo.description.chargeType = vinfose[pid] || 0;
    //end

    // var videoCount; //全部视频总数
    // 主演和导演id
    var starID = descData.starID ? descData.starID : '', 
        directID = descData.directID ? descData.directID : '';

    //取正片逻辑
    if (isTvOrComic && albumInfo['isEnd']!==1) {
            page = descData.videoCount > 50 ? parseInt(albumInfo.videoCount%50)===0 ? parseInt(albumInfo.videoCount/50) : parseInt(albumInfo.videoCount/50) + 1 : 1;     
    }   
    // 请求视频正片、预告等信息
    var vlist = {}; //剧集列表
    vlist = yield formatVideoLists(albumInfo, cid, page, pagesize, langName, starID, directID, platform);

    // 播放按钮状态
    if (descData.url) {
        pageInfo.description.url = descData.url;
        pageInfo.description.play = descData.play;
    } else {
        if (vlist.$yugaoInfos) {
            var yugao = vlist.$yugaoInfos.slice(0, 1);
            pageInfo.description.url = yugao['0'].videoUrl;
            pageInfo.description.play = '预告片';
        } else if (vlist.$featureInfo){
            var feature = vlist.$featureInfo.slice(0, 1);
            pageInfo.description.url = feature['0'].videoUrl;
            pageInfo.description.play = '花絮';
        } else {
            pageInfo.description.url = 'javascript:volid(0);';
            pageInfo.description.play = '敬请期待';
        }
    }
    //分页信息
    if (isTvOrComic) { 
        pageInfo.pagination = yield pagination(descData.videoCount, albumInfo['nowEpisodes'], pid, albumInfo['isEnd']);
    }
    pageInfo.vlist = vlist;
    pageInfo.description.nowpage = parseInt(page-1);

    cache.set('/main/detail:'+pid+langName, pageInfo, 5);
    return pageInfo;
};


/**
 * 组装视频列表
 * @param type $albumInfo 专辑信息
 * @param type $cid 类型id
 * @param type $page 
 * @param type $pagesize 
 * @param type starID 主演id
 * @param type directID 导演id
 * @param type platform 平台
 * @return type $result 
 */
function* formatVideoLists($albumInfo, $cid, $page, $pagesize, langName, starID, directID, platform) {
    var $result = {};
    // var $type = 1; //1正片，2其他，3全部
    var $albumId = parseInt($albumInfo['id']);
    var isTvOrComic = $cid===2 || $cid===5; // 电视剧或动漫
    var isZongyi = $cid===11;

    //通用视频取剧集和综艺往期列表接口
    if (isTvOrComic) {
        var $videoList = yield mms.getEpisodeInfo(platform, $albumId, $page, $pagesize, 1);
    } else if (isZongyi) {
        var year = $albumInfo['nowEpisodes'] ? $albumInfo['nowEpisodes'].toString().slice(0, 4) : $albumInfo['releaseDate'].toString().slice(0, 4);
        var $videoList = yield mms.getPeriod($albumId, year, platform);
    }
    $videoList || ($videoList = {});
    if ($videoList['list'] && $videoList['list'].length) {
        $videoList['list'].forEach(function ($data) {
            $data.videoType = $data['video_type'][Object.keys($data['video_type'])[0]];
            $data.videoEpisode = $data['episode'] ? isTvOrComic ? $data.videoType==='正片' ? '第' + $data['episode'] + '集' : $data['title'] : $data['episode'].toString().substr(0, 4) + '-' + $data['episode'].toString().substr(4, 2) + '-' + $data['episode'].toString().substr(6, 2) + '期' : '';
            $data.videoDuration = formatVideoDuration($data['duration']);
            $data.videoUrl = playUrl + $data['vid'] + '.html';
            $data.playCount = isZongyi ? shorten($data['play_count']) : '';
            $data.guest = isZongyi ? getObjValues($data['guest'], '1') : '';
        });

        if ($cid===2 && $albumInfo['isEnd']!==1) {
            var $episodeFeature = [];
            for (var i in $videoList['list']) {
                if ($videoList['list'][i]['video_type'][Object.keys($videoList['list'][i]['video_type'])[0]] !='预告片')
                $episodeFeature.push($videoList['list'][i]);
            }
            $result.$episodelength = $episodeFeature.length;//去除预告的正片数
        }

        $result.$episodeInfos = $videoList['list'];
        //调用会员片代理层 liuweidong 2017-10-16
        var vidse = [], pidse=[];
        $result.$episodeInfos.map(function(item){
            if(item.ispay) {
                vidse.push(item.vid);
                pidse.push(item.pid);
            }
            return item;
        });
        var vinfose = yield vipInfo(vidse, pidse);
        $result.$episodeInfos.map(function(item){
            if(item.ispay) item.chargeType = vinfose[item.pid] || vinfose[item.vid] || 0;
            return item;
        });


        if ($cid===2) {
            var $fenjiList = yield mms.getEpisodeInfo(platform, $albumId, 1, 3, 0);//分集剧情前3集
            if ($fenjiList['list']) {
                $fenjiList['list'].forEach(function($fenjiData) {
                    $fenjiData.videoEpisode = $fenjiData['episode'] ? '第' + $fenjiData['episode'] + '集' : '';
                    $fenjiData.videoDuration = formatVideoDuration($fenjiData['duration']);
                    $fenjiData.videoUrl = playUrl + $fenjiData['vid'] + '.html';
                })
            }
        }

        //综艺年份
        $result.$years = isZongyi && $videoList['years'];

        $result.$fenjiInfo = $fenjiList && $fenjiList['list'] ? $fenjiList['list'] : '';
    }
    if (isTvOrComic || isZongyi) {
        $page = 1;
        $pagesize = isTvOrComic && 5 || 15;
        var bit = isTvOrComic ? '1' : '0';
        //PC取花絮和精彩看点
        var $otherVideoList = yield mms.getperiodPoint(platform, $albumId, $page, $pagesize, bit);
        if ($otherVideoList['list'] && $otherVideoList['list'].length) {
            $otherVideoList['list'].forEach(function ($otherdata) { 
                $otherdata.videoDuration = formatVideoDuration($otherdata['duration']);
                $otherdata.videoUrl = playUrl + $otherdata['vid'] + '.html';
            });
            $result.$featureInfo = $otherVideoList['list'] || '';
        }

    }
    if (isZongyi) {
        //综艺详情小编推荐
        var $editRecommendList = yield mms.getEditRecommend(platform);
        if ($editRecommendList) {
            var vids = [], pids=[], temp_list = $editRecommendList;
            temp_list.forEach(function ($recdata) {
                $recdata.picture = $recdata['picList']["180x101"] || '';
                $recdata.videoTitle = $recdata['title'];
                $recdata.videoUrl = $recdata['url'];
                if($recdata.is_pay) vids.push($recdata.vid);
                if($recdata.is_pay) pids.push($recdata.pid);
            });

            //调用会员片代理层 liuweidong 2017-10-16
            var vinfos = yield vipInfo(vids);
            temp_list.map(function(item){
                if(item.is_pay) item.chargeType = vinfos[item.pid] || vinfos[item.vid] || 0;
                return item;
            });
            $result.$recommendInfo = temp_list || '';
        }
    }
    if (isTvOrComic || $cid===1) {
        //预告
        var $yugaoInfos = yield mms.getTrailerInfo(platform, $albumId);
        if ($yugaoInfos.length) {
            var vids = [], pids=[], temp_list = $yugaoInfos;
            temp_list.forEach(function ($yugaodata) {
                $yugaodata.videoUrl = playUrl+$yugaodata['id']+".html";
                if($yugaodata.is_pay) vids.push($yugaodata.vid);
                if($yugaodata.is_pay) pids.push($yugaodata.pid);
            });
            //调用会员片代理层 liuweidong 2017-10-16
            var vinfos = yield vipInfo(vids);
            temp_list.map(function(item){
                if(item.is_pay) item.chargeType = vinfos[item.pid] || vinfos[item.vid] || 0;
                return item;
            });
            $result.$yugaoInfos = temp_list || '';

        }
            
    }
    if ($cid === 1 || $cid === 5) {
        //同系列（电影）/关联作品（动漫）（暂时不上）
        // var $relateVideoInfos = yield mms.getRelateVideos($albumId, platform);
        
        // if ($relateVideoInfos) {
        //     $relateVideoInfos.forEach(function ($relatedata) {
        //         $relatedata.videoUrl = playUrl+$relatedata['vid']+".html";
        //     });
        //     $result.$relateVideo = $relateVideoInfos!='' ? $relateVideoInfos : '';
        // }
        if ($cid === 1) {
            //同主演作品
            var $starWorksInfo = yield mms.getStarWorks(starID, platform);
            $result.$starWorks = $starWorksInfo || '' ;

            //同导演作品
            var $directWorksInfo = yield mms.getDirectVideos(directID, platform);

            $result.$directWorks = $directWorksInfo.slice(0, 5);
            //调用会员片代理层 liuweidong 2017-10-16
            var vids = [], pids=[];
            $result.$directWorks.map(function(item){
                if(item.is_pay) vids.push(item.vid)
                if(item.is_pay) pids.push(item.pid)
                return item;
            });
            var vinfos = yield vipInfo(vids);
            $result.$directWorks.map(function(item){
                if(item.is_pay) item.chargeType = vinfos[item.pid] || vinfos[item.vid] || 0;
                return item;
            });
        }
        if ($cid === 5) {
            //动漫周边短片
            var $otherComicInfo = yield mms.getOtherVideos($albumId, platform);
            if ($otherComicInfo) {
                $otherComicInfo.forEach(function ($othercomicdata) {
                    $othercomicdata.videoDuration = formatVideoDuration($othercomicdata.duration);
                });
            }
            $result.$otherComic = $otherComicInfo || '';
        }
        
    }

    //小编推荐播放器相关
    $result.$EditOrderPlayInfo = yield mms.getEditOrderPlay(platform, $albumId);

    return $result;
}

/**
*  根据不同的频道cid 取 description 数据，根据cid返回不同的字段
*  包括 主持人、演唱者、时长、集数、类型、年份等等
*/
function* getDescData($albumInfo, $cid, isTvOrComic, isZongyi) {
    var $description = {};
    $description['title'] = $albumInfo['nameCn'];

    //封面
    $description['coverpic'] = getCovertImg($albumInfo);
    $description['bgpic'] = $description['coverpic'].replace(/\.\w+$/, function ($0) {return '_setb4'+$0});
    //导演
    if ([1, 2, 5].indexOf($cid)>-1 && $albumInfo['directory']) {
        $description['directory'] = $albumInfo['directory'];
        $description['directID'] = getstarID($albumInfo['directory']);
    }
    //类型
    if ($albumInfo['subCategory']) {
        $description['subCategory'] = $albumInfo['subCategory'];
        $description['typeLink'] = getLinkUrl($albumInfo['subCategory'], $cid, 'type');
     }
    //主演
    if ([1, 2, 11].indexOf($cid)>-1) {
        $description['starring'] = !$albumInfo['starring_names'].toString() ? '' : $albumInfo['starring_names'];
        $description['starID'] = !$albumInfo['starring_ids'].toString()  ? '' : $albumInfo['starring_ids'];//主演ID
    }
    if ([5].indexOf($cid)>-1 && $albumInfo['cast']) {
        $description['starring'] = $albumInfo['cast'];
        $description['starID'] = getstarID($albumInfo['cast']);//主演ID)
    }
    //更新状态
    $description['status'] = '';
    $description['episode'] = $albumInfo['episode'] || 0;
    $description['nowEpisodes'] = $albumInfo['nowEpisodes'] || 0;
    if (isTvOrComic) {
        if ($albumInfo['isEnd']===1) {
            $description['status'] = $albumInfo['episode'] && $albumInfo['episode']>0 ?
                $albumInfo.episode+'集全' : '';
        } else {
            $description['status'] = ($albumInfo['episode'] && $albumInfo['episode']>0) ? $albumInfo.nowEpisodes>0 ? $albumInfo.nowEpisodes==$albumInfo.videoCount ? $albumInfo.nowEpisodes+'集/'+$albumInfo.episode+'集' : $albumInfo.videoCount>$albumInfo.episode ? $albumInfo.videoCount+'集' : $albumInfo.videoCount+'集/'+$albumInfo.episode+'集' : '' : $albumInfo.nowEpisodes>0 ? $albumInfo.nowEpisodes+'集' : '';
        }
    }
    if (isZongyi) {
            var nowEpisodes = ($albumInfo.nowEpisodes).toString();
            $description['status'] = (nowEpisodes && nowEpisodes!=0) ? nowEpisodes.substr(0, 4) + '-' + nowEpisodes.substr(4, 2) + '-' + nowEpisodes.substr(6, 2) + '期' : '';
    }
    
    //简介
    $description['description'] = $albumInfo['description'];
    //评分，播放数，评论数
    $description['score'] = $albumInfo['score'] && $albumInfo['score'].toFixed(1);
    $description['playNum'] = shorten($albumInfo['plist_play_count']);
    $description['commNum'] = shorten($albumInfo['pcomm_count']);
    
    //地区
    if ($albumInfo['area']) {
        $description['area'] = $albumInfo['area'];
        $description['areaLink'] = getLinkUrl($albumInfo['area'], $cid, 'area');
    }
    //专题页
    $description['officialUrl'] = $albumInfo.officialUrl ?  $albumInfo.officialUrl : '';
    //主持人
    if ($cid===11 && $albumInfo['compere']) {
        $description['compere'] = $albumInfo['compere'];
    }
    //取播放逻辑
    if ($cid === 11) {
        $description['url'] = $albumInfo.lastVid ? playUrl+$albumInfo.lastVid+".html" : '';
    } else if($albumInfo.videoCount >= 1) {
        if ($albumInfo.isEnd===1) {
            $description['url'] = $albumInfo.firstVid ? playUrl+$albumInfo.firstVid+".html" : '';
        } else {
            $description['url'] = $albumInfo.lastVid ? playUrl+$albumInfo.lastVid+".html" : '';
        }
    } else {
        $description['url'] = '';
    }
    $description['play'] = '立即播放';
    $description['videoCount'] = $albumInfo.videoCount || 0;

    //meta信息
    if($cid===1 || $cid===2) {
        $description['direct'] = getObjValues($albumInfo['directory'], '2');
        $description['star'] = getObjValues($albumInfo['starring'], '2');
        $description['type'] = getObjValues($albumInfo['subCategory'], '2');
    }
    // 别名
    if ($albumInfo['alias']) {
        $description['alias'] = $albumInfo['alias'];
    }
    
    return $description;
}

function getObjValues(obj, type) {
    var res = [], k;
    for (k in obj) {
        res.push(obj[k]);
    }
    return type==1 && res.join(' ') || res.join('，');
}

//格式化主演及导演ID，得接口参数
function getstarID(obj) {
    return Object.keys(obj).join(',');
}

//取地域及类型链接地址
function getLinkUrl(obj, cid, type) {
    var url = 'http://list.letv.com/listn/';
    var arr = Object.keys(obj);
    var length = arr.length;
    for (var i=0; i < length; i++){
        if (cid === 1) {
            arr[i] = type==='area' ? url + 'c1_t-1_a'+ arr[i] +'_y-1_s1_lg-1_ph-1_md_o17_d1_p.html' : url + 'c1_t'+ arr[i] + '_a-1_y-1_s1_lg-1_ph-1_md_o17_d1_p.html';
        }
        else if (cid === 2) {
            arr[i] = type==='area' ? url + 'c2_t-1_a'+ arr[i] +'_y-1_s1_md_o20_d1_p.html' : url + 'c2_t' + arr[i] + '_a-1_y-1_s1_md_o20_d1_p.html';
        }
        else if (cid === 5) {
            arr[i] = type==='area' ? url + 'c5_t-1_a'+ arr[i] +'_y-1_vt-1_f-1_s1_lg-1_st-1_md_o20_d1_p.html' : url + 'c5_t' + arr[i] + '_a-1_y-1_vt-1_f-1_s1_lg-1_st-1_md_o20_d1_p.html';
        }
        else if (cid === 11) {
            arr[i] = type==='area' ? url + 'c11_t-1_a'+ arr[i] + '_s1_tv-1_md_o9_d2_p.html' : url + 'c11_t'+ arr[i] + '_a-1_s1_tv-1_md_o9_d2_p.html';
        }       
    }
    return arr;
}



/*
 * 取专辑封面
 * picCollections.300*400
 * 如果都没有 则 循环取 picCollections 里面其他3：4的图片
*/
function getCovertImg($albumInfo) {
    picColl = $albumInfo.picCollections  || {};
    var pic = picColl['300*400'];

    if (pic) {
        return pic;
    }

    var k;
    for (k in picColl) {
        if (parseFloat(k.split('*')[0]/k.split('*')[1]) === 0.75) {
            return picColl[k];
        }
    }

    return '';
}

//分页逻辑（50个为一页，不足50，取到最后一集）
function* pagination(videocount, nowepisode, pid, isend) {
    if (!videocount) return;
    var integer = parseInt(videocount/50);
    var remainder = parseInt(videocount%50);
    var num = remainder===0 ? integer-1 : integer;
    var pageNum = [];
    if(nowepisode==videocount) {
        for (var i = 0; i <= num; i++) {
            var $pageinfo = {};
            if (i < num) {
                $pageinfo['pagenum'] = parseInt(i*50+1) + '-' + parseInt((i+1)*50);
                // pageNum.push($pageinfo);
            } else {
                $pageinfo['pagenum'] = parseInt(i*50+1)===nowepisode && nowepisode || parseInt(i*50+1) + '-' + nowepisode;
            }
            pageNum.push($pageinfo);
        }
    } else {
        for (var i = 1; i <= num+1; i++) {
            var $pageinfo = {};
            var $videoList = yield mms.getEpisodeInfo('pc', pid, i, '50', '1');
            $pageinfo['pagenum'] = $videoList['list'].length===1 && $videoList['list'][0].episode || $videoList['list'][0].episode + '-' + $videoList['list'][$videoList['list'].length-1].episode;
            pageNum.push($pageinfo);
        }
    }      
    return pageNum;
}

/**
 * 热播榜
 * @param cid 频道ID
 * @returns {Array}
 */
exports.getHotlist = function* getHotlist(cid) {
    let result = [],typeStr = 'dayFilmPlay';
    if(!cid) return result;

    switch (cid){
        case 1: //电影
            result = yield handler(1);
            break;
        case 2: //电视剧
            result = yield handler(2);
            break;
        case 5: //动漫
            result = yield handler(5);
            break;
        case 11: //综艺
            result = yield handler(11);
            break;
    }

    return result;

    function* handler(cid) {
        let list = [], url = '',data;
        switch (cid){
            case 1: //电影
                url = 'http://top.le.com/json/weekFilmPlay.jsn';
                break;
            case 2: //电视剧
                url = 'http://top.le.com/json/weekTVPlay.jsn';
                break;
            case 5: //动漫
                url = 'http://top.le.com/json/weekComicPlay.jsn';
                break;
            case 11: //综艺
                url = 'http://top.le.com/json/dayVarAlbumPlay.jsn';
                break;
            default:
                url = 'http://top.le.com/json/weekTVPlay.jsn';
        }
        data = yield request(url, 5);
        if(!data) return [];
        if(data.length == 0) return [];
        data.forEach(function (video) {
            let temp = {};
            if(video){
                temp.url = video.url;
                temp.name = video.name;
                temp.trend = video.trend;
                list.push(temp);
            }
        });
        return list.slice(0,10);
    }
};

/**
 * 根据vids或pids判断是否为视频类型（0、非会员；1、会员；2、付费；3、用券）
 * @param vids
 * @param pids
 * @returns {*}
 */
function *vipInfo(vids, pids){
    var vids = vids || [], pids = pids || [], results = {};
    var data = yield request(vipinfoUrl + '&vids=' + vids.join(',') + '&pids=' + pids.join(','), 10);
    if (!data||data.header.status_code != 1001) return {};
    if (!data.body) return {};
    if (data.body.albums && data.body.albums.length >= 1){
        for (var i = 0; i < data.body.albums.length; i++) {
            results[data.body.albums[i].pid] = data.body.albums[i].charge_type;
        }
    }else if(data.body.videos && data.body.videos.length >= 1) {
        for (var i = 0; i < data.body.videos.length; i++) {
            results[data.body.videos[i].vid] = data.body.videos[i].charge_type;
        }
    }
    return results;
}


