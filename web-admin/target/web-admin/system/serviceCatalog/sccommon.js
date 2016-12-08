function checkResourceNameRepeat(name,type,oldName){
	var checkResult=false;
	if(oldName){
		if(oldName==name){
			return true;
		}
	}
	$.ajax({
		url:path+'/../sc/serviceItem!checkServiceItemRepeat.action',
		async:false,
		data:{
			name:name,
			serviceType:type
		},
		dataType:'json',
		type:'POST',
		success:function(checkResultTemp){
			if(checkResultTemp.success){
				if(checkResultTemp.resultObject){
					checkResult=true;
				}
			}else{
				Ext.Msg.alert('Tip',"check resource name exists failure.");
			}
		},
		failure:function(){
			Ext.Msg.alert('Tip',"check resource name exists failure.");
		}
	});
	
	return checkResult;
}