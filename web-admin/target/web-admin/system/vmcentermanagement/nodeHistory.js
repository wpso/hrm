//***nodeHistory
var params = getCookie("lang");
i18n.set({
  lang: params, 
  path: '../../resources'
});
var dateFormat='Y-m-d H:i:s';
if(params=='en_US'){
	dateFormat='m-d-Y H:i:s';
}
var dateFormatForStep='H:i';
var nodeName=getCookie("nodeName");
if(getQuery("nodeName")!=null){
	nodeName=getQuery("nodeName");
}
Ext.Loader.setConfig({enabled: true});
var buttonUpCls="background-color:'#cbcbcb'";
var buttonDownCls="background-color:'#ee8800'";
var buttonUpStyle={backgroundColor:'#cbcbcb'};
var buttonDownStyle={backgroundColor:'#ee8800'};
//var chartHostDiskmaximum = 1;
//var chartHostNetworkmaximum = 1;
var chartHostDiskmaximum = 100;
var chartHostNetworkmaximum = 1000;

function unableButton(){
	Ext.getCmp("cpuButton").disable();
	Ext.getCmp("diskButton").disable();
	Ext.getCmp("memoryButton").disable();
	Ext.getCmp("bandWidthButton").disable();
}

function ableButton(){
	Ext.getCmp("cpuButton").setDisabled(false);
	Ext.getCmp("diskButton").setDisabled(false);
	Ext.getCmp("memoryButton").setDisabled(false);
	Ext.getCmp("bandWidthButton").setDisabled(false);
}
var nodebeginDate = Ext.create('Ext.form.datetime.DateTime', {		
	margin : '0 5 0 0',
	fieldLabel : i18n._('beginDate'),
	labelAlign: 'center', 
	labelWidth: 80, 
	margin:'0 0 0 30',
	id : 'nodebeginDate',
	format:dateFormat,
	value: Ext.Date.add(new Date(), Ext.Date.DAY, -1),
	maxValue : Ext.Date.add(new Date(),Ext.Date.DAY, 0)
});
var nodeendDate = Ext.create('Ext.form.datetime.DateTime', {		
	margin:'0 0 0 40',
	fieldLabel : i18n._('endDate'),
	labelAlign: 'center', 
	labelWidth: 80, 
	margin:'0 0 0 30',
	id : 'nodeendDate',
	format:dateFormat,
	value: Ext.Date.add(new Date(), Ext.Date.DAY, 0),
	maxValue : Ext.Date.add(new Date(),Ext.Date.DAY, 1),
    listeners: {  
        select:function(field,value,eOpts){  
            if(Ext.getCmp("nodebeginDate").getValue() > Ext.getCmp("nodeendDate").getValue()){
            	Ext.getCmp("nodeendDate").setValue(Ext.getCmp("nodebeginDate").getValue());
            }       	
        }  
    } 	
});
var tipStep = 5;
var startdate=Ext.Date.add(nodebeginDate.getValue(),Ext.Date.DAY, -1);
var enddate=Ext.Date.add(nodeendDate.getValue(),Ext.Date.DAY, 0);
var historyHostDiskJsonStore=Ext.create('Ext.data.JsonStore',{	
	fields:['timestamp','readSpeed','writeSpeed']
});
var historyHostNetJsonStore=Ext.create('Ext.data.JsonStore',{	
	fields:['timestamp','rxSpeed','txSpeed']
});
var historyHostCpuStore=Ext.create('Ext.data.Store',{
	autoLoad:false,
	fields:['timestamp','cpuRate','cpuNum'],
	proxy: new Ext.data.proxy.Ajax({
		url:path+'/../monitoring/monitor!ossHostCPUHistory.action',			
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
		load : function(historyHostCpuStore, records, successful, eOpts ){
			var v_mask = new Ext.LoadMask(Ext.getBody(), {
				msg : i18n._('please wait'),
	            removeMask: true //完成后移除
	        });
			v_mask.show();
			if(successful && historyHostCpuStore.getCount()>0){
				v_mask.hide();
				var count = historyHostCpuStore.getCount()-1;
				var timeAxis = chartHostCpu.axes.get(1);
				timeAxis.fromDate=historyHostCpuStore.getAt(0).get('timestamp');
				timeAxis.toDate=historyHostCpuStore.getAt(count).get('timestamp');
				chartHostCpu.redraw();			

			}
		}
	}
});
var historyHostMemoryStore=Ext.create('Ext.data.Store',{
	autoLoad:false,
	fields:['timestamp','ramRate','ramTotal'],
	proxy: new Ext.data.proxy.Ajax({
		url:path+'/../monitoring/monitor!ossHostMemoryHistory.action',			
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
		load : function(historyHostMemoryStore, records, successful, eOpts ){
			var v_mask = new Ext.LoadMask(Ext.getBody(), {
				msg : i18n._('please wait'),
	            removeMask: true //完成后移除
	        });
			v_mask.show();	
			if(successful && historyHostMemoryStore.getCount()>0){
				var count = historyHostMemoryStore.getCount()-1;
				var timeAxis = chartHostMemory.axes.get(1);
				timeAxis.fromDate=historyHostMemoryStore.getAt(0).get('timestamp');
				timeAxis.toDate=historyHostMemoryStore.getAt(count).get('timestamp');					
				chartHostMemory.redraw();			
			}
			v_mask.hide();	
			//ableButton()
		}
	}
});
var historyHostDiskStore=Ext.create('Ext.data.Store',{
	autoLoad:false,
	fields:['timestamp','diskTotal','readSpeed','writeSpeed'],
	proxy: new Ext.data.proxy.Ajax({
		url:path+'/../monitoring/monitor!ossHostDiskHistory.action',			
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
		load : function(historyHostDiskStore, records, successful, eOpts ){			
			var v_mask = new Ext.LoadMask(Ext.getBody(), {
				msg : i18n._('please wait'),
	            removeMask: true //完成后移除
	        });
			v_mask.show();	
			if(successful && historyHostDiskStore.getCount()>0){
				historyHostDiskJsonStore.removeAll();
				for(var i=0;i<historyHostDiskStore.getCount();i++){
					historyHostDiskJsonStore.add(
							{
								timestamp:historyHostDiskStore.getAt(i).get('timestamp'),
								readSpeed:historyHostDiskStore.getAt(i).get('readSpeed'),
								writeSpeed:historyHostDiskStore.getAt(i).get('writeSpeed')
							}
					);
//					if(chartHostDiskmaximum<(historyHostDiskStore.getAt(i).get('readSpeed'))){
//						chartHostDiskmaximum=(historyHostDiskStore.getAt(i).get('readSpeed'));
//					}
//					if(chartHostDiskmaximum<(historyHostDiskStore.getAt(i).get('writeSpeed'))){
//						chartHostDiskmaximum=(historyHostDiskStore.getAt(i).get('writeSpeed'));
//					}
				}
//				chartHostDiskmaximum = Math.ceil(chartHostDiskmaximum);
//				if(chartHostDiskmaximum>1){
//					chartHostDiskmaximum = Math.ceil(chartHostDiskmaximum/100)*100;
//				}				
				var count = historyHostDiskStore.getCount()-1;
				var timeAxis = chartHostDisk.axes.get(1);
				timeAxis.fromDate=historyHostDiskStore.getAt(0).get('timestamp');
				timeAxis.toDate=historyHostDiskStore.getAt(count).get('timestamp');
				var numericAxis = chartHostDisk.axes.get(0);
				numericAxis.maximum=chartHostDiskmaximum;			
				chartHostDisk.redraw();
			}			
			v_mask.hide();	
			//chartHostDisk.axes.setMaximum(chartHostDiskmaximum);
			//chartHostDisk.axes.maximum=chartHostDiskmaximum;
			//ableButton()
		}
	}
});
var historyHostNetStore=Ext.create('Ext.data.Store',{
	autoLoad:false,
	fields:['timestamp','rxSpeed','txSpeed'],
	proxy: new Ext.data.proxy.Ajax({
		url:path+'/../monitoring/monitor!ossHostNetHistory.action',			
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
		load : function(historyHostNetStore, records, successful, eOpts ){		
			var v_mask = new Ext.LoadMask(Ext.getBody(), {
				msg : i18n._('please wait'),
	            removeMask: true //完成后移除
	        });
			v_mask.show();	
			if(successful && historyHostNetStore.getCount()>0){
				historyHostNetJsonStore.removeAll();
				for(var i=0;i<historyHostNetStore.getCount();i++){
					historyHostNetJsonStore.add(
							{
								timestamp:historyHostNetStore.getAt(i).get('timestamp'),
								rxSpeed:historyHostNetStore.getAt(i).get('rxSpeed'),
								txSpeed:historyHostNetStore.getAt(i).get('txSpeed')
							}
					);
//					if(chartHostNetworkmaximum<(historyHostNetStore.getAt(i).get('rxSpeed')/1000)){
//						chartHostNetworkmaximum=(historyHostNetStore.getAt(i).get('rxSpeed')/1000);
//					}
//					if(chartHostNetworkmaximum<(historyHostNetStore.getAt(i).get('txSpeed')/1000)){
//						chartHostNetworkmaximum=(historyHostNetStore.getAt(i).get('txSpeed')/1000);
//					}
				}
//				chartHostNetworkmaximum = Math.ceil(chartHostNetworkmaximum);
//				if(chartHostNetworkmaximum>1){
//					chartHostNetworkmaximum = Math.ceil(chartHostNetworkmaximum/100)*100;
//				}
				var count = historyHostNetStore.getCount()-1;
				var timeAxis = chartHostNetwork.axes.get(1);
				timeAxis.fromDate=historyHostNetStore.getAt(0).get('timestamp');
				timeAxis.toDate=historyHostNetStore.getAt(count).get('timestamp');
				var numericAxis = chartHostNetwork.axes.get(0);
				numericAxis.maximum = chartHostNetworkmaximum;			
				chartHostNetwork.redraw();
			}	
			v_mask.hide();	
			//ableButton()
			//chartHostNetwork.axes.maximum=chartHostNetworkmaximum;
		}
	}
});
var chartHostCpu = Ext.create('Ext.chart.Chart',{
	itemId : 'chartHostCpu',
	animate : true,
	//shadow : true,
	store : historyHostCpuStore,
	background:{
		//image:'images/hostMonitor.jpg'
		gradient:{
			angle:90,
			stops:{
				0:{
					color:'#ddd'
				},
				100:{
					color:'#555'
				}
			}
		}
	},
	axes : [
	{
		type : 'Numeric',
		minimum : 0,
		maximum : 100,
		decimals:0,
		position : 'left',
		fields : [ 'cpuRate' ],
		title : 'CPU(%)',
		grid : true
	},
	{
		type: 'Time',
		position: 'bottom',
		fields: ['timestamp'],
		//fromDate:startdate,
		//toDate:enddate,
		dateFormat: dateFormatForStep,
		step:[Ext.Date.HOUR,1],
		groupBy: 'year,month,day,hour',
		title : 'Time'
	}],
	series : [
	{
		type : 'line',
		axis : 'left',
		gutter : 80,
		xField : 'timestamp',
		yField : [ 'cpuRate' ],
		tips: {
            trackMouse: true,
            width: 200,
            renderer: function (storeItem, item) {
                this.setTitle(Ext.Date.format(new Date(storeItem.get('timestamp')),'m/d/Y H:i:s')+ '(' + Ext.util.Format.round(storeItem.get('cpuRate'),2)+'%)');
            }
		 },
		 showMarkers :false
	}]
});
var chartHostMemory = Ext.create('Ext.chart.Chart', {
	itemId : 'chartHostMemory',
	animate : true,
	shadow : true,
	store : historyHostMemoryStore,
	background:{
		//image:'images/hostMonitor.jpg'
		gradient:{
			angle:90,
			stops:{
				0:{
					color:'#ddd'
				},
				100:{
					color:'#555'
				}
			}
		}
	},
	axes : [
	{
		type : 'Numeric',
		position : 'left',
		minimum : 0,
		maximum : 100,
		decimals:0,
		fields : [ 'ramRate' ],
		title : 'Memory(%)',
		grid : true
	},
	{
		type: 'Time',
		position: 'bottom',
		fields: ['timestamp'],
		//fromDate:startdate,
		//toDate:enddate,
		dateFormat: dateFormatForStep,
		step:[Ext.Date.HOUR,1],		
		groupBy: 'year,month,day,hour',
		title : 'Time'
	}],
	series : [{
		type : 'line',
		axis : 'left',
		gutter : 80,
		xField : 'timestamp',
		yField : [ 'ramRate' ],
		tips: {
            trackMouse: true,
            width: 200,
            renderer: function (storeItem, item) {
                this.setTitle(Ext.Date.format(new Date(storeItem.get('timestamp')),'m/d/Y H:i:s') + '(' + Ext.util.Format.round(storeItem.get('ramRate'),2)+'%)');
            }
		 },
		 showMarkers :false
	}]
});
var chartHostDisk = Ext.create('Ext.chart.Chart', {
	itemId : 'chartHostDisk',
	animate : true,
	shadow : true,
	store : historyHostDiskJsonStore,//historyHostDiskStore,
	background:{
		//image:'images/hostMonitor.jpg'
		gradient:{
			angle:90,
			stops:{
				0:{
					color:'#ddd'
				},
				100:{
					color:'#555'
				}
			}
		}
	},
	legend: {
        position: 'right'//'right'
    },
	axes : [
	{
		type : 'Numeric',
		position : 'left',
		fields : [ 'readSpeed','writeSpeed' ],
		minimum : 0,
		maximum : chartHostDiskmaximum,
		//decimals:0,
		title : 'Disk(Mb/s)',
		grid : true
	},
	{
		type: 'Time',
		position: 'bottom',
		fields: ['timestamp'],
		//fromDate:startdate,
		//toDate:enddate,
		dateFormat: dateFormatForStep,
		step:[Ext.Date.HOUR,1],
		groupBy: 'year,month,day,hour',
		title : 'Time'
	}],
	series : [		          
	{
		type : 'line',
		axis : 'left',
		gutter : 80,
		xField : 'timestamp',
		yField : [ 'readSpeed' ],
		tips: {
            trackMouse: true,
            width: 200,
            renderer: function (storeItem, item) {
                this.setTitle(Ext.Date.format(new Date(storeItem.get('timestamp')),'m/d/Y H:i:s') + '(' + Ext.util.Format.round(storeItem.get('readSpeed'),2)+'Mb/s)');
            }
		 },
		 showMarkers :false
	},{
		type : 'line',
		axis : 'left',
		gutter : 80,
		xField : 'timestamp',
		yField : [ 'writeSpeed' ],
		tips: {
            trackMouse: true,
            width: 200,
            renderer: function (storeItem, item) {
                this.setTitle(Ext.Date.format(new Date(storeItem.get('timestamp')),'m/d/Y H:i:s') + '(' + Ext.util.Format.round(storeItem.get('writeSpeed'),2)+'Mb/s)');
            }
		 },
		 showMarkers :false
	}]
});
var chartHostNetwork = Ext.create('Ext.chart.Chart', {
	itemId : 'chartHostNetwork',
	animate : true,
	shadow : true,
	store : historyHostNetJsonStore,//historyHostNetStore,
	background:{
		//image:'images/hostMonitor.jpg'
		gradient:{
			angle:90,
			stops:{
				0:{
					color:'#ddd'
				},
				100:{
					color:'#555'
				}
			}
		}
	},
	legend: {
        position: 'right'//'right'
    },
	axes : [
	{
		type : 'Numeric',
		position : 'left',
		fields : [ 'rxSpeed','txSpeed' ],
		minimum : 0,
		maximum : chartHostNetworkmaximum,
		//decimals:0,
		title : 'NetWork(Mbps)',
		grid : true
	},
	{
		type: 'Time',
		position: 'bottom',
		fields: ['timestamp'],
		//fromDate:startdate,
		//toDate:enddate,
		dateFormat: dateFormatForStep,
		step:[Ext.Date.HOUR,1],
		groupBy: 'year,month,day,hour',
		title : 'Time'
	}],
	series : [
	{
		type : 'line',
		axis : 'left',
		gutter : 80,
		xField : 'timestamp',
		yField : [ 'rxSpeed'],
		tips: {
            trackMouse: true,
            width: 200,
            renderer: function (storeItem, item) {
                this.setTitle(Ext.Date.format(new Date(storeItem.get('timestamp')),'m/d/Y H:i:s') + '(' + Ext.util.Format.round(storeItem.get('rxSpeed'),2)+'Mbp/s)');
            }
		 },
		 showMarkers :false
	},{
		type : 'line',
		axis : 'left',
		gutter : 80,
		xField : 'timestamp',
		yField : [ 'txSpeed' ],
		tips: {
            trackMouse: true,
            width: 200,
            renderer: function (storeItem, item) {
                this.setTitle(Ext.Date.format(new Date(storeItem.get('timestamp')),'m/d/Y H:i:s') + '(' + Ext.util.Format.round(storeItem.get('txSpeed'),2)+'Mbp/s)');
            }
		 },
		 showMarkers :false
	}]
});
//加载分硬盘和分网卡显示
function loadNodeDisksandNetworkCards() {
	var v_mask = new Ext.LoadMask(Ext.getBody(), {
		msg : i18n._('please wait'),
        removeMask: true //完成后移除
    });
	v_mask.show();	
	Ext.Ajax.request({  										
		url : path+'/../monitoring/monitor!loadNodeDisksandNetworkCards.action',
		method : 'GET',
		params : 'hostName='+ nodeName,
		success: function(response, options){
			v_mask.hide();
			var obj = Ext.decode(response.responseText);
			if(obj==null || obj.success==null){
				Ext.MessageBox.show({
		           title:i18n._('errorNotice'),
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
					icon: Ext.MessageBox.WARNING,
					fn: function(){
						getSessionUser();
					}
				});  												
				return;
			}
			else {
				// 加载分硬盘显示
				var disks_array = obj.resultObject.disks;
				// 加载分硬盘显示
				var disk_button_menu = new Ext.menu.Menu();
				for (var i = 0; i < disks_array.length; i++) {
					disk_button_menu.add({
				        text: disks_array[i],
				        handler: function(button){
				    		//historyHostDiskStore.removeAll();
				    		var proxy=historyHostDiskStore.getProxy();
				    		proxy.setExtraParam('hostName',null) ;
				    		proxy.setExtraParam('fromTime',null);
				    		proxy.setExtraParam('toTime',null);
				    		proxy.setExtraParam('disk_name',null);
				    		if(nodebeginDate.getValue()==null){
				    			Ext.Msg.alert(i18n._('notice'), i18n._('time_cant_null'));
				    			nodebeginDate.focus();
				    		}else{
				    			var startdate=Ext.Date.add(nodebeginDate.getValue(),Ext.Date.DAY, 0);
				    			var enddate=Ext.Date.add(nodeendDate.getValue(),Ext.Date.DAY, 0);
				    			proxy.setExtraParam('hostName',nodeName) ;
				    			proxy.setExtraParam('fromTime',Ext.Date.format(startdate, 'U')*1000);//Y-m-d H:i:s//Ext.Date.format(startdate, 'U')*1000
				    			proxy.setExtraParam('toTime',Ext.Date.format(enddate, 'U')*1000);//Y-m-d//Ext.Date.format(enddate, 'U')*1000
				    			proxy.setExtraParam('disk_name',button.text);
				    			historyHostDiskStore.load();
				    			//chartHostDisk.redraw();
				    		}			
				    		nodeHistoryPanel.remove(chartHostCpu,false);
				    		nodeHistoryPanel.remove(chartHostMemory,false);
				    		nodeHistoryPanel.remove(chartHostNetwork,false);
				    		nodeHistoryPanel.add(chartHostDisk);				        	
				        }
				    });
				}
				nodediskButton.menu = disk_button_menu;	
				 
				// 加载分网卡显示
				var networkCards_array = obj.resultObject.networkCards;
				// 加载分网卡显示
				var network_button_menu = new Ext.menu.Menu();				
				for (var i = 0; i < networkCards_array.length; i++) {
					network_button_menu.add({
				        text: networkCards_array[i],
				        handler: function(button){
				    		//historyHostNetStore.removeAll();
				    		var proxy=historyHostNetStore.getProxy();
				    		proxy.setExtraParam('hostName',null) ;
				    		proxy.setExtraParam('fromTime',null);
				    		proxy.setExtraParam('toTime',null);
				    		proxy.setExtraParam('eth_name',null);
				    		if(nodebeginDate.getValue()==null){
				    			Ext.Msg.alert(i18n._('notice'), i18n._('time_cant_null'));
				    			nodebeginDate.focus();
				    		}else{
				    			var startdate=Ext.Date.add(nodebeginDate.getValue(),Ext.Date.DAY, 0);
				    			var enddate=Ext.Date.add(nodeendDate.getValue(),Ext.Date.DAY, 0);
				    			proxy.setExtraParam('hostName',nodeName) ;
				    			proxy.setExtraParam('fromTime',Ext.Date.format(startdate, 'U')*1000);//Y-m-d H:i:s//Ext.Date.format(startdate, 'U')*1000
				    			proxy.setExtraParam('toTime',Ext.Date.format(enddate, 'U')*1000);//Y-m-d//Ext.Date.format(enddate, 'U')*1000					
				    			proxy.setExtraParam('eth_name',button.text);
				    			historyHostNetStore.load();
				    			//chartHostNetwork.redraw();
				    		}		
				    		nodeHistoryPanel.remove(chartHostCpu,false);
				    		nodeHistoryPanel.remove(chartHostMemory,false);
				    		nodeHistoryPanel.remove(chartHostDisk,false);
				    		nodeHistoryPanel.add(chartHostNetwork);				        	
				        }
				    });
				}
				nodebandWidthButton.menu = network_button_menu;		
			}
		}
//	,   
//	    failure:function(response, options){   
//	    	Ext.MessageBox.show({
//	    		title: i18n._('errorNotice'),
//	    		msg: i18n._('returnError'),
//	    		buttons: Ext.MessageBox.OK,
//	    		icon: Ext.MessageBox.WARNING
//	    	});  
//	    }
	});	
}
var nodecpuButton=new Ext.create('Ext.button.Button',{
	text :i18n._('CPUMonitor'),//'CPU监控'
	id:'cpuButton',
	handler: function(){
		monitorHostCPUHistory();			
		nodeHistoryPanel.remove(chartHostMemory,false);
		nodeHistoryPanel.remove(chartHostDisk,false);
		nodeHistoryPanel.remove(chartHostNetwork,false);
		nodeHistoryPanel.add(chartHostCpu);
	}
});
var nodememoryButton=new Ext.create('Ext.button.Button',{
	text :i18n._('MemoryMonitor'),//'内存监控',
	id:'memoryButton',
	handler: function(){
		//historyHostMemoryStore.removeAll();
		var proxy=historyHostMemoryStore.getProxy();
		proxy.setExtraParam('hostName',null) ;
		proxy.setExtraParam('fromTime',null);
		proxy.setExtraParam('toTime',null);
		if(nodebeginDate.getValue()==null){
			Ext.Msg.alert(i18n._('notice'), i18n._('time_cant_null'));
			nodebeginDate.focus();
		}else{
			var startdate=Ext.Date.add(nodebeginDate.getValue(),Ext.Date.DAY, 0);
			var enddate=Ext.Date.add(nodeendDate.getValue(),Ext.Date.DAY, 0);
			proxy.setExtraParam('hostName',nodeName) ;
			proxy.setExtraParam('fromTime',Ext.Date.format(startdate, 'U')*1000);//Y-m-d H:i:s//Ext.Date.format(startdate, 'U')*1000
			proxy.setExtraParam('toTime',Ext.Date.format(enddate, 'U')*1000);//Y-m-d//Ext.Date.format(enddate, 'U')*1000
			historyHostMemoryStore.load();
			//chartHostMemory.redraw();
		}		
		nodeHistoryPanel.remove(chartHostCpu,false);
		nodeHistoryPanel.remove(chartHostDisk,false);
		nodeHistoryPanel.remove(chartHostNetwork,false);
		nodeHistoryPanel.add(chartHostMemory);
	}
});
var nodediskButton=new Ext.create('Ext.button.Button',{
	id:'diskButton',
	text :i18n._('DiskMonitor')/*,//'磁盘监控',
	handler: function(){
		//historyHostDiskStore.removeAll();
		var proxy=historyHostDiskStore.getProxy();
		proxy.setExtraParam('hostName',null) ;
		proxy.setExtraParam('fromTime',null);
		proxy.setExtraParam('toTime',null);
		if(beginDate.getValue()==null){
			Ext.Msg.alert(i18n._('notice'), i18n._('time_cant_null'));
			beginDate.focus();
		}else{
			var startdate=Ext.Date.add(beginDate.getValue(),Ext.Date.DAY, 0);
			var enddate=Ext.Date.add(endDate.getValue(),Ext.Date.DAY, 0);
			proxy.setExtraParam('hostName',nodeName) ;
			proxy.setExtraParam('fromTime',Ext.Date.format(startdate, 'U')*1000);//Y-m-d H:i:s//Ext.Date.format(startdate, 'U')*1000
			proxy.setExtraParam('toTime',Ext.Date.format(enddate, 'U')*1000);//Y-m-d//Ext.Date.format(enddate, 'U')*1000
			historyHostDiskStore.load();
			//chartHostDisk.redraw();
		}			
		nodeHistoryPanel.remove(chartHostCpu,false);
		nodeHistoryPanel.remove(chartHostMemory,false);
		nodeHistoryPanel.remove(chartHostNetwork,false);
		nodeHistoryPanel.add(chartHostDisk);
	}*/
});
var nodebandWidthButton=new Ext.create('Ext.button.Button',{
	id:'bandWidthButton',
	text :i18n._('NetworkMonitor')/*,//'网络监控',
	handler: function(){					
		//historyHostNetStore.removeAll();
		var proxy=historyHostNetStore.getProxy();
		proxy.setExtraParam('hostName',null) ;
		proxy.setExtraParam('fromTime',null);
		proxy.setExtraParam('toTime',null);
		if(beginDate.getValue()==null){
			Ext.Msg.alert(i18n._('notice'), i18n._('time_cant_null'));
			beginDate.focus();
		}else{
			var startdate=Ext.Date.add(beginDate.getValue(),Ext.Date.DAY, 0);
			var enddate=Ext.Date.add(endDate.getValue(),Ext.Date.DAY, 0);
			proxy.setExtraParam('hostName',nodeName) ;
			proxy.setExtraParam('fromTime',Ext.Date.format(startdate, 'U')*1000);//Y-m-d H:i:s//Ext.Date.format(startdate, 'U')*1000
			proxy.setExtraParam('toTime',Ext.Date.format(enddate, 'U')*1000);//Y-m-d//Ext.Date.format(enddate, 'U')*1000					
			historyHostNetStore.load();
			//chartHostNetwork.redraw();
		}		
		nodeHistoryPanel.remove(chartHostCpu,false);
		nodeHistoryPanel.remove(chartHostMemory,false);
		nodeHistoryPanel.remove(chartHostDisk,false);
		nodeHistoryPanel.add(chartHostNetwork);
	}*/
});
var nodeHistoryPanel = new Ext.create('Ext.panel.Panel',{
    layout: 'fit',//'fit' 
    dockedItems: [
    {
    	xtype: 'toolbar',		
        items:[
		nodebeginDate,nodeendDate,
		{
			xtype : 'tbfill'
		},
		nodecpuButton,nodememoryButton,nodediskButton,nodebandWidthButton
		]
	}],
	items : [
	         chartHostCpu//,chartHostMemory,chartHostDisk,chartHostNetwork
	         ]
});
function monitorHostCPUHistory(){
	// 加载分硬盘和分网卡显示
	loadNodeDisksandNetworkCards();	
	
	//historyHostCpuStore.removeAll();
	var proxy=historyHostCpuStore.getProxy();
	proxy.setExtraParam('hostName',null) ;
	proxy.setExtraParam('fromTime',null);
	proxy.setExtraParam('toTime',null);
	if(nodebeginDate.getValue()==null){
		Ext.Msg.alert(i18n._('notice'), i18n._('time_cant_null'));
		nodebeginDate.focus();
	}else{
		//unableButton();
		var v_mask = new Ext.LoadMask(Ext.getBody(), {
			msg : i18n._('please wait'),
            removeMask: true //完成后移除
        });
		v_mask.show();	
		var startdate=Ext.Date.add(nodebeginDate.getValue(),Ext.Date.DAY, 0);
		var enddate=Ext.Date.add(nodeendDate.getValue(),Ext.Date.DAY, 0);
		proxy.setExtraParam('hostName',nodeName) ;
		proxy.setExtraParam('fromTime',Ext.Date.format(startdate, 'U')*1000);//Y-m-d H:i:s//Ext.Date.format(startdate, 'U')*1000
		proxy.setExtraParam('toTime',Ext.Date.format(enddate, 'U')*1000);//Y-m-d//Ext.Date.format(enddate, 'U')*1000
		historyHostCpuStore.load();
		v_mask.hide();	
//		ableButton();
		//chartHostCpu.redraw();
	}
};
function getCookie(name){
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if(arr != null) return unescape(arr[2]);
	 return null;
};
function   getQuery(name) 
{ 
        var reg=new RegExp("" +name+ "=([^&?]*)");        
        var keyVal=window.location.search.substr(1).match(reg);         
       //alert(keyVal[1]);        
        if   (keyVal!=null)   return   unescape(keyVal[1]);  
        return null;
};
