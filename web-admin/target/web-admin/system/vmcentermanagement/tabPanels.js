//***tabPanels
//var params = getCookie("lang");
//i18n.set({
//  lang: params, 
//  path: '../../resources'
//});
Ext.Loader.setConfig({enabled: true});
var tabGlobal=Ext.create('Ext.tab.Panel', {
    width: '100%',
    height: '100%',             	    
    activeTab: 0,
    items: [
        {
        	id:'globaltab0',            	        	
            title: i18n._('Outline'),
            layout: 'fit',
            items : [globalForm]           	            
        },
        {
        	id:'globaltab1',
            title: i18n._('nodelist'),
            layout: 'fit',
            items : [nodeGrid]            	            
        },
        {
        	id:'globaltab2',
            title: i18n._('vmlist'),
            layout: 'fit',
            items : [instanceGrid]
        }
    ],
    listeners:{
    	tabchange: function(tabGlobal,newCard,oldCard,eOpts){
    		if(tabGlobal.getActiveTab().getId()=='globaltab0'){
    			globalForm.setVisible(true);
    			nodeGrid.setVisible(false);
    			instanceGrid.setVisible(false);    			
				globalViewStore.load();	
				//globalForm.updateLayout();
    		}
    		if(tabGlobal.getActiveTab().getId()=='globaltab1'){            	    			
    			globalForm.setVisible(false);
    			nodeGrid.setVisible(true);
    			instanceGrid.setVisible(false);            	    			
				nodeStore.load();								          	    			
    		} 
    		if(tabGlobal.getActiveTab().getId()=='globaltab2'){
    			globalForm.setVisible(false);
    			nodeGrid.setVisible(false);
    			instanceGrid.setVisible(true);							
    			instanceStore.load();            	    			
    		} 
    	},
    	afterrender:function(tabNode,eOpts){            	    		
    		globalViewStore.load();
    	}
     }
}); 
