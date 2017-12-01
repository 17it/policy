    /*--
        把时间长度转换成基于当前时间的时刻
        -as moment
        -p number time 时间长度，单位秒
        -p number time 时间长度，单位秒
        -eg
            var moment = require('air/util/moment');
            moment(1460332380, 1460332440); //1分钟前
    */
    var formatTime = require('./formatTime');
    module.exports = function (timeLast, timeNext) {
        if (!timeNext) {
            timeNext = Math.floor(+new Date()/1000);
        }
        if (timeLast === false || timeNext === false || timeLast > timeNext) {
            return "时间异常";
        }

        var iTime = parseInt((timeNext - timeLast) / 60);
        if (iTime < 60) {
            iTime = iTime == 0 ? 1 : iTime;
            return iTime+"分钟前";
        };

        var hTime = parseInt(iTime / 60);
        if (hTime < 24) {
            return hTime+'小时前';
        };

        var dTime = parseInt(hTime / 24);
        if (dTime < 30) {
            return dTime+'天前';
        }
        if (dTime < 365) {
            var mTime = parseInt(dTime / 30);
            return mTime+"月前";
        }
        return formatTime(timeLast, 'YYYY-mm-DD');
    };
