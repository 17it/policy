/**
 * 配置文件app.js
 */

// 加载项目运行时的环境配置
require('../../.policy-conf');

Object.assign(global.env, {
	NAME: 'policy',
    PORT: '8080'
});

global.$require = function (id) {
	return require('../../' + id);
};

var router = require('./router');
var Main = require('../../main');

Main.init(router);
