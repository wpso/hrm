<%@ page language="java" pageEncoding="UTF-8"%>

<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String subnetId = request.getParameter("subnetId");
if(subnetId==null){
	subnetId = "0" ;
}
String subnetName = request.getParameter("subnetName");

subnetName=new String(subnetName.getBytes("iso8859-1"),"utf-8");

String subnetCidr = request.getParameter("subnetCidr");

String regionCode = request.getParameter("regionCode");
%>

<html>
<head>
<title>hc_admin_ipManagement</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel='stylesheet' type='text/css'
    href='../../../extjs-4.1.0/resources/css/ext-all-gray.css' />
<script type='text/javascript'>
var basePath = '<%=basePath%>' ;
var subnetId = '<%=subnetId%>' ;
var subnetName = '<%=subnetName%>' ;
var subnetCidr = '<%=subnetCidr%>' ;
var regionCode = '<%=regionCode%>' ;
</script>
<script type='text/javascript' src='../../../extjs-4.1.0/ext-all.js'></script>
<script type="text/javascript" src="../../../js/head.js"></script>
<!--  <script src="../resources/myproject-lang.js"></script>-->
<!--  <script src="../ext-4.0.7-gpl/ext-all-debug.js"></script>-->
<script type="text/javascript" src="../../../js/ux/data/PagingMemoryProxy.js"></script>
<script type="text/javascript" src="../../../js/ux/form/SearchField.js"></script>
<script src="../../../js/jquery-1.7.2.min.js" type="text/javascript"></script>
<script type="text/javascript" charset="utf-8" src="../../../js/i18n.js"></script>
<script type="text/javascript" charset="utf-8" src="../resource/ipList.js"></script>
<script type="text/javascript" charset="utf-8" src="../resource/common.js"></script>
<!-- <style type="text/css">
.toolbarCSS .x-box-inner{  
    background-color:#4c4c4c !important; background-image:url() !important;
}

   
</style> -->


<script>
function showResult(btn){
    Ext.example.msg('Button Click', 'You clicked the {0} button', btn);
};

function showResultText(bt1, text){
    Ext.example.msg('Button Click', 'You clicked the {0} button and entered the text "{1}".', btn, text);
};

function showResultText(bt1){
    Ext.example.msg('Button Click', 'You clicked the {0} button', btn);
};
Ext.Loader.setConfig({enabled: true});
Ext.require([       
    'Ext.data.*',
    'Ext.form.*',
    'Ext.panel.Panel',
    'Ext.view.View',
    'Ext.layout.container.Fit',
    'Ext.toolbar.Paging',
    'Ext.selection.CheckboxModel',
    'Ext.tip.QuickTipManager',
    'Ext.ux.data.PagingMemoryProxy',
    'Ext.ux.form.SearchField'
]);
Ext.onReady(function() {
    var dId=0;
    var params;
    var formTitle='';
    Ext.QuickTips.init();
    MultiLang = (function() {
        return {
            init: function() {
                // load ExtJS locale
                params = getCookie("lang");
                i18n.set({
                  lang: params, 
                  path: '../../../resources'
                });
                if (params) {
                    var url = Ext.util.Format.format('../../../extjs-4.1.0/locale/ext-lang-{0}.js', params);
                    Ext.Ajax.request({
                        url: url,
                        success: this.onLoadExtLocaleSuccess,
                        failure: this.onLoadExtLocaleFailure,
                        scope: this
                    });
                } else {
                    // no language found, locale of ExtJS will be english as default
                    //this.loadmyprojectLocale();
                    this.setup();
                }
            },
            onLoadExtLocaleSuccess: function(response) {
                try {
                    eval(response.responseText);
                } catch (e) {
                    //Ext.Msg.alert('Failure', e.toString());
                }
                //this.loadmyprojectLocale();
                this.setup();
            },
            onLoadExtLocaleFailure: function() {
                //Ext.Msg.alert('Failure', 'Failed to load locale file.');
                this.setup();
                //this.loadmyprojectLocale();
            },
            setup: function() { 
                Ext.create('Ext.Viewport',{
                    layout:'border',
                    width:'100%',
                    items:[
                        {
                            region:'west',
                            xtype:'panel',
                            id:'panel_one',
                            title:i18n._('CMDB')+'  >  '+i18n._('IPManagement')+'  >  '+ subnetName +'(' + subnetCidr+')',
                            width:'50%',
                            split:true,
                            minSize:80,
                            collapsible:true,
                            layout:'fit',
                            /* tools:[{
                                type:'pin',
                                handler:function(){
                                     window.parent.document.getElementsByTagName('iframe')[0].src='./cmdbmanagement/resource/hc_admin_ipManagement.html';
                                }
                            },{
                                type:'refresh',
                                handler:function(){
                                    window.parent.document.getElementsByTagName('iframe')[0].src='./cmdbmanagement/resource/hc_admin_ipManagement.html';
                                }   
                            },{
                                type:'left',
                                handler:function(){
                                    history.go(-1);
                                }
                            }], */
                            items:[
                                {
                                    xtype:'panel',
                                    layout:'fit',
                                    //border:false,
                                    items:IPRangeGrid
                                }
                            ]
                        },
                        {
                            region:'center',
                            xtype:'panel',
                            id:'panel_east',
                            title:i18n._('IPDetails'),
                            width:'50%',
                            split:true,
                            minSize:80,
                         //   collapsible:true,
                            layout:'fit',
                            items:[
                                {
                                    xtype:'panel',
                                    layout:'fit',
                                    //border:false,
                                    items:IPDetailGrid
                                }
                            ]
                        }
                    ]//panel
                }); 
                IPRangeStore.load();
            }
        };
    })();

    MultiLang.init();
});

function getCookie(name){
         var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
         if(arr != null) return unescape(arr[2]);
         return null;
}
</script>
</head>
<body>
</body>
</html>