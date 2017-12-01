/*--
	组件化(cpt: captain & component)
	-site http://mokjs.com/cpt/
*/
var fs = require('fs'),
	compileSrc = require('./compile').compileSrc,
	cache = require('./cache'), // 缓存
	isPro = global.env.PRO_MODE,
	views = {}, // 编译后的模板们
	compFiles = {}, // key为组件的引用路径，值为组件的真实文件名
	root = process.cwd(),
	charset = 'utf8',
	prjPath;

var reportError = require('./reportError');

exports.init = function (prjConf) {
	if (prjConf) {
		prjConf.root && (root = prjConf.root);
		prjConf.charset && (charset = prjConf.charset);
	}
	prjPath = require('path').resolve(root);
	// console.log(prjPath);
	prjPath[prjPath.length - 1]==='/' || (prjPath += '/');
	view = {};
};

// 返回cpt中间件
exports.use = function (main, cacheTime) {
	main = getRealFile(main);
	if (main==='-') {
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
			cacheKey[cacheKey.length-1]==='/' || (cacheKey += '/');
			cacheVal = yield cache.get(cacheKey);
			if (cacheVal) {
				this.body = cacheVal;
				console.log('cpt->output from cache: '+cacheKey);
				return;
			}
		}

		var _this = this, html = '', expire;
		this.render = render;
		this.useCache = function* (cacheKey) {
			cacheVal = yield cache.get(cacheKey);
			if (cacheVal) {
				html = cacheVal;
				console.log('cpt->useCache: '+cacheKey);
				_this.noCache = true;
				return true;
			}
			return false;
		};
		this.include = function* (comp, data) {
			console.log('cpt->include: '+comp);
			var file = compFiles[comp] || (compFiles[comp] = getRealFile(comp));
			if (file==='-') {return}
			try {
				data = yield require(file).call(_this, data);
			} catch (e) {
				console.error('[err] cpt->include: '+file);
				console.error('request url: '+_this.url);
				console.error(e.stack);
				data = '';
				reportError({ecode: 'cpt_include', url: _this.url,
					msg: file+' | '+e.message});
			}
			console.log('cpt->include: '+comp+' is done');
			return data;
		};

		yield main.call(this, function (str) {
			str==null || (html += str);
		});

		expire = isPro && (this.cacheTime || cacheTime);
		if (expire && !this.noCache && html) { // 需要缓存
			cache.set(this.cacheKey || cacheKey, html, expire);
			console.log('cache.set:', this.cacheKey || cacheKey);
		}

		this.body = html;
	};
};

function render(view, $data, $fn) {
	view = views[view] ||
		(views[view] = compileSrc(fs.readFileSync(view, charset), view));
	return view($data, $fn);
}

// 计算组件的真实文件名
function getRealFile(comp) {
	// console.log('getRealFile: '+comp);
	if (comp.slice(-3)!=='.js') {
		if (fs.existsSync(prjPath+comp+'.js')) {
			return prjPath+comp+'.js';
		}
		comp.slice(-1)==='/' && (comp = comp.slice(0, -1));
		comp += comp.slice(comp.lastIndexOf('/'))+'.js';
	}
	if (fs.existsSync(prjPath+comp)) {
		return prjPath+comp;
	}
	console.error('[err] cpt->getRealFile: "'+comp+'" is not found');
	return '-';
}
