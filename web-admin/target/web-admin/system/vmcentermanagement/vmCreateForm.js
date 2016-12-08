/******************************vmCreateForm******************************************/
//params = getCookie("lang");
//i18n.set({
//	lang : params,
//	path : '../../resources'
//});
Ext.Loader.setConfig({
	enabled : true
});
var vmCreateDiskCreateCount = 0;
var vmCreateDiskArray = [];
var vmDeleteDiskFlag =false;
//创建虚拟机CPU数据Data
var vmCreateCPUData = [];
//创建虚拟机CPU数据Store
var vmCreateCPUStore = Ext.create('Ext.data.Store', {
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
	//data : vmCreateCPUData,	
	listeners : {
		load : function(vmCreateCPUStore, records, successful, eOpts ){
			if(successful && vmCreateCPUStore.getCount()>0){
				vmCreateCPUComb.setValue(vmCreateCPUStore.getAt(0).get('id'));
			}
		}
	}
});
//创建虚拟机CPU下拉列表框
var vmCreateCPUComb = Ext.create('Ext.form.ComboBox', {
	fieldLabel : i18n._('CPU'),//
	width : 360,
	listConfig:{maxHeight:200},
	labelWidth : 80,
	editable : false,
	allowBlank:false,
	store : vmCreateCPUStore,
	//queryMode : 'local',
	displayField : 'name',
	valueField : 'id'
});

//创建虚拟机内网subnet数据Store
var vmCreateSubnetStore = Ext.create('Ext.data.Store', {
	autoLoad : false,//true
	fields : [ 'id','name','cidr','gateway' ],
	proxy:new Ext.data.proxy.Ajax({
        url : path+'/../ops/ops!getSubnetList.action',
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
	//data : vmCreateCPUData,	
	listeners : {
		load : function(vmCreateSubnetStore, records, successful, eOpts ){
			if(successful && vmCreateSubnetStore.getCount()>0){
				vmCreateSubnetComb.setValue(vmCreateSubnetStore.getAt(0).get('id'));
			}
		}
	}
});

//创建虚拟机CPU下拉列表框
var vmCreateSubnetComb = Ext.create('Ext.form.ComboBox', {
	fieldLabel : i18n._('子网'),//
	width : 360,
	listConfig:{maxHeight:200},
	labelWidth : 80,
	editable : false,
	allowBlank:false,
	store : vmCreateSubnetStore,
	displayField : 'cidr',
	valueField : 'id'
});


//创建虚拟机Image数据Data
var vmCreateImageData = [];
//创建虚拟机Image数据Store
var imageid = "";
var vmCreateImageStore = Ext.create('Ext.data.Store', {
	fields : [ 'id','serviceType','name','imageId', 'imageSize','status' ],
	proxy:new Ext.data.proxy.Ajax({
		//model: 'ServiceItem',
        type: 'ajax',
        url : path+'/../sc/serviceItem!listServiceItem4.action?serviceType=4',
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
	data : vmCreateImageData,
	autoLoad : false,//true
	listeners : {
		load : function(vmCreateImageStore, records, successful, eOpts ){
			if(successful && vmCreateImageStore.getCount()>0){
				vmCreateImageComb.setValue(vmCreateImageStore.getAt(0).get('id'));
				//imageid = vmCreateImageStore.getAt(0).get('imageId');
			}
		}
	}
});
//创建虚拟机Image下拉列表框
var vmCreateImageComb = Ext.create('Ext.form.ComboBox', {
	fieldLabel : i18n._('OS'),//
	width : 360,
	listConfig:{maxHeight:200},
	labelWidth : 80,
	editable : false,
	allowBlank:false,
	store : vmCreateImageStore,
	queryMode : 'local',
	displayField : 'name',
	valueField : 'id'//imageId
});
//创建虚拟机Ram数据Store
var vmCreateRamStore = Ext.create('Ext.data.Store', {
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
		load : function(vmCreateRamStore, records, successful, eOpts ){
			if(successful && vmCreateRamStore.getCount()>0){
				var ramMaxValue = 1;
				if(vmCreateRamStore.getCount()>1){
					ramMaxValue = vmCreateRamStore.getCount()-1;
				}
				vmCreateRAMField.setMaxValue(ramMaxValue);
				vmCreateRAMDisplayField.setValue(vmCreateRamStore.getAt(0).get('size')+'M');
				vmCreateRAMField.setRawValue(vmCreateRamStore.getAt(0).get('size'));
			}else{
				createVMWin.hide();
				Ext.MessageBox.show({
					title : i18n._('notice'),
					msg : i18n._('There is no available memory'),//没有可用的磁盘
					icon : Ext.MessageBox.WARNING,
					buttons : Ext.MessageBox.OK
				});
			}
		}
	}
});
//创建虚拟机Memory显示值
var vmCreateRAMDisplayField = Ext.create('Ext.form.field.Display', {
	//width : 50,
	margin :'0 15 0 5',
	value : 0
});
//创建虚拟机Memory滑块
var vmCreateRAMField = Ext.create('Ext.slider.Single', {
	name : 'RAM',
	fieldLabel : i18n._('MEM'),//
	labelWidth : 80,
	width : 320,
	increment : 1,
	minValue : 0,// 1
	// maxValue: 10,
	value : 0,// 1
	tipText : function(thumb) {
		return Ext.String.format('<b>{0}</b>',vmCreateRamStore.getAt(thumb.value).get('size')+'M');
	},
	listeners : {
		'change' : {
			fn : function() {
				vmCreateRAMDisplayField.setValue(vmCreateRamStore.getAt(this.getValue()).get('size')+'M');
			}
		}
	}
});
//创建虚拟机Memory容器
var vmCreateRAMFieldContainer = Ext.create('Ext.form.FieldContainer', {	
	layout : 'hbox',
	items : [ vmCreateRAMField, vmCreateRAMDisplayField/*, {
		xtype : 'displayfield',
		width : 250,
		value : i18n._('Please selection memory size by slip')//请滑动滑条选择内存容量大小。
	}*/ ]
});

///////////////////////

function getQosTpl(){
	return  '<div data-qtip="'+
				'<tpl for="qosPolicies">'+
					'<p>'+
					'<tpl if="key == \'disk_read\'">'+
			        '读速度'+
			    	'<tpl elseif="key == \'disk_write\'">'+
			        '写速度'+
			        '<tpl elseif="key == \'all_bw_in\'">'+
			        '链路上行'+
			        '<tpl elseif="key == \'all_bw_out\'">'+
			        '链路下行'+
			        '<tpl elseif="key == \'wan_bw_in\'">'+
			        '带宽上行'+
			        '<tpl elseif="key == \'wan_bw_out\'">'+
			        '带宽下行'+
			        '<tpl elseif="key == \'ip_in\'">'+
			        'IP连接数上行'+
			        '<tpl elseif="key == \'ip_out\'">'+
			        'IP连接数下行'+
			        '<tpl elseif="key == \'tcp_in\'">'+
			        'TCP连接数上行'+
			        '<tpl elseif="key == \'tcp_out\'">'+
			        'TCP连接数下行'+
			        '<tpl elseif="key == \'udp_in\'">'+
			        'UDP连接数上行'+
			        '<tpl elseif="key == \'udp_out\'">'+
			        'UDP连接数下行'+
			        '<tpl else>'+
			        '{key}'+
			        '</tpl>'+
					':{value}</p>'+
				'</tpl>'+
	        '">'+
				'{name}('+
				'<tpl if="serviceType == 3">'+
		        '{capacity}G'+
		    	'<tpl elseif="serviceType == 5">'+
		        '{bandWidth}M'+
		        '</tpl>'+
				')'+
			'</div>';  
}

Ext.regModel("QosPolicy",{
	fields:[
	{name:"key",type:"string"},
	{name:"value",type:"string"}
	]
});

Ext.define('ServiceItem', {
    extend: 'Ext.data.Model',
    fields: [
	{name: 'id',  type: 'int'},
	{name: 'serviceType',  type: 'int'},
	{name: 'createDate',  type: 'date'},
	{name: 'updateDate',  type: 'date'},
	{name: 'price',  type: 'float'},
	{name: 'size',  type: 'int'},
	{name: 'description',  type: 'string'},
	{name: 'name',  type: 'string'},
	{name: 'model',  type: 'string'},
	{name: 'frequency',  type: 'float'},
	{name: 'coreNum',  type: 'int'},
	{name: 'arch',  type: 'string'},
	{name: 'vendor',  type: 'string'},
	{name: 'capacity',  type: 'int'},
	{name: 'type',  type: 'string'},
	{name: 'bandWidth',  type: 'int'},
	{name: 'version',  type: 'string'},
	{name: 'language',  type: 'string'},
	{name: 'imageSize',  type: 'string'},
	{name: 'platform',  type: 'string'},
	{name: 'family',  type: 'string'},
	{name: 'times',  type: 'int'}
	],
	hasMany:[{model:"QosPolicy",name:"qosPolicies"}],
	getQos:function(){
		return this.getAssociatedData().qosPolicies;
	}
});

Ext.define('listItemStore',{
	extend:'Ext.data.Store',
	autoLoad:false,
	remoteSort:true,
	proxy:{
		model: 'ServiceItem',
        type: 'ajax',
        url : path+'/../sc/serviceItem!listServiceItem.action',
		reader: {
            type: 'json',
			root:'resultObject',
			totalProperty: 'resultObject.totalCount'
        }
    }
});

var v_diskStore=Ext.create('listItemStore', {
    listeners : {
		load : function(v_diskStore, records, successful, eOpts ){
			if(successful && v_diskStore.getCount()>0){
				v_disk.setValue(v_diskStore.getAt(0).get('id'));
			}else{
				createVMWin.hide();
				Ext.MessageBox.show({
					title : i18n._('notice'),
					msg : i18n._('There is no available disk'),//没有可用的磁盘
					icon : Ext.MessageBox.WARNING,
					buttons : Ext.MessageBox.OK
				});
			}
		}
	}
});
v_diskStore.getProxy().setExtraParam('serviceType',3);
v_diskStore.sort('capacity','ASC');

var v_networkStore=Ext.create('listItemStore', {
    listeners : {
		load : function(v_networkStore, records, successful, eOpts ){
			if(successful && v_networkStore.getCount()>0){
				v_networkSlider.setValue(v_networkStore.getAt(0).get('id'));
			}else{
				createVMWin.hide();
				Ext.MessageBox.show({
					title : i18n._('notice'),
					msg : i18n._('No available bandwidth'),//'没有可用的带宽',    
					icon : Ext.MessageBox.WARNING,
					buttons : Ext.MessageBox.OK
				});
			}
		}
	}
});
v_networkStore.getProxy().setExtraParam('serviceType',5);
v_networkStore.sort('bandWidth','ASC');

var v_disk=Ext.create('Ext.form.FieldContainer',{
	layout:'hbox',
	items:[
	{
		xtype:'combobox',
		width:360,
		labelWidth : 80,
		store: v_diskStore,
		fieldLabel: i18n._('Disk'),
		listConfig: {  
            getInnerTpl: getQosTpl
        },
		displayField: 'name',
		emptyText:i18n._('Please Select'),
		allowBlank:false,
		editable:false,
	    valueField: 'id',
		forceSelection:true,
		listeners:{
			'change':{
				fn:function(){			
					var disk_tmp = v_diskStore.getById(this.getValue()) ;
					if(disk_tmp){
						this.getBubbleTarget().getComponent(1).setValue(disk_tmp.get('capacity')+'G');
						/*
						var qos = disk_tmp.getQos() ; //qos策略
						if(qos.length>0){
							for (var i = 0; i < qos.length; i++) { 
								  var key = qos[i].key ;  
								  var value = qos[i].value ; 
								  if(key == 'disk_read'){
									  d_diskRLimitNumField.setValue(value);
								  }else if(key == 'disk_write'){
									  d_diskWLimitNumField.setValue(value);
								  }
							}
						}
						*/
					}
				}
		  	}
		}
    },{
		xtype: 'displayfield',
		margin:'0 5 0 25',
		width:23,
		value:0
	}],
	setValue:function(value){
		this.getComponent(0).setValue(value);
		this.getComponent(1).setValue(v_diskStore.getById(value).get('capacity')+'G');
	},
	getRawValue:function(){
		return v_diskStore.getById(this.getComponent(0).getValue()).get('capacity');
	},
	getValue:function(){
		return this.getComponent(0).getValue();
	}
});

var v_networkSlider = Ext.create('Ext.form.FieldContainer',{
	layout:'hbox',
	items:[
	{
		xtype:'combobox',
		width:360,
		labelWidth : 80,
		store: v_networkStore,
		listConfig: {  
            getInnerTpl: getQosTpl
        },
		fieldLabel: i18n._('Bandwidth'),
		displayField: 'name',
		emptyText:i18n._('Please Select'),
		allowBlank:false,
		editable:false,
	    valueField: 'id',
		forceSelection:true,
		listeners:{
			'change':{
				fn:function(){
					var network_tmp = v_networkStore.getById(this.getValue()) ;
					if(network_tmp){
						this.getBubbleTarget().getComponent(1).setValue(network_tmp.get('bandWidth')+'M');
						/*
						var qos = network_tmp.getQos() ; //qos策略
						if(qos.length>0){
							for (var i = 0; i < qos.length; i++) { 
								  var key = qos[i].key ;  
								  var value = qos[i].value ; 
								  if(key == 'wan_bw_in'){
									  d_bandWidthUpTextField.setValue(value);
								  }else if(key == 'wan_bw_out'){
									  d_bandWidthDownTextField.setValue(value);
								  }else if(key == 'all_bw_in'){
									  d_linkUpTextField.setValue(value);
								  }else if(key == 'all_bw_out'){
									  d_linkDownTextField.setValue(value);
								  }else if(key == 'ip_in'){
									  d_IPUpTextField.setValue(value);
								  }else if(key == 'ip_out'){
									  d_IPDownTextField.setValue(value);
								  }else if(key == 'tcp_in'){
									  d_TCPUpTextField.setValue(value);
								  }else if(key == 'tcp_out'){
									  d_TCPDownTextField.setValue(value);
								  }else if(key == 'udp_in'){
									  d_UDPUpTextField.setValue(value);
								  }else if(key == 'udp_out'){
									  d_UDPDownTextField.setValue(value);
								  }
							}
						}
						*/
					}
				}
		  	}
		}
    },{
		xtype: 'displayfield',
		margin:'0 5 0 25',
		width:20,
		value:0
	}],
	setValue:function(value){
		this.getComponent(0).setValue(value);
		this.getComponent(1).setValue(v_networkStore.getById(value).get('bandWidth')+'M');
	},
	getRawValue:function(){
		return v_networkStore.getById(this.getComponent(0).getValue()).get('bandWidth');
	},
	getValue:function(){
		return this.getComponent(0).getValue();
	}
});
//////////////////////

var addDiskCount=0;
//创建虚拟机扩展Disk数据Store
var vmCreateExtDiskStore = Ext.create('Ext.data.Store', {
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
				v_mask.hide();
				if(error.hasException()){
					Ext.MessageBox.show({
						title : i18n._('errorNotice'),
						msg : i18n._('responseError'),
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
				}
				if(response.responseText!=undefined){
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
//创建虚拟机添加Disk按钮
var vmCreateCreateDiskButton = Ext.create('Ext.Button', {
	text : '+',
	width: 20,
	height:20,
//	renderTo : Ext.getBody(),
	handler : function() {
		if(vmCreateExtDiskStore.getCount()<=0){
			Ext.MessageBox.show({
				title : i18n._('notice'),
				msg : i18n._('There is no available expansion disk'),//没有可用的扩展磁盘
				icon : Ext.MessageBox.WARNING,
				buttons : Ext.MessageBox.OK
			});
			return;
		}			
		addDiskCount = addDiskCount + 1;		
		//alert('**'+vmCreateDiskArray);
		//alert('**add'+addDiskCount);
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
		vmCreateDiskCreateCount = vmCreateDiskCreateCount + 1;
		vmCreateDiskArray.push(vmCreateDiskCreateCount);
		var vmCreateDiskCreateDisplayField2 = Ext.create('Ext.form.field.Display', {
			id : 'diskDisplay' + vmCreateDiskCreateCount,
			width : 50
			//value : 0
		});
		var vmCreateDiskCreateField2 = Ext.create('Ext.slider.Single', {
			id : 'diskSlider' + vmCreateDiskCreateCount,
			name : 'DiskCreate',
			fieldLabel : i18n._('extDisk'),//
			labelWidth : 80,
			width : 210,
			increment : 1,
			minValue : 0,// 1
			maxValue : vmCreateExtDiskStore.getCount()-1,
			value : 0,// 1
			tipText : function(thumb) {
				return Ext.String.format('<b>{0}</b>', vmCreateExtDiskStore.getAt(thumb.value).get('capacity')+'G');
			},
			listeners : {
				'change' : {
					fn : function() {
						vmCreateDiskCreateDisplayField2.setValue(vmCreateExtDiskStore.getAt(this.getValue()).get('capacity')+'G');
					}
				}
			}
		});
		var vmCreateDeleteDiskButton2 = Ext.create('Ext.Button', {
			itemId:vmCreateDiskCreateCount,
			text : '×',
			width: 20,
			height:20,			
			//renderTo : Ext.getBody(),
			handler : function() {	
				addDiskCount = addDiskCount - 1;
				//alert('##'+vmCreateDeleteDiskButton2.getItemId());
				vmCreateDiskArray.removevalue(vmCreateDeleteDiskButton2.getItemId());
				//alert('**array'+vmCreateDiskArray);
				//alert('**del'+addDiskCount);
				//vmDeleteDiskFlag = true;
				Ext.getCmp('diskSlider' + vmCreateDeleteDiskButton2.getItemId()).setValue(0);
				Ext.getCmp('diskSlider' + vmCreateDeleteDiskButton2.getItemId()).setDisabled(true);
				createVMForm.remove(Ext.getCmp('diskContainer' + vmCreateDeleteDiskButton2.getItemId()),true);
				//vmCreateDiskCreateCount = vmCreateDiskCreateCount - 1;
				
			}
		});
		//alert('**'+Ext.getCmp('diskSlider' + vmCreateDeleteDiskButton2.getItemId()).getValue());
		Ext.getCmp('diskDisplay' + vmCreateDeleteDiskButton2.getItemId()).setValue(vmCreateExtDiskStore.getAt(Ext.getCmp('diskSlider' + vmCreateDeleteDiskButton2.getItemId()).getValue()).get('capacity')+'G');
		var vmCreateDiskCreateFieldContainer2 = Ext.create('Ext.form.FieldContainer', {
			id : 'diskContainer' + vmCreateDiskCreateCount,
			width : 400,
			layout : 'hbox',
			items : [ vmCreateDiskCreateField2, vmCreateDiskCreateDisplayField2,vmCreateDeleteDiskButton2,{
				xtype : 'displayfield',
				width : 100,
				margin :'0 0 0 5',
				value : i18n._('Delete the disk')//删除该盘
			},{
				xtype : 'displayfield',
				width : 200,
				value : i18n._('Click on the button to delete extended hard disk')//点击按钮删除扩展硬盘
			} ]//,deleteDiskButton2
		});
		createVMForm.add(vmCreateDiskCreateFieldContainer2);
	}
});
//创建虚拟机添加Disk容器
var vmCreateDiskAddFieldContainer = Ext.create('Ext.form.FieldContainer', {
	layout : 'hbox',
	items : [ {
		xtype : 'label',
		width : 80
	}, vmCreateCreateDiskButton,{
		xtype : 'displayfield',
		margin:'0 5 0 285',
		width : 250,
		value : i18n._('Add a new disk')
	} ]
});
//创建虚拟机虚拟机别名文本框
var vmCreateVmNameField = Ext.create('Ext.form.field.Text', {
	name : 'vmName',
	labelWidth : 80,
	fieldLabel : i18n._('vm_name'),// 主机名称
	allowBlank : false,
	regex:/^[\w-@#$%^ &*\u4e00-\u9fa5]+$/,
	regexText:i18n._('InvalidCharacters'),
	maxLength : 20,
	enforceMaxLength:true,
	width : 360,
	emptyText : i18n._('vm_name'),
	blankText:i18n._('Please input the VM name')
});
//创建虚拟机zone数据Data
var vmCreateZoneData = [];
//创建虚拟机zone数据Store
var vmCreateZoneStore = Ext.create('Ext.data.Store', {
	fields : [ 'id', 'name','code' ],
	proxy:{
		//model: 'ServiceItem',
        type: 'ajax',
        url : path+'/../sc/zone!getAllZones.action',
		//extraParams:{serviceType:1},
		reader: {
            type: 'json',
			root:'resultObject',
			totalProperty: 'resultObject.totalCount'
        }
    },
	data : vmCreateZoneData,
	autoLoad : false,//true
	listeners : {
		load : function(vmCreateZoneStore, records, successful, eOpts ){
			if(successful && vmCreateZoneStore.getCount()>0){
				vmCreateHostComb.store.removeAll();
			}
		}
	}
});
//创建虚拟机zone下拉列表框
var vmCreateZoneComb = Ext.create('Ext.form.ComboBox', {
	fieldLabel : i18n._('Release zone'),//发布区域
	width : 360,
	listConfig:{maxHeight:200},
	labelWidth : 80,//100
	editable : false,
	store : vmCreateZoneStore,
	queryMode : 'local',
	displayField : 'name',
	valueField : 'id',
	emptyText : i18n._('Please select a publishing zone'),
	listeners : {
		select : function(combo, record, index) {
			vmCreateHostComb.store.load({params:{'serverZone.id':combo.value}});
			vmCreateImageComb.store.load({params:{'serverZone.id':combo.value}});
			if(vmCreateSubnetComb.getValue()){
				var zoneCode=vmCreateZoneStore.getAt(vmCreateZoneStore.indexOfId(combo.value)).get('code');
				vmCreateIPStore.load({params:{'subnetId':vmCreateSubnetComb.getValue(),'zoneCode':zoneCode}});
			}
			vmCreateHostComb.setValue(null);
			vmCreateImageComb.setValue(null);
		}
	}
});
//创建虚拟机IP数据Data
var vmCreateIPData = [];
//创建虚拟机IP数据Store
var vmCreateIPStore = Ext.create('Ext.data.Store', {	
	fields : [ 'id', 'ip' ],
	proxy:{
        type: 'ajax',
        url : path+'/../ip/findAllFreeIPDetail!findAvailableIPDetailOfSubnet.action',
		reader: {
            type: 'json',
			root:'resultObject',
			totalProperty: 'resultObject.totalCount'
        }
    },
	data : vmCreateIPData,
	autoLoad : false,//true
	listeners : {
		load : function(vmCreateIPStore, records, successful, eOpts ){
			if(successful && vmCreateIPStore.getCount()>0){
				vmCreateIPComb.setValue(null);
			}
		}
	}
});
//创建虚拟机IP下拉列表框
var vmCreateIPComb = Ext.create('Ext.form.ComboBox', {
	width : 180,
	//editable : false,
	store : vmCreateIPStore,
	listConfig:{maxHeight:200},
	disabled:true,
	//allowBlank : false,
	regex : /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/,// 禁止输入空白字符
	regexText : i18n._('InvalidIP'),
	queryMode : 'local',
	displayField : 'ip',
	valueField : 'ip',
	emptyText : i18n._('Automatic distribution of IP'),//自动分配IP
	listeners:{
		'beforequery' : {
			fn : function() {
				if(!vmCreateSubnetComb.getValue()){
					vmCreateSubnetComb.markInvalid('请选择外网子网后添加IP');
				}
			}
		}
	}
});

//创建虚拟机外网subnet数据Store
var vmCreateSubnetStore = Ext.create('Ext.data.Store', {
	autoLoad : false,//true
	fields : [ 'id','displayName'],
	proxy:new Ext.data.proxy.Ajax({
        url : path+'/../ops/ops!getSubnetListByUserId.action',
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
	//data : vmCreateCPUData,	
	listeners : {
		load : function(vmCreateSubnetStore, records, successful, eOpts ){
			if(successful && vmCreateSubnetStore.getCount()>0){
				vmCreateSubnetComb.setValue(null);
			}
		}
	}
});

//创建虚拟机IP下拉列表框
var vmCreateSubnetComb = Ext.create('Ext.form.ComboBox', {
	fieldLabel : i18n._('subnet'),//发布区域
	width : 360,
	labelWidth : 80,//100
	store : vmCreateSubnetStore,
	listConfig:{maxHeight:200},
	allowBlank : false,
	queryMode : 'local',
	displayField : 'displayName',
	valueField : 'id',
	emptyText : i18n._('netSelectTip'),//自动分配IP
	listeners:{
		'select' : {
			fn : function() {
				var zoneId=vmCreateZoneComb.getValue();
				var zoneCode=vmCreateZoneStore.getAt(vmCreateZoneStore.indexOfId(zoneId)).get('code');
				vmCreateIPStore.load({params:{'subnetId':this.getValue(),'zoneCode':zoneCode}});
			}
		},
		'beforequery' : {
			fn : function() {
				if(!vmCreateZoneComb.getValue()){
					vmCreateZoneComb.markInvalid('请选择区域后选择子网');
					return;
				}
				if(!vmCreateUserComb.getValue()){
					vmCreateUserComb.markInvalid('请选择租户后选择子网');
					return;
				}
			}
		}
	}
});
//创建虚拟机是否使用公网IP单选框
var vmCreateIpCheckRadioGroup = Ext.create('Ext.form.RadioGroup', {
	fieldLabel : i18n._('OuterIP'),//公网IP
	labelWidth : 80,
	width : 180,
	columns : 1,
	vertical : false,
	isFormField:true,
	items : [ {		
		boxLabel : i18n._('nodeploy'),//不发布
		width : 80,
		name : 'rb',
		inputValue : '1',		
		checked : true
	}, {		
		boxLabel : i18n._('deploy'),//发布
		//width : 8,
		name : 'rb',
		inputValue : '2'		
	}	
	],
	listeners:{
		change:function(vmCreateIpCheckRadioGroup, newValue, oldValue, eOpts){			
			if(vmCreateIPComb.isDisabled()){
				vmCreateIPComb.setDisabled(false);
			}else{
				vmCreateIPComb.setDisabled(true);
				vmCreateIPComb.setValue(null);
			}						
		}
	}
});
//创建虚拟机节点数据Data
var vmCreateHostData = [];
//创建虚拟机节点数据Store
var vmCreateHostStore = Ext.create('Ext.data.Store', {
	fields : [ 'id', 'name','nodeAliases' ],
	proxy:{
		//model: 'ServiceItem',
        type: 'ajax',
        url : path+'/../sc/node!getAllNodesGroupByZone.action',
		//extraParams:{serviceType:1},
		reader: {
            type: 'json',
			root:'resultObject',
			totalProperty: 'resultObject.totalCount'
        }
    },
	data : vmCreateHostData,
	autoLoad : false,//true
	listeners : {
		load : function(vmCreateHostStore, records, successful, eOpts ){
			if(successful && vmCreateHostStore.getCount()>0){
				vmCreateHostComb.setValue(null);
			}
		}
	}
});
//创建虚拟机节点下拉列表框
var vmCreateHostComb = Ext.create('Ext.form.ComboBox', {
	fieldLabel : i18n._('Release node'),//发布节点
	width : 360,
	listConfig:{maxHeight:200},
	labelWidth : 80,//100
	editable : false,
	store : vmCreateHostStore,
	queryMode : 'local',
	displayField : 'nodeAliases',
	valueField : 'name',
	emptyText : i18n._('Please select a publishing node')
});

//创建虚拟机用户数据Data
var vmCreateUserData = [];
//创建虚拟机用户数据Store
var vmCreateUserStore = Ext.create('Ext.data.Store', {
	fields : [ 'id', 'name','email' ],
	proxy:{
		//model: 'ServiceItem',
        type: 'ajax',
        url : path+'/../admin_mgmt/userManagement!getAllAvailableUser.action',
		//extraParams:{serviceType:1},
		reader: {
            type: 'json',
			root:'resultObject',
			totalProperty: 'resultObject.totalCount'
        }
    },
	data : vmCreateUserData,
	autoLoad : false,
	listeners : {
		load : function(vmCreateUserStore, records, successful, eOpts ){
			//vmCreateIPComb.store.removeAll();
			vmCreateSubnetComb.store.removeAll();
			if(successful && vmCreateUserStore.getCount()>0){
				vmCreateUserComb.setValue(null);
			}
		}
	}
});
//创建虚拟机用户数据下拉列表框
var vmCreateUserComb = Ext.create('Ext.form.ComboBox', {
	fieldLabel : i18n._('SpecifiedUser'),//指定用户
	width : 360,
	labelWidth : 80,
	editable : true,
	store : vmCreateUserStore,
	emptyText:"请选择租户",
	queryMode : 'local',
	displayField : 'email',
	valueField : 'id',
	listeners : {
		select : function(combo, record, index) {
			vmCreateSubnetComb.setValue(null);
			vmCreateIPComb.setValue(null);
			if(vmCreateZoneComb.getValue()){
				vmCreateSubnetComb.store.load({params:{'zoneId':vmCreateZoneComb.getValue(),"owner":combo.value}});
			}
		}
	}
});
//创建虚拟机用户数据文本框
var vmCreateUserText = Ext.create('Ext.form.field.Text', {	
	name : 'ownerEmail',
	vtype: 'email',
	width : 360,
	labelWidth : 80,
	allowBlank:false,
	fieldLabel : i18n._('SpecifiedUser'),//指定用户	
	emptyText : i18n._('Please enter an email of owner'),
	listeners : {
		change : function(vmCreateUserText, newValue, oldValue, eOpts){
			if(newValue == oldValue || vmCreateUserText.isValid() == false){
				return;
			}
			if(vmCreateUserText.getValue()!= null && vmCreateUserText.getValue()!=""){
				var proxy = vmCreateUserStore.getProxy();
//				alert("----vmCreateUserText 123---"+vmCreateUserText.getValue());
				proxy.setExtraParam('query',vmCreateUserText.getValue());
				vmCreateUserStore.load();
			}
		}
	}
});
// 创建虚拟机Form
var createVMForm = Ext.create('Ext.form.Panel', {
	frame : true,
	autoScroll :true,
	// title: 'Form Fields',
	//width: 500,
	bodyPadding : 5,
	fieldDefaults : {
		labelAlign : 'left',
		labelWidth : 60,
		anchor : '100%'
	},
	items : [ vmCreateRAMFieldContainer,{
		xtype:'fieldcontainer',
		layout:'hbox',
		items:[vmCreateZoneComb,{
			xtype : 'displayfield',
			margin:'0 5 0 25',
			width : 220,
			value : i18n._('Defaults to the main zone, can be manually modified distribution zone')//默认为主区域，可手动修改区域位置。
		}]
	}, {
		xtype : 'fieldcontainer',
		layout : 'hbox',
		items : [ vmCreateVmNameField,{
			xtype : 'displayfield',
			margin:'0 5 0 25',
			width : 250,
			value : i18n._('Please enter a vm name')//请输入一个虚拟机名称
		} ]
	}, {
		xtype : 'fieldcontainer',
		layout : 'hbox',
		items : [ vmCreateImageComb,{
			xtype : 'displayfield',
			margin:'0 5 0 25',
			width : 250,
			value : i18n._('Choose an operating system')//请根据下拉列表选择操作系统类别
		} ]
	}, {
		xtype : 'fieldcontainer',
		layout : 'hbox',
		items : [ vmCreateCPUComb,{
			xtype : 'displayfield',
			margin:'0 5 0 25',
			width : 250,
			value : i18n._('Please select CPU type')//请根据下拉列表选择所需处理器规格
		} ]
	}, {
		xtype : 'fieldcontainer',
		layout : 'hbox',
		items : [ vmCreateHostComb, {
			xtype : 'displayfield',
			margin:'0 5 0 25',
			width : 220,
			value : i18n._('Defaults to the current node, can be manually modified distribution location')//默认为当前节点，可手动修改分配位置。
		} ]
	},v_networkSlider,{
		xtype : 'fieldcontainer',
		layout : 'hbox',
		items : [ vmCreateUserComb,{
			xtype : 'displayfield',
			margin:'0 5 0 25',
			width : 250,
			value : i18n._('Please enter an email of owner')//请输入一个用户的邮箱
		} ]
	}, {
		xtype : 'fieldcontainer',
		layout : 'hbox',
		items : [ vmCreateSubnetComb,{
			xtype : 'displayfield',
			margin:'0 5 0 25',
			width : 250,
			value : i18n._('请在选择子网前先选择区域和租户。')//请输入一个用户的邮箱
		} ]
	},{
		xtype : 'fieldcontainer',
		layout : 'hbox',
		items : [ vmCreateIpCheckRadioGroup,vmCreateIPComb,{
			xtype : 'displayfield',
			margin:'0 5 0 25',
			width : 220,
			value : i18n._('You can choose to publish or not to publish public IP. The default is the automatic allocation of IP, can also be manually assigned IP.')//可选择发布公网IP或者不发布。默认为自动分配IP，也可手动分配IP。
		} ]
	}
	,v_disk,vmCreateDiskAddFieldContainer
	],
	buttons : [
			{
				text : i18n._('OK'),
				handler : function() {
					var vmName = Ext.String.trim(vmCreateVmNameField.getValue());
					//alert('vcpusid*'+vmCreateCPUComb.getValue());
					var vcpu = vmCreateCPUStore.getAt(vmCreateCPUStore.indexOfId(vmCreateCPUComb.getValue())).get('coreNum');
					var ram = vmCreateRamStore.getAt(vmCreateRAMField.getValue()).get('size');
					
					var disk = v_diskStore.getById(v_disk.getValue()).get('capacity');
					var disk_id = v_diskStore.getById(v_disk.getValue()).get('id');
					var diskType = v_diskStore.getById(v_disk.getValue()).get('model');
					var network_id = v_networkStore.getById(v_networkSlider.getValue()).get('id');
					var network = v_networkStore.getById(v_networkSlider.getValue()).get('bandWidth') ;
					var networkType = v_networkStore.getById(v_networkSlider.getValue()).get('type') ;
					
					var osId = vmCreateImageComb.getValue();
					var imageId_ =vmCreateImageStore.getAt(vmCreateImageStore.indexOfId(osId)).get('imageId');
					var zoneId=vmCreateZoneComb.getValue();
					var zoneCode='';
					if(vmCreateZoneStore.getAt(vmCreateZoneStore.indexOfId(zoneId))!=null){
						zoneCode =vmCreateZoneStore.getAt(vmCreateZoneStore.indexOfId(zoneId)).get('code');
						if(vmCreateHostComb.store.count()<=0){
							Ext.MessageBox.show({
								title : i18n._('notice'),
								msg : i18n._('There is not one available node in this zone,can not create VM!'),//此区域里无可用的节点，无法创建虚拟机！
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.WARNING
							});
							return;
						}
					}
					var ip = vmCreateIPComb.getValue();								
					var vcpusType = vmCreateCPUStore.getAt(vmCreateCPUStore.indexOfId(vmCreateCPUComb.getValue())).get('model');
					//alert('vcpusType*'+vcpusType);
					var ramType = vmCreateRamStore.getAt(vmCreateRAMField.getValue()).get('model');
					//alert('ramType*'+ramType);
					//alert('diskType*'+diskType);
					var ipDeploy = '1';//发布IP
					var subnetId='';
					if(vmCreateIPComb.isDisabled()){
						subnetId=vmCreateSubnetComb.getValue();
						ipDeploy = '0';//不发布IP
						ip = '';
					}else{
						subnetId=vmCreateSubnetComb.getValue();
						if(ip==null){
							ip = '';//自动分配IP
						}else{
							//如果不是自动分配ip，则查看输入的ip是否存在于ip池中
							if(vmCreateIPStore.find('ip',ip)==-1){
								Ext.MessageBox.show({
									title : i18n._('notice'),
									msg : i18n._('InvalidIP'),//输入IP无效
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});// INFO,QUESTION,WARNING,ERROR
								return;
							}
						}						
					}					
					var vmNode = vmCreateHostComb.getValue();
					if(vmNode == null){
						vmNode='';					
					}
					var vmUseId = vmCreateUserComb.getValue();				
//					alert('-------vmUserEmail-----'+vmUseId);
					var imageId=vmCreateImageComb.getValue()
					var imageIndex=vmCreateImageStore.indexOfId(imageId);
					var record=vmCreateImageStore.getAt(imageIndex);
					var imageSize=record.data.imageSize;
					if(imageSize>disk){
						v_disk.getComponent(0).markInvalid("系统盘容量小于镜像大小，请重新选择");
						return;
					}
						
					var addDisk ='';					
					if (vmCreateDiskArray.length > 0) {
						for ( var i = 0; i < vmCreateDiskArray.length; i++) {	//vmCreateDiskCreateCount + 1
							if(vmCreateExtDiskStore.getAt(Ext.getCmp('diskSlider' + vmCreateDiskArray[i]).getValue()).get('capacity')>0){
								addDisk = addDisk
								+ vmCreateExtDiskStore.getAt(Ext.getCmp('diskSlider' + vmCreateDiskArray[i]).getValue()).get('capacity')+',';
							}else{
								Ext.MessageBox.show({
									title : i18n._('notice'),
									msg : i18n._('Please set the extended hard disk capacity'),//提示设置扩展盘大小
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});// INFO,QUESTION,WARNING,ERROR
								return;
							}							
						}
					}
					// 遮罩层
					var v_mask = new Ext.LoadMask(Ext.getBody(), {
						msg : i18n._('please wait'),
						removeMask : true
					// 完成后移除
					});
					if (vmName == null ||vmName=='') {
						Ext.MessageBox.show({
							title : i18n._('notice'),
							msg : i18n._('Please input the VM name'),//请输入输入主机名称
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});// INFO,QUESTION,WARNING,ERROR
						vmCreateVmNameField.focus();
						return;
					}
					if(subnetId == null||subnetId==''){
						Ext.MessageBox.show({
							title : i18n._('notice'),
							msg : i18n._('Please select subnet'),//选择子网
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});// INFO,QUESTION,WARNING,ERROR
						vmCreateSubnetComb.focus();
						return;
					}
					// 提交后台之前先做有效性验证
					if (!createVMForm.getForm().isValid()) {
						Ext.MessageBox.show({
							title : i18n._('notice'),
							msg : i18n._('Please input the correct value'),//输入有效值
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						});// INFO,QUESTION,WARNING,ERROR
						return;
					} else {

						// if(dId==0){
						v_mask.show();
						var create = Ext.Ajax.request({
							url : path + '/../ops/ops!createVm.action',
							method : 'POST',
							jsonData: {
								'name' : vmName,
								'vcpus' : vcpu,
								'ram' : ram,
								'network':network,
								'networkType':networkType,
								'disk' : disk,
								'subnetId':subnetId,
								'diskId' : disk_id,
								'networkId' : network_id,
								'addDisk' : addDisk,
								'osId' : osId,
								'imageId' : imageId_,
								'ipDeploy' : ipDeploy,
								'floating_ip' : ip,
								'vmNode' : vmNode,
								'vcpusType':vcpusType,
								'ramType':ramType,
								'diskType':diskType,
								'owner':vmUseId,
								'vmZone':zoneCode
								//'subnetId':subnetId
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
								Ext.MessageBox.show({
									title : i18n._('notice'),
									msg : i18n._('operationMessage'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.INFO,
									fn: reLoadData
								});		
								vmCreateDiskArray=[];
								createVMForm.getForm().reset();
								createVMWin.remove(createVMForm,false);
								createVMWin.hide();
								vmCreateDiskCreateCount=0;
								vmDeleteDiskFlag =false;
								// createVMWin.destroy();
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
								vmCreateDiskArray=[];
								createVMForm.getForm().reset();
								createVMWin.remove(createVMForm,false);
								createVMWin.hide();
								vmCreateDiskCreateCount=0;
								vmDeleteDiskFlag =false;
								// createVMWin.destroy();
							}
						});	
					}

				}
			}, {
				text : i18n._('Cancel'),
				handler : function() {
					vmRefreshReset();//刷新设置重置
					vmCreateDiskArray=[];
					createVMForm.getForm().reset();
					createVMWin.remove(createVMForm,false);
					createVMWin.hide();
					vmCreateDiskCreateCount=0;
					vmDeleteDiskFlag =false;
					// createVMWin.destroy();
				}
			} ]
});
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
function resetCreateVMForm(){
	//alert('***'+createVMForm.query('fieldcontainer').length);
	for(var i=createVMForm.query('fieldcontainer').length;i>13;i--){	
		//alert(createVMForm.query('fieldcontainer')[i-1]);
		//alert(createVMForm.query('fieldcontainer')[i-1].is('fieldcontainer'));
		createVMForm.query('fieldcontainer')[i-1].removeAll(true);
		addDiskCount=0;
	}	
	vmCreateImageStore.load();
	//vmCreateSubnetStore.load();
	vmCreateCPUStore.load();
	vmCreateRamStore.load();										
	v_diskStore.load();
	v_networkStore.load();
	vmCreateExtDiskStore.load();
	vmCreateZoneStore.load();
	vmCreateUserStore.load();
	//vmCreateSubnetStore.load();
	//vmCreateIPStore.load();
	//vmCreateHostStore.load();
	//vmCreateUserStore.load();
};
