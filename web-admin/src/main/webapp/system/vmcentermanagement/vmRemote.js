//***vmRemote
var params = getCookie("lang");
i18n.set({
  lang: params, 
  path: '../../resources'
});
var vmID=getCookie("vmID");
if(getQuery("vmID")!=null){
	vmID=getQuery("vmID");
}
var src =null;
var srcField = Ext.create('Ext.form.field.Text', {
	name : 'srcField'	
});
//var obj=null;
Ext.Loader.setConfig({enabled: true});

//var remoteRequest=Ext.Ajax.request({
//	url:path+'/../ops/getVncUrl!getVncUrl.action',
//	method:'POST',
//	params:'id='+vmID,
//	success:function(form,action){
//			var obj = Ext.decode(form.responseText);
//			
//			if(obj==null || obj.success==null || obj.resultObject==null){
//				Ext.MessageBox.show({
//		           title: i18n._('errorNotice'),
//		           msg: i18n._('returnNull'),
//		           buttons: Ext.MessageBox.OK,
//		           icon: Ext.MessageBox.ERROR
//				});//INFO,QUESTION,WARNING,ERROR
//				return;
//			}
//			if(!obj.success){
//				Ext.MessageBox.show({
//		           title: i18n._('errorNotice'),
//		           msg: obj.resultMsg,
//		           buttons: Ext.MessageBox.OK,
//		           icon: Ext.MessageBox.WARNING
//				});
//				return;
//			}
//			
//			//consoleWin.show();
//	},
//	failure:function(form,action){   
//		Ext.MessageBox.show({
//	           title: i18n._('errorNotice'),
//	           msg: i18n._('returnError'),
//	          buttons: Ext.MessageBox.OK,
//	           icon: Ext.MessageBox.ERROR
//			});    
//	}
// });
var remoteWin = new Ext.Window({
    title: i18n._('remote'),
    width: 690,
    height:480,
    plain:true,
    bodyStyle:'padding:0px;',
    buttonAlign:'center'//,
    //html:'<iframe width=680 height=480 frameborder=0 scrolling=auto src='+obj.resultObject+'></iframe>'    
   });
var vmRemotePanel = new Ext.create('Ext.panel.Panel',{	
	resizable:false,	
	constrain : true,
	autoScroll:true,
	modal : true,
	html :'<iframe width=1000 height=680 frameborder=0 scrolling=auto src="novnc/vnc_auto.html?vmid='+vmID+'"></iframe>'
});
function getVNC(){	
	Ext.Ajax.request({
		url:path+'/../ops/ops!getVNC.action',
		method:'POST',
		params:'id='+vmID,
		success:function(form,action){
				var obj = Ext.decode(form.responseText);				
				if(obj==null || obj.success==null || obj.resultObject==null){
					Ext.MessageBox.show({
			           title: i18n._('errorNotice'),
			           msg: i18n._('returnNull'),
			           buttons: Ext.MessageBox.OK,
			           icon: Ext.MessageBox.ERROR
					});//INFO,QUESTION,WARNING,ERROR
					return ;
				}
				if(!obj.success){
					Ext.MessageBox.show({
			           title: i18n._('errorNotice'),
			           msg: obj.resultMsg,
			           buttons: Ext.MessageBox.OK,
			           icon: Ext.MessageBox.WARNING
					});
					return ;
				}    					
				if(obj.success && obj.resultObject!=null){
					vmRemotePanel.updateBox({	
						//renderTo : Ext.getBody(),	
						resizable:false,	
						constrain : true,  
						modal : true,
						html:'<iframe width=1000 height=550 frameborder=0 scrolling=auto src='+obj.resultObject+'></iframe>'
					});
					//vmRemotePanel.html='<iframe width=1000 height=550 frameborder=0 scrolling=auto src='+obj.resultObject+'></iframe>';
					//vmRemotePanel.render();
					return obj.resultObject;					
					//vmRemotePanel.update('<iframe width=1000 height=550 frameborder=0 scrolling=auto src='+obj.resultObject+'></iframe>');
				}
				//vmRemotePanel.render();
				/*var consolePanel = new Ext.Window({    					
				     title: i18n._('remote'),
				     width: 690,
				     height:480,
				     plain:true,
				     bodyStyle:'padding:0px;',
				     buttonAlign:'center',
				     html:'<iframe width=680 height=480 frameborder=0 scrolling=auto src='+obj.resultObject+'></iframe>'
				    });
				consolePanel.show();*/
				//if(obj.success && obj.resultObject!=null){
				//	remoteWin.show();
				//}
				//remoteWin.show();
		},
		failure:function(form,action){   
			Ext.MessageBox.show({
	           title: i18n._('errorNotice'),
	           msg: i18n._('returnError'),
	          buttons: Ext.MessageBox.OK,
	           icon: Ext.MessageBox.ERROR
			}); 
			return ;
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