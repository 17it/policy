/**
 * created by tym
 */
// var model = require('./policyModel');
// var request = $require('lib/request');

module.exports = function* (write) {
    // category
    var category = this.params.category;
    var title = this.params.title || 'index';
    // dist目录下静态资源不走逻辑
    if(['js','css','image'].indexOf(category) > -1){ return; }
    
    var _tpl = category + '/' + title + '.html';
    write(this.render('policy/' + _tpl, {}));
};