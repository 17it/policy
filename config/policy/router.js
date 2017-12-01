/**
 * router路由配置文件
 */
var router = require('koa-router')();
var cpt_ejs = require('../../lib/cpt_ejs');

cpt_ejs.init({root: './'});

// 代理层接口
// router.get('/auth/:category/:title', cpt_ejs.use('common/auth/get', 2));
// router.post('/auth/:category/:title', cpt_ejs.use('common/auth/post', 2));

// 登录页面
// router.get('/sso/login', cpt_ejs.use('main/policy/sso/login', 2));

// 通用路由设置
router.get('/:category/:title', cpt_ejs.use('main/policy/policy', 1));

// 首页router
router.get('/', cpt_ejs.use('main/policy/index', 2));

module.exports = router;
