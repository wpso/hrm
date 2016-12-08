/*
 * noVNC: HTML5 VNC client
 * Copyright (C) 2011 Joel Martin
 * Licensed under LGPL-3 (see LICENSE.txt)
 *
 * See README.md for usage and integration instructions.
 */

/*jslint evil: true */
/*global window, document, INCLUDE_URI */

/*
 * Load supporting scripts
 */
//$("document").ready(load_remoteVNC);

$(document).ready(function() {
	$("#vnc_logo").attr("src","../../../images/logo/"+domainCode+"/logo.png");
});
function get_INCLUDE_URI() {
    return (typeof INCLUDE_URI !== "undefined") ? INCLUDE_URI : "include/";
}
//刷新VNC
function refreshVNC(){
	var vmid = window.name;
	var url = location.href;
	var url_=url.split("=")[0];
	var key =WebUtil.getQueryVar('key');
	$.ajax({
		async:false,
		type : "post",
		url : "../../../ops/ops!getVNC.action",
		data:"id="+vmid,
		dataType : 'json',
		success : function(json) {
			if(json.resultObject!=null){
				var url=json.resultObject;
				var token = url.split("=")[1];
				url= url_+"="+token+"&key="+key;
				self.location.href = url;
				//alert(location.href);
				window.location.load();
			}
		},
		error : function() {
			alert("error");
		},
	});
}
//重启VNC
function rebootVNC(){
	if(confirm("是否需要重启当前计算机?")){
		var vmid = window.name;
		$.ajax({
			async:false,
			type : "post",
			url : "../../../ops/ops!rebootVM.action",
			data:"id="+vmid,
			dataType : 'json',
			success : function(json) {
				if(json.success){
					alert("虚拟机重启成功!");
				}else{
					alert(json.resultMsg);
				}
			},
			error : function() {
				alert("error");
			},
		});
	}
}
function load_remoteVNC(){
	/*
	$("#remote_vnc")[0].src = location.href;
	*/
	var token=WebUtil.getQueryVar('token');
	var key = decode(WebUtil.getQueryVar('key'));
	var url = "http://"+key+":6080/vnc_auto.html?token=";
	$("#remote_vnc")[0].src = url+token;
	$("#remote_vnc")[0].location.reload();
}
function maximize(){
	var vmid = window.name;
	var width = screen.width;
	var height = screen.height;
	window.open('vnc_auto.html?vmid='+vmid+"&type=1",vmid,
			'fullscreen=yes,width='
					+ width
					+ ',height='
					+ height
					+ ',top=0,left=0,toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=no,status=no');
	
}
function closeVNCWin(){
	if(confirm("是否要关闭当前窗口")){
		window.close();
	} 
}
function overImg(obj){
	var imgSrc=obj.src;
	imgSrc = imgSrc.replace(".png","_over.png");
	obj.src = imgSrc;
		}
function outImg(obj){
	var imgSrc=obj.src;
	imgSrc = imgSrc.replace("_over.png",".png");
	obj.src = imgSrc;
	}
function setParamCookie(field,value){
    document.cookie = field+"="+ value;
};
function getCookie(name){
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if(arr != null) return unescape(arr[2]);
	 return null;
};
(function () {
    "use strict";

    var extra = "", start, end;

    start = "<script src='" + get_INCLUDE_URI();
    end = "'><\/script>";

    // Uncomment to activate firebug lite
    //extra += "<script src='http://getfirebug.com/releases/lite/1.2/" + 
    //         "firebug-lite-compressed.js'><\/script>";

    extra += start + "util.js" + end;
    extra += start + "webutil.js" + end;
    extra += start + "logo.js" + end;
    extra += start + "base64.js" + end;
    extra += start + "websock.js" + end;
    extra += start + "des.js" + end;
    extra += start + "input.js" + end;
    extra += start + "display.js" + end;
    extra += start + "rfb.js" + end;

    document.write(extra);
}());

