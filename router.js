const router = require('koa-router')();
const cpt = require('./lib/cpt');
const homeModel = require('./main/live/model/home');
const consumer = require('./main/play/consumer');
const koaBody = require('koa-body')({jsonLimit: '3mb'});

cpt.init({root: './'});

//直播热门推荐接口(乐视首页调用)
router.get('/leproxy/pc/live/index', homeModel.lecomIndex);
router.get('/leproxy/pc/live/indexPage', homeModel.indexPage);

//直播首页
router.get('/', cpt.use('main/live/index'));

//直播-子频道首页[体育,音乐,娱乐,财经,品牌,游戏,资讯,其它]
router.get('/:channel/index.shtml', cpt.use('main/live/channel'));

// 轮播台卫视台播放页
router.get('/lwplay/:channel', cpt.use('main/live/lunboTVPlay', 3));

//子频道播放页
router.get('/:channel/play/index.shtml', cpt.use('main/live/channelPlay'));

//直播专题页
router.get('/izt/:zt_name/index.html', homeModel.ztDirect);

//错误页面
router.get('/error', cpt.use('main/other/error'));
router.get('/other/ua', cpt.use('main/other/ua'));
router.get('/collection/ua', cpt.use('main/other/ua'));

router.get('/flush/nginx', cpt.use('main/other/flushNgxCache'));

//媒资消息队列接收端
router.post('/leproxy/pc/mms/consumer', koaBody, consumer.acceptMmsNotic);

// 媒资信息接口
router.get('/leproxy/pc/mms/get', consumer.getMmsInfo);

module.exports = router;
