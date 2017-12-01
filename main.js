/**
 * 主入口文件，该文件为各个配置文件共用
 */
var app = require('koa')();
var koaStatic = require('koa-static');
module.exports = {
    init: function (router) {
        var SERVER_IP = global.env.SERVER_IP || '-';
        global.env.PRO_MODE && (console.log = function () {}); // 线上不记log日志
        global.abspath = function (path) {
            return __dirname + '/' + path;
        };

        app.use(function* (next) {
            this.set('From-Svr', SERVER_IP);
            try {
                yield next;
                // this.status === 404 && this.redirect('/error/?msg=404&url=' + encodeURIComponent(this.url));
            } catch (e) {
                console.error('server error:', e, this);
                this.path === '/error/' || this.redirect('/error/?msg=' + (e.status || '500') + '&url=' + encodeURIComponent(this.url));
            }
        });
    
        // static server
        app.use(koaStatic(abspath("dist/"), {extensions: ['.js','.css','.png','.jpg','.gif']}));
    
        // router
        app.use(router.routes());

        var port = global.env.PORT || 8001;
        var name = global.env.NAME || 'policy';
        
        app.listen(port, function () {
            console.info(name + ' is working on port ' + port);
        });

        // 捕获异步操作抛出的异常（koa捕获不到）
        process.on('uncaughtException', function (e) {
            console.error('uncaught exception: ' + e);
            console.error(e.stack);
        });
    }
};