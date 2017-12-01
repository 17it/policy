/*--
	缓存模块
	生产机环境使用两级缓存：本地缓存 -> cbase
	本地开发时，自动降级为procache（进程内缓存）。
*/

var cbase = require('./cbase');
var locache = require('./locache');
var mc = locache.mc;

module.exports = {
	set: function (key, value, expire) {
		expire || (expire = 10);
		locache.set(key, value, expire + 0.3); // 多加18秒
		cbase.set(key, {t: Date.now()+expire*60000+5000, data: value}, expire * 60 + 5,
			function (err) {
			err && console.error('[err] cbase set: "'+key+'"\n'+err.message);
		});
	},
	get: function (key) {
		return function (done) {
			mc.get(key, function (err, value) {
				if (value) {
					// value.t为真正数据的过期时间
					if (value.t>Date.now()) { // 数据没过期
						done(null, value.data);
					} else { // 数据过期
						// 先延长过期时间5分钟，让本机的其他进程不再去更新缓存
						locache.set(key, value.data, 5); 
						// 再去读取cbase，来更新本地缓存
						cbase.get(key, function (err, val) {
							if (err) {
								console.error('[err] cbase get: "'+key+'"\n'+err.message);
							}
							if (val) {
								var t = val.t - Date.now();
								// t小于5秒，或（小于20秒时以1/5的概率）,请求数据接口
								// 按概率请求接口，是为了避免请求接口的
								// 任务全部落到时间最快的那台服务器，因为它的缓存总是先过期
								if (t<5000 || (t<20000 && Math.random()<0.2)) {
									done(null, '');
								} else {
									locache.set(key, val.data, val.t);
									done(null, val.data);
								}
							} else { // cbase数据失效或没有数据
								done(null, '');
							}
						});
					}
				} else { // 本地缓存没有数据
					err && console.error('[err] mc get: "'+key+'"\n'+err.message);
					// 再去读取cbase，来更新本地缓存
					cbase.get(key, function (err, val) {
						if (err) {
							console.error('[err] cbase get: "'+key+'"\n'+err.message);
						}
						if (val) {
							var t = val.t - Date.now();
							// t小于5秒，或（小于20秒时以1/5的概率）,请求数据接口
							// 按概率请求接口，是为了避免请求接口的
							// 任务全部落到时间最快的那台服务器，因为它的缓存总是先过期
							if (t<5000 || (t<20000 && Math.random()<0.2)) {
								done(null, '');
							} else {
								locache.set(key, val.data, val.t);
								done(null, val.data);
							}
						} else { // cbase数据失效或没有数据
							done(null, '');
						}
					});
				}
			});
		};
	}
};

if (!global.env.CBASE) { // 本地开发，不支持cbase
	var procache = require('./procache');
	module.exports = {
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
