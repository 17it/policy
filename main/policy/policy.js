/**
 * created by tym
 */
// var model = require('./policyModel');
// var request = $require('lib/request');

module.exports = function* (write) {
    // category
    var category = this.params.category;
    var title = this.params.title || 'index';
    var _tpl = category + '/' + title + '.html';
    
    write(this.render('policy/' + _tpl, {}));
};