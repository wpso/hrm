//**node
params = getCookie("lang");
i18n.set({
	  lang: params, 
	  path: '../../resources'
});
Ext.Loader.setConfig({enabled: true});
var modelModel=Ext.define('modelModel',{
	extend:'Ext.data.Model',
	fields:[
	   {name:'id' ,type:'string'},
	   {name:'methodName', type:'string'},	   
	   {name:'status', type:'string'},	   
	   {name:'laststartTime',mapping: 'laststartTime', type: 'date', dateFormat: 'time'},
	   {name:'operation', type:'string'},
	   {name:'beanName', type:'string'},
	   {name:'processCode', type:'string'}
	]
});
var modelStore=Ext.create('Ext.data.Store', {
	model: 'modelModel',
	pageSize:pageSize,
	sorters: [
	{
		property : 'id',
		direction: 'DESC'
	}],
	remoteSort:true,
	proxy: {
		type: 'ajax',
        url : path+'/../systemmanagement/processOperate!findAllProcess.action',
		reader: {
            type: 'json',
			root:'resultObject.result',
			totalProperty: 'resultObject.totalCount'
        },
        listeners:{
			exception:function(reader, response, error, eOpts){
				ajaxException(reader, response, error, eOpts );
			}
		}
    },
	autoLoad: true
});
//分页序号
Ext.grid.PageRowNumberer = Ext.extend(Ext.grid.RowNumberer, { 
	baseCls:Ext.baseCSSPrefix + 'column-header ' + Ext.baseCSSPrefix + 'unselectable',
	cls:Ext.baseCSSPrefix + 'row-numberer',
	tdCls:Ext.baseCSSPrefix+"grid-cell-special",
    renderer:function(value, cellmeta, record, rowIndex, columnIndex, store){   
        return (store.currentPage - 1) * store.pageSize + rowIndex + 1;  
    }       
});
var modelGrid=Ext.create('Ext.grid.Panel', {
    layout:'fit',            		
    store:modelStore,
	simpleSelect:true,
	selModel: Ext.create('Ext.selection.RowModel'),
    columns: [Ext.create('Ext.grid.PageRowNumberer',{flex : 0.1,width:50}),//Ext.create('Ext.grid.RowNumberer',{header:i18n._('row_Num'),dataIndex:'rowId',align:'left',flex:0.1}),	    
	    {
    		header: i18n._('ModuleName'), 
    		dataIndex: 'methodName',
    		flex:0.5,
    		renderer:function(value){
    			return i18n._(value);
    		}
    	},	//模块名	
        {
	    	header: i18n._('status'), 
	    	dataIndex: 'status',
	    	flex:0.5,
	    	renderer:function(value){
				if(value == '1') {
					return i18n._('Started');//已启动
				} else if(value == '0') {
					return i18n._('Stopped');//已停止
				} else {
					return i18n._('Started');//未知
				}
			}
	    },//
		{
        	header: i18n._('LastStartTime'), //上次启动时间
        	dataIndex: 'laststartTime',
        	flex:0.5,
        	renderer: Ext.util.Format.dateRenderer("Y-m-d H:i:s")
        },//
		{
			header: i18n._('Operating'), //操作
			dataIndex: 'operation',
			flex:0.5,
			renderer : renderOperationStatus
		}		
	],    
	bbar: Ext.create('Ext.toolbar.Paging', {
          store:modelStore,
          displayInfo: true,
          beforePageText:i18n._('beforePageText'),//"第"
          firstText: i18n._('firstText'),//"第一页"
          prevText: i18n._('prevText'),//"上一页"
          nextText: i18n._('nextText'),//"下一页"
          lastText: i18n._('lastText'),//"最后页"
          refreshText: i18n._('refreshText')//"刷新"
    }),           	
    viewConfig: {
    	stripeRows: true
    },            		
	dockedItems:[
	{
		xtype:'toolbar',
		dock: 'top',			
		items:[			
		{                				   
			text:i18n._('RefreshAll'),	//全部刷新						            
			icon: 'images/refresh.png',
			handler:function(){
				//遮罩层
				var v_mask = new Ext.LoadMask(Ext.getBody(), {
					msg: i18n._('please wait'),            							
					removeMask: true //完成后移除
				});
				v_mask.show();           						
				modelStore.load();
				v_mask.hide();				
			}            	   
		},
			{xtype:'tbfill'}            				
			]}]
});
//启动线程
function startProcess(processCode){
	getSessionUser();
	var progress=Ext.Ajax.request({
		url:path+'/../systemmanagement/processOperate!startProcess.action',
		method:'POST',
		params:{
			'processCode':processCode
		},
		success:function(form,action){
			var obj = Ext.decode(form.responseText);
				if(obj==null || obj.success==null){
					Ext.MessageBox.show({
			           title: i18n._('errorNotice'),
			           msg: i18n._('returnNull'),
		 	           buttons: Ext.MessageBox.OK,
			           icon: Ext.MessageBox.ERROR
					});//INFO,QUESTION,WARNING,ERROR
					return;
				}
				if(!obj.success){
					Ext.MessageBox.show({
			           title: i18n._('errorNotice'),
			           msg: obj.resultMsg,
			           buttons: Ext.MessageBox.OK,
			           icon: Ext.MessageBox.ERROR
					});
					return;
				}
				modelStore.load();
		},   
		failure:function(form,action){   
			Ext.MessageBox.show({
				title: i18n._('errorNotice'),
				msg: i18n._('operateFail'),
				buttons: Ext.MessageBox.OK,
				icon: Ext.MessageBox.ERROR
			});  
		}
	});
};
//停止线程
function stopProcess(processCode){
	getSessionUser();
	var progress=Ext.Ajax.request({
		url:path+'/../systemmanagement/processOperate!stopProcess.action',
		method:'POST',
		params:{
			'processCode':processCode
		},
		success:function(form,action){
			var obj = Ext.decode(form.responseText);
				if(obj==null || obj.success==null){
					Ext.MessageBox.show({
			           title: i18n._('errorNotice'),
			           msg: i18n._('returnNull'),
		 	           buttons: Ext.MessageBox.OK,
			           icon: Ext.MessageBox.ERROR
					});//INFO,QUESTION,WARNING,ERROR
					return;
				}
				if(!obj.success){
					Ext.MessageBox.show({
			           title: i18n._('errorNotice'),
			           msg: obj.resultMsg,
			           buttons: Ext.MessageBox.OK,
			           icon: Ext.MessageBox.ERROR
					});
					return;
				}
				modelStore.load();
		},   
		failure:function(form,action){   
			Ext.MessageBox.show({
				title: i18n._('errorNotice'),
				msg: i18n._('operateFail'),
				buttons: Ext.MessageBox.OK,
				icon: Ext.MessageBox.ERROR
			});  
		}
	});
};
//渲染操作状态
function renderOperationStatus(value, cellmeta, record, rowIndex, columnIndex, store) {
		var status = store.getAt(rowIndex).get('status');
		var processCode =store.getAt(rowIndex).get('processCode');
	 	if(status == 0){
	 		var str = '<a name="'+rowIndex+'" href ="javascript:void(0)" style="text-decoration: none" onclick=startProcess("'+processCode+'")>'+i18n._('start')+'</a>';
	 		return str;
	 	}else if(status == 1){
	 		var str = '<a name="'+rowIndex+'" href ="javascript:void(0)" style="text-decoration: none" onclick=stopProcess("'+processCode+'")>'+i18n._('stop')+'</a>';
	 		return str;
	 	}else{
	 		return i18n._(status);
	 	}		
};
function getCookie(name){
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if(arr != null) return unescape(arr[2]);
	 return null;
};
function reg_verifyIP(addr)//验证ip地址的合法性 第三种方法
{
  var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/;
  if(addr.match(reg))
  {
     return true;
  }
  else 
  {
    return false;
  }
};
function reg_verifyInteger(addrs)//验证是否输入的是数字
{
  var regs = /^[1-9]+$/;///^[1-9]\d*|0$/              
  if(addrs.match(regs))
  {
     return true;
  }
  else 
  {
    return false;
  }
};