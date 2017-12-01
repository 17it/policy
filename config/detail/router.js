/**
 * pc详情页的router路由配置文件
 *
 * 电视剧：http://www.le.com/tv/10037872.html
 * 电影: http://www.le.com/movie/10029833.html
 * 动漫：http://www.le.com/comic/81067.html
 * 综艺：http://www.le.com/zongyi/10037798.html
 */
var router = require('koa-router')();
var cpt_ejs = require('../../lib/cpt_ejs');

cpt_ejs.init({root: './'});

//------------router配置开始------------//

router.get('/tv/:pid.html', cpt_ejs.use('main/detail/detail', 5));
router.get('/zongyi/:pid.html', cpt_ejs.use('main/detail/detail', 1));
router.get('/comic/:pid.html', cpt_ejs.use('main/detail/detail', 5));
router.get('/movie/:pid.html', cpt_ejs.use('main/detail/detail', 5));

//------------router配置结束------------//

module.exports = router;
