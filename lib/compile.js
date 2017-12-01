/*--
	cpt的模板引擎（服务器端）
	-site http://mokjs.com/cpt/
*/
var fs = require('fs'),
	uglifyHtml = require('./uglifyHtml'),
	regComment = /<!--[\D\d]*?-->/g,
	regNotEcho = /[\w.$]/,
	regCtrl = /[\n\r'\\]/g,
	ctrlChars = {'\r':'\\r', '\n':'\\n', "'":"\\'", '\\':'\\\\'},
	errorRenders = {},
	charset = 'utf8',
	commenti = 0;

function replaceCtrl(code, comments) {
	return code.replace(regComment, function (m) {
		return comments[m.slice(4, -3)] || m;
	}).replace(regCtrl, function (m) {
		return ctrlChars[m];
	});
}

global.findRenderError = function (file, $data, $fn) {
	if (errorRenders[file]) {
		errorRenders[file]($data, $fn);
		return;
	}
	if (!file || !fs.existsSync(file)) {return}
	var src = fs.readFileSync(file, charset).replace(regComment, '').split('<?');
	var code, js = "try{var $line$,echo='';";
	var i = 1, len = src.length, srci, dataContext = '$data.';
	for (; i<len; i++) {
		srci = src[i].split('?>');
		if (srci.length>1) {
			code = srci[0].trim();
			js += "$line$='"+code.replace(regCtrl, function (m) {
				return ctrlChars[m];
			})+"';";
			if (code[0]==='=') {
				if (code[1]==='!') {
					code = dataContext+code.slice(2).trimLeft();
					js += "echo+=("+code+"==null?'':"+code+")";
				} else {
					js += "echo+="+dataContext+code.slice(1).trimLeft();
				}
			} else if (code==='endeach') {
				dataContext = '$data.';
				js += "});";
			} else if (code.slice(0, 5)==='each ') {
				dataContext = '$item.';
				js += code.slice(5)+".forEach(function ($item, $i) {";
			} else {
				js += parseEcho(code)+";\r\n";
			}
		}
	}
	js += "}catch(e){console.error($line$)}";
	// console.log(js);
	(errorRenders[file] = new Function('$data', '$fn', js))($data, $fn);
};

function compileSrc(src, file) {
	file && (file = file.replace(/\\/g, '/'));
	// console.log('compile view');
	var comments = {};
	src = src.replace(regComment, function (m) {
		commenti++;
		comments[commenti] = m;
		return '<!--'+commenti+'-->';
	}).split('<?');
	var code = uglifyHtml(src[0]);
	var js = code ? "try{var echo='"+replaceCtrl(code, comments)+"'" : "try{var echo=''";
	var i = 1, len = src.length, srci, dataContext = '$data.', inline = true;
	for (; i<len; i++) {
		srci = src[i].split('?>');
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
				js += "});";
				inline = false;
			} else if (code.slice(0, 5)==='each ') {
				dataContext = '$item.';
				js += ";"+code.slice(5)+".forEach(function ($item, $i) {";
				inline = false;
			} else {
				js += ";"+parseEcho(code)+";\r\n";
				inline = false;
			}
			code = uglifyHtml(srci[1]);
			if (code) {
				if (inline) {
					js += "+'"+replaceCtrl(code, comments)+"'";
				} else {
					js += "echo+='"+replaceCtrl(code, comments)+"'";
					inline = true;
				}
			}
		} else {
			console.error('cpt->compile error: Unclosed tag "<?"\n'+srci[0]);
			return function () {};
		}
	}
	js += "}catch(e){console.error('cpt->render error: "+(file ? "at "+file : "")+
		"');console.error(e.toString());findRenderError('"+file+
		"',$data,$fn);return ''}return echo;";
	// console.log(js);
	try {
		return new Function('$data', '$fn', js);
	} catch (e) {
		console.error('cpt->compile error: '+(file ? 'at '+file : ''));
		console.error(e.stack);
		console.error("function anonymous($data, $fn) {"+js+"}");
		comments = null;
		return function () {};
	}
}

function compile(file) {
	return compileSrc(fs.readFileSync(file, charset), file);
}
compile.setCharset = function (set) {
	charset = set;
};
compile.compileSrc = compileSrc;

module.exports = compile;

// 解析echo语句
function parseEcho(code) {
	code = '^_^'+code;
	var tag = 'echo', n = 0, c,
		i = 3, l = code.length,
		q = '', //存放单引号或双引号，为空则意味着不在字符串里
		r = '';
	for (; i<l; i++) {
		c = code[i];
		if (c==='"' || c==="'") {
			if (c===q && code[i-1]!=='\\') { //字符串结束
				q = '';
			} else {
				q || (q = c); //q不存在，则字符串开始
			}
		} else if (q==='') { //不在字符串里
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
