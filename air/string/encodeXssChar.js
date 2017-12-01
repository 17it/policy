	/*--
		对可能引起XSS的字符进行编码
		-as encodeXssChar
		-p str str 需要html编码的字符串
		-r 对str进行html编码后的字符串
		-note 服务端可用
		-eg
			var encodeXssChar = require('air/string/encodeXssChar');
			var code = '<script data-ng="1">alert(1);</script>';
			alert(encodeXssChar(code)); //&lt;script data-ng="1"&gt;alert(1);&lt;/script&gt;
	*/
	module.exports = function (str) {
		typeof str==='string' || (str = String(str));
		var i = 0, len = str.length, res = '', c;
		for (; i<len; i++) {
			c = str[i];
			if (c==='<') {
				res += '&lt;';
			} else if (c==='>') {
				res += '&gt;';
			} else if (c==='"') {
				res += '&quot;';
			} else if (c==='\'') {
				res += '&#39;';
			} else {
				res += c;
			}
		}
		return res;
	};
