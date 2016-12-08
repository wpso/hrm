/******************************vmAdjustForm******************************************/
//params = getCookie("lang");
//i18n.set({
//	lang : params,
//	path : '../../resources'
//});
Ext.Loader.setConfig({
	enabled : true
});
var v_mask = null;//遮罩层
var vmAdjustDiskAddCount = 0;
var vmAdjustDiskArray = [];
var vmAdjustCPUCoreField = Ext.create('Ext.form.field.Text', {
	name : 'vmAdjustCPUCore'	
});
var vmAdjustRamField = Ext.create('Ext.form.field.Text', {
	name : 'vmAdjustRam'	
});
var vmAdjustDiskField = Ext.create('Ext.form.field.Text', {
	name : 'vmAdjustDisk'	
});
var vmIdAdjustField = Ext.create('Ext.form.field.Text', {
	name : 'vmIdField'	
});
var vmOldIPAdjustField = Ext.create('Ext.form.field.Text',{
	name : 'vmOldIPAdjustField'
});


function isFormChanged(formPanel)
{ 
	var form = formPanel.getForm(); 
	var dirty = false;
	if(form) 
	{  form.items.each(function(item){   
		if(!dirty) dirty = item.isDirty(); 
		}); 
	} 
	return dirty;
} 

//var DiskAdjustFieldContainer2 = null;
//调整VM
//调整虚拟机扩展盘数据Store
var vmAdjustVolumeStore = Ext.create('Ext.data.Store', {
	autoLoad : false,//true
	fields : [ 'id','status','size','name','vmId','device','mode'],
	proxy:new Ext.data.proxy.Ajax({
		//model: 'ServiceItem',
        //type: 'ajax',
        url : path+'/../ops/ops!getAttachVolumesOfVm.action',
		//extraParams:{serviceType:1},
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
    }),        
	listeners : {
		load : function(vmAdjustVolumeStore, records, successful, eOpts ){
//			if(configAdjustPanel.getComponent(4)!=null){
//				configAdjustPanel.remove(configAdjustPanel.getComponent(4),true);
//			}			
			if(successful && vmAdjustVolumeStore.getCount()>0){	
				addDiskCount = vmAdjustVolumeStore.getCount();
				for(var i=0;i<vmAdjustVolumeStore.getCount();i++){
					var volumeId = vmAdjustVolumeStore.getAt(i).get('id');
					if(volumeId==0)continue;
					var volumeSize = vmAdjustVolumeStore.getAt(i).get('size');
					var volumeMode = vmAdjustVolumeStore.getAt(i).get('mode');
					var extDiskIndex = vmAdjustExtDiskStore.find('capacity',volumeSize);
					var DiskAdjustDisplayField2 = Ext.create('Ext.form.field.Display', {
						id : 'volumeAdjustDisplay' + volumeId,
						width : 100
						//value : 0
					});
					var DiskAdjustField2 = Ext.create('Ext.slider.Single', {
						name : 'DiskAdjust',
						id : 'volumeAdjustField' + volumeId,
						inputId:volumeId,
						fieldLabel : i18n._('extDisk'),//
						width : 230,
						margin :'0 0 0 20',
						disabled:false,
						increment : 1,
						minValue : 0,// 1
						maxValue : vmAdjustExtDiskStore.getCount()-1,
						//value : 0,// 1
						tipText : function(thumb) {
							return Ext.String.format('<b>{0}</b>', vmAdjustExtDiskStore.getAt(thumb.value).get('capacity')+'G');
						},
						listeners : {
							'change' : {
								fn : function() {									
									var inputId = this.getInputId();
									Ext.getCmp('volumeAdjustDisplay' + inputId).setValue(vmAdjustExtDiskStore.getAt(this.getValue()).get('capacity')+'G');
								}
							}
						}
					});
					var vmId=vmid;
					var vmAdjustModifyDiskButton2 = Ext.create('Ext.Button', {
						text :volumeId,
						icon : 'images/save.png',
						tooltip:i18n._('Save'),
						margin :'0 5 0 0',
						width: 20,
						height:20,
						handler : function() {	
							//遮罩层
							v_mask = new Ext.LoadMask(Ext
									.getBody(), {
								msg : i18n._('please wait'),
								removeMask : true			
							});
							var itemId = this.getText();
							var diskSize=vmAdjustExtDiskStore.getAt(Ext.getCmp('volumeAdjustField'+itemId).getValue()).get('capacity');
							var mode=vmAdjustVolumeStore.findRecord('id',itemId).get('mode');
							var size=vmAdjustVolumeStore.findRecord('id',itemId).get('size');
							if(size>diskSize){
								Ext.MessageBox.show({
									title : i18n._('errorNotice'),
									msg : i18n._('Adjust only supports disk expansion'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.WARNING
								});
								return;
							}
//							alert('**'+vmAdjustExtDiskStore.getAt(Ext.getCmp('volumeAdjustField'+itemId).getValue()).get('capacity'));
							Ext.MessageBox.confirm(i18n._('submit'),i18n._('Are you sure to modify'),function(btn) {
								if (btn == 'yes') {	
									v_mask.show();
									var start = Ext.Ajax.request({
										url : path+ '/../ops/ops!modifyVolume.action',
										method : 'POST',
										params : {
											'volumeId' : itemId,
											'id' : vmId,
											'volumeSize':diskSize
										},
										success : function(form,action) {
											v_mask.hide();
											var obj = Ext.decode(form.responseText);
											if (obj == null|| obj.success == null) {
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
											v_mask.hide();
											Ext.MessageBox.show({
												title : i18n._('errorNotice'),
												msg : i18n._('operateFail'),
												buttons : Ext.MessageBox.OK,
												icon : Ext.MessageBox.WARNING,
												fn: reLoadData
											});
										}
									});
								}
							});								
							adjustVMForm.getForm().reset();
							adjustVMWin.remove(adjustVMForm,false);
							adjustVMWin.hide();
						}
					});
					var vmAdjustDeleteDiskButton2 = Ext.create('Ext.Button', {
						itemId :volumeId,
						text : '×',
						width: 20,
						height:20,			
						//renderTo : Ext.getBody(),
						handler : function() {	
							//遮罩层
							v_mask = new Ext.LoadMask(Ext
									.getBody(), {
								msg : i18n._('please wait'),
								removeMask : true			
							});
							//alert('**'+this.getItemId());
							var itemId = this.getItemId();
							Ext.MessageBox.confirm(i18n._('submit'),i18n._('Are you sure to delete'),function(btn) {
								if (btn == 'yes') {	
									v_mask.show();									
									//alert('**'+vmAdjustVolumeStore.findRecord('id',vmAdjustDeleteDiskButton2.getItemId()).get('mode'));
									var mode=vmAdjustVolumeStore.findRecord('id',itemId).get('mode');
									//var mode=vmAdjustExtDiskStore.getAt(vmAdjustExtDiskStore.indexOfId(vmAdjustDeleteDiskButton2.getItemId())).get('mode');
									var start = Ext.Ajax.request({
										url : path+ '/../ops/ops!dettachVolume.action',
										method : 'POST',
										params : {
											'volumeId' : itemId,
											'id' : vmId,
											'volumeMode':mode
										},
										success : function(form,action) {
											v_mask.hide();
											var obj = Ext.decode(form.responseText);
											if (obj == null|| obj.success == null) {
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
											v_mask.hide();
											Ext.MessageBox.show({
												title : i18n._('errorNotice'),
												msg : i18n._('operateFail'),
												buttons : Ext.MessageBox.OK,
												icon : Ext.MessageBox.WARNING,
												fn: reLoadData
											});
										}
									});
								}
							});							
							configAdjustPanel.remove(Ext.getCmp('volumeAdjustContainer' + itemId),true);
							adjustVMForm.getForm().reset();
							adjustVMWin.remove(adjustVMForm,false);
							adjustVMWin.hide();
						}
					});
					
					var DiskAdjustFieldContainer2 = Ext.create('Ext.form.FieldContainer', {
					//DiskAdjustFieldContainer2 = new Ext.form.FieldContainer({
						id : 'volumeAdjustContainer' + volumeId,
						width : 460,
						autoDestroy:true,
						layout : 'hbox',
						items : [ DiskAdjustField2, DiskAdjustDisplayField2,vmAdjustModifyDiskButton2,vmAdjustDeleteDiskButton2,{
							xtype : 'displayfield',
							width : 100,
							margin :'0 5 0 5',
							value : i18n._('Delete the disk')//删除该盘
						} ]
					});
					//DiskAdjustFieldContainer2.updateBox(this);
					DiskAdjustDisplayField2.setValue(volumeSize+'G');
					//DiskAdjustField2.setRawValue(volumeSize);	
					DiskAdjustField2.setValue(extDiskIndex);
					configAdjustPanel.add(DiskAdjustFieldContainer2);
				}				
			}
		}
	}
});
//调整虚拟机CPU数据Data
var vmAdjustCPUData = [];
//调整虚拟机CPU数据Store
var vmAdjustCPUStore = Ext.create('Ext.data.Store', {
	autoLoad : false,//true
	fields : [ 'id','serviceType','name','coreNum','status','model','frequency' ],
	proxy:new Ext.data.proxy.Ajax({
		//model: 'ServiceItem',
        //type: 'ajax',
        url : path+'/../sc/serviceItem!listServiceItem.action?serviceType=1',
		//extraParams:{serviceType:1},
		reader: {
            type: 'json',
			root:'resultObject',
			totalProperty: 'resultObject.totalCount'
        },
        listeners:{
			exception:function(reader, response, error, eOpts){
				ajaxException(reader, response, error, eOpts );
			}
		}
    }),
    //data : vmAdjustCPUData,
    sorters: [
              {
                  property : 'coreNum',
                  direction: 'ASC'
              }
          ],
    remoteSort:true,    
	listeners : {
		load : function(vmAdjustCPUStore, records, successful, eOpts ){
			if(successful && vmAdjustCPUStore.getCount()>0){
				var storeIndex = vmAdjustCPUStore.find('coreNum',vmAdjustCPUCoreField.getValue());
				//alert('##'+vmAdjustCPUCoreField.getValue());
				//alert('@@'+storeIndex);
				vmAdjustCPUComb.setValue(vmAdjustCPUStore.getAt(storeIndex).get('id'));
				//vmAdjustCPUComb.setValue(vmAdjustCPUStore.getAt(storeIndex).get('coreNum'));
				//CPUAdjustField.setMaxValue(vmAdjustCPUStore.getCount()-1);				
				//CPUAdjustField.setRawValue(vmAdjustCPUStore.getAt(0).get('coreNum'));
				//CPUAdjustDisplayField.setValue(vmAdjustCPUStore.getAt(0).get('coreNum')+ i18n._('core'));
			}
		}
	}
});
//创建虚拟机Ram数据Store
var vmAdjustRamStore = Ext.create('Ext.data.Store', {
	fields : [ 'id','serviceType','size','model','status' ],
	proxy:new Ext.data.proxy.Ajax({
		//model: 'ServiceItem',
        type: 'ajax',
        url : path+'/../sc/serviceItem!listServiceItem.action?serviceType=2',
		//extraParams:{serviceType:1},
		reader: {
            type: 'json',
			root:'resultObject',
			totalProperty: 'resultObject.totalCount'
        },
        listeners:{
			exception:function(reader, response, error, eOpts){
				ajaxException(reader, response, error, eOpts );
			}
		}
    }),
    sorters: [
              {
                  property : 'size',
                  direction: 'ASC'
              }
          ],
	remoteSort:true,
	autoLoad : false,//true
    listeners : {
		load : function(vmAdjustRamStore, records, successful, eOpts ){
			if(successful && vmAdjustRamStore.getCount()>0){
				RAMAdjustField.setMaxValue(vmAdjustRamStore.getCount()-1);
				RAMAdjustField.setValue(vmAdjustRamStore.find('size',vmAdjustRamField.getValue()));
				//RAMAdjustField.setRawValue(vmAdjustRamStore.getAt(0).get('size'));
				//RAMAdjustDisplayField.setValue(vmAdjustRamStore.getAt(0).get('size')+'M');
			}
		}
	}
});
//创建虚拟机Disk数据Store
var vmAdjustDiskStore = Ext.create('Ext.data.Store', {
	fields : [ 'id','serviceType','capacity','model','status' ],
	proxy:new Ext.data.proxy.Ajax({
		//model: 'ServiceItem',
        type: 'ajax',
        url : path+'/../sc/serviceItem!listServiceItem.action?serviceType=3',
		//extraParams:{serviceType:1},
		reader: {
            type: 'json',
			root:'resultObject',
			totalProperty: 'resultObject.totalCount'
        },
        listeners:{
			exception:function(reader, response, error, eOpts){
				ajaxException(reader, response, error, eOpts );
			}
		}
    }),
    sorters: [
              {
                  property : 'capacity',
                  direction: 'ASC'
              }
          ],
	remoteSort:true,
	autoLoad : false,//true
    listeners : {
		load : function(vmAdjustDiskStore, records, successful, eOpts ){
			if(successful && vmAdjustDiskStore.getCount()>0){
				DiskAdjustField.setMaxValue(vmAdjustDiskStore.getCount()-1);
				DiskAdjustField.setValue(vmAdjustDiskStore.find('capacity',vmAdjustDiskField.getValue()));
				//DiskAdjustField.setRawValue(vmAdjustDiskStore.getAt(0).get('capacity'));
				//DiskAdjustDisplayField.setValue(vmAdjustDiskStore.getAt(0).get('capacity')+'G');
			}
		}
	}
});
//调整虚拟机扩展Disk数据Store
var vmAdjustExtDiskStore = Ext.create('Ext.data.Store', {
	fields : [ 'id','serviceType','capacity','model','status' ],
	proxy:new Ext.data.proxy.Ajax({
		//model: 'ServiceItem',
        type: 'ajax',
        url : path+'/../sc/serviceItem!listServiceItem.action?serviceType=8',
		//extraParams:{serviceType:1},
		reader: {
            type: 'json',
			root:'resultObject',
			totalProperty: 'resultObject.totalCount'
        },
        listeners:{
			exception:function(reader, response, error, eOpts){
				ajaxException(reader, response, error, eOpts );
			}
		}
    }),
    sorters: [
              {
                  property : 'capacity',
                  direction: 'ASC'
              }
          ],
	remoteSort:true,
	autoLoad : false//true    
});
//主机别名修改
var vmNameAdjustField = Ext.create('Ext.form.field.Text', {
	labelWidth : 80,
	fieldLabel : i18n._('vm_name'),// 主机名称
	allowBlank : false,
	regex:/^[\w-@#$%^ &*\u4e00-\u9fa5]+$/,
	regexText:i18n._('InvalidCharacters'),
	maxLength : 50,
	enforceMaxLength:true,
	width : 350,
	emptyText : i18n._('vm_name')//主机名称
});
//调整虚拟机IP数据Data
//var vmAdjustIPData = [];
//调整创建虚拟机IP数据Store
var vmAdjustIPStore = Ext.create('Ext.data.Store', {
	fields : [ 'id', 'ip' ],
	proxy:new Ext.data.proxy.Ajax({
		//model: 'ServiceItem',
        type: 'ajax',
        url : path+'/../ip/findAllFreeIPDetail!findAvailableIPDetailOfVM.action',
		//extraParams:{serviceType:1},
		reader: {
            type: 'json',
			root:'resultObject',
			totalProperty: 'resultObject.totalCount'
        }
    }),
	//data : vmAdjustIPData,
	autoLoad : false/*,//true
	listeners : {
		load : function(vmAdjustIPStore, records, successful, eOpts ){
			if(successful && vmAdjustIPStore.getCount()>0){
				//vmCreateIPComb.setValue(vmCreateIPStore.getAt(0).get('ip'));
			}
		}
	}*/
});

//绑定IP修改
var vm_outerIp=new Array();
//var addCount=0;
var vmIPAdjustField = Ext.create('Ext.form.ComboBox',{//Ext.create('Ext.form.field.Text'
	labelWidth : 80,
	listConfig:{maxHeight:200},
	fieldLabel : i18n._('OuterIP'),// 公网IP
	store : vmAdjustIPStore,
	//allowBlank : false,
	//regex : /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/,// 禁止输入空白字符
	//regexText : i18n._('InvalidIP'),
	queryMode : 'remote',
	displayField : 'ip',
	valueField : 'id',
//	multiSelect:true,
//	forceSelection:true,
	maxLength : 100,
	//maxLength : 20,
	width : 350,
	emptyText : i18n._('OuterIP'),// 公网IP
	listeners:{		
		change:function( vmIPAdjustField, newValue, oldValue, eOpts ){
//			alert("newValue2"+newValue);
			if(newValue !=null || newValue !=""){
				return;
			}
			if(vm_outerIp.indexOf(newValue) == -1){
//				addCount = addCount + 1;				
				var IpShowField = Ext.create('Ext.form.field.Text', {
					id:'ipShowField'+newValue,
					width : 100,
					margin:'0 0 0 85'
				});
				IpShowField.setValue(newValue);
				var vmIPDeleteBtn = Ext.create('Ext.Button', {
					itemId:newValue,
					text : '×',//删除IP
					handler : function() {
//						addCount = addCount - 1;
						vm_outerIp.removevalue(vmIPDeleteBtn.getItemId());
						outerIpAdjustContainer.remove(Ext.getCmp('ipShowContainer'+vmIPDeleteBtn.getItemId()),true);
					}
				});
				var IpAdjustFieldContainer = Ext.create('Ext.form.FieldContainer',{
					id:'ipShowContainer'+newValue,
					width : 400,
					layout : 'hbox',
					items : [ IpShowField,vmIPDeleteBtn ]
				});
				vm_outerIp.push(newValue);	
				outerIpAdjustContainer.add(IpAdjustFieldContainer);	
			}
				vm_outerIp.push(newValue);
				vmIPAdjustField.setValue(newValue);
//				outerIpAdjustContainer.add(IpAdjustFieldContainer);	
//			}
			
		}
	}
});
//调整虚拟机用户数据文本框
var vmAdjustUserText = Ext.create('Ext.form.field.Text', {	
	name : 'ownerEmail',
	vtype: 'email',
	hidden:true,
	width : 350,
	labelWidth : 80,
	fieldLabel : i18n._('SpecifiedUser'),//指定用户	
	emptyText : i18n._('Please enter an email of owner'),
	listeners : {		
		change : function(vmAdjustUserText, newValue, oldValue, eOpts){
			if(newValue == oldValue || vmAdjustUserText.isValid() == false){
				return;
			}
			if(vmAdjustUserText.getValue()!= null && vmAdjustUserText.getValue()!=""){
				var proxy = vmAdjustUserStore.getProxy();
				proxy.setExtraParam('query',vmAdjustUserText.getValue());
				vmAdjustUserStore.load();
			}
		}
	}	
});
//创建虚拟机用户数据Data
var vmAdjustUserData = [];
//创建虚拟机用户数据Store
var vmAdjustUserStore = Ext.create('Ext.data.Store', {
	fields : [ 'id', 'name','email' ],
	proxy:{
        type: 'ajax',
        url : path+'/../admin_mgmt/userManagement!getAllAvailableUser.action',
		reader: {
            type: 'json',
			root:'resultObject',
			totalProperty: 'resultObject.totalCount'
        }
    },
	data : vmAdjustUserData,
	autoLoad : false
});
//创建虚拟机CPU下拉列表框
var vmAdjustCPUComb = Ext.create('Ext.form.ComboBox', {
	fieldLabel : i18n._('CPU'),//
	width : 300,
	labelWidth : 80,
	listConfig:{maxHeight:200},
	editable : false,
	store : vmAdjustCPUStore,
	//queryMode : 'local',
	displayField : 'name',
	valueField : 'id'
});
//调整虚拟机Memory示值
var RAMAdjustDisplayField = Ext.create('Ext.form.field.Display', {
	width : 100,
	value : 0
});
//调整虚拟机Memory滑块
var RAMAdjustField = Ext.create('Ext.slider.Single', {
	name : 'RAMAdjust',
	fieldLabel : i18n._('MEM'),//
	width : 230,
	increment : 1,
	minValue : 0,// 1
	//maxValue : 100,
	value : 0,// 1
	tipText : function(thumb) {
		return Ext.String.format('<b>{0}</b>', vmAdjustRamStore.getAt(thumb.value).get('size')+'M');
	},
	listeners : {
		'change' : {
			fn : function() {
				RAMAdjustDisplayField.setValue(vmAdjustRamStore.getAt(this.getValue()).get('size')+'M');
			}
		}
	}
});
//调整虚拟机Memory容器
var RAMAdjustFieldContainer = Ext.create('Ext.form.FieldContainer', {
	width : 400,
	layout : 'hbox',
	items : [ RAMAdjustField, RAMAdjustDisplayField ]
});
//调整虚拟机Disk示值
var DiskAdjustDisplayField = Ext.create('Ext.form.field.Display', {
	width : 100,
	value : 0
});
//调整虚拟机Disk滑块
var DiskAdjustField = Ext.create('Ext.slider.Single', {
	name : 'DiskAdjust',
	fieldLabel : i18n._('DISK'),//
	width : 230,
	disabled:true,
	increment : 1,
	minValue : 0,// 1
	//maxValue : vmAdjustDiskStore.getCount()-1,
	value : 0,// 1
	tipText : function(thumb) {
		return Ext.String.format('<b>{0}</b>', vmAdjustDiskStore.getAt(thumb.value).get('capacity')+'G');
	},
	listeners : {
		'change' : {
			fn : function() {
				DiskAdjustDisplayField.setValue(vmAdjustDiskStore.getAt(this.getValue()).get('capacity')+'G');
			}
		}
	}
});
//调整虚拟机删除Disk按钮
var vmAdjustDeleteDiskButton = Ext.create('Ext.Button', {
	text : '×',
	width: 20,
	height:20,
	//renderTo : Ext.getBody(),
	handler : function() {
		DiskAdjustField.setDisabled(true);
		// createVMForm.remove(Ext.getCmp('diskContainer'+diskCreateCount));
		// diskCreateCount=diskCreateCount-1;
	}
});
//调整虚拟机Disk容器
var DiskAdjustFieldContainer = Ext.create('Ext.form.FieldContainer', {
	width : 450,
	layout : 'hbox',
	items : [ DiskAdjustField, DiskAdjustDisplayField]
/*
, vmAdjustDeleteDiskButton, {
		xtype : 'displayfield',
		width : 50,
		margin :'0 5 0 5',
		value : i18n._('Delete the disk')//删除该盘
	} ]
	*/
});
var addDiskCount=0;
//调整虚拟机添加Disk按钮
var vmAdjustAddDiskButton = Ext.create('Ext.Button', {
	text : '+',
	width: 20,
	height:20,
	//renderTo : Ext.getBody(),
	handler : function() {
		if(vmAdjustExtDiskStore.getCount()<=0){
			Ext.MessageBox.show({
				title : i18n._('notice'),
				msg : i18n._('There is no available expansion disk'),//没有可用的扩展磁盘
				icon : Ext.MessageBox.WARNING,
				buttons : Ext.MessageBox.OK
			});
			return;
		}		
		addDiskCount = addDiskCount + 1;		
		if(addDiskCount>4){
			addDiskCount = addDiskCount - 1;
			Ext.MessageBox.show({
				title : i18n._('notice'),
				msg : i18n._('addExtDiskTip'),
				icon : Ext.MessageBox.INFO,
				buttons : Ext.MessageBox.OK
			});
			return;
		}
		vmAdjustDiskAddCount = vmAdjustDiskAddCount + 1;
		vmAdjustDiskArray.push(vmAdjustDiskAddCount);
		var DiskAdjustDisplayField2 = Ext.create('Ext.form.field.Display', {
			id : 'diskAdjustDisplay' + vmAdjustDiskAddCount,
			width : 100,
			value : 0
		});
		var DiskAdjustField2 = Ext.create('Ext.slider.Single', {
			name : 'DiskAdjust',
			id : 'diskAdjustField' + vmAdjustDiskAddCount,
			fieldLabel : i18n._('extDisk'),//
			width : 230,
			margin :'0 0 0 20',
			increment : 1,
			minValue : 0,// 1
			maxValue : vmAdjustExtDiskStore.getCount()-1,
			value : 0,// 1
			tipText : function(thumb) {
				return Ext.String.format('<b>{0}</b>', vmAdjustExtDiskStore.getAt(thumb.value).get('capacity')+'G');
			},
			listeners : {
				'change' : {
					fn : function() {
						DiskAdjustDisplayField2.setValue(vmAdjustExtDiskStore.getAt(this.getValue()).get('capacity')+'G');
					}
				}
			}
		});
		var vmAdjustDeleteDiskButton2 = Ext.create('Ext.Button', {
			itemId :vmAdjustDiskAddCount,
			text : '×',
			width: 20,
			height:20,			
			//renderTo : Ext.getBody(),
			handler : function() {
				addDiskCount = addDiskCount - 1;
				vmAdjustDiskArray.removevalue(vmAdjustDeleteDiskButton2.getItemId());
				Ext.getCmp('diskAdjustField' + vmAdjustDeleteDiskButton2.getItemId()).setValue(0);
				Ext.getCmp('diskAdjustField' + vmAdjustDeleteDiskButton2.getItemId()).setDisabled(true);
				configAdjustPanel.remove(Ext.getCmp('diskAdjustContainer' + vmAdjustDeleteDiskButton2.getItemId()),true);
				//vmAdjustDiskAddCount = vmAdjustDiskAddCount - 1;
			}
		});
		Ext.getCmp('diskAdjustDisplay' + vmAdjustDeleteDiskButton2.getItemId()).setValue(vmAdjustExtDiskStore.getAt(0).get('capacity')+'G');
		//Ext.getCmp('diskAdjustDisplay' + vmAdjustDeleteDiskButton2.getItemId()).setValue(vmAdjustExtDiskStore.getAt(Ext.getCmp('diskAdjustField' + vmAdjustDeleteDiskButton2.getItemId()).getValue()).get('capacity')+'G');
		var DiskAdjustFieldContainer2 = Ext.create('Ext.form.FieldContainer', {
			id : 'diskAdjustContainer' + vmAdjustDiskAddCount,
			width : 460,
			layout : 'hbox',
			items : [ DiskAdjustField2, DiskAdjustDisplayField2,vmAdjustDeleteDiskButton2,{
				xtype : 'displayfield',
				width : 100,
				margin :'0 5 0 5',
				value : i18n._('Delete the disk')//删除该盘
			} ]
		});
//		var diskPanel = Ext.create('Ext.panel.Panel', {
//			//frame : true,
//			layout : 'hbox',
//			items : [ {
//				xtype : 'label',
//				width : 22
//			}, DiskAdjustFieldContainer2 ]
//		});
		configAdjustPanel.add(DiskAdjustFieldContainer2);
	}
});

//调整虚拟机-信息调整Panel
// 调整IP显示
var outerIpAdjustContainer = Ext.create('Ext.form.FieldContainer', {
	width : 400,
	autoScroll:true,
	scroll:'vertical',
	layout : 'vbox',
	items : []
});
var infoAdjustPanel = Ext.create('Ext.form.Panel', {
	frame : true,
	autoScroll:true,
	scroll:'vertical',
	layout : 'vbox',
	items : [ {
		xtype : 'fieldcontainer',
		layout : 'hbox',
		items : [ vmNameAdjustField, {
			xtype : 'button',
			// text: i18n._('保存'),
			icon : 'images/save.png',
			tooltip:i18n._('Save'),
			margin :'0 10 0 10',
			handler : function() {
				var vmName = Ext.String.trim(vmNameAdjustField.getValue());
				// 遮罩层
				v_mask = new Ext.LoadMask(Ext.getBody(), {
					msg : i18n._('please wait'),
					removeMask : true
				// 完成后移除
				});
				if (vmName == null || vmName == '') {
					Ext.MessageBox.show({
						title : i18n._('notice'),
						msg : i18n._('Please input the VM name'),//输入主机名称
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});// INFO,QUESTION,WARNING,ERROR
					vmNameAdjustField.focus();
					return;
				}
				if(selectVmName==vmName){
					Ext.MessageBox.show({
						title : i18n._('notice'),
						msg : i18n._('vm_name_error'),//输入主机名称
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
					vmNameAdjustField.focus();
					return;
				}
				if (!adjustVMForm.getForm().isValid()) {
					Ext.MessageBox.show({
						title : i18n._('notice'),
						msg : i18n._('Please input the correct value'),//输入有效值
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});// INFO,QUESTION,WARNING,ERROR
					return;
				} 
				var vmId = vmid;								
				v_mask.show();
				var updateVmName = Ext.Ajax.request({
					url : path + '/../ops/ops!updateVmName.action',
					method : 'POST',
					params : {
						'name' : vmName,
						'id' : vmId
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
								msg : obj.resultMsg,
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
							return;
						}
						if (obj.resultCode=='00000') {
							Ext.MessageBox.show({
								title : i18n._('notice'),
								msg : i18n._('AdjustSuccessful'),//调整成功
								icon : Ext.MessageBox.INFO,
								buttons : Ext.MessageBox.OK,
								fn: function(){
									adjustVMForm.getForm().reset();
									adjustVMWin.remove(adjustVMForm,false);
									adjustVMWin.hide();
									reLoadData();
								}
							});								
						}						
					},
					failure : function(form, action) {
						v_mask.hide();
						Ext.MessageBox.show({
							title : i18n._('errorNotice'),
							msg : i18n._('operateFail'),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR,
							fn: function(){
								adjustVMForm.getForm().reset();
								adjustVMWin.remove(adjustVMForm,false);
								adjustVMWin.hide();
								reLoadData();
							}
						});
					}
				});
//				adjustVMForm.getForm().reset();
//				adjustVMWin.remove(adjustVMForm);
//				adjustVMWin.hide();
			}
		}]
	},{
		xtype : 'fieldcontainer',
		layout : 'hbox',
		items : [ vmAdjustUserText, {
			xtype : 'button',
			hidden:true,
			icon : 'images/save.png',
			tooltip:i18n._('Save'),
			margin :'0 10 0 10',
			handler : function() {
				// 遮罩层
				v_mask = new Ext.LoadMask(Ext.getBody(), {
					msg : i18n._('please wait'),
					removeMask : true
				// 完成后移除
				});
				var vmUserEmail = vmAdjustUserText.getValue();					
				var vmUser=0;
				//alert('**'+vmUserEmail);
				if(vmUserEmail != null && vmUserEmail != ''){						
					var vmUserIndex = vmAdjustUserStore.find('email',vmUserEmail);						
					if(vmUserIndex <0){
						Ext.MessageBox.show({
							title : i18n._('notice'),
							msg : i18n._('Email does not exist'),//提示邮箱地址不存在
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});// INFO,QUESTION,WARNING,ERROR
						vmAdjustUserText.focus();
						return;
					}else{
						vmUser = vmAdjustUserStore.getAt(vmUserIndex).get('id');
					}
				}else{
					Ext.MessageBox.show({
						title : i18n._('notice'),
						msg : i18n._('Please enter an email of owner'),//
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.WARNING
					});
					return;
				}
				var vmId = vmid;
				//var vmName = vmNameAdjustField.getValue();
				adjustVMForm.getForm().reset();
				adjustVMWin.remove(adjustVMForm,false);
				adjustVMWin.hide();
				v_mask.show();
				var updateVmOwner = Ext.Ajax.request({
					url : path + '/../ops/ops!updateVmOwner.action',
					method : 'POST',
					params : {
						'owner' : vmUser,
						'id' : vmId
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
								msg : obj.resultMsg,
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
							return;
						}
						if (obj.resultCode=='00000') {
							Ext.MessageBox.show({
								title : i18n._('notice'),
								msg : i18n._('AdjustSuccessful'),//调整成功
								icon : Ext.MessageBox.INFO,
								buttons : Ext.MessageBox.OK,
								fn: reLoadData
							});							
						}						
					},
					failure : function(form, action) {
						v_mask.hide();
						Ext.MessageBox.show({
							title : i18n._('errorNotice'),
							msg : i18n._('operateFail'),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR,
							fn: reLoadData
						});
					}
				});
			}
		}]
	}]
});
//调整虚拟机-配置调整Panel
var configAdjustPanel = Ext.create('Ext.form.Panel', {
	frame : true,
	autoScroll :true,
	//autoDestroy :true,
	layout : 'vbox',
	items : [ {
		xtype : 'fieldcontainer',
		frame : true,
		layout : 'hbox',
		items : [ {
			xtype : 'label',
			width : 22
		}, vmAdjustCPUComb ]//CPUAdjustFieldContainer
	}, {
		xtype : 'fieldcontainer',
		frame : true,
		layout : 'hbox',
		items : [ {
			xtype : 'label',
			width : 22
		}, RAMAdjustFieldContainer ]
	}],
	buttons : [ {
		text : i18n._('OK'),
		handler : function() {
			// 遮罩层
			v_mask = new Ext.LoadMask(Ext.getBody(), {
				msg : i18n._('please wait'),
				removeMask : true
			// 完成后移除
			});
					var vcpus = vmAdjustCPUStore.getAt(
							vmAdjustCPUStore.indexOfId(vmAdjustCPUComb
									.getValue())).get('coreNum');// vmAdjustCPUComb.getValue();
					var vcpusType = vmAdjustCPUStore.getAt(
							vmAdjustCPUStore.indexOfId(vmAdjustCPUComb
									.getValue())).get('model');
					var ram = vmAdjustRamStore.getAt(RAMAdjustField.getValue())
							.get('size');
					var url = path + '/../ops/ops!resizeVm.action';
					var params = {
						'id' : vmid,
						'flavorVO.vcpus' : vcpus,
						'flavorVO.ram' : ram,
						'flavorVO.vcpusType' : vcpusType
					};
					var jsonData = {
						'vcpus' : vcpus,
						'ram' : ram,
						'vcpusType' : vcpusType
					};
					resizeVmAction(v_mask, url, params, jsonData);
					adjustVMForm.getForm().reset();
					configAdjustPanel.getForm().reset();
					adjustVMWin.remove(adjustVMForm, false);
					adjustVMWin.hide();
					v_mask.show();
		}
	}, {
		text : i18n._('Cancel'),
		handler : function() {
			reLoadData();
			vmRefreshReset();//刷新设置重置
			adjustVMForm.getForm().reset();
			configAdjustPanel.getForm().reset();
			adjustVMWin.remove(adjustVMForm,false);
			adjustVMWin.hide();			
		}
	} ]
});
//资源限制 
var resourceLimitAllBandwidthUp = Ext.create('Ext.form.field.Text',{
	labelWidth : 40,
	fieldLabel : i18n._('Up'),// 带宽上行
	allowBlank : false,
	labelAlign:'right',
	maxLength : 5,
	enforceMaxLength:true,
	regex:/^([1-9][0-9]{0,4})$/,
	regexText:i18n._('InvalidNumber'),
	width : 200,
	margin : '0 20 0 0',
	value : 1,
	trackResetOnLoad:false,
	emptyText : i18n._('Up')//带宽上行
});
var resourceLimitAllBandwidthDown = Ext.create('Ext.form.field.Text',{
	labelWidth : 40,
	fieldLabel : i18n._('Down'),// 带宽下行
	allowBlank : false,
	labelAlign:'right',
	maxLength : 5,
	enforceMaxLength:true,
	regex:/^([1-9][0-9]{0,4})$/,
	regexText:i18n._('InvalidNumber'),
	width : 200,
	margin : '0 20 0 0',
	value : 10,
	emptyText : i18n._('Down')//带宽下行
});
var resourceLimitBandwidthUp = Ext.create('Ext.form.field.Text',{
	labelWidth : 40,
	fieldLabel : i18n._('Up'),// 带宽上行
	allowBlank : false,
	labelAlign:'right',
	maxLength : 5,
	enforceMaxLength:true,
	regex:/^([1-9][0-9]{0,4})$/,
	regexText:i18n._('InvalidNumber'),
	width : 200,
	margin : '0 20 0 0',
	value : 1,
	emptyText : i18n._('Up')//带宽上行
});
var resourceLimitBandwidthDown = Ext.create('Ext.form.field.Text',{
	labelWidth : 40,
	fieldLabel : i18n._('Down'),// 带宽下行
	allowBlank : false,
	labelAlign:'right',
	maxLength : 5,
	enforceMaxLength:true,
	regex:/^([1-9][0-9]{0,4})$/,
	regexText:i18n._('InvalidNumber'),
	width : 200,
	margin : '0 20 0 0',
	value : 10,
	emptyText : i18n._('Down')//带宽下行
});
var resourceLimitIPConnectionsUp = Ext.create('Ext.form.field.Text',{
	labelWidth : 40,
	fieldLabel : i18n._('Up'),// ip连接数上行
	allowBlank : false,
	labelAlign:'right',
	maxLength : 5,
	enforceMaxLength:true,
	regex:/^([1-9][0-9]{0,4})$/,
	regexText:i18n._('InvalidNumber'),
	width : 200,
	margin : '0 20 0 0',
	value : 2500,
	emptyText : i18n._('Up')//ip连接数上行
});
var resourceLimitIPConnectionsDown = Ext.create('Ext.form.field.Text',{
	labelWidth : 40,
	fieldLabel : i18n._('Down'),// ip连接数下行
	allowBlank : false,
	labelAlign:'right',
	maxLength : 5,
	enforceMaxLength:true,
	regex:/^([1-9][0-9]{0,4})$/,
	regexText:i18n._('InvalidNumber'),
	width : 200,
	margin : '0 20 0 0',
	value : 6000,
	emptyText : i18n._('Down')//ip连接数下行
});
var resourceLimitTCPConnectionsUp = Ext.create('Ext.form.field.Text',{
	labelWidth : 40,
	fieldLabel : i18n._('Up'),// TCP连接数上行
	allowBlank : false,
	labelAlign:'right',
	maxLength : 5,
	enforceMaxLength:true,
	regex:/^([1-9][0-9]{0,4})$/,
	regexText:i18n._('InvalidNumber'),
	width : 200,
	margin : '0 20 0 0',
	value : 2000,
	emptyText : i18n._('Up')//TCP连接数上行
});
var resourceLimitTCPConnectionsDown = Ext.create('Ext.form.field.Text',{
	labelWidth : 40,
	fieldLabel : i18n._('Down'),// TCP连接数下行
	allowBlank : false,
	labelAlign:'right',
	maxLength : 5,
	enforceMaxLength:true,
	regex:/^([1-9][0-9]{0,4})$/,
	regexText:i18n._('InvalidNumber'),
	width : 200,
	margin : '0 20 0 0',
	value : 4000,
	emptyText : i18n._('Down')//TCP连接数下行
});
var resourceLimitUDPConnectionsUp = Ext.create('Ext.form.field.Text',{
	labelWidth : 40,
	fieldLabel : i18n._('Up'),// UDP连接数上行
	allowBlank : false,
	labelAlign:'right',
	maxLength : 5,
	enforceMaxLength:true,
	regex:/^([1-9][0-9]{0,4})$/,
	regexText:i18n._('InvalidNumber'),
	width : 200,
	margin : '0 20 0 0',
	value : 500,
	emptyText : i18n._('Up')//UDP连接数上行
});
var resourceLimitUDPConnectionsDown = Ext.create('Ext.form.field.Text',{
	labelWidth : 40,
	fieldLabel : i18n._('Down'),// UDP连接数下行
	allowBlank : false,
	labelAlign:'right',
	maxLength : 5,
	enforceMaxLength:true,
	regex:/^([1-9][0-9]{0,4})$/,
	regexText:i18n._('InvalidNumber'),
	width : 200,
	margin : '0 20 0 0',
	value : 2000,
	emptyText : i18n._('Down')//UDP连接数下行
});
//调整资源Form
/*var resourceLimitForm = Ext.create('Ext.form.Panel', {
	frame : true,	
	autoScroll : true,
	bodyPadding : 5,
	fieldDefaults : {
		labelAlign : 'left',
		labelWidth : 60,
		anchor : '100%'
	},
	items : [ adjustTab ]
});*/
//调整虚拟机-资源限制 增加人 张建伟 增加日期 20131010
var resourceLimitPanel = Ext.create('Ext.form.Panel',{
	frame : true,
	autoScroll : true,
	layout : "vbox",
	items : [
	{
		xtype : 'fieldcontainer',
		frame : true,
		layout : 'hbox',
		fieldLabel : "总带宽" + i18n._('(Mbps)'),
		margin : '25 0 0 0',
		labelAlign:'right',
		labelWidth : 100,
		items : [ resourceLimitAllBandwidthUp, resourceLimitAllBandwidthDown ]
	},
	{
		xtype : 'fieldcontainer',
		frame : true,
		layout : 'hbox',
		fieldLabel : "外网带宽" + i18n._('(Mbps)'),
		margin : '25 0 0 0',
		labelAlign:'right',
		labelWidth : 100,
		items : [ resourceLimitBandwidthUp, resourceLimitBandwidthDown ]
	},
	{
		xtype : 'fieldcontainer',
		frame : true,
		layout : 'hbox',
		fieldLabel : i18n._('IPConnections'),
		margin : '10 0 0 0',
		labelAlign:'right',
		labelWidth : 100,
		items : [{
			xtype : "text"
		},resourceLimitIPConnectionsUp, resourceLimitIPConnectionsDown]
	},
	{
		xtype : 'fieldcontainer',
		frame : true,
		layout : 'hbox',
		fieldLabel : i18n._('TCPConnections'),
		margin : '10 0 0 0',
		labelAlign:'right',
		labelWidth : 100,
		items : [{
			xtype : "text"
		},resourceLimitTCPConnectionsUp, resourceLimitTCPConnectionsDown]
	},
	{
		xtype : 'fieldcontainer',
		frame : true,
		layout : 'hbox',
		fieldLabel : i18n._('UDPConnections'),
		margin : '10 0 0 0',
		labelAlign:'right',
		labelWidth : 100,
		items : [{
			xtype : "text"
		},resourceLimitUDPConnectionsUp, resourceLimitUDPConnectionsDown]
	}
	],
	buttons : [{
		text : i18n._('Adjust'),
		margin : '20 30 0 0',
		handler : function(){	
			if (!resourceLimitPanel.getForm().isValid()) {
				Ext.MessageBox.show({
					title : i18n._('notice'),
					msg : i18n._('Please input the correct value'),//输入有效值
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				});// INFO,QUESTION,WARNING,ERROR
				return;
			} 
			//alert(isFormChanged(resourceLimitPanel))
			//alert(resourceLimitAllBandwidthUp.isDirty())
			Ext.MessageBox.confirm(i18n._('Adjust'),i18n._('confirmResize'),function(btn){
				if(btn == 'yes'){
					var allUp=resourceLimitAllBandwidthUp.getValue();
					var allDown=resourceLimitAllBandwidthDown.getValue();
					var BandwidthUp=resourceLimitBandwidthUp.getValue();
					var BandwidthDown=resourceLimitBandwidthDown.getValue();
					var IPConnectionsUp=resourceLimitIPConnectionsUp.getValue();
					var IPConnectionsDown=resourceLimitIPConnectionsDown.getValue();
					var TCPConnectionsUp=resourceLimitTCPConnectionsUp.getValue();
					var TCPConnectionsDown=resourceLimitTCPConnectionsDown.getValue();
					var UDPConnectionsUp=resourceLimitUDPConnectionsUp.getValue();
					var UDPConnectionsDown=resourceLimitUDPConnectionsDown.getValue();
					//遮罩层
					v_mask = new Ext.LoadMask(Ext.getBody(),{
						msg : i18n._('pelase wait'),
						removeMask : true
						//完成后删除
					});
					v_mask.show();
					var adjust = Ext.Ajax.request({
						url : path + '/../ops/ops!changeVMResourceLimit.action',
						method : 'POST',
						params : {
							'id' : vmid
							},
						jsonData: {
							'allIn' :allDown,
							'allOut':allUp,
							'bwtIn' : BandwidthDown,
							'bwtOut' : BandwidthUp,
							'ipConnIn' : IPConnectionsDown,
							'ipConnOut' : IPConnectionsUp,
							'tcpConnIn' : TCPConnectionsDown,
							'tcpConnOut' : TCPConnectionsUp,
							'udpConnIn' : UDPConnectionsDown,
							'udpConnOut' : UDPConnectionsUp
						},
						success : function(form, action) {
							v_mask.hide();
							var obj = Ext.decode(form.responseText);
							if (!obj.success) {
								Ext.MessageBox.show({
									title : i18n._('errorNotice'),
									msg : obj.resultMsg,
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
								return;
							}
							Ext.MessageBox.show({
								title : i18n._('notice'),
								msg : i18n._('operationMessage'),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.INFO,
								fn: reLoadData
							});								
						},
						failure : function(form, action) {
							v_mask.hide();
							Ext.MessageBox.show({
								title : i18n._('errorNotice'),
								msg : i18n._('operateFail'),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR,
								fn: reLoadData
							});
						}
					});
					adjustVMForm.getForm().reset();
					resourceLimitPanel.getForm().reset();
					adjustVMWin.remove(adjustVMForm,false);
					adjustVMWin.hide();			
					v_mask.show();
				}
			} )
		}
	},{
		text : i18n._('Cancel'),
		margin : '20 230 0 0',
		handler : function(){
			vmRefreshReset();//刷新设置重置
			adjustVMForm.getForm().reset();
			resourceLimitPanel.getForm().reset();
			adjustVMWin.remove(adjustVMForm,false);
			adjustVMWin.hide();
			
		}
	}]
});
//调整虚拟机-IP调整
var IPAdjustPanel = Ext.create('Ext.form.Panel', {
	frame : true,
	autoScroll:true,
	scroll:'vertical',
	layout : 'vbox',
	items : [ 
				{
					xtype : 'fieldcontainer',
					layout : 'hbox',
					items : [ vmIPAdjustField ]
				},
				outerIpAdjustContainer
	],
	buttons : [{
		text : i18n._('addOutIP'),
		margin : '20 30 0 0',
		handler : function(){
			
			if (floatingIp != null && floatingIp != "" && floatingIp != " ") {
				Ext.MessageBox.show({
					title : i18n._('warning'),
					msg : i18n._('外网IP存在，暂不支持绑定多个外网IP'),
					buttons : Ext.MessageBox.OK
				});
				return;				
			}
			
			if(vmIPAdjustField.getValue() == null || vmIPAdjustField.getValue() == "" ){
				Ext.MessageBox.show({
					title : i18n._('warning'),
					msg : i18n._('Please Select IP'),
					buttons : Ext.MessageBox.OK
				});
				return;
			}
			
			Ext.MessageBox.confirm(i18n._('addOutIP'),i18n._('confirmAdd'),function(btn){
				if(btn == 'yes'){
					v_mask = new Ext.LoadMask(Ext.getBody(),{
						msg : i18n._('pelase wait'),
						removeMask : true
						//完成后删除
					});
					v_mask.show();
					var vmId = vmid;
//						alert("aa"+vmIPAdjustField.getValue());
					var adjust = Ext.Ajax.request({
						url : path + '/../ops/ops!addIPOfVm.action',
						method : 'POST',
						params : {
							'id' : vmId,
							'newIP' : vmIPAdjustField.getRawValue()
							},
							success : function(form, action) {
								v_mask.hide();
								var obj = Ext.decode(form.responseText);
								if (!obj.success) {
									Ext.MessageBox.show({
										title : i18n._('errorNotice'),
										msg : obj.resultMsg,
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
									return;
								}
								Ext.MessageBox.show({
									title : i18n._('notice'),
									msg : i18n._('operationMessage'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.INFO,
									fn: reLoadData
								});								
							},
							failure : function(form, action) {
								v_mask.hide();
								Ext.MessageBox.show({
									title : i18n._('errorNotice'),
									msg : i18n._('operateFail'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR,
									fn: reLoadData
								});
							}
						});
						adjustVMForm.getForm().reset();
						IPAdjustPanel.getForm().reset();
						adjustVMWin.remove(adjustVMForm,false);
						adjustVMWin.hide();	
						v_mask.show();
						
				}
			});
			
		}
	}]
});

//调整虚拟机-信息调整/配置调整Tab
var adjustTab = Ext.create('Ext.tab.Panel', {
	width : '100%',
	height : '100%',
	activeTab : 0,
	layout : 'fit',
	items : [ {
		// id : 'tab0',
		title : i18n._('InformationAdjustment'),//信息调整
		// frame : true,
		layout : 'fit',
		items : [ infoAdjustPanel ]
	}, {
		// id : 'tab1',
		title : i18n._('ConfigurationAdjustment'),//配置调整
		layout : 'fit',
		items : [ configAdjustPanel ]
	}, {
		// id : 'tab1',
		title : i18n._('ConfigurationResourceLimit'),//资源限制
		layout : 'fit',
		items : [ resourceLimitPanel ]
	}, {
		// id : 'tab1',
		title : i18n._('IPAdjust'),//IP调整
		layout : 'fit',
		items : [ IPAdjustPanel ]
	}
	]
});
//调整虚拟机Form
var adjustVMForm = Ext.create('Ext.form.Panel', {
	frame : true,	
	autoScroll : true,
	bodyPadding : 5,
	fieldDefaults : {
		labelAlign : 'left',
		labelWidth : 60,
		anchor : '100%'
	},
	items : [ adjustTab ]
});
//操作完成后点确认刷新数据操作
function reLoadData(btn){
	vmRefreshReset();//刷新设置重置
	adjustVMForm.getForm().reset();
	adjustVMWin.remove(adjustVMForm,false);
	adjustVMWin.hide();
	instanceStore.load();
};
function getCookie(name) {
	var arr = document.cookie
			.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
	if (arr != null)
		return unescape(arr[2]);
	return null;
};
function getQuery(name) {
	var reg = new RegExp("" + name + "=([^&?]*)");
	var keyVal = window.location.search.substr(1).match(reg);
	// alert(keyVal[1]);
	if (keyVal != null)
		return unescape(keyVal[1]);
	return null;
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
//
function resetAdjustVMForm(){
	//addDiskCount=0;
	//vmAdjustDiskArray = [];
	//vm_outerIp= new Array();
};
function resizeVmAction(v_mask,url,params,jsonData){
	Ext.Ajax.request({
		url : url,//path + '/../ops/ops!resizeVm.action',
		method : 'POST',
		params :params,
		jsonData:jsonData,
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
					msg : obj.resultMsg,
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.WARNING
				});
				return;
			}
			if (obj.resultCode=='00000') {
				Ext.MessageBox.show({
					title : i18n._('notice'),
					msg : i18n._('operationMessage'),//调整成功
					icon : Ext.MessageBox.INFO,
					buttons : Ext.MessageBox.OK,
					fn: reLoadData
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
				fn: reLoadData
			});
		}
	});
};
function attachVolumeAction(v_mask,vmid,addDisk){
	Ext.Ajax.request({
		url : path + '/../ops/ops!attachVolume.action',
		method : 'POST',
		params : {
			'id' : vmid,			
			'addDisk':addDisk
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
					msg : obj.resultMsg,
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.WARNING
				});
				return;
			}
			if (obj.resultCode=='00000') {
				Ext.MessageBox.show({
					title : i18n._('notice'),
					msg : i18n._('operationMessage'),//调整成功
					icon : Ext.MessageBox.INFO,
					buttons : Ext.MessageBox.OK,
					fn: reLoadData
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
				fn: reLoadData
			});
		}
	});
};


