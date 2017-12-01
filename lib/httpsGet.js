// 原始请求
// 对响应数据除了解析JSON字符串（如果不传isText参数）外，不做其他处理

var https = require('https');
var parseJson = require('./parseJson');
var reportError = require('./reportError');

module.exports = function (url, isText, timeout) {
	return function (done) {
		console.log('get: "'+url+'" ...');
		var t = Date.now(), timer;
		
		var req = https.request(url, function (res) {
			clearTimeout(timer);
			t = Date.now() - t;
			if (!done) {return}
			
			if (res.statusCode===200) {
				res.setEncoding('utf8');
				var data = '';
				res.on('data', function (chunk) {
					data += chunk;
				});
				res.on('end', function () {
					// console.log(data);
					if (!isText) {
						data = parseJson(data);
						// data || console.error('httpsGet: parseJson maybe error: "'+url+'"');
					}
					done(null, data);
				});
				t>300 && console.info('get: "'+url+'" '+t);
			} else {
				console.error('[err] get: "'+url+'" '+t+' '+res.statusCode);
				done(null, '');
				reportError({ecode: 'get_res_status', url: url, scode: res.statusCode});
			}
		});
		req.on('error', function (err) {
			clearTimeout(timer);
			if (done) {
				console.error('[err] get: "'+url+'" '+(Date.now()-t)+'\n'+err.message);
				done(null, '');
				reportError({ecode: 'get_req_err', url: url, emsg: err.message});
			}
		});
		req.end();

		timeout || (timeout = 3000);
		timer = setTimeout(function() {
			req.abort();
			done(null, '');
			done = false;
			console.info('[timeout] get: "'+url+'" '+timeout);
		}, timeout);
	};
}
