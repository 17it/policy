var Url = require('url');
var querystring = require('querystring');
var request = $require('lib/request');
var locache = $require('lib/locache');
var api = $require('data/api');
var cms = $require('modules/cms');
var rec = $require('modules/rec');
var appList = require("./recAppList");
var recConfig = require("./recTool").recConfig;
var selectBar = require("./selectBar");
var rankinglist = require("./rankinglist");
var hotLive = require("./hotLive");
var downgrade = $require('base/globalize/downgrade');

/*--
 -p string type 页面类型：page 首页；play 播放页
 */
module.exports = function*(ps, ename) {
    // var cookies = this.cookies;
    var region = ps.region,
        originalLangName = ps.lang,
        geo = this.geo;
    region = downgrade.resetRegion(region);
    langName = downgrade.resetLang(originalLangName, region);
    var params = {
        // uid: cookies.get('ssouid') || 0,
        // 'lc': this.cookies.get('tj_lc') || 0,// 暂时先去掉，以后首页、频道页不缓存了，才有意义
        // 'history': cookies.get('his_vid') || '',
        pt: '0006'
    };

    for (var p in ps) {
        params[p] = ps[p];
    }
    params.lang=="en_us" && (params.lang = "en");
    params['region'] = params['region'].toLowerCase();//推荐接口的地域标识是小写
    var url = api.recommend + querystring.stringify(params);//多语言英文用"en"

    data = yield request(url, 5);

    var res = [];
    if (data) {
        var block, item, list, autoList;
        for (var i = 1, len = Object.keys(data).length + 1; i < len; i++) {
            block = data['rec_' + i];
            if (!block || !block.id || !block.rec || block.contentTotal < 1) {
                continue
            }
            var cid = block.cid || 0;
            var diy = getDataByHimself(block.contentStyle);
            var blockConfig = recConfig[block.contentStyle];
            //2016-6-14，首页改版产品加入逻辑：某个板块，可以取部分手工，部分自动推荐
            //contentType:1:手工  2:推荐  3:手工+推荐
            if (block.contentType==1 && !diy) { // 手工
                if (!block.contentId) {
                    continue;
                }
                var fakeTotal = 0;
                if (blockConfig && blockConfig.changeOneChange===true) {
                    //手工并且是换一换的，直接取20条数据
                    fakeTotal = 20;
                } else {
                    fakeTotal = block.contentTotal;
                }
                var type = (block.contentStyle==='168' || block.contentStyle==='169') ? 'focus' : 'rec';


                list = yield cms.getCmsFormatDataNew({
                    blockId: block.contentId,
                    num: fakeTotal,
                    type: type,
                    cid: cid,
                    geo: geo,
                    langName: block.contentStyle==="170" ? originalLangName : langName
                });

                if (!list || !list.length) {
                    var newLang = downgrade.changeLang(langName, region);//检测是否需要更换为默认语言再次请求
                    if (newLang.isChange) {
                        list = yield cms.getCmsFormatDataNew({
                            blockId: block.contentId,
                            num: fakeTotal,
                            type: type,
                            cid: cid,
                            geo: geo,
                            langName: newLang.name
                        });
                    }
                }
                autoRec = 0;
            } else if (block.contentType==2 && !diy) { // 自动推荐板块
                var fakeTotal = 0;
                if (blockConfig && blockConfig.changeOneChange===true) {
                    fakeTotal = 20;
                    // block.d = block.contentTotal;
                } else {
                    fakeTotal = block.contentTotal;
                }
                list = yield rec.formatRecData(block.rec, langName, region, fakeTotal);
                if (!list || !list.length && block.contentTotal) {
                    var newLang = downgrade.changeLang(langName, region);//检测是否需要更换为默认语言再次请求
                    if (newLang.isChange) {
                        list = yield rec.formatRecData(block.rec, newLang.name, region, fakeTotal);
                    }
                }
                autoRec = 1;
            } else if (block.contentType==3 && !diy) { //手工+推荐
                var fakeTotal = 0;
                if (blockConfig && blockConfig.changeOneChange===true) {
                    fakeTotal = 20;
                } else {
                    fakeTotal = block.contentTotal;
                }
                var autoNum = fakeTotal - block.contentManulNum > 0 ? fakeTotal - block.contentManulNum : 0;
                var num = block.contentManulNum;
                var type = (block.contentStyle==='168' || block.contentStyle==='169') ? 'focus' : 'rec';
                list = yield cms.getCmsFormatData(block.contentId, num, type, cid);
                if (autoNum > 0) {
                    autoList = yield rec.formatRecData(block.rec.slice(block.contentManulNum), autoNum);
                    autoList.forEach(function (item) {
                        item.acode2 = 17;
                    });
                    list = list.concat(autoList);
                }
                autoRec = 0;
            }

            if (diy) {
                list = [];
                autoRec = 0;//事实上不怎么起作用
                if (block.contentStyle==183) {//应用推荐,getCmsDataNew有缓存
                    list = yield appList(block.contentId, 100, originalLangName, geo);
                } else if (block.contentStyle==187) {//排行榜
                    list = yield rankinglist.call(this, block, ename);
                } else if (block.contentStyle==171) {//直播，缓存了2min
                    list = yield hotLive(block, langName);
                } else if (block.contentStyle==185) {//筛选栏,有缓存
                    if (!block.contentId) {
                        continue;
                    }
                    list = yield selectBar({
                        geo: geo,
                        blockId: block.contentId,
                        langName: originalLangName
                    });
                } else if (block.contentStyle==188) {//M站上拉加载
                    list.push(1);//使之成功进入下面的判断
                }
            }

            if (list && list.length) {
                item = {
                    fragId: block.fragId,
                    contentId: block.contentId,
                    title: block.blockname,
                    report: block.contentSubName || "jump_vplay",//拼接到上报中
                    num: block.contentTotal,
                    // type: block.contentType, // 推荐类型：1 手工板块；2 自动推荐板块
                    // cmsId: block.contentId,
                    cid: cid,
                    contentStyle: block.contentStyle,
                    moreLink: block.redirectUrl ? Url.parse(block.redirectUrl).path : '',//更多链接
                    moreTxt: multiLangSupport(block.redirectPageId, originalLangName),//更多文案
                    subTxt: multiLangSupport(block.redirectSubPageId, originalLangName),//标题右侧推广位文案
                    subLink: block.redirectSubUrl ? Url.parse(block.redirectSubUrl).path : '',//标题右侧推广位链接
                    videoList: list,
                    acode: autoRec ? 19 : 41,//曝光
                    acode2: autoRec ? 0 : 17,//点击
                    //pageid: statInfo.pageid,
                };
                res.push(item);
            }
        }
        //locache.set(url + ':1', res, 5);
    }
    return res;
};

function getDataByHimself(contentStyle) {
    //应用推荐，排行榜,直播 的数据从别的地方读取,或者才用不同的方式格式化数据
    return ["187", "183", "171", "185", "188"].indexOf(contentStyle) > -1;
}
/**
 * 查看更多和副标题的多语言支持
 * @returns {*}
 */
function multiLangSupport() {
    var lang = arguments[1] || "zh_cn";
    var langObj = querystring.parse(arguments[0]);
    return langObj[lang] || langObj["zh_cn"] || arguments[0] || "";
}

/*rec.letv.com/m?pt=0003&uid=&lc=&pageid=page_cms1002703195&region=&lang=&city=&citylevel&fragid=&num=
 fragid代表当前板块
 num代表出的板块内总视频个数
 顺便提一下：allow_risk_album字段没有在用，可以去掉了。region字段请使用小写。*/

