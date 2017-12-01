require('../.lepc-conf'); // 加载项目运行时的环境配置

global.env.PRO_MODE && (console.log = function () {}); // 线上不记log日志
var SERVER_IP = global.env.SERVER_IP || '-';

global.$require = function (id) {
    return require('./'+id);
};

global.abspath = function(path){
    return __dirname + '/'+path;
};

var app = require('koa')();
var router = require('./router');


app.use(function* (next) {
    this.set('From-Svr', SERVER_IP);
    try {
        yield next;
        this.status===404 && this.redirect('/error/?msg=404&url='+encodeURIComponent(this.url));
    } catch (e) {
        console.error('server error:', e, this);
        this.path==='/error/' || this.redirect('/error/?msg='+(e.status || '500')+'&url='+encodeURIComponent(this.url));
    }
});

// router
app.use(router.routes());


var port = global.env.PORT || 8001;
app.listen(port);
console.info('lepc is working on port '+port);

// 捕获异步操作抛出的异常（koa捕获不到）
process.on('uncaughtException', function (e) {
    console.error('uncaught exception: '+e);
    console.error(e.stack);
});
