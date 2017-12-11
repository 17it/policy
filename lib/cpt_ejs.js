/**
 * ejs模板引擎，支持缓存
 */
var fs = require('fs'),
    ejs = require('ejs'),
    cache = require('./cache'),
    isPro = global.env.PRO_MODE,
    views = {},
    root = process.cwd(),
    charset = 'utf8',
    path = require('path'),
    prjPath;
var minify = require('html-minifier').minify;

// init，传入当前项目的root路径
exports.init = function (prjConf) {
    if (prjConf) {
        prjConf.root && (root = prjConf.root);
        prjConf.charset && (charset = prjConf.charset);
    }
    prjPath = path.resolve(root);
    prjPath[prjPath.length - 1] === '/' || (prjPath += '/');
};

// 返回中间件
exports.use = function (main, cacheTime) {
    main = getRealFile(main);
    if (main === '-') {
        return function* () {
            this.status = 404;
        };
    }

    main = require(main);
    cacheTime = isPro && cacheTime ? cacheTime : false;

    return function* () {
        var cacheKey, cacheVal;
        if (cacheTime) {
            cacheKey = this.path;
            cacheKey[cacheKey.length - 1] === '/' || (cacheKey += '/');
            cacheVal = yield cache.get(cacheKey);
            if (cacheVal) {
                this.body = cacheVal;
                console.log('cpt->output from cache: ', cacheKey);
                return;
            }
        }

        var html = '', expire;
        this.render = render;

        yield main.call(this, function (str) {
            str == null || (html += str);
        });

        if (isPro) {
            html = minify(html, {
                collapseBooleanAttributes: true,
                collapseWhitespace: true,
                decodeEntities: true,
                minifyCSS: true,
                minifyJS: true,
                processConditionalComments: true,
                processScripts: 'text/html',
                removeComments: true,
                removeOptionalTags: false,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                removeTagWhitespace: true,
                sortAttributes: true,
                sortClassName: true,
                trimCustomFragments: true
            });
        }

        expire = isPro && (this.cacheTime || cacheTime);
        if (expire && !this.noCache && html) { // 需要缓存
            cache.set(this.cacheKey || cacheKey, html, expire);
            console.log('cache.set:', this.cacheKey || cacheKey);
        }

        this.body = html;
    };
};

// 指定根目录下的view目录为模板存放位置，目录结构应该与main对应
function render(view, $data) {
    var viewPath = view = path.join(path.join(root, 'view'), view);
    view = views[view] || (views[view] = ejs.compile(fs.readFileSync(view, charset), {
        filename: viewPath
    }));
    return view($data);
}

// 计算组件的真实文件名
function getRealFile(comp) {
    if (comp.slice(-3) !== '.js') {
        if (fs.existsSync(prjPath + comp + '.js')) {
            return prjPath + comp + '.js';
        }
        comp.slice(-1) === '/' && (comp = comp.slice(0, -1));
        comp += comp.slice(comp.lastIndexOf('/')) + '.js';
    }
    if (fs.existsSync(prjPath + comp)) {
        return prjPath + comp;
    }
    console.error('[err] cpt->getRealFile: "' + comp + '" is not found');
    return '-';
}
