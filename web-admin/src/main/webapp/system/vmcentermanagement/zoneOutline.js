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
var zoneCode = getCookie("zoneCode");
if (getQuery("zoneCode") != null) {
	zoneCode = getQuery("zoneCode");
}
var colors = ['#26c648','#cbcbcb','#ee8800','#cbcbcb'];
Ext.require([ 'Ext.data.*', 'Ext.form.*', 'Ext.panel.Panel', 'Ext.view.View',
		'Ext.layout.container.Fit', 'Ext.toolbar.Paging',
		'Ext.selection.CheckboxModel', 'Ext.tip.QuickTipManager',
		'Ext.ux.data.PagingMemoryProxy', 'Ext.ux.form.SearchField',
		'Ext.window.Window', 'Ext.tab.*', 'Ext.toolbar.Spacer',
		'Ext.layout.container.Card', 'Ext.layout.container.Border' ]);
var stackChartData = [];
var vmPieChartData = [];
var vmCountColors = ['#ea1a2a','#26c648','#ee8800'];
var zoneViewStore = Ext.create('Ext.data.Store',{
	autoLoad : false,//true
	fields : [ 'id', 'theoreticalValue','theoreticalInfo',
	           'hostTotal', 'hostActiveNum', 'vmActiveNum','vmTotal','vmOtherNum', 
	           'virtualCPUUsed', 'virtualCPUApply','virtualCPUTotal', 
	           'virtualMemoryUsed','virtualMemoryApply', 'virtualMemoryTotal',
	           'virtualDiskUsed', 'virtualDiskApply','virtualDiskTotal', 
	           'expandDiskTotal','expandDiskUsed','ipUsed', 'ipTotal','ipFree',
	           'vmPaidNum','vmTrialNum','vmWindowsNum','vmLinuxNum' ],
	sortInfo : {
		field : 'id',
		direction : 'ASC'
	},
	proxy : new Ext.data.proxy.Ajax({
		url : path+ '/../monitoring/oss!getZoneOverviewInfo.action?zoneCode='+ zoneCode,
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
		beforeload : function(zoneViewStore,operation, eOpts ){							
			//遮罩层
			v_mask = new Ext.LoadMask(Ext.getBody(), {
				msg : i18n._('please wait')
			});
			v_mask.show();
		},
		load : function(zoneViewStore, records, successful, eOpts ){
			v_mask.hide();
			if(successful && zoneViewStore.getCount()>0){
				var vmCreatedNum=zoneViewStore.getAt(0).get('vmTotal');
				var vmCreatingNum=zoneViewStore.getAt(0).get('theoreticalValue');
				
				vmCreateTotalNumField.setValue(vmCreatedNum+vmCreatingNum);
				vmCreatingNumField.setValue(vmCreatingNum);
				
				var hostActiveNum=zoneViewStore.getAt(0).get('hostActiveNum');
				phyMachineNumField.setValue('<a  href ="#" onclick=nodeGridShow()>'+zoneViewStore.getAt(0).get('hostTotal')+'</a>');
				phyMachineActiveNumField.setValue(hostActiveNum);
				
				var phyMachineErrorNum = zoneViewStore.getAt(0).get('hostTotal')-hostActiveNum;
				phyMachineErrorNumField.setValue(phyMachineErrorNum);

				var phyMachineActiveRate = (hostActiveNum/zoneViewStore.getAt(0).get('hostTotal'));
				
				var vmActiveNum=zoneViewStore.getAt(0).get('vmActiveNum');
				virtualMachineNumField.setValue('<a  href ="#" onclick=instanceGridShow()>'+zoneViewStore.getAt(0).get('vmTotal')+'</a>');
				virtualMachineActiveNumField.setValue(vmActiveNum);
				var virtualMachineErrorNum = zoneViewStore.getAt(0).get('vmTotal')-vmActiveNum;

				var virtualMachineActiveRate = (vmActiveNum/zoneViewStore.getAt(0).get('vmTotal'));
				
				var availableVmNum = zoneViewStore.getAt(0).get('vmTotal');
				availableVmNumField.setValue(availableVmNum);
				vmPaidNumField.setValue(zoneViewStore.getAt(0).get('vmPaidNum'));
				vmTrialNumField.setValue(zoneViewStore.getAt(0).get('vmTrialNum'));
				vmOtherNumField.setValue(zoneViewStore.getAt(0).get('vmOtherNum'));
				
				var osWindows=zoneViewStore.getAt(0).get('vmWindowsNum');
				var osLinux=zoneViewStore.getAt(0).get('vmLinuxNum');
				osWindowsNumField.setValue(osWindows);
				osLinuxNumField.setValue(osLinux);
				
				var virtualCPUTotal = zoneViewStore.getAt(0).get('virtualCPUTotal');
				var virtualMemoryTotal = zoneViewStore.getAt(0).get('virtualMemoryTotal');
				var virtualDiskTotal = zoneViewStore.getAt(0).get('virtualDiskTotal');

				var virtualCPUTotal1=virtualCPUTotal-zoneViewStore.getAt(0).get('virtualCPUApply');
				var virtualMemoryTotal1 = virtualMemoryTotal-zoneViewStore.getAt(0).get('virtualMemoryApply');
				var virtualDiskTotal1 = virtualDiskTotal-zoneViewStore.getAt(0).get('virtualDiskApply');
				var virtualCPUTotal2 = virtualCPUTotal-zoneViewStore.getAt(0).get('virtualCPUUsed');
				var virtualMemoryTotal2 = virtualMemoryTotal-zoneViewStore.getAt(0).get('virtualMemoryUsed');
				var virtualDiskTotal2 = virtualDiskTotal-zoneViewStore.getAt(0).get('virtualDiskUsed');
				
				virtualCPUTotalField.setValue(zoneViewStore.getAt(0).get('virtualCPUUsed'));
				virtualCPURemainedField.setValue(virtualCPUTotal2);
				virtualMemoryTotalField.setValue(zoneViewStore.getAt(0).get('virtualMemoryUsed')+'M');
				virtualMemoryRemainedField.setValue(virtualMemoryTotal2+'M');
				virtualDiskTotalField.setValue(zoneViewStore.getAt(0).get('virtualDiskUsed'));
				virtualDiskRemainedField.setValue(virtualDiskTotal2);
				
				var virtualCPUUsage1='';
				var virtualCPUUsage2='';
				if(virtualCPUTotal>0){
					virtualCPUUsage1= Ext.util.Format.round((zoneViewStore.getAt(0).get('virtualCPUApply')/virtualCPUTotal)*100,2)+'%';
					virtualCPUUsage2= Ext.util.Format.round((zoneViewStore.getAt(0).get('virtualCPUUsed')/virtualCPUTotal)*100,2)+'%';
				}
				var virtualMemoryUsage1='';
				var virtualMemoryUsage2='';
				if(virtualMemoryTotal>0){
					virtualMemoryUsage1= Ext.util.Format.round((zoneViewStore.getAt(0).get('virtualMemoryApply')/virtualMemoryTotal)*100,2)+'%';
					virtualMemoryUsage2= Ext.util.Format.round((zoneViewStore.getAt(0).get('virtualMemoryUsed')/virtualMemoryTotal)*100,2)+'%';
				}
				var virtualDiskUsage1='';
				var virtualDiskUsage2='';
				if(virtualDiskTotal>0){
					virtualDiskUsage1= Ext.util.Format.round((zoneViewStore.getAt(0).get('virtualDiskApply')/virtualDiskTotal)*100,2)+'%';
					virtualDiskUsage2= Ext.util.Format.round((zoneViewStore.getAt(0).get('virtualDiskUsed')/virtualDiskTotal)*100,2)+'%';
				}
				
				var expandDiskTotal1=zoneViewStore.getAt(0).get('expandDiskTotal')-zoneViewStore.getAt(0).get('expandDiskUsed');
				
				var ipUsed=zoneViewStore.getAt(0).get('ipUsed');
				var ipFree=zoneViewStore.getAt(0).get('ipFree');
				var ipDisabled=zoneViewStore.getAt(0).get('ipTotal')-zoneViewStore.getAt(0).get('ipUsed');
				ipTotalNumField.setValue(zoneViewStore.getAt(0).get('ipTotal'));
				ipUsedNumField.setValue(ipUsed);
				ipFreeNumField.setValue(ipFree);
				var vmPaidNum=zoneViewStore.getAt(0).get('vmPaidNum');
				var vmTrialNum=zoneViewStore.getAt(0).get('vmTrialNum');
				var vmOtherNum=zoneViewStore.getAt(0).get('vmOtherNum');
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
					virtualMemoryTotal : (virtualMemoryTotal1>0?(virtualMemoryTotal1):0),
					virtualDiskTip : virtualDiskTotal2+'G',
					virtualDiskUsed : virtualDiskTotal2,
					virtualDiskTotal : (virtualDiskTotal1>0?virtualDiskTotal1:0),
					osTip : (osWindows>0?osWindows:''),
					osTotal : (osWindows>0?osWindows:''),
					expandDiskTip : zoneViewStore.getAt(0).get('expandDiskUsed'),
					expandDiskUsed : zoneViewStore.getAt(0).get('expandDiskUsed'),
					expandDiskTotal : (expandDiskTotal1>0?expandDiskTotal1:0),
					ipTip : (ipFree>0?ipFree:''),//zoneViewStore.getAt(0).get('ipTotal'),
					ipTotal : (ipFree>0?ipFree:0),//zoneViewStore.getAt(0).get('ipTotal')
					userTip : (vmCreatedNum>0?vmCreatedNum:''),
					userTotal : (vmCreatedNum>0?vmCreatedNum:0),
					serverTip : (hostActiveNum>0?hostActiveNum:''),
					serverTotal : (hostActiveNum>0?hostActiveNum:0),
					vmTip : (virtualMachineErrorNum>0?virtualMachineErrorNum:''),
					vmTotal : (virtualMachineErrorNum>0?virtualMachineErrorNum:0)									
				});
				
				stackChartData.push({
							virtualCPUUsage:virtualCPUUsage2,
							virtualMemoryUsage:virtualMemoryUsage2,
							virtualDiskUsage:virtualDiskUsage2,
							virtualCPUTip : zoneViewStore.getAt(0).get('virtualCPUUsed'),
							virtualCPUUsed : zoneViewStore.getAt(0).get(
									'virtualCPUUsed'),
							virtualCPUTotal : (virtualCPUTotal2>0?virtualCPUTotal2:0),
							virtualMemoryTip : zoneViewStore.getAt(0).get(
									'virtualMemoryUsed')+'M',
							virtualMemoryUsed : zoneViewStore.getAt(0).get(
									'virtualMemoryUsed'),
							virtualMemoryTotal : (virtualMemoryTotal2>0?(virtualMemoryTotal2):0),
							virtualDiskTip : zoneViewStore.getAt(0).get(
									'virtualDiskUsed')+'G',
							virtualDiskUsed : zoneViewStore.getAt(0).get(
									'virtualDiskUsed'),
							virtualDiskTotal : (virtualDiskTotal2>0?virtualDiskTotal2:0),
							osTip : (osLinux>0?osLinux:''),
							osTotal : (osLinux>0?osLinux:''),
							expandDiskTip : 0,
							expandDiskUsed : 0,
							expandDiskTotal : (zoneViewStore.getAt(0).get('expandDiskTotal')>0?zoneViewStore.getAt(0).get('expandDiskTotal'):0),
							ipTip : (ipUsed>0?ipUsed:''),
							ipTotal : (ipUsed>0?ipUsed:0),
							userTip : (vmCreatingNum>0?vmCreatingNum:''),
							userTotal : (vmCreatingNum>0?vmCreatingNum:0),
							serverTip : (phyMachineErrorNum>0?phyMachineErrorNum:''),
							serverTotal : (phyMachineErrorNum>0?phyMachineErrorNum:0),
							vmTip : (vmActiveNum>0?vmActiveNum:''),
							vmTotal : (vmActiveNum>0?vmActiveNum:0)
						});	
				zoneStackStore.removeAll();
				zoneStackStore.loadData(stackChartData);
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
var zoneStackStore = Ext.create('Ext.data.Store', {
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
//资源域资源统计饼图
var zonePieChart = Ext.create('Ext.chart.Chart', {
	animate : true,
	shadow :false,
	store : zoneStackStore,
	width : 150,
	height : 150,	
	series : [ {		
		type : 'pie',
		field : 'userTotal',
		colorSet : [ '#ee8800','#cbcbcb'],	//#26c648	
		label : {
			field : 'userTip',
			display : 'rotate',
			contrast : true,
			font : '11px Arial'
		}
	} ]
});

//物理主机统计饼图
var serverPieChart = Ext.create('Ext.chart.Chart', {
	animate : true,
	shadow :false,
	margin :'0 50 0 0',
	store : zoneStackStore,
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
	series : [ {		
		type : 'pie',
		field : 'vmServerTotal',
		showInLegend: true,
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
	store : zoneStackStore,
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
	store : zoneStackStore,
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
	store : zoneStackStore,
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
	store : zoneStackStore,
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
	
/*	animate : true,
	shadow :false,
	store : zoneStackStore,// 
	width : 200,//180
	height : 125,
	theme : 'Category7',
	axes : [ {
		type : 'Numeric',
		fields : [ 'virtualCPUUsed','virtualCPUTotal'],//, 
		position : 'left',
		minimum : 0,
		majorTickSteps:0,
		label: {
            renderer: function(v) {
                return String(v).replace(/$/, '');
            }
        }
	}, {
		type : 'Category',
		position : 'bottom',
		fields : [ 'virtualCPUTip']
	} ],
	series : [ {
		axis : 'left',
		type : 'column',
		stacked : true,
		gutter:80,
		label : {
			display : 'insideEnd',
			'text-anchor' : 'middle',
			field : [ 'virtualCPUUsage'],//
			//renderer : Ext.util.Format.numberRenderer('0'),
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
				this.setTitle(String(Math.ceil(item.value[1])) + 'Core');// / 1000000
			}
		},
		xField : [ 'virtualCPUTip' ],//[  ],
		yField : [ 'virtualCPUUsed','virtualCPUTotal' ]//[ 'virtualCPUUsed' ]//,'virtualCPUTotal'
	} ]*/
});

var chartMemory2 = Ext.create('Ext.chart.Chart', {
	animate : true,
	shadow :false,
	store : zoneStackStore,
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
	store : zoneStackStore,
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
//			renderer : Ext.util.Format.numberRenderer('0'),
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
	store : zoneStackStore,
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
	store : zoneStackStore,
	width : 220,//180
	height : 125,
	theme : 'Category7',
	axes : [ {
		type : 'Numeric',
		fields : [ 'virtualDiskUsed','virtualDiskTotal' ],//,'virtualDiskTotal'
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
		fields : [ 'virtualDiskTip' ]
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
//			renderer : Ext.util.Format.numberRenderer('0'),
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
var chartExtDisk = Ext.create('Ext.chart.Chart', {
	animate : true,
	shadow :false,
	store : zoneStackStore,
	width : 200,//180
	height : 125,
	theme : 'Category7',
	axes : [ {
		type : 'Numeric',
		fields : [ 'expandDiskUsed','expandDiskTotal' ],//,'virtualDiskTotal'
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
		fields : [ 'expandDiskTip' ]
	} ],
	series : [ {
		axis : 'left',
		type : 'column',
		stacked : true,	
		gutter:80,
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
		xField : [ 'expandDiskTip' ],
		yField : [ 'expandDiskUsed','expandDiskTotal' ]//,'virtualDiskTotal'
	} ]
});


// 总共可创建的虚拟机数
var vmCreateTotalNumField = Ext.create('Ext.form.field.Display', {
	width : 150,
	labelWidth:90,
	labelAlign:'right',
	fieldLabel : i18n._('expectedToCreateTotal'),	
	value : 0	
});
// 还能创建的虚拟机数
var vmCreatingNumField = Ext.create('Ext.form.field.Display', {
	width : 150,
	labelWidth:90,
	labelAlign:'right',
	fieldLabel : i18n._('expectedToCreate'),
	value : 0	
});
// 总物理主机数
var phyMachineNumField = Ext.create('Ext.form.field.Display', {
	width : 150,//200
	html:'<a  href ="#"></a>',
	labelWidth:80,//150
	labelAlign:'right',
	fieldLabel : i18n._('PhysicalHostNumber'),//物理主机数
	value : 0// 
});
// 总物理主机活动数
var phyMachineActiveNumField = Ext.create('Ext.form.field.Display', {
	width : 150,//200
	labelWidth:65,//150
	labelAlign:'right',
	fieldLabel : i18n._('Run'),//运行良好
	value : 0// 	
});
// 总物理主机故障数
var phyMachineErrorNumField = Ext.create('Ext.form.field.Display', {
	width : 150,//200
	labelWidth:65,//150
	labelAlign:'right',
	fieldLabel : i18n._('fault'),
	value : 0,// 
	name : 'phyMachineErrorNum'
});
//开通总数
var availableVmNumField = Ext.create('Ext.form.field.Display', {
	width : 150,//200
	labelWidth:90,//150
	labelAlign:'right',
	fieldLabel : i18n._('ProvisionTotal'),//
	value : 0// 
});
//正式业务数
var vmPaidNumField = Ext.create('Ext.form.field.Display', {
	width : 150,//200
	labelWidth:70,//150
	labelAlign:'right',
	fieldLabel : i18n._('PaidVm'),//
	value : 0// 
});
//试用业务数
var vmTrialNumField = Ext.create('Ext.form.field.Display', {
	width : 150,//200
	//html:'<a  href ="#"></a>',
	labelWidth:70,//150
	labelAlign:'right',
	fieldLabel : i18n._('TrailVm'),//物理主机数
	value : 0// globalStore.getAt(0).get('virtualMachineNum')	
});
//管理员创建数
var vmOtherNumField = Ext.create('Ext.form.field.Display', {
	width : 150,//200
	//html:'<a  href ="#"></a>',
	labelWidth:70,//150
	labelAlign:'right',
	fieldLabel : i18n._('OtherVm'),//物理主机数
	value : 0// globalStore.getAt(0).get('virtualMachineNum')	
});

// 总虚拟机数
var virtualMachineNumField = Ext.create('Ext.form.field.Display', {
	width : 150,
	labelWidth:80,
	labelAlign:'right',
	fieldLabel : i18n._('vmTotal'),
	value : 0// 
});
// 总虚拟机活动数
var virtualMachineActiveNumField = Ext.create('Ext.form.field.Display', {
	width : 150,
	labelWidth:80,
	labelAlign:'right',
	fieldLabel : i18n._('Run'),
	value : 0// 
});
//IP总数
var ipTotalNumField = Ext.create('Ext.form.field.Display', {
	width : 170,
	labelWidth:90,
	labelAlign:'right',
	fieldLabel : i18n._('IPTotal'),//
	value : 0// 
});
//IP使用数
var ipUsedNumField = Ext.create('Ext.form.field.Display', {
	width : 170,
	labelWidth:90,
	labelAlign:'right',
	fieldLabel : i18n._('IPUsed'),//
	value : 0// 
});
//IP空闲数
var ipFreeNumField = Ext.create('Ext.form.field.Display', {
	width : 170,
	//html:'<a  href ="#"></a>',
	labelWidth:90,
	labelAlign:'right',
	fieldLabel : i18n._('IPFree'),//IP空闲数
	value : 0//
});
//windows数
var osWindowsNumField = Ext.create('Ext.form.field.Display', {
	width : 150,
	labelWidth:80,
	labelAlign:'right',
	fieldLabel : i18n._('Windows'),//
	value : 0// 
});
//linux数
var osLinuxNumField = Ext.create('Ext.form.field.Display', {
	width : 150,
	labelWidth:80,
	labelAlign:'right',
	fieldLabel : i18n._('Linux'),//
	value : 0// 
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
// 虚拟资源使用数
var virtualResourceUsedTip = Ext.create('Ext.form.field.Display', {
	width : 50,
	margin :'15 0 0 0',
	fieldLabel : i18n._('Apply')//申请	
//	fieldLabel : i18n._('used')//使用
});

//#######################################################################
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
	width : 170,
	labelWidth:100,
	labelAlign:'right',
	fieldLabel : i18n._('used_Memory'),
	value : 0
});
//未使用内存容量
var virtualMemoryRemainedField = Ext.create('Ext.form.field.Display', {
	width : 170,
	labelWidth:100,
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

//服务器资源
var serverPanel=Ext.create('Ext.panel.Panel', {
	title : i18n._('server'),//服务器
	width : '100%',
	margin :'0 18 0 0',
	layout : 'hbox',
	tools:[
	       {
				type:'refresh',
				handler:function(){
					zoneViewStore.load();
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
	//height : '20%',//90
	layout : 'hbox',
	tools:[
	       {
				type:'refresh',
				handler:function(){
					zoneViewStore.load();
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
				}
			},						
			{
				//width : '80%',
				height : '100%',//150
				layout : 'vbox',
				margin :'20 40 5 30',
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
																}
															  },{
																	xtype : 'box',
																	width : 15, // 图片宽度
																	height : 15, // 图片高度
																	margin :'5 0 0 0',
																	border : false,
																	autoEl : {
																		tag : 'img', // 指定为img标签
																		src : 'images/orange.png' // 指定url路径
																	}
															  },{
																	xtype : 'box',
																	width : 15, // 图片宽度
																	height : 15, // 图片高度
																	margin :'5 0 0 0',
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
var zonePanel = Ext.create('Ext.panel.Panel', {
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
				items : [serverPanel,vmServerPanel]//virtualResourcePanel,
				
			},			
			{
				xtype : 'panel',
				title : i18n._('virt_resource'),//虚拟资源
				width : '100%',
				height : '100%',//180
				margin :'0 10 10 10',
				layout : 'hbox',
				tools:[
				       {
							type:'refresh',
							handler:function(){
								zoneViewStore.load();
							}	
				       }
				      ],
				items : [
						{
							xtype : 'box', // 或者xtype: 'component',
							width : 75, // 图片宽度
							height : 50, // 图片高度
							margin :'100 0 0 10',
							border : false,
							autoEl : {
								tag : 'img', // 指定为img标签
								src : 'images/virtualResource.png' // 指定url路径
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
						},					
						{							
							layout : 'vbox',
							margin :'50 10 0 20',
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
														}
											          }
											        ]
										}	
							         ]
						}]
			} ]
});
function nodeGridShow(){
	tabZone.setActiveTab(1);	
};
function instanceGridShow(){
	tabZone.setActiveTab(2);	
};
var zoneViewRunner = new Ext.util.TaskRunner();
var zoneViewTask = zoneViewRunner.newTask({
    run: function () {
    	//资源域概述刷新
    	if(zonePanel.isVisible()){
    		zoneViewStore.load();
    	} 	    	
    },
    interval: 1000*refreshPeriod
});
zoneViewTask.start();