/*---nodeErrorView---*/
params = getCookie("lang");
i18n.set({
	lang : params,
	path : '../../resources'
});
Ext.Loader.setConfig({
	enabled : true
});
var nodeStackData = [];
var nodeStackStore = Ext.create('Ext.data.Store', {
	fields : [ 'hostId', 'hostName', 'nodeAliases','ipOuter','zoneName', 'zoneCode' ],
	data : nodeStackData
});
var errorNodeGrid = Ext.create('Ext.grid.Panel',{
	layout : 'fit',
	store : nodeStackStore,
	columns : [ Ext.create('Ext.grid.PageRowNumberer',{flex : 0.1}), 
	            {
					header : i18n._('node'),// 节点名称变节点别名 修改 张建伟 修改日期 20131021
					dataIndex : 'nodeAliases',
					flex : 0.22,
					sortable: true,
					renderer :function(data, metadata, record, rowIndex, columnIndex, store){
						var string=new String(data);
						metadata.tdAttr = 'data-qtip="' + string + '"';
					    return data;							
					}
				},
				{
					header : i18n._('IP'),
					dataIndex : 'ipOuter',
					flex : 0.22,
					sortable: false
				},
				{
					header : i18n._('zoneCode'),
					dataIndex : 'zoneCode',
					flex : 0.22,
					sortable: false
				}
	            ]
});
var errorNodeWin=Ext.create('Ext.window.Window',{
	title: i18n._('errorInfo'),
    height: 230,
    width: 400,
    layout: 'fit',
    constrain:true,
    closable:false,
    tools:[{
		  type:'close',
		  handler:function(){
			  errorNodeWin.hide();
		  }
		}],
    items: [errorNodeGrid]
});
function showErrorNode(nodeStackData){
	nodeStackStore.removeAll();
	nodeStackStore.loadData(nodeStackData);
	errorNodeWin.show();
};