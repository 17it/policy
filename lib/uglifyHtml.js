/*--
	去掉无用的空白字符，近乎于压缩html
	-note
		1、除了每个html块的第一行（可能是类似`...?> class="...`这种情况），行前的全去掉。
		2、如果`>`后至行尾换行符之间无有效字符，则包括换行符都去掉。
*/
var uglifyHtml = function (str) {
	var i = 0, len = str.length, res = '', temp = '',
		end, c;
	for (; i<len; i++) {
		c = str[i];
		if (c===' ' || c==='\t') {
			end==='>' || (temp += c);
		} else if (c==='\n' || c==='\r') {
			if (end!=='>') {
				// res += temp+c;
				// temp = '';
				temp += c;
				if (c==='\n') {
					end = '>'; // \n相当于最后一个字符是`>`
				}
			}
		} else {
			if (temp) {
				if (c==='<' && (temp==='\n' || temp==='\r\n')) {
					res += c;
				} else {
					res += temp+c;
				}
				temp = '';
			} else {
				res += c;
			}
			end = c;
		}
	}
	end==='>' || (res += temp); // `<i <?=imgAtrr?>` 要加上i后的空格
	return res;
};

// 调试模式，不压缩html
if (global.env && global.env.DEBUG) {
	// 去掉末尾无用的空白字符，不等于全部去掉！
	uglifyHtml = function (str) {
		var i = str.length, c, pos = -1;
		while (i--) {
			c = str[i];
			if (c===' ' || c==='\t') {
				
			} else if (c==='\n' || c==='\r') {
				pos = i;
			} else {
				return pos<0 ? str : str.slice(0, pos);
			}
		}
		return '';
	};
}

module.exports = uglifyHtml;
