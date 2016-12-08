//***vmOutline
var params = getCookie("lang");
i18n.set({
	lang : params,
	path : '../../resources'
});
var v_mask = null;
var CPUlabelStyle={backgroundColor:'#4b4b4b',color:'#FFFFFF',fontSize:'12px',fontWeight:'bold',font:'Arial',padding:'3 0 0 15'};
var MEMlabelStyle={backgroundColor:'#4b4b4b',color:'#FFFFFF',fontSize:'12px',fontWeight:'bold',font:'Tahoma',padding:'3 0 0 15'};
var DisklabelStyle={backgroundColor:'#4b4b4b',color:'#FFFFFF',fontSize:'12px',fontWeight:'bold',font:'Tahoma',padding:'3 0 0 15'};
var extDisklabelStyle={backgroundColor:'#4b4b4b',color:'#FFFFFF',fontSize:'12px',fontWeight:'bold',font:'Tahoma',padding:'3 0 0 9'};
var ImagelabelStyle={backgroundColor:'#4b4b4b',color:'#FFFFFF',fontSize:'12px',fontWeight:'bold',font:'Tahoma',padding:'3 0 0 15'};
var labelStyle={backgroundColor:'#4b4b4b',color:'#FFFFFF',fontSize:'12px',fontWeight:'bold',font:'Tahoma',padding:'3 0 0 15'};
var IPlabelStyle={backgroundColor:'#EE8800',color:'#FFFFFF',fontSize:'12px',fontWeight:'bold',font:'Arial',padding:'3 0 0 15'};
var NetlabelStyle={backgroundColor:'#4b4b4b',color:'#FFFFFF',fontSize:'12px',fontWeight:'bold',font:'Tahoma',padding:'3 0 0 15'};
if(params=='en_US'){
	MEMlabelStyle={backgroundColor:'#4b4b4b',color:'#FFFFFF',fontSize:'12px',fontWeight:'bold',font:'Arial',padding:'3 0 0 3'};
	ImagelabelStyle={backgroundColor:'#4b4b4b',color:'#FFFFFF',fontSize:'12px',fontWeight:'bold',font:'Arial',padding:'3 0 0 5'};
	labelStyle={backgroundColor:'#4b4b4b',color:'#FFFFFF',fontSize:'12px',fontWeight:'bold',font:'Arial',padding:'2 0 0 3'};
	extDisklabelStyle={backgroundColor:'#4b4b4b',color:'#FFFFFF',fontSize:'12px',fontWeight:'bold',font:'Arial',padding:'3 0 0 5'};
	NetlabelStyle={backgroundColor:'#4b4b4b',color:'#FFFFFF',fontSize:'12px',fontWeight:'bold',font:'Arial',padding:'3 0 0 3'};
}
var vmID = getCookie("vmID");
if (getQuery("vmID") != null) {
	vmID = getQuery("vmID");
}
Ext.Loader.setConfig({
	enabled : true
});
Ext.require([ 'Ext.data.*', 'Ext.chart.*', 'Ext.layout.container.Fit',
		'Ext.panel.Panel', 'Ext.view.View', 'Ext.grid.*', 'Ext.toolbar.Paging',
		'Ext.selection.CheckboxModel', 'Ext.ux.data.PagingMemoryProxy','Ext.tip.*' ]);
Ext.QuickTips.init();
var vmPieData = [];// 
var vmDiskBarData = [];
var vmNetworkGroupBarData = [];
var colors = ['#26c648','#cbcbcb','#ee8800','#cbcbcb'];
var diskColors = ['#ee8800','#cbcbcb'];
var netColors = ['#ea1a2a','#26c648'];
var vmPieStore = Ext.create('Ext.data.Store', {
	fields : [ 'cpuUsage', 'memoryUsage' ],
	data : vmPieData
});
var vmDiskBarStore = Ext.create('Ext.data.Store', {
	fields : [ 'diskName', 'diskUsed', 'diskTotal' ],
	data : vmDiskBarData
});
var vmNetworkGroupBarStore = Ext.create('Ext.data.Store', {
	fields : [ 'ipName', 'ipRx', 'ipTx', 'ipAll' ],
	data : vmNetworkGroupBarData
});

var CPUValueLabel = Ext.create('Ext.form.Label', {
	text : ''
});
var vmViewStore = Ext.create('Ext.data.Store', {
	autoLoad : false,//true
	fields : [ 'vmId', 'vmName', 'cpuType', 'cpuCore', 'memory', 'disk',
			'ipInner', 'ipOuter', 'image', 'catalog', 'cpuUsage',
			'memoryUsage', 'diskDetail', 'networkDetail' ],
	proxy : new Ext.data.proxy.Ajax({
		url : path + '/../monitoring/monitor!getVmOverviewInfo.action?vmId='
				+ vmID,
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
		beforeload : function(vmViewStore,operation, eOpts ){	
			//遮罩层
			v_mask = new Ext.LoadMask(Ext.getBody(), {
				msg : i18n._('please wait'),
				removeMask : true			
			});
			v_mask.show();
		},
		load : function(vmViewStore, records, successful, eOpts ){
			//遮罩层
			v_mask = new Ext.LoadMask(Ext.getBody(), {
				msg : i18n._('please wait'),
				removeMask : true			
			});
			v_mask.hide();
			if(successful && vmViewStore.getCount()>0){
				westPanel.setTitle('<div class="TipDiv" data-qtitle="" data-qtip="'+vmViewStore.getAt(0).get('vmName')+'">'+vmViewStore.getAt(0).get('vmName')+'</div>');
				var cpuDetail = '';
				if(vmViewStore.getAt(0).get('cpuType')==null || vmViewStore.getAt(0).get('cpuType')==''){
					cpuDetail = vmViewStore.getAt(0).get('cpuCore')+i18n._('core');
				}else{
					cpuDetail = vmViewStore.getAt(0).get('cpuType')+'×'+vmViewStore.getAt(0).get('cpuCore')+i18n._('core');
				}
				var IPOuter='';
				if(vmViewStore.getAt(0).get('ipOuter')!=null){
					IPOuter = vmViewStore.getAt(0).get('ipOuter');
				}
				CPUValueLabel.update({html:'<div class="TipDiv" data-qtitle="" data-qtip="'+cpuDetail+'">'+cpuDetail+'</div>'});
				MEMValueLabel.update({html:'<div class="TipDiv" data-qtitle="" data-qtip="'+vmViewStore.getAt(0).get('memory')+'M'+'">'+vmViewStore.getAt(0).get('memory')+'M'+'</div>'});
				DiskValueLabel.update({html:'<div class="TipDiv" data-qtitle="" data-qtip="'+vmViewStore.getAt(0).get('disk')+'G'+'">'+vmViewStore.getAt(0).get('disk')+'G'+'</div>'});
				IPValueLabel1.update({html:'<div class="TipDiv" data-qtitle="" data-qtip="'+vmViewStore.getAt(0).get('ipInner')+'">'+vmViewStore.getAt(0).get('ipInner')+'</div>'});
				IPValueLabel2.update({html:'<div class="TipDiv" data-qtitle="" data-qtip="'+IPOuter+'">'+IPOuter+'</div>'});
				ImageLabel.update({html:'<div class="TipDiv" data-qtitle="" data-qtip="'+vmViewStore.getAt(0).get('image')+'">'+vmViewStore.getAt(0).get('image')+'</div>'});
				taocanLabel.update({html:'<div class="TipDiv" data-qtitle="" data-qtip="'+vmViewStore.getAt(0).get('catalog')+'">'+Ext.util.Format.ellipsis(vmViewStore.getAt(0).get('catalog'),10)+'</div>'});
				//CPUValueLabel.setText(vmViewStore.getAt(0).get('cpuType'));				
				//MEMValueLabel.setText(vmViewStore.getAt(0).get('memory')+'M');
				//DiskValueLabel.setText(vmViewStore.getAt(0).get('disk')+'G');
				//IPValueLabel1.setText(vmViewStore.getAt(0).get('ipInner'));
				//IPValueLabel2.setText(vmViewStore.getAt(0).get('ipOuter'));
				//ImageLabel.setText(vmViewStore.getAt(0).get('image'));
				//taocanLabel.setText(Ext.util.Format.ellipsis(vmViewStore.getAt(0).get('catalog'),10));
				var extDisk=new String('');
				var cpuUsageRate=vmViewStore.getAt(0).get('cpuUsage');
				var memoryUsageRate=vmViewStore.getAt(0).get('memoryUsage');	
				//vmPieData.splice(0,1);//清空数组
				vmPieData = [];
				vmPieData.push({
					cpuUsage:(cpuUsageRate>100?100:cpuUsageRate),
					memoryUsage:(memoryUsageRate>100?100:memoryUsageRate)
				});
				vmPieStore.loadData(vmPieData);
				var disk = vmViewStore.getAt(0).get('diskDetail');
				var hAxis = vmDiskstackchart.axes.get(0);
				var diskMaximum = null;
				//vmDiskBarData.splice(0,3);//清空数组
				vmDiskBarData = [];
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
					vmDiskBarData.push({
						diskName:disk[i].diskName,
						diskUsed:diskUsed,//disk[i].diskUsed,
						diskTotal:(diskTotal1>0?diskTotal1:0)//disk[i].diskTotal-disk[i].diskUsed
					});
				}
				for(var i=1;i<disk.length;i++){
					extDisk +=disk[i].diskTotal+'G;';
				}
				//alert(extDisk);
				extDiskValueLabel.update({html:'<div class="TipDiv" data-qtitle="" data-qtip="'+extDisk+'">'+extDisk+'</div>'});
				hAxis.maximum=diskMaximum;
				vmDiskBarStore.removeAll();
				vmDiskBarStore.loadData(vmDiskBarData);
				
				var network = vmViewStore.getAt(0).get('networkDetail');
				var nAxis = vmNetworkGroupBarchart.axes.get(0);
				var netMaximum = null;
				//vmNetworkGroupBarData.splice(0,2);//清空数组
				vmNetworkGroupBarData = [];
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
					vmNetworkGroupBarData.push({
						ipName:network[i].netName,
						ipRx:network[i].netRx,
						ipTx:network[i].netTx,
						ipAll:network[i].netTotal
					});
				}
				nAxis.maximum=netMaximum;
				vmNetworkGroupBarStore.removeAll();
				vmNetworkGroupBarStore.loadData(vmNetworkGroupBarData);
			}
		}
	}
});
//var tpl = new Ext.Template('<div class="TipDiv" data-qtitle="" data-qtip="提示">提示</div>');

var CPUValueContainer = Ext.create('Ext.form.FieldContainer', {
	width : '100%',
	height : 30,
	layout : 'hbox',
	items : [ {
		xtype : 'label',
		width : 55,
		height : 22,
		margin :'0 10 0 0',
		text :i18n._('CPU'),//'CPU',
		style:CPUlabelStyle
	}, CPUValueLabel ]
});
var MEMValueLabel = Ext.create('Ext.form.Label', {
	text : ''
});
var MEMValueContainer = Ext.create('Ext.form.FieldContainer', {
	width : '100%',
	height : 30,
	layout : 'hbox',
	items : [ {
		xtype : 'label',
		width : 55,
		height : 22,
		margin :'0 10 0 0',
		text :i18n._('Memory'),//'Memory',
		style:MEMlabelStyle
	}, MEMValueLabel ]
});
var DiskValueLabel = Ext.create('Ext.form.Label', {
	text : ''
});
var DiskValueContainer = Ext.create('Ext.form.FieldContainer', {
	width : '100%',
	height : 30,
	layout : 'hbox',
	items : [ {
		xtype : 'label',
		width : 55,
		height : 22,
		margin :'0 10 0 0',
		text :i18n._('Disk'),//'Disk',
		style:DisklabelStyle
	}, DiskValueLabel ]
});
var extDiskValueLabel = Ext.create('Ext.form.Label', {
	text : ''
});
var extDiskValueContainer = Ext.create('Ext.form.FieldContainer', {
	width : '100%',
	height : 30,
	layout : 'hbox',
	items : [ {
		xtype : 'label',
		width : 55,
		height : 22,
		margin :'0 10 0 0',
		text :i18n._('extDisk'),//'extDisk',
		style:extDisklabelStyle
	}, extDiskValueLabel ]
});
var IPValueLabel1 = Ext.create('Ext.form.Label', {
	text : ''
});
var IPValueContainer1 = Ext.create('Ext.form.FieldContainer', {
	width : '100%',
	height : 30,
	layout : 'hbox',
	items : [ {
		xtype : 'label',
		width : 55,
		height : 22,
		margin :'0 10 0 0',		
		text :i18n._('IP1'),//'IP1',
		style:IPlabelStyle
	}, IPValueLabel1 ]
});
var IPValueLabel2 = Ext.create('Ext.form.Label', {
	text : ''
});
var IPValueContainer2 = Ext.create('Ext.form.FieldContainer', {
	width : '100%',
	height : 30,
	layout : 'hbox',
	items : [ {
		xtype : 'label',
		width : 55,
		height : 22,
		margin :'0 10 0 0',
		//padding:'3 0 0 15',
		text :i18n._('IP2'),//'IP2',
		style:IPlabelStyle
	}, IPValueLabel2 ]
});
var ImageLabel = Ext.create('Ext.form.Label', {
	text : ''
});
var ImageContainer = Ext.create('Ext.form.FieldContainer', {
	width : '100%',
	height : 30,
	layout : 'hbox',
	items : [ {
		xtype : 'label',
		width : 55,
		height : 22,
		margin :'0 10 0 0',
		//padding:'2 0 0 6',
		text :i18n._('Image'),//'镜像',
		style:ImagelabelStyle
	}, ImageLabel ]
});
var taocanLabel = Ext.create('Ext.form.Label', {
	//shrinkWrap:3,
	height:30,
	width:100,
	text : '(无)'//标准A型
});
var taocanContainer = Ext.create('Ext.form.FieldContainer', {
	width : '100%',
	height : '15%',
	layout : 'hbox',
	items : [ {
		xtype : 'label',
		//frame:true,
		defaultAlign:'center',
		width : 55,
		height : 20,
		margin :'0 10 0 0',
		//padding:'2 0 0 11',
		text :i18n._('serviceCatalog'),//'套餐',
		style:labelStyle
	}, taocanLabel ]
});
var vmCPUpiechart = Ext.create('Ext.chart.Chart', {
	style : 'background:#fff',
	margin :'0 10 0 10',
	animate : {
		easing : 'bounceOut',
		duration : 500
	},
	insetPadding : 25,
	store : vmPieStore,// renodePhyResourceStore,nodePhyResourceStore
	width : 180,// 220
	height : 150,//150
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
var vmMEMpiechart = Ext.create('Ext.chart.Chart', {
	style : 'background:#fff',
	margin :'0 10 0 10',
	animate : {
		easing : 'bounceOut',
		duration : 500
	},
	insetPadding : 25,
	store : vmPieStore,// renodePhyResourceStore,nodePhyResourceStore
	width : 180,// 220
	height : 150,//150
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
		colorSet : [ '#ee8800', '#cbcbcb' ]// '#3AA8CB', '#ddd'
	} ]
});
var vmDiskcolors = ['#ee8800', '#cbcbcb'];
var vmDiskstackchart = Ext.create('Ext.chart.Chart', {
	style : 'background:#fff',
	margin :'0 10 0 10',
	animate : true,
	shadow :false,
//	legend : {
//		position : 'right'
//	},
	// insetPadding: 25,
	store : vmDiskBarStore,// renodePhyResourceStore,nodePhyResourceStore
	width : 180,// 220
	height : 150,//150
	theme : 'Category7',
	axes : [ {
		type : 'Numeric',
		fields : [ 'diskUsed', 'diskTotal' ],//, 'diskTotal'
		position : 'bottom',
		minimum : 0,
		majorTickSteps:0,
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
		gutter : 80,// 80
		stacked : true,
		xField : [ 'diskName' ],
		yField : [ 'diskUsed', 'diskTotal' ],//, 'diskTotal'		
		renderer: function(sprite, storeItem, barAttr, i, store) {
	      barAttr.fill = diskColors[i % diskColors.length];
	      barAttr.y = barAttr.y+(barAttr.height-15)/2;
	      barAttr.height = 15;
	      return barAttr;
		},
		tips : {
			trackMouse : true,
			width : 100,// 65
			height : 28,// 28
			renderer : function(storeItem, item) {
				if((item.value[1]>500)){
					var val = Ext.util.Format.round(item.value[1]/1024,2);
            		//return String(item.value[1]/1024).replace(/$/, 'T');
            		this.setTitle(String(val) + 'T');// / 1000000
            	}else{
            		this.setTitle(String(Math.ceil(item.value[1])) + 'G');// / 1000000
            	}
				//this.setTitle(String(Math.ceil(item.value[1])) + 'G');// / 1000000
			}
		}
	} ]
});
var vmNetworkGroupBarchart = Ext.create('Ext.chart.Chart', {
	style : 'background:#fff',
	margin :'0 10 0 10',
	animate : true,
	shadow :false,
	width : 180,// 220
	height : 150,//150
	theme : 'Category7',
//	legend : {
//		position : 'right'
//	},
	store : vmNetworkGroupBarStore,
	axes : [ {
		type : 'Numeric',
		position : 'bottom',
		fields : [ 'ipRx', 'ipTx'],//, 'ipAll' 
		minimum : 0,
		majorTickSteps:0,
		label: {
            renderer: function(v) {
                //return String(Math.ceil(v/1024)).replace(/$/, 'Kbps');
            	var val=Math.ceil(v);
            	if(val==0){
            		return String(val).replace(/$/, '');
            	}
            	if((val<=1000000 && val>1000)){
            		return String(val/1000).replace(/$/, 'Mbps');
		}else if((val<=1000 && val>0)){
            		return String(val).replace(/$/, 'Kbps');
            	}else{
            		return String(val/1000/1000).replace(/$/, 'Gbps');
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
	      barAttr.fill = netColors[i % netColors.length];
	      barAttr.y = barAttr.y+(barAttr.height-15)/2;
	      barAttr.height = 15;
	      return barAttr;
		},
		tips : {
			trackMouse : true,
			width : 100,// 65
			height : 28,// 28
			renderer : function(storeItem, item) {
				//this.setTitle(String(Math.ceil(item.value[1]/1024)) + 'Kbps');// / 1000000
				var rxVal = Math.ceil(item.value[1]);
				if((rxVal<=1000000 && rxVal>1000)){
					var val = Ext.util.Format.round(rxVal/1000,2);
            				this.setTitle(String(val) + 'Mbps');// / 1000000
				}else if((rxVal<=1000 && rxVal>=0)){
            				this.setTitle(String(rxVal) + 'Kbps');// / 1000000
            			}else{
					var val = Ext.util.Format.round(rxVal/1000/1000,2);
            				this.setTitle(String(val) + 'Gbps');// / 1000000
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
var westPanel=Ext.create('Ext.panel.Panel', {
	region : 'west',
	frame : true,
	title : i18n._('vm_info'),
	width : '15%',
	items : [ CPUValueContainer, MEMValueContainer, DiskValueContainer,extDiskValueContainer, {
	}, IPValueContainer1, IPValueContainer2, {
	}, ImageContainer, {
	}, taocanContainer ]
});
var vmOverviewPanel = Ext.create('Ext.panel.Panel', {
	layout : 'border',
	//autoScroll:true,
	width : '100%',
	heigth : '100%',
	// border:false,
	items : [westPanel,
	          {
		region : 'center',
		xtype : 'panel',
		autoScroll:true,
		scroll :'horizontal',
		width : '85%',
		//height : 200,
		layout : 'vbox',
		items : [ {
			xtype : 'panel',
			title : i18n._('Current status of server'),//服务器当前状态
			width : '100%',
			//height : 200,
			layout : 'hbox',
			items : [ {
				xtype : 'panel',
				width : '20%',
				//height : '80%',
				layout : 'vbox',
				border : false,
				items : [ 
				          vmCPUpiechart,
				          {
					        	xtype : 'label',
					        	margin :'0 0 10 85',
					        	width : 55,
					      		height : 22,
					      		text :i18n._('CPU'),//'CPU',
					    		style:CPUlabelStyle
//					      		autoEl: {
//					      	        tag: 'img',
//					      	        src: 'images/cpu.png'
//					      	    }
					      }
				        ]			
			}, {
				xtype : 'panel',
				width : '20%',
				//height : '80%',
				layout : 'vbox',
				border : false,
				items : [ 
				          vmMEMpiechart,
				          {
					        	xtype : 'label',
					        	margin :'0 0 10 85',
					        	width : 55,
					      		height : 22,
					      		text :i18n._('Memory'),//'Memory',
					    		style:MEMlabelStyle
//					      		autoEl: {
//					      	        tag: 'img',
//					      	        src: 'images/mem.png'
//					      	    }
					      }
				        ]			
			}, {
				xtype : 'panel',
				width : '20%',
				//height : '80%',
				layout : 'vbox',
				border : false,
				items : [ 
				          vmDiskstackchart,
				          {
					        	xtype : 'label',
					        	margin :'0 0 10 120',
					        	width : 55,
					      		height : 22,
					      		text :i18n._('Disk'),//'Disk',
					    		style:DisklabelStyle
//					      		autoEl: {
//					      	        tag: 'img',
//					      	        src: 'images/disk.png'
//					      	    }
					      }
				        ]			
			}, {
				xtype : 'panel',
				width : '20%',
				//height : '80%',
				layout : 'vbox',
				border : false,
				items : [ 
				          vmNetworkGroupBarchart,
				          {
					        	xtype : 'label',
					        	margin :'0 0 10 120',
					        	width : 55,
					      		height : 22,
					      		text:i18n._('Network'),
					      		style:NetlabelStyle
//					      		autoEl: {
//					      	        tag: 'img',
//					      	        src: 'images/net.png'
//					      	    }
					      }
				        ]			
			},
			{
				width :'20%',
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
			}]
		}, {
			xtype : 'panel',
			title : i18n._('Event'),//事件
			width : '100%',
			//height : 200,
			layout : 'hbox',
			items : [ {
				xtype : 'label',
				width : '4.5%'
			} ]
		} ]
	} ]
});

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