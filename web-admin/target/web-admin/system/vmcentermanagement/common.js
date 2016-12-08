/**commonFunction*/
var listPageSize = pageSize;//分页显示数据为16
function ajaxException(reader, response, operation, eOpts ){
	if(operation.hasException()){
//		Ext.MessageBox.show({
//			title : i18n._('errorNotice'),
//			msg : i18n._('responseError'),
//			buttons : Ext.MessageBox.OK,
//			icon : Ext.MessageBox.ERROR
//		});
		getSessionUser();
	}
//	alert('status:'+response.status);
	if(response.status==404 || response.status==500){
		//document.location.href="../../index.html";
	}
	if(!(response.responseText==undefined || response.responseText==null || response.responseText=='')){
		var obj = Ext.decode(response.responseText);
		if (obj==null || !obj.success) {
			Ext.MessageBox.show({
				title : i18n._('errorNotice'),
				msg : obj.resultMsg,
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.ERROR
			});											
		}
	}
};
function getSessionUser(){
	Ext.Ajax.request({
		url: '../../admin_mgmt/adminManagement!getSessionUser.action',
	    success: function(response){
	    	var obj = Ext.decode(response.responseText);
	    	if(obj.resultObject==null ||obj.resultObject==''){
	    		document.location.href="../../index.html";
	    	}
	    	if(obj.success && obj.resultObject.name!=null && obj.resultObject.name!='' ){
	    		return true;
	    	}else{
	    		document.location.href="../../index.html";
	    	}
	        
	    },
	    failure: function(response, opts) {
	    	document.location.href="../../index.html";
	    }
	});
};
function getCookie(name){
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if(arr != null) return unescape(arr[2]);
	 return null;
};
function   getQuery(name) 
{ 
        var reg=new RegExp("" +name+ "=([^&?]*)");        
        var keyVal=window.location.search.substr(1).match(reg);         
       //alert(keyVal[1]);        
        if   (keyVal!=null)   return   unescape(keyVal[1]);  
        return null;
};
function setParamCookie(field,value){
    document.cookie = field+"="+ value;
};
function reg_verifyIP(addr)// 验证ip地址的合法性 第三种方法
{
	var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/;
	if (addr.match(reg)) {
		return true;
	} else {
		return false;
	}
};
function reg_verifyInteger(addrs)// 验证是否输入的是数字
{
	var regs = /^[1-9]+$/;// /^[1-9]\d*|0$/	
	if (addrs.match(regs)) {
		return true;
	} else {
		return false;
	}
};
function getStringIP(iIP){
	var ip = "";  
    var temp = 0; 
	for (var i = 3; i >= 0; i--) {  
		temp = iIP/Math.pow(256, i) % 256; 
		temp=parseInt(temp);
		if (i == 3) {			
			ip = ip + temp;			
		} else {  
			ip = ip + "." + temp;			
		}  
	}   
	return ip;
};
function getSplitString(sIP,dot){    
    var ss=trim(sIP).split(dot);  //","
//    for (var i = 0; i < 4; i++) {  
//        ip10 += Math.pow(256, 3 - i) *parseInt(ss[i]);  
//    }  
    return ss;
};
//字符串去空格
function trim(s)
{
    var l=0; var r=s.length -1;
    while(l < s.length && s[l] == ' ')
    {   l++; }
    while(r > l && s[r] == ' ')
    {   r-=1;   }
    return s.substring(l, r+1);
};
/* 
 *  方法:Array.remove(dx) 
 *  功能:根据元素值删除数组元素. 
 *  参数:元素值 
 *  返回:在原数组上修改数组  
 */  
Array.prototype.indexOf = function (val) {  
    for (var i = 0; i < this.length; i++) {  
        if (this[i] == val) {  
            return i;  
        }  
    }  
    return -1;  
};  
Array.prototype.removevalue = function (val) {  
    var index = this.indexOf(val);  
    if (index > -1) {  
        this.splice(index, 1);  
    }  
};
var runner = new Ext.util.TaskRunner();
var task = runner.newTask({
    run: function () {
    	//全局页面刷新
    	if(globalForm.isVisible()){
    		globalViewStore.load();
    	}
    	//资源域概述刷新
    	if(zonePanel.isVisible()){
    		zoneViewStore.load();
    	}
    	//节点概述刷新
    	if(nodeViewPanel.isVisible()){
    		nodeViewStore.load();
    	}    	    	
    },
    interval: 1000*refreshPeriod
});
task.start();