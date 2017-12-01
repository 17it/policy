(function(win, doc){
win.console || (console={log:function(){},dir:function(){},error:function(){}});
win.JSTracker = {send: function () {}};
try {
	doc.domain = location.hostname.split('.').slice(-2).join('.');
} catch (e) {}
var query = (function (qs) {
	if (!qs) {return {}}
	qs = qs.slice(1).split('&');
	var res = {},
		i = 0, l = qs.length,
		p, j;
	for (; i<l; i++) {
		p = qs[i];
		if (p) {
			j = p.indexOf('=');
			v = decodeURIComponent(p.slice(j + 1));
			if (v && j>0) {
				res[p.slice(0, j).toLowerCase()] = v;
			}
		}
	}
	return res;
})(location.search);
var getCookie = function (name) {
	name += '=';
	var cookies = (doc.cookie || '').split(';'),
		cookie,
		nameLength = name.length,
		i = cookies.length;
	while (i--) {
		cookie = cookies[i].replace(/^\s+/, '');
		if (cookie.slice(0, nameLength)===name) {
			cookie = decodeURIComponent(
				cookie.slice(nameLength)).replace(/\s+$/, '');
			return cookie==='deleted' ? '' : cookie;
		}
	}
	return '';
};
var ref = ({'0101': 1, '0102': 1, '0103': 1, '0104': 1})[query.ref];
var ua = navigator.userAgent.toLowerCase();
info.ua = {
	src: ua,
	android: ua.indexOf('android')>-1,
	ios: ua.indexOf('iphone os')>-1
};
info.query = query;
// 新的控制头尾是否展示的策略：先判断ua是否有指定特征符，有则隐藏头尾
// 当根据ua隐藏了头尾时，用url参数x去控制展示头尾：x=10 显示头部, 01 显示尾部, 11 显示头尾
if (ua.indexOf('lesports')>-1) {
	info.noheader = info.nofooter = 1;
	if (query.x) {
		if (query.x==='11') {info.noheader = info.nofooter = 0}
		else if (query.x==='10') {info.noheader = 0}
		else if (query.x==='01') {info.nofooter = 0}
	}
} else {
	info.noheader = getCookie('noheader')==='1' || query.noheader || ref;
	info.nofooter = getCookie('nofooter')==='1' || query.nofooter || ref;
}
/* info.noopenimg = 1; */
if (ref || getCookie('openby') || ua.indexOf('letvclient')>-1 || ua.indexOf('letvmobileclient')>-1) {
	info.openby = 'letvapp';
} else if (/\bx\d\d\d\b|leuibrowser|eui browser/.test(ua)) {
	info.openby = 'letvphone';
}
/* 在components/ctrlCookies.js里种noheader、nofooter、openby这几个cookie */
// 相同，或者url里有locale参数，不刷新；否则说明用户设置了语言，刷新生效
var lang = getCookie('lang');
if (lang) {
	info.lang===lang || query.locale || (info.lang && location.reload());
}
})(window, document);

// http://js.letvcdn.com/lc03_js/201512/15/11/51/fontRem.js
// 通用直播播放页不加
info.pageid==='live/play' || info.pageid==='izt' || function(x) {
    function w() {
        var a = r.getBoundingClientRect().width;
        a / v > 540 && (a = 540 * v), x.rem = a / 41.4, r.style.fontSize = x.rem + "px"
    }
    var v, u, t, s = x.document,
        r = s.documentElement,
        q = s.querySelector('meta[name="viewport"]'),
    p = s.querySelector('meta[name="flexible"]');
    var o = q.getAttribute("content").match(/initial\-scale=(["‘]?)([\d\.]+)\1?/);
    o && (u = parseFloat(o[2]), v = parseInt(1 / u));
    x.dpr = v, x.addEventListener("resize", function() {
        clearTimeout(t), t = setTimeout(w, 300)
    }, !1), x.addEventListener("pageshow", function(b) {
        b.persisted && (clearTimeout(t), t = setTimeout(w, 300))
    }, !1), "complete" === s.readyState ? s.body.style.fontSize = 12 * v + "px" : s.addEventListener("DOMContentLoaded", function() {
        s.body.style.fontSize = 12 * v + "px"
    }, !1), w()
}(window);
