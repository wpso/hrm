/**
 * zoneList
 */
var params = getCookie("lang");
i18n.set({
	lang : params,
	path : '../../../resources'
});
Ext.Loader.setConfig({
	enabled : true
});
var formTitle='';
var v_mask = null;
var dId = 0;
var zoneDefault=0;
var zoneNameField=Ext.create('Ext.form.field.Text',{
    name: 'zoneName',
    fieldLabel: i18n._('zoneName'),//区域名称
    allowBlank:false,
    regex:/^[\w-@#$%^&*\u4e00-\u9fa5]+$/,
	regexText:i18n._('InvalidCharacters'),
	enforceMaxLength:true,
    maxLength:20,
    width:220,
    emptyText:i18n._('zoneName')
});
var zoneCodeField=Ext.create('Ext.form.field.Text',{
    name: 'zoneCode',
    fieldLabel: i18n._('zoneCode'),//简称
    enforceMaxLength:true,
    allowBlank:false,
    regex:/^[A-Za-z0-9]+$/,
	regexText:i18n._('InvalidCharacters'),
    maxLength:8,
    width:220,
    emptyText:i18n._('zoneCode')
});
//是否支持按需购买单选框
var isCustomCheckRadioGroup = Ext.create('Ext.form.RadioGroup', {
	fieldLabel : i18n._('customizable'),//按需购买
	labelWidth : 60,
	width : 230,
	columns : 2,
	vertical : true,
	items : [ {		
		boxLabel : i18n._('nonsupport'),//不支持
		width : 80,
		name : 'rb',
		inputValue : '0',		
		checked : true
	}, {		
		boxLabel : i18n._('support'),//支持
		//width : 8,
		name : 'rb',
		inputValue : '1'		
	}	
	],
	listeners:{
		change:function(newValue, oldValue, eOpts){			
//			alert('newValue:'+isCustomCheckRadioGroup.getChecked()[0].getSubmitValue());				
		}
	}
});
//是否支持分布式存储
var storageTypeCheckRadioGroup = Ext.create('Ext.form.RadioGroup',{
	fieldLabel:i18n._('storageType'),//本地存储
	labelWidth : 60,
	width : 250,
	columns : 2,
	vertical : true,
	items:[{
		boxLabel : i18n._('localStorage'),//本地存储
		width : 80,
		name : 'st',
		inputValue : '0',		
		checked : true
	},{		
		boxLabel : i18n._('distributedStorage'),//分布式存储
		//width : 8,
		name : 'st',
		inputValue : '1'		
	},{		
		boxLabel : i18n._('shareStorage'),//共享式存储
		//width : 8,
		name : 'st',
		inputValue : '2'		
	}
	],
	listeners:{
		change:function(storageTypeCheckRadioGroup, newValue, oldValue, eOpts){			
//			alert('newValue:'+isCustomCheckRadioGroup.getChecked()[0].getSubmitValue());				
		}
	}
});

var virtualNameField=Ext.create('Ext.form.field.Text',{
    name: 'virtualName',
    fieldLabel: i18n._('virstulTech'),//虚拟化技术
    allowBlank:false,
	enforceMaxLength:true,
    maxLength:20,
    width:220,
    emptyText:i18n._('virstulTech')
});

var virtualVersionField=Ext.create('Ext.form.field.Text',{
    name: 'virtualVersion',
    fieldLabel: i18n._('techVersion'),//虚拟化版本号
    allowBlank:false,
	enforceMaxLength:true,
    maxLength:20,
    width:220,
    emptyText:i18n._('techVersion')
});

var descriptionField=Ext.create('Ext.form.field.TextArea',{
	name: 'descriptionField',
	maxLength:50,
	enforceMaxLength:true,
	fieldLabel: i18n._('zoneDescription'),
	//regex:/^[\S]+$/,//禁止输入空白字符
	//regexText:i18n._('InvalidCharacters'),
	allowBlank:false,
	emptyText:i18n._('DescriptionLengthTip')
});

//var virtualTechnologyStore = Ext.create("Ext.data.Store",{
//	fields:['id','name','discription','is_enable'],
//	proxy:Ext.data.proxy.Ajax({
//		url : path+'/../sc/virtualTechnology!listServiceItem.action?is_enable=1',
//		reader: {
//            type: 'json',
//			root:'resultObject',
//			totalProperty: 'resultObject.totalCount'
//        },
//        listeners:{
//			exception:function(reader, response, error, eOpts){
//				ajaxException(reader, response, error, eOpts );
//			}
//		}
//	}),
//	listeners : {
//		load : function(virtualTechnologyStore, records, successful, eOpts ){
//			if(successful && virtualTechnologyStore.getCount()>0){
//				vmCreateCPUComb.setValue(virtualTechnologyStore.getAt(0).get('id'));
//			}
//		}
//	}
//});

//var virtualTechnologyComb = Ext.create("Ext.data.Store",{
//	fieldLabel : i18n._('virstulTech'),//
//	width : 360,
//	listConfig:{maxHeight:200},
//	labelWidth : 80,
//	editable : false,
//	allowBlank:false,
//	store : virtualTechnologyStore,
//	//queryMode : 'local',
//	displayField : 'name',
//	valueField : 'id'
//});


//Form表单提交
var formPanel = Ext.create('Ext.form.Panel', {
    frame: true, 
    //title: 'Form Fields',
    width: 250,                     
    bodyPadding: 5,
    buttonAlign: 'center',
    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 60,
        anchor: '100%'
    },
    items: [                            
        zoneNameField,//zoneIsDefault,
        zoneCodeField,
//        isCustomCheckRadioGroup,
        storageTypeCheckRadioGroup,
        virtualNameField,
        virtualVersionField,
        descriptionField                                                        
    ],
    buttons: [{
        text: i18n._('OK'),
        handler:function(){
        	if (zoneNameField.getValue() == null ||zoneNameField.getValue()=='') {
				Ext.MessageBox.show({
					title : i18n._('notice'),
					msg : i18n._('Please input the zone name'),//请输入区域名称
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.WARNING
				});// INFO,QUESTION,WARNING,ERROR
				zoneNameField.focus();
				return;
			}
        	if (zoneCodeField.getValue() == null ||zoneCodeField.getValue()=='') {
				Ext.MessageBox.show({
					title : i18n._('notice'),
					msg : i18n._('Please input the zone code'),//请输入区域编码
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.WARNING
				});// INFO,QUESTION,WARNING,ERROR
				zoneCodeField.focus();
				return;
			}
        	if(virtualNameField.getValue() == null ||virtualNameField.getValue()==''){
        		Ext.MessageBox.show({
        			title : i18n._('notice'),
        			msg:i18n._('Please input the virstulTech'),//请输入虚拟化技术名称
        			buttons : Ext.MessageBox.OK,
        			icon : Ext.MessageBox.WARNING
        		});
        		virtualNameField.focus();
        		return;
        	}
        	if(virtualVersionField.getValue() == null ||virtualVersionField.getValue()==''){
        		Ext.MessageBox.show({
        			title : i18n._('notice'),
        			msg:i18n._('Please input the virstul Version'),//请输入虚拟化版本号
        			buttons : Ext.MessageBox.OK,
        			icon : Ext.MessageBox.WARNING
        		});
        		virtualVersionField.focus();
        		return;
        	}
        	if (descriptionField.getValue() == null ||descriptionField.getValue()=='') {
				Ext.MessageBox.show({
					title : i18n._('notice'),
					msg : i18n._('Please input the zone description'),//请输入区域描述
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.WARNING
				});// INFO,QUESTION,WARNING,ERROR
				descriptionField.focus();
				return;
			}
            //提交后台之前先做有效性验证
            if(!formPanel.getForm().isValid()){
                Ext.MessageBox.show({
                       title: i18n._('notice'),
                       msg: i18n._('Please input the correct value'),
                      buttons: Ext.MessageBox.OK,
                       icon: Ext.MessageBox.ERROR
                    });//INFO,QUESTION,WARNING,ERROR                                    
                return;
            }
            var zoneName=zoneNameField.getValue();
            /*var zoneDefault=0;
            if(zoneIsDefault.getValue()){
            	zoneDefault=1;
            }*/
            var zoneCode=zoneCodeField.getValue();
//            var isCustom=isCustomCheckRadioGroup.getChecked()[0].getSubmitValue();
            var diskStorageType=storageTypeCheckRadioGroup.getChecked()[0].getSubmitValue();
            var virtualTech = virtualNameField.getValue();
            var virtualVersion = virtualVersionField.getValue();
            var description=descriptionField.getValue();
            formPanel.getForm().reset();
            zoneWinForm.hide();
//            this.setDisabled(true);
                if(dId==0){   
                    v_mask.show();
                    var create=Ext.Ajax.request({
                        url:path+'/../../sc/zone!createZone.action',
                        method:'POST',
                        jsonData: {
							'name' : zoneName,
//							'isCustom' : isCustom,
							'diskStorageType':diskStorageType,
							'code' : zoneCode,
							'virtualTechnology':virtualTech,
							'virtualTechnologyVersion':virtualVersion,
							'description' : description
						},
                        success:function(form,action){
//                        	this.setDisabled(false);
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
                                   fn:reLoadData
							}); 
                        },   
                        failure:function(form,action){ 
//                        	this.setDisabled(false);
                            v_mask.hide();
                            Ext.MessageBox.show({
                                   title: i18n._('errorNotice'),
                                   msg: i18n._('operateFail'),
                                  buttons: Ext.MessageBox.OK,
                                   icon: Ext.MessageBox.ERROR
                                });  
                        }
                     });    
                }else{
//                	this.setDisabled(true);
                	v_mask.show();
                    var update=Ext.Ajax.request({
                        url:path+'/../../sc/zone!updateZone.action',
                        method:'POST',
                        params: {
                           	'serverZone.id':dId,
                           	'serverZone.isDefault':zoneDefault,
                           	'serverZone.name':zoneName,
                           	'serverZone.code':zoneCode,
//                           	'serverZone.isCustom' : isCustom,
                           	'serverZone.diskStorageType':diskStorageType,
                           	'serverZone.virtualTechnology':virtualTech,
                           	'serverZone.virtualTechnologyVersion':virtualVersion,
                           	'serverZone.description':description
							},
                        success:function(form,action){
//                        	this.setDisabled(false);
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
                                   msg: i18n._('modify')+i18n._('Successful'),
                                  buttons: Ext.MessageBox.OK,
                                   icon: Ext.MessageBox.INFO,
                                   fn:reLoadData
                                });
                        },   
                        failure:function(form,action){
//                        	this.setDisabled(false);
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
    },{
        text: i18n._('Cancel'),
        handler:function(){
            formPanel.getForm().reset();
            zoneWinForm.hide();
        }
    }]
});

var zoneWinForm = new Ext.create('Ext.window.Window',{                               
    width:270,
    height:330,
    closable:false,
    constrain:true,
    modal:true,
    border: false,
    tools:[{
        type:'close',
        handler:function(){ 
            formPanel.getForm().reset();
            zoneWinForm.hide()
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
//define model
var zoneModel=Ext.define('zoneModel', {
	extend: 'Ext.data.Model',
	fields: ['id', 'name', 'createId','code','description','isDefault','isEnable','diskStorageType','virtualTechnology','virtualTechnologyVersion',
	         {name: 'createDate', mapping: 'createDate', type: 'date', dateFormat: 'time'}
	],                  
	idProperty: 'id'
});
//create the Data Store
var zoneStore= Ext.create('Ext.data.Store', {
	model: 'zoneModel',
	remoteSort: true,
	autoLoad:false,
	pageSize:pageSize,
	proxy: new Ext.data.proxy.Ajax({
		url: path+'/../../sc/zone!findAllZoneByPage.action',
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
		}
	},
	sorters: ["id"]
});              
var zoneGrid = Ext.create('Ext.grid.Panel', {
	store: zoneStore,
	stateful: true,
	bbar: Ext.create('Ext.toolbar.Paging', {
		store: zoneStore,
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
		        	text: '<font id="addId" color="#ffffff" >' + i18n._('add') + '</font>',                                       
		        	icon: 'images/add.png',
		        	listeners: {
		        		"click" : function(){
		        			getSessionUser();
		        			zoneWinForm.setTitle(i18n._('add')+i18n._('zone'));
		        			dId=0;
		        			zoneCodeField.setReadOnly(false);
		        			zoneCodeField.setDisabled(false);
		        			zoneWinForm.show();
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
                    text: '<font id="modifyId" color="#ffffff" >' + i18n._('modify') + '</font>',                                       
                    icon: 'images/modify.png',
                    listeners: {
                        "click" : function(){
                        	getSessionUser();
                        	var row = zoneGrid.getSelectionModel().getSelection();                                            	
                            if (row.length == 0) {  
                                Ext.MessageBox.show({                                                         
                                      title:i18n._('notice'),
                                      msg:i18n._('selectOne'),
                                      icon:Ext.MessageBox.WARNING,
                                      buttons: Ext.MessageBox.OK                                                          
                                  });  
                                return;
							}
                            var id = row[0].get('id');
                        	var record = zoneGrid.getStore().getById(id);
//                        	var isCustom=record.get('isCustom');
                        	var diskStorageType = record.get('diskStorageType');
							zoneWinForm.setTitle(i18n._('modify')+i18n._('zone'));
							zoneCodeField.setReadOnly(true);
							zoneCodeField.setDisabled(true);
							dId=id;
							//alert(dId);
							zoneDefault=record.get('isDefault');
							zoneNameField.setValue(record.get('name'));
							//zoneIsDefault.setValue(record.get('isDefault'));
							zoneCodeField.setValue(record.get('code'));
//							isCustomCheckRadioGroup.setValue({'rb':isCustom});
							storageTypeCheckRadioGroup.setValue({'st':diskStorageType});
							virtualNameField.setValue(record.get('virtualTechnology'));
							virtualVersionField.setValue(record.get('virtualTechnologyVersion'));
							descriptionField.setValue(record.get('description'));
							zoneWinForm.show();
						},
                        "mouseout" : function() {
                            document.getElementById("modifyId").style.color = "#ffffff";
                        },
                        "mouseover" : function() {
                            document.getElementById("modifyId").style.color = "#000000";
                        }                                               
                    }                                            
               },
                {
                     xtype:'button',
                     text: '<font id="enableId" color="#ffffff";>' + i18n._('Enable') + '</font>',                                        
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
							var row = zoneGrid.getSelectionModel().getSelection();
							if (row.length == 0) {  
								Ext.MessageBox.show({                                                         
									title:i18n._('notice'),
									msg:i18n._('selectOne'),
									icon:Ext.MessageBox.WARNING,
									buttons: Ext.MessageBox.OK                                                          
								});
								return;
							} 
							var id = row[0].get('id');
                        	var record = zoneGrid.getStore().getById(id);
                        	var zoneName = record.get('name');
                        	var zoneCode = record.get('code');
                        	var diskStorageType=record.get('diskStorageType');
                        	var virtualTechnology=record.get('virtualTechnology');
                        	var virtualTechnologyVersion=record.get('virtualTechnologyVersion');
							var description = record.get('description');
							var isDefault = record.get('isDefault');
							var isEnable = record.get('isEnable');												
							if(isEnable==1){
								Ext.MessageBox.show({                                                         
									title:i18n._('notice'),
									msg:i18n._('This zone has been enabled, and do not need to reset!'),
									icon:Ext.MessageBox.WARNING,
									buttons: Ext.MessageBox.OK                                                          
								});
								return;
							}
							/* if(isDefault==1){
								Ext.MessageBox.show({                                                         
									title:i18n._('notice'),
									msg:i18n._('Please re-setting the main zone and then do this!'),
									icon:Ext.MessageBox.WARNING,
									buttons: Ext.MessageBox.OK                                                          
								});
								return;
							} */
                            Ext.MessageBox.confirm(i18n._('confirm'),i18n._('whetherEnable'),function(btn){
                                if(btn=='yes'){
                                    var del=Ext.Ajax.request({
                                        url:path+'/../../sc/zone!setZoneEnable.action',
                                        method:'POST',
                                        params: {
                                        	'serverZone.id':id,
                                        	'serverZone.isEnable':1,
                                        	'serverZone.name':zoneName,
                                           	'serverZone.code':zoneCode,
                                           	'serverZone.diskStorageType':diskStorageType,
                                           	'serverZone.virtualTechnology':virtualTechnology,
                                           	'serverZone.virtualTechnologyVersion':virtualTechnologyVersion,
                                           	'serverZone.description':description
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
													icon: Ext.MessageBox.WARNING
                                                });
                                                return;
                                            }
                                            if(obj.success==true){
												Ext.MessageBox.show({
													title : i18n._('notice'),
													msg : i18n._('enableSuccess'),
													icon : Ext.MessageBox.INFO,
													buttons : Ext.MessageBox.OK,
													fn: reLoadData
												});																							
											}
                                            dId==0;                                                                                                                          
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
                                }
                            });
                         }
                     }
                },
                {
                    xtype:'button',
                    text: '<font id="disableId" color="#ffffff";>' + i18n._('Disable') + '</font>',                                        
                    icon: 'images/disableButton.png',
                    listeners: {                                            
                        "mouseout" : function() {
                            document.getElementById("disableId").style.color = "#ffffff";
                        },
                        "mouseover" : function() {
                            document.getElementById("disableId").style.color = "#000000";
                        },
                        "click" : function() {
                        	getSessionUser();
							var row = zoneGrid.getSelectionModel().getSelection();
							if (row.length == 0) {  
								Ext.MessageBox.show({                                                         
									title:i18n._('notice'),
									msg:i18n._('selectOne'),
									icon:Ext.MessageBox.WARNING,
									buttons: Ext.MessageBox.OK                                                          
								});
								return;
							} 
							var id = row[0].get('id');
							var record = zoneGrid.getStore().getById(id);
							var zoneName = record.get('name');
							var zoneCode = record.get('code');
							var diskStorageType=record.get('diskStorageType');
                        	var virtualTechnology=record.get('virtualTechnology');
                        	var virtualTechnologyVersion=record.get('virtualTechnologyVersion');
							var description = record.get('description');
							var isDefault = record.get('isDefault');
							var isEnable = record.get('isEnable');												
							if(isEnable==0){
								Ext.MessageBox.show({                                                         
									title:i18n._('notice'),
									msg:i18n._('This zone has been disabled, and do not need to reset!'),
									icon:Ext.MessageBox.WARNING,
									buttons: Ext.MessageBox.OK                                                          
								});
								return;
							}
							if(isDefault==1){
								Ext.MessageBox.show({                                                         
									title:i18n._('notice'),
									msg:i18n._('Please re-setting the main zone and then do this!'),
									icon:Ext.MessageBox.WARNING,
									buttons: Ext.MessageBox.OK                                                          
								});
								return;
							}
                           Ext.MessageBox.confirm(i18n._('confirm'),i18n._('whetherDisable'),function(btn){
                               if(btn=='yes'){
                                   var del=Ext.Ajax.request({
                                       url:path+'/../../sc/zone!setZoneEnable.action',
                                       method:'POST',
                                       params: {
                                       	'serverZone.id':id,
                                       	'serverZone.isEnable':0,
                                       	'serverZone.name':zoneName,
										'serverZone.code':zoneCode,
										'serverZone.diskStorageType':diskStorageType,
                                       	'serverZone.virtualTechnology':virtualTechnology,
                                       	'serverZone.virtualTechnologyVersion':virtualTechnologyVersion,
										'serverZone.description':description
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
													icon: Ext.MessageBox.WARNING
                                               });
                                               return;
                                           }
                                           if(obj.success==true){
												Ext.MessageBox.show({
													title : i18n._('notice'),
													msg : i18n._('disableSuccess'),
													icon : Ext.MessageBox.INFO,
													buttons : Ext.MessageBox.OK,
													fn: reLoadData
												});																							
											}
                                           dId==0;                                                                                                                          
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
                               }
                           });
                        }
                    }
               },
               {
            	   xtype:'button',
            	   text: '<font id="mainZoneid" color="#ffffff";>' + i18n._('setMainZone') + '</font>',                                        
            	   icon: 'images/mainZone.png',
            	   listeners: {                                            
            		   "mouseout" : function() {
            			   document.getElementById("mainZoneid").style.color = "#ffffff";
            		   },
            		   "mouseover" : function() {
            			   document.getElementById("mainZoneid").style.color = "#000000";
            		   },
            		   "click" : function() {
            			   getSessionUser();
            			   var row = zoneGrid.getSelectionModel().getSelection();
            			   if (row.length == 0) {  
            				   Ext.MessageBox.show({                                                         
            					   title:i18n._('notice'),
            					   msg:i18n._('selectOne'),
            					   icon:Ext.MessageBox.WARNING,
            					   buttons: Ext.MessageBox.OK                                                          
            				   });
            				   return;
            			   } 
            			   var id = row[0].get('id');
            			   var record = zoneGrid.getStore().getById(id);
            			   var zoneName = record.get('name');
            			   var zoneCode = record.get('code');
            			   var diskStorageType=record.get('diskStorageType');
            			   var virtualTechnology=record.get('virtualTechnology');
            			   var virtualTechnologyVersion=record.get('virtualTechnologyVersion');
            			   var isDefault = record.get('isDefault');
            			   var isEnable = record.get('isEnable');												
            			   if(isEnable==0){
            				   Ext.MessageBox.show({                                                         
            					   title:i18n._('notice'),
            					   msg:i18n._('This zone is not available, can not be set as the main zone!'),//此域不可用，无法设置为主区域！
            					   icon:Ext.MessageBox.WARNING,
            					   buttons: Ext.MessageBox.OK                                                          
            				   });
            				   return;
							}
							if(isDefault==1){
								Ext.MessageBox.show({                                                         
									title:i18n._('notice'),
									msg:i18n._('This zone has been the main zone, and do not need to reset!'),//此域已经是主区域，不需要设置
									icon:Ext.MessageBox.WARNING,
									buttons: Ext.MessageBox.OK                                                          
								});
								return;
							}
							var description = record.get('description');												                                                
							Ext.MessageBox.confirm(i18n._('confirm'),i18n._('Are you sure to set this zone as main zone'),function(btn){
								if(btn=='yes'){
									var set=Ext.Ajax.request({
										url:path+'/../../sc/zone!setDefaultServerZone.action',
										method:'POST',
										params: {
											'serverZone.id':id,
											'serverZone.isDefault':1,
											'serverZone.name':zoneName,
											'serverZone.code':zoneCode,
											'serverZone.diskStorageType':diskStorageType,
                                           	'serverZone.virtualTechnology':virtualTechnology,
                                           	'serverZone.virtualTechnologyVersion':virtualTechnologyVersion,
											'serverZone.description':description
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
													icon: Ext.MessageBox.WARNING
												});
												return;
											}
											dId==0;
											Ext.MessageBox.show({
												title: i18n._('notice'),
												msg: i18n._('setMainZoneSuccessful'),
												buttons: Ext.MessageBox.OK,
												icon: Ext.MessageBox.INFO,
												fn: reLoadData
											});                                                          
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
								}
							});
            		   }
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
            	   tooltip:i18n._('zoneName')+'/'+i18n._('zoneCode'),
            	   emptyText:i18n._('zoneName')+'/'+i18n._('zoneCode'),
            	   store : zoneStore,
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
		//bodyBorder:false,
		//frame:true,
		//border:true,
		columns: [
		          Ext.create('Ext.grid.RowNumberer',{header:'',dataIndex:'item',align:'left',flex:0.1}),//,align:'left'
		          { 
		        	  text     : i18n._('id'),
		        	  flex:0.1,
		        	  sortable : false,
		        	  dataIndex: 'id',
		        	  field:'textfield',
		        	  hidden:true                        
		          },
		          {                       
		        	  text     : i18n._('zoneName'),
		        	  flex     : 0.4,
		        	  sortable : false,
		        	  dataIndex: 'name',
		        	  renderer:function(value){                           
		        		  return value;
		        		  //return getStringIP(value);
		        	  }
		          },
		          {
		        	  text     : i18n._('zoneCode'),
		        	  flex     : 0.4,
		        	  sortable : false,                       
		        	  dataIndex: 'code',
		        	  renderer:function(value){                        	
		        		  return value;
		        		  //return getStringIP(value);
		        	  }
		          },
		          {
		        	  text     : i18n._('mainZone'),
		        	  flex     : 0.2,
		        	  sortable : false,                       
		        	  dataIndex: 'isDefault',
		        	  renderer:function(value){ 
		        		  if(value==1){
		        			  return i18n._('Yes');
		        		  }else{
		        			  return i18n._('No');
		        		  }
		        	  }
		          },
		          {
		        	  text     : i18n._('status'),
		        	  flex     : 0.2,
		        	  sortable : false,                       
		        	  dataIndex: 'isEnable',
		        	  renderer:function(value){ 
		        		  if(value==1){
		        			  return i18n._('Enable');//启用
		        		  }else{
		        			  return i18n._('Disable');//禁用
		        		  }
		        	  }
		          },/* {
		        	  text     : i18n._('customizable'),//按需购买
		        	  flex     : 0.2,
		        	  sortable : false,                       
		        	  dataIndex: 'isCustom',
		        	  renderer:function(value){ 
		        		  if(value==1){
		        			  return i18n._('support');//支持
		        		  }else{
		        			  return i18n._('nonsupport');//不支持
		        		  }
		        	  }
		          },*/
		          {
		        	  text     : i18n._('createTime'),
		        	  flex:0.4,
		        	  sortable : false,                       
		        	  dataIndex: 'createDate',
		        	  renderer: Ext.util.Format.dateRenderer("Y-m-d H:i:s"),
		        	  hidden:true
		          },{
		        	  text		:i18n._('storageType'),
		        	  flex		:0.2,
		        	  sortable	:false,
		        	  dataIndex	:'diskStorageType',
		        	  renderer:function(value){
		        		  if(value==1){
		        			  return i18n._('distributedStorage');//分布式存储
		        		  }else if(value==2){
		        			  return i18n._('shareStorage');//共享式存储
		        		  }else{
		        			  return i18n._('localStorage');//本地存储
		        		  }
		        	  }
		          },{
		        	  text		:i18n._('virstulTech'),
		        	  flex		:0.2,
		        	  sortable	:false,
		        	  dataIndex	:'virtualTechnology',
		        	  renderder:function(value){
		        		  return value;
		        	  }
		          }, {
		        	  text		:i18n._('techVersion'),
		        	  flex		:0.2,
		        	  sortable	:false,
		        	  dataIndex	:'virtualTechnologyVersion',
		        	  renderer:function(value){
		        		  return value;
		        	  }
		          },                                 
		          {
		        	  text     : i18n._('zoneDescription'),
		        	  flex:0.8,
		        	  sortable : false,                       
		        	  dataIndex: 'description',
		        	  renderer :function(data, metadata, record, rowIndex, columnIndex, store){
		        		  //metadata.attr = 'ext:qtip="' + data + '"';
		        		  metadata.tdAttr = 'data-qtip="' + data + '"';
		        		  return Ext.util.Format.ellipsis(data,50);							
		        	  }
		          }]
});
function reLoadData(){
	formPanel.getForm().reset();
    zoneWinForm.hide();
	zoneStore.load();
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