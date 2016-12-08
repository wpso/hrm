//***nodeOutline
var params = getCookie("lang");
i18n.set({
	lang : params,
	path : '../../resources'
});
var v_mask = null;
var barNetHeightRate = 1;//网络监控条形图宽度
var nodeName = getCookie("nodeName");
var colors = ['#26c648','#cbcbcb','#ee8800','#cbcbcb'];
var diskColors = ['#ee8800','#cbcbcb'];
var netColors = ['#ea1a2a','#26c648'];
if (getQuery("nodeName") != null) {
	nodeName = getQuery("nodeName");
}
var CPUlabelStyle={backgroundColor:'#4b4b4b',color:'#FFFFFF',fontSize:'12px',fontWeight:'bold',font:'Arial',padding:'3 0 0 15'};
var CenterCPUlabelStyle={backgroundColor:'#4b4b4b',color:'#FFFFFF',fontSize:'12px',fontWeight:'bold',font:'Arial',padding:'3 0 0 0',textAlign:'center'};
var MEMlabelStyle={backgroundColor:'#4b4b4b',color:'#FFFFFF',fontSize:'12px',fontWeight:'bold',font:'Tahoma',padding:'3 0 0 15'};
var CenterMEMlabelStyle={backgroundColor:'#4b4b4b',color:'#FFFFFF',fontSize:'12px',fontWeight:'bold',font:'Tahoma',padding:'3 0 0 0',textAlign:'center'};
var DisklabelStyle={backgroundColor:'#4b4b4b',color:'#FFFFFF',fontSize:'12px',fontWeight:'bold',font:'Tahoma',padding:'3 0 0 15'};
var ImagelabelStyle={backgroundColor:'#4b4b4b',color:'#FFFFFF',fontSize:'12px',fontWeight:'bold',font:'Tahoma',padding:'3 0 0 5'};
var labelStyle={backgroundColor:'#4b4b4b',color:'#FFFFFF',fontSize:'12px',fontWeight:'bold',font:'Tahoma',padding:'3 0 0 11'};
var IPlabelStyle={backgroundColor:'#EE8800',color:'#FFFFFF',fontSize:'12px',fontWeight:'bold',font:'Arial',padding:'3 0 0 15'};
var NetlabelStyle={backgroundColor:'#4b4b4b',color:'#FFFFFF',fontSize:'12px',fontWeight:'bold',font:'Tahoma',padding:'3 0 0 15'};
var CenterNetlabelStyle={backgroundColor:'#4b4b4b',color:'#FFFFFF',fontSize:'12px',fontWeight:'bold',font:'Tahoma',padding:'3 0 0 0',textAlign:'center'};
if(params=='en_US'){
	MEMlabelStyle={backgroundColor:'#4b4b4b',color:'#FFFFFF',fontSize:'12px',fontWeight:'bold',font:'Arial',padding:'3 0 0 3'};
	NetlabelStyle={backgroundColor:'#4b4b4b',color:'#FFFFFF',fontSize:'12px',fontWeight:'bold',font:'Arial',padding:'3 0 0 3'};
	labelStyle={backgroundColor:'#4b4b4b',color:'#FFFFFF',fontSize:'12px',fontWeight:'bold',font:'Arial',padding:'2 0 0 1'};	
}
Ext.Loader.setConfig({enabled : true});
Ext.require([ 'Ext.data.*', 'Ext.chart.*', 'Ext.layout.container.Fit',
		'Ext.panel.Panel', 'Ext.view.View', 'Ext.grid.*', 'Ext.toolbar.Paging',
		'Ext.selection.CheckboxModel', 'Ext.ux.data.PagingMemoryProxy' ]);

var diskRateValue = null;
var diskTotalValue = null;
var nodePieData = [];// 
var nodeDiskBarData = [];
var nodeNetworkGroupBarData = [];
var nodePieStore = Ext.create('Ext.data.Store', {
	fields : [ 'cpuUsage', 'memoryUsage' ],
	data : nodePieData
});
var nodeDiskBarStore = Ext.create('Ext.data.Store', {
	fields : [ 'diskName', 'diskUsed', 'diskTotal' ],
	data : nodeDiskBarData
});
var nodeNetworkGroupBarStore = Ext.create('Ext.data.Store', {
	fields : [ 'ipName', 'ipRx', 'ipTx', 'ipAll' ],
	data : nodeNetworkGroupBarData
});
var diskData = [];
var barChartData = [];
var CPUValueLabel = Ext.create('Ext.form.Label', {
	text : ''//2.8GHZ
});
var nodeViewStore = Ext.create('Ext.data.Store',{
		fields : [ 'hostId', 'hostName', 'cpuType', 'cpuCore',
				'memory', 'disk', 'ipInner', 'ipOuter', 'cpuRate',
				'memoryRate', 'diskRate', 'cpuUsage',
				'memoryUsage', 'diskDetail', 'networkDetail',
				'virtualCPUUsed', 'virtualCPUApply',
				'virtualCPUTotal', 'virtualMemoryUsed',
				'virtualMemoryApply', 'virtualMemoryTotal',
				'virtualDiskUsed', 'virtualDiskApply',
				'virtualDiskTotal' ],
		autoLoad : false,//true
		proxy : new Ext.data.proxy.Ajax({
			url : path
					+ '/../monitoring/monitor!getHostOverviewInfo.action?hostName='	+ nodeName,
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
			beforeload : function(nodeViewStore,operation, eOpts ){	
				//遮罩层
				v_mask = new Ext.LoadMask(Ext.getBody(), {
					msg : i18n._('please wait'),
					removeMask : true			
				});
				v_mask.show();
			},
			load : function(nodeViewStore, records, successful, eOpts ){
				//遮罩层
//				var v_mask = new Ext.LoadMask(Ext.getBody(), {
//					msg : i18n._('please wait'),
//					removeMask : true			
//				});
				v_mask.hide();
				if(successful && nodeViewStore.getCount()>0){
					var cpuType=nodeViewStore.getAt(0).get('cpuType');
					var cpuCore=nodeViewStore.getAt(0).get('cpuCore');
					var memory=Math.ceil(nodeViewStore.getAt(0).get('memory')/1024);
					CPUValueLabel.update({html:'<div class="TipDiv" data-qtitle="" data-qtip="'+cpuCore+i18n._('core')+'">'+cpuCore+i18n._('core')+'</div>'});	
					MEMValueLabel.update({html:'<div class="TipDiv" data-qtitle="" data-qtip="'+memory+'G'+'">'+memory+'G'+'</div>'});
					DiskValueLabel.update({html:'<div class="TipDiv" data-qtitle="" data-qtip="'+nodeViewStore.getAt(0).get('disk')+'G'+'">'+nodeViewStore.getAt(0).get('disk')+'G'+'</div>'});
					IPValueLabel1.update({html:'<div class="TipDiv" data-qtitle="" data-qtip="'+nodeViewStore.getAt(0).get('ipInner')+'">'+nodeViewStore.getAt(0).get('ipInner')+'</div>'});
					IPValueLabel2.update({html:'<div class="TipDiv" data-qtitle="" data-qtip="'+nodeViewStore.getAt(0).get('ipOuter')+'">'+nodeViewStore.getAt(0).get('ipOuter')+'</div>'});
					//CPUValueLabel.setText(nodeViewStore.getAt(0).get('cpuType'));
					//MEMValueLabel.setText(nodeViewStore.getAt(0).get('memory')+'M');
					//DiskValueLabel.setText(nodeViewStore.getAt(0).get('disk')+'G');
					//IPValueLabel1.setText(nodeViewStore.getAt(0).get('ipInner'));
					//IPValueLabel2.setText(nodeViewStore.getAt(0).get('ipOuter'));
					CPURateLabel.setText('1:'+nodeViewStore.getAt(0).get('cpuRate'));
					MEMRateLabel.setText('1:'+nodeViewStore.getAt(0).get('memoryRate'));
					DiskRateLabel.setText('1:'+nodeViewStore.getAt(0).get('diskRate'));
					
					var cpuUsageRate=nodeViewStore.getAt(0).get('cpuUsage');
					var memoryUsageRate=nodeViewStore.getAt(0).get('memoryUsage');
					//nodePieData.splice(0,1);//清空数组
					nodePieData= [] ;
					nodePieData.push({
						cpuUsage:(cpuUsageRate>100?100:cpuUsageRate),
						memoryUsage:(memoryUsageRate>100?100:memoryUsageRate)
					});
					nodePieStore.loadData(nodePieData);
					
					var disk = nodeViewStore.getAt(0).get('diskDetail');
					var hAxis = nodeDiskstackchart.axes.get(0);
					var diskMaximum = null;
					//nodeDiskBarData.splice(0,3);//清空数组
					nodeDiskBarData=[];
					for(var i=0;i<disk.length;i++){	
						var diskTotal1=disk[i].diskTotal-disk[i].diskUsed;
						var diskUsed = disk[i].diskUsed;
						//100G
						if(disk[i].diskTotal<=100){
							diskMaximum = (diskMaximum>=100?diskMaximum:100);							
						}
						//500G
						if(disk[i].diskTotal<=500 && disk[i].diskTotal>100){
							diskMaximum = (diskMaximum>=500?diskMaximum:500);							
						}
						//1T
						if(disk[i].diskTotal<=1024 && disk[i].diskTotal>500){
							//diskUsed = disk[i].diskUsed/1024;
							diskMaximum = (diskMaximum>=1024?diskMaximum:1024);							
						}
						//10T
						if(disk[i].diskTotal<=10240 && disk[i].diskTotal>1024){
							diskMaximum = (diskMaximum>=10240?diskMaximum:10240);
						}
						//100T
						if(disk[i].diskTotal<=102400 && disk[i].diskTotal>10240){
							diskMaximum = (diskMaximum>=102400?diskMaximum:102400);
						}
						//500T
						if(disk[i].diskTotal<=512000 && disk[i].diskTotal>102400){
							diskMaximum = (diskMaximum>=102400?diskMaximum:512000);
						}
						//1P
						if(disk[i].diskTotal<=1048576 && disk[i].diskTotal>512000){
							diskMaximum = (diskMaximum>=1048576?diskMaximum:1048576);
						}
						nodeDiskBarData.push({
							diskName:disk[i].diskName,
							diskUsed:disk[i].diskUsed,
							diskTotal:(diskTotal1>0?diskTotal1:0)//disk[i].diskTotal-disk[i].diskUsed
						});
					}					
					hAxis.maximum=diskMaximum;
					nodeDiskBarStore.removeAll();
					nodeDiskBarStore.loadData(nodeDiskBarData);
					
					var network = nodeViewStore.getAt(0).get('networkDetail');
					var nAxis = nodeNetworkGroupBarchart.axes.get(0);
					var netMaximum = null;
					//nodeNetworkGroupBarData.splice(0,2);//清空数组
					nodeNetworkGroupBarData = [];
					for(var i=0;i<network.length;i++){
						//50k
						if(network[i].netRx<=50){
							netMaximum = (netMaximum>=50?netMaximum:50);
							netMaximum = (netMaximum>=network[i].netTx?netMaximum:50);
						}
						//100k
						if(network[i].netRx<=100 && network[i].netRx>50){
							netMaximum = (netMaximum>=100?netMaximum:100);
							netMaximum = (netMaximum>=network[i].netTx?netMaximum:100);
						}
						//500k
						if(network[i].netRx<=500 && network[i].netRx>100){
							netMaximum = (netMaximum>=500?netMaximum:500);
							netMaximum = (netMaximum>=network[i].netTx?netMaximum:500);
						}
						//1M
						if(network[i].netRx<=1000 && network[i].netRx>500){
							netMaximum = (netMaximum>=1000?netMaximum:1000);
							netMaximum = (netMaximum>=network[i].netTx?netMaximum:1000);
						}
						//10M
						if(network[i].netRx<=10000 && network[i].netRx>1000){
							netMaximum = (netMaximum>=10000?netMaximum:10000);
							netMaximum = (netMaximum>=network[i].netTx?netMaximum:10000);
						}
						//100M
						if(network[i].netRx<=100000 && network[i].netRx>10000){
							netMaximum = (netMaximum>=100000?netMaximum:100000);
							netMaximum = (netMaximum>=network[i].netTx?netMaximum:100000);
						}
						//500M
						if(network[i].netRx<=500000 && network[i].netRx>100000){
							netMaximum = (netMaximum>=500000?netMaximum:500000);
							netMaximum = (netMaximum>=network[i].netTx?netMaximum:500000);
						}
						//1G
						if(network[i].netRx<=1000000 && network[i].netRx>500000){
							netMaximum = (netMaximum>=1000000?netMaximum:1000000);
							netMaximum = (netMaximum>=network[i].netTx?netMaximum:1000000);
						}
						//10G
						if(network[i].netRx<=10000000 && network[i].netRx>1000000){
							netMaximum = (netMaximum>=10000000?netMaximum:10000000);
							netMaximum = (netMaximum>=network[i].netTx?netMaximum:10000000);
						}
						//100G
						if(network[i].netRx<=100000000 && network[i].netRx>10000000){
							netMaximum = (netMaximum>=100000000?netMaximum:100000000);
							netMaximum = (netMaximum>=network[i].netTx?netMaximum:100000000);
						}
						//500G
						if(network[i].netRx<=500000000 && network[i].netRx>100000000){
							netMaximum = (netMaximum>=500000000?netMaximum:500000000);
							netMaximum = (netMaximum>=network[i].netTx?netMaximum:500000000);
						}
						//alert(netMaximum);
						nodeNetworkGroupBarData.push({
							ipName:network[i].netName,
							ipRx:network[i].netRx,
							ipTx:network[i].netTx,
							ipAll:network[i].netTotal
						});
					}
					nAxis.maximum=netMaximum;
					nodeNetworkGroupBarStore.removeAll();
					nodeNetworkGroupBarStore.loadData(nodeNetworkGroupBarData);
					var virtualCPUTotal1=nodeViewStore.getAt(0).get('virtualCPUTotal')-nodeViewStore.getAt(0).get('virtualCPUApply');
					var virtualMemoryTotal1 = nodeViewStore.getAt(0).get('virtualMemoryTotal')-nodeViewStore.getAt(0).get('virtualMemoryApply');
					var virtualDiskTotal1 = nodeViewStore.getAt(0).get('virtualDiskTotal')-nodeViewStore.getAt(0).get('virtualDiskApply');
					var virtualCPUTotal2 = nodeViewStore.getAt(0).get('virtualCPUTotal')-nodeViewStore.getAt(0).get('virtualCPUUsed');
					var virtualMemoryTotal2 = nodeViewStore.getAt(0).get('virtualMemoryTotal')-nodeViewStore.getAt(0).get('virtualMemoryUsed');
					var virtualDiskTotal2 = nodeViewStore.getAt(0).get('virtualDiskTotal')-nodeViewStore.getAt(0).get('virtualDiskUsed');
					//barChartData.splice(0,2);//清空数组
					barChartData = [];
					barChartData.push({
						virtualCPUTip : virtualCPUTotal2+'core',
						virtualCPUTotal : virtualCPUTotal2,
						virtualMemoryTip : virtualMemoryTotal2+'M',
						virtualMemoryTotal : virtualMemoryTotal2,
						virtualDiskTip : virtualDiskTotal2+'G',
						virtualDiskTotal : virtualDiskTotal2
					});
					barChartData.push({
						virtualCPUTip : nodeViewStore.getAt(0).get(
								'virtualCPUUsed')+'core',
						virtualCPUTotal : nodeViewStore.getAt(0).get(
						'virtualCPUUsed'),
						virtualMemoryTip : nodeViewStore.getAt(0).get(
								'virtualMemoryUsed')+'M',
						virtualMemoryTotal :  nodeViewStore.getAt(0).get(
						'virtualMemoryUsed'),
						virtualDiskTip : nodeViewStore.getAt(0).get(
								'virtualDiskUsed')+'G',
						virtualDiskTotal : nodeViewStore.getAt(0).get(
						'virtualDiskUsed'),
					});	
					barChartStore.removeAll();
					barChartStore.loadData(barChartData);
				}
			}
		}
});
var barChartStore = Ext.create('Ext.data.Store', {
	fields : [ 'virtualCPUTip', 'virtualCPUUsed', 'virtualCPUTotal',
			'virtualMemoryTip', 'virtualMemoryUsed', 'virtualMemoryTotal',
			'virtualDiskTip', 'virtualDiskUsed', 'virtualDiskTotal'
			],
	data : barChartData
});
var nodePieStore = Ext.create('Ext.data.Store', {
	fields : [ 'cpuUsage', 'memoryUsage' ],
	data : nodePieData
});

var CPUValueContainer = Ext.create('Ext.form.FieldContainer', {
	width : '100%',
	height : 30,
	layout : 'hbox',
	items : [ {
		xtype : 'label',
		width : 80,
		height : 22,
		margin :'0 10 0 0',
		text :i18n._('CPU'),//'CPU',
		style:CPUlabelStyle
	}, CPUValueLabel ]
});
var MEMValueLabel = Ext.create('Ext.form.Label', {
	text : ''//4G
});
var MEMValueContainer = Ext.create('Ext.form.FieldContainer', {
	width : '100%',
	height : 30,
	layout : 'hbox',
	items : [ {
		xtype : 'label',
		width : 80,
		height : 22,
		margin :'0 10 0 0',
		text :i18n._('Memory'),//'Memory',
		style:MEMlabelStyle		
	}, MEMValueLabel ]
});
var DiskValueLabel = Ext.create('Ext.form.Label', {
	text : ''//500G
});
var DiskValueContainer = Ext.create('Ext.form.FieldContainer', {
	width : '100%',
	height : 30,
	layout : 'hbox',
	items : [ {
		xtype : 'label',
		width : 80,
		height : 22,
		margin :'0 10 0 0',
		text :i18n._('SharedStorage'),//'SharedStorage',
		style:DisklabelStyle		
	}, DiskValueLabel ]
});
var IPValueLabel1 = Ext.create('Ext.form.Label', {
	text : ''//192.168.5.6
});
var IPValueContainer1 = Ext.create('Ext.form.FieldContainer', {
	width : '100%',
	height : 30,
	layout : 'hbox',
	items : [ {
		xtype : 'label',
		width : 80,
		height : 22,
		margin :'0 10 0 0',
		text :i18n._('IP1'),//'IP1',
		style:IPlabelStyle
	}, IPValueLabel1 ]
});
var IPValueLabel2 = Ext.create('Ext.form.Label', {
	text : ''//192.168.5.69
});
var IPValueContainer2 = Ext.create('Ext.form.FieldContainer', {
	width : '100%',
	height : 30,
	layout : 'hbox',
	items : [ {
		xtype : 'label',
		width : 80,
		height : 22,
		margin :'0 10 0 0',
		text :i18n._('IP1'),//'IP1',
		style:IPlabelStyle
	}, IPValueLabel2 ]
});
var CPURateLabel = Ext.create('Ext.form.Label', {
	text : ''//1:10
});
var CPURateContainer = Ext.create('Ext.form.FieldContainer', {
	width : '100%',
	height : 30,
	layout : 'hbox',
	items : [ {
		xtype : 'label',
		width : 80,
		height : 22,
		margin :'0 10 0 0',
		text :i18n._('CPU_libit'),//'CPU',
		style:CPUlabelStyle
	}, CPURateLabel ]
});
var MEMRateLabel = Ext.create('Ext.form.Label', {
	text : ''//1:10
});
var MEMRateContainer = Ext.create('Ext.form.FieldContainer', {
	width : '100%',
	height : 30,
	layout : 'hbox',
	items : [ {
		xtype : 'label',
		width : 80,
		height : 22,
		margin :'0 10 0 0',
		text :i18n._('Memory'),//'Memory',
		style:MEMlabelStyle
	}, MEMRateLabel ]
});
var DiskRateLabel = Ext.create('Ext.form.Label', {
	text : ''//1:10
});
var DiskRateContainer = Ext.create('Ext.form.FieldContainer', {
	width : '100%',
	height : 30,
	layout : 'hbox',
	items : [ {
		xtype : 'label',
		width : 80,
		height : 22,
		margin :'0 10 0 0',
		text :i18n._('SharedStorage'),//'SharedStorage',
		style:DisklabelStyle
	}, DiskRateLabel ]
});
var nodeCPUpiechart = Ext.create('Ext.chart.Chart', {
	style : 'background:#fff',
	margin :'0 10 0 10',
	animate : {
		easing : 'bounceOut',
		duration : 500
	},
	insetPadding : 25,
	store : nodePieStore,// renodePhyResourceStore,nodePhyResourceStore
	width : 185,// 200
	height : 170,//150
	//theme:'Red',
	axes : [ {
		type : 'gauge',
		title:'(%)',
		position : 'gauge',
		minimum : 0,
		maximum : 100,
		steps : 10,
		margin : 7,
		label: {
            renderer: function(v) {
                return String(v).replace(/$/, '');
            }
        }
	} ],
	series : [ {
		type : 'gauge',
		field : 'cpuUsage',
		donut : 80,
		colorSet : [ '#ee8800', '#cbcbcb' ]// '#3AA8CB', '#ddd'
	} ]
});

var nodeMEMpiechart = Ext.create('Ext.chart.Chart', {
	style : 'background:#fff',
	margin :'0 10 0 10',
	animate : {
		easing : 'bounceOut',
		duration : 500
	},
	insetPadding : 25,
	store : nodePieStore,// renodePhyResourceStore,nodePhyResourceStore
	width : 185,// 200
	height : 170,//150
	axes : [ {
		type : 'gauge',
		title:'(%)',
		position : 'gauge',
		minimum : 0,
		maximum : 100,
		steps : 10,
		margin : 7,
		label: {
            renderer: function(v) {
                return String(v).replace(/$/, '');
            }
        }
	} ],
	series : [ {
		type : 'gauge',
		field : 'memoryUsage',
		donut : 80,
		colorSet : [ '#ee8800', '#cbcbcb' ]//'#3AA8CB', '#ddd'
	} ]
});
//var colors = ['#ee8800','#00ff00'];
var nodeDiskstackchart = Ext.create('Ext.chart.Chart', {
	style : 'background:#fff',
	margin :'0 0 0 10',
	animate : true,
	shadow :false,
	theme : 'Category7',
//	legend : {
//		position : 'right'
//	},	
	store : nodeDiskBarStore,// renodePhyResourceStore,nodePhyResourceStore
	width : 185,// 200
	height : 170,//150
	axes : [ {
		type : 'Numeric',
		minimum : 0,
		majorTickSteps:0,
		fields : [ 'diskUsed', 'diskTotal'],//, 'diskTotal'
		position : 'bottom',
		label: {
            renderer: function(v) { 
            	if(v==0){
            		return String(v).replace(/$/, '');
            	}
            	if((v>500)){
            		return String(v/1024).replace(/$/, 'T');
            	}else{
            		return String(v).replace(/$/, 'G');
            	} 
               //return String(v).replace(/$/, 'G');
            }
        }
	}, {
		type : 'Category',
		position : 'left',
		fields : [ 'diskName' ]		
	} ],
	series : [ {
		axis : 'bottom',
		type : 'bar',
		//gutter : 80,// 80
		stacked : true,
		xField : [ 'diskName' ],
		yField : [ 'diskUsed', 'diskTotal' ],//, 'diskTotal'
		renderer: function(sprite, storeItem, barAttr, i, store) {
	      barAttr.fill = diskColors[i % diskColors.length];
	      barAttr.y = barAttr.y+(barAttr.height-15)/2;
	      if ((i % 2) == 1) {
	    	  barAttr.x = barAttr.x+1;
	      }
	      barAttr.height = 15;
	      return barAttr;
		},
		tips : {
			trackMouse : true,
			width : 100,// 65
			height : 28,// 28
			renderer : function(storeItem, item) {
				//alert('@@'+item.value[1]);
				if((item.value[1]>500)){
					var val = Ext.util.Format.round(item.value[1]/1024,3);
            		//return String(item.value[1]/1024).replace(/$/, 'T');
            		this.setTitle(String(val) + 'T');// / 1000000
            	}else{
            		var val = Ext.util.Format.round(item.value[1],3);
            		this.setTitle(String(val) + 'G');// / 1000000
            		//this.setTitle(String(Math.ceil(item.value[1])) + 'G');// / 1000000
            	}
				//this.setTitle(String(Math.ceil(item.value[1])) + 'G');// / 1000000
			}
		}
	} ]
});

var nodeNetworkGroupBarchart = Ext.create('Ext.chart.Chart', {
	style : 'background:#fff',
	margin :'0 0 0 10',
	animate : true,
	shadow :false,
	width : 185,// 200
	height : 170,//150
	theme : 'Category7',
//	legend : {
//		position : 'right'
//	},
	store : nodeNetworkGroupBarStore,
	axes : [ {
		type : 'Numeric',
		position : 'bottom',
		minimum : 0,
		//maximum:1073741824,
		majorTickSteps:0,
		fields : [ 'ipRx', 'ipTx' ],//, 'ipAll'
		label: {
            renderer: function(v) {
                //return String(Math.ceil(v/1024)).replace(/$/, 'Kbps');
            	var val=Math.ceil(v);///1000
            	if(val==0){
            		return String(val).replace(/$/, '');
            	}
            	if((val<=1000000 && val>1000)){
            		return String(val/1000).replace(/$/, 'M');
            	}else if((val<=1000 && val>0)){
            		return String(val).replace(/$/, 'K');
            	}else{
            		return String(val/1000/1000).replace(/$/, 'G');
            	} 
            }
        }
	}, {
		type : 'Category',
		position : 'left',
		fields : [ 'ipName' ]
	} ],
	series : [ {
		axis : 'bottom',
		type : 'bar',
		gutter : 80,// 80
		//stacked : true,
		xField : [ 'ipName' ],
		yField : [ 'ipRx', 'ipTx' ],//, 'ipAll'
		renderer: function(sprite, storeItem, barAttr, i, store) {
			if(store.getCount()>0){
				barNetHeightRate=1/store.getCount();
			}
	      barAttr.fill = netColors[i % netColors.length];
	      barAttr.y = barAttr.y+(barAttr.height-15*barNetHeightRate)/2;
	      barAttr.height = 15*barNetHeightRate;
	      return barAttr;
		},
		tips : {
			trackMouse : true,
			width : 100,// 65
			height : 28,// 28
			renderer : function(storeItem, item) {
				//this.setTitle(String(Math.ceil(item.value[1]/1024)) + 'Kbps');// / 1000000
				var rxVal = Math.ceil(item.value[1]);///1000
				if((rxVal<=1000000 && rxVal>1000)){
					var val = Ext.util.Format.round(rxVal/1024,2);
            		this.setTitle(String(val) + 'M');// / 1000000
            	}else if((rxVal<=1000 && rxVal>=0)){
            		this.setTitle(String(rxVal) + 'K');// / 1000000
            	}else{
            		var val = Ext.util.Format.round(rxVal/1024/1024,2);
            		this.setTitle(String(val) + 'G');
            	}
			}
		}
	/*
	 * tips: { trackMouse: true, width: 65,//65 height: 28,//28 renderer:
	 * function(storeItem, item) { this.setTitle(String(item.value[1]) + 'G');// /
	 * 1000000 } }
	 */
	} ]
});

// 虚拟资源图
var nodeCPUBarchart = Ext.create('Ext.chart.Chart', {
	animate : true,
	shadow :false,
	store : barChartStore,
	width : 150,
	height : 170,	
	margin :'0 0 0 65',	
	series : [ {		
		type : 'pie',
		field : 'virtualCPUTotal',
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
	store : barChartStore,// renodePhyResourceStore,nodePhyResourceStore
	width : 200,
	height : 150,
	margin :'10 20 0 25',
	theme : 'Category7',
//    legend: {
//		position: 'right',
//	},
	axes : [ {
		type : 'Numeric',
		fields : [ 'virtualCPUUsed','virtualCPUTotal' ],//,'virtualCPUTotal'
		position : 'left',
		minimum : 0,		
		//maximum : 4,
		majorTickSteps:0,
		label: {
            renderer: function(v) {
                return String(v).replace(/$/, 'core');
            }
        }
	}, {
		type : 'Category',
		position : 'bottom',
		fields : [ 'virtualCPUTip' ],
		grid : true
	} ],
	series : [ {
		axis : 'left',
		type : 'column',
		stacked : true,
		gutter:80,
//		label : {
//			display : 'insideEnd',
//			'text-anchor' : 'middle',
//			field : 'virtualCPUUsed',
//			renderer : Ext.util.Format.numberRenderer('0'),
//			orientation : 'vertical',
//			color : '#333'
//		},
		renderer: function(sprite, storeItem, barAttr, i, store) {
            barAttr.fill = colors[i % colors.length];
            barAttr.x = barAttr.x+(barAttr.width-15)/2;
            barAttr.width = 15;
            return barAttr;
        },
        tips : {
			trackMouse : true,
			width : 100,// 65
			height : 28,// 28
			renderer : function(storeItem, item) {
				this.setTitle(String(Math.ceil(item.value[1])) + 'Core');// / 1000000
			}
		},
		xField : [ 'virtualCPUTip' ],
		yField : [ 'virtualCPUUsed','virtualCPUTotal' ],//,'virtualCPUTotal'
		stacked: true
	} ]*/
});

var nodeMemoryBarchart = Ext.create('Ext.chart.Chart', {
	animate : true,
	shadow :false,
	store : barChartStore,
	width : 150,
	height : 170,	
	margin :'0 0 0 65',	
	series : [ {		
		type : 'pie',
		field : 'virtualMemoryTotal',
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
	store : barChartStore,
	width : 200,
	height : 150,
	margin :'10 20 0 20',
	theme : 'Category7',
	axes : [ {
		type : 'Numeric',
		fields : [ 'virtualMemoryUsed','virtualMemoryTotal' ],//,'virtualMemoryTotal'
		position : 'left',
		minimum : 0,
		//maximum : 100,
		majorTickSteps:0,
		label: {
            renderer: function(v) {
                return String(v).replace(/$/, 'G');
            }
        }
	}, {
		type : 'Category',
		position : 'bottom',
		fields : [ 'virtualMemoryTip' ],
		grid : true
	} ],
	series : [ {
		axis : 'left',
		type : 'column',
		stacked : true,
		gutter:80,
//		label : {
//			display : 'insideEnd',
//			'text-anchor' : 'middle',
//			field : 'virtualMemoryUsed',
//			renderer : Ext.util.Format.numberRenderer('0'),
//			orientation : 'vertical',
//			color : '#333'
//		},
		renderer: function(sprite, storeItem, barAttr, i, store) {
            barAttr.fill = colors[i % colors.length];
            barAttr.x = barAttr.x+(barAttr.width-15)/2;
            barAttr.width = 15;
            return barAttr;
        },
        tips : {
			trackMouse : true,
			width : 100,// 65
			height : 28,// 28
			renderer : function(storeItem, item) {
				this.setTitle(String(Math.ceil(item.value[1])) + 'G');// / 1000000
			}
		},
		xField : [ 'virtualMemoryTip' ],
		yField : [ 'virtualMemoryUsed','virtualMemoryTotal' ]//,'virtualMemoryTotal'
	} ]*/
});

var nodeDiskBarchart = Ext.create('Ext.chart.Chart', {
	animate : true,
	shadow :false,
	store : barChartStore,
	width : 150,
	height : 170,	
	margin :'0 0 0 65',	
	series : [ {		
		type : 'pie',
		field : 'virtualDiskTotal',
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
	store : barChartStore,
	width : 200,
	height : 150,
	margin :'10 20 0 20',
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
		fields : [ 'virtualDiskTip' ],
		grid : true
	} ],
	series : [ {
		axis : 'left',
		type : 'column',
		stacked : true,
		gutter:80,
//		label : {
//			display : 'insideEnd',
//			'text-anchor' : 'middle',
//			field : 'virtualDiskUsed',
//			renderer : Ext.util.Format.numberRenderer('0'),
//			orientation : 'vertical',
//			color : '#333'
//		},
		renderer: function(sprite, storeItem, barAttr, i, store) {
            barAttr.fill = colors[i % colors.length];
            barAttr.x = barAttr.x+(barAttr.width-15)/2;
            barAttr.width = 15;
            return barAttr;
        },
        tips : {
			trackMouse : true,
			width : 100,// 65
			height : 28,// 28
			renderer : function(storeItem, item) {
				this.setTitle(String(Math.ceil(item.value[1])) + 'G');// / 1000000
			}
		},
		xField : [ 'virtualDiskTip' ],
		yField : [ 'virtualDiskUsed' ,'virtualDiskTotal']//,'virtualDiskTotal'
	} ]*/
});
//虚拟资源总数
var virtualResourceTotalTip = Ext.create('Ext.form.field.Display', {
	width : 50,
	margin :'15 10 0 20',
	fieldLabel : i18n._('free')//总共
});
// 虚拟资源申请数
var virtualResourceApplyTip = Ext.create('Ext.form.field.Display', {
	width : 50,
	margin :'15 10 0 20',
	fieldLabel : i18n._('Apply')//申请
});
// 虚拟资源申请数
var virtualResourceUsedTip = Ext.create('Ext.form.field.Display', {
	width : 50,
	margin :'15 10 0 20',
	fieldLabel : i18n._('Apply')//使用
});
var nodeViewPanel = Ext.create('Ext.panel.Panel', {// Ext.panel.Panel
	layout : 'border',
	//autoScroll:true,
	//scroll :'vertical',
	items : [ 
	{
		region : 'west',
		xtype : 'panel',
		frame : true,
		title : i18n._('host_overAll_basicInfo'),//基本信息
		width : '15%',
		items : [ {
			xtype : 'label',
			width : '100%',
			text : i18n._('hostInfo')//主机信息
		}, CPUValueContainer, MEMValueContainer, DiskValueContainer, {

		}, {
			xtype : 'label',
			width : '100%',
			text : i18n._('vm_ip')//IP地址,IPValueContainer1,
		},  IPValueContainer2, {

		}, {
			xtype : 'label',
			width : '100%',
			text : i18n._('ResourceRatio')//资源配比
		}, CPURateContainer, MEMRateContainer, DiskRateContainer ]
	},
	{
		region : 'center',
		xtype : 'panel',
		autoScroll:true,
		scroll :'horizontal',
		width : '100%',
		//height : '100%',
		layout : 'vbox',
		items : [ {
			xtype : 'panel',
			title : i18n._('Current status of server'),//服务器当前状态
			width : '100%',
			//height : '33%',
			layout : 'hbox',
			items : [ {
				xtype : 'panel',
				width : '100%',
				//height : '80%',
				layout : 'vbox',				
				border : false,
				items : [ 
				          nodeCPUpiechart,
				          {
				        	xtype : 'label',
				        	margin :'0 0 10 65',
				      		width : 80,
				      		height : 22,
				      		text :i18n._('CPU'),//'CPU',
				    		style:CenterCPUlabelStyle
//				      		autoEl: {
//				      	        tag: 'img',
//				      	        src: 'images/cpu.png'
//				      	    }
				          } 
				         ]			
			}, {
				width : '25%',
				//height : '80%',
				layout : 'vbox',
				border : false,
				items : [ 
				          nodeMEMpiechart,
				          {
					        	xtype : 'label',
					        	margin :'0 0 10 65',
					        	width : 80,
					      		height : 22,
					      		text :i18n._('Memory'),//'Memory',
					    		style:CenterMEMlabelStyle
//					      		autoEl: {
//					      	        tag: 'img',
//					      	        src: 'images/mem.png'
//					      	    }
					      } 
				        ]			
			}, {
				width : '25%',
				//height : '80%',
				layout : 'vbox',
				border : false,
				items : [ 
				          nodeDiskstackchart,
				          {
					        	xtype : 'label',
					        	margin :'0 0 10 80',
					        	width : 80,
					      		height : 22,
					      		text :i18n._('localStorage'),//'SharedStorage',
					    		style:DisklabelStyle
//					      		autoEl: {
//					      	        tag: 'img',
//					      	        src: 'images/disk.png'
//					      	    }
					      }
				        ]			
			}, {
				width : '25%',
				//height : '80%',
				layout : 'vbox',
				border : false,
				items : [ 
				          nodeNetworkGroupBarchart,
				          {
					        	xtype : 'label',
					        	margin :'0 0 10 110',
					        	width : 80,
					      		height : 22,
					      		text:i18n._('Flow'),
					      		style:CenterNetlabelStyle
//					      		autoEl: {
//					      	        tag: 'img',
//					      	        src: 'images/net.png'
//					      	    }
					      }
				        ]			
			},{
				width :'25%',
				layout : 'vbox',
				border :false,
				items :[
				        {
				        	width : '80%',
							layout : 'hbox',
							//height : 100,
							margin :'0 0 0 0',
							border : false,
							items : [
							         	{
							         		xtype :'displayfield',
							         		width : 50,
							         		margin :'15 5 0 10',
							         		fieldLabel : i18n._('used')//使用
							         	},
							         	{
											xtype : 'box',
											margin :'15 15 0 5',
											border : false,
											autoEl : {
												tag : 'img', // 指定为img标签
												src : 'images/orange.png' // 指定url路径																		
											}
										}
							        ]
				        },
				        {
				        	width : '80%',
							layout : 'hbox',
							//height : 100,
							margin :'0 0 0 0',
							border : false,
							items : [
							         	{
							         		xtype :'displayfield',
							         		width : 50,
							         		margin :'15 5 0 10',
							         		fieldLabel : i18n._('free')//总数
							         	},
							         	{
											xtype : 'box',
											margin :'15 15 0 5',
											border : false,
											autoEl : {
												tag : 'img', // 指定为img标签
												src : 'images/gray.png' // 指定url路径																		
											}
										}
							        ]
				        },
				        {
				        	width : '80%',
							layout : 'hbox',
							//height : 100,
							margin :'0 0 0 0',
							border : false,
							items : [
							         	{
							         		xtype :'displayfield',
							         		width : 50,
							         		margin :'15 5 0 10',
							         		fieldLabel : i18n._('Rx')//总数
							         	},
							         	{
											xtype : 'box',
											margin :'15 15 0 5',
											border : false,
											autoEl : {
												tag : 'img', // 指定为img标签
												src : 'images/red.png' // 指定url路径																		
											}
										}
							        ]
				        },
				        {
				        	width : '80%',
							layout : 'hbox',
							//height : 100,
							margin :'0 0 0 0',
							border : false,
							items : [
							         	{
							         		xtype :'displayfield',
							         		width : 50,
							         		margin :'15 5 0 10',
							         		fieldLabel : i18n._('Tx')//总数
							         	},
							         	{
											xtype : 'box',
											margin :'15 15 0 5',
											border : false,
											autoEl : {
												tag : 'img', // 指定为img标签
												src : 'images/green.png' // 指定url路径																		
											}
										}
							        ]
				        }
				       ]
			} ]
		}, {
			xtype : 'panel',
			title : i18n._('virt_resource'),//虚拟资源
			width : '1000',
			height : '50%',
			layout : 'hbox',
			items : [ {
				//layout : 'fit',
				xtype : 'panel',
				//width : '100%',
				width : '1200px',
				//height : '80%',
				layout : 'vbox',
				border : false,
				items : [ 
				          nodeCPUBarchart,
				          {
					        	xtype : 'label',
					        	margin :'0 0 10 100',
					        	width : 80,
					      		height : 22,
					      		text :i18n._('CPU'),//'CPU',
					    		style:CenterCPUlabelStyle
//					      		autoEl: {
//					      	        tag: 'img',
//					      	        src: 'images/cpu.png'
//					      	    }
					      }
				        ]			
			}, {
				width : '43%',
				//height : '80%',
				layout : 'vbox',
				border : false,
				items : [ 
				          nodeMemoryBarchart,
				          {
					        	xtype : 'label',
					        	margin :'0 0 10 100',
					        	width : 80,
					      		height : 22,
					      		text :i18n._('Memory'),//'Memory',
					    		style:CenterMEMlabelStyle
//					      		autoEl: {
//					      	        tag: 'img',
//					      	        src: 'images/mem.png'
//					      	    }
					      }
				        ]			
			}, {
				width : '43%',
				//height : '80%',
				layout : 'vbox',
				border : false,
				items : [ 
				          nodeDiskBarchart,
				          {
					        	xtype : 'label',
					        	margin :'0 0 10 100',
					        	width : 80,
					      		height : 22,
					      		text :i18n._('SharedStorage'),//'SharedStorage',
					    		style:DisklabelStyle
//					      		autoEl: {
//					      	        tag: 'img',
//					      	        src: 'images/disk.png'
//					      	    }
					      }
				        ]			
			}, {
				width : '80%',
				border : false,
				items : [ 
							{
								width : '100%',
								layout : 'hbox',
								//height : 100,
								margin :'0 0 0 0',
								border : false,
								items : [
								         	virtualResourceTotalTip,
								         	{
												xtype : 'box',
												margin :'15 70 0 10',
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
								width : '80%',
								layout : 'hbox',
								//height : 100,
								margin :'0 0 0 0',
								border : false,
								items : [
								         	virtualResourceApplyTip,
								         	{
												xtype : 'box',
												margin :'15 70 0 10',
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
								width : '100%',
								layout : 'hbox',
								//height : 100,
								margin :'0 0 0 0',
								border : false,
								items : [
								         	virtualResourceUsedTip,
								         	{
												xtype : 'box',
												margin :'15 70 0 10',
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
			} ]
		}
//		, 
//		{
//			xtype : 'panel',
//			title : i18n._('Event'),//事件
//			width : '100%',
//			height : '33%',
//			layout : 'hbox',
//			items : [ {
//				xtype : 'label',
//				width : '4.8%',
//				height : 1
//			} ]
//		}
		]
	} 
	]
});

function renderDescn(value, cellmeta, record, rowIndex, columnIndex, store) {
	var name = store.getAt(rowIndex).get('name');
	var ip = store.getAt(rowIndex).get('ip');
	var str = '<table><tr><td><img width=124 height=84 src=../../images/'
			+ value + '.jpg></td></tr><tr><td><span>' + i18n._('vm_name') + ':'
			+ name + '</span></td></tr><tr><td><span>' + i18n._('vm_ip') + ':'
			+ ip + '</span></td></tr><tr><td><span>' + i18n._('status') + ':'
			+ value + '</span></td></tr></table>';
	return str;
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
var nodeViewRunner = new Ext.util.TaskRunner();
var nodeViewTask = nodeViewRunner.newTask({
    run: function () {
    	//节点概述刷新
    	if(nodeViewPanel.isVisible()){
    		nodeViewStore.load();
    	}   	    	
    },
    interval: 1000*refreshPeriod
});
nodeViewTask.start();