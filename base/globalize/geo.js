/*--
    各地域配置信息
    CN 中国大陆
    HK 中国香港
    US 美国
    IN 印度
*/

// CN 中国大陆
exports.CN = {
    getCmsUrl: function (cmsId) {
        return 'http://static.api.letv.com/blockNew/get?id='+cmsId;
    },
    // 频道导航
    channelNav: 'http://static.api.letv.com/blockNew/get?id=5167',
    // 生态导航
    ecoNav: 'http://static.api.letv.com/blockNew/get?id=5558'
};

// HK 中国香港
if (global.env.GEO==='HK_0_0') {
    exports.HK = {
        getCmsUrl: function (cmsId) {
            return 'http://f.static.api.letv.com/blockNew/get?id='+cmsId;
        },
        // 频道导航
        channelNav: 'http://f.static.api.letv.com/blockNew/get?id=7273',
        // 生态导航
        ecoNav: 'http://f.static.api.letv.com/blockNew/get?id=5558'
    };
}
//美国暂时强制指向大陆，不要配置
// US 美国
// exports.US = {
// };
