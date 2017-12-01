/*--
	当前进程内的缓存
	-业务层不推荐使用进程内的缓存，请使用本机缓存。
*/
var cache = {}; // 缓存池

exports.set = function (key, value, expire) {
	cache[key] = {
		t: Date.now() + (expire || 10) * 60000,
		data: value
	};
};

exports.get = function (key) {
	var value = cache[key];
	if (value) {
		if (value.t>Date.now()) { // 缓存有效
			return value.data;
		} else { // 缓存到期
			value.t = Date.now() + 60000; // 延期1分钟
		}
	}
	return null;
};

exports._get = function (key) {
	return cache[key];
};
