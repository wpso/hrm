/**
 * vmRecycleList
 */
var params = getCookie("lang");
i18n.set({
	lang : params,
	path : '../../resources'
});
Ext.Loader.setConfig({
	enabled : true
});
var v_mask = null;
var confirmRezizeArray=new Array();
//VM详细
//虚拟机机器号
var vmUUIDDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,//200
	labelWidth : 150,//80
	fieldLabel : i18n._('machineNum')//机器号
});
//虚拟机名称
var vmNameDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,//200
	labelWidth : 150,//80
	fieldLabel : i18n._('vm_name')//主机名称
});
//CPU信息
var vmCPUDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,//200
	labelWidth : 150,//80
	fieldLabel : i18n._('CPU')
});
//Memory信息
var vmMEMDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,//200
	labelWidth : 150,//80
	fieldLabel : i18n._('MEM')
});
//Disk信息
var vmDiskDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,//200
	labelWidth : 150,//80
	fieldLabel : i18n._('DISK')
});
//扩展盘信息
var vmExtDiskDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,//200
	labelWidth : 150,//80
	fieldLabel : i18n._('extDisk')
});
//Network信息
var vmNeworkDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,//200
	labelWidth : 150,//80
	fieldLabel : i18n._('Network')
});
//IP信息
var vmIPDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,//200
	labelWidth : 150,//80
	fieldLabel : i18n._('IP')
});
//OS信息
var vmOSDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,//200
	labelWidth : 150,//80
	fieldLabel : i18n._('OS')
});
//zone信息
var vmZoneDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,//200
	labelWidth : 150,//80
	fieldLabel : i18n._('zoneName')
});
//套餐名称
var taocanNameDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,//200
	labelWidth : 150,//80
	fieldLabel : i18n._('ServiceCatalog_name')//套餐名
});
//套餐生效时间
var taocanDateDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,//200
	labelWidth : 150,//80
	fieldLabel : i18n._('ServiceCatalog_createDate')//套餐生效日期
});
//套餐已使用天数
var taocanUsedDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,//200
	labelWidth : 150,//80
	fieldLabel : i18n._('used')//已使用
});
//套餐剩余时间
var taocanRemainDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,//200
	labelWidth : 150,//80
	fieldLabel : i18n._('free')//剩余
});
//订单编号
var orderNumDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,//200
	labelWidth : 150,//80
	fieldLabel : i18n._('order_id')//订单编号
});
//订单时间
var orderDateDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,//200
	labelWidth : 150,//80
	fieldLabel : i18n._('OrderCreateDate')//订单时间
});
//计费方式
var billingModelDetailField = Ext.create('Ext.form.field.Display', {//
	hidden:false,
	width : 300,//200
	labelWidth : 150,//80
	fieldLabel : i18n._('ChargingMode')//计费方式
});
//价格
var priceDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,//200
	labelWidth : 150,//80
	fieldLabel : i18n._('Price')//价格
});
//所有者
var ownerDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,//200
	labelWidth : 150,//80
	fieldLabel : i18n._('Owner')//价格
});
//虚拟机详细信息Form
var detailVMForm = Ext.create('Ext.form.Panel', {
	frame : true,
	autoScroll:true,
	// title: 'Form Fields',
	// width: 250,
	bodyPadding : 5,
	fieldDefaults : {
		labelAlign : 'left',
		labelWidth : 60,
		anchor : '100%'
	},
	items : [ vmUUIDDetailField,vmNameDetailField, vmCPUDetailField, vmMEMDetailField,
			vmDiskDetailField, vmExtDiskDetailField,vmNeworkDetailField, vmIPDetailField,
			vmOSDetailField, vmZoneDetailField,taocanNameDetailField, taocanDateDetailField,
			taocanUsedDetailField, taocanRemainDetailField,
			orderNumDetailField, orderDateDetailField, billingModelDetailField,
			priceDetailField,ownerDetailField ]//
});
//所有弹出窗
var detailVMWin = Ext.create('Ext.window.Window', {
	// title:i18n._('创建虚拟机'), // 创建虚拟机
	width : 650,// 400
	height : 400,
	//autoDestroy : true,
	closable : false,
	constrain : true,
	modal : true,
	tools : [ {
		type : 'close',
		handler : function() {
			detailVMWin.getComponent(0).getForm().reset();
			detailVMWin.remove(detailVMWin.getComponent(0),false);
			detailVMWin.hide();
		}
	} ],
	layout : 'fit',
	defaults : {
		split : false
	},
	items : []
});
//虚拟机详情模板
var vmDetailModel = Ext.define('vmDetailModel', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'vmId',
		mapping : 'vmId',
		type : 'string'
	}, {
		name : 'vmName',
		mapping : 'vmName',
		type : 'string'
	}, {
		name : 'cpuType',
		mapping : 'cpuType',
		type : 'string'
	}, {
		name : 'cpuCore',
		mapping : 'cpuCore',
		type : 'int'
	}, {
		name : 'memory',
		mapping : 'memory',
		type : 'int'
	}, {
		name : 'disk',
		mapping : 'disk',
		type : 'int'
	}, {
		name : 'network',
		mapping : 'network',
		type : 'string'
	}, {
		name : 'ipInner',
		mapping : 'ipInner',
		type : 'string'
	}, {
		name : 'ipOuter',
		mapping : 'ipOuter',
		type : 'string'
	}, {
		name : 'vmOS',
		mapping : 'vmOS',
		type : 'string'
	}, {
		name : 'catalogName',
		mapping : 'catalogName',
		type : 'string'
	}, {
		name : 'catalogDate',
		mapping : 'catalogDate',
		type : 'date',
		dateFormat : 'time'
	}, {
		name : 'catalogUsed',
		mapping : 'catalogUsed',
		type : 'string'
	}, {
		name : 'catalogRemain',
		mapping : 'catalogRemain',
		type : 'string'
	}, {
		name : 'orderNumber',
		mapping : 'orderNumber',
		type : 'string'
	}, {
		name : 'orderDate',
		mapping : 'orderDate',
		type : 'date',
		dateFormat : 'time'
	}, {
		name : 'billingModel',
		mapping : 'billingModel',
		type : 'string'
	}, {
		name : 'price',
		mapping : 'price',
		type : 'string'
	}, {
		name : 'priceUnit',
		mapping : 'priceUnit',
		type : 'string'
	}, {
		name : 'userName',
		mapping : 'userName',
		type : 'string'
	},{
		name : 'extdisks',
		mapping : 'extdisks'
	},{
		name : 'zoneCode',
		mapping : 'zoneCode'
	},{
		name : 'zoneName',
		mapping : 'zoneName'
	} ]
});
var vmDetailStore = Ext.create('Ext.data.Store',{
	model : 'vmDetailModel',
	proxy : {
		type : 'ajax',
		url : path+ '/../monitoring/monitor!getVmDetailInfo.action',
		reader : {
			type : 'json',
			root : 'resultObject.result',
			totalProperty : 'resultObject.totalCount'
		},
		listeners:{
			exception:function(reader, response, error, eOpts){
				ajaxException(reader, response, error, eOpts );
			}
		}
	},
	autoLoad : false,//true
	listeners : {
		load : function(vmDetailStore, records, successful, eOpts ) {			
			if (successful && vmDetailStore.getCount() > 0) {
				var taocanDate=Ext.Date.format(vmDetailStore.getAt(0).get('catalogDate'), 'Y-m-d');
				var orderDate=Ext.Date.format(vmDetailStore.getAt(0).get('orderDate'), 'Y-m-d H:i:s');
				var billingModel=vmDetailStore.getAt(0).get('billingModel');
				var catalogName = vmDetailStore.getAt(0).get('catalogName');
				if(billingModel==3 && catalogName != null && catalogName !=''){
					billingModel=i18n._('One time pay');
				}else if(billingModel==2 && catalogName != null && catalogName !=''){
					billingModel=i18n._('ByHour');
				}else if(billingModel==1 && catalogName != null && catalogName !=''){
					billingModel=i18n._('ByMonth');
				}else if(billingModel!="" && billingModel==0 && catalogName != null && catalogName !=''){
					billingModel=i18n._('ByYear');
				}
				var catalogRemain=vmDetailStore.getAt(0).get('catalogRemain');
				if(catalogRemain>0){
					catalogRemain=getUseFreeLong(vmDetailStore.getAt(0).get('catalogRemain'));
				}else if(billingModel !=''){
					catalogRemain=i18n._('maturity');
				}else{
					catalogRemain='';
				}				
				var taocanUsed=getUseFreeLong(vmDetailStore.getAt(0).get('catalogUsed'));
				var price=vmDetailStore.getAt(0).get('price');
				var cpuDetail = '';
				//alert(orderDate);
				vmUUIDDetailField.setValue(vmDetailStore.getAt(0).get('vmId'));
				vmNameDetailField.setValue(vmDetailStore.getAt(0).get('vmName'));
				if(vmDetailStore.getAt(0).get('cpuType')==null || vmDetailStore.getAt(0).get('cpuType')==''){
					cpuDetail = vmDetailStore.getAt(0).get('cpuCore')+i18n._('core');
				}else{
					cpuDetail = vmDetailStore.getAt(0).get('cpuType')+'×'+vmDetailStore.getAt(0).get('cpuCore')+i18n._('core');
				}
				vmCPUDetailField.setValue(cpuDetail);
				vmMEMDetailField.setValue(vmDetailStore.getAt(0).get('memory')+ 'M');
				vmDiskDetailField.setValue(vmDetailStore.getAt(0).get('disk')+ 'G');
				var extDisk = vmDetailStore.getAt(0).get('extdisks');
				var extDiskCapacity='';
				if(extDisk != null){
					for(var i=0;i<extDisk.length;i++){
						extDiskCapacity=extDiskCapacity+extDisk[i].ed_capacity+'G;';
					}
				}				
				vmExtDiskDetailField.setValue(extDiskCapacity);
				if(vmDetailStore.getAt(0).get('network')!=null && vmDetailStore.getAt(0).get('network')!=''&& vmDetailStore.getAt(0).get('network')!=0){
					vmNeworkDetailField.setValue(vmDetailStore.getAt(0).get('network')+'M');
				}
				if(vmDetailStore.getAt(0).get('ipInner')!='' && vmDetailStore.getAt(0).get('ipOuter')!=''){
					var ipOuterVal = vmDetailStore.getAt(0).get('ipOuter');
					if (ipOuterVal.split(",").length > 13) {
						var ipVal_ = "";
						for ( var i = 0; i < 6; i++) {
							ipVal_ += ipOuterVal.split(",")[i] + ",";
						}					
						// 换一行存放7-13的IP
						ipVal_ += "<br/>";
						for ( var i = 6; i < 13; i++) {
							ipVal_ += ipOuterVal.split(",")[i] + ",";
						}					
						ipVal_ += "<br/>";
						// 换一行存放第13个以后的IP
						for ( var i = 13; i < ipOuterVal.split(",").length; i++) {
							ipVal_ += ipOuterVal.split(",")[i] + ",";
						}
						ipVal_ = ipVal_.substr(0,ipVal_.length-1);
						vmIPDetailField.setValue(vmDetailStore.getAt(0).get('ipInner')+ '/'+ ipVal_);
					}
					else if (ipOuterVal.split(",").length > 6) {
						var ipVal_ = "";
						for ( var i = 0; i < 6; i++) {
							ipVal_ += ipOuterVal.split(",")[i] + ",";
						}					
						ipVal_ += "<br/>";
						// 换一行存放第6个以后的IP
						for ( var i = 6; i < ipOuterVal.split(",").length; i++) {
							ipVal_ += ipOuterVal.split(",")[i] + ",";
						}
						ipVal_ = ipVal_.substr(0,ipVal_.length-1);
						vmIPDetailField.setValue(vmDetailStore.getAt(0).get('ipInner')+ '/'+ ipVal_);
					}
					else {
						vmIPDetailField.setValue(vmDetailStore.getAt(0).get('ipInner')+ '/'+ ipOuterVal);
					}
				}else{
					vmIPDetailField.setValue(vmDetailStore.getAt(0).get('ipInner')+ vmDetailStore.getAt(0).get('ipOuter'));
				}							
				vmOSDetailField.setValue(vmDetailStore.getAt(0).get('vmOS'));
				vmZoneDetailField.setValue(vmDetailStore.getAt(0).get('zoneName'));
				taocanNameDetailField.setValue(catalogName);																		
				taocanDateDetailField.setValue(taocanDate);																		
				taocanUsedDetailField.setValue(taocanUsed);
				taocanRemainDetailField.setValue(catalogRemain);
				orderNumDetailField.setValue(vmDetailStore.getAt(0).get('orderNumber'));
				orderDateDetailField.setValue(orderDate);
				billingModelDetailField.setValue(billingModel);
				if(price==null || price==''){
					priceDetailField.setValue('');
				}else{
					priceDetailField.setValue(price+i18n._('cny'));//+ '/'+ vmDetailStore.getAt(0).get('priceUnit')
				}		
				detailVMWin.setTitle(i18n._('Details'));//详情
				detailVMWin.add(detailVMForm);
				detailVMWin.show();
			}else{
				detailVMWin.hide();
			}
		}
	}
});
//define model
//虚拟机列表模板
var vmModel = Ext.define('vmModel', {
	extend : 'Ext.data.Model',
	fields : [ 'vmId', 'vmName', 'hostName', 'ipInner', 'ipOuter', 'cpuCore','memory', 'disk', 
	           'vmStatus','hostAliases','isEnable','userName','zoneCode',
	           {name:'createTime',type: 'date', dateFormat: 'time'},
	           {name:'expireTime',type: 'date', dateFormat: 'time'}
	],//
	idProperty : 'vmId'
});

//create the Data Store
var vmStore= Ext.create('Ext.data.Store', {
	model: 'vmModel',
	remoteSort: true,
	autoLoad:false,
	pageSize:pageSize,
	proxy: new Ext.data.proxy.Ajax({
		url: path+'/../ops/ops!listVMForRecycle.action',
		reader: {
			type: 'json',
			root: 'resultObject.result',
			totalProperty: 'resultObject.totalCount'
		},
		listeners:{
			exception:function(reader, response, error, eOpts){
				v_mask.hide();
				ajaxException(reader, response, error, eOpts );
			}
		}
	}),
	listeners : {
		beforeload : function(store,operation, eOpts ){							
			//遮罩层
			v_mask = new Ext.LoadMask(Ext.getBody(), {
				msg : i18n._('please wait')
				//removeMask : true			
			});
			v_mask.show();
		},
		load : function(store, records, successful, eOpts ){
			v_mask.hide();
		}
	},
	sorters: ["id"]
});              
var vmGrid = Ext.create('Ext.grid.Panel', {
	store: vmStore,
	stateful: true,
	bbar: Ext.create('Ext.toolbar.Paging', {
		store: vmStore,
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
	stateId: 'stateGrid',
	dockedItems: [
	{
		xtype: 'toolbar',
		cls: 'toolbarCSS',
		items: [                                    
		        {
		        	xtype:'button',
		        	text: '<font id="repairId" color="#ffffff" >' + i18n._('Repair') + '</font>',                                       
		        	icon: 'images/add.png',
		        	listeners: {
		        		"click" : function(){
		        			getSessionUser();
		        			var row = vmGrid.getSelectionModel().getSelection();                                            	
                            if (row.length == 0) {  
                                Ext.MessageBox.show({                                                         
                                      title:i18n._('notice'),
                                      msg:i18n._('selectOne'),
                                      icon:Ext.MessageBox.WARNING,
                                      buttons: Ext.MessageBox.OK                                                          
                                  });  
                                return;
							}
                            var vmid = row[0].get('vmId');
                            var start = Ext.Ajax.request({
								url : path+ '/../ops/ops!recycleRestore.action',
								method : 'POST',
								params : 'id='+ vmid,
								success : function(form,action) {
									var obj = Ext.decode(form.responseText);
									if (!obj.success) {
										Ext.MessageBox.show({
											title : i18n._('errorNotice'),
											msg : obj.resultMsg,
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.WARNING
										});
										return;
									}
									if (obj.resultCode=='00000') {
										Ext.MessageBox.show({
											title : i18n._('notice'),
											msg : i18n._('operationMessage'),
											icon : Ext.MessageBox.INFO,
											buttons : Ext.MessageBox.OK,
											fn: reLoadData
										});									
									}
								},
								failure : function(form,action) {
									Ext.MessageBox.show({
										title : i18n._('errorNotice'),
										msg : i18n._('operateFail'),
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.WARNING
									});
								}
							});
		        		},
		        		"mouseout" : function() {
		        			document.getElementById("repairId").style.color = "#ffffff";
		        		},
		        		"mouseover" : function() {
		        			document.getElementById("repairId").style.color = "#000000";
		        		}                                                
		        	}                                             
		        }, 
                {
		        	xtype:'button',
                    text: '<font id="terminateId" color="#ffffff" >' + i18n._('Terminate') + '</font>',                                       
                    icon: 'images/modify.png',
                    listeners: {
                        "click" : function(){
                        	getSessionUser();
                        	var row = vmGrid.getSelectionModel().getSelection();                                            	
                            if (row.length == 0) {  
                                Ext.MessageBox.show({                                                         
                                      title:i18n._('notice'),
                                      msg:i18n._('selectOne'),
                                      icon:Ext.MessageBox.WARNING,
                                      buttons: Ext.MessageBox.OK                                                          
                                  });  
                                return;
							}
                            var vmid = row[0].get('vmId');
                            var start = Ext.Ajax.request({
								url : path+ '/../ops/ops!recycleTerminate.action',
								method : 'POST',
								params : 'id='+ vmid,
								success : function(form,action) {
									var obj = Ext.decode(form.responseText);
									if (!obj.success) {
										Ext.MessageBox.show({
											title : i18n._('errorNotice'),
											msg : obj.resultMsg,
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.WARNING
										});
										return;
									}
									if (obj.resultCode=='00000') {
										Ext.MessageBox.show({
											title : i18n._('notice'),
											msg : i18n._('operationMessage'),
											icon : Ext.MessageBox.INFO,
											buttons : Ext.MessageBox.OK,
											fn: reLoadData
										});									
									}
								},
								failure : function(form,action) {
									Ext.MessageBox.show({
										title : i18n._('errorNotice'),
										msg : i18n._('operateFail'),
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.WARNING
									});
								}
							});
						},
                        "mouseout" : function() {
                            document.getElementById("terminateId").style.color = "#ffffff";
                        },
                        "mouseover" : function() {
                            document.getElementById("terminateId").style.color = "#000000";
                        }                                               
                    }                                            
               },
				{
					xtype : 'button',									
					text: '<font id="vmdetail" color="#ffffff" >' + i18n._('Details') + '</font>',//详情
					listeners: {
						 "mouseout" : function() {
							 document.getElementById("vmdetail").style.color = "white";
						 },
						 "mouseover" : function() {
							 document.getElementById("vmdetail").style.color = "black";
						 }
							
					},
					icon : 'images/detail.png',
					handler : function() {
						getSessionUser();
						var row = vmGrid.getSelectionModel().getSelection();
						if (row.length == 0) {
							Ext.MessageBox.show({
								title : i18n._('notice'),
								msg : i18n._('selectOne'),
								icon : Ext.MessageBox.INFO,
								buttons : Ext.MessageBox.OK
							});
							return;
						}
						var recordId = row[0].get('vmId');	
						var owner = row[0].get('userName');
						var proxy=vmDetailStore.getProxy();
						proxy.setExtraParam('vmId',recordId) ;
						detailVMForm.getForm().reset();
						ownerDetailField.setValue(owner);
						vmDetailStore.load();
					}
				},
               {
            	   xtype:'tbfill'
               },
               {
            	   xtype : 'label',					
            	   text: i18n._('QuickSearch')+':',//快速查询
            	   style: 'color:#ffffff'
               },
               {
            	   labelWidth : 50,
            	   xtype : 'searchfield',
            	   tooltip:i18n._('machineNum')+'/'+i18n._('vm_name'),
            	   emptyText:i18n._('machineNum')+'/'+i18n._('vm_name'),
            	   store : vmStore,
            	   onTrigger1Click : function() {
            		   var me = this, store = me.store, proxy = store.getProxy(), val;
            		   if (me.hasSearch) {
            			   me.setValue('');
            			   proxy.setExtraParam(me.paramName,null) ;
            			   proxy.extraParams.start = 0;
            			   store.loadPage(1,null);
            			   me.hasSearch = false;
            			   me.triggerEl.item(0).setDisplayed('none');
            			   me.doComponentLayout();
            		   }
            	   },
            	   onTrigger2Click : function() {// 点击查询按钮或回车调用该方法
            		   var me = this, store = me.store, proxy = store.getProxy(), value = me.getValue();
            		   if (value.length < 1) {
            			   me.onTrigger1Click();
            			   return;
            		   }										
            		   store = me.store,
            		   proxy = store.getProxy(),
            		   proxy.setExtraParam('query',value) ;
            		   proxy.extraParams.start = 0;
            		   store.loadPage(1,null);
            		   this.hasSearch = true;
            		   me.triggerEl.item(0).setDisplayed('block');
            		   me.doComponentLayout();
            	   }
               }]
		}],
		columnLines:true,
		columns: [
		          Ext.create('Ext.grid.RowNumberer',{header:'',dataIndex:'item',align:'left',flex:0.1}),//,align:'left'
		          {
		      		text : i18n._('machineNum'),
		      		flex : 0.6,
		      		//hidden:true,
		      		dataIndex : 'vmId'
		      	},{
		      		text : i18n._('VM_alias'),
		      		flex : 0.6,
		      		sortable: true,
		      		dataIndex : 'vmName',						
		      		renderer :function(data, metadata, record, rowIndex, columnIndex, store){
		      			var string=new String(data);
		      			metadata.tdAttr = 'data-qtip="' + string + '"';
		      		    return data;							
		      		}
		      	}, {
		      		text : i18n._('node'),
		      		flex : 0.4,
		      		sortable: true,
		      		hidden :true,
		      		dataIndex : 'hostName',
		      		renderer : renderDescnVmHostName
		      	}, {
		      		text : i18n._('IPAddress'),
		      		flex : 0.5,
		      		sortable: false,
		      		hidden :true,
		      		dataIndex : 'ipOuter',
		      		renderer :function(data, metadata, record, rowIndex, columnIndex, store){
		      			var ipInner = record.get('ipInner');
		    			var ip='';
		    			if(data == ''){
		    				ip = ipInner;
		    			}
		    			if(ipInner == ''){
		    				ip = data;
		    			}
		    			if(data != '' && ipInner != ''){
		    				ip = ipInner +',' + data;
		    			}
		    			metadata.tdAttr = 'data-qtip="' + ip + '"';
		    		    return ip;							
		      		}
		      	}, {
		      		text : i18n._('system'),//操作系统
		      		flex : 0.4,
		      		sortable: true,
		      		hidden :true,
		      		dataIndex : 'vmOS',
		      		renderer : function(value) {
		      			return i18n._(value);
		      		}
		      	}, {
		      		text : i18n._('status'),
		      		flex : 0.3,
		      		sortable: true,
		      		dataIndex : 'vmStatus',
		      		renderer : renderDescnVmStatus
		      	},{
		      		text : i18n._('createTime'),//
		      		flex : 0.4,
		      		sortable: true,
		      		dataIndex : 'createTime',
		      		renderer :function(data, metadata, record, rowIndex, columnIndex, store){
		      			metadata.tdAttr = 'data-qtip="' + Ext.Date.format(data, "Y-m-d H:i:s") + '"';
		      		    return Ext.Date.format(data, "Y-m-d H:i:s");							
		      		}
		      	},
		      	{
		      		text : i18n._('expireTime'),
		      		flex : 0.4,
		      		sortable: true,
		      		dataIndex : 'expireTime',
		      		renderer :function(data, metadata, record, rowIndex, columnIndex, store){
		      			metadata.tdAttr = 'data-qtip="' + Ext.Date.format(data, "Y-m-d H:i:s") + '"';
		      		    return Ext.Date.format(data, "Y-m-d H:i:s");							
		      		}
		      	}, {
		      		text : i18n._('Owner'),
		      		flex : 0.4,
		      		sortable: true,
		      		dataIndex : 'userName',
		      		renderer :function(data, metadata, record, rowIndex, columnIndex, store){
		      			//metadata.attr = 'ext:qtip="' + data + '"';
		      			metadata.tdAttr = 'data-qtip="' + data + '"';
		      		    return data;							
		      		}
		      	}],
		      	listeners:{
		    		itemdblclick :function(vmGrid,record, item, index, e, eOpts){							
		    			var recordId = record.get('vmId');	
		    			var owner = record.get('userName');
		    			var proxy=vmDetailStore.getProxy();
		    			proxy.setExtraParam('vmId',recordId) ;
		    			detailVMForm.getForm().reset();
		    			ownerDetailField.setValue(owner);
		    			vmDetailStore.load();					
		    		}
		      	}
});
//渲染虚拟机状态
function renderDescnVmStatus(value, cellmeta, record, rowIndex, columnIndex, store) {
		var status = store.getAt(rowIndex).get('vmStatus');
		var vmName = store.getAt(rowIndex).get('vmName');
		var vmId = store.getAt(rowIndex).get('vmId');		
	 	if(status == "noInstance"){
	 		var str = i18n._('noInstance')+'|'+'<a  href ="#" onclick="publishVM(\''+vmName+'\')">'+i18n._('deploy')+'</a>';
	 		return str;
	 	}else if(status == "VERIFY_RESIZE"){
	 		var str = i18n._('confirmMigrate')+'|'+'<a  href ="#" onclick=confirmMigrateVm("'+vmId+'",1)>'+i18n._('OK')+'</a>'; //+'&nbsp'+'<a  href ="#" onclick=confirmMigrateVm("'+vmId+'",0)>'+i18n._('Cancel')+'</a>'
	 		return str;
	 	}else if(status == "RESIZE_CONFIRM"){
	 		var str = i18n._('confirmResize');
	 		if(confirmRezizeArray.indexOf(vmId)==-1){
	 			str = i18n._('confirmResize')+'|'+'<a  href ="#" onclick=confirmResizeVm("'+vmId+'",1)>'+i18n._('OK')+'</a>';//+'&nbsp'+'<a  href ="#" onclick=confirmResizeVm("'+vmId+'",0)>'+i18n._('Cancel')+'</a>'
	 		}	 		
	 		return str;
	 	}else{
	 		if(confirmRezizeArray.indexOf(vmId)!=-1){
	 			confirmRezizeArray.removevalue(vmId);
	 		}
	 		return i18n._(status);
	 	}		
};
//渲染虚拟机节点名称
function renderDescnVmHostName(value, cellmeta, record, rowIndex, columnIndex, store) {
	var hostName = store.getAt(rowIndex).get('hostName');
	var status = store.getAt(rowIndex).get('vmStatus');
	var vmId = store.getAt(rowIndex).get('vmId');
 	if(hostName == "" || hostName == null){
 		var str='';//i18n._('ERROR')
 		if(status == "ACTIVE"){
 			str = '<a  href ="#" onclick=updateHostNameOfVm("'+vmId+'")>'+i18n._('Update')+'</a>';
 		} 		
 		return str;
 	}else{
 		cellmeta.tdAttr = 'data-qtip="' + hostName + '"';
 		return hostName;
 	}		
};
function reLoadData(){
	vmStore.load();
};
function trim(s)
{
    var l=0; var r=s.length -1;
    while(l < s.length && s[l] == ' ')
    {   l++; }
    while(r > l && s[r] == ' ')
    {   r-=1;   }
    return s.substring(l, r+1);
};

function getCookie(name){
         var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
         if(arr != null) return unescape(arr[2]);
         return null;
};
//将秒级的时间戳转换成天、小时、分钟
function getUseFreeLong(second){
	var d = 0;
	var h = 0;
	var m = 0;
	var remainder = 0;
	d = parseInt(second / (60 * 60 * 24));
	remainder = second % (60 * 60 * 24);
	h = parseInt(remainder / (60 * 60));
	remainder = remainder % (60 * 60);
	m = Math.round(remainder/60);
	return d+i18n._('Day')+h+i18n._('Hour')+m+i18n._('minute');
};