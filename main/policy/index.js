/**
 * 首页
 */
module.exports = function* (next) {
    next(this.render('policy/index/index.html', {}));
};