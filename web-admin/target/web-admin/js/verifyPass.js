/*--------------------------密码校验开始-------------*/
var passwdConfig = null;
var passwdConfig = null;
//if (!passwdConfig) {
//	passwdConfig = getPasswordConfig();
//}
//
//function getPasswordConfig() {
//	var result = null;
//	$.ajax({
//		url : './../systemmanagement/getPasswordConfig',
//		type : 'POST',
//		dataType : 'json',
//		async : false,
//		contentType : "application/json; charset=utf-8",
//		success : function(data) {
//			var passwdConfig = data['resultObject'];
//			result = passwdConfig;
//		}
//	});
//	return result;
//}

function getPasswdTip() {
	var passwdTip = passwdConfig.length + '-50个字符，';
	switch (passwdConfig["strength"]) {
	case 1:
		passwdTip += "包括字母、数字";
		break;
	case 2:
		passwdTip += "包括字母、常用符号";
		break;
	case 3:
		passwdTip += "包括字母、数字、常用符号";
		break;
	}
	return passwdTip;
}

var passwdTipStr=getPasswdTip();

function verifyPassword(password) {
	var verifyPasswdResult = false;

	switch (passwdConfig["strength"]) {
	case 1:
		verifyPasswdResult = containAlpha(password) && containNumber(password);
		break;
	case 2:
		verifyPasswdResult = containAlpha(password)
				&& containCommonChar(password);
		break;
	case 3:
		verifyPasswdResult = containAlpha(password)
				&& containCommonChar(password) && containNumber(password);
		break;
	}

	verifyPasswdResult = (verifyPasswdResult && verifyLength(password,
			passwdConfig["length"], 50));

	if (verifyPasswdResult) {
		return verifyPasswdResult;
	} else {
		return getPasswdTip()
	}
}

/*--------------------------密码校验结束-------------*/