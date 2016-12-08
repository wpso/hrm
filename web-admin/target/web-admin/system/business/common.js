function ajaxException(reader, response, operation, eOpts ){
	if(operation.hasException()){
		getSessionUser();
	}
	if(response.status==404 || response.status==500){
		document.location.href="../../index.html";
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