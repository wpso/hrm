var path = '..';
var pageSize = 10;
var refreshPeriod=60;//second
var domainCode='SR';//"XR"/"GHXW"/"DP"/"ttcloud"
var vncURL = {
		"host":'192.168.4.10',
		"port":6080
}

var pagingBarPageNumWidth=45;
//加密算法
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                                  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                                  -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57,
                                  58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0,  1,  2,  3,  4,  5,  6,
                                  7,  8,  9,  10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
                                  25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
                                  37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1,
                                  -1, -1);

function encode(str){
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";

    while (i < len){
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len){
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break
            }
        
        c2 = str.charCodeAt(i++);
        if (i == len){
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break
            }

        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3F)
        }
    return out
    }

function decode(str){
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while (i < len){
        do{
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
            } while (i < len && c1 == -1);

        if (c1 == -1)
            break;

        do{
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
            } while (i < len && c2 == -1);

        if (c2 == -1)
            break;

        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

        do{
            c3 = str.charCodeAt(i++) & 0xff;

            if (c3 == 61)
                return out;

            c3 = base64DecodeChars[c3]
            } while (i < len && c3 == -1);

        if (c3 == -1)
            break;

        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

        do
            {
            c4 = str.charCodeAt(i++) & 0xff;

            if (c4 == 61)
                return out;

            c4 = base64DecodeChars[c4]
            } while (i < len && c4 == -1);

        if (c4 == -1)
            break;

        out += String.fromCharCode(((c3 & 0x03) << 6) | c4)
        }

    return out
    }

function containCommonChar(targetStr){
	var verifyRegEx=/.*[~!@#$%^&*]+.*/g;
	if(verifyRegEx.test(targetStr)){
		return true;
	}else{
		return false;
	}
}

function containNumber(targetStr){
	var verifyRegEx=/.*[0-9]+.*/g;
	if(verifyRegEx.test(targetStr)){
		return true;
	}else{
		return false;
	}
}

function containAlpha(targetStr){
	var verifyRegEx=/.*[a-zA-Z]+.*/g;
	if(verifyRegEx.test(targetStr)){
		return true;
	}else{
		return false;
	}
}

function verifyLength(targetStr,min_length,max_length){
	if(targetStr.length>=min_length&&targetStr.length<=max_length){
		return true;
	}
	return false
}

function getPricePeriodTypeDisplayValue(pricePeriodType){
	if(pricePeriodType==0){
		return "年" ;
	}else if(pricePeriodType==1){
		return "个月" ;
	}else if(pricePeriodType==2){
		return "周" ;
	}else if(pricePeriodType==3){
		return "天" ;
	}
	return "未定义" ;
}

//去掉所有空格，去掉前后空格直接用trim
function removeAllSpace(str) {  return str.replace(/\s+/g, "");}