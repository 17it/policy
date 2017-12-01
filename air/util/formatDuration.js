	/*--
		把时间长度转换成指定格式的时间
		-as formatDuration
		-p number time 时间长度，单位秒
		-p string timeFormat 时间格式，如 HH:MM:SS
		-r string 指定格式的时间
		-note 最大单位只到天（即DD），没有到月
		-rel [0, formatTime] 把时间点格式化成YYYY-mm-DD HH:MM:SS格式的字符串
		-eg
			var formatDuration = require('air/util/formatDuration');
			formatDuration(3615, '<p>HH小时MM分钟SS秒</p>'); //<p>01小时00分钟15秒</p>
			formatDuration(3615, '<p>H小时M分钟S秒</p>'); //<p>1小时0分钟15秒</p>
			formatDuration(90015, '<p>D天H小时M分钟S秒</p>'); //<p>1天1小时0分钟15秒</p>
	*/
	module.exports = function (time, timeFormat) {
		var t = {DD: '00', HH: '00', MM: '00', SS: '00', D: '0', H: '0', M: '0', S: '0'},
			_f = Math.floor, x;

		/*if (time>=2592000) { //30*24*60*60 = 2592000 //取消月的需求
			x = _f(time/2592000);
			t.mm = t.m = x;
			x<10 && (t.mm = '0'+x);
			time %= 2592000;
		}*/
		if (time>=86400) { //24*60*60 = 86400
			x = _f(time / 86400);
			t.DD = t.D = x;
			x<10 && (t.DD = '0'+x);
			time %= 86400;
		}
		if (time>=3600) {
			x = _f(time / 3600);
			t.HH = t.H = x;
			x<10 && (t.HH = '0'+x);
			time %= 3600;
		}
		if (time>59) {
			x = _f(time / 60);
			t.MM = t.M = x;
			x<10 && (t.MM = '0'+x);
			time %= 60;
		}
		if (time>0) {
			t.SS = t.S = time;
			time<10 && (t.SS = '0'+time);
		}
		return timeFormat.replace(/\b[DHMS]+\b/g, function ($0) {
			return t[$0] || '';
		});
	};
