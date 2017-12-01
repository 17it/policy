	/*--
         计算字符串长度，将unicode字符计算为2个单位，符号、文字、数字都占一位，然后返回对应的字符长度
         -p string str 源字符串
         -p int len    截取长度
         -eg
         var formatWord = require('air/string/byteLength');
         formatWord('我是中国人1234',11); //我是中国人1
	*/
	module.exports = function (str, len) {
	    'use strict';
        var str_cut = '';
        var str_length = 0;
        var str_len = str.length;
        for(var i = 0;i < str_len; i++){
            var a = str.charAt(i);
            str_length ++;
            if(escape(a).length > 4){
                //中文字符的长度经编码之后大于4
                str_length ++;
            }
            str_cut = str_cut.concat(a);
            if(str_length >= len){
                str_cut = str_cut.concat("...");
                return str_cut;
            }
        }
        
        //如果给定字符串小于指定长度，则返回源字符串；
        if(str_length < len){
            return  str;
        }
	};
