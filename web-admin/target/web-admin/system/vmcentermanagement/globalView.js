//***globalView
params = getCookie("lang");
i18n.set({
	lang : params,
	path : '../../resources'
});
var v_mask = null;
Ext.Loader.setConfig({
	enabled : true
});
var colors = ['#26c648','#cbcbcb','#ee8800','#cbcbcb'];
Ext.require([ 'Ext.data.*', 'Ext.form.*', 'Ext.panel.Panel', 'Ext.view.View',
		'Ext.layout.container.Fit', 'Ext.toolbar.Paging',
		'Ext.selection.CheckboxModel', 'Ext.tip.QuickTipManager',
		'Ext.ux.data.PagingMemoryProxy', 'Ext.ux.form.SearchField',
		'Ext.window.Window', 'Ext.tab.*', 'Ext.toolbar.Spacer',
		'Ext.layout.container.Card', 'Ext.layout.container.Border' ]);
var stackChartData = [];
var vmPieChartData = [];
var globalViewStore = Ext.create('Ext.data.Store',{
	autoLoad : false,//true
	fields : [ 'id', 'enterpriseUserTotal', 'commonUserTotal',
			'applyUserNum', 'formalUserNum','vmOtherNum',
			'hostTotal', 'hostActiveNum', 'vmActiveNum','vmTotal', 
			'virtualCPUUsed', 'virtualCPUApply','virtualCPUTotal', 
			'virtualMemoryUsed','virtualMemoryApply', 'virtualMemoryTotal',
			'virtualDiskUsed', 'virtualDiskApply','virtualDiskTotal', 
			'expandDiskTotal','expandDiskUsed','ipUsed', 'ipTotal','ipFree',
			'vmPaidNum','vmTrialNum','vmWindowsNum','vmLinuxNum','hostError' ],
	sortInfo : {
		field : 'id',
		direction : 'ASC'
	},
	proxy : new Ext.data.proxy.Ajax(
			{
				url : path
						+ '/../monitoring/oss!getWholeOverviewInfo.action?',
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
	timeout:60000,//请求超时时间：由30秒调整为60秒
	listeners : {
		beforeload : function(globalViewStore,operation, eOpts ){							
			//遮罩层
			v_mask = new Ext.LoadMask(Ext.getBody(), {
				msg : i18n._('please wait')
			});
			v_mask.show();
		},
		load : function(globalViewStore, records, successful, eOpts ){						
			v_mask.hide();
			if(successful && globalViewStore.getCount()>0){
				var enterpriseUserTotal=globalViewStore.getAt(0).get('enterpriseUserTotal');
				var commonUserTotal=globalViewStore.getAt(0).get('commonUserTotal');
				enterpriseUserNumField.setValue(enterpriseUserTotal);
				commonUserNumField.setValue(commonUserTotal);								
												
				var hostActiveNum=globalViewStore.getAt(0).get('hostActiveNum');
				phyMachineNumField.setValue('<a  href ="#" onclick=nodeGridShow()>'+globalViewStore.getAt(0).get('hostTotal')+'</a>');
				phyMachineActiveNumField.setValue(hostActiveNum);
				//phyMachineActiveNumField.setValue('<a  href ="#" onclick=nodeGridShow()>'+globalViewStore.getAt(0).get('hostActiveNum')+'</a>');
				var phyMachineErrorNum = globalViewStore.getAt(0).get('hostTotal')-hostActiveNum;
				phyMachineErrorNumField.setValue('<a  href ="#" onclick=nodeErrorShow()>'+phyMachineErrorNum+'</a>');
				//phyMachineErrorNumField.setValue('<a  href ="#" onclick=nodeGridShow()>'+phyMachineErrorNum+'</a>');
																				
				var vmActiveNum=globalViewStore.getAt(0).get('vmActiveNum');
				virtualMachineNumField.setValue('<a  href ="#" onclick=instanceGridShow()>'+globalViewStore.getAt(0).get('vmTotal')+'</a>');
				virtualMachineActiveNumField.setValue(vmActiveNum);
				var virtualMachineErrorNum = globalViewStore.getAt(0).get('vmTotal')-vmActiveNum;
				//virtualMachineActiveNumField.setValue('<a  href ="#" onclick=instanceGridShow()>'+globalViewStore.getAt(0).get('vmActiveNum')+'</a>');
												
//				var availableVmNum = globalViewStore.getAt(0).get('vmPaidNum')+globalViewStore.getAt(0).get('vmTrialNum');
				var availableVmNum = globalViewStore.getAt(0).get('vmTotal');
				availableVmNumField.setValue(availableVmNum);
				vmPaidNumField.setValue(globalViewStore.getAt(0).get('vmPaidNum'));
				vmTrialNumField.setValue(globalViewStore.getAt(0).get('vmTrialNum'));
				vmOtherNumField.setValue(globalViewStore.getAt(0).get('vmOtherNum'));
				
				//stackChartData.splice(0,2);//清空数组
				var virtualCPUTotal = globalViewStore.getAt(0).get('virtualCPUTotal');
				var virtualMemoryTotal = globalViewStore.getAt(0).get('virtualMemoryTotal');
				var virtualDiskTotal = globalViewStore.getAt(0).get('virtualDiskTotal');
				var virtualDiskUsed = globalViewStore.getAt(0).get('virtualDiskUsed');
				
				var virtualCPUTotal1=virtualCPUTotal-globalViewStore.getAt(0).get('virtualCPUApply');
				var virtualMemoryTotal1 = virtualMemoryTotal-globalViewStore.getAt(0).get('virtualMemoryApply');
				var virtualDiskTotal1 = virtualDiskTotal-globalViewStore.getAt(0).get('virtualDiskApply');
				var virtualCPUTotal2 = virtualCPUTotal-globalViewStore.getAt(0).get('virtualCPUUsed');
				var virtualMemoryTotal2 = virtualMemoryTotal-globalViewStore.getAt(0).get('virtualMemoryUsed');								
				var virtualDiskTotal2 = virtualDiskTotal-globalViewStore.getAt(0).get('virtualDiskUsed');
				
				virtualCPUTotalField.setValue(globalViewStore.getAt(0).get('virtualCPUUsed'));
				virtualCPURemainedField.setValue(virtualCPUTotal2);
				virtualMemoryTotalField.setValue(globalViewStore.getAt(0).get('virtualMemoryUsed')+'M');
				virtualMemoryRemainedField.setValue(virtualMemoryTotal2+'M');
				virtualDiskTotalField.setValue(globalViewStore.getAt(0).get('virtualDiskUsed'));
				virtualDiskRemainedField.setValue(virtualDiskTotal2);
				
				var virtualCPUUsage1='';
				var virtualCPUUsage2='';
				if(virtualCPUTotal>0){
					virtualCPUUsage1= Ext.util.Format.round((globalViewStore.getAt(0).get('virtualCPUApply')/virtualCPUTotal)*100,2)+'%';
					virtualCPUUsage2= Ext.util.Format.round((globalViewStore.getAt(0).get('virtualCPUUsed')/virtualCPUTotal)*100,2)+'%';
				}
				var virtualMemoryUsage1='';
				var virtualMemoryUsage2='';
				if(virtualMemoryTotal>0){
					virtualMemoryUsage1= Ext.util.Format.round((globalViewStore.getAt(0).get('virtualMemoryApply')/virtualMemoryTotal)*100,2)+'%';
					virtualMemoryUsage2= Ext.util.Format.round((globalViewStore.getAt(0).get('virtualMemoryUsed')/virtualMemoryTotal)*100,2)+'%';
				}
				var virtualDiskUsage1='';
				var virtualDiskUsage2='';
				if(virtualDiskTotal>0){
					virtualDiskUsage1= Ext.util.Format.round((globalViewStore.getAt(0).get('virtualDiskApply')/virtualDiskTotal)*100,2)+'%';
					virtualDiskUsage2= Ext.util.Format.round((globalViewStore.getAt(0).get('virtualDiskUsed')/virtualDiskTotal)*100,2)+'%';
				}
				
				var expandDiskTotal1=globalViewStore.getAt(0).get('expandDiskTotal')-globalViewStore.getAt(0).get('expandDiskUsed');
				
				var ipUsed=globalViewStore.getAt(0).get('ipUsed');
				var ipFree=globalViewStore.getAt(0).get('ipFree');
				var ipDisabled=globalViewStore.getAt(0).get('ipTotal')-globalViewStore.getAt(0).get('ipUsed');
				ipTotalNumField.setValue(globalViewStore.getAt(0).get('ipTotal'));
				ipUsedNumField.setValue(ipUsed);
				ipFreeNumField.setValue(ipFree);
				var osWindows=globalViewStore.getAt(0).get('vmWindowsNum');
				var osLinux=globalViewStore.getAt(0).get('vmLinuxNum');
				osWindowsNumField.setValue(osWindows);
				osLinuxNumField.setValue(osLinux);
				
				var vmPaidNum=globalViewStore.getAt(0).get('vmPaidNum');
				var vmTrialNum=globalViewStore.getAt(0).get('vmTrialNum');
				var vmOtherNum=globalViewStore.getAt(0).get('vmOtherNum');
				stackChartData=[];
				//先放申请数据，再放使用数据
				stackChartData.push({
					virtualCPUUsage:virtualCPUUsage1,
					virtualMemoryUsage:virtualMemoryUsage1,
					virtualDiskUsage:virtualDiskUsage1,
					virtualCPUTip : virtualCPUTotal2,
					virtualCPUUsed : virtualCPUTotal2,
					virtualCPUTotal : (virtualCPUTotal1>0?virtualCPUTotal1:0),
					virtualMemoryTip : virtualMemoryTotal2+'M',
					virtualMemoryUsed : virtualMemoryTotal2,
					virtualMemoryTotal : (virtualMemoryTotal1>0?(virtualMemoryTotal1/1024):0),
					virtualDiskTip : virtualDiskTotal2+'G',
					virtualDiskUsed : virtualDiskTotal2,
					virtualDiskTotal : (virtualDiskTotal1>0?virtualDiskTotal1:0),
					osTip : (osWindows>0?osWindows:''),
					osTotal : (osWindows>0?osWindows:''),
					ipTip : (ipFree>0?ipFree:''),//globalViewStore.getAt(0).get('ipTotal'),
					ipTotal : (ipFree>0?ipFree:0),//globalViewStore.getAt(0).get('ipTotal')
					userTip : (enterpriseUserTotal>0?enterpriseUserTotal:''),
					userTotal : (enterpriseUserTotal>0?enterpriseUserTotal:0),
					serverTip : (hostActiveNum>0?hostActiveNum:''),
					serverTotal : (hostActiveNum>0?hostActiveNum:0),					
					vmTip : (virtualMachineErrorNum>0?virtualMachineErrorNum:''),
					vmTotal : (virtualMachineErrorNum>0?virtualMachineErrorNum:0)									
				});
				stackChartData.push({
					virtualCPUUsage:virtualCPUUsage2,
					virtualMemoryUsage:virtualMemoryUsage2,
					virtualDiskUsage:virtualDiskUsage2,
					virtualCPUTip : globalViewStore.getAt(0).get('virtualCPUUsed'),
					virtualCPUUsed : globalViewStore.getAt(0).get('virtualCPUUsed'),
					virtualCPUTotal : (virtualCPUTotal2>0?virtualCPUTotal2:0),
					virtualMemoryTip : globalViewStore.getAt(0).get('virtualMemoryUsed')+'M',
					virtualMemoryUsed : globalViewStore.getAt(0).get('virtualMemoryUsed'),
					virtualMemoryTotal : (virtualMemoryTotal2>0?(virtualMemoryTotal2/1024):0),
					virtualDiskTip : virtualDiskUsed+'G',
					virtualDiskUsed : virtualDiskUsed,
					virtualDiskTotal : (virtualDiskTotal2>0?virtualDiskTotal2:0),
					osTip : (osLinux>0?osLinux:''),
					osTotal : (osLinux>0?osLinux:''),
					ipTip : (ipUsed>0?ipUsed:''),
					ipTotal : (ipUsed>0?ipUsed:0),
					userTip : (commonUserTotal>0?commonUserTotal:''),
					userTotal : (commonUserTotal>0?commonUserTotal:0),
					serverTip : (phyMachineErrorNum>0?phyMachineErrorNum:''),
					serverTotal : (phyMachineErrorNum>0?phyMachineErrorNum:0),					
					vmTip : (vmActiveNum>0?vmActiveNum:''),
					vmTotal : (vmActiveNum>0?vmActiveNum:0)
				});	
				globalStackStore.removeAll();
				globalStackStore.loadData(stackChartData);
				vmPieChartData = [];
				vmPieChartData.push({
					vmServerTip : (vmPaidNum>0?vmPaidNum:''),
					vmServerTotal : (vmPaidNum>0?vmPaidNum:0),
				});
				vmPieChartData.push({
					vmServerTip : (vmTrialNum>0?vmTrialNum:''),
					vmServerTotal : (vmTrialNum>0?vmTrialNum:0),
				});
				vmPieChartData.push({
					vmServerTip : (vmOtherNum>0?vmOtherNum:''),
					vmServerTotal : (vmOtherNum>0?vmOtherNum:0),
				});
				vmPieStore.removeAll();
				vmPieStore.loadData(vmPieChartData);
			}
		}
	}		
});

var globalStackStore = Ext.create('Ext.data.Store', {
	fields : [ 'virtualCPUTip', 'virtualCPUUsed', 'virtualCPUApply','virtualCPUTotal',
				'virtualMemoryTip', 'virtualMemoryUsed', 'virtualMemoryApply','virtualMemoryTotal',
				'virtualDiskTip', 'virtualDiskUsed', 'virtualDiskApply','virtualDiskTotal', 'ipTip',
				'ipTotal','userTip', 'userTotal','serverTip','serverTotal',
				'vmTip','vmTotal','osTip','osTotal','virtualCPUUsage','virtualMemoryUsage','virtualDiskUsage' ],
		data : stackChartData
});
var vmPieStore = Ext.create('Ext.data.Store', {
	fields : [ 'vmServerTip','vmServerTotal'],
	data : vmPieChartData
});
//用户统计饼图
var userPieChart = Ext.create('Ext.chart.Chart', {
	animate : true,
	shadow :false,
	store : globalStackStore,
	width : 150,
	height : 150,	
	series : [ {		
		type : 'pie',
		field : 'userTotal',
		colorSet : [ '#ee8800','#26c648'],		
		label : {
			field : 'userTip',
			display : 'rotate',
			contrast : true,
			font : '11px Arial'
		}
	} ]
});
//物理主机统计饼图理
var serverPieChart = Ext.create('Ext.chart.Chart', {
	animate : true,
	shadow :false,
	margin :'0 50 0 0',
	store : globalStackStore,
	width : 150,
	height : 150,	
	series : [ {		
		type : 'pie',
		field : 'serverTotal',
		colorSet : [ '#26c648','#ea1a2a'],		
		label : {
			field : 'serverTip',
			display : 'rotate',
			contrast : true,
			font : '11px Arial'
		}
	} ]
});
//开通业务统计饼图
var vmServerPieChart = Ext.create('Ext.chart.Chart', {
	animate : true,
	shadow :false,
	margin :'0 50 0 0',
	store : vmPieStore,
	width : 150,
	height : 150,
//	theme: 'Base:gradients',
	series : [ {		
		type : 'pie',
		field : 'vmServerTotal',
		colorSet : [ '#26c648','#ee8800','#cbcbcb'],		
		label : {
			field : 'vmServerTip',
			display : 'rotate',
			contrast : true,
			font : '11px Arial'
		}
	} ]
});
//虚拟机统计饼图
var vmPieChart = Ext.create('Ext.chart.Chart', {
	animate : true,
	shadow :false,
	store : globalStackStore,
	width : 150,
	height : 150,	
	series : [ {		
		type : 'pie',
		field : 'vmTotal',
		colorSet : ['#cbcbcb','#ee8800'],		
		label : {
			field : 'vmTip',
			display : 'rotate',
			contrast : true,
			font : '11px Arial'
		}
	} ]
});
//IP统计饼图
var chartIP = Ext.create('Ext.chart.Chart', {
	animate : true,
	shadow :false,
	store : globalStackStore,
	width : 150,
	height : 150,	
	series : [ {		
		type : 'pie',
		field : 'ipTotal',
		colorSet : [ '#cbcbcb','#ee8800'],		
		label : {
			field : 'ipTip',
			display : 'rotate',
			contrast : true,
			font : '11px Arial'
		}
	} ]
});
//os统计饼图
var chartOS = Ext.create('Ext.chart.Chart', {
	animate : true,
	shadow :false,
	store : globalStackStore,
	width : 150,
	height : 150,	
	series : [ {		
		type : 'pie',
		field : 'osTotal',
		colorSet : [ '#ee8800','#26c648'],		
		label : {
			field : 'osTip',
			display : 'rotate',
			contrast : true,
			font : '11px Arial'
		}
	} ]
});
var chartCPU2 = Ext.create('Ext.chart.Chart', {
	animate : true,
	shadow :false,
	store : globalStackStore,
	width : 150,
	height : 150,	
	series : [ {		
		type : 'pie',
		field : 'virtualCPUUsed',
		colorSet : ['#cbcbcb','#ee8800'],		
		label : {
			field : 'virtualCPUTip',
			display : 'rotate',
			contrast : true,
			font : '11px Arial'
		}
	} ]	
	
/*	theme : 'Category7',
	axes : [ {
		type : 'Numeric',
		//title : 'CPU',
		fields : [ 'virtualCPUUsed','virtualCPUTotal'],//, 
		position : 'left',
		minimum : 0,
		majorTickSteps:0,
		//maximum : 100,
		label: {
            renderer: function(v) {
                return String(v).replace(/$/, '');
            }
        }
		//grid : true
	}, {
		type : 'Category',
		position : 'bottom',
		fields : [ 'virtualCPUTip']//
		//grid : true
	} ],
	series : [ {
		axis : 'left',
		type : 'column',
		stacked : true,
		gutter:80,
		label : {
			display : 'insideEnd',
			'text-anchor' : 'middle',
			field : [ 'virtualCPUUsage'],
			color : '#333'
		},
		renderer: function(sprite, storeItem, barAttr, i, store) {
            barAttr.fill = colors[i % colors.length];
            barAttr.x = barAttr.x+(barAttr.width-20)/2;
            barAttr.width = 20;
            return barAttr;
        },
        tips : {
			trackMouse : true,
			width : 65,// 65
			height : 28,// 28
			renderer : function(storeItem, item) {
				this.setTitle(String(Math.ceil(item.value[1])) + 'Core');//
			}
		},
		xField : [ 'virtualCPUTip' ],//[  ],
		yField : [ 'virtualCPUUsed','virtualCPUTotal' ]//
	} ]*/
});

var chartMemory2 = Ext.create('Ext.chart.Chart', {
	animate : true,
	shadow :false,
	store : globalStackStore,
	width : 150,
	height : 150,	
	series : [ {		
		type : 'pie',
		field : 'virtualMemoryUsed',
		colorSet : ['#cbcbcb','#ee8800'],		
		label : {
			field : 'virtualMemoryTip',
			display : 'rotate',
			contrast : true,
			font : '11px Arial'
		}
	} ]		
	
/*	animate : true,
	shadow :false,
	store : globalStackStore,
	width : 200,//180
	height : 125,
	theme : 'Category7',
	axes : [ {
		type : 'Numeric',
		fields : [ 'virtualMemoryUsed','virtualMemoryTotal' ],//,'virtualMemoryTotal'
		position : 'left',
		minimum : 0,
		majorTickSteps:0,		
		label: {
            renderer: function(v) {
                return String(v).replace(/$/, 'G');
            }
        }
	}, {
		type : 'Category',
		position : 'bottom',
		fields : [ 'virtualMemoryTip' ]
	} ],
	series : [ {
		axis : 'left',
		type : 'column',
		stacked : true,
		gutter:80,
		label : {
			display : 'insideEnd',
			'text-anchor' : 'middle',
			field : 'virtualMemoryUsage',
			color : '#333'
		},
		renderer: function(sprite, storeItem, barAttr, i, store) {
            barAttr.fill = colors[i % colors.length];
            barAttr.x = barAttr.x+(barAttr.width-20)/2;
            barAttr.width = 20;            
            return barAttr;
        },
        tips : {
			trackMouse : true,
			width : 65,// 65
			height : 28,// 28
			renderer : function(storeItem, item) {
				this.setTitle(String(Math.ceil(item.value[1])) + 'G');// / 1000000
			}
		},
		xField : [ 'virtualMemoryTip' ],//'virtualMemoryTip'
		yField : [ 'virtualMemoryUsed','virtualMemoryTotal' ]//,'virtualMemoryTotal'
	} ]*/
});

var chartDisk2 = Ext.create('Ext.chart.Chart', {
	animate : true,
	shadow :false,
	store : globalStackStore,
	width : 150,
	height : 150,	
	series : [ {		
		type : 'pie',
		field : 'virtualDiskUsed',
		colorSet : ['#cbcbcb','#ee8800'],		
		label : {
			field : 'virtualDiskTip',
			display : 'rotate',
			contrast : true,
			font : '11px Arial'
		}
	} ]		
	
/*	animate : true,
	shadow :false,
	store : globalStackStore,
	width : 220,//180
	height : 125,
	theme : 'Category7',
	axes : [ {
		type : 'Numeric',
		//title : 'Disk',
		fields : [ 'virtualDiskUsed','virtualDiskTotal' ],//,'virtualDiskTotal'
		position : 'left',
		minimum : 0,
		majorTickSteps:0,
		//maximum : 100,// 10000
		label: {
            renderer: function(v) {
                return String(v).replace(/$/, 'G');
            }
        }
		//grid : true
	}, {
		type : 'Category',
		position : 'bottom',
		fields : [ 'virtualDiskTip' ]
		//grid : true
	} ],
	series : [ {
		axis : 'left',
		type : 'column',
		stacked : true,	
		gutter:80,
		label : {
			display : 'insideEnd',
			'text-anchor' : 'middle',
			field : 'virtualDiskUsage',
			color : '#333'
		},
		renderer: function(sprite, storeItem, barAttr, i, store) {
            barAttr.fill = colors[i % colors.length];
            barAttr.x = barAttr.x+(barAttr.width-20)/2;
            barAttr.width = 20;
            return barAttr;
        },
        tips : {
			trackMouse : true,
			width : 65,// 65
			height : 28,// 28
			renderer : function(storeItem, item) {
				this.setTitle(String(Math.ceil(item.value[1])) + 'G');// / 1000000
			}
		},
		xField : [ 'virtualDiskTip' ],
		yField : [ 'virtualDiskUsed','virtualDiskTotal' ]//,'virtualDiskTotal'
	} ]*/
});

// 用户总数标签
var UserTotalTip = Ext.create('Ext.form.field.Display', {
	width : 40,
	margin :'15 5 0 0',
	fieldLabel : i18n._('Out-line')

});
// 用户在线数标签
var UserOnTip = Ext.create('Ext.form.field.Display', {
	width : 40,
	margin :'15 5 0 0',
	fieldLabel : i18n._('On-line')

});
// 正式用户数
var enterpriseUserNumField = Ext.create('Ext.form.field.Display', {
	width : 150,
	labelWidth:90,
	labelAlign:'right',
	fieldLabel : i18n._('enterpriseUser1'),	
	value : 0	
});
// 个人用户数
var commonUserNumField = Ext.create('Ext.form.field.Display', {
	width : 150,
	labelWidth:90,
	labelAlign:'right',
	fieldLabel : i18n._('commonUser'),
	value : 0	
});

// 物理主机运行数
var phyMachineActiveTip = Ext.create('Ext.form.field.Display', {
	width : 40,
	labelWidth:80,
	margin :'15 5 0 0',
	fieldLabel : i18n._('Run')

});
// 物理主机故障数
var phyMachineErrorTip = Ext.create('Ext.form.field.Display', {
	width : 40,
	labelWidth:80,
	margin :'15 5 0 0',
	fieldLabel : i18n._('fault')

});
// 总物理主机数
var phyMachineNumField = Ext.create('Ext.form.field.Display', {
	width : 150,//200
	html:'<a  href ="#"></a>',
	labelWidth:80,//130
	labelAlign:'right',
	fieldLabel : i18n._('PhysicalHostNumber'),//物理主机数
	value : 0// globalStore.getAt(0).get('virtualMachineNum')	
});
// 总物理主机活动数
var phyMachineActiveNumField = Ext.create('Ext.form.field.Display', {
	width : 150,//200
	labelWidth:65,//130
	labelAlign:'right',
	fieldLabel : i18n._('Run'),//运行良好
	value : 0// globalStore.getAt(0).get('virtualMachineNum')	
});
// 总物理主机故障数
var phyMachineErrorNumField = Ext.create('Ext.form.field.Display', {
	width : 150,//200
	labelWidth:65,//130
	labelAlign:'right',
	fieldLabel : i18n._('fault'),
	value : 0,// globalStore.getAt(0).get('virtualMachineNum')
	name : 'phyMachineErrorNum'
});
//开通总数
var availableVmNumField = Ext.create('Ext.form.field.Display', {
	width : 150,//200
	//html:'<a  href ="#"></a>',
	labelWidth:90,//130
	labelAlign:'right',
	fieldLabel : i18n._('ProvisionTotal'),//物理主机数
	value : 0// globalStore.getAt(0).get('virtualMachineNum')	
});
//正式业务数
var vmPaidNumField = Ext.create('Ext.form.field.Display', {
	width : 150,//200
	//html:'<a  href ="#"></a>',
	labelWidth:70,//130
	labelAlign:'right',
	fieldLabel : i18n._('PaidVm'),//物理主机数
	value : 0// globalStore.getAt(0).get('virtualMachineNum')	
});
 //试用业务数
var vmTrialNumField = Ext.create('Ext.form.field.Display', {
	width : 150,//200
	//html:'<a  href ="#"></a>',
	labelWidth:70,//130
	labelAlign:'right',
	fieldLabel : i18n._('TrailVm'),//物理主机数
	value : 0// globalStore.getAt(0).get('virtualMachineNum')	
});
//管理员创建数
var vmOtherNumField = Ext.create('Ext.form.field.Display', {
	width : 150,//200
	//html:'<a  href ="#"></a>',
	labelWidth:70,//130
	labelAlign:'right',
	fieldLabel : i18n._('OtherVm'),//物理主机数
	value : 0// globalStore.getAt(0).get('virtualMachineNum')	
});
// 虚拟主机总数
var virtualMachineTotalTip = Ext.create('Ext.form.field.Display', {
	width : 40,
	margin :'15 5 0 0',
	fieldLabel : i18n._('stop')

});
// 虚拟主机运行数
var virtualMachineActiveTip = Ext.create('Ext.form.field.Display', {
	width : 40,
	margin :'15 5 0 0',
	fieldLabel : i18n._('Run')

});
// 总虚拟机数
var virtualMachineNumField = Ext.create('Ext.form.field.Display', {
	width : 150,
	labelWidth:80,
	labelAlign:'right',
	fieldLabel : i18n._('vmTotal'),
	value : 0// globalStore.getAt(0).get('virtualMachineNum')	
});
// 总虚拟机活动数
var virtualMachineActiveNumField = Ext.create('Ext.form.field.Display', {
	width : 150,
	labelWidth:80,
	labelAlign:'right',
	fieldLabel : i18n._('Run'),
	value : 0// globalStore.getAt(0).get('virtualMachineNum')	
});
//IP总数
var ipTotalNumField = Ext.create('Ext.form.field.Display', {
	width : 150,
	//margin :'15 0 5 0',
	//html:'<a  href ="#"></a>',
	labelWidth:80,
	labelAlign:'right',
	fieldLabel : i18n._('IPTotal'),//物理主机数
	value : 0// globalStore.getAt(0).get('virtualMachineNum')	
});
//IP使用数
var ipUsedNumField = Ext.create('Ext.form.field.Display', {
	width : 150,
	//html:'<a  href ="#"></a>',
	labelWidth:80,
	labelAlign:'right',
	fieldLabel : i18n._('IPUsed'),//IP使用数
	value : 0// globalStore.getAt(0).get('virtualMachineNum')	
});
//IP空闲数
var ipFreeNumField = Ext.create('Ext.form.field.Display', {
	width : 150,
	//html:'<a  href ="#"></a>',
	labelWidth:80,
	labelAlign:'right',
	fieldLabel : i18n._('IPFree'),//IP空闲数
	value : 0// globalStore.getAt(0).get('virtualMachineNum')	
});
//windows数
var osWindowsNumField = Ext.create('Ext.form.field.Display', {
	width : 150,
	//margin :'15 0 5 0',
	//html:'<a  href ="#"></a>',
	labelWidth:80,
	labelAlign:'right',
	fieldLabel : i18n._('Windows'),//物理主机数
	value : 0// globalStore.getAt(0).get('virtualMachineNum')	
});
//linux数
var osLinuxNumField = Ext.create('Ext.form.field.Display', {
	width : 150,
	//html:'<a  href ="#"></a>',
	labelWidth:80,
	labelAlign:'right',
	fieldLabel : i18n._('Linux'),//物理主机数
	value : 0// globalStore.getAt(0).get('virtualMachineNum')	
});

// 虚拟资源总数
var virtualResourceTotalTip = Ext.create('Ext.form.field.Display', {
	width : 50,
	margin :'15 0 0 0',
	fieldLabel : i18n._('free')//总共
});
// 虚拟资源申请数
var virtualResourceApplyTip = Ext.create('Ext.form.field.Display', {
	width : 50,
	margin :'15 0 0 0',
	fieldLabel : i18n._('Apply')//申请
});
// 虚拟资源申请数
var virtualResourceUsedTip = Ext.create('Ext.form.field.Display', {
	width : 50,
	margin :'15 0 0 0',
	fieldLabel : i18n._('Apply')//使用
});
// #######################################################################
//已使用CPU核数
var virtualCPUTotalField = Ext.create('Ext.form.field.Display', {
	width : 150,
	labelWidth:100,
	labelAlign:'right',
	fieldLabel : i18n._('used_Cpu'),
	value : 0
});
//未使用CPU核数
var virtualCPURemainedField = Ext.create('Ext.form.field.Display', {
	width : 150,
	labelWidth:100,
	labelAlign:'right',
	fieldLabel : i18n._('unused_Cpu'),
	value : 0
});
//已使用内存容量
var virtualMemoryTotalField = Ext.create('Ext.form.field.Display', {
	width : 150,
	labelWidth:90,
	labelAlign:'right',
	fieldLabel : i18n._('used_Memory'),
	value : 0
});
//未使用内存容量
var virtualMemoryRemainedField = Ext.create('Ext.form.field.Display', {
	width : 150,
	labelWidth:90,
	labelAlign:'right',
	fieldLabel : i18n._('unused_Memory'),
	value : 0
});
//已使用存贮容量
var virtualDiskTotalField = Ext.create('Ext.form.field.Display', {
	width : 150,
	labelWidth:100,
	labelAlign:'right',
	fieldLabel : i18n._('used_Disk'),
	value : 0
});
//未使用存贮容量
var virtualDiskRemainedField = Ext.create('Ext.form.field.Display', {
	width : 150,
	labelWidth:100,
	labelAlign:'right',
	fieldLabel : i18n._('unused_Disk'),
	value : 0
});
//#######################################################################
//用户资源
var userPanel = Ext.create('Ext.panel.Panel', {
	title : i18n._('UserResources'),//用户资源
	width : '100%',
	height : '100%',//20%
	margin :'0 10 0 0',
	layout : 'hbox',
	tools:[
	       {
				type:'refresh',
				handler:function(){
					globalViewStore.load();
					//window.parent.document.getElementsByTagName('iframe')[0].src='./hc_admin_globalPage.html';
				}	
	       }
	      ],
	items : [ {
		xtype : 'box', // 或者xtype: 'component',
		width : 75, // 图片宽度
		height : 50, // 图片高度
		margin :'25 0 5 5',
		border : false,
		autoEl : {
			tag : 'img', // 指定为img标签
			src : 'images/user.png' // 指定url路径
									// ../vmcentermanagement/images/User.png
		}
	}, {
		//width : '80%',
		height : '100%',//150
		layout : 'vbox',
		margin :'25 0 5 0',
		border : false,
		items : [
					{
						xtype : 'box',
						width : 15, // 图片宽度
						height : 15, // 图片高度
						margin :'2 0 0 0',
						border : false,
						autoEl : {
							tag : 'img', // 指定为img标签
							src : 'images/orange.png' // 指定url路径
													// ../vmcentermanagement/images/User.png
						}
					  },{
							xtype : 'box',
							width : 15, // 图片宽度
							height : 15, // 图片高度
							margin :'10 0 0 0',
							border : false,
							autoEl : {
								tag : 'img', // 指定为img标签
								src : 'images/green.png' // 指定url路径
														// ../vmcentermanagement/images/User.png
							}
				          }
		        ]
	},	{
		//width : '80%',
		height : '100%',
		margin :'25 0 5 0',
		border : false,
		items : [ enterpriseUserNumField, commonUserNumField ]
	}, userPieChart
	]
});
//服务器资源
var serverPanel=Ext.create('Ext.panel.Panel', {
	title : i18n._('server'),//服务器
	width : '100%',
	//height : '30%',//25%
	margin :'10 17 0 0',
	layout : 'hbox',
	tools:[
	       {
				type:'refresh',
				handler:function(){
					globalViewStore.load();
					//window.parent.document.getElementsByTagName('iframe')[0].src='./hc_admin_globalPage.html';
				}	
	       }
	      ],
	items : [
			{
				xtype : 'box', // 或者xtype: 'component',
				width : 75, // 图片宽度
				height : 50, // 图片高度
				margin :'25 30 5 30',
				border : false,
				autoEl : {
					tag : 'img', // 指定为img标签
					src : 'images/hostServer.png' // 指定url路径
											// ../vmcentermanagement/images/User.png
				}
			},{
				//width : '80%',
				height : '100%',//150
				layout : 'vbox',
				margin :'20 40 5 30',
				border : false,
				items : [
				         	phyMachineNumField,
				         	{
				         		//width : '80%',
								height : '100%',//100
								layout : 'hbox',
								//margin :'5 10 5 10',
								border : false,
								items :[
											{
												//width : '80%',
												height : '100%',//150
												layout : 'vbox',
												//margin :'5 0 5 0',
												border : false,
												items : [
															{
																xtype : 'box',
																width : 15, // 图片宽度
																height : 15, // 图片高度
																margin :'2 0 0 0',
																border : false,
																autoEl : {
																	tag : 'img', // 指定为img标签
																	src : 'images/green.png' // 指定url路径
																							// ../vmcentermanagement/images/User.png
																}
															  },{
																	xtype : 'box',
																	width : 15, // 图片宽度
																	height : 15, // 图片高度
																	margin :'5 0 0 0',
																	border : false,
																	autoEl : {
																		tag : 'img', // 指定为img标签
																		src : 'images/red.png' // 指定url路径
																								// ../vmcentermanagement/images/User.png
																	}
														          }
												        ]
											},
											{
												//width : '80%',
												height : '100%',//100
												//margin :'0 0 0 5',
												border : false,
												items : [ 
														phyMachineActiveNumField,
														phyMachineErrorNumField 
														]
											}
								        ]
				         	}				         	
				        ]
			},
			serverPieChart
			]
});
//业务开通
var vmServerPanel = Ext.create('Ext.panel.Panel', {
	title : i18n._('ServiceProvisioning'),//业务开通
	width : '100%',
	margin :'10 17 0 0',
	//height : '20%',//90
	layout : 'hbox',
	tools:[
	       {
				type:'refresh',
				handler:function(){
					globalViewStore.load();
				}	
	       }
	      ],
	items : [
			{
				xtype : 'box', // 或者xtype: 'component',
				width : 75, // 图片宽度
				height : 50, // 图片高度
				margin :'25 30 5 30',
				border : false,
				autoEl : {
					tag : 'img', // 指定为img标签
					src : 'images/vmServer.png' // 指定url路径
											// ../vmcentermanagement/images/User.png
				}
			},						
			{
				//width : '80%',
				height : '100%',//150
				layout : 'vbox',
				margin :'15 40 5 30',
				border : false,
				items : [
				         	availableVmNumField,
				         	{
				         		//width : '80%',
								height : '100%',//100
								layout : 'hbox',
								//margin :'5 10 5 10',
								border : false,
								items :[
											{
												//width : '80%',
												height : '100%',//150
												layout : 'vbox',
												margin :'0 0 0 5',
												border : false,
												items : [
															{
																xtype : 'box',
																width : 15, // 图片宽度
																height : 15, // 图片高度
																margin :'2 0 0 0',
																border : false,
																autoEl : {
																	tag : 'img', // 指定为img标签
																	src : 'images/green.png' // 指定url路径
																							// ../vmcentermanagement/images/User.png
																}
															  },{
																	xtype : 'box',
																	width : 15, // 图片宽度
																	height : 15, // 图片高度
																	margin :'8 0 0 0',
																	border : false,
																	autoEl : {
																		tag : 'img', // 指定为img标签  
																		src : 'images/orange.png' // 指定url路径
																								// ../vmcentermanagement/images/User.png
																	}
																  },{
																	xtype : 'box',
																	width : 15, // 图片宽度
																	height : 15, // 图片高度
																	margin :'8 0 0 0',
																	border : false,
																	autoEl : {
																		tag : 'img', // 指定为img标签
																		src : 'images/gray.png' // 指定url路径
																								// ../vmcentermanagement/images/User.png
																	}
													          }
												        ]
											},
											{
												//width : '80%',
												height : '100%',//100
												//margin :'0 0 0 5',
												border : false,
												items : [ 
														vmPaidNumField,
														vmTrialNumField,
														vmOtherNumField
														]
											}
								        ]
				         	}				         	
				        ]
			},
			vmServerPieChart
			]
});
var globalForm = Ext.create('Ext.panel.Panel', {
	autoScroll:true,
	height : '100%',
	width : '100%',
	layout : 'vbox',
	scroll :'both',// 'both', 'horizontal' or 'vertical'
	items : [
			{
				xtype : 'panel',
				width : '100%',
				height : '100%',//20%
				layout : 'hbox',
				margin : '10 10 10 10',
				border : false,
				items : [serverPanel,vmServerPanel]//userPanel,
				
			},			
			{
				xtype : 'panel',
				title : i18n._('virt_resource'),//虚拟资源
				width : '100%',
				height : '100%',//180
				margin :'10 10 10 10',
				layout : 'hbox',
				tools:[
				       {
							type:'refresh',
							handler:function(){
								globalViewStore.load();
							}	
				       }
				      ],
				items : [
						{
							xtype : 'box', // 或者xtype: 'component',
							width : 75, // 图片宽度
							height : 50, // 图片高度
							margin :'50 0 0 10',
							border : false,
							autoEl : {
								tag : 'img', // 指定为img标签
								src : 'images/virtualResource.png' // 指定url路径
														// ../vmcentermanagement/images/User.png
							}
						},{
							width : '100%',
							height : '100%',//100
							layout : 'vbox',
							margin :'20 0 0 0',
							border : false,
							items : [
							         {
							        	 margin :'0 2 0 0',
							        	 layout: 'hbox',//饼图
							        	 border: false,
							        	 items:[
												{
													layout : 'vbox',
													margin :'20 0 0 10',
													border : false,
													items : [virtualMachineNumField,virtualMachineActiveNumField] 
												},
												{													
													border :false,
													items :[vmPieChart]
												},{		
													margin :'20 0 0 30',
													border : false,
													items : [ipTotalNumField,ipFreeNumField] //ipUsedNumField,
										         },{										        	 
										        	 border : false,
										        	 items : [ chartIP ]
										         },{		
										        	 margin :'20 0 0 40',
										        	 border : false,
										        	 items : [osWindowsNumField,osLinuxNumField] 
										         },{										        	 
										        	 border : false,
										        	 items : [ chartOS ]
										         }
							        	        ]
							         },{
							        	 margin :'0 2 0 0',
							        	 layout: 'hbox',//饼图
							        	 border: false,
							        	 items:[
												{
													layout : 'vbox',
													margin :'20 0 0 10',
													border : false,
													items : [virtualCPUTotalField,virtualCPURemainedField] 
												},
												{													
													border :false,
													items :[chartCPU2]
												},{		
													margin :'20 0 0 30',
													border : false,
													items : [virtualMemoryTotalField,virtualMemoryRemainedField] 
										         },{										        	 
										        	 border : false,
										        	 items : [ chartMemory2 ]
										         },{		
										        	 margin :'20 0 0 40',
										        	 border : false,
										        	 items : [virtualDiskTotalField,virtualDiskRemainedField] 
										         },{										        	 
										        	 border : false,
										        	 items : [ chartDisk2 ]
										         }
							        	        ]
							         }
									]
						},{							
							layout : 'vbox',
							margin :'30 10 0 20',
							border : false,
							items : [
										{
											  layout : 'hbox',
											  width : '80%',
											  border : false,
											  items:[
														virtualResourceTotalTip,
														{
															xtype : 'box',
															width : 15,
															height : 15,
															margin :'15 0 0 10',
															border : false,
															autoEl : {
																tag : 'img', // 指定为img标签
																src : 'images/gray.png' // 指定url路径
																						// ../vmcentermanagement/images/User.png
															}
														}
											        ]
										}/*,	
										{
											  layout : 'hbox',
											  width : '80%',
											  border : false,
											  items:[
											         virtualResourceApplyTip,
											          {
														xtype : 'box',
														width : 15,
														height : 15,
														margin :'15 0 0 10',
														border : false,
														autoEl : {
															tag : 'img', // 指定为img标签
															src : 'images/green.png' // 指定url路径
																					// ../vmcentermanagement/images/User.png
														}
											          }
											        ]
										}*/,
										{
											  layout : 'hbox',
											  width : '80%',
											  border : false,
											  items:[
														virtualResourceUsedTip,
											          {
														xtype : 'box',
														width : 15,
														height : 15,
														margin :'15 0 0 10',
														border : false,
														autoEl : {
															tag : 'img', // 指定为img标签
															src : 'images/orange.png' // 指定url路径
																					// ../vmcentermanagement/images/User.png
														}
											          }
											        ]
										}	
							         ]
						}]
			} ]
});
function getCookie(name) {
	var arr = document.cookie
			.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
	if (arr != null)
		return unescape(arr[2]);
	return null;
};
function nodeGridShow(){
	tabGlobal.setActiveTab(1);	
};
function instanceGridShow(){
	tabGlobal.setActiveTab(2);	
};
function nodeErrorShow(){
	var nodeStackData = globalViewStore.getAt(0).get('hostError')
	if(nodeStackData != null && nodeStackData.length>0){
		showErrorNode(nodeStackData);
	}	
};
function renderDescn(value, store) {
	// var status =
	// store.getAt(rowIndex).get('usedIPs')/store.getAt(rowIndex).get('totalIPs')*100;
	var val = parseInt(value, 10);
	return "<div style='color:#8DB2E3; background-color:#ffffff;border: 1px #8DB2E3 solid;'><div style='height:12px;width:"
			+ val
			+ "%;background-color:#8DB2E3;border: 0px;color: black;'>"
			+ val + "%</div></div>";
	// pbar.updateProgress(status, status+'% used...');
	// return pbar;
};
function renderDescns(value, cellmeta, record, rowIndex, columnIndex, store) {
	var status = store.getAt(rowIndex).get('usedIPs')
			/ store.getAt(rowIndex).get('totalIPs') * 100;
	var val = parseInt(status, 10);
	return "<div style='color:#8DB2E3; background-color:#ffffff;border: 1px #8DB2E3 solid;'><div style='height:12px;width:"
			+ val
			+ "%;background-color:#8DB2E3;border: 0px;color: black;'>"
			+ val + "%</div></div>";
	// pbar.updateProgress(status, status+'% used...');
	// return pbar;
};