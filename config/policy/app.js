// 运行时配置
require('../../.policy-conf');

Object.assign(global.env, {
    NAME: 'policy',
    PORT: 8080
});

global.$require = function (id) {
    return require('../../' + id);
};

const route = require('./route');
const Main = $require('main');

Main.init(route);