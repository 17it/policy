var recBlockInfo = require('./recBlockInfo');
var lastAd = require('../focus/lastAd');
var repeat = $require('air/string/repeat');
var howLong = require("./recTool").howLong;
var recConfig = require("./recTool").recConfig;
var loadmoreinfo = require("./loadmoreinfo");
var getUA = $require('modules/getUA');

module.exports = function*(data) {
    var blockList = yield recBlockInfo.call(this, {
        pageid: 'page_cms' + data.recPageId,
        lang: data.langName,
        region: data.region,
    }, data.ename);
    var webEnd = [];//写给前端的大对象

    var res = ['<!-- 板块推荐 -->'];
    var lmi = null;//loadmoreinfo,下拉加载更多的信息
    var block, contentStyle, hasDrag, lazyLoadCount = 2;

    for (var i = 0, len = blockList.length; i < len; i++) {
        block = blockList[i];
        contentStyle = block.contentStyle;
        i < 3 && (contentStyle==185 || contentStyle==170) && (lazyLoadCount = 3);//有服务区或者筛选栏的时候
        block.isFirst = i < lazyLoadCount;//一般情况第一个是焦点图，那么在没有服务区（没懒加载，一般情况下会出现在首屏）的情况下第二个将不使用懒加载
        //推荐的不同板块的，进行不同的渲染
        if (contentStyle==='168' || contentStyle==='169') {//焦点图有标题，,焦点图无标题
            var list = block.videoList,
                focusList = [],
                num = block.num;
            list = list.length > num ? list.slice(0, num) : list;
            list.forEach(function (item) {
                if (!item.pic || !item.url) {
                    return;
                }
                focusList.push({
                    img: item.pic,
                    url: item.url,
                    title: item.title,
                    subTitle: item.subTitle
                })
            });

            if (data.pageid==='home') {
                var lastad = yield lastAd();
                lastad && focusList.push(lastad);
            }
            block.focusList = focusList;
            block.blankLi = repeat('<li></li>', focusList.length - 1);
            block.isHasTitle = contentStyle==='168' ? 1 : 0;
        } else if (contentStyle==="183") {
            if (data.region==="HK") {
                continue;
            }
        } else if (contentStyle==="188") {//M站上拉加载
            hasDrag = this.render(recConfig[contentStyle].template, { loading: this.lang.x811 });
            continue;
        }
        block.region = this.region;//为了上报
        block.ename = data.pageid==="home" ? data.pageid : data.ename;//为了上报
        howLong(block);
        var one = recConfig[contentStyle];
        if (one) {//不是的话就算是样式错误，直接跳过
            one.titleBar && titleAndSubtitle.call(this, block);
            one.loadChange && loadChange.call(this, (block.android = getUA(this).android, block));
            //决定是直接渲染到页面还是渲染之后给前端
            diffRender.call(this, data.pageid, webEnd, block, res);
        }
    }//end for


    if (data.ename) {//频道页，加上上拉加载
        res.unshift(
            `<div id='j-scroller-container' class="scroller">
                    <div id='j-ummary'>
                `
        );
        res.push(`</div>`);
        lmi = yield loadmoreinfo.getloadmoreinfo.call(this, data.ename);
        lmi && hasDrag && res.push(hasDrag);
        res.push(`</div>`);
    }

    return {
        script: `<script> info.recData=${JSON.stringify(webEnd)};
                       info.loadmore=${JSON.stringify(lmi)};
             </script>`,
        res: `${res.join("")}`
    };

};


/**
 * @param block
 */
function titleAndSubtitle(block) {
    block.dwkzdykp = this.lang.x801;//全球化
    block.isZhichu = isZhichu(block);
    block.titleAndSubtitle = this.render(__dirname + "/titleAndSubtitle.html", block);
    return block;
}

/**
 * 加载更多和换一换
 * @param block
 * @returns {*}
 */
function loadChange(block) {
    block.hyh = this.lang.x802;
    block.loadChange = this.render(__dirname + "/loadChange.html", block);
    return block;
}
/**
 * 根据块的不同，渲染不同的模板，
 * 根据id的不同，确定渲染之后是放到页面中还是封装起来给前端
 * @param ctx
 * @param id
 * @param webEnd
 * @param block
 * @param res
 * @returns {*}
 */
function diffRender(id, webEnd, block, res) {
    var templ;
    if (!recConfig[block.contentStyle]) {
        return;
    } else {
        templ = recConfig[block.contentStyle].template;
        if (!templ) {
            return;
        }
    }
    if (block.contentStyle==187) {//排行榜
        block.bfl = this.lang.x805;
        block.biaoqian = this.lang.x804;
    } else if (block.contentStyle==171) {//直播区
        block.wks = this.lang.x806;
    }
    var re = this.render(templ, block);
    if (id=="home" && isZhichu(block) || id!="home") {
        res.push(re);
    } else {
        webEnd.push({
            fragId: block.fragId,
            contentStyle: block.contentStyle,
            contentId: block.contentId,
            moreLink: block.moreLink,
            moreTxt: block.moreTxt,
            subLink: block.subLink,
            subTxt: block.subTxt,
            blockname: block.title,
            num: block.num,
            html: re
        });
    }
    return res;
}
/**
 *频道页无需判断，首页有些板块是直接输出到页面，有些板块是给前端js,
 * 1.有些样式的板块直接给页面，有些板块根据fragId判断，
 * 首页：焦点图不显示在管理卡片里，直播、乐视独享、今日热点 不涉及管理卡片
 * @param block
 * @returns {boolean}
 */
function isZhichu(block) {
    if (block.isZhichu) {
        return true;
    }
    return isZhichu.contentStyles.indexOf(block.contentStyle) > -1 || isZhichu.fragIds.indexOf(block.fragId) > -1;
}
isZhichu.contentStyles = ["168", "169", "170", "171", "185"];
isZhichu.fragIds = ["8308", "8506"];//乐视独享和头条