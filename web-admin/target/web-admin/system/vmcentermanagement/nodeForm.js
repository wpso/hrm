/******************************nodeForm******************************************/
//params = getCookie("lang");
//i18n.set({
//	lang : params,
//	path : '../../resources'
//});
Ext.Loader.setConfig({
	enabled : true
});
var params = getCookie("lang");
i18n.set({
	lang : params,
	path : '../../resources'
});
var zoneCode =''; 
if(getCookie("zoneCode")!=null){
	zoneCode = getCookie("zoneCode");
}
if (getQuery("zoneCode") != null) {
	zoneCode = getQuery("zoneCode");
}
var v_mask = null;
var isPowerLimit=0;
//发现节点
var findHostModel = Ext.define('findHostModel', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'id',
		type : 'string'
	}, {
		name : 'name',
		type : 'string',
		mapping : 'name'
	}, {
		name : 'nodeAliases',
		type : 'string'
	},{
		name : 'ip',
		type : 'string'
	}, {
		name : 'innerIP',
		type : 'string'
	},{
		name : 'cpuRate',
		type : 'int'
	}, {
		name : 'ramRate',
		type : 'int'
	}, {
		name : 'diskRate',
		type : 'int'
	}, {
		name : 'cpu',
		type : 'string',
		mapping : 'cpuInfo'
	}, {
		name : 'ram',
		type : 'string',
		mapping : 'ramInfo'
	}, {
		name : 'disk',
		type : 'string',
		mapping : 'diskInfo'
	}, {
		name : 'desc',
		type : 'string',
		mapping : 'description'
	}, {
		name : 'zone',
		type : 'string',
		mapping : 'zone'
	} ]
});
var findNodeStore = Ext.create('Ext.data.Store', {
	model : 'findHostModel',
	pageSize : 15,
	remoteSort : true,
	autoLoad : false,
	proxy : new Ext.data.proxy.Ajax({		
		url : path + '/../sc/node!findNodes.action?zoneCode='+zoneCode,   
		reader : {
			type : 'json',
			root : 'resultObject.result',
			totalProperty : 'resultObject.totalCount'
		},
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
		load: function(nodeStore, records, successful, eOpts ) {
			v_mask.hide();
			if (findNodeStore.getCount() > 0) {
				findNodeGrid.setVisible(true);// 添加时显示左侧列表
				submitButton.setText(i18n._('Add'));
				operationFlag = 0;
				nodeWindow.setTitle(i18n._('found node'));
				nodeWindow.show();
			} else {
				Ext.MessageBox.show({
					title : i18n._('Prompt'),
					msg : i18n._('no new node'),
					icon : Ext.MessageBox.INFO,
					buttons : Ext.MessageBox.OK,
					fn:nodeRefreshReset
				});
				return;
			}

		}
	}
});
//获取所有的Zone
var findZoneStore = Ext.create('Ext.data.Store', {
	fields : [ 'id','name','code'],
	autoLoad : false,
	proxy : new Ext.data.proxy.Ajax({		
		url : path + '/../sc/zone!getAllZones.action',
		reader : {
			type : 'json',
			root : 'resultObject',
			totalProperty : 'resultObject.totalCount'
		},
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
		load: function(nodeStore, records, successful, eOpts ) {
			v_mask.hide();
		}
	}
});
var nodeNameField = Ext.create('Ext.form.field.Text', {
	name : 'nodeName',
	labelAlign : 'right',
	labelWidth : 80,
	fieldLabel : i18n._('node name'),//
	allowBlank : false,
	readOnly : true,
	margin:'5,0,0,0',
	maxLength : 50,
	width : 200
});
var nodeAliasesField = Ext.create('Ext.form.field.Text', {
	name : 'nodeName',
	labelAlign : 'right',
	labelWidth : 80,
	fieldLabel : i18n._('nodeAliases'),//
	allowBlank : false,
	regex:/^[\w-@#$%.^ &*\u4e00-\u9fa5]+$/,
	regexText:i18n._('InvalidCharacters'),
	maxLength : 50,
	margin:'5,0,0,0',
	enforceMaxLength:true,
	width : 200
});
var nodeZoneField = Ext.create('Ext.form.field.Text', {
	name : 'nodeZone',
	labelAlign : 'right',
	labelWidth : 80,
	margin:'5,0,0,0',
	fieldLabel : i18n._('zoneCode'),//
	readOnly : true,
	maxLength : 20,
	width : 200
});
//var nodeZoneFieldContainer = Ext.create('Ext.form.FieldContainer', {
//	layout : 'hbox',
//	items : [ nodeZoneField ]
//});
var nodeNameFieldContainer = Ext.create('Ext.form.FieldContainer', {
	layout : 'hbox',
	items : [ nodeNameField,nodeAliasesField ]
});
var nodezoneFiledContainer = Ext.create('Ext.form.FieldContainer', {
	layout : 'hbox',
	items : [nodeZoneField ]
});
var nodeCPUTypeField = Ext.create('Ext.form.field.Text', {
	name : 'CPU',
	labelAlign : 'right',
	labelWidth : 80,
	margin:'5,0,0,0',
	fieldLabel : i18n._('CPU'),//
	allowBlank : false,
	//maxLength : 20,
	width : 120//200
});
var nodeCPUCoreField = Ext.create('Ext.form.field.Number', {
	name : 'CPUCore',
	labelWidth : 80,
	labelAlign : 'right',
	fieldLabel : i18n._('CPU'),//
	allowBlank : false,
	margin:'5,0,0,0',
	readOnly:true,
	enforceMaxLength:true,
	maxLength : 3,	
	width : 200,//width : 150,
	minValue :1,
	regexText : i18n._('InputNumber')
});
//cpuRate
var nodeCPURateDisplayField = Ext.create('Ext.form.field.Display', {
	margin:'5,0,0,0',
	value : 1
});
var nodeCPURateField = Ext.create('Ext.slider.Single', {
	name : 'CPURate',
	labelAlign : 'right',
	labelWidth : 78,
	fieldLabel : i18n._('cpu rate'),//
	width : 200,
	increment : 1,
	margin:'5,0,0,0',
	minValue : 1,// 1
	maxValue : 10,
	value : 1,// 1
	tipText : function(thumb) {
		return Ext.String.format('<b>{0}</b>', thumb.value);
	},
	listeners : {
		'change' : {
			fn : function() {
				nodeCPURateDisplayField.setValue('1:' + this.getValue());
			}
		}
	}
});
//var nodeCPURateFieldContainer = Ext.create('Ext.form.FieldContainer', {
//	layout : 'hbox',
//	items : [ nodeCPURateField, nodeCPURateDisplayField ]
//});
var nodeCPUFieldContainer = Ext.create('Ext.form.FieldContainer', {
	layout : 'hbox',
	items : [ nodeCPUCoreField, {
		xtype : 'displayfield',
		width:10,
		margin:'5,0,0,0',
		value : i18n._('core')
	},nodeCPURateField, nodeCPURateDisplayField ]
});
var nodeRAMField = Ext.create('Ext.form.field.Number', {
	//name : 'RAM',
	labelAlign : 'right',
	labelWidth : 80,
	fieldLabel : i18n._('Memory'),//
	allowBlank : false,
	margin:'5,0,0,0',
	enforceMaxLength:true,
	maxLength : 6,
	readOnly:true,
	value:0,
	width : 200,
	minValue :1,
	regexText : i18n._('InputNumber')
});
//ramRate
var nodeRAMRateDisplayField = Ext.create('Ext.form.field.Display', {
	margin:'5,0,0,0',
	value : 1
});
var nodeRAMRateField = Ext.create('Ext.slider.Single', {
	labelAlign : 'right',
	labelWidth : 80,
	fieldLabel : i18n._('ram rate'),//
	width : 200,
	increment : 1,
	margin:'5,0,0,0',
	minValue : 1,// 1
	maxValue : 10,
	value : 1,// 1
	tipText : function(thumb) {
		return Ext.String.format('<b>{0}</b>', thumb.value);
	},
	listeners : {
		'change' : {
			fn : function() {
				nodeRAMRateDisplayField.setValue('1:' + this.getValue());
			}
		}
	}
});
//var nodeRAMRateFieldContainer = Ext.create('Ext.form.FieldContainer', {
//	layout : 'hbox',
//	items : [ nodeRAMRateField, nodeRAMRateDisplayField ]
//});
var nodeRAMFieldContainer = Ext.create('Ext.form.FieldContainer', {
	layout : 'hbox',
	items : [ nodeRAMField, {
		xtype : 'displayfield',
		width:10,
		margin:'5,0,0,0',
		value : i18n._('M')
	},nodeRAMRateField, nodeRAMRateDisplayField ]
});
var nodeDiskField = Ext.create('Ext.form.field.Number', {
	//name : 'Disk',
	labelAlign : 'right',
	labelWidth : 80,
	fieldLabel : i18n._('Disk'),//
	allowBlank : false,
	margin:'5,0,0,0',
	enforceMaxLength:true,
	maxLength : 8,
	readOnly:true,
	value:0,
	width : 200,
	minValue :1,	
	regexText : i18n._('InputNumber')
});
//diskRate
var nodeDiskRateDisplayField = Ext.create('Ext.form.field.Display', {
	margin:'5,0,0,0',
	value : 1
});
var nodeDiskRateField = Ext.create('Ext.slider.Single', {
	labelAlign : 'right',
	labelWidth : 80,
	fieldLabel : i18n._('disk rate'),//
	width : 200,
	increment : 1,
	margin:'5,0,0,0',
	disabled:true,
	minValue : 0,// 1
	maxValue : 10,
	value : 1,// 1
	tipText : function(thumb) {
		return Ext.String.format('<b>{0}</b>', thumb.value);
	},
	listeners : {
		'change' : {
			fn : function() {
				nodeDiskRateDisplayField.setValue('1:' + this.getValue());
			}
		}
	}
});
//var nodeDiskRateFieldContainer = Ext.create('Ext.form.FieldContainer', {
//	layout : 'hbox',
//	items : [ nodeDiskRateField, nodeDiskRateDisplayField ]
//});
var nodeDiskFieldContainer = Ext.create('Ext.form.FieldContainer', {
	layout : 'hbox',
	items : [ nodeDiskField, {
		xtype : 'displayfield',
		width:10,
		margin:'5,0,0,0',
		value : i18n._('G')
	},nodeDiskRateField, nodeDiskRateDisplayField ]
});
var nodeIPField = Ext.create('Ext.form.field.Text',{
	name : 'IP',
	labelAlign : 'right',
	labelWidth : 80,
	fieldLabel : i18n._('IP'),//
	regex : /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/,// 禁止输入空白字符
	regexText : i18n._('InvalidIP'),
	allowBlank : false,
	margin:'5,0,0,0',
//	readOnly : true,
	maxLength : 20,
	width : 200,
	emptyText : i18n._('IP')
});
//修改人 张建伟 修改时间 20131008
var nodeManagerIPField = Ext.create('Ext.form.field.Text',{
	name : 'innerIP',
	labelAlign : 'right',
	labelWidth : 80,
	margin:'5,0,0,0',
	fieldLabel : i18n._('ipInner'),
	regex : /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/,// 禁止输入空白字符
	regexText : i18n._('InvalidIP'),
//	allowBlank : true,
//	readOnly : true,
	maxLength : 20,
	width : 200,
	emptyText : i18n._('ipInner')
});
var nodeIPFieldContainer = Ext.create('Ext.form.FieldContainer', {
	layout : 'hbox',
	items : [ nodeIPField,nodeManagerIPField ]
});
var nodeIdField = Ext.create('Ext.form.field.Text', {
	name : 'nodeId',
	value:0
});
var zoneIdField = Ext.create('Ext.form.field.Text', {
	name : 'zoneId',
	value:0
});
var ipmiIdField = Ext.create('Ext.form.field.Text', {
	name : 'ipmiId',
	value:0
});
var nodeIsolationIdField = Ext.create('Ext.form.field.Text', {
	name : 'nodeIsolationId',
	value:0
});
var nodePowerSet=Ext.create('Ext.form.field.Checkbox',{
name: 'nodePowerSet',
margin:'0 0 5 32',
labelWidth:100,
boxLabel:i18n._('setPowerLimit'),//开启功耗限制
inputValue: '1',
checked: false
});
var nodePowerLimitLabel=Ext.create('Ext.form.Label',{
	text:'<'
});
var nodePowerLabel=Ext.create('Ext.form.Label',{
	text:'W'
});
var nodePowerLimitField = Ext.create('Ext.form.field.Text',{
	name : 'nodePowerLimit',
	regex:/^[0-9]+$/,
	regexText : i18n._('InvalidNumber'),
	maxLength : 20,
	width : 56,
	emptyText : i18n._('power')
});
var nodeIPMIPowerFieldContainer = Ext.create('Ext.form.FieldContainer', {
	layout : 'hbox',
	items : [nodePowerSet,nodePowerLimitLabel,nodePowerLimitField,nodePowerLabel]
});
var nodeIPMIIPField = Ext.create('Ext.form.field.Text',{
	name : 'IPMIIP',
	//margin:'0 0 0 65',
	labelAlign : 'right',
	labelWidth : 80,
	fieldLabel : i18n._('IP'),//IP
	regex : /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/,// 禁止输入空白字符
	regexText : i18n._('InvalidIP'),
	maxLength : 20,
	width : 200,
	emptyText : i18n._('IP')
});
var nodeIPMIPortField=Ext.create('Ext.form.field.Text',{
    name: 'IPMIPort',
    //margin:'0 0 0 65',
    labelAlign : 'right',
	labelWidth : 80,
    fieldLabel: i18n._('port'),//端口
    regex:/^[0-9]+$/,
	regexText:i18n._('InvalidCharacters'),
    maxLength:20,
    width:200,
    emptyText:i18n._('port')
});
var nodeIPMIIPContainer = Ext.create('Ext.form.FieldContainer', {
	layout : 'hbox',
	items : [ nodeIPMIIPField,nodeIPMIPortField ]
});
//var nodeIPMIPortContainer = Ext.create('Ext.form.FieldContainer', {
//	layout : 'hbox',
//	items : [ nodeIPMIPortField ]
//});
var nodeIPMIUserNameField = Ext.create('Ext.form.field.Text', {
	name : 'userName',
	//margin:'0 0 0 65',
	labelAlign : 'right',
	labelWidth : 80,
	fieldLabel : i18n._('username'),//用户名
	maxLength : 20,
	width : 200,
    emptyText:i18n._('username')
});
var nodeIPMIPasswordField=Ext.create('Ext.form.field.Text',{
    name: 'password',
    //margin:'0 0 0 65',
    labelAlign : 'right',
	labelWidth : 80,
    fieldLabel: i18n._('password'),//密码
    regex:/^[\w-@#$%^&*]+$/,
	regexText:i18n._('InvalidCharacters'),
	inputType: 'password',
    maxLength:20,
    width:200,
    emptyText:i18n._('password')
});
var nodeIPMIUserNameContainer = Ext.create('Ext.form.FieldContainer', {
	layout : 'hbox',
	items : [ nodeIPMIUserNameField,nodeIPMIPasswordField ]
});
//var nodeIPMIPasswordContainer = Ext.create('Ext.form.FieldContainer', {
//	layout : 'hbox',
//	items : [ nodeIPMIPasswordField ]
//});
var nodeIPMIFieldSet = Ext.create('Ext.form.FieldSet', {
	title:i18n._('powerManager'),//功耗管理
	//padding:'0 150 0 20',
	collapsed:true,
	collapsible:true,
	hidden:true,
	items : [ nodeIPMIPowerFieldContainer,nodeIPMIIPContainer,nodeIPMIUserNameContainer]
});
//主机数
var nodehostNumberLabel=Ext.create('Ext.form.Label',{
	width:80,
	text:i18n._('hostNum')+':'//主机数
});
var nodehostNumberLimitLabel=Ext.create('Ext.form.Label',{
	text:'<'
});
var nodehostNumberUnitLabel=Ext.create('Ext.form.Label',{
	text:i18n._('n')
});
var nodehostNumberField=Ext.create('Ext.form.field.Text',{    
//    regex:/^[0-9]+$/,
	regex:/^([1-9][0-9]{0,2})$/,
	regexText:i18n._('InvalidNumber'),
    maxLength:3,
    enforceMaxLength:true,
    width:100,
    value:120,
    emptyText:'0'
}); 
var nodehostNumberContainer = Ext.create('Ext.form.FieldContainer', {
	layout : 'hbox',
	items : [nodehostNumberLabel,nodehostNumberLimitLabel,nodehostNumberField,nodehostNumberUnitLabel]
});
//增加人 张建伟 增加时间 20131009
var nodehostStorageLabel=Ext.create('Ext.form.Label',{
	width:80,
	text:i18n._('storage')+':'//存储空间
});
var nodehostStorageLimitLabel=Ext.create('Ext.form.Label',{
	text:'<'
});
var nodehostStorageField=Ext.create('Ext.form.field.Text',{    
	regex:/^([1-9][0-9]{0,3})$/,
	regexText:i18n._('InvalidNumber'),
    maxLength:4,
    enforceMaxLength:true,
    width:100,
    value:300,
    emptyText:'0'
});
var nodehostStorageUnitLabel=Ext.create('Ext.form.Label',{
	text:'G'
});
var nodehostStorageContainer = Ext.create ('Ext.form.FieldContainer', {
	layout : "hbox",
	items : [nodehostStorageLabel,nodehostStorageLimitLabel,nodehostStorageField,nodehostStorageUnitLabel]
});
//IOPS
var nodeIOPSLabel=Ext.create('Ext.form.Label',{
	width:70,
	text:i18n._('IOPS')+':'//IOPS
});
var nodeIOPSRLimitLabel=Ext.create('Ext.form.Label',{
	text:'R <'
});
var nodeIOPSWLimitLabel=Ext.create('Ext.form.Label',{
	text:'W <'
});
var nodeIOPSUnitLabel=Ext.create('Ext.form.Label',{
	text:'MB/sec'
});
var nodeIOPSRField=Ext.create('Ext.form.field.Text',{    
	regex:/^([1-9][0-9]{0,3})$/,
	regexText:i18n._('InvalidNumber'),
	enforceMaxLength:true,
    maxLength:4,
    width:100,
    value:75,
    emptyText:'0'
});
var nodeIOPSWField=Ext.create('Ext.form.field.Text',{    
	regex:/^([1-9][0-9]{0,3})$/,
	regexText:i18n._('InvalidNumber'),
	enforceMaxLength:true,
    maxLength:4,
    width:100,
    value:50,
    emptyText:'0'
});
var nodeIOPSContainer = Ext.create('Ext.form.FieldContainer', {
	layout : 'hbox',
	items : [nodeIOPSLabel,nodeIOPSRLimitLabel,nodeIOPSRField,nodeIOPSWLimitLabel,nodeIOPSWField,nodeIOPSUnitLabel]
});
//CPU-workload
var nodeWorkloadLabel=Ext.create('Ext.form.Label',{
	width:80,
	text:i18n._('cpu workload')+':'//Workload
});
var nodeWorkloadLimitLabel=Ext.create('Ext.form.Label',{
	text:'<'
});
//var nodeWorkloadUnitLabel=Ext.create('Ext.form.Label',{
//	text:'%'
//});
var nodeWorkloadField=Ext.create('Ext.form.field.Text',{    
	regex:/^([1-9][0-9]{0,1}|100)$/,
	regexText:i18n._('InvalidNumber'),
    maxLength:3,
    enforceMaxLength:true,
    width:100,
    value:65,
    emptyText:'0'
});
var nodeWorkloadContainer = Ext.create('Ext.form.FieldContainer', {
	layout : 'hbox',
	items : [nodeWorkloadLabel,nodeWorkloadLimitLabel,nodeWorkloadField]
});
//network
var nodeNetworkLabel=Ext.create('Ext.form.Label',{
	width:69,
	text:i18n._('net')+':'//IOPS
});
var nodeNetworkRLimitLabel=Ext.create('Ext.form.Label',{
	text:'Rx<'
});
var nodeNetworkWLimitLabel=Ext.create('Ext.form.Label',{
	text:'Tx<'
});
var nodeNetworkUnitLabel=Ext.create('Ext.form.Label',{
	text:'Mbps'
});
var nodeNetworkRField=Ext.create('Ext.form.field.Text',{    
	regex:/^([1-9][0-9]{0,2})$/,
	regexText:i18n._('InvalidNumber'),
	enforceMaxLength:true,
    maxLength:3,
    width:100,
    value:10,
    emptyText:'0'
});
var nodeNetworkWField=Ext.create('Ext.form.field.Text',{    
	regex:/^([1-9][0-9]{0,2})$/,
	regexText:i18n._('InvalidNumber'),
	enforceMaxLength:true,
    maxLength:3,
    width:100,
    value:10,
    emptyText:'0'
});
var nodeNetworkContainer = Ext.create('Ext.form.FieldContainer', {
	layout : 'hbox',
	items : [nodeNetworkLabel,nodeNetworkRLimitLabel,nodeNetworkRField,nodeNetworkWLimitLabel,nodeNetworkWField,nodeNetworkUnitLabel]
});
var nodeIsolationFieldSet = Ext.create('Ext.form.FieldSet', {
	title:i18n._('isolationSet'),//资源限制
//	collapsed:true,
	collapsible:true,
	hidden:true,
//	modify zhangjianwei modifytime 20131009
	items : [nodehostNumberContainer,nodehostStorageContainer,nodeWorkloadContainer,nodeIOPSContainer,nodeNetworkContainer]
});
var submitButton = Ext.create('Ext.button.Button', {
	style : 'margin-right:5',
	handler : function() {
		//alert(nodeIdField.getValue());
		// 提交后台之前先做有效性验证
		if (!nodeForm.getForm().isValid()) {
			Ext.MessageBox.show({
				title : i18n._('notice'),
				msg : i18n._('Please input the correct value'),//输入有效值
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.ERROR
			});// INFO,QUESTION,WARNING,ERROR
			return;
		}
		var nodeAliases = Ext.String.trim(nodeAliasesField.getValue());
		if (nodeAliases == null ||nodeAliases=='') {
			Ext.MessageBox.show({
				title : i18n._('notice'),
				msg : i18n._('please input') + i18n._('nodeAliases'),//请输入输入主机别名
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.WARNING
			});// INFO,QUESTION,WARNING,ERROR
			nodeAliasesField.focus();
			return;
		}
		// 字段判断
		if (nodeIPField.getValue() == null || nodeIPField.getValue() == "") {
			Ext.MessageBox.show({
				title : i18n._('errorNotice'),
				msg : i18n._('please input') + i18n._('IP'),
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.WARNING
			});
			return;
		}
		
		if(nodeCPUCoreField.getValue()<=0){
			Ext.MessageBox.show({
				title : i18n._('errorNotice'),
				msg : i18n._('InputNumber'),
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.WARNING
			});
			return;
		}
		if(nodeRAMField.getRawValue()<=0){
			Ext.MessageBox.show({
				title : i18n._('errorNotice'),
				msg : i18n._('InputNumber'),
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.WARNING
			});
			return;
		}
		if(nodeDiskField.getValue()<=0){
			Ext.MessageBox.show({
				title : i18n._('errorNotice'),
				msg : i18n._('InputNumber'),
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.WARNING
			});
			return;
		}
		//zone关联
		var zoneIdIndex = findZoneStore.find('code',nodeZoneField.getValue());
		//alert('zoneIdIndex:'+zoneIdIndex);
		if(zoneIdIndex>=0){
			zoneIdField.setValue(findZoneStore.getAt(zoneIdIndex).get('id'));
		}else{
			Ext.MessageBox.show({
				title : i18n._('errorNotice'),
				msg : i18n._('The zone name can not be used'),//区域名称不可使用！
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.WARNING
			});
			return;
		}
		if(nodePowerSet.getValue()){
			isPowerLimit=1;
			if(nodePowerLimitField.getValue()<0){
				Ext.MessageBox.show({
					title : i18n._('errorNotice'),
					msg : i18n._('InputNumber'),
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.WARNING
				});
				return;
			}
		}		
		if (nodeIdField.getValue() == 0) {
			var json = getJson(0, 0);
			ajax_request(json);
		} else {
			var json = getJson(1, nodeIdField.getValue());
			ajax_request(json);
		}
		nodeIdField.setValue(0);
		ipmiIdField.setValue(0);
		nodeForm.getForm().reset();
		nodeWindow.hide();
	}
});
var nodeForm = Ext.create('Ext.form.Panel', {
	//frame : true,
	height : 450,
	border : false,
	bodyPadding : 5,
	autoScroll:true,
	scroll :'vertical',
	fieldDefaults : {
		labelAlign : 'right',
		labelWidth : 80,
		anchor : '100%'
	},
	items : [ nodeNameFieldContainer, nodezoneFiledContainer, nodeIPFieldContainer, nodeCPUFieldContainer,
			nodeRAMFieldContainer, nodeDiskFieldContainer,nodeIsolationFieldSet, nodeIPMIFieldSet ],// NodeFieldSet,
	buttons : [ submitButton, {
		style : 'margin-right:5',
		text : i18n._('Cancel'),
		handler : function() {
			nodeIdField.setValue(0);
			ipmiIdField.setValue(0);
			nodeForm.getForm().reset();			
			nodeRefreshReset();//刷新重置
			nodeWindow.hide();
		}
	} ]
});

// 发现节点列表
var findNodeGrid = Ext.create('Ext.grid.Panel', {
	store : findNodeStore,
	hideHeaders : true,
	layout : 'fit',
	columns : [ {
		header : i18n._('node'),
		dataIndex : 'name',
		renderer :function(data, metadata, record, rowIndex, columnIndex, store){
			var string=new String(data);
			metadata.tdAttr = 'data-qtip="' + string + '"';
		    return data;							
		}
	} ],
	listeners : {
		click : {
			element : 'body',
			fn : function() {
				var row = findNodeGrid.getSelectionModel().getSelection();
				nodeNameField.setValue(row[0].get('name'));
				nodeAliasesField.setValue(row[0].get('aliases'));
				nodeCPUCoreField.setValue(row[0].get('cpu'));
				nodeRAMField.setValue(row[0].get('ram'));
				nodeDiskField.setValue(row[0].get('disk'));
				nodeIPField.setValue(row[0].get('ip'));
				//增加人 张建伟 增加时间 20101009 <--坑货
				nodeManagerIPField.setValue(row[0].get('innerIP'));
				var zoneIdIndex = findZoneStore.find('code',row[0].get('zone'));
				if(zoneIdIndex>-1){
					nodeZoneField.setValue(findZoneStore.getAt(zoneIdIndex).get('code'));
				}				
				//nodeZoneField.setValue(row[0].get('zone'));
			}
		}
	}
});
var nodeWindow = Ext.create('Ext.window.Window', {
	// modal:'true',
	width : 620,
	//autoHeight : true,
	height:480,
	layout : 'column',// anchor,hbox
	resizable : false,
	closable : false,
	constrain : true,
	modal : true,
	items : [ {
		id:'nodeGridPanel',
		xtype : 'panel',
		width : '20%',
		height : 450,
		//frame:true,
		border:false,
		items : [ findNodeGrid ]//
	}, {
		id:'nodeFormPanel',
		xtype : 'panel',
		width : '80%',
		border:false,
		items : [ nodeForm ]
	}

	],
	tools : [ {
		type : 'close',
		handler : function() {
			nodeRefreshReset();//刷新重置
			nodeIdField.setValue(0);
			ipmiIdField.setValue(0);
			nodeForm.getForm().reset();
			nodeWindow.hide();
		}
	} ]
});
function getJson(isAdd, id) {
	if (isAdd == 0) {
		return {
			name : nodeNameField.getValue(),
			nodeAliases : nodeAliasesField.getValue(),
			cpuInfo : nodeCPUCoreField.getValue(),
			cpuType : nodeCPUTypeField.getValue(),
			ramInfo : nodeRAMField.getRawValue(),
			diskInfo : nodeDiskField.getRawValue(),
			ip : nodeIPField.getValue(),
			//修改人 张建伟 修改时间 20101009
			innerIP : nodeManagerIPField.getValue(),
			cpuRate : nodeCPURateField.getValue(),
			ramRate : nodeRAMRateField.getValue(),
			diskRate : nodeDiskRateField.getValue(),
			zone : nodeZoneField.getValue(),
			serverZone:{
				id:zoneIdField.getValue()
			},
			ipmiConfig:{
				//id:ipmiIdField.getValue(),
				powerConsumption:nodePowerLimitField.getValue(),
				isConsumptionLimit:isPowerLimit,
				ip:nodeIPMIIPField.getValue(),
				port:nodeIPMIPortField.getValue(),
				userName:nodeIPMIUserNameField.getValue(),
				password:nodeIPMIPasswordField.getValue()				
			},
			nodeIsolationConfig:{
				hostNumber:nodehostNumberField.getValue(),
				// 增加 张建伟 增加时间 20131009
				storageSpace:nodehostStorageField.getValue(),
				cpuworkload:nodeWorkloadField.getValue(),
				iopsread:nodeIOPSRField.getValue(),
				iopswrite:nodeIOPSWField.getValue(),
				networkRead:nodeNetworkRField.getValue(),
				networkWrite:nodeNetworkWField.getValue()
			}
			//description : nodeDescField.getValue()
		};
	} else {
		return {
			id : id,
			name : nodeNameField.getValue(),
			nodeAliases : nodeAliasesField.getValue(),
			cpuInfo : nodeCPUCoreField.getValue(),
			cpuType : nodeCPUTypeField.getValue(),
			ramInfo : nodeRAMField.getRawValue(),
			diskInfo : nodeDiskField.getRawValue(),
			ip : nodeIPField.getValue(),
			// 增加人 张建伟 增加时间 20101008
			innerIP : nodeManagerIPField.getValue(),
			cpuRate : nodeCPURateField.getValue(),
			ramRate : nodeRAMRateField.getValue(),
			diskRate : nodeDiskRateField.getValue(),
			zone : nodeZoneField.getValue(),
			serverZone:{
				id:zoneIdField.getValue()
			},
			ipmiConfig:{
				id:ipmiIdField.getValue(),
				powerConsumption:nodePowerLimitField.getValue(),
				isConsumptionLimit:isPowerLimit,
				ip:nodeIPMIIPField.getValue(),
				port:nodeIPMIPortField.getValue(),
				userName:nodeIPMIUserNameField.getValue(),
				password:nodeIPMIPasswordField.getValue()
			},
			nodeIsolationConfig:{
				id:nodeIsolationIdField.getValue(),
				hostNumber:nodehostNumberField.getValue(),
				// 增加人 张建伟 增加时间 20131009
				storageSpace:nodehostStorageField.getValue(),
				cpuworkload:nodeWorkloadField.getValue(),
				iopsread:nodeIOPSRField.getValue(),
				iopswrite:nodeIOPSWField.getValue(),
				networkRead:nodeNetworkRField.getValue(),
				networkWrite:nodeNetworkWField.getValue()
			}
			//description : nodeDescField.getValue()
		};
	}
};

function getCookie(name) {
	var arr = document.cookie
			.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
	if (arr != null)
		return unescape(arr[2]);
	return null;
};
function reg_verifyIP(addr)// 验证ip地址的合法性 第三种方法
{
	var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/;
	if (addr.match(reg)) {
		return true;
	} else {
		return false;
	}
};
function reg_verifyInteger(addrs)// 验证是否输入的是数字
{
	var regs = /^[1-9]+$/;// /^[1-9]\d*|0$/	
	if (addrs.match(regs)) {
		return true;
	} else {
		return false;
	}
};
