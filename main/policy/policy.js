/**
 * 通用路由
 */
module.exports = function* (next) {
    let category = this.params.category;
    let title = this.params.title;
    
    let _tpl = category + '/' + title + '.html';
    next(this.render('policy/' + _tpl, {}));
};