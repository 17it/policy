/**
 * created by tym
 */
// var model = require('./policyModel');
// var request = $require('lib/request');

module.exports = function* (write) {
    
    write(this.render('policy/index/index.html', {}));
};