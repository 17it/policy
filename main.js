/**
 * 主文件入口
 */
const app = require('koa')();
const static = require('koa-static');

const main = {
    init: function (route) {
        const SERVER_IP = global.env.SERVER_IP || '-';
        // 正式环境不记录日志
        global.env.PRO_MODE && (console.log = function () {});
        global.abspath = function (path) { return __dirname + '/' + path; };
        
        app.use(function* (next) {
            this.set('From-Svr', SERVER_IP);
            try {
                yield next;
                this.status === 404 && this.redirect('/404.html?url=' + encodeURIComponent(this.url));
            } catch (err) {
                console.error('server error', err, this);
                this.redirect('/error.html?msg=' + (e.status || '500') + '&url=' + encodeURIComponent(this.url));
                this.app.emit('error', err, this);
            }
        });
        
        // static server
        app.use(static(abspath('dist/')));
    
        // route
        app.use(route.routes());
        
        // on error
        app.on('error', function (err, ctx) {
            console.error('app error', err, ctx);
        });
        
        const port = global.env.PORT || 8001;
        const name = global.env.NAME || 'policy';
        app.listen(port, function () {
            console.log(name, 'is working on port', port);
        });
        
        // catch exception which koa can not catch
        process.on('uncaughtException', function (err) {
            console.log('uncaughtException', err);
            console.log(err.stack);
        });
    }
};

module.exports = main;