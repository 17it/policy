var http = require('http');
var qs = require('querystring');
// var api = 'http://127.0.0.1:3001/api/error?';
// var api = 'http://10.135.30.115:3001/api/error?';
var api = 'http://115.182.63.150/onlineError?';
// var serverIp = $require('air/node/getLocalIp')();

// global.env.REPORT_ERR为true才上报错误
var REPORT_ERR = global.env && global.env.REPORT_ERR;
var SERVER_IP = REPORT_ERR && global.env.SERVER_IP;

module.exports = REPORT_ERR ? function (info) {
	info.tm = (Date.now() / 1000).toFixed(0);
	info.bline = 'mNode';
	info.from = SERVER_IP;
	http.request(api+qs.stringify(info), function (res) {
		if (res.statusCode!==200) {
			console.error('reportError error: '+res.statusCode);
		}
	}).on('error', function (e) {
		console.error('reportError error: '+e.message);
	}).end();
} : function () {};
