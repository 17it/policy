/*--
	cpt的模板引擎（浏览器端）
	-site http://mokjs.com/cpt/
*/
var fs = require('fs'),
	regComment = /<!--[\D\d]*?-->/g,
	regNotEcho = /[\w.$]/,
	regCtrl = /[\n\r'\\]/g,
	ctrlChars = {'\r':'\\r', '\n':'\\n', "'":"\\'", '\\':'\\\\'},
	openTag = '<%', closeTag = '%>',
	commenti = 0;

function replaceCtrl(code, comments) {
	return code.replace(regComment, function (m) {
		return comments[m.slice(4, -3)] || m;
	}).replace(regCtrl, function (m) {
		return ctrlChars[m];
	});
}

function compileSrc(src) {
	console.log('compile view');
	var comments = {};
	src = src.replace(regComment, function (m) {
		commenti++;
		comments[commenti] = m;
		return '<!--'+commenti+'-->';
	}).split(openTag);
	var code = trimRight(src[0]);
	var js = code ? "var echo='"+replaceCtrl(code, comments)+"'" : "var echo=''";
	var i = 1, len = src.length, srci, dataContext = '$data.', inline = true;
	for (; i<len; i++) {
		srci = src[i].split(closeTag);
		if (srci.length>1) {
			code = srci[0].trim();
			if (code[0]==='=') {
				if (code[1]==='!') {
					code = dataContext+code.slice(2).trimLeft();
					code = "("+code+"==null?'':"+code+")";
				} else {
					code = dataContext+code.slice(1).trimLeft();
				}
				if (inline) {
					js += "+"+code;
				} else {
					js += "echo+="+code;
					inline = true;
				}
			} else if (code==='endeach') {
				dataContext = '$data.';
				js += "}}();";
				inline = false;
			} else if (code.slice(0, 5)==='each ') {
				dataContext = '$item.';
				js += ";~function(){var $item,$i=0,$count="+code.slice(5)+
					".length;for(;$i<$count;$i++){$item="+code.slice(5)+"[$i];";
				inline = false;
			} else {
				js += ";"+parseEcho(code)+";\r\n";
				inline = false;
			}
			code = trimRight(srci[1]);
			if (code) {
				if (inline) {
					js += "+'"+replaceCtrl(code, comments)+"'";
				} else {
					js += "echo+='"+replaceCtrl(code, comments)+"'";
					inline = true;
				}
			}
		} else {
			console.log('cpt->compile error: Unclosed tag "'+openTag+'"\n'+srci[0]);
		}
	}
	js += ';return echo;';
	// console.log(js);
	try {
		return new Function('$data', '$fn', js);
	} catch (e) {
		console.log('cpt->compile error:');
		console.log(e.stack);
		console.log(js);
		comments = null;
		return function () {};
	}
}

exports.compileSrc = compileSrc;

exports.setTag = function (open, close) {
	openTag = open;
	closeTag = close;
};

// 去掉末尾无用的空白字符，不等于全部去掉！
function trimRight(str) {
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
}

// 解析echo语句
function parseEcho(code) {
	code = '^_^'+code;
	var tag = 'echo', n = 0, c,
		i = 3, l = code.length,
		q = '', // 存放单引号或双引号，为空则意味着不在字符串里
		r = '';
	for (; i<l; i++) {
		c = code[i];
		if (c==='"' || c==="'") {
			if (c===q && code[i-1]!=='\\') { // 字符串结束
				q = '';
			} else {
				q || (q = c); // q不存在，则字符串开始
			}
		} else if (q==='') { // 不在字符串里
			if (c===tag[n]) {
				n++;
			} else if (n===4) {
				// 排除：echox, echo.x, echo$, xecho, x.echo, $echo
				if (regNotEcho.test(c) || regNotEcho.test(code[i-5])) {
					// n = 0;
				} else {
					r += '+=';
				}
				n = 0;
			} else {
				n = 0;
			}
		}
		r += c;
	}
	return r;
}
