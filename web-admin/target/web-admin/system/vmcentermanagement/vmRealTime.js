//***vmRealTime
var params = getCookie("lang");
i18n.set({
  lang: params, 
  path: '../../resources'
});
var vmrID=getCookie("vmID");
var timestep = 2;//6
var nowTime = new Date();
if(getQuery("vmID")!=null){
	vmrID=getQuery("vmID");
}
Ext.Loader.setConfig({enabled: true});
var realTimeCPUVMData = [];
var realTimeMemoryVMData =[];
var realTimeDiskVMData = [];
var realTimeNetVMData = [];
var VMCPUdata = [];
var VMMemorydata = [];
var VMDiskdata = [];
var VMNetdata = [];
var realTimeDiskChartMaximum = 1;
var realTimeNetChartMaximum = 1;
var realTimeVMStore=Ext.create('Ext.data.Store',{
	//id:'realTimeVMStore',
	autoLoad:false,
	fields:['cPUMonitorVO','memoryMonitorVO','diskMonitorVOList','netMonitorVOList'],
	proxy: new Ext.data.proxy.Ajax({
		url:path+'/../monitoring/monitor!ossVmRealTime.action',			
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
		load : function(realTimeVMStore, records, successful, eOpts ){			
			realTimeChartVMCpu.redraw(false);
		}
	}
});
var generateVMCPUData = (function() {
    VMCPUdata = [];
    var i=0;
    return function() {    	
    	if(realTimeVMStore.getCount()>0){
			var now = new Date(nowTime);				
//			var random = Math.random;
			var cPUMonitorVO = realTimeVMStore.getAt(0).get('cPUMonitorVO');	
			//VMCPUdata = VMCPUdata.slice();
			if(VMCPUdata.length>=24){
				VMCPUdata.splice(0,1);//清除最前面的数值
				VMCPUdata.push({
					timestamp : Ext.Date.add(now, Ext.Date.SECOND, i++),
					cpuRate : cPUMonitorVO.cpuRate
				});////
			}else{
				VMCPUdata.push({
					timestamp : Ext.Date.add(now, Ext.Date.SECOND, i++),
					cpuRate : cPUMonitorVO.cpuRate
				});////
			}
    	}
        return VMCPUdata;
    };
})();
var generateVMMemoryData = (function() {
    VMMemorydata = [];
    var i=0;
    return function() {    	
    	if(realTimeVMStore.getCount()>0){
    		var now = new Date(nowTime);
			var memoryMonitorVO = realTimeVMStore.getAt(0).get('memoryMonitorVO');
			if(VMMemorydata.length>=24){
				VMMemorydata.splice(0,1);//清除最前面的数值
				VMMemorydata.push({
					timestamp : Ext.Date.add(now, Ext.Date.SECOND, i++),
					ramRate : memoryMonitorVO.ramRate
				});
			}else{
				VMMemorydata.push({
					timestamp : Ext.Date.add(now, Ext.Date.SECOND, i++),
					ramRate : memoryMonitorVO.ramRate
				});
			}
    	}
        return VMMemorydata;
    };
})();
var generateVMDiskData = (function() {
    VMDiskdata = [];
    var j=0;
    return function() {    	
    	if(realTimeVMStore.getCount()>0){
    		var now = new Date(nowTime);    		
    		var diskMonitorVOList = realTimeVMStore.getAt(0).get('diskMonitorVOList');
    		if(diskMonitorVOList.length>0){
    			var index=0;
    			for(var i=0;i<1;i++){//diskMonitorVOList.length
    				if(realTimeDiskChartMaximum<(diskMonitorVOList[index].readSpeed/1024/1024)){
    					realTimeDiskChartMaximum=(diskMonitorVOList[index].readSpeed/1024/1024);
					}
					if(realTimeDiskChartMaximum<(diskMonitorVOList[index].writeSpeed/1024/1024)){
						realTimeDiskChartMaximum=(diskMonitorVOList[index].writeSpeed/1024/1024);
					}    				
    				if(VMDiskdata.length>=24){
    					VMDiskdata.splice(0,1);//清除最前面的数值
    					VMDiskdata.push({
    						timestamp : Ext.Date.add(now, Ext.Date.SECOND, j++),
    						readSpeed : (diskMonitorVOList[index].readSpeed/1024/1024),
    						//i18n._('readSpeed') : (diskMonitorVOList[index].readSpeed/1024/1024),
    						writeSpeed : (diskMonitorVOList[index].writeSpeed/1024/1024)
    					});
    				}else{
    					VMDiskdata.push({
    						timestamp : Ext.Date.add(now, Ext.Date.SECOND, j++),
    						readSpeed : (diskMonitorVOList[index].readSpeed/1024/1024),
    						//i18n._('readSpeed') : (diskMonitorVOList[index].readSpeed/1024/1024),
    						writeSpeed : (diskMonitorVOList[index].writeSpeed/1024/1024)
    					});
    				}
    				index =index+1;
    			}
    		}			
    	}
        return VMDiskdata;
    };
})();
var generateVMNetData = (function() {
    VMNetdata = [];
    var j=0;
    return function() {    	
    	if(realTimeVMStore.getCount()>0){
    		var now = new Date(nowTime);
    		var netMonitorVOList = realTimeVMStore.getAt(0).get('netMonitorVOList');
    		if(netMonitorVOList.length>0){
    			var index = 0;
    			for(var i=0;i<1;i++){//netMonitorVOList.length
    				if(realTimeNetChartMaximum<(netMonitorVOList[index].rxSpeed/1024/1024)){
    					realTimeNetChartMaximum=(netMonitorVOList[index].rxSpeed/1024/1024);
					}
					if(realTimeNetChartMaximum<(netMonitorVOList[index].txSpeed/1024/1024)){
						realTimeNetChartMaximum=(netMonitorVOList[index].txSpeed/1024/1024);
					}  
    				if(VMNetdata.length>=24){
    					VMNetdata.splice(0,1);//清除最前面的数值
    					VMNetdata.push({
    						timestamp : Ext.Date.add(now, Ext.Date.SECOND, j++),
    						rxSpeed : (netMonitorVOList[index].rxSpeed/1024/1024),
    						txSpeed : (netMonitorVOList[index].txSpeed/1024/1024)
    					});
    				}else{
    					VMNetdata.push({
    						timestamp : Ext.Date.add(now, Ext.Date.SECOND, j++),
    						rxSpeed : (netMonitorVOList[index].rxSpeed/1024/1024),
    						txSpeed : (netMonitorVOList[index].txSpeed/1024/1024)
    					});
    				}
    				index = index +1;
    			}
    		}			
    	}
        return VMNetdata;
    };
})();
var realTimeCPUVMStore=Ext.create('Ext.data.JsonStore',{
	fields: ['timestamp','cpuRate','cpuNum'],
	data : generateVMCPUData()//realTimeCPUVMData
});
var realTimeMemoryVMStore=Ext.create('Ext.data.JsonStore',{
	fields: ['timestamp','ramRate','ramTotal'],
	data : generateVMMemoryData()//realTimeMemoryVMData
});
var realTimeDiskVMStore=Ext.create('Ext.data.JsonStore',{
	fields: ['timestamp','readSpeed','writeSpeed'],//,'diskTotal'
	//fields: ['timestamp',i18n._('readSpeed'),'writeSpeed'],//,'diskTotal'
	data : generateVMDiskData()//realTimeDiskVMData
});
var realTimeNetVMStore=Ext.create('Ext.data.JsonStore',{
	fields: ['timestamp','rxSpeed','txSpeed'],//,'device'
	data : generateVMNetData()//realTimeNetVMData
});

setInterval(function() {
	if(vmRealTimePanel.isVisible() && vmRealTimewindow.isVisible()){		
		realTimeVMStore.load();	
		realTimeCPUVMData = generateVMCPUData();
		realTimeMemoryVMData = generateVMMemoryData();	
		realTimeDiskVMData = generateVMDiskData();
		realTimeNetVMData = generateVMNetData();		
		//CPU数据时间轴
		if(realTimeCPUVMData.length>0){				
			var cPUTimeAxis = realTimeChartVMCpu.axes.get(1);			
			toDate = cPUTimeAxis.toDate,			
            lastDate = realTimeCPUVMData[realTimeCPUVMData.length - 1].timestamp,
            markerIndex = realTimeChartVMCpu.markerIndex || 0;			
	        if (+toDate < +lastDate) {
	            markerIndex = 1;
	            cPUTimeAxis.toDate = lastDate;
	            cPUTimeAxis.fromDate = Ext.Date.add(Ext.Date.clone(cPUTimeAxis.fromDate), Ext.Date.SECOND, 1);
	            realTimeChartVMCpu.markerIndex = markerIndex;
	        }	        
		}
		realTimeCPUVMStore.loadData(realTimeCPUVMData);
		//Memory数据时间轴
		if(realTimeMemoryVMData.length>0){
			//alert(realTimeMemoryVMData[0].timestamp);			
			var ramTimeAxis = realTimeChartVMMemory.axes.get(1);
			toDate = ramTimeAxis.toDate,			
            lastDate = realTimeMemoryVMData[realTimeMemoryVMData.length - 1].timestamp,
            markerIndex = realTimeChartVMMemory.markerIndex || 0;			
	        if (+toDate < +lastDate) {
	            markerIndex = 1;
	            ramTimeAxis.toDate = lastDate;
	            ramTimeAxis.fromDate = Ext.Date.add(Ext.Date.clone(ramTimeAxis.fromDate), Ext.Date.SECOND, 1);
	            realTimeChartVMMemory.markerIndex = markerIndex;
	        }
	        realTimeMemoryVMStore.loadData(realTimeMemoryVMData);
		}
		//Disk数据时间轴
		if(realTimeDiskVMData.length>0){
			realTimeDiskChartMaximum = realTimeDiskChartMaximum;
			var diskNumericAxis = realTimeChartVMDisk.axes.get(0);
			diskNumericAxis.maximum=realTimeDiskChartMaximum;		
			var diskTimeAxis = realTimeChartVMDisk.axes.get(1);
			toDate = diskTimeAxis.toDate,			
            lastDate = realTimeDiskVMData[realTimeDiskVMData.length - 1].timestamp,
            markerIndex = realTimeChartVMDisk.markerIndex || 0;			
	        if (+toDate < +lastDate) {
	            markerIndex = 1;
	            diskTimeAxis.toDate = lastDate;
	            diskTimeAxis.fromDate = Ext.Date.add(Ext.Date.clone(diskTimeAxis.fromDate), Ext.Date.SECOND, 1);
	            realTimeChartVMDisk.markerIndex = markerIndex;
	        }
	        realTimeDiskVMStore.loadData(realTimeDiskVMData);
		}
		//Net数据时间轴
		if(realTimeNetVMData.length>0){
			realTimeNetChartMaximum = realTimeNetChartMaximum;
			var netNumericAxis = realTimeChartVMNetwork.axes.get(0);
			netNumericAxis.maximum=realTimeNetChartMaximum;		
			var netTimeAxis = realTimeChartVMNetwork.axes.get(1);
			toDate = netTimeAxis.toDate,			
            lastDate = realTimeNetVMData[realTimeNetVMData.length - 1].timestamp,
            markerIndex = realTimeChartVMNetwork.markerIndex || 0;			
	        if (+toDate < +lastDate) {
	            markerIndex = 1;
	            netTimeAxis.toDate = lastDate;
	            netTimeAxis.fromDate = Ext.Date.add(Ext.Date.clone(netTimeAxis.fromDate), Ext.Date.SECOND, 1);
	            realTimeChartVMNetwork.markerIndex = markerIndex;
	        }
	        realTimeNetVMStore.loadData(realTimeNetVMData);
		}
	}else{
//		VMCPUdata = [];
//		VMMemorydata = [];
//		VMDiskdata = [];
//		VMNetdata = [];
		realTimeCPUVMData = [];
		realTimeMemoryVMData =[];
		realTimeDiskVMData = [];
		realTimeNetVMData = [];		
		realTimeCPUVMStore.removeAll();
		realTimeMemoryVMStore.removeAll();
		realTimeDiskVMStore.removeAll();
		realTimeNetVMStore.removeAll();		
	}
},timestep*1000 );//timestep* 1000

var realTimeChartVMCpu = Ext.create('Ext.chart.Chart',{
	//id:'realTimeChartVMCpu',
	animate: true,
	shadow: true,
	store: realTimeCPUVMStore,
	background:{		
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
	axes: [{
		type: 'Numeric',
		minimum: 0,
		maximum: 100,
		position: 'left',
		fields: 'cpuRate',
		title : 'CPU(%)',
		grid: true
	},{
		type: 'Time',
		position: 'bottom',
		fields: 'timestamp',
		dateFormat: 'i:s',
		groupBy: 'year,month,day,hour,minute,second',
		aggregateOp : 'sum',
		constrain : true,
		step : [Ext.Date.SECOND,timestep],//timestep
		fromDate : Ext.Date.add(new Date(nowTime),Ext.Date.SECOND,timestep),
		toDate : Ext.Date.add(new Date(nowTime),Ext.Date.SECOND,12*timestep),//timestep
		title : 'Time'		   
	}],
	series: [{
		type: 'line',
		axis : [ 'left'],
		smooth : true,
		//gutter: 80,
		xField: 'timestamp',
		yField: 'cpuRate',
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

var realTimeChartVMMemory = Ext.create('Ext.chart.Chart',{
	//id:'realTimeChartVMMemory',
	animate: true,
	shadow: true,
	store: realTimeMemoryVMStore,
	background:{		
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
	axes: [{
		type: 'Numeric',
		position: 'left',
		minimum: 0,
		maximum: 100,
		fields: 'ramRate',
		title : 'Memory(%)',
		grid: true
	},{
		type: 'Time',
		position: 'bottom',
		fields: 'timestamp',
		dateFormat: 'i:s',
		groupBy: 'year,month,day,hour,minute,second',
		aggregateOp : 'sum',
		constrain : true,
		step : [Ext.Date.SECOND,timestep],//timestep
		fromDate : Ext.Date.add(new Date(nowTime),Ext.Date.SECOND,1),
		toDate : Ext.Date.add(new Date(nowTime),Ext.Date.SECOND,12*timestep),//timestep
		title : 'Time'
	}],
	series: [{
		type: 'line',
		axis : [ 'left', 'bottom' ],
		smooth : true,
		//gutter: 80,
		xField: 'timestamp',
		yField: 'ramRate',
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
var realTimeChartVMDisk = Ext.create('Ext.chart.Chart',{
	//id:'realTimeChartVMDisk',
	animate: true,
	shadow: true,
	store: realTimeDiskVMStore,
	background:{		
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
	axes: [{
		type: 'Numeric',
		position: 'left',
		minimum: 0,
		maximum: realTimeDiskChartMaximum,
		fields: ['readSpeed','writeSpeed'],
		//fields: [i18n._('readSpeed'),'writeSpeed'],
		title : 'Disk(Mb/s)',
		grid: true
	},{
		type: 'Time',
		position: 'bottom',
		fields: ['timestamp'],
		dateFormat: 'i:s',
		groupBy: 'year,month,day,hour,minute,second',
		aggregateOp : 'sum',
		constrain : true,
		step : [Ext.Date.SECOND,timestep],//timestep
		fromDate : Ext.Date.add(new Date(nowTime),Ext.Date.SECOND,1),
		toDate : Ext.Date.add(new Date(nowTime),Ext.Date.SECOND,12*timestep),//timestep
		title : 'Time'
	}],
	series: [{
		type: 'line',
		axis : [ 'left', 'bottom'],
		smooth : true,
		xField: 'timestamp',
		yField: ['readSpeed'],
		tips: {
            trackMouse: true,
            width: 200,
            renderer: function (storeItem, item) {
                this.setTitle(Ext.Date.format(new Date(storeItem.get('timestamp')),'m/d/Y H:i:s') + '(' + Ext.util.Format.round(storeItem.get('readSpeed'),2)+'Mb/s)');
            }
		 },
		 showMarkers :false
	},{
		type: 'line',
		axis : [ 'left', 'bottom'],
		smooth : true,
		xField: 'timestamp',
		yField: ['writeSpeed'],
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
	
var realTimeChartVMNetwork = Ext.create('Ext.chart.Chart',{
	//id:'realTimeChartVMNetwork',
	animate: true,
	shadow: true,
	store: realTimeNetVMStore,
	background:{		
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
	axes: [{
		type: 'Numeric',
		minimum: 0,
		maximum: realTimeNetChartMaximum,
		position: 'left',
		fields: ['rxSpeed','txSpeed'],
		title : 'NetWork(Mbps)',
		grid: true
	},{
		type: 'Time',
		position: 'bottom',
		fields: ['timestamp'],
		dateFormat: 'i:s',
		groupBy: 'year,month,day,hour,minute,second',
		aggregateOp : 'sum',
		constrain : true,
		step : [Ext.Date.SECOND,timestep],//timestep
		fromDate : Ext.Date.add(new Date(nowTime),Ext.Date.SECOND,1),
		toDate : Ext.Date.add(new Date(nowTime),Ext.Date.SECOND,12*timestep),//timestep
		title : 'Time'
	}],
	series: [{
		type: 'line',
		axis : [ 'left', 'bottom' ],
		smooth : true,
		xField: 'timestamp',
		yField: 'rxSpeed',
		tips: {
            trackMouse: true,
            width: 200,
            renderer: function (storeItem, item) {
                this.setTitle(Ext.Date.format(new Date(storeItem.get('timestamp')),'m/d/Y H:i:s') + '(' + Ext.util.Format.round(storeItem.get('rxSpeed'),2)+'Mbp/s)');
            }
		 },
		 showMarkers :false
	},{
		type: 'line',
		axis : [ 'left', 'bottom' ],
		smooth : true,
		xField: 'timestamp',
		yField: 'txSpeed',
		tips: {
            trackMouse: true,
            width: 200,
            renderer: function (storeItem, item) {
                this.setTitle(Ext.Date.format(new Date(storeItem.get('timestamp')),'m/d/Y H:i:s') + '(' + Ext.util.Format.round(storeItem.get('txSpeed'),2)+'Mbp/s)');
            }
		 },
		 showMarkers :false
	}
	]
});
var cpuButton=new Ext.create('Ext.button.Button',{
	text :i18n._('CPUMonitor'),//'CPU监控'
	handler: function(){			
		vmRealTimePanel.remove(realTimeChartVMMemory,false);
		vmRealTimePanel.remove(realTimeChartVMDisk,false);
		vmRealTimePanel.remove(realTimeChartVMNetwork,false);
		vmRealTimePanel.add(realTimeChartVMCpu);
	}
});
var memoryButton=new Ext.create('Ext.button.Button',{
	text :i18n._('MemoryMonitor'),//'内存监控',
	disabled:true,
	handler: function(){			
		vmRealTimePanel.remove(realTimeChartVMCpu,false);
		vmRealTimePanel.remove(realTimeChartVMDisk,false);
		vmRealTimePanel.remove(realTimeChartVMNetwork,false);
		vmRealTimePanel.add(realTimeChartVMMemory);
	}
});
var diskButton=new Ext.create('Ext.button.Button',{
	text :i18n._('DiskMonitor'),//'磁盘监控',	
	handler: function(){			
		vmRealTimePanel.remove(realTimeChartVMCpu,false);
		vmRealTimePanel.remove(realTimeChartVMMemory,false);
		vmRealTimePanel.remove(realTimeChartVMNetwork,false);
		vmRealTimePanel.add(realTimeChartVMDisk);
	}
});
var bandWidthButton=new Ext.create('Ext.button.Button',{
	text :i18n._('NetworkMonitor'),//'网络监控',	
	handler: function(){			
		vmRealTimePanel.remove(realTimeChartVMCpu,false);
		vmRealTimePanel.remove(realTimeChartVMMemory,false);
		vmRealTimePanel.remove(realTimeChartVMDisk,false);
		vmRealTimePanel.add(realTimeChartVMNetwork);
	}
});
var vmRealTimePanel = new Ext.create('Ext.panel.Panel',{	
	//renderTo : Ext.getBody(),	
    resizable:false,    
	constrain : true,  
    plain: true,
    layout : 'fit',    
    dockedItems: [
    {
    	xtype: 'toolbar',		
        items:[		
		{
			xtype : 'tbfill'
		},		
		cpuButton,memoryButton,diskButton,bandWidthButton
		]
	}],
	items : [realTimeChartVMCpu]//,realTimeChartVMMemory,realTimeChartVMDisk,realTimeChartVMNetwork]
});
function clearData(){
	VMCPUdata = [];
	VMMemorydata = [];
	VMDiskdata = [];
	VMNetdata = [];
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