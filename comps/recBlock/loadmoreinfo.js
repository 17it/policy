var querystring = require('querystring');
var api = $require('data/api');
var mms = $require('modules/mms');
var request = $require('lib/request');
var getChannelListInfo = $require('data/channelListInfo');
//搜索接口文档：http://wiki.letv.cn/pages/viewpage.action?pageId=46173662
//目前还没有做缓存
function* getData(data) {
    var sort = data.sort;//当前排序方式
    var ps = data.ps;//URL传递过来的参数集合
    var cid = ps['cg'];
    var categetloadmoreinforyInfo = getChannelListInfo['categoryInfo'][cid] || '';//基于cid的检索配置项
    var sorts = categetloadmoreinforyInfo['sort'];
    //获取每个频道下的类型、地区等二级分类方式

    var sortInfo = sorts[sort];
    //搜索接口文档地址：http://wiki.letv.cn/pages/viewpage.action?pageId=46173662
    var filter = {
        'from': 'msite0400',
        'cg': cid,
        'or': sortInfo['id'],
        'stt': 1,//升降序
        'pn': 1, //页码
        'ps': 20, //每页数量
        'dt': categetloadmoreinforyInfo['dt'] || '', //数据类型：1专辑 2视频 3明星，多参数逗号分隔
        'ph': '420001,420002', //推送平台
        'src': 1 //来源 1站内 2 站外
    };
    //子分类/地区/style: 561001 电影   561002 微电影/视频类型：180001正片/动漫 亲子 需要加参数 ag 511001 即六岁及以下
    ['sc', 'ar', 'st', 'vt', 'ag'].forEach(function (key) {
        if (ps[key] && ps[key] == 'zz') {
            filter['ishomemade'] = '1';
        } else {
            (ps[key] || sortInfo[key]) && (filter[key] = ps[key] || sortInfo[key]);
        }
    });
    sortInfo['isEnd'] && (filter['isend'] = sortInfo['isEnd']); //是否完结

    var url = api['channelList'] + querystring.stringify(filter);
    var soList = yield request(url);
    var data={};
    data['cnt'] = soList['data_count'] || 0;
    filter.eid=soList['eid'];
    filter.sort=sort;
    filter.totalPage=Math.ceil(data['cnt']/filter['ps']);
    return filter;
}
var enameConfig={
    movie:"hot",
    comic:"hot",
    tv:"hot",
    zongyi:"hot",
    music:"hot",
    ent:"hot",
    jilu:"hot",
    sports:"hot",
    finance:"hot",
    fashion:"hot",
    travel:"hot",
    auto:"hot",
    edu:"hot"
};
function* getloadmoreinfo(cname) {
    var ci = getChannelListInfo['categoryInfo'];
    var o = null;
    for (var i in ci) {
        if (ci[i].cname == cname) {
            o =ci[i] ;
            break;
        }
    }
    if(!o){
        return o;
    }

    var sort=enameConfig[cname];
    if(!sort){
        return;
    }
    var re=yield getData({
        ps: { cg:o.ptvcid },
        sort: sort,
    });
    re.ename=this.lang[o.nameCon]||"";//频道名
    return re;
}


exports.getloadmoreinfo=getloadmoreinfo;
