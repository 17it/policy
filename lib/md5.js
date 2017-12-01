var crypto = require('crypto');

// 计算text的md5值
module.exports = function (text) {
	return crypto.createHash('md5').update(text).digest('hex');
};
