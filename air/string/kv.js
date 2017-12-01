	/*--
		解析key-value字符串，或者将JS纯对象key-value化
		-as kv
	*/
	module.exports = {
		/*--
			解析字符串
			-p str kvString key-value字符串
			-p str [fieldSeparator = ','] 字段分隔符
			-p str [kvSeparator = ':'] key与value的分隔符
			-p fn [valueHandler] 对value进行预处理的函数
			-r object 结果对象
			-eg
				kv.parse('a:1,b:2,c:x-x'); // {a:'1', b:'2', c:'x-x'}
				kv.parse('a:1,b:2,c'); // {a:'1', b:'2', c:null}
		*/
		parse: function (kvString, fieldSeparator, kvSeparator, valueHandler) {
			if (!fieldSeparator) {
				fieldSeparator = ',';
				kvSeparator = ':';
			}
			var res = {},
				data = String(kvString).split(fieldSeparator),
				hasHandler = !!valueHandler,
				len = data.length,
				i = 0,
				kv;

			for (; i<len; i++) {
				kv = data[i].split(kvSeparator);
				res[kv[0]] = kv.length>1 ?
					(hasHandler ? valueHandler(kv[1]) : kv[1]) : null;
			}

			return res;
		},
		/*--
			将<r>只有一个层级的</r>JS对象key-value化
			-p obj obj 纯对象
			-p str [fieldSeparator = ','] 字段分隔符
			-p str [kvSeparator = ':'] key与value的分隔符
			-p fn [valueHandler] 对value进行预处理的函数
			-r 结果字符串
			-eg
				kv.stringify({a:1,b:2,c:'x-x'}, ',', ':'); // "a:1,b:2,c:x-x"
		*/
		stringify: function (obj, fieldSeparator, kvSeparator, valueHandler) {
			if (!fieldSeparator) {
				fieldSeparator = ',';
				kvSeparator = ':';
			}
			var res = [],
				hasHandler = !!valueHandler,
				k;

			for (k in obj) {
				if (obj.hasOwnProperty(k)) {
					res.push(k+kvSeparator+
						(hasHandler ? valueHandler(obj[k]) : obj[k]));
				}
			}

			return res.join(fieldSeparator);
		}
	};
