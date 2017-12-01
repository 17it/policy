/*--
	获取指定js、css的最终标签，包含文件地址。
*/
var co = require('co');
var request = require('../lib/request');
var parseJson = require('../lib/parseJson');
var cache = require('../lib/cache');
var isT = !!global.env.T_FRAG;
var Url = $require('air/util/url');
var fragCacheKey = '/modules/fragJsCssV13';
var statKey = '';

var frags = {
    cssVersions: {},
    jsVersions: {}
};
//播放器文件路径获取直接去 http
var removeProtocolKeys = {
    'player': 1,
    'livePlayer': 1,
    'ffp_livePlayer': 1,
    'ffp_ovPlayer': 1,
    'ffp_ovLivePlayer': 1
};
/*--
	-p arr css 当前页面要加载的css，例如：['global', 'm_index']
	-note 加载css之前，要先去取碎片数据，但是加载js不先取碎片。
		所以如果只加载js，也必须先调一次loadCss。
*/
exports.loadCss = function* (css) {
    var f = yield cache.get(fragCacheKey);
    var sk = yield cache.get('stat-key');
    if (sk) {
        statKey = sk;
    }
    if (f) {
        frags = f;
    } else { // 缓存失效或第一次调接口
        f = yield request(isT ? 'fragJsCssTest' : 'fragJsCss', isT ? 1 : 2);
        if (f) { // 有数据才覆盖frags
            f.cssVersions = parseCssVersions(isT ? f.test_css : f.css);
            // js上传到cdn后，内容就不会再变，所以缓存尽量长点，10小时
            var jsVers = yield request(isT ? f.test_lepcJs : f.lepcJs, 600);
            if (jsVers) { // 提取其中的js版本号
                f.jsVersions = parseJson('{'+jsVers.split('/*<ver>*/')[1]+'}');
            }

            if (f.cssVersions && f.jsVersions) { // 两个都有，才设置缓存
                // f.css = '';
                frags = {};
                for (var k in f) {
                    k==='css' || (frags[k] = f[k]);
                }
                // 设置碎片缓存长度为5分钟，因为pc目前没有refreshFrag.js逻辑，暂时缩短这个位置的时间
                cache.set(fragCacheKey, frags, isT ? 1 : 5); // 此时间延长，而让refreshFrag.js每分钟更新
            } else {
                console.error('js-css frag error:');
                console.error(f);
            }
        }
    }

    var res = '';
    css.forEach(function (item) {
        res += '<link rel="stylesheet" href="//css.letvcdn.com/lc'+
            (frags.cssVersions[item]||'06_css/201705/03/15/44')+'/koala/'+item+'.css" />\n';
    });
    return res;
};

/*--
	-p arr js 当前页面要加载的js，例如：['base', 'home_v2']
	-note 一定要先调loadCss，才能调loadJs
*/
exports.loadJs = function (js) {
    var res = statKey;
    js.forEach(function (item) {
        res += '<script type="text/javascript" src="//js.letvcdn.com/lc'+
            (frags.jsVersions[item]||'02_js/201704/27/16/53')+'/lepc/'+item+'.js"></script>\n';
    });
    return res;
};

// 获取指定key的值
exports.get = function (key) {
    if (removeProtocolKeys[key]) {
        return Url.removeProtocol(frags[isT ? 'test_'+key : key]);
    }
    return frags[isT ? 'test_'+key : key];
};

function parseCssVersions(css) {
    var cssVers = {}, x;
    css.split(',').forEach(function (item) {
        x = item.split(':');
        cssVers[x[1]] = x[0].replace('_', '_css/20');
    });
    // 有x表示有数据
    return x && cssVers;
}
