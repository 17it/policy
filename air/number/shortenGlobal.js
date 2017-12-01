var shorten = require('./shorten');
var thousand = require('./thousand');
/*--
    给数字（整数、浮点数）进行多语言格式化
    按照k（千/千）；M（百万/百萬）；B（十亿/十億）来标识，显示规则如下：
    T：播放量≥一万亿，保留小数点后一位，采用四舍五入（如1.9T）
    B：一万亿＞播放量≥十亿，保留小数点后一位，采用四舍五入（如1.2B）
    M：十亿＞播放量≥一百万，保留小数点后一位，采用四舍五入（如444.3M）
    K：一百万＞播放量≥一万（10K），保留小数点后一位，采用四舍五入（如567.0K）
    万以下：播放量＜一万，直接显示播放数，显示千位符，如9,999
    -as shortenGlobal
    -p num num 源数字
    -r string 加上千位分隔符的数字字符串
    -eg
        var shortenGlobal = require('air/number/shortenGlobal');
        shortenGlobal(289887.89, 1, 'en_us'); //返回 289,9K
        shortenGlobal(-89887); //返回 -89,887
*/
module.exports = function (num, fix, langName) {
    var n = num>0 ? num : -num;
        fix==null && (fix = 1);
    //1万以内
    if (n<1E4) {
        return thousand(num);
    }
    if (langName === 'en_us') {
        //1百万以内
        if (n<1E6) {
            return (num/1E3).toFixed(fix)+'K';//10K=1万
        }
        //十亿以内
        if (n<1E9) {
            return (num/1E6).toFixed(fix)+'M';
        }
        //一万亿以内
        if (n<1E12) {
            return (num/1E10).toFixed(fix)+'B';
        }
        //一万亿以外
        if (n>=1E12) {
            return (num/1E12).toFixed(fix)+'T';
        }
    } else if (langName === 'zh_hk') {
        //1亿以内
        if (n<1E8) {
            return (num/1E4).toFixed(fix)+'萬';
        }
        return (num/1E8).toFixed(fix)+'億';
    } else {
        //1亿以内
        if (n<1E8) {
            return (num/1E4).toFixed(fix)+'万';
        }
        return (num/1E8).toFixed(fix)+'亿';
    }
};