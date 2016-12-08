//***zoneTabPanels
var params = getCookie("lang");
i18n.set({
  lang: params, 
  path: '../../resources'
});
Ext.Loader.setConfig({enabled: true});
var tabZone=Ext.create('Ext.tab.Panel', {
    width: '100%',
    height: '100%',
    activeTab: 'zonetab0',
    items: [   
	{
		id:'zonetab0',
	    title: i18n._('Outline'),
	    layout: 'fit',
	    items : [zonePanel]
	},{
		id:'zonetab1',
	    title: i18n._('nodelist'),
	    layout: 'fit',
	    items : [nodeGrid]
	},
       {
		id:'zonetab2',
           title: i18n._('vmlist'),
           layout: 'fit',
           items : [instanceGrid]
       }],
    listeners:{
    	tabchange: function(tabZone,newCard,oldCard,eOpts){
    		if(tabZone.getActiveTab().getId()=='zonetab0'){
    			zonePanel.setVisible(true);
    			nodeGrid.setVisible(false);
    			instanceGrid.setVisible(false);            	    			
    			zoneViewStore.load();								           	    			
    		}
    		if(tabZone.getActiveTab().getId()=='zonetab1'){
    			zonePanel.setVisible(false);
    			nodeGrid.setVisible(true);            	    			
    			instanceGrid.setVisible(false);            	    			
				nodeStore.load();								           	    			
    		}
    		if(tabZone.getActiveTab().getId()=='zonetab2'){ 
    			zonePanel.setVisible(false);
    			nodeGrid.setVisible(false);
    			instanceGrid.setVisible(true);            	    			
				instanceStore.load();								            	    			
    		}            	    		
    	},
    	afterrender:function(tabZone,eOpts){ 
    		zoneViewStore.load();
    	}
     }
});