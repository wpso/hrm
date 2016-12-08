/*----------------------------ipList------------------------*/
var params = getCookie("lang");
i18n.set({
	lang : params,
	path : '../../../resources'
});
Ext.Loader.setConfig({enabled: true});
Ext.require([       
             'Ext.data.*',
             'Ext.form.*',
             'Ext.panel.Panel',
             'Ext.view.View',
             'Ext.layout.container.Fit',
             'Ext.toolbar.Paging',
             'Ext.selection.CheckboxModel',
             'Ext.tip.QuickTipManager',
             'Ext.ux.data.PagingMemoryProxy',
             'Ext.ux.form.SearchField'
]);
var dId=0;
var params;
var formTitle='';
var v_mask = null;
//创建虚拟机CPU数据Store
var zoneStore = Ext.create('Ext.data.Store', {
	autoLoad : false,//true
	fields : [ 'id','name','code'],
	proxy:new Ext.data.proxy.Ajax({
        url : path+'/../../sc/zone!getAllZones.action',
		reader: {
            type: 'json',
			root:'resultObject',
			totalProperty: 'resultObject.totalCount'
        }
    }),
	listeners : {
		load : function(store, records, successful, eOpts ){
			if(successful && store.getCount()>0){
				zoneComb.setValue(store.getAt(0).get('id'));
			}
		}
	}
});


//定义ZoneGroup
Ext.define('ZoneGroup',{
			 extend: 'Ext.data.Model',
			 fields:[
			 {name:'id',type:'long'},
			 {name:'name',type:'string'}
			 ]
});
var zoneGroupStore=Ext.create('Ext.data.Store',{
    model: 'ZoneGroup',
    proxy: new Ext.data.proxy.Ajax({
    	url: path+'/../../sc/zoneGroup!getAllZoneGroups.action',
		reader: {
            type: 'json',
            root: 'resultObject',
            totalProperty: 'resultObject.totalCount'
      }
    })
});
zoneGroupStore.load();
var zoneGroupCombo = Ext.create('Ext.form.ComboBox', {
	fieldLabel : i18n._('Release zoneGroup'),//发布位置
	width : 220,
	listConfig:{maxHeight:200},
	editable : false,
	allowBlank:false,
	emptyText:i18n._('Please Select'),
	store : zoneGroupStore,
	queryMode : 'local',
	displayField : 'name',
	valueField : 'id'
});

var cidr=Ext.create('Ext.form.field.Text',{
    name: 'cidr',
    fieldLabel: i18n._('cidr'),//cidr
    allowBlank:false,
    regex:/^([1-9][0-9]{0,1}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){2}(\.([0-9][0-9]{0,1}|0\d\d|2[0-4]\d|25[0-5])(\/(3[0-2]{1}|[1-2]{0,1}\d)))$/,//禁止输入空白字符
    regexText:i18n._('InvalidIP'),
    //readOnly:true,
    maxLength:20,
    width:220,
    emptyText:i18n._('cidr')
});
var useIPstart=Ext.create('Ext.form.field.Text',{
    name: 'useIPstart',
    fieldLabel: i18n._('useStartIP'),//可分配起始IP
    allowBlank:false,
    regex:/^([1-9][0-9]{0,1}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){2}(\.([1-9][0-9]{0,1}|1\d\d|2[0-4]\d|25[0-5]))$/,//禁止输入空白字符
    regexText:i18n._('InvalidIP'),
    maxLength:20,
    width:220,
    emptyText:i18n._('startIP')
});
var useIPend=Ext.create('Ext.form.field.Text',{
    name: 'useIPend',
    fieldLabel: i18n._('endIP'),//可分配终止IP
    allowBlank:false,
    regex:/^([1-9][0-9]{0,1}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){2}(\.([1-9][0-9]{0,1}|1\d\d|2[0-4]\d|25[0-5]))$/,//禁止输入空白字符
    regexText:i18n._('InvalidIP'),
    maxLength:20,
    width:220,
    emptyText:i18n._('endIP')
});
var dns1=Ext.create('Ext.form.field.Text',{
    name: 'DNS1',
    fieldLabel: i18n._('DNS1'),//DNS1
    allowBlank:false,
    regex:/^([1-9][0-9]{0,1}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){2}(\.([1-9][0-9]{0,1}|1\d\d|2[0-4]\d|25[0-5]))$/,//禁止输入空白字符
    regexText:i18n._('InvalidIP'),
    //readOnly:true,
    maxLength:20,
    width:220,
    emptyText:i18n._('DNS1')
});
var gateWayField=Ext.create('Ext.form.field.Text',{
    name: 'gateWayIp',
    fieldLabel: i18n._('gateWay'),//网关
    allowBlank:false,
    regex:/^([1-9][0-9]{0,1}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){2}(\.([1-9][0-9]{0,1}|1\d\d|2[0-4]\d|25[0-5]))$/,//禁止输入空白字符
    regexText:i18n._('InvalidIP'),
    maxLength:20,
    width:220,
    emptyText:i18n._('gateWay')
});
var zoneComb = Ext.create('Ext.form.ComboBox', {
	fieldLabel : i18n._('zoneName'),//机房线路
	width : 220,
	listConfig:{maxHeight:200},
	editable : false,
	allowBlank:false,
	store : zoneStore,
	displayField : 'name',
	valueField : 'id'
});
//Form表单提交
var formPanel = Ext.create('Ext.form.Panel', {
    frame: true,                        
    //title: 'Form Fields',
    width: 300,                     
    bodyPadding: 5,
    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 85,
        anchor: '100%'
    },
    items: [                            
        cidr,
        useIPstart,
        useIPend,
        dns1,
        gateWayField,
        zoneGroupCombo                                                        
    ],
    buttons: [{
        text: i18n._('OK'),
        handler:function(){                             
            //提交后台之前先做有效性验证
            if(!formPanel.getForm().isValid()){
                Ext.MessageBox.show({
                       title: i18n._('notice'),
                       msg: i18n._('InvalidIP'),
                      buttons: Ext.MessageBox.OK,
                       icon: Ext.MessageBox.ERROR
                    });//INFO,QUESTION,WARNING,ERROR                                    
                return;
            }
            var zoneGroupIdValue = zoneGroupCombo.getValue();
            var cidrValue=cidr.getValue();
            var useIPstartValue=useIPstart.getValue();
            var useIPendValue=useIPend.getValue();
            var dns1Value=dns1.getValue();
			var gateWayValue=gateWayField.getValue(); 
			v_mask.show();
            var create=Ext.Ajax.request({
                url:path+'/../../ip/network!createWanNetwork.action',
                timeout:60000,
                method:'POST',
                params:{
                    'netWorkBean.cidr':cidrValue,
                    'netWorkBean.useIPstart':useIPstartValue,
                    'netWorkBean.useIPend':useIPendValue,
                    'netWorkBean.dns1':dns1Value,
                    'netWorkBean.gateway':gateWayValue,
                    'netWorkBean.zoneGroup':zoneGroupIdValue
                },
                success:function(form,action){
                    v_mask.hide();
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
                    Ext.MessageBox.show({
                           title: i18n._('notice'),
                           msg: i18n._('add')+i18n._('Successful'),
                          buttons: Ext.MessageBox.OK,
                           icon: Ext.MessageBox.INFO,
                           fn:reLoadIPRangeData
                        }); 
                },   
                failure:function(form,action){ 
                    v_mask.hide();
                    Ext.MessageBox.show({
                           title: i18n._('errorNotice'),
                           msg: i18n._('operateFail'),
                          buttons: Ext.MessageBox.OK,
                           icon: Ext.MessageBox.ERROR
                        });  
                }
             });
                formPanel.getForm().reset();
                IPRangeWinForm.hide();      
        }   
    },{
        text: i18n._('Cancel'),
        handler:function(){
            formPanel.getForm().reset();
            IPRangeWinForm.hide()
        }
    }]
});

var IPRangeWinForm = new Ext.create('Ext.window.Window',{                               
    width:350,
    height:260,
    closable:false,
    constrain:true,
    modal:true,
    tools:[{
        type:'close',
        handler:function(){ 
            formPanel.getForm().reset();
            IPRangeWinForm.hide()
        }
    }],
    layout:'fit',
    defaults:{
        split:false
    },
    items:[                 
        {
            xtype: 'form',//fieldset                                
            layout:'fit',
            items:formPanel
        }
    ]
});
//IP详情
var IPDetailField = Ext.create('Ext.form.field.Display', {//
	width : 200,
	fieldLabel : i18n._('IP'),
	value : 0
});
var nodeNameDetailField = Ext.create('Ext.form.field.Display', {//
	width : 200,
	fieldLabel : i18n._('node name'),
	value : 0
});
var vmNameDetailField = Ext.create('Ext.form.field.Display', {//
	width : 200,
	fieldLabel : i18n._('routor_name'),
	value : 0
});
var userNameDetailField = Ext.create('Ext.form.field.Display', {//
	width : 200,
	fieldLabel : i18n._('username'),
	value : 0
});
var userEmailDetailField = Ext.create('Ext.form.field.Display', {//
	width : 200,
	fieldLabel : i18n._('userEmail'),
	value : 0
});
var remarkDetailField = Ext.create('Ext.form.field.Display', {//
	width : 200,
	fieldLabel : i18n._('remark'),
	value : 0
});
var IPDetailformPanel = Ext.create('Ext.form.Panel', {
    frame: true,
    width: 250,                     
    bodyPadding: 5,
    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 80,
        anchor: '100%'
    },
    items: [                            
        IPDetailField,
        nodeNameDetailField,
        vmNameDetailField,
        userNameDetailField,
        userEmailDetailField,
        remarkDetailField
    ]
});
var IPDetailWinForm = new Ext.create('Ext.window.Window',{                               
    width:300,
    height:200,
    title:i18n._('IPDetails'),
    closable:false,
    constrain:true,
    modal:true,
    tools:[{
        type:'close',
        handler:function(){ 
        	IPDetailformPanel.getForm().reset();
            IPDetailWinForm.hide()
        }
    }],
    layout:'fit',
    defaults:{
        split:false
    },
    items:[                 
        {
            xtype: 'form',//fieldset                                
            layout:'fit',
            items:IPDetailformPanel
        }
    ]
});


var cidrDetailField = Ext.create('Ext.form.field.Display', {//
	width : 200,
	fieldLabel : i18n._('cidr'),
	value : 0
});
var dns1DetailField = Ext.create('Ext.form.field.Display', {//
	width : 200,
	fieldLabel : i18n._('dns1'),
	value : 0
});
var gatewayDetailField = Ext.create('Ext.form.field.Display', {//
	width : 200,
	fieldLabel : i18n._('gateWay'),
	value : 0
});
var zoneGroupDetailField = Ext.create('Ext.form.field.Display', {//
	width : 200,
	fieldLabel : i18n._('zoneGroup'),
	value : 0
});
var networkIdDetailField = Ext.create('Ext.form.field.Display', {//
	width : 200,
	fieldLabel : i18n._('uuid'),
	value : 0
});
var networkDetailPanel = Ext.create('Ext.form.Panel', {
    frame: true,
    width: 250,                     
    bodyPadding: 5,
    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 80,
        anchor: '100%'
    },
    items: [                            
        networkIdDetailField,
        cidrDetailField,
        gatewayDetailField,
        zoneGroupDetailField,
        dns1DetailField
    ]
});
var networkDetailWin = new Ext.create('Ext.window.Window',{                               
    width:300,
    height:200,
    title:i18n._('IPDetails'),
    closable:false,
    constrain:true,
    modal:true,
    tools:[{
        type:'close',
        handler:function(){ 
        	networkDetailPanel.getForm().reset();
        	networkDetailWin.hide()
        }
    }],
    layout:'fit',
    defaults:{
        split:false
    },
    items:[                 
        {
            xtype: 'form',//fieldset                                
            layout:'fit',
            items:networkDetailPanel
        }
    ]
});

//define model
var IPRangeModel=Ext.define('IPRangeModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id', 'cidr', 'dns1','gateway','zoneGroup','ipRangeId', 'networkId',
        'totalIPs','usedIPs','assignedIPs', 'freeIPs','status'
    ],                  
    idProperty: 'id'
});
//create the Data Store
var IPRangeStore= Ext.create('Ext.data.Store', {
    model: 'IPRangeModel',
    remoteSort: true,
    autoLoad:false,
    pageSize:pageSize,
    proxy: new Ext.data.proxy.Ajax({
    url: path+'/../../ip/network!findPageNetwork.action',
    reader: {
            type: 'json',
            root: 'resultObject.result',
            totalProperty: 'resultObject.totalCount'
    },
    listeners:{
		exception:function(reader, response, error, eOpts){
			ajaxException(reader, response, error, eOpts );
		}
	}
    }),
    listeners : {
    	beforeload : function(store,operation, eOpts ){
    		//遮罩层
    		v_mask = new Ext.LoadMask(Ext.getBody(), {
    			msg : i18n._('please wait')	
    		});
    		v_mask.show();
    	},
    	load : function(store, records, successful, eOpts ){
    		v_mask.hide();
    		if(store.getCount()>0){
    			resetCheckGridHead();
    			var rangeId=store.getAt(0).get('ipRangeId');
    	        proxy.setExtraParam('rangeId', rangeId);    	        
    		}
    		IPDetailStore.loadPage(1,null);
    	}
    },
    sorters: ["id"]
});
var ipDetailIds='';
var usedArray=[];
var assignedArray=[];
var enabledArray=[];
var disabledArray=[];
var sm = Ext.create('Ext.selection.CheckboxModel',{
	showHeaderCheckbox:true,
	checkOnly:true,
    listeners:{
        select: function(e, record, index, eOpts ){
                var selected=this.getSelection();
                var id=index;
                ipDetailIds = ''; 
                /*if(record.get('status')==0){//未使用
                    Ext.Array.push(enabledArray,id);
                }                                    
                if(record.get('status')==2){//已分配
                	Ext.Array.push(assignedArray,id);
                }
                if(record.get('status')==3){//已禁用
                	Ext.Array.push(disabledArray,id);
                }     */ 
                if(record.get('status') != 3){//启用
                    Ext.Array.push(enabledArray,id);
                }                                    
                if(record.get('status') != 0){//禁用
                	Ext.Array.push(disabledArray,id);
                }
            },
        deselect:function(e, record, index, eOpts){
        	var selected=this.getSelection();
        	var id=index;
        	if(selected<=0){
        		ipDetailIds='';
        	}
        	/*if(record.get('status')==0){//未使用
        		Ext.Array.remove(enabledArray,id);
            }                                    
            if(record.get('status')==2){//已分配
            	Ext.Array.remove(assignedArray,id);
            }
            if(record.get('status')==3){//已禁用
            	Ext.Array.remove(disabledArray,id);
            }*/
            if(record.get('status') != 3){//启用
                Ext.Array.remove(enabledArray,id);
            }                                    
            if(record.get('status') != 0){//禁用
            	Ext.Array.remove(disabledArray,id);
            }
        }
    }
});
//define model
var IPDetailModel=Ext.define('IPDetailModel', {
    extend: 'Ext.data.Model',
    fields: ['id', 'ip', 'nodeName','vmName','userName','totalIPs',
        'freeIPs','releasingIPs','assigningIPs','assignedIPs','disabledIPs',
        'status','email','remark'
    ],                  
    idProperty: 'id'
});
var IPDetailStore= Ext.create('Ext.data.Store', {
    model: 'IPDetailModel',
    remoteSort: true,
    autoLoad:false,
    //pageSize:pageSize,
    proxy: new Ext.data.proxy.Ajax({
    url: path+'/../../ip/findAllIPDetail!findAllIPDetail.action',
    reader: {
            type: 'json',
            root: 'resultObject.result',
            totalProperty: 'resultObject.totalCount'
    },
    listeners:{
		exception:function(reader, response, error, eOpts){
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
    		if(store.getAt(0) != null) {
    	    	totalIPs=store.getAt(0).get('totalIPs');
    	        freeIPs=store.getAt(0).get('freeIPs');
    	        releasingIPs=store.getAt(0).get('releasingIPs');
    	        assigningIPs=store.getAt(0).get('assigningIPs');
    	        assignedIPs=store.getAt(0).get('assignedIPs');
    	        disabledIPs=store.getAt(0).get('disabledIPs');
    	        
    	        freeLabel.setText(i18n._('free') + "：" + freeIPs);
    	        releasingLabel.setText(i18n._('releasing') + "：" + releasingIPs);
    	        assigningLabel.setText(i18n._('assigning') + "：" + assigningIPs);
    	        assignedLabel.setText(i18n._('Assigned') + "：" + assignedIPs);
    	        disabledLabel.setText(i18n._('Disable') + "：" + disabledIPs);
    	        totalLabel.setText(i18n._('total') + "：" + totalIPs);
    	    } else {
    	    	freeLabel.setText(i18n._('free') + "：" + 0);
    	        releasingLabel.setText(i18n._('releasing') + "：" + 0);
    	        assigningLabel.setText(i18n._('assigning') + "：" + 0);
    	        assignedLabel.setText(i18n._('Assigned') + "：" + 0);
    	        disabledLabel.setText(i18n._('Disable') + "：" + 0);
    	        totalLabel.setText(i18n._('total') + "：" + 0);
    	    }
    	}
    },
    sorters: ["id"]
});
var pluginExpanded = true;              
var proxy=IPDetailStore.getProxy();
var IPRangeGrid = Ext.create('Ext.grid.Panel', {
store: IPRangeStore,
stateful: true,
forceFit: true,
bbar: Ext.create('Ext.toolbar.Paging', {
    store: IPRangeStore,
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
                         text: '<font id="addId" color="#ffffff" >' + i18n._('addNetwork') + '</font>',                                       
                         icon: 'images/addIPRange.png',
                         listeners: {
                             "click" : function(){
                            	 	getSessionUser();
                                    IPRangeWinForm.setTitle(i18n._('addNetwork'));
                                    dId==0;
                                    IPRangeWinForm.show();
                                 },
                             "mouseout" : function() {
                                 document.getElementById("addId").style.color = "#ffffff";
                             },
                             "mouseover" : function() {
                                 document.getElementById("addId").style.color = "#000000";
                             }
                         }
                             
                    },                                  
                    {
                         xtype:'button',
                         text: '<font id="deleteBid" color="#ffffff";>' + i18n._('deleteNetwork') + '</font>',                                        
                         icon: 'images/deleteIPRange.png',
                         listeners: {
                            
                             "mouseout" : function() {
                                 document.getElementById("deleteBid").style.color = "#ffffff";
                             },
                             "mouseover" : function() {
                                 document.getElementById("deleteBid").style.color = "#000000";
                             },
                             "click" : function() {
                            	 getSessionUser();
                                 var row = IPRangeGrid.getSelectionModel().getSelection();
                                 if (row.length == 0) {  
                                     Ext.MessageBox.show({                                                         
                                           title:i18n._('notice'),
                                           msg:i18n._('selectOne'),
                                           icon:Ext.MessageBox.WARNING,
                                           buttons: Ext.MessageBox.OK                                                          
                                       });  
                                    } else {
                                        var record = IPRangeGrid.getStore().getAt(row[0].index);
                                        dId=row[0].get('id');//record.get('id');
                                        var ipRangeId = row[0].get('ipRangeId');
                                        var usedStatus=row[0].get('usedIPs');
                                        var assignedStatus=row[0].get('assignedIPs');
                                        if(usedStatus>0){
                                            Ext.MessageBox.show({                                                          
                                                   title:i18n._('notice'),
                                                   msg:i18n._('InvalidDelete')+i18n._('IPInUsed'),
                                                   icon:Ext.MessageBox.WARNING,
                                                   buttons: Ext.MessageBox.OK                                                          
                                               });
                                            return;
                                        }
                                        if(assignedStatus>0){
                                            Ext.MessageBox.show({                                                          
                                                   title:i18n._('notice'),
                                                   msg:i18n._('InvalidDelete')+i18n._('IPInAssigned'),
                                                   icon:Ext.MessageBox.WARNING,
                                                   buttons: Ext.MessageBox.OK                                                          
                                               });
                                            return;
                                        }
                                        Ext.MessageBox.confirm(i18n._('confirm'),i18n._('Are you sure to delete'),function(btn){
                                            if(btn=='yes'){
                                            	v_mask = new Ext.LoadMask(Ext.getBody(), {
                                        			msg : i18n._('please wait')
                                        			//removeMask : true			
                                        		});
                                        		v_mask.show();
                                                var del=Ext.Ajax.request({
                                                    url:path+'/../../ip/network!deleteNetwork.action',
                                                    timeout:60000,
                                                    method:'POST',
                                                    params:{
                                                    	'netWorkBean.id':dId,
                                                    	'netWorkBean.ipRangeId':ipRangeId                                                                                                                                           
                                                    },
                                                    success:function(form,action){
                                                    	v_mask.hide();
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
                                                               icon: Ext.MessageBox.WARNING
                                                            });
                                                            return;
                                                        }
                                                        dId==0;
                                                        Ext.MessageBox.show({
                                                            title: i18n._('notice'),
                                                            msg: i18n._('delete')+i18n._('Successful'),
                                                            buttons: Ext.MessageBox.OK,
                                                            icon: Ext.MessageBox.INFO,
                                                            fn:reLoadIPRangeData
                                                        });                                                              
                                                    },   
                                                    failure:function(form,action){
                                                    	v_mask.hide();
                                                        Ext.MessageBox.show({
                                                               title: i18n._('errorNotice'),
                                                               msg: i18n._('operateFail'),
                                                              buttons: Ext.MessageBox.OK,
                                                               icon: Ext.MessageBox.ERROR
                                                            });  
                                                    }
                                                 });
                                            }
                                        });
                                    }
                             }
                         }
                    },
                    {
                    	xtype:'button',
                    	text:'<font id="detailId" color="white">'+i18n._('Details')+'</font>',
                    	listeners: {
                    		"mouseout" : function() {
                    			document.getElementById("detailId").style.color = "white";
                    		},
                    		"mouseover" : function() {
                    			document.getElementById("detailId").style.color = "black";
                    		}
                    	},
                    	tooltip:i18n._('Details'),
                    	shadow:false,
                    	icon:'../../../images/detail.png',
                    	handler:function(){
                    		var row = IPRangeGrid.getSelectionModel().getSelection();
                    		if (row.length == 0) {  
                                Ext.MessageBox.show({                                                         
                                    title:i18n._('notice'),
                                    msg:i18n._('selectOne'),
                                    icon:Ext.MessageBox.WARNING,
                                    buttons: Ext.MessageBox.OK                                                          
                                });
                                return;
                            }
                    		var record = row[0];
                    		zoneGroupStore.each(function(data) {
                        	    if(record.get('zoneGroup') == data.get('id')) {
                        	    	zoneGroupDetailField.setValue(data.get('name'));
                        	    	return;
                        	    }
                        	});
                            networkIdDetailField.setValue(record.get('networkId'));
                    		cidrDetailField.setValue(record.get('cidr'));
                    		gatewayDetailField.setValue(record.get('gateway'));
                    		dns1DetailField.setValue(record.get('dns1'));
                	        networkDetailWin.show();
                    	}
                    }
                ]
              }],
columnLines:true,
bodyBorder:false,
columns: [Ext.create('Ext.grid.RowNumberer',{header:'',dataIndex:'item'}),//,align:'left'
    {
        id: 'rangeid',
        text     : i18n._('ipRangeId'),
        sortable : false,
        dataIndex: 'id',
        field:'textfield',
        hidden:true
    },
    {                       
        text     : i18n._('uuid'),
        sortable : false,
        dataIndex: 'networkId'
    },
    {                       
        text     : i18n._('cidr'),
        sortable : false,
        dataIndex: 'cidr'
    },
    {
        text     : i18n._('gateWay'),
        sortable : false,                       
        dataIndex: 'gateway'
    },
    {                       
        text     : i18n._('zoneGroup'),
        sortable : false,
        dataIndex: 'zoneGroup',
        renderer:function(value){
        	zoneGroupStore.each(function(record) {
        	    if(value == record.get('id')) {
        	    	value = record.get('name');
        	    	return;
        	    }
        	});
        	return value;
        }
    },
    {                       
        text     : i18n._('dns1'),
        sortable : false,
        dataIndex: 'dns1'
    },
    {
        text     : i18n._('usage'),
        sortable : false,                       
        dataIndex: 'status',
        renderer:renderDescn
    }
],
listeners:{                 
    click :{ 
        element: 'body',
        fn:function(){
        	resetCheckGridHead();
            var row = IPRangeGrid.getSelectionModel().getSelection();
            if(row!=null && row!=''){
            	var recordId=row[0].get('ipRangeId');
                proxy.setExtraParam('rangeId', recordId);
                IPDetailStore.loadPage(1,null); 
            }
        }
    }
}
});                
var totalIPs=0,freeIPs=0,usedIPs=0,assignedIPs=0,disabledIPs=0,assigningIPs=0,releasingIPs=0;
var freeLabel=Ext.create('Ext.form.Label',{//Ext.form.Label
    text:i18n._('free') + "：" + freeIPs,
    allowDepress:true
});
var freeImag = Ext.create('Ext.form.Label',{//Ext.form.Label
    allowDepress:false,
    autoEl: {
        tag: 'img',
        src: 'images/free.png'
    }
});
var releasingLabel=Ext.create('Ext.form.Label',{//Ext.form.Label
    text:i18n._('releasing') + "：" + releasingIPs,
    allowDepress:true
});
var releasingImag = Ext.create('Ext.form.Label',{//Ext.form.Label
    allowDepress:false,
    autoEl: {
        tag: 'img',
        src: 'images/releasing.png'
    }
});
var assigningLabel=Ext.create('Ext.form.Label',{//Ext.form.Label
    text:i18n._('assigning') + "：" + assignedIPs,
    allowDepress:true
});
var assigningImag = Ext.create('Ext.form.Label',{//Ext.form.Label
    allowDepress:false,
    autoEl: {
        tag: 'img',
        src: 'images/assigning.png'
    }
});
var assignedLabel=Ext.create('Ext.form.Label',{//Ext.form.Label
    text:i18n._('Assigned') + "：" + assignedIPs,
    allowDepress:false
});
var assignedImag = Ext.create('Ext.form.Label',{//Ext.form.Label
    allowDepress:false,
    autoEl: {
        tag: 'img',
        src: 'images/used.png'
    }
});
var disabledLabel=Ext.create('Ext.form.Label',{//Ext.form.Label
    text:i18n._('Disable') + "：" + disabledIPs,
    allowDepress:false,
    disabled:true,
    icon:'images/disabled.png'/*,
    autoEl: {
        tag: 'img',
        src: '../resource/images/3.png'
    }*/
});
var disabledImag = Ext.create('Ext.form.Label',{//Ext.form.Label
    allowDepress:false,
    autoEl: {
        tag: 'img',
        src: 'images/disabled.png'
    }
});
var totalLabel=Ext.create('Ext.form.Label',{//Ext.form.Label
    text:i18n._('total') + "：" + totalIPs,
    allowDepress:false,
    disabled:true
});

var itemValue='ip';
var IPDetailGrid = Ext.create('Ext.grid.Panel', {
    store: IPDetailStore,
    selModel: sm,
    stateful: true,
    forceFit: true,
    stateId: 'stateGrid',
    viewConfig: {
           stripeRows: true                         
        },                  
    columnLines:true,                   
    dockedItems: [
             {
                xtype: 'toolbar',
                cls: 'toolbarCSS',
                items: [                                    
                    /*{
                         xtype:'button',
                         text: '<font color="#ffffff" id="enableId">' + i18n._('Enable') + '</font>',                                    
                         icon: 'images/enableButton.png',
                         listeners: {
                             "mouseout" : function() {
                                 document.getElementById("enableId").style.color = "#ffffff";
                             },
                             "mouseover" : function() {
                                 document.getElementById("enableId").style.color = "#000000";
                             },
                             "click" : function() {
                            	 getSessionUser();
                            	 var selected=sm.getSelection();
                            	 ipDetailIds=''
                            	 for(i in selected){                                            		 
                            		 ipDetailIds = ipDetailIds + selected[i].get('id')+',';
                            	 }
                            	 ipDetailIds = ipDetailIds.substring(0,ipDetailIds.lastIndexOf(','));
                             if(ipDetailIds==''){
                                 Ext.MessageBox.show({
                                       title: i18n._('errorNotice'),
                                       msg: i18n._('please select at least one line'),
                                      buttons: Ext.MessageBox.OK,
                                       icon: Ext.MessageBox.WARNING
                                    });
                                 return;
                             }
                             if(enabledArray.length>0){
                                 Ext.MessageBox.show({
                                       title: i18n._('errorNotice'),
                                       msg: i18n._('onlyDisabledIpCanEnable'),
                                       buttons: Ext.MessageBox.OK,
                                       icon: Ext.MessageBox.WARNING
                                    });
                                 return;
                             } 
                           //遮罩层
     						v_mask = new Ext.LoadMask(Ext
     								.getBody(), {
     							msg : i18n._('please wait'),
     							removeMask : true			
     						});
     						v_mask.show();
                             var update=Ext.Ajax.request({
                                    url:path+'/../../ip/updateIPStatus!updateIPStatus.action',
                                    timeout:60000,
                                    method:'POST',
                                    params:{
                                        'detailIds':ipDetailIds,
                                        'status':0                                                                                  
                                    },
                                    success:function(form,action){
                                    	v_mask.hide();
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
                                        if(obj.success==true){
                                        	Ext.MessageBox.show({
                                                title: i18n._('notice'),
												msg: i18n._('modify')+i18n._('Successful'),
												buttons: Ext.MessageBox.OK,
                                                icon: Ext.MessageBox.INFO,
                                                fn:reLoadIPDetailData
                                             });
                                        }
                                    },   
                                    failure:function(form,action){
                                    	v_mask.hide();
                                        Ext.MessageBox.show({
                                               title: i18n._('errorNotice'),
                                               msg: i18n._('operateFail'),
                                              buttons: Ext.MessageBox.OK,
                                               icon: Ext.MessageBox.ERROR
                                            });  
                                    }
                                 });
                             }
                         }
                    },                                  
                    {
                         xtype:'button',
                         text: '<font color="#ffffff" id="DisableId">' + i18n._('Disable') + '</font>',                                          
                         icon: 'images/disableButton.png',
                         listeners: {
                             
                             "mouseout" : function() {
                                 document.getElementById("DisableId").style.color = "#ffffff";
                             },
                             "mouseover" : function() {
                                 document.getElementById("DisableId").style.color = "#000000";
                             },
                             "click" : function() {
                            	 getSessionUser();
                            	 var selected=sm.getSelection();
                            	 ipDetailIds=''
                            	 for(i in selected){                                            		 
                            		 ipDetailIds = ipDetailIds + selected[i].get('id')+',';
                            	 }
                            	 ipDetailIds = ipDetailIds.substring(0,ipDetailIds.lastIndexOf(','));
                             if(ipDetailIds==''){
                                 Ext.MessageBox.show({
                                       title: i18n._('errorNotice'),
                                       msg: i18n._('please select at least one line'),
                                       buttons: Ext.MessageBox.OK,
                                       icon: Ext.MessageBox.WARNING
                                    });
                                 return;
                             }
                             if(disabledArray.length>0){
                                 Ext.MessageBox.show({
                                       title: i18n._('errorNotice'),
                                       msg: i18n._('onlyUnusedIpCanDisable'),
                                       buttons: Ext.MessageBox.OK,
                                       icon: Ext.MessageBox.WARNING
                                    });
                                 return;
                             }
                             Ext.MessageBox.prompt(i18n._('notice'), i18n._('Please enter your remark'), function(buttonId,text) {
								if (buttonId == 'ok') {
									//遮罩层
									var v_mask = new Ext.LoadMask(Ext
											.getBody(), {
										msg : i18n._('please wait'),
										removeMask : true			
									});
									v_mask.show();
									var update=Ext.Ajax.request({
	                                    url:path+'/../../ip/updateIPStatus!updateIPStatus.action',
	                                    timeout:60000,
	                                    method:'POST',
	                                    params:{
	                                        'detailIds':ipDetailIds,
	                                        'status':3 ,
	                                        'remark':text
	                                    },
	                                    success:function(form,action){
	                                    	v_mask.hide();
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
	                                        if(obj.success==true){
	                                        	Ext.MessageBox.show({
	                                                title: i18n._('notice'),
													msg: i18n._('modify')+i18n._('Successful'),
													buttons: Ext.MessageBox.OK,
	                                                icon: Ext.MessageBox.INFO,
	                                                fn:reLoadIPDetailData
	                                             });
	                                        }                                                        
	                                    },   
	                                    failure:function(form,action){ 
	                                    	v_mask.hide();
	                                        Ext.MessageBox.show({
	                                               title: i18n._('errorNotice'),
	                                               msg: i18n._('operateFail'),
	                                              buttons: Ext.MessageBox.OK,
	                                               icon: Ext.MessageBox.ERROR
	                                            });  
	                                    }
	                                 });												
								}
							});                           
                             }
                         }
                    },*/
                    {
                        xtype:'tbfill'
                    },
                    {
                        xtype:'splitbutton',
                        text:'<font color="#ffffff" id="DisableId">' + i18n._('IP') + '</font>',
                        id:'split',
                        menu: new Ext.menu.Menu({
                            items: [
                                {
                                    text: i18n._('IP'),
                                    handler: function(){
                                        Ext.getCmp('split').setText('<font color="#ffffff" id="DisableId">' + i18n._('IP') + '</font>');
                                        Ext.getCmp('orderNoField').emptyText = ' ';
                                        Ext.getCmp('orderNoField').setValue(""); 
                                        itemValue='ip';
                                    }
                                },
                                {
                                    text: i18n._('node name'),
                                    handler: function(){
                                        Ext.getCmp('split').setText('<font color="#ffffff" id="DisableId">' + i18n._('node name') + '</font>');
                                        Ext.getCmp('orderNoField').emptyText = ' ';
                                        Ext.getCmp('orderNoField').setValue(""); 
                                        itemValue='nodeName';
                                    }
                                },
                                {
                                    text: i18n._('routor_name'),
                                    handler: function(){
                                        Ext.getCmp('split').setText('<font color="#ffffff" id="DisableId">' + i18n._('vm_name') + '</font>');
                                        Ext.getCmp('orderNoField').emptyText = ' ';
                                        Ext.getCmp('orderNoField').setValue(""); 
                                        itemValue='vmName';
                                    }
                                },
                                {
                                    text: i18n._('username'),
                                    handler: function(){
                                        Ext.getCmp('split').setText('<font color="#ffffff" id="DisableId">' + i18n._('username') + '</font>');
                                        Ext.getCmp('orderNoField').emptyText = ' ';
                                        Ext.getCmp('orderNoField').setValue(""); 
                                        itemValue='userName';
                                    }
                                },
                                {
                                    text: i18n._('userEmail'),
                                    handler: function(){
                                        Ext.getCmp('split').setText('<font color="#ffffff" id="DisableId">' + i18n._('userEmail') + '</font>');
                                        Ext.getCmp('orderNoField').emptyText = ' ';
                                        Ext.getCmp('orderNoField').setValue(""); 
                                        itemValue='userEmail';
                                    }
                                }
                             ]
                        })
                    }, 
                    {
                        labelWidth:40,
                        xtype: 'searchfield',
                        store: IPDetailStore,
                        width: 210,
                        id:'orderNoField',
                        emptyText:i18n._('IP') + '/' + i18n._('node name') + '/' + i18n._('routor_name') + '/' + i18n._('username')+ '/' + i18n._('userEmail'),
                        onTrigger1Click : function(){
                        	var me = this;
                            var store = me.store;
                            var proxy = store.getProxy();
                            var val;                                            
                            if (me.hasSearch) {
                                me.setValue('');    
                                proxy.setExtraParam('ip', null);
                                proxy.setExtraParam('nodeName', null);
                                proxy.setExtraParam('vmName', null);
                                proxy.setExtraParam('userName', null);  
                                proxy.setExtraParam('userEmail', null);
                                proxy.extraParams.start = 0;
                                //store.load();
                                store.loadPage(1,null);
                                me.hasSearch = false;
                                me.triggerEl.item(0).setDisplayed('none');
                                me.doComponentLayout();
                            }
                        },
                        onTrigger2Click : function(){//点击查询按钮或回车调用该方法  
                        	var me = this;                                                                                                                                  
                            var store = me.store;                                           
                            var proxy = store.getProxy();                                           
                            store.proxy=proxy;
                            var value = me.getValue();                                          
                            if (value.length < 1) {
                                me.onTrigger1Click();
                                return;
                            }                                           
                            if(itemValue=='ip'){
                                if(reg_verify(value)==false){
                                    Ext.MessageBox.show({
                                           title: i18n._('errorNotice'),
                                           msg: i18n._('InvalidIP'),
                                          buttons: Ext.MessageBox.OK,
                                           icon: Ext.MessageBox.WARNING
                                        });
                                    return;
                                }
                                proxy.setExtraParam('nodeName', null);
                                proxy.setExtraParam('vmName', null);
                                proxy.setExtraParam('userName', null);
                                proxy.setExtraParam('userEmail', null);
                            }
                            if(itemValue=='nodeName'){
                                proxy.setExtraParam('ip', null);
                                proxy.setExtraParam('vmName', null);
                                proxy.setExtraParam('userName', null);
                                proxy.setExtraParam('userEmail', null);
                            }
                            if(itemValue=='vmName'){
                                proxy.setExtraParam('ip', null);
                                proxy.setExtraParam('nodeName', null);
                                proxy.setExtraParam('userName', null);
                                proxy.setExtraParam('userEmail', null);
                            }
                            if(itemValue=='userName'){
                                proxy.setExtraParam('ip', null);
                                proxy.setExtraParam('nodeName', null);
                                proxy.setExtraParam('vmName', null);
                                proxy.setExtraParam('userEmail', null);
                            }
                            if(itemValue=='userEmail'){
                                proxy.setExtraParam('ip', null);
                                proxy.setExtraParam('nodeName', null);
                                proxy.setExtraParam('vmName', null);
                                proxy.setExtraParam('userName', null);
                            }
                            if(itemValue=='ip'){
                                proxy.setExtraParam(itemValue,getIntegerIP(value));
                            }else{
                                proxy.setExtraParam(itemValue,value);
                            }
                            proxy.extraParams.start = 0;                                            
                            store.loadPage(1,null);
                            this.hasSearch = true;                                          
                            me.triggerEl.item(0).setDisplayed('block');
                            me.doComponentLayout();
                        }
                    }
                ]
            }, 
             {
                xtype: 'toolbar',
                padding:'0 10 0 10',
                items: [ 
                     freeImag,freeLabel,{xtype:'tbfill'},
                     releasingImag,releasingLabel,{xtype:'tbfill'},
                     assigningImag,assigningLabel,{xtype:'tbfill'},
                     assignedImag,assignedLabel,{xtype:'tbfill'},
                     disabledImag,disabledLabel,{xtype:'tbfill'},
                     totalLabel,{xtype:'tbfill'}
                ]
            }
    ],
    columns: [
        {
            id: 'detailid',
            text     : i18n._('记录ID'),
            //flex     : 1,
            sortable : false,
            dataIndex: 'id',
            field:'textfield',
            hidden:true
            
        },
        {
            text     : i18n._('IP'),
            //flex     : 1,
            sortable : false,
            dataIndex: 'ip',
            field:'textfield',
            renderer:function(value){
                return getStringIP(value);
            }
        },
        {
            text     : i18n._('node name'),
            //flex     : 1,
            sortable : false,
            dataIndex: 'nodeName',
            field:'textfield'
        },
        {
            text     : i18n._('routor_name'),
            //flex     : 1,
            sortable : false,
            dataIndex: 'vmName',
            field:'textfield'
        },
        {
            text     : i18n._('username'),
            //flex     : 1,
            sortable : false,
            dataIndex: 'userName',
            field:'textfield'
        },
        {
            text     : i18n._('userEmail'),
            //flex     : 1,
            sortable : false,
            dataIndex: 'email',
            field:'textfield'
        },
        {
            text     : i18n._('status'),
            //flex     : 1,
            sortable : false,                       
            dataIndex: 'status',
            field:'textfield',
            renderer:function(value){
                if(value == '0') {
                    return "<img src='images/free.png'/>";
                } else if(value == '1') {
                    return "<img src='images/assigning.png'/>";
                } else if(value == '2') {
                    return "<img src='images/used.png'/>";
                } else if(value == '3') {
                    return "<img src='images/disabled.png'/>";
                } else {
                	return "<img src='images/releasing.png'/>";
                }
            }
            
        }
    ],
    listeners:{
		itemdblclick :function(ipDetailGrid,record, item, index, e, eOpts){	
			IPDetailField.setValue(getStringIP(record.get('ip')));
	        nodeNameDetailField.setValue(record.get('nodeName'));
	        vmNameDetailField.setValue(record.get('vmName'));
	        userNameDetailField.setValue(record.get('userName'));
	        userEmailDetailField.setValue(record.get('email'));	
	        remarkDetailField.setValue(record.get('remark'));	
			IPDetailWinForm.show();						
		}
    }
}); 
function reLoadIPRangeData(btn){
	IPRangeStore.loadPage(1,null);                
};
function reLoadIPDetailData(btn){                	
	usedArray=[];
    assignedArray=[];
    enabledArray=[];
    disabledArray=[];    
	IPDetailStore.load();
	resetCheckGridHead();
}; 
function reg_verify(addr){//验证ip地址的合法性 第三种方法
  var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/;
  if(addr.match(reg)){
     return true;
  }else{
    return false;
  }
};
function getStringIP(iIP){
    var ip = "";  
    var temp = 0; 
    for (var i = 3; i >= 0; i--) {  
        temp = iIP/Math.pow(256, i) % 256; 
        temp=parseInt(temp);
        if (i == 3) {           
            ip = ip + temp;         
        } else {  
            ip = ip + "." + temp;           
        }  
    }   
    return ip;
};
function trim(s){
    var l=0; var r=s.length -1;
    while(l < s.length && s[l] == ' ')
    {   l++; }
    while(r > l && s[r] == ' ')
    {   r-=1;   }
    return s.substring(l, r+1);
};
function getIntegerIP(sIP){
    var ip10 = 0;
    var ss=trim(sIP).split(".");  
    for (var i = 0; i < 4; i++) {  
        ip10 += Math.pow(256, 3 - i) *parseInt(ss[i]);  
    }  
    return ip10;
};
function renderDescn(value, cellmeta, record, rowIndex, columnIndex, store) {   
	var totalIPs = store.getAt(rowIndex).get('totalIPs');
	var freeIPs = store.getAt(rowIndex).get('freeIPs');
	var status = (totalIPs - freeIPs) / totalIPs;
    var val = Ext.util.Format.round(status*100,2);
    return "<div style='color:#8DB2E3; background-color:#ffffff;border: 1px #8DB2E3 solid;'><div style='height:12px;width:"
    + val
    + "%;background-color:#8DB2E3;border: 0px;color: black;'>"
    + val + "%</div></div>";
};
function setSelectValue(model,selIds){
        var selected=model.getSelection();
        ipDetailIds = '';       
        for(i in selected){         
            ipDetailIds = ipDetailIds + selected[i].get('id')+',';
        }       
        ipDetailIds = ipDetailIds.substring(0,ipDetailIds.lastIndexOf(','));        
        selIds.setValue(ipDetailIds);       
};
function getCookie(name){
         var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
         if(arr != null) return unescape(arr[2]);
         return null;
};
function resetCheckGridHead(){  
	sm.deselectAll(); 
};