// isStrictPC
// 严格判断UA是不是pc的ua
// 也不知道是谁脑子抽风搞出这么一大坨特征符，个人觉得真没必要判断这么细，主要的判断做了就ok了

var regStrictMobile = /phone|android|mobile|qqbrowser|ucweb|spider|samsung|symbianos|nokia|ipod|playstation|sinaweibobot|facebook|twitterbot|silk|kindle|midp|wap|up\.browser|obigo|au\.browser|wxd\.mms|wxdb\.browser| cldc|up\.link|km\.browser|semc-browser|mini|symbian|palm|panasonic|mot| sonyericsson|nec|alcatel|ericsson|benq|benq|amoisonic|amoi|capitel| philips|lenovo|mitsu|motorola|sharp|wapper|lg|eg900| cect|compal|kejian|bird|bird|g900\/v1\.0|arima|ctl|tdg|daxian|daxian| dbtel|eastcom|eastcom|pantech|dopod|haier|haier|konka|kejian|lenovo| soutec|soutec|sagem|sec|sed|emol|inno55|zte|windows\sce|opera\smini/;

module.exports = function (uaSrc) {
	return !regStrictMobile.test(uaSrc);
};
