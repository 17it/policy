/*--
    获取播放记录
*/
var api = $require('data/api');
var clip = $require('air/string/clip');
//var time = $require('air/util/moment');
var time = $require('air/util/formatDuration');

exports.getHistoryList = function* (sso_tk, pagesize){
    if (!sso_tk) return false;
    var url = api.historyList+sso_tk+'&pagesize='+pagesize;
    var res = [];
    var result = yield request(url, 5, function (data) {
        if (data.code && data.code == 200) {
            var items = data['data']['items'];
            var platFrom = {
                '1' : 'pc',
                '2' : 'ph',
                '3' : 'pad',
                '4' : 'tv'
            };
            items.some(function (item) {
                item['title'] = clip(item['title'], 24, '..');
                item['plat_type'] = platFrom[item['from']];
                res.push(item);
            });
            return res;
        }
    });
};