/**
 * cms相关model,目的是将所有与cms有关的操作都统一到一个地方
 *
 */
var request = require('../lib/request');
var getCmsUrl = require('../data/api').getCmsUrl;

exports.getCmsFormatDataNew = function* (obj) {
    var geo = obj.geo,
        langName = obj.langName==='en_us' ? 'en' : obj.langName,
        blockId = obj.blockId;
	var res = yield request(geo.getCmsUrl(blockId)+'&lang='+langName, 5, function (data) {
		return formatCmsData(data.data, obj.num, obj.type, obj.cid, blockId);
	});
	return res;
};
exports.getCmsDataNew = function* (obj, callback) {
    var geo = obj.geo,
        langName = obj.langName==='en_us' ? 'en' : obj.langName,
        blockId = obj.blockId;
    var data = yield request(geo.getCmsUrl(blockId)+'&lang='+langName,
    	{cacheKey: '/cms/'+blockId+':'+langName, expire: 5}, callback);
    return data;
};
exports.getCmsFormatData = function* (blockId, num, type, cid) {
	var res = yield request(getCmsUrl(blockId), 0, function (data) {
		return formatCmsData(data, num, type, cid, blockId);
	});
	return res;
};

exports.getCmsData = function* (blockId, callback) {
    var data = yield request(getCmsUrl(blockId), 5, callback);
    return data;
};

    /*
     * 目前分:
     *      一、焦点图
     *          1. 异步抓取焦点图，如首页、会员频道页
     *          2. 板块数据，如其他频道页、世界杯、我是歌手等
     *
     *      二、普通板块
     *
     *  返回:
     *      array(
     *              'title',
     *              'subTitle',
     *              'img',
     *              'url',
     *              'vid',
     *              'pid',?
     *              'cid',?
     *          );
     *
     *  不同的cid，subTitle不一样
     *
     * @param type cmsData
     * @param type num
     * @param type cid
     * @param type $type     focus|common
     * @param type $moreUrl
     * @param type $db_type
     */
	function formatCmsData(cmsData, num, type, cid, blockId) {
        if(!cmsData){
            console.error(`cms问题 ${blockId} 取不到数据`);
            return [];
        }

		var result = [], data = cmsData['blockContent'];
		var i = 1;
        data.some(function (item) {
			var ritem = {};
			if (!_checkValidity(item)) {
                return;
            }
            item.video || (item.video = {});
            ritem.vid = _getVid(item,blockId);//匹配vid字段，无的话取url中符合/ptv/play/vid.html格式的vid

            item.album || (item.album = {});
            //焦点图以及手动推荐板块，url获取优先级标签链接＞VID＞URL
            if (item.tagUrl) {
                ritem.url = item.tagUrl.trim();
            } else if (ritem.vid) {
                ritem.url = '/vplay_'+ritem.vid+'.html';
            } else {
                return;
            }
			if (i++>num) {
                return true;
            }

            ritem.title = item.title || '';
            // ritem.subTitle = _getSubtitle(item, cid, type);
            ritem.subTitle=item.subTitle;
            // ritem.picAll = item.album.picCollections || item.video.picAll || {};
            ritem.pic = _getPic(item, type, blockId); //, ritem.picAll
			ritem.pid = item.video.pid || 0;
            ritem.cid = item.video.category ? 0 : -1;
            ritem.ctime = item.video.createTime || '';
            ritem.playPlatform = item.playPlatform || {};
            ritem.payPlatform = item.album.payPlatform || item.video.payPlatform || {};
            ritem.duration = item.video.duration || 0;
            // ritem.tagUrl = item.tagUrl ? item.tagUrl.trim() : '';
            // if (ritem.tagUrl && cid==4) {
            //     ritem.url = item.tagUrl;
            // }

            result.push(ritem);
		});

        //非焦点图数据取偶数条
        // return (result.length % 2) && type != 'focus' ? result.slice(0, -1) : result;
        return result;
    }

    /**
     * 取vid
     * type:
     *     1 vid
     *     2 pid
     *     3 直播code
     *     4 用户id
     *     5 小专题id
     *     6 轮播台id
     *
     * @param type data
     * @return type
     */
    function _getVid(data,blockId) {
        //* type:  1 vid  2 pid  3 直播code  4 用户id  5 小专题id  6 轮播台id
        if (!data['type']) {
            return '';
        }

        var vid = data['video']['id'];
        if (vid) {return vid}

        if (data['url']) {
            return _getVidByUrl(data['url']);
        }

        return '';
    }

    function _getVidByUrl(url) {
        if (url.indexOf('/ptv/vplay/')<0) {
            return '';
        }
        var x = url.split('/vplay/')[1];
        return x.slice(0, x.indexOf('.'));
    }

    /**
     * 取subtitle
     *
     * @param type data
     * @return type
     */
    function _getSubtitle(data, cid, type) {
        if (type == 'focus') {
            return data.subTitle || '';
        }
    	if (data.album.category) {
    		for (var k in data.album.category) {
    			cid = k;
    			break;
    		}
    	}
		var subTitle = '';
        if (cid==2 || cid==5) {
            if (data['album']['platformNowEpisodesNum']) {
                var episodesNum = data['album']['platformNowEpisodesNum']['420001'];
                if (data['album']['isEnd']==0) {
                    if (episodesNum) {//去掉更新至0集这种情况
                        subTitle = '更新至'+episodesNum+'集';
                    } else {
                        subTitle = __innerGetSubTitle(data);
                    }
                } else {
                    subTitle = __innerGetSubTitle(data);
                    if (!subTitle && episodesNum) {//0集全这种情况
                        subTitle = episodesNum+'集全 ';
                    }
                }
                subTitle = subTitle.trim();
            } else {
                subTitle = __innerGetSubTitle(data);
            }
        } else {
            subTitle = __innerGetSubTitle(data);
        }
        return subTitle;
    }

    //取板块数据子标题逻辑，单抽出来
    function __innerGetSubTitle(data) {
        return data.subTitle || (data.album.subTitle && data.album.subTitle.trim()) || '';
    }

    /*
     * 取视频列表页图片
     * 优先级：
     * $data 中
     *       1. album -> picCollections -> 200*150
     *       2. video -> picAll -> 200*150
     *       3. pic1
     *       4. video->videoPic
     *       5. mobilePic
     *       6. picList -> h5Pic
     *       7. picList -> 400x225(16:9)
     *  $type == 'common' 按 1,2,3,4,5 的优先级取
     *  $type == 'focus'  按 5,3 取
     *  $type == 'rec'  按 6,7,3 取
     */

    function _getPic(item, type, blockId) {
        var picAll = item.album.picCollections || item.video.picAll || {};
        var type = type || '';
        if (type == 'focus') {
            var pic = item['picList']['h5Pic'] || item['extendJson']['extendPicAll']['pic169'] || item.pic1 ||'http://i0.letvimg.com/lc02_img/201512/29/11/48/1146/focus.png';
        } else if (type == 'rec') {
            var pic = item['picList']['h5Pic'] || item['extendJson']['extendPicAll']&&item['extendJson']['extendPicAll']['pic169'] || item.pic1||"" //||'http://i2.letvimg.com/lc05_img/201601/06/17/46/1744/a_tempBg2.png';
        } else {
            var pic = item.pic1 || item.mobilePic ||
        	   picAll['200*150'] || picAll['400*300'];
        }

        if (pic) {return pic}
        if (item.video.videoPic) {
            return item.video.videoPic+'/thumb/2_200_150.jpg';
        }
        // return 'http://i1.letvimg.com/img/201306/07/letvImg.png';
        return '';
    }

    /**
     * 验证cms block数据合法性
     * 不合法 返回false
     *   合法 返回true
     * @param type $value
     */
    function _checkValidity(item) {
        //2016-4-26 产品要去去掉，不知道之前为啥有这个验证
        // if (!item.url && !item.video) {
        //     return false;
        // }

        //检查播放权限 没有web平台，或者有wiki平台的，都不能播
        if (!item.pushflag) {
            return false;
        }
        //420001为pc plantform，M站和pc使用同一个plantform
        var pushflag = ','+item.pushflag+',';
        if (pushflag.indexOf(',420001,')<0) {
            return false;
        }
        return true;
    }
