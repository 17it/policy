
var api = $require('data/api');
var request = $require('lib/request');
var cms=$require("modules/cms");
module.exports = function*(block) {
    var shaixuanlanlist=[];
    // var shaixuanlanData = yield request(api.getCmsUrl(block.contentId), 5);
    var shaixuanlanData = yield cms.getCmsDataNew(block);
    shaixuanlanData = shaixuanlanData.data && shaixuanlanData.data.blockContent;
    if (!shaixuanlanData) {return []}
    shaixuanlanData.forEach(function (item) {
        if (item.url === '' || item.title === '') {
            return ''
        }
        var r = {
            p: item.priority||0,
            title: item.title,
            subTitle: item.subTitle || '',
            url: item.url,
            remark:!!item.remark
        };
        shaixuanlanlist.push(r);
    });
    if (shaixuanlanlist.length <4) {//当内容 ＜ 4条，该检索菜单不显示；
        return '';
    }
    shaixuanlanlist.sort(function (a, b) {
        return a.p > b.p ? -1 : 1
    });
    if(shaixuanlanlist.length>8){//最多展示8条内容；
        shaixuanlanlist=shaixuanlanlist.slice(0,8);
    }
    if(shaixuanlanlist.length!=8){//当4 ＜ 内容 ＜ 8时，显示权重高值4条检索内容；
        shaixuanlanlist=shaixuanlanlist.slice(0,4);
    }
    return shaixuanlanlist;
};
