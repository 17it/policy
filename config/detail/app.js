/**
 * 详情页配置文件app.js
 *
 * 电视剧：http://www.le.com/tv/10037872.html
 * 电影: http://www.le.com/movie/10029833.html
 * 动漫：http://www.le.com/comic/81067.html
 * 综艺：http://www.le.com/zongyi/10037798.html
 */

// 加载项目运行时的环境配置
require('../../../.lepc-conf');

Object.assign(global.env, {
	NAME: 'pc_detail',
    PORT: '8013'
});

global.$require = function (id) {
	return require('../../' + id);
};

var router = require('./router');
var Main = require('../../main');

Main.init(router);
