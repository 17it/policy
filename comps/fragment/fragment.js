/*
	只有html的小组件（html碎片）
*/

var readFileSync = require('fs').readFileSync;

// 统计
exports.statictis = readFileSync(__dirname+'/statictis.html');
// 短视频详情页右侧电视导航
exports.guideTv = readFileSync(__dirname+'/guideTv.html');
// 短视频详情页右侧类型索引
exports.typeIndex = readFileSync(__dirname+'/typeIndex.html');
