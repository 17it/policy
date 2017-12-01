//降级处理：美国地区都指向大陆 Tips:地域放开时，页面缓存 key 需要增加地域,首页、频道页、直播频道页都使用
exports.resetRegion = function (region) {
    if (global.env.GEO==='HK_0_0') {
        return 'HK';
    }
    //return region === 'US' ? 'CN' : region;//降级处理：美国地区，强制指向大陆。
    return 'CN';//降级处理：美国地区，香港地区强制指向大陆。
};
//降级处理：用美国语言请求内容数据时，均等同于用所在ip默认语言请求；各地默认语言：大陆：中文简体 香港：中文繁体
exports.resetLang = function (langName, region) {
    if (langName==='en_us') {
        langName = region==='CN' || region==='US'  ? 'zh_cn' : 'zh_hk';
    };
    return langName;
};
//降级处理：用非所在ip默认语言请求CMS/VRS板块数据时，若数据全部为空，则用默认语言再次请求数据，若仍为空则隐藏该板块
exports.changeLang = function (langName, region) {
    if ((region==='CN' && langName==='zh_hk') || (region==='HK' && langName==='zh_cn')) {
        return {
            'isChange': true,
            'name': region==='CN' && langName==='zh_hk' ? 'zh_cn' : 'zh_hk'
        }
    }
    return {
        'isChange': false
    }
};