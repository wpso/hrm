//***vmList
var params = getCookie("lang");
i18n.set({
	lang : params,
	path : '../../resources'
});
var vmRunner = new Ext.util.TaskRunner();
var vmTask = null;
var zoneCode = '';
var vmZoneCodeDisk = '';
var vmfFlag = false;
var vmRefreshPeriod = refreshPeriod;
if (getCookie("zoneCode") != null) {
	zoneCode = getCookie("zoneCode");
}
if (getQuery("zoneCode") != null) {
	zoneCode = getQuery("zoneCode");
}
var nodeName = '';
var terminateFlag = '';
var checkFlag = false;
var menuDisabled = true;
var v_mask = null;
var confirmRezizeArray = new Array();
if (getCookie("nodeName") != null) {
	nodeName = getCookie("nodeName");
}
if (getQuery("nodeName") != null) {
	nodeName = getQuery("nodeName");
}
if (nodeName == '' || nodeName == null) {
	menuDisabled = false;
}
var vmid = '';
var vmname = '';
// 批量迁移
var vmIdArray = new Array();
var vmZoneArray = new Array();
var vmCPUUsedArray = new Array();
var vmMemoryUsedArray = new Array();
var vmDiskUsedArray = new Array();
var hostNameArray = new Array();
var global_records = 0;
var selectedVMUuid = "";// 当前选中虚拟机的uuid
var selectVmName = "";
var vmRadioFlag = false;
var floatingIp = "";
Ext.Loader.setConfig({
	enabled : true
});

Ext.require([ 'Ext.data.*', 'Ext.panel.Panel', 'Ext.view.View',
		'Ext.layout.container.Fit', 'Ext.toolbar.Paging',
		'Ext.selection.CheckboxModel', 'Ext.ux.data.PagingMemoryProxy',
		'Ext.tip.*' ]);
Ext.QuickTips.init();
Ext.apply(Ext.QuickTips.getQuickTip(), {
	maxWidth : 500,
	// minWidth: 100,
	// showDelay: 50,
	trackMouse : true,
	// width:500,
	// shrinkWrap:3,
	// hideDelay: true,

	// closable: true,
	// autoHide: false,
	// draggable: true,
	dismissDelay : 0
});
// Ext.require('vmRealTime');
var lastRefreshTimeField = Ext.create('Ext.form.field.Display', {//
	// width : 180,
	labelWidth : 80,
	labelAlign : 'right',
	fieldLabel : i18n._('Last refresh time'),
	value : 0
// globalStore.getAt(0).get('cpuPhyTotal')
});
var timeUnitStore = Ext.create('Ext.data.Store', {
	fields : [ 'id', 'name' ],
	data : [ {
		"id" : 1,
		"name" : i18n._('Second')
	}, {
		"id" : 2,
		"name" : i18n._('minute')
	} ]
});
var refreshWin = Ext.create('Ext.window.Window', {
	title : i18n._('Refresh Setting'),
	height : 130,
	width : 270,
	layout : 'fit',
	constrain : true,
	closable : false,
	tools : [ {
		type : 'close',
		handler : function() {
			vmRefreshReset();// 刷新设置重置
			refreshWin.hide();
		}
	} ],
	items : { // Let's put an empty grid in just to illustrate fit layout
		xtype : 'form',
		frame : true,
		bodyPadding : 10,
		border : false,
		items : [ {
			xtype : 'fieldcontainer',
			layout : 'hbox',
			items : [ {
				xtype : 'radiofield',
				id : 'radioVMResresh',
				boxLabel : i18n._('Refresh rate'),// 刷新频率
				name : 'rb',
				inputValue : '1',
				checked : true
			}, {
				xtype : 'numberfield',
				id : 'numVMTime',
				width : 70,
				value : vmRefreshPeriod,
				// maxValue: 60,
				minValue : 1
			}, {
				xtype : 'combobox',
				id : 'combVMTime',
				width : 70,
				autoSelect : true,
				forceSelection : true,
				queryMode : 'local',
				displayField : 'name',
				valueField : 'id',
				store : timeUnitStore,
				value : 1
			} ]
		}, {
			xtype : 'fieldcontainer',
			layout : 'hbox',
			items : [ {
				xtype : 'radiofield',
				boxLabel : i18n._('Disable refresh'),// 禁用刷新
				// width : 8,
				name : 'rb',
				inputValue : '2',
				listeners : {
					change : function(e, newValue, oldValue, eOpts) {
						vmRadioFlag = newValue;
						if (vmRadioFlag) {
							Ext.getCmp('combVMTime').disable();
							Ext.getCmp('numVMTime').disable();
						} else {
							Ext.getCmp('combVMTime').enable();
							Ext.getCmp('numVMTime').enable();
						}
					}
				}
			} ]
		} ],
		buttons : [
				{
					text : i18n._('OK'),
					handler : function() {
						vmRunner.stopAll();
						if (!vmRadioFlag) {
							var timeUnit = Ext.getCmp('combVMTime').getValue();
							if (timeUnit == 1) {
								vmRefreshPeriod = Ext.getCmp('numVMTime')
										.getValue();
							} else {
								vmRefreshPeriod = Ext.getCmp('numVMTime')
										.getValue() * 60;
							}
							vmTask = vmRunner.newTask({
								run : function() {
									// 虚拟机列表刷新
									if (instanceGrid.isVisible()) {
										instanceStore.load();
									}
								},
								interval : 1000 * vmRefreshPeriod
							});
							vmTask.start();
						}
						refreshWin.hide();
					}
				}, {
					text : i18n._('Cancel'),
					handler : function() {
						vmRefreshReset();// 刷新设置重置
						refreshWin.hide();
					}
				} ]
	}
});
var refreshSetBtn = Ext.create('Ext.Button', {
	text : '<font id="nodeadd" color="#ee8800" >' + i18n._('Refresh Setting')
			+ '</font>',
	handler : function() {
		refreshWin.show();
	}
});
// 虚拟机列表模板
var instanceModel = Ext.define('InstanceAdminVo', {
	extend : 'Ext.data.Model',
	fields : [ 'vmId', 'vmName', 'remark', 'outComments', 'hostName',
			'taskState', 'ipInner', 'ipOuter', 'cpuCore', 'memory', 'disk',
			'cpuUsage', 'memoryUsage', 'diskUsage', 'vmOS',
			'applicationSystemName', 'vmStatus', 'hostAliases', 'referenceId',
			{
				name : 'createTime',
				type : 'date',
				dateFormat : 'time'
			}, 'isEnable', 'userName', 'zoneCode', 'sysUser',
			'iopsMonitorDetailBean', 'netMonitorDetailBean',
			'diskMonitorDetailBean', 'cpuLimit', 'diskRead', 'diskWrite',
			'bandWidthIn', 'bandWidthOut', 'ipConnectionIn', 'allIn', 'allOut',
			'ipConnectionOut', 'tcpConnectionIn', 'tcpConnectionOut',
			'udpConnectionIn', 'udpConnectionOut', 'processState',
			'applicationSystemName' ],//
	idProperty : 'vmId'
});
// 虚拟机详情模板
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
		name : 'applicationSystemName',
		mapping : 'applicationSystemName',
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
	}, {
		name : 'extdisks',
		mapping : 'extdisks'
	}, {
		name : 'zoneCode',
		mapping : 'zoneCode'
	}, {
		name : 'zoneName',
		mapping : 'zoneName'
	}
	// ,{
	// name : 'remark',
	// mapping : 'remark'
	// }
	]
});
// //虚拟机备注模板
// var remarkModel = Ext.define('remarkModel', {
// extend : 'Ext.data.Model',
// fields : [ {
// name : 'remark',
// mapping : 'remark',
// type : 'string'
// } ]
// });
// 虚拟机列表Store
loadTimes = 0
var instanceStore = Ext.create('Ext.data.Store', {
	model : 'InstanceAdminVo',
	pageSize : listPageSize,// 每页显示16条数据
	// remoteSort : true,
	autoLoad : false,
	remoteSort : true,
	proxy : new Ext.data.proxy.Ajax({
		url : path + '/../monitoring/oss!findVmDetails.action?hostName='
				+ nodeName + '&zoneCode=' + zoneCode,
		reader : {
			type : 'json',
			root : 'resultObject.result',
			totalProperty : 'resultObject.totalCount'
		},
		timeout : 60000,// 请求超时时间：由30秒调整为60秒
		listeners : {
			exception : function(reader, response, error, eOpts) {
				v_mask.hide();
				ajaxException(reader, response, error, eOpts);
			}
		}
	}),
	listeners : {
		beforeload : function(instanceStore, operation, eOpts) {
			// 遮罩层
			if (loadTimes == 0) {
				v_mask = new Ext.LoadMask(Ext.getBody(), {
					// msg : i18n._('please wait'),
					removeMask : true
				});
				v_mask.show();
			}
			loadTimes = loadTimes + 1;
		},
		load : function(instanceStore, records, successful, eOpts) {
			global_records = records.length;
			// 遮罩层
			// var v_mask = new Ext.LoadMask(Ext.getBody(), {
			// msg : i18n._('please wait'),
			// removeMask : true
			// });
			v_mask.hide();
			var refreshDate = new Date();
			// alert(refreshDate);
			lastRefreshTimeField.setValue(Ext.util.Format.date(refreshDate,
					'H:i:s'));
			instanceGrid.reconfigure(instanceStore);
		}
	}
});

// 历史监控
var vmHistorywindow = Ext.create('Ext.window.Window', {
	title : i18n._('history_monitor'),// 历史监控
	// renderTo : Ext.getBody(),
	width : 1000,
	height : 500,
	resizable : false,
	closable : false,
	constrain : true,
	modal : true,
	tools : [ {
		type : 'close',
		handler : function() {
			vmRefreshReset();// 刷新设置重置
			// clearData();
			vmHistorywindow.hide();
		}
	} ],
	layout : 'fit',// border
	items : [ {
		xtype : 'panel',
		region : 'center',
		collapsible : false,
		layout : 'fit',
		items : vmHistoryPanel
	} ]
});
// VM详细
// 虚拟机机器号
var vmUUIDDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,// 200
	labelWidth : 150,// 80
	fieldLabel : i18n._('machineNum')
// 机器号
});
// 虚拟机名称
var vmNameDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,// 200
	labelWidth : 150,// 80
	fieldLabel : i18n._('vm_name')
// 主机名称
});
// //虚拟机备注
// var remarkField = Ext.create('Ext.form.field.Display', {//
// width : 300,//200
// labelWidth : 150,//80
// fieldLabel : i18n._('remark')//主机名称
// });
// CPU信息
var vmCPUDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,// 200
	labelWidth : 150,// 80
	fieldLabel : i18n._('CPU')
});
// Memory信息
var vmMEMDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,// 200
	labelWidth : 150,// 80
	fieldLabel : i18n._('MEM')
});
// Disk信息
var vmDiskDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,// 200
	labelWidth : 150,// 80
	fieldLabel : i18n._('DISK')
});
// 扩展盘信息
var vmExtDiskDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,// 200
	labelWidth : 150,// 80
	fieldLabel : i18n._('extDisk')
});
// Network信息
var vmNeworkDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,// 200
	labelWidth : 150,// 80
	fieldLabel : i18n._('Network')
});
// IP信息
var vmIPDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,// 200
	labelWidth : 150,// 80
	fieldLabel : i18n._('IP')
});
// OS信息
var vmOSDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,// 200
	labelWidth : 150,// 80
	fieldLabel : i18n._('OS')
});
// zone信息
var vmZoneDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,// 200
	labelWidth : 150,// 80
	fieldLabel : i18n._('zoneName')
});
// 套餐名称
var taocanNameDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,// 200
	labelWidth : 150,// 80
	fieldLabel : i18n._('ServiceCatalog_name')
// 套餐名
});
// 套餐生效时间
var taocanDateDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,// 200
	labelWidth : 150,// 80
	fieldLabel : i18n._('ServiceCatalog_createDate')
// 套餐生效日期
});
// 套餐已使用天数
var taocanUsedDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,// 200
	labelWidth : 150,// 80
	fieldLabel : i18n._('used')
// 已使用
});
// 套餐剩余时间
var taocanRemainDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,// 200
	labelWidth : 150,// 80
	fieldLabel : i18n._('free')
// 剩余
});
// 订单编号
var orderNumDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,// 200
	labelWidth : 150,// 80
	fieldLabel : i18n._('order_id')
// 订单编号
});
// 订单时间
var orderDateDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,// 200
	labelWidth : 150,// 80
	fieldLabel : i18n._('OrderCreateDate')
// 订单时间
});
// 计费方式
var billingModelDetailField = Ext.create('Ext.form.field.Display', {//
	hidden : false,
	width : 300,// 200
	labelWidth : 150,// 80
	fieldLabel : i18n._('ChargingMode')
// 计费方式
});
// 价格
var priceDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,// 200
	labelWidth : 150,// 80
	fieldLabel : i18n._('Price')
// 价格
});
// 所有者
var ownerDetailField = Ext.create('Ext.form.field.Display', {//
	width : 300,// 200
	labelWidth : 150,// 80
	fieldLabel : i18n._('Owner')
// 价格
});
// var appNameDetailField = Ext.create('Ext.form.field.Display', {//
// width : 300,// 200
// labelWidth : 150,// 80
// fieldLabel : i18n._('applicationSystemName')
// });
// 虚拟机详细信息Form（点详细后弹出的框中的form）
var detailVMForm = Ext.create('Ext.form.Panel', {
	frame : true,
	autoScroll : true,
	// title: 'Form Fields',
	// width: 250,
	bodyPadding : 5,
	fieldDefaults : {
		labelAlign : 'left',
		labelWidth : 60,
		anchor : '100%'
	},
	items : [ vmUUIDDetailField, vmNameDetailField, vmCPUDetailField,
			vmMEMDetailField, vmDiskDetailField, vmExtDiskDetailField,
			vmNeworkDetailField, vmIPDetailField, vmOSDetailField,
			vmZoneDetailField, taocanNameDetailField, taocanDateDetailField,
			taocanUsedDetailField, taocanRemainDetailField,
			orderNumDetailField, orderDateDetailField, billingModelDetailField,
			priceDetailField, ownerDetailField ]
//
});
// 虚拟备注Form
var RemarkFormPanel = Ext
		.create(
				'Ext.form.Panel',
				{
					width : '440',
					height : '400',
					border : false,
					bodyPadding : 10,
					autoScroll : true,
					fieldDefaults : {
						labelAlign : 'right',
						labelWidth : 60,
						anchor : '100%'
					},
					items : [ {
						fieldLabel : i18n._('vmId'),// 备注
						id : 'rm_vmId',
						xtype : 'textarea',
						hidden : true
					}, {
						fieldLabel : i18n._('inner_remark'),// 内部备注
						id : 'rm_remark',
						xtype : 'textarea',
						maxLength : 256
					}, {
						fieldLabel : i18n._('outComments'),// 外部备注
						id : 'rm_outComments',
						xtype : 'textarea',
						maxLength : 255
					} ],
					buttons : [
							{
								text : i18n._('OK'),
								handler : function() {
									var editPanel = RemarkFormPanel;
									if (editPanel.form.isValid()) {
										var remark = editPanel.getComponent(
												'rm_remark').getValue();
										var outComments = editPanel
												.getComponent('rm_outComments')
												.getValue();
										var vmId = editPanel.getComponent(
												'rm_vmId').getValue();
										Ext.Ajax
												.request({
													url : path
															+ '/../ops/ops!updateComments.action',
													method : 'POST',
													params : {
														'id' : vmId,
														'comments' : remark,
														'outComments' : outComments,
													},
													success : function(
															response, options) {
														var obj = Ext
																.decode(response.responseText);
														if (obj == null
																|| obj.success == null) {
															Ext.MessageBox
																	.show({
																		title : i18n
																				._('errorNotice'),
																		msg : i18n
																				._('returnNull'),
																		buttons : Ext.MessageBox.OK,
																		icon : Ext.MessageBox.ERROR,
																	});// INFO,QUESTION,WARNING,ERROR
															return;
														}
														if (!obj.success) {
															Ext.MessageBox
																	.show({
																		title : i18n
																				._('errorNotice'),
																		msg : obj.resultMsg,
																		buttons : Ext.MessageBox.OK,
																		icon : Ext.MessageBox.WARNING,
																		fn : reLoadData
																	});
															return;
														}
														Ext.MessageBox
																.show({
																	title : i18n
																			._('notice'),
																	msg : i18n
																			._('aleady modify'),
																	buttons : Ext.MessageBox.OK,
																	icon : Ext.MessageBox.INFO,
																	fn : reLoadData
																});
														remarkWin.hide();
													},
													failure : function(
															response, options) {
														Ext.MessageBox
																.show({
																	title : i18n
																			._('errorNotice'),
																	msg : i18n
																			._('returnError'),
																	buttons : Ext.MessageBox.OK,
																	icon : Ext.MessageBox.WARNING,
																	fn : reLoadData
																});
													}
												});
									}
									;
								}
							}, {
								text : i18n._('Cancel'),
								handler : function() {
									vmRefreshReset();// 刷新设置重置
									RemarkFormPanel.getForm().reset();
									remarkWin.hide();
								}
							} ]
				});
// 所有弹出窗
var createVMWin = Ext.create('Ext.window.Window', {
	// title:i18n._('创建虚拟机'), // 创建虚拟机
	width : 650,// 400
	height : 500,
	// autoDestroy : true,
	closable : false,
	constrain : true,
	modal : true,
	tools : [ {
		type : 'close',
		handler : function() {
			vmRefreshReset();// 刷新设置重置
			createVMWin.getComponent(0).getForm().reset();
			createVMWin.remove(createVMWin.getComponent(0), false);
			createVMWin.hide();
		}
	} ],
	layout : 'fit',
	defaults : {
		split : false
	},
	items : []
});

var adjustVMWin = Ext.create('Ext.window.Window', {
	// title:i18n._('创建虚拟机'), // 创建虚拟机
	width : 650,// 400
	height : 330,
	// autoDestroy : true,
	closable : false,
	constrain : true,
	modal : true,
	tools : [ {
		type : 'close',
		handler : function() {
			vmRefreshReset();// 刷新设置重置
			adjustVMWin.getComponent(0).getForm().reset();
			adjustVMWin.remove(adjustVMWin.getComponent(0), false);
			adjustVMWin.hide();
		}
	} ],
	layout : 'fit',
	defaults : {
		split : false
	},
	items : []
});
var deleteVMWin = Ext.create('Ext.window.Window', {// 'Ext.window.MessageBox'
	title : i18n._('notice'),// '删除提示',notice
	width : 300,// 400
	height : 100,
	closable : false,
	border : false,
	tools : [ {
		type : 'close',
		handler : function() {
			vmRefreshReset();// 刷新设置重置
			terminateFlag = '';
			deleteVMWin.getComponent(0).reset();
			deleteVMWin.hide();
		}
	} ],
	icon : 'images/icon-info.gif',
	items : [ {
		xtype : 'checkbox',
		// border:false,
		boxLabel : i18n._('AlsoDeleteTheConfigurationInformation'),// '同时删除配置信息'
		uncheckedValue : '',
		inputValue : 1,
		handler : function(checkbox, checked) {
			if (checked) {
				terminateFlag = 1;
			} else {
				terminateFlag = '';
			}
		}
	} ],
	buttons : [ {
		text : i18n._('OK'),
		handler : function() {
			// 遮罩层
			var v_mask = new Ext.LoadMask(Ext.getBody(), {
				msg : i18n._('please wait'),
				removeMask : true
			});
			v_mask.show();
			var del = Ext.Ajax.request({
				url : path + '/../ops/ops!terminateVm.action',
				method : 'POST',
				params : {
					'id' : vmid,
					'name' : vmname,
					'terminateFlag' : terminateFlag
				},
				success : function(form, action) {
					v_mask.hide();
					var obj = Ext.decode(form.responseText);
					if (obj == null || obj.success == null) {
						Ext.MessageBox.show({
							title : i18n._('errorNotice'),
							msg : i18n._('returnNull'),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						});// INFO,QUESTION,WARNING,ERROR
						return;
					}
					if (!obj.success) {
						Ext.MessageBox.show({
							title : i18n._('errorNotice'),
							msg : i18n._(obj.resultMsg),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING,
							fn : function() {
								getSessionUser();
							}
						});
						return;
					}
					if (obj.resultCode == '00000') {
						Ext.MessageBox.show({
							title : i18n._('notice'),
							msg : i18n._('delete successfully'),
							icon : Ext.MessageBox.INFO,
							buttons : Ext.MessageBox.OK,
							fn : reLoadData
						});
					}
				},
				failure : function(form, action) {
					v_mask.hide();
					Ext.MessageBox.show({
						title : i18n._('errorNotice'),
						msg : i18n._('operateFail'),
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.WARNING,
						fn : reLoadData
					});
				}
			});
			deleteVMWin.getComponent(0).reset();
			deleteVMWin.hide();
		}
	}, {
		text : i18n._('Cancel'),
		handler : function() {
			vmRefreshReset();// 刷新设置重置
			terminateFlag = '';
			deleteVMWin.getComponent(0).reset();
			deleteVMWin.hide();
		}
	} ]
});
// 点击详情后框中显示的信息的store
var vmDetailStore = Ext
		.create(
				'Ext.data.Store',
				{
					model : 'vmDetailModel',
					proxy : {
						type : 'ajax',
						url : path
								+ '/../monitoring/monitor!getVmDetailInfo.action',
						reader : {
							type : 'json',
							root : 'resultObject.result',
							totalProperty : 'resultObject.totalCount'
						},
						listeners : {
							exception : function(reader, response, error, eOpts) {
								ajaxException(reader, response, error, eOpts);
							}
						}
					},
					autoLoad : false,// true
					listeners : {
						load : function(vmDetailStore, records, successful,
								eOpts) {
							if (successful && vmDetailStore.getCount() > 0) {
								var taocanDate = Ext.Date.format(vmDetailStore
										.getAt(0).get('catalogDate'), 'Y-m-d');
								var orderDate = Ext.Date.format(vmDetailStore
										.getAt(0).get('orderDate'),
										'Y-m-d H:i:s');
								var billingModel = vmDetailStore.getAt(0).get(
										'billingModel');
								var catalogName = vmDetailStore.getAt(0).get(
										'catalogName');
								if (billingModel == 3 && catalogName != null
										&& catalogName != '') {
									billingModel = i18n._('One time pay');
								} else if (billingModel == 2
										&& catalogName != null
										&& catalogName != '') {
									billingModel = i18n._('ByHour');
								} else if (billingModel == 1
										&& catalogName != null
										&& catalogName != '') {
									billingModel = i18n._('ByMonth');
								} else if (billingModel != ""
										&& billingModel == 0
										&& catalogName != null
										&& catalogName != '') {
									billingModel = i18n._('ByYear');
								} else {
									billingModel = '';
								}
								var catalogRemain = vmDetailStore.getAt(0).get(
										'catalogRemain');
								if (catalogRemain > 0) {
									catalogRemain = getUseFreeLong(vmDetailStore
											.getAt(0).get('catalogRemain'));
								} else if (billingModel != '') {
									catalogRemain = i18n._('maturity');
								} else {
									catalogRemain = '';
								}
								var taocanUsed = getUseFreeLong(vmDetailStore
										.getAt(0).get('catalogUsed'));
								var price = vmDetailStore.getAt(0).get('price');
								var cpuDetail = '';
								// alert(orderDate);
								vmUUIDDetailField.setValue(vmDetailStore.getAt(
										0).get('vmId'));
								vmNameDetailField.setValue(vmDetailStore.getAt(
										0).get('vmName'));
								if (vmDetailStore.getAt(0).get('cpuType') == null
										|| vmDetailStore.getAt(0)
												.get('cpuType') == '') {
									cpuDetail = vmDetailStore.getAt(0).get(
											'cpuCore')
											+ i18n._('core');
								} else {
									cpuDetail = vmDetailStore.getAt(0).get(
											'cpuType')
											+ '×'
											+ vmDetailStore.getAt(0).get(
													'cpuCore') + i18n._('core');
								}
								vmCPUDetailField.setValue(cpuDetail);
								vmMEMDetailField.setValue(vmDetailStore
										.getAt(0).get('memory')
										+ 'M');
								vmDiskDetailField.setValue(vmDetailStore.getAt(
										0).get('disk')
										+ 'G');
								var extDisk = vmDetailStore.getAt(0).get(
										'extdisks');
								var extDiskCapacity = '';
								if (extDisk != null) {
									for (var i = 0; i < extDisk.length; i++) {
										extDiskCapacity = extDiskCapacity
												+ extDisk[i].ed_capacity + 'G;';
									}
								}
								vmExtDiskDetailField.setValue(extDiskCapacity);
								if (vmDetailStore.getAt(0).get('network') != null
										&& vmDetailStore.getAt(0)
												.get('network') != ''
										&& vmDetailStore.getAt(0)
												.get('network') != 0) {
									vmNeworkDetailField.setValue(vmDetailStore
											.getAt(0).get('network')
											+ 'M');
								}
								if (vmDetailStore.getAt(0).get('ipInner') != ''
										&& vmDetailStore.getAt(0)
												.get('ipOuter') != '') {
									var ipOuterVal = vmDetailStore.getAt(0)
											.get('ipOuter');
									if (ipOuterVal.split(",").length > 13) {
										var ipVal_ = "";
										for (var i = 0; i < 6; i++) {
											ipVal_ += ipOuterVal.split(",")[i]
													+ ",";
										}
										// 换一行存放7-13的IP
										ipVal_ += "<br/>";
										for (var i = 6; i < 13; i++) {
											ipVal_ += ipOuterVal.split(",")[i]
													+ ",";
										}
										ipVal_ += "<br/>";
										// 换一行存放第13个以后的IP
										for (var i = 13; i < ipOuterVal
												.split(",").length; i++) {
											ipVal_ += ipOuterVal.split(",")[i]
													+ ",";
										}
										ipVal_ = ipVal_.substr(0,
												ipVal_.length - 1);
										vmIPDetailField.setValue(vmDetailStore
												.getAt(0).get('ipInner')
												+ '/' + ipVal_);
									} else if (ipOuterVal.split(",").length > 6) {
										var ipVal_ = "";
										for (var i = 0; i < 6; i++) {
											ipVal_ += ipOuterVal.split(",")[i]
													+ ",";
										}
										ipVal_ += "<br/>";
										// 换一行存放第6个以后的IP
										for (var i = 6; i < ipOuterVal
												.split(",").length; i++) {
											ipVal_ += ipOuterVal.split(",")[i]
													+ ",";
										}
										ipVal_ = ipVal_.substr(0,
												ipVal_.length - 1);
										vmIPDetailField.setValue(vmDetailStore
												.getAt(0).get('ipInner')
												+ '/' + ipVal_);
									} else {
										vmIPDetailField.setValue(vmDetailStore
												.getAt(0).get('ipInner')
												+ '/' + ipOuterVal);
									}
								} else {
									vmIPDetailField.setValue(vmDetailStore
											.getAt(0).get('ipInner')
											+ vmDetailStore.getAt(0).get(
													'ipOuter'));
								}
								vmOSDetailField.setValue(vmDetailStore.getAt(0)
										.get('vmOS'));
								vmZoneDetailField.setValue(vmDetailStore.getAt(
										0).get('zoneName'));
								taocanNameDetailField.setValue(catalogName);
								taocanDateDetailField.setValue(taocanDate);
								taocanUsedDetailField.setValue(taocanUsed);
								taocanRemainDetailField.setValue(catalogRemain);
								orderNumDetailField.setValue(vmDetailStore
										.getAt(0).get('orderNumber'));
								orderDateDetailField.setValue(orderDate);
								billingModelDetailField.setValue(billingModel);
								if (price == null || price == '') {
									priceDetailField.setValue('');
								} else {
									priceDetailField.setValue(price
											+ i18n._('cny'));// + '/'+
									// vmDetailStore.getAt(0).get('priceUnit')
								}
								createVMWin.setTitle(i18n._('Details'));// 详情
								createVMWin.add(detailVMForm);
								createVMWin.show();
							} else {
								createVMWin.hide();
							}
						}
					}
				});
// 远程连接客户端连接参数的FieldSet
var connectParamFieldSet = Ext
		.create(
				'Ext.form.FieldSet',
				{
					xtype : 'fieldset',
					border : false,
					padding : '0 0 0 0',
					layout : 'column',
					items : [
							{
								fieldLabel : i18n._('vncTip3'),
								xtype : "textfield",
								style : 'font-color:grey;',
								width : 230, // 200
								labelWidth : 140, // 80
								id : 'codeField', // 验证码输入框
								listeners : {
									focus : function() {
										// 验证码输入框获取焦点时，更新验证码
										var time = Math.random();
										var url = "./user_mgmt/image!getImageCode.action"
												+ "?time=" + time;
										var value = '<img id="imageCode" alt="" title="看不清，换一个！" src="'
												+ url + '">';
										Ext.getCmp('imageCode').setValue(value);
									}
								}
							},
							{
								xtype : "displayfield",
								style : 'font-color:grey;',
								style : 'margin-left:10px',
								value : '<img alt="" title="看不清，换一个！" src="./user_mgmt/image!getImageCode.action" style="cursor:pointer">',
								id : 'imageCode',
								listeners : {
									render : function() {
										Ext
												.fly(this.el)
												.on(
														'click',
														function(e, t) {
															// 验证码输入框获取焦点时，更新验证码
															var time = Math
																	.random();
															var url = "./user_mgmt/image!getImageCode.action"
																	+ "?time="
																	+ time;
															var value = '<img id="imageCode" alt="" title="看不清，换一个！" src="'
																	+ url
																	+ '">';
															Ext
																	.getCmp(
																			'imageCode')
																	.setValue(
																			value);
														});
									}
								}
							},
							{
								xtype : 'button',
								text : '确定',
								id : 'confirmValidCode',
								width : 50,
								margin : '0 0 0 10',
								handler : function(button) {
									remoteConnectionForm.getComponent(4)
											.setValue("");
									var codeField = Ext.getCmp("codeField")
											.getValue();
									if (codeField == null || codeField == "") {
										Ext.MessageBox.show({
											title : i18n._('notice'),
											msg : i18n._('inputValidCode'),
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.WARNING
										});
										return;
									}
									Ext.Ajax
											.request({
												url : path
														+ '/../ops/ops!getClientVNC.action',
												method : 'POST',
												params : {
													'id' : selectedVMUuid,
													"code" : Ext.getCmp(
															"codeField")
															.getValue()
												},
												success : function(response,
														options) {
													var obj = Ext
															.decode(response.responseText);
													if (!obj.success) {
														Ext.MessageBox
																.show({
																	title : i18n
																			._('errorNotice'),
																	msg : obj.resultMsg,
																	buttons : Ext.MessageBox.OK,
																	icon : Ext.MessageBox.WARNING,
																	fn : function() {
																		getSessionUser();
																	}
																});
														return;
													} else {
														var connectionParam = '<font style="color:green">远程连接: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
																+ obj.resultObject.proxyIP
																+ ":"
																+ obj.resultObject.proxyPort
																+ "&nbsp;"
																+ i18n
																		._('vncTip4')
																+ "</font>";
														remoteConnectionForm
																.getComponent(4)
																.setValue(
																		connectionParam);
													}
												},
												failure : function(response,
														options) {
													Ext.MessageBox
															.show({
																title : i18n
																		._('errorNotice'),
																msg : i18n
																		._('returnError'),
																buttons : Ext.MessageBox.OK,
																icon : Ext.MessageBox.WARNING,
																fn : reLoadData
															});
												}
											});
									Ext.getCmp('codeField').setValue("");
								}
							} ]
				});
// 远程连接Form
var remoteConnectionForm = Ext
		.create(
				'Ext.form.FormPanel',
				{
					width : '480',
					height : '220',
					border : false,
					autoScroll : true,
					fieldDefaults : {
						labelAlign : 'right',
						labelWidth : 60,
						anchor : '100%'
					},
					items : [
							{
								xtype : "displayfield",
								style : 'font-color:grey;',
								width : 300, // 200
								value : '<img src="images/load_wait.gif" style="margin-left: 200px;margin-top:10px;"/>'
							},
							{
								fieldLabel : i18n._('vncTip1'),
								xtype : "displayfield",
								style : 'font-color:grey;',
								width : 450, // 200
								labelWidth : 283
							// 80
							},
							{
								fieldLabel : i18n._('vncTip2'),
								xtype : "displayfield",
								style : 'font-color:grey;',
								width : 450, // 200
								labelWidth : 140, // 80
								editable : false,
								readOnly : true,
								renderer : function(value) {
									return "<a href='../../download/vncviewer/tvnviewer.exe'>"
											+ i18n._('downloadClient') + "</a>";
								}
							}, connectParamFieldSet, {
								fieldLabel : "",
								xtype : "displayfield",
								style : 'font-color:green;',
								margin : '-10 0 0 53',
								width : 450, // 200
								labelWidth : 283
							// 80
							} ]
				});
// 远程连接win
var remoteConnectionWin = Ext.create('Ext.window.Window', {
	width : 455,
	height : 210,
	title : i18n._('vncRequesting'),
	closable : false,
	constrain : true,
	modal : true,
	tools : [ {
		type : 'close',
		handler : function() {
			vmRefreshReset();// 刷新设置重置
			remoteConnectionForm.getForm().reset();
			remoteConnectionWin.hide();
		}
	} ],
	layout : 'fit',
	defaults : {
		split : false
	},
	items : [ remoteConnectionForm ]
});

function checkPassword(array, letter) {
	for (var index = 0; index < array.length; index++) {
		if (letter == array[index]) {
			return true;
		}
	}
	return false;
}
// 修改密码提交
function passwordSubmit() {

	var password = Ext.getCmp('password').getValue();
	var confirmPassword = Ext.getCmp('confirmPassword').getValue();
	var digitals = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
	var lowerCaseLetters = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
			'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
			'x', 'v', 'y', 'z' ];
	var upperCaseLetters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
			'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',
			'X', 'V', 'Y', 'Z' ];

	var digitalFlag = false;
	var lowerLetterFlag = false;
	var upperLetterFlag = false;
	if (!passwordForm.getForm().isValid()) {
		return;
	}

	// 判断是否 包含非法字符
	var pattern = /^([A-Za-z0-9]{1,})$/;
	if (!pattern.test(password)) {
		Ext.MessageBox.show({
			title : i18n._('notice'),
			msg : i18n._('containsIllegalChar'),
			icon : Ext.MessageBox.INFO,
			buttons : Ext.MessageBox.OK
		});
		return;
	}

	for (var i = 0; i < password.length; i++) {
		if (checkPassword(digitals, password[i]) == true) {
			digitalFlag = true;
		} else if (checkPassword(lowerCaseLetters, password[i]) == true) {
			lowerLetterFlag = true;
		} else if (checkPassword(upperCaseLetters, password[i]) == true) {
			upperLetterFlag = true;
		} else {
			return;
		}
	}

	if (digitalFlag == false || lowerLetterFlag == false
			|| upperLetterFlag == false) {
		Ext.MessageBox.show({
			title : i18n._('notice'),
			msg : i18n._('passwordStyleErr'),
			icon : Ext.MessageBox.INFO,
			buttons : Ext.MessageBox.OK
		});
		return;
	}
	if (Ext.getCmp('password').isValid()
			&& Ext.getCmp('confirmPassword').isValid()) {
		if (Ext.getCmp('password').getValue() == Ext.getCmp('confirmPassword')
				.getValue()) {
			Ext.Ajax.request({
				url : path + '/../ops/ops!resetSystemPwd.action',
				params : {
					"vmId" : vmid,
					"password" : Ext.getCmp('sysUser').getValue() + '/'
							+ Ext.getCmp('password').getValue()
				},
				success : function(response) {
					var obj = Ext.decode(response.responseText);
					if (obj.success) {
						Ext.MessageBox.show({
							title : i18n._('notice'),
							msg : i18n._('Edit Success!'),
							icon : Ext.MessageBox.INFO,
							buttons : Ext.MessageBox.OK,
							fn : vmRefreshReset()
						// 刷新设置重置
						});
						passwordForm.getForm().reset();
						passwordWin.hide();
					} else {
						Ext.MessageBox.show({
							title : i18n._('notice'),
							msg : obj.resultMsg,
							icon : Ext.MessageBox.INFO,
							buttons : Ext.MessageBox.OK,
							fn : function() {
								vmRefreshReset();// 刷新设置重置
								getSessionUser();
							}
						});
					}
				}
			});
		} else {
			Ext.MessageBox.show({
				title : i18n._('notice'),
				msg : i18n._('Two inputed passwords do not match'),
				icon : Ext.MessageBox.INFO,
				buttons : Ext.MessageBox.OK,
				fn : vmRefreshReset()
			// 刷新设置重置
			});
		}
	}
}
// 修改管理员密码
var passwordForm = Ext.create('Ext.form.FormPanel', {
	width : '440',
	height : '400',
	border : false,
	bodyPadding : 10,
	autoScroll : true,
	fieldDefaults : {
		labelAlign : 'right',
		labelWidth : 60,
		anchor : '100%'
	},
	items : [ {
		fieldLabel : i18n._('username'),
		name : "title",
		id : 'sysUser',
		xtype : "textfield",
		style : 'font-color:grey;',
		allowBlank : false,
		maxLength : 20,
		disabled : true,
		enforceMaxLength : true
	}, {
		fieldLabel : i18n._('password'),
		name : "title",
		id : 'password',
		xtype : "textfield",
		inputType : 'password',
		allowBlank : false,
		emptyText : i18n._('please input password'),
		minLength : 6,
		maxLength : 30,
		enforceMaxLength : true
	}, {
		fieldLabel : i18n._('comfirm password'),
		id : 'confirmPassword',
		name : "content",
		xtype : "textfield",
		inputType : 'password',
		emptyText : i18n._('please input password'),
		allowBlank : false,
		minLength : 6,
		maxLength : 30,
		enforceMaxLength : true
	} ],
	buttons : [ {
		text : i18n._('OK'),
		handler : passwordSubmit
	}, {
		text : i18n._('Cancel'),
		handler : function() {
			vmRefreshReset();// 刷新设置重置
			passwordForm.getForm().reset();
			passwordWin.hide();
		}
	} ]

});
// 修改密码win
var passwordWin = Ext.create('Ext.window.Window', {
	width : 220,// 400
	height : 200,
	title : i18n._('resetPassword'),
	closable : false,
	constrain : true,
	modal : true,
	tools : [ {
		type : 'close',
		handler : function() {
			vmRefreshReset();// 刷新设置重置
			passwordForm.getForm().reset();
			passwordWin.hide();
		}
	} ],
	layout : 'fit',
	defaults : {
		split : false
	},
	items : [ passwordForm ]
});
// 备注窗口
var remarkWin = Ext.create('Ext.window.Window', {
	title : i18n._('remark'),
	closable : false,
	constrain : true,
	width : 380,
	autoHeight : true,
	plain : true,
	modal : true,
	tools : [ {
		type : 'close',
		handler : function() {
			vmRefreshReset();// 刷新设置重置
			RemarkFormPanel.getForm().reset();
			remarkWin.hide();
		}
	} ],
	layout : 'fit',
	defaults : {
		split : false
	},
	items : [ RemarkFormPanel ]
});

var sellAction = Ext.create('Ext.Action', {
	icon : 'images/gotovmmonitor.png', // Use a URL in the icon config
	text : i18n._('vmmonitor'),
	// disabled: true,
	handler : function(widget, event) {
		var rec = instanceGrid.getSelectionModel().getSelection()[0];
		if (rec) {
			// Ext.example.msg('Sell', 'Sell ' + rec.get('company'));
			// document.getElementsByTagName('iframe')[0].src='hc_admin_vmPage.html?vmID='+rec.get('vmId');
			window.location.href = 'hc_admin_vmPage.html?vmID='
					+ rec.get('vmId');
			setParamCookie("vmID", rec.get('vmId'));
		}
	}
});
// 右键菜单
var contextMenu = Ext.create('Ext.menu.Menu', {
// items : [ sellAction ]
});
// 分页序号
Ext.grid.PageRowNumberer = Ext.extend(Ext.grid.RowNumberer, {
	baseCls : Ext.baseCSSPrefix + 'column-header ' + Ext.baseCSSPrefix
			+ 'unselectable',
	cls : Ext.baseCSSPrefix + 'row-numberer',
	tdCls : Ext.baseCSSPrefix + "grid-cell-special",
	renderer : function(value, cellmeta, record, rowIndex, columnIndex, store) {
		return (store.currentPage - 1) * store.pageSize + rowIndex + 1;
	}
});
var instanceGrid = Ext
		.create(
				'Ext.grid.Panel',
				{
					autoWidth : true,
					store : instanceStore,
					// stateful : true,
					// frame : true,
					// border : false,
					selModel : Ext.create('Ext.selection.CheckboxModel', {
						mode : "SIMPLE"
					}),
					selType : 'cellmodel',
					iconCls : 'icon-grid',
					columnLines : true,
					bbar : Ext.create('Ext.toolbar.Paging', {
						store : instanceStore,
						displayInfo : true,
						inputItemWidth : pagingBarPageNumWidth,
						beforePageText : i18n._('beforePageText'),// "第"
						firstText : i18n._('firstText'),// "第一页"
						prevText : i18n._('prevText'),// "上一页"
						nextText : i18n._('nextText'),// "下一页"
						lastText : i18n._('lastText'),// "最后页"
						refreshText : i18n._('refreshText'),// "刷新"
						items : [ lastRefreshTimeField, refreshSetBtn ]
					}),
					// sorters : [ "vmId" ],
					viewConfig : {
						stripeRows : true,
						forceFit : true
					},
					dockedItems : [ {
						xtype : 'toolbar',
						layout : {
							overflowHandler : 'Menu'
						},
						cls : 'toolbarCSS',
						items : [
								{
									xtype : 'button',
									text : '<font id="vmcreate" color="#ffffff" >'
											+ i18n._('Create') + '</font>',// 创建
									listeners : {
										"mouseout" : function() {
											document.getElementById("vmcreate").style.color = "white";
										},
										"mouseover" : function() {
											document.getElementById("vmcreate").style.color = "black";
										}

									},
									icon : 'images/add.png',// ../../images/control_play_blue.png
									handler : function() {
										getSessionUser();
										vmRunner.stopAll();// 停止刷新
										vmCreateDiskArray = [];
										resetCreateVMForm();
										createVMWin
												.setTitle(i18n._('CreateVM'));// 创建虚拟机
										createVMWin.add(createVMForm);
										createVMWin.show();
									}
								},
								{
									xtype : 'button',
									text : '<font id="vmdelete" color="#ffffff" >'
											+ i18n._('delete') + '</font>',// 删除
									listeners : {
										"mouseout" : function() {
											document.getElementById("vmdelete").style.color = "white";
										},
										"mouseover" : function() {
											document.getElementById("vmdelete").style.color = "black";
										}

									},
									icon : 'images/delete.png',// ../../images/cross.gif
									handler : function() {
										getSessionUser();
										var row = instanceGrid
												.getSelectionModel()
												.getSelection();
										if (row.length == 0) {
											Ext.MessageBox.show({
												title : i18n._('notice'),
												msg : i18n._('selectOne'),
												icon : Ext.MessageBox.INFO,
												buttons : Ext.MessageBox.OK
											});
											return;
										}
										// 查看是否选择的是多行
										// if (row.length > 1) {
										// Ext.MessageBox.show({
										// title : i18n._('notice'),
										// msg : i18n._('This is not possible,
										// only select a row'),
										// icon : Ext.MessageBox.INFO,
										// buttons : Ext.MessageBox.OK
										// });
										// return;
										// }
										vmid='';
										vmname='';
										// 新增批量删除
										if (row.length > 1) {
											
											Ext.MessageBox
													.confirm(
															i18n._('submit'),
															i18n
																	._('confirmTerminate'),
															function(btn) {
																if (btn == 'yes') {
																	for (var i = 0; i < row.length; i++) {
																		var vmidtemp = row[i]
																				.get('vmId') == '' ? '1'
																				: row[i]
																						.get('vmId');
																		vmid += vmidtemp
																				+ ','
																		vmname += row[i]
																				.get('vmName')
																				+ ','
																	}

																	// 遮罩层
																	var v_mask = new Ext.LoadMask(
																			Ext
																					.getBody(),
																			{
																				msg : i18n
																						._('please wait'),
																				removeMask : true
																			});
																	v_mask
																			.show();
																	var delAll = Ext.Ajax
																			.request({
																				url : path
																						+ '/../ops/ops!terminateVm.action',
																				method : 'POST',
																				params : {
																					'name' : vmname,
																					'id' : vmid,
																					'terminateFlag' : 1
																				},
																				success : function(
																						form,
																						action) {
																					v_mask
																							.hide();
																					var obj = Ext
																							.decode(form.responseText);
																					if (obj == null
																							|| obj.success == null) {
																						Ext.MessageBox
																								.show({
																									title : i18n
																											._('errorNotice'),
																									msg : i18n
																											._('returnNull'),
																									buttons : Ext.MessageBox.OK,
																									icon : Ext.MessageBox.ERROR
																								});// INFO,QUESTION,WARNING,ERROR
																						return;
																					}
																					if (!obj.success) {
																						Ext.MessageBox
																								.show({
																									title : i18n
																											._('errorNotice'),
																									msg : obj.resultMsg,
																									buttons : Ext.MessageBox.OK,
																									icon : Ext.MessageBox.WARNING
																								});
																						return;
																					}
																					if (obj.resultCode == '00000') {
																						Ext.MessageBox
																								.show({
																									title : i18n
																											._('notice'),
																									msg : i18n
																											._('delete successfully'),
																									icon : Ext.MessageBox.INFO,
																									buttons : Ext.MessageBox.OK,
																									fn : reLoadData
																								});
																					}
																				},
																				failure : function(
																						form,
																						action) {
																					v_mask
																							.hide();
																					Ext.MessageBox
																							.show({
																								title : i18n
																										._('errorNotice'),
																								msg : i18n
																										._('operateFail'),
																								buttons : Ext.MessageBox.OK,
																								icon : Ext.MessageBox.WARNING,
																								fn : reLoadData
																							});
																				}
																			});

																}
															})

										} else {
											var id = row[0].get('vmId');
											vmid = id;
											var vmName = row[0].get('vmName');
											var record = instanceGrid
													.getStore().getById(id);
											// vmid = ''
											// vmname = ''

											var taskStatus = row[0]
													.get('taskState');

											if (taskStatus) {
												Ext.MessageBox
														.show({
															title : i18n
																	._('notice'),
															msg : i18n
																	._('vm is processing task'),
															icon : Ext.MessageBox.INFO,
															buttons : Ext.MessageBox.OK
														});
												return;
											}
											var status = row[0].get('vmStatus');
											if (status != 'noInstance') {
												if (status == 'BUILDING') {
													Ext.MessageBox
															.show({
																title : i18n
																		._('notice'),
																msg : i18n
																		._('delete_error'),
																icon : Ext.MessageBox.INFO,
																buttons : Ext.MessageBox.OK
															});
													vmRefreshReset();// 刷新设置重置
													return;
												}
												deleteVMWin.show();
											}

											if (status == 'noInstance') {

												Ext.MessageBox
														.confirm(
																i18n
																		._('submit'),
																i18n
																		._('confirmTerminate'),
																function(btn) {
																	if (btn == 'yes') {

																		// 遮罩层
																		var v_mask = new Ext.LoadMask(
																				Ext
																						.getBody(),
																				{
																					msg : i18n
																							._('please wait'),
																					removeMask : true
																				});
																		v_mask
																				.show();
																		var delAll = Ext.Ajax
																				.request({
																					url : path
																							+ '/../ops/ops!terminateVm.action',
																					method : 'POST',
																					params : {
																						'name' : vmName,
																						'id' : 1,
																						'terminateFlag' : 1
																					},
																					success : function(
																							form,
																							action) {
																						v_mask
																								.hide();
																						var obj = Ext
																								.decode(form.responseText);
																						if (obj == null
																								|| obj.success == null) {
																							Ext.MessageBox
																									.show({
																										title : i18n
																												._('errorNotice'),
																										msg : i18n
																												._('returnNull'),
																										buttons : Ext.MessageBox.OK,
																										icon : Ext.MessageBox.ERROR
																									});// INFO,QUESTION,WARNING,ERROR
																							return;
																						}
																						if (!obj.success) {
																							Ext.MessageBox
																									.show({
																										title : i18n
																												._('errorNotice'),
																										msg : obj.resultMsg,
																										buttons : Ext.MessageBox.OK,
																										icon : Ext.MessageBox.WARNING
																									});
																							return;
																						}
																						if (obj.resultCode == '00000') {
																							Ext.MessageBox
																									.show({
																										title : i18n
																												._('notice'),
																										msg : i18n
																												._('delete successfully'),
																										icon : Ext.MessageBox.INFO,
																										buttons : Ext.MessageBox.OK,
																										fn : reLoadData
																									});
																						}
																					},
																					failure : function(
																							form,
																							action) {
																						v_mask
																								.hide();
																						Ext.MessageBox
																								.show({
																									title : i18n
																											._('errorNotice'),
																									msg : i18n
																											._('operateFail'),
																									buttons : Ext.MessageBox.OK,
																									icon : Ext.MessageBox.WARNING,
																									fn : reLoadData
																								});
																					}
																				});
																	} else {
																		vmRefreshReset();// 刷新设置重置
																	}

																})
											}
										}
									}
								},
								{
									xtype : 'button',
									text : '<font id="passwordFontId" color="#ffffff" >'
											+ i18n._('password') + '</font>',// 修改密码
									listeners : {
										"mouseout" : function() {
											document
													.getElementById("passwordFontId").style.color = "white";
										},
										"mouseover" : function() {
											document
													.getElementById("passwordFontId").style.color = "black";
										}

									},
									icon : 'images/password.png',// ../../images/control_play_blue.png
									handler : function() {
										getSessionUser();
										var row = instanceGrid
												.getSelectionModel()
												.getSelection();
										// 查看是否选择的是多行
										if (row.length > 1) {
											Ext.MessageBox
													.show({
														title : i18n
																._('notice'),
														msg : i18n
																._('This is not possible, only select a row'),
														icon : Ext.MessageBox.INFO,
														buttons : Ext.MessageBox.OK
													});
											return;
										}

										if (row.length == 0) {
											Ext.MessageBox.show({
												title : i18n._('notice'),
												msg : i18n._('selectOne'),
												icon : Ext.MessageBox.INFO,
												buttons : Ext.MessageBox.OK
											});
											return;
										} else {
											var id = row[0].get('vmId');
											vmid = row[0].get('vmId');
											var record = instanceGrid
													.getStore().getById(id);
											var sysUser = record.get('sysUser');
											if (!(record.get('vmStatus') == "ACTIVE")
													|| record.get('taskState')) {
												Ext.MessageBox
														.show({
															title : i18n
																	._('notice'),
															msg : i18n
																	._('ACTIVE and NOTASK'),
															icon : Ext.MessageBox.INFO,
															buttons : Ext.MessageBox.OK
														});
												return;
											}
											passwordForm.getForm().reset();
											Ext.getCmp('sysUser').setValue(
													sysUser);
											passwordWin.show();
										}

										// 查看是否选择的是多行
										if (row.length > 1) {
											Ext.MessageBox
													.show({
														title : i18n
																._('notice'),
														msg : i18n
																._('This is not possible, only select a row'),
														icon : Ext.MessageBox.INFO,
														buttons : Ext.MessageBox.OK
													});
											return;
										}

									}
								},
								'-',
								{
									xtype : 'button',
									text : '<font id="vmstart" color="#ffffff" >'
											+ i18n._('start') + '</font>',// 启动
									listeners : {
										"mouseout" : function() {
											document.getElementById("vmstart").style.color = "white";
										},
										"mouseover" : function() {
											document.getElementById("vmstart").style.color = "black";
										}

									},
									icon : 'images/start.png',// ../../images/control_play_blue.png
									handler : function() {
										getSessionUser();
										var row = instanceGrid
												.getSelectionModel()
												.getSelection();
										if (row.length == 0) {
											Ext.MessageBox.show({
												title : i18n._('notice'),
												msg : i18n._('selectOne'),
												icon : Ext.MessageBox.INFO,
												buttons : Ext.MessageBox.OK
											});
											return;
										}
										// 查看是否选择的是多行
										if (row.length > 1) {
											Ext.MessageBox
													.show({
														title : i18n
																._('notice'),
														msg : i18n
																._('This is not possible, only select a row'),
														icon : Ext.MessageBox.INFO,
														buttons : Ext.MessageBox.OK
													});
											return;
										}
										var id = row[0].get('vmId');
										var record = instanceGrid.getStore()
												.getById(id);
										var vmid = record.get('vmId');
										var status = record.get('vmStatus');
										var isEnable = record.get('isEnable');
										// 获取当前的任务状态并判断
										var taskState1 = record
												.get('taskState');
										if (taskState1 != "") {
											Ext.MessageBox
													.show({
														title : i18n
																._('notice'),
														msg : i18n
																._('taskState_error'),
														icon : Ext.MessageBox.INFO,
														buttons : Ext.MessageBox.OK
													});
											vmRefreshReset();// 刷新设置重置
											return;
										}
										//判断云主机的使用状态
										if (isEnable != 0) {
											Ext.MessageBox
													.show({
														title : i18n
																._('notice'),
														msg : i18n
																._('VmIsEnable'),
														icon : Ext.MessageBox.INFO,
														buttons : Ext.MessageBox.OK
													});
											vmRefreshReset();// 刷新设置重置
											return;
										}
										// 判断当前云主机的状态
										if (status == 'ACTIVE') {
											Ext.MessageBox.show({
												title : i18n._('notice'),
												msg : i18n._('openError'),
												icon : Ext.MessageBox.INFO,
												buttons : Ext.MessageBox.OK
											});
											vmRefreshReset();// 刷新设置重置
											return;
										}
										if (status == 'noInstance') {
											Ext.MessageBox.show({
												title : i18n._('notice'),
												msg : i18n._('undeply_error'),
												icon : Ext.MessageBox.INFO,
												buttons : Ext.MessageBox.OK
											});
											vmRefreshReset();// 刷新设置重置
											return;
										}
										if (status == 'SUSPENDED'
												|| status == 'SHUTOFF'
												|| status == 'STOPPED') {
											var start = Ext.Ajax
													.request({
														url : path
																+ '/../ops/ops!startVM.action',
														method : 'POST',
														params : 'id=' + vmid,
														success : function(
																form, action) {
															var obj = Ext
																	.decode(form.responseText);
															if (!obj.success) {
																Ext.MessageBox
																		.show({
																			title : i18n
																					._('errorNotice'),
																			msg : obj.resultMsg,
																			buttons : Ext.MessageBox.OK,
																			icon : Ext.MessageBox.WARNING
																		});
																return;
															}
															if (obj.resultCode == '00000') {
																Ext.MessageBox
																		.show({
																			title : i18n
																					._('notice'),
																			msg : i18n
																					._('operationMessage'),
																			icon : Ext.MessageBox.INFO,
																			buttons : Ext.MessageBox.OK,
																			fn : reLoadData
																		});
															}
														},
														failure : function(
																form, action) {
															Ext.MessageBox
																	.show({
																		title : i18n
																				._('errorNotice'),
																		msg : i18n
																				._('operateFail'),
																		buttons : Ext.MessageBox.OK,
																		icon : Ext.MessageBox.WARNING
																	});
														}
													});
											vmRefreshReset();// 刷新设置重置
										} else {
											Ext.MessageBox.show({
												title : i18n._('notice'),
												msg : i18n._('start_error'),
												icon : Ext.MessageBox.INFO,
												buttons : Ext.MessageBox.OK
											});
											vmRefreshReset();// 刷新设置重置
											return;
										}
									}
								},
								{
									xtype : 'button',
									text : '<font id="vmreboot" color="#ffffff" >'
											+ i18n._('REBOOT') + '</font>',// 重启
									listeners : {
										"mouseout" : function() {
											document.getElementById("vmreboot").style.color = "white";
										},
										"mouseover" : function() {
											document.getElementById("vmreboot").style.color = "black";
										}
									},
									icon : 'images/reboot.png',// ../../images/control_repeat_blue.png
									handler : function() {
										getSessionUser();
										var row = instanceGrid
												.getSelectionModel()
												.getSelection();

										// 查看是否选择的是多行
										if (row.length > 1) {
											Ext.MessageBox
													.show({
														title : i18n
																._('notice'),
														msg : i18n
																._('This is not possible, only select a row'),
														icon : Ext.MessageBox.INFO,
														buttons : Ext.MessageBox.OK
													});
											return;
										}
										if (row.length == 0) {
											Ext.MessageBox.show({
												title : i18n._('notice'),
												msg : i18n._('selectOne'),
												icon : Ext.MessageBox.INFO,
												buttons : Ext.MessageBox.OK
											});
										} else {
											var id = row[0].get('vmId');
											var record = instanceGrid
													.getStore().getById(id);
											var vmid = record.get('vmId');
											var status = record.get('vmStatus');
											var isEnable = record.get('isEnable');
											//判断云主机的使用状态
											if (isEnable != 0) {
												Ext.MessageBox
														.show({
															title : i18n
																	._('notice'),
															msg : i18n
																	._('VmIsEnable'),
															icon : Ext.MessageBox.INFO,
															buttons : Ext.MessageBox.OK
														});
												vmRefreshReset();// 刷新设置重置
												return;
											}
											// 获取当前的任务状态并判断
											var taskState1 = record
													.get('taskState');
											if (taskState1 != "") {
												Ext.MessageBox
														.show({
															title : i18n
																	._('notice'),
															msg : i18n
																	._('taskState_error'),
															icon : Ext.MessageBox.INFO,
															buttons : Ext.MessageBox.OK
														});
												vmRefreshReset();// 刷新设置重置
												return;
											}
											if (status == 'noInstance') {
												Ext.MessageBox
														.show({
															title : i18n
																	._('notice'),
															msg : i18n
																	._('undeply_error'),
															icon : Ext.MessageBox.INFO,
															buttons : Ext.MessageBox.OK
														});
												vmRefreshReset();// 刷新设置重置
												return;
											}
											if (status == 'ACTIVE'
													|| status == 'SUSPENDING'
													|| status == 'SHUTOFF') {
												Ext.MessageBox
														.confirm(
																i18n
																		._('submit'),
																i18n
																		._('confirmReboot'),
																function(btn) {
																	if (btn == 'yes') {
																		var start = Ext.Ajax
																				.request({
																					url : path
																							+ '/../ops/ops!rebootVM.action',
																					method : 'POST',
																					params : 'id='
																							+ vmid,
																					success : function(
																							form,
																							action) {
																						var obj = Ext
																								.decode(form.responseText);
																						if (!obj.success) {
																							Ext.MessageBox
																									.show({
																										title : i18n
																												._('errorNotice'),
																										msg : obj.resultMsg,
																										buttons : Ext.MessageBox.OK,
																										icon : Ext.MessageBox.WARNING
																									});
																							return;
																						}
																						if (obj.resultCode == '00000') {
																							Ext.MessageBox
																									.show({
																										title : i18n
																												._('notice'),
																										msg : i18n
																												._('operationMessage'),
																										icon : Ext.MessageBox.INFO,
																										buttons : Ext.MessageBox.OK,
																										fn : reLoadData
																									});
																						}
																					},
																					failure : function(
																							form,
																							action) {
																						Ext.MessageBox
																								.show({
																									title : i18n
																											._('errorNotice'),
																									msg : i18n
																											._('operateFail'),
																									buttons : Ext.MessageBox.OK,
																									icon : Ext.MessageBox.WARNING
																								});
																					}
																				});
																		vmRefreshReset();// 刷新设置重置
																	} else {
																		vmRefreshReset();// 刷新设置重置
																	}
																});
											} else {
												Ext.MessageBox.show({
													title : i18n._('notice'),
													msg : i18n
															._('reboot_error'),
													icon : Ext.MessageBox.INFO,
													buttons : Ext.MessageBox.OK
												});
												vmRefreshReset();// 刷新设置重置
												return;
											}
										}
									}
								},
								{
									xtype : 'button',
									text : '<font id="vmclose" color="#ffffff" >'
											+ i18n._('CLOSE') + '</font>',// 关闭
									listeners : {
										"mouseout" : function() {
											document.getElementById("vmclose").style.color = "white";
										},
										"mouseover" : function() {
											document.getElementById("vmclose").style.color = "black";
										}

									},
									icon : 'images/close.png',// ../../images/control_stop_blue.png
									handler : function() {
										getSessionUser();
										var row = instanceGrid
												.getSelectionModel()
												.getSelection();
										// 查看是否选择的是多行
										if (row.length > 1) {
											Ext.MessageBox
													.show({
														title : i18n
																._('notice'),
														msg : i18n
																._('This is not possible, only select a row'),
														icon : Ext.MessageBox.INFO,
														buttons : Ext.MessageBox.OK
													});
											return;
										}
										if (row.length == 0) {
											Ext.MessageBox.show({
												title : i18n._('notice'),
												msg : i18n._('selectOne'),
												icon : Ext.MessageBox.INFO,
												buttons : Ext.MessageBox.OK
											});
										} else {
											var id = row[0].get('vmId');
											var record = instanceGrid
													.getStore().getById(id);
											var vmid = record.get('vmId');
											var status = record.get('vmStatus');
											//判断云主机的使用状态
											var isEnable = record.get('isEnable');
											if (isEnable != 0) {
												Ext.MessageBox
														.show({
															title : i18n
																	._('notice'),
															msg : i18n
																	._('VmIsEnable'),
															icon : Ext.MessageBox.INFO,
															buttons : Ext.MessageBox.OK
														});
												vmRefreshReset();// 刷新设置重置
												return;
											}
											// 获取当前的任务状态并判断
											var taskState1 = record
													.get('taskState');
											if (taskState1 != "") {
												Ext.MessageBox
														.show({
															title : i18n
																	._('notice'),
															msg : i18n
																	._('taskState_error'),
															icon : Ext.MessageBox.INFO,
															buttons : Ext.MessageBox.OK
														});
												vmRefreshReset();// 刷新设置重置
												return;
											}
											if (status == 'noInstance') {
												Ext.MessageBox
														.show({
															title : i18n
																	._('notice'),
															msg : i18n
																	._('undeply_error'),
															icon : Ext.MessageBox.INFO,
															buttons : Ext.MessageBox.OK
														});
												vmRefreshReset();// 刷新设置重置
												return;
											}
											if (status == 'ACTIVE') {
												Ext.MessageBox
														.confirm(
																i18n
																		._('submit'),
																i18n
																		._('confirmClose'),
																function(btn) {
																	if (btn == 'yes') {
																		var start = Ext.Ajax
																				.request({
																					url : path
																							+ '/../ops/ops!closeVM.action',
																					method : 'POST',
																					params : 'id='
																							+ vmid,
																					success : function(
																							form,
																							action) {
																						var obj = Ext
																								.decode(form.responseText);
																						if (!obj.success) {
																							Ext.MessageBox
																									.show({
																										title : i18n
																												._('errorNotice'),
																										msg : obj.resultMsg,
																										buttons : Ext.MessageBox.OK,
																										icon : Ext.MessageBox.WARNING
																									});
																							return;
																						}
																						if (obj.resultCode == '00000') {
																							Ext.MessageBox
																									.show({
																										title : i18n
																												._('notice'),
																										msg : i18n
																												._('operationMessage'),
																										icon : Ext.MessageBox.INFO,
																										buttons : Ext.MessageBox.OK,
																										fn : reLoadData
																									});
																						}
																					},
																					failure : function(
																							form,
																							action) {
																						Ext.MessageBox
																								.show({
																									title : i18n
																											._('errorNotice'),
																									msg : i18n
																											._('operateFail'),
																									buttons : Ext.MessageBox.OK,
																									icon : Ext.MessageBox.WARNING
																								});
																					}
																				});
																		vmRefreshReset();// 刷新设置重置
																	} else {
																		vmRefreshReset();// 刷新设置重置
																	}
																});
											} else {
												Ext.MessageBox.show({
													title : i18n._('notice'),
													msg : i18n
															._('reboot_error'),
													icon : Ext.MessageBox.INFO,
													buttons : Ext.MessageBox.OK
												});
												vmRefreshReset();// 刷新设置重置
												return;
											}
										}
									}
								},
								{
									xtype : 'button',
									hidden : false,
									text : '<font id="osRepair" color="#ffffff" >'
											+ i18n._('osRepair') + '</font>',// 系统修复,主机修复
									listeners : {
										"mouseout" : function() {
											document.getElementById("osRepair").style.color = "white";
										},
										"mouseover" : function() {
											document.getElementById("osRepair").style.color = "black";
										}

									},
									icon : 'images/close.png',// ../../images/control_stop_blue.png
									handler : function() {
										getSessionUser();
										var row = instanceGrid
												.getSelectionModel()
												.getSelection();
										// 查看是否选择的是多行
										if (row.length > 1) {
											Ext.MessageBox
													.show({
														title : i18n
																._('notice'),
														msg : i18n
																._('This is not possible, only select a row'),
														icon : Ext.MessageBox.INFO,
														buttons : Ext.MessageBox.OK
													});
											return;
										}
										if (row.length == 0) {
											Ext.MessageBox.show({
												title : i18n._('notice'),
												msg : i18n._('selectOne'),
												icon : Ext.MessageBox.INFO,
												buttons : Ext.MessageBox.OK
											});
										} else {
											var refId = row[0]
													.get('referenceId');
											var id = row[0].get('vmId');
											var record = instanceGrid
													.getStore().getById(id);
											var status = record.get('vmStatus');
											var vmName = record.get('vmName');
											if (status == 'BUILDING'
													|| status == 'ERROR') {
												Ext.MessageBox
														.confirm(
																i18n
																		._('submit'),
																i18n
																		._('confirmOSRepair'),
																function(btn) {
																	if (btn == 'yes') {
																		var start = Ext.Ajax
																				.request({
																					url : path
																							+ '/../ops/ops!syncInstanceFromOpenstack.action',
																					method : 'POST',
																					params : 'referenceId='
																							+ refId,
																					success : function(
																							form,
																							action) {
																						var obj = Ext
																								.decode(form.responseText);
																						if (!obj.success) {
																							Ext.MessageBox
																									.show({
																										title : i18n
																												._('errorNotice'),
																										msg : obj.resultMsg,
																										buttons : Ext.MessageBox.OK,
																										icon : Ext.MessageBox.WARNING
																									});
																							return;
																						}
																						if (obj.resultObject) {
																							Ext.MessageBox
																									.show({
																										title : i18n
																												._('notice'),
																										msg : "修复失败，主机名："
																												+ vmName
																												+ "在openstack 存在两个。",
																										icon : Ext.MessageBox.INFO,
																										buttons : Ext.MessageBox.OK,
																										fn : reLoadData
																									});
																						}

																					},
																					failure : function(
																							form,
																							action) {
																						Ext.MessageBox
																								.show({
																									title : i18n
																											._('errorNotice'),
																									msg : i18n
																											._('operateFail'),
																									buttons : Ext.MessageBox.OK,
																									icon : Ext.MessageBox.WARNING
																								});
																					}
																				});
																		vmRefreshReset();// 刷新设置重置
																	} else {
																		vmRefreshReset();// 刷新设置重置
																	}
																});
											} else {
												Ext.MessageBox
														.show({
															title : i18n
																	._('notice'),
															msg : "对不起，只能对生成中和错误的机器进行修复。",
															icon : Ext.MessageBox.INFO,
															buttons : Ext.MessageBox.OK
														});
												vmRefreshReset();// 刷新设置重置
												return;
											}
										}
									}
								},
								'-',
								{
									xtype : 'button',
									text : '<font id="vmmigrate" color="#ffffff" >'
											+ i18n._('Migrate') + '</font>',// 迁移
									listeners : {
										"mouseout" : function() {
											document
													.getElementById("vmmigrate").style.color = "white";
										},
										"mouseover" : function() {
											document
													.getElementById("vmmigrate").style.color = "black";
										}

									},
									icon : 'images/migrate.png',// ../../images/control_play_blue.png
									handler : function() {
										getSessionUser();
										var row = instanceGrid
												.getSelectionModel()
												.getSelection();
										if (row.length == 0) {
											Ext.MessageBox.show({
												title : i18n._('notice'),
												msg : i18n._('selectOne'),
												icon : Ext.MessageBox.INFO,
												buttons : Ext.MessageBox.OK
											});
											return;
										}
										hostNameArray = [];
										vmIdArray = [];
										vmZoneArray = [];
										for (var i = 0; i < row.length; i++) {
											vmIdArray[i] = row[i].get('vmId');
											var record = instanceGrid
													.getStore().getById(
															vmIdArray[i]);
											var status = record.get('vmStatus');
											// 获取当前的任务状态并判断
											var taskState1 = record
													.get('taskState');
											if (taskState1 != "") {
												Ext.MessageBox
														.show({
															title : i18n
																	._('notice'),
															msg : i18n
																	._('taskState_error'),
															icon : Ext.MessageBox.INFO,
															buttons : Ext.MessageBox.OK
														});
												vmRefreshReset();// 刷新设置重置
												return;
											}
											//判断云主机的使用状态
											var isEnable = record.get('isEnable');
											if (isEnable != 0) {
												Ext.MessageBox
														.show({
															title : i18n
																	._('notice'),
															msg : i18n
																	._('VmIsEnable'),
															icon : Ext.MessageBox.INFO,
															buttons : Ext.MessageBox.OK
														});
												vmRefreshReset();// 刷新设置重置
												return;
											}
											hostNameArray[i] = record
													.get('hostName');
											vmZoneArray[i] = record
													.get('zoneCode');
											vmZoneArray[i] = vmZoneArray[i]
													.split("$")[0];
											if (status != 'ACTIVE') {
												Ext.MessageBox.show({
													title : i18n._('notice'),
													msg : i18n
															._('reboot_error'),
													icon : Ext.MessageBox.INFO,
													buttons : Ext.MessageBox.OK
												});
												return;
											}

											vmCPUUsedArray[i] = record
													.get('cpuCore')
													* record.get('cpuUsage')
													/ 100;
											vmMemoryUsedArray[i] = record
													.get('memory')
													* record.get('memoryUsage')
													/ 100;
											vmMemoryUsedArray[i] = record
													.get('disk')
													* record.get('diskUsage')
													/ 100;
										}
										var zoneCodeArray = uniqueHandle(vmZoneArray);
										var hostNameArrays = uniqueHandle(hostNameArray);
										vmNodeList.setValue(hostNameArrays
												.toString());
										var vmCPUUsedCount = countSize(vmCPUUsedArray);
										var vmMemoryUsedCount = countSize(vmMemoryUsedArray);
										var vmDiskUsedCount = countSize(vmMemoryUsedArray);
										vmid = vmIdArray.toString();
										if (zoneCodeArray.length > 1) {
											Ext.MessageBox
													.show({
														title : i18n
																._('notice'),
														msg : i18n
																._('vmMigrateZoneWarning'),
														icon : Ext.MessageBox.INFO,
														buttons : Ext.MessageBox.OK
													});
											return;
										}
										zoneCode = zoneCodeArray[0];
										// alert("-------zoneCode------:"+zoneCode);
										vmZoneCode.setValue(zoneCode);
										createVMWin.setTitle(i18n._('Migrate'));// 迁移
										vmMigrateFindNodeGrid.store.removeAll();
										createVMWin.add(migrateVMForm);
										createVMWin.show();
										AutMigratePictureCompent
												.setVisible(true);
										vmCPUUsed.setValue(vmCPUUsedCount);
										vmMemoryUsed
												.setValue(vmMemoryUsedCount);
										vmDiskUsed.setValue(vmDiskUsedCount);
										vmZoneCode.setValue(zoneCode);

									}
								},
								{
									xtype : 'button',
									text : '<font id="vmadjust" color="#ffffff" >'
											+ i18n._('Adjust') + '</font>',// 调整
									listeners : {
										"mouseout" : function() {
											document.getElementById("vmadjust").style.color = "white";
										},
										"mouseover" : function() {
											document.getElementById("vmadjust").style.color = "black";
										}
									},
									// disabled:true,
									icon : 'images/adjust.png',// ../../images/control_play_blue.png
									handler : function() {
										getSessionUser();
										var row = instanceGrid
												.getSelectionModel()
												.getSelection();
										// alert('***'+row);
										// 查看是否选择的是多行
										if (row.length > 1) {
											Ext.MessageBox
													.show({
														title : i18n
																._('notice'),
														msg : i18n
																._('This is not possible, only select a row'),
														icon : Ext.MessageBox.INFO,
														buttons : Ext.MessageBox.OK
													});
											return;
										}
										//判断云主机的使用状态
										var isEnable = row[0].get('isEnable');
										if (isEnable != 0) {
											Ext.MessageBox
													.show({
														title : i18n
																._('notice'),
														msg : i18n
																._('VmIsEnable'),
														icon : Ext.MessageBox.INFO,
														buttons : Ext.MessageBox.OK
													});
											vmRefreshReset();// 刷新设置重置
											return;
										}
										if (row.length == 0) {
											Ext.MessageBox.show({
												title : i18n._('notice'),
												msg : i18n._('selectOne'),
												icon : Ext.MessageBox.INFO,
												buttons : Ext.MessageBox.OK
											});
											return;
										}
										var id = row[0].get('vmId');
										var vmName = row[0].get('vmName');
										var vmCPUCore = row[0].get('cpuCore');
										var vmRam = row[0].get('memory');
										// var vmDisk=row[0].get('disk');
										var vmIP = row[0].get('ipOuter');
										floatingIp = vmIP
										var vmOwner = row[0].get('userName');
										var vmZoneCode = new String(row[0]
												.get('zoneCode'));
										var arrayOfStrings = vmZoneCode
												.split("$");
										var allIn = (row[0].get('allIn') > 0 ? row[0]
												.get('allIn')
												: 1);
										var allOut = (row[0].get('allOut') > 0 ? row[0]
												.get('allOut')
												: 1);
										var bandWidthIn = (row[0]
												.get('bandWidthIn') > 0 ? row[0]
												.get('bandWidthIn')
												: 1);
										var bandWidthOut = (row[0]
												.get('bandWidthOut') > 0 ? row[0]
												.get('bandWidthOut')
												: 1);
										var ipConnectionIn = (row[0]
												.get('ipConnectionIn') > 0 ? row[0]
												.get('ipConnectionIn')
												: 2500);
										var ipConnectionOut = (row[0]
												.get('ipConnectionOut') > 0 ? row[0]
												.get('ipConnectionOut')
												: 6000);
										var tcpConnectionIn = (row[0]
												.get('tcpConnectionIn') > 0 ? row[0]
												.get('tcpConnectionIn')
												: 2000);
										var tcpConnectionOut = (row[0]
												.get('tcpConnectionOut') > 0 ? row[0]
												.get('tcpConnectionOut')
												: 4000);
										var udpConnectionIn = (row[0]
												.get('udpConnectionIn') > 0 ? row[0]
												.get('udpConnectionIn')
												: 500);
										var udpConnectionOut = (row[0]
												.get('udpConnectionOut') > 0 ? row[0]
												.get('udpConnectionOut')
												: 2000);
										vmZoneCode = arrayOfStrings[0];
										var vmIpOuter = vmIP;
										var vmIpData = [];
										if (vmIP != null) {
											vmIpData = getSplitString(vmIP, ",");
										}
										outerIpAdjustContainer.removeAll(true);
										for (var i = 0; i < vmIpData.length; i++) {
											if (vmIpData[i] != "") {
												var IpShowField = Ext
														.create(
																'Ext.form.field.Text',
																{
																	id : 'ipShowField'
																			+ vmIpData[i],
																	width : 100,
																	margin : '0 0 0 85',
																	editable : false,
																	readOnly : true
																});
												IpShowField
														.setValue(vmIpData[i]);
												var vmIPDeleteBtn = Ext
														.create(
																'Ext.Button',
																{
																	itemId : vmIpData[i],
																	text : '×',// 删除IP
																	handler : function() {
																		var delIP = this
																				.getItemId();
																		Ext.MessageBox
																				.confirm(
																						i18n
																								._('submit'),
																						i18n
																								._('Are you sure to delete'),
																						function(
																								btn) {
																							if (btn == 'yes') {
																								outerIpAdjustContainer
																										.remove(
																												Ext
																														.getCmp('ipShowContainer'
																																+ vmIPDeleteBtn
																																		.getItemId()),
																												true);
																								var updateVmIP = Ext.Ajax
																										.request({
																											url : path
																													+ '/../ops/ops!deleteIPOfVm.action',
																											method : 'POST',
																											params : {
																												'id' : id,
																												'oldIP' : delIP
																											},
																											success : function(
																													form,
																													action) {
																												v_mask
																														.hide();
																												var obj = Ext
																														.decode(form.responseText);
																												if (obj == null
																														|| obj.success == null) {
																													Ext.MessageBox
																															.show({
																																title : i18n
																																		._('errorNotice'),
																																msg : i18n
																																		._('returnNull'),
																																buttons : Ext.MessageBox.OK,
																																icon : Ext.MessageBox.ERROR
																															});// INFO,QUESTION,WARNING,ERROR
																													return;
																												}
																												if (!obj.success) {
																													Ext.MessageBox
																															.show({
																																title : i18n
																																		._('errorNotice'),
																																msg : i18n
																																		._('外网IP地址不存在！'),
																																buttons : Ext.MessageBox.OK,
																																icon : Ext.MessageBox.ERROR
																															});
																													return;
																												}
																												if (obj.resultCode == '00000') {
																													Ext.MessageBox
																															.show({
																																title : i18n
																																		._('notice'),
																																msg : i18n
																																		._('operationMessage'),// 调整成功
																																icon : Ext.MessageBox.INFO,
																																buttons : Ext.MessageBox.OK,
																																fn : function() {
																																	reLoadData();
																																}
																															});
																												}
																												floatingIp = "";
																											},
																											failure : function(
																													form,
																													action) {
																												v_mask
																														.hide();
																												Ext.MessageBox
																														.show({
																															title : i18n
																																	._('errorNotice'),
																															msg : i18n
																																	._('operateFail'),
																															buttons : Ext.MessageBox.OK,
																															icon : Ext.MessageBox.ERROR,
																															fn : reLoadData
																														});
																											}
																										});
																							}
																							adjustVMForm
																									.getForm()
																									.reset();
																							createVMWin
																									.remove(
																											adjustVMForm,
																											false);
																							createVMWin
																									.hide();
																							v_mask
																									.show();
																						});

																	}
																});
												var IpAdjustFieldContainer = Ext
														.create(
																'Ext.form.FieldContainer',
																{
																	id : 'ipShowContainer'
																			+ vmIpData[i],
																	width : 400,
																	layout : 'hbox',
																	items : [
																			IpShowField,
																			vmIPDeleteBtn ]
																});
												outerIpAdjustContainer
														.add(IpAdjustFieldContainer);
											}
										}
										var record = instanceGrid.getStore()
												.getById(id);
										vmid = record.get('vmId');
										var status = record.get('vmStatus');
										// alert(configAdjustPanel.query('fieldcontainer').length);//
										for (var i = configAdjustPanel
												.query('fieldcontainer').length; i > 6; i--) {
											// alert(configAdjustPanel.query('fieldcontainer')[i-1].is('fieldcontainer'));
											configAdjustPanel
													.query('fieldcontainer')[i - 1]
													.removeAll(true);
										}

										if (status == 'ACTIVE') {
											resetAdjustVMForm();
											vmIdAdjustField.setValue(id);
											vmAdjustCPUStore.load();
											vmAdjustRamStore.load();
											// vmAdjustDiskStore.load();
											// vmAdjustExtDiskStore.load();
											vmAdjustIPStore.load({
												params : {
													'vmId' : id
												}
											});
											// vmAdjustUserStore.load();
											var proxy = vmAdjustVolumeStore
													.getProxy();
											proxy.setExtraParam('id', id);
											// vmAdjustVolumeStore.load();
											createVMWin.setTitle(i18n
													._('Adjust'));// 调整
											vmNameAdjustField.setValue(vmName);
											selectVmName = vmName;
											vmAdjustUserText.setValue(vmOwner);
											// DiskAdjustDisplayField.setValue(vmDisk+'G');//vmDisk
											RAMAdjustDisplayField
													.setValue(vmRam + 'M');
											// vmIPAdjustField.setValue(vmIpOuter);
											// vmOldIPAdjustField.setValue(vmIP);
											vmAdjustRamField.setValue(vmRam);
											// vmAdjustDiskField.setValue(vmDisk);
											vmAdjustCPUCoreField
													.setValue(vmCPUCore);
											resourceLimitAllBandwidthUp
													.setValue(allOut);
											resourceLimitAllBandwidthDown
													.setValue(allIn);
											resourceLimitBandwidthUp
													.setValue(bandWidthOut);
											resourceLimitBandwidthDown
													.setValue(bandWidthIn);
											resourceLimitIPConnectionsUp
													.setValue(ipConnectionOut);
											resourceLimitIPConnectionsDown
													.setValue(ipConnectionIn);
											resourceLimitTCPConnectionsUp
													.setValue(tcpConnectionOut);
											resourceLimitTCPConnectionsDown
													.setValue(tcpConnectionIn);
											resourceLimitUDPConnectionsUp
													.setValue(udpConnectionOut);
											resourceLimitUDPConnectionsDown
													.setValue(udpConnectionIn);
											// alert('vmlist
											// OldIp:'+vmOldIPAdjustField.getValue());
											adjustVMWin.add(adjustVMForm);// adjustTab
											adjustVMWin.show();
										} else {
											Ext.MessageBox.show({
												title : i18n._('notice'),
												msg : i18n._('reboot_error'),
												icon : Ext.MessageBox.INFO,
												buttons : Ext.MessageBox.OK
											});
											return;
										}
									}
								},
								'-',
								{
									xtype : 'button',
									icon : 'images/monitor.png',// ../../images/zoom.png
									text : '<font id="volumeManagement" color="#ffffff" >'
											+ i18n._('Volume Management')
											+ '</font>',// 监控
									listeners : {
										"mouseout" : function() {
											document
													.getElementById("volumeManagement").style.color = "white";
										},
										"mouseover" : function() {
											document
													.getElementById("volumeManagement").style.color = "black";
										}

									},
									// disabled:true,
									handler : function() {
										getSessionUser();
										var row = instanceGrid
												.getSelectionModel()
												.getSelection();
										// 查看是否选择的是多行
										if (row.length > 1) {
											Ext.MessageBox
													.show({
														title : i18n
																._('notice'),
														msg : i18n
																._('This is not possible, only select a row'),
														icon : Ext.MessageBox.INFO,
														buttons : Ext.MessageBox.OK
													});
											return;
										}
										if (row.length == 0) {
											Ext.MessageBox.show({
												title : i18n._('notice'),
												msg : i18n._('selectOne'),
												icon : Ext.MessageBox.INFO,
												buttons : Ext.MessageBox.OK

											});
										} else {
											vmZoneCodeDisk = '';
											var id = row[0].get('vmId');
											var record = instanceGrid
													.getStore().getById(id);
											var vmid = record.get('vmId');
											vmZoneCodeDisk = record
													.get('zoneCode');
											selectedVMUuid = vmid;
											//判断云主机的使用状态
											var isEnable = record.get('isEnable');
											if (isEnable != 0) {
												Ext.MessageBox
														.show({
															title : i18n
																	._('notice'),
															msg : i18n
																	._('VmIsEnable'),
															icon : Ext.MessageBox.INFO,
															buttons : Ext.MessageBox.OK
														});
												vmRefreshReset();// 刷新设置重置
												return;
											}
											var status = record.get('vmStatus');
											if (status == 'unDeployed') {
												Ext.MessageBox
														.show({
															title : i18n
																	._('notice'),
															msg : i18n
																	._('undeply_error'),
															icon : Ext.MessageBox.INFO,
															buttons : Ext.MessageBox.OK
														});
												return;
											}
											if (status == 'ACTIVE') {
												vmOwnerEmail = record
														.get("userName");
												var new_params = {
													'volumeBean.ownerEmail' : vmOwnerEmail,
													'volumeBean.vmId' : selectedVMUuid
												};
												Ext
														.apply(
																volumeStore.proxy.extraParams,
																new_params);
												volumeStore.loadPage(1, null);
												volumeManagementWin.show();
											}
											if (status != 'ACTIVE') {
												Ext.MessageBox.show({
													title : i18n._('notice'),
													msg : i18n
															._('reboot_error'),
													icon : Ext.MessageBox.INFO,
													buttons : Ext.MessageBox.OK
												});
												return;
											}
										}
									}
								},
								'-',
								{
									xtype : 'button',
									icon : 'images/monitor.png',// ../../images/zoom.png
									text : '<font id="vmmonitor" color="#ffffff" >'
											+ i18n._('monitor') + '</font>',// 监控
									listeners : {
										"mouseout" : function() {
											document
													.getElementById("vmmonitor").style.color = "white";
										},
										"mouseover" : function() {
											document
													.getElementById("vmmonitor").style.color = "black";
										}

									},
									// disabled:true,
									handler : function() {
										getSessionUser();
										var row = instanceGrid
												.getSelectionModel()
												.getSelection();
										// 查看是否选择的是多行
										if (row.length > 1) {
											Ext.MessageBox
													.show({
														title : i18n
																._('notice'),
														msg : i18n
																._('This is not possible, only select a row'),
														icon : Ext.MessageBox.INFO,
														buttons : Ext.MessageBox.OK
													});
											return;
										}
										if (row.length == 0) {
											Ext.MessageBox.show({
												title : i18n._('notice'),
												msg : i18n._('selectOne'),
												icon : Ext.MessageBox.INFO,
												buttons : Ext.MessageBox.OK

											});
										} else {
											var id = row[0].get('vmId');
											var record = instanceGrid
													.getStore().getById(id);
											var vmid = record.get('vmId');
											//判断云主机的使用状态
											var isEnable = record.get('isEnable');
											if (isEnable != 0) {
												Ext.MessageBox
														.show({
															title : i18n
																	._('notice'),
															msg : i18n
																	._('VmIsEnable'),
															icon : Ext.MessageBox.INFO,
															buttons : Ext.MessageBox.OK
														});
												vmRefreshReset();// 刷新设置重置
												return;
											}
											var status = record.get('vmStatus');
											if (status == 'unDeployed') {
												Ext.MessageBox
														.show({
															title : i18n
																	._('notice'),
															msg : i18n
																	._('undeply_error'),
															icon : Ext.MessageBox.INFO,
															buttons : Ext.MessageBox.OK
														});
												return;
											}
											if (status == 'ACTIVE') {
												// realTimeVMStore.removeAll();
												// proxy =
												// realTimeVMStore.getProxy();
												// proxy.setExtraParam('vmId',vmid)
												// ;
												// realTimeVMStore.load();

												setParamCookie("vmID", vmid);
												monitorVMCPUHistory();
												vmHistorywindow.show();
											}
											if (status != 'ACTIVE') {
												Ext.MessageBox.show({
													title : i18n._('notice'),
													msg : i18n
															._('reboot_error'),
													icon : Ext.MessageBox.INFO,
													buttons : Ext.MessageBox.OK
												});
												return;
											}
										}
									}
								},
								{
									xtype : 'button',
									text : '<font id="vmbackups" color="#ffffff" >'
											+ i18n._('backups') + '</font>',// 备份
									listeners : {
										"mouseout" : function() {
											document
													.getElementById("vmbackups").style.color = "white";
										},
										"mouseover" : function() {
											document
													.getElementById("vmbackups").style.color = "black";
										}

									},
									disabled : true,
									hidden : true,
									icon : 'images/backup.png',// ../../images/database_go.png
									handler : function() {
										getSessionUser();
										var row = instanceGrid
												.getSelectionModel()
												.getSelection();
										if (row.length == 0) {
											Ext.MessageBox.show({
												title : i18n._('notice'),
												msg : i18n._('selectOne'),
												icon : Ext.MessageBox.INFO,
												buttons : Ext.MessageBox.OK

											});
										} else {
											var id = row[0].get('vmId');
											var record = instanceGrid
													.getStore().getById(id);
											var vmid = record.get('vmId');
											var status = record.get('vmStatus');
											if (status == 'noInstance') {
												Ext.MessageBox
														.show({
															title : i18n
																	._('notice'),
															msg : i18n
																	._('undeply_error'),
															icon : Ext.MessageBox.INFO,
															buttons : Ext.MessageBox.OK
														});
												return;
											}
											if (status == 'ACTIVE') {
												Ext.MessageBox
														.confirm(
																i18n
																		._('submit'),
																i18n
																		._('confirmBackups'),
																function(btn) {
																	if (btn == 'yes') {
																		var vmBak = Ext.Ajax
																				.request({
																					url : path
																							+ '/../ops/ops!backupsVm.action',
																					method : 'POST',
																					params : 'id='
																							+ vmid,
																					success : function(
																							form,
																							action) {
																						var obj = Ext
																								.decode(form.responseText);
																						if (obj == null
																								|| obj.success == null) {
																							Ext.MessageBox
																									.show({
																										title : i18n
																												._('errorNotice'),
																										msg : i18n
																												._('returnNull'),
																										buttons : Ext.MessageBox.OK,
																										icon : Ext.MessageBox.ERROR
																									});// INFO,QUESTION,WARNING,ERROR
																							return;
																						}
																						if (!obj.success) {
																							Ext.MessageBox
																									.show({
																										title : i18n
																												._('errorNotice'),
																										msg : obj.resultMsg,
																										buttons : Ext.MessageBox.OK,
																										icon : Ext.MessageBox.WARNING
																									});
																							return;
																						}
																						instanceStore
																								.load();
																					},
																					failure : function(
																							form,
																							action) {
																						Ext.MessageBox
																								.show({
																									title : i18n
																											._('errorNotice'),
																									msg : i18n
																											._('operateFail'),
																									buttons : Ext.MessageBox.OK,
																									icon : Ext.MessageBox.WARNING
																								});
																					}
																				});
																	}
																});
											} else {
												Ext.MessageBox.show({
													title : i18n._('notice'),
													msg : i18n
															._('reboot_error'),
													icon : Ext.MessageBox.INFO,
													buttons : Ext.MessageBox.OK
												});
												return;
											}
										}
									}
								},
								{
									xtype : 'button',
									text : '<font id="vmrenew" color="#ffffff" >'
											+ i18n._('renew') + '</font>',// 还原
									listeners : {
										"mouseout" : function() {
											document
													.getElementById("vmbackups").style.color = "white";
										},
										"mouseover" : function() {
											document
													.getElementById("vmbackups").style.color = "black";
										}

									},
									disabled : true,
									hidden : true,
									icon : 'images/revert.png',// ../../images/database_refresh.png
									handler : function() {
										getSessionUser();
										var row = instanceGrid
												.getSelectionModel()
												.getSelection();
										if (row.length == 0) {
											Ext.MessageBox.show({
												title : i18n._('notice'),
												msg : i18n._('selectOne'),
												icon : Ext.MessageBox.INFO,
												buttons : Ext.MessageBox.OK

											});
										} else {
											var id = row[0].get('vmId');
											var record = instanceGrid
													.getStore().getById(id);
											var vmid = record.get('vmId');
											var status = record.get('vmStatus');
											if (status == 'noInstance') {
												Ext.MessageBox
														.show({
															title : i18n
																	._('notice'),
															msg : i18n
																	._('undeply_error'),
															icon : Ext.MessageBox.INFO,
															buttons : Ext.MessageBox.OK
														});
												return;
											}
											if (status == 'ACTIVE') {
												Ext.MessageBox
														.confirm(
																i18n
																		._('submit'),
																i18n
																		._('confirmRenew'),
																function(btn) {
																	if (btn == 'yes') {
																		var vmRollBack = Ext.Ajax
																				.request({
																					url : path
																							+ '/../ops/ops!renewVm.action',
																					method : 'POST',
																					params : 'id='
																							+ vmid,
																					success : function(
																							form,
																							action) {
																						var obj = Ext
																								.decode(form.responseText);
																						if (obj == null
																								|| obj.success == null) {
																							Ext.MessageBox
																									.show({
																										title : i18n
																												._('errorNotice'),
																										msg : i18n
																												._('returnNull'),
																										buttons : Ext.MessageBox.OK,
																										icon : Ext.MessageBox.ERROR
																									});// INFO,QUESTION,WARNING,ERROR
																							return;
																						}
																						if (!obj.success) {
																							Ext.MessageBox
																									.show({
																										title : i18n
																												._('errorNotice'),
																										msg : obj.resultMsg,
																										buttons : Ext.MessageBox.OK,
																										icon : Ext.MessageBox.WARNING
																									});
																							return;
																						}
																						instanceStore
																								.load();
																					},
																					failure : function(
																							form,
																							action) {
																						Ext.MessageBox
																								.show({
																									title : i18n
																											._('errorNotice'),
																									msg : i18n
																											._('operateFail'),
																									buttons : Ext.MessageBox.OK,
																									icon : Ext.MessageBox.WARNING
																								});
																					}
																				});
																	}
																});
											} else {
												Ext.MessageBox.show({
													title : i18n._('notice'),
													msg : i18n
															._('reboot_error'),
													icon : Ext.MessageBox.INFO,
													buttons : Ext.MessageBox.OK
												});
												return;
											}
										}
									}
								},
								{
									xtype : 'button',
									text : '<font id="vmremote" color="#ffffff" >'
											+ i18n._('remote') + '</font>',// 远程访问
									listeners : {
										"mouseout" : function() {
											document.getElementById("vmremote").style.color = "white";
										},
										"mouseover" : function() {
											document.getElementById("vmremote").style.color = "black";
										}

									},
									icon : 'images/remote.png',// ../../images/monitor.png
									handler : function() {
										getSessionUser();
										var row = instanceGrid
												.getSelectionModel()
												.getSelection();
										// 查看是否选择的是多行
										if (row.length > 1) {
											Ext.MessageBox
													.show({
														title : i18n
																._('notice'),
														msg : i18n
																._('This is not possible, only select a row'),
														icon : Ext.MessageBox.INFO,
														buttons : Ext.MessageBox.OK
													});
											return;
										}
										if (row.length == 0) {
											Ext.MessageBox.show({
												title : i18n._('notice'),
												msg : i18n._('selectOne'),
												icon : Ext.MessageBox.INFO,
												buttons : Ext.MessageBox.OK

											});
										} else {
											var id = row[0].get('vmId');
											var record = instanceGrid
													.getStore().getById(id);
											var vmid = record.get('vmId');
											selectedVMUuid = vmid;
											var status = record.get('vmStatus');
											//判断云主机的使用状态
											var isEnable = record.get('isEnable');
											if (isEnable != 0) {
												Ext.MessageBox
														.show({
															title : i18n
																	._('notice'),
															msg : i18n
																	._('VmIsEnable'),
															icon : Ext.MessageBox.INFO,
															buttons : Ext.MessageBox.OK
														});
												vmRefreshReset();// 刷新设置重置
												return;
											}
											if (status == 'noInstance') {
												Ext.MessageBox
														.show({
															title : i18n
																	._('notice'),
															msg : i18n
																	._('undeply_error'),
															icon : Ext.MessageBox.INFO,
															buttons : Ext.MessageBox.OK
														});
												return;
											} else {
												/*
												 * v_mask = new Ext.LoadMask(Ext
												 * .getBody(), { msg :
												 * i18n._('VNC Connecting...'),
												 * removeMask : true });
												 * v_mask.show();
												 */
												remoteConnectionForm.getForm()
														.reset();
												remoteConnectionWin.show();
												Ext.Ajax
														.request({
															url : path
																	+ '/../ops/ops!getVNC.action',
															method : 'POST',
															params : 'id='
																	+ vmid
																	+ "&time="
																	+ new Date()
																			.getTime(),
															success : function(
																	form,
																	action) {
																/* v_mask.hide(); */
																var obj = Ext
																		.decode(form.responseText);
																if (!obj.success) {
																	remoteConnectionForm
																			.getComponent(
																					0)
																			.setValue(
																					'<br/><br/><font color="red" style="font-weight: bold;margin-left: 1px;">'
																							+ i18n
																									._('VNCerror1')
																							+ '</font><br/><br/>');
																	return;

																	/*
																	 * Ext.MessageBox.show({
																	 * title :
																	 * i18n._('errorNotice'),
																	 * msg :
																	 * obj.resultMsg,
																	 * buttons :
																	 * Ext.MessageBox.OK,
																	 * icon :
																	 * Ext.MessageBox.WARNING
																	 * });
																	 */
																	// 在原来的提示界面显示VNC连接失败
																} else {
																	remoteConnectionForm
																			.getComponent(
																					0)
																			.setValue(
																					'<img id="enterVNC" src="images/EnterVNC.jpg" style="margin-left: 170px;margin-top:25px;margin-bottom:15px;cursor:pointer;"/>');
																	// 确定进入VNC
																	$(
																			"#enterVNC")
																			.click(
																					function() {
																						remoteConnectionWin
																								.hide();
																						var url = obj.resultObject;
																						var start = url
																								.indexOf("//");
																						var end = url
																								.indexOf("/vnc");
																						var ip_port = url
																								.substring(
																										start + 2,
																										end);
																						var ip = ip_port
																								.split(":")[0];
																						var token = url
																								.split("=")[1];
																						var key = encode(ip);
																						var width = screen.width;
																						var height = screen.height;
																						var vncURL = "novnc/vnc_auto.html?token="
																								+ token
																								+ "&key="
																								+ key;
																						window
																								.open(
																										vncURL,
																										vmid,
																										'fullscreen=yes,width='
																												+ width
																												+ ',height='
																												+ height
																												+ ',top=0,left=0,toolbar=yes,menubar=yes,scrollbars=yes,resizable=no,location=yes,status=yes');
																					});
																}
															},
															failure : function(
																	form,
																	action) {
																Ext.MessageBox
																		.show({
																			title : i18n
																					._('errorNotice'),
																			msg : i18n
																					._('operateFail'),
																			buttons : Ext.MessageBox.OK,
																			icon : Ext.MessageBox.WARNING
																		});
															}
														});
												vmRefreshReset();// 重置刷新设置
											}
										}

									}
								},
								{
									xtype : 'button',
									// disabled:true,
									hidden : true,
									text : '<font id="vmdetail" color="#ffffff" >'
											+ i18n._('Details') + '</font>',// 详情
									listeners : {
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
										var row = instanceGrid
												.getSelectionModel()
												.getSelection();
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
										var proxy = vmDetailStore.getProxy();
										proxy.setExtraParam('vmId', recordId);
										detailVMForm.getForm().reset();
										ownerDetailField.setValue(owner);
										vmDetailStore.load();
									}
								},
								{
									xtype : 'button',
									text : '<font id="vmremark" color="#ffffff" >'
											+ i18n._('remark') + '</font>',// 备注
									// 这里说明下因为国际化里备注是remark，数据库中是comments所以在取这个属性时是jiangcomments转成了remark但是在修改时发现action的文件中有remark重名问题，就改为使用comments了。
									listeners : {
										"mouseout" : function() {
											document.getElementById("vmremark").style.color = "white";
										},
										"mouseover" : function() {
											document.getElementById("vmremark").style.color = "black";
										}

									},
									icon : 'images/detail.png',
									handler : function() {
										getSessionUser();
										var row = instanceGrid
												.getSelectionModel()
												.getSelection();
										// 查看是否选择的是多行
										if (row.length > 1) {
											Ext.MessageBox
													.show({
														title : i18n
																._('notice'),
														msg : i18n
																._('This is not possible, only select a row'),
														icon : Ext.MessageBox.INFO,
														buttons : Ext.MessageBox.OK
													});
											return;
										}
										if (row.length == 0) {
											Ext.MessageBox.show({
												title : i18n._('notice'),
												msg : i18n._('selectOne'),
												icon : Ext.MessageBox.INFO,
												buttons : Ext.MessageBox.OK
											});
											return;
										}
										if (null != row[0]) {

											var remark = messageFormat(row[0]
													.get('remark'));
											Ext.getCmp('rm_remark').setValue(
													remark);
											Ext
													.getCmp('rm_outComments')
													.setValue(
															row[0]
																	.get('outComments'));
											Ext.getCmp('rm_vmId').setValue(
													row[0].get('vmId'));
											remarkWin.show();
											// var AddWin = new Ext.Window({
											// title: i18n._('remark'),
											// width: 380,
											// autoHeight: true,
											// plain: true,
											// modal: true,
											// items: editPanel,
											// buttons: [{
											// text: i18n._('OK'),
											// handler: function(){
											// if(editPanel.form.isValid()) {
											// var data = row[0];
											// data.remark =
											// editPanel.getComponent('rm_remark').getValue();
											// data.outComments =
											// editPanel.getComponent('rm_outComments').getValue();
											// data.vmId =
											// editPanel.getComponent('rm_vmId').getValue();
											// Ext.Ajax.request({
											// url : path+
											// '/../ops/ops!updateComments.action',
											// method : 'POST',
											// params : {
											// 'id' : data.vmId,
											// 'comments' : data.remark,
											// 'outComments' : data.outComments,
											// },
											// success: function(response,
											// options){
											// var obj =
											// Ext.decode(response.responseText);
											// if(obj==null ||
											// obj.success==null){
											// Ext.MessageBox.show({
											// title:i18n._('errorNotice'),
											// msg: i18n._('returnNull'),
											// buttons: Ext.MessageBox.OK,
											// icon: Ext.MessageBox.ERROR
											// });//INFO,QUESTION,WARNING,ERROR
											// return;
											// }
											// if(!obj.success){
											// Ext.MessageBox.show({
											// title: i18n._('errorNotice'),
											// msg: obj.resultMsg,
											// buttons: Ext.MessageBox.OK,
											// icon: Ext.MessageBox.WARNING,
											// fn: function(){
											// getSessionUser();
											// }
											// });
											// return;
											// }
											// Ext.MessageBox.show({
											// title : i18n._('notice'),
											// msg : i18n._('operationMessage'),
											// buttons : Ext.MessageBox.OK,
											// icon : Ext.MessageBox.INFO,
											// fn: reLoadData
											// });
											// AddWin.hide();
											// },
											// failure:function(response,
											// options){
											// Ext.MessageBox.show({
											// title: i18n._('errorNotice'),
											// msg: i18n._('returnError'),
											// buttons: Ext.MessageBox.OK,
											// icon: Ext.MessageBox.WARNING,
											// fn: reLoadData
											// });
											// }
											// });
											// };
											// }
											// }, {
											// text: i18n._('cancel'),
											// handler: function(){
											// AddWin.close();
											// }
											// }]
											// });
											// AddWin.show(this);
										}
									}
								},
								'-',
								{
									xtype : 'button',
									text : '<font id="vmenable" color="#ffffff" >'
											+ i18n._('Enable') + '</font>',// 启用
									listeners : {
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
										var row = instanceGrid
												.getSelectionModel()
												.getSelection();
										// 查看是否选择的是多行
										if (row.length > 1) {
											Ext.MessageBox
													.show({
														title : i18n
																._('notice'),
														msg : i18n
																._('This is not possible, only select a row'),
														icon : Ext.MessageBox.INFO,
														buttons : Ext.MessageBox.OK
													});
											return;
										}
										if (row.length == 0) {
											Ext.MessageBox.show({
												title : i18n._('notice'),
												msg : i18n._('selectOne'),
												icon : Ext.MessageBox.INFO,
												buttons : Ext.MessageBox.OK
											});
										} else {
											var id = row[0].get('vmId');
											var record = instanceGrid
													.getStore().getById(id);
											var vmid = record.get('vmId');
											var status = record.get('vmStatus');
											var isEnable = record
													.get('isEnable');
											if (isEnable == 0) {
												Ext.MessageBox.show({
													title : i18n._('notice'),
													msg : i18n
															._('enabledError'),
													icon : Ext.MessageBox.INFO,
													buttons : Ext.MessageBox.OK
												});
												return;
											}
											if (status == 'noInstance') {
												Ext.MessageBox
														.show({
															title : i18n
																	._('notice'),
															msg : i18n
																	._('undeply_error'),
															icon : Ext.MessageBox.INFO,
															buttons : Ext.MessageBox.OK
														});
												vmRefreshReset();// 刷新设置重置
												return;
											}
											if (isEnable != 0) {
												Ext.MessageBox
														.confirm(
																i18n
																		._('submit'),
																i18n
																		._('confirmEnableSC'),
																function(btn) {
																	if (btn == 'yes') {
																		var start = Ext.Ajax
																				.request({
																					url : path
																							+ '/../ops/ops!activeVM.action',
																					method : 'POST',
																					params : 'id='
																							+ vmid,
																					success : function(
																							form,
																							action) {
																						var obj = Ext
																								.decode(form.responseText);
																						if (!obj.success) {
																							Ext.MessageBox
																									.show({
																										title : i18n
																												._('errorNotice'),
																										msg : obj.resultMsg,
																										buttons : Ext.MessageBox.OK,
																										icon : Ext.MessageBox.WARNING
																									});
																							return;
																						}
																					},
																					failure : function(
																							form,
																							action) {
																						Ext.MessageBox
																								.show({
																									title : i18n
																											._('errorNotice'),
																									msg : i18n
																											._('operateFail'),
																									buttons : Ext.MessageBox.OK,
																									icon : Ext.MessageBox.WARNING
																								});
																					}
																				});
																		vmRefreshReset();// 刷新设置重置
																	} else {
																		vmRefreshReset();// 刷新设置重置
																	}
																});
											} else {
												Ext.MessageBox
														.show({
															title : i18n
																	._('notice'),
															msg : i18n
																	._('enableBrandTip'),
															icon : Ext.MessageBox.INFO,
															buttons : Ext.MessageBox.OK
														});
												return;
											}
										}
									}
								},
								{
									xtype : 'button',
									text : '<font id="vmdisable" color="#ffffff" >'
											+ i18n._('Disable') + '</font>',// 禁用
									listeners : {
										"mouseout" : function() {
											document
													.getElementById("vmdisable").style.color = "white";
										},
										"mouseover" : function() {
											document
													.getElementById("vmdisable").style.color = "black";
										}

									},
									icon : 'images/disable.png',// ../../images/control_repeat_blue.png
									handler : function() {
										getSessionUser();
										var row = instanceGrid
												.getSelectionModel()
												.getSelection();
										// 查看是否选择的是多行
										if (row.length > 1) {
											Ext.MessageBox
													.show({
														title : i18n
																._('notice'),
														msg : i18n
																._('This is not possible, only select a row'),
														icon : Ext.MessageBox.INFO,
														buttons : Ext.MessageBox.OK
													});
											return;
										}
										if (row.length == 0) {
											Ext.MessageBox.show({
												title : i18n._('notice'),
												msg : i18n._('selectOne'),
												icon : Ext.MessageBox.INFO,
												buttons : Ext.MessageBox.OK
											});
										} else {
											var id = row[0].get('vmId');
											var record = instanceGrid
													.getStore().getById(id);
											var vmid = record.get('vmId');
											var status = record.get('vmStatus');
											var isEnable = record
													.get('isEnable');
											if (isEnable != 0) {
												Ext.MessageBox
														.show({
															title : i18n
																	._('notice'),
															msg : i18n
																	._('disabledError'),
															icon : Ext.MessageBox.INFO,
															buttons : Ext.MessageBox.OK
														});
												return;
											}
											if (status == 'noInstance') {
												Ext.MessageBox
														.show({
															title : i18n
																	._('notice'),
															msg : i18n
																	._('undeply_error'),
															icon : Ext.MessageBox.INFO,
															buttons : Ext.MessageBox.OK
														});
												vmRefreshReset();// 刷新设置重置
												return;
											}
											if (isEnable == 0) {
												Ext.MessageBox
														.confirm(
																i18n
																		._('submit'),
																i18n
																		._('confirmDisableSC'),
																function(btn) {
																	if (btn == 'yes') {
																		var start = Ext.Ajax
																				.request({
																					url : path
																							+ '/../ops/ops!freezeVM.action',
																					method : 'POST',
																					params : 'id='
																							+ vmid,
																					success : function(
																							form,
																							action) {
																						var obj = Ext
																								.decode(form.responseText);
																						if (!obj.success) {
																							Ext.MessageBox
																									.show({
																										title : i18n
																												._('errorNotice'),
																										msg : obj.resultMsg,
																										buttons : Ext.MessageBox.OK,
																										icon : Ext.MessageBox.WARNING
																									});
																							return;
																						}
																					},
																					failure : function(
																							form,
																							action) {
																						Ext.MessageBox
																								.show({
																									title : i18n
																											._('errorNotice'),
																									msg : i18n
																											._('operateFail'),
																									buttons : Ext.MessageBox.OK,
																									icon : Ext.MessageBox.WARNING
																								});
																					}
																				});
																		vmRefreshReset();// 刷新设置重置
																	} else {
																		vmRefreshReset();// 刷新设置重置
																	}
																});
											} else {
												Ext.MessageBox
														.show({
															title : i18n
																	._('notice'),
															msg : i18n
																	._('disableBrandTip'),
															icon : Ext.MessageBox.INFO,
															buttons : Ext.MessageBox.OK
														});
												return;
											}
										}
									}
								},
								// +==========================主机状态修复开始===============================
								{
									xtype : 'button',
									hidden : false,
									text : '<font id="vmStatusRepair" color="#ffffff" >'
											+ i18n._('hostStateofRepair')
											+ '</font>',// 系统修复,主机修复
									listeners : {
										"mouseout" : function() {
											document
													.getElementById("vmStatusRepair").style.color = "white";
										},
										"mouseover" : function() {
											document
													.getElementById("vmStatusRepair").style.color = "black";
										}

									},
									icon : 'images/close.png',// ../../images/control_stop_blue.png
									handler : function() {
										getSessionUser();
										var row = instanceGrid
												.getSelectionModel()
												.getSelection();
										// 查看是否选择的是多行
										if (row.length > 1) {
											Ext.MessageBox
													.show({
														title : i18n
																._('notice'),
														msg : i18n
																._('This is not possible, only select a row'),
														icon : Ext.MessageBox.INFO,
														buttons : Ext.MessageBox.OK
													});
											return;
										}
										if (row.length == 0) {
											Ext.MessageBox.show({
												title : i18n._('notice'),
												msg : i18n._('selectOne'),
												icon : Ext.MessageBox.INFO,
												buttons : Ext.MessageBox.OK
											});
										} else {
											var id = row[0].get('vmId');
											Ext.MessageBox
													.confirm(
															i18n._('submit'),
															i18n
																	._('TheMachineRepaired'),
															function(btn) {
																if (btn == 'yes') {
																	var start = Ext.Ajax
																			.request({
																				url : path
																						+ '/../ops/ops!hostStateofRepair.action',
																				method : 'POST',
																				params : 'vmId='
																						+ id,
																				success : function(
																						form,
																						action) {
																					var obj = Ext
																							.decode(form.responseText);
																					if (!obj.success) {
																						Ext.MessageBox
																								.show({
																									title : i18n
																											._('errorNotice'),
																									msg : obj.resultMsg,
																									buttons : Ext.MessageBox.OK,
																									icon : Ext.MessageBox.WARNING
																								});
																						return;
																					}
																					if (obj.resultObject) {
																						Ext.MessageBox
																								.show({
																									title : i18n
																											._('notice'),
																									msg : "修复失败，主机名："
																											+ vmName
																											+ "在openstack 存在两个。",
																									icon : Ext.MessageBox.INFO,
																									buttons : Ext.MessageBox.OK,
																									fn : reLoadData
																								});
																					}

																				},
																				failure : function(
																						form,
																						action) {
																					Ext.MessageBox
																							.show({
																								title : i18n
																										._('errorNotice'),
																								msg : i18n
																										._('operateFail'),
																								buttons : Ext.MessageBox.OK,
																								icon : Ext.MessageBox.WARNING
																							});
																				}
																			});
																	vmRefreshReset();// 刷新设置重置
																} else {
																	vmRefreshReset();// 刷新设置重置
																}
															});
										}
									}
								},
								// +==========================主机状态修复结束===============================
								{
									xtype : 'tbfill'
								},
								// {
								// xtype : 'label',
								// text : i18n._('QuickSearch')+':',
								// style: 'color:#ffffff'
								// },
								{
									xtype : 'splitbutton',
									id : 'vmSplitbutton',
									text : '<font color="#ffffff" id="vmSplit">'
											+ i18n._('QuickSearch')
											+ ':'
											+ '</font>', // 快速查询
									listeners : {
										"mouseout" : function() {
											document.getElementById("vmSplit").style.color = "white";
										},
										"mouseover" : function() {
											document.getElementById("vmSplit").style.color = "black";
										}

									},
									menu : new Ext.menu.Menu(
											{
												items : [
														{
															text : i18n
																	._('vm_name'),
															handler : function() {
																Ext
																		.getCmp(
																				'vmSplitbutton')
																		.setText(
																				'<font color="#ffffff" id="vmSplit">'
																						+ i18n
																								._('vm_name')
																						+ '</font>');
																var instanceStoreProxy = instanceStore
																		.getProxy();
																instanceStoreProxy
																		.setExtraParam(
																				'type',
																				'vmName');
																checkFlag = true;
															}
														},
														{
															text : i18n
																	._('ipOuter'),
															handler : function() {
																Ext
																		.getCmp(
																				'vmSplitbutton')
																		.setText(
																				'<font color="#ffffff" id="vmSplit">'
																						+ i18n
																								._('ipOuter')
																						+ '</font>');
																var instanceStoreProxy = instanceStore
																		.getProxy();
																instanceStoreProxy
																		.setExtraParam(
																				'type',
																				'ipOuter');
																checkFlag = true;
															}
														},
														{
															text : i18n
																	._('ipInner'),
															handler : function() {
																Ext
																		.getCmp(
																				'vmSplitbutton')
																		.setText(
																				'<font color="#ffffff" id="vmSplit">'
																						+ i18n
																								._('ipInner')
																						+ '</font>');
																var instanceStoreProxy = instanceStore
																		.getProxy();
																instanceStoreProxy
																		.setExtraParam(
																				'type',
																				'ipInner');
																checkFlag = true;
															}
														},
														/*
														 * { text:
														 * i18n._('host_name'),
														 * disabled:menuDisabled,
														 * handler: function(){
														 * Ext.getCmp('vmSplitbutton').setText('<font
														 * color="#ffffff"
														 * id="vmSplit">' +
														 * i18n._('host_name') + '</font>');
														 * var
														 * instanceStoreProxy=instanceStore.getProxy();
														 * instanceStoreProxy.setExtraParam('type','vmNode');
														 * checkFlag=true; } },
														 */
														{
															text : i18n
																	._('Owner'),
															handler : function() {
																Ext
																		.getCmp(
																				'vmSplitbutton')
																		.setText(
																				'<font color="#ffffff" id="vmSplit">'
																						+ i18n
																								._('Owner')
																						+ '</font>');
																var instanceStoreProxy = instanceStore
																		.getProxy();
																instanceStoreProxy
																		.setExtraParam(
																				'type',
																				'vmOwner');
																checkFlag = true;
															}
														},
														{
															text : i18n
																	._('inner_remark'),
															handler : function() {
																Ext
																		.getCmp(
																				'vmSplitbutton')
																		.setText(
																				'<font color="#ffffff" id="vmSplit">'
																						+ i18n
																								._('inner_remark')
																						+ '</font>');
																var instanceStoreProxy = instanceStore
																		.getProxy();
																instanceStoreProxy
																		.setExtraParam(
																				'type',
																				'remark');
																checkFlag = true;
															}
														},
														{
															text : i18n
																	._('outComments'),
															handler : function() {
																Ext
																		.getCmp(
																				'vmSplitbutton')
																		.setText(
																				'<font color="#ffffff" id="vmSplit">'
																						+ i18n
																								._('outComments')
																						+ '</font>');
																var instanceStoreProxy = instanceStore
																		.getProxy();
																instanceStoreProxy
																		.setExtraParam(
																				'type',
																				'outComments');
																checkFlag = true;
															}
														} ]
											})
								},
								{
									labelWidth : 50,
									xtype : 'searchfield',
									tooltip : i18n._('vm_name') + '/'
											+ i18n._('host_name') + '/'
											+ i18n._('IPAddress'),
									// emptyText:i18n._('vm_name')+'/'+i18n._('host_name')+'/'+i18n._('IPAddress')+'/'+i18n._('Owner'),
									store : instanceStore,
									id : 'vmSearchfield',
									onTrigger1Click : function() {
										// alert('onTrigger1Click');
										var me = this, store = me.store, proxy = store
												.getProxy(), val;
										if (me.hasSearch) {
											// alert('me.paramName:'+me.paramName);
											me.setValue('');
											proxy.extraParams[me.paramName] = '';
											// proxy.extraParams['type'] = '';
											proxy.extraParams.start = 0;
											// store.load();
											store.loadPage(1, null);
											me.hasSearch = false;
											me.triggerEl.item(0).setDisplayed(
													'none');
											me.doComponentLayout();
										}
									},
									onTrigger2Click : function() {// 点击查询按钮或回车调用该方法
										var me = this, store = me.store, proxy = store
												.getProxy(), value = me
												.getValue();
										value = Ext.String.trim(value);
										// if (value.length < 1) {
										// me.onTrigger1Click();
										// return;
										// }
										if (!checkFlag) {
											Ext.MessageBox.show({
												title : i18n._('notice'),
												msg : i18n._('searchCriteria'),
												icon : Ext.MessageBox.INFO,
												buttons : Ext.MessageBox.OK
											});
											return;
										}
										// alert('onTrigger2Click');
										store = me.store;
										proxy = store.getProxy();
										proxy.extraParams['query'] = value;
										proxy.extraParams.start = 0;
										// store.load();
										store.loadPage(1, null);
										this.hasSearch = true;
										me.triggerEl.item(0).setDisplayed(
												'block');
										me.doComponentLayout();
										this.setValue("");
									}
								} ]
					} ],

					columns : [
							Ext.create('Ext.grid.PageRowNumberer', {
								flex : 0.2,
								width : 50
							}),
							/*
							 * { xtype: 'rownumberer', width:50, locked:true },
							 */
							{
								text : i18n._('vmId'),
								flex : 0.4,
								hidden : true,
								// sortable : false,
								dataIndex : 'vmId'
							},
							{
								text : i18n._('VM_alias'),
								flex : 0.4,
								dataIndex : 'vmName',
								renderer : function(data, metadata, record,
										rowIndex, columnIndex, store) {
									var string = new String(data);
									// var string1=string.substring(0,19);
									// var
									// string2=string1+'</br>'+string.substring(20);
									metadata.tdAttr = 'data-qtip="' + string
											+ '"';
									// metadata.style =
									// 'margin-left:0px;word-break: break-all;
									// word-wrap:break-word;';
									return data;
								}
							},
							{
								text : i18n._('node'),// 节点
								flex : 0.4,
								dataIndex : 'hostName',
								sortable : true,
								renderer : renderDescnVmHostName
							},
							{
								text : i18n._('IPAddress'),// ip地址
								flex : 0.5,
								sortable : true,
								dataIndex : 'ipOuter',
								renderer : function(data, metadata, record,
										rowIndex, columnIndex, store) {
									var ipInner = record.get('ipInner');
									var ip = '';
									if (data == '') {
										ip = ipInner;
									}
									if (ipInner == '') {
										ip = data;
									}
									if (data != '' && ipInner != ''
											&& data != null && ipInner != null) {
										ip = ipInner + ',' + data;
									}
									var vmShowIpData = [];
									vmShowIpData = ip.split(",");
									renderText = "";
									var index1 = Math
											.floor(vmShowIpData.length / 8)
									// alert("index1: "+index1);
									var index2 = vmShowIpData.length % 8
									// alert("index2: "+index2);
									if (index1 > 0) {
										for (i = 0; i < index1; i++) {
											for (j = i * 8; j < (i + 1) * 8; j++) {
												renderText += vmShowIpData[j]
														+ ',';
											}
											if (renderText != "") {
												renderText += '<br/>';
											}
										}
										if (index2 > 0) {
											for (i = 0; i < index2; i++) {
												renderText += vmShowIpData[vmShowIpData.length
														- (i + 1)]
														+ ',';
											}
										}
										renderText = renderText.substring(
												renderText.length - 1, 0);
									} else {
										renderText = ip;
									}
									metadata.tdAttr = 'data-qtip="'
											+ renderText + '"';
									return ip;
								}
							},
							{
								text : i18n._('system'),// 操作系统
								flex : 0.4,
								dataIndex : 'vmOS',
								sortable : true,
								renderer : function(value) {
									return i18n._(value);
								}
							},
							{
								text : i18n._('applicationSystemName'),// 应用系统
								flex : 0.4,
								sortable : true,
								dataIndex : 'applicationSystemName',
							// renderer : renderDescnVmStatus
							},
							{
								text : i18n._('status'),// 状态
								flex : 0.4,
								dataIndex : 'vmStatus',
								sortable : true,
								renderer : renderDescnVmStatus
							},

							{
								text : i18n._('TaskState'),// 任务状态
								flex : 0.4,
								dataIndex : 'taskState',
								sortable : true,
								renderer : renderDescnVmTask
							},

							{
								text : i18n._('createTime'),// 创建时间
								flex : 0.5,
								dataIndex : 'createTime',
								sortable : true,
								renderer : function(data, metadata, record,
										rowIndex, columnIndex, store) {
									// metadata.attr = 'ext:qtip="' + data +
									// '"';
									metadata.tdAttr = 'data-qtip="'
											+ Ext.Date.format(data,
													"Y-m-d H:i:s") + '"';
									return Ext.Date.format(data, "Y-m-d H:i:s");
								}
							// renderer: Ext.util.Format.dateRenderer("Y-m-d
							// H:i:s")
							},
							{
								text : i18n._('on_state'),// 使用状态
								flex : 0.2,
								dataIndex : 'isEnable',
								sortable : true,
								renderer : function(value, metadata, record,
										rowIndex, columnIndex, store) {
									var text = '';
									var status = record.get('vmStatus');
									if (status == "noInstance"
											|| status == "ERROR") {
										value = 3;
									}
									switch (value) {
									case 0:
										text = 'Enable';
										break;
									case 1:
										text = 'ManuallyDisabled';
										break;
									case 2:
										text = 'DueToDisable';
										break;
									default:
										text = '';
									}
									return i18n._(text);
								}
							},
							{
								text : i18n._('Owner'),
								flex : 0.4,
								dataIndex : 'userName',
								sortable : true,
								renderer : function(data, metadata, record,
										rowIndex, columnIndex, store) {
									// metadata.attr = 'ext:qtip="' + data +
									// '"';
									metadata.tdAttr = 'data-qtip="' + data
											+ '"';
									return data;
								}
							},/*
								 * { text : i18n._('CPU'), flex : 0.4, sortable:
								 * true, dataIndex : 'cpuUsage', renderer :
								 * renderDescnCPU }, { text : i18n._('MEM'),
								 * flex : 0.4, hidden :true, sortable: true,
								 * dataIndex : 'memoryUsage', renderer :
								 * renderDescnMemory }, { header :
								 * i18n._('IOPS')+'(KB/sec)', dataIndex :
								 * 'iopsMonitorDetailBean', flex : 0.7,
								 * sortable: true, renderer : renderDescnIOPS }, {
								 * header : i18n._('NET')+'(KBps)', dataIndex :
								 * 'netMonitorDetailBean', flex : 0.7, sortable:
								 * true, renderer : renderDescnNET }, { text :
								 * i18n._('DISK')+'(G)', flex : 0.4, // hidden
								 * :true, sortable: true, dataIndex :
								 * 'diskUsage', renderer : renderDescnDisk },
								 */{
								text : i18n._('inner_remark'),
								flex : 0.4,
								hidden : true,
								sortable : false,
								dataIndex : 'remark'
							// ,
							// renderer:record.get('remark')
							}, {
								text : i18n._('outComments'),
								flex : 0.4,
								hidden : true,
								sortable : true,
								dataIndex : 'outComments'
							} ],
					listeners : {
						itemdblclick : function(instanceGrid, record, item,
								index, e, eOpts) {
							var recordId = record.get('vmId');
							var owner = record.get('userName');
							var proxy = vmDetailStore.getProxy();
							proxy.setExtraParam('vmId', recordId);
							detailVMForm.getForm().reset();
							ownerDetailField.setValue(owner);
							vmDetailStore.load();
							// createVMWin.setTitle(i18n._('Details'));//详情

							// createVMWin.add(detailVMForm);
							// createVMWin.show();
						},
						itemclick : function(instanceGrid, record, item, index,
								e, eOpts) {
							vmRunner.stopAll();
						}/*
							 * , itemcontextmenu : function(instanceGrid,
							 * record, item, index, e, eOpts) { e.stopEvent();
							 * contextMenu.showAt(e.getXY()); return false; }
							 */
					}
				});// 创建grid
// var instanceStoreProxy=instanceStore.getProxy();
// instanceGrid.store.sort([{ property: "id", direction: "ASC" }]);
// 更新虚拟机对应的节点名称
function updateHostNameOfVm(vmId) {
	Ext.Ajax.request({
		url : path + '/../ops/ops!updateHostNameOfVm.action',
		method : 'POST',
		params : 'id=' + vmId,
		success : function(response, options) {
			var obj = Ext.decode(response.responseText);
			if (obj == null || obj.success == null) {
				Ext.MessageBox.show({
					title : i18n._('errorNotice'),
					msg : i18n._('returnNull'),
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				});// INFO,QUESTION,WARNING,ERROR
				return;
			}
			if (!obj.success) {
				Ext.MessageBox.show({
					title : i18n._('errorNotice'),
					msg : obj.resultMsg,
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.WARNING,
					fn : function() {
						getSessionUser();
					}
				});
				return;
			}
			Ext.MessageBox.show({
				title : i18n._('notice'),
				msg : i18n._('operationMessage'),
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.INFO,
				fn : reLoadData
			});
		},
		failure : function(response, options) {
			Ext.MessageBox.show({
				title : i18n._('errorNotice'),
				msg : i18n._('returnError'),
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.WARNING,
				fn : reLoadData
			});
		}
	});
};
// 重新发布虚拟机
function publishVM(vmName) {
	Ext.Ajax.request({
		url : path + '/../ops/ops!publishVm.action',
		method : 'POST',
		params : 'name=' + vmName,
		success : function(response, options) {
			var obj = Ext.decode(response.responseText);
			if (obj == null || obj.success == null) {
				Ext.MessageBox.show({
					title : i18n._('errorNotice'),
					msg : i18n._('returnNull'),
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				});// INFO,QUESTION,WARNING,ERROR
				return;
			}
			if (!obj.success) {
				Ext.MessageBox.show({
					title : i18n._('errorNotice'),
					msg : obj.resultMsg,
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.WARNING,
					fn : function() {
						getSessionUser();
					}
				});
				return;
			}
			Ext.MessageBox.show({
				title : i18n._('notice'),
				msg : i18n._('operationMessage'),
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.INFO,
				fn : reLoadData
			});
		},
		failure : function(response, options) {
			Ext.MessageBox.show({
				title : i18n._('errorNotice'),
				msg : i18n._('returnError'),
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.WARNING,
				fn : reLoadData
			});
		}
	});
};
// 确认迁移操作
function confirmMigrateVm(vmId, confirmFlag) {
	Ext.Ajax.request({
		url : path + '/../ops/ops!confirmMigrateVm.action',
		method : 'POST',
		params : {
			'id' : vmId,
			'confirmFlag' : confirmFlag
		},
		success : function(response, options) {
			var obj = Ext.decode(response.responseText);
			if (obj == null || obj.success == null) {
				Ext.MessageBox.show({
					title : i18n._('errorNotice'),
					msg : i18n._('returnNull'),
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				});// INFO,QUESTION,WARNING,ERROR
				return;
			}
			if (!obj.success) {
				Ext.MessageBox.show({
					title : i18n._('errorNotice'),
					msg : obj.resultMsg,
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.WARNING,
					fn : function() {
						getSessionUser();
					}
				});
				return;
			}
			Ext.MessageBox.show({
				title : i18n._('notice'),
				msg : i18n._('operationMessage'),
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.INFO,
				fn : reLoadData
			});
		},
		failure : function(response, options) {
			Ext.MessageBox.show({
				title : i18n._('errorNotice'),
				msg : i18n._('returnError'),
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.WARNING,
				fn : reLoadData
			});
		}
	});
};
// 确认调整操作
function confirmResizeVm(vmId, confirmFlag) {
	confirmRezizeArray.push(vmId);
	Ext.Ajax.request({
		url : path + '/../ops/ops!confirmResizeVm.action',
		method : 'POST',
		params : {
			'id' : vmId,
			'confirmFlag' : confirmFlag
		},
		success : function(response, options) {
			var obj = Ext.decode(response.responseText);
			if (obj == null || obj.success == null) {
				Ext.MessageBox.show({
					title : i18n._('errorNotice'),
					msg : i18n._('returnNull'),
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				});// INFO,QUESTION,WARNING,ERROR
				return;
			}
			if (!obj.success) {
				Ext.MessageBox.show({
					title : i18n._('errorNotice'),
					msg : obj.resultMsg,
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.WARNING,
					fn : function() {
						getSessionUser();
					}
				});
				return;
			}
			Ext.MessageBox.show({
				title : i18n._('notice'),
				msg : i18n._('operationMessage'),
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.INFO,
				fn : reLoadData
			});
		},
		failure : function(response, options) {
			Ext.MessageBox.show({
				title : i18n._('errorNotice'),
				msg : i18n._('returnError'),
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.WARNING,
				fn : reLoadData
			});
		}
	});
};
// 渲染虚拟机状态
function renderDescnVmStatus(value, cellmeta, record, rowIndex, columnIndex,
		store) {
	var status = store.getAt(rowIndex).get('vmStatus');
	var processState = store.getAt(rowIndex).get('processState');
	var vmName = store.getAt(rowIndex).get('vmName');
	var vmId = store.getAt(rowIndex).get('vmId');
	/*
	 * else if(status == "VERIFY_RESIZE"){//确认迁移 var str =
	 * i18n._('confirmMigrate')+'|'+'<a href ="#"
	 * onclick=confirmMigrateVm("'+vmId+'",1)>'+i18n._('OK')+'</a>';
	 * //+'&nbsp'+'<a href ="#"
	 * onclick=confirmMigrateVm("'+vmId+'",0)>'+i18n._('Cancel')+'</a>' return
	 * str;
	 */
	if (status == "ACTIVE") {
		return i18n._(status);
	}
	if (status == "noInstance") {
		var str = i18n._('noInstance') + '|'
				+ '<a  href ="#" onclick="publishVM(\'' + vmName + '\')">'
				+ i18n._('deploy') + '</a>';
		return str;
	} else if (!isNaN(processState) && processState != "") {// 确认迁移(进度条)
		if (processState <= 0) {
			return i18n._(status);
		}
		if (processState > 100) {
			processState = 100;
		}
		if (processState == 99) {
			processState = 100;
		}
		var val = parseInt(processState, 10);
		return "<div style='color:#8DB2E3; background-color:#ffffff;border: 1px #8DB2E3 solid;'><div style='height:12px;width:"
				+ val
				+ "%;background-color:#ee8800;border: 0px;color: black;'>"
				+ val + "%</div></div>";
	} else if (status == "RESIZE_CONFIRM") {// 确认调整
		var str = i18n._('confirmResize');
		if (confirmRezizeArray.indexOf(vmId) == -1) {
			str = i18n._('confirmResize');
			// str = i18n._('confirmResize')+'|'+'<a href ="#"
			// onclick=confirmResizeVm("'+vmId+'",1)>'+i18n._('OK')+'</a>';//+'&nbsp'+'<a
			// href ="#"
			// onclick=confirmResizeVm("'+vmId+'",0)>'+i18n._('Cancel')+'</a>'
		}
		return str;
	} else {
		if (confirmRezizeArray.indexOf(vmId) != -1) {
			confirmRezizeArray.removevalue(vmId);
		}
		return i18n._(status);
	}
};

// 渲染任务状态
function renderDescnVmTask(value, cellmeta, record, rowIndex, columnIndex,
		store) {
	if (value) {
		return i18n._(value);
	} else {
		return '无';
	}

};

// 渲染虚拟机节点名称
function renderDescnVmHostName(value, cellmeta, record, rowIndex, columnIndex,
		store) {
	var hostName = store.getAt(rowIndex).get('hostName');
	var hostAliases = store.getAt(rowIndex).get('hostAliases');
	var status = store.getAt(rowIndex).get('vmStatus');
	var vmId = store.getAt(rowIndex).get('vmId');
	if (hostName == "" || hostName == null) {
		var str = '';// i18n._('ERROR')
		if (status == "ACTIVE") {
			str = '<a  href ="#" onclick=updateHostNameOfVm("' + vmId + '")>'
					+ i18n._('Update') + '</a>';
		}
		return str;
	} else {
		cellmeta.tdAttr = 'data-qtip="' + hostAliases + '"';
		return hostAliases;
	}
};
// 渲染虚拟机CUP使用率
function renderDescnCPU(value, cellmeta, record, rowIndex, columnIndex, store) {
	var status = store.getAt(rowIndex).get('cpuUsage');
	if (status > 100) {
		status = 100;
	}
	var val = parseInt(status, 10);
	return "<div style='color:#8DB2E3; background-color:#ffffff;border: 1px #8DB2E3 solid;'><div style='height:12px;width:"
			+ val
			+ "%;background-color:#ee8800;border: 0px;color: black;'>"
			+ val + "%</div></div>";
	/*
	 * var status = 0; var cpuMonitorDetail =
	 * store.getAt(rowIndex).get('cpuMonitorDetailBean'); var load_avg = null;
	 * var workloadActual = 0; var workloadLimit = 0; var cpuRrateList = []; var
	 * loadAVG=''; if(cpuMonitorDetail!=null){
	 * load_avg=cpuMonitorDetail.loadAvgBean;
	 * cpuRrateList=cpuMonitorDetail.singleDetailBeanList;
	 * workloadActual=cpuMonitorDetail.workloadActual;
	 * workloadLimit=cpuMonitorDetail.workloadLimit; } if(load_avg != null){
	 * loadAVG=i18n._('Load
	 * average')+':'+load_avg.loadAvg1+','+load_avg.loadAvg5+','+load_avg.loadAvg15; }
	 * if(workloadLimit>0){ status =
	 * Ext.util.Format.round(workloadActual/workloadLimit*100,1); } var
	 * cpuRate=''; if(cpuRrateList != null){ for(var i=0;i<cpuRrateList.length;i++){
	 * cpuRate+='CPU'+i+':'+Ext.util.Format.round(cpuRrateList[i].cpuUsRate,1)+'%us,'
	 * +Ext.util.Format.round(cpuRrateList[i].cpuSysRate,1)+'%sys,'
	 * +Ext.util.Format.round(cpuRrateList[i].cpuNiceRate,1)+'%nice,'
	 * +Ext.util.Format.round(cpuRrateList[i].cpuIdleRate,1)+'%idle,'
	 * +Ext.util.Format.round(cpuRrateList[i].cpuIowaitRate,1)+'%iowait,'
	 * +Ext.util.Format.round(cpuRrateList[i].cpuIrqRate,1)+'%irq,'
	 * +Ext.util.Format.round(cpuRrateList[i].cpuSoftIrqRate,1)+'%softirq'+'<br/>'; } }
	 * if(status>100){ status=100; } var val = parseInt(status, 10);
	 * cellmeta.tdAttr = 'data-qtip="<span width=500px>' + loadAVG +'<br/>'+cpuRate+ '</span>"';
	 * return "<div style='color:#8DB2E3; background-color:#ffffff;border: 1px
	 * #cbcbcb solid;'><div style='height:12px;width:" + val +
	 * "%;background-color:#ee8800;border: 0px;color: black;'>" + workloadActual + "</div></div>";
	 */
};
// 渲染虚拟机Memory使用率
function renderDescnMemory(value, cellmeta, record, rowIndex, columnIndex,
		store) {
	var status = store.getAt(rowIndex).get('memoryUsage');
	if (status > 100) {
		status = 100;
	}
	var val = parseInt(status, 10);
	return "<div style='color:#8DB2E3; background-color:#ffffff;border: 1px #8DB2E3 solid;'><div style='height:12px;width:"
			+ val
			+ "%;background-color:#ee8800;border: 0px;color: black;'>"
			+ val + "%</div></div>";
};
// 渲染虚拟机Disk使用率
function renderDescnDisk(value, cellmeta, record, rowIndex, columnIndex, store) {
	var status = store.getAt(rowIndex).get('diskUsage');
	var disk = store.getAt(rowIndex).get('disk');
	var diskMonitorDetail = store.getAt(rowIndex).get('diskMonitorDetailBean');
	var singleDetailBeanList = [];
	if (diskMonitorDetail != null) {
		singleDetailBeanList = diskMonitorDetail.singleDetailBeanList;
	}
	var diskList = '';
	if (singleDetailBeanList != null) {
		for (var i = 0; i < singleDetailBeanList.length; i++) {
			diskList += singleDetailBeanList[i].title + ':'
					+ Ext.util.Format.round(singleDetailBeanList[i].usage, 1)
					+ '%' + '<br/>';
		}
	}
	if (status > 100) {
		status = 100;
	}
	var diskUsed = disk * status / 100;
	diskUsed = Ext.util.Format.round(diskUsed, 1);
	var val = parseInt(status, 10);
	cellmeta.tdAttr = 'data-qtip="<span width=500px>' + diskList + '</span>"';
	return "<div style='color:#8DB2E3; background-color:#ffffff;border: 1px #cbcbcb solid;'><div style='height:12px;width:"
			+ val
			+ "%;background-color:#ee8800;border: 0px;color: black;'>"
			+ diskUsed + "</div></div>";
};
function renderDescnIOPS(value, cellmeta, record, rowIndex, columnIndex, store) {
	var readStatus = 0;
	var writeStatus = 0;
	var iopsMonitorDetail = store.getAt(rowIndex).get('iopsMonitorDetailBean');
	var readActual = 0;
	var readLimit = 0;
	var writeActual = 0;
	var writeLimit = 0;
	var singleDetailBeanList = [];
	if (iopsMonitorDetail != null) {
		singleDetailBeanList = iopsMonitorDetail.singleDetailBeanList;
		readActual = (iopsMonitorDetail.readActual == undefined ? 0
				: iopsMonitorDetail.readActual);
		writeActual = (iopsMonitorDetail.writeActual) == undefined ? 0
				: iopsMonitorDetail.writeActual;
		readLimit = (iopsMonitorDetail.readLimit == undefined ? 1
				: iopsMonitorDetail.readLimit);
		writeLimit = (iopsMonitorDetail.writeLimit == undefined ? 1
				: iopsMonitorDetail.writeLimit);
	}
	// alert(readLimit>0);
	if (readLimit > 0) {
		readStatus = Ext.util.Format.round(readActual / readLimit * 100, 1);
	}
	if (writeLimit > 0) {
		writeStatus = Ext.util.Format.round(writeActual / writeLimit * 100, 1);
	}
	var iopsList = '';
	if (singleDetailBeanList != null) {
		for (var i = 0; i < singleDetailBeanList.length; i++) {
			iopsList += singleDetailBeanList[i].title
					+ ':'
					+ 'read '
					+ Ext.util.Format
							.round(singleDetailBeanList[i].iopsRead, 1)
					+ 'KB/sec,'
					+ 'write '
					+ Ext.util.Format.round(singleDetailBeanList[i].iopsWrite,
							1) + 'KB/sec' + '<br/>';
		}
	}
	if (readStatus > 100) {
		readStatus = 100;
	}
	if (writeStatus > 100) {
		writeStatus = 100;
	}
	var readVal = parseInt(readStatus, 10);
	var writeVal = parseInt(writeStatus, 10);
	// alert('##'+readVal);
	cellmeta.tdAttr = 'data-qtip="<span width=500px>' + iopsList + '</span>"';
	return "<div style='display:inline-table;float:left;white-space: normal;width:150px;'>"
			+ "<div style='display:inline;float:left;white-space: normal;'>R:"
			+ "<div style='color:#8DB2E3; background-color:#ffffff;border: 1px #cbcbcb solid;float:right;width:50px;'><div style='height:12px;width:"
			+ readVal
			+ "%;background-color:#ee8800;border: 0px;color: black;'>"
			+ readActual
			+ "</div></div></div>"
			+ "<div style='display:inline;float:left;white-space: normal;'>W:"
			+ "<div style='color:#8DB2E3; background-color:#ffffff;border: 1px #cbcbcb solid;float:right;width:50px;'><div style='height:12px;width:"
			+ writeVal
			+ "%;background-color:#ee8800;border: 0px;color: black;'>"
			+ writeActual + "</div></div></div>" + "</div>";
};
function renderDescnNET(value, cellmeta, record, rowIndex, columnIndex, store) {
	var readStatus = 0;
	var writeStatus = 0;
	var netMonitorDetail = store.getAt(rowIndex).get('netMonitorDetailBean');
	var readActual = 0;
	var readLimit = 0;
	var writeActual = 0;
	var writeLimit = 0;
	var singleDetailBeanList = [];
	if (netMonitorDetail != null) {
		singleDetailBeanList = netMonitorDetail.singleDetailBeanList;
		readActual = (netMonitorDetail.readActual == undefined ? 0
				: netMonitorDetail.readActual);
		writeActual = (netMonitorDetail.writeActual == undefined ? 0
				: netMonitorDetail.writeActual);
		readLimit = (netMonitorDetail.readLimit == undefined ? 1
				: netMonitorDetail.readLimit);
		writeLimit = (netMonitorDetail.writeLimit == undefined ? 1
				: netMonitorDetail.writeLimit);
	}
	if (readLimit > 0) {
		readStatus = Ext.util.Format.round(readActual / readLimit * 100, 1);
	}
	if (writeLimit > 0) {
		writeStatus = Ext.util.Format.round(writeActual / writeLimit * 100, 1);
	}
	var netList = '';
	if (singleDetailBeanList != null) {
		for (var i = 0; i < singleDetailBeanList.length; i++) {
			netList += singleDetailBeanList[i].title + ':' + 'Rx '
					+ Ext.util.Format.round(singleDetailBeanList[i].rxSpeed, 1)
					+ 'KBps,' + 'Tx '
					+ Ext.util.Format.round(singleDetailBeanList[i].txSpeed, 1)
					+ 'KBps' + '<br/>';
		}
	}
	if (readStatus > 100) {
		readStatus = 100;
	}
	if (writeStatus > 100) {
		writeStatus = 100;
	}
	var readVal = parseInt(readStatus, 10);
	var writeVal = parseInt(writeStatus, 10);
	cellmeta.tdAttr = 'data-qtip="<span width=500px>' + netList + '</span>"';
	return "<div style='display:inline-table;float:left;white-space: normal;width:150px;'>"
			+ "<div style='display:inline;float:left;white-space: normal;'>Rx:"
			+ "<div style='color:#8DB2E3; background-color:#ffffff;border: 1px #cbcbcb solid;float:right;width:44px;'><div style='height:12px;width:"
			+ readVal
			+ "%;background-color:#ee8800;border: 0px;color: black;'>"
			+ readActual
			+ "</div></div></div>"
			+ "<div style='display:inline;float:left;white-space: normal;'>Tx:"
			+ "<div style='color:#8DB2E3; background-color:#ffffff;border: 1px #cbcbcb solid;float:right;width:44px;'><div style='height:12px;width:"
			+ writeVal
			+ "%;background-color:#ee8800;border: 0px;color: black;'>"
			+ writeActual + "</div></div></div>" + "</div>";
};
// 操作完成后点确认刷新数据操作
function reLoadData(btn) {
	if (global_records == 1) {
		instanceStore.loadPage(1, null);
	} else {
		instanceStore.load();
	}

	// instanceStore.load();
	// instanceStore.loadPage(1,null);
	vmRefreshReset();
};
function getCookie(name) {
	var arr = document.cookie
			.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
	if (arr != null)
		return unescape(arr[2]);
	return null;
};
function setParamCookie(field, value) {
	document.cookie = field + "=" + value;
};
function getQuery(name) {
	var reg = new RegExp("" + name + "=([^&?]*)");
	var keyVal = window.location.search.substr(1).match(reg);
	// alert(keyVal[1]);
	if (keyVal != null)
		return unescape(keyVal[1]);
	return null;
};
// 将秒级的时间戳转换成天、小时、分钟
function getUseFreeLong(second) {
	var d = 0;
	var h = 0;
	var m = 0;
	var remainder = 0;
	d = parseInt(second / (60 * 60 * 24));
	remainder = second % (60 * 60 * 24);
	h = parseInt(remainder / (60 * 60));
	remainder = remainder % (60 * 60);
	m = Math.round(remainder / 60);
	return d + i18n._('Day') + h + i18n._('Hour') + m + i18n._('minute');
};
function vmRefreshReset() {
	// vmRefreshPeriod = refreshPeriod;
	Ext.getCmp("radioVMResresh").setValue(true);
	Ext.getCmp('combVMTime').setValue(1);
	Ext.getCmp('numVMTime').setValue(vmRefreshPeriod);
	vmRunner.stopAll();
	vmTask = vmRunner.newTask({
		run : function() {
			// 虚拟机列表刷新
			if (instanceGrid.isVisible()) {
				instanceStore.load();
			}
		},
		interval : 1000 * vmRefreshPeriod
	});
	vmTask.start();
};

vmRefreshReset();

function messageFormat(remark) {
	if (remark.indexOf("delete failed: (500) Connection to neutron failed") > 0) {
		return "创建云主机连接网络失败，请检查网络服务是否正常。错误详情：" + remark;
	}
	if (remark.indexOf("attempts 3 for instance") > 0) {
		return "尝试多次创建机器失败，请删除后，重新发布。错误详情：" + remark;
	}
	if (remark
			.indexOf("The server has either erred or is incapable of performing the requested operation") > 0) {
		return "调用nova-client创建机器失败，请删除后重新发布。错误详情：" + remark;
	}
	if (remark.indexOf("Server xxxx_test000001 delete failed") > 0) {
		return "创建机器失败，请删除后重新发布。错误详情：" + remark;
	}
	if (remark.indexOf("NeutronClientException") > 0) {
		return "创建机器时，生成网络信息失败，请检查网络服务是否正常。错误详情：" + remark;
	}
	if (remark.indexOf("Failure prepping block device") > 0) {
		return "创建块设配失败，请检查cinder服务是否正常。错误详情：" + remark;
	}
	if (remark.indexOf("Availability zone 'SHZBLT' is invalid") > 0) {
		return "创建传入zone信息有误，请检查后重新创建。错误详情：" + remark;
	}
	if (remark.indexOf("delete failed: (500) error removing image") > 0) {
		return "创建机器失败，请删除后重新发布。错误详情：" + remark;
	}
	if (remark.indexOf("Instance could not be found") > 0) {
		return "创建机器失败，请删除后重新发布。错误详情：" + remark;
	}
	if (remark.indexOf("The Image") > 0
			& remark.indexOf("could not be found") > 0) {
		return "镜像不存在，创建机器失败。错误详情：" + remark;
	}
	if (remark.indexOf("delete failed: (500) No valid host was found") > 0) {
		return "创建机器失败，请删除后重新发布。错误详情：" + remark;
	}
	if (remark
			.indexOf("Resource CREATE failed: ResourceInError: Went to status error due to \"Unknown\"") > 0) {
		return "创建机器失败，请删除后重新发布。错误详情：" + remark;
	}
	if (remark.indexOf("Timed out waiting for a reply to message ") > 0) {
		return "创建机器超时，请检查服务是否工作正常。错误详情：" + remark;
	}
	if (remark.indexOf("No server is available to handle this request") > 0) {
		return "创建机器超时，请检查服务是否工作正常。错误详情：" + remark;
	}
	if (remark.indexOf("Flavor\'s disk is too small for requested image") > 0) {
		return "镜像大于所分配的系统盘容量，创建失败。错误详情：" + remark;
	}
	if (remark.indexOf("Unable to establish connection") > 0) {
		return "创建机器超时，请检查服务是否工作正常。错误详情：" + remark;
	}
	if (remark.indexOf("Insufficient compute resources: Free memory") > 0) {
		return "内存资源不足，创建机器失败。错误详情：" + remark;
	}
	if (remark.indexOf("internal server error while processing your request") > 0) {
		return "创建机器失败，请删除后重新发布。错误详情：" + remark;
	}
	if (remark.indexOf("was re-scheduled: Unexpected vif_type") > 0) {
		return "绑定虚拟网卡失败，请检查网络服务是否正常。错误详情：" + remark;
	}

	if (remark.indexOf("The IP address") > 0 & remark.indexOf("is in use") > 0) {
		return "IP已占用，请删除机器重新发布。错误详情：" + remark;
	}
	if (remark.indexOf("cannot found inject path") > 0) {
		return "创建机器失败，请检查镜像bootpath是否设置正确。错误详情：" + remark;
	}
	if (remark.indexOf("could not be found. (HTTP 400)") > 0) {
		return "创建云主机失败，请检查网络服务是否正常。错误详情：" + remark;
	}
	if (remark.indexOf("No more IP addresses available on network") > 0) {
		return "IP已用尽，请重新分配网络后创建机器。错误详情：" + remark;
	}
	if (remark.indexOf("Failed to allocate the network(s), not rescheduling") > 0) {
		return "创建云主机失败，请检查网络服务是否正常。错误详情：" + remark;
	}
	if (remark.indexOf("is not active") > 0 & remark.indexOf("Image") > 0) {
		return "创建云主机失败，镜像状态为未完成，无法创建机器。错误详情：" + remark;
	}
	if (remark.indexOf("guest os no found") > 0) {
		return "创建机器失败，请检查镜像bootpath是否设置正确。错误详情：" + remark;
	}

	return remark;
};
// zone name 去除重复
function uniqueHandle(zoneArray) {
	var result = [], hash = {};
	for (var i = 0, elem; (elem = zoneArray[i]) != null; i++) {
		if (!hash[elem]) {
			result.push(elem);
			hash[elem] = true;
		}
	}
	return result;
};

function countSize(sizeArray) {
	var result = 0;
	for (var i = 0; i < sizeArray.length; i++) {
		result += sizeArray[i];
	}
	return result;
}
