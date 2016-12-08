/******************************vmCenterTree******************************************/
params = getCookie("lang");
i18n.set({
	lang : params,
	path : '../../resources'
});
Ext.Loader.setConfig({
	enabled : true
});
//var vmTreeStore = Ext.create('Ext.data.TreeStore', {
//	//autoLoad : false,//true
//	proxy: {
//		type: 'ajax',
//		url: path+'/../monitoring/oss!getNodeAndVmTree.action'	//equipment/            
//	}
//  });
var vmTreeStore = Ext.create('Ext.data.TreeStore', {
	autoLoad : false,//true
	proxy: {
		type: 'ajax',
		url: path+'/../sc/zone!getZoneTree.action'	//equipment/            
	},
	listeners:{		
		beforeexpand:function(node, eOpts ){
			//alert('###'+node.raw.text);
			//alert('isLeaf:'+node.isLeaf());
			//alert('isLast:'+node.isLast());
			//alert('isExpandable:'+node.isExpandable());
			if(node.isRoot()){
				vmTreeStore.setProxy({
					type: 'ajax',
					url: path+'/../sc/zone!getZoneTree.action'            
				});
				//this.proxy.extraParams.root = node.raw.text;
				this.proxy.setExtraParam('node','root') ;
			}else if(node.isLeaf()==false){
				vmTreeStore.setProxy({
					type: 'ajax',
					url: path+'/../sc/node!getNodeTree.action'	//equipment/            
				});
				//this.proxy.extraParams.root = node.raw.text;
				this.proxy.setExtraParam('zoneCode',node.raw.qtip) ;
			}/*else{
				vmTreeStore.setProxy({
					type: 'ajax',
					url: path+'/../monitoring/oss!getNodeAndVmTree.action?hostName='+node.raw.text	//equipment/            
				});
				//this.proxy.extraParams.root = node.raw.text;
				this.proxy.setExtraParam('node',node.raw.text) ;
			}*/			
		}
	}
  });
var virsualManegementTree=Ext.create('Ext.tree.Panel',{	
	border:false,
	useArrows:true,
	autoScroll:true,
	store: vmTreeStore,
	rootVisible: true,
	root: {
		text: i18n._('Overall'),
		icon:'images/overAll.png',
        expanded: true        
     },
	listeners:{
			  itemclick:function(view,record,item,index, e, eOpts ){						
				   if(record.isRoot()){
					   document.getElementsByTagName('iframe')[0].src='hc_admin_globalPage.html';//vmcentermanagement/
					   //setParamCookie("vmID","");
					   setParamCookie("nodeName","");
					   setParamCookie("zoneCode","");
				   }else if(record.isLeaf()){
					   document.getElementsByTagName('iframe')[0].src='hc_admin_nodePage.html?nodeName='+record.get('qtip')+'';//vmcentermanagement/
					   setParamCookie("nodeName",record.get('qtip'));
					   setParamCookie("zoneCode","");
					   //document.getElementsByTagName('iframe')[0].src='hc_admin_vmPage.html?vmID='+record.get('qtip')+'';//vmcentermanagement/
					   //setParamCookie("vmID",record.get('qtip'));
				   }else{						   
					   document.getElementsByTagName('iframe')[0].src='hc_admin_zonePage.html?zoneCode='+record.get('qtip')+'';//vmcentermanagement/
					   setParamCookie("zoneCode",record.get('qtip'));
					   setParamCookie("nodeName","");
				   } 					   
				},
				beforeitemexpand:function(view, eOpts){
					//alert('**'+view.getChildAt(0));
				}
		   }
	
});	
var aitem1 = Ext.create('Ext.Panel',{
	 id:"aitem1",
	 title:"<center ><span id='m1' style='width:100%;color:#04468C;font-size:12;font-weight:bold'>"+i18n._('vmmanagement')+"</span></center>",
	 //autoScroll:true,
	 hideCollapseTool:true,
	 layout:'fit',
	 items:virsualManegementTree
 });
function getCookie(name) {
	var arr = document.cookie
			.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
	if (arr != null)
		return unescape(arr[2]);
	return null;
};