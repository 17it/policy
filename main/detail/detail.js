/**
 * created by xuyungeng 2016.10.27
 */
var model = require('./detailModel');
var request = $require('lib/request');
var api = $require('data/api');
var CommonFrag = $require('modules/CommonFrag');
var formatWord = $require('air/util/formatWord');
var fragJsCss = $require('modules/fragJsCss');

module.exports = function* (write) {
    var langName = 'zh_cn';

    //专辑pid
    var pid = this.params.pid;
    var pageInfo = yield model.getPageInfo(pid, langName);
    if (!pageInfo) {
        this.redirect('http://www.le.com/error?pid='+pid);
        return;
    }
    
    var org_url = this.originalUrl;
    var cid = pageInfo.description.cid;
    var reg = /(movie)|(tv)|(comic)|(zongyi)/;
    var cidmap = {1:'movie',2:'tv',5:'comic',11:'zongyi'};
    var pt = org_url.match(reg)[0] || '';
    if(pt !== cidmap[cid]){
        this.redirect(org_url.replace(pt,cidmap[cid]));
        return;
    }
    var $info = {
        'site':'P',
        'cid': pageInfo.description.cid,
        'pid': pid,
        'starID': pageInfo.description.descData.starID,
        'directID': pageInfo.description.descData.directID,
        'type':'detail',
    };

    //根据cid获取热播榜
    var hotlist = yield model.getHotlist($info.cid || 1);

    //根据pid渲染模板
    var _tpl = $info.cid===1 ? '/movie_detail.html' : $info.cid===2 ? '/tv_detail.html' : $info.cid===5 ? '/comic_detail.html' : '/zongyi_detail.html';

    // 左上角大图角标
    var dealIconMark = function (item) {
        if(!item){ return '';}
        // 优先级：会员＞人工＞独播＞自制
        
        if(parseInt(item.chargeType) === 1){
            return '<em class="ico_vip">会员</em>';
        }else if(parseInt(item.chargeType) === 2){
            return '<em class="ico_vpay">付费</em>';
        }else if(parseInt(item.chargeType) === 3){
            return '<em class="ico_vcoupons">用券</em>';
        }
        if(item.playMark === 1){
            return '<em class="ico_red">独播</em>';
        }
        if(item.isHomemade === 1){
            return '<em class="ico_red">自制</em>';
        }
        
        return '';
        
        /**
         *  以下逻辑为新媒资接口返回的数据格式
         *  等接口换成新媒资接口后，逻辑换成下面
         *  目前使用上面的旧媒资接口逻辑
         */
        // var cornerMark = '';
        // var videoCornerType = {
        //     1: '预告',
        //     2: '片段',
        //     3: '头条'
        // };
        // var programCornerType = {
        //     1: '专题',
        //     2: '策划',
        //     3: '活动'
        // };
        // if (item.property && item.property['20002']) {
        //     cornerMark = '自制';
        // }
        // if (item.playMark) {
        //     cornerMark = '独播';
        // }
        // if (item.cornerMark) {
        //     if (item.dataContentType == 1) {
        //         cornerMark = videoCornerType[item.cornerMark] || '';
        //     } else if (item.dataContentType == 2) {
        //         cornerMark = programCornerType[item.cornerMark] || '';
        //     }
        // }
        // if (item.isPay && item.payPlatform && item.payPlatform['10201']) {
        //     cornerMark = '会员';
        // }
        // return cornerMark;
    };
    var viewData = {
        pid: pid,
        description: pageInfo.description || '',
        pagination: pageInfo.pagination,
        episodeInfo: pageInfo.vlist.$episodeInfos || '',
        episodelength: pageInfo.vlist.$episodelength || 0,
        yugaoInfo: pageInfo.vlist.$yugaoInfos,
        zongyiYears: $info.cid===11 && pageInfo.vlist.$years || '',
        featureInfo: pageInfo.vlist.$featureInfo || '',
        fenjiInfo: pageInfo.vlist.$fenjiInfo || '',
        editOrderPlay: pageInfo.vlist.$EditOrderPlayInfo,
        recommendInfo: pageInfo.vlist.$recommendInfo,
        starWorks: pageInfo.vlist.$starWorks,
        directWorks: $info.cid===1 && pageInfo.vlist.$directWorks,
        otherComic: $info.cid===5 && pageInfo.vlist.$otherComic,
        allPiece: yield CommonFrag.loadFrags(['bigHeadV3', 'responsiveJS_New', 'bigFootV3', 'Statis', 'adSdk', 'detailad']),
        detailCss: yield fragJsCss.loadCss(['new_details-css-details']),
        detailJs: fragJsCss.loadJs(['detail-index']),
        detailBase: fragJsCss.loadJs(['base-base_detail']),
        passportJs: fragJsCss.get('passportJs'),
        reportJs: fragJsCss.get('reportJs'),
        navHead: fragJsCss.get('navHead'),

        info: $info,
        hotlist: hotlist,
        cornerMark: dealIconMark(pageInfo.description || ''),
        shortDesc: formatWord(pageInfo.description.descData.description || '', 458),
        meta: '',
        clipStr: $require('air/string/clip')
    };

    write(this.render('detail/' + _tpl, viewData));
};