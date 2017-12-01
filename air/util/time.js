	/*--
		把时间点格式化成类似<cs>{yy}-{mm}-{dd} {hh}:{ii}:{ss}</cs>的字符串
		-as time
		-p number|Date|string time 时间点，可以是<rb>单位为秒</rb>的数字，可以是一个时间对象，
			甚至可以是标准格式（2015-07-15 16:49:25）的时间字符串
		-p string timeFormat 时间格式，例如<cs>{hh}:{mm}:{ss}</cs>，<cs>{yy}年{m}月{d}日</cs>
		-r string 格式化后的时间字符串
		-rel [0, formatTime] 把时间长度转换成指定格式的时间
		-note 与formatTime不同之处在于：
			全部采用小写字母；
			年份只用<cs>yy</cs>表示，分钟用<cs>i</cs>表示；
			字符的边界是<cs>{</cs>和<cs>}</cs>，这样更容易处理与其他字母粘连的情况。
		-eg
			var time = require('air/util/time');
			time(new Date(), '{yy}-{mm}-{dd} {hh}:{ii}:{ss}'); // "2015-07-15 16:49:25"
			//甚至可以将“2015-07-15 16:49:25”这种格式的事件再格式化
			time('2015-07-15 16:49:25', '{yy}年{m}月{d}日'); // "2015年7月15日"
	*/
	module.exports = function (time, timeFormat) {
		if (typeof time==='number') {
			time = new Date(time * 1000);
		} else if (typeof time==='string') {
			time = new Date(Date.parse(time.replace(/-/g, '/')));
		}

		var t = {};
		t.yy = time.getFullYear();
		t.m = time.getMonth() + 1;
		t.d = time.getDate();
		t.h = time.getHours();
		t.i = time.getMinutes();
		t.s = time.getSeconds();
		t.mm = t.m>9 ? t.m : '0'+t.m;
		t.dd = t.d>9 ? t.d : '0'+t.d;
		t.hh = t.h>9 ? t.h : '0'+t.h;
		t.ii = t.i>9 ? t.i : '0'+t.i;
		t.ss = t.s>9 ? t.s : '0'+t.s;

		return timeFormat.replace(/\{([ymdhis]+)\}/g, function ($0, $1) {
			return t[$1] || $0;
		});
	};
