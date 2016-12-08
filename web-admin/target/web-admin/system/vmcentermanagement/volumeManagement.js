var vmOwnerEmail = '';
var selectedVolumeId = '';
// 虚拟机列表模板
var volumeModel = Ext.define('VolumeVO', {
	extend : 'Ext.data.Model',
	fields : [ 'id', 'vmId', 'volumeId', 'displayName','description', 'status',
			'attachStatus', {
				name : 'createDate',
				type : 'date',
				dateFormat : 'time'
			}, 'description', 'zone', 'ed_capacity' ],//
	idProperty : 'id'
});
// 磁盘列表Store
var volumeStore = Ext.create('Ext.data.Store', {
	model : 'VolumeVO',
	pageSize : listPageSize,// 每页显示16条数据
	autoLoad : false,
	proxy : new Ext.data.proxy.Ajax({
		url : path + '/../ops/ops!getExtDiskByPage.action',
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
			v_mask = new Ext.LoadMask(Ext.getBody(), {
				msg : i18n._('please wait'),
				removeMask : true
			});
			v_mask.show();
		},
		load : function(instanceStore, records, successful, eOpts) {
			// 遮罩层
			var v_mask = new Ext.LoadMask(Ext.getBody(), {
				msg : i18n._('please wait'),
				removeMask : true
			});
			v_mask.hide();
		}
	}
});

// 磁盘列表
var volumeGrid = Ext
		.create(
				'Ext.grid.Panel',
				{
					autoWidth : true,
					store : volumeStore,
					simpleSelect : true,
					selModel : Ext.create('Ext.selection.RowModel'),
					selType : 'cellmodel',
					iconCls : 'icon-grid',
					columnLines : true,
					bbar : Ext.create('Ext.toolbar.Paging', {
						store : volumeStore,
						displayInfo : true,
						inputItemWidth : pagingBarPageNumWidth,
						beforePageText : i18n._('beforePageText'),// "第"
						firstText : i18n._('firstText'),// "第一页"
						prevText : i18n._('prevText'),// "上一页"
						nextText : i18n._('nextText'),// "下一页"
						lastText : i18n._('lastText'),// "最后页"
						refreshText : i18n._('refreshText'),// "刷新"
					}),
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
									icon : 'images/add.png',// ../../images/zoom.png
									text : '<font id="createVolume" color="#ffffff" >'+i18n._('Create Disk')+'</font>',
									listeners : {
										"mouseout" : function() {
											document
													.getElementById("createVolume").style.color = "white";
										},
										"mouseover" : function() {
											document
													.getElementById("createVolume").style.color = "black";
										}

									},
									handler : function() {
										createVolumeWin.show();
									}

								},
								'-',
								{
									xtype : 'button',
									icon : 'images/add.png',// ../../images/zoom.png
									text : '<font id="deleteVolume" color="#ffffff" >'+i18n._('deletedisk')+'</font>',
									listeners : {
										"mouseout" : function() {
											document
													.getElementById("deleteVolume").style.color = "white";
										},
										"mouseover" : function() {
											document
													.getElementById("deleteVolume").style.color = "black";
										}

									},
									handler : function() {
										var rows = volumeGrid
												.getSelectionModel()
												.getSelection();
										if (verifyHaveRecord(rows)) {
											var selectVolume = rows[0];
											if (!needDetached(
													selectVolume.get('status'),
													selectVolume
															.get('attachStatus'))) {
												return;
											}
											Ext.MessageBox
											.confirm(
													i18n
															._('submit'),
													i18n
															._('Are you sure to delete'),
													function(btn) {
														if (btn == 'yes') {
											var volumeId = selectVolume
													.get("volumeId");
											Ext.Ajax
													.request({
														url : path
																+ '/../ops/ops!deleteVolume.action',
														method : 'POST',
														params : {
															'volumeBean.volumeId' : volumeId
														},
														success : function(
																form, action) {
															v_mask.hide();
															createVolumeForm
																	.getForm()
																	.reset();
															// createVolumeWin.remove(createVolumeForm,false);
															createVolumeWin
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
																			icon : Ext.MessageBox.ERROR
																		});
																return;
															}
															Ext.MessageBox
																	.show({
																		title : i18n
																				._('notice'),
																		msg : i18n
																				._('operationMessage'),
																		buttons : Ext.MessageBox.OK,
																		icon : Ext.MessageBox.INFO,
																		fn : reloadVolumeStore
																	});
														},
														failure : function(
																form, action) {
															v_mask.hide();
															Ext.MessageBox
																	.show({
																		title : i18n
																				._('errorNotice'),
																		msg : i18n
																				._('operateFail'),
																		buttons : Ext.MessageBox.OK,
																		icon : Ext.MessageBox.ERROR,
																		fn : reloadVolumeStore
																	});
														}
													});
														}else{return;}});
										}

									}

								},
								'-',
								{
									xtype : 'button',
									icon : 'images/add.png',// ../../images/zoom.png
									text : '<font id="extendVolume" color="#ffffff" >'+i18n._('Expansion Disk')+'</font>',
									listeners : {
										"mouseout" : function() {
											document
													.getElementById("extendVolume").style.color = "white";
										},
										"mouseover" : function() {
											document
													.getElementById("extendVolume").style.color = "black";
										}

									},
									handler : function() {
										var rows = volumeGrid
												.getSelectionModel()
												.getSelection();
										if (verifyHaveRecord(rows)) {
											var selectVolume = rows[0];
											if (!needDetachedAvailable(
													selectVolume.get('status'),
													selectVolume
															.get('attachStatus'))) {
												return;
											}
											var volumeSize = selectVolume
													.get("ed_capacity");
											selectedVolumeId = selectVolume
													.get("volumeId");
											newSizeField
													.setMinValue(volumeSize);
											newSizeField
											.setValue(volumeSize);
											extendVolumeWin.show();
										}
									}
								},
								'-',
								{
									xtype : 'button',
									icon : 'images/add.png',// ../../images/zoom.png
									text : '<font id="attachVolume" color="#ffffff" >'+i18n._('Binding disk')+'</font>',
									listeners : {
										"mouseout" : function() {
											document
													.getElementById("attachVolume").style.color = "white";
										},
										"mouseover" : function() {
											document
													.getElementById("attachVolume").style.color = "black";
										}

									},
									handler : function() {
										var rows = volumeGrid
												.getSelectionModel()
												.getSelection();
										if (verifyHaveRecord(rows)) {
											var selectVolume = rows[0];
											
											var diskZone=selectVolume.get('zone');
											if(diskZone!=vmZoneCodeDisk){
												Ext.MessageBox
												.show({
													title : i18n
															._('notice'),
													msg : i18n
															._('DiskZoneSameWithVMZone'),
													buttons : Ext.MessageBox.OK,
													icon : Ext.MessageBox.INFO,
													fn : reloadVolumeStore
												});
												return;
											}
											if (!needDetachedAvailable(
													selectVolume.get('status'),
													selectVolume
															.get('attachStatus'))) {
												return;
											}
											var volumeId = selectVolume
													.get("volumeId");
											Ext.Ajax
													.request({
														url : path
																+ '/../ops/ops!attachVolume.action',
														method : 'POST',
														params : {
															'volumeBean.volumeId' : volumeId,
															'volumeBean.uuid' : selectedVMUuid
														},
														success : function(
																form, action) {
															v_mask.hide();
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
																			icon : Ext.MessageBox.ERROR
																		});
																return;
															}
															Ext.MessageBox
																	.show({
																		title : i18n
																				._('notice'),
																		msg : i18n
																				._('operationMessage'),
																		buttons : Ext.MessageBox.OK,
																		icon : Ext.MessageBox.INFO,
																		fn : reloadVolumeStore
																	});
														},
														failure : function(
																form, action) {
															v_mask.hide();
															Ext.MessageBox
																	.show({
																		title : i18n
																				._('errorNotice'),
																		msg : i18n
																				._('operateFail'),
																		buttons : Ext.MessageBox.OK,
																		icon : Ext.MessageBox.ERROR,
																		fn : reloadVolumeStore
																	});
														}
													});
										}
									}
								},
								'-',
								{
									xtype : 'button',
									icon : 'images/add.png',// ../../images/zoom.png
									text : '<font id="detachVolume" color="#ffffff" >'+i18n._('Unbundling disk')+'</font>',
									listeners : {
										"mouseout" : function() {
											document
													.getElementById("detachVolume").style.color = "white";
										},
										"mouseover" : function() {
											document
													.getElementById("detachVolume").style.color = "black";
										}

									},
									handler : function() {
										var rows = volumeGrid
												.getSelectionModel()
												.getSelection();
										if (verifyHaveRecord(rows)) {
											var selectVolume = rows[0];
											if (!needAttached(
													selectVolume.get('status'),
													selectVolume
															.get('attachStatus'))) {
												return;
											}
											var volumeId = selectVolume
													.get("volumeId");
											Ext.Ajax
													.request({
														url : path
																+ '/../ops/ops!detachVolume.action',
														method : 'POST',
														params : {
															'volumeBean.volumeId' : volumeId,
															'volumeBean.uuid' : selectedVMUuid
														},
														success : function(
																form, action) {
															v_mask.hide();
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
																			icon : Ext.MessageBox.ERROR
																		});
																return;
															}
															Ext.MessageBox
																	.show({
																		title : i18n
																				._('notice'),
																		msg : i18n
																				._('operationMessage'),
																		buttons : Ext.MessageBox.OK,
																		icon : Ext.MessageBox.INFO,
																		fn : reloadVolumeStore
																	});
														},
														failure : function(
																form, action) {
															v_mask.hide();
															Ext.MessageBox
																	.show({
																		title : i18n
																				._('errorNotice'),
																		msg : i18n
																				._('operateFail'),
																		buttons : Ext.MessageBox.OK,
																		icon : Ext.MessageBox.ERROR,
																		fn : reloadVolumeStore
																	});
														}
													});
										}
									}
								} ]
					} ],

					columns : [
							Ext.create('Ext.grid.PageRowNumberer', {
								flex : 0.2,
								width : 50
							}),
							{
								text : i18n._('diskname'),
								flex : 0.4,
								sortable : true,
								dataIndex : 'displayName',
								renderer : function(data, metadata, record,
										rowIndex, columnIndex, store) {
									var string = new String(data);
									metadata.tdAttr = 'data-qtip="' + string
											+ '"';
									return data;
								}
							},
							{
								text : i18n._('disksize'),
								flex : 0.4,
								sortable : true,
								dataIndex : 'ed_capacity'
							},
							{
								text : i18n._('desc'),
								flex : 0.4,
								sortable : true,
								dataIndex : 'description',
								renderer : function(data, metadata, record,
										rowIndex, columnIndex, store) {
									var string = new String(data);
									metadata.tdAttr = 'data-qtip="' + string
											+ '"';
									return data;
								}
							},
							{
								text : i18n._('status'),
								flex : 0.4,
								sortable : true,
								dataIndex : 'status',
								renderer : function(data, metadata, record,
										rowIndex, columnIndex, store) {
									if (data == "AVAILABLE") {
										return i18n._('Available');
									}
									if (data == "CREATING") {
										return i18n._('Creation');
									}
								}
							},
							{
								text : i18n._('Binding status'),
								flex : 0.4,
								sortable : true,
								dataIndex : 'attachStatus',
								renderer : function(data, metadata, record,
										rowIndex, columnIndex, store) {
									if (record.get("vmId") == selectedVMUuid
											&& data == "ATTACHED") {
										return i18n._('Binding in the current host');
									}
									if (data == "DETACHED") { // DETACHING
										return i18n._('Non-binding status');
									}
									if (data == "ATTACHED") {
										return i18n._('Binding status');
									}
									if (data == "DETACHING") { // DETACHING   ATTACHING
										return i18n._('Unbind in');
									}
									if (data == "ATTACHING") { // DETACHING   
										return i18n._('ATTACHING');
									}

								}
							},
							{
								text : i18n._('createTime'),//
								flex : 0.5,
								sortable : true,
								dataIndex : 'createDate',
								renderer : function(data, metadata, record,
										rowIndex, columnIndex, store) {
									metadata.tdAttr = 'data-qtip="'
											+ Ext.Date.format(data,
													"Y-m-d H:i:s") + '"';
									return Ext.Date.format(data, "Y-m-d H:i:s");
								}
							} ],
					listeners : {
						itemclick : function(instanceGrid, record, item, index,
								e, eOpts) {
							vmRunner.stopAll();
						},
						itemcontextmenu : function(instanceGrid, record, item,
								index, e, eOpts) {
							e.stopEvent();
							contextMenu.showAt(e.getXY());
							return false;
						}
					}
				});// 创建grid

function needDetachedAvailable(status, attachStatus) {
	if (status == 'AVAILABLE'
			&& (attachStatus == 'DETACHED' )) {
		return true;
	}
	Ext.MessageBox.show({
		title : i18n._('notice'),
		msg : i18n._('The disk must be available and unbound state to perform this operation'),
		icon : Ext.MessageBox.INFO,
		buttons : Ext.MessageBox.OK
	});
	return false;
}

function needDetached(status, attachStatus) {
	if (attachStatus == 'DETACHED') {
		return true;
	}
	Ext.MessageBox.show({
		title : i18n._('notice'),
		msg : i18n._('The disk must be unbundling status for this operation'),//'磁盘必须是解绑状态才能进行此操作！',
		icon : Ext.MessageBox.INFO,
		buttons : Ext.MessageBox.OK
	});
	return false;
}

function needAttached(status, attachStatus) {
	if (status == 'AVAILABLE'
			&& (attachStatus == 'ATTACHED')) {
		return true;
	}
	Ext.MessageBox.show({
		title : i18n._('notice'),
		msg :  i18n._('The disk must be available in a non-unbundling status for this operation'),//'磁盘必须是可用非解绑状态才能进行此操作！',
		icon : Ext.MessageBox.INFO,
		buttons : Ext.MessageBox.OK
	});
	return false;
}

var volumeManagementWin = Ext.create('Ext.window.Window', {
	width : 800,// 400
	height : 500,
	title : i18n._('diskmanagement'),
	closable : false,
	constrain : true,
	modal : true,
	tools : [ {
		type : 'close',
		handler : function() {
			volumeManagementWin.hide();
		}
	} ],
	layout : 'fit',
	defaults : {
		split : false
	},
	items : [ volumeGrid ]
});

var createVolumeNameField = Ext.create('Ext.form.field.Text', {
	name : 'volumeName',
	labelWidth : 80,
	fieldLabel : i18n._('diskname'),// 主机名称
	allowBlank : false,
	regex : /^[\w-@#$%^ &*\u4e00-\u9fa5]+$/,
	regexText : i18n._('InvalidCharacters'),
	maxLength : 20,
	enforceMaxLength : true,
	width : 360,
	emptyText : i18n._('diskname'),
	blankText : i18n._('Please enter the disk name')
});

var createSizeField = Ext.create('Ext.form.field.Number', {
	fieldLabel : i18n._('disksize'),
	labelWidth : 80,
	width : 360,
	maxValue : 1024,
	minValue : 1,
	emptyText : i18n._('disksize'),
	blankText : i18n._('Please enter the disk size'),
	allowBlank : false
});

var createDescField = Ext.create('Ext.form.field.TextArea', {
	fieldLabel : i18n._('diskdesc'),//'磁盘描述',
	labelWidth : 80,
	width : 360,
	maxLength : 250,
	enforceMaxLength : true
});

// 创建虚拟机zone数据Data
var volumeCreateZoneData = [];
// 创建虚拟机zone数据Store
var volumeCreateZoneStore = Ext.create('Ext.data.Store', {
	fields : [ 'id', 'name', 'code' ],
	proxy : {
		// model: 'ServiceItem',
		type : 'ajax',
		url : path + '/../sc/zone!getAllZones.action',
		// extraParams:{serviceType:1},
		reader : {
			type : 'json',
			root : 'resultObject',
			totalProperty : 'resultObject.totalCount'
		}
	},
	data : volumeCreateZoneData,
	autoLoad : false
});

volumeCreateZoneStore.load();

var volumeCreateZoneComb = Ext.create('Ext.form.ComboBox', {
	fieldLabel : i18n._('Release zone'),// 发布区域
	width : 360,
	listConfig : {
		maxHeight : 200
	},
	labelWidth : 80,// 100
	editable : false,
	allowBlank : false,
	store : volumeCreateZoneStore,
	queryMode : 'local',
	displayField : 'name',
	valueField : 'code',
	emptyText : i18n._('Please select a publishing zone')
});

// 创建虚拟机Form
var createVolumeForm = Ext.create('Ext.form.Panel', {
	frame : true,
	autoScroll : true,
	// title: 'Form Fields',
	// width: 750,
	bodyPadding : 20,
	fieldDefaults : {
		labelAlign : 'left',
		labelWidth : 60,
		anchor : '100%'
	},
	items : [ {
		xtype : 'fieldcontainer',
		layout : 'hbox',
		margin : '15,0',
		items : [ createVolumeNameField ]
	}, {
		xtype : 'fieldcontainer',
		layout : 'hbox',
		margin : '15,0',
		items : [ createSizeField, {
			xtype : 'displayfield',
			margin : '0 5 0 10',
			width : 250,
			value : "(G)"// 请根据下拉列表选择操作系统类别
		} ]
	}, {
		xtype : 'fieldcontainer',
		layout : 'hbox',
		margin : '15,0',
		items : [ createDescField ]
	}, {
		xtype : 'fieldcontainer',
		layout : 'hbox',
		margin : '15,0',
		items : [ volumeCreateZoneComb ]
	} ],
	buttons : [
			{
				text : i18n._('OK'),
				handler : function() {
					if (createVolumeNameField.isValid()
							&& createSizeField.isValid()
							&& createDescField.isValid()
							&& volumeCreateZoneComb.isValid()) {
						var volumeName = createVolumeNameField.getValue();
						var volumeSize = createSizeField.getValue();
						var volumeDesc = createDescField.getValue();
						var volumeZone = volumeCreateZoneComb.getValue();
						var v_mask = new Ext.LoadMask(Ext.getBody(), {
							msg : i18n._('please wait'),
							removeMask : true
						// 完成后移除
						});
						v_mask.show();
						Ext.Ajax.request({
							url : path + '/../ops/ops!createVolume.action',
							method : 'POST',
							params : {
								'volumeBean.ed_name' : volumeName,
								'volumeBean.description' : volumeDesc,
								'volumeBean.ed_capacity' : volumeSize,
								'volumeBean.zone' : volumeZone,
								'volumeBean.ownerEmail' : vmOwnerEmail
							},
							success : function(form, action) {
								v_mask.hide();
								createVolumeForm.getForm().reset();
								// createVolumeWin.remove(createVolumeForm,false);
								createVolumeWin.hide();
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
										msg : obj.resultMsg,
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
									return;
								}
								reloadVolumeStore();
								Ext.MessageBox.show({
									title : i18n._('notice'),
									msg : i18n._('operationMessage'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.INFO,
									fn : reloadVolumeStore
								});
							},
							failure : function(form, action) {
								v_mask.hide();
								Ext.MessageBox.show({
									title : i18n._('errorNotice'),
									msg : i18n._('operateFail'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR,
									fn : reloadVolumeStore
								});
							}
						});

					} else {
						return;
					}

				}
			}, {
				text : i18n._('Cancel'),
				handler : function() {
					createVolumeForm.getForm().reset();
					// createVolumeWin.remove(createVolumeForm,false);
					createVolumeWin.hide();
				}
			} ]
});

var newSizeField = Ext.create('Ext.form.field.Number', {
	fieldLabel : i18n._('disksize'),
	labelWidth : 80,
	width : 360,
	maxValue : 1024,
	minValue : 1,
	emptyText : i18n._('disksize'),
	blankText : i18n._('Please enter the disk size'),
	allowBlank : false
});

var extendVolumeForm = Ext.create('Ext.form.Panel', {
	frame : true,
	autoScroll : true,
	bodyPadding : 15,
	fieldDefaults : {
		labelAlign : 'left',
		labelWidth : 60,
		anchor : '100%'
	},
	items : [ {
		xtype : 'fieldcontainer',
		layout : 'hbox',
		items : [ newSizeField, {
			xtype : 'displayfield',
			margin : '0 5 0 25',
			width : 230,
			value : i18n._('Expansion size must be greater than the original size')
		} ]
	} ],
	buttons : [ {
		text : i18n._('OK'),
		handler : function() {
			if (newSizeField.isValid()) {
				var volumeSize = newSizeField.getValue();
				var v_mask = new Ext.LoadMask(Ext.getBody(), {
					msg : i18n._('please wait'),
					removeMask : true
				// 完成后移除
				});
				v_mask.show();
				Ext.Ajax.request({
					url : path + '/../ops/ops!extendVolume.action',
					method : 'POST',
					params : {
						'volumeBean.newSize' : volumeSize,
						'volumeBean.volumeId' : selectedVolumeId
					},
					success : function(form, action) {
						v_mask.hide();
						extendVolumeForm.getForm().reset();
						// createVolumeWin.remove(createVolumeForm,false);
						extendVolumeWin.hide();
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
								msg : obj.resultMsg,
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
							return;
						}
						reloadVolumeStore();
						Ext.MessageBox.show({
							title : i18n._('notice'),
							msg : i18n._('operationMessage'),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.INFO,
							fn : reloadVolumeStore
						});
					},
					failure : function(form, action) {
						v_mask.hide();
						Ext.MessageBox.show({
							title : i18n._('errorNotice'),
							msg : i18n._('operateFail'),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR,
							fn : reloadVolumeStore
						});
					}
				});

			} else {
				return;
			}

		}
	}, {
		text : i18n._('Cancel'),
		handler : function() {
			extendVolumeForm.getForm().reset();
			// createVolumeWin.remove(createVolumeForm,false);
			extendVolumeWin.hide();
		}
	} ]
});

var createVolumeWin = Ext.create('Ext.window.Window', {
	width : 500,// 400
	height : 350,
	title : i18n._('Create Disk'),
	closable : false,
	constrain : true,
	modal : true,
	tools : [ {
		type : 'close',
		handler : function() {
			createVolumeWin.hide();
		}
	} ],
	layout : 'fit',
	defaults : {
		split : false
	},
	items : [ createVolumeForm ]
});

var extendVolumeWin = Ext.create('Ext.window.Window', {
	width : 600,// 400
	height : 150,
	title : i18n._('Expansion Disk'),
	closable : false,
	constrain : true,
	modal : true,
	tools : [ {
		type : 'close',
		handler : function() {
			extendVolumeWin.hide();
		}
	} ],
	layout : 'fit',
	defaults : {
		split : false
	},
	items : [ extendVolumeForm ]
});

function reloadVolumeStore() {
	volumeStore.load();
}

function verifyHaveRecord(records) {
	if (records) {
		if (records.length > 0) {
			return true;
		}
	}

	Ext.MessageBox.show({
		title : i18n._('notice'),
		msg : i18n._('selectOne'),
		icon : Ext.MessageBox.INFO,
		buttons : Ext.MessageBox.OK
	});

	return false;

}