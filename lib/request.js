/*--
	请求接口数据
*/
var http = require('http');
var parseJson = require('./parseJson');
var reportError = require('./reportError');
var api = require('../data/api');
var cbase = require('./cbase');
var locache = require('./locache');
var mc = locache.mc;
var SAVE_TIME = 24 * 60; // one day (measured in minutes)

/*--
	通过GET方式请求第三方接口
	-p str url 接口url
	-p number|object opt 数据缓存时间，或调用选项，可包含以下属性：<br/>
		<p>expire: 数据缓存时间</p>
 		<p>reset: 值为true，重置缓存内容及缓存时间</p>
		<p>cacheKey: 缓存的key</p>
		<p>timeout: 请求超时时间</p>
		<p>type: 返回数据格式，没有该属性时将自动判断是否需要parseJson，
			有该属性时，值为`json`将parseJson，否则不parseJson</p>
	-p fn dataHandler 对响应数据的处理函数，需要缓存时将会缓存该函数的返回值。
	-r str|json 请求结果
*/
module.exports = function (url, opt, dataHandler) {
	return function (done) {
		url.indexOf(':')>0 || (url = api[url]); // 含有“:”则是真实的url
		var cacheKey = url, expire, reset;
		if (typeof opt==='number') {
			expire = opt;
		} else if (opt) {
			expire = opt.expire;
			opt.cacheKey && (cacheKey = opt.cacheKey);
            reset = opt.reset;
		}
		
		if (expire) {
			mc.get(cacheKey, function (err, value) {
				if (value && !reset) {
					// value.t为真正数据的过期时间
					if (value.t<Date.now()) { // 数据过期
						locache.set(cacheKey, value.data, expire); // 先延长过期时间
						// 再去异步更新缓存
						cbase.get(cacheKey, function (err, val) {
							if (err) {
								console.error('[err] cbase get: "'+cacheKey+'"\n'+err.message);
							}
							if (val) {
								var t = val.t - Date.now();
								// t小于5秒，或（小于20秒时以1/5的概率）,请求数据接口
								// 按概率请求接口，是为了避免请求接口的
								// 任务全部落到时间最快的那台服务器，因为它的缓存总是先过期
								if (t<5000 || (t<20000 && Math.random()<0.2)) {
									doRequest(url, opt, dataHandler, expire, function () {}, true);
								} else {
									locache.set(cacheKey, val.data, val.t);
								}
							} else {
								doRequest(url, opt, dataHandler, expire, function () {}, true);
							}
						});
					}
					done(null, value.data);
				} else {
					err && console.error('[err] mc get: "'+cacheKey+'"\n'+err.message);
					doRequest(url, opt, dataHandler, expire, done);
				}
			});
		} else {
			doRequest(url, opt, dataHandler, false, done);
		}
	};
};

function doRequest(url, opt, dataHandler, expire, done, hasCache) {
	console.log('request: "'+url+'" ...');
	var cacheKey = url, timeout = 3000, t = Date.now(), timer, type;
	if (typeof opt==='object' && opt) {
		opt.cacheKey && (cacheKey = opt.cacheKey);
		opt.timeout && (timeout = opt.timeout);
		type = opt.type;
	}

	var req = http.request(url, function (res) {
		clearTimeout(timer);
		t = Date.now() - t;
		if (!done) {return}
		
		if (res.statusCode===200) {
			res.setEncoding('utf8');
			var data = '';
			res.on('data', function (chunk) {
				data += chunk;
			});
			res.on('end', function () {
				if (type) {
					type==='json' && (data = parseJson(data));
				} else {
					var c = data.trimLeft()[0];
					(c==='{' || c==='[') && (data = parseJson(data));
				}
				if (data) {
					dataHandler && (data = dataHandler(data));
					if (data!=null) {
						if (expire) {
							locache.set(cacheKey, data, expire + 0.3); // 多加18秒
							cbase.set(cacheKey, {t: Date.now()+expire*60000+5000, data: data},
								expire * 60 + 5, function (err) {
								err && console.error('[err] cbase set: "'+
									cacheKey+'"\n'+err.message);
							});
							done(null, data);
						} else {
							// 没有缓存时间的，也会将数据备份保存
							locache.set('/backup/'+cacheKey, data, SAVE_TIME);
							done(null, data);
						}
					} else {
						// 认为是请求异常
						onException(cacheKey, expire, done, hasCache);
					}
					t>100 && console.info('request: "'+url+'" '+t);
				} else {
					console.error('[err] response data: "'+url+'" '+t+' 200');
					onException(cacheKey, expire, done, hasCache);
					reportError({ecode: 'req_res_data', url: url, msg: 'response data error'});
				}
			});
		} else {
			console.error('[err] request: "'+url+'" '+t+' '+res.statusCode);
			onException(cacheKey, expire, done, hasCache);
			reportError({ecode: 'req_res_status', url: url, scode: res.statusCode});
		}
	});
	req.on('error', function (err) {
		clearTimeout(timer);
		if (done) {
			console.error('[err] request: "'+url+'" '+(Date.now()-t)+'\n'+err.message);
			onException(cacheKey, expire, done, hasCache);
			reportError({ecode: 'req_req_err', url: url, emsg: err.message});
		}
	});
	req.end();

	timer = setTimeout(function() {
		req.abort();
		expire ? done(null, '') : getBackup(cacheKey, done);
		done = false;
		console.info('[timeout] request: "'+url+'" '+timeout);
	}, timeout);
}

function getBackup(cacheKey, done) {
	var key = '/backup/'+cacheKey;
	console.info('getBackup: '+key);
	mc.get(key, function (err, value) {
		if (value) {
			done(null, value.data);
		} else {
			err && console.error('[err] getBackup: "'+key+'"\n'+err.message);
			done(null, '');
		}
	});
}

// 请求异常时，如果没有缓存数据，那么将缓存一个空字符串，防止接口挂了还不停请求
function onException(cacheKey, expire, done, hasCache) {
	if (expire) {
		if (!hasCache) {
			// 本地存3分钟，集群存2分钟，一是缩短请求间隔，二是下次换别的机子请求
			locache.set(cacheKey, '', 3);
			cbase.set(cacheKey, {t: Date.now()+120000, data: ''},
				120, function (err) {
				err && console.error('[err] cbase set: "'+
					cacheKey+'"\n'+err.message);
			});
			done(null, '');
		}
	} else {
		getBackup(cacheKey, done);
	}
}
