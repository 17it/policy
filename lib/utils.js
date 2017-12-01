/**
 * Created by liangshan on 17/2/27.
 */

/**
 * 秒=>hh:mm:ss
 */
function formatSeconds(value) {
    if (!value) {
        return '';
    }
    if (!(typeof value).match(/(string|number)/g)) {
        return '';
    }

    let theSecond = parseInt(value);
    let theMinute = 0;
    let theHour = 0;

    if (theSecond > 60) {
        theMinute = parseInt(theSecond / 60);
        theSecond = parseInt(theSecond % 60);
        if (theMinute > 60) {
            theHour = parseInt(theMinute / 60);
            theMinute = parseInt(theMinute % 60);
        }
    }

    let result = '';
    if (parseInt(theHour) != 0 && parseInt(theHour) < 10) {
        theHour = '0' + theHour;
        result = theHour + ':';
    } else if (parseInt(theHour) == 0) {
        result = '';
    } else {
        result = theHour + ':';
    }

    if (parseInt(theMinute) != 0 && parseInt(theMinute) < 10) {
        theMinute = '0' + theMinute;
    }
    result += theMinute + ':';

    if (parseInt(theSecond) != 0 && parseInt(theSecond) < 10) {
        theSecond = '0' + theSecond;
    }
    result += theSecond;

    return result;
}

/**
 * 是否允许web端播放
 * @param platform 播放平台 web:420001
 * @returns {boolean}
 */
function isWebPlayPlatform(platform) {
    if (platform['420001']) {
        return true;
    } else {
        return false;
    }
}

/**
 * 字符串特殊字符转译
 * @param theString
 * @returns {*}
 */
function strSwitch(theString){
    if(theString){
        // theString = theString.replace(">", "&gt;");
        // theString = theString.replace("<", "&lt;");
        // theString = theString.replace(" ", "&nbsp;");
        theString = theString.replace(/\"/g, "&quot;");
        theString = theString.replace(/\'/g, "&#39;");
        theString = theString.replace(/\\/g, "\\\\");//对斜线的转义
        theString = theString.replace(/\n/g, "\\n");
        theString = theString.replace(/\r/g, "\\r");
        theString = theString.replace(/"/g, "&quot;");
        theString = theString.replace(/'/g, "&#39;");
        theString = theString.replace(/“/g, "&quot;");
        theString = theString.replace(/”/g, "&quot;");
        return theString;
    }else{
        return '';
    }
}

module.exports = {
    formatSeconds: formatSeconds,
    isWebPlayPlatform, isWebPlayPlatform,
    strSwitch: strSwitch
};
