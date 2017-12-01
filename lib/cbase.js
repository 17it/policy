/*--
	cbase缓存，所有服务器间共用
	-note 没有开启cbase缓存时，自动降级为当前进程内的缓存
	-note 不提供同步方法（不能yield调用），只给系统底层用，业务层勿用。
*/

if (global.env.CBASE) {
	var Memcached = require('memcached');
	module.exports = new Memcached('127.0.0.1:11211');
	/*module.exports = {
		set: function (key, value, expire) {
			cbase.set(key, value, expire * 60, function (err) {
				err && console.error('cbase error: set ['+key+']\n'+err.message);
			});
		},
		get: function (key, callback) {
			cbase.get(key, function (err, value) {
				if (err) {
					console.error('cbase error: get ['+key+']\n'+err.message);
				}
				callback(null, value);
			});
		}
	};*/
} else {
	var procache = require('./procache');
	module.exports = {
		set: function () {
			// 业务层不支持cbase调用，要用本机缓存代替cbase
			// 非得使用cbase时，也必须同时存储本机缓存和cbase
			// 本地开发时，存储了本机缓存就没不用存储cbase
		},
		get: function (key, callback) {
			var value = procache._get(key);
			// 本地开发时，必须设置t为0，要不不会重新请求接口
			value && (value = {t: 0, data: value.data});
			callback(null, value);
		}
	};
}
