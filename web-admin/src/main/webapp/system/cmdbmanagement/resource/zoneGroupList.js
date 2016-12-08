/**
 * zoneGroupList
 */
var params = getCookie("lang");
i18n.set({
	lang : params,
	path : '../../../resources'
});
Ext.Loader.setConfig({
	enabled : true
});
Ext.require([       
             'Ext.data.*'
]);
var formTitle='';
var v_mask = null;
var dId = 0;
var zoneDefault=0;
var zoneGroupNameField=Ext.create('Ext.form.field.Text',{
    name: 'zoneGroupName',
    fieldLabel: i18n._('zoneGroupName'),//名称
    allowBlank:false,
    regex:/^[\w-@#$%^&*\u4e00-\u9fa5]+$/,
	regexText:i18n._('InvalidCharacters'),
	enforceMaxLength:true,
    maxLength:20,
    width:220,
    emptyText:i18n._('zoneGroupName')
});
var zoneGroupCodeField=Ext.create('Ext.form.field.Text',{
    name: 'zoneGroupCode',
    fieldLabel: i18n._('zoneGroupCode'),//简称
    enforceMaxLength:true,
    allowBlank:false,
    regex:/^[A-Za-z0-9]+$/,
	regexText:i18n._('InvalidCharacters'),
    maxLength:8,
    width:220,
    emptyText:i18n._('zoneGroupCode')
});
var regionCodeField=Ext.create('Ext.form.field.Text',{
    name: 'regionCode',
    fieldLabel: i18n._('regionCode'),//简称
    enforceMaxLength:true,
    allowBlank:false,
    regex:/^[A-Za-z0-9]+$/,
	regexText:i18n._('InvalidCharacters'),
    maxLength:20,
    width:220,
    emptyText:i18n._('regionCode')
});
var descriptionField=Ext.create('Ext.form.field.TextArea',{
	name: 'descriptionField',
	maxLength:50,
	enforceMaxLength:true,
	fieldLabel: i18n._('zoneGroupDescription'),
	//regex:/^[\S]+$/,//禁止输入空白字符
	//regexText:i18n._('InvalidCharacters'),
	allowBlank:false,
	emptyText:i18n._('DescriptionLengthTip')
});
//分平台数据Store
var domainStore = Ext.create('Ext.data.Store', {
	autoLoad : false,//true
	fields : [ 'id','name','code'],
	proxy:new Ext.data.proxy.Ajax({
        url : path+'/../../admin_mgmt/basicData!loadDomain.action',
        reader: {
            type: 'json',
			root:'resultObject',
			totalProperty: 'resultObject.totalCount'
        }
    }),
	listeners : {
		load : function(store, records, successful, eOpts ){
			if(successful && store.getCount()>0){
				domainComb.setValue(store.getAt(0).get('id'));
			}
		}
	}
});
//分平台下拉列表框
var domainComb = Ext.create('Ext.form.ComboBox', {
	fieldLabel : i18n._('PromotionDomain'),//
	width : 220,
	listConfig:{maxHeight:200},
	//labelWidth : 80,
	editable : false,
	allowBlank:false,
	store : domainStore,
	//queryMode : 'local',
	displayField : 'name',
	valueField : 'id'
});
//Form表单提交
var formPanel = Ext.create('Ext.form.Panel', {
    frame: true,                        
    //title: 'Form Fields',
    width: 250,                     
    bodyPadding: 5,
    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 60,
        anchor: '100%'
    },
    items: [                            
        zoneGroupNameField,//zoneIsDefault,
        zoneGroupCodeField,
        regionCodeField,
        domainComb,
        descriptionField                                                        
    ],
    buttons: [{
        text: i18n._('OK'),
        handler:function(){
        	if (zoneGroupNameField.getValue() == null ||zoneGroupNameField.getValue()=='') {
				Ext.MessageBox.show({
					title : i18n._('notice'),
					msg : i18n._('Please input the zoneGroup name'),//请输入区域名称
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.WARNING
				});// INFO,QUESTION,WARNING,ERROR
				zoneGroupNameField.focus();
				return;
			}
        	if (zoneGroupCodeField.getValue() == null ||zoneGroupCodeField.getValue()=='') {
				Ext.MessageBox.show({
					title : i18n._('notice'),
					msg : i18n._('Please input the zoneGroup code'),//请输入区域编码
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.WARNING
				});// INFO,QUESTION,WARNING,ERROR
				zoneGroupCodeField.focus();
				return;
			}
        	if (regionCodeField.getValue() == null ||regionCodeField.getValue()=='') {
				Ext.MessageBox.show({
					title : i18n._('notice'),
					msg : '请输入对应的openstack的regionCode',//请输入区域编码
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.WARNING
				});// INFO,QUESTION,WARNING,ERROR
				regionCodeField.focus();
				return;
			}
        	if (descriptionField.getValue() == null ||descriptionField.getValue()=='') {
				Ext.MessageBox.show({
					title : i18n._('notice'),
					msg : i18n._('Please input the zoneGroup description'),//请输入区域描述
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
            var zoneGroupName=zoneGroupNameField.getValue();
            
            var zoneGroupCode=zoneGroupCodeField.getValue();
            var regionCode=regionCodeField.getValue();
            var description=descriptionField.getValue();
            var domainIds=[];
            domainIds.push(domainComb.getValue());
            formPanel.getForm().reset();
            zoneGroupWinForm.hide();
                if(dId==0){   
                    v_mask.show();
                    var create=Ext.Ajax.request({
                        url:path+'/../../sc/zoneGroup!createZoneGroup.action',
                        method:'POST',
                        jsonData: {
							'name' : zoneGroupName,
							'code' : zoneGroupCode,
							'regionCode' : regionCode,
							'description' : description
						},
						params:{
							'domainIds':domainIds
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
                                   fn:reLoadData
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
                }else{
                	v_mask.show();
                    var update=Ext.Ajax.request({
                        url:path+'/../../sc/zoneGroup!updateZoneGroup.action',
                        method:'POST',
                        params: {
                           	'zoneGroup.id':dId,
                           	'zoneGroup.name':zoneGroupName,
                           	'zoneGroup.code':zoneGroupCode,
                           	'zoneGroup.regionCode':regionCode,
                           	'zoneGroup.description':description,
                           	'domainIds':domainIds
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
                                   msg: i18n._('modify')+i18n._('Successful'),
                                  buttons: Ext.MessageBox.OK,
                                   icon: Ext.MessageBox.INFO,
                                   fn:reLoadData
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
        }   
    },{
        text: i18n._('Cancel'),
        handler:function(){
            formPanel.getForm().reset();
            zoneGroupWinForm.hide();
        }
    }]
});

var zoneGroupWinForm = new Ext.create('Ext.window.Window',{                               
    width:240,
    height:230,
    closable:false,
    constrain:true,
    modal:true,
    tools:[{
        type:'close',
        handler:function(){ 
            formPanel.getForm().reset();
            zoneGroupWinForm.hide()
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
var zoneGroupModel=Ext.define('zoneGroupModel', {
	extend: 'Ext.data.Model',
	fields: ['id', 'name', 'createId','code','regionCode','description','isEnable','domainList',
	         {name: 'createDate', mapping: 'createDate', type: 'date', dateFormat: 'time'}
	],                  
	idProperty: 'id'
});
//create the Data Store
var zoneGroupStore= Ext.create('Ext.data.Store', {
	model: 'zoneGroupModel',
	remoteSort: true,
	autoLoad:false,
	pageSize:pageSize,
	proxy: new Ext.data.proxy.Ajax({
		url: path+'/../../sc/zoneGroup!findAllZoneGroupByPage.action',
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
var zoneGroupGrid = Ext.create('Ext.grid.Panel', {
	store: zoneGroupStore,
	stateful: true,
	bbar: Ext.create('Ext.toolbar.Paging', {
		store: zoneGroupStore,
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
		        			domainStore.load();
		        			zoneGroupWinForm.setTitle(i18n._('add')+i18n._('zoneGroup'));
		        			dId=0;
		        			zoneGroupCodeField.setReadOnly(false);
		        			zoneGroupCodeField.setDisabled(false);
		        			regionCodeField.setReadOnly(false);
		        			regionCodeField.setDisabled(false);
		        			zoneGroupWinForm.show();
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
                        	var row = zoneGroupGrid.getSelectionModel().getSelection();                                            	
                            if (row.length == 0) {  
                                Ext.MessageBox.show({                                                         
                                      title:i18n._('notice'),
                                      msg:i18n._('selectOne'),
                                      icon:Ext.MessageBox.WARNING,
                                      buttons: Ext.MessageBox.OK                                                          
                                  });  
                                return;
							}
                            domainStore.load();
                            var id = row[0].get('id');
                        	var record = zoneGroupGrid.getStore().getById(id);
                        	var domainList = record.get('domainList');
							zoneGroupWinForm.setTitle(i18n._('modify')+i18n._('zoneGroup'));
							zoneGroupCodeField.setReadOnly(true);
							zoneGroupCodeField.setDisabled(true);
							regionCodeField.setReadOnly(true);
							regionCodeField.setDisabled(true);
							dId=id;
							zoneGroupNameField.setValue(record.get('name'));
							//zoneIsDefault.setValue(record.get('isDefault'));
							zoneGroupCodeField.setValue(record.get('code'));
							regionCodeField.setValue(record.get('regionCode'));
							descriptionField.setValue(record.get('description'));
							domainStore.on('load',function(){
								if(domainList != null && domainList.length>0){
									domainComb.setValue(domainList[0].id);
								}else{
									domainComb.setValue(domainStore.getAt(0).get('id'));
								}
							});
							
							zoneGroupWinForm.show();
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
							var row = zoneGroupGrid.getSelectionModel().getSelection();
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
                        	var record = zoneGroupGrid.getStore().getById(id);
                        	var zoneGroupName = record.get('name');
                        	var zoneGroupCode = record.get('code');
							var description = record.get('description');
							var isEnable = record.get('isEnable');												
							if(isEnable==1){
								Ext.MessageBox.show({                                                         
									title:i18n._('notice'),
									msg:i18n._('This zoneGroup has been enabled, and do not need to reset!'),
									icon:Ext.MessageBox.WARNING,
									buttons: Ext.MessageBox.OK                                                          
								});
								return;
							}							
                            Ext.MessageBox.confirm(i18n._('confirm'),i18n._('whetherEnable'),function(btn){
                                if(btn=='yes'){
                                    var del=Ext.Ajax.request({
                                        url:path+'/../../sc/zoneGroup!setZoneGroupEnable.action',
                                        method:'POST',
                                        params: {
                                        	'zoneGroup.id':id,
                                        	'zoneGroup.isEnable':1,
                                        	'zoneGroup.name':zoneGroupName,
                                           	'zoneGroup.code':zoneGroupCode,
                                           	'zoneGroup.description':description
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
							var row = zoneGroupGrid.getSelectionModel().getSelection();
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
							var record = zoneGroupGrid.getStore().getById(id);
							var zoneGroupName = record.get('name');
							var zoneGroupCode = record.get('code');
							var description = record.get('description');
							var isEnable = record.get('isEnable');												
							if(isEnable==0){
								Ext.MessageBox.show({                                                         
									title:i18n._('notice'),
									msg:i18n._('This zoneGroup has been disabled, and do not need to reset!'),
									icon:Ext.MessageBox.WARNING,
									buttons: Ext.MessageBox.OK                                                          
								});
								return;
							}							
                           Ext.MessageBox.confirm(i18n._('confirm'),i18n._('whetherDisable'),function(btn){
                               if(btn=='yes'){
                                   var del=Ext.Ajax.request({
                                       url:path+'/../../sc/zoneGroup!setZoneGroupEnable.action',
                                       method:'POST',
                                       params: {
                                       	'zoneGroup.id':id,
                                       	'zoneGroup.isEnable':0,
                                       	'zoneGroup.name':zoneGroupName,
										'zoneGroup.code':zoneGroupCode,
										'zoneGroup.description':description
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
            	   text: '<font id="relatedZoneid" color="#ffffff";>' + i18n._('zoneRelated') + '</font>',                                        
            	   icon: 'images/relatedZone.png',
            	   listeners: {                                            
            		   "mouseout" : function() {
            			   document.getElementById("relatedZoneid").style.color = "#ffffff";
            		   },
            		   "mouseover" : function() {
            			   document.getElementById("relatedZoneid").style.color = "#000000";
            		   },
            		   "click" : function() {
            			   getSessionUser();
            			   var row = zoneGroupGrid.getSelectionModel().getSelection();
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
            			   var record = zoneGroupGrid.getStore().getById(id);
            			   var zoneGroupName = record.get('name');
            			   var zoneGroupCode = record.get('code');
            			   var isEnable = record.get('isEnable');												
            			   if(isEnable==0){
            				   Ext.MessageBox.show({                                                         
            					   title:i18n._('notice'),
            					   msg:i18n._('This zoneGroup is not available, can not be set!'),//此域不可用，无法设置为主区域！
            					   icon:Ext.MessageBox.WARNING,
            					   buttons: Ext.MessageBox.OK                                                          
            				   });
            				   return;
							}							
							var description = record.get('description');												                                                
							showRelatedZoneWin(id,zoneGroupName);
            		   }
            	   }
               },
               {
            	   xtype:'button',
            	   text: '<font id="relatedOsid" color="#ffffff";>' + i18n._('OsRelate') + '</font>',                                        
            	   icon: 'images/relatedZone.png',
            	   listeners: {                                            
            		   "mouseout" : function() {
            			   document.getElementById("relatedOsid").style.color = "#ffffff";
            		   },
            		   "mouseover" : function() {
            			   document.getElementById("relatedOsid").style.color = "#000000";
            		   },
            		   "click" : function() {
            			   getSessionUser();
            			   var row = zoneGroupGrid.getSelectionModel().getSelection();
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
            			   var record = zoneGroupGrid.getStore().getById(id);
            			   var zoneGroupName = record.get('name');
            			   var zoneGroupCode = record.get('code');
            			   var zoneRegionCode = record.get('regionCode');
            			   var isEnable = record.get('isEnable');												
            			   if(isEnable==0){
            				   Ext.MessageBox.show({                                                         
            					   title:i18n._('notice'),
            					   msg:i18n._('This zoneGroup is not available, can not be set!'),//此域不可用，无法设置为主区域！
            					   icon:Ext.MessageBox.WARNING,
            					   buttons: Ext.MessageBox.OK                                                          
            				   });
            				   return;
							}							
							var description = record.get('description');												                                                
							showRelatedOsWin(id,zoneGroupName,zoneRegionCode);
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
            	   tooltip:i18n._('zoneGroupName')+'/'+i18n._('zoneGroupCode'),
            	   emptyText:i18n._('zoneGroupName')+'/'+i18n._('zoneGroupCode'),
            	   store : zoneGroupStore,
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
		bodyBorder:false,
		//frame:true,
		//border:true,
		columns: [
		          Ext.create('Ext.grid.RowNumberer',{header:'',dataIndex:'item',flex:0.1}),//,align:'left'
		          { 
		        	  text     : i18n._('id'),
		        	  flex:0.1,
		        	  sortable : false,
		        	  dataIndex: 'id',
		        	  field:'textfield',
		        	  hidden:true                        
		          },
		          {                       
		        	  text     : i18n._('zoneGroupName'),
		        	  flex     : 0.6,
		        	  sortable : false,
		        	  dataIndex: 'name',
		        	  renderer:function(value){                           
		        		  return value;
		        		  //return getStringIP(value);
		        	  }
		          },
		          {
		        	  text     : i18n._('zoneGroupCode'),
		        	  flex     : 0.4,
		        	  sortable : false,                       
		        	  dataIndex: 'code',
		        	  renderer:function(value){                        	
		        		  return value;
		        		  //return getStringIP(value);
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
		          },
		          {
		        	  text     : i18n._('createTime'),
		        	  flex:0.4,
		        	  sortable : false,                       
		        	  dataIndex: 'createDate',
		        	  renderer: Ext.util.Format.dateRenderer("Y-m-d H:i:s"),
		        	  hidden:true
		          },                                  
		          {
		        	  text     : i18n._('zoneDescription'),
		        	  flex:1,
		        	  sortable : false,                       
		        	  dataIndex: 'description',
		        	  renderer :function(data, metadata, record, rowIndex, columnIndex, store){
		        		  //metadata.attr = 'ext:qtip="' + data + '"';
		        		  metadata.tdAttr = 'data-qtip="' + data + '"';
		        		  return Ext.util.Format.ellipsis(data,50);							
		        	  }
		          }]
});
var zoneModel=Ext.define('zoneModel', {
	extend: 'Ext.data.Model',
	fields: ['zoneId', 'zoneName'],                  
	idProperty: 'zoneId'
});

function showRelatedZoneWin(zoneGroupId,groupName){
	var unRelatedZoneStore=Ext.create('Ext.data.Store',{
		  pageSize: pageSize,
	      model: 'zoneModel',
	      proxy: new Ext.data.proxy.Ajax({
	      	url: path+'/../../sc/zoneGroup!findUnRelatedServerZoneByPage.action?zoneGroupId='+zoneGroupId,
			reader: {
	              type: 'json',
	              root: 'resultObject.result',
	              totalProperty: 'resultObject.totalCount'
	        }
	      }),
	      listeners:{
	    	  'load':function(){
	    		  unRelatedZoneGrid.reconfigure(unRelatedZoneStore);
	    	  }
	      }
	});
	unRelatedZoneStore.loadPage(1,null);
	
	var relatedZoneStore=Ext.create('Ext.data.Store',{
		  pageSize: pageSize,
	      model: 'zoneModel',
	      proxy: new Ext.data.proxy.Ajax({
	      	url: path+'/../../sc/zoneGroup!findRelatedServerZoneByPage.action?zoneGroupId='+zoneGroupId,
			reader: {
	              type: 'json',
	              root: 'resultObject.result',
	              totalProperty: 'resultObject.totalCount'
	        }
	      }),
	      listeners:{
	    	  'load':function(){
	    		  relatedZoneGrid.reconfigure(relatedZoneStore);
	    	  }
	      }
	});
	relatedZoneStore.loadPage(1,null);
	
	var unRelatedZoneGridSm = Ext.create('Ext.selection.CheckboxModel');
	var unRelatedZoneGrid=Ext.create('Ext.grid.Panel', {
		layout:'fit',
        store: unRelatedZoneStore,
        title:i18n._('unRelatedZone'),
		sortableColumns:false,
        frame: true,
		border:false,
		simpleSelect :true,
     	selModel:unRelatedZoneGridSm,
        columns:[
		{xtype: 'rownumberer',width:30},
        {
            text: i18n._('zoneName'),
            dataIndex: 'zoneName',
            flex: 1
        }],
        columnLines: true,
		bbar: Ext.create('Ext.PagingToolbar', {
            store: unRelatedZoneStore,
			pageSize: 16,
			displayInfo: true
        }),
        dockedItems: [ {
            xtype: 'toolbar',
            items: [
            {xtype:'tbfill'},
            {
				xtype:'displayfield',
				hideLabel:true,
				value:'<span style="bottom:3px;position:relative;">'+i18n._('QuickSearch')+':'+'</span>'
			},
	        {
                xtype: 'searchfield',
                hideLabel:true,
				hasSearch:true,
				emptyText:i18n._('zoneName'),
                store: unRelatedZoneStore				
			 }
           ]
        }]
    });
	var relatedZoneGridSm = Ext.create('Ext.selection.CheckboxModel');
    var relatedZoneGrid=Ext.create('Ext.grid.Panel',{
        store: relatedZoneStore,
        title:i18n._('relatedZone'),
 		layout:'fit',
 		sortableColumns:false,
        frame: true,
 		border:false,
 		simpleSelect :true,
      	selModel:relatedZoneGridSm,
        columns:[
 		{xtype: 'rownumberer',width:30},
         {
             text: i18n._('zoneName'),
             dataIndex: 'zoneName',
             flex: 1
         }],
        columnLines: true,
 		bbar: Ext.create('Ext.PagingToolbar', {
             store: relatedZoneStore,
 			pageSize: 16,
 			displayInfo: true
        }),
        dockedItems: [ {
             xtype: 'toolbar',
             items: [
             {xtype:'tbfill'},
             {
 				xtype:'displayfield',
 				hideLabel:true,
 				value:'<span style="bottom:3px;position:relative;">'+i18n._('QuickSearch')+':'+'</span>'
 			},
 	        {
                 xtype: 'searchfield',
                 hideLabel:true,
 				hasSearch:true,
 				emptyText:i18n._('zoneName'),
                 store: relatedZoneStore
 				
 			 }
            ]
         }]
	});
    
    var buttonLeft=Ext.create("Ext.button.Button",{
       text:'<span style="bottom:3px;position:relative;font-size:18px;font-weight:bold;"> << </span>',
       width:40,
       margin:'25 5 50 5',
       height:30,
       handler:function(){
    	   buttonLeft.disable(true);
    	   var rows=relatedZoneGrid.getSelectionModel().getSelection();
           if(rows.length>0){
        	   var idArr=[];
        	   for(var i=0;i<rows.length;i++){
        		   idArr.push(rows[i].get("zoneId"));
        	   }
        	   Ext.Ajax.request({
				  url: path+'/../../sc/zoneGroup!disAssociateZoneAndZoneGroup.action',
				  method: 'POST',
				  params:{
				    'zoneGroupId':zoneGroupId,
				    'zoneIds':idArr
				  },
				  success: function (response) {
						var obj = Ext.decode(response.responseText);
	           	    	if(obj.success){
	           	    		unRelatedZoneStore.loadPage(1,null);
	           	    		relatedZoneStore.loadPage(1,null);
	           	    		relatedZoneGridSm.deselectAll(true);
	           	    		unRelatedZoneGridSm.deselectAll(true);
						}else{
							showMsg(obj.resultMsg);   
				  		}
	           	    	buttonLeft.enable(true);
				  }
		      }); 
           }else{
        	   Ext.MessageBox.show({
					    title: i18n._('notice'),
					    msg:i18n._('select one associated zone'),
                     icon:Ext.MessageBox.WARNING,
                     buttons: Ext.MessageBox.OK
				}); 
				return;
           }
       }
    });
    var buttonRight=Ext.create("Ext.button.Button",{
    	text:'<span style="bottom:3px;position:relative;font-size:18px;font-weight:bold;"> >> </span>',
    	margin:'80 5 25 5',
        width:40,
        height:30,
        handler:function(){
           buttonRight.disable(true);
           var rows=unRelatedZoneGrid.getSelectionModel().getSelection();
           if(rows.length>0){
        	   var idArr=[];
        	   for(var i=0;i<rows.length;i++){
        		   idArr.push(rows[i].get("zoneId"));
        	   }
        	   Ext.Ajax.request({
        		   url: path+'/../../sc/zoneGroup!associateZoneAndZoneGroup.action',
        		   method: 'POST',
        		   params:{
        			   'zoneGroupId':zoneGroupId,
        			   'zoneIds':idArr
        		   },
					  success: function (response) {
							var obj = Ext.decode(response.responseText);
		           	    	if(obj.success){
		           	    		unRelatedZoneStore.loadPage(1,null);
		           	    		relatedZoneStore.loadPage(1,null);
 		           	    	relatedZoneGridSm.deselectAll(true);
	           	    		unRelatedZoneGridSm.deselectAll(true);
							}else{
								Ext.MessageBox.show({
									title : i18n._('notice'),
									msg : obj.resultMsg,
									icon : Ext.MessageBox.INFO,
									buttons : Ext.MessageBox.OK
								});
								return;
					  		}
		           	    	buttonRight.enable(true);
					  }
			      }); 
           }else{
        	   Ext.MessageBox.show({
					    title: i18n._('notice'),
					    msg:i18n._('select one associated zone'),
                     icon:Ext.MessageBox.WARNING,
                     buttons: Ext.MessageBox.OK
				}); 
				return;
           }
        }
    })
    
	var relatedZoneWin=Ext.create('Ext.window.Window', {
	    title:i18n._('zoneRelated')+'-'+groupName,
	    layout:'border',
	    height: 300,
		modal:true,
		constrain:true,
	    width: 630,
		closable:false,
		tools:[{
		  type:'close',
		  handler:function(){
			  relatedZoneWin.destroy();
		  }
		}],
	    items:[{
	    	region:'west',
	    	width:'45%',
	    	layout:'fit',
	    	items:[unRelatedZoneGrid]
	    },{
	    	region:'center',
	    	frame:true,
	    	width:'10%',
	    	items:[buttonRight,buttonLeft]
	    },{
	    	region:'east',
	    	width:'45%',
	    	layout:'fit',
	    	items:[relatedZoneGrid]
	    }]/*,
	    buttons:[{
	    	xtype:'button',
            text:i18n._('OK'),
            handler:function(){
            	relatedZoneWin.destroy();
            }
	    }]*/
	});
	
	relatedZoneWin.show();
};

var osModel=Ext.define('osModel', {
	extend: 'Ext.data.Model',
	fields: ['os_id', 'name'],                  
	idProperty: 'os_id'
});

function showRelatedOsWin(zoneGroupId,groupName,regionCode){
	var unRelatedOsStore=Ext.create('Ext.data.Store',{
		  pageSize: pageSize,
	      model: 'osModel',
	      proxy: new Ext.data.proxy.Ajax({
	      	url: path+'/../../sc/zoneGroup!findUnRelatedServerOsByPage.action?zoneGroupId='+zoneGroupId+"&regionCode="+regionCode,
			reader: {
	              type: 'json',
	              root: 'resultObject.result',
	              totalProperty: 'resultObject.totalCount'
	        }
	      }),
	      listeners:{
	    	  'load':function(){
	    		  unRelatedOsGrid.reconfigure(unRelatedOsStore);
	    	  }
	      }
	});
	unRelatedOsStore.loadPage(1,null);
	
	var relatedOsStore=Ext.create('Ext.data.Store',{
		  pageSize: pageSize,
	      model: 'osModel',
	      proxy: new Ext.data.proxy.Ajax({
	      	url: path+'/../../sc/zoneGroup!findRelatedServerOsByPage.action?zoneGroupId='+zoneGroupId,
			reader: {
	              type: 'json',
	              root: 'resultObject.result',
	              totalProperty: 'resultObject.totalCount'
	        }
	      }),
	      listeners:{
	    	  'load':function(){
	    		  relatedOsGrid.reconfigure(relatedOsStore);
	    	  }
	      }
	});
	relatedOsStore.loadPage(1,null);
	
	var unRelatedOsGridSm = Ext.create('Ext.selection.CheckboxModel');
	var unRelatedOsGrid=Ext.create('Ext.grid.Panel', {
		layout:'fit',
        store: unRelatedOsStore,
        title:i18n._('unRelatedOs'),
		sortableColumns:false,
        frame: true,
		border:false,
		simpleSelect :true,
     	selModel:unRelatedOsGridSm,
        columns:[
		{xtype: 'rownumberer',width:30},
        {
            text: i18n._('osName'),
            dataIndex: 'name',
            flex: 1
        }],
        columnLines: true,
		bbar: Ext.create('Ext.PagingToolbar', {
            store: unRelatedOsStore,
			pageSize: 16,
			displayInfo: true
        }),
        dockedItems: [ {
            xtype: 'toolbar',
            items: [
            {xtype:'tbfill'},
            {
				xtype:'displayfield',
				hideLabel:true,
				value:'<span style="bottom:3px;position:relative;">'+i18n._('QuickSearch')+':'+'</span>'
			},
	        {
                xtype: 'searchfield',
                hideLabel:true,
				hasSearch:true,
				emptyText:i18n._('osName'),
                store: unRelatedOsStore				
			 }
           ]
        }]
    });
	var relatedOsGridSm = Ext.create('Ext.selection.CheckboxModel');
    var relatedOsGrid=Ext.create('Ext.grid.Panel',{
        store: relatedOsStore,
        title:i18n._('RelatedOs'),
 		layout:'fit',
 		sortableColumns:false,
        frame: true,
 		border:false,
 		simpleSelect :true,
      	selModel:relatedOsGridSm,
        columns:[
 		{xtype: 'rownumberer',width:30},
         {
             text: i18n._('osName'),
             dataIndex: 'name',
             flex: 1
         }],
        columnLines: true,
 		bbar: Ext.create('Ext.PagingToolbar', {
             store: relatedOsStore,
 			pageSize: 16,
 			displayInfo: true
        }),
        dockedItems: [ {
             xtype: 'toolbar',
             items: [
             {xtype:'tbfill'},
             {
 				xtype:'displayfield',
 				hideLabel:true,
 				value:'<span style="bottom:3px;position:relative;">'+i18n._('QuickSearch')+':'+'</span>'
 			},
 	        {
                 xtype: 'searchfield',
                 hideLabel:true,
 				hasSearch:true,
 				emptyText:i18n._('osName'),
                 store: relatedOsStore
 				
 			 }
            ]
         }]
	});
    
    var buttonLeft=Ext.create("Ext.button.Button",{
       text:'<span style="bottom:3px;position:relative;font-size:18px;font-weight:bold;"> << </span>',
       width:40,
       margin:'25 5 50 5',
       height:30,
       handler:function(){
    	   buttonLeft.disable(true);
    	   var rows=relatedOsGrid.getSelectionModel().getSelection();
           if(rows.length>0){
        	   var idArr=[];
        	   for(var i=0;i<rows.length;i++){
//        		   alert(rows[i].get("os_id"));
        		   idArr.push(rows[i].get("os_id"));
        	   }
        	   Ext.Ajax.request({
				  url: path+'/../../sc/zoneGroup!disAssociateOsAndZoneGroup.action',
				  method: 'POST',
				  params:{
				    'zoneGroupId':zoneGroupId,
				    'osIds':idArr
				  },
				  success: function (response) {
						var obj = Ext.decode(response.responseText);
	           	    	if(obj.success){
	           	    		unRelatedOsStore.loadPage(1,null);
	           	    		relatedOsStore.loadPage(1,null);
	           	    		relatedOsGridSm.deselectAll(true);
	           	    		unRelatedOsGridSm.deselectAll(true);
						}else{
							showMsg(obj.resultMsg);   
				  		}
	           	    	buttonLeft.enable(true);
				  }
		      }); 
           }else{
        	   Ext.MessageBox.show({
					    title: i18n._('notice'),
					    msg:i18n._('PleaseSelectOS'),
                     icon:Ext.MessageBox.WARNING,
                     buttons: Ext.MessageBox.OK
				}); 
				return;
           }
       }
    });
    var buttonRight=Ext.create("Ext.button.Button",{
    	text:'<span style="bottom:3px;position:relative;font-size:18px;font-weight:bold;"> >> </span>',
    	margin:'80 5 25 5',
        width:40,
        height:30,
        handler:function(){
        	buttonRight.disable(true)
           var rows=unRelatedOsGrid.getSelectionModel().getSelection();
           if(rows.length>0){
        	   var idArr=[];
        	   for(var i=0;i<rows.length;i++){
        		   idArr.push(rows[i].get("os_id"));
        	   }
        	   Ext.Ajax.request({
        		   url: path+'/../../sc/zoneGroup!associateOsAndZoneGroup.action',
        		   method: 'POST',
        		   params:{
        			   'zoneGroupId':zoneGroupId,
        			   'osIds':idArr
        		   },
					  success: function (response) {
							var obj = Ext.decode(response.responseText);
		           	    	if(obj.success){
		           	    		unRelatedOsStore.loadPage(1,null);
		           	    		relatedOsStore.loadPage(1,null);
 		           	    	relatedOsGridSm.deselectAll(true);
	           	    		unRelatedOsGridSm.deselectAll(true);
							}else{
								Ext.MessageBox.show({
									title : i18n._('notice'),
									msg : obj.resultMsg,
									icon : Ext.MessageBox.INFO,
									buttons : Ext.MessageBox.OK
								});
								return;
					  		}
		           	    	buttonRight.enable(true)
					  }
			      }); 
           }else{
        	   Ext.MessageBox.show({
					    title: i18n._('notice'),
					    msg:i18n._('PleaseSelectOS'),
                     icon:Ext.MessageBox.WARNING,
                     buttons: Ext.MessageBox.OK
				}); 
				return;
           }
        }
    })
    
	var relatedOsWin=Ext.create('Ext.window.Window', {
	    title:i18n._('OsRelate')+'-'+groupName,
	    layout:'border',
	    height: 300,
		modal:true,
		constrain:true,
	    width: 630,
		closable:false,
		tools:[{
		  type:'close',
		  handler:function(){
			  relatedOsWin.destroy();
		  }
		}],
	    items:[{
	    	region:'west',
	    	width:'45%',
	    	layout:'fit',
	    	items:[unRelatedOsGrid]
	    },{
	    	region:'center',
	    	frame:true,
	    	width:'10%',
	    	items:[buttonRight,buttonLeft]
	    },{
	    	region:'east',
	    	width:'45%',
	    	layout:'fit',
	    	items:[relatedOsGrid]
	    }]/*,
	    buttons:[{
	    	xtype:'button',
            text:i18n._('OK'),
            handler:function(){
            	relatedOsWin.destroy();
            }
	    }]*/
	});
	
	relatedOsWin.show();
};

function reLoadData(){
	formPanel.getForm().reset();
    zoneGroupWinForm.hide();
	zoneGroupStore.load();
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
