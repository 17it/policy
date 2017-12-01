var fs = require('fs');
var regKey = /^\w+$/;
var cacheRoot = '/letv/www/cache/one/';

// 删除当前服务器的key缓存
// 不是真正的删除，只是将数据置为过期
// 过期后第一个用数据的请求发现过期，然后就会去更新缓存
// 不要删除，防止同时有多个请求去更新缓存
module.exports = function* () {
	var key = this.query.key;
	console.info('flushNgxCache:', key);
	if (key && key.length===32 && regKey.test(key)) {
		var file = cacheRoot+key.slice(-1)+'/'+key.slice(-3, -1)+'/'+key;
		fs.existsSync(file) && fs.statSync(file).isFile() && fs.unlinkSync(file);
	}
	this.body = '200';
};
