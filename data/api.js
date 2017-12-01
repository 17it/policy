/*--
	api接口
*/

module.exports = {
	fragJsCss:'http://www.le.com/commonfrag/pc-js-css.inc', // js
	fragJsCssTest:'http://www.le.com/commonfrag/pc-js-css-test.inc', // js
	dayNewsPlay: 'http://top.le.com/json/dayNewsPlay.jsn', // 资讯热播榜
	dayFinancePlay: 'http://top.le.com/json/dayFinancePlay.jsn', // 财经热播榜
	dayEntPlay: 'http://top.le.com/json/dayEntPlay.jsn', // 娱乐热播榜
	collectMeta: 'http://seo-mts.letv.cn/getMetaTags?type=LANDING_PAGE', // 短视频聚合meta
	collectInfo: 'http://seo-contentservice.letv.cn/getvideolist?', // 短视频聚合信息
	getVideo: 'http://i.api.letv.com/mms/inner/video/get?', // 根据vid获取视频列表
    mmsApi: 'http://i.api.letv.com',//媒资接口
    cmsApi: 'http://static.api.letv.com',//cms接口
	detailApi: 'http://d.api.m.le.com/detail',
	detailMeta: 'http://seo-mts.letv.cn/getMetaTags?type=ALBUM_PAGE', // 详情页聚合meta
	topApi: 'http://top.le.com/json/', //排行榜
    payApi:'http://d.api.m.le.com/yuanxian/chargeinfo',//查询付费类型，用于会员角标判断
	scoreApi: 'http://v.stat.letv.com/vplay/queryMmsTotalPCount',//获取专辑、视频的评分数播放数评论数回复数
	doubanRatingByName: 'http://api.douban.com/v2/movie/search',//豆瓣评分
    doubanRatingByID: 'http://api.douban.com/v2/movie/subject/',//豆瓣评分
    doubanKey: '0a8e97f65ab39e461fabc7e3101adad2',
	episodeList: 'http://d.api.m.le.com/card/dynamic',//剧集列表接口'http://111.206.210.200/card/dynamic',
	//episodeList: 'http://111.206.210.200/card/dynamic',
	// yugaoApi: 'http://c.m.le.com/detail/'
	// detailInfoApi: 'http://10.11.144.215/detail',
	// detailStarApi: 'http://111.206.210.200/detail',

	cnProxy: 'http://127.0.0.1:8011', // 代理抓取大陆播放页html源代码

};
