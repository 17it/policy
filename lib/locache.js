/*--
	本机缓存，本机所有进程间共用
	-note 本机没有安装memcache时，自动降级为当前进程内的缓存
*/
var SAVE_TIME = 24 * 3600; // one day (measured in seconds)

if (global.env.LOCACHE) { // 是否开启本机缓存
	var Memcached = require('memcached');
	var mc = new Memcached('127.0.0.1:11213');
	module.exports = {
		mc: mc,
		_set: function (key, value, expire) {
			mc.set(key, value, (expire || 10) * 60, function (err) {
				err && console.error('memcache error: _set ['+key+']\n'+err.message);
			});
		},
		_get: function (key) {
			return function (done) {
				mc.get(key, function (err, value) {
					if (err) {
						console.error('memcache error: _get ['+key+']\n'+err.message);
					}
					done(null, value);
				});
			};
		},
		// expire小于10000时，被认为是分钟数；否则，被认为是过期时间点
		set: function (key, value, expire) {
			expire || (expire = 10);
			mc.set(key, {
				t: expire<10000 ? Date.now() + expire * 60000 : expire,
				data: value
			}, SAVE_TIME, function (err) {
				err && console.error('memcache error: set ['+key+']\n'+err.message);
			});
		},
		get: function (key) {
			return function (done) {
				mc.get(key, function (err, value) {
					if (value) {
						var now = Date.now();
						// value.t为真正数据的过期时间
						if (value.t>now) { // 数据没过期
							done(null, value.data);
						} else { // 数据过期
							value.t = now + 60000; // 延长过期时间至1分钟后
							mc.set(key, value, SAVE_TIME, function (err) {
								err && console.error('memcache error: set ['+key+']\n'+
									err.message);
							});
							done(null, null);
						}
					} else {
						err && console.error('memcache error: get ['+key+']\n'+
							err.message);
						done(null, null);
					}
				});
			};
		}
	};
} else {
	var procache = require('./procache');
	module.exports = {
		mc: {
			// 模拟memcache的异步操作
			get: function (key, callback) {
				callback(null, procache._get(key));
			}
		},
		_set: function (key, value, expire) {
			procache.set(key, value, expire);
		},
		_get: function (key) {
			return function (done) {
				done(null, procache.get(key));
			};
		},
		set: function (key, value, expire) {
			procache.set(key, value, expire);
		},
		get: function (key) {
			return function (done) {
				done(null, procache.get(key));
			};
		}
	};
}
