/****************************************nodeList****************************************************/
params = getCookie("lang");
i18n.set({
	lang : params,
	path : '../../resources'
});
Ext.Loader.setConfig({
	enabled : true
}); 
var hideFlag = false;
var nodeRunner = new Ext.util.TaskRunner();
var nodeTask = null;
var nodeRefreshTime = refreshPeriod;
var radioFlag = false;
var zoneCode =''; 
if(getCookie("zoneCode")!=null){
	zoneCode = getCookie("zoneCode");
}
if (getQuery("zoneCode") != null) {
	zoneCode = getQuery("zoneCode");
}
Ext.QuickTips.init();
Ext.apply(Ext.QuickTips.getQuickTip(), {
    maxWidth: 500,
    //minWidth: 100,
    //showDelay: 50,
    trackMouse: true,
    //width:500,
    //shrinkWrap:3,
    //hideDelay: true,
  
    //closable: true,
    //autoHide: false,
    //draggable: true,
    dismissDelay: 0
});
var operationFlag = 0;// 0-添加；1-修改
var vmTotal = 0;// 虚拟机总数
var i = -1;
var v_mask = null;
// 节点列表
var nodeModel = Ext.define('nodeModel', {
	extend : 'Ext.data.Model',
	fields : [ 'hostId','hostName','vmActive','vmTotal','ipInner','ipOuter', 'hostStatus','cpuRate','memoryRate',
	           'diskRate','cpuUsage','memoryUsage','diskUsage','cpuType','cpuCore','memory','disk','hostZone',
	           'hostIpmiInfo','cpuMonitorDetailBean','ipmiConfig','zoneCode','zoneId','zoneName',
	           'nodeIsolationConfig','iopsMonitorDetailBean','netMonitorDetailBean','nodeAliases','isEnable']
});
// 节点列表
var nodeStore = Ext.create('Ext.data.Store', {
	model : 'nodeModel',
	autoLoad : false,//true
	pageSize : listPageSize,//每页显示16条数据
	sorters : [ {
		property : 'id',
		direction : 'DESC'
	} ],
	//remoteSort : true,
	proxy : new Ext.data.proxy.Ajax({
		//type : 'ajax',
		url : path + '/../monitoring/monitor!findHostDetails.action?zoneCode='+zoneCode,
		reader : {
			type : 'json',
			root : 'resultObject.result',
			totalProperty : 'resultObject.totalCount'
		},
//		timeout:60000,//请求超时时间：由30秒调整为60秒
		listeners:{
			exception:function(reader, response, error, eOpts){
				v_mask.hide();
				ajaxException(reader, response, error, eOpts );
			}
		}
	}),	
	listeners : {
		beforeload : function(nodeStore,operation, eOpts ){	
			//遮罩层
			v_mask = new Ext.LoadMask(Ext
					.getBody(), {
				msg : i18n._('please wait'),
				removeMask : true			
			});
			v_mask.show();
		},
		load : function(nodeStore, records, successful, eOpts ){
			v_mask.hide();
			var nodeRefreshDate = new Date();
			lastRefreshTimeNodeField.setValue(nodeRefreshDate.toLocaleTimeString());
		}
	}
});
var lastRefreshTimeNodeField = Ext.create('Ext.form.field.Display', {//
	//width : 180,
	labelWidth : 100,
	labelAlign:'right',
	fieldLabel : i18n._('Last refresh time'),
	value : 0
// globalStore.getAt(0).get('cpuPhyTotal')
});
var timeUnitNodeStore = Ext.create('Ext.data.Store', {
    fields: ['id', 'name'],
    data : [
        {"id":1, "name":i18n._('Second')},
        {"id":2, "name":i18n._('minute')}
    ]
});
var refreshNodeWin=Ext.create('Ext.window.Window',{
	title: i18n._('Refresh Setting'),
    height: 130,
    width: 270,
    layout: 'fit',
    constrain:true,
    closable:false,
    tools:[{
		  type:'close',
		  handler:function(){
//			  nodeRefreshReset();
			  refreshNodeWin.hide();
		  }
		}],
    items: {  // Let's put an empty grid in just to illustrate fit layout
        xtype: 'form',
        frame:true,
        bodyPadding : 10,
        border: false,
        items: [
                	{
                		xtype: 'fieldcontainer',
                		layout: 'hbox',
                		items:[
								{
									xtype:'radiofield',
									id:'radioNodeResresh',
									boxLabel : i18n._('Refresh rate'),//刷新频率
									name : 'rb',
									inputValue : '1',		
									checked : true
								},{
									xtype:'numberfield',
									id:'numNodeTime',
									width:70,
							        value: nodeRefreshTime,
							        //maxValue: 60,
							        minValue: 1
								},{
									xtype:'combobox',
									id:'combNodeTime',
									width:70,
									autoSelect:true,
									forceSelection:true,
									queryMode: 'local',
								    displayField: 'name',
								    valueField: 'id',
								    store:timeUnitNodeStore,
								    value:1
								}
                		       ]
                	},{
                		xtype: 'fieldcontainer',
                		layout: 'hbox',
                		items:[
								{
									xtype:'radiofield',
									boxLabel : i18n._('Disable refresh'),//禁用刷新
									//width : 8,
									name : 'rb',
									inputValue : '2',
									listeners : {
										change:function( e, newValue, oldValue, eOpts){
											radioFlag = newValue;
											if(radioFlag){
												Ext.getCmp('combNodeTime').disable();
												Ext.getCmp('numNodeTime').disable();
											}else{
												Ext.getCmp('combNodeTime').enable();
												Ext.getCmp('numNodeTime').enable();
											}
										}
									}
								}
                		       ]
                	}                        	
                ],
		buttons:[
					{
						text : i18n._('OK'),
						handler : function() {
							nodeRunner.stopAll();
							if(!radioFlag){
								var timeUnit=Ext.getCmp('combNodeTime').getValue();
								if(timeUnit==1){
									nodeRefreshTime = Ext.getCmp('numNodeTime').getValue();
								}else{
									nodeRefreshTime = Ext.getCmp('numNodeTime').getValue()*60;
								}
								//alert(nodeRefreshTime);
								nodeTask = nodeRunner.newTask({
								    run: function () {    	
								    	//节点列表刷新
								    	if(nodeGrid.isVisible()){
								    		nodeStore.load();
								    	}   	
								    },
								    interval: 1000*nodeRefreshTime
								});
								nodeTask.start();
							}
							refreshNodeWin.hide();
						}
					},
					{
						text : i18n._('Cancel'),
						handler : function() {
							nodeRefreshReset();
							refreshNodeWin.hide();
						}
					}
		         ]
    }
});
var refreshSetBtn=Ext.create('Ext.Button',{
	text:'<font id="nodeadd" color="#ee8800" >' + i18n._('Refresh Setting') + '</font>',
	handler: function() {		
        refreshNodeWin.show();
    }
});
var nodeNameDetailField = Ext.create('Ext.form.field.Display', {//
	width : 150,
	labelWidth : 80,
	fieldLabel : i18n._('node name'),
	value : 0
// globalStore.getAt(0).get('cpuPhyTotal')
});
var nodeZoneDetailField = Ext.create('Ext.form.field.Display', {//
	width : 150,
	labelWidth : 80,
	labelAlign : 'right',
	fieldLabel : i18n._('zoneName'),//zone name
	value : 0
// globalStore.getAt(0).get('cpuPhyTotal')
});
var nodeIPDetailField = Ext.create('Ext.form.field.Display', {//
	width : 150,
	labelWidth : 80,
	labelAlign : 'right',
	fieldLabel : i18n._('IP'),
	value : 0
// globalStore.getAt(0).get('cpuPhyTotal')
});
var nodeCPUDetailField = Ext.create('Ext.form.field.Display', {//
	width : 200,
	labelWidth : 80,
	labelAlign : 'right',
	fieldLabel : i18n._('CPU'),
	value : 0
// globalStore.getAt(0).get('cpuPhyTotal')
});
var nodeCPUCoreDetailField = Ext.create('Ext.form.field.Display', {//
	width : 150,
	//labelWidth : 80,
	//labelAlign : 'right',
	//margin :'0 0 0 30',
	//fieldLabel : i18n._('CPUCore'),
	value : 0
// globalStore.getAt(0).get('cpuPhyTotal')
});
var nodeCPUDetailFieldContainer = Ext.create('Ext.form.FieldContainer', {
	layout : 'hbox',
	items : [ nodeCPUDetailField/*,{
		xtype : 'displayfield',
		value : i18n._('×')
	}, nodeCPUCoreDetailField*/ ]//{xtype : 'tbfill'},
});
var nodeMEMDetailField = Ext.create('Ext.form.field.Display', {//
	width : 150,
	labelWidth : 80,
	fieldLabel : i18n._('Memory'),
	value : 0
// globalStore.getAt(0).get('cpuPhyTotal')
});
var nodeDiskDetailField = Ext.create('Ext.form.field.Display', {//
	width : 150,
	labelWidth : 80,
	fieldLabel : i18n._('Disk'),
	value : 0
// globalStore.getAt(0).get('cpuPhyTotal')
});
var nodeCPURateDetailField = Ext.create('Ext.form.field.Display', {//
	width : 150,
	labelWidth : 80,
	fieldLabel : i18n._('cpu rate'),
	value : 0
// globalStore.getAt(0).get('cpuPhyTotal')
});
var nodeMEMRateDetailField = Ext.create('Ext.form.field.Display', {//
	width : 150,
	labelWidth : 80,
	fieldLabel : i18n._('ram rate'),
	value : 0
// globalStore.getAt(0).get('cpuPhyTotal')
});
var nodeDiskRateDetailField = Ext.create('Ext.form.field.Display', {//
	width : 150,
	labelWidth : 80,
	fieldLabel : i18n._('disk rate'),
	value : 0
// globalStore.getAt(0).get('cpuPhyTotal')
});
// modify 张建伟  modifytime 20131009
var nodeIsolationCPUWorkloadField = Ext.create('Ext.form.field.Display', {//
	width : 150,
	labelWidth : 80,
	labelAlign:'right',
	fieldLabel : i18n._('cpu workload'),
	value : 0
// globalStore.getAt(0).get('cpuPhyTotal')
});
var nodeIsolationIOpsReadField = Ext.create('Ext.form.field.Display', {//
	width : 150,
	labelWidth : 80,
	labelAlign:'right',
	fieldLabel : i18n._('iops read'),
	value : 0
// globalStore.getAt(0).get('cpuPhyTotal')
});
var nodeIsolationIOpsWriteField = Ext.create('Ext.form.field.Display', {//
	width : 150,
	labelWidth : 80,
	labelAlign:'right',
	fieldLabel : i18n._('iops write'),
	value : 0
// globalStore.getAt(0).get('cpuPhyTotal')
});
var nodeIsolationNetworkReadField = Ext.create('Ext.form.field.Display', {//
	width : 150,
	labelWidth : 80,
	labelAlign:'right',
	fieldLabel : i18n._('network read'),
	value : 0
// globalStore.getAt(0).get('cpuPhyTotal')
});
var nodeIsolationNetworkWriteField = Ext.create('Ext.form.field.Display', {//
	width : 150,
	labelWidth : 80,
	labelAlign:'right',
	fieldLabel : i18n._('network write'),
	value : 0
// globalStore.getAt(0).get('cpuPhyTotal')
});
var nodeIsolationStorageField = Ext.create('Ext.form.field.Display', {//
	width : 150,
	labelWidth : 80,
	labelAlign:'right',
	fieldLabel : i18n._('storage'),
	value : 0
// globalStore.getAt(0).get('cpuPhyTotal')
});
var nodeInnerIPField = Ext.create('Ext.form.field.Display', {//
	width : 150,
	labelWidth : 80,
	labelAlign:'right',
	fieldLabel : i18n._('ipInner'),
	value : 0
// globalStore.getAt(0).get('cpuPhyTotal')
});
var nodeAliasesDetailField = Ext.create('Ext.form.field.Display', {//
	width : 150,
	labelWidth : 80,
	labelAlign:'right',
	fieldLabel : i18n._('nodeAliases'),
	value : 0
// globalStore.getAt(0).get('cpuPhyTotal')
});

var nodeDetailForm = Ext.create('Ext.form.Panel',
		{
			//frame : true,
			// title: 'Form Fields',
			// width: 250,
			bodyPadding : 5,
			fieldDefaults : {
				labelAlign : 'right',
				labelWidth : 80,
				anchor : '100%'
			},
			//modify 张建伟 modifytime 20131009
			items : [ nodeNameDetailField,nodeAliasesDetailField,{
				xtype : 'fieldcontainer',
				frame : true,
				layout : 'hbox',
				items : [ {
					xtype : 'label'
				}, nodeZoneDetailField 
				]},{
				xtype : 'fieldcontainer',
				frame : true,
				layout : 'hbox',
				items : [ {
					xtype : 'label'
				}, nodeIPDetailField, nodeInnerIPField 
				]},{
				width : '100%'
			}, nodeCPUDetailFieldContainer, nodeMEMDetailField,
					nodeDiskDetailField, {
						width : '100%'
					}, nodeCPURateDetailField, nodeMEMRateDetailField,
					nodeDiskRateDetailField, {
						width : '100%'
					},{
						xtype : 'fieldcontainer',
						frame : true,
						layout : 'hbox',
						items : [ {
							xtype : 'label'
						}, nodeIsolationCPUWorkloadField,nodeIsolationStorageField
						] },
						{
						xtype : 'fieldcontainer',
						frame : true,
						layout : 'hbox',
						items : [ {
							xtype : 'label'
						}, nodeIsolationIOpsReadField,nodeIsolationIOpsWriteField
						] },
						{
							xtype : 'fieldcontainer',
							frame : true,
							layout : 'hbox',
							items : [ {
								xtype : 'label'
							}, nodeIsolationNetworkReadField,nodeIsolationNetworkWriteField
							] },
					 ],
			buttons : [ {
				text : i18n._('OK'),
				handler : function() {
					nodeDetailForm.getForm().reset();
					nodeRefreshReset();//刷新重置
					nodeDetailWinForm.hide()
				}
			} ]
		});
var nodeDetailWinForm = new Ext.create('Ext.window.Window', {
	width : 600,
	expandOnShow:false,
	autoHeight : true,
	closable : false,
	constrain : true,
	modal : true,
	title : i18n._('nodeDetail'),//节点详细信息
	tools : [ {
		type : 'close',
		handler : function() {
			nodeDetailForm.getForm().reset();
			nodeRefreshReset();//刷新重置
			nodeDetailWinForm.hide();
			//nodeDetailWinForm.destroy();
		}
	} ],
	layout : 'fit',
	defaults : {
		split : false
	},
	items : [{
		xtype : 'panel',
		items : [ nodeDetailForm ]
	} ]
});
//分页序号
Ext.grid.PageRowNumberer = Ext.extend(Ext.grid.RowNumberer, {    
    renderer:function(value, cellmeta, record, rowIndex, columnIndex, store){   
        return (store.currentPage - 1) * store.pageSize + rowIndex + 1;  
    }       
});
var nodeBbar=Ext.create('Ext.toolbar.Paging', {
	store : nodeStore,
	displayInfo : true,
	inputItemWidth:pagingBarPageNumWidth,
	beforePageText:i18n._('beforePageText'),//"第"
	firstText: i18n._('firstText'),//"第一页"
    prevText: i18n._('prevText'),//"上一页"
    nextText: i18n._('nextText'),//"下一页"
    lastText: i18n._('lastText'),//"最后页"
    refreshText: i18n._('refreshText'),//"刷新"
    items:[lastRefreshTimeNodeField,refreshSetBtn]
});
var nodeGrid = Ext.create('Ext.grid.Panel',{
	layout : 'fit',
	store : nodeStore,
	simpleSelect : true,
	selModel : Ext.create('Ext.selection.RowModel'),					
	selType : 'cellmodel',
	iconCls: 'icon-grid',
	columnLines: true,
	bbar:nodeBbar,
	/*bbar : Ext.create('Ext.toolbar.Paging', {
		store : nodeStore,
		displayInfo : true,
		beforePageText:i18n._('beforePageText'),//"第"
		firstText: i18n._('firstText'),//"第一页"
        prevText: i18n._('prevText'),//"上一页"
        nextText: i18n._('nextText'),//"下一页"
        lastText: i18n._('lastText'),//"最后页"
        refreshText: i18n._('refreshText')//"刷新"
	}),*/
	viewConfig : {
		stripeRows: true,
		forceFit: true
	},
	dockedItems : [ {
		xtype : 'toolbar',
		cls: 'toolbarCSS',
		dock : 'top',
		items : [
				{					
					text: '<font id="nodeadd" color="#ffffff" >' + i18n._('found node') + '</font>',//发现节点
					listeners: {
						 "mouseout" : function() {
							 document.getElementById("nodeadd").style.color = "white";
						 },
						 "mouseover" : function() {
							 document.getElementById("nodeadd").style.color = "black";
						 }
							
					},
					icon : 'images/add.png',
					handler : function() {
						getSessionUser();
						nodeRunner.stopAll();//停止刷新
						findNodeStore.load();
						findZoneStore.load();						
						nodeIPMIIPContainer.setVisible(true);
//						nodeIPMIPortContainer.setVisible(true);
						nodeIPMIUserNameContainer.setVisible(true);
//						nodeIPMIPasswordContainer.setVisible(true);
					}
				},
				'-',
				{					
					text: '<font id="nodemodify" color="#ffffff" >' + i18n._('modify node') + '</font>',//修改节点
					listeners: {
						 "mouseout" : function() {
							 document.getElementById("nodemodify").style.color = "white";
						 },
						 "mouseover" : function() {
							 document.getElementById("nodemodify").style.color = "black";
						 }
							
					},
					icon : 'images/modify.png',
					handler : function() {
						getSessionUser();
						// 修改套餐
						var rows = nodeGrid.getSelectionModel().getSelection();
						var scId;
						if (rows.length > 0) {
							scId = rows[0].get('hostId');
						} else {
							Ext.MessageBox.show({
								title : i18n._('Prompt'),
								msg : i18n._('selectOne'),
								icon : Ext.MessageBox.INFO,
								buttons : Ext.MessageBox.OK
							});
							return;
						}
						//var record = nodeStore.getById(scId);										
						nodeIdField.setValue(rows[0].get('hostId'));
						nodeNameField.setValue(rows[0].get('hostName'));
						nodeAliasesField.setValue(rows[0].get('nodeAliases'));
						nodeZoneField.setValue(rows[0].get('zoneCode'));
						nodeCPUTypeField.setValue(rows[0].get('cpuType'));
						nodeCPUCoreField.setRawValue(rows[0].get('cpuCore'));										
						nodeRAMField.setRawValue(rows[0].get('memory'));
						//alert(RAMField.getRawValue());
						nodeDiskField.setRawValue(rows[0].get('disk'));
						nodeIPField.setValue(rows[0].get('ipOuter'));
						nodeManagerIPField.setValue(rows[0].get('ipInner'));
						nodeCPURateField.setValue(rows[0].get('cpuRate'));
						nodeCPURateDisplayField.setValue('1:'+ rows[0].get('cpuRate'));
						nodeRAMRateField.setValue(rows[0].get('memoryRate'));//
						nodeRAMRateDisplayField.setValue('1:'+ rows[0].get('memoryRate'));// record.get('memoryRate')
						nodeDiskRateField.setValue(rows[0].get('diskRate'));
						nodeDiskRateDisplayField.setValue('1:'+ rows[0].get('diskRate'));

						submitButton.setText(i18n._('modify'));
						operationFlag = 1;
						findNodeGrid.setVisible(false);// 修改时隐藏左侧列表
						//Ext.getCmp('nodeGridPanel').hide();
						//Ext.getCmp('nodeFormPanel').setWidth('100%');
						var ipmiConfig=rows[0].get('ipmiConfig');
						ipmiIdField.setValue(0);
						if(ipmiConfig != null){
							//alert(ipmiConfig.id);
							ipmiIdField.setValue(ipmiConfig.id);
							nodePowerSet.setValue(ipmiConfig.isConsumptionLimit);
							nodePowerLimitField.setValue(ipmiConfig.powerConsumption);
						}
						var nodeIsolationConfig=rows[0].get('nodeIsolationConfig');
						nodeIsolationIdField.setValue(0);
						if(nodeIsolationConfig != null){
							//alert(ipmiConfig.id);
							nodeIsolationIdField.setValue(nodeIsolationConfig.id);
							nodehostNumberField.setValue(nodeIsolationConfig.hostNumber);
							nodeWorkloadField.setValue(nodeIsolationConfig.cpuworkload);
							nodeIOPSRField.setValue(nodeIsolationConfig.iopsread);
							nodeIOPSWField.setValue(nodeIsolationConfig.iopswrite);
							nodeNetworkRField.setValue(nodeIsolationConfig.networkRead);
							nodeNetworkWField.setValue(nodeIsolationConfig.networkWrite);
							nodehostStorageField.setValue(nodeIsolationConfig.storageSpace);
						}
						findZoneStore.load();
//						nodeIPMIIPContainer.setVisible(false);
//						nodeIPMIPortContainer.setVisible(false);
//						nodeIPMIUserNameContainer.setVisible(false);
//						nodeIPMIPasswordContainer.setVisible(false);
						nodeWindow.setTitle(i18n._('modify node'));
						nodeWindow.show();
					}
				},'-',
				{
					itemId : 'removeButton',
					text: '<font id="nodedelete" color="#ffffff" >' + i18n._('delete') + '</font>',//删除
					listeners: {
						 "mouseout" : function() {
							 document.getElementById("nodedelete").style.color = "white";
						 },
						 "mouseover" : function() {
							 document.getElementById("nodedelete").style.color = "black";
						 }
							
					},
					icon : 'images/delete.png',
					handler : function() {
						getSessionUser();
						var rows = nodeGrid.getSelectionModel().getSelection();
						var statusIsEnable = rows[0].get('isEnable');
						if(rows.length==0){
							Ext.MessageBox.show({
								title : i18n._('Prompt'),
								msg : i18n._('selectOne'),
								icon : Ext.MessageBox.INFO,
								buttons : Ext.MessageBox.OK
							});
							return;
						}
						if(statusIsEnable == 0){
							Ext.MessageBox.show({
								title : i18n._('notice'),
								msg : i18n._('enabledIsOpen'),
								icon : Ext.MessageBox.INFO,
								buttons : Ext.MessageBox.OK
							});
							return;
						}
						if(rows.length > 0){
							var scId = rows[0].get('hostId');							
							Ext.MessageBox.show({				                  
								title: i18n._('notice'),
								msg:i18n._('Are you sure to delete'),
								buttons: Ext.MessageBox.YESNO,
								icon: Ext.MessageBox.QUESTION,
								fn:function(e){
									if(e=='yes'){
										Ext.Ajax.request({
											url: path+'/../sc/node!delete.action',
											method: 'POST',
											params:{
												'serverNode.id':scId
											},
											success: function (response) {
												var result=Ext.JSON.decode(response.responseText);
												if(result.success==true){
													Ext.MessageBox.show({
														title : i18n._('notice'),
														msg : i18n._('Operating')+i18n._('Successful'),
														icon : Ext.MessageBox.INFO,
														buttons : Ext.MessageBox.OK,
														fn: reLoadHostData
													});																							
												}else{
													Ext.MessageBox.show({
														title : i18n._('notice'),
														msg : result.resultMsg,
														icon : Ext.MessageBox.INFO,
														buttons : Ext.MessageBox.OK
													});													
												}
											}
										});
									}else{
										nodeRefreshReset();//刷新重置
									}
								}
				    		});	
						}
					}
				},'-',
				{
					itemId : 'detailButton',
					text: '<font id="nodedetail" color="#ffffff" >' + i18n._('detail') + '</font>',//详细
					listeners: {
						 "mouseout" : function() {
							 document.getElementById("nodedetail").style.color = "white";
						 },
						 "mouseover" : function() {
							 document.getElementById("nodedetail").style.color = "black";
						 }
							
					},
					icon : 'images/detail.png',
					handler : function() {
						var rows = nodeGrid.getSelectionModel().getSelection();
						if (rows.length > 0) {
							nodeDetailShow(rows[0]);
						} else {
							Ext.MessageBox.show({
								title : i18n._('Prompt'),
								msg : i18n._('selectOne'),
								icon : Ext.MessageBox.INFO,
								buttons : Ext.MessageBox.OK
							});
							return;
						}
					}
				},{					
					text: '<font id="synchronization" color="#ffffff" >' + i18n._('synchronization') + '</font>',//同步节点
					listeners: {
						 "mouseout" : function() {
							 document.getElementById("synchronization").style.color = "white";
						 },
						 "mouseover" : function() {
							 document.getElementById("synchronization").style.color = "black";
						 }
							
					},
					icon : 'images/synchronization.png',
					hidden:hideFlag,
					handler : function() {
						getSessionUser();						
						Ext.Ajax.request({
							url: path+'/../sc/node!synchronizationAllNodeIsolation.action',
							method: 'POST',
							success: function (response) {
								var result=Ext.JSON.decode(response.responseText);
								if(result.success==true){
									Ext.MessageBox.show({
										title : i18n._('notice'),
										msg : i18n._('Operating')+i18n._('Successful'),
										icon : Ext.MessageBox.INFO,
										buttons : Ext.MessageBox.OK,
										fn: reLoadHostData
									});																							
								}else{
									Ext.MessageBox.show({
										title : i18n._('notice'),
										msg : result.resultMsg,
										icon : Ext.MessageBox.INFO,
										buttons : Ext.MessageBox.OK
									});													
								}
							}
						});
					}
				},'-',
				{
					xtype : 'button',									
					text: '<font id="vmenable" color="#ffffff" >' + i18n._('Enable') + '</font>',//启用
					listeners: {
						 "mouseout" : function() {
							 document.getElementById("vmenable").style.color = "white";
						 },
						 "mouseover" : function() {
							 document.getElementById("vmenable").style.color = "black";
						 }
							
					},
					icon : 'images/enable.png',// ../../images/control_repeat_blue.png
					handler : function() {	
						getSessionUser();
						var row = nodeGrid.getSelectionModel().getSelection();
						if (row.length == 0) {
							Ext.MessageBox.show({
								title : i18n._('notice'),
								msg : i18n._('selectOne'),
								icon : Ext.MessageBox.INFO,
								buttons : Ext.MessageBox.OK
							});
						} else {
							var id = row[0].get('hostId');
							var record = nodeGrid.getStore().getById(id);
							var isEnable = row[0].get('isEnable');
							if(isEnable == 0){
								Ext.MessageBox.show({
									title : i18n._('notice'),
									msg : i18n._('enabledError'),
									icon : Ext.MessageBox.INFO,
									buttons : Ext.MessageBox.OK
								});
							}else {
								Ext.MessageBox.confirm(i18n._('submit'),i18n._('confirmEnableSC'),function(btn) {
									if (btn == 'yes') {																		
										var start = Ext.Ajax.request({
											url : path+ '/../sc/node!activeNode.action',
											method : 'POST',
											params : 'id='+ id,
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
										nodeRefreshReset();//刷新设置重置
									}else{
										nodeRefreshReset();//刷新设置重置
									}
								});
							} 
						}
					}
				},
				{
					xtype : 'button',									
					text: '<font id="vmdisable" color="#ffffff" >' + i18n._('Disable') + '</font>',//禁用
					listeners: {
						 "mouseout" : function() {
							 document.getElementById("vmdisable").style.color = "white";
						 },
						 "mouseover" : function() {
							 document.getElementById("vmdisable").style.color = "black";
						 }
							
					},
					icon : 'images/disable.png',// ../../images/control_repeat_blue.png
					handler : function() {
						getSessionUser();
						var row = nodeGrid.getSelectionModel().getSelection();
						if (row.length == 0) {
							Ext.MessageBox.show({
								title : i18n._('notice'),
								msg : i18n._('selectOne'),
								icon : Ext.MessageBox.INFO,
								buttons : Ext.MessageBox.OK
							});
						} else {
							var id = row[0].get('hostId');
							var record = nodeGrid.getStore().getById(id);
							var isEnable = row[0].get('isEnable');
							if(isEnable != 0){
								Ext.MessageBox.show({
									title : i18n._('notice'),
									msg : i18n._('disabledError'),
									icon : Ext.MessageBox.INFO,
									buttons : Ext.MessageBox.OK
								});
							}
							else {
								Ext.MessageBox.confirm(i18n._('submit'),i18n._('confirmDisableSC'),function(btn) {
									if (btn == 'yes') {																		
										var start = Ext.Ajax.request({
											url : path+ '/../sc/node!freezeNode.action',
											method : 'POST',
											params : 'id='+ id,
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
										nodeRefreshReset();//刷新设置重置
									}else{
										nodeRefreshReset();//刷新设置重置
									}
								});
							}
						}
					}
				}, {
					xtype : 'tbfill'
				},{
					xtype : 'label',					
					text: i18n._('QuickSearch')+':',//快速查询
					style: 'color:#ffffff'
					//text: '<font id="nodedetail" color="#ffffff" >' + i18n._('QuickSearch')+':' + '</font>'
				},
				{
					labelWidth : 50,
					xtype : 'searchfield',
					tooltip:i18n._('host_name')+'/'+i18n._('IPAddress'),
					emptyText:i18n._('host_name')+'/'+i18n._('IPAddress'),
					store : nodeStore,
					id : 'orderNoField',
					onTrigger1Click : function() {
						var me = this, store = me.store, proxy = store.getProxy(), val;
						if (me.hasSearch) {
							me.setValue('');
							//proxy.extraParams[me.paramName] = '';
							proxy.setExtraParam(me.paramName,null) ;
							//proxy.extraParams['type'] = '';
							proxy.extraParams.start = 0;
							//store.load();
							store.loadPage(1,null);
							me.hasSearch = false;
							me.triggerEl.item(0).setDisplayed('none');
							me.doComponentLayout();
						}
					},
					onTrigger2Click : function() {// 点击查询按钮或回车调用该方法
						var me = this, store = me.store, proxy = store.getProxy(), value = me.getValue();
						value = Ext.String.trim(value);
						if (value.length < 1) {
							me.onTrigger1Click();
							return;
						}										
						store = me.store,
						proxy = store.getProxy(),
						proxy.setExtraParam('query',value) ;
								//proxy.extraParams['query'] = value;
						//proxy.extraParams['type'] = i;
						proxy.extraParams.start = 0;
						//store.load();
						store.loadPage(1,null);
						this.hasSearch = true;
						me.triggerEl.item(0).setDisplayed('block');
						me.doComponentLayout();
					}
				} 
				]
	}/*,{
	    xtype: 'toolbar',
	    dock: 'bottom',
	    items: [
	        nodeBbar,lastRefreshTimeField,refreshSetBtn
	    ]
	}*/ ],
	columns : [ Ext.create('Ext.grid.PageRowNumberer',{flex : 0.1})//{xtype: 'rownumberer',width:50}//Ext.create('Ext.grid.PageRowNumberer',{flex : .3})
	  /*Ext.create('Ext.grid.RowNumberer', {
		header : i18n._('row_Num'),
		dataIndex : 'id',
		align : 'left',
		flex : .5
	})*/, {
		header : i18n._('VM(running/all)'),//虚拟机(运行/全部)
		dataIndex : 'vmActive',// vmActive
		flex : 0.27,
		sortable: true,
		renderer : renderDescnVM
	}, {
		header : i18n._('node'),// 节点名称变节点别名 修改 张建伟 修改日期 20131021
		dataIndex : 'nodeAliases',
		flex : 0.22,
		sortable: true,
		renderer :function(data, metadata, record, rowIndex, columnIndex, store){
			var string=new String(data);
			metadata.tdAttr = 'data-qtip="' + string + '"';
		    return data;							
		}
	},//		
	{
		header : i18n._('IP'),
		dataIndex : 'ipInner',
		flex : 0.4,
		sortable: false,
		renderer : renderDescnIP
	}, {
		header : i18n._('on_state'),//使用状态
		dataIndex : 'isEnable',
		flex : 0.12,
		sortable: true,
		renderer : function(value) {
			switch(value){
	    	case 0: text='Enable';break;
	    	case 1: text='ManuallyDisabled';break;
	    	case 2: text='DueToDisable';break;	    	
	    	default:text='';
    	}								
		return i18n._(text);
		}
	}],
	listeners:{
		itemdblclick :function(nodeGrid,record, item, index, e, eOpts){							
			nodeDetailShow(record);						
		},
		itemclick:function(nodeGrid,record, item, index, e, eOpts){
			nodeRunner.stopAll();
		}
	}
});
function nodeDetailShow(record){
	var recordId = record.get('hostId');										
	nodeNameDetailField.setValue(record.get('hostName'));
	nodeAliasesDetailField.setValue(record.get('nodeAliases'));
	nodeZoneDetailField.setValue(record.get('zoneName'));
	nodeIPDetailField.setValue(record.get('ipOuter'));
	nodeInnerIPField.setValue(record.get('ipInner'));
	nodeCPUDetailField.setValue(record.get('cpuType')+'GHz'+i18n._('×')+record.get('cpuCore')+i18n._('core'));
//	nodeCPUCoreDetailField.setValue(record.get('cpuCore'));
	nodeMEMDetailField.setValue(record.get('memory')+'M');
	nodeDiskDetailField.setValue(record.get('disk')+'G');
	nodeCPURateDetailField.setValue('1:'+ record.get('cpuRate'));
	nodeMEMRateDetailField.setValue('1:'+ record.get('memoryRate'));
	nodeDiskRateDetailField.setValue('1:'+ record.get('diskRate'));
	nodeIsolationCPUWorkloadField.setValue(record.get('nodeIsolationConfig').cpuworkload);
	nodeIsolationIOpsReadField.setValue(record.get('nodeIsolationConfig').iopsread+" MB/sec");
	nodeIsolationIOpsWriteField.setValue(record.get('nodeIsolationConfig').iopswrite+" MB/sec");
	nodeIsolationNetworkReadField.setValue(record.get('nodeIsolationConfig').networkRead+" Mbps");
	nodeIsolationNetworkWriteField.setValue(record.get('nodeIsolationConfig').networkWrite+" Mbps");
	nodeIsolationStorageField.setValue(record.get('nodeIsolationConfig').storageSpace+" G");
	nodeDetailWinForm.show();
};
function ajax_request(v_json) {
//	v_mask = new Ext.LoadMask(Ext.getBody(), {
//		msg : i18n._('saving'),
//		removeMask : true
//	// 完成后移除
//	});
	v_mask.show();
	Ext.Ajax.request({
		url : path + '/../sc/node!save.action',
		jsonData : v_json,
		success : function(response) {
			v_mask.hide();
			nodeForm.getForm().reset();
			nodeWindow.hide();
			var result = Ext.JSON.decode(response.responseText);
			if (result.success == false) {
				Ext.MessageBox.show({
					title : i18n._('notice'),
					msg : result.resultMsg,
					icon : Ext.MessageBox.INFO,
					buttons : Ext.MessageBox.OK,
					fn: function(){
						getSessionUser();
					}
				});
			} else {
				Ext.MessageBox.show({
					title : i18n._('notice'),
					msg : i18n._('Operating')+i18n._('Successful'),
					icon : Ext.MessageBox.INFO,
					buttons : Ext.MessageBox.OK,
					fn: reLoadHostData
				});					
			}
		}
	});
};
function renderDescnIPMI(value, cellmeta, record, rowIndex, columnIndex, store) {
	var hostCons='';
	var hostTemp='';
	var cpuCons='';
	var cpuTemp='';
	var memCons='';
	var memTemp='';	
	if(value!=null){
		hostCons=value.hostPower+'W';
		hostTemp=value.hostTemp+'℃';
		cpuCons=value.cpuPower+'W';
		cpuTemp=value.cpuTemp+'℃';
		memCons=value.memPower+'W';
		memTemp=value.memTemp+'℃';
	}
	var consumption = "<img src='images/consumption.png'/>" + "<span style='width:30px;display:inline-block;'>"+'&nbsp;'
			+ hostCons+"</span>";// +value;
	var temperature = "<img src='images/temperature.png'/>" + "<span style='width:30px;display:inline-block;'>"+'&nbsp;'
			+ hostTemp+"</span>";
	var ipmi = consumption + temperature;
	var data=i18n._('CPUPower')+':'+cpuCons+'<br/>'+i18n._('CPUTemp')+':'+cpuTemp+'<br/>'
		+i18n._('MEMPower')+':'+memCons+'<br/>'+i18n._('MEMTemp')+':'+memTemp+'<br/>';
	cellmeta.tdAttr = 'data-qtip="' + data + '"';
	return ipmi;
};
function renderDescnVM(value, cellmeta, record, rowIndex, columnIndex, store) {
	return value + '/' + store.getAt(rowIndex).get('vmTotal');
};
function renderDescnIP(value, cellmeta, record, rowIndex, columnIndex, store) {	
	if(value==''){
		return store.getAt(rowIndex).get('ipOuter');
	}
	if(store.getAt(rowIndex).get('ipOuter')==''){
		return value;
	}
	if(value!='' && store.getAt(rowIndex).get('ipOuter')!=''){
		return value + '/' + store.getAt(rowIndex).get('ipOuter');
	}	
};
function renderDescnRate(value, cellmeta, record, rowIndex, columnIndex, store) {
	var cpu = "<img src='images/cpu-.png'/>" + "<span style='width:50px;display:inline-block;'>"+'&nbsp;1:'
			+ store.getAt(rowIndex).get('cpuRate')+"</span>";// +value;
	var memory = "<img src='images/mem-.png'/>" + "<span style='width:50px;display:inline-block;'>"+'&nbsp;1:'
			+ store.getAt(rowIndex).get('memoryRate')+"</span>";
	var disk = "<img src='images/disk-.png'/>" + "<span style='width:50px;display:inline-block;'>"+'&nbsp;1:'
			+ store.getAt(rowIndex).get('diskRate')+"</span>";
	var rate = cpu + memory + disk;
	return rate;
};
function renderDescnCPU(value, cellmeta, record, rowIndex, columnIndex, store) {
//	var status = store.getAt(rowIndex).get('cpuUsage');
	var status = 0;
	var cpuMonitorDetail = store.getAt(rowIndex).get('cpuMonitorDetailBean');
	var nodeIsolationConfig=store.getAt(rowIndex).get('nodeIsolationConfig');
	var load_avg = null;
	var workloadActual = 0;
	var workloadLimit = 0;
	var cpuRrateList = [];
	var loadAVG='';
	if(cpuMonitorDetail!=null){
		load_avg=cpuMonitorDetail.loadAvgBean;
		cpuRrateList=cpuMonitorDetail.singleDetailBeanList;
		workloadActual=cpuMonitorDetail.workloadActual;
	}
	if(load_avg != null){
		loadAVG=i18n._('Load average')+':'+load_avg.loadAvg1+','+load_avg.loadAvg5+','+load_avg.loadAvg15;
	}
	if(nodeIsolationConfig != null){
		workloadLimit = nodeIsolationConfig.cpuworkload;
	}
	if(workloadLimit>0){
		status = Ext.util.Format.round(workloadActual/workloadLimit*100,1);
	}
	var cpuRate='';
	if(cpuRrateList != null){
		for(var i=0;i<cpuRrateList.length;i++){
			cpuRate+='CPU'+i+':'+Ext.util.Format.round(cpuRrateList[i].cpuUsRate,1)+'%us,'
					+Ext.util.Format.round(cpuRrateList[i].cpuSysRate,1)+'%sys,'
					+Ext.util.Format.round(cpuRrateList[i].cpuNiceRate,1)+'%nice,'
					+Ext.util.Format.round(cpuRrateList[i].cpuIdleRate,1)+'%idle,'
					+Ext.util.Format.round(cpuRrateList[i].cpuIowaitRate,1)+'%iowait,'
					+Ext.util.Format.round(cpuRrateList[i].cpuIrqRate,1)+'%irq,'
					+Ext.util.Format.round(cpuRrateList[i].cpuSoftIrqRate,1)+'%softirq'+'<br/>';
		}
	}	
	if(status>100){
		status=100;
	}
	var val = parseInt(status, 10);
//	alert('cpu:'+val);
	cellmeta.tdAttr = 'data-qtip="<span width=500px>' + loadAVG +'<br/>'+cpuRate+ '</span>"';
	return "<div style='color:#8DB2E3; background-color:#ffffff;border: 1px #cbcbcb solid;'><div style='height:12px;width:"
			+ val
			+ "%;background-color:#ee8800;border: 0px;color: black;'>"
			+ workloadActual + "</div></div>";
	
	// pbar.updateProgress(status, status+'% used...');
	// return pbar;
};
function renderDescnMemory(value, cellmeta, record, rowIndex, columnIndex,
		store) {
	var status = store.getAt(rowIndex).get('memoryUsage');
	if(status>100){
		status=100;
	}
	var val = parseInt(status, 10);
	return "<div style='color:#8DB2E3; background-color:#ffffff;border: 1px #cbcbcb solid;'><div style='height:12px;width:"
			+ val
			+ "%;background-color:#ee8800;border: 0px;color: black;'>"
			+ val + "%</div></div>";	
};
function renderDescnDisk(value, cellmeta, record, rowIndex, columnIndex, store) {
	var status = store.getAt(rowIndex).get('diskUsage');
	if(status>100){
		status=100;
	}
	var val = parseInt(status, 10);
	return "<div style='color:#ee8800; background-color:#ffffff;border: 1px #cbcbcb solid;'><div style='height:12px;width:"
			+ val
			+ "%;background-color:#ee8800;border: 0px;color: black;'>"
			+ val + "%</div></div>";	
};
function renderDescnIOPS(value, cellmeta, record, rowIndex, columnIndex, store) {
	var readStatus = 0;
	var writeStatus = 0;
	var iopsMonitorDetail = store.getAt(rowIndex).get('iopsMonitorDetailBean');
	var nodeIsolationConfig=store.getAt(rowIndex).get('nodeIsolationConfig');
	var readActual = 0;
	var readLimit = 0;
	var writeActual = 0;
	var writeLimit = 0;
	var singleDetailBeanList = [];
	if(iopsMonitorDetail!=null){
		singleDetailBeanList=iopsMonitorDetail.singleDetailBeanList;
		readActual=iopsMonitorDetail.readActual;
		writeActual=iopsMonitorDetail.writeActual;
	}
	if(nodeIsolationConfig != null){
		readLimit = nodeIsolationConfig.iopsread;
		writeLimit = nodeIsolationConfig.iopswrite;
	}
	if(readLimit>0){
		readStatus = Ext.util.Format.round(readActual/readLimit*100,1);
	}
	if(writeLimit>0){
		writeStatus = Ext.util.Format.round(writeActual/writeLimit*100,1);
	}
	var iopsList='';
	if(singleDetailBeanList != null){
		for(var i=0;i<singleDetailBeanList.length;i++){
			iopsList+=singleDetailBeanList[i].title+':'+'read '+Ext.util.Format.round(singleDetailBeanList[i].iopsRead,1)+'MB/sec,'				
					+'write '+Ext.util.Format.round(singleDetailBeanList[i].iopsWrite,1)+'MB/sec'+'<br/>';
		}
	}	
	if(readStatus>100){
		readStatus=100;
	}
	if(writeStatus>100){
		writeStatus=100;
	}
	var readVal = parseInt(readStatus, 10);
	var writeVal = parseInt(writeStatus, 10);
//	alert('##'+readVal);
	cellmeta.tdAttr = 'data-qtip="<span width=500px>'+iopsList+ '</span>"';
	return "<div style='display:inline-table;float:left;white-space: normal;width:150px;'>"
			+"<div style='display:inline-table;float:left;white-space: normal;'>R:"
			+"<div style='color:#8DB2E3; background-color:#ffffff;border: 1px #cbcbcb solid;float:right;width:50px;'><div style='height:12px;width:"
			+ readVal
			+ "%;background-color:#ee8800;border: 0px;color: black;'>"
			+ readActual + "</div></div></div>"
			+"<div style='display:inline;float:left;white-space: normal;'>W:"
			+"<div style='color:#8DB2E3; background-color:#ffffff;border: 1px #cbcbcb solid;float:right;width:50px;'><div style='height:12px;width:"
			+ writeVal
			+ "%;background-color:#ee8800;border: 0px;color: black;'>"
			+ writeActual + "</div></div></div>"
			+"</div>";
};
function renderDescnNET(value, cellmeta, record, rowIndex, columnIndex, store) {
	var readStatus = 0;
	var writeStatus = 0;
	var netMonitorDetail = store.getAt(rowIndex).get('netMonitorDetailBean');
	var nodeIsolationConfig=store.getAt(rowIndex).get('nodeIsolationConfig');
	var readActual = 0;
	var readLimit = 0;
	var writeActual = 0;
	var writeLimit = 0;
	var singleDetailBeanList = [];
	if(netMonitorDetail!=null){
		singleDetailBeanList=netMonitorDetail.singleDetailBeanList;
		readActual=netMonitorDetail.readActual;
		writeActual=netMonitorDetail.writeActual;
	}
	if(nodeIsolationConfig != null){
		readLimit = nodeIsolationConfig.networkRead;
		writeLimit = nodeIsolationConfig.networkWrite;
	}
	if(readLimit>0){
		readStatus = Ext.util.Format.round(readActual/readLimit*100,1);
	}
	if(writeLimit>0){
		writeStatus = Ext.util.Format.round(writeActual/writeLimit*100,1);
	}
	var netList='';
	if(singleDetailBeanList != null){
		for(var i=0;i<singleDetailBeanList.length;i++){
			netList+=singleDetailBeanList[i].title+':'+'Rx '+Ext.util.Format.round(singleDetailBeanList[i].rxSpeed,1)+'KBps,'				
					+'Tx '+Ext.util.Format.round(singleDetailBeanList[i].txSpeed,1)+'KBps'+'<br/>';
		}
	}	
	if(readStatus>100){
		readStatus=100;
	}
	if(writeStatus>100){
		writeStatus=100;
	}
	var readVal = parseInt(readStatus, 10);
	var writeVal = parseInt(writeStatus, 10);
	cellmeta.tdAttr = 'data-qtip="<span width=500px>'+netList+ '</span>"';
	return "<div style='display:inline-table;float:left;white-space: normal;width:150px;'>"
			+"<div style='display:inline;float:left;white-space: normal;'>Rx:"
			+"<div style='color:#8DB2E3; background-color:#ffffff;border: 1px #cbcbcb solid;float:right;width:44px;'><div style='height:12px;width:"
			+ readVal
			+ "%;background-color:#ee8800;border: 0px;color: black;'>"
			+ readActual + "</div></div></div>"
			+"<div style='display:inline;float:left;white-space: normal;'>Tx:"
			+"<div style='color:#8DB2E3; background-color:#ffffff;border: 1px #cbcbcb solid;float:right;width:44px;'><div style='height:12px;width:"
			+ writeVal
			+ "%;background-color:#ee8800;border: 0px;color: black;'>"
			+ writeActual + "</div></div></div>"
			+"</div>";
};
function getCookie(name) {
	var arr = document.cookie
			.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
	if (arr != null)
		return unescape(arr[2]);
	return null;
};
//操作完成后点确认刷新数据操作
function reLoadHostData(btn){
	nodeStore.load();
//	nodeStore.loadPage(1,null);	
	nodeRefreshReset();
};
function nodeRefreshReset(){
//	nodeRefreshTime = refreshPeriod;
	Ext.getCmp("radioNodeResresh").setValue(true);
	Ext.getCmp('combNodeTime').setValue(1);
	Ext.getCmp('numNodeTime').setValue(nodeRefreshTime);
	nodeRunner.stopAll();
	nodeTask = nodeRunner.newTask({
	    run: function () {    	
	    	//节点列表刷新
	    	if(nodeGrid.isVisible()){
	    		nodeStore.load();
	    	}   	
	    },
	    interval: 1000*nodeRefreshTime
	});
	nodeTask.start();
};
nodeRefreshReset();